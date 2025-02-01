"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export function AddTripCard() {
  return (
    <Link href="/trips/new">
      <Card className="hover:shadow-lg transition-shadow border-2 border-dashed border-muted-foreground/40 hover:border-primary hover:bg-muted/50 group">
        <CardHeader className="p-4 pb-0">
          <div className="space-y-1">
            <h3 className="font-semibold text-xl text-muted-foreground group-hover:text-foreground">
              New Trip
            </h3>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 h-full min-h-[200px] flex items-center justify-center">
          <div className="text-center space-y-2">
            <Plus className="h-12 w-12 text-muted-foreground group-hover:text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground group-hover:text-foreground">
              Click to create a new trip
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
