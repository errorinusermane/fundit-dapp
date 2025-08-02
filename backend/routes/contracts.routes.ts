import express from "express";
import {
  confirmContract,
  getContractsByUser,
  getContractsByCompany,
  getContractDetail,
  toggleAutoPayment,
} from "../services/contract.service";
import { getProposalById } from "services/proposal.service";
import { getBidsByProposal } from "services/bid.service";

const router = express.Router();

/**
 * POST /contracts/confirm
 * 계약 확정 (Bid 선택 → 계약 생성)
 */
router.post("/confirm", async (req, res) => {
  try {
    const { proposalId, user } = req.body;

    // 1. 제안 정보 조회
    const proposal = await getProposalById(proposalId);
    const now = Date.now();
    if (now < new Date(proposal.desiredStartDate).getTime()) {
      return res.status(400).json({ error: "Proposal has not started yet" });
    }

    // 2. 입찰 목록: 최다 투표 선택
    const bids = await getBidsByProposal(proposalId);
    if (bids.length === 0) return res.status(404).json({ error: "No bids found" });

    const winning = bids.reduce((a, b) => (a.voteCount > b.voteCount ? a : b));
    if (winning.voteCount < winning.minVotes) {
      return res.status(400).json({ error: "Not enough votes to confirm contract" });
    }

    // 3. 계약 체결
    const tx = await confirmContract({
      proposalId,
      bidId: winning.bidId,
      user,
      company: winning.company,
      monthlyPremium: BigInt(winning.monthlyPremium),
      contractPeriod: winning.contractPeriod,
    });

    res.status(200).json({ txHash: tx, selectedBidId: winning.bidId });
  } catch (err) {
    console.error("❌ Failed to confirm contract:", err);
    res.status(500).json({ error: "Failed to confirm contract." });
  }
});

/**
 * POST /contracts/toggle
 * 자동 결제 토글
 */
router.post("/toggle", async (req, res) => {
  try {
    const { contractId } = req.body;
    const tx = await toggleAutoPayment(Number(contractId));
    res.status(200).json({ txHash: tx });
  } catch (err) {
    console.error("❌ Failed to toggle auto payment:", err);
    res.status(500).json({ error: "Failed to toggle auto payment." });
  }
});

/**
 * GET /contracts/:id
 * 계약 상세 조회
 */
router.get("/:id", async (req, res) => {
  try {
    const contractId = Number(req.params.id);
    const detail = await getContractDetail(contractId);
    res.status(200).json(detail);
  } catch (err) {
    console.error("❌ Failed to get contract detail:", err);
    res.status(500).json({ error: "Failed to get contract detail." });
  }
});

/**
 * GET /contracts/user/:address
 * 사용자의 계약 목록
 */
router.get("/user/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const list = await getContractsByUser(address);
    res.status(200).json(list);
  } catch (err) {
    console.error("❌ Failed to get user contracts:", err);
    res.status(500).json({ error: "Failed to get user contracts." });
  }
});

/**
 * GET /contracts/company/:address
 * 기업의 계약 목록
 */
router.get("/company/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const list = await getContractsByCompany(address);
    res.status(200).json(list);
  } catch (err) {
    console.error("❌ Failed to get company contracts:", err);
    res.status(500).json({ error: "Failed to get company contracts." });
  }
});

export default router;
