// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract FunditContract {
    uint256 public contractCount;

    enum ContractStatus {
        Active,
        Completed,
        Cancelled
    }

    struct InsuranceContract {
        uint256 id;
        uint256 proposalId;
        uint256 bidId;
        address user;
        address company;
        uint256 coverageAmount;
        uint256 premiumAmount;
        uint256 startTime;
        uint256 endTime;
        ContractStatus status;
    }

    mapping(uint256 => InsuranceContract) public contracts; // contractId → contract
    mapping(address => uint256[]) public contractsByUser;   // user → contractIds
    mapping(address => uint256[]) public contractsByCompany; // company → contractIds

    event ContractConfirmed(
        uint256 indexed contractId,
        uint256 indexed proposalId,
        uint256 indexed bidId,
        address user,
        address company,
        uint256 startTime,
        uint256 endTime
    );

    /// @notice 제안자와 입찰 기업 간 계약을 확정
    function confirmContract(
        uint256 proposalId,
        uint256 bidId,
        address user,
        address company,
        uint256 coverageAmount,
        uint256 premiumAmount,
        uint256 duration
    ) external {
        contractCount += 1;

        InsuranceContract memory newContract = InsuranceContract({
            id: contractCount,
            proposalId: proposalId,
            bidId: bidId,
            user: user,
            company: company,
            coverageAmount: coverageAmount,
            premiumAmount: premiumAmount,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            status: ContractStatus.Active
        });

        contracts[contractCount] = newContract;
        contractsByUser[user].push(contractCount);
        contractsByCompany[company].push(contractCount);

        emit ContractConfirmed(
            contractCount,
            proposalId,
            bidId,
            user,
            company,
            block.timestamp,
            block.timestamp + duration
        );
    }

    function getContract(uint256 contractId) external view returns (InsuranceContract memory) {
        return contracts[contractId];
    }

    function getContractsByUser(address user) external view returns (InsuranceContract[] memory) {
        uint256[] memory ids = contractsByUser[user];
        InsuranceContract[] memory result = new InsuranceContract[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = contracts[ids[i]];
        }
        return result;
    }

    function getContractsByCompany(address company) external view returns (InsuranceContract[] memory) {
        uint256[] memory ids = contractsByCompany[company];
        InsuranceContract[] memory result = new InsuranceContract[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = contracts[ids[i]];
        }
        return result;
    }

    function completeContract(uint256 contractId) external {
        InsuranceContract storage c = contracts[contractId];
        require(c.status == ContractStatus.Active, "Contract must be active");
        c.status = ContractStatus.Completed;
    }

    function cancelContract(uint256 contractId) external {
        InsuranceContract storage c = contracts[contractId];
        require(c.status == ContractStatus.Active, "Contract must be active");
        c.status = ContractStatus.Cancelled;
    }
}
