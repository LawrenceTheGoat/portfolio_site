#!/usr/bin/env bash
set -euo pipefail

# Script to apply cors.json to the Firebase Storage bucket for this project.
# Usage: ./scripts/set_storage_cors.sh [BUCKET]
# If BUCKET is not provided, it defaults to portfolio-site-cac95.appspot.com

BUCKET=${1:-portfolio-site-cac95.appspot.com}
CORS_FILE="$(dirname "$0")/../cors.json"

if ! command -v gsutil >/dev/null 2>&1; then
  echo "ERROR: gsutil not found. Install Google Cloud SDK and enable gsutil." >&2
  echo "See: https://cloud.google.com/sdk/docs/install" >&2
  exit 2
fi

if [ ! -f "$CORS_FILE" ]; then
  echo "ERROR: cors.json not found at $CORS_FILE" >&2
  exit 2
fi

echo "Applying CORS configuration from $CORS_FILE to gs://$BUCKET ..."
gsutil cors set "$CORS_FILE" "gs://$BUCKET"
echo "CORS applied. Current CORS configuration:" 
gsutil cors get "gs://$BUCKET" || true

echo "Done. You may need to clear browser cache and retry uploads from your app." 
