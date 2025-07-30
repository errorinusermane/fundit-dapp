// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract FunditBid {
    uint256 public bidCount;

    struct Bid {
        uint256 id;
        uint256 proposalId;
        address bidder;
        uint256 coverageOffer;
        uint256 premiumOffer;
        uint256 timestamp;
    }

    mapping(uint256 => Bid) public bids; // bidId → Bid
    mapping(uint256 => uint256[]) public bidsByProposal; // proposalId → bidIds
    mapping(uint256 => uint256) public bidVoteCounts; // bidId → 투표 수
    mapping(address => mapping(uint256 => bool)) public hasVoted; // user → bidId → 중복 방지

    event BidSubmitted(
        uint256 indexed id,
        uint256 indexed proposalId,
        address indexed bidder,
        uint256 coverageOffer,
        uint256 premiumOffer,
        uint256 timestamp
    );

    event BidVoted(
        uint256 indexed bidId,
        address indexed voter
    );

    /// @notice 기업이 특정 보험 제안에 입찰을 등록
    function submitBid(
        uint256 proposalId,
        uint256 coverageOffer,
        uint256 premiumOffer
    ) external {
        bidCount += 1;

        bids[bidCount] = Bid({
            id: bidCount,
            proposalId: proposalId,
            bidder: msg.sender,
            coverageOffer: coverageOffer,
            premiumOffer: premiumOffer,
            timestamp: block.timestamp
        });

        bidsByProposal[proposalId].push(bidCount);

        emit BidSubmitted(
            bidCount,
            proposalId,
            msg.sender,
            coverageOffer,
            premiumOffer,
            block.timestamp
        );
    }

    /// @notice 사용자가 특정 입찰안에 투표 (중복 불가)
    function voteBid(uint256 bidId) external {
        require(bids[bidId].id != 0, "Invalid bidId");
        require(!hasVoted[msg.sender][bidId], "Already voted");

        hasVoted[msg.sender][bidId] = true;
        bidVoteCounts[bidId]++;

        emit BidVoted(bidId, msg.sender);
    }

    /// @notice 특정 제안(proposalId)에 달린 입찰 목록 조회
    function getBidsByProposal(uint256 proposalId) external view returns (Bid[] memory) {
        uint256[] memory bidIds = bidsByProposal[proposalId];
        Bid[] memory result = new Bid[](bidIds.length);
        for (uint256 i = 0; i < bidIds.length; i++) {
            result[i] = bids[bidIds[i]];
        }
        return result;
    }

    /// @notice 특정 입찰 ID 조회
    function getBid(uint256 bidId) external view returns (Bid memory) {
        return bids[bidId];
    }
}
