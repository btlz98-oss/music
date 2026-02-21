#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="${1:-agent.log}"

if [[ ! -f "$LOG_FILE" ]]; then
  echo "❌ Log file not found: $LOG_FILE"
  echo "Usage: $0 [path/to/log-file]"
  exit 1
fi

echo "🔍 Analyzing exit code 1 patterns in $LOG_FILE"
echo "--- last 200 lines ---"
tail -n 200 "$LOG_FILE"

echo

echo "--- likely root-cause keywords (latest 20) ---"
if ! rg -i "timeout|stream closed|performance is not defined|missing required \"type\" field|permission|403|404|connecttimeouterror|initialize request" "$LOG_FILE" | tail -n 20; then
  echo "No known keyword patterns were found. Check stderr blocks near the first failure frame."
fi

echo

echo "--- next checks ---"
echo "1) Verify MCP config includes required fields (especially type/url)."
echo "2) Verify Node.js >= 18 (recommended 20)."
echo "3) If this is CI, check proxy/firewall and MCP_SERVER_TIMEOUT."
echo "4) Re-run with debug logging enabled and capture stderr."
