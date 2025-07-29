import { publicClient, walletClient } from "../utils/client";
import { CONTRACT_ADDRESSES } from "@shared/constants";
import FunditOracleArtifact from "@shared/abi/FunditOracle.json";
import {
  OracleVerificationStatus,
  RequestVerificationParams,
  ResolveClaimParams,
} from "@shared/types/oracle";

const contractAddress = CONTRACT_ADDRESSES.FunditOracle as `0x${string}`;
const contractAbi = FunditOracleArtifact.abi as readonly unknown[];

/**
 * 보험금 청구 전 오라클 검증 요청
 */
export async function requestVerification({
  contractId,
  evidenceHash,
}: RequestVerificationParams): Promise<string> {
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "submitVerificationRequest",
    args: [contractId, evidenceHash],
    account: walletClient.account,
  });

  const txHash = await walletClient.writeContract(request);
  return txHash;
}

/**
 * 오라클 상태 조회
 */
export async function getOracleStatus(contractId: bigint): Promise<OracleVerificationStatus> {
  const status = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getVerificationStatus",
    args: [contractId],
  });

  return status as OracleVerificationStatus;
}

/**
 * 오라클 결과 등록 (관리자만 호출 가능)
 */
export async function resolveClaim({
  contractId,
  isApproved,
}: ResolveClaimParams): Promise<string> {
  // 먼저 해당 contractId에 대한 requestId를 조회해야 함
  const requestId = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "requestByContract",
    args: [contractId],
  });

  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "verifyClaim",
    args: [requestId as bigint, isApproved],
    account: walletClient.account,
  });

  const txHash = await walletClient.writeContract(request);
  return txHash;
}
