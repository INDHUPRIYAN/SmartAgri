// firebaseFunctions.js
import { doc, setDoc, getDoc } from "firebase/firestore"; // Added getDoc import
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";

export const signUpUser = async (email, password, userData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Save user data in Firestore under UID
  await setDoc(doc(db, "users", uid), {
    ...userData,
    email,
    createdAt: new Date().toISOString()
  });

  return uid;
};

export const signInUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Fetch user data from Firestore
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return { uid, ...userDoc.data() };
  } else {
    throw new Error("User data not found in Firestore");
  }
};

// Add social login functions
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const signInWithApple = async () => {
  const provider = new OAuthProvider('apple.com');
  const result = await signInWithPopup(auth, provider);
  return result.user;
};