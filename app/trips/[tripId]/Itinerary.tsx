"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityCard } from "@/app/components/ActivityCard";
import { EditActivityForm } from "@/app/components/EditActivityForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { AddActivityForm } from "@/app/components/AddActivityForm";
import { Activity, TravelDay, ActivityType } from "@/app/types/trip";
import { formatDisplayDate } from "@/app/utils/dateUtils";

interface ItineraryProps {
  travelDays: TravelDay[];
  onEditActivity: (
    dayIndex: number,
    activityIndex: number,
    activity: Activity
  ) => void;
  onAddActivity: (activity: Activity) => void;
}

export function Itinerary({
  travelDays,
  onEditActivity,
  onAddActivity,
}: ItineraryProps) {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editingActivity, setEditingActivity] = useState<number | null>(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [activityType, setActivityType] = useState(ActivityType.ACTIVITY);

  const nextDay = () => {
    setCurrentDayIndex((prev) =>
      prev < travelDays.length - 1 ? prev + 1 : prev
    );
  };

  const previousDay = () => {
    setCurrentDayIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleSubmit = (activity: Activity) => {
    onAddActivity(activity);
    setIsAddActivityOpen(false);
  };

  const closeModal = () => {
    setIsAddActivityOpen(false);
  };

  return (
    <div className="md:col-span-2 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Itinerary</CardTitle>
        </CardHeader>
        <CardContent>
          {isAddActivityOpen && (
            <div className="mb-4">
              <AddActivityForm
                activityType={activityType}
                onSubmit={handleSubmit}
                onClose={closeModal}
                defaultDate={travelDays[currentDayIndex].date}
              />
            </div>
          )}

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={previousDay}
                disabled={currentDayIndex === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h3 className="font-semibold text-center bg-muted py-2 px-4 rounded-lg">
                {formatDisplayDate(travelDays[currentDayIndex].date)}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextDay}
                disabled={currentDayIndex === travelDays.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                {travelDays[currentDayIndex].activities.map(
                  (activity, activityIndex) => (
                    <div key={activityIndex}>
                      {editingDay === currentDayIndex &&
                      editingActivity === activityIndex ? (
                        <EditActivityForm
                          activity={activity}
                          onClose={() => {
                            setEditingDay(null);
                            setEditingActivity(null);
                          }}
                          onSubmit={(updatedActivity) => {
                            onEditActivity(
                              currentDayIndex,
                              activityIndex,
                              updatedActivity
                            );
                            setEditingDay(null);
                            setEditingActivity(null);
                          }}
                        />
                      ) : (
                        <ActivityCard
                          {...activity}
                          onEdit={() => {
                            setEditingDay(currentDayIndex);
                            setEditingActivity(activityIndex);
                          }}
                        />
                      )}
                    </div>
                  )
                )}
                {/* Placeholder for empty days */}
                {travelDays[currentDayIndex].activities.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No activities planned yet. Add one below!
                  </div>
                )}
              </div>
            </div>

            {/* Always show activity buttons */}
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
              {/* Conditionally show Hotel button */}
              {!travelDays[currentDayIndex].activities.some(
                (activity) => activity.type === ActivityType.HOTEL
              ) && (
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2 items-center justify-center border-gray-200 hover:bg-gray-50"
                  onClick={() => {
                    setActivityType(ActivityType.HOTEL);
                    setIsAddActivityOpen(true);
                  }}
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2 20h20M5 4h14a2 2 0 0 1 2 2v12H3V6a2 2 0 0 1 2-2ZM6 8h12M6 12h12M6 16h12" />
                  </svg>
                  <span className="text-xs">Hotel</span>
                </Button>
              )}

              {/* Other activity types */}
              {[
                {
                  type: ActivityType.ACTIVITY,
                  icon: "📍",
                  label: "Activity",
                },
                {
                  type: ActivityType.RESTAURANT,
                  icon: "🍴",
                  label: "Dining",
                },
                { type: ActivityType.FLIGHT, icon: "✈️", label: "Flight" },
                {
                  type: ActivityType.TRANSPORT,
                  icon: "🚕",
                  label: "Transport",
                },
                { type: ActivityType.EVENT, icon: "🎟️", label: "Event" },
                { type: ActivityType.SIGHT, icon: "🏛️", label: "Sight" },
              ].map((activity) => (
                <Button
                  key={activity.type}
                  variant="outline"
                  className="h-20 flex flex-col gap-2 items-center justify-center border-gray-200 hover:bg-gray-50"
                  onClick={() => {
                    setActivityType(activity.type);
                    setIsAddActivityOpen(true);
                  }}
                >
                  <span className="text-xl">{activity.icon}</span>
                  <span className="text-xs">{activity.label}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {travelDays.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentDayIndex ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => setCurrentDayIndex(index)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
