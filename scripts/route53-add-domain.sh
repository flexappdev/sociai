#!/usr/bin/env bash
# One-shot Route53 setup for sociai.matsiems.com.
# Prereq: valid AWS credentials with route53:ChangeResourceRecordSets on the
# matsiems.com hosted zone. The keys currently in ~/.aws/credentials and
# ~/context-2026/agents/.env return InvalidClientTokenId — rotate first.
#
# Usage:
#   bash scripts/route53-add-domain.sh
set -euo pipefail

DOMAIN="sociai.matsiems.com"
APEX="matsiems.com"
TARGET="cname.vercel-dns.com"

echo "→ Resolving hosted zone id for $APEX..."
ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --dns-name "$APEX" \
  --query "HostedZones[?Name=='${APEX}.'].Id | [0]" \
  --output text | sed 's|/hostedzone/||')

if [ -z "$ZONE_ID" ] || [ "$ZONE_ID" = "None" ]; then
  echo "✗ Could not find hosted zone for $APEX in this AWS account."
  exit 1
fi
echo "  ZONE_ID=$ZONE_ID"

echo "→ Upserting CNAME $DOMAIN → $TARGET..."
CHANGE_ID=$(aws route53 change-resource-record-sets \
  --hosted-zone-id "$ZONE_ID" \
  --change-batch "{\"Changes\":[{\"Action\":\"UPSERT\",\"ResourceRecordSet\":{\"Name\":\"$DOMAIN\",\"Type\":\"CNAME\",\"TTL\":300,\"ResourceRecords\":[{\"Value\":\"$TARGET\"}]}}]}" \
  --query 'ChangeInfo.Id' --output text)
echo "  CHANGE_ID=$CHANGE_ID"

echo "→ Waiting for INSYNC (usually 30–60s)..."
aws route53 wait resource-record-sets-changed --id "$CHANGE_ID"
echo "  ✓ INSYNC"

echo "→ Testing DNS + HTTPS..."
for i in 1 2 3 4 5; do
  status=$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN" || echo 000)
  echo "  attempt $i: HTTP $status"
  if [ "$status" = "200" ] || [ "$status" = "308" ]; then
    echo "  ✓ https://$DOMAIN is live"
    exit 0
  fi
  sleep 8
done

echo "  (still propagating — Vercel will issue the cert once DNS resolves; check https://$DOMAIN in a minute)"
