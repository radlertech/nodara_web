#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
fixture_dir="$(mktemp -d)"
trap 'rm -rf "$fixture_dir"' EXIT
asset_dir="$fixture_dir/assets"
install_dir="$fixture_dir/bin"
mkdir -p "$asset_dir" "$install_dir"

case "$(uname -s)" in
  Darwin) platform="apple-darwin" ;;
  Linux) platform="unknown-linux-gnu" ;;
  *) echo "Installer branding fixture needs macOS or Linux" >&2; exit 1 ;;
esac
case "$(uname -m)" in
  arm64|aarch64) arch="aarch64" ;;
  x86_64|amd64) arch="x86_64" ;;
  *) echo "Unsupported fixture architecture" >&2; exit 1 ;;
esac
target="$arch-$platform"

for asset in "opengpu-$target" "opengpu-node-agent-$target" "mundusx-$target" "mundusx-agent-server-$target"; do
  cat > "$asset_dir/$asset" <<'SH'
#!/bin/sh
[ "${1:-}" = "--version" ] || exit 1
echo "fixture version"
SH
  chmod +x "$asset_dir/$asset"
  if command -v shasum >/dev/null 2>&1; then
    (cd "$asset_dir" && shasum -a 256 "$asset" > "$asset.sha256")
  else
    (cd "$asset_dir" && sha256sum "$asset" > "$asset.sha256")
  fi
done

INSTALL_DIR="$install_dir" MUNDUSX_SKIP_CHAT_SERVICE=1 OPENGPU_GLOBAL_BIN_DIR="" \
  bash "$repo_root/install.sh" --local-assets "$asset_dir" --install-only > "$fixture_dir/install.log"

test "$(readlink "$install_dir/nodara")" = "mundusx"
test "$("$install_dir/nodara" --version)" = "fixture version"
grep -Fq "Nodara installer" "$fixture_dir/install.log"
grep -Fq "Installed Nodara agent command" "$fixture_dir/install.log"
if grep -Fq "MundusX" "$fixture_dir/install.log"; then
  echo "Legacy brand appeared in installer output" >&2
  exit 1
fi

echo "Nodara installer branding verified."
