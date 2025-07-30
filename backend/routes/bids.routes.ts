import express from "express";
import {
  submitBid,
  getBidsByProposal,
  getBidsByCompany,
  voteBid,
  confirmContractIfPopular,
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
 * GET /bids/company/:address
 * 특정 회사(address)의 모든 입찰 조회
 */
router.get("/company/:address", async (req, res) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ error: "Company address is required." });
    }

    const bids = await getBidsByCompany(address);
    res.status(200).json(bids);
  } catch (err: any) {
    console.error("❌ Error in GET /bids/company/:address:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/**
 * POST /bids/vote
 * 개인이 특정 입찰안에 투표
 * body: { bidId }
 */
router.post("/vote", async (req, res) => {
  try {
    const { bidId } = req.body;
    if (!bidId) {
      return res.status(400).json({ error: "bidId is required." });
    }

    const txHash = await voteBid(BigInt(bidId));
    res.status(200).json({ txHash });
  } catch (err: any) {
    console.error("❌ Error in POST /bids/vote:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/**
 * POST /bids/confirm
 * 특정 입찰안이 투표 수 기준을 충족하면 계약 생성
 * body: { bidId, duration }
 */
router.post("/confirm", async (req, res) => {
  try {
    const { bidId, duration } = req.body;

    if (!bidId || !duration) {
      return res.status(400).json({ error: "bidId and duration are required." });
    }

    const txHash = await confirmContractIfPopular(BigInt(bidId), BigInt(duration));
    res.status(200).json({ txHash });
  } catch (err: any) {
    console.error("❌ Error in POST /bids/confirm:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
