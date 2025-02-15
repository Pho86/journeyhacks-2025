"use client";
import Image from "next/image";
import { useState } from "react";
import { useUploadThing } from "@/utils/uploadthing";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
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
  const [error, setError] = useState<string | null>(null);
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const [clarifaiLoading, setClarifaiLoading] = useState(false);

  const { startUpload } = useUploadThing("imageUploader");

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (4MB limit)
    if (file.size > 4 * 1024 * 1024) {
      setError('Image size must be less than 4MB');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert file to base64 for preview and Clarifai
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          setImage(base64);

          const uploadResponse = await startUpload([file]);
          if (!uploadResponse?.[0]?.ufsUrl) {
            throw new Error("Failed to upload image");
          }
          const imageUrl = uploadResponse[0].ufsUrl;

          // Add a check for app initialization
          if (!app) throw new Error("Firebase app not initialized");

          // Then use getFirestore with the guaranteed non-null app
          const db = getDb();
          const recipesCollection = collection(db, "recipes");
          const recipeData = {
            title: "",
            imageUrl,
            createdAt: new Date().toISOString(),
            userId: user?.uid,
          };
          
          const recipeRef = await addDoc(recipesCollection, recipeData);
          setRecipeId(recipeRef.id);

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

          const filteredConcepts = concepts.filter(
            (concept: ClarifaiConcept) => concept.value > 0.6
          );

          const foodCollection = collection(db, "food");
          await Promise.all(
            filteredConcepts.map(concept => 
              addDoc(foodCollection, {
                name: concept.name,
                confidence: concept.value,
                recipeId: recipeRef.id,
                createdAt: new Date().toISOString(),
              })
            )
          );

          const foodQuery = query(foodCollection, where("recipeId", "==", recipeRef.id));
          const foodSnapshot = await getDocs(foodQuery);
          const foods = foodSnapshot.docs.map(doc => ({
            name: doc.data().name,
            value: doc.data().confidence
          }));
          setPredictions(foods);

        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to process image");
          console.error("Error processing image:", err);
        } finally {
          setClarifaiLoading(false);
        }
      };
      reader.onerror = () => {
        setError("Failed to read image file. Please try again.");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      console.error("Error processing image:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePrediction = async (index: number) => {
    if (!recipeId) return;
    
    try {
      const db = getDb();
      const foodCollection = collection(db, "food");
      const foodQuery = query(foodCollection, where("recipeId", "==", recipeId));
      const foodSnapshot = await getDocs(foodQuery);
      const foods = foodSnapshot.docs;
      
      if (foods[index]) {
        await deleteDoc(foods[index].ref);
        
        const updatedFoods = foods.filter((_, i) => i !== index).map(doc => ({
          name: doc.data().name,
          value: doc.data().confidence
        }));
        setPredictions(updatedFoods);
      }
    } catch (error) {
      setError("Failed to delete food item");
      console.error("Error deleting food:", error);
    }
  };

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.trim() || !recipeId) return;

    try {
      const db = getDb();
      const foodCollection = collection(db, "food");
      
      await addDoc(foodCollection, {
        name: newFood.trim(),
        confidence: 1,
        recipeId,
        createdAt: new Date().toISOString(),
        userId: user?.uid,
      });

      // Refresh predictions
      const foodQuery = query(foodCollection, where("recipeId", "==", recipeId));
      const foodSnapshot = await getDocs(foodQuery);
      const foods = foodSnapshot.docs.map(doc => ({
        name: doc.data().name,
        value: doc.data().confidence
      }));
      setPredictions(foods);
      setNewFood("");
    } catch (error) {
      setError("Failed to add food item");
      console.error("Error adding food:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeId || !title) return;
    
    setLoading(true);
    try {
      const db = getDb();
      const recipeRef = doc(db, "recipes", recipeId);
      
      await updateDoc(recipeRef, {
        title,
        updatedAt: new Date().toISOString(),
      });

      // Reset form
      setTitle("");
      setPredictions([]);
      setImage(null);
      setRecipeId(null);
      
      // Navigate to home
      router.push("/");
      
    } catch (error) {
      if (error instanceof Error && error.message.includes("permission-denied")) {
        setError("Permission denied. Please check Firestore rules.");
      } else {
        setError(error instanceof Error ? error.message : "Failed to save recipe");
      }
      console.error("Error saving recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
  <div>
        <div>
        {/* Hidden File Input */}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }} // Hide the default input
        />

        {/* Custom Upload Button */}
        <label
          htmlFor="fileInput"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#333",
            color: "white",
            cursor: "pointer",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          Image Upload
        </label>

        {/* Image Preview */}
        {image && (
          <Image src={image} width={300} height={300} alt="Food Preview" />
        )}
      </div>

  </div>

  {loading || clarifaiLoading && <div>Loading...</div>}

  {error && <div>Error: {error}</div>}

  {predictions.length > 0 && (
    <>
      <div>
        <h2>Food Title:</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Food..."
          required
        />
      </div>

      <div>
        <h3>Food Items:</h3>
        <div>
          <input
            type="text"
            value={newFood}
            onChange={(e) => setNewFood(e.target.value)}
            placeholder="Add food item..."
          />
          <button type="button" onClick={handleAddFood}>
            Add
          </button>
        </div>
        <ul>
          {predictions.map((pred, index) => (
            <li key={index}>
              <span title={`Confidence: ${(pred.value * 100).toFixed(2)}%`}>
                {pred.name} ({(pred.value * 100).toFixed(2)}%)
              </span>
              <button type="button" onClick={() => deletePrediction(index)}>
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit" disabled={!title || predictions.length === 0}>
        Save Recipe
      </button>
    </>
  )}
</form>

  );
}
