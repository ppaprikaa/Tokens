const hre = require("hardhat");

async function main() {
    const SToken = await hre.ethers.getContractFactory("SToken");
    const sToken = await SToken.deploy();

    await sToken.waitForDeployment();
    console.log("Token addr: ", (await sToken.getAddress()).toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
