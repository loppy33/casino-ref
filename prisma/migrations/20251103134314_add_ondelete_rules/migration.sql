-- DropForeignKey
ALTER TABLE "public"."AffiliateLink" DROP CONSTRAINT "AffiliateLink_casinoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Click" DROP CONSTRAINT "Click_casinoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Click" DROP CONSTRAINT "Click_linkId_fkey";

-- AddForeignKey
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_casinoId_fkey" FOREIGN KEY ("casinoId") REFERENCES "Casino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_casinoId_fkey" FOREIGN KEY ("casinoId") REFERENCES "Casino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "AffiliateLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
