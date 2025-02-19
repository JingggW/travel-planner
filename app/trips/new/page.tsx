"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const tripSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    destination: z.string().min(2, "Destination must be at least 2 characters"),
    startDate: z.string().refine((date) => new Date(date) >= new Date(), {
      message: "Start date must be in the future",
    }),
    endDate: z.string(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type TripFormData = z.infer<typeof tripSchema>;

export default function NewTripPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

  const onSubmit = async (data: TripFormData) => {
    try {
      setIsLoading(true);

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to create a trip");
        router.push("/login");
        return;
      }

      // Create new trip
      const { data: trip, error } = await supabase
        .from("trips")
        .insert({
          title: data.title,
          destination: data.destination,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          ownerId: session.user.id,
          status: "PLANNING",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Trip created successfully!");
      // Redirect to the new trip's detail page
      router.push(`/trips/${trip.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("Failed to create trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold">Create New Trip</h1>
          <p className="text-muted-foreground">
            Plan your next adventure by filling out the details below.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Trip Title</Label>
              <Input
                id="title"
                placeholder="Summer Vacation 2024"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="Paris, France"
                {...register("destination")}
              />
              {errors.destination && (
                <p className="text-sm text-red-500">
                  {errors.destination.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Trip..." : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
