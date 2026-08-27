-- Sync the database schema with the expanded CMS/admin models.

-- Role enum additions used by the new member/team management screens.
ALTER TYPE "Role" ADD VALUE 'MEMBER';
ALTER TYPE "Role" ADD VALUE 'TEAM_LEADER';

-- Indexes now declared on existing auth/application relations.
CREATE INDEX "Application_userId_idx" ON "Application"("userId");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- Preserve existing Member rows by renaming the table to the new model name.
ALTER TABLE "Member" RENAME TO "MemberProfile";
ALTER TABLE "MemberProfile" RENAME CONSTRAINT "Member_pkey" TO "MemberProfile_pkey";
ALTER INDEX "Member_externalId_key" RENAME TO "MemberProfile_externalId_key";
ALTER TABLE "MemberProfile"
ADD COLUMN "userId" INTEGER,
ADD COLUMN "bio" TEXT,
ADD COLUMN "avatar" TEXT,
ADD COLUMN "linkedin" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "school" TEXT,
ADD COLUMN "department" TEXT;
CREATE UNIQUE INDEX "MemberProfile_userId_key" ON "MemberProfile"("userId");
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Complete team model fields and relations.
ALTER TABLE "Team"
ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "leaderId" INTEGER;
CREATE INDEX "Team_leaderId_idx" ON "Team"("leaderId");
CREATE INDEX "Team_displayOrder_idx" ON "Team"("displayOrder");
ALTER TABLE "Team" ADD CONSTRAINT "Team_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "MemberProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Normalize member/team assignments into their own table.
CREATE TABLE "TeamMembership" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "subRole" TEXT,
    "isLeader" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMembership_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TeamMembership_memberId_teamId_key" ON "TeamMembership"("memberId", "teamId");
CREATE INDEX "TeamMembership_memberId_idx" ON "TeamMembership"("memberId");
CREATE INDEX "TeamMembership_teamId_idx" ON "TeamMembership"("teamId");
ALTER TABLE "TeamMembership" ADD CONSTRAINT "TeamMembership_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TeamMembership" ADD CONSTRAINT "TeamMembership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "TeamMembership" ("memberId", "teamId", "roleTitle", "subRole", "isLeader")
SELECT
    "MemberProfile"."id",
    "Team"."id",
    COALESCE("membership"."value" ->> 'role', "MemberProfile"."primaryRole"),
    "membership"."value" ->> 'subRole',
    (
        COALESCE("membership"."value" ->> 'role', '') ILIKE '%başkan%'
        OR COALESCE("membership"."value" ->> 'role', '') ILIKE '%baskan%'
        OR COALESCE("membership"."value" ->> 'role', '') ILIKE '%baÅŸkan%'
    )
FROM "MemberProfile"
CROSS JOIN LATERAL jsonb_array_elements("MemberProfile"."memberships") AS "membership"("value")
JOIN "Team" ON lower("Team"."title") = lower("membership"."value" ->> 'team')
ON CONFLICT ("memberId", "teamId") DO NOTHING;
ALTER TABLE "MemberProfile" DROP COLUMN "memberships";

-- Expanded event CMS fields.
ALTER TABLE "Event"
ADD COLUMN "slug" TEXT,
ADD COLUMN "shortDescription" TEXT,
ADD COLUMN "content" TEXT,
ADD COLUMN "publicationStatus" TEXT NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "registrationEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "registrationDeadline" TIMESTAMP(3),
ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
CREATE INDEX "Event_publicationStatus_idx" ON "Event"("publicationStatus");
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");
CREATE INDEX "EventApplication_eventId_idx" ON "EventApplication"("eventId");

-- Expanded activity/report/magazine CMS fields.
ALTER TABLE "Activity"
ADD COLUMN "slug" TEXT,
ADD COLUMN "publicationStatus" TEXT NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;
CREATE UNIQUE INDEX "Activity_slug_key" ON "Activity"("slug");
CREATE INDEX "Activity_publicationStatus_idx" ON "Activity"("publicationStatus");

