"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Trip } from "@/app/types/trip";

type TripCardProps = Pick<
  Trip,
  | "id"
  | "title"
  | "destination"
  | "startDate"
  | "endDate"
  | "imageUrl"
  | "partnerId"
>;

export function TripCard({
  id,
  title,
  destination,
  startDate,
  endDate,
  imageUrl,
  partnerId,
}: TripCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/trips/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div
          className="h-48 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              imageUrl || "/images/trip-placeholder.jpg"
            })`,
          }}
        />
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <div className="space-y-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(new Date(startDate))} -{" "}
                {formatDate(new Date(endDate))}
              </span>
            </div>
            {partnerId && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Traveling with partner</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
