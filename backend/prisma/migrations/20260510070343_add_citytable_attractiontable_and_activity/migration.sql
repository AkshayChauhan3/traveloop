-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT,
    "population" TEXT,
    "averageDailyCost" DOUBLE PRECISION,
    "bestSeason" TEXT,
    "language" TEXT,
    "currency" TEXT,
    "vibe" TEXT,
    "imageUrl" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attraction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "ticketPrice" DOUBLE PRECISION,
    "availabilityTime" TEXT,
    "cityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "duration" TEXT,
    "costRange" TEXT,
    "imageUrl" TEXT,
    "availabilityTime" TEXT,
    "cityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attraction" ADD CONSTRAINT "Attraction_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
