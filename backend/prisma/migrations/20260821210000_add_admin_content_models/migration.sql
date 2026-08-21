-- Add new optional fields used by the admin content screens.
ALTER TABLE "Message"
ADD COLUMN "phone" TEXT,
ADD COLUMN "category" TEXT;

ALTER TABLE "Event"
ADD COLUMN "category" TEXT,
ADD COLUMN "status" TEXT DEFAULT 'Yaklaşan',
ADD COLUMN "image" TEXT,
ADD COLUMN "capacity" INTEGER,
ADD COLUMN "targetAudience" TEXT;

-- CreateTable
CREATE TABLE "EventApplication" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT,
    "school" TEXT,
    "department" TEXT,
    "grade" TEXT,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Beklemede',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'polaroid',
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Genel',
    "team" TEXT NOT NULL DEFAULT 'N''apsak Ekibi',
    "status" TEXT NOT NULL DEFAULT 'Devam Eden',
    "date" TEXT,
    "location" TEXT,
    "summary" TEXT,
    "participantCount" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "rotation" TEXT DEFAULT '-rotate-1',
    "pinColor" TEXT DEFAULT 'text-[#0A5C3A]',
    "noteBg" TEXT DEFAULT 'bg-white',
    "borderColor" TEXT DEFAULT 'border-[#DDE7E1]',
    "badgeBg" TEXT DEFAULT 'bg-[#0A5C3A]',
    "badgeText" TEXT DEFAULT 'text-white',
    "mottoText" TEXT,
    "tagText" TEXT,
    "tapeColor" TEXT,
    "tapeRotation" TEXT,
    "youthStickerIconName" TEXT,
    "stickerBadgeBg" TEXT,
    "objectives" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "impactMetrics" TEXT,
    "outcomes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Magazine" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Magazine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventApplication" ADD CONSTRAINT "EventApplication_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
