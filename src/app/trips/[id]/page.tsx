"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Trip, TripItem } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TripRecommendations } from "@/components/TripRecommendations";

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
      <div className="empty-state">
        <div className="empty-state-icon">🔒</div>
        <h3 className="empty-state-title">
          Please sign in to view trip details
        </h3>
        <p className="empty-state-desc">
          Sign in to access your trip information
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Loading trip details...
        </p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">❌</div>
        <h3 className="empty-state-title">Trip not found</h3>
        <p className="empty-state-desc">
          This trip may have been deleted or you don&apos;t have access to it
        </p>
        <Button asChild variant="default">
          <Link href="/trips">Back to My Trips</Link>
        </Button>
      </div>
    );
  }

  const TripItem = ({ item }: { item: TripItem }) => {
    const getIcon = (type: string) => {
      switch (type) {
        case "accommodation":
          return "🏨";
        case "transportation":
          return "✈️";
        case "activity":
          return "📍";
        default:
          return "📌";
      }
    };

    const formatDateTime = (datetime: string) => {
      if (!datetime) return "";
      const date = new Date(datetime);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    };

    return (
      <div className="trip-item hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className={`trip-item-icon ${item.type}`}>
          {getIcon(item.type)}
        </div>
        <div className="trip-item-content">
          <h3 className="trip-item-title">{item.title}</h3>
          <div className="trip-item-meta">
            {item.location && (
              <>
                <span>{item.location}</span>
                <span>•</span>
              </>
            )}
            {item.start_datetime && (
              <span>{formatDateTime(item.start_datetime)}</span>
            )}
          </div>
          {item.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {item.description}
            </p>
          )}
          <div className="trip-item-actions">
            <span className={`tag ${item.type}`}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/trips"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          />
        </svg>
        Back to Trips
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {trip.title}
        </h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="text-primary border-primary hover:bg-accent/10"
          >
            Share Trip
          </Button>
          <Button
            onClick={() => router.push(`/trips/${trip.id}/edit`)}
            variant="default"
          >
            Edit Trip
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trip Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Description
                  </span>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {trip.description || "No description"}
                  </p>
                </div>

                {trip.location && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </span>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {trip.location}
                    </p>
                  </div>
                )}

                {trip.budget && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Budget
                    </span>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      ${trip.budget.toFixed(2)}
                    </p>
                  </div>
                )}

                {trip.travel_partner && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Travel Partner
                    </span>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {trip.travel_partner}
                    </p>
                  </div>
                )}

                {(trip.start_date || trip.end_date) && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Dates
                    </span>
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
                    {trip.start_date && trip.end_date && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                        </svg>
                        {Math.ceil(
                          (new Date(trip.end_date).getTime() -
                            new Date(trip.start_date).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trip Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Trip Items</CardTitle>
              <Button asChild variant="default">
                <Link href={`/trips/${trip.id}/items/new`}>Add Item</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {tripItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <h3 className="empty-state-title">
                    No items added to this trip yet
                  </h3>
                  <p className="empty-state-desc">
                    Start planning by adding flights, hotels, activities, and
                    more.
                  </p>
                  <Button asChild variant="default">
                    <Link href={`/trips/${trip.id}/items/new`}>
                      Add your first item
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tripItems.map((item) => (
                    <TripItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trip Recommendations */}
          <div className="mt-8">
            <TripRecommendations trip={trip} />
          </div>
        </div>
      </div>
    </div>
  );
}
