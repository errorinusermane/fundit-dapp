import { publicClient, walletClient } from "../utils/client";
import { CONTRACT_ADDRESSES } from "@shared/constants";
import FunditBidArtifact from "@shared/abi/FunditBid.json";
import FunditContractArtifact from "@shared/abi/FunditContract.json";
import { Bid } from "@shared/types/bid";
import { getAllProposals } from "./proposal.service";

const bidContractAddress = CONTRACT_ADDRESSES.FunditBid as `0x${string}`;
const bidContractAbi = FunditBidArtifact.abi as readonly unknown[];

const contractContractAddress = CONTRACT_ADDRESSES.FunditContract as `0x${string}`;
const contractContractAbi = FunditContractArtifact.abi as readonly unknown[];

// ✅ 입찰 제출
export async function submitBid(
  proposalId: bigint,
  coverageOffer: bigint,
  premiumOffer: bigint
) {
  const [account] = await walletClient.getAddresses();

  const txHash = await walletClient.writeContract({
    address: bidContractAddress,
    abi: bidContractAbi,
    functionName: "submitBid",
    args: [proposalId, coverageOffer, premiumOffer],
    account,
  });

  return txHash;
}

// ✅ 특정 제안에 달린 입찰 목록 조회
export async function getBidsByProposal(proposalId: bigint): Promise<Bid[]> {
  const result = await publicClient.readContract({
    address: bidContractAddress,
    abi: bidContractAbi,
    functionName: "getBidsByProposal",
    args: [proposalId],
  });

  return result as Bid[];
}

// ✅ 특정 기업이 제출한 모든 입찰 조회
export async function getBidsByCompany(companyAddress: string): Promise<Bid[]> {
  const proposals = await getAllProposals();

  const bidsByCompany: Bid[] = [];

  for (const proposal of proposals) {
    const bids = await getBidsByProposal(BigInt(proposal.id));
    const myBids = bids.filter(
      (bid) => bid.bidder.toLowerCase() === companyAddress.toLowerCase()
    );
    bidsByCompany.push(...myBids);
  }

  return bidsByCompany;
}

// ✅ 특정 입찰에 투표 (개인 참여자)
export async function voteBid(bidId: bigint) {
  const [account] = await walletClient.getAddresses();

  const txHash = await walletClient.writeContract({
    address: bidContractAddress,
    abi: bidContractAbi,
    functionName: "voteBid",
    args: [bidId],
    account,
  });

  return txHash;
}

// ✅ 특정 입찰이 기준 이상 득표 시 계약 확정
export async function confirmContractIfPopular(bidId: bigint, duration: bigint) {
  const [account] = await walletClient.getAddresses();

  const txHash = await walletClient.writeContract({
    address: contractContractAddress,
    abi: contractContractAbi,
    functionName: "confirmContractIfPopular",
    args: [bidId, duration],
    account,
  });

  return txHash;
}
