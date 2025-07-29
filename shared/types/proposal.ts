//shared/types/proposal.ts
export interface Proposal {
  id: bigint;
  proposer: string;
  title: string;
  description: string;
  coverageAmount: bigint;
  premium: bigint;
  deadline: bigint;
}
