import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                Travel Planner
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/trips"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              My Trips
            </Link>
            <Link
              href="/trips/new"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create Trip
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
