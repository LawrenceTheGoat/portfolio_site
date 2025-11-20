React portfolio website

This repository contains a React-based portfolio website with Firebase integration used for authentication and optional hosting.

Prerequisites
- Node.js (v16+ recommended) and npm installed
- Optional: Firebase CLI if you plan to deploy with `firebase deploy`

Quickstart — clone and run locally

1. Clone the repository

```bash
git clone git@github.com:LawrenceTheGoat/portfolio_site.git
cd portfolio_site
```

2. Install dependencies

Use a clean install which is reproducible for CI:

```bash
npm ci
# or if you need to add packages during development: npm install
```

3. Create local environment variables

This project expects Firebase configuration to be provided as environment variables named `REACT_APP_FIREBASE_*` (see `.env.example`). Copy the example and fill in values from your Firebase project:

```bash
cp .env.example .env
# edit .env and paste your project's REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_AUTH_DOMAIN, etc.
```

Important: Do not commit `.env` — it is included in `.gitignore`.

4. Start the dev server

```bash
npm start
```

Build and deploy

- To create a production build:

```bash
npm run build
```

- To deploy to Firebase Hosting (if configured):

```bash
firebase deploy --only hosting
```

CI / GitHub Actions

This repo contains GitHub Actions workflows to run the build and (optionally) deploy to Firebase. Instead of embedding keys in the repo, the workflows should receive Firebase credentials / API keys via GitHub Secrets. Recommended secret names:

- `FIREBASE_TOKEN` (if you use the classic `firebase login:ci` token)
- or individual `REACT_APP_FIREBASE_*` values for build-time injection

