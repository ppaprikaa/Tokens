
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SNFT is ERC721URIStorage, Ownable{
    constructor() ERC721("SNFT Cats", "SC") Ownable(msg.sender) {}

    function mint(address to, uint256 tokenId, string memory uri) public onlyOwner {
        super._mint(to, tokenId);
        super._setTokenURI(tokenId, uri);
    }
}