"use client";

import { useState, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { TripItem } from "@/types";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NewTripItem({ params }: PageProps) {
  const { id: tripId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Get URL parameters
  const typeParam = searchParams.get("type");
  const validType =
    typeParam === "activity" ||
    typeParam === "accommodation" ||
    typeParam === "transportation" ||
    typeParam === "food"
      ? typeParam
      : "activity";

  const [formData, setFormData] = useState<Partial<TripItem>>({
    title: searchParams.get("title") || "",
    description: searchParams.get("description") || "",
    type: validType,
    location: searchParams.get("location") || "",
    start_datetime: "",
    end_datetime: "",
  });

  // Update form data when URL parameters change
  useEffect(() => {
    const title = searchParams.get("title");
    const description = searchParams.get("description");
    const typeParam = searchParams.get("type");

    console.log("URL Params changed:", { title, description, typeParam });

    const validType =
      typeParam === "activity" ||
      typeParam === "accommodation" ||
      typeParam === "transportation" ||
      typeParam === "food"
        ? typeParam
        : "activity";

    setFormData((prev) => ({
      ...prev,
      title: title || "",
      description: description || "",
      type: validType,
    }));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Convert datetime strings to local timezone ISO strings
      const start = formData.start_datetime
        ? new Date(formData.start_datetime).toISOString()
        : undefined;
      const end = formData.end_datetime
        ? new Date(formData.end_datetime).toISOString()
        : undefined;

      const itemData: Partial<TripItem> = {
        ...formData,
        trip_id: tripId,
        start_datetime: start,
        end_datetime: end,
      };

      console.log("Trip item data to be sent to Supabase:", itemData);

      const { error } = await supabase.from("trip_items").insert([itemData]);

      if (error) {
        console.error("Detailed error:", error);
        throw error;
      }
      router.push(`/trips/${tripId}`);
    } catch (error) {
      console.error("Error creating trip item:", error);
      if (error instanceof Error) {
        alert(`Error creating trip item: ${error.message}`);
      } else {
        alert("Error creating trip item. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // For datetime inputs, store the value directly from the input
    // The input's value is already in local timezone
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔒</div>
        <h3 className="empty-state-title">Please sign in to add trip items</h3>
        <p className="empty-state-desc">
          Sign in to continue planning your trip
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/trips/${tripId}`}
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
        Back to Trip
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Add Trip Item
        </h1>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Item Type
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="activity">Activity</option>
                <option value="accommodation">Accommodation</option>
                <option value="transportation">Transportation</option>
                <option value="food">Food</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder={`e.g., ${
                  formData.type === "activity"
                    ? "Visit Eiffel Tower"
                    : formData.type === "accommodation"
                    ? "Hotel de Paris"
                    : formData.type === "food"
                    ? "French Pastry"
                    : "Flight to Paris"
                }`}
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
                value={formData.description || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Add any important details or notes"
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
                placeholder="Enter location"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="start_datetime"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Start Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="start_datetime"
                  name="start_datetime"
                  value={formData.start_datetime || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="end_datetime"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  End Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="end_datetime"
                  name="end_datetime"
                  value={formData.end_datetime || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href={`/trips/${tripId}`} className="btn btn-outline">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Adding..." : "Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
