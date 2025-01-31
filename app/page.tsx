import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Plan Your Adventures Together
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Create, share, and organize your travel plans with your partner in
            one place
          </p>

          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <FeatureCard
            title="Collaborative Planning"
            description="Plan trips together in real-time with your partner"
          />
          <FeatureCard
            title="Shared Itineraries"
            description="Create and manage travel schedules together"
          />
          <FeatureCard
            title="Travel Sync"
            description="Keep all your travel plans synchronized"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
