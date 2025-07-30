// types/express/index.d.ts
import { TokenPayload } from "../../utils/jwt"; // 경로는 맞게 조정 (backend/utils/jwt)

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {}; // 이건 그대로 유지
