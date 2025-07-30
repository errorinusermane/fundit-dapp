import * as path from "path";
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import proposalsRouter from "./routes/proposals.routes";
import bidsRouter from "./routes/bids.routes";
import contractRouter from "./routes/contracts.routes";
import tokenRouter from "./routes/token.routes"; 
import authRouter from "./routes/auth.routes"; 

import "./utils/client"; // 클라이언트 초기화 (지갑 연결 등)

// ✅ Express 서버 구성
const app = express();
app.use(cors());
app.use(express.json());

app.use("/proposals", proposalsRouter);
app.use("/bids", bidsRouter);
app.use("/contracts", contractRouter);
app.use("/token", tokenRouter);
app.use("/auth", authRouter);

app.listen(3001, "0.0.0.0", () => {
  console.log("✅ Backend running on http://0.0.0.0:3001");
});
