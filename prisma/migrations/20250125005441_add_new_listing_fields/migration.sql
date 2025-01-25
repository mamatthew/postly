-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "city" TEXT,
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "postalCode" TEXT NOT NULL DEFAULT '';
