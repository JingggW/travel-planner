import { TripItem } from "@/types";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import {
  generateActivityRecommendations,
  generateHotelRecommendations,
  generateFoodRecommendations,
} from "@/lib/together";

interface DayItineraryProps {
  date: string;
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
  onDelete?: () => void;
}

export function DayItinerary({
  date,
  items,
  tripId,
  trip,
  onDelete,
}: DayItineraryProps) {
  const router = useRouter();
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<
    "activity" | "hotel" | "food" | null
  >(null);
  const [generatedDayItems, setGeneratedDayItems] = useState<
    Array<{
      title: string;
      description: string;
      type: string;
    }>
  >([]);

  const handleEdit = (item: TripItem) => {
    router.push(`/trips/${tripId}/items/${item.id}/edit`);
  };

  const handleDelete = async (itemId: string) => {
    try {
      setDeletingItemId(itemId);
      const { error } = await supabase
        .from("trip_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      // Call the onDelete callback after successful deletion
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting trip item:", error);
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleAddGenerated = (item: {
    title: string;
    description: string;
    type: string;
  }) => {
    const params = new URLSearchParams({
      title: item.title,
      description: item.description,
      type: item.type,
    }).toString();
    router.push(`/trips/${tripId}/items/new?${params}`);
  };

  const loadRecommendations = async (type: "activity" | "hotel" | "food") => {
    if (!trip?.location) return;

    try {
      setLoadingType(type);
      let response;
      const tripData = {
        title: "Trip to " + trip.location,
        location: trip.location,
        start_date: trip.start_date,
        end_date: trip.end_date,
        id: tripId,
        user_id: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      switch (type) {
        case "activity":
          response = await generateActivityRecommendations(tripData);
          break;
        case "hotel":
          response = await generateHotelRecommendations(tripData);
          break;
        case "food":
          response = await generateFoodRecommendations(tripData);
          break;
      }

      console.log(`Raw ${type} recommendations:`, response);

      // Parse the recommendations
      const items = response
        .split("\n")
        .filter((line) => line.startsWith("- "))
        .map((line) => {
          const [title, ...descParts] = line.substring(2).split(": ");
          const description = descParts.join(": ");
          const mappedType = type === "hotel" ? "accommodation" : type;
          console.log("Mapping item:", {
            title,
            description,
            type: mappedType,
          });
          return {
            title,
            description,
            type: mappedType,
          };
        });

      console.log(`Final ${type} items:`, items);
      setGeneratedDayItems(items);
    } catch (error) {
      console.error(`Error loading ${type} recommendations:`, error);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Day Title */}
      <div className="bg-[#6366F1] text-white px-6 py-4 rounded-3xl flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
        </svg>
        <h2 className="text-lg font-semibold">{date}</h2>
      </div>

      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-6">
          {/* Time */}
          <div className="w-24 flex-shrink-0 text-gray-500 text-sm pt-2">
            {item.start_datetime && (
              <div>
                {new Date(item.start_datetime).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
                {item.end_datetime && (
                  <>
                    <br />
                    {new Date(item.end_datetime).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Card Content */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm p-6 group relative">
            <div className="flex items-start gap-4">
              {/* Activity Icon Circle */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  item.type === "transportation"
                    ? "bg-[#EEF2FF] text-[#4B7BF5]"
                    : item.type === "accommodation"
                    ? "bg-[#FDF2F8] text-[#EC4899]"
                    : item.type === "food"
                    ? "bg-[#F0FDF4] text-[#4CAF50]"
                    : "bg-[#FEF9E7] text-[#F6C549]"
                }`}
              >
                {item.type === "transportation" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
                  </svg>
                ) : item.type === "accommodation" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
                    <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
                  </svg>
                ) : item.type === "food" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M533-440q-32-45-84.5-62.5T340-520t-108.5 17.5T147-440zM40-360q0-109 91-174.5T340-600t209 65.5T640-360zm0 160v-80h600v80zM720-40v-80h56l56-560H450l-10-80h200v-160h80v160h200L854-98q-3 25-22 41.5T788-40zm0-80h56zM80-40q-17 0-28.5-11.5T40-80v-40h600v40q0 17-11.5 28.5T600-40zm260-400" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                )}
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold text-gray-900 mb-0.5">
                    {item.title}
                  </h3>
                  <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
                      onClick={() => handleEdit(item)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-red-600 h-8 w-8 p-0"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingItemId === item.id}
                    >
                      {deletingItemId === item.id ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                          <path
                            fillRule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                          />
                        </svg>
                      )}
                    </Button>
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                )}
                {item.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                    </svg>
                    {item.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Generated Items */}
      {generatedDayItems.map((item, index) => (
        <div
          key={`generated-${index}`}
          className="flex items-start gap-4 opacity-60 hover:opacity-100 transition-opacity"
        >
          {/* Activity Icon Circle */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              item.type === "transportation"
                ? "bg-[#EEF2FF] text-[#4B7BF5]"
                : item.type === "accommodation"
                ? "bg-[#FDF2F8] text-[#EC4899]"
                : item.type === "food"
                ? "bg-[#F0FDF4] text-[#4CAF50]"
                : "bg-[#FEF9E7] text-[#F6C549]"
            }`}
          >
            {item.type === "transportation" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
              </svg>
            ) : item.type === "accommodation" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
                <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
              </svg>
            ) : item.type === "food" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 -960 960 960"
              >
                <path d="M533-440q-32-45-84.5-62.5T340-520t-108.5 17.5T147-440zM40-360q0-109 91-174.5T340-600t209 65.5T640-360zm0 160v-80h600v80zM720-40v-80h56l56-560H450l-10-80h200v-160h80v160h200L854-98q-3 25-22 41.5T788-40zm0-80h56zM80-40q-17 0-28.5-11.5T40-80v-40h600v40q0 17-11.5 28.5T600-40zm260-400" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
              </svg>
            )}
          </div>

          {/* Generated Item Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-0.5">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {item.description}
            </p>
          </div>

          {/* Add Button */}
          <div className="flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#4B7BF5] hover:text-[#3A6AE4] h-8 px-3"
              onClick={() => handleAddGenerated(item)}
            >
              Add
            </Button>
          </div>
        </div>
      ))}

      {/* Add Activity Button */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <Button
          variant="ghost"
          className="text-[#4B7BF5] font-medium flex items-center gap-1 text-sm"
          onClick={() => router.push(`/trips/${tripId}/items/new`)}
        >
          <span className="text-lg">+</span> Add Activity
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          className="text-[#F6C549] hover:text-[#E5B438] font-medium text-sm relative"
          onClick={() => loadRecommendations("activity")}
          disabled={loadingType !== null}
        >
          {loadingType === "activity" ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
          ) : (
            "Get Activities"
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-[#EC4899] hover:text-[#DB2777] font-medium text-sm relative"
          onClick={() => loadRecommendations("hotel")}
          disabled={loadingType !== null}
        >
          {loadingType === "hotel" ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
          ) : (
            "Get Hotels"
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-[#4CAF50] hover:text-[#3B9E3F] font-medium text-sm relative"
          onClick={() => loadRecommendations("food")}
          disabled={loadingType !== null}
        >
          {loadingType === "food" ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
          ) : (
            "Get Food & Dining"
          )}
        </Button>

        {generatedDayItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 font-medium text-sm"
            onClick={() => setGeneratedDayItems([])}
          >
            Clear Suggestions
          </Button>
        )}
      </div>
    </div>
  );
}