ALTER TABLE "Report"
ADD COLUMN "slug" TEXT,
ADD COLUMN "category" TEXT,
ADD COLUMN "summary" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "fileName" TEXT,
ADD COLUMN "fileSize" TEXT,
ADD COLUMN "pdfUrl" TEXT,
ADD COLUMN "coverImage" TEXT,
ADD COLUMN "readCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "downloadCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "publishDate" TEXT,
ADD COLUMN "publicationStatus" TEXT NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX "Report_slug_key" ON "Report"("slug");
CREATE INDEX "Report_publicationStatus_idx" ON "Report"("publicationStatus");
CREATE INDEX "Report_displayOrder_idx" ON "Report"("displayOrder");

ALTER TABLE "Magazine"
ADD COLUMN "slug" TEXT,
ADD COLUMN "issueNumber" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "pages" INTEGER NOT NULL DEFAULT 36,
ADD COLUMN "publishDate" TEXT,
ADD COLUMN "readCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "pdfUrl" TEXT,
ADD COLUMN "coverImage" TEXT,
ADD COLUMN "publicationStatus" TEXT NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX "Magazine_slug_key" ON "Magazine"("slug");
CREATE INDEX "Magazine_publicationStatus_idx" ON "Magazine"("publicationStatus");
CREATE INDEX "Magazine_displayOrder_idx" ON "Magazine"("displayOrder");

-- New page/navigation/media/news/homepage CMS tables.
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "publicationStatus" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "showInMenu" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "featuredImage" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
CREATE INDEX "Page_publicationStatus_idx" ON "Page"("publicationStatus");

CREATE TABLE "NavigationItem" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "targetType" TEXT NOT NULL DEFAULT 'PAGE',
    "href" TEXT,
    "pageId" INTEGER,
    "parentId" INTEGER,
    "location" TEXT NOT NULL DEFAULT 'NAVBAR',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "openInNewTab" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavigationItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "NavigationItem_pageId_idx" ON "NavigationItem"("pageId");
CREATE INDEX "NavigationItem_parentId_idx" ON "NavigationItem"("parentId");
CREATE INDEX "NavigationItem_location_idx" ON "NavigationItem"("location");
ALTER TABLE "NavigationItem" ADD CONSTRAINT "NavigationItem_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NavigationItem" ADD CONSTRAINT "NavigationItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavigationItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "title" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "folder" TEXT NOT NULL DEFAULT 'general',
    "storageKey" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Media_filename_key" ON "Media"("filename");
CREATE INDEX "Media_folder_idx" ON "Media"("folder");
CREATE INDEX "Media_deletedAt_idx" ON "Media"("deletedAt");

CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT,
    "category" TEXT DEFAULT 'Duyuru',
    "publishDate" TEXT,
    "readTime" TEXT DEFAULT '3 dk',
    "publicationStatus" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "quoteText" TEXT,
    "quoteAuthor" TEXT,
    "quoteTitle" TEXT,
    "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");
CREATE INDEX "News_publicationStatus_idx" ON "News"("publicationStatus");
CREATE INDEX "News_isFeatured_idx" ON "News"("isFeatured");
CREATE INDEX "News_displayOrder_idx" ON "News"("displayOrder");
CREATE INDEX "News_createdAt_idx" ON "News"("createdAt");

CREATE TABLE "HomepageHero" (
    "id" SERIAL NOT NULL,
    "badge" TEXT DEFAULT 'GenÃ§lik TopluluÄŸu',
    "title" TEXT NOT NULL,
    "highlightText" TEXT,
    "description" TEXT NOT NULL,
    "primaryCtaText" TEXT DEFAULT 'Ekiplerimizi KeÅŸfet',
    "primaryCtaLink" TEXT DEFAULT '/ekipler',
    "secondaryCtaText" TEXT DEFAULT 'Bize KatÄ±l',
    "secondaryCtaLink" TEXT DEFAULT '/katilim',
    "imageUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageHero_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "HomepageHero_isActive_idx" ON "HomepageHero"("isActive");
CREATE INDEX "HomepageHero_displayOrder_idx" ON "HomepageHero"("displayOrder");

CREATE TABLE "HomepageConfig" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageConfig_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "HomepageConfig_key_key" ON "HomepageConfig"("key");
