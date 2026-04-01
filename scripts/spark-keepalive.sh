#!/bin/bash
# ─────────────────────────────────────────────────────────────
# nVision Supabase Keepalive — Spark Server Source
#
# Crontab (on Spark):
#   0 3,15 * * * /root/nvision/spark-keepalive.sh >> /root/nvision/keepalive.log 2>&1
#
# Does: random delay + 2 DB writes + 1 search query
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ── Config ──────────────────────────────────────────────────
SUPABASE_URL="https://iboroipmdnmwworqiypi.supabase.co"

# Read service role key from OpenClaw config or environment
if [ -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  SRK="$SUPABASE_SERVICE_ROLE_KEY"
elif [ -f /root/.nvision-keepalive-key ]; then
  SRK=$(cat /root/.nvision-keepalive-key)
else
  echo "[$(date -u +%FT%TZ)] ERROR: No SUPABASE_SERVICE_ROLE_KEY found"
  exit 1
fi

TIMESTAMP=$(date -u +%FT%TZ)
EPOCH=$(date +%s)

# ── Random delay: 0–90 minutes ─────────────────────────────
DELAY=$((RANDOM % 5400))
echo "[${TIMESTAMP}] Starting keepalive — sleeping ${DELAY}s (~$((DELAY/60))min)"
sleep "$DELAY"

TIMESTAMP=$(date -u +%FT%TZ)
echo "[${TIMESTAMP}] Executing keepalive writes..."

# ── Write 1: INSERT monitor event ──────────────────────────
W1=$(curl -sf -o /dev/null -w "%{http_code}" -X POST \
  "${SUPABASE_URL}/rest/v1/analytics_events" \
  -H "Content-Type: application/json" \
  -H "apikey: ${SRK}" \
  -H "Authorization: Bearer ${SRK}" \
  -H "Prefer: return=minimal" \
  -d "{
    \"event_type\": \"keepalive_monitor\",
    \"event_target\": \"spark-server\",
    \"page_path\": \"/keepalive/monitor/${EPOCH}\"
  }")

echo "[${TIMESTAMP}] Write 1 (monitor event): HTTP ${W1}"

# ── Write 2: INSERT system info event ──────────────────────
UPTIME=$(uptime -p 2>/dev/null || echo "unknown")
LOAD=$(cat /proc/loadavg 2>/dev/null | cut -d' ' -f1-3 || echo "unknown")

W2=$(curl -sf -o /dev/null -w "%{http_code}" -X POST \
  "${SUPABASE_URL}/rest/v1/analytics_events" \
  -H "Content-Type: application/json" \
  -H "apikey: ${SRK}" \
  -H "Authorization: Bearer ${SRK}" \
  -H "Prefer: return=minimal" \
  -d "{
    \"event_type\": \"keepalive_monitor_meta\",
    \"event_target\": \"spark|${UPTIME}|load:${LOAD}\",
    \"page_path\": \"/keepalive/monitor/meta\"
  }")

echo "[${TIMESTAMP}] Write 2 (system info): HTTP ${W2}"

# ── Search: query analytics_events for recent keepalives ───
RECENT=$(curl -sf \
  "${SUPABASE_URL}/rest/v1/analytics_events?select=event_type,created_at&event_type=like.keepalive_*&order=created_at.desc&limit=10" \
  -H "apikey: ${SRK}" \
  -H "Authorization: Bearer ${SRK}")

COUNT=$(echo "$RECENT" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?")
echo "[${TIMESTAMP}] Search (recent keepalives): ${COUNT} events found"

# ── Summary ────────────────────────────────────────────────
if [ "$W1" = "201" ] && [ "$W2" = "201" ]; then
  echo "[${TIMESTAMP}] OK — all writes successful"
else
  echo "[${TIMESTAMP}] WARN — w1=${W1} w2=${W2} (expected 201)"
fi
