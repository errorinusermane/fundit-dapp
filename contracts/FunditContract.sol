// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IFunditBid {
    function bidVoteCounts(uint256 bidId) external view returns (uint256);
    function getBid(uint256 bidId) external view returns (
        uint256 id,
        uint256 proposalId,
        address bidder,
        uint256 coverageOffer,
        uint256 premiumOffer,
        uint256 timestamp
    );
}

contract FunditContract {
    uint256 public contractCount;
    IFunditBid public bidContract;
    uint256 public voteThreshold = 10; // ✅ 필요한 최소 투표 수 (필요시 수정 가능)

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

    mapping(uint256 => InsuranceContract) public contracts;
    mapping(address => uint256[]) public contractsByUser;
    mapping(address => uint256[]) public contractsByCompany;
    mapping(address => mapping(uint256 => bool)) public hasJoined; // user → bidId → 참여 여부

    event ContractConfirmed(
        uint256 indexed contractId,
        uint256 indexed proposalId,
        uint256 indexed bidId,
        address user,
        address company,
        uint256 startTime,
        uint256 endTime
    );

    constructor(address bidContractAddress) {
        bidContract = IFunditBid(bidContractAddress);
    }

    /// @notice 개인 유저가 투표 완료 후, 계약 조건이 충족되면 자동 생성
    function confirmContractIfPopular(uint256 bidId, uint256 duration) external {
        require(!hasJoined[msg.sender][bidId], "Already joined this bid");

        // 1. 투표 수 확인
        uint256 voteCount = bidContract.bidVoteCounts(bidId);
        require(voteCount >= voteThreshold, "Not enough votes");

        // 2. bid 정보 불러오기
        (
            ,
            uint256 proposalId,
            address company,
            uint256 coverageAmount,
            uint256 premiumAmount,
        ) = bidContract.getBid(bidId);

        // 3. 계약 생성
        contractCount += 1;

        InsuranceContract memory newContract = InsuranceContract({
            id: contractCount,
            proposalId: proposalId,
            bidId: bidId,
            user: msg.sender,
            company: company,
            coverageAmount: coverageAmount,
            premiumAmount: premiumAmount,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            status: ContractStatus.Active
        });

        contracts[contractCount] = newContract;
        contractsByUser[msg.sender].push(contractCount);
        contractsByCompany[company].push(contractCount);
        hasJoined[msg.sender][bidId] = true;

        emit ContractConfirmed(
            contractCount,
            proposalId,
            bidId,
            msg.sender,
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
