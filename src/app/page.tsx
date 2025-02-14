"use client"
import Login from "./components/Login";
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
        const foodList = foodSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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
        console.error('Error fetching foods:', error);
      }
    };

    if (userId) {
      fetchFoods();
    }
  }, [userId]);

  return (
    <div className="relative max-w-screen-lg w-full">
      <Login />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {foods.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-xl text-gray-600 mb-4">You haven&apos;t created any recipes yet!</p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/upload"
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Create Recipe
              </Link>
              <Link
                href="/browse" 
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Browse Recipes
              </Link>
            </div>
          </div>
        ) : (
          foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))
        )}
      </div>
      <UploadButton />
    </div>
  );
}
