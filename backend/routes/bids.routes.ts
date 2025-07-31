import express from "express";
import {
  submitBid,
  getBidsByProposal,
  getBidsByCompany,
  voteBid,
} from "../services/bid.service";

const router = express.Router();

/**
 * POST /bids
 * 입찰 제출 (기업)
 */
router.post("/", async (req, res) => {
  try {
    const { wallet, ...bidInput } = req.body;
    const bidId = await submitBid(bidInput, wallet);
    res.status(200).json({ bidId });
  } catch (err) {
    console.error("❌ submitBid error:", err);
    res.status(500).json({ error: "Failed to submit bid" });
  }
});

/**
 * GET /bids/:proposalId
 * 특정 제안(proposal)에 달린 입찰 목록 조회
 */
router.get("/:proposalId", async (req, res) => {
  try {
    const proposalId = Number(req.params.proposalId);
    const bids = await getBidsByProposal(proposalId);
    res.status(200).json(bids);
  } catch (err) {
    console.error("❌ getBidsByProposal error:", err);
    res.status(500).json({ error: "Failed to fetch bids for proposal" });
  }
});

/**
 * GET /bids/company/:address
 * 내가 제출한 입찰 목록 조회 (기업)
 */
router.get("/company/:address", async (req, res) => {
  try {
    const address = req.params.address as `0x${string}`;
    const bids = await getBidsByCompany(address);
    res.status(200).json(bids);
  } catch (err) {
    console.error("❌ getBidsByCompany error:", err);
    res.status(500).json({ error: "Failed to fetch company bids" });
  }
});

/**
 * POST /bids/:bidId/vote
 * 특정 입찰에 투표 (개인)
 */
router.post("/:bidId/vote", async (req, res) => {
  try {
    const bidId = Number(req.params.bidId);
    const { wallet } = req.body;
    await voteBid(bidId, wallet);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ voteBid error:", err);
    res.status(500).json({ error: "Failed to vote for bid" });
  }
});

export default router;
