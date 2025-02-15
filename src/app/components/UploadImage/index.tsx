"use client";
import Image from "next/image";
import { useState } from "react";
import { useUploadThing } from "@/utils/uploadthing";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../../../firebase.config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context";
interface Prediction {
  name: string;
  value: number;
}

interface ClarifaiConcept {
  name: string;
  value: number;
}

const getDb = () => {
  if (!app) throw new Error("Firebase app not initialized");
  return getFirestore(app);
};

export default function FoodAnalyzer() {
  const router = useRouter();
  const { user } = useAuth(); // Get current user
  const [image, setImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [newFood, setNewFood] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [clarifaiLoading, setClarifaiLoading] = useState(false);
  const [localPredictions, setLocalPredictions] = useState<Prediction[]>([]);

  const { startUpload } = useUploadThing("imageUploader");

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Validate file size (4MB limit)
    if (file.size > 4 * 1024 * 1024) {
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          setImage(base64);

          const uploadResponse = await startUpload([file]);
          if (!uploadResponse?.[0]?.ufsUrl) {
            throw new Error("Failed to upload image");
          }
          setImageUrl(uploadResponse[0].ufsUrl);

          setClarifaiLoading(true);
          const response = await fetch("/api/image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: [{
                data: {
                  image: {
                    base64: base64.split(',')[1]
                  }
                }
              }]
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Failed to analyze image");
          }

          const data = await response.json();
          const concepts = data.outputs?.[0]?.data?.concepts;
          
          if (!concepts || !Array.isArray(concepts)) {
            throw new Error("Invalid response format from image analysis");
          }

          const filteredConcepts = concepts
            .filter((concept: ClarifaiConcept) => concept.value > 0.6)
            .map(concept => ({
              name: concept.name,
              value: concept.value
            }));

          setLocalPredictions(filteredConcepts);
          setPredictions(filteredConcepts);

        } catch (err) {
          console.error("Error processing image:", err);
        } finally {
          setClarifaiLoading(false);
        }
      };
      reader.onerror = () => {
        console.error("Failed to read image file. Please try again.");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePrediction = (index: number) => {
    setLocalPredictions(prev => prev.filter((_, i) => i !== index));
    setPredictions(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.trim()) return;

    const newPrediction = {
      name: newFood.trim(),
      value: 1
    };
    setLocalPredictions(prev => [...prev, newPrediction]);
    setPredictions(prev => [...prev, newPrediction]);
    setNewFood("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !title || !user) return;
    
    setLoading(true);
    try {
      const db = getDb();
      
      // Add recipe first
      const recipesCollection = collection(db, "recipes");
      const recipeData = {
        title,
        imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.uid,
      };
      
      const recipeRef = await addDoc(recipesCollection, recipeData);
      
      // Then add all foods
      const foodCollection = collection(db, "food");
      await Promise.all(
        localPredictions.map(prediction => 
          addDoc(foodCollection, {
            name: prediction.name,
            confidence: prediction.value,
            recipeId: recipeRef.id,
            createdAt: new Date().toISOString(),
            userId: user.uid,
          })
        )
      );

      // Reset form
      setTitle("");
      setLocalPredictions([]);
      setPredictions([]);
      setImage(null);
      setImageUrl(null);
      
      // Navigate to home
      router.push("/");
      
    } catch (error) {
      if (error instanceof Error && error.message.includes("permission-denied")) {
        console.error("Permission denied. Please check Firestore rules.");
      } else {
        console.error("Error saving recipe:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white shadow-lg mb-32 rounded-lg w-full max-w-md flex flex-col items-start" // Left-align content
      >
    {/* File Upload Button */}
    <div className="flex flex-col items-start w-full">
      <input id="fileInput" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      
      <div className="flex justify-center w-full">
      
        <label
          htmlFor="fileInput"
          className="px-6 py-2 bg-orange-600 hover:bg-orange-400 text-white rounded-lg cursor-pointer  transition-colors"
        >
          Upload Image
        </label>
      </div>

      {/* Image Preview (Left-Aligned) */}
      {image && (
        <div className="mt-4 self-start">
          <Image
            src={image}
            width={300}
            height={300}
            alt="Food Preview"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>

    {image && (
      <>
        <div className="flex flex-col items-start w-full">
          <h2 className="text-lg font-semibold">Name of Dish:</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Dish name..."
            className="px-3 py-2 border w-full rounded-lg"
            required
          />
        </div>

        <div className="flex flex-col items-start w-full">
          <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
          <div className="mb-4 flex w-full">
            <input
              type="text"
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFood(e);
                }
              }}
              placeholder="Add ingredient..."
              className="px-3 py-1 border rounded-lg flex-1"
            />
            <button
              type="button"
              onClick={handleAddFood}
              className="ml-2 px-4 py-1 bg-zinc-800 text-white rounded-lg hover:bg-zinc-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {(loading || clarifaiLoading) && (
            <div className="p-6 rounded-lg flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-zinc-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading...</span>
            </div>
        )}

        {/* Prediction List (Left-Aligned) */}
        <ul className="list-disc flex flex-col gap-2 self-start">
          {predictions.map((pred, index) => (
            <li key={index} className="flex items-center gap-2 group">
              <span title={`Confidence: ${(pred.value * 100).toFixed(2)}%`}>
                {pred.name} ({(pred.value * 100).toFixed(2)}%)
              </span>
              <button
                type="button"
                className="text-red-500 hover:font-bold transition-all"
                title="Delete"
                onClick={() => deletePrediction(index)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-center w-full">

        {/* Save Recipe Button (Left-Aligned) */}
        <button
          type="submit"
          className="px-8 py-2 text-white rounded-lg bg-orange-600 hover:bg-orange-400 transition-colors self-start"
          disabled={!title}
        >
          Save Recipe
        </button>
        </div>
      </>
    )}
  </form>
</div>

  );
}
