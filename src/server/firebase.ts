import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase.config";

// Initialize Firebase
const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const userCredential = await signInWithPopup(auth, provider);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in with Google", error);
        throw error;
    }
};

const signOut = async () => {
    try {
        await auth.signOut();
        console.log("User signed out successfully");
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
}

export { loginWithGoogle, signOut };