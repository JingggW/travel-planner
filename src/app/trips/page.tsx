"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Trip } from "@/types";
import Link from "next/link";

export default function TripsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchTrips() {
      try {
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTrips(data || []);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Please sign in to view your trips.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Loading trips...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Link
          href="/trips/new"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Create New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            You haven&apos;t created any trips yet.
          </p>
          <Link
            href="/trips/new"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Create your first trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {trip.description || "No description"}
                </p>
                <div className="flex flex-col space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  {trip.start_date && (
                    <p>
                      Start: {new Date(trip.start_date).toLocaleDateString()}
                    </p>
                  )}
                  {trip.end_date && (
                    <p>End: {new Date(trip.end_date).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <button
                  onClick={() => router.push(`/trips/${trip.id}`)}
                  className="w-full text-center text-blue-500 hover:text-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
