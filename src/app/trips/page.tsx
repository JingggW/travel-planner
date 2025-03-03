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
      <div className="empty-state">
        <div className="empty-state-icon">🔒</div>
        <h3 className="empty-state-title">Please sign in to view your trips</h3>
        <p className="empty-state-desc">
          Sign in to start planning your adventures
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Loading trips...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Trips
        </h1>
        <Link href="/trips/new" className="btn btn-primary">
          Create New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✈️</div>
          <h3 className="empty-state-title">No trips planned yet</h3>
          <p className="empty-state-desc">
            Start planning your next adventure!
          </p>
          <Link href="/trips/new" className="btn btn-primary">
            Create your first trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="card">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="trip-item-icon">✈️</div>
                  <div className="flex-1">
                    <h3 className="trip-item-title">{trip.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                      {trip.description || "No description"}
                    </p>
                    {(trip.start_date || trip.end_date) && (
                      <div className="date-range">
                        {trip.start_date && (
                          <div className="date-item">
                            <div className="date-item-label">From</div>
                            <div className="date-item-value">
                              {new Date(trip.start_date).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                        {trip.start_date && trip.end_date && (
                          <div className="date-divider" />
                        )}
                        {trip.end_date && (
                          <div className="date-item">
                            <div className="date-item-label">To</div>
                            <div className="date-item-value">
                              {new Date(trip.end_date).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => router.push(`/trips/${trip.id}`)}
                  className="w-full text-center text-primary hover:text-secondary font-medium"
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
