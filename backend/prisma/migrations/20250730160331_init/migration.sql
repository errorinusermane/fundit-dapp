-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('user', 'company');

-- CreateEnum
CREATE TYPE "public"."OracleVerificationStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

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
    "id" BIGINT NOT NULL,
    "proposer" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverageAmount" BIGINT NOT NULL,
    "premium" BIGINT NOT NULL,
    "deadline" BIGINT NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bid" (
    "id" SERIAL NOT NULL,
    "proposalId" BIGINT NOT NULL,
    "bidder" TEXT NOT NULL,
    "coverageOffer" BIGINT NOT NULL,
    "premiumOffer" BIGINT NOT NULL,
    "timestamp" BIGINT NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contract" (
    "id" SERIAL NOT NULL,
    "proposalId" BIGINT NOT NULL,
    "bidId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "coverageAmount" BIGINT NOT NULL,
    "premium" BIGINT NOT NULL,
    "startDate" INTEGER NOT NULL,
    "endDate" INTEGER NOT NULL,
    "nextPaymentDue" INTEGER NOT NULL,
    "autoPayment" BOOLEAN NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationRequest" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "requester" TEXT NOT NULL,
    "evidenceHash" TEXT NOT NULL,
    "status" "public"."OracleVerificationStatus" NOT NULL,
    "timestamp" BIGINT NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RewardEvent" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "timestamp" BIGINT NOT NULL,

    CONSTRAINT "RewardEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_proposalId_key" ON "public"."Contract"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_bidId_key" ON "public"."Contract"("bidId");

-- AddForeignKey
ALTER TABLE "public"."Proposal" ADD CONSTRAINT "Proposal_proposer_fkey" FOREIGN KEY ("proposer") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bid" ADD CONSTRAINT "Bid_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "public"."Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bid" ADD CONSTRAINT "Bid_bidder_fkey" FOREIGN KEY ("bidder") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "public"."Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "public"."Bid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerificationRequest" ADD CONSTRAINT "VerificationRequest_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RewardEvent" ADD CONSTRAINT "RewardEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
