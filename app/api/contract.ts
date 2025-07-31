import axiosInstance from "../api/axios";
import { FunditContract } from "@shared/types/contract";

interface ConfirmContractInput {
  proposalId: number;
  bidId: number;
  user: string;     // 유저 지갑 주소
  company: string;  // 기업 지갑 주소
  monthlyPremium: bigint;  // 단위: wei
  contractPeriod: number;  // 단위: 월
}

/**
 * 계약 확정 (입찰 채택 → 계약 생성)
 */
export async function confirmContract(input: ConfirmContractInput): Promise<string> {
  const res = await axiosInstance.post("/contracts/confirm", input);
  return res.data.txHash;
}

/**
 * 자동 결제 토글 (사용자 or 기업)
 */
export async function toggleAutoPayment(contractId: number): Promise<string> {
  const res = await axiosInstance.post("/contracts/toggle", { contractId });
  return res.data.txHash;
}

/**
 * 계약 상세 조회
 */
export async function getContractDetail(id: number): Promise<FunditContract> {
  const res = await axiosInstance.get(`/contracts/${id}`);
  return res.data;
}

/**
 * 사용자의 계약 목록 조회
 */
export async function getContractsByUser(address: string): Promise<FunditContract[]> {
  const res = await axiosInstance.get(`/contracts/user/${address}`);
  return res.data;
}

/**
 * 기업의 계약 목록 조회
 */
export async function getContractsByCompany(address: string): Promise<FunditContract[]> {
  const res = await axiosInstance.get(`/contracts/company/${address}`);
  return res.data;
}
