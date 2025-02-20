-- Insert existing auth users into public.users if they don't exist
insert into public.users (id, email, created_at, updated_at)
select 
  id,
  email,
  created_at,
  created_at as updated_at
from auth.users
where not exists (
  select 1 
  from public.users 
  where users.id = auth.users.id
); 