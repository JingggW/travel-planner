-- Create a secure schema for our tables
create schema if not exists "public";

-- Create trips table with proper foreign key constraints
create table if not exists "public"."trips" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "title" text not null,
    "description" text,
    "start_date" date,
    "end_date" date,
    "user_id" uuid references auth.users not null,
    "shared_with_user_id" uuid references auth.users,
    primary key ("id")
);

-- Enable RLS on trips
alter table "public"."trips" enable row level security;

-- Create RLS policies
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