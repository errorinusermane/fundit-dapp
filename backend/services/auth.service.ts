import { randomBytes } from "crypto";
import { generateToken, UserRole, verifyToken } from "../utils/jwt";
import { sendMagicLink } from "../utils/mailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

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
 * Magic link 토큰 검증 및 임시 지갑 발급 → DB upsert
 */
export async function verifyMagicToken(token: string): Promise<{
  email: string;
  role: UserRole;
  wallet: string;
  token: string;
}> {
  const payload = verifyToken(token); // { email, role, wallet }

  // ✅ wallet 없으면 임시 발급
  let wallet = payload.wallet;
  if (!wallet) {
    wallet = `0x${randomBytes(20).toString("hex")}`;
  }

  // ✅ DB upsert (email 기준)
  await prisma.user.upsert({
    where: { email: payload.email },
    update: { id: wallet }, // 기존 유저: wallet 연결 (id 업데이트)
    create: {
      id: wallet,
      email: payload.email,
      role: payload.role,
    },
  });

  // ✅ JWT 새로 발급
  const newToken = generateToken({
    email: payload.email,
    role: payload.role,
    wallet,
  });

  return {
    email: payload.email,
    role: payload.role,
    wallet,
    token: newToken,
  };
}

/**
 * 지갑 연결 → DB 업데이트
 */
export async function connectWallet(email: string, wallet: string) {
  const user = await prisma.user.update({
    where: { email },
    data: { id: wallet },
  });

  return user;
}
