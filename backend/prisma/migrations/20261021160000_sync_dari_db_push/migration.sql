-- Baseline: perubahan yang sebelumnya diterapkan lewat prisma db push (Jul–Okt 2026).
-- Di production sudah ditandai applied (migrate resolve); di DB baru dijalankan normal.

-- DropIndex
DROP INDEX "registrations_eventId_memberId_key";

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "references" TEXT;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'umum',
ADD COLUMN     "presensiCode" TEXT;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nim" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "registrations" ADD COLUMN     "email" TEXT,
ADD COLUMN     "institution" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "nim" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "presensiIp" TEXT,
ALTER COLUMN "memberId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "event" TEXT,
    "category" TEXT NOT NULL DEFAULT 'konferensi',
    "initials" TEXT NOT NULL,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "officers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'bph',
    "order" INTEGER NOT NULL DEFAULT 0,
    "photo" TEXT,
    "initials" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "officers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "official_letters" (
    "id" TEXT NOT NULL,
    "letterNumber" TEXT NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "divisionCode" TEXT,
    "committeeCode" TEXT,
    "subject" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientOrg" TEXT,
    "eventDate" TIMESTAMP(3),
    "contentData" JSONB,
    "withSignature" BOOLEAN NOT NULL DEFAULT true,
    "withStamp" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'ISSUED',
    "filePdfUrl" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "official_letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "letter_sequences" (
    "year" INTEGER NOT NULL,
    "scopeKey" TEXT NOT NULL DEFAULT 'GLOBAL',
    "lastSeq" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "letter_sequences_pkey" PRIMARY KEY ("year","scopeKey")
);

-- CreateIndex
CREATE UNIQUE INDEX "official_letters_letterNumber_key" ON "official_letters"("letterNumber");

-- CreateIndex
CREATE INDEX "official_letters_letterNumber_idx" ON "official_letters"("letterNumber");

-- CreateIndex
CREATE INDEX "official_letters_subjectCode_idx" ON "official_letters"("subjectCode");

-- CreateIndex
CREATE INDEX "official_letters_issuedAt_idx" ON "official_letters"("issuedAt");

-- CreateIndex
CREATE UNIQUE INDEX "members_nim_key" ON "members"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "members_resetToken_key" ON "members"("resetToken");

-- AddForeignKey
ALTER TABLE "official_letters" ADD CONSTRAINT "official_letters_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

