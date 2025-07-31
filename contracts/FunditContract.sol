// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FunditContract {
    enum ContractStatus { ACTIVE, TERMINATED }

    struct InsuranceContract {
        uint256 id;
        uint256 proposalId;
        uint256 bidId;
        address user;
        address company;
        uint256 monthlyPremium;
        uint256 contractPeriod; // in months
        uint256 startDate; // timestamp
        bool autoPayment;
        ContractStatus status;
    }

    uint256 public nextContractId;
    mapping(uint256 => InsuranceContract) public contracts;

    mapping(address => uint256[]) public contractsByUser;
    mapping(address => uint256[]) public contractsByCompany;

    event ContractConfirmed(uint256 contractId, address indexed user, address indexed company);
    event AutoPaymentToggled(uint256 contractId, bool enabled);

    constructor() {
        nextContractId = 1;
    }

    /**
     * @dev 입찰 확정 → 계약 생성
     * @param _proposalId 제안 ID
     * @param _bidId 입찰 ID
     * @param _user 개인 주소
     * @param _company 기업 주소
     * @param _monthlyPremium 월 보험료
     * @param _contractPeriod 계약 기간 (개월 수)
     */
    function confirmContract(
        uint256 _proposalId,
        uint256 _bidId,
        address _user,
        address _company,
        uint256 _monthlyPremium,
        uint256 _contractPeriod
    ) external {
        uint256 contractId = nextContractId++;
        contracts[contractId] = InsuranceContract({
            id: contractId,
            proposalId: _proposalId,
            bidId: _bidId,
            user: _user,
            company: _company,
            monthlyPremium: _monthlyPremium,
            contractPeriod: _contractPeriod,
            startDate: block.timestamp,
            autoPayment: false,
            status: ContractStatus.ACTIVE
        });

        contractsByUser[_user].push(contractId);
        contractsByCompany[_company].push(contractId);

        emit ContractConfirmed(contractId, _user, _company);
    }

    /**
     * @dev 자동납부 토글
     */
    function toggleAutoPayment(uint256 _contractId) external {
        InsuranceContract storage c = contracts[_contractId];
        require(c.user == msg.sender || c.company == msg.sender, "Not authorized");
        c.autoPayment = !c.autoPayment;
        emit AutoPaymentToggled(_contractId, c.autoPayment);
    }

    /**
     * @dev 개인의 계약 목록
     */
    function getContractsByUser(address _user) external view returns (uint256[] memory) {
        return contractsByUser[_user];
    }

    /**
     * @dev 기업의 계약 목록
     */
    function getContractsByCompany(address _company) external view returns (uint256[] memory) {
        return contractsByCompany[_company];
    }

    /**
     * @dev 특정 계약 상세 조회
     */
    function getContract(uint256 _contractId) external view returns (InsuranceContract memory) {
        return contracts[_contractId];
    }

    /**
     * @dev 전체 계약 ID 목록 (Off-chain에서 전체 계약 조회 시 사용)
     */
    function getAllContracts() external view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](nextContractId - 1);
        for (uint256 i = 0; i < nextContractId - 1; i++) {
            ids[i] = i + 1;
        }
        return ids;
    }
}
