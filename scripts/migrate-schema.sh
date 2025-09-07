#!/bin/bash

# Load environment variables
source .env.local

# Supabase project details
SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
SERVICE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

echo "Setting up database schema..."

# Execute the SQL file using curl
curl -X POST \
  "$SUPABASE_URL/rest/v1/rpc/exec" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "apikey: $SERVICE_KEY" \
  -d @- <<EOF
{
  "sql": "$(cat database/schema/test_system.sql | sed 's/"/\\"/g' | tr '\n' ' ')"
}
EOF

echo "Database schema setup completed!"