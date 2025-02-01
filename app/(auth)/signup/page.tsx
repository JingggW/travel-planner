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
      // Redirect to dashboard after successful signup
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <AuthForm type="signup" onSubmit={handleSubmit} error={error} />
      <SocialButtons onSocialLogin={handleSocialLogin} />
    </div>
  );
}
