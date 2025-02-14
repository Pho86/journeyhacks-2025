"use client"
import Login from "./components/Login";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebase.config";
import Image from "next/image";
import UploadButton from "./components/UploadButton";
import Link from "next/link";

interface Food {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const getDb = () => {
  if (!app) throw new Error("Firebase app not initialized");
  return getFirestore(app);
};

export default function Home() {
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const db = getDb();
        const foodsCollection = collection(db, "recipes");
        const foodSnapshot = await getDocs(foodsCollection);
        const foodList = foodSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Food[];
        console.log(foodList);
        setFoods(foodList);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div className="relative max-w-screen-lg w-full">
      <Login />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {foods.map((food) => (
          <Link href={`/recipe/${food.id}`} key={food.id} className=" group">
            {food.imageUrl && (
              <Image
                src={food.imageUrl}
                width={300}
                height={300}
                alt={food.title}
                className="w-full h-72 object-cover rounded-lg"
              />
            )}
            <h3 className="mt-2 text-xl font-semibold group-hover:font-bold transition-all">{food.title}</h3>
          </Link>
        ))}
      </div>
      <UploadButton />
    </div>
  );
}
