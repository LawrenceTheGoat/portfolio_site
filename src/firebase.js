
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics"
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkpRsiz4gUEOygXYUQyE15eAWu5YN3aoA",
  authDomain: "portfolio-site-cac95.firebaseapp.com",
  projectId: "portfolio-site-cac95",
  storageBucket: "portfolio-site-cac95.firebasestorage.app",
  messagingSenderId: "502032782795",
  appId: "1:502032782795:web:0e3d792971723ddeabd24e",
  measurementId: "G-EMPMSFSTEC"
};


const app = initializeApp(firebaseConfig);
// Initialize analytics only when supported (prevents IndexedDB unavailable warnings in some dev envs)
export let analytics = null;
(async () => {
  try {
    if (await analyticsIsSupported()) {
      analytics = getAnalytics(app);
    } else {
      console.warn('Analytics not supported in this environment; skipping initialization.');
    }
  } catch (e) {
    // Non-fatal; keep app working even when analytics can't initialize
    console.warn('Analytics initialization failed:', e);
  }
})();

export const auth = getAuth();
const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Wrapper around Firebase signInWithPopup to log errors and rethrow.
// Try popup sign-in first; if the environment blocks popup polling (COOP) or
// popups are unsupported, fall back to redirect-based sign-in which avoids
// relying on window.closed polling.
export const signInWithGoogle = async (useRedirectFallback = true) => {
  try {
    return await signInWithPopup(auth, provider);
  } catch (err) {
    console.error('signInWithGoogle error:', err?.code || err, err);

    // Detect errors that indicate the popup flow won't work here.
    const isPopupUnsupported =
      err && (
        err.code === 'auth/operation-not-supported-in-this-environment' ||
        typeof err.message === 'string' && err.message.includes('Cross-Origin-Opener-Policy')
      );

    if (useRedirectFallback && isPopupUnsupported) {
      try {
        // This will redirect the page to the provider; no promise result will be returned here.
        await signInWithRedirect(auth, provider);
        return; // redirecting — function does not return a user here
      } catch (redirectErr) {
        console.error('signInWithRedirect failed:', redirectErr);
        throw redirectErr;
      }
    }

    throw err;
  }
};

// Direct export if callers want to explicitly start a redirect flow
export const startGoogleSignInRedirect = () => signInWithRedirect(auth, provider);