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
