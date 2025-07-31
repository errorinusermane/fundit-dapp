import express from "express";
import cors from "cors";
import path from "path";
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

import proposalsRouter from "./routes/proposals.routes";
import bidsRouter from "./routes/bids.routes";
import contractRouter from "./routes/contracts.routes";
import tokenRouter from "./routes/token.routes";
import authRouter from "./routes/auth.routes";

import { authenticateJWT, requireWallet } from "./middleware/auth.middleware";
import "./utils/client";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 모든 요청에 대해 인증 + wallet 연결 확인
app.use((req, res, next) => {
  if (req.path.startsWith("/auth")) return next(); // 🔓 인증 제외 경로
  authenticateJWT(req, res, (err) => {
    if (err) return; // 인증 실패
    requireWallet(req, res, next); // wallet 연결 확인
  });
});

// ✅ 라우터 등록
app.use("/proposals", proposalsRouter);
app.use("/bids", bidsRouter);
app.use("/contracts", contractRouter);
app.use("/token", tokenRouter);
app.use("/auth", authRouter);

// ✅ 서버 시작
app.listen(3001, "0.0.0.0", () => {
  console.log("✅ Backend running on http://0.0.0.0:3001");
});
