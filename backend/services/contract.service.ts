import { publicClient, walletClient } from "../utils/client";
import { CONTRACT_ADDRESSES } from "@shared/constants";
import FunditContractArtifact from "@shared/abi/FunditContract.json";
import { ContractStatus, FunditContract } from "@shared/types/contract";

const contractAddress = CONTRACT_ADDRESSES.FunditContract as `0x${string}`;
const contractAbi = FunditContractArtifact.abi as readonly unknown[];

/**
 * 계약 확정 → confirmContract
 */
export async function confirmContract(params: {
  proposalId: number;
  bidId: number;
  user: string;
  company: string;
  monthlyPremium: bigint;
  contractPeriod: number;
}) {
  const { proposalId, bidId, user, company, monthlyPremium, contractPeriod } = params;

  const tx = await walletClient.writeContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "confirmContract",
    args: [
      BigInt(proposalId),
      BigInt(bidId),
      user,
      company,
      monthlyPremium,
      BigInt(contractPeriod),
    ],
  });

  return tx;
}

/**
 * 자동 납부 토글 → toggleAutoPayment
 */
export async function toggleAutoPayment(contractId: number) {
  const tx = await walletClient.writeContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "toggleAutoPayment",
    args: [BigInt(contractId)],
  });

  return tx;
}

/**
 * 개별 계약 상세 조회 → getContract
 */
export async function getContractDetail(contractId: number): Promise<FunditContract> {
  const raw = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getContract",
    args: [BigInt(contractId)],
  });

  return parseContract(raw);
}

/**
 * 유저 주소 기준 계약 리스트 조회 → getContractsByUser
 */
export async function getContractsByUser(address: string): Promise<FunditContract[]> {
  const ids = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getContractsByUser",
    args: [address],
  }) as bigint[];

  const results = await Promise.all(
    ids.map(async (id) => getContractDetail(Number(id)))
  );

  return results;
}

/**
 * 기업 주소 기준 계약 리스트 조회 → getContractsByCompany
 */
export async function getContractsByCompany(address: string): Promise<FunditContract[]> {
  const ids = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getContractsByUser",
    args: [address],
  }) as bigint[];

  const results = await Promise.all(
    ids.map(async (id) => getContractDetail(Number(id)))
  );

  return results;
}

/**
 * 전체 계약 ID 목록 → getAllContracts
 */
export async function getAllContractIds(): Promise<number[]> {
  const ids = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getAllContracts",
  }) as bigint[];

  return ids.map((id) => Number(id));
}

/**
 * 내부 파서 – Solidity 반환값 → TypeScript 타입
 */
function parseContract(raw: any): FunditContract {
  return {
    id: Number(raw.id),
    proposalId: Number(raw.proposalId),
    bidId: Number(raw.bidId),
    user: raw.user,
    company: raw.company,
    monthlyPremium: Number(raw.monthlyPremium),
    contractPeriod: Number(raw.contractPeriod),
    startDate: Number(raw.startDate),
    autoPayment: raw.autoPayment,
    status: (["ACTIVE", "TERMINATED"] as ContractStatus[])[Number(raw.status)],
  };
}
