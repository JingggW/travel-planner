import type { Trip } from "@/app/types/trip";

export const api = {
  trips: {
    // Get all trips for the current user
    getAll: async (): Promise<Trip[]> => {
      const response = await fetch("/api/trips");
      if (!response.ok) {
        throw new Error("Failed to fetch trips");
      }
      return response.json();
    },

    // Create a new trip
    create: async (trip: Trip): Promise<Trip> => {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trip),
      });

      if (!response.ok) {
        throw new Error("Failed to create trip");
      }
      return response.json();
    },
  },
};
