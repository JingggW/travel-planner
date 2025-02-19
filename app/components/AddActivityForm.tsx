"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ActivityType } from "@/app/types/trip";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const activitySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.nativeEnum(ActivityType),
  date: z.string(),
  time: z.string(),
  location: z.string().min(2, "Location must be at least 2 characters"),
  notes: z.string().optional(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface PlaceRecommendation {
  name: string;
  address: string;
  rating?: number;
  types: string[];
}

interface AddActivityFormProps {
  tripId: string;
  destination: string;
  onActivityAdded: () => void;
}

export function AddActivityForm({
  tripId,
  destination,
  onActivityAdded,
}: AddActivityFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PlaceRecommendation[]>(
    []
  );
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
  });

  const fetchPlaceRecommendations = async () => {
    try {
      const response = await fetch("/api/places/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination }),
      });

      if (!response.ok) throw new Error("Failed to fetch recommendations");

      const data = await response.json();
      setRecommendations(data.places);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Failed to load place recommendations");
    }
  };

  const onSubmit = async (data: ActivityFormData) => {
    try {
      setIsLoading(true);

      const { error } = await supabase.from("activities").insert({
        tripId,
        ...data,
      });

      if (error) throw error;

      toast.success("Activity added successfully!");
      onActivityAdded();
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("Failed to add activity");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationSelect = (place: PlaceRecommendation) => {
    setValue("title", place.name);
    setValue("location", place.address);
    setValue("type", ActivityType.SIGHT);
    setValue("notes", `Rating: ${place.rating}/5`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button
          variant="secondary"
          onClick={fetchPlaceRecommendations}
          className="w-full"
        >
          Get Popular Attractions
        </Button>

        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((place, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleRecommendationSelect(place)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold">{place.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {place.address}
                  </p>
                  {place.rating && (
                    <p className="text-sm">Rating: {place.rating}/5</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Activity Title</Label>
          <Input
            id="title"
            placeholder="Visit Eiffel Tower"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Activity Type</Label>
          <Select
            onValueChange={(value) => setValue("type", value as ActivityType)}
            defaultValue={ActivityType.SIGHT}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ActivityType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" {...register("time")} />
            {errors.time && (
              <p className="text-sm text-red-500">{errors.time.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Address or place name"
            {...register("location")}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any additional details..."
            {...register("notes")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adding Activity..." : "Add Activity"}
        </Button>
      </form>
    </div>
  );
}
