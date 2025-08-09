import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // .env에서 JWT_SECRET 로드

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "15m"; // 토큰 유효기간 (magic link 포함)

// 역할 타입
export type UserRole = "user" | "company";

// JWT 페이로드 타입
export interface TokenPayload {
  email: string;
  role: UserRole;
  wallet: string; // "" 상태면 아직 연결 안 됨
}

/**
 * ✅ JWT 생성 (지갑 연결 전/후 동일하게 사용)
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * ✅ JWT 검증 (payload 반환)
 */
export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    console.error("❌ Invalid JWT:", err);
    throw new Error("Invalid or expired token.");
  }
}
