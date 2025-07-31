// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FunditProposal {
    enum ProposalStatus { ACTIVE, CLOSED, CANCELLED }

    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;

        // Conditions
        string[] mandatoryRequirements;
        string[] enrollmentConditions;
        string[] optionalFeatures;

        // Schedule
        uint256 desiredStartDate;

        // Premium range
        uint256 minPremium;
        uint256 maxPremium;

        // System
        uint256 createdAt;
        ProposalStatus status;
        uint256 bidCount;
    }

    uint256 private proposalIdCounter;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256[]) public userProposals;

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer);
    event ProposalClosed(uint256 indexed proposalId);

    modifier onlyProposer(uint256 _proposalId) {
        require(msg.sender == proposals[_proposalId].proposer, "Not proposer");
        _;
    }

    function createProposal(
        string memory _title,
        string memory _description,
        string[] memory _mandatoryRequirements,
        string[] memory _enrollmentConditions,
        string[] memory _optionalFeatures,
        uint256 _desiredStartDate,
        uint256 _minPremium,
        uint256 _maxPremium
    ) external {
        uint256 newId = ++proposalIdCounter;
        Proposal storage p = proposals[newId];
        p.id = newId;
        p.proposer = msg.sender;
        p.title = _title;
        p.description = _description;
        p.mandatoryRequirements = _mandatoryRequirements;
        p.enrollmentConditions = _enrollmentConditions;
        p.optionalFeatures = _optionalFeatures;
        p.desiredStartDate = _desiredStartDate;
        p.minPremium = _minPremium;
        p.maxPremium = _maxPremium;
        p.createdAt = block.timestamp;
        p.status = ProposalStatus.ACTIVE;
        p.bidCount = 0;

        userProposals[msg.sender].push(newId);

        emit ProposalCreated(newId, msg.sender);
    }

    function closeProposal(uint256 _proposalId) external onlyProposer(_proposalId) {
        Proposal storage p = proposals[_proposalId];
        require(p.status == ProposalStatus.ACTIVE, "Already closed or cancelled");
        p.status = ProposalStatus.CLOSED;
        emit ProposalClosed(_proposalId);
    }

    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }

    function getProposalCount() external view returns (uint256) {
        return proposalIdCounter;
    }

    function getProposalsByUser(address _user) external view returns (Proposal[] memory) {
        uint256[] memory ids = userProposals[_user];
        Proposal[] memory result = new Proposal[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = proposals[ids[i]];
        }
        return result;
    }

    function getActiveProposals() external view returns (Proposal[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= proposalIdCounter; i++) {
            if (proposals[i].status == ProposalStatus.ACTIVE) {
                count++;
            }
        }

        Proposal[] memory result = new Proposal[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= proposalIdCounter; i++) {
            if (proposals[i].status == ProposalStatus.ACTIVE) {
                result[idx++] = proposals[i];
            }
        }

        return result;
    }

    function incrementBidCount(uint256 _proposalId) external {
        proposals[_proposalId].bidCount++;
    }
}
