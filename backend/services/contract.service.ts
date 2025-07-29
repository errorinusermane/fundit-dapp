import { publicClient, walletClient } from "../utils/client";
import { CONTRACT_ADDRESSES } from "@shared/constants";
import FunditContractArtifact from "@shared/abi/FunditContract.json";
import { Contract, ContractDetail } from "@shared/types/contract"; // ✅ 타입 import

const contractAddress = CONTRACT_ADDRESSES.FunditContract as `0x${string}`;
const contractAbi = FunditContractArtifact.abi as readonly unknown[];

export async function confirmContract(bidId: number) {
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "confirmContract",
    args: [BigInt(bidId)],
    account: walletClient.account,
  });

  const hash = await walletClient.writeContract(request);
  return hash; // txHash 반환
}

export async function getContractsByUser(userAddress: string): Promise<Contract[]> {
  const result = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getContractsByUser",
    args: [userAddress],
  }) as Contract[];;

  return result.map((c: any) => ({
    id: Number(c.id),
    proposalId: Number(c.proposalId),
    bidId: Number(c.bidId),
    user: c.user,
    company: c.company,
    coverageAmount: BigInt(c.coverageAmount),
    premium: BigInt(c.premium),
    startDate: Number(c.startDate),
    endDate: Number(c.endDate),
    nextPaymentDue: Number(c.nextPaymentDue),
    autoPayment: c.autoPayment,
  }));
}

export async function getContractsByCompany(companyAddress: string): Promise<Contract[]> {
  const result = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getContractsByCompany",
    args: [companyAddress],
  }) as Contract[];;

  return result.map((c: any) => ({
    id: Number(c.id),
    proposalId: Number(c.proposalId),
    bidId: Number(c.bidId),
    user: c.user,
    company: c.company,
    coverageAmount: BigInt(c.coverageAmount),
    premium: BigInt(c.premium),
    startDate: Number(c.startDate),
    endDate: Number(c.endDate),
    nextPaymentDue: Number(c.nextPaymentDue),
    autoPayment: c.autoPayment,
  }));
}

export async function getContractDetail(contractId: number): Promise<ContractDetail> {
  const c: any = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getContractDetail",
    args: [BigInt(contractId)],
  });

  return {
    id: Number(c.id),
    proposalId: Number(c.proposalId),
    bidId: Number(c.bidId),
    user: c.user,
    company: c.company,
    coverageAmount: BigInt(c.coverageAmount),
    premium: BigInt(c.premium),
    startDate: Number(c.startDate),
    endDate: Number(c.endDate),
    nextPaymentDue: Number(c.nextPaymentDue),
    autoPayment: c.autoPayment,
    status: c.status, // "ACTIVE" | "EXPIRED" | "CANCELLED"
  };
}

export async function toggleAutoPayment(contractId: number) {
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "toggleAutoPayment",
    args: [BigInt(contractId)],
    account: walletClient.account,
  });

  const hash = await walletClient.writeContract(request);
  return hash;
}

export async function getNextPaymentDue(contractId: number): Promise<number> {
  const nextDue: bigint = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getNextPaymentDue",
    args: [BigInt(contractId)],
  }) as bigint;

  return Number(nextDue);
}
