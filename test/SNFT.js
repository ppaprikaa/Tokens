const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { Contract } = require("ethers");
const { ethers } = require("hardhat");


describe("Token", () => {
    let token;
    let owner;
    let a;
    let b;

    beforeEach(async function () {
        token = await loadFixture(deploy);
    })

    async function deploy() {
        const Token = await ethers.getContractFactory("SNFT");
        token = await Token.deploy();
        [owner, a, b] = await ethers.getSigners();
        await token.waitForDeployment()
        return token;
    }

    it("Should mint a new token", async function() {
        const tokenId = 0;
        const tokenURI = "https://gearwheel.sanzh/token/0";
    
        await token.mint(a.address, tokenId, tokenURI);
    
        const ownerOfToken = await token.ownerOf(tokenId);
        expect(ownerOfToken).to.equal(a.address);
    
        const uri = await token.tokenURI(tokenId);
        expect(uri).to.equal(tokenURI);
      });
    
      it("Should transfer a token", async function() {
        const tokenId = 0;
        const tokenURI = "https://gearwheel.sanzh/token/0";
    
        await token.connect(owner).mint(a.address, tokenId, tokenURI);
    
        await token.connect(a).transferFrom(a.address, b.address, tokenId);
    
        const ownerOfToken = await token.ownerOf(tokenId);
        expect(ownerOfToken).to.equal(b.address);
      });
    
      it("Should approve and transfer a token", async function() {
        const tokenId = 0;
        const tokenURI = "https://gearwheel.sanzh/token/0";
    
        await token.connect(owner).mint(a.address, tokenId, tokenURI);
    
        await token.connect(a).approve(b.address, tokenId);
    
        await token.connect(b).transferFrom(a.address, b.address, tokenId);
    
        const ownerOfToken = await token.ownerOf(tokenId);
        expect(ownerOfToken).to.equal(b.address);
      });
});