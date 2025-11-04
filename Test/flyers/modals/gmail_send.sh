#!/bin/bash

# CONFIGURATION
KEY_FILE="service-account-key.json"
GMAIL_USER="you@gmail.com"       # <-- 🔁 Set this to the user you're sending as
TO="recipient@example.com"       # <-- 🔁 Set your target email
SUBJECT="Test from Gmail API"
BODY="This is a test email sent using Bash, JWT, and Gmail API."

# Load fields from key file
ISSUER=$(jq -r '.client_email' "$KEY_FILE")
PRIVATE_KEY=$(jq -r '.private_key' "$KEY_FILE" | sed 's/\\n/\n/g')

# Create JWT Header and Payload
HEADER=$(echo -n '{"alg":"RS256","typ":"JWT"}' | openssl base64 -A | tr '+/' '-_' | tr -d '=')
NOW=$(date +%s)
EXP=$(($NOW + 3600))
CLAIMS=$(cat <<EOF
{
  "iss":"$ISSUER",
  "scope":"https://www.googleapis.com/auth/gmail.send",
  "aud":"https://oauth2.googleapis.com/token",
  "exp":$EXP,
  "iat":$NOW,
  "sub":"$GMAIL_USER"
}
EOF
)

PAYLOAD=$(echo -n "$CLAIMS" | openssl base64 -A | tr '+/' '-_' | tr -d '=')

# Sign JWT
SIGN_INPUT="$HEADER.$PAYLOAD"
SIGNATURE=$(echo -n "$SIGN_INPUT" | openssl dgst -sha256 -sign <(echo "$PRIVATE_KEY") | openssl base64 -A | tr '+/' '-_' | tr -d '=')
JWT="$SIGN_INPUT.$SIGNATURE"

# Get Access Token
ACCESS_TOKEN=$(curl -s -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded
