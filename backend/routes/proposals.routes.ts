import express from "express";
import {
  createProposal,
  getAllProposals,
  getProposalById,
  getProposalsByUser,
  getActiveProposals,
  closeProposal,
  calculateRemainingTime,
} from "../services/proposal.service";
import { Address } from "viem";

const router = express.Router();

/**
 * POST /proposals
 * 제안 생성
 */
router.post("/", async (req, res) => {
  try {
    const { walletAddress, ...input } = req.body;
    if (!walletAddress) return res.status(400).json({ error: "walletAddress required" });

    const txHash = await createProposal(input, walletAddress as Address);
    res.status(201).json({ txHash });
  } catch (err) {
    console.error("❌ createProposal failed:", err);
    res.status(500).json({ error: "Failed to create proposal" });
  }
});

/**
 * GET /proposals
 * 전체 제안 조회
 */
router.get("/", async (_req, res) => {
  try {
    const proposals = await getAllProposals();
    const withRemainingTime = proposals.map((p) => ({
      ...p,
      remainingTime: calculateRemainingTime(p.desiredStartDate),
    }));
    res.json(withRemainingTime);
  } catch (err) {
    console.error("❌ getAllProposals failed:", err);
    res.status(500).json({ error: "Failed to fetch proposals" });
  }
});

/**
 * GET /proposals/active
 * ACTIVE 상태의 제안만 조회
 */
router.get("/active", async (_req, res) => {
  try {
    const proposals = await getActiveProposals();
    const withRemainingTime = proposals.map((p) => ({
      ...p,
      remainingTime: calculateRemainingTime(p.desiredStartDate),
    }));
    res.json(withRemainingTime);
  } catch (err) {
    console.error("❌ getActiveProposals failed:", err);
    res.status(500).json({ error: "Failed to fetch active proposals" });
  }
});

/**
 * GET /proposals/:id
 * 단건 상세 조회
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const proposal = await getProposalById(id);
    const withRemainingTime = {
      ...proposal,
      remainingTime: calculateRemainingTime(proposal.desiredStartDate),
    };
    res.json(withRemainingTime);
  } catch (err) {
    console.error("❌ getProposalById failed:", err);
    res.status(500).json({ error: "Failed to fetch proposal" });
  }
});

/**
 * GET /proposals/user/:address
 * 유저가 생성한 제안 목록
 */
router.get("/user/:address", async (req, res) => {
  try {
    const address = req.params.address as Address;
    const proposals = await getProposalsByUser(address);
    const withRemainingTime = proposals.map((p) => ({
      ...p,
      remainingTime: calculateRemainingTime(p.desiredStartDate),
    }));
    res.json(withRemainingTime);
  } catch (err) {
    console.error("❌ getProposalsByUser failed:", err);
    res.status(500).json({ error: "Failed to fetch user's proposals" });
  }
});

/**
 * POST /proposals/:id/close
 * 제안 마감 (작성자만)
 */
router.post("/:id/close", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(400).json({ error: "walletAddress required" });

    const txHash = await closeProposal(id, walletAddress as Address);
    res.json({ txHash });
  } catch (err) {
    console.error("❌ closeProposal failed:", err);
    res.status(500).json({ error: "Failed to close proposal" });
  }
});

export default router;
