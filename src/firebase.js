import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdmZt0qqluutpNLXz6ktUZjwrzYN4DY68",
  authDomain: "danish-portfolio-1dad5.firebaseapp.com",
  projectId: "danish-portfolio-1dad5",
  storageBucket: "danish-portfolio-1dad5.firebasestorage.app",
  messagingSenderId: "578289816455",
  appId: "1:578289d9327754e19a33922",
  measurementId: "G-2G7C0FSX60"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);