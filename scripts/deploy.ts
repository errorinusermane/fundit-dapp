import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

// 배포 + ABI 복사 함수
async function deployAndSave(contractName: string, args: any[] = []) {
  const ContractFactory = await ethers.getContractFactory(contractName);
  const contract = await ContractFactory.deploy(...args);
  await contract.waitForDeployment();

  console.log(`✅ ${contractName} deployed to:`, contract.target);

  const artifactPath = path.join(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`);
  const destPath = path.join(__dirname, `../shared/abi/${contractName}.json`);
  fs.copyFileSync(artifactPath, destPath);

  console.log(`✅ ABI copied to shared/abi/${contractName}.json`);

  return contract.target as string; // 주소 반환
}

async function main() {
  // 순서 중요: Bid 먼저 배포
  const bidAddress = await deployAndSave("FunditBid");

  // Contract 배포 시 Bid 주소 전달
  await deployAndSave("FunditContract", [bidAddress]);

  // 나머지 컨트랙트 배포
  const others = ["FunditProposal", "FunditToken"];
  for (const name of others) {
    await deployAndSave(name);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
