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
 * ✅ 오라클 검증 요청
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
 * ✅ 오라클 상태 조회
 */
export async function getOracleStatus(contractId: bigint): Promise<OracleVerificationStatus> {
  const status = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getVerificationStatus",
    args: [contractId],
  });

  return Number(status) as OracleVerificationStatus; // 혹시 모를 타입 오류 방지
}

/**
 * ✅ 오라클 결과 반영 (관리자만 호출 가능)
 */
export async function resolveClaim({
  contractId,
  isApproved,
}: ResolveClaimParams): Promise<string> {
  // requestId 조회
  const requestIdRaw = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "requestByContract",
    args: [contractId],
  });

  const requestId = BigInt(requestIdRaw as string | number | bigint);

  // 예외 처리 (0이면 없는 request라고 판단)
  if (requestId === 0n) {
    throw new Error(`해당 contractId(${contractId})에 대한 검증 요청이 없습니다.`);
  }

  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "verifyClaim",
    args: [requestId, isApproved],
    account: walletClient.account,
  });

  const txHash = await walletClient.writeContract(request);
  return txHash;
}
