const hre = require("hardhat");
require("dotenv").config()

async function main() {
    const SNFT = await hre.ethers.getContractFactory("SNFT");
    const sNFT = await SNFT.deploy();

    await sNFT.waitForDeployment();

    await sNFT.mint(process.env.RECV_ADDR, 0, process.env.NFT_METADATA)

    console.log("Token addr: ", (await sNFT.getAddress()).toString());
    console.log("minted")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
