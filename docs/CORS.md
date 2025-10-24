# Configuring CORS for Firebase Storage

This project includes `cors.json` and a helper script to apply a CORS configuration to the Cloud Storage bucket used by the Firebase project `portfolio-site-cac95`.

Why: The browser sends an OPTIONS (preflight) request before uploads. If that preflight returns a non-OK status or missing Access-Control-Allow-* headers the browser will block the upload and report a CORS error.

Files added
- `cors.json` — recommended CORS rules for local dev and the deployed web app.
- `scripts/set_storage_cors.sh` — helper script that calls `gsutil cors set`.

Steps to apply (copy/paste)

1. Install Google Cloud SDK (if you don't have it):

   https://cloud.google.com/sdk/docs/install

2. Authenticate and pick your project (portfolio-site-cac95):

```bash
gcloud auth login
gcloud config set project portfolio-site-cac95
```

3. Run the helper script (from project root):

```bash
chmod +x scripts/set_storage_cors.sh
./scripts/set_storage_cors.sh
# or specify explicit bucket name:
./scripts/set_storage_cors.sh portfolio-site-cac95.appspot.com
```

4. Verify the CORS config:

```bash
gsutil cors get gs://portfolio-site-cac95.appspot.com
```

5. Clear browser cache (or hard-refresh) and retry the upload from your app.

If you prefer to run the gsutil command directly, use:

```bash
gsutil cors set cors.json gs://portfolio-site-cac95.appspot.com
```

Troubleshooting
- If gsutil returns permission errors, ensure your Google account has the right permissions for the project (Storage Admin or Owner).
- Confirm the bucket name exactly matches what is shown in the Firebase Console (Storage → Files).
- If uploads still fail with 403, verify Storage security rules and that the user is authenticated (if rules require auth).

If you'd like, I can also patch the client to:
- show upload progress (uploadBytesResumable),
- validate image mime/type and size before upload, and
- log the preflight/OPTIONS failures to help debugging.
