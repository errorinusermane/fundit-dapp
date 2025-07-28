// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FunditToken is ERC20, Ownable {
    address public minter;

    event MinterUpdated(address indexed oldMinter, address indexed newMinter);

    constructor() ERC20("Fundit Token", "FDT") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
        
    }

    /// @notice 리워드 지급 가능 주소 지정 (예: Oracle 또는 Contract)
    function setMinter(address _minter) external onlyOwner {
        emit MinterUpdated(minter, _minter);
        minter = _minter;
    }

    /// @notice 리워드 지급 (minter만 가능)
    function mintReward(address to, uint256 amount) external {
        require(msg.sender == minter, "Only minter can mint");
        _mint(to, amount);
    }

    /// @notice 일반 ERC20 transfer 등은 기본 상속된 기능 사용
}
