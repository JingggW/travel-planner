import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NewTripForm } from "./NewTripForm";

export const dynamic = "force-dynamic";

export default async function NewTripPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Get authenticated user using getUser for better security
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth error:", userError);
    redirect("/login");
  }

  return <NewTripForm userId={user.id} />;
}
