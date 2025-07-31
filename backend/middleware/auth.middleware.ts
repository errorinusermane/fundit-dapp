import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt";

// 사용자 인증: Authorization 헤더에서 JWT 확인
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token); // { email, role, wallet }
    // 👇 Express의 req 객체에 user 커스텀 프로퍼티 추가
    (req as any).user = payload;
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

// 인가 필터: wallet이 연결된 사용자만 통과
export function requireWallet(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as TokenPayload;

  if (!user || !user.wallet || user.wallet.trim() === "") {
    return res.status(403).json({ error: "Wallet not connected." });
  }

  next();
}
