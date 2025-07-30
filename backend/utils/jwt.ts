import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // .env에서 JWT_SECRET 불러오기

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "15m"; // 15분 유효 (magic link 인증용)

interface TokenPayload {
  email: string;
  role: "user" | "company";
  wallet: string;
}

/**
 * JWT 생성
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * JWT 검증
 */
export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    console.error("❌ Invalid JWT:", err);
    throw new Error("Invalid or expired token.");
  }
}
