"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDisplayDate } from "@/app/utils/dateUtils";
import Link from "next/link";
import Image from "next/image";
import type { Trip } from "@/app/types/trip";

// Only the props needed for display
type TripCardProps = Pick<
  Trip,
  | "id"
  | "title"
  | "destination"
  | "startDate"
  | "endDate"
  | "imageUrl"
  | "partner"
>;

export function TripCard({
  id,
  title,
  destination,
  startDate,
  endDate,
  imageUrl,
  partner,
}: TripCardProps) {
  return (
    <Link href={`/trips/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        {imageUrl ? (
          <div className="h-48 overflow-hidden relative">
            <Image
              src={imageUrl}
              alt={destination}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        ) : (
          <div className="h-48 bg-muted/50 flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <CardHeader className="p-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-xl line-clamp-1">{title}</h3>
            <p className="text-muted-foreground line-clamp-1">{destination}</p>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>
              {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
            </span>
          </div>
          {partner && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground line-clamp-1">
                ✈️ With {partner}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
