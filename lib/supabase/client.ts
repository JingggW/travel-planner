import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const supabase = createClientComponentClient();

// Export a function to get a fresh client when needed
export const getSupabaseClient = () => createClientComponentClient();
