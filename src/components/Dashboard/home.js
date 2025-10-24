import { useRef, useState } from 'react';
import { auth, storage, db } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';


const Home = () => {
    const form = useRef();
    const [pending, setPending] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const submitPortfolio = async (e) => {
        e.preventDefault();
        console.debug('submitPortfolio invoked');
        if (pending) {
            console.debug('submit ignored, pending already in progress');
            return;
        }
        setPending(true);
        const name = form.current[0]?.value;
        const description = form.current[1]?.value;
        const url = form.current[2]?.value;
        const image = form.current[3]?.files?.[0];

        console.debug({ name, description, url, hasImage: !!image });

        // Basic validation
        if (!name || !description || !url) {
            alert('Please provide Name, Description, and Url for the portfolio item.');
            setPending(false);
            return;
        }

        // If no image provided, save portfolio entry without upload
        if (!image) {
            try {
                await savePortfolio({ name, description, url, image: null });
            } finally {
                setPending(false);
            }
            return;
        }

        // Use a unique filename to avoid collisions
        const uniqueName = `${Date.now()}_${image.name}`;
        const storageRef = ref(storage, `portfolio/${uniqueName}`);

        // Log auth state and token to help debug 403 storage/unauthorized issues
        try {
            console.debug('Current auth user before upload:', auth.currentUser && { uid: auth.currentUser.uid, email: auth.currentUser.email });
            if (auth.currentUser) {
                const idToken = await auth.currentUser.getIdToken(true).catch((err) => {
                    console.error('getIdToken failed', err);
                    return null;
                });
                console.debug('idToken present (truncated):', idToken ? `${idToken.slice(0,10)}...` : null);
            } else {
                console.warn('No authenticated user present before upload');
            }
        } catch (err) {
            console.error('Error while checking auth token before upload', err);
        }

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setUploadProgress(progress);
                console.debug(`Upload is ${progress}% done`);
            },
            (error) => {
                console.error('upload error', error);
                // still try to save metadata without image
                savePortfolio({ name, description, url, image: null }).finally(() => setPending(false));
            },
            () => {
                // Upload completed successfully, now get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    savePortfolio({ name, description, url, image: downloadUrl });
                }).catch((err) => {
                    console.error('getDownloadURL error', err);
                    savePortfolio({ name, description, url, image: null });
                }).finally(() => setPending(false));
            }
        );
    }

    const savePortfolio = async (portfolio) => {
        try {
            // Sanitize payload to primitives only to avoid Firestore rejecting complex types
            const sanitized = {
                name: String(portfolio.name || ''),
                description: String(portfolio.description || ''),
                url: String(portfolio.url || ''),
                image: portfolio.image ? String(portfolio.image) : null,
                uid: auth?.currentUser?.uid || null,
                createdAt: serverTimestamp()
            };

            console.debug('Saving portfolio to Firestore (sanitized):', sanitized);
            await addDoc(collection(db, 'portfolio'), sanitized);
            window.location.reload(false);
            return true;
        } catch (error) {
            // Log more structured error info to help debugging server-side rejection
            console.error('savePortfolio error', { code: error?.code, message: error?.message, full: error });
            alert('Failed to add portfolio (see console for details)');
            setPending(false);
            return false;
        }
    }

    // Quick debug helper: attempt a minimal Firestore write to test server-side writes
    const testFirestoreWrite = async () => {
        try {
            const doc = { test: 'ok', ts: serverTimestamp(), uid: auth?.currentUser?.uid || null };
            console.debug('Attempting test write to firestore_debug:', doc);
            await addDoc(collection(db, 'firestore_debug'), doc);
            console.debug('Test write succeeded');
            alert('Test write succeeded');
        } catch (err) {
            console.error('Test write failed', err);
            alert('Test write failed — check console for details');
        }
    }

    return (
        <div className="dashboard">

            <form ref={form} onSubmit={submitPortfolio}>
                <p><input type="text" placeholder="Name" /></p>
                <p><textarea placeholder="Description" /></p>
                <p><input type="text" placeholder="Url" /></p>
                <p><input type="file" placeholder="Image" /></p>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => auth.signOut()}>Sign out</button>
                <button type="button" onClick={testFirestoreWrite} style={{marginLeft: '8px'}}>Test Firestore Write</button>
            </form>
        </div>
    )
}

export default Home;