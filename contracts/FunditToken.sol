// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FunditToken is ERC20, Ownable {
    mapping(address => uint256) public claimedRewards;

    event RewardClaimed(address indexed user, uint256 amount);

    constructor() ERC20("Fundit Token", "FDT") Ownable(msg.sender) {
        // 필요 시 초기 설정 가능
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function claimReward(address user, uint256 amount) external onlyOwner {
        require(amount > 0, "Reward amount must be greater than zero");

        claimedRewards[user] += amount;
        _mint(user, amount);

        emit RewardClaimed(user, amount);
    }

    function getClaimedReward(address user) external view returns (uint256) {
        return claimedRewards[user];
    }
}
