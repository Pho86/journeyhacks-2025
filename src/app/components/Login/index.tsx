"use client"
import React from 'react';
import { loginWithGoogle, signOut } from "@/server/firebase";
import { useAuth, } from '@/app/context'; // Adjust the import path accordingly

const Login: React.FC = () => {
    const { user, login } = useAuth();
    const handleGoogleLogin = async () => {
        try {
            const result = await loginWithGoogle();
            if (result.displayName) {
                login(result.displayName); // Assuming result has a displayName property
            } else {
                console.error("Display name is null");
            }
            // Handle successful login
        } catch (err) {
            console.log(err);
        }
    };

    const handleSignOut = async () => {
        console.log(user)
        try {
            await signOut();
            // Handle successful sign out
        } catch (err) {
            console.log(err);
        }
    }

    return (
      <div className="flex gap-2">
        {user == null ? (
          <button onClick={handleGoogleLogin}>Login with Google</button>
        ) : (
          <button onClick={handleSignOut}>Sign out</button>
        )}
        {user && <p>Welcome, {user}</p>}
      </div>
    );
};

export default Login;