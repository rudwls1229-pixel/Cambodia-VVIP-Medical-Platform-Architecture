import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Corrected Config from User's Prompt (Arux, V in ID, etc.)
const firebaseConfig = {
  apiKey: "AIzaSyAruxMetRQIVdlPwn6Wn08cym9aPLI0g28",
  authDomain: "cambodia-vvip-medical-platform.firebaseapp.com",
  projectId: "cambodia-vvip-medical-platform",
  storageBucket: "cambodia-vvip-medical-platform.firebasestorage.app",
  messagingSenderId: "921402304388",
  appId: "1:921402304388:web:eb42ac62b0b9089c3e5fd1",
  measurementId: "G-NPZVT85XGY"
};

// Robust Initialization
let app;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log("[Firebase] Successfully Initialized v1.6.4");
  } else {
    app = getApp();
  }
} catch (error) {
  console.error("[Firebase] Initialization failed:", error);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
