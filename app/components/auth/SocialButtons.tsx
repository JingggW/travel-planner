"use client";

import { Button } from "@/components/ui/button";

interface SocialButtonsProps {
  onSocialLogin: (
    provider: "google" | "github"
  ) => Promise<{ error?: string; url?: string }>;
}

export default function SocialButtons({ onSocialLogin }: SocialButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => onSocialLogin("google")}>
          Google
        </Button>
        <Button variant="outline" onClick={() => onSocialLogin("github")}>
          GitHub
        </Button>
      </div>
    </div>
  );
}
