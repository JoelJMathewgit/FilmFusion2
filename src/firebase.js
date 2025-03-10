import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBk2JdzKr8JFD34gAFpSBv1xVPbJtif3mc",
  authDomain: "film-fusion-1c51a.firebaseapp.com",
  projectId: "film-fusion-1c51a",
  storageBucket: "film-fusion-1c51a.firebasestorage.app",
  messagingSenderId: "823617084676",
  appId: "1:823617084676:web:7b08e94d8fa52533a7c451"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db, collection, addDoc};
