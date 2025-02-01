import { TripCard } from "@/app/components/TripCard";
import { AddTripCard } from "@/app/components/AddTripCard";

// Move the interface to a types file
import { Trip } from "@/app/types/trip";

// Mock data - move to a data file or API later
const trips: Trip[] = [
  {
    id: "1",
    title: "Paris Adventure",
    destination: "Paris, France",
    startDate: "2024-06-15",
    endDate: "2024-06-22",
    imageUrl: "/images/trip-placeholder.jpg",
    partner: "Sarah Smith",
  },
  {
    id: "2",
    title: "Tokyo Exploration",
    destination: "Tokyo, Japan",
    startDate: "2024-08-10",
    endDate: "2024-08-20",
    imageUrl: "/images/trip-placeholder.jpg",
    partner: "John Doe",
  },
];

export default function DashboardPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">My Trips</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <TripCard key={trip.id} {...trip} />
        ))}
        <AddTripCard />
      </div>
    </div>
  );
}
