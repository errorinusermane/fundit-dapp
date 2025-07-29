import express from "express";
import {
  requestVerification,
  getOracleStatus,
  resolveClaim,
} from "../services/oracle.service";

const router = express.Router();

/**
 * POST /oracle/verify
 * 오라클 검증 요청 (evidenceHash는 off-chain 데이터를 참조하는 IPFS 해시 등)
 */
router.post("/verify", async (req, res) => {
  try {
    const { contractId, evidenceHash } = req.body;

    if (!contractId || !evidenceHash) {
      return res.status(400).json({ error: "contractId와 evidenceHash는 필수입니다." });
    }

    const txHash = await requestVerification({
      contractId: BigInt(contractId),
      evidenceHash,
    });

    res.status(200).json({ txHash });
  } catch (err: any) {
    console.error("❌ Error in POST /oracle/verify:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/**
 * GET /oracle/status/:contractId
 * 오라클 검증 상태 조회
 */
router.get("/status/:contractId", async (req, res) => {
  try {
    const contractId = BigInt(req.params.contractId);
    const status = await getOracleStatus(contractId);

    res.status(200).json({ status });
  } catch (err: any) {
    console.error("❌ Error in GET /oracle/status:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/**
 * POST /oracle/resolve
 * 오라클 결과 반영 (관리자만 호출)
 */
router.post("/resolve", async (req, res) => {
  try {
    const { contractId, isApproved } = req.body;

    if (typeof contractId === "undefined" || typeof isApproved === "undefined") {
      return res.status(400).json({ error: "contractId와 isApproved는 필수입니다." });
    }

    const txHash = await resolveClaim({
      contractId: BigInt(contractId),
      isApproved: Boolean(isApproved),
    });

    res.status(200).json({ txHash });
  } catch (err: any) {
    console.error("❌ Error in POST /oracle/resolve:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
