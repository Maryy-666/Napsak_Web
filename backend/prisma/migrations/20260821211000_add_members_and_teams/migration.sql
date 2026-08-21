-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "primaryTeam" TEXT NOT NULL,
    "primaryRole" TEXT NOT NULL,
    "memberships" JSONB NOT NULL,
    "isPresident" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "iconName" TEXT NOT NULL DEFAULT 'cpu',
    "bgImage" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "focusAreas" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "whatWeDo" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "structure" TEXT NOT NULL,
    "featuredSectionImage" TEXT,
    "galleryTitle" TEXT,
    "gallery" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_externalId_key" ON "Member"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_externalId_key" ON "Team"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "Team"("slug");
