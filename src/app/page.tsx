import Link from "next/link";

export default function Home() {
  return (
    <div className="relative isolate">
      <div className="mx-auto max-w-4xl py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Plan Your Perfect Trip Together
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Create, share, and collaborate on travel plans with your partner.
            Make every journey an unforgettable adventure together.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/trips/new"
              className="rounded-md bg-blue-500 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Start Planning
            </Link>
            <Link
              href="/trips"
              className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              View Trips <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
