// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract FunditBid {
    uint256 private bidCounter;

    enum BidStatus {
        ACTIVE,
        SELECTED,
        REJECTED
    }

    struct Bid {
        address company;
        uint256 proposalId;
        string companyName;
        string planTitle;
        string planType;
        uint256 outpatientCoveragePerVisit;
        uint256 inpatientCoverage;
        uint256 nonCoveredCoverage;
        uint256 monthlyPremium;
        uint256 contractPeriod;
        uint256 ageEligibility;
        string occupationEligibility;
        uint256 voteCount;
        uint256 minVotes;
        BidStatus status;
        uint256 createdAt;
    }

    mapping(uint256 => Bid) public bids;
    mapping(uint256 => uint256[]) public proposalToBids;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event BidSubmitted(uint256 bidId, uint256 proposalId, address indexed company);
    event BidVoted(uint256 bidId, address indexed user);
    event BidStatusUpdated(uint256 bidId, BidStatus status);

    function submitBid(
        uint256 proposalId,
        string memory companyName,
        string memory planTitle,
        string memory planType,
        uint256 outpatientCoveragePerVisit,
        uint256 inpatientCoverage,
        uint256 nonCoveredCoverage,
        uint256 monthlyPremium,
        uint256 contractPeriod,
        uint256 ageEligibility,
        string memory occupationEligibility,
        uint256 minVotes
    ) external returns (uint256) {
        bidCounter++;

        Bid storage newBid = bids[bidCounter];
        newBid.company = msg.sender;
        newBid.proposalId = proposalId;
        newBid.companyName = companyName;
        newBid.planTitle = planTitle;
        newBid.planType = planType;
        newBid.outpatientCoveragePerVisit = outpatientCoveragePerVisit;
        newBid.inpatientCoverage = inpatientCoverage;
        newBid.nonCoveredCoverage = nonCoveredCoverage;
        newBid.monthlyPremium = monthlyPremium;
        newBid.contractPeriod = contractPeriod;
        newBid.ageEligibility = ageEligibility;
        newBid.occupationEligibility = occupationEligibility;
        newBid.voteCount = 0;
        newBid.minVotes = minVotes;
        newBid.status = BidStatus.ACTIVE;
        newBid.createdAt = block.timestamp;

        proposalToBids[proposalId].push(bidCounter);

        emit BidSubmitted(bidCounter, proposalId, msg.sender);
        return bidCounter;
    }

    function voteBid(uint256 bidId) external {
        require(!hasVoted[bidId][msg.sender], "Already voted for this bid");

        bids[bidId].voteCount += 1;
        hasVoted[bidId][msg.sender] = true;

        emit BidVoted(bidId, msg.sender);
    }

    function getBidsByProposal(uint256 proposalId) external view returns (uint256[] memory) {
        return proposalToBids[proposalId];
    }

    function getVotes(uint256 bidId) external view returns (uint256) {
        return bids[bidId].voteCount;
    }

    function updateBidStatus(uint256 bidId, BidStatus status) external {
        // 🔒 필요 시 관리자 권한만 허용
        bids[bidId].status = status;
        emit BidStatusUpdated(bidId, status);
    }

    function getBid(uint256 bidId) external view returns (Bid memory) {
        return bids[bidId];
    }

    function getMyBids(address company) external view returns (uint256[] memory) {
        uint256 count;
        for (uint256 i = 1; i <= bidCounter; i++) {
            if (bids[i].company == company) {
                count++;
            }
        }

        uint256[] memory myBidIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= bidCounter; i++) {
            if (bids[i].company == company) {
                myBidIds[index] = i;
                index++;
            }
        }

        return myBidIds;
    }
}
