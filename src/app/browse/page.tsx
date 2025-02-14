"use client";
import Login from "../components/Login";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../../firebase.config";
import UploadButton from "../components/UploadButton";
import { FoodImage } from "@/utils/types";
import FoodCard from "../components/FoodCard";
const getDb = () => {
  if (!app) throw new Error("Firebase app not initialized");
  return getFirestore(app);
};

export default function Home() {
  const [foods, setFoods] = useState<FoodImage[]>([]);

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
        
        const sortedFoods = foodList.sort((a, b) => {
          if (!a.updatedAt) return 1;
          if (!b.updatedAt) return -1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

        setFoods(sortedFoods);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div className="relative max-w-screen-lg w-full">
      <Login />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
      <UploadButton />
    </div>
  );
}
