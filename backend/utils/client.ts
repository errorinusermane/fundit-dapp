import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") }); // 루트 기준 경로 조심!

import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { bsc } from "viem/chains";

const rawKey = process.env.PRIVATE_KEY?.trim();

if (!rawKey || rawKey.length !== 64) {
  throw new Error("❌ PRIVATE_KEY must be 64-character hex string (without 0x).");
}

const account = privateKeyToAccount(`0x${rawKey}`);

export const publicClient = createPublicClient({
  chain: bsc,
  transport: http(process.env.BSC_RPC_URL),
});

export const walletClient = createWalletClient({
  account,
  chain: bsc,
  transport: http(process.env.BSC_RPC_URL),
});
