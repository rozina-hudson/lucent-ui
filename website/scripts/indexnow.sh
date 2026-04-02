#!/usr/bin/env bash
# Ping IndexNow after deploy to notify Bing/Yandex of updates.
# Usage: ./website/scripts/indexnow.sh

KEY="1127f77ef4784cb7b607d34e3d56fd7c"
HOST="lucentui.ai"

curl -s -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d "{
    \"host\": \"$HOST\",
    \"key\": \"$KEY\",
    \"keyLocation\": \"https://$HOST/$KEY.txt\",
    \"urlList\": [
      \"https://$HOST/\"
    ]
  }"

echo ""
echo "IndexNow pinged for $HOST"
