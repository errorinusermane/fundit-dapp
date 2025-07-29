import { publicClient, walletClient } from "../utils/client";
import { CONTRACT_ADDRESSES } from "@shared/constants";
import FunditTokenArtifact from "@shared/abi/FunditToken.json";
import { RewardEvent } from "@shared/types/token";

const contractAddress = CONTRACT_ADDRESSES.FunditToken as `0x${string}`;
const contractAbi = FunditTokenArtifact.abi as readonly unknown[];

// ✅ 1. 토큰 잔액 조회
export async function getTokenBalance(address: string): Promise<string> {
  const balance = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "balanceOf",
    args: [address],
  }) as bigint;

  return balance.toString();
}

// ✅ 2. 토큰 전송
export async function transferToken(to: string, amount: string): Promise<string> {
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "transfer",
    args: [to, BigInt(amount)],
    account: walletClient.account,
  });

  const hash = await walletClient.writeContract(request);
  return hash;
}

// ✅ 3. 리워드 클레임 (mint)
export async function claimReward(address: string, amount: string): Promise<string> {
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "mintReward",
    args: [address, BigInt(amount)],
    account: walletClient.account,
  });

  const hash = await walletClient.writeContract(request);
  return hash;
}

// ✅ 4. 리워드 히스토리 전체 조회
export async function getRewardHistory(address: string): Promise<RewardEvent[]> {
  const length = await getRewardHistoryLength(address);

  const events: RewardEvent[] = [];

  for (let i = 0; i < length; i++) {
    const { amount, timestamp } = await getRewardHistoryItem(address, i);
    events.push({ amount, timestamp });
  }

  return events;
}

// ✅ 5. 리워드 히스토리 길이 조회
export async function getRewardHistoryLength(address: string): Promise<number> {
  const result = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getRewardHistoryLength",
    args: [address],
  });

  return Number(result);
}

// ✅ 6. 리워드 히스토리 특정 항목 조회
export async function getRewardHistoryItem(address: string, index: number): Promise<RewardEvent> {
  const result = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getRewardHistoryItem",
    args: [address, BigInt(index)],
  });

  // return 타입이 [amount, timestamp]
  const [amount, timestamp] = result as [bigint, bigint];
  return { amount, timestamp };
}
