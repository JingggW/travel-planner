-- Create a secure schema for our tables
create schema if not exists "public";

-- Create trips table with proper foreign key constraints
create table if not exists "public"."trips" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "title" text not null,
    "description" text,
    "location" text,
    "budget" decimal(10,2),
    "travel_partner" text,
    "start_date" date,
    "end_date" date,
    "user_id" uuid references auth.users not null,
    "shared_with_user_id" uuid references auth.users,
    primary key ("id")
);

-- Enable RLS on trips
alter table "public"."trips" enable row level security;

-- Create RLS policies for trips
create policy "Users can view their own trips"
    on "public"."trips"
    for select
    using (auth.uid() = user_id or auth.uid() = shared_with_user_id);

create policy "Users can insert their own trips"
    on "public"."trips"
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own trips"
    on "public"."trips"
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own trips"
    on "public"."trips"
    for delete
    using (auth.uid() = user_id);

-- Create trip items table
create table if not exists "public"."trip_items" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "trip_id" uuid references trips not null,
    "type" text not null check (type in ('activity', 'accommodation', 'transportation')),
    "title" text not null,
    "description" text,
    "start_datetime" timestamp with time zone,
    "end_datetime" timestamp with time zone,
    "location" text,
    primary key ("id")
);

-- Enable RLS on trip items
alter table "public"."trip_items" enable row level security;

-- Create RLS policies for trip items
create policy "Users can view trip items of their trips"
    on "public"."trip_items"
    for select
    using (
        exists (
            select 1 from trips
            where trips.id = trip_items.trip_id
            and (trips.user_id = auth.uid() or trips.shared_with_user_id = auth.uid())
        )
    );

create policy "Users can insert trip items to their trips"
    on "public"."trip_items"
    for insert
    with check (
        exists (
            select 1 from trips
            where trips.id = trip_items.trip_id
            and trips.user_id = auth.uid()
        )
    );

create policy "Users can update trip items of their trips"
    on "public"."trip_items"
    for update
    using (
        exists (
            select 1 from trips
            where trips.id = trip_items.trip_id
            and trips.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from trips
            where trips.id = trip_items.trip_id
            and trips.user_id = auth.uid()
        )
    );

create policy "Users can delete trip items of their trips"
    on "public"."trip_items"
    for delete
    using (
        exists (
            select 1 from trips
            where trips.id = trip_items.trip_id
            and trips.user_id = auth.uid()
        )
    ); 