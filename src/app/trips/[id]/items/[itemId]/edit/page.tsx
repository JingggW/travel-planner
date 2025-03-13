"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { TripItem } from "@/types";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
}

export default function EditTripItem({ params }: PageProps) {
  const { id: tripId, itemId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<TripItem>>({
    title: "",
    description: "",
    type: "activity",
    location: "",
    start_datetime: "",
    end_datetime: "",
  });

  useEffect(() => {
    if (!user) return;

    // Fetch trip item details
    const fetchTripItem = async () => {
      try {
        const { data, error } = await supabase
          .from("trip_items")
          .select("*")
          .eq("id", itemId)
          .single();

        if (error) throw error;
        if (!data) {
          router.push(`/trips/${tripId}`);
          return;
        }

        // Format datetime strings for input fields
        const formatDateTimeForInput = (datetime: string | null) => {
          if (!datetime) return "";
          return new Date(datetime).toISOString().slice(0, 16);
        };

        setFormData({
          ...data,
          start_datetime: formatDateTimeForInput(data.start_datetime),
          end_datetime: formatDateTimeForInput(data.end_datetime),
        });
      } catch (error) {
        console.error("Error fetching trip item:", error);
        alert("Error fetching trip item details. Please try again.");
        router.push(`/trips/${tripId}`);
      }
    };

    fetchTripItem();
  }, [user, tripId, itemId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("trip_items")
        .update({
          ...formData,
          start_datetime: formData.start_datetime || null,
          end_datetime: formData.end_datetime || null,
        })
        .eq("id", itemId);

      if (error) throw error;
      router.push(`/trips/${tripId}`);
    } catch (error) {
      console.error("Error updating trip item:", error);
      if (error instanceof Error) {
        alert(`Error updating trip item: ${error.message}`);
      } else {
        alert("Error updating trip item. Please try again.");
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔒</div>
        <h3 className="empty-state-title">Please sign in to edit trip items</h3>
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
          Edit Trip Item
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
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
