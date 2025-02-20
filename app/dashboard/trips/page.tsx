import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AddTripCard } from "@/app/components/AddTripCard";
import { TripCard } from "@/app/components/TripCard";
import { DatabaseTrip } from "@/app/types/trip";

export default async function TripsPage() {
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

  // Fetch user's trips
  const { data: dbTrips, error } = await supabase
    .from("trips")
    .select(
      "id, title, destination, start_date, end_date, image_url, partner_id"
    )
    .or("owner_id.eq." + user.id + ",partner_id.eq." + user.id)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Error fetching trips:", error);
  }

  const trips = (dbTrips as DatabaseTrip[])?.map((trip) => ({
    id: trip.id,
    title: trip.title,
    destination: trip.destination,
    startDate: new Date(trip.start_date),
    endDate: new Date(trip.end_date),
    imageUrl: trip.image_url,
    partnerId: trip.partner_id,
  }));

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AddTripCard />
        {trips?.map((trip) => (
          <TripCard key={trip.id} {...trip} />
        ))}
      </div>
    </div>
  );
}
