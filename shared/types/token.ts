// shared/types/token.ts
export interface TokenBalance {
  address: string;
  balance: string;
}

export interface RewardHistoryItem {
  timestamp: string; // ISO format ("2025-07-31T12:00:00.000Z")
  amount: string;    // bigint → 문자열
  txHash: string;    // 수령 트랜잭션 해시
}

export interface ClaimedReward {
  address: string;
  claimedAmount: string; // 누적 수령량
}
