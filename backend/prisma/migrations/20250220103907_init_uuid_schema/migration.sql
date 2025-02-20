/*
  Warnings:

  - The primary key for the `activities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `trips` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `partner_id` column on the `trips` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `activities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `trip_id` on the `activities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `trips` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `owner_id` on the `trips` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_partner_id_fkey";

-- AlterTable
ALTER TABLE "activities" DROP CONSTRAINT "activities_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "trip_id",
ADD COLUMN     "trip_id" UUID NOT NULL,
ADD CONSTRAINT "activities_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "trips" DROP CONSTRAINT "trips_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "owner_id",
ADD COLUMN     "owner_id" UUID NOT NULL,
DROP COLUMN "partner_id",
ADD COLUMN     "partner_id" UUID,
ADD CONSTRAINT "trips_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
