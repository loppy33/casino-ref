-- CreateTable
CREATE TABLE "Bonus" (
    "id" TEXT NOT NULL,
    "casinoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bonusUrl" TEXT,
    "promocode" TEXT,

    CONSTRAINT "Bonus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bonus" ADD CONSTRAINT "Bonus_casinoId_fkey" FOREIGN KEY ("casinoId") REFERENCES "Casino"("id") ON DELETE CASCADE ON UPDATE CASCADE;
