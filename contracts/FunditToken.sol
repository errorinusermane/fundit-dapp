// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FunditToken is ERC20, Ownable {
    address public minter;

    event MinterUpdated(address indexed oldMinter, address indexed newMinter);

    struct RewardEvent {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => RewardEvent[]) public rewardHistory;

    constructor() ERC20("Fundit Token", "FDT") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function setMinter(address _minter) external onlyOwner {
        emit MinterUpdated(minter, _minter);
        minter = _minter;
    }

    function mintReward(address to, uint256 amount) external {
        require(msg.sender == minter, "Only minter can mint");
        _mint(to, amount);
        rewardHistory[to].push(RewardEvent(amount, block.timestamp));
    }

    function getRewardHistoryLength(address user) external view returns (uint256) {
        return rewardHistory[user].length;
    }

    function getRewardHistoryItem(address user, uint256 index) external view returns (uint256 amount, uint256 timestamp) {
        RewardEvent memory evt = rewardHistory[user][index];
        return (evt.amount, evt.timestamp);
    }
}
