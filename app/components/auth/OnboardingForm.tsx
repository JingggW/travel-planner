"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const onboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url().optional(),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

export function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (data: OnboardingData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }

      toast.success("Onboarding completed successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Onboarding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Complete Your Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Please provide some additional information to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Profile Picture URL (optional)</Label>
          <Input
            id="image"
            placeholder="https://example.com/your-image.jpg"
            {...register("image")}
          />
          {errors.image && (
            <p className="text-sm text-red-500">{errors.image.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Completing Setup..." : "Complete Setup"}
        </Button>
      </form>
    </div>
  );
}
