import { Trip } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { generateTripRecommendations } from "@/lib/together";
import { useRouter } from "next/navigation";

interface TripRecommendationsProps {
  trip: Trip;
}

export function TripRecommendations({ trip }: TripRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToTrip = (
    title: string,
    description: string,
    type: string
  ) => {
    const params = new URLSearchParams({
      title,
      description,
      type,
      location: trip.location || "",
    }).toString();
    router.push(`/trips/${trip.id}/items/new?${params}`);
  };

  const parseRecommendations = (text: string) => {
    const sections = text.split("\n\n");
    const items: Array<{ type: string; title: string; description: string }> =
      [];

    sections.forEach((section) => {
      const lines = section.split("\n");
      if (
        lines[0].startsWith("Activities:") ||
        lines[0].startsWith("Accommodations:") ||
        lines[0].startsWith("Transportation:")
      ) {
        const type = lines[0].replace(":", "").toLowerCase();
        lines.slice(1).forEach((line) => {
          if (line.startsWith("- ")) {
            const [title, ...descParts] = line.substring(2).split(": ");
            const description = descParts.join(": ");
            const itemType = type.slice(0, -1); // Remove 's' from type
            items.push({ type: itemType, title, description });
          }
        });
      }
    });

    // Limit to 6 items, trying to get 2 of each type if possible
    const limitedItems: typeof items = [];
    const types = ["activity", "accommodation", "transportation"];

    // First, try to get 2 of each type
    types.forEach((type) => {
      const typeItems = items.filter((item) => item.type === type).slice(0, 2);
      limitedItems.push(...typeItems);
    });

    // If we have less than 6, fill with remaining items
    if (limitedItems.length < 6) {
      const remainingItems = items
        .filter((item) => !limitedItems.includes(item))
        .slice(0, 6 - limitedItems.length);
      limitedItems.push(...remainingItems);
    }

    return limitedItems;
  };

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await generateTripRecommendations(trip);
      setRecommendations(response);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const recommendedItems = recommendations
    ? parseRecommendations(recommendations)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested for Your Trip</CardTitle>
      </CardHeader>
      <CardContent>
        {!recommendations && !loading && (
          <div className="text-center">
            <Button onClick={loadRecommendations} variant="default">
              Get Recommendations
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">
              Generating recommendations...
            </p>
          </div>
        )}

        {recommendations && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedItems.map((item, index) => (
              <Card
                key={index}
                className="bg-gray-50 dark:bg-gray-900 flex flex-col"
              >
                <CardContent className="pt-6 flex-1 flex flex-col">
                  <div className="aspect-[5/3] bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full text-primary hover:text-primary"
                      onClick={() =>
                        handleAddToTrip(item.title, item.description, item.type)
                      }
                    >
                      Add to Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
