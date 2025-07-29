import express from "express";
import { createProposal, getAllProposals } from "../services/proposal.service";

const router = express.Router();

// ✅ POST /proposals
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      coverageAmount,
      premium,
      deadline,
    } = req.body;

    if (!title || !description || !coverageAmount || !premium || !deadline) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const txHash = await createProposal(
      title,
      description,
      BigInt(coverageAmount),
      BigInt(premium),
      BigInt(deadline)
    );

    res.status(200).json({ txHash });
  } catch (err: any) {
    console.error("❌ Error in POST /proposals:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// ✅ GET /proposals
router.get("/", async (_, res) => {
  try {
    const rawProposals = await getAllProposals();

    const proposals = rawProposals.map((p) => ({
      id: p.id.toString(),
      proposer: p.proposer,
      title: p.title,
      description: p.description,
      coverageAmount: p.coverageAmount.toString(),
      premium: p.premium.toString(),
      deadline: p.deadline.toString(),
    }));

    res.status(200).json({ proposals });
  } catch (err: any) {
    console.error("❌ Error in GET /proposals:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router; // ✅ 항상 제일 마지막에 export
