import express from "express";
import {
  getTokenBalance,
  claimReward,
  getRewardHistory,
  getClaimedReward,
} from "../services/token.service";

const router = express.Router();

/**
 * ✅ GET /token/balance/:address
 * → 해당 주소의 FDT 잔액 조회
 */
router.get("/balance/:address", async (req, res) => {
  try {
    const address = req.params.address as `0x${string}`;
    const balance = await getTokenBalance(address);
    res.json({ address, balance: balance.toString() });
  } catch (err) {
    console.error("🔴 [GET /token/balance] Error:", err);
    res.status(500).json({ error: "Failed to fetch token balance" });
  }
});

/**
 * ✅ GET /token/reward-history/:address
 * → 해당 주소의 수령 히스토리 (DB 기준)
 */
router.get("/reward-history/:address", async (req, res) => {
  try {
    const address = req.params.address as `0x${string}`;
    const history = await getRewardHistory(address);
    const formatted = history.map((item) => ({
      timestamp: item.createdAt.toISOString(),
      amount: item.amount,
      txHash: item.txHash,
    }));
    res.json(formatted);
  } catch (err) {
    console.error("🔴 [GET /token/reward-history] Error:", err);
    res.status(500).json({ error: "Failed to fetch reward history" });
  }
});

/**
 * ✅ GET /token/claimed/:address
 * → 누적 수령량 (on-chain)
 */
router.get("/claimed/:address", async (req, res) => {
  try {
    const address = req.params.address as `0x${string}`;
    const claimed = await getClaimedReward(address);
    res.json({ address, claimed: claimed.toString() });
  } catch (err) {
    console.error("🔴 [GET /token/claimed] Error:", err);
    res.status(500).json({ error: "Failed to fetch claimed reward" });
  }
});

/**
 * ✅ POST /token/claim
 * → 사용자에게 토큰 지급 (관리자 권한 필요)
 * Body: { user: "0x...", amount: "1000000000000000000" }
 */
router.post("/claim", async (req, res) => {
  try {
    const { user, amount } = req.body;
    if (!user || !amount) {
      return res.status(400).json({ error: "Missing user or amount" });
    }

    const txHash = await claimReward({
      user,
      amount: BigInt(amount),
    });

    res.json({ success: true, txHash });
  } catch (err) {
    console.error("🔴 [POST /token/claim] Error:", err);
    res.status(500).json({ error: "Failed to claim reward" });
  }
});

export default router;
