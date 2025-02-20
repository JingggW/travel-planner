-- Drop existing policies
drop policy if exists "Users can read trips they own or are partnered in" on public.trips;
drop policy if exists "Users can insert their own trips" on public.trips;
drop policy if exists "Users can update trips they own" on public.trips;
drop policy if exists "Users can delete trips they own" on public.trips;
drop policy if exists "Users can view activities for trips they own or are partnered on" on public.activities;
drop policy if exists "Users can create activities for trips they own or are partnered on" on public.activities;
drop policy if exists "Users can update activities for trips they own or are partnered on" on public.activities;
drop policy if exists "Users can delete activities for trips they own or are partnered on" on public.activities;

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.trips enable row level security;
alter table public.activities enable row level security;

-- Grant necessary permissions
grant usage on schema public to postgres, anon, authenticated, service_role;

grant all on all tables in schema public to postgres, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to anon;

grant usage, select on all sequences in schema public to postgres, anon, authenticated, service_role;

-- Create policies for users table
create policy "Users can view and edit their own profile"
  on public.users for all
  using (auth.uid() = id);

-- Create policies for trips table
create policy "Users can read trips they own or are partnered in"
  on public.trips for select
  using (auth.uid() = owner_id or auth.uid() = partner_id);

create policy "Users can insert their own trips"
  on public.trips for insert
  with check (auth.uid() = owner_id);

create policy "Users can update trips they own"
  on public.trips for update
  using (auth.uid() = owner_id);

create policy "Users can delete trips they own"
  on public.trips for delete
  using (auth.uid() = owner_id);

-- Create policies for activities table
create policy "Users can read activities for their trips"
  on public.activities for select
  using (
    exists (
      select 1 from public.trips
      where trips.id = activities.trip_id
      and (trips.owner_id = auth.uid() or trips.partner_id = auth.uid())
    )
  );

create policy "Users can insert activities for their trips"
  on public.activities for insert
  with check (
    exists (
      select 1 from public.trips
      where trips.id = activities.trip_id
      and (trips.owner_id = auth.uid() or trips.partner_id = auth.uid())
    )
  );

create policy "Users can update activities for their trips"
  on public.activities for update
  using (
    exists (
      select 1 from public.trips
      where trips.id = activities.trip_id
      and (trips.owner_id = auth.uid() or trips.partner_id = auth.uid())
    )
  );

create policy "Users can delete activities for their trips"
  on public.activities for delete
  using (
    exists (
      select 1 from public.trips
      where trips.id = activities.trip_id
      and (trips.owner_id = auth.uid() or trips.partner_id = auth.uid())
    )
  ); 