"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function TripSidebar() {
  const [email, setEmail] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement invite logic
    console.log("Inviting:", email);
    setEmail("");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Destination</h3>
            <p className="text-muted-foreground">Paris, France</p>
          </div>
          <div>
            <h3 className="font-medium">Travel Partner</h3>
            <p className="text-muted-foreground">Sarah Smith</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Invite Partner</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Travel Partner</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Partner&apos;s Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@example.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Invitation
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
