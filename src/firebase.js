/**
 * firebase.js
 * -----------------------
 * Initializes and exports Firebase services for the app.
 *
 * Services included:
 * - Firestore (Database)
 * - Firebase Auth (Authentication)
 * 
 * Also re-exports frequently used Firestore methods for cleaner imports in components.
 */

import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk2JdzKr8JFD34gAFpSBv1xVPbJtif3mc",
  authDomain: "film-fusion-1c51a.firebaseapp.com",
  projectId: "film-fusion-1c51a",
  storageBucket: "film-fusion-1c51a.appspot.com",
  messagingSenderId: "823617084676",
  appId: "1:823617084676:web:7b08e94d8fa52533a7c451"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Export initialized services and commonly used Firestore functions
export {
  db,
  auth,
  collection,
  addDoc,
  getDocs,
  query,
  where
};