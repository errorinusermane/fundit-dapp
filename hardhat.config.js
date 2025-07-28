require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.26",
  paths: {
    sources: "./contracts",           // contracts/FunditProposal.sol
    artifacts: "./artifacts", // ABI 경로는 루트 기준
    cache: "./cache",
  },
};
