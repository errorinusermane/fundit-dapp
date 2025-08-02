import { publicClient, walletClient } from "../utils/client";
import { CONTRACT_ADDRESSES } from "@shared/constants";
import FunditBidArtifact from "@shared/abi/FunditBid.json";
import FunditContractArtifact from "@shared/abi/FunditContract.json";
import { Bid } from "@shared/types/bid";
import { getAllProposals } from "./proposal.service";
import { Address } from "viem";

const bidContractAddress = CONTRACT_ADDRESSES.FunditBid as `0x${string}`;
const bidContractAbi = FunditBidArtifact as readonly unknown[];

const contractContractAddress = CONTRACT_ADDRESSES.FunditContract as `0x${string}`;
const contractContractAbi = FunditContractArtifact as readonly unknown[];

// 🔒 getBid() 호출 시 반환되는 Solidity 구조를 명시적으로 정의
type RawBid = {
  company: Address;
  proposalId: bigint;
  companyName: string;
  planTitle: string;
  planType: string;
  outpatientCoveragePerVisit: bigint;
  inpatientCoverage: bigint;
  nonCoveredCoverage: bigint;
  monthlyPremium: bigint;
  contractPeriod: bigint;
  ageEligibility: bigint;
  occupationEligibility: string;
  voteCount: bigint;
  minVotes: bigint;
  status: bigint;
  createdAt: bigint;
};

/**
 * 입찰 제출 (기업용)
 */
export async function submitBid(
  args: Omit<Bid, "bidId" | "voteCount" | "status" | "createdAt" | "company">,
  companyAddress: Address
): Promise<bigint> {
  const { request } = await publicClient.simulateContract({
    address: bidContractAddress,
    abi: bidContractAbi,
    functionName: "submitBid",
    args: [
      args.proposalId,
      args.companyName,
      args.planTitle,
      args.planType,
      args.outpatientCoveragePerVisit,
      args.inpatientCoverage,
      args.nonCoveredCoverage,
      args.monthlyPremium,
      args.contractPeriod,
      args.ageEligibility,
      args.occupationEligibility,
      args.minVotes,
    ],
    account: companyAddress,
  });

  const txHash = await walletClient.writeContract(request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

  const event = (receipt.logs as any[]).find((log) => log.eventName === "BidSubmitted");
  if (!event) throw new Error("BidSubmitted event not found");

  const bidId = event.args[0] as bigint;
  return bidId;
}

/**
 * 특정 Proposal에 속한 입찰 목록 조회
 */
export async function getBidsByProposal(proposalId: number): Promise<Bid[]> {
  const bidIds = await publicClient.readContract({
    address: bidContractAddress,
    abi: bidContractAbi,
    functionName: "getBidsByProposal",
    args: [BigInt(proposalId)],
  }) as bigint[];

  const bidList: Bid[] = await Promise.all(
    bidIds.map(async (id) => {
      const bid = await publicClient.readContract({
        address: bidContractAddress,
        abi: bidContractAbi,
        functionName: "getBid",
        args: [id],
      }) as RawBid;

      return {
        bidId: Number(id),
        proposalId: Number(bid.proposalId),
        company: bid.company,
        companyName: bid.companyName,
        planTitle: bid.planTitle,
        planType: bid.planType,
        outpatientCoveragePerVisit: Number(bid.outpatientCoveragePerVisit),
        inpatientCoverage: Number(bid.inpatientCoverage),
        nonCoveredCoverage: Number(bid.nonCoveredCoverage),
        monthlyPremium: Number(bid.monthlyPremium),
        contractPeriod: Number(bid.contractPeriod),
        ageEligibility: Number(bid.ageEligibility),
        occupationEligibility: bid.occupationEligibility,
        voteCount: Number(bid.voteCount),
        minVotes: Number(bid.minVotes),
        status: ["ACTIVE", "SELECTED", "REJECTED"][Number(bid.status)] as Bid["status"],
        createdAt: Number(bid.createdAt),
      };
    })
  );

  return bidList;
}

/**
 * 내가 제출한 입찰 목록 조회 (기업용)
 */
export async function getBidsByCompany(company: Address): Promise<Bid[]> {
  const bidIds = await publicClient.readContract({
    address: bidContractAddress,
    abi: bidContractAbi,
    functionName: "getMyBids",
    args: [company],
  }) as bigint[];

  const bids: Bid[] = await Promise.all(
    bidIds.map(async (id) => {
      const bid = await publicClient.readContract({
        address: bidContractAddress,
        abi: bidContractAbi,
        functionName: "getBid",
        args: [id],
      }) as RawBid;

      return {
        bidId: Number(id),
        proposalId: Number(bid.proposalId),
        company: bid.company,
        companyName: bid.companyName,
        planTitle: bid.planTitle,
        planType: bid.planType,
        outpatientCoveragePerVisit: Number(bid.outpatientCoveragePerVisit),
        inpatientCoverage: Number(bid.inpatientCoverage),
        nonCoveredCoverage: Number(bid.nonCoveredCoverage),
        monthlyPremium: Number(bid.monthlyPremium),
        contractPeriod: Number(bid.contractPeriod),
        ageEligibility: Number(bid.ageEligibility),
        occupationEligibility: bid.occupationEligibility,
        voteCount: Number(bid.voteCount),
        minVotes: Number(bid.minVotes),
        status: ["ACTIVE", "SELECTED", "REJECTED"][Number(bid.status)] as Bid["status"],
        createdAt: Number(bid.createdAt),
      };
    })
  );

  return bids;
}

/**
 * 특정 입찰에 투표 (유저용)
 */
export async function voteBid(bidId: number, user: Address) {
  const { request } = await publicClient.simulateContract({
    address: bidContractAddress,
    abi: bidContractAbi,
    functionName: "voteBid",
    args: [BigInt(bidId)],
    account: user,
  });

  const txHash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash: txHash });
}
