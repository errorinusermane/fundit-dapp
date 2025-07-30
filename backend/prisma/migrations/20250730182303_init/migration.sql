/*
  Warnings:

  - You are about to drop the `VerificationRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."VerificationRequest" DROP CONSTRAINT "VerificationRequest_contractId_fkey";

-- DropTable
DROP TABLE "public"."VerificationRequest";

-- DropEnum
DROP TYPE "public"."OracleVerificationStatus";
