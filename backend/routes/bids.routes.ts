import express from "express";
import {
  submitBid,
  getBidsByProposal,
  selectBid,
} from "../services/bid.service";

const router = express.Router();

/**
 * POST /bids
 * 기업이 입찰 제출 (Solidity 연동)
 * body: { proposalId, coverageOffer, premiumOffer }
 */
router.post("/", async (req, res) => {
  try {
    const { proposalId, coverageOffer, premiumOffer } = req.body;

    if (!proposalId || !coverageOffer || !premiumOffer) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const txHash = await submitBid(
      BigInt(proposalId),
      BigInt(coverageOffer),
      BigInt(premiumOffer)
    );

    res.status(200).json({ txHash });
  } catch (err: any) {
    console.error("❌ Error in POST /bids:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/**
 * GET /bids/:proposalId
 * 특정 제안(proposalId)에 대한 모든 입찰 조회
 */
router.get("/:proposalId", async (req, res) => {
  try {
    const { proposalId } = req.params;

    const bids = await getBidsByProposal(BigInt(proposalId));

    res.status(200).json(bids);
  } catch (err: any) {
    console.error("❌ Error in GET /bids/:proposalId:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/**
 * POST /bids/select
 * 제안자가 특정 입찰 선택 (Solidity 연동)
 * body: { bidId }
 */
router.post("/select", async (req, res) => {
  try {
    const { bidId } = req.body;

    if (!bidId) {
      return res.status(400).json({ error: "bidId is required." });
    }

    const txHash = await selectBid(BigInt(bidId));

    res.status(200).json({ txHash });
  } catch (err: any) {
    console.error("❌ Error in POST /bids/select:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
