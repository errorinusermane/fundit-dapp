// shared/types/contract.ts
export type ContractStatus = "ACTIVE" | "TERMINATED";

export interface FunditContract {
  id: number;
  proposalId: number;
  bidId: number;
  user: string; // address
  company: string; // address
  monthlyPremium: number; // 단위: wei 기준, 백엔드에서 변환 가능
  contractPeriod: number; // in months
  startDate: number; // timestamp
  autoPayment: boolean;
  status: ContractStatus;
}
