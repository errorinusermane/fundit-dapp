// shared/types/contract.ts
export interface Contract {
  id: number;
  proposalId: number;
  bidId: number;
  user: string;      // = userId
  company: string;   // = companyId
  coverageAmount: bigint;
  premium: bigint;
  startDate: number;      // timestamp
  endDate: number;        // timestamp
  nextPaymentDue: number; // timestamp
  autoPayment: boolean;
}

// 필요 시 확장
export interface ContractDetail extends Contract {
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
}
