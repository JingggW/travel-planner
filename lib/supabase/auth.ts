import { supabase } from "./client";
import { AuthError, Session, User } from "@supabase/supabase-js";

// Generic auth error handler
const handleAuthError = (error: AuthError) => {
  console.error("Auth error:", error.message);
  return { error: error.message };
};

// Email/password signup
export const handleSignUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return error
    ? handleAuthError(error)
    : { user: data.user, session: data.session };
};

// Email/password login
export const handleSignIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return error
    ? handleAuthError(error)
    : { user: data.user, session: data.session };
};

// Social login (redirect-based OAuth)
export const handleSocialLogin = async (provider: "google" | "github") => {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider });

  if (error) return handleAuthError(error);

  return { url: data.url }; // Redirect URL for OAuth flow
};

// Fetch user session after OAuth redirect
export const getUserSession = async (): Promise<{
  user: User | null;
  session: Session | null;
}> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Session fetch error:", error.message);
    return { user: null, session: null };
  }

  return { user: data.session?.user || null, session: data.session };
};
