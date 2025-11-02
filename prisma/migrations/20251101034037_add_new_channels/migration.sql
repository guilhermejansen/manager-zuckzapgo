/*
  Warnings:

  - The values [CHANNEL] on the enum `ContactType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContactType_new" AS ENUM ('INDIVIDUAL', 'LID', 'GROUP', 'NEWSLETTER', 'BROADCAST', 'BOT', 'HOSTED', 'HOSTED_LID', 'MESSENGER', 'INTEROP', 'STATUS');
ALTER TABLE "public"."Contact" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "public"."ContactList" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "ContactList" ALTER COLUMN "type" TYPE "ContactType_new" USING ("type"::text::"ContactType_new");
ALTER TABLE "Contact" ALTER COLUMN "type" TYPE "ContactType_new" USING ("type"::text::"ContactType_new");
ALTER TYPE "ContactType" RENAME TO "ContactType_old";
ALTER TYPE "ContactType_new" RENAME TO "ContactType";
DROP TYPE "public"."ContactType_old";
ALTER TABLE "Contact" ALTER COLUMN "type" SET DEFAULT 'INDIVIDUAL';
ALTER TABLE "ContactList" ALTER COLUMN "type" SET DEFAULT 'INDIVIDUAL';
COMMIT;
