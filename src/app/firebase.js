
import { initializeApp } from "firebase/app";
import { getAuth,  signInWithEmailAndPassword  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaPhA8fnCdBUCDo03Bgki53CWFxOCzeG4",
  authDomain: "productboard-17d5a.firebaseapp.com",
  projectId: "productboard-17d5a",
  storageBucket: "productboard-17d5a.firebasestorage.app",
  messagingSenderId: "641441165191",
  appId: "1:641441165191:web:4248452f1e2a6d55f92d22",
  measurementId: "G-6HM614H3Z2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);




async function signInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Successfully signed in:", user);
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error signing in:", errorCode, errorMessage);
    throw error;
  }
}

export { auth, signInUser };