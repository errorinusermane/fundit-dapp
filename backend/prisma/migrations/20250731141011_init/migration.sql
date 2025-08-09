-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('user', 'company');

-- CreateEnum
CREATE TYPE "public"."ProposalStatus" AS ENUM ('ACTIVE', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."BidStatus" AS ENUM ('ACTIVE', 'SELECTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ContractStatus" AS ENUM ('ACTIVE', 'TERMINATED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Proposal" (
    "id" SERIAL NOT NULL,
    "proposer" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mandatoryRequirements" TEXT[],
    "enrollmentConditions" TEXT[],
    "optionalFeatures" TEXT[],
    "desiredStartDate" TIMESTAMP(3) NOT NULL,
    "minPremium" BIGINT NOT NULL,
    "maxPremium" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ProposalStatus" NOT NULL,
    "bidCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bid" (
    "id" SERIAL NOT NULL,
    "bidId" INTEGER NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "planTitle" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "outpatientCoveragePerVisit" INTEGER NOT NULL,
    "inpatientCoverage" INTEGER NOT NULL,
    "nonCoveredCoverage" INTEGER NOT NULL,
    "monthlyPremium" INTEGER NOT NULL,
    "contractPeriod" INTEGER NOT NULL,
    "ageEligibility" INTEGER NOT NULL,
    "occupationEligibility" TEXT NOT NULL,
    "voteCount" INTEGER NOT NULL,
    "minVotes" INTEGER NOT NULL,
    "status" "public"."BidStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contract" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "bidId" INTEGER NOT NULL,
    "userAddress" VARCHAR(42) NOT NULL,
    "companyAddress" VARCHAR(42) NOT NULL,
    "monthlyPremium" BIGINT NOT NULL,
    "contractPeriod" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "autoPayment" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."ContractStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RewardHistory" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bid_bidId_key" ON "public"."Bid"("bidId");

-- CreateIndex
CREATE INDEX "Bid_proposalId_idx" ON "public"."Bid"("proposalId");

-- CreateIndex
CREATE INDEX "Bid_company_idx" ON "public"."Bid"("company");

-- CreateIndex
CREATE INDEX "Bid_status_idx" ON "public"."Bid"("status");

-- CreateIndex
CREATE INDEX "Bid_createdAt_idx" ON "public"."Bid"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_contractId_key" ON "public"."Contract"("contractId");

-- CreateIndex
CREATE INDEX "Contract_userAddress_idx" ON "public"."Contract"("userAddress");

-- CreateIndex
CREATE INDEX "Contract_companyAddress_idx" ON "public"."Contract"("companyAddress");

-- CreateIndex
CREATE INDEX "Contract_proposalId_idx" ON "public"."Contract"("proposalId");

-- CreateIndex
CREATE INDEX "RewardHistory_address_idx" ON "public"."RewardHistory"("address");

-- AddForeignKey
ALTER TABLE "public"."Proposal" ADD CONSTRAINT "Proposal_proposer_fkey" FOREIGN KEY ("proposer") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bid" ADD CONSTRAINT "Bid_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "public"."Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bid" ADD CONSTRAINT "Bid_company_fkey" FOREIGN KEY ("company") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_companyAddress_fkey" FOREIGN KEY ("companyAddress") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RewardHistory" ADD CONSTRAINT "RewardHistory_address_fkey" FOREIGN KEY ("address") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
