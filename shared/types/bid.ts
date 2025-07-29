// shared/types/bid.ts
export interface Bid {
  id: number;
  proposalId: number;
  bidder: string;
  coverageOffer: bigint;
  premiumOffer: bigint;
  timestamp: bigint;
}
