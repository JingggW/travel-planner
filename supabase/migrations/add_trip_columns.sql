-- Add new columns to trips table
ALTER TABLE "public"."trips"
ADD COLUMN IF NOT EXISTS "location" text,
ADD COLUMN IF NOT EXISTS "budget" decimal(10,2),
ADD COLUMN IF NOT EXISTS "travel_partner" text; 