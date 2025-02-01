"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleSignIn, handleSocialLogin } from "@/lib/supabase/auth";
import AuthForm from "@/app/components/auth/AuthForm";
import SocialButtons from "@/app/components/auth/SocialButtons";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    const result = await handleSignIn(email, password);
    if ("error" in result) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <AuthForm type="login" onSubmit={handleSubmit} error={error} />
      <SocialButtons onSocialLogin={handleSocialLogin} />
    </div>
  );
}
