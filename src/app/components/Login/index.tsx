"use client";
import React from "react";
import { loginWithGoogle, signOut } from "@/server/firebase";
import { useAuth } from "@/app/context";
import Link from "next/link"; 

export default function Login() {
  const { user, login } = useAuth();
  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result.displayName) {
        login(result.displayName);
      } else {
        console.error("Display name is null");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="flex w-full justify-between gap-4 p-4">
      <div className="flex gap-4 items-center justify-center">
        <Link
          href="/"
          className="text-gray-700 hover:text-gray-900 font-medium hover:font-bold transition-all"
        >
          Home
        </Link>
        <Link
          href="/upload"
          className="text-gray-700 hover:text-gray-900 font-medium hover:font-bold transition-all"
        >
          Create Recipe
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user == null ? (
          <button
            onClick={handleGoogleLogin}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Login with Google
          </button>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-700">
              Welcome, {user.displayName}
            </p>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

