import { redirect } from "next/navigation";
import { OnboardingForm } from "@/app/components/auth/OnboardingForm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function OnboardingPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Check if user has already completed onboarding
  const { data: userData } = await supabase
    .from("users")
    .select("name")
    .eq("id", session.user.id)
    .single();

  if (userData?.name) {
    redirect("/dashboard");
  }

  return (
    <div className="container relative min-h-screen flex items-center justify-center">
      <OnboardingForm userId={session.user.id} />
    </div>
  );
}
