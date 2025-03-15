import { TripItem } from "@/types";
import { DayItinerary } from "./DayItinerary";

interface TripItineraryProps {
  items: TripItem[];
  tripId: string;
  generatedItems?: Array<{
    title: string;
    description: string;
    type: string;
  }>;
  trip?: {
    location?: string;
    start_date?: string;
    end_date?: string;
  };
}

export function TripItinerary({
  items = [],
  tripId,
  generatedItems = [],
  trip,
}: TripItineraryProps) {
  // If no items and no generated items, show empty state
  if (!items?.length && !generatedItems?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No items in your itinerary yet.</p>
      </div>
    );
  }

  // Group items by date
  const groupedItems = items.reduce((groups, item) => {
    if (!item?.start_datetime) return groups;

    const date = new Date(item.start_datetime).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, TripItem[]>);

  // If no valid items with dates but we have generated items,
  // create a "Recommendations" group
  if (Object.keys(groupedItems).length === 0 && generatedItems.length > 0) {
    return (
      <DayItinerary
        date="Recommendations"
        items={[]}
        tripId={tripId}
        generatedItems={generatedItems}
        trip={trip}
      />
    );
  }

  // If no valid items with dates and no generated items, show message
  if (Object.keys(groupedItems).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No items with valid dates in your itinerary.
        </p>
      </div>
    );
  }

  // Sort items within each day by start time
  Object.values(groupedItems).forEach((dayItems) => {
    dayItems.sort((a, b) => {
      if (!a?.start_datetime || !b?.start_datetime) return 0;
      return (
        new Date(a.start_datetime).getTime() -
        new Date(b.start_datetime).getTime()
      );
    });
  });

  // Get sorted dates
  const sortedDates = Object.keys(groupedItems).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  // Calculate day number for each date
  const dateWithDayNumber = sortedDates.map((date, index) => ({
    date,
    dayNumber: index + 1,
  }));

  return (
    <div className="space-y-6">
      {/* Show generated items first if any */}
      {generatedItems.length > 0 && (
        <DayItinerary
          date="Recommendations"
          items={[]}
          tripId={tripId}
          generatedItems={generatedItems}
          trip={trip}
        />
      )}

      {/* Show regular items grouped by date */}
      {dateWithDayNumber.map(({ date, dayNumber }) => (
        <DayItinerary
          key={date}
          date={`Day ${dayNumber} - ${date}`}
          items={groupedItems[date]}
          tripId={tripId}
          generatedItems={generatedItems}
          trip={trip}
        />
      ))}
    </div>
  );
}
