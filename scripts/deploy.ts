import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

// 배포 + ABI 복사 함수
async function deployAndSave(
  contractName: string,
  args: any[] = [],
  overrides: object = {}
): Promise<string> {
  const ContractFactory = await ethers.getContractFactory(contractName);
  const contract = await ContractFactory.deploy(...args, overrides);
  await contract.waitForDeployment();

  console.log(`✅ ${contractName} deployed to:`, contract.target);

  const artifactPath = path.join(
    __dirname,
    `../artifacts/contracts/${contractName}.sol/${contractName}.json`
  );
  const destPath = path.join(__dirname, `../shared/abi/${contractName}.json`);
  fs.copyFileSync(artifactPath, destPath);

  console.log(`✅ ABI copied to shared/abi/${contractName}.json`);

  return contract.target as string;
}

async function main() {
  // 1. FunditBid 배포
  const bidAddress = await deployAndSave("FunditBid");

  // 2. FunditContract 배포 (현재는 constructor 인자 없음)
  const contractAddress = await deployAndSave("FunditContract");

  // 3. FunditProposal 배포
  const proposalAddress = await deployAndSave("FunditProposal");

  // 4. FunditToken 배포
  const tokenAddress = await deployAndSave("FunditToken");

  // ✅ 필요한 경우 여기서 shared/constants.ts에 address 자동 등록 로직도 추가 가능
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
