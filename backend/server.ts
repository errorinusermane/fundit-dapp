import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import proposalsRouter from "./routes/proposals.routes";
import "./utils/client"; // 클라이언트 초기화 (지갑 연결 등)

// ✅ Express 서버 구성
const app = express();
app.use(cors());
app.use(express.json());

app.use("/proposals", proposalsRouter);

app.listen(3001, "0.0.0.0", () => {
  console.log("✅ Backend running on http://0.0.0.0:3001");
});
