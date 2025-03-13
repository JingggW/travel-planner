import { Trip } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  generateActivityRecommendations,
  generateHotelRecommendations,
  generateFoodRecommendations,
} from "@/lib/together";
import { useRouter } from "next/navigation";

interface TripRecommendationsProps {
  trip: Trip;
}

type RecommendationType = "activity" | "hotel" | "food";

interface Recommendation {
  type: RecommendationType;
  title: string;
  description: string;
}

export function TripRecommendations({ trip }: TripRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<
    Record<RecommendationType, string>
  >({
    activity: "",
    hotel: "",
    food: "",
  });
  const [loading, setLoading] = useState<Record<RecommendationType, boolean>>({
    activity: false,
    hotel: false,
    food: false,
  });
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

  const parseRecommendations = (
    text: string,
    type: RecommendationType
  ): Recommendation[] => {
    const lines = text.split("\n");
    const items: Recommendation[] = [];

    lines.forEach((line) => {
      if (line.startsWith("- ")) {
        const [title, ...descParts] = line.substring(2).split(": ");
        const description = descParts.join(": ");
        items.push({ type, title, description });
      }
    });

    return items.slice(0, 3);
  };

  const loadRecommendations = async (type: RecommendationType) => {
    try {
      setLoading((prev) => ({ ...prev, [type]: true }));

      let response;
      switch (type) {
        case "activity":
          response = await generateActivityRecommendations(trip);
          break;
        case "hotel":
          response = await generateHotelRecommendations(trip);
          break;
        case "food":
          response = await generateFoodRecommendations(trip);
          break;
      }

      setRecommendations((prev) => ({ ...prev, [type]: response }));
    } catch (error) {
      console.error(`Error loading ${type} recommendations:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const renderButton = (type: RecommendationType) => {
    const title =
      type === "activity"
        ? "Activities"
        : type === "hotel"
        ? "Hotels"
        : "Food & Dining";
    const buttonText = `Get ${title}`;
    const isLoading = loading[type];

    if (isLoading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[120px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            Generating {title.toLowerCase()} recommendations...
          </p>
        </div>
      );
    }

    return (
      <Button
        onClick={() => loadRecommendations(type)}
        className={`flex-1 text-white font-medium text-lg py-6 rounded-2xl ${
          type === "activity"
            ? "bg-[#F6C549] hover:bg-[#E5B438]"
            : type === "hotel"
            ? "bg-[#4B7BF5] hover:bg-[#3A6AE4]"
            : "bg-[#4CAF50] hover:bg-[#3B9E3F]"
        }`}
      >
        {buttonText}
      </Button>
    );
  };

  const renderRecommendations = (type: RecommendationType) => {
    const content = recommendations[type];
    if (!content || loading[type]) return null;

    const items = parseRecommendations(content, type);

    return (
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <Card key={index} className="bg-gray-50 dark:bg-gray-900">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {item.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    handleAddToTrip(item.title, item.description, type)
                  }
                >
                  Add to Trip
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        {renderButton("activity")}
        {renderButton("hotel")}
        {renderButton("food")}
      </div>
      {(recommendations.activity ||
        recommendations.hotel ||
        recommendations.food) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderRecommendations("activity")}
          {renderRecommendations("hotel")}
          {renderRecommendations("food")}
        </div>
      )}
    </div>
  );
}
