// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract FunditProposal {
    uint256 public proposalCount;

    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 coverageAmount;
        uint256 premium;
        uint256 deadline;
    }

    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(
        uint256 indexed id,
        address indexed proposer,
        string title,
        uint256 coverageAmount,
        uint256 premium,
        uint256 deadline
    );

    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _coverageAmount,
        uint256 _premium,
        uint256 _deadline
    ) external {
        proposalCount += 1;

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            title: _title,
            description: _description,
            coverageAmount: _coverageAmount,
            premium: _premium,
            deadline: _deadline
        });

        emit ProposalCreated(
            proposalCount,
            msg.sender,
            _title,
            _coverageAmount,
            _premium,
            _deadline
        );
    }

    function getProposal(uint256 _id) external view returns (Proposal memory) {
        return proposals[_id];
    }

    function getAllProposals() external view returns (Proposal[] memory) {
        Proposal[] memory result = new Proposal[](proposalCount);
        for (uint256 i = 1; i <= proposalCount; i++) {
            result[i - 1] = proposals[i];
        }
        return result;
    }
}
