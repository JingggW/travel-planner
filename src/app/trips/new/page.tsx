"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  generateDetailedItinerary,
  type GeneratedItinerary,
} from "@/lib/together";
import type { Trip, TripItem } from "@/types";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";

interface ItineraryDay {
  date: string;
  activities: ItineraryActivity[];
}

interface ItineraryActivity {
  time: string;
  activity: string;
  location: string;
  description: string;
  estimatedCost: string;
  reservationNeeded: boolean;
}

const convertTo24Hour = (time12h: string): string => {
  const [timeStr, modifier] = time12h.trim().split(" ");
  const [hoursStr, minutes] = timeStr.split(":");
  let hours = hoursStr;

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM" && hours !== "12") {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours.padStart(2, "0")}:${minutes}`;
};

export default function NewTrip() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generatingItinerary, setGeneratingItinerary] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] =
    useState<GeneratedItinerary | null>(null);
  const [formData, setFormData] = useState<Partial<Trip>>({
    title: "",
    description: "",
    location: "",
    budget: undefined,
    travel_partner: "",
    start_date: "",
    end_date: "",
  });

  const createTripItemsFromItinerary = async (
    tripId: string,
    itinerary: GeneratedItinerary
  ) => {
    try {
      const parsedContent = JSON.parse(itinerary.content);
      const tripItems: Partial<TripItem>[] = [];

      parsedContent.days.forEach((day: ItineraryDay) => {
        day.activities.forEach((activity: ItineraryActivity) => {
          try {
            const [startTime12h, endTime12h] = activity.time.split(" - ");
            const startTime24h = convertTo24Hour(startTime12h);
            const endTime24h = convertTo24Hour(endTime12h);

            const startDateTime = new Date(`${day.date}T${startTime24h}:00`);
            const endDateTime = new Date(`${day.date}T${endTime24h}:00`);

            if (
              isNaN(startDateTime.getTime()) ||
              isNaN(endDateTime.getTime())
            ) {
              console.warn("Invalid date/time for activity:", activity);
              return; // Skip this activity
            }

            tripItems.push({
              trip_id: tripId,
              type: "activity",
              title: activity.activity,
              description: activity.description,
              location: activity.location,
              start_datetime: startDateTime.toISOString(),
              end_datetime: endDateTime.toISOString(),
            });
          } catch (timeError) {
            console.warn(
              "Error parsing time for activity:",
              activity,
              timeError
            );
            // Skip this activity if time parsing fails
          }
        });
      });

      if (tripItems.length === 0) {
        console.warn("No valid trip items were created from the itinerary");
        return;
      }

      const { error } = await supabase.from("trip_items").insert(tripItems);
      if (error) throw error;
    } catch (error) {
      console.error("Error creating trip items:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // First create the trip
      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .insert([
          {
            ...formData,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (tripError) throw tripError;

      // If we have a generated itinerary, create trip items
      if (generatedItinerary && tripData) {
        await createTripItemsFromItinerary(tripData.id, generatedItinerary);
      }

      router.push(`/trips/${tripData.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Error creating trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateItinerary = async () => {
    if (
      !formData.title ||
      !formData.location ||
      !formData.start_date ||
      !formData.end_date
    ) {
      alert(
        "Please fill in the title, location, start date, and end date to generate an itinerary."
      );
      return;
    }

    console.log("Form data for generation:", formData);
    setGeneratingItinerary(true);
    try {
      const tripData = {
        ...formData,
        title: formData.title,
        description: formData.description || "",
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
      } as Trip;

      console.log("Sending trip data:", tripData);
      const itinerary = await generateDetailedItinerary(tripData);
      console.log("Received itinerary:", itinerary);

      if (!itinerary.content) {
        throw new Error("No itinerary content was generated");
      }

      setGeneratedItinerary(itinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      alert(
        `Error generating itinerary: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setGeneratingItinerary(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Please sign in to create a trip.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Trip</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Trip Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Where are you going?"
              />
            </div>

            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Budget
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget || ""}
                  onChange={handleChange}
                  className="pl-7 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="travel_partner"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Travel Partner
              </label>
              <input
                type="text"
                id="travel_partner"
                name="travel_partner"
                value={formData.travel_partner || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Who are you traveling with?"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  required
                  value={formData.end_date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleGenerateItinerary}
                disabled={generatingItinerary || loading}
                className="rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
              >
                {generatingItinerary ? "Generating..." : "Generate Itinerary"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Trip"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Generated Itinerary</h2>
          {generatingItinerary ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : generatedItinerary ? (
            <ItineraryDisplay itinerary={generatedItinerary} />
          ) : (
            <div className="text-center text-gray-500 h-64 flex items-center justify-center">
              Fill out the trip details and click Generate Itinerary to create a
              detailed plan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
