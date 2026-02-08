CREATE EXTENSION IF NOT EXISTS postgis;
-- CreateTable
CREATE TABLE "victim" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emergency_type" TEXT NOT NULL,
    "status" TEXT DEFAULT 'open',
    "location" geography(Point, 4326),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "disasterId" UUID,

    CONSTRAINT "victim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "is_available" BOOLEAN DEFAULT true,
    "location" geography(Point, 4326),
    "last_updated" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disaster" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" geography(Point, 4326),
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "victim_email_key" ON "victim"("email");

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_email_key" ON "volunteer"("email");

-- AddForeignKey
ALTER TABLE "victim" ADD CONSTRAINT "victim_disasterId_fkey" FOREIGN KEY ("disasterId") REFERENCES "disaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
