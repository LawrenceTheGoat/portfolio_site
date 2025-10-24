import { useState, useEffect, useRef } from 'react'
import { signInWithGoogle } from '../../firebase';

const Login = () => {
    const [pending, setPending] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        // track mounted state to avoid setting state after unmount
        return () => { isMounted.current = false; }
    }, []);

    const handleSignIn = async () => {
        if (pending) return;
        if (!isMounted.current) return;
        if (isMounted.current) setPending(true);
        try {
            // signInWithGoogle will try popup and may fall back to redirect in environments
            // where popup polling is blocked (e.g., Cross-Origin-Opener-Policy).
            await signInWithGoogle();
            // success: Dashboard component listens to onAuthStateChanged and will switch to Home
        } catch (err) {
            // Handle common popup cancellation gracefully
            if (err && err.code === 'auth/cancelled-popup-request') {
                // user closed the popup or multiple popups were opened
                // show a friendly message but don't treat as fatal
                alert('Sign-in was cancelled (popup closed). Please try again.');
            } else if (err && err.code === 'auth/popup-closed-by-user') {
                alert('Popup closed before completing sign-in. Please try again.');
            } else if (err && err.code === 'auth/operation-not-supported-in-this-environment') {
                // This environment doesn't support popup flow; signInWithGoogle attempts a redirect fallback.
                // The redirect will navigate away; no further UI state here is needed.
                console.warn('Popup sign-in unsupported; redirect flow should have been started.', err);
            } else {
                console.error('Sign-in error', err);
                alert('Sign-in failed. Check console for details.');
            }
        } finally {
            if (isMounted.current) setPending(false);
        }
    }

    return (
        <div className="dashboard">
            <button onClick={handleSignIn} disabled={pending}>
                {pending ? 'Signing in...' : 'Sign in with Google'}
            </button>
        </div>
    )
}

export default Login;