import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAzuxMetRQIvdlPwndNm80cym9aPLI0g28",
  authDomain: "cambodia-vvip-medical-platform.firebaseapp.com",
  projectId: "cambodia-vvip-medical-platform",
  storageBucket: "cambodia-vvip-medical-platform.firebasestorage.app",
  messagingSenderId: "921402304388",
  appId: "1:921402304388:web:eb42ac62b8b9089c3e5fd1",
  measurementId: "G-NPZYT85XGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
