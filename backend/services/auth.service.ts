import { generateToken, verifyToken } from "../utils/jwt";
import { sendMagicLink } from "../utils/mailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export async function requestMagicLink(email: string, role: "user" | "company") {
  const token = generateToken({ email, role });
  const magicLink = `${FRONTEND_URL}/magic-login?token=${token}`;
  await sendMagicLink(email, magicLink);
  return token;
}

/**
 * 토큰 검증 후 유저 DB upsert (존재하면 lastLoginAt만 갱신)
 */
export async function verifyMagicToken(token: string) {
  const payload = verifyToken(token); // { email, role }

  // 이메일 기준으로 user 등록 or 갱신 (wallet 연결 전 단계)
  const user = await prisma.user.upsert({
    where: { email: payload.email },
    update: { lastLoginAt: new Date() },
    create: {
      id: "", // 아직 wallet 연결 전이므로 비워둠
      email: payload.email,
      role: payload.role,
    },
  });

  return {
    email: user.email,
    role: user.role,
    wallet: user.id, // wallet이 아직 연결되지 않았으면 빈 문자열
  };
}

/**
 * 지갑 주소 연결 (지갑 주소 = id로 설정)
 */
export async function connectWallet(email: string, wallet: string) {
  const updated = await prisma.user.update({
    where: { email },
    data: { id: wallet },
  });
  return updated;
}
