"use client";
import React, { useEffect, useState } from "react";
import Login from "@/app/components/NavBar";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Recipe, Food } from "@/utils/types";
import { db } from "../../../../firebase.config";
import { useAuth } from "@/app/context";
import Link from "next/link";

interface Analysis {
  group: string;
  percentage: number;
  matches: string[];
}

interface AnalysisResult {
  analysis: Analysis[];
  triggers: Analysis[];
  suggestion: string;
}

export default function RecipePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const fetchRecipe = async () => {
      try {
        const recipeId = params.id as string;

        if (!db) {
          setError("Database not initialized");
          return;
        }
        const recipeRef = doc(db, "recipes", recipeId);
        const recipeSnap = await getDoc(recipeRef);

        if (!recipeSnap.exists()) {
          setError("Recipe not found");
          return;
        }

        setRecipe({ id: recipeSnap.id, ...recipeSnap.data() } as Recipe);

        const foodCollection = collection(db, "food");
        const foodQuery = query(
          foodCollection,
          where("recipeId", "==", recipeId)
        );
        const foodSnap = await getDocs(foodQuery);
        const foodList = foodSnap.docs.map((doc) => ({
          name: doc.data().name,
          confidence: doc.data().confidence,
        }));
        setFoods(foodList);
      } catch (err) {
        setError("Error fetching recipe");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id, user, router]);

  const analyzeFoods = async (type: string) => {
    setAnalyzing(true);
    try {
      const response = await fetch("/api/foodanalyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foods: foods.map((f) => f.name),
          type: type,
        }),
      });

      if (!response.ok) throw new Error("Analysis failed");
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing foods:", error);
      setError("Failed to analyze foods");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Recipe not found
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-screen-lg mx-auto mb-16">
        <Login />

        <div className="p-4 bg-white shadow rounded-lg overflow-hidden">
          <Image
            src={recipe.imageUrl}
            width={800}
            height={400}
            alt={recipe.title}
            className="w-full h-[500px] object-cover object-center rounded-lg"
          />

          <div className="pt-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 ">
              {recipe.title}
            </h1>

            <Link
              href={`/profile/${recipe.userId}`}
              className="text-zinc-500 hover:text-zinc-700 transition-colors mb-4 block"
            >
              View Creator&apos;s Profile
            </Link>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Ingredients
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {foods.map((food, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2"
                      title={`${(food.confidence * 100).toFixed(
                        0
                      )}% confidence`}
                    >
                      <span className="text-gray-600">{food.name}</span>
                      <span className="text-sm text-gray-400">
                        ({(food.confidence * 100).toFixed(0)}%)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex gap-4">
                <button
                  onClick={() => analyzeFoods("default")}
                  disabled={analyzing}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50"
                >
                  {analyzing ? "Analyzing..." : "Complete Analysis"}
                </button>
                <button
                  onClick={() => analyzeFoods("fodmap")}
                  disabled={analyzing}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50"
                >
                  {analyzing ? "Analyzing..." : "FODMAP Analysis"}
                </button>
                <button
                  onClick={() => analyzeFoods("usda")}
                  disabled={analyzing}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50"
                >
                  {analyzing ? "Analyzing..." : "Allergen Analysis"}
                </button>
                <button
                  onClick={() => analyzeFoods("sensitivities")}
                  disabled={analyzing}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50"
                >
                  {analyzing ? "Analyzing..." : "Sensitivities Analysis"}
                </button>
              </div>

              {analysis && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Analysis Results
                  </h3>
                  <div className="grid grid-cols-[120px_1fr_80px] gap-y-2">
                    {analysis.analysis.map(({ group, percentage }) => (
                      <div key={group} className="contents">
                        <span className="capitalize">{group}:</span>
                        <div className="bg-gray-200 rounded-full h-4">
                          <div
                            className={`h-full rounded-full ${
                              percentage > 20 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-right">
                          {percentage === 100
                            ? ""
                            : `${percentage.toFixed(1)}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-gray-700">{analysis.suggestion}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
