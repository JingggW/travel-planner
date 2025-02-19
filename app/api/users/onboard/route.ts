import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId, name, image } = await request.json();

    // Verify that the authenticated user matches the onboarding user
    if (session.user.id !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update user profile in Supabase
    const { error } = await supabase.from("users").upsert({
      id: userId,
      name,
      image,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error updating user:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Onboarding error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
