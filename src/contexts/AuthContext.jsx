import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  FacebookAuthProvider,
  signInWithPopup,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set persistence to local (keeps user logged in across browser sessions)
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user profile from Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 1. Sign Up Logic
  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Create profile in Firestore
      const profileData = {
        name,
        email,
        uid: newUser.uid,
        grade: 'VIP', // Default grade
        createdAt: new Date().toISOString(),
        medicalSummary: ""
      };

      await setDoc(doc(db, "users", newUser.uid), profileData);
      setUserProfile(profileData);
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  // 2. Login Logic
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // 3. Social Login (Facebook/Telegram) + Passkey Interaction Logic
  const socialLogin = async (platform) => {
    try {
      // In a real VVIP scenario, we trigger the Passkey popup here
      console.log(`[v1.6.0 Security] Triggering Passkey / Face ID for platform: ${platform}`);
      
      // Placeholder for actual WebAuthn/Passkey registration/login
      // If successful, proceed with Firebase Social Auth
      
      if (platform === 'Facebook') {
        const provider = new FacebookAuthProvider();
        await signInWithPopup(auth, provider);
      } else if (platform === 'Telegram') {
        // Telegram Login requires a custom widget, so we'll simulate a secure login for now
        // In production, this would use a cloud function to verify Telegram's auth data
        console.warn("Telegram Auth requires custom implementation via Telegram Widget API.");
        // For demonstration, let's treat it as a special login
        return { success: false, error: "Telegram Login is being configured with your Bot Token." };
      }
      
      // Notify via Telegram (Mock - would call a Cloud Function in production)
      notifyNewLogin(platform);

      return { success: true };
    } catch (error) {
      console.error("Social Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // 4. Logout
  const logout = () => {
    return signOut(auth);
  };

  // 5. Security Notification Helper
  const notifyNewLogin = (method) => {
    console.log(`[Security Alert] New login detected via ${method}. Alerting user's Telegram...`);
  };

  const value = {
    user,
    userProfile,
    signup,
    login,
    socialLogin,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
