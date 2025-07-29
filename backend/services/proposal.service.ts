import { publicClient, walletClient } from "../utils/client";
import { CONTRACT_ADDRESSES } from "@shared/constants";
import FunditProposalArtifact from "@shared/abi/FunditProposal.json";
import { Proposal } from "@shared/types/proposal";

const contractAddress = CONTRACT_ADDRESSES.FunditProposal as `0x${string}`;
const contractAbi = FunditProposalArtifact.abi as readonly unknown[];

export const createProposal = async (
  title: string,
  description: string,
  coverageAmount: bigint,
  premium: bigint,
  deadline: bigint
) => {
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "createProposal",
    args: [title, description, coverageAmount, premium, deadline],
    account: walletClient.account,
  });

  const txHash = await walletClient.writeContract(request);
  return txHash;
};

export const getAllProposals = async (): Promise<Proposal[]> => {
  const proposals = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getAllProposals",
    args: [],
  });

  return proposals as Proposal[];
};

export const getProposalById = async (proposalId: bigint): Promise<Proposal> => {
  const proposal = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getProposalById",
    args: [proposalId],
  });
  return proposal as Proposal;
};

export const getProposalsByUser = async (userAddress: string): Promise<Proposal[]> => {
  const proposals = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getProposalsByUser",
    args: [userAddress],
  });
  return proposals as Proposal[];
};

export const getActiveProposals = async (): Promise<Proposal[]> => {
  const proposals = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getActiveProposals",
    args: [],
  });
  return proposals as Proposal[];
};

export const closeProposal = async (proposalId: bigint): Promise<string> => {
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "closeProposal",
    args: [proposalId],
    account: walletClient.account,
  });

  const txHash = await walletClient.writeContract(request);
  return txHash;
};
