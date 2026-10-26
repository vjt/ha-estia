#!/usr/bin/env bash
# scripts/check.sh — Run all local checks: pyright, tests, ruff, card
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== pyright ==="
.venv/bin/python -m pyright

echo ""
echo "=== pytest ==="
.venv/bin/python -m pytest tests/ -x -q

echo ""
echo "=== ruff check ==="
.venv/bin/python -m ruff check custom_components/ tests/

echo ""
echo "=== ruff format check ==="
.venv/bin/python -m ruff format --check custom_components/ tests/

echo ""
echo "=== card: typecheck + build is committed ==="
(cd card && npm run --silent check)

echo ""
echo "All checks passed."
