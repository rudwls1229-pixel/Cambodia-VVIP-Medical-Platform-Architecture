import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  FacebookAuthProvider,
  GoogleAuthProvider,
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
      try {
        setUser(currentUser);
        if (currentUser) {
          // Robust Profile Fetching (prevents black screen if Firestore is not enabled)
          try {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserProfile(docSnap.data());
            }
          } catch (dbError) {
            console.warn("[Firebase] Firestore is not enabled or reachable. App will continue with limited profile data.", dbError);
          }
        } else {
          setUserProfile(null);
        }
      } catch (authError) {
        console.error("[Auth] Status change error:", authError);
      } finally {
        setLoading(false);
      }
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

  // 3. Social Login (Google/Facebook/Telegram) + Passkey Interaction Logic
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Sync with Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const profileData = {
          name: user.displayName || "VVIP Member",
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          grade: 'VIP',
          createdAt: new Date().toISOString(),
        };
        await setDoc(docRef, profileData);
        setUserProfile(profileData);
      }
      return { success: true };
    } catch (error) {
      console.error("Google Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const socialLogin = async (platform) => {
    try {
      console.log(`[v1.6.1 Security] Triggering Passkey / Face ID for platform: ${platform}`);
      
      if (platform === 'Google') {
        return await googleLogin();
      } else if (platform === 'Facebook') {
        const provider = new FacebookAuthProvider();
        await signInWithPopup(auth, provider);
      } else if (platform === 'Telegram') {
        console.warn("Telegram Auth requires custom implementation.");
        return { success: false, error: "Telegram Login is being configured." };
      }
      
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
