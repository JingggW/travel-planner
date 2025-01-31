"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Activity, ActivityType } from "@/app/types/trip";

interface ActivityFormData extends Omit<Activity, "date"> {
  date: string;
  endTime?: string;
  confirmationNumber?: string;
}

interface AddActivityFormProps {
  onClose: () => void;
  onSubmit: (activity: Activity) => void;
  activityType?: ActivityType;
  defaultDate?: string;
}

export function AddActivityForm({
  onClose,
  onSubmit,
  activityType = ActivityType.ACTIVITY,
  defaultDate = "",
}: AddActivityFormProps) {
  const [formData, setFormData] = useState<ActivityFormData>({
    title: "",
    type: activityType,
    date: defaultDate,
    time: "",
    endTime: "", // Add empty string initialization
    location: "",
    notes: "",
    confirmationNumber: "", // Add empty string initialization
  });

  // Set default values based on activity type
  useEffect(() => {
    const defaults: Partial<ActivityFormData> = {
      type: activityType,
      date: defaultDate || new Date().toISOString().split("T")[0],
      endTime: "10:00", // Default check-out time
      time: "15:00", // Default check-in time
    };

    switch (activityType) {
      case ActivityType.HOTEL:
        defaults.title = "Hotel Accommodation";
        defaults.notes = "Standard room booking";
        break;
      case ActivityType.RESTAURANT:
        defaults.title = "Dinner Reservation";
        defaults.time = "19:00";
        break;
      case ActivityType.FLIGHT:
        defaults.title = "Flight Booking";
        defaults.notes = "Economy class";
        break;
    }

    setFormData((prev) => ({
      ...prev,
      ...defaults,
    }));
  }, [activityType, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      notes: formData.notes,
      type: formData.type,
    });
    onClose();
  };

  const getFormTitle = () => {
    switch (activityType) {
      case ActivityType.HOTEL:
        return "Add Hotel Accommodation";
      case ActivityType.RESTAURANT:
        return "Add Restaurant Reservation";
      case ActivityType.FLIGHT:
        return "Add Flight Details";
      default:
        return "Add New Activity";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-card p-6 rounded-lg shadow"
    >
      <h2 className="text-2xl font-semibold mb-4">{getFormTitle()}</h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          {activityType === ActivityType.HOTEL ? "Hotel Name" : "Title"}
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date
          </label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        {activityType === ActivityType.HOTEL ? (
          <>
            <div>
              <label
                htmlFor="check-in"
                className="block text-sm font-medium mb-1"
              >
                Check-in Time
              </label>
              <Input
                id="check-in"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="check-out"
                className="block text-sm font-medium mb-1"
              >
                Check-out Time
              </label>
              <Input
                id="check-out"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1">
              {activityType === ActivityType.FLIGHT ? "Departure Time" : "Time"}
            </label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-1">
          {activityType === ActivityType.HOTEL
            ? "Hotel Address"
            : activityType === ActivityType.FLIGHT
            ? "Flight Number"
            : "Location"}
        </label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          required
        />
      </div>

      {activityType === ActivityType.HOTEL && (
        <div>
          <label
            htmlFor="confirmation"
            className="block text-sm font-medium mb-1"
          >
            Confirmation Number
          </label>
          <Input
            id="confirmation"
            value={formData.confirmationNumber || ""}
            onChange={(e) =>
              setFormData({ ...formData, confirmationNumber: e.target.value })
            }
          />
        </div>
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          {activityType === ActivityType.HOTEL ? "Special Requests" : "Notes"}
        </label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder={
            activityType === ActivityType.HOTEL
              ? "Enter any special room requests..."
              : "Add additional notes..."
          }
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {activityType === ActivityType.HOTEL ? "Save Hotel" : "Save Activity"}
        </Button>
      </div>
    </form>
  );
}
