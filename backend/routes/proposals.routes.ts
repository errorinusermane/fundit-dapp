import express from "express";
import {
  createProposal,
  getAllProposals,
  getProposalById,
  getProposalsByUser,
  getActiveProposals,
  closeProposal,
} from "../services/proposal.service";

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

// ✅ GET /proposals/:id
router.get("/:id", async (req, res) => {
  try {
    const proposalId = BigInt(req.params.id);
    const p = await getProposalById(proposalId);

    const proposal = {
      id: p.id.toString(),
      proposer: p.proposer,
      title: p.title,
      description: p.description,
      coverageAmount: p.coverageAmount.toString(),
      premium: p.premium.toString(),
      deadline: p.deadline.toString(),
    };

    res.status(200).json({ proposal });
  } catch (err: any) {
    console.error("❌ Error in GET /proposals/:id:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// ✅ GET /proposals/user/:address
router.get("/user/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const rawProposals = await getProposalsByUser(address);

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
    console.error("❌ Error in GET /proposals/user/:address:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// ✅ GET /proposals/active
router.get("/active", async (_, res) => {
  try {
    const rawProposals = await getActiveProposals();

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
    console.error("❌ Error in GET /proposals/active:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// ✅ POST /proposals/:id/close
router.post("/:id/close", async (req, res) => {
  try {
    const proposalId = BigInt(req.params.id);
    const txHash = await closeProposal(proposalId);

    res.status(200).json({ txHash });
  } catch (err: any) {
    console.error("❌ Error in POST /proposals/:id/close:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
