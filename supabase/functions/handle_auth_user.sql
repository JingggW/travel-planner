-- Create a function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, name, created_at, updated_at)
  values (new.id, new.email, new.raw_user_meta_data->>'name', now(), now());
  return new;
end;
$$;

-- Create a trigger to call this function after an insert on auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 