"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from "../../../../firebase.config";
import Login from "@/app/components/NavBar";
import { FoodImage } from "@/utils/types";
import FoodCard from "@/app/components/FoodCard";
import { useParams } from "next/navigation";

const getDb = () => {
  if (!app) throw new Error("Firebase app not initialized");
  return getFirestore(app);
};

export default function ProfilePage() {
  const params = useParams();
  const userid = params.userid as string;
  const [foods, setFoods] = useState<FoodImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserFoods = async () => {
      try {
        const db = getDb();
        const foodsCollection = collection(db, "recipes");
        const userFoodsQuery = query(
          foodsCollection,
          where("userId", "==", userid)
        );
        const foodSnapshot = await getDocs(userFoodsQuery);
        const foodList = foodSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FoodImage[];

        const sortedFoods = foodList.sort((a, b) => {
          if (!a.updatedAt) return 1;
          if (!b.updatedAt) return -1;
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });

        setFoods(sortedFoods);
      } catch (error) {
        console.error("Error fetching user foods:", error);
        setError("Failed to load user's recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchUserFoods();
  }, [userid]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="relative max-w-screen-lg w-full">
      <Login />
      <div className="p-4 flex gap-4 flex-col">
        <h1 className="text-2xl font-bold">User&apos;s Recipes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {foods.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-xl text-gray-600">
                This user hasn&apos;t created any recipes yet!
              </p>
            </div>
          ) : (
            foods.map((food) => <FoodCard key={food.id} food={food} />)
          )}
        </div>
      </div>
    </div>
  );
}
