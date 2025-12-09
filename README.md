# Fundit – 보험 × 블록체인 크라우드 펀딩 플랫폼

**보험 상품의 펀딩화를 위한 탈중앙화 플랫폼 (2025)**

Fundit은 보험 상품을 크라우드 펀딩 방식으로 구조화하여, 투자자와 보험 가입자를 블록체인으로 직접 연결하는 플랫폼입니다.  
온체인 연산 비용을 최소화하기 위해 **하이브리드 아키텍처**를 채택했으며, 민감하지 않은 데이터는 오프체인에서 처리하여 비용 효율성과 무결성을 동시에 확보했습니다.

## 주요 기능 및 아키텍처
- 🏗️ **하이브리드 아키텍처**: 온체인(스마트 컨트랙트) + 오프체인(Node.js 서버) 분산 구조로 gas cost 최소화
- 📊 **데이터 흐름 최적화**: 사용자–스마트 컨트랙트–서버 간 데이터 흐름 분석을 통해 효율적인 트랜잭션 설계
- 🎯 **펀딩 제안 시스템**: 보험 상품을 제안서 형태로 등록하고 투자자의 입찰을 받음
- 🤝 **스마트 컨트랙트 기반 계약**: 투명하고 자동화된 계약 체결 및 정산
- 💰 **에스크로 결제**: 블록체인 기반 안전한 자금 관리
- 🪙 **토큰 인센티브**: 플랫폼 활동에 대한 FunditToken(FDT) 보상

## 성과
**Base 공모전 대상(1등) 수상**


## 프로젝트 구조

```
fundit-dapp/
├── contracts/            # Solidity 스마트 컨트랙트
│   ├── FunditProposal.sol
│   ├── FunditBid.sol
│   ├── FunditContract.sol
│   ├── FunditToken.sol
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
│   │       └── useToken.ts
│   └── navigation/
│       └── RootNavigator.tsx
├── shared/               # ABI, 타입, 공통 상수
│   ├── abi/
│   │   ├── FunditProposal.json
│   │   ├── FunditBid.json
│   │   ├── FunditContract.json
│   │   └── FunditToken.json
│   ├── types/
│   │   ├── proposal.ts
│   │   ├── bid.ts
│   │   ├── contract.ts
│   │   └── token.ts
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
```

## 개발 명령어

### IP 확인
```bash
ipconfig getifaddr en0
```

### 백엔드 DB 접속
# aws에서는 fundituser, funditpass

```bash
psql -h 127.0.0.1 -U fundituser -d fundit
```
**환경 변수 설정**
- 로컬 env: `DATABASE_URL: "postgresql://fundituser:funditpass@localhost:5432/fundit"`
- 배포 env: `DATABASE_URL: "postgresql://postgres:funditpass@fundit-db.cjw40k4kwb6e.ap-northeast-2.rds.amazonaws.com:5432/fundit?schema=public"`

```bash
npx prisma migrate dev
```

### 백엔드 실행
```bash
cd backend
npm run dev
```

### AWS 배포
```bash
npm run build
npm start

rm -rf node_modules
zip -r deploy/backend-deploy-v13.zip dist prisma package.json package-lock.json .ebextensions
npm install
```
