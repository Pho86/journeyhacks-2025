"use client"
import { useState } from "react";

export default function FoodAnalyzer() {
    const [image, setImage] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Image = reader.result as string;
                setImage(base64Image);
                uploadImage(base64Image);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (base64Image: string) => {
        try {
            const response = await fetch('/api/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Image }),
            });
            if (!response.ok) {
                throw new Error('Image upload failed');
            }
            const data = await response.json();
            console.log('Image uploaded successfully:', data);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="Food Preview" width="300" />}
        </div>
    );
}