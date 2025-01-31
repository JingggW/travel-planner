"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Activity } from "@/app/types/trip";

interface EditActivityFormProps {
  activity: Activity;
  onClose: () => void;
  onSubmit: (updatedActivity: Activity) => void;
}

export function EditActivityForm({
  activity,
  onClose,
  onSubmit,
}: EditActivityFormProps) {
  const [formData, setFormData] = useState({ ...activity });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, type: activity.type });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-card p-6 rounded-lg shadow"
    >
      <h2 className="text-2xl font-semibold mb-4">Edit Activity</h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Activity Title
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
            onChange={(e) =>
              setFormData({
                ...formData,
                date: e.target.value,
              })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium mb-1">
            Time
          </label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-1">
          Location
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

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
