"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { AuthError } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await (isSigningUp
        ? signUp(email, password)
        : signIn(email, password));
      if (error) {
        setError(error.message);
        return;
      }

      if (isSigningUp) {
        setError("Check your email for the confirmation link.");
        return;
      }

      setShowAuthForm(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleClickOutside = () => {
    setShowAuthForm(false);
    setError(null);
  };

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
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/trips">My Trips</Link>
                </Button>
                <Button asChild>
                  <Link href="/trips/new">Create Trip</Link>
                </Button>
                <Button variant="ghost" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="relative">
                {!showAuthForm ? (
                  <Button onClick={() => setShowAuthForm(true)}>Sign In</Button>
                ) : (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={handleClickOutside}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-700 rounded-md shadow-lg p-4 z-50">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                          <div
                            className={`text-sm ${
                              error.includes("confirmation")
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {error}
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                          </label>
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => {
                              setIsSigningUp(!isSigningUp);
                              setError(null);
                            }}
                          >
                            {isSigningUp
                              ? "Already have an account?"
                              : "Need an account?"}
                          </Button>
                          <Button type="submit">
                            {isSigningUp ? "Sign Up" : "Sign In"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
