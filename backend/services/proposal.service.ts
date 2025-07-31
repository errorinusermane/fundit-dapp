import { publicClient, walletClient } from "../utils/client";
import { CONTRACT_ADDRESSES } from "@shared/constants";
import FunditProposalArtifact from "@shared/abi/FunditProposal.json";
import { Proposal, ProposalStatus } from "@shared/types/proposal";
import { parseAbiItem } from "viem";
import { Address, parseAbi } from "viem";

const contractAddress = CONTRACT_ADDRESSES.FunditProposal as `0x${string}`;
const contractAbi = FunditProposalArtifact.abi as readonly unknown[];

/**
 * Proposal 생성 (온체인)
 */
export async function createProposal(input: Omit<Proposal, "id" | "createdAt" | "status" | "bidCount" | "proposer">, walletAddress: Address) {
  const {
    title,
    description,
    mandatoryRequirements,
    enrollmentConditions,
    optionalFeatures,
    desiredStartDate,
    minPremium,
    maxPremium,
  } = input;

  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "createProposal",
    account: walletAddress,
    args: [
      title,
      description,
      mandatoryRequirements,
      enrollmentConditions,
      optionalFeatures,
      BigInt(desiredStartDate),
      BigInt(minPremium),
      BigInt(maxPremium),
    ],
  });

  return await walletClient.writeContract(request);
}

/**
 * Proposal 마감 (온체인)
 */
export async function closeProposal(proposalId: number, walletAddress: Address) {
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "closeProposal",
    account: walletAddress,
    args: [BigInt(proposalId)],
  });

  return await walletClient.writeContract(request);
}

/**
 * proposalId로 단건 조회 (온체인)
 */
export async function getProposalById(proposalId: number): Promise<Proposal> {
  const result = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getProposal",
    args: [BigInt(proposalId)],
  });

  return parseProposal(result);
}

/**
 * 모든 제안 조회 (오프체인 반복 호출)
 */
export async function getAllProposals(): Promise<Proposal[]> {
  const count = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getProposalCount",
  });

  const promises: Promise<Proposal>[] = [];
  for (let i = 1; i <= Number(count); i++) {
    promises.push(getProposalById(i));
  }

  return await Promise.all(promises);
}

/**
 * ACTIVE 상태의 제안만 조회
 */
export async function getActiveProposals(): Promise<Proposal[]> {
  const all = await getAllProposals();
  return all.filter((p) => p.status === "ACTIVE");
}

/**
 * 특정 유저의 제안 목록 조회
 */
export async function getProposalsByUser(address: Address): Promise<Proposal[]> {
  const ids = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getProposalsByUser",
    args: [address],
  }) as bigint[];

  const proposals = await Promise.all(
    ids.map((id) => getProposalById(Number(id)))
  );
  return proposals;
}

/**
 * 입찰 수 증가 (온체인, 백엔드 전용)
 */
export async function incrementBidCount(proposalId: number) {
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "incrementBidCount",
    account: walletClient.account,
    args: [BigInt(proposalId)],
  });

  return await walletClient.writeContract(request);
}

/**
 * remainingTime 계산 (오프체인)
 */
export function calculateRemainingTime(startDate: number): number {
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, startDate - now);
}

/**
 * Proposal 상태 enum 변환
 */
function parseProposal(raw: any): Proposal {
  const [
    id,
    proposer,
    title,
    description,
    mandatoryRequirements,
    enrollmentConditions,
    optionalFeatures,
    desiredStartDate,
    minPremium,
    maxPremium,
    createdAt,
    status,
    bidCount,
  ] = raw;

  const statusEnum: ProposalStatus[] = ["ACTIVE", "CLOSED", "CANCELLED"];

  return {
    id: Number(id),
    proposer,
    title,
    description,
    mandatoryRequirements,
    enrollmentConditions,
    optionalFeatures,
    desiredStartDate: Number(desiredStartDate),
    minPremium: Number(minPremium),
    maxPremium: Number(maxPremium),
    createdAt: Number(createdAt),
    status: statusEnum[Number(status)],
    bidCount: Number(bidCount),
  };
}
