import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

// 배포 + ABI 복사 함수
async function deployAndSave(contractName: string) {
  const ContractFactory = await ethers.getContractFactory(contractName);
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();

  console.log(`✅ ${contractName} deployed to:`, contract.target);

  const artifactPath = path.join(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`);
  const destPath = path.join(__dirname, `../shared/abi/${contractName}.json`);
  fs.copyFileSync(artifactPath, destPath);

  console.log(`✅ ABI copied to shared/abi/${contractName}.json`);
}

async function main() {
  const contracts = ["FunditProposal", "FunditBid", "FunditContract", "FunditToken", "FunditOracle"];

  for (const name of contracts) {
    await deployAndSave(name);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
