import { GeneratedItinerary } from "@/lib/together";

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

interface ItineraryDisplayProps {
  itinerary: GeneratedItinerary;
}

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const parsedContent = JSON.parse(itinerary.content);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{itinerary.destination}</h3>
        <span className="text-sm text-gray-500">
          {itinerary.startDate} - {itinerary.endDate}
        </span>
      </div>

      <div className="space-y-8">
        {parsedContent.days.map((day: ItineraryDay, index: number) => (
          <div key={day.date} className="space-y-4">
            <h4 className="text-md font-semibold border-b pb-2">
              Day {index + 1} - {new Date(day.date).toLocaleDateString()}
            </h4>
            <div className="divide-y">
              {day.activities.map(
                (activity: ItineraryActivity, actIndex: number) => (
                  <div
                    key={`${day.date}-${actIndex}`}
                    className="py-4 grid grid-cols-[150px,1fr] gap-4"
                  >
                    <div className="text-sm text-gray-600">{activity.time}</div>
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium">{activity.activity}</h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {activity.estimatedCost}
                          </span>
                          {activity.reservationNeeded && (
                            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                              Reservation needed
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
