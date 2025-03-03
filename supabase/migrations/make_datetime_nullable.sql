-- Make start_datetime and end_datetime nullable in trip_items table
ALTER TABLE "public"."trip_items"
ALTER COLUMN "start_datetime" DROP NOT NULL,
ALTER COLUMN "end_datetime" DROP NOT NULL; 