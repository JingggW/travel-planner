import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "../components/UserSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
