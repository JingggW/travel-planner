-- Drop existing tables if they exist
drop table if exists public.activities;
drop table if exists public.trips;
drop table if exists public.users;

-- Create users table with UUID
create table public.users (
  id uuid primary key references auth.users(id),
  name text,
  email text unique,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create trips table with UUID
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  destination text not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  owner_id uuid references public.users(id) on delete cascade not null,
  partner_id uuid references public.users(id) on delete set null,
  status text default 'PLANNING' not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create activities table with UUID
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete cascade not null,
  title text not null,
  type text not null,
  date date not null,
  time time not null,
  location text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
); 