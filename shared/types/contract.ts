//shared/types/contract.ts
export interface Contract {
  id: number;
  proposalId: number;
  bidId: number;
  user: string; // 보험 제안자
  company: string; // 입찰자
  coverageAmount: bigint;
  premium: bigint;
  startDate: number; // timestamp
  endDate: number; // timestamp
  nextPaymentDue: number; // timestamp
  autoPayment: boolean;
}

export interface ContractDetail extends Contract {
  status: "ACTIVE" | "EXPIRED" | "CANCELLED"; // 필요 시 상태 확장
}
