import { randomBytes } from "crypto";
import { generateToken, UserRole, verifyToken } from "../utils/jwt";
import { sendMagicLink } from "../utils/mailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export type MagicTokenResult =
  | {
      walletConnected: false;
      email: string;
      role: UserRole;
    }
  | {
      walletConnected: true;
      email: string;
      role: UserRole;
      wallet: string;
      token: string;
    };

/**
 * Magic link 요청 (JWT 생성 후 이메일 발송)
 */
export async function requestMagicLink(email: string, role: UserRole) {
  const token = generateToken({ email, role, wallet: "" });
  const magicLink = `${FRONTEND_URL}/magic-login?token=${token}`;
  await sendMagicLink(email, magicLink);
  return token;
}

/**
 * Magic link 토큰 검증 → DB 조회 및 지갑 연결 여부 판단
 * (지갑 없으면 자동 생성)
 */
export async function verifyMagicToken(token: string): Promise<MagicTokenResult> {
  const payload = verifyToken(token); // { email, role, wallet }

  let user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    // 최초 로그인 → 생성 후 자동 지갑 주소 생성
    const randomWallet = "0x" + randomBytes(20).toString("hex");

    user = await prisma.user.create({
      data: {
        email: payload.email,
        role: payload.role,
        wallet: randomWallet,
      },
    });
  }

  if (!user.wallet) {
    // 기존 유저지만 지갑 없음 → 자동 지갑 생성 후 업데이트
    const randomWallet = "0x" + randomBytes(20).toString("hex");

    user = await prisma.user.update({
      where: { email: user.email },
      data: { wallet: randomWallet },
    });
  }

  // ✅ wallet 연결된 경우 → JWT 발급
  const newToken = generateToken({
    email: user.email,
    role: user.role as UserRole,
    wallet: user.wallet ?? "",
  });

  return {
    walletConnected: true,
    email: user.email,
    role: user.role as UserRole,
    wallet: user.wallet ?? "",
    token: newToken,
  };
}

/**
 * 지갑 연결 → DB 업데이트 + 토큰 재발급
 */
export async function connectWallet(email: string, wallet: string) {
  const user = await prisma.user.update({
    where: { email },
    data: { wallet },
  });

  const newToken = generateToken({
    email: user.email,
    role: user.role as UserRole,
    wallet: user.wallet ?? "",
  });

  return {
    token: newToken,
    user: {
      email: user.email,
      role: user.role as UserRole,
      wallet: user.wallet ?? "",
    },
  };
}
