"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Trip, TripItem } from "@/types";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TripDetailsPage({ params }: PageProps) {
  const { id: tripId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripItems, setTripItems] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchTripAndItems() {
      try {
        // Fetch trip details
        const { data: tripData, error: tripError } = await supabase
          .from("trips")
          .select("*")
          .eq("id", tripId)
          .eq("user_id", user!.id)
          .single();

        if (tripError) throw tripError;
        if (!tripData) {
          router.push("/trips");
          return;
        }

        setTrip(tripData);

        // Fetch trip items
        const { data: itemsData, error: itemsError } = await supabase
          .from("trip_items")
          .select("*")
          .eq("trip_id", tripId)
          .order("start_datetime", { ascending: true });

        if (itemsError) throw itemsError;
        setTripItems(itemsData || []);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTripAndItems();
  }, [user, tripId, router]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Please sign in to view trip details.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Loading trip details...
        </p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Trip not found.
        </p>
        <Link
          href="/trips"
          className="text-blue-500 hover:text-blue-600 mt-4 inline-block"
        >
          Back to My Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/trips"
          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Back to Trips
        </Link>
        <h1 className="text-3xl font-bold">{trip.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trip Details */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Trip Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Description
                </p>
                <p className="mt-1">{trip.description || "No description"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Dates
                </p>
                <div className="mt-1">
                  {trip.start_date && (
                    <p>
                      From: {new Date(trip.start_date).toLocaleDateString()}
                    </p>
                  )}
                  {trip.end_date && (
                    <p>To: {new Date(trip.end_date).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => router.push(`/trips/${trip.id}/edit`)}
                className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Edit Trip Details
              </button>
            </div>
          </div>
        </div>

        {/* Trip Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Trip Items</h2>
              <button
                onClick={() => router.push(`/trips/${trip.id}/items/new`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Item
              </button>
            </div>

            {tripItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  No items added to this trip yet.
                </p>
                <button
                  onClick={() => router.push(`/trips/${trip.id}/items/new`)}
                  className="text-blue-500 hover:text-blue-600 mt-2"
                >
                  Add your first item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tripItems.map((item) => (
                  <div
                    key={item.id}
                    className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {item.description || "No description"}
                        </p>
                        {item.location && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            📍 {item.location}
                          </p>
                        )}
                        {item.start_datetime && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            🕒 {new Date(item.start_datetime).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
