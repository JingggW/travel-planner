"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Calendar,
  Home,
  Map,
  Settings,
  Users,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { handleSignOut } from "@/lib/supabase/auth";
import { toast } from "sonner";

const sidebarItems = [
  { label: "Overview", icon: Home, href: "/dashboard" },
  { label: "My Trips", icon: Map, href: "/dashboard/trips" },
  { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
  { label: "Travel Partners", icon: Users, href: "/dashboard/partners" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const onSignOut = async () => {
    try {
      const result = await handleSignOut();
      if (!("error" in result)) {
        toast.success("Signed out successfully");
        router.push("/login");
      } else {
        toast.error("Failed to sign out");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-64 border-r h-screen p-4 flex flex-col">
      <div className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t pt-4 space-y-2">
        <Link
          href="/trips/new"
          className="flex items-center gap-3 px-3 py-2 text-primary hover:bg-muted rounded-lg"
        >
          <PlusCircle className="h-5 w-5" />
          <span>New Trip</span>
        </Link>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-3 py-2 text-destructive hover:bg-muted rounded-lg w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
