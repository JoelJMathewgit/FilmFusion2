import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBk2JdzKr8JFD34gAFpSBv1xVPbJtif3mc",
  authDomain: "film-fusion-1c51a.firebaseapp.com",
  projectId: "film-fusion-1c51a",
  storageBucket: "film-fusion-1c51a.appspot.com",
  messagingSenderId: "823617084676",
  appId: "1:823617084676:web:7b08e94d8fa52533a7c451"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, collection, addDoc, getDocs, query, where, auth };