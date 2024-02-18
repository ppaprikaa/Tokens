// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SToken is ERC20, Ownable{
    uint256 private _totalSupply;
    uint256 private _blockReward;
    bool private _destroyed;

    constructor() ERC20("SToken", "ST") Ownable(msg.sender) {
        _totalSupply = 1000000 * 10 ** decimals();
        super._mint(msg.sender, _totalSupply);
        _blockReward = 0;
        _destroyed = false;
    }

    modifier whenNotDestroyed() {
        require(!_destroyed, "Contract is already destroyed");
        _;
    }

    function mint(address account, uint256 amount) public onlyOwner whenNotDestroyed {
        super._mint(account, amount);
    }

    function mintMinerReward() internal virtual whenNotDestroyed {
        super._mint(block.coinbase, _blockReward);
    }

    function setBlockReward(uint256 amount) external onlyOwner whenNotDestroyed {
        _blockReward = amount;
    }

    function getBlockReward() public view returns (uint256) {
        return _blockReward;
    }

    function destroy(address payable recipient) external onlyOwner whenNotDestroyed {
        _destroyed = true;
        super.transfer(recipient, _totalSupply);
    }
}