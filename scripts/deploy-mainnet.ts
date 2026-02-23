import { ethers, run, network } from "hardhat";

async function main() {
    console.log("Starting Mainnet Deployment for CricChain...");
    console.log(`Deploying to network: ${network.name}`);

    // Fetch deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.provider.getBalance(deployer.address);
    console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

    if (balance === 0n) {
        throw new Error("Insufficient funds for deployment.");
    }

    // Deploy Mock USDT (If deploying to a testnet like Sepolia/Mumbai, otherwise use real USDT address)
    let usdtAddress = process.env.MAINNET_USDT_ADDRESS;

    if (!usdtAddress && network.name !== 'mainnet') {
        console.log("No USDT address provided. Deploying Mock USDT...");
        const MockUSDT = await ethers.getContractFactory("MockUSDT");
        const usdt = await MockUSDT.deploy();
        await usdt.waitForDeployment();
        usdtAddress = await usdt.getAddress();
        console.log(`Mock USDT deployed to: ${usdtAddress}`);
    } else if (!usdtAddress) {
        throw new Error("MAINNET_USDT_ADDRESS must be set in .env for production deployment.");
    }

    // Deploy Main CricChain Prediction Market Contract
    console.log("Deploying PredictionMarket contract...");
    const PredictionMarket = await ethers.getContractFactory("CricChainMarket");
    // Assuming constructor takes USDT address and a fee wallet
    const feeWallet = process.env.FEE_WALLET_ADDRESS || deployer.address;
    const market = await PredictionMarket.deploy(usdtAddress, feeWallet);

    await market.waitForDeployment();
    const marketAddress = await market.getAddress();

    console.log(`PredictionMarket deployed to: ${marketAddress}`);

    // Wait for a few block confirmations before verifying
    console.log("Waiting for block confirmations to verify contract...");
    const WAIT_BLOCK_CONFIRMATIONS = 6;
    await market.deploymentTransaction()?.wait(WAIT_BLOCK_CONFIRMATIONS);

    console.log("Verifying contract on Etherscan/Polygonscan...");
    try {
        await run("verify:verify", {
            address: marketAddress,
            constructorArguments: [usdtAddress, feeWallet],
        });
        console.log("Contract verified successfully!");
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!");
        } else {
            console.log("Verification error:", e);
        }
    }

    console.log("\nDeployment Complete!");
    console.log("=========================================");
    console.log(`Network: ${network.name}`);
    console.log(`USDT Token: ${usdtAddress}`);
    console.log(`Prediction Market: ${marketAddress}`);
    console.log(`Fee Wallet: ${feeWallet}`);
    console.log("=========================================");
    console.log("Please update your production .env NEXT_PUBLIC_CONTRACT_ADDRESS with the Prediction Market address.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
