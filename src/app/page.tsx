"use client";
import Login from "./components/NavBar";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebase.config";
import UploadButton from "./components/UploadButton";
import Link from "next/link";
import { FoodImage } from "@/utils/types";
import { getAuth } from "firebase/auth";
import FoodCard from "./components/FoodCard";
const getDb = () => {
  if (!app) throw new Error("Firebase app not initialized");
  return getFirestore(app);
};

export default function Home() {
  const [foods, setFoods] = useState<FoodImage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const db = getDb();
        const foodsCollection = collection(db, "recipes");
        const foodSnapshot = await getDocs(foodsCollection);
        const foodList = foodSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FoodImage[];
        const sortedFoods = foodList
          .filter((food) => food.userId === userId)
          .sort((a, b) => {
            if (!a.updatedAt) return 1;
            if (!b.updatedAt) return -1;
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          });

        setFoods(sortedFoods);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    if (userId) {
      fetchFoods();
    }
  }, [userId]);

  return (
    <>
      <div className="relative max-w-screen-lg w-full">
        <Login />
        <div className="p-4 flex gap-4 flex-col">
          <h1 className="text-3xl md:text-4xl font-bold">Welcome To Food Sensi</h1>
          <h2 className="text-2xl font-bold">Record a New Recipe</h2>
          <div className="flex items-center justify-center">
            <Link href="/upload" className="w-full h-[150px] hover:bg-zinc-50 transition-colors rounded-lg flex items-center justify-center shadow-md">
            <span
              className=" w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg transition-colors pointer-events-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </span>
              </Link>
          </div>

          <h1 className="text-2xl font-bold">Your Recipes</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {foods.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-xl text-gray-600 mb-4">
                  You haven&apos;t created any recipes yet!
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/browse"
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Browse Recipes
                  </Link>
                  <Link
                    href="/upload"
                    className="bg-zinc-800 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Create Recipe
                  </Link>
                </div>
              </div>
            ) : (
              foods.map((food) => <FoodCard key={food.id} food={food} />)
            )}
          </div>
        </div>
      </div>
      <UploadButton />
    </>
  );
}
