"use client";

import { formatDisplayDate } from "@/app/utils/dateUtils";

interface ActivityCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  onEdit?: () => void;
}

export function ActivityCard({
  title,
  date,
  time,
  location,
  notes,
  onEdit,
}: ActivityCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-card shadow-sm">
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-muted-foreground">
              {formatDisplayDate(date)} • {time}
            </p>
            <p className="text-sm flex items-center gap-1">📍 {location}</p>
            {notes && (
              <p className="text-sm mt-2 text-muted-foreground">{notes}</p>
            )}
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
