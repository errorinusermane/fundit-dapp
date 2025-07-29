import express from "express";
import {
  confirmContract,
  getContractsByUser,
  getContractsByCompany,
  getContractDetail,
  toggleAutoPayment,
  getNextPaymentDue,
} from "../services/contract.service";

const router = express.Router();

// ✅ POST /contracts/confirm
router.post("/confirm", async (req, res) => {
  try {
    const { bidId } = req.body;
    const txHash = await confirmContract(bidId);
    res.status(200).json({ txHash });
  } catch (err: any) {
    console.error("❌ confirmContract error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /contracts/user/:address
router.get("/user/:address", async (req, res) => {
  try {
    const contracts = await getContractsByUser(req.params.address);
    res.status(200).json(contracts);
  } catch (err: any) {
    console.error("❌ getContractsByUser error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /contracts/company/:address
router.get("/company/:address", async (req, res) => {
  try {
    const contracts = await getContractsByCompany(req.params.address);
    res.status(200).json(contracts);
  } catch (err: any) {
    console.error("❌ getContractsByCompany error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /contracts/:contractId
router.get("/:contractId", async (req, res) => {
  try {
    const contract = await getContractDetail(Number(req.params.contractId));
    res.status(200).json(contract);
  } catch (err: any) {
    console.error("❌ getContractDetail error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST /contracts/toggle
router.post("/toggle", async (req, res) => {
  try {
    const { contractId } = req.body;
    const txHash = await toggleAutoPayment(contractId);
    res.status(200).json({ txHash });
  } catch (err: any) {
    console.error("❌ toggleAutoPayment error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /contracts/next-payment/:contractId
router.get("/next-payment/:contractId", async (req, res) => {
  try {
    const nextDue = await getNextPaymentDue(Number(req.params.contractId));
    res.status(200).json({ nextPaymentDue: nextDue });
  } catch (err: any) {
    console.error("❌ getNextPaymentDue error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
