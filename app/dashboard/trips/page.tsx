import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AddTripCard } from "@/app/components/AddTripCard";
import { TripCard } from "@/app/components/TripCard";

export default async function TripsPage() {
  const supabase = createServerComponentClient({ cookies });

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch user's trips
  const { data: trips, error } = await supabase
    .from("trips")
    .select("id, title, destination, startDate, endDate, imageUrl, partnerId")
    .or(`ownerId.eq.${session.user.id},partnerId.eq.${session.user.id}`)
    .order("startDate", { ascending: true });

  if (error) {
    console.error("Error fetching trips:", error);
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AddTripCard />
        {trips?.map((trip) => (
          <TripCard
            key={trip.id}
            id={trip.id}
            title={trip.title}
            destination={trip.destination}
            startDate={trip.startDate}
            endDate={trip.endDate}
            imageUrl={trip.imageUrl}
            partner={trip.partnerId}
          />
        ))}
      </div>
    </div>
  );
}
