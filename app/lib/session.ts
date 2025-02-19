import { supabase } from "@/lib/supabase/client";

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
