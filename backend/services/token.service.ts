import { publicClient, walletClient } from "../utils/client";
import { CONTRACT_ADDRESSES } from "@shared/constants";
import FunditTokenArtifact from "@shared/abi/FunditToken.json";

import { Address } from "viem";
import prisma from "@utils/prisma";

const contractAddress = CONTRACT_ADDRESSES.FunditToken as `0x${string}`;
const contractAbi = FunditTokenArtifact.abi as readonly unknown[];

/**
 * ✅ 리워드 수령 (관리자만 호출 + DB 기록)
 */
export async function claimReward(params: {
  user: Address;
  amount: bigint;
}): Promise<string> {
  const { user, amount } = params;

  const txHash = await walletClient.writeContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "claimReward",
    args: [user, amount],
  });

  // DB에 수령 기록 저장
  await prisma.rewardHistory.create({
    data: {
      address: user,
      amount: amount.toString(),
      txHash,
    },
  });

  return txHash;
}

/**
 * ✅ 보유량 조회 (view)
 */
export async function getTokenBalance(address: Address): Promise<bigint> {
  return (await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "balanceOf",
    args: [address],
  })) as bigint;
}

/**
 * ✅ 누적 수령량 조회 (view)
 */
export async function getClaimedReward(address: Address): Promise<bigint> {
  return (await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getClaimedReward",
    args: [address],
  })) as bigint;
}

/**
 * ✅ 수령 히스토리 (DB 기반)
 */
export async function getRewardHistory(address: Address) {
  return await prisma.rewardHistory.findMany({
    where: { address },
    orderBy: { createdAt: "desc" },
  });
}
