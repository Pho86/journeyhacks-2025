"use client";
import React from 'react';
import FoodAnalyzer from '../components/UploadImage';
import Login from '../components/NavBar';
import { useAuth } from '../context';

export default function UploadPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-screen-lg w-full mx-auto">
        <Login />
        <h1 className='font-bold text-2xl p-4'>Add Recipe</h1>
        <div className="flex items-center mt-32 justify-center">
          Please login to create recipes
        </div>
      </div>
    ); 
  }

  return (
    <div className="max-w-screen-lg w-full mx-auto">
      <Login />
      <div className="p-4">
        <FoodAnalyzer />
      </div>
    </div>
  );
}
