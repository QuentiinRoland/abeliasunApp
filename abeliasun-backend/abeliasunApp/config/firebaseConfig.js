import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDT7CEv8ga3fH7UF-cCPTezsa33cj_4Z3A",
  authDomain: "abeliasun.firebaseapp.com",
  projectId: "abeliasun",
  storageBucket: "abeliasun.firebasestorage.app",
  messagingSenderId: "986739984491",
  appId: "1:986739984491:web:9100f617f32ee77b0fc92e",
  measurementId: "G-39HGC911K7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Auth avec la persistance AsyncStorage
const auth = getAuth(app);

// Note: getAnalytics peut ne pas fonctionner sur React Native
// Vous pouvez le commenter si vous n'en avez pas besoin
// const analytics = getAnalytics(app);

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };
