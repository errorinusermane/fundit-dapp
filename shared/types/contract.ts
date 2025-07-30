import { VerificationRequest } from "./oracle";

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

  // ✅ 추가: 오라클 요청 내역 (선택적 필드)
  verificationRequests?: VerificationRequest[];
}

// 필요 시 확장
export interface ContractDetail extends Contract {
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
}
