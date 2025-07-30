// /shared/types/oracle.ts
// 오라클 상태 enum (Solidity enum과 일치)
export enum OracleVerificationStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

// Verification 요청 구조체 (Solidity 기준 맞춤)
export interface VerificationRequest {
  contractId: bigint;
  requester: string;
  evidenceHash: string;
  status: OracleVerificationStatus;
  timestamp: bigint;
}

// 서비스 함수용 타입
export interface RequestVerificationParams {
  contractId: bigint;
  evidenceHash: string;
}

export interface ResolveClaimParams {
  contractId: bigint;
  isApproved: boolean;
}
