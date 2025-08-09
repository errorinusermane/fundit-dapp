// scripts/deploy.ts


import hardhat from "hardhat";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const { ethers, artifacts } = hardhat;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 👀 디버깅 로그
console.log("👀 Main file loaded.");

async function deployAndSave(
  contractName: string,
  args: any[] = [],
  overrides: object = {}
): Promise<string> {
  try {
    console.log(`🚀 Deploying ${contractName}...`);

    const ContractFactory = await ethers.getContractFactory(contractName);
    const contract = await ContractFactory.deploy(...args, overrides);
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log(`✅ ${contractName} deployed to: ${address}`);

    const artifact = await artifacts.readArtifact(contractName);
    const destPath = path.join(__dirname, `../shared/abi/${contractName}.json`);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, JSON.stringify(artifact.abi, null, 2));
    console.log(`📄 ABI saved to shared/abi/${contractName}.json`);

    return address;
  } catch (error: any) {
    console.error(`❌ Failed to deploy ${contractName}:`, error.message || error);
    throw error;
  }
}

async function main() {
  console.log("🔥 Starting deployment...");

  const deployedAddresses: Record<string, string> = {};

  try {
    deployedAddresses.FunditBid = await deployAndSave("FunditBid");
    deployedAddresses.FunditContract = await deployAndSave("FunditContract");
    deployedAddresses.FunditProposal = await deployAndSave("FunditProposal");
    deployedAddresses.FunditToken = await deployAndSave("FunditToken");

    const constantsPath = path.join(__dirname, "../shared/constants.ts");
    const constantsContent = `// Auto-generated on ${new Date().toISOString()}
export const CONTRACT_ADDRESSES = ${JSON.stringify(deployedAddresses, null, 2)};
`;
    fs.writeFileSync(constantsPath, constantsContent);
    console.log(`📦 Contract addresses saved to shared/constants.ts`);
  } catch (err) {
    console.error("💥 Deployment script failed.");
    process.exit(1);
  }
}

main();
