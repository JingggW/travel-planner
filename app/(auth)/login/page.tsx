"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleSignIn, handleSocialLogin } from "@/lib/supabase/auth";
import AuthForm from "@/app/components/auth/AuthForm";
import SocialButtons from "@/app/components/auth/SocialButtons";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const supabase = createClientComponentClient();

  // Check if already authenticated
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Current session:", session ? "present" : "none");
      if (session) {
        console.log("User already authenticated, redirecting to:", redirectTo);
        router.push(redirectTo);
      }
    };
    checkSession();
  }, [redirectTo, router, supabase.auth]);

  const handleSubmit = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError("");
      console.log("Starting login process, will redirect to:", redirectTo);

      const result = await handleSignIn(email, password);

      if ("error" in result) {
        console.error("Login failed:", result.error);
        setError(result.error);
        toast.error("Failed to sign in");
      } else {
        console.log("Login successful, redirecting to:", redirectTo);
        toast.success("Signed in successfully");
        router.push(redirectTo);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <AuthForm
        type="login"
        onSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
      <SocialButtons onSocialLogin={handleSocialLogin} />
    </div>
  );
}
