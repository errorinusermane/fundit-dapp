import express from "express";
import {
  confirmContract,
  getContractsByUser,
  getContractsByCompany,
  getContractDetail,
  toggleAutoPayment,
} from "../services/contract.service";

const router = express.Router();

/**
 * POST /contracts/confirm
 * 계약 확정 (Bid 선택 → 계약 생성)
 */
router.post("/confirm", async (req, res) => {
  try {
    const {
      proposalId,
      bidId,
      user,
      company,
      monthlyPremium,
      contractPeriod,
    } = req.body;

    const tx = await confirmContract({
      proposalId,
      bidId,
      user,
      company,
      monthlyPremium: BigInt(monthlyPremium),
      contractPeriod,
    });

    res.status(200).json({ txHash: tx });
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
