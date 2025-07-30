import express from "express";
import {
  getTokenBalance,
  transferToken,
  claimReward,
  getRewardHistory,
  getRewardHistoryLength,
  getRewardHistoryItem,
} from "../services/token.service";
import prisma from "@utils/prisma";

const router = express.Router();

// ✅ GET /token/balance/:address
router.get("/balance/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await getTokenBalance(address);
    res.json({ balance });
  } catch (err: any) {
    console.error("❌ GET /token/balance error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// ✅ POST /token/transfer
router.post("/transfer", async (req, res) => {
  try {
    const { to, amount } = req.body;
    if (!to || !amount) {
      return res.status(400).json({ error: "Missing 'to' or 'amount'" });
    }

    const txHash = await transferToken(to, amount);
    res.json({ txHash });
  } catch (err: any) {
    console.error("❌ POST /token/transfer error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// ✅ POST /token/claim
router.post("/claim", async (req, res) => {
  try {
    const { address, amount } = req.body;
    if (!address || !amount) {
      return res.status(400).json({ error: "Missing 'address' or 'amount'" });
    }

    // ① 온체인 리워드 전송
    const txHash = await claimReward(address, amount);

    // ② DB에도 기록
    await prisma.rewardEvent.create({
      data: {
        userId: address,
        amount: BigInt(amount),
        timestamp: BigInt(Math.floor(Date.now() / 1000)),
      },
    });

    res.json({ txHash });
  } catch (err: any) {
    console.error("❌ POST /token/claim error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// ✅ GET /token/reward-history/:address
router.get("/reward-history/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const history = await getRewardHistory(address);
    res.json({ history });
  } catch (err: any) {
    console.error("❌ GET /token/reward-history error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// ✅ GET /token/reward-history-length/:address
router.get("/reward-history-length/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const length = await getRewardHistoryLength(address);
    res.json({ length });
  } catch (err: any) {
    console.error("❌ GET /token/reward-history-length error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// ✅ GET /token/reward-history-item/:address/:index
router.get("/reward-history-item/:address/:index", async (req, res) => {
  try {
    const { address, index } = req.params;
    const item = await getRewardHistoryItem(address, parseInt(index));
    res.json(item);
  } catch (err: any) {
    console.error("❌ GET /token/reward-history-item error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
