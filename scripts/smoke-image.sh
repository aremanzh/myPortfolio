#!/usr/bin/env bash
# Run the built image the way production runs it (read-only, no capabilities)
# and check what nginx answers. Used by CI; also handy locally:
#   docker build -t portfolio:test . && scripts/smoke-image.sh portfolio:test
set -euo pipefail

IMAGE="${1:?usage: smoke-image.sh <image>}"
PORT="${PORT:-18080}"
NAME="portfolio-smoke-$$"
BASE="http://127.0.0.1:${PORT}"
failures=0

docker run -d --name "$NAME" -p "127.0.0.1:${PORT}:8080" \
  --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges:true \
  "$IMAGE" >/dev/null
trap 'docker rm -f "$NAME" >/dev/null 2>&1 || true' EXIT

for _ in $(seq 1 30); do
  [ "$(docker inspect -f '{{.State.Health.Status}}' "$NAME")" = healthy ] && break
  sleep 1
done

check() { # description, expected, actual
  if [ "$2" = "$3" ]; then echo "ok    $1"; else echo "FAIL  $1: expected '$2', got '$3'"; failures=$((failures + 1)); fi
}
status() { curl -s -o /dev/null -w '%{http_code}' "$BASE$1"; }
header() { curl -s -o /dev/null -D - "${@:2}" "$BASE$1" | tr -d '\r' | sed -n "s/^$(printf '%s' "$HEADER"): //Ip" | head -1; }

check "container healthy" healthy "$(docker inspect -f '{{.State.Health.Status}}' "$NAME")"

for path in / /works /works/ /contact /admin/ /admin/config.yml /sitemap.xml /robots.txt /og.jpg; do
  check "200 $path" 200 "$(status "$path")"
done
first_case=$(curl -s "$BASE/sitemap.xml" | grep -o '/works/[a-z0-9-]*' | head -1)
check "200 $first_case (from sitemap)" 200 "$(status "$first_case")"

# The Malay copy of every page, under /ms.
for path in /ms /ms/ /ms/works /ms/contact "/ms$first_case"; do
  check "200 $path" 200 "$(status "$path")"
done
check "/ms page is in Malay" yes "$(curl -s "$BASE/ms/works" | grep -q '<html lang="ms"' && echo yes)"
check "English page names its Malay copy" yes "$(curl -s "$BASE/works" | grep -q 'hrefLang="ms"' && echo yes)"
check "404 unknown Malay page" 404 "$(status /ms/no-such-page)"

check "404 unknown page" 404 "$(status /no-such-page)"
check "404 unknown case study" 404 "$(status /works/no-such-project)"
check "404 missing asset" 404 "$(status /assets/missing.js)"
check "404 page body boots the app" yes "$(curl -s "$BASE/no-such-page" | grep -q 'entry.client' && echo yes)"

HEADER=location; check "/admin redirects relative" /admin/ "$(header /admin)"
HEADER=location; check "/contacts redirects" /contact "$(header /contacts)"

HEADER=content-type; check "page is html" "text/html; charset=utf-8" "$(header /works)"
HEADER=cache-control; check "page not cached" no-cache "$(header /works)"
HEADER=x-content-type-options; check "security headers on pages" nosniff "$(header /works)"

asset=$(curl -s "$BASE/" | grep -o '/assets/entry\.client-[^"]*\.js' | head -1)
HEADER=cache-control; check "hashed asset immutable" "public, max-age=31536000, immutable" "$(header "$asset")"
HEADER=x-content-type-options; check "security headers on assets" nosniff "$(header "$asset")"
HEADER=content-encoding; check "precompressed gzip served" gzip "$(header "$asset" -H 'Accept-Encoding: gzip')"
HEADER=server; check "no nginx version leak" nginx "$(header /)"

if [ "$failures" -gt 0 ]; then
  echo "---- container log ----"; docker logs --tail 30 "$NAME" || true
  echo "$failures check(s) failed"; exit 1
fi
echo "all checks passed"
