"use client";
import React from 'react';
import FoodAnalyzer from '../components/Image';
import Login from '../components/Login';
import { useAuth } from '../context';

export default function UploadPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-screen-lg w-full mx-auto">
        <Login />
        <div className="min-h-screen flex items-center justify-center">
          Please login to create recipes
        </div>
        ;
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
