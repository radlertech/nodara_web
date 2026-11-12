#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
out_dir="$(mktemp -d)"
trap 'rm -rf "$out_dir"' EXIT

node "$repo_root/scripts/build-public-docs-site.mjs" "$out_dir"

require_file() {
  local path="$1"
  if [[ ! -f "$out_dir/$path" ]]; then
    echo "missing generated file: $path" >&2
    exit 1
  fi
}

require_line() {
  local path="$1"
  local pattern="$2"
  if ! grep -Fq -- "$pattern" "$out_dir/$path"; then
    echo "missing pattern '$pattern' in generated $path" >&2
    exit 1
  fi
}

require_file "index.html"
require_file "assets/nodara-mark.png"
require_file "assets/nodara-icon.svg"
for size in mobile tablet desktop; do
  require_file "assets/network-cta-mountains-$size.webp"
  require_file "assets/meet-atlas-background-$size.webp"
  require_file "assets/network-hero-globe-$size.webp"
  require_file "assets/network-world-map-transparent-$size.webp"
  require_file "assets/homepage-dark-bg-$size.webp"
done
require_file "atlas/index.html"
require_file "compute/index.html"
require_file "network/index.html"
require_file "developers/index.html"
require_file "install/index.html"
require_file "device-identity/index.html"
require_file "public/docs/index.html"
require_file "public/docs/install/index.html"
require_file "public/install/index.html"
require_file "public/install.json"
require_file "public/install.sh"
require_file "public/install.ps1"
require_file "public/release/index.html"
require_file "public/release.json"

require_line "index.html" "Your AI."
require_line "index.html" "Chat with Atlas"
require_line "index.html" "Powered by people."
require_line "index.html" "Your device can be"
require_line "index.html" "./assets/network-cta-mountains-desktop.webp"
require_line "index.html" "./assets/network-cta-mountains-tablet.webp"
require_line "index.html" "./assets/network-cta-mountains-mobile.webp"
require_line "index.html" 'data-bg-name="meet-atlas-background"'
require_line "index.html" 'data-bg-name="network-hero-globe"'
require_line "index.html" "./assets/nodara-mark.png"
require_line "index.html" '<title>Nodara</title>'
require_line "index.html" './assets/nodara-icon.svg'
require_line "index.html" '--wrap: min(1680px, calc(100% - 88px))'
require_line "index.html" '--wrap: min(100% - 36px, 768px)'
require_line "index.html" '--wrap: min(100% - 26px, 375px)'
require_line "index.html" 'href="./network/">Network</a>'
require_line "index.html" 'href="https://nodara.si/">Chat with Atlas'
require_line "atlas/index.html" '--wrap: min(1680px, calc(100% - 88px))'
require_line "atlas/index.html" '--wrap: min(100% - 36px, 768px)'
require_line "atlas/index.html" '--wrap: min(100% - 26px, 375px)'
require_line "atlas/index.html" 'font-weight: 600;'
require_line "atlas/index.html" 'border-bottom: 0;'
require_line "atlas/index.html" 'background: linear-gradient(135deg, #38daff, #22c9f5);'
require_line "atlas/index.html" "../assets/homepage-dark-bg-desktop.webp"
require_line "atlas/index.html" "../assets/homepage-dark-bg-tablet.webp"
require_line "atlas/index.html" "../assets/homepage-dark-bg-mobile.webp"
require_line "atlas/index.html" 'data-bg-name="network-cta-mountains"'
require_line "compute/index.html" "../assets/network-hero-globe-desktop.webp"
require_line "compute/index.html" "?os=windows&amp;download=1#install-steps"
require_line "compute/index.html" "?os=macos&amp;download=1#install-steps"
require_line "compute/index.html" "?os=linux&amp;download=1#install-steps"
require_line "compute/index.html" "../assets/network-hero-globe-tablet.webp"
require_line "compute/index.html" "../assets/network-hero-globe-mobile.webp"
require_line "compute/index.html" 'data-bg-name="network-cta-mountains"'
require_line "network/index.html" "A global network for a"
require_line "network/index.html" "Live Network"
require_line "network/index.html" "People power<br />intelligence."
require_line "network/index.html" "Users online"
require_line "network/index.html" "A living, global network."
require_line "network/index.html" "../assets/nodara-mark.png"
require_line "network/index.html" '../assets/nodara-icon.svg'
require_line "network/index.html" "../assets/network-hero-globe-desktop.webp"
require_line "network/index.html" "../assets/network-hero-globe-tablet.webp"
require_line "network/index.html" "../assets/network-hero-globe-mobile.webp"
require_line "network/index.html" "../assets/network-world-map-transparent-desktop.webp"
require_line "network/index.html" "../assets/network-world-map-transparent-tablet.webp"
require_line "network/index.html" "../assets/network-world-map-transparent-mobile.webp"
require_line "network/index.html" 'loading="lazy"'
require_line "network/index.html" 'data-bg-name="network-cta-mountains"'
require_line "network/index.html" '--wrap: min(1680px, calc(100% - 88px))'
require_line "network/index.html" '--wrap: min(100% - 36px, 768px)'
require_line "network/index.html" '--wrap: min(100% - 26px, 375px)'
require_line "network/index.html" 'font-family: "Outfit", ui-sans-serif, system-ui, sans-serif;'
require_line "network/index.html" '.mark { width: 42px; height: 28px; object-fit: contain; }'
require_line "network/index.html" '.actions .btn {'
require_line "developers/index.html" "../assets/homepage-dark-bg-desktop.webp"
require_line "developers/index.html" "../assets/homepage-dark-bg-tablet.webp"
require_line "developers/index.html" "../assets/homepage-dark-bg-mobile.webp"
require_line "developers/index.html" 'data-bg-name="meet-atlas-background"'
require_line "device-identity/index.html" '--wrap: min(1680px, calc(100% - 88px))'
require_line "device-identity/index.html" 'font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;'
require_line "device-identity/index.html" 'class="button primary"'
require_line "install/index.html" "Get your machine ready."
require_line "install/index.html" "../public/install.ps1"
require_line "public/docs/install/index.html" "Install Nodara Compute"
require_line "public/docs/install/index.html" "bash ~/Downloads/install.sh"
require_line "device-identity/index.html" "Device Identity Lifecycle"
require_line "device-identity/index.html" "non-exportable device keys"
require_line "public/docs/index.html" "Public Endpoint Mirror"
require_line "public/docs/install/index.html" "Run the installer"
require_line "public/install/index.html" "Install Nodara"
require_line "public/install/index.html" '../../assets/nodara-icon.svg'
require_line "public/install/index.html" "../install.ps1"
require_line "public/install/index.html" "../install.sh"
require_line "public/install/index.html" "data-panel=\"windows\""
require_line "public/install/index.html" "data-panel=\"macos\""
require_line "public/install/index.html" "data-panel=\"linux\""
require_line "public/install.json" "\"kind\": \"install-manifest\""
require_line "public/install.json" "\"release_base_url\": \"https://github.com/mundusx/mundusx/releases/latest/download\""
require_line "public/install.sh" 'RELEASE_BASE_URL="${RELEASE_BASE_URL:-https://github.com/mundusx/releases/releases/download/opengpu-prod}"'
require_line "public/install.ps1" "x86_64-pc-windows-msvc"
require_line "public/release/index.html" "Public Release Mirror"
require_line "public/release/index.html" "Fetching ../release.json"
require_line "public/release.json" "\"kind\": \"release-channel\""
require_line "public/release.json" "\"release_notes_url\": \"https://github.com/mundusx/mundusx/releases/latest\""

echo "Public docs site build verified."
