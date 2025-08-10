import express from "express";
import {
  requestMagicLink,
  verifyMagicToken,
  connectWallet,
} from "../services/auth.service";
import { generateToken, UserRole } from "../utils/jwt";

const router = express.Router();

/**
 * POST /auth/login
 * 이메일과 역할(user | company)을 받아 magic link 발송
 */
router.post("/login", async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role || !["user", "company"].includes(role)) {
    return res
      .status(400)
      .json({ error: "email과 role(user | company)이 필요합니다." });
  }

  try {
    await requestMagicLink(email, role as UserRole);
    res.status(200).json({ message: "📧 Magic link sent to your email." });
  } catch (err) {
    console.error("❌ Error sending magic link:", err);
    res.status(500).json({ error: "Failed to send magic link." });
  }
});

/**
 * POST /auth/verify
 * Body에 토큰을 담아 인증 (유저 생성 + 최종 JWT 발급)
 */
router.post("/verify", async (req, res) => {
  const { token } = req.body;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Token이 필요합니다." });
  }

  try {
    const result = await verifyMagicToken(token);

    if (!result.walletConnected) {
      return res.status(200).json({
        message: "✅ 인증 성공 (지갑 미연결)",
        user: {
          email: result.email,
          role: result.role,
          wallet: "", // 미연결 시 빈 문자열로 처리
        },
      });
    }

    res.status(200).json({
      message: "✅ 인증 성공",
      token: result.token,
      user: {
        email: result.email,
        role: result.role,
        wallet: result.wallet,
      },
    });
  } catch (err) {
    console.error("❌ Token verification failed (POST):", err);
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

/**
 * GET /auth/verify?token=...
 * magic link를 통한 토큰 검증 → 지갑 연결 여부 판단 후 토큰 발급
 */
router.get("/verify", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = typeof authHeader === "string" 
    ? authHeader.replace(/^Bearer\s/, "") 
    : null;
  
  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Token이 필요합니다." });
  }

  try {
    const result = await verifyMagicToken(token);

    if (!result.walletConnected) {
      return res.status(200).json({
        walletConnected: false,
        email: result.email,
        role: result.role,
        message: "지갑이 연결되지 않았습니다.",
      });
    }

    return res.status(200).json({
      walletConnected: true,
      token: result.token,
      user: {
        email: result.email,
        role: result.role,
        wallet: result.wallet,
      },
      message: "✅ 인증 성공",
    });
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

/**
 * PATCH /auth/wallet
 * 지갑 주소 연결 → 연결된 wallet 주소 기반 JWT 재발급
 */
router.patch("/wallet", async (req, res) => {
  const { email, wallet } = req.body;

  if (!email || !wallet) {
    return res.status(400).json({ error: "email, wallet이 모두 필요합니다." });
  }

  try {
    const result = await connectWallet(email, wallet);

    res.status(200).json({
      message: "✅ Wallet 연결 완료",
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    console.error("❌ Wallet 연결 실패:", err);
    res.status(500).json({ error: "지갑 연결 중 오류가 발생했습니다." });
  }
});

export default router;
