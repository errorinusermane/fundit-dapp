fundit-dapp/
├── contracts/            # Solidity 스마트 컨트랙트
│   ├── FunditProposal.sol
│   ├── FunditBid.sol
│   ├── FunditContract.sol
│   ├── FunditToken.sol
│   ├── FunditOracle.sol
│   ├── interfaces/
│   └── utils/
├── backend/              # Node.js 백엔드 (Express + viem)
│   ├── server.ts
│   ├── routes/
│   │   ├── proposals.routes.ts
│   │   ├── bids.routes.ts
│   │   ├── contracts.routes.ts
│   │   ├── auth.routes.ts
│   │   └── rewards.routes.ts
│   ├── services/
│   │   ├── proposal.service.ts
│   │   ├── bid.service.ts
│   │   ├── contract.service.ts
│   │   ├── token.service.ts
│   │   └── oracle.service.ts
│   ├── utils/
│   ├── middleware/
│   └── config/
│       └── constants.ts
├── app/                  # React Native 프론트엔드
│   ├── App.tsx
│   ├── pages/
│   │   ├── LoginScreen.tsx
│   │   ├── ProposalList.tsx
│   │   ├── ProposalDetail.tsx
│   │   ├── CreateProposal.tsx
│   │   ├── SubmitBid.tsx
│   │   ├── MyProposals.tsx
│   │   ├── MyBids.tsx
│   │   ├── MyContracts.tsx
│   │   ├── Rewards.tsx
│   │   └── Wallet.tsx
│   ├── components/
│   │   ├── CommonButton.tsx
│   │   ├── ProposalCard.tsx
│   │   ├── BidCard.tsx
│   │   ├── RewardItem.tsx
│   │   └── AlertMessage.tsx
│   ├── api/
│   │   └── contract/
│   │       ├── useProposal.ts
│   │       ├── useBid.ts
│   │       ├── useContract.ts
│   │       ├── useToken.ts
│   │       └── useOracle.ts
│   └── navigation/
│       └── RootNavigator.tsx
├── shared/               # ABI, 타입, 공통 상수
│   ├── abi/
│   │   ├── FunditProposal.json
│   │   ├── FunditBid.json
│   │   ├── FunditContract.json
│   │   ├── FunditToken.json
│   │   └── FunditOracle.json
│   ├── types/
│   │   ├── proposal.ts
│   │   ├── bid.ts
│   │   ├── contract.ts
│   │   ├── token.ts
│   │   └── oracle.ts
│   └── constants.ts
├── scripts/              # 배포 및 검증, 시드 데이터
│   ├── deploy.ts
│   ├── verify.ts
│   └── seed.ts
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── hardhat.config.js
└── README.md

# =============================================== #

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use --delete-prefix v20.19.4
source ~/.zshrc
nvm use 20

# clean 필수!!
# 1. 컴파일, sol 배포는 루트에서
# 1. 따라서 sol 관련 pnpm 같은 거 설치할 때 전부 루트에서!
npx hardhat clean
npx hardhat compile
npx hardhat run scripts/deploy.ts --network hardhat

# =============================================== #

작업 순서
- 우선 프로젝트 폴더와 파일 전부 만듦
- 초기설정 진행. .eslintrc, .prettierrc, tsconfig, .gitignore
- 초기화 진행
-- cd ..
pnpm init
pnpm add -D hardhat @nomicfoundation/hardhat-toolbox
npx hardhat
-- cd ..
cd backend
pnpm init
pnpm add express viem cors dotenv
pnpm add -D typescript ts-node-dev @types/node @types/express
-- cd ..
npx @react-native-community/cli init app

cd app
rm -rf node_modules package-lock.json
pnpm install
pnpm add axios

