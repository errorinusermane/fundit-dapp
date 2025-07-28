// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract FunditOracle {
    enum VerificationStatus {
        Pending,
        Approved,
        Rejected
    }

    struct VerificationRequest {
        uint256 contractId;
        address requester;
        string evidenceHash; // off-chain evidence (IPFS or others)
        VerificationStatus status;
        uint256 timestamp;
    }

    address public oracleAdmin;
    uint256 public requestCount;

    mapping(uint256 => VerificationRequest) public requests; // requestId → data
    mapping(uint256 => uint256) public requestByContract; // contractId → requestId

    event VerificationRequested(
        uint256 indexed requestId,
        uint256 indexed contractId,
        address indexed requester,
        string evidenceHash,
        uint256 timestamp
    );

    event VerificationResolved(
        uint256 indexed requestId,
        VerificationStatus status,
        uint256 timestamp
    );

    constructor() {
        oracleAdmin = msg.sender;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAdmin, "Only oracle admin");
        _;
    }

    /// @notice 사용자 or 컨트랙트가 검증 요청
    function submitVerificationRequest(uint256 contractId, string calldata evidenceHash) external {
        require(requestByContract[contractId] == 0, "Already requested");

        requestCount += 1;

        requests[requestCount] = VerificationRequest({
            contractId: contractId,
            requester: msg.sender,
            evidenceHash: evidenceHash,
            status: VerificationStatus.Pending,
            timestamp: block.timestamp
        });

        requestByContract[contractId] = requestCount;

        emit VerificationRequested(
            requestCount,
            contractId,
            msg.sender,
            evidenceHash,
            block.timestamp
        );
    }

    /// @notice 오라클이 결과 등록
    function verifyClaim(uint256 requestId, bool approved) external onlyOracle {
        VerificationRequest storage req = requests[requestId];
        require(req.status == VerificationStatus.Pending, "Already verified");

        req.status = approved ? VerificationStatus.Approved : VerificationStatus.Rejected;

        emit VerificationResolved(requestId, req.status, block.timestamp);
    }

    /// @notice 결과 조회
    function getVerificationStatus(uint256 contractId) external view returns (VerificationStatus) {
        uint256 requestId = requestByContract[contractId];
        require(requestId != 0, "No request found");

        return requests[requestId].status;
    }

    /// @notice 오라클 관리자 변경
    function setOracleAdmin(address newAdmin) external onlyOracle {
        oracleAdmin = newAdmin;
    }
}
