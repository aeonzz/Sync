/*
  Warnings:

  - You are about to drop the column `name` on the `StudentData` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blurDataUrl` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `StudentData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `StudentData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middleName` to the `StudentData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "StudentData_name_key";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "blurDataUrl" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "StudentData" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "displayName",
ADD COLUMN     "coverUrl" TEXT NOT NULL DEFAULT 'https://jolfgowviyxdrvtelayh.supabase.co/storage/v1/object/public/static%20images/26993850_369183360223308_167538467966553831_n.png',
ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Comment" (
    "commendId" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "parentId" INTEGER,
    "userId" TEXT,
    "commentId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("commendId")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "bannerUrl" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("commendId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
