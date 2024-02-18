const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { Contract } = require("ethers");
const { ethers } = require("hardhat");


describe("Token", () => {
    let token;
    let owner;
    let recipient;

    beforeEach(async function () {
        token = await loadFixture(deploy);
    })

    async function deploy() {
        const Token = await ethers.getContractFactory("SToken");
        const token = await Token.deploy();
        [owner, recipient] = await ethers.getSigners();
        return token;
    }

    describe("deploy", function () {
        it("should be named SToken", async function () {
            expect(await token.name()).to.eq("SToken")
        })
        it("should have ST symbol", async function () {
            expect(await token.symbol()).to.eq("ST")
        })
        it("should have a total supply of 100,000,0", async function () {
            expect(await token.totalSupply()).to.eq(
                ethers.parseEther("1000000")
            )
        })
        it("should mint total supply to deployer", async function () {
            const [deployer] = await ethers.getSigners()
            expect(await token.balanceOf(deployer.address)).to.eq(
                ethers.parseEther("1000000")
            )
        })
    })

    describe("transfer", function () {
        const amount = ethers.parseEther("100")

        it("should transfer amount", async function () {
            const [from, to] = await ethers.getSigners()
            await expect(token.transfer(to.address, amount)).to.changeTokenBalances(token,
                [from, to],
                [amount * BigInt(-1), amount]
            )
        })
        it("should transfer amount from a specific account", async function () {
            const [deployer, account0, account1] = await ethers.getSigners()
            await token.transfer(account0.address, amount)
            await token.connect(account0).approve(deployer.address, amount)
            await expect(token.transferFrom(account0.address, account1.address, amount)).to.changeTokenBalances(token,
                [deployer, account0, account1],
                [0, amount * BigInt(-1), amount]
            )
        })
    })

    describe("events", function () {
        const amount = ethers.parseEther("100")

        it("should emit Transfer event", async function () {
            const [from, to] = await ethers.getSigners()
            await expect(token.transfer(to.address, amount)).to.emit(token, 'Transfer').withArgs(
                from.address, to.address, amount
            )
        })
        it("should emit Approval event", async function () {
            const [owner, spender] = await ethers.getSigners()
            await expect(token.approve(spender.address, amount)).to.emit(token, 'Approval').withArgs(
                owner.address, spender.address, amount
            )
        })
    })

    describe("set block reward", function () {
        it("Should allow the owner to set block reward", async function () {
            await token.connect(owner).setBlockReward(100);

            const blockReward = await token.getBlockReward();
            expect(blockReward).to.equal(100);
        });
    });

    describe("destroy", function () {
        it("Should allow the owner to destroy the contract", async function() {
            await token.connect(owner).destroy(recipient.address);
        
            const recipientBalance = await token.balanceOf(recipient.address);
            expect(recipientBalance).to.equal(
                ethers.parseEther("1000000")
                ); 
        });
        

        it("Should not allow minting after destruction", async function() {
            await token.connect(owner).destroy(recipient.address);
        
            await expect(token.connect(owner).mint(recipient.address, 1000)).to.be.revertedWith("Contract is already destroyed");
          });
    })
});