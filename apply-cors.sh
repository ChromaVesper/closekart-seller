#!/bin/bash
# ============================================================
# CloseKart Firebase Storage CORS Fix Script
# Run this ONCE after logging into gcloud:
#   gcloud auth login
#   bash apply-cors.sh
# ============================================================

BUCKET_APPSPOT="gs://closekart-8f6b0.appspot.com"
BUCKET_NEW="gs://closekart-8f6b0.firebasestorage.app"
CORS_FILE="cors.json"

echo "Applying CORS to $BUCKET_APPSPOT ..."
/Users/akshaykumar/Library/Python/3.9/bin/gsutil cors set $CORS_FILE $BUCKET_APPSPOT

echo "Applying CORS to $BUCKET_NEW ..."
/Users/akshaykumar/Library/Python/3.9/bin/gsutil cors set $CORS_FILE $BUCKET_NEW

echo ""
echo "Verifying CORS config:"
/Users/akshaykumar/Library/Python/3.9/bin/gsutil cors get $BUCKET_APPSPOT
/Users/akshaykumar/Library/Python/3.9/bin/gsutil cors get $BUCKET_NEW

echo ""
echo "Done! CORS configured successfully."
