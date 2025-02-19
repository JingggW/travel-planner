"use client";

import { useState } from "react";
import { handleSignUp, handleSocialLogin } from "@/lib/supabase/auth";
import AuthForm from "@/app/components/auth/AuthForm";
import SocialButtons from "@/app/components/auth/SocialButtons";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    const result = await handleSignUp(email, password);
    console.log(result);
    if ("error" in result) {
      setError(result.error);
    } else {
      // Redirect to onboarding after successful signup
      router.push("/onboarding");
    }
  };

  const handleSocialSignup = async (provider: "google" | "github") => {
    const result = await handleSocialLogin(provider);
    if ("error" in result) {
      setError(result.error);
      return { error: result.error };
    } else if (result.url) {
      // Social login will redirect to /auth/callback, which should then redirect to onboarding
      window.location.href = result.url;
      return { url: result.url };
    }
    return {};
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <AuthForm type="signup" onSubmit={handleSubmit} error={error} />
      <SocialButtons onSocialLogin={handleSocialSignup} />
    </div>
  );
}
