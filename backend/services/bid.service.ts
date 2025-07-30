// backend/services/bid.service.ts

import { publicClient, walletClient } from "../utils/client";
import { CONTRACT_ADDRESSES } from "@shared/constants";
import FunditBidArtifact from "@shared/abi/FunditBid.json";
import { Bid } from "@shared/types/bid";
import { getAllProposals } from "./proposal.service";

const contractAddress = CONTRACT_ADDRESSES.FunditBid as `0x${string}`;
const contractAbi = FunditBidArtifact.abi as readonly unknown[];

// 입찰 제출
export async function submitBid(
  proposalId: bigint,
  coverageOffer: bigint,
  premiumOffer: bigint
) {
  const [account] = await walletClient.getAddresses();

  const txHash = await walletClient.writeContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "submitBid",
    args: [proposalId, coverageOffer, premiumOffer],
    account,
  });

  return txHash;
}

// 특정 제안에 달린 입찰 목록 조회
export async function getBidsByProposal(proposalId: bigint): Promise<Bid[]> {
  const result = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getBidsByProposal",
    args: [proposalId],
  });

  return result as Bid[];
}

// 제안자가 특정 입찰 선택
export async function selectBid(bidId: bigint) {
  const [account] = await walletClient.getAddresses();

  const txHash = await walletClient.writeContract({
    address: CONTRACT_ADDRESSES.FunditContract as `0x${string}`,
    abi: (await import("@shared/abi/FunditContract.json")).default.abi,
    functionName: "selectBid",
    args: [bidId],
    account,
  });

  return txHash;
}

// 특정 기업이 제출한 모든 입찰 조회
export async function getBidsByCompany(companyAddress: string): Promise<Bid[]> {
  const proposals = await getAllProposals(); // 모든 proposal 가져오기

  const bidsByCompany: Bid[] = [];

  for (const proposal of proposals) {
    const bids = await getBidsByProposal(BigInt(proposal.id));
    const myBids = bids.filter((bid) => bid.bidder.toLowerCase() === companyAddress.toLowerCase());
    bidsByCompany.push(...myBids);
  }

  return bidsByCompany;
}
