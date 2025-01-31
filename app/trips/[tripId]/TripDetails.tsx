"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { Activity } from "@/app/types/trip";

interface TripDetailsProps {
  onAddActivity: (activity: Activity) => void;
  startDate: string;
  endDate: string;
  onUpdateDates: (startDate: string, endDate: string) => void;
}

export function TripDetails({
  startDate,
  endDate,
  onUpdateDates,
}: TripDetailsProps) {
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate, endDate });

  const handleSaveDates = () => {
    onUpdateDates(dateRange.startDate, dateRange.endDate);
    setIsEditingDates(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          {isEditingDates ? (
            <div className="space-y-2">
              <div className="flex gap-4 items-center">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                  className="border rounded px-2 py-1"
                />
                <span>-</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                  className="border rounded px-2 py-1"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveDates}>Save</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingDates(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">Paris Trip</h1>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground">
                  {startDate} - {endDate}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingDates(true)}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
