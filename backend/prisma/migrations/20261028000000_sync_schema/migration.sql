-- CreateEnum
CREATE TYPE "PositionApplicationStatus" AS ENUM ('NEW', 'IN_REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "team" SET DEFAULT 'Ne Yapsak Ekibi';

-- AlterTable
ALTER TABLE "HomepageHero" ALTER COLUMN "badge" SET DEFAULT 'Gençlik Derneği',
ALTER COLUMN "primaryCtaText" SET DEFAULT 'Ekiplerimizi Keşfet',
ALTER COLUMN "secondaryCtaText" SET DEFAULT 'Bize Katıl';

-- AlterTable
ALTER TABLE "MemberProfile" ADD COLUMN     "bioEn" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "educationEn" TEXT,
ADD COLUMN     "expertise" TEXT,
ADD COLUMN     "expertiseEn" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "responsibilities" TEXT,
ADD COLUMN     "responsibilitiesEn" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "twitter" TEXT;

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "team" TEXT NOT NULL,
    "teamEn" TEXT,
    "teamCategory" TEXT NOT NULL DEFAULT 'iletisim',
    "shortDescription" TEXT NOT NULL,
    "shortDescriptionEn" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "responsibilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "responsibilitiesEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requirementsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredQualifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredQualificationsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "workType" TEXT NOT NULL DEFAULT 'Gönüllü',
    "workTypeEn" TEXT DEFAULT 'Volunteer / Remote',
    "location" TEXT NOT NULL DEFAULT 'Uzaktan / Çevrim İçi',
    "locationEn" TEXT DEFAULT 'Remote / Online',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionApplication" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "positionId" INTEGER NOT NULL,
    "phone" TEXT,
    "school" TEXT,
    "department" TEXT,
    "cvUrl" TEXT,
    "whyApply" TEXT,
    "experience" TEXT,
    "customAnswers" JSONB,
    "status" "PositionApplicationStatus" NOT NULL DEFAULT 'NEW',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PositionApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "logo" TEXT,
    "websiteUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Paydaş',
    "categoryEn" TEXT DEFAULT 'Partner',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Position_slug_key" ON "Position"("slug");

-- CreateIndex
CREATE INDEX "Position_isActive_idx" ON "Position"("isActive");

-- CreateIndex
CREATE INDEX "Position_displayOrder_idx" ON "Position"("displayOrder");

-- CreateIndex
CREATE INDEX "PositionApplication_userId_idx" ON "PositionApplication"("userId");

-- CreateIndex
CREATE INDEX "PositionApplication_positionId_idx" ON "PositionApplication"("positionId");

-- CreateIndex
CREATE INDEX "PositionApplication_status_idx" ON "PositionApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PositionApplication_userId_positionId_key" ON "PositionApplication"("userId", "positionId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_slug_key" ON "Partner"("slug");

-- CreateIndex
CREATE INDEX "Partner_isActive_idx" ON "Partner"("isActive");

-- CreateIndex
CREATE INDEX "Partner_displayOrder_idx" ON "Partner"("displayOrder");

-- CreateIndex
CREATE INDEX "Partner_category_idx" ON "Partner"("category");

-- CreateIndex
CREATE INDEX "MemberProfile_slug_idx" ON "MemberProfile"("slug");

-- AddForeignKey
ALTER TABLE "PositionApplication" ADD CONSTRAINT "PositionApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionApplication" ADD CONSTRAINT "PositionApplication_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

