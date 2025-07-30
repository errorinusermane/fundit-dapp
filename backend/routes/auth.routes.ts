import express from "express";
import {
  requestMagicLink,
  verifyMagicToken,
  connectWallet,
} from "../services/auth.service";
import { generateToken, UserRole } from "../utils/jwt"; // 🔁 UserRole import

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
 * GET /auth/verify?token=...
 * magic link를 통한 토큰 검증 → user 정보 + 최종 JWT 발급
 */
router.get("/verify", async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Token이 필요합니다." });
  }

  try {
    const payload = await verifyMagicToken(token); // { email, role, wallet }

    const finalToken = generateToken(payload); // 지갑 연결 여부 포함한 JWT 발급

    res.status(200).json({
      message: "✅ 인증 성공",
      token: finalToken,
      user: payload,
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
    return res.status(400).json({ error: "email과 wallet이 필요합니다." });
  }

  try {
    const updated = await connectWallet(email, wallet);

    const newToken = generateToken({
      email: updated.email,
      role: updated.role as UserRole,
      wallet: updated.id,
    });

    res.status(200).json({
      message: "✅ Wallet 연결 완료",
      token: newToken,
      user: {
        email: updated.email,
        role: updated.role,
        wallet: updated.id,
      },
    });
  } catch (err) {
    console.error("❌ Wallet 연결 실패:", err);
    res.status(500).json({ error: "지갑 연결 중 오류가 발생했습니다." });
  }
});

export default router;
