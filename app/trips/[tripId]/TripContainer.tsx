"use client";

import { useState } from "react";
import { TripDetails } from "./TripDetails";
import { Itinerary } from "./Itinerary";
import { TripSidebar } from "./TripSidebar";
import { formatDisplayDate } from "@/app/utils/dateUtils";
import { Activity, TravelDay, ActivityType } from "@/app/types/trip";

export function TripContainer() {
  const [travelDays, setTravelDays] = useState<TravelDay[]>([
    {
      date: "2025-01-15",
      hotel: {
        name: "Hotel du Louvre",
        address: "Place André Malraux, 75001 Paris, France",
        checkIn: "15:00",
      },
      activities: [],
    },
    {
      date: "2025-01-16",
      activities: [
        {
          title: "Eiffel Tower Visit",
          date: "June 16, 2024",
          time: "10:00 AM",
          location: "Champ de Mars, 5 Av. Anatole France",
          notes: "Iconic tower with stunning city views",
          type: ActivityType.ACTIVITY,
        },
      ],
    },
    // Add more days until June 22
    {
      date: "2025-01-22",
      hotel: {
        name: "Hotel du Louvre",
        address: "Place André Malraux, 75001 Paris, France",
        checkOut: "11:00",
      },
      activities: [],
    },
  ]);
  const [startDate, setStartDate] = useState("2025-01-15");
  const [endDate, setEndDate] = useState("2025-01-22");

  const handleAddActivity = (activity: Activity) => {
    const formattedDate = formatDisplayDate(activity.date);
    const formattedActivity = { ...activity, date: formattedDate };

    setTravelDays((days) => {
      const dayIndex = days.findIndex((day) => day.date === formattedDate);
      if (dayIndex === -1) {
        // If the day doesn't exist, create a new day
        return [
          ...days,
          {
            date: formattedDate,
            activities: [formattedActivity],
          },
        ].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }

      return days.map((day) =>
        day.date === formattedDate
          ? { ...day, activities: [...day.activities, formattedActivity] }
          : day
      );
    });
  };

  const handleUpdateDates = (newStartDate: string, newEndDate: string) => {
    setStartDate(formatDisplayDate(newStartDate));
    setEndDate(formatDisplayDate(newEndDate));
    // Optionally: Update or filter travelDays based on new date range
  };

  const handleEditActivity = (
    dayIndex: number,
    activityIndex: number,
    updatedActivity: Activity
  ) => {
    setTravelDays((days) =>
      days.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              activities: day.activities.map((activity, actIdx) =>
                actIdx === activityIndex ? updatedActivity : activity
              ),
            }
          : day
      )
    );
  };

  return (
    <div className="space-y-6">
      <TripDetails
        onAddActivity={handleAddActivity}
        startDate={formatDisplayDate(startDate)}
        endDate={formatDisplayDate(endDate)}
        onUpdateDates={handleUpdateDates}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Itinerary
          travelDays={travelDays}
          onEditActivity={handleEditActivity}
          onAddActivity={handleAddActivity}
        />
        <TripSidebar />
      </div>
    </div>
  );
}
