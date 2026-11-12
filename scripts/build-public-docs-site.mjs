#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.resolve(process.argv[2] ?? path.join(repoRoot, "dist/public-docs-site"));
const repoReleaseBaseUrl = "https://github.com/mundusx/mundusx/releases/latest/download";
const repoReleaseNotesUrl = "https://github.com/mundusx/mundusx/releases/latest";
const brandMarkSource = path.join(repoRoot, "media/nodara-mark.png");
const brandIconSource = path.join(repoRoot, "media/nodara-icon.svg");
const installScriptContents = fs.readFileSync(path.join(repoRoot, "install.sh"), "utf8");
const installPowershellContents = fs.readFileSync(path.join(repoRoot, "install.ps1"), "utf8");

const RESPONSIVE_IMAGE_VARIANTS = ["mobile", "tablet", "desktop"];

function copyResponsiveVariants(assetDir, baseName) {
  for (const variant of RESPONSIVE_IMAGE_VARIANTS) {
    const fileName = `${baseName}-${variant}.webp`;
    fs.copyFileSync(path.join(repoRoot, "media", fileName), path.join(assetDir, fileName));
  }
}

function copyThreeJs(assetDir) {
  fs.copyFileSync(path.join(repoRoot, "node_modules/three/build/three.module.min.js"), path.join(assetDir, "three.module.min.js"));
  fs.copyFileSync(path.join(repoRoot, "node_modules/three/build/three.core.min.js"), path.join(assetDir, "three.core.min.js"));
}

const pages = [
  {
    slug: "",
    title: "Nodara Docs",
    sourcePath: null,
    intro:
      "Public documentation for Nodara install, device identity, and release flow previews.",
  },
  {
    slug: "install",
    title: "Install Nodara",
    sourcePath: path.join(repoRoot, "docs/install-page.md"),
    intro: "Choose your operating system, download the installer, and follow the setup steps.",
  },
  {
    slug: "device-identity",
    title: "Device Identity Lifecycle",
    sourcePath: path.join(repoRoot, "docs/device-identity-lifecycle.md"),
    intro: "How contributor identity is stored, reused, and reset across the Nodara lifecycle.",
  },
  {
    slug: "release",
    title: "Install And Release Strategy",
    sourcePath: path.join(repoRoot, "docs/install-strategy.md"),
    intro: "Release-hosting and distribution notes that support the public install surface.",
  },
];

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

writeDocsVariant({
  outputBaseDir: outputDir,
  siteRootDepth: 0,
  eyebrow: "Public Repo Docs",
  homeIntro:
    "Public documentation for Nodara install, device identity, and release flow previews.",
});
writeDocsVariant({
  outputBaseDir: path.join(outputDir, "docs"),
  siteRootDepth: 1,
  eyebrow: "Local Docs Preview",
  homeIntro:
    "Local documentation preview for Nodara install, device identity, and release flow notes.",
});
writeDocsVariant({
  outputBaseDir: path.join(outputDir, "public", "docs"),
  siteRootDepth: 2,
  eyebrow: "Public Endpoint Mirror",
  homeIntro:
    "GitHub Pages mirror of the public docs shape so install, device identity, and release pages can be reviewed before the final domain is wired up.",
});
writeMarketingHomepage();
writeNetworkPage();
writeAtlasPage();
writeComputePage();
writeDevelopersPage();
writePublicInstallSurface();
writePublicReleaseSurface();

fs.writeFileSync(path.join(outputDir, ".nojekyll"), "\n");

function writeDocsVariant({ outputBaseDir, siteRootDepth, eyebrow, homeIntro }) {
  for (const page of pages) {
    const html = renderPage(page, { siteRootDepth, eyebrow, homeIntro });
    const pageDir = page.slug ? path.join(outputBaseDir, page.slug) : outputBaseDir;
    fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(path.join(pageDir, "index.html"), html);
  }
}

function writeMarketingHomepage() {
  const assetDir = path.join(outputDir, "assets");
  fs.mkdirSync(assetDir, { recursive: true });
  fs.copyFileSync(brandMarkSource, path.join(assetDir, "nodara-mark.png"));
  fs.copyFileSync(brandIconSource, path.join(assetDir, "nodara-icon.svg"));
  fs.copyFileSync(path.join(repoRoot, "media/network-compute-globe.svg"), path.join(assetDir, "network-compute-globe.svg"));
  copyThreeJs(assetDir);
  copyResponsiveVariants(assetDir, "network-cta-mountains");
  copyResponsiveVariants(assetDir, "meet-atlas-background");
  copyResponsiveVariants(assetDir, "network-hero-globe");
  copyResponsiveVariants(assetDir, "network-world-map-transparent");
  fs.writeFileSync(path.join(outputDir, "index.html"), renderMarketingHomePage());
}

function writeNetworkPage() {
  const assetDir = path.join(outputDir, "assets");
  const networkDir = path.join(outputDir, "network");
  fs.mkdirSync(assetDir, { recursive: true });
  fs.mkdirSync(networkDir, { recursive: true });
  copyThreeJs(assetDir);
  copyResponsiveVariants(assetDir, "network-hero-globe");
  copyResponsiveVariants(assetDir, "network-world-map-transparent");
  copyResponsiveVariants(assetDir, "network-cta-mountains");
  fs.writeFileSync(path.join(networkDir, "index.html"), renderNetworkPage());
}

function writeAtlasPage() {
  const assetDir = path.join(outputDir, "assets");
  const atlasDir = path.join(outputDir, "atlas");
  fs.mkdirSync(assetDir, { recursive: true });
  fs.mkdirSync(atlasDir, { recursive: true });
  copyResponsiveVariants(assetDir, "homepage-dark-bg");
  copyResponsiveVariants(assetDir, "network-cta-mountains");
  fs.writeFileSync(path.join(atlasDir, "index.html"), fs.readFileSync(path.join(repoRoot, "media/atlas.html"), "utf8"));
}

function writeComputePage() {
  const assetDir = path.join(outputDir, "assets");
  const computeDir = path.join(outputDir, "compute");
  fs.mkdirSync(assetDir, { recursive: true });
  fs.mkdirSync(computeDir, { recursive: true });
  copyResponsiveVariants(assetDir, "network-hero-globe");
  copyResponsiveVariants(assetDir, "network-cta-mountains");
  copyResponsiveVariants(assetDir, "compute-macbook-code");
  copyResponsiveVariants(assetDir, "compute-macmini");
  copyResponsiveVariants(assetDir, "compute-tower-slim");
  copyResponsiveVariants(assetDir, "compute-blade-servers");
  fs.writeFileSync(path.join(computeDir, "index.html"), fs.readFileSync(path.join(repoRoot, "media/compute.html"), "utf8"));
}

function writeDevelopersPage() {
  const assetDir = path.join(outputDir, "assets");
  const developersDir = path.join(outputDir, "developers");
  fs.mkdirSync(assetDir, { recursive: true });
  fs.mkdirSync(developersDir, { recursive: true });
  copyResponsiveVariants(assetDir, "homepage-dark-bg");
  copyResponsiveVariants(assetDir, "meet-atlas-background");
  fs.writeFileSync(path.join(developersDir, "index.html"), fs.readFileSync(path.join(repoRoot, "media/developers.html"), "utf8"));
}

function renderMarketingHomePage() {
  return fs.readFileSync(path.join(repoRoot, "media/homepage.html"), "utf8");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nodara</title>
    <style>
      :root {
        color-scheme: dark;
        --page: #020910;
        --surface: rgba(5, 23, 37, 0.76);
        --surface-strong: rgba(3, 15, 27, 0.94);
        --surface-soft: rgba(6, 29, 47, 0.72);
        --border: rgba(91, 211, 255, 0.24);
        --border-strong: rgba(91, 211, 255, 0.48);
        --text: #f4f8ff;
        --muted: #b7c8d7;
        --soft: #8da5b6;
        --accent: #31cfff;
        --accent-2: #74e6ff;
        --accent-3: #168bff;
        --glow: rgba(49, 207, 255, 0.34);
        --shadow: 0 28px 80px rgba(0, 0, 0, 0.36);
        --hero-overlay: linear-gradient(90deg, rgba(2,9,16,0.92), rgba(2,12,21,0.36) 46%, rgba(2,9,16,0.82));
        --waves: radial-gradient(circle at 78% 9%, rgba(38, 158, 237, 0.34), transparent 25rem),
          radial-gradient(circle at 13% 78%, rgba(31, 206, 255, 0.14), transparent 25rem),
          linear-gradient(180deg, #03121d 0%, #020811 50%, #030e18 100%);
        --nav-bg: rgba(2, 12, 22, 0.82);
        --icon-bg: rgba(24, 96, 134, 0.24);
        --mountain: linear-gradient(135deg, transparent 0 38%, rgba(104, 178, 238, 0.22) 39% 62%, transparent 63%),
          linear-gradient(45deg, transparent 0 40%, rgba(1, 92, 178, 0.18) 41% 58%, transparent 59%);
      }
      * { box-sizing: border-box; }
      html {
        background: var(--page);
        scroll-behavior: smooth;
      }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0;
        color: var(--text);
        background: var(--waves);
        overflow-x: hidden;
      }
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 14% 36%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 1px),
          linear-gradient(90deg, color-mix(in srgb, var(--accent) 5%, transparent) 1px, transparent 1px),
          linear-gradient(180deg, color-mix(in srgb, var(--accent) 4%, transparent) 1px, transparent 1px);
        background-size: 18px 18px, 44px 44px, 44px 44px;
        mask-image: linear-gradient(180deg, transparent, #000 16%, #000 84%, transparent);
        opacity: 0.65;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
      svg {
        display: block;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .topbar {
        position: sticky;
        top: 0;
        z-index: 20;
        border-bottom: 1px solid rgba(91, 211, 255, 0.1);
        background: var(--nav-bg);
        backdrop-filter: blur(22px);
      }
      .nav {
        width: min(1720px, calc(100% - 76px));
        height: 64px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 25px;
        font-weight: 800;
        letter-spacing: -0.01em;
      }
      .mark {
        width: 47px;
        height: 30px;
        display: block;
        object-fit: contain;
        filter: drop-shadow(0 0 15px var(--glow));
      }
      .links {
        display: flex;
        align-items: center;
        gap: clamp(22px, 3vw, 48px);
        color: #edf6ff;
        font-size: 14px;
        font-weight: 600;
      }
      .actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .btn {
        min-height: 46px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        border-radius: 999px;
        border: 1px solid var(--border-strong);
        padding: 0 28px;
        font-size: 14px;
        font-weight: 800;
        white-space: nowrap;
        transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
      }
      .btn:hover {
        transform: translateY(-1px);
      }
      .btn.primary {
        color: white;
        background: linear-gradient(135deg, #35c8ff, #006eff);
        border-color: transparent;
        box-shadow: 0 18px 38px var(--glow), inset 0 1px rgba(255, 255, 255, 0.48);
      }
      .btn.ghost {
        background: var(--surface);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.35);
      }
      .theme-toggle {
        display: none;
        width: 46px;
        height: 46px;
        border: 1px solid var(--border);
        border-radius: 999px;
        color: var(--accent);
        background: var(--surface);
        display: grid;
        place-items: center;
        cursor: pointer;
        box-shadow: 0 10px 28px rgba(28, 114, 199, 0.09);
      }
      .hero {
        position: relative;
        min-height: 690px;
        overflow: hidden;
      }
      .hero::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          var(--hero-overlay),
          radial-gradient(ellipse at 74% 12%, rgba(37, 181, 255, 0.18), transparent 27rem),
          url("./assets/homepage-dark-bg.png") center 50% / cover no-repeat;
        opacity: 1;
      }
      .hero::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse at 51% 48%, transparent 0 26%, rgba(2, 9, 16, 0.2) 45%, rgba(2, 9, 16, 0.78) 100%),
          linear-gradient(180deg, transparent 0 74%, rgba(2, 9, 16, 0.9) 100%);
        opacity: 0.76;
      }
      .hero-inner {
        position: relative;
        z-index: 1;
        width: min(1700px, calc(100% - 92px));
        margin: 0 auto;
        padding: 58px 0 72px;
        display: grid;
        grid-template-columns: minmax(560px, 0.78fr) minmax(900px, 1.22fr);
        gap: 108px;
        align-items: center;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        border: 1px solid var(--border-strong);
        border-radius: 999px;
        padding: 9px 15px;
        color: var(--accent);
        background: rgba(3, 26, 43, 0.7);
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      h1 {
        max-width: 820px;
        margin: 28px 0 22px;
        font-size: clamp(58px, 4.2vw, 76px);
        line-height: 1;
        letter-spacing: -0.025em;
      }
      h1 span {
        color: #66d8ff;
      }
      .lead {
        max-width: 600px;
        margin: 0 0 32px;
        color: #e4eef8;
        font-size: clamp(19px, 1.2vw, 23px);
        line-height: 1.28;
      }
      .hero-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        margin-bottom: 22px;
      }
      .hero-buttons .btn {
        min-width: 286px;
      }
      .notes {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        color: var(--soft);
        font-size: 14px;
        font-weight: 600;
      }
      .notes span {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .notes span::before {
        display: none;
      }
      .notes span + span::before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 4px;
        margin: 0 11px 3px 0;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 14px var(--accent);
      }
      .product-shell {
        display: grid;
        grid-template-columns: 288px 1fr;
        min-height: 496px;
        border: 1px solid var(--border-strong);
        border-radius: 20px;
        background: rgba(3, 16, 27, 0.92);
        box-shadow: 0 0 44px rgba(31, 201, 255, 0.36), inset 0 1px rgba(255, 255, 255, 0.1);
        overflow: hidden;
      }
      .sidebar {
        padding: 20px 22px;
        border-right: 1px solid var(--border);
        background: rgba(2, 12, 22, 0.72);
      }
      .mini-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 800;
      }
      .mini-mark {
        width: 29px;
        height: 22px;
        display: block;
        object-fit: contain;
      }
      .mini-kicker {
        display: block;
        margin-top: 1px;
        color: var(--soft);
        font-size: 7px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .new-chat {
        width: 100%;
        margin: 20px 0 18px;
        min-height: 40px;
        justify-content: flex-start;
        border-radius: 9px;
        padding: 0 16px;
      }
      .section-label {
        margin: 18px 0 8px;
        color: var(--soft);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      .side-item,
      .chat-row {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 26px;
        color: #d7e5f0;
        font-size: 12px;
      }
      .side-item svg,
      .chat-row svg {
        width: 15px;
        height: 15px;
        color: var(--accent);
      }
      .recent {
        margin-top: 12px;
      }
      .chat-row {
        justify-content: space-between;
        color: #c7d8e5;
      }
      .chat-row b {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
      }
      .chat-row time {
        color: var(--soft);
        font-size: 10px;
      }
      .app-main {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 82px 42px 58px;
      }
      .app-main::after {
        content: "DRIVING INTELLIGENCE FOR A BRIGHTER TOMORROW";
        position: absolute;
        top: 92px;
        right: 38px;
        width: 104px;
        color: color-mix(in srgb, var(--soft) 72%, transparent);
        font-size: 9px;
        line-height: 1.7;
        letter-spacing: 0.36em;
      }
      .toggle {
        position: absolute;
        top: 14px;
        right: 16px;
        display: flex;
        gap: 7px;
        padding: 5px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: var(--surface-soft);
      }
      .toggle span {
        width: 27px;
        height: 27px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        color: var(--accent);
      }
      .toggle span:first-child {
        color: white;
        background: linear-gradient(135deg, var(--accent-2), var(--accent-3));
        box-shadow: 0 8px 18px var(--glow);
      }
      .assistant-title {
        margin-top: 4px;
        text-align: center;
      }
      .assistant-title h2 {
        margin: 0;
        font-size: 25px;
        line-height: 1.1;
        letter-spacing: -0.02em;
      }
      .assistant-title span {
        color: var(--accent);
      }
      .assistant-title p {
        max-width: 500px;
        margin: 12px auto 0;
        color: #cfdeea;
        font-size: 13px;
        line-height: 1.48;
      }
      .tool-grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
        margin: 36px 0 52px;
      }
      .tool-card {
        min-height: 148px;
        padding: 28px 16px 18px;
        border: 1px solid rgba(91, 211, 255, 0.24);
        border-radius: 8px;
        background: linear-gradient(180deg, rgba(7, 38, 59, 0.9), rgba(4, 21, 36, 0.82));
        text-align: center;
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.26);
      }
      .tool-icon {
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        margin: 0 auto 20px;
        color: var(--accent);
      }
      .tool-icon svg { width: 36px; height: 36px; stroke-width: 2.4; }
      .tool-card b {
        display: block;
        font-size: 13px;
      }
      .tool-card p {
        margin: 8px auto 0;
        color: #aebfce;
        font-size: 11px;
        line-height: 1.35;
      }
      .prompt {
        width: 100%;
        min-height: 58px;
        display: grid;
        grid-template-columns: 28px 1fr repeat(4, 30px) 46px;
        gap: 14px;
        align-items: center;
        border: 1px solid rgba(91, 211, 255, 0.26);
        border-radius: 999px;
        background: rgba(5, 30, 50, 0.88);
        padding: 6px 8px 6px 18px;
        color: var(--soft);
        font-size: 12px;
        box-shadow: 0 18px 48px rgba(18, 83, 156, 0.08);
      }
      .prompt svg {
        width: 18px;
        height: 18px;
      }
      .send {
        width: 46px;
        height: 46px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        color: white;
        background: linear-gradient(135deg, var(--accent-2), var(--accent-3));
        box-shadow: 0 10px 25px var(--glow);
      }
      .feature-rail {
        position: relative;
        z-index: 2;
        width: min(1920px, calc(100% - 92px));
        margin: 40px auto 0;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
      }
      .rail-card {
        min-height: 96px;
        display: grid;
        grid-template-columns: 66px 1fr 18px;
        gap: 22px;
        align-items: center;
        padding: 18px 32px;
        border: 1px solid rgba(91, 211, 255, 0.3);
        border-radius: 8px;
        background: rgba(7, 32, 52, 0.94);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.08), 0 0 26px rgba(36, 174, 229, 0.16);
      }
      .rail-icon {
        width: 50px;
        height: 50px;
        display: grid;
        place-items: center;
        border-radius: 8px;
        color: var(--accent);
        background: rgba(35, 206, 255, 0.09);
        box-shadow: 0 0 20px rgba(50, 212, 255, 0.46);
      }
      .rail-icon svg {
        width: 32px;
        height: 32px;
        stroke-width: 2.2;
      }
      .rail-card h3 {
        margin: 0 0 4px;
        font-size: 18px;
      }
      .rail-card p {
        margin: 0;
        color: #bdd1df;
        font-size: 13px;
        line-height: 1.35;
      }
      .network {
        position: relative;
        height: clamp(280px, 14.2vw, 340px);
        margin-top: 66px;
        overflow: hidden;
        background:
          radial-gradient(circle at 51.5% 58%, rgba(8, 102, 154, 0.34), transparent 19%),
          radial-gradient(circle at 51.5% 54%, rgba(32, 199, 247, 0.12), transparent 28%),
          linear-gradient(180deg, rgba(2, 13, 22, 0.98), rgba(3, 18, 30, 0.96));
      }
      .network::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, transparent 0%, rgba(32, 151, 199, 0.07) 25%, rgba(32, 151, 199, 0.08) 52%, rgba(32, 151, 199, 0.05) 78%, transparent 100%),
          linear-gradient(90deg, rgba(32, 151, 199, 0.065) 1px, transparent 1px),
          linear-gradient(180deg, rgba(32, 151, 199, 0.055) 1px, transparent 1px),
          url("./assets/homepage-dark-bg.png") center 61% / cover no-repeat;
        background-size: auto, 66px 66px, 66px 66px, cover;
        mask-image: linear-gradient(90deg, transparent 0%, #000 16%, #000 84%, transparent 100%);
        opacity: 0.62;
      }
      .network::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 28% 36%, rgba(50, 213, 255, 0.4) 0 1px, transparent 2px),
          radial-gradient(circle at 39% 52%, rgba(50, 213, 255, 0.34) 0 1px, transparent 2px),
          radial-gradient(circle at 58% 31%, rgba(50, 213, 255, 0.46) 0 1px, transparent 2px),
          radial-gradient(circle at 71% 56%, rgba(50, 213, 255, 0.36) 0 1px, transparent 2px);
        opacity: 0.65;
      }
      .network-inner {
        position: absolute;
        inset: 0;
        z-index: 1;
        width: 100%;
        max-width: 2048px;
        height: 100%;
        margin: 0 auto;
        left: 50%;
        transform: translateX(-50%);
      }
      .device {
        position: absolute;
        left: 10.5%;
        top: 48%;
        width: 230px;
        transform: translate(-50%, -50%);
        z-index: 2;
        text-align: center;
      }
      .laptop {
        position: relative;
        width: 226px;
        height: 134px;
        margin: 0 auto 10px;
        color: var(--accent);
      }
      .laptop svg {
        display: none;
      }
      .laptop::before {
        content: "";
        position: absolute;
        left: 13px;
        top: 7px;
        width: 198px;
        height: 105px;
        border: 2px solid rgba(40, 200, 245, 0.72);
        border-radius: 6px 6px 2px 2px;
        background:
          linear-gradient(142deg, rgba(64, 177, 239, 0.12), transparent 42%),
          linear-gradient(150deg, transparent 0 45%, rgba(10, 58, 86, 0.54) 46% 63%, transparent 64%),
          rgba(2, 10, 18, 0.86);
        box-shadow: 0 0 22px rgba(49, 207, 255, 0.28), inset 0 0 24px rgba(49, 207, 255, 0.06);
      }
      .laptop::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 9px;
        width: 226px;
        height: 17px;
        border-radius: 50% 50% 7px 7px;
        background: linear-gradient(90deg, transparent, rgba(112, 218, 255, 0.68) 9% 90%, transparent);
        box-shadow: 0 8px 15px rgba(49, 207, 255, 0.18);
      }
      .device h2 {
        margin: -2px 0 5px;
        color: #f3f8fc;
        font-size: 20px;
        line-height: 1.1;
      }
      .device p {
        margin: 0;
        color: #9db2c5;
        font-size: 16px;
        font-weight: 650;
      }
      .network-lines {
        position: absolute;
        inset: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        color: var(--accent);
        overflow: visible;
        pointer-events: none;
      }
      .network-lines path {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        opacity: 0.5;
        filter: url(#pathGlow);
      }
      .network-lines .axis {
        opacity: 0.36;
      }
      .network-lines circle {
        fill: #8ceaff;
        filter: url(#nodeGlow);
      }
      .network-core {
        position: absolute;
        left: 51.5%;
        top: 62%;
        width: 360px;
        height: 360px;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
        text-align: center;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(8, 127, 181, 0.18), rgba(8, 127, 181, 0.05) 49%, transparent 72%);
        box-shadow: 0 0 42px rgba(37, 211, 255, 0.28);
        overflow: hidden;
      }
      .globe-mesh {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        color: #25d3ff;
        opacity: 0.94;
      }
      .network-core .mark {
        margin: 0 auto 11px;
        width: 62px;
        height: 42px;
      }
      .network h2,
      .network p {
        margin: 0;
      }
      .network h2 {
        color: #f3f8fc;
        font-size: 27px;
        line-height: 1.1;
      }
      .network h2 span { color: var(--accent); }
      .network p {
        margin-top: 22px;
        color: #9db2c5;
        font-size: 18px;
        line-height: 1.38;
        font-weight: 650;
      }
      .network-core-content {
        position: relative;
        z-index: 2;
        width: 270px;
        padding: 20px 12px 22px;
        background: radial-gradient(ellipse at center, rgba(3, 18, 30, 0.72), rgba(3, 18, 30, 0.32) 56%, transparent 78%);
      }
      .server-and-panel {
        position: absolute;
        left: 86%;
        top: 50%;
        width: 28%;
        transform: translate(-50%, -50%);
        z-index: 2;
      }
      .server-stack {
        position: absolute;
        left: 30%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        gap: 9px;
      }
      .server-stack span {
        width: 80px;
        height: 28px;
        border: 1px solid rgba(91, 211, 255, 0.34);
        border-radius: 6px;
        background: linear-gradient(180deg, rgba(33, 126, 171, 0.26), rgba(5, 24, 39, 0.88));
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.08), 0 0 14px rgba(49, 207, 255, 0.16);
        position: relative;
      }
      .server-stack span::before,
      .server-stack span::after {
        content: "";
        position: absolute;
        top: 10px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 8px var(--accent);
      }
      .server-stack span::before {
        left: 10px;
      }
      .server-stack span::after {
        right: 10px;
        opacity: 0.45;
      }
      .node-list {
        width: 310px;
        height: 225px;
        margin-left: auto;
        border: 1px solid rgba(18, 168, 218, 0.45);
        border-radius: 15px;
        background: rgba(4, 25, 39, 0.9);
        text-align: left;
        box-shadow: 0 0 25px rgba(0, 174, 239, 0.08), inset 0 1px rgba(255, 255, 255, 0.06);
      }
      .node-list div {
        display: flex;
        align-items: center;
        gap: 28px;
        min-height: 74px;
        padding: 0 32px;
        border-bottom: 1px solid rgba(73, 148, 180, 0.22);
        color: #f3f8fc;
        font-size: 19px;
        font-weight: 650;
      }
      .node-list div:last-child { border-bottom: 0; }
      .node-list svg {
        width: 40px;
        height: 40px;
        color: #29c8fa;
        stroke-width: 1.9;
        filter: drop-shadow(0 0 10px rgba(41, 200, 250, 0.42));
      }
      .values {
        position: relative;
        padding: 84px 0 0;
        background:
          linear-gradient(180deg, rgba(2, 9, 16, 0.98), rgba(3, 13, 23, 0.9)),
          url("./assets/homepage-dark-bg.png") center bottom / cover no-repeat;
        background-blend-mode: normal, luminosity;
      }
      .values-inner {
        width: min(1680px, calc(100% - 92px));
        margin: 0 auto;
        text-align: center;
      }
      .values h2 {
        margin: 0;
        font-size: clamp(38px, 3.05vw, 56px);
        line-height: 1.05;
        letter-spacing: -0.025em;
      }
      .values > .values-inner > p {
        margin: 14px auto 36px;
        max-width: 760px;
        color: #b7c7d6;
        font-size: 20px;
        line-height: 1.35;
      }
      .value-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0;
        text-align: left;
      }
      .value {
        display: grid;
        grid-template-columns: 118px 1fr;
        gap: 32px;
        align-items: center;
        min-height: 124px;
        padding: 0 58px;
      }
      .value:not(:last-child) {
        border-right: 1px solid rgba(91, 211, 255, 0.18);
      }
      .value-icon {
        width: 104px;
        height: 104px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        color: var(--accent);
        border: 1px solid rgba(91, 211, 255, 0.13);
        background: radial-gradient(circle, rgba(36, 161, 221, 0.2), rgba(8, 47, 73, 0.2) 58%, rgba(4, 22, 37, 0.42));
        box-shadow: inset 0 0 38px rgba(49, 207, 255, 0.08), 0 0 32px rgba(49, 207, 255, 0.09);
      }
      .value-icon svg {
        width: 46px;
        height: 46px;
        stroke-width: 1.9;
      }
      .value h3 {
        margin: 0 0 12px;
        color: #f3f8ff;
        font-size: 23px;
        line-height: 1.12;
        letter-spacing: -0.01em;
      }
      .value p {
        margin: 0;
        color: #c6d4e1;
        font-size: 18px;
        line-height: 1.35;
      }
      .cta {
        position: relative;
        z-index: 1;
        width: min(980px, 100%);
        min-height: 132px;
        margin: 62px auto 0;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 38px;
        align-items: center;
        text-align: left;
        padding: 28px 38px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface-strong);
        box-shadow: var(--shadow);
      }
      .cta h2 {
        margin: 0 0 8px;
        font-size: 24px;
      }
      .cta p,
      .cta small {
        margin: 0;
        color: var(--muted);
      }
      .cta small {
        display: block;
        margin-top: 10px;
        text-align: center;
        font-size: 11px;
      }
      .mountains {
        height: 135px;
        margin-top: -44px;
        background:
          var(--mountain),
          linear-gradient(180deg, transparent, color-mix(in srgb, var(--accent) 9%, transparent));
        opacity: 0.72;
        clip-path: polygon(0 55%, 7% 44%, 12% 49%, 20% 28%, 27% 46%, 37% 34%, 44% 48%, 52% 30%, 61% 48%, 70% 24%, 78% 46%, 88% 30%, 100% 54%, 100% 100%, 0 100%);
      }
      .site-footer {
        border-top: 1px solid var(--border);
        background: var(--surface-strong);
      }
      .footer-inner {
        width: min(1320px, calc(100% - 72px));
        min-height: 88px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
      }
      .footer-links,
      .social-links {
        display: flex;
        align-items: center;
        gap: 26px;
        color: var(--muted);
        font-size: 13px;
        font-weight: 600;
      }
      .social-links {
        gap: 16px;
        color: var(--accent);
      }
      .social-links svg {
        width: 20px;
        height: 20px;
      }
      .tagline {
        color: var(--soft);
        font-size: 10px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
      }
      @media (max-width: 1120px) {
        .hero-inner {
          grid-template-columns: 1fr;
          gap: 42px;
        }
        .product-shell {
          max-width: 780px;
          width: 100%;
          margin: 0 auto;
        }
        .feature-rail {
          grid-template-columns: repeat(2, 1fr);
          margin-top: 34px;
        }
        .network {
          height: clamp(280px, 25vw, 340px);
        }
        .value-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .value:not(:last-child) {
          border-right: 0;
          padding-right: 0;
        }
      }
      @media (min-width: 1121px) and (max-width: 1540px) {
        .nav,
        .hero-inner,
        .feature-rail {
          width: min(1348px, calc(100% - 92px));
        }
        .hero-inner {
          grid-template-columns: minmax(500px, 0.78fr) minmax(720px, 1.22fr);
          gap: 64px;
        }
        h1 {
          font-size: clamp(56px, 4.9vw, 76px);
        }
        .lead {
          max-width: 560px;
        }
        .product-shell {
          grid-template-columns: 238px 1fr;
          min-height: 454px;
        }
        .app-main {
          padding: 70px 30px 48px;
        }
        .app-main::after {
          display: none;
        }
        .tool-grid {
          gap: 12px;
          margin: 30px 0 40px;
        }
        .tool-card {
          min-height: 132px;
          padding: 22px 12px 16px;
        }
        .feature-rail {
          gap: 18px;
        }
        .rail-card {
          padding: 18px 22px;
        }
      }
      @media (max-width: 760px) {
        .nav {
          width: min(100% - 28px, 1420px);
          height: 64px;
        }
        .links {
          display: none;
        }
        .actions .ghost {
          display: none;
        }
        .hero-inner,
        .feature-rail,
        .network-inner,
        .values-inner,
        .footer-inner {
          width: min(100% - 28px, 1240px);
        }
        .hero {
          min-height: auto;
        }
        .hero-inner {
          padding: 54px 0 76px;
          gap: 44px;
        }
        .product-shell {
          grid-template-columns: 1fr;
        }
        .sidebar {
          display: none;
        }
        .app-main::after {
          display: none;
        }
        .tool-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .prompt {
          grid-template-columns: 22px 1fr 40px;
        }
        .prompt span:nth-last-child(n+2):nth-last-child(-n+5) {
          display: none;
        }
        .feature-rail,
        .network-inner,
        .value-grid,
        .cta {
          grid-template-columns: 1fr;
        }
        .feature-rail {
          margin-top: 30px;
        }
        .network {
          height: 620px;
          margin-top: 48px;
        }
        .network-inner {
          width: 100%;
        }
        .network-lines {
          display: none;
        }
        .device {
          left: 50%;
          top: 16%;
          transform: translate(-50%, -50%) scale(0.72);
        }
        .network-core {
          left: 50%;
          top: 48%;
          width: 290px;
          height: 290px;
        }
        .network-core .mark {
          width: 50px;
          height: 34px;
        }
        .network h2 {
          font-size: 22px;
        }
        .network p {
          font-size: 15px;
          margin-top: 14px;
        }
        .server-and-panel {
          left: 50%;
          top: 84%;
          width: 310px;
          transform: translate(-50%, -50%) scale(0.86);
        }
        .server-stack {
          display: none;
        }
        .values {
          padding-top: 64px;
        }
        .value:not(:last-child) {
          border-right: 0;
          padding-right: 0;
        }
        .footer-inner,
        .footer-links {
          flex-direction: column;
          align-items: flex-start;
          padding: 24px 0;
        }
        .footer-links {
          gap: 14px;
          padding: 0;
        }
      }
      @media (max-width: 480px) {
        .brand {
          font-size: 21px;
        }
        .mark {
          width: 36px;
          height: 27px;
        }
        .theme-toggle {
          display: none;
        }
        .btn {
          padding: 0 17px;
        }
        .hero-buttons .btn {
          width: 100%;
        }
        .notes {
          display: grid;
          gap: 8px;
        }
        .notes span + span::before {
          display: none;
        }
        .tool-card {
          min-height: 126px;
        }
        .rail-card {
          padding: 18px;
        }
        .cta {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <header class="topbar">
      <nav class="nav" aria-label="Primary">
        <a class="brand" href="./" aria-label="Nodara home">${brandMark()}<span>Nodara</span></a>
        <div class="links" aria-label="Sections">
          <a href="./atlas/">Atlas</a>
          <a href="#compute">Compute</a>
          <a href="./network/">Network</a>
          <a href="./docs/">Developers</a>
        </div>
        <div class="actions">
          <a class="btn ghost" href="./public/docs/">Sign in</a>
          <a class="btn primary" href="./public/install/">Get started</a>
        </div>
      </nav>
    </header>
    <main>
      <section class="hero" aria-labelledby="home-title">
        <div class="hero-inner">
          <div>
            <span class="pill">Decentralized AI Network</span>
            <h1 id="home-title">AI that works across <span>your world.</span></h1>
            <p class="lead">Chat, build, research and run AI workloads across a secure decentralized compute network - with your projects and tools connected.</p>
            <div class="hero-buttons">
              <a class="btn primary" href="https://nodara.si/">Start with Nodara</a>
              <a class="btn ghost" href="./network/">Explore the network</a>
            </div>
            <div class="notes"><span>Start free</span><span>Sign in with Google</span><span>Connect your own computer</span></div>
          </div>
          <div class="product-shell" aria-label="Atlas workspace preview">
            <aside class="sidebar">
              <div class="mini-brand">${brandMark("mini-mark")}<span>Nodara <small class="mini-kicker">A better tomorrow</small></span></div>
              <div class="btn primary new-chat">+ New Chat</div>
              <div class="section-label">Workspace</div>
              <div class="side-item">${siteIcon("folder")}Projects</div>
              <div class="side-item">${siteIcon("folder")}Product Ideas</div>
              <div class="side-item">${siteIcon("folder")}AI Research</div>
              <div class="side-item">${siteIcon("folder")}Customer Support</div>
              <div class="side-item">${siteIcon("folder")}Personal</div>
              <div class="section-label">Recent Chats</div>
              <div class="recent">
                <div class="chat-row">${siteIcon("folder")}<b>How to optimize LLM...</b><time>12:20 AM</time></div>
                <div class="chat-row">${siteIcon("folder")}<b>Generate project plan</b><time>10:14 AM</time></div>
                <div class="chat-row">${siteIcon("folder")}<b>Explain RISC-V</b><time>Sep 9</time></div>
                <div class="chat-row">${siteIcon("folder")}<b>Build a pricing model</b><time>Sep 9</time></div>
                <div class="chat-row">${siteIcon("folder")}<b>Summarize this doc</b><time>Sep 8</time></div>
              </div>
            </aside>
            <div class="app-main">
              <div class="toggle"><span>${siteIcon("sun")}</span><span>${siteIcon("moon")}</span></div>
              <div class="assistant-title">
                <h2>Hello, my name is <span>Atlas.</span></h2>
                <p>I can help you chat, write code, analyze data, build solutions and research anything - across the Nodara network.</p>
              </div>
              <div class="tool-grid">
                <div class="tool-card"><span class="tool-icon">${siteIcon("code")}</span><b>Code</b><p>Write, debug and explain code</p></div>
                <div class="tool-card"><span class="tool-icon">${siteIcon("bar-chart")}</span><b>Analyze</b><p>Turn data into insights</p></div>
                <div class="tool-card"><span class="tool-icon">${siteIcon("layers")}</span><b>Build</b><p>Create and plan projects</p></div>
                <div class="tool-card"><span class="tool-icon">${siteIcon("search")}</span><b>Research</b><p>Explore ideas and get deeper answers</p></div>
              </div>
              <div class="prompt"><span>${siteIcon("paperclip")}</span><span>Ask Atlas anything...</span><span>${siteIcon("globe")}</span><span>${siteIcon("sliders")}</span><span>${siteIcon("mic")}</span><span>${siteIcon("spark")}</span><span class="send">${siteIcon("arrow-up")}</span></div>
            </div>
          </div>
        </div>
      </section>
      <section class="feature-rail" aria-label="Nodara features">
        <a class="rail-card" href="./public/docs/"><span class="rail-icon">${siteIcon("message-square")}</span><div><h3>Chat with Atlas</h3><p>Your AI companion for work, ideas and everyday tasks.</p></div><span aria-hidden="true">&gt;</span></a>
        <a class="rail-card" href="./docs/"><span class="rail-icon">${siteIcon("folder")}</span><div><h3>Projects</h3><p>Keep chats, files and work together in one place.</p></div><span aria-hidden="true">&gt;</span></a>
        <a class="rail-card" href="./docs/install/"><span class="rail-icon">${siteIcon("terminal")}</span><div><h3>Harness</h3><p>Run code on your own computer</p></div><span aria-hidden="true">&gt;</span></a>
        <a class="rail-card" href="./network/"><span class="rail-icon">${siteIcon("network")}</span><div><h3>Decentralized Compute</h3><p>Contribute or use distributed compute.</p></div><span aria-hidden="true">&gt;</span></a>
      </section>
      <section class="network" aria-label="Decentralized compute network">
        <div class="network-inner">
          <svg class="network-lines" viewBox="0 0 2048 290" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <filter id="pathGlow" x="-30%" y="-120%" width="160%" height="340%">
                <feGaussianBlur stdDeviation="3.8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="nodeGlow" x="-220%" y="-220%" width="540%" height="540%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path class="axis" d="M260 146 C500 146 666 146 841 146 M1207 146 C1352 146 1474 146 1694 146" />
            <path d="M258 122 C372 78 476 75 563 102 C643 127 688 150 841 146" />
            <path d="M258 156 C371 188 477 184 566 162 C653 141 714 151 841 146" />
            <path d="M1207 146 C1328 148 1398 82 1517 79 C1588 77 1628 94 1694 96" />
            <path d="M1207 146 C1331 148 1394 171 1494 168 C1579 165 1630 156 1694 158" />
            <circle cx="258" cy="122" r="5" /><circle cx="490" cy="86" r="7" /><circle cx="581" cy="126" r="6" /><circle cx="660" cy="145" r="6" /><circle cx="468" cy="176" r="7" />
            <circle cx="1212" cy="146" r="6" /><circle cx="1394" cy="146" r="6" /><circle cx="1481" cy="111" r="6" /><circle cx="1535" cy="86" r="7" /><circle cx="1518" cy="168" r="6" />
          </svg>
          <div class="device"><div class="laptop">${siteIcon("laptop")}</div><h2>Your Device</h2><p>Work from anywhere</p></div>
          <div class="network-core">
            <svg class="globe-mesh" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <filter id="globeGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3.4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <circle cx="180" cy="180" r="172" fill="rgba(2, 13, 22, 0.08)" stroke="rgba(37, 211, 255, 0.62)" stroke-width="2.2" filter="url(#globeGlow)" />
              <ellipse cx="180" cy="180" rx="116" ry="172" fill="none" stroke="rgba(37, 211, 255, 0.25)" stroke-width="1.2" />
              <ellipse cx="180" cy="180" rx="58" ry="172" fill="none" stroke="rgba(37, 211, 255, 0.18)" stroke-width="1" />
              <ellipse cx="180" cy="180" rx="172" ry="62" fill="none" stroke="rgba(37, 211, 255, 0.18)" stroke-width="1" />
              <ellipse cx="180" cy="180" rx="172" ry="118" fill="none" stroke="rgba(37, 211, 255, 0.15)" stroke-width="1" />
              <path d="M52 74 115 32 183 21 251 47 310 101 330 174 305 244 238 317 158 336 80 303 35 230 28 145Z" fill="none" stroke="rgba(37,211,255,.36)" stroke-width="1.4" />
              <path d="M52 74 108 126 28 145 M108 126 183 21 206 104 310 101 M206 104 180 180 330 174 M180 180 80 303 35 230 M180 180 238 317 305 244 M108 126 180 180 206 104 M52 74 206 104 M28 145 180 180 M310 101 330 174 M305 244 180 180 M80 303 238 317" fill="none" stroke="rgba(37,211,255,.31)" stroke-width="1.25" />
              <g fill="#32d5ff" filter="url(#globeGlow)">
                <circle cx="52" cy="74" r="4" /><circle cx="115" cy="32" r="4" /><circle cx="183" cy="21" r="5" /><circle cx="251" cy="47" r="4" /><circle cx="310" cy="101" r="5" /><circle cx="330" cy="174" r="4" /><circle cx="305" cy="244" r="4" /><circle cx="238" cy="317" r="4" /><circle cx="158" cy="336" r="4" /><circle cx="80" cy="303" r="4" /><circle cx="35" cy="230" r="4" /><circle cx="28" cy="145" r="3" /><circle cx="108" cy="126" r="4" /><circle cx="206" cy="104" r="4" /><circle cx="180" cy="180" r="4" />
              </g>
            </svg>
            <div class="network-core-content">${brandMark()}<h2>Nodara <span>Network</span></h2><p>A global decentralized<br />compute network</p></div>
          </div>
          <div class="server-and-panel">
            <div class="server-stack" aria-hidden="true"><span></span><span></span><span></span></div>
            <div class="node-list">
              <div>${siteIcon("cpu")}AI Models</div>
              <div>${siteIcon("database")}Compute Nodes</div>
              <div>${siteIcon("box")}Your Workloads</div>
            </div>
          </div>
        </div>
      </section>
      <section class="values" aria-labelledby="workspace-title">
        <div class="values-inner">
          <h2 id="workspace-title">One workspace. Your AI. Your compute.</h2>
          <p>A more open, more capable and more connected way to work with AI.</p>
          <div class="value-grid">
            <div class="value"><span class="value-icon">${siteIcon("shield")}</span><div><h3>Private by design</h3><p>Your data stays yours. Secure, transparent and under your control.</p></div></div>
            <div class="value"><span class="value-icon">${siteIcon("code")}</span><div><h3>Built for builders</h3><p>From ideas to production. Tools, APIs and compute for real work.</p></div></div>
            <div class="value"><span class="value-icon">${siteIcon("share")}</span><div><h3>Distributed by default</h3><p>A global network of people and compute powering a more open AI future.</p></div></div>
          </div>
          <div class="cta">
            <div>
              <h2>Ready to build with Nodara?</h2>
              <p>Join a growing community of builders, researchers and businesses shaping a more open and decentralized AI future.</p>
            </div>
            <div>
              <a class="btn primary" href="./public/install/">Get started</a>
              <small>Start free. No credit card required.</small>
            </div>
          </div>
        </div>
        <div class="mountains" aria-hidden="true"></div>
      </section>
    </main>
    <footer class="site-footer">
      <div class="footer-inner">
        <a class="brand" href="./" aria-label="Nodara home">${brandMark()}<span>Nodara</span></a>
        <div class="footer-links">
          <a href="./public/docs/">Product</a>
          <a href="./network/">Network</a>
          <a href="./docs/">Developers</a>
          <a href="./public/install/">Pricing</a>
          <a href="./docs/device-identity/">About</a>
          <a href="./docs/release/">Blog</a>
        </div>
        <div class="social-links" aria-label="Social links">
          <a href="./public/docs/" aria-label="GitHub">${siteIcon("github")}</a>
          <a href="./public/docs/" aria-label="Community">${siteIcon("discord")}</a>
          <a href="./public/docs/" aria-label="LinkedIn">${siteIcon("linkedin")}</a>
          <a href="./public/docs/" aria-label="Video">${siteIcon("youtube")}</a>
        </div>
        <span class="tagline">A better tomorrow</span>
      </div>
    </footer>
  </body>
</html>`;
}

function renderNetworkPage() {
  const logo = (className = "mark") =>
    `<img class="${className}" src="../assets/nodara-mark.png" alt="" aria-hidden="true" />`;

  const statItems = [
    ["globe", "190", "Countries"],
    ["cpu", "12,489", "Active nodes"],
    ["box", "1.2M", "Compute hours/month"],
    ["users", "350K", "Community members"],
  ];

  const activityItems = [
    ["cyan", "Developer in Tokyo started a training job", "2 minutes ago"],
    ["cyan", "Researcher in Berlin joined the network", "4 minutes ago"],
    ["gold", "Compute node in New York came online", "6 minutes ago"],
    ["rose", "User in Manila ran an inference job", "8 minutes ago"],
  ];

  const networkLocations = [
    { id: "sf", city: "San Francisco", country: "United States", type: "Developer", active: "Active builders", x: 20.1, y: 39 },
    { id: "ny", city: "New York", country: "United States", type: "Business", active: "Compute demand", x: 26.9, y: 37.4 },
    { id: "toronto", city: "Toronto", country: "Canada", type: "Community", active: "Community users", x: 24.2, y: 31.2 },
    { id: "sao-paulo", city: "Sao Paulo", country: "Brazil", type: "Research", active: "Research activity", x: 37.1, y: 66.4 },
    { id: "london", city: "London", country: "United Kingdom", type: "Developer", active: "Developer activity", x: 46.9, y: 31.4 },
    { id: "berlin", city: "Berlin", country: "Germany", type: "Research", active: "Research activity", x: 49.8, y: 31.1 },
    { id: "dubai", city: "Dubai", country: "United Arab Emirates", type: "Compute node", active: "Compute providers", x: 61.1, y: 45.2 },
    { id: "mumbai", city: "Mumbai", country: "India", type: "Compute node", active: "Compute providers", x: 66.8, y: 53.2 },
    { id: "singapore", city: "Singapore", country: "Singapore", type: "Compute node", active: "Regional activity", x: 73.2, y: 60.5 },
    { id: "tokyo", city: "Tokyo", country: "Japan", type: "Developer", active: "Developer activity", x: 80.4, y: 40.3 },
    { id: "sydney", city: "Sydney", country: "Australia", type: "Community", active: "Community users", x: 82.3, y: 74.6 },
    { id: "auckland", city: "Auckland", country: "New Zealand", type: "Community", active: "Users online", x: 89.2, y: 81.8 },
  ];

  const hiwIconMap = hiwDeviceIconMap();
  const hiwLocs = hiwLocations();
  const hiwFirst = hiwLocs[0];
  const hiwMemberSlots = hiwFirst.devicesOrder
    .map((type, i) => hiwMemberCardHTML(type, hiwAvatarHues()[i], hiwIconMap))
    .join("\n            ");
  const hiwDotsHtml = hiwLocs
    .map((_, i) => `<button class="hiw-dot${i === 0 ? " is-active" : ""}" type="button" aria-label="Show ${hiwLocs[i].city} community" data-index="${i}"></button>`)
    .join("");
  const hiwTags = hiwGlobeTags();
  const hiwAmbientNodes = hiwGlobeAmbientNodes();
  const hiwRoutes = hiwGlobeRoutes();
  const hiwTagsHtml = hiwTags
    .map(
      (t) =>
        `<div class="hiw-tag${t.city === hiwFirst.city ? " is-active" : ""}" data-city="${t.city}"><div class="hiw-tag-card"><b>${t.city}</b><span>${t.country}</span></div></div>`,
    )
    .join("");
  const hiwLocationsForClient = hiwLocs.map((l) => ({
    city: l.city,
    country: l.country,
    online: l.online,
    members: hiwFormatK(l.members),
    devices: l.devices,
    devicesOrder: l.devicesOrder,
  }));
  const hiwConnectorsA = [
    { d: "M468 128 C 528 116 664 124 710 158", dur: 4.2, delay: 0, start: [468, 128], end: [710, 158] },
    { d: "M468 178 C 528 168 622 181 657 212", dur: 5.1, delay: 0.6, reverse: true, start: [468, 178], end: [657, 212] },
    { d: "M468 228 C 532 225 610 244 638 260", dur: 3.8, delay: 1.2, start: [468, 228], end: [638, 260] },
    { d: "M468 288 C 528 288 605 288 635 288", dur: 5.8, delay: 0.3, start: [468, 288], end: [635, 288] },
    { d: "M468 348 C 532 351 609 332 637 316", dur: 4.6, delay: 1.6, start: [468, 348], end: [637, 316] },
    { d: "M468 398 C 528 408 620 395 655 364", dur: 4.9, delay: 0.9, reverse: true, start: [468, 398], end: [655, 364] },
    { d: "M468 448 C 528 460 658 452 704 418", dur: 4.4, delay: 2.1, start: [468, 448], end: [704, 418] },
  ];
  const hiwConnectorsB = [
    { d: "M997 220 C 1025 220 1082 224 1100 228", dur: 3.6, delay: 0.4, start: [997, 220], end: [1100, 228] },
    { d: "M1009 250 C 1035 250 1088 252 1100 253", dur: 4.4, delay: 1.1, start: [1009, 250], end: [1100, 253] },
    { d: "M1015 278 C 1038 278 1090 278 1100 278", dur: 4.9, delay: 0, reverse: true, start: [1015, 278], end: [1100, 278] },
    { d: "M1015 298 C 1038 298 1090 298 1100 298", dur: 4.1, delay: 1.7, start: [1015, 298], end: [1100, 298] },
    { d: "M1011 326 C 1037 326 1088 324 1100 323", dur: 5.3, delay: 0.8, start: [1011, 326], end: [1100, 323] },
    { d: "M999 356 C 1027 356 1082 352 1100 348", dur: 3.9, delay: 1.4, reverse: true, start: [999, 356], end: [1100, 348] },
  ];
  const hiwConnectorsC = [
    { d: "M1242 238 C 1278 214 1332 198 1378 198", dur: 3.4, delay: 0.2, start: [1242, 238], end: [1378, 198] },
    { d: "M1242 288 C 1286 288 1332 288 1378 288", dur: 4.7, delay: 1, start: [1242, 288], end: [1378, 288] },
    { d: "M1242 338 C 1278 362 1332 378 1378 378", dur: 4, delay: 0.5, start: [1242, 338], end: [1378, 378] },
  ];
  const hiwConnectorMarkup = (list) =>
    list
      .map((c) => {
        const timing = `style="animation-duration:${c.dur}s;animation-delay:${c.delay}s"`;
        const reverse = c.reverse ? " is-reverse" : "";
        const start = c.start ? `<circle class="hiw-port is-start${reverse}" cx="${c.start[0]}" cy="${c.start[1]}" r="4" ${timing}/>` : "";
        const end = c.end ? `<circle class="hiw-port is-end${reverse}" cx="${c.end[0]}" cy="${c.end[1]}" r="4" ${timing}/>` : "";
        return `<path d="${c.d}"/>${start}${end}<circle r="3.2" class="hiw-packet${c.reverse ? " is-reverse" : ""}" style="offset-path:path('${c.d}');animation-duration:${c.dur}s;animation-delay:${c.delay}s"/>`;
      })
      .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nodara Network</title>
    <link rel="icon" href="../assets/nodara-icon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&display=swap" rel="stylesheet" />
    <style>
      :root {
        color-scheme: dark;
        --page: #020911;
        --panel: rgba(5, 25, 40, 0.82);
        --panel-strong: rgba(4, 20, 34, 0.94);
        --line: rgba(45, 192, 248, 0.28);
        --line-bright: rgba(58, 210, 255, 0.54);
        --text: #f2f7ff;
        --muted: #aec1d1;
        --soft: #7894a8;
        --accent: #20caff;
        --accent-2: #70e5ff;
        --green: #2dff9c;
        --gold: #ffd95c;
        --rose: #ff5e72;
        --shadow: 0 26px 72px rgba(0, 0, 0, 0.42);
        --wrap: min(1680px, calc(100% - 88px));
      }
      * { box-sizing: border-box; }
      html { background: var(--page); scroll-behavior: smooth; }
      body {
        margin: 0;
        min-height: 100vh;
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0;
        background:
          radial-gradient(circle at 64% 11%, rgba(0, 122, 255, 0.28), transparent 25rem),
          radial-gradient(circle at 24% 41%, rgba(16, 196, 255, 0.12), transparent 34rem),
          linear-gradient(180deg, #03121d 0%, #020912 46%, #03101a 100%);
        overflow-x: hidden;
      }
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 22% 18%, rgba(42, 207, 255, 0.7) 0 1px, transparent 2px),
          radial-gradient(circle at 74% 28%, rgba(42, 207, 255, 0.42) 0 1px, transparent 2px),
          linear-gradient(90deg, rgba(53, 205, 255, 0.04) 1px, transparent 1px),
          linear-gradient(180deg, rgba(53, 205, 255, 0.035) 1px, transparent 1px);
        background-size: 140px 120px, 190px 150px, 76px 76px, 76px 76px;
        mask-image: linear-gradient(180deg, transparent, #000 12%, #000 86%, transparent);
        opacity: 0.7;
      }
      a { color: inherit; text-decoration: none; }
      svg { display: block; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; }
      .topbar {
        position: sticky;
        top: 0;
        z-index: 50;
        border-bottom: 1px solid rgba(56, 218, 255, 0.12);
        background: rgba(2, 11, 19, 0.42);
        transition: background 220ms ease, backdrop-filter 220ms ease;
      }
      .topbar.is-scrolled {
        background: rgba(2, 12, 21, 0.78);
        backdrop-filter: blur(18px);
      }
      .nav {
        width: var(--wrap);
        height: 68px;
        margin: 0 auto;
        padding: 0 52px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        font-size: 18px;
        font-weight: 600;
      }
      .mark { width: 42px; height: 28px; object-fit: contain; }
      .brand small {
        display: block;
        margin-top: 2px;
        color: #47cbff;
        font-size: 8px;
        font-weight: 800;
        text-transform: uppercase;
      }
      .links {
        display: flex;
        align-items: center;
        gap: clamp(26px, 3.2vw, 54px);
        color: #e9f3fa;
        font-size: 13px;
        font-family: "Outfit", ui-sans-serif, system-ui, sans-serif;
        font-weight: 600;
      }
      .links a { position: relative; padding: 26px 0 23px; }
      .links a[aria-current="page"]::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 9px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        transform: translateX(-50%);
        background: var(--accent);
        box-shadow: 0 0 16px var(--accent);
      }
      .actions { display: flex; align-items: center; gap: 12px; font-family: "Outfit", ui-sans-serif, system-ui, sans-serif; }
      .menu-toggle, .mobile-menu { display: none; }
      .menu-toggle { min-width: 76px; min-height: 44px; align-items: center; justify-content: center; gap: 8px; border: 1px solid var(--line-bright); border-radius: 999px; color: #f5f8fb; background: rgba(3,18,30,.72); font: 800 12px/1 "Outfit", sans-serif; }
      .menu-toggle svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
      .mobile-menu { position: absolute; top: 100%; left: max(18px, calc((100% - 768px) / 2)); right: max(18px, calc((100% - 768px) / 2)); padding: 12px; border: 1px solid var(--line); background: #03121e; box-shadow: 0 18px 36px rgba(0,0,0,.36); }
      .mobile-menu a { min-height: 48px; display: flex; align-items: center; padding: 0 14px; color: #e9f3fa; font: 700 14px/1 "Outfit", sans-serif; }
      .mobile-menu a + a { border-top: 1px solid var(--line); }
      .mobile-menu .mobile-primary { margin-top: 8px; justify-content: center; border-radius: 6px; color: #02111d; background: #38daff; }
      .topbar.is-menu-open .mobile-menu { display: grid; animation: menu-in 180ms ease-out both; }
      .topbar.is-menu-open .mobile-menu a { animation: menu-item-in 220ms ease-out both; }
      .topbar.is-menu-open .mobile-menu a:nth-child(2) { animation-delay: 20ms; }
      .topbar.is-menu-open .mobile-menu a:nth-child(3) { animation-delay: 40ms; }
      .topbar.is-menu-open .mobile-menu a:nth-child(4) { animation-delay: 60ms; }
      .topbar.is-menu-open .mobile-menu a:nth-child(5) { animation-delay: 80ms; }
      .topbar.is-menu-open .mobile-menu a:nth-child(6) { animation-delay: 100ms; }
      @keyframes menu-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes menu-item-in { from { opacity: 0; transform: translateY(-3px); } to { opacity: 1; transform: translateY(0); } }
      @media (prefers-reduced-motion: reduce) { .topbar.is-menu-open .mobile-menu, .topbar.is-menu-open .mobile-menu a { animation: none; } }
      .btn {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border: 1px solid var(--line-bright);
        border-radius: 999px;
        padding: 0 25px;
        font-size: 13px;
        font-weight: 800;
        white-space: nowrap;
      }
      .btn.primary {
        color: #02101c;
        border-color: transparent;
        background: linear-gradient(135deg, #49dcff, #0caeff);
        box-shadow: 0 0 28px rgba(32, 202, 255, 0.48), inset 0 1px rgba(255, 255, 255, 0.6);
      }
      .btn.ghost {
        color: #f5f8fb;
        background: rgba(3, 18, 30, 0.58);
      }
      .actions .btn {
        min-height: 38px;
        padding: 0 19px;
        border-color: rgba(56, 218, 255, 0.46);
        font-size: 12px;
        transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
      }
      .actions .btn:hover { transform: translateY(-1px); border-color: rgba(56, 218, 255, 0.74); }
      .actions .btn.primary {
        border-color: transparent;
        color: #02111d;
        background: linear-gradient(135deg, #38daff, #22c9f5);
        box-shadow: 0 16px 38px rgba(34, 201, 245, 0.22);
      }
      .section {
        position: relative;
        border-bottom: 1px solid rgba(68, 191, 238, 0.18);
      }
      .wrap {
        width: var(--wrap);
        margin: 0 auto;
      }
      .eyebrow {
        display: block;
        margin-bottom: 18px;
        color: var(--accent);
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .hero {
        min-height: 680px;
        overflow: hidden;
        border-bottom: 0;
        background:
          radial-gradient(circle at 67% 49%, rgba(17, 139, 235, 0.24), transparent 30rem),
          linear-gradient(90deg, rgba(2, 9, 17, 0.98) 0%, rgba(2, 11, 20, 0.44) 55%, rgba(2, 9, 17, 0.94) 100%);
      }
      .hero .wrap {
        min-height: 680px;
        display: grid;
        grid-template-columns: minmax(560px, 0.72fr) minmax(620px, 1.28fr);
        gap: 18px;
        align-items: center;
        padding: 52px 0 56px;
      }
      .hero .wrap > div:first-child {
        position: relative;
        z-index: 3;
      }
      h1 {
        max-width: 590px;
        margin: 0 0 22px;
        font-size: clamp(52px, 4.45vw, 64px);
        line-height: 1.02;
      }
      h1 span { color: #52d8ff; }
      .lead {
        max-width: 520px;
        margin: 0;
        color: #d9e7f2;
        font-size: 18px;
        line-height: 1.48;
      }
      .hero-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        margin: 36px 0 64px;
      }
      .mini-features {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
        max-width: 590px;
      }
      .mini-feature {
        display: grid;
        grid-template-columns: 40px 1fr;
        gap: 10px;
        align-items: center;
        color: #dbeaf6;
        font-size: 10px;
        line-height: 1.25;
      }
      .mini-feature b { display: block; color: #f4f9ff; font-size: 11px; }
      .round-icon {
        width: 41px;
        height: 41px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(50, 210, 255, 0.38);
        border-radius: 50%;
        color: var(--accent);
        background: rgba(13, 90, 128, 0.18);
        box-shadow: 0 0 18px rgba(32, 202, 255, 0.18);
      }
      .round-icon svg { width: 22px; height: 22px; }
      .globe-stage {
        position: relative;
        min-height: 610px;
        z-index: 1;
      }
      .planet {
        position: absolute;
        left: 31%;
        top: 50%;
        width: min(700px, 54vw);
        aspect-ratio: 1;
        transform: translate(-50%, -50%);
        border-radius: 0;
        background: url("../assets/network-hero-globe-desktop.webp") center / contain no-repeat;
        filter: drop-shadow(0 0 35px rgba(32, 202, 255, 0.26));
        opacity: 0.96;
        mix-blend-mode: screen;
        -webkit-mask-image: radial-gradient(circle closest-side at center, #000 0 58%, rgba(0, 0, 0, 0.7) 70%, transparent 86%);
        mask-image: radial-gradient(circle closest-side at center, #000 0 58%, rgba(0, 0, 0, 0.7) 70%, transparent 86%);
      }
      @media (max-width: 1020px) {
        .planet { background-image: url("../assets/network-hero-globe-tablet.webp"); }
      }
      @media (max-width: 600px) {
        .planet { background-image: url("../assets/network-hero-globe-mobile.webp"); }
      }
      .planet::before,
      .planet::after {
        display: none;
      }
      .planet-lines {
        position: absolute;
        inset: -5%;
        width: 110%;
        height: 110%;
        color: #26cfff;
        opacity: 0.72;
        display: none;
      }
      .planet-lines path { fill: none; stroke: currentColor; stroke-width: 1.15; opacity: 0.55; }
      .planet-lines circle { fill: #45dcff; filter: drop-shadow(0 0 8px #20caff); }
      .stats-card {
        position: absolute;
        right: 0;
        top: 73px;
        width: 224px;
        padding: 22px 25px;
        border: 1px solid var(--line-bright);
        border-radius: 8px;
        background: rgba(3, 20, 35, 0.86);
        box-shadow: var(--shadow), inset 0 1px rgba(255, 255, 255, 0.08);
      }
      .online {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #e9f8ff;
        font-size: 13px;
        font-weight: 700;
      }
      .online::before {
        content: "";
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--green);
        box-shadow: 0 0 14px var(--green);
      }
      .stats-card strong {
        display: block;
        margin-top: 16px;
        font-size: 31px;
        line-height: 1;
      }
      .stats-card dl { margin: 18px 0 0; }
      .stats-card div {
        padding: 13px 0 0;
        border-top: 1px solid rgba(122, 214, 255, 0.17);
      }
      .stats-card dt { color: var(--muted); font-size: 11px; }
      .stats-card dd { margin: 0 0 11px; color: #f0f7ff; font-size: 17px; font-weight: 800; }
      .callout {
        position: absolute;
        right: 18%;
        bottom: 160px;
        width: 244px;
        padding: 13px 17px;
        border: 1px solid rgba(78, 210, 255, 0.36);
        border-radius: 8px;
        color: #d8eaf6;
        background: rgba(4, 26, 43, 0.8);
        font-size: 13px;
        line-height: 1.35;
      }
      .vertical-tag {
        position: absolute;
        right: 8px;
        bottom: 55px;
        color: #5bdcff;
        font-size: 10px;
        font-weight: 900;
        line-height: 1.7;
        text-transform: uppercase;
      }
      .metric-rail {
        position: relative;
        background: rgba(2, 12, 22, 0.78);
        border-bottom: 0;
      }
      .metric-rail::before,
      .metric-rail::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        pointer-events: none;
        background: linear-gradient(90deg, transparent, rgba(68, 191, 238, 0.045) 18%, rgba(68, 191, 238, 0.075) 50%, rgba(68, 191, 238, 0.045) 82%, transparent);
      }
      .metric-rail::before { top: 0; }
      .metric-rail::after { bottom: 0; }
      .metric-grid {
        width: var(--wrap);
        min-height: 116px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }
      .metric {
        position: relative;
        display: grid;
        grid-template-columns: 58px 1fr;
        gap: 22px;
        align-items: center;
        padding: 25px 38px;
      }
      .metric:not(:last-child)::after {
        content: "";
        position: absolute;
        top: 22%;
        right: 0;
        width: 1px;
        height: 56%;
        background: linear-gradient(180deg, transparent, rgba(73, 179, 222, 0.18) 50%, transparent);
      }
      .metric b { display: block; font-size: 26px; line-height: 1; }
      .metric span:last-child { color: #bcd0dd; font-size: 13px; }
      .community .wrap {
        min-height: 700px;
        display: grid;
        grid-template-columns: minmax(360px, 0.36fr) minmax(700px, 0.64fr);
        gap: clamp(24px, 3vw, 56px);
        align-items: center;
        padding: 105px 0 112px;
      }
      .community {
        background:
          radial-gradient(ellipse at 70% 50%, rgba(29, 174, 235, 0.1), transparent 34rem),
          linear-gradient(180deg, rgba(2, 13, 22, 0.98), rgba(3, 21, 34, 0.9));
        border-bottom-color: rgba(52, 142, 179, 0.1);
      }
      .section h2 {
        margin: 0;
        font-size: clamp(34px, 3.2vw, 52px);
        line-height: 1.08;
      }
      .community p,
      .centered-copy p,
      .activity-copy p,
      .feature-card p {
        color: #bfd0dd;
        font-size: 17px;
        line-height: 1.42;
      }
      .community p {
        max-width: 470px;
        margin: 24px 0 32px;
        color: #a4b6c6;
        font-size: 18px;
        line-height: 1.62;
      }
      .community .btn.primary {
        width: 220px;
        min-height: 56px;
        padding: 0 22px;
        color: #02101c;
        font-size: 15px;
        font-weight: 700;
        background: linear-gradient(90deg, #27d7f6 0%, #18bceb 45%, #0a96dd 100%);
        box-shadow: 0 0 24px rgba(31, 198, 243, 0.2);
        transition: transform 160ms ease, box-shadow 160ms ease;
      }
      .community .btn.primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 30px rgba(31, 198, 243, 0.28);
      }
      .community .eyebrow {
        color: #29c9f6;
        font-size: 12px;
        font-weight: 800;
      }
      #community-title {
        max-width: 440px;
        font-size: clamp(42px, 3.55vw, 56px);
        font-weight: 650;
        line-height: 1.07;
      }
      .map-wrap {
        position: relative;
        min-height: 480px;
        margin-right: min(-5vw, -48px);
      }
      .map-wrap::before {
        display: none;
      }
      .map-plane {
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(950px, 116%);
        aspect-ratio: 1672 / 941;
        transform: translate(-50%, -50%);
      }
      .world-map {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
        transform: none;
        object-fit: cover;
        filter: brightness(1.16) contrast(1.32);
        mix-blend-mode: screen;
        opacity: 0.58;
        -webkit-mask-image:
          linear-gradient(90deg, transparent 0%, #000 13%, #000 87%, transparent 100%),
          linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%);
        -webkit-mask-composite: source-in;
        mask-image:
          linear-gradient(90deg, transparent 0%, #000 13%, #000 87%, transparent 100%),
          linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%);
        mask-composite: intersect;
      }
      .map-arcs {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        color: #28d5ff;
        pointer-events: none;
      }
      .map-arcs path {
        fill: none;
        stroke: currentColor;
        stroke-width: 0.18;
        opacity: 0.055;
      }
      .map-arcs circle {
        fill: currentColor;
        filter: drop-shadow(0 0 5px currentColor);
        opacity: 0;
        display: none;
      }
      .map-arcs .arc-dot-one {
        offset-path: path("M24 30 C 32 18 42 24 46.4 30.8 C 51 35 56 37 61.5 45.5 C 66 50 70 55 74.5 61.2 C 78 67 82 71 82.5 73.3");
      }
      .map-arcs .arc-dot-two {
        offset-path: path("M20.5 38.2 C 23 33 25 35 26.5 36.7 C 34 44 37 56 37 65.1 C 50 54 62 47 74.5 61.2");
      }
      .map-arcs circle:nth-of-type(2) { animation-delay: 3.5s; }
      .map-point {
        position: absolute;
        left: var(--x);
        top: var(--y);
        width: 24px;
        height: 24px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        color: #3fe27a;
        background: transparent;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }
      .map-point::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: currentColor;
        box-shadow: 0 0 18px currentColor, 0 0 4px #fff;
        opacity: 0.95;
        animation: pointPulse 4.6s ease-in-out infinite;
      }
      .map-point::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 26px;
        height: 26px;
        border: 1px solid rgba(63, 226, 122, 0.34);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        animation: ringPulse 5.4s ease-out infinite;
      }
      .map-point.is-selected::before {
        width: 14px;
        height: 14px;
        opacity: 1;
      }
      .map-point.is-selected::after {
        width: 48px;
        height: 48px;
        opacity: 0.42;
      }
      .point-tip {
        position: absolute;
        left: 50%;
        bottom: 30px;
        width: 172px;
        padding: 11px 12px;
        border: 1px solid rgba(32, 194, 236, 0.24);
        border-radius: 10px;
        background: rgba(5, 28, 42, 0.94);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        color: #a4b6c6;
        font-size: 12px;
        line-height: 1.32;
        text-align: left;
        opacity: 0;
        transform: translate(-50%, 6px);
        pointer-events: none;
        transition: opacity 160ms ease, transform 160ms ease;
      }
      .point-tip b {
        display: block;
        color: #f4f8fb;
        font-size: 13px;
      }
      .map-point:hover .point-tip,
      .map-point:focus-visible .point-tip {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      @keyframes pointPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.72; }
        50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
      }
      @keyframes ringPulse {
        0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.34; }
        100% { transform: translate(-50%, -50%) scale(1.42); opacity: 0; }
      }
      @keyframes arcTravel {
        0%, 18% { opacity: 0; offset-distance: 0%; }
        25%, 60% { opacity: 0.85; }
        74%, 100% { opacity: 0; offset-distance: 100%; }
      }
      .how {
        padding: 64px 0 76px;
        overflow: clip;
      }
      .centered-copy {
        text-align: center;
      }
      .centered-copy p {
        max-width: 720px;
        margin: 16px auto 0;
      }
      .how h2 span { color: var(--accent); }

      /* ---- flow shell ---- */
      .hiw-flow {
        position: relative;
        min-height: 600px;
        margin-top: 44px;
        overflow: visible;
      }
      .hiw-connectors {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        color: #28c9f5;
        pointer-events: none;
        z-index: 3;
      }
      .hiw-connectors path { fill: none; stroke: currentColor; stroke-width: 1.2; opacity: 0.28; }
      .hiw-connectors .hiw-port {
        fill: #28c9f5;
        opacity: 0.16;
        filter: drop-shadow(0 0 2px rgba(41, 213, 255, 0.32));
        animation: hiwPortStart 5s ease-in-out infinite;
      }
      .hiw-connectors .hiw-port.is-end {
        animation-name: hiwPortEnd;
      }
      .hiw-connectors .hiw-port.is-reverse {
        animation-direction: reverse;
      }
      .hiw-connectors .hiw-packet {
        fill: #eafcff;
        filter: drop-shadow(0 0 7px #29d5ff) drop-shadow(0 0 3px #fff);
        opacity: 0;
        animation: hiwParticle 5s ease-in-out infinite;
      }
      .hiw-connectors .hiw-packet.is-reverse { animation-direction: reverse; }
      .hiw-responsive-connectors {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: none;
        overflow: visible;
        pointer-events: none;
        z-index: 1;
      }
      .hiw-responsive-link {
        fill: none;
        stroke: rgba(40, 201, 245, 0.5);
        stroke-width: 1.4;
        vector-effect: non-scaling-stroke;
        filter: drop-shadow(0 0 4px rgba(41, 213, 255, 0.35));
      }
      .hiw-responsive-link-signal {
        fill: none;
        stroke: rgba(205, 244, 255, 0.78);
        stroke-width: 1.8;
        stroke-dasharray: 3 18;
        vector-effect: non-scaling-stroke;
        animation: hiwResponsiveSignal 4s linear infinite;
      }
      .hiw-responsive-port {
        fill: #45dcff;
        filter: drop-shadow(0 0 6px rgba(41, 213, 255, 0.85));
      }
      @keyframes hiwResponsiveSignal {
        to { stroke-dashoffset: -42; }
      }
      @keyframes hiwParticle {
        0%, 8% { opacity: 0; offset-distance: 0%; }
        14%, 22% { opacity: 1; }
        50% { opacity: 0.9; }
        78%, 88% { opacity: 1; }
        96%, 100% { opacity: 0; offset-distance: 100%; }
      }
      @keyframes hiwPortStart {
        0%, 7% {
          opacity: 0.18;
        }
        12%, 18% {
          opacity: 0.95;
        }
        28%, 100% {
          opacity: 0.18;
        }
      }
      @keyframes hiwPortEnd {
        0%, 72% {
          opacity: 0.18;
        }
        82%, 91% {
          opacity: 0.98;
        }
        100% {
          opacity: 0.18;
        }
      }

      /* ---- community card ---- */
      .hiw-community {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 4;
        width: clamp(400px, 27vw, 468px);
        padding: 22px 22px 20px;
        border: 1px solid rgba(32, 197, 245, 0.42);
        border-radius: 16px;
        background: rgba(3, 21, 34, 0.82);
        backdrop-filter: blur(6px);
        box-shadow: 0 0 35px rgba(20, 188, 240, 0.05);
      }
      .hiw-community-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }
      .hiw-community-loc { display: flex; align-items: flex-start; gap: 10px; }
      .hiw-community-loc svg { width: 34px; height: 34px; color: var(--accent); flex: none; }
      .hiw-city { margin: 0; font-size: 21px; font-weight: 650; color: #f4f9ff; transition: opacity 220ms ease; }
      .hiw-sub { margin: 4px 0 0; font-size: 14px; color: #9fb2c2; transition: opacity 220ms ease; }
      .hiw-live {
        display: flex;
        align-items: center;
        gap: 7px;
        margin-top: 3px;
        color: #d7f3ff;
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
      }
      .hiw-live .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--green);
        box-shadow: 0 0 10px var(--green);
        animation: hiwLiveBlink 2.4s ease-in-out infinite;
      }
      .hiw-nav {
        position: absolute;
        top: 50%;
        z-index: 2;
        width: 30px;
        height: 30px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(70, 200, 245, 0.32);
        border-radius: 50%;
        background: rgba(3, 16, 27, 0.86);
        color: #cdeeff;
        font-size: 15px;
        line-height: 1;
        cursor: pointer;
        transform: translateY(-50%);
      }
      .hiw-nav.prev { left: -15px; }
      .hiw-nav.next { right: -15px; }
      .hiw-member-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 9px;
        margin-top: 18px;
      }
      .hiw-member {
        padding: 10px 10px 9px;
        border: 1px solid rgba(28, 171, 220, 0.3);
        border-radius: 9px;
        background: rgba(4, 26, 40, 0.6);
        opacity: 1;
        transform: translateY(0);
        transition: opacity 450ms ease, transform 450ms ease;
      }
      .hiw-member.is-hidden { opacity: 0; transform: translateY(6px); }
      .hiw-member-top { display: flex; align-items: center; gap: 6px; }
      .hiw-avatar {
        width: 30px;
        height: 30px;
        flex: none;
        display: grid;
        place-items: center;
        border-radius: 50%;
        color: #eafcff;
        background: linear-gradient(150deg, hsl(var(--hue) 78% 52%), hsl(calc(var(--hue) + 26) 70% 34%));
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14) inset;
      }
      .hiw-avatar svg { width: 17px; height: 17px; }
      .hiw-device { width: 30px; height: 30px; color: #7fdcff; }
      .hiw-device svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.4; }
      .hiw-member-status {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 9px;
        color: #a9bdcc;
        font-size: 11.5px;
      }
      .hiw-member-status .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--green);
        box-shadow: 0 0 8px var(--green);
        flex: none;
      }
      .hiw-dots { display: flex; justify-content: center; gap: 6px; margin-top: 16px; }
      .hiw-dot {
        width: 6px;
        height: 6px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: rgba(120, 165, 190, 0.4);
        cursor: pointer;
      }
      .hiw-dot.is-active { width: 16px; border-radius: 4px; background: var(--accent); box-shadow: 0 0 8px var(--accent); }
      .hiw-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin-top: 18px;
        padding-top: 16px;
        border-top: 1px solid rgba(54, 148, 181, 0.22);
        text-align: center;
      }
      .hiw-stats div { position: relative; }
      .hiw-stats div:not(:last-child)::after {
        content: "";
        position: absolute;
        top: 8%;
        right: 0;
        width: 1px;
        height: 84%;
        background: rgba(54, 148, 181, 0.25);
      }
      .hiw-stats b { display: block; font-size: 21px; font-weight: 650; color: var(--accent); }
      .hiw-stats span { color: #91a8ba; font-size: 12px; }

      /* ---- globe ---- */
      .hiw-globe-stage {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
        width: clamp(420px, 31vw, 560px);
        aspect-ratio: 1;
        overflow: visible;
        background: transparent;
      }
      .hiw-globe-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
        background: transparent;
        border-radius: 0;
        -webkit-mask-image: radial-gradient(circle, #000 60%, rgba(0, 0, 0, 0.5) 70%, transparent 80%);
        mask-image: radial-gradient(circle, #000 60%, rgba(0, 0, 0, 0.5) 70%, transparent 80%);
      }
      .hiw-globe-fallback {
        position: absolute;
        inset: 6%;
        border-radius: 50%;
        background: radial-gradient(circle at 34% 30%, rgba(20, 90, 130, 0.5), rgba(2, 16, 27, 0.92) 68%);
        box-shadow: 0 0 60px rgba(32, 202, 255, 0.22);
        opacity: 0;
        transition: opacity 400ms ease;
      }
      .hiw-globe-fallback.is-visible { opacity: 1; }
      .hiw-globe-fallback.is-loading { animation: hiwGlobeShimmer 1.6s ease-in-out infinite; }
      @keyframes hiwGlobeShimmer {
        0%, 100% { opacity: 0.55; }
        50% { opacity: 0.95; }
      }
      .hiw-globe-core {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 62%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 2;
      }
      .hiw-globe-core::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 230%;
        height: 230%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: radial-gradient(circle, rgba(2, 12, 20, 0.72) 0%, rgba(2, 12, 20, 0.32) 52%, transparent 75%);
        z-index: -1;
      }
      .hiw-globe-core .mark { width: 46px; height: 31px; margin: 0 auto 8px; }
      .hiw-globe-core b { display: block; font-size: 15px; font-weight: 700; color: #fff; }
      .hiw-globe-core b span { color: var(--accent); }
      .hiw-globe-core p { margin: 5px 0 0; color: #9fb2c2; font-size: 11.5px; line-height: 1.35; }
      .hiw-tag {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        pointer-events: none;
        transition: opacity 260ms ease;
        will-change: transform, opacity;
        z-index: 3;
      }
      .hiw-tag-card {
        position: absolute;
        left: 14px;
        top: -17px;
        width: 116px;
        padding: 7px 9px;
        border: 1px solid rgba(30, 194, 240, 0.3);
        border-radius: 7px;
        background: rgba(2, 18, 29, 0.9);
        line-height: 1.25;
        white-space: nowrap;
        transition: left 260ms ease, right 260ms ease, top 260ms ease;
      }
      .hiw-tag.is-left .hiw-tag-card { left: auto; right: 14px; }
      .hiw-tag.is-bottom .hiw-tag-card { top: -3px; }
      .hiw-tag-card b { display: block; color: #fff; font-size: 12px; font-weight: 600; }
      .hiw-tag-card span { color: #8ea8ba; font-size: 10.5px; }
      .hiw-tag.is-active .hiw-tag-card { border-color: rgba(70, 220, 255, 0.7); box-shadow: 0 0 16px rgba(32, 202, 255, 0.32); }
      .hiw-tag-lines {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        overflow: visible;
        pointer-events: none;
      }
      .hiw-tag-line {
        fill: none;
        stroke: rgba(72, 205, 255, 0.5);
        stroke-width: 1.1;
        filter: drop-shadow(0 0 2px rgba(40, 180, 255, 0.35));
      }
      .hiw-tag-line-dot {
        fill: #cdf4ff;
        filter: drop-shadow(0 0 5px rgba(70, 220, 255, 0.9));
      }

      /* ---- distributed compute ---- */
      .hiw-compute {
        position: absolute;
        left: 71%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 4;
        width: 140px;
        text-align: center;
      }
      .hiw-server {
        height: 38px;
        margin-bottom: 9px;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0 11px;
        border: 1px solid rgba(53, 215, 255, 0.4);
        border-radius: 6px;
        background: linear-gradient(180deg, rgba(9, 34, 52, 0.92), rgba(3, 16, 27, 0.94));
      }
      .hiw-server .slots { flex: 1; display: flex; gap: 3px; }
      .hiw-server .slots span { flex: 1; height: 8px; border-radius: 1px; background: rgba(64, 150, 190, 0.3); }
      .hiw-server .led {
        width: 6px;
        height: 6px;
        flex: none;
        border-radius: 50%;
        background: #45dcff;
        box-shadow: 0 0 8px #29d5ff;
        animation: hiwLed 3.8s ease-in-out infinite;
      }
      .hiw-server:nth-child(1) .led { animation-duration: 3.7s; }
      .hiw-server:nth-child(2) .led { animation-duration: 4.4s; animation-delay: 0.6s; }
      .hiw-server:nth-child(3) .led { animation-duration: 3.1s; animation-delay: 1.1s; }
      .hiw-compute-label { margin-top: 4px; color: #f4f9ff; font-size: 13px; font-weight: 650; line-height: 1.3; }

      /* ---- capability card ---- */
      .hiw-capability {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 4;
        width: clamp(240px, 16vw, 272px);
        border: 1px solid rgba(27, 184, 231, 0.38);
        border-radius: 16px;
        background: rgba(3, 22, 35, 0.88);
        overflow: visible;
      }
      .hiw-capability::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: rgba(3, 22, 35, 0.88);
        z-index: -1;
      }
      .hiw-cap-row {
        position: relative;
        display: grid;
        grid-template-columns: 48px 1fr;
        gap: 15px;
        align-items: center;
        min-height: 103px;
        padding: 0 22px;
        border-bottom: 1px solid rgba(54, 148, 181, 0.2);
        transition: background 300ms ease;
      }
      .hiw-cap-row::before {
        content: "";
        position: absolute;
        left: -5px;
        top: 50%;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        transform: translateY(-50%);
        background: #28c9f5;
        box-shadow: 0 0 12px rgba(40, 201, 245, 0.75);
      }
      .hiw-cap-row:last-child { border-bottom: 0; }
      .hiw-cap-row .round-icon { transition: box-shadow 700ms ease, transform 700ms ease; }
      .hiw-cap-row.is-pulsing .round-icon { box-shadow: 0 0 26px rgba(32, 202, 255, 0.5); transform: scale(1.08); }
      .hiw-cap-row b { display: block; color: #fff; font-size: 16px; font-weight: 700; }
      .hiw-cap-row span { color: #9fb2c2; font-size: 13px; }

      /* ---- bottom strip ---- */
      .hiw-strip {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px 54px;
        margin-top: 60px;
        padding-top: 30px;
        border-top: 1px solid rgba(68, 191, 238, 0.15);
      }
      .hiw-strip-item { position: relative; display: flex; align-items: center; gap: 13px; padding-right: 54px; }
      .hiw-strip-item:last-child { padding-right: 0; }
      .hiw-strip-item:not(:last-child)::after {
        content: "";
        position: absolute;
        right: 0;
        top: 50%;
        width: 1px;
        height: 34px;
        transform: translateY(-50%);
        background: rgba(122, 214, 255, 0.17);
      }
      .hiw-strip-item .round-icon { width: 40px; height: 40px; flex: none; }
      .hiw-strip-item .round-icon svg { width: 20px; height: 20px; }
      .hiw-strip-item b { display: block; color: #fff; font-size: 14px; }
      .hiw-strip-item span { color: #91a8ba; font-size: 12.5px; }

      @keyframes hiwBreathe {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.006); }
      }
      @keyframes hiwBreatheStatic {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.006); }
      }
      @keyframes hiwLed {
        0%, 100% { opacity: 0.55; box-shadow: 0 0 6px #29d5ff; }
        50% { opacity: 1; box-shadow: 0 0 12px #45dcff; }
      }
      @keyframes hiwLiveBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.55; }
      }
      @media (prefers-reduced-motion: reduce) {
        .hiw-globe-stage,
        .hiw-globe-fallback.is-loading,
        .hiw-server .led,
        .hiw-live .dot,
        .hiw-connectors .hiw-packet,
        .hiw-connectors .hiw-port {
          animation: none !important;
        }
        .hiw-connectors .hiw-packet { opacity: 0.55; }
        .hiw-connectors .hiw-port { opacity: 0.45; }
        .hiw-responsive-link-signal { animation: none; }
      }
      .activity .wrap {
        min-height: 390px;
        display: grid;
        grid-template-columns: minmax(360px, 0.95fr) minmax(520px, 1.05fr);
        gap: 76px;
        align-items: center;
        padding: 62px 0;
      }
      .activity-list {
        border: 1px solid var(--line-bright);
        border-radius: 8px;
        background: rgba(4, 23, 38, 0.86);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.07);
        padding: 21px 28px;
      }
      .activity-title {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 17px;
        font-size: 16px;
        font-weight: 800;
      }
      .activity-title::before {
        content: "";
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 3px solid rgba(45, 255, 156, 0.4);
        background: var(--green);
        box-shadow: 0 0 16px var(--green);
      }
      .activity-row {
        display: grid;
        grid-template-columns: 16px 1fr auto;
        gap: 12px;
        align-items: center;
        min-height: 39px;
        color: #d7e8f5;
        font-size: 13px;
      }
      .dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 12px currentColor;
      }
      .dot.gold { background: var(--gold); color: var(--gold); }
      .dot.rose { background: var(--rose); color: var(--rose); }
      .activity-row time { color: #7f98aa; }
      .features {
        padding: 57px 0 48px;
        text-align: center;
      }
      .features h2 {
        margin: 0 0 36px;
        font-size: clamp(31px, 2.6vw, 43px);
      }
      .feature-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 34px;
        text-align: left;
      }
      .feature-card {
        min-height: 206px;
        padding: 34px 32px;
        border: 1px solid rgba(74, 205, 255, 0.29);
        border-radius: 8px;
        background: linear-gradient(180deg, rgba(8, 39, 61, 0.78), rgba(4, 21, 35, 0.84));
      }
      .feature-card .round-icon {
        width: 62px;
        height: 62px;
        margin-bottom: 24px;
        background: rgba(26, 140, 199, 0.17);
      }
      .feature-card h3 {
        margin: 0 0 12px;
        font-size: 19px;
      }
      .feature-card p {
        margin: 0;
        font-size: 14px;
      }
      .cta-band {
        padding: 0 0 36px;
      }
      .cta-card {
        position: relative;
        min-height: 282px;
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 30px;
        align-items: center;
        padding: 52px 53px;
        border: 1px solid var(--line-bright);
        border-radius: 8px;
        overflow: hidden;
        background:
          linear-gradient(90deg, rgba(3, 13, 23, 0.86) 0%, rgba(3, 18, 31, 0.4) 58%, rgba(2, 10, 18, 0.9) 100%),
          var(--bg-photo, none) center 58% / cover no-repeat,
          #0a1720;
        box-shadow: var(--shadow);
      }
      .cta-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(100deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.07) 45%, rgba(255, 255, 255, 0) 90%);
        background-size: 200% 100%;
        animation: bg-shimmer 1.6s ease-in-out infinite;
        opacity: 1;
        transition: opacity 0.4s ease;
      }
      .cta-card.bg-loaded::before { opacity: 0; animation: none; }
      @keyframes bg-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .cta-card::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(34, 170, 246, 0.08), rgba(1, 8, 15, 0.35));
        pointer-events: none;
      }
      .cta-card > * { position: relative; z-index: 1; }
      .cta-card h2 {
        max-width: 690px;
        margin: 0 0 30px;
        font-size: clamp(34px, 3vw, 46px);
        line-height: 1.12;
      }
      .cta-actions { display: flex; gap: 18px; flex-wrap: wrap; }
      .cta-lines {
        justify-self: end;
        color: #e2f3ff;
        font-size: 17px;
        line-height: 1.55;
      }
      .site-footer {
        background: rgba(3, 14, 24, 0.94);
        border-top: 1px solid rgba(68, 191, 238, 0.18);
      }
      .footer-main {
        width: var(--wrap);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.6fr repeat(4, 1fr) 1.3fr;
        gap: 52px;
        padding: 38px 0 35px;
      }
      .footer-col h3 {
        margin: 0 0 12px;
        color: #f0f7ff;
        font-size: 13px;
      }
      .footer-col a {
        display: block;
        margin-top: 9px;
        color: #9fb4c6;
        font-size: 13px;
      }
      .social {
        display: flex;
        justify-content: flex-end;
        gap: 24px;
        color: #c4d4e1;
      }
      .social svg { width: 19px; height: 19px; }
      .footer-bottom {
        width: var(--wrap);
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        gap: 28px;
        padding: 24px 0 31px;
        border-top: 1px solid rgba(98, 180, 212, 0.17);
        color: #7f95a7;
        font-size: 12px;
      }
      .legal { display: flex; gap: 42px; }
      @media (max-width: 1180px) {
        .hero .wrap,
        .community .wrap,
        .activity .wrap {
          grid-template-columns: 1fr;
        }
        .globe-stage { min-height: 540px; }
        .planet { left: 50%; width: min(620px, 88vw); }
        .stats-card { right: 6%; }
        .metric-grid,
        .feature-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .map-wrap {
          width: 100%;
          margin-right: 0;
          overflow: hidden;
        }
        .map-plane { width: min(900px, 120vw); }
        .hiw-flow {
          position: relative;
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(320px, 468px) minmax(300px, 420px);
          align-items: center;
          justify-content: center;
          gap: 32px clamp(28px, 4vw, 64px);
        }
        .hiw-flow::after { display: none; }
        .hiw-community,
        .hiw-globe-stage,
        .hiw-compute,
        .hiw-capability {
          position: static;
          transform: none;
        }
        .hiw-community,
        .hiw-capability { width: 100%; }
        .hiw-community {
          grid-column: 1;
          grid-row: 1;
          padding: 18px;
        }
        .hiw-community .hiw-member:nth-child(n + 4) { display: none; }
        .hiw-community .hiw-nav { display: none; }
        .hiw-community .hiw-member-grid,
        .hiw-community .hiw-stats { margin-top: 14px; }
        .hiw-globe-stage {
          position: relative;
          left: auto;
          top: auto;
          grid-column: 2;
          grid-row: 1;
          width: min(380px, 100%);
          height: auto;
          aspect-ratio: 1 / 1;
          justify-self: center;
        }
        .hiw-compute {
          grid-column: 1;
          grid-row: 2;
          justify-self: center;
        }
        .hiw-capability {
          position: relative;
          right: auto;
          top: auto;
          grid-column: 2;
          grid-row: 2;
        }
        .hiw-connectors { display: none; }
        .hiw-responsive-connectors { display: block; }
        .hiw-tag,
        .hiw-tag-lines { display: none; }
        .footer-main { grid-template-columns: repeat(3, 1fr); }
        .social { justify-content: flex-start; }
      }
      @media (max-width: 1020px) {
        :root { --wrap: min(100% - 36px, 768px); }
        .nav { padding: 0 28px; }
        .links { display: none; }
        .actions { display: none; }
        .menu-toggle { display: inline-flex; }
      }
      @media (max-width: 760px) {
        .nav,
        .wrap,
        .metric-grid,
        .footer-main,
        .footer-bottom {
          width: var(--wrap);
        }
        .nav { height: 64px; }
        .links { display: none; }
        .actions .ghost { display: none; }
        .actions { display: none; }
        .hero .wrap { padding-top: 45px; }
        h1 {
          max-width: 100%;
          font-size: clamp(29px, 8vw, 32px);
          overflow-wrap: normal;
        }
        .lead {
          max-width: 100%;
          font-size: 16px;
        }
        .hero-buttons { margin-bottom: 38px; }
        .mini-features,
        .metric-grid,
        .feature-grid,
        .cta-card,
        .footer-main {
          grid-template-columns: 1fr;
        }
        .globe-stage { min-height: 700px; }
        .planet { left: 50%; top: 32%; width: min(320px, 82vw); }
        .stats-card {
          position: relative;
          top: auto;
          right: auto;
          width: 100%;
          margin-top: 470px;
        }
        .callout,
        .vertical-tag { display: none; }
        .metric { border-right: 0; border-bottom: 0; padding-left: 0; padding-right: 0; }
        .metric:not(:last-child)::after {
          top: auto;
          right: auto;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(73, 179, 222, 0.16) 50%, transparent);
        }
        .community .wrap,
        .activity .wrap { padding: 52px 0; gap: 34px; }
        .map-wrap {
          min-height: 360px;
          overflow: hidden;
        }
        .map-plane { width: min(680px, 165vw); }
        .point-tip { display: none; }
        .how { padding-top: 48px; }
        .hiw-flow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
        }
        .hiw-community,
        .hiw-capability { width: 100%; }
        .hiw-community,
        .hiw-globe-stage,
        .hiw-compute,
        .hiw-capability {
          grid-column: auto;
          grid-row: auto;
        }
        .hiw-globe-stage {
          width: min(320px, 82vw);
          flex: 0 0 auto;
          align-self: center;
        }
        .hiw-member-grid { gap: 7px; }
        .hiw-nav { display: none; }
        .hiw-strip { flex-direction: column; align-items: flex-start; gap: 18px; }
        .hiw-strip-item,
        .hiw-strip-item:last-child { padding-right: 0; }
        .hiw-strip-item::after { display: none; }
        .cta-card { padding: 36px 24px; }
        .cta-lines { justify-self: start; }
        .footer-bottom { flex-direction: column; }
      }
      @media (max-width: 560px) {
        :root { --wrap: min(100% - 26px, 375px); }
        .nav { padding: 0 16px; }
      }
    </style>
  </head>
  <body>
    <header class="topbar" id="topbar">
      <nav class="nav" aria-label="Primary">
        <a class="brand" href="../" aria-label="Nodara home">${logo()}<span>Nodara</span></a>
        <div class="links" aria-label="Sections">
          <a href="../atlas/">Atlas</a>
          <a href="../compute/">Compute</a>
          <a href="./" aria-current="page">Network</a>
          <a href="../developers/">Developers</a>
        </div>
        <div class="actions">
          <a class="btn ghost" href="../public/docs/">Sign in</a>
          <a class="btn primary" href="../public/install/">Get started</a>
        </div>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg><span>Menu</span></button>
      </nav>
      <div class="mobile-menu" id="mobile-menu"><a href="../atlas/">Atlas</a><a href="../compute/">Compute</a><a href="./" aria-current="page">Network</a><a href="../developers/">Developers</a><a href="../public/docs/">Sign in</a><a class="mobile-primary" href="../public/install/">Get started</a></div>
    </header>
    <script>
      (function () {
        var topbar = document.getElementById("topbar");
        if (!topbar) return;
        var menuToggle = topbar.querySelector(".menu-toggle");
        var mobileMenu = topbar.querySelector(".mobile-menu");
        function setMenuOpen(open) {
          topbar.classList.toggle("is-menu-open", open);
          menuToggle.setAttribute("aria-expanded", String(open));
        }
        menuToggle.addEventListener("click", function () { setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true"); });
        topbar.querySelectorAll(".mobile-menu a").forEach(function (link) { link.addEventListener("click", function () { setMenuOpen(false); }); });
        document.addEventListener("pointerdown", function (event) { if (!menuToggle.contains(event.target) && !mobileMenu.contains(event.target)) setMenuOpen(false); });
        document.addEventListener("keydown", function (event) { if (event.key === "Escape") { setMenuOpen(false); menuToggle.focus(); } });
        function updateTopbar() {
          topbar.classList.toggle("is-scrolled", window.scrollY > 16);
        }
        updateTopbar();
        window.addEventListener("scroll", updateTopbar, { passive: true });
      })();
    </script>
    <main>
      <section class="section hero" aria-labelledby="network-title">
        <div class="wrap">
          <div>
            <span class="eyebrow">Nodara Network</span>
            <h1 id="network-title">A global network for a <span>brighter tomorrow.</span></h1>
            <p class="lead">A decentralized network of people, compute and ideas - powering a more open, accessible and intelligent future.</p>
            <div class="hero-buttons">
              <a class="btn primary" href="../public/install/">Join the network</a>
              <a class="btn ghost" href="#global-map">Explore the map</a>
            </div>
            <div class="mini-features">
              <div class="mini-feature"><span class="round-icon">${siteIcon("users")}</span><span><b>Real people</b>around the world</span></div>
              <div class="mini-feature"><span class="round-icon">${siteIcon("cpu")}</span><span><b>Decentralized</b>compute resources</span></div>
              <div class="mini-feature"><span class="round-icon">${siteIcon("box")}</span><span><b>A more open</b>AI ecosystem</span></div>
            </div>
          </div>
          <div class="globe-stage" aria-hidden="true">
            <div class="planet">
              <svg class="planet-lines" viewBox="0 0 720 720">
                <path d="M77 360C167 184 301 95 479 78C602 111 676 205 690 360C661 517 557 621 388 681C226 641 123 534 77 360Z" />
                <path d="M91 255C253 342 401 352 676 219" />
                <path d="M100 456C284 350 480 371 674 503" />
                <path d="M361 48C254 196 224 368 307 670" />
                <path d="M507 85C389 219 341 422 445 646" />
                <path d="M82 360C229 292 382 282 680 357" />
                <circle cx="126" cy="312" r="5" /><circle cx="209" cy="234" r="4" /><circle cx="302" cy="292" r="6" /><circle cx="372" cy="179" r="5" /><circle cx="466" cy="242" r="6" /><circle cx="563" cy="334" r="5" /><circle cx="612" cy="448" r="7" /><circle cx="392" cy="532" r="5" /><circle cx="250" cy="471" r="4" />
              </svg>
            </div>
            <aside class="stats-card">
              <span class="online">Live Network</span>
              <strong>12,489</strong>
              <dl>
                <div><dd>190</dd><dt>countries</dt></div>
                <div><dd>1.2M</dd><dt>compute hours/month</dt></div>
                <div><dd>99.9%</dd><dt>network availability</dt></div>
              </dl>
            </aside>
            <div class="callout">A developer in Singapore is running a model</div>
            <div class="vertical-tag">Real people.<br />Real compute.<br />A brighter tomorrow.</div>
          </div>
        </div>
      </section>
      <section class="section metric-rail" aria-label="Network statistics">
        <div class="metric-grid">
          ${statItems
            .map(
              ([icon, value, label]) =>
                `<div class="metric"><span class="round-icon">${siteIcon(icon)}</span><span><b>${value}</b><span>${label}</span></span></div>`,
            )
            .join("")}
        </div>
      </section>
      <section class="section community" id="global-map" aria-labelledby="community-title">
        <div class="wrap">
          <div>
            <span class="eyebrow">A truly global community</span>
            <h2 id="community-title">People power<br />intelligence.</h2>
            <p>From developers and researchers to businesses and everyday users, Nodara connects a global community contributing compute, knowledge and real-world impact.</p>
            <a class="btn primary" href="#activity">Explore the global map <span aria-hidden="true">&rarr;</span></a>
          </div>
          <div class="map-wrap" role="group" aria-label="Global Nodara network map showing active community and compute locations.">
            <div class="map-plane">
              <picture>
                <source media="(max-width: 600px)" srcset="../assets/network-world-map-transparent-mobile.webp" />
                <source media="(max-width: 1020px)" srcset="../assets/network-world-map-transparent-tablet.webp" />
                <img class="world-map" src="../assets/network-world-map-transparent-desktop.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
              </picture>
              <svg class="map-arcs" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M24 30 C 32 18 42 24 46.4 30.8 C 51 35 56 37 61.5 45.5 C 66 50 70 55 74.5 61.2 C 78 67 82 71 82.5 73.3" />
                <path d="M20.5 38.2 C 23 33 25 35 26.5 36.7 C 34 44 37 56 37 65.1 C 50 54 62 47 74.5 61.2" />
                <path d="M46.4 30.8 C 48.5 28.5 50.6 29.1 51.1 29.4 C 62 23 74 28 80.3 39" />
                <path d="M74.5 61.2 C 78 67 82.5 73.3 82.5 73.3 C 85 76 87.5 78 89.3 79" />
                <circle class="arc-dot-one" cx="0" cy="0" r="3" />
                <circle class="arc-dot-two" cx="0" cy="0" r="3" />
              </svg>
              ${networkLocations
                .map(
                  (location) =>
                    `<button class="map-point${location.selected ? " is-selected" : ""}" style="--x: ${location.x}%; --y: ${location.y}%;" type="button" aria-label="${location.city}, ${location.country}. ${location.type}. ${location.active}."><span class="point-tip"><b>${location.city}, ${location.country}</b>${location.type}<br />${location.active}</span></button>`,
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>
      <section class="section how" aria-labelledby="how-title" id="how-it-works">
        <div class="wrap">
          <div class="centered-copy">
            <span class="eyebrow">How it works</span>
            <h2 id="how-title">A more <span>open, connected</span> way to build.</h2>
            <p>Nodara connects people, devices and compute resources across the world, making AI more accessible, resilient and impactful.</p>
          </div>
          <div class="hiw-flow" id="hiwFlow" aria-label="How a local Nodara community connects into the global network and powers distributed compute">
            <svg class="hiw-connectors" viewBox="0 0 1650 580" preserveAspectRatio="none" aria-hidden="true">
              ${hiwConnectorMarkup(hiwConnectorsA)}
              ${hiwConnectorMarkup(hiwConnectorsB)}
              ${hiwConnectorMarkup(hiwConnectorsC)}
            </svg>
            <svg class="hiw-responsive-connectors" id="hiwResponsiveConnectors" aria-hidden="true"></svg>

            <div class="hiw-community" id="hiwCommunity">
              <button class="hiw-nav prev" type="button" aria-label="Previous community" id="hiwPrev">&lsaquo;</button>
              <button class="hiw-nav next" type="button" aria-label="Next community" id="hiwNext">&rsaquo;</button>
              <div class="hiw-community-head">
                <div class="hiw-community-loc">
                  ${siteIcon("pin")}
                  <div>
                    <h3 class="hiw-city" id="hiwCity">${hiwFirst.city}, ${hiwFirst.country}</h3>
                    <p class="hiw-sub" id="hiwSub">${hiwFirst.online} community members online</p>
                  </div>
                </div>
                <div class="hiw-live"><span class="dot"></span>Live</div>
              </div>
              <div class="hiw-member-grid" id="hiwMemberGrid">
            ${hiwMemberSlots}
              </div>
              <div class="hiw-dots" id="hiwDots">${hiwDotsHtml}</div>
              <div class="hiw-stats">
                <div><b id="hiwOnline">${hiwFirst.online}</b><span>Online now</span></div>
                <div><b id="hiwMembers">${hiwFormatK(hiwFirst.members)}</b><span>Total members</span></div>
                <div><b id="hiwDevices">${hiwFirst.devices}</b><span>Compute devices</span></div>
              </div>
            </div>

            <div class="hiw-globe-stage" id="hiwGlobeStage">
              <div class="hiw-globe-fallback" id="hiwGlobeFallback"></div>
              <canvas class="hiw-globe-canvas" id="hiwGlobeCanvas" aria-hidden="true"></canvas>
              <svg class="hiw-tag-lines" id="hiwTagLines" aria-hidden="true"></svg>
              ${hiwTagsHtml}
              <div class="hiw-globe-core">
                ${logo()}
                <b>Nodara <span>Network</span></b>
                <p>A global community<br />powering AI together</p>
              </div>
            </div>

            <div class="hiw-compute">
              <div class="hiw-server"><span class="led"></span><span class="slots"><span></span><span></span><span></span></span></div>
              <div class="hiw-server"><span class="led"></span><span class="slots"><span></span><span></span><span></span></span></div>
              <div class="hiw-server"><span class="led"></span><span class="slots"><span></span><span></span><span></span></span></div>
              <div class="hiw-compute-label">Distributed<br />Compute Nodes</div>
            </div>

            <div class="hiw-capability">
              <div class="hiw-cap-row" id="hiwCapAi"><span class="round-icon">${siteIcon("cpu")}</span><div><b>AI Models</b><span>Run and fine-tune AI</span></div></div>
              <div class="hiw-cap-row" id="hiwCapCompute"><span class="round-icon">${siteIcon("database")}</span><div><b>Compute Nodes</b><span>Community-powered</span></div></div>
              <div class="hiw-cap-row" id="hiwCapWorkloads"><span class="round-icon">${siteIcon("box")}</span><div><b>Your Workloads</b><span>Build, research, create</span></div></div>
            </div>
          </div>

          <div class="hiw-strip">
            <div class="hiw-strip-item"><span class="round-icon">${siteIcon("users")}</span><div><b>Real people</b><span>Around the world</span></div></div>
            <div class="hiw-strip-item"><span class="round-icon">${siteIcon("globe")}</span><div><b>Shared resources</b><span>A stronger AI ecosystem</span></div></div>
            <div class="hiw-strip-item"><span class="round-icon">${siteIcon("spark")}</span><div><b>A brighter tomorrow</b><span>More open. More possible.</span></div></div>
          </div>
        </div>
      </section>
      <section class="section activity" id="activity" aria-labelledby="activity-title">
        <div class="wrap">
          <div class="activity-copy">
            <span class="eyebrow">Real-time activity</span>
            <h2 id="activity-title">A living, global network.</h2>
            <p>See the network in action. Every dot represents a real user or compute node contributing to a more open AI future.</p>
          </div>
          <div class="activity-list">
            <div class="activity-title">Live activity</div>
            ${activityItems
              .map(
                ([tone, text, time]) =>
                  `<div class="activity-row"><span class="dot ${tone}"></span><span>${text}</span><time>${time}</time></div>`,
              )
              .join("")}
          </div>
        </div>
      </section>
      <section class="section features" aria-labelledby="features-title">
        <div class="wrap">
          <span class="eyebrow">Built for a brighter tomorrow</span>
          <h2 id="features-title">More people. More compute. More possibilities:</h2>
          <div class="feature-grid">
            <div class="feature-card"><span class="round-icon">${siteIcon("users")}</span><h3>Global access</h3><p>AI for everyone, everywhere.</p></div>
            <div class="feature-card"><span class="round-icon">${siteIcon("box")}</span><h3>Decentralized compute</h3><p>A resilient and independent network.</p></div>
            <div class="feature-card"><span class="round-icon">${siteIcon("shield")}</span><h3>Your data, your control</h3><p>Private, secure and transparent.</p></div>
            <div class="feature-card"><span class="round-icon">${siteIcon("leaf")}</span><h3>Real-world impact</h3><p>Powering innovation for a brighter tomorrow.</p></div>
          </div>
        </div>
      </section>
      <section class="section cta-band" aria-labelledby="join-title">
        <div class="wrap">
          <div class="cta-card" data-bg-name="network-cta-mountains">
            <div>
              <span class="eyebrow">Be part of the network</span>
              <h2 id="join-title">Join a global community shaping the future of AI.</h2>
              <div class="cta-actions">
                <a class="btn primary" href="../public/install/">Get started</a>
                <a class="btn ghost" href="../public/docs/">Learn more</a>
              </div>
            </div>
            <div class="cta-lines">A more open<br />A more accessible<br />A brighter tomorrow.</div>
          </div>
        </div>
      </section>
    </main>
    <footer class="site-footer">
      <div class="footer-main">
        <a class="brand" href="../" aria-label="Nodara home">${logo()}<span>Nodara<small>A better tomorrow</small></span></a>
        <div class="footer-col"><h3>Product</h3><a href="../public/docs/">Features</a><a href="../public/install/">Pricing</a><a href="../docs/install/">Roadmap</a></div>
        <div class="footer-col"><h3>Network</h3><a href="#global-map">Global Map</a><a href="#activity">Network Stats</a><a href="#how-title">How it Works</a></div>
        <div class="footer-col"><h3>Developers</h3><a href="../docs/">Docs</a><a href="../public/release/">API</a><a href="../docs/device-identity/">Integrations</a></div>
        <div class="footer-col"><h3>Company</h3><a href="../docs/device-identity/">About</a><a href="../public/docs/">Careers</a><a href="../public/docs/">Contact</a></div>
        <div class="social" aria-label="Social links">
          <a href="../public/docs/" aria-label="GitHub">${siteIcon("github")}</a>
          <a href="../public/docs/" aria-label="Community">${siteIcon("discord")}</a>
          <a href="../public/docs/" aria-label="LinkedIn">${siteIcon("linkedin")}</a>
          <a href="../public/docs/" aria-label="X">${siteIcon("x")}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 Nodara. All rights reserved.</span>
        <span class="legal"><a href="../public/docs/">Privacy</a><a href="../public/docs/">Terms</a><a href="../public/docs/">Cookies</a></span>
      </div>
    </footer>
    <script>
      (function () {
        var LOCATIONS = ${JSON.stringify(hiwLocationsForClient)};
        var DEVICE_ICONS = ${JSON.stringify(hiwIconMap)};
        var HUES = ${JSON.stringify(hiwAvatarHues())};
        var flow = document.getElementById("hiwFlow");
        if (!flow) return;

        var responsiveConnectors = document.getElementById("hiwResponsiveConnectors");
        var community = document.getElementById("hiwCommunity");
        var globeStage = document.getElementById("hiwGlobeStage");
        var compute = flow.querySelector(".hiw-compute");
        var capability = flow.querySelector(".hiw-capability");

        function updateResponsiveConnectors() {
          if (!responsiveConnectors || getComputedStyle(responsiveConnectors).display === "none") return;
          var flowRect = flow.getBoundingClientRect();
          if (!flowRect.width || !flowRect.height) return;

          function bounds(element) {
            var rect = element.getBoundingClientRect();
            return {
              left: rect.left - flowRect.left,
              right: rect.right - flowRect.left,
              top: rect.top - flowRect.top,
              bottom: rect.bottom - flowRect.top,
              centerX: rect.left - flowRect.left + rect.width / 2,
              centerY: rect.top - flowRect.top + rect.height / 2,
            };
          }

          var cardBox = bounds(community);
          var globeBox = bounds(globeStage);
          var computeBox = bounds(compute);
          var capabilityBox = bounds(capability);
          var globeInset = (globeBox.right - globeBox.left) * 0.14;
          var globeVisual = {
            left: globeBox.left + globeInset,
            right: globeBox.right - globeInset,
            top: globeBox.top + globeInset,
            bottom: globeBox.bottom - globeInset,
            centerX: globeBox.centerX,
            centerY: globeBox.centerY,
          };
          var mobile = window.matchMedia("(max-width: 760px)").matches;
          var links;

          if (mobile) {
            links = [
              [[cardBox.centerX, cardBox.bottom], [globeVisual.centerX, globeVisual.top]],
              [[globeVisual.centerX, globeVisual.bottom], [computeBox.centerX, computeBox.top]],
              [[computeBox.centerX, computeBox.bottom], [capabilityBox.centerX, capabilityBox.top]],
            ];
          } else {
            var firstMidX = (cardBox.right + globeVisual.left) / 2;
            var secondMidY = (globeVisual.bottom + computeBox.top) / 2;
            var thirdMidX = (computeBox.right + capabilityBox.left) / 2;
            links = [
              [[cardBox.right, cardBox.centerY], [firstMidX, cardBox.centerY], [firstMidX, globeVisual.centerY], [globeVisual.left, globeVisual.centerY]],
              [[globeVisual.centerX, globeVisual.bottom], [globeVisual.centerX, secondMidY], [computeBox.centerX, secondMidY], [computeBox.centerX, computeBox.top]],
              [[computeBox.right, computeBox.centerY], [thirdMidX, computeBox.centerY], [thirdMidX, capabilityBox.centerY], [capabilityBox.left, capabilityBox.centerY]],
            ];
          }

          function pathData(points) {
            return points.map(function (point, index) {
              return (index ? "L" : "M") + point[0].toFixed(1) + " " + point[1].toFixed(1);
            }).join(" ");
          }

          responsiveConnectors.setAttribute("viewBox", "0 0 " + flowRect.width + " " + flowRect.height);
          responsiveConnectors.innerHTML = links.map(function (points) {
            var d = pathData(points);
            var start = points[0];
            var end = points[points.length - 1];
            return '<path class="hiw-responsive-link" d="' + d + '" />' +
              '<path class="hiw-responsive-link-signal" d="' + d + '" />' +
              '<circle class="hiw-responsive-port" cx="' + start[0].toFixed(1) + '" cy="' + start[1].toFixed(1) + '" r="3.5" />' +
              '<circle class="hiw-responsive-port" cx="' + end[0].toFixed(1) + '" cy="' + end[1].toFixed(1) + '" r="3.5" />';
          }).join("");
        }

        updateResponsiveConnectors();
        if (typeof ResizeObserver !== "undefined") {
          new ResizeObserver(updateResponsiveConnectors).observe(flow);
        } else {
          window.addEventListener("resize", updateResponsiveConnectors);
        }

        var cityEl = document.getElementById("hiwCity");
        var subEl = document.getElementById("hiwSub");
        var grid = document.getElementById("hiwMemberGrid");
        var members = grid ? Array.prototype.slice.call(grid.children) : [];
        var dotsWrap = document.getElementById("hiwDots");
        var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];
        var onlineEl = document.getElementById("hiwOnline");
        var membersEl = document.getElementById("hiwMembers");
        var devicesEl = document.getElementById("hiwDevices");
        var tags = Array.prototype.slice.call(flow.querySelectorAll(".hiw-tag"));
        var capRows = [document.getElementById("hiwCapAi"), document.getElementById("hiwCapCompute"), document.getElementById("hiwCapWorkloads")];

        var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var index = 0;
        var timer = null;
        var eventTimer = null;
        var visible = true;

        function deviceIconSvg(type) {
          var body = DEVICE_ICONS[type] || DEVICE_ICONS.laptop;
          return '<svg viewBox="0 0 32 32" aria-hidden="true">' + body + "</svg>";
        }

        function personAvatar() {
          return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4" fill="currentColor" stroke="none" opacity="0.92"/><path d="M4 20.5c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" stroke="none" opacity="0.92"/></svg>';
        }

        function countTo(el, target) {
          var start = parseInt((el.textContent || "0").replace(/[^0-9]/g, ""), 10) || 0;
          if (reduced || start === target) {
            el.textContent = String(target);
            return;
          }
          var t0 = performance.now();
          var dur = 650;
          function step(now) {
            var p = Math.min(1, (now - t0) / dur);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(start + (target - start) * eased));
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }

        function applyLocation(loc, animate) {
          if (cityEl) cityEl.textContent = loc.city + ", " + loc.country;
          if (subEl) subEl.textContent = loc.online + " community members online";
          if (onlineEl) countTo(onlineEl, loc.online);
          if (membersEl) membersEl.textContent = loc.members;
          if (devicesEl) devicesEl.textContent = String(loc.devices);
          dots.forEach(function (d, i) {
            d.classList.toggle("is-active", i === index);
          });
          tags.forEach(function (tag) {
            var isMatch = tag.getAttribute("data-city") === loc.city;
            tag.classList.toggle("is-active", isMatch);
          });
          members.forEach(function (card, i) {
            var type = loc.devicesOrder[i % loc.devicesOrder.length];
            var hue = HUES[i % HUES.length];
            var avatar = card.querySelector(".hiw-avatar");
            var device = card.querySelector(".hiw-device");
            if (avatar) {
              avatar.style.setProperty("--hue", hue);
              avatar.innerHTML = personAvatar();
            }
            if (device) device.innerHTML = deviceIconSvg(type);
            if (animate && !reduced) {
              card.style.transitionDelay = i * 60 + "ms";
              requestAnimationFrame(function () {
                card.classList.remove("is-hidden");
              });
            }
          });
        }

        function goTo(nextIndex) {
          index = ((nextIndex % LOCATIONS.length) + LOCATIONS.length) % LOCATIONS.length;
          var loc = LOCATIONS[index];
          if (reduced) {
            applyLocation(loc, false);
            return;
          }
          members.forEach(function (card) {
            card.style.transitionDelay = "0ms";
            card.classList.add("is-hidden");
          });
          setTimeout(function () {
            applyLocation(loc, true);
          }, 400);
        }

        function scheduleAuto() {
          if (timer) clearInterval(timer);
          if (reduced || !visible) return;
          timer = setInterval(function () {
            goTo(index + 1);
          }, 10000);
        }

        function scheduleEvent() {
          if (eventTimer) clearTimeout(eventTimer);
          if (reduced || !visible) return;
          var delay = 7000 + Math.random() * 6000;
          eventTimer = setTimeout(function () {
            runEvent();
            scheduleEvent();
          }, delay);
        }

        function runEvent() {
          var row = capRows[Math.floor(Math.random() * capRows.length)];
          if (!row) return;
          row.classList.add("is-pulsing");
          setTimeout(function () {
            row.classList.remove("is-pulsing");
          }, 850);
        }

        var prevBtn = document.getElementById("hiwPrev");
        var nextBtn = document.getElementById("hiwNext");
        if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); scheduleAuto(); });
        if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); scheduleAuto(); });
        dots.forEach(function (dot, i) {
          dot.addEventListener("click", function () { goTo(i); scheduleAuto(); });
        });

        if ("IntersectionObserver" in window) {
          var observer = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                visible = entry.isIntersecting;
                if (visible) {
                  scheduleAuto();
                  scheduleEvent();
                } else {
                  if (timer) clearInterval(timer);
                  if (eventTimer) clearTimeout(eventTimer);
                }
              });
            },
            { threshold: 0.15 },
          );
          observer.observe(flow);
        } else {
          scheduleAuto();
          scheduleEvent();
        }
      })();
    </script>
    <script type="module">
      (function () {
        var stage = document.getElementById("hiwGlobeStage");
        var canvas = document.getElementById("hiwGlobeCanvas");
        var fallback = document.getElementById("hiwGlobeFallback");
        if (!stage || !canvas) return;
        var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var LABELED = ${JSON.stringify(hiwTags)};
        var AMBIENT = ${JSON.stringify(hiwAmbientNodes)};
        var ROUTES = ${JSON.stringify(hiwRoutes)};
        var tagElements = Array.prototype.slice.call(document.querySelectorAll(".hiw-tag"));

        function showFallback() {
          if (fallback) {
            fallback.classList.remove("is-loading");
            fallback.classList.add("is-visible");
          }
        }

        function showLoading() {
          if (fallback) fallback.classList.add("is-visible", "is-loading");
        }

        function hideLoading() {
          if (fallback) fallback.classList.remove("is-visible", "is-loading");
        }

        function loadGlobe() {
          showLoading();
          var settled = false;
          var loadTimeout = setTimeout(function () {
            if (settled) return;
            settled = true;
            console.warn("[hiw-globe] timed out waiting for three.js / globe init");
            showFallback();
          }, 9000);
          import("../assets/three.module.min.js")
            .then(function (THREE) {
              if (settled) return;
              try {
                initGlobe(THREE);
                settled = true;
                clearTimeout(loadTimeout);
              } catch (err) {
                settled = true;
                clearTimeout(loadTimeout);
                console.warn("[hiw-globe] initGlobe failed:", err);
                showFallback();
              }
            })
            .catch(function (err) {
              if (settled) return;
              settled = true;
              clearTimeout(loadTimeout);
              console.warn("[hiw-globe] failed to load three.js:", err);
              showFallback();
            });
        }

        if ("IntersectionObserver" in window) {
          var loadObserver = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                  loadObserver.disconnect();
                  loadGlobe();
                }
              });
            },
            { rootMargin: "600px 0px" },
          );
          loadObserver.observe(stage);
        } else {
          loadGlobe();
        }

        function initGlobe(THREE) {
          var density = window.innerWidth < 760 ? 0.4 : window.innerWidth < 1180 ? 0.7 : 1;

          var CONTINENTS = [
            { base: 1300, poly: [[-165,68],[-140,70],[-100,72],[-80,62],[-95,50],[-80,45],[-75,35],[-80,25],[-97,18],[-105,20],[-115,30],[-124,40],[-124,48],[-130,55],[-165,68]] },
            { base: 820, poly: [[-80,10],[-77,0],[-70,-5],[-70,-18],[-63,-30],[-58,-35],[-65,-45],[-70,-55],[-68,-52],[-62,-40],[-48,-25],[-35,-8],[-50,2],[-60,8],[-80,10]] },
            { base: 560, poly: [[-10,36],[-9,44],[2,51],[10,54],[20,55],[30,60],[40,65],[35,55],[28,45],[20,40],[15,38],[5,38],[-5,36],[-10,36]] },
            { base: 980, poly: [[-17,15],[-10,5],[10,4],[15,-5],[20,-15],[25,-25],[30,-30],[35,-25],[38,-10],[45,0],[42,10],[38,15],[30,22],[15,30],[0,32],[-10,25],[-17,15]] },
            { base: 1300, poly: [[30,45],[40,40],[50,30],[60,25],[70,20],[80,15],[95,5],[105,0],[110,10],[120,20],[125,30],[135,35],[140,42],[135,50],[120,55],[100,60],[80,60],[60,55],[45,50],[30,45]] },
            { base: 330, poly: [[113,-22],[120,-18],[135,-12],[145,-16],[153,-28],[150,-38],[140,-38],[130,-32],[115,-33],[113,-22]] },
          ];

          function pointInPolygon(lon, lat, poly) {
            var inside = false;
            for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
              var xi = poly[i][0], yi = poly[i][1];
              var xj = poly[j][0], yj = poly[j][1];
              var intersect = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
              if (intersect) inside = !inside;
            }
            return inside;
          }

          function polyBBox(poly) {
            var minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
            poly.forEach(function (p) {
              if (p[0] < minLon) minLon = p[0];
              if (p[0] > maxLon) maxLon = p[0];
              if (p[1] < minLat) minLat = p[1];
              if (p[1] > maxLat) maxLat = p[1];
            });
            return [minLon, maxLon, minLat, maxLat];
          }

          function llToVec3(lat, lon, r) {
            var phi = ((90 - lat) * Math.PI) / 180;
            var theta = ((lon + 180) * Math.PI) / 180;
            var x = -r * Math.sin(phi) * Math.cos(theta);
            var z = r * Math.sin(phi) * Math.sin(theta);
            var y = r * Math.cos(phi);
            return [x, y, z];
          }

          var PALETTE = [
            [40 / 255, 199 / 255, 246 / 255, 0.2],
            [57 / 255, 213 / 255, 255 / 255, 0.35],
            [120 / 255, 231 / 255, 255 / 255, 0.45],
          ];
          function pickColor() {
            var r = Math.random();
            if (r < 0.55) return PALETTE[0];
            if (r < 0.88) return PALETTE[1];
            return PALETTE[2];
          }

          function buildContinentData() {
            var positions = [];
            var colors = [];
            var sizes = [];
            var opac = [];
            var flick = [];
            var phase = [];
            var mesh = [];
            CONTINENTS.forEach(function (c) {
              var target = Math.max(30, Math.round(c.base * density));
              var bbox = polyBBox(c.poly);
              var pts = [];
              var attempts = 0;
              while (pts.length < target && attempts < target * 40) {
                attempts++;
                var lon = bbox[0] + Math.random() * (bbox[1] - bbox[0]);
                var lat = bbox[2] + Math.random() * (bbox[3] - bbox[2]);
                if (pointInPolygon(lon, lat, c.poly)) pts.push([lon, lat]);
              }
              pts.forEach(function (p, idx) {
                var v = llToVec3(p[1], p[0], 1);
                positions.push(v[0], v[1], v[2]);
                var col = pickColor();
                colors.push(col[0], col[1], col[2]);
                sizes.push(0.9 + Math.random() * 1.3);
                opac.push(col[3] * (1.2 + Math.random() * 0.5));
                flick.push(0.0);
                phase.push(Math.random() * Math.PI * 2);
                if (idx % 3 === 0 && idx + 2 < pts.length) {
                  var q = pts[idx + 2];
                  var dLon = q[0] - p[0], dLat = q[1] - p[1];
                  if (Math.sqrt(dLon * dLon + dLat * dLat) < 4.5) {
                    var v2 = llToVec3(q[1], q[0], 1);
                    mesh.push(v[0], v[1], v[2], v2[0], v2[1], v2[2]);
                  }
                }
              });
            });
            return { positions: positions, colors: colors, sizes: sizes, opac: opac, flick: flick, phase: phase, mesh: mesh };
          }

          function makeRadialTexture(inner, outer, size) {
            var c = document.createElement("canvas");
            c.width = c.height = size;
            var ctx = c.getContext("2d");
            var g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
            g.addColorStop(0, inner);
            g.addColorStop(1, outer);
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, size, size);
            var tex = new THREE.CanvasTexture(c);
            tex.needsUpdate = true;
            return tex;
          }
          var scene = new THREE.Scene();
          var camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
          camera.position.set(0, 0, 4.55);

          var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
          renderer.setClearColor(0x000000, 0);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

          canvas.addEventListener("webglcontextlost", function (event) {
            event.preventDefault();
            console.warn("[hiw-globe] WebGL context lost; showing static fallback");
            running = false;
            showFallback();
          });

          var earthGroup = new THREE.Group();
          earthGroup.rotation.y = -0.6;
          var outerGroup = new THREE.Group();
          outerGroup.rotation.x = 0.2;
          outerGroup.rotation.z = -0.1;
          scene.add(earthGroup, outerGroup);

          function resize() {
            var w = stage.clientWidth, h = stage.clientHeight;
            if (!w || !h) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
          }
          resize();
          if (typeof ResizeObserver !== "undefined") {
            new ResizeObserver(resize).observe(stage);
          } else {
            window.addEventListener("resize", resize);
          }

          var earthMat = new THREE.ShaderMaterial({
            uniforms: {
              uColorA: { value: new THREE.Color(0x02101b) },
              uColorB: { value: new THREE.Color(0x0a3550) },
            },
            vertexShader: [
              "varying vec3 vNormal;",
              "void main() {",
              "  vNormal = normalize(normalMatrix * normal);",
              "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
              "}",
            ].join("\\n"),
            fragmentShader: [
              "uniform vec3 uColorA;",
              "uniform vec3 uColorB;",
              "varying vec3 vNormal;",
              "void main() {",
              "  vec3 lightDir = normalize(vec3(-0.6, 0.5, 0.65));",
              "  float lit = max(dot(vNormal, lightDir), 0.0);",
              "  float fres = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);",
              "  vec3 col = mix(uColorA, uColorB, lit * 0.5 + fres * 0.25);",
              "  gl_FragColor = vec4(col, 1.0);",
              "}",
            ].join("\\n"),
          });
          var earthMesh = new THREE.Mesh(new THREE.SphereGeometry(0.985, 48, 48), earthMat);
          earthGroup.add(earthMesh);

          var atmoShader = {
            vertexShader: [
              "varying vec3 vNormal;",
              "varying vec3 vViewDir;",
              "void main() {",
              "  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
              "  vNormal = normalize(normalMatrix * normal);",
              "  vViewDir = normalize(-mvPosition.xyz);",
              "  gl_Position = projectionMatrix * mvPosition;",
              "}",
            ].join("\\n"),
            fragmentShader: [
              "uniform float uIntensity;",
              "varying vec3 vNormal;",
              "varying vec3 vViewDir;",
              "void main() {",
              "  float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 4.2);",
              "  vec3 col = mix(vec3(0.11, 0.75, 0.94), vec3(0.48, 0.91, 1.0), rim);",
              "  gl_FragColor = vec4(col, rim * uIntensity);",
              "}",
            ].join("\\n"),
          };
          var atmoMat = new THREE.ShaderMaterial({
            uniforms: { uIntensity: { value: 0.8 } },
            vertexShader: atmoShader.vertexShader,
            fragmentShader: atmoShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
          });
          var atmoOuterMat = new THREE.ShaderMaterial({
            uniforms: { uIntensity: { value: 0.16 } },
            vertexShader: atmoShader.vertexShader,
            fragmentShader: atmoShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
          });
          earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.02, 48, 48), atmoMat));
          earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.045, 32, 32), atmoOuterMat));

          var pointsData = buildContinentData();
          var pointsGeo = new THREE.BufferGeometry();
          pointsGeo.setAttribute("position", new THREE.Float32BufferAttribute(pointsData.positions, 3));
          pointsGeo.setAttribute("aColor", new THREE.Float32BufferAttribute(pointsData.colors, 3));
          pointsGeo.setAttribute("aSize", new THREE.Float32BufferAttribute(pointsData.sizes, 1));
          pointsGeo.setAttribute("aOpacity", new THREE.Float32BufferAttribute(pointsData.opac, 1));
          pointsGeo.setAttribute("aFlicker", new THREE.Float32BufferAttribute(pointsData.flick, 1));
          pointsGeo.setAttribute("aPhase", new THREE.Float32BufferAttribute(pointsData.phase, 1));
          var pointsMaterial = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            transparent: true,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending,
            vertexShader: [
              "attribute vec3 aColor;",
              "attribute float aSize;",
              "attribute float aOpacity;",
              "attribute float aFlicker;",
              "attribute float aPhase;",
              "uniform float uTime;",
              "varying float vOpacity;",
              "varying vec3 vColor;",
              "void main() {",
              "  vColor = aColor;",
              "  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
              "  vOpacity = aOpacity;",
              "  gl_PointSize = aSize * (5.5 / -mvPosition.z);",
              "  gl_Position = projectionMatrix * mvPosition;",
              "}",
            ].join("\\n"),
            fragmentShader: [
              "precision mediump float;",
              "varying float vOpacity;",
              "varying vec3 vColor;",
              "void main() {",
              "  vec2 uv = gl_PointCoord - vec2(0.5);",
              "  float d = length(uv);",
              "  if (d > 0.5) discard;",
              "  float alpha = smoothstep(0.5, 0.0, d) * vOpacity;",
              "  gl_FragColor = vec4(vColor, alpha);",
              "}",
            ].join("\\n"),
          });
          earthGroup.add(new THREE.Points(pointsGeo, pointsMaterial));

          var meshGeo = new THREE.BufferGeometry();
          meshGeo.setAttribute("position", new THREE.Float32BufferAttribute(pointsData.mesh, 3));
          var meshMat = new THREE.LineBasicMaterial({ color: 0x1caee2, transparent: true, opacity: 0.14, depthWrite: false });
          earthGroup.add(new THREE.LineSegments(meshGeo, meshMat));

          var haloTex = makeRadialTexture("rgba(56,214,255,0.9)", "rgba(56,214,255,0)", 128);
          var coreTex = makeRadialTexture("rgba(255,255,255,1)", "rgba(231,252,255,0)", 64);

          function createNode(n) {
            var p = llToVec3(n.lat, n.lon, 1.002);
            var group = new THREE.Group();
            group.position.set(p[0], p[1], p[2]);
            var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.36 }));
            halo.scale.set(0.16, 0.16, 1);
            var core = new THREE.Sprite(new THREE.SpriteMaterial({ map: coreTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.88 }));
            core.scale.set(0.045, 0.045, 1);
            group.add(halo, core);
            earthGroup.add(group);
            return { city: n.city, group: group, halo: halo, core: core, phase: Math.random() * Math.PI * 2 };
          }

          var nodeByName = {};
          LABELED.concat(AMBIENT).forEach(function (n) {
            nodeByName[n.city] = createNode(n);
          });

          function greatArcCurve(a, b) {
            var pa = llToVec3(a.lat, a.lon, 1);
            var pb = llToVec3(b.lat, b.lon, 1);
            var va = new THREE.Vector3(pa[0], pa[1], pa[2]);
            var vb = new THREE.Vector3(pb[0], pb[1], pb[2]);
            var angle = va.angleTo(vb);
            var mid = va.clone().add(vb).normalize();
            mid.multiplyScalar(1 + 0.08 + angle * 0.1);
            return new THREE.CatmullRomCurve3([va, mid, vb]);
          }

          var arcObjects = [];
          var LABELED_BY_NAME = {};
          LABELED.concat(AMBIENT).forEach(function (n) { LABELED_BY_NAME[n.city] = n; });
          ROUTES.forEach(function (pair) {
            var a = LABELED_BY_NAME[pair[0]];
            var b = LABELED_BY_NAME[pair[1]];
            if (!a || !b) return;
            var curve = greatArcCurve(a, b);
            var geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
            var mat = new THREE.LineBasicMaterial({ color: 0x28c9f5, transparent: true, opacity: 0.16, depthWrite: false });
            var line = new THREE.Line(geo, mat);
            earthGroup.add(line);
            arcObjects.push({ a: nodeByName[pair[0]], b: nodeByName[pair[1]], curve: curve, line: line });
          });

          var PACKET_COUNT = 6;
          var packets = [];
          for (var i = 0; i < PACKET_COUNT; i++) {
            var pMat = new THREE.SpriteMaterial({ map: coreTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
            var pSprite = new THREE.Sprite(pMat);
            pSprite.scale.set(0.035, 0.035, 1);
            earthGroup.add(pSprite);
            packets.push({ sprite: pSprite, arc: null, t: 0, speed: 0, delay: 0, active: false });
          }
          function resetPacket(p, elapsed) {
            if (!arcObjects.length) return;
            p.arc = arcObjects[Math.floor(Math.random() * arcObjects.length)];
            p.t = 0;
            p.speed = 1 / (3000 + Math.random() * 4000);
            p.delay = elapsed + Math.random() * 2500;
            p.active = false;
          }
          packets.forEach(function (p) { resetPacket(p, 0); });

          function updatePackets(elapsed, dtMs) {
            packets.forEach(function (p) {
              if (!p.arc) return;
              if (!p.active) {
                if (elapsed >= p.delay) p.active = true;
                else { p.sprite.material.opacity = 0; return; }
              }
              p.t += p.speed * dtMs;
              if (p.t >= 1) { resetPacket(p, elapsed); p.sprite.material.opacity = 0; return; }
              var pos = p.arc.curve.getPointAt(Math.min(p.t, 1));
              p.sprite.position.copy(pos);
              var fade = Math.sin(Math.PI * Math.min(p.t, 1));
              p.sprite.material.opacity = 0.9 * fade;
            });
          }

          function makeOrbitalLine(radius, tiltX, tiltZ, dashed) {
            var curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.4, 0, Math.PI * 2, false, 0);
            var pts3 = curve.getPoints(96).map(function (p) { return new THREE.Vector3(p.x, 0, p.y); });
            var geo = new THREE.BufferGeometry().setFromPoints(pts3);
            var mat = dashed
              ? new THREE.LineDashedMaterial({ color: 0x1cc2f1, transparent: true, opacity: 0.22, dashSize: 0.05, gapSize: 0.04 })
              : new THREE.LineBasicMaterial({ color: 0x1cc2f1, transparent: true, opacity: 0.16 });
            var line = new THREE.LineLoop(geo, mat);
            if (dashed) line.computeLineDistances();
            line.rotation.x = tiltX;
            line.rotation.z = tiltZ;
            return line;
          }
          outerGroup.add(makeOrbitalLine(1.28, 0.35, 0.15, false));
          outerGroup.add(makeOrbitalLine(1.22, -0.5, 0.6, true));
          outerGroup.add(makeOrbitalLine(1.34, 0.15, -0.4, false));

          var extCount = Math.round(48 * density);
          var extPositions = [];
          for (var j = 0; j < extCount; j++) {
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);
            var r = 1.12 + Math.random() * 0.22;
            extPositions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
          }
          var extGeo = new THREE.BufferGeometry();
          extGeo.setAttribute("position", new THREE.Float32BufferAttribute(extPositions, 3));
          var extMat = new THREE.PointsMaterial({ color: 0x8fe6ff, size: 0.012, transparent: true, opacity: 0.26, depthWrite: false, sizeAttenuation: true });
          outerGroup.add(new THREE.Points(extGeo, extMat));

          var SVG_NS = "http://www.w3.org/2000/svg";
          var linesSvg = document.getElementById("hiwTagLines");
          var tagLines = tagElements.map(function (el, idx) {
            if (!linesSvg) return null;
            var path = document.createElementNS(SVG_NS, "path");
            path.setAttribute("class", "hiw-tag-line");
            var dotA = document.createElementNS(SVG_NS, "circle");
            dotA.setAttribute("class", "hiw-tag-line-dot");
            dotA.setAttribute("r", "2.4");
            var dotB = document.createElementNS(SVG_NS, "circle");
            dotB.setAttribute("class", "hiw-tag-line-dot");
            dotB.setAttribute("r", "2.4");
            linesSvg.appendChild(path);
            linesSvg.appendChild(dotA);
            linesSvg.appendChild(dotB);
            return { path: path, dots: [dotA, dotB], phase: idx * 0.37 };
          });

          var tmpVec = new THREE.Vector3();
          function updateTagProjections(elapsed) {
            var rect = stage.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            if (linesSvg) linesSvg.setAttribute("viewBox", "0 0 " + rect.width + " " + rect.height);
            var cx = rect.width / 2, cy = rect.height / 2;
            tagElements.forEach(function (el, idx) {
              var node = nodeByName[el.getAttribute("data-city")];
              var line = tagLines[idx];
              if (!node) return;
              var worldPos = node.group.getWorldPosition(tmpVec.clone());
              var normal = worldPos.clone().normalize();
              var toCamera = camera.position.clone().sub(worldPos).normalize();
              var facing = normal.dot(toCamera);
              var ndc = worldPos.clone().project(camera);
              var x = (ndc.x * 0.5 + 0.5) * rect.width;
              var y = (1 - (ndc.y * 0.5 + 0.5)) * rect.height;
              var ux = (x - cx) / (rect.width * 0.5 || 1);
              var uy = (y - cy) / (rect.height * 0.5 || 1);
              var uLen = Math.sqrt(ux * ux + uy * uy) || 1;
              ux /= uLen;
              uy /= uLen;
              var pushOut = rect.width * 0.27;
              var lx = x + ux * pushOut;
              var ly = y + uy * pushOut;
              el.style.transform = "translate(" + lx.toFixed(1) + "px," + ly.toFixed(1) + "px)";
              el.style.opacity = facing > 0.08 ? "1" : "0";
              el.classList.toggle("is-left", ux < -0.15);
              el.classList.toggle("is-bottom", uy > 0.25);

              if (!line) return;
              var alpha = Math.max(0, Math.min(1, facing / 0.28));
              if (alpha <= 0.01) {
                line.path.setAttribute("opacity", "0");
                line.dots[0].setAttribute("opacity", "0");
                line.dots[1].setAttribute("opacity", "0");
                return;
              }
              var cardEl = el.querySelector(".hiw-tag-card");
              var cardRect = cardEl ? cardEl.getBoundingClientRect() : null;
              var nearLeft = cardRect ? x <= cardRect.left + cardRect.width / 2 - rect.left : true;
              var endX = cardRect ? (nearLeft ? cardRect.left : cardRect.right) - rect.left : x;
              var endY = cardRect ? cardRect.top - rect.top + cardRect.height / 2 : y;
              var dx = endX - x, dy = endY - y;
              var len = Math.sqrt(dx * dx + dy * dy) || 1;
              var nx = -dy / len, ny = dx / len;
              var midX = (x + endX) / 2, midY = (y + endY) / 2;
              var sign = nx * (midX - cx) + ny * (midY - cy) < 0 ? -1 : 1;
              var bend = Math.min(Math.max(len * 0.16, 10), 34) * sign;
              var ctrlX = midX + nx * bend, ctrlY = midY + ny * bend;
              line.path.setAttribute("d", "M" + x.toFixed(1) + " " + y.toFixed(1) + " Q " + ctrlX.toFixed(1) + " " + ctrlY.toFixed(1) + " " + endX.toFixed(1) + " " + endY.toFixed(1));
              line.path.setAttribute("opacity", (alpha * 0.6).toFixed(2));
              line.dots.forEach(function (dot, dIdx) {
                var t = ((elapsed || 0) * 0.00028 + line.phase + dIdx * 0.5) % 1;
                var mt = 1 - t;
                var px = mt * mt * x + 2 * mt * t * ctrlX + t * t * endX;
                var py = mt * mt * y + 2 * mt * t * ctrlY + t * t * endY;
                dot.setAttribute("cx", px.toFixed(1));
                dot.setAttribute("cy", py.toFixed(1));
                var fade = Math.sin(Math.PI * t);
                dot.setAttribute("opacity", Math.max(0, fade * alpha).toFixed(2));
              });
            });
          }

          function pulseNodes(elapsed) {
            Object.keys(nodeByName).forEach(function (key) {
              var n = nodeByName[key];
              var s = 0.16 * (1 + 0.12 * Math.sin(elapsed * 0.0012 + n.phase));
              n.halo.scale.set(s, s, 1);
            });
          }

          var EARTH_PERIOD = 92;
          var OUTER_PERIOD = 205;
          var clock = new THREE.Clock();
          var running = false;

          function renderFrame(elapsed, dt) {
            if (!reduced) {
              earthGroup.rotation.y += ((Math.PI * 2) / EARTH_PERIOD) * dt;
              outerGroup.rotation.y -= ((Math.PI * 2) / OUTER_PERIOD) * dt;
              updatePackets(elapsed, dt * 1000);
              pulseNodes(elapsed);
              var breathe = 0.5 + 0.5 * Math.sin(elapsed * 0.00035);
              atmoMat.uniforms.uIntensity.value = 0.72 + breathe * 0.16;
              atmoOuterMat.uniforms.uIntensity.value = 0.12 + breathe * 0.08;
            }
            scene.updateMatrixWorld(true);
            updateTagProjections(elapsed);
            renderer.render(scene, camera);
          }

          function animate() {
            if (!running) return;
            requestAnimationFrame(animate);
            var dt = Math.min(clock.getDelta(), 0.1);
            renderFrame(clock.elapsedTime * 1000, dt);
          }

          renderFrame(0, 0);
          hideLoading();

          if (reduced) {
            // already painted above; reduced-motion skips the animate loop
          } else if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(
              function (entries) {
                entries.forEach(function (entry) {
                  if (entry.isIntersecting && !running) {
                    running = true;
                    clock.start();
                    requestAnimationFrame(animate);
                  } else if (!entry.isIntersecting) {
                    running = false;
                  }
                });
              },
              { threshold: 0.1 },
            );
            io.observe(stage);
          } else {
            running = true;
            requestAnimationFrame(animate);
          }
        }
      })();
    </script>
    <script>
      (function () {
        function imageSizeTier() {
          if (window.matchMedia("(max-width: 600px)").matches) return "mobile";
          if (window.matchMedia("(max-width: 1020px)").matches) return "tablet";
          return "desktop";
        }
        var lazyBgObserver = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              var el = entry.target;
              obs.unobserve(el);
              var url = "../assets/" + el.dataset.bgName + "-" + imageSizeTier() + ".webp";
              var preload = new Image();
              preload.onload = function () {
                el.style.setProperty("--bg-photo", 'url("' + url + '")');
                el.classList.add("bg-loaded");
              };
              preload.src = url;
            });
          },
          { rootMargin: "400px 0px" },
        );
        document.querySelectorAll("[data-bg-name]").forEach(function (el) { lazyBgObserver.observe(el); });
      })();
    </script>
  </body>
</html>`;
}

function hiwAvatarHues() {
  return [198, 168, 212, 322, 262, 36];
}

function hiwDeviceIconMap() {
  return {
    laptop: '<rect x="6" y="7" width="20" height="13" rx="1.6"/><rect x="10" y="10.2" width="12" height="6.6" fill="currentColor" opacity="0.32" stroke="none"/><path d="M3 23h26l-2.4 3.2H5.4Z"/>',
    desktop: '<rect x="5" y="6" width="22" height="14" rx="1.6"/><rect x="9" y="9.2" width="14" height="7.6" fill="currentColor" opacity="0.32" stroke="none"/><path d="M13 20.4v3.6M19 20.4v3.6M10 24.4h12"/>',
    tower: '<rect x="10.5" y="4" width="11" height="24" rx="1.6"/><path d="M13.2 9h5.6M13.2 13.4h5.6"/><circle cx="16" cy="22.4" r="1.5" fill="currentColor" stroke="none"/>',
    minipc: '<rect x="8" y="11.5" width="16" height="9.4" rx="1.6"/><circle cx="12.4" cy="16.2" r="1.2" fill="currentColor" stroke="none"/><path d="M16 20.9v3M12 25h8"/>',
    server: '<rect x="6" y="8.4" width="20" height="5.6" rx="1"/><rect x="6" y="17.6" width="20" height="5.6" rx="1"/><circle cx="10" cy="11.2" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="20.4" r="1" fill="currentColor" stroke="none"/>',
    highend: '<rect x="7.5" y="5" width="17" height="22" rx="1.6"/><path d="M11.2 10h9.6M11.2 14h9.6M11.2 18h5.8"/><circle cx="20" cy="22" r="1.3" fill="currentColor" stroke="none"/>',
  };
}

function hiwDeviceIconSvg(type, map) {
  return `<svg viewBox="0 0 32 32" aria-hidden="true">${map[type] ?? map.laptop}</svg>`;
}

function hiwPersonAvatar() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4" fill="currentColor" stroke="none" opacity="0.92"/><path d="M4 20.5c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" stroke="none" opacity="0.92"/></svg>';
}

function hiwFormatK(n) {
  if (n >= 1000) {
    return (Math.round(n / 100) / 10).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return String(n);
}

function hiwLocations() {
  return [
    { city: "San Francisco", country: "USA", online: 248, members: 1200, devices: 320, devicesOrder: ["laptop", "desktop", "server", "tower", "minipc", "highend"] },
    { city: "Auckland", country: "New Zealand", online: 186, members: 840, devices: 214, devicesOrder: ["desktop", "laptop", "minipc", "server", "highend", "tower"] },
    { city: "Manila", country: "Philippines", online: 312, members: 1460, devices: 398, devicesOrder: ["laptop", "highend", "desktop", "minipc", "server", "tower"] },
    { city: "Singapore", country: "Singapore", online: 204, members: 980, devices: 276, devicesOrder: ["highend", "server", "desktop", "laptop", "tower", "minipc"] },
    { city: "Tokyo", country: "Japan", online: 358, members: 1620, devices: 441, devicesOrder: ["tower", "highend", "laptop", "server", "desktop", "minipc"] },
    { city: "Sydney", country: "Australia", online: 227, members: 1050, devices: 289, devicesOrder: ["desktop", "minipc", "laptop", "highend", "tower", "server"] },
    { city: "Berlin", country: "Germany", online: 265, members: 1180, devices: 312, devicesOrder: ["server", "tower", "highend", "desktop", "laptop", "minipc"] },
    { city: "London", country: "United Kingdom", online: 341, members: 1540, devices: 407, devicesOrder: ["laptop", "highend", "server", "minipc", "desktop", "tower"] },
    { city: "Toronto", country: "Canada", online: 198, members: 910, devices: 251, devicesOrder: ["minipc", "laptop", "tower", "desktop", "server", "highend"] },
    { city: "São Paulo", country: "Brazil", online: 176, members: 790, devices: 208, devicesOrder: ["desktop", "server", "laptop", "tower", "minipc", "highend"] },
  ];
}

function hiwGlobeTags() {
  return [
    { city: "London", country: "UK", lat: 51.5, lon: -0.12 },
    { city: "Tokyo", country: "Japan", lat: 35.68, lon: 139.69 },
    { city: "San Francisco", country: "USA", lat: 37.77, lon: -122.42 },
    { city: "São Paulo", country: "Brazil", lat: -23.55, lon: -46.63 },
    { city: "Sydney", country: "Australia", lat: -33.87, lon: 151.21 },
  ];
}

function hiwGlobeAmbientNodes() {
  return [
    { city: "Singapore", lat: 1.35, lon: 103.82 },
    { city: "Auckland", lat: -36.85, lon: 174.76 },
  ];
}

function hiwGlobeRoutes() {
  return [
    ["San Francisco", "London"],
    ["London", "Singapore"],
    ["Singapore", "Sydney"],
    ["Sydney", "Auckland"],
    ["Tokyo", "San Francisco"],
    ["São Paulo", "London"],
    ["Tokyo", "Singapore"],
    ["Auckland", "Singapore"],
  ];
}

function hiwMemberCardHTML(deviceType, hue, iconMap) {
  return `<div class="hiw-member">
              <div class="hiw-member-top">
                <span class="hiw-avatar" style="--hue:${hue}">${hiwPersonAvatar()}</span>
                <span class="hiw-device">${hiwDeviceIconSvg(deviceType, iconMap)}</span>
              </div>
              <div class="hiw-member-status"><span class="dot"></span>Sharing compute</div>
            </div>`;
}

function networkCoreSvg() {
  return `<svg viewBox="0 0 300 300" aria-hidden="true">
    <circle cx="150" cy="150" r="139" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.48" />
    <ellipse cx="150" cy="150" rx="92" ry="139" fill="none" stroke="currentColor" stroke-width="1" opacity="0.24" />
    <ellipse cx="150" cy="150" rx="139" ry="54" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2" />
    <path d="M45 70 100 38 154 30 212 54 258 100 271 159 247 218 190 265 121 278 59 238 30 178Z" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.48" />
    <path d="M45 70 96 116 30 178M96 116 154 30 176 103 258 100M176 103 150 150 271 159M150 150 59 238M150 150 190 265M96 116 150 150 176 103M247 218 150 150" fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.45" />
    <g fill="currentColor"><circle cx="45" cy="70" r="3" /><circle cx="154" cy="30" r="4" /><circle cx="258" cy="100" r="4" /><circle cx="271" cy="159" r="3" /><circle cx="247" cy="218" r="3" /><circle cx="190" cy="265" r="3" /><circle cx="59" cy="238" r="3" /><circle cx="30" cy="178" r="3" /><circle cx="96" cy="116" r="3" /><circle cx="176" cy="103" r="3" /><circle cx="150" cy="150" r="3" /></g>
  </svg>`;
}

function brandMark(className = "mark") {
  return `<img class="${className}" src="./assets/nodara-mark.png" alt="" aria-hidden="true" />`;
}

function siteIcon(name) {
  const common = 'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"';
  const icons = {
    "arrow-up": '<path d="m12 19 0-14"/><path d="m5 12 7-7 7 7"/>',
    "bar-chart": '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20V8"/>',
    box: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/><path d="m14 4-4 16"/>',
    cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v4"/><path d="M15 1v4"/><path d="M9 19v4"/><path d="M15 19v4"/><path d="M1 9h4"/><path d="M1 15h4"/><path d="M19 9h4"/><path d="M19 15h4"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    discord: '<path d="M8 8c2.7-1 5.3-1 8 0"/><path d="M7 17c3.3 1.3 6.7 1.3 10 0"/><path d="M8 8 6 18l3-2"/><path d="m16 8 2 10-3-2"/><path d="M9.5 13h.01"/><path d="M14.5 13h.01"/>',
    folder: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5Z"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.4-.4 7-1.7 7-7.5a5.8 5.8 0 0 0-1.6-4A5.4 5.4 0 0 0 19.3 0S18 0 15 1.5a14.8 14.8 0 0 0-6 0C6 0 4.7 0 4.7 0a5.4 5.4 0 0 0-.1 3A5.8 5.8 0 0 0 3 7c0 5.8 3.6 7.1 7 7.5A4.8 4.8 0 0 0 9 18v4"/><path d="M9 18c-4.5 2-5-2-7-2"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/>',
    laptop: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9"/><path d="M2 20h20"/><path d="M6 16h12"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 8-10 16-9-1 8-5 16-11 16Z"/><path d="M4 13c4 0 8-1 12-5"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><path d="M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    "message-square": '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
    moon: '<path d="M20.5 14.5A8 8 0 0 1 9.5 3.5 8 8 0 1 0 20.5 14.5Z"/>',
    network: '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="M10.6 7.7 6.4 16.3"/><path d="m13.4 7.7 4.2 8.6"/><path d="M8 19h8"/>',
    paperclip: '<path d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l8.5-8.5a4 4 0 0 1 5.7 5.7l-8.5 8.5a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.6 6.8-4.2"/><path d="m8.6 13.4 6.8 4.2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',
    sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/>',
    spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m8 9 3 3-3 3"/><path d="M13 15h3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    x: '<path d="M18 2 6 22"/><path d="m6 2 12 20"/>',
    youtube: '<path d="M22.5 8.5a3 3 0 0 0-2.1-2.1C18.5 6 12 6 12 6s-6.5 0-8.4.4a3 3 0 0 0-2.1 2.1A31 31 0 0 0 1 12a31 31 0 0 0 .5 3.5 3 3 0 0 0 2.1 2.1C5.5 18 12 18 12 18s6.5 0 8.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23 12a31 31 0 0 0-.5-3.5Z"/><path d="m10 15 5-3-5-3Z"/>',
    zap: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/>',
  };
  return `<svg ${common} aria-hidden="true">${icons[name] ?? icons.spark}</svg>`;
}

function writePublicInstallSurface() {
  const publicDir = path.join(outputDir, "public");
  const installDir = path.join(publicDir, "install");
  fs.mkdirSync(installDir, { recursive: true });

  const manifest = {
    kind: "install-manifest",
    product_name: "Nodara",
    audience: "public",
    install_script_href: "./install.sh",
    install_powershell_href: "./install.ps1",
    install_command: "RELEASE_BASE_URL=http://127.0.0.1:8788/releases/latest/download bash install.sh",
    windows_install_command:
      ".\\install.ps1 -ReleaseBaseUrl http://127.0.0.1:8788/releases/latest/download",
    release_base_url: repoReleaseBaseUrl,
    release_notes_url: repoReleaseNotesUrl,
    docs_home_href: "./docs/",
    install_docs_href: "./docs/install/",
    checksum_hint:
      "The hosted install script uses the signed GitHub release artifacts and fails closed unless checksum and signed manifest artifacts are present.",
  };

  fs.writeFileSync(path.join(publicDir, "install.sh"), installScriptContents);
  fs.writeFileSync(path.join(publicDir, "install.ps1"), installPowershellContents);
  fs.writeFileSync(path.join(publicDir, "install.json"), JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(path.join(outputDir, "install.json"), JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(path.join(outputDir, "install", "index.html"), renderLocalInstallPage());
  fs.writeFileSync(path.join(installDir, "index.html"), renderPublicInstallPage());
}

function writePublicReleaseSurface() {
  const publicDir = path.join(outputDir, "public");
  const releaseDir = path.join(publicDir, "release");
  fs.mkdirSync(releaseDir, { recursive: true });

  const manifest = {
    kind: "release-channel",
    product_name: "Nodara",
    audience: "public",
    release_base_url: repoReleaseBaseUrl,
    release_notes_url: repoReleaseNotesUrl,
    install_surface_href: "./install/",
    install_manifest_href: "./install.json",
    docs_release_href: "./docs/release/",
    artifact_name_pattern: "opengpu-<target>",
    checksum_suffix: ".sha256",
    signed_manifest_name: "release-manifest.json",
    distribution_summary:
      "GitHub Releases remains the current public artifact host while the Pages mirror explains the release channel, checksums, and install entrypoints.",
  };

  fs.writeFileSync(path.join(publicDir, "release.json"), JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(path.join(releaseDir, "index.html"), renderPublicReleasePage());
}

function renderPage(page, options) {
  const { siteRootDepth, eyebrow, homeIntro } = options;
  const nav = [
    `<a href="${siteHref(siteRootDepth, page.slug, "atlas/")}">Atlas</a>`,
    `<a href="${siteHref(siteRootDepth, page.slug, "compute/")}">Compute</a>`,
    `<a href="${siteHref(siteRootDepth, page.slug, "network/")}">Network</a>`,
    `<a href="${siteHref(siteRootDepth, page.slug, "developers/")}">Developers</a>`,
  ].join("");

  const body = page.sourcePath
    ? renderMarkdown(page, fs.readFileSync(page.sourcePath, "utf8"))
    : renderHome(homeIntro);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(page.title)}</title>
    <link rel="icon" href="${siteHref(siteRootDepth, page.slug, "assets/nodara-icon.svg")}" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&display=swap" rel="stylesheet" />
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f3ea;
        --panel: #fffdf8;
        --text: #1e1d1a;
        --muted: #5d584f;
        --accent: #0b6bcb;
        --border: #d9d2c3;
        --shadow: 0 18px 48px rgba(51, 42, 20, 0.08);
        --wrap: min(1680px, calc(100% - 88px));
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Iowan Old Style", "Palatino Linotype", serif;
        background: linear-gradient(180deg, #f2ece0 0%, var(--bg) 22%, #fcfbf8 100%);
        color: var(--text);
      }
      a { color: var(--accent); }
      .shell header {
        padding: 0 0 1rem;
      }
      .shell {
        width: var(--wrap);
        margin: 2rem auto 4rem;
      }
      .hero {
        background: radial-gradient(circle at top left, rgba(11, 107, 203, 0.12), transparent 35%), var(--panel);
        border: 1px solid var(--border);
        border-radius: 28px;
        box-shadow: var(--shadow);
        padding: 2rem;
      }
      .eyebrow {
        display: inline-block;
        margin: 0 0 1rem;
        padding: 0.3rem 0.7rem;
        border-radius: 999px;
        background: #efe7d6;
        color: var(--muted);
        font: 600 0.85rem/1.2 "Helvetica Neue", Arial, sans-serif;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0;
        font-size: clamp(2.4rem, 4vw, 4.4rem);
        line-height: 0.98;
      }
      .hero p {
        max-width: 48rem;
        font-size: 1.1rem;
        line-height: 1.65;
        color: var(--muted);
      }
      .topbar {
        position: sticky;
        top: 0;
        z-index: 50;
        border-bottom: 1px solid rgba(56, 218, 255, 0.12);
        background: #020b13;
      }
      .topbar.is-scrolled {
        background: #030f18;
        box-shadow: 0 12px 32px rgba(2, 8, 14, 0.28);
      }
      .nav {
        width: var(--wrap);
        height: 68px;
        margin: 0 auto;
        padding: 0 52px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
      }
      .brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        color: #f5f8fb;
        text-decoration: none;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        font-weight: 600;
        font-size: 18px;
      }
      .brand img {
        width: 42px;
        height: 28px;
        object-fit: contain;
      }
      .nav-links {
        display: flex;
        align-items: center;
        gap: clamp(26px, 3.2vw, 54px);
        color: #e9f3fa;
        font-size: 13px;
        font-family: "Outfit", ui-sans-serif, system-ui, sans-serif;
        font-weight: 600;
      }
      .nav-links a {
        position: relative;
        padding: 26px 0 23px;
        color: inherit;
        text-decoration: none;
      }
      .nav-links a[aria-current="page"]::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 9px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        transform: translateX(-50%);
        background: #31cfff;
        box-shadow: 0 0 16px #31cfff;
      }
      .nav-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: "Outfit", ui-sans-serif, system-ui, sans-serif;
      }
      .nav-actions .button {
        min-height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(56, 218, 255, 0.46);
        border-radius: 999px;
        padding: 0 19px;
        color: #f5f8fb;
        background: rgba(3, 18, 30, 0.58);
        font-size: 12px;
        font-weight: 800;
        line-height: 1;
        text-decoration: none;
        white-space: nowrap;
        transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
      }
      .nav-actions .button:hover { transform: translateY(-1px); border-color: rgba(56, 218, 255, 0.74); }
      .nav-actions .button.primary {
        border-color: transparent;
        color: #02111d;
        background: linear-gradient(135deg, #38daff, #22c9f5);
        box-shadow: 0 16px 38px rgba(34, 201, 245, 0.22);
      }
      .menu-toggle, .mobile-menu { display: none; }
      .menu-toggle { min-width: 76px; min-height: 44px; align-items: center; justify-content: center; gap: 8px; border: 1px solid rgba(56,218,255,.46); border-radius: 999px; color: #f5f8fb; background: rgba(3,18,30,.72); font: 800 12px/1 "Outfit", sans-serif; }
      .menu-toggle svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
      .mobile-menu { position: absolute; top: 100%; left: max(18px, calc((100% - 768px) / 2)); right: max(18px, calc((100% - 768px) / 2)); padding: 12px; border: 1px solid rgba(56,218,255,.24); background: #03121e; box-shadow: 0 18px 36px rgba(0,0,0,.36); }
      .mobile-menu a { min-height: 48px; display: flex; align-items: center; padding: 0 14px; color: #e9f3fa; font: 700 14px/1 "Outfit", sans-serif; text-decoration: none; }
      .mobile-menu a + a { border-top: 1px solid rgba(56,218,255,.12); }
      .mobile-menu .mobile-primary { margin-top: 8px; justify-content: center; border-radius: 6px; color: #02111d; background: #38daff; }
      .topbar.is-menu-open .mobile-menu { display: grid; animation: menu-in 180ms ease-out both; }
      .topbar.is-menu-open .mobile-menu a { animation: menu-item-in 220ms ease-out both; }
      .topbar.is-menu-open .mobile-menu a:nth-child(2) { animation-delay: 20ms; }
      .topbar.is-menu-open .mobile-menu a:nth-child(3) { animation-delay: 40ms; }
      .topbar.is-menu-open .mobile-menu a:nth-child(4) { animation-delay: 60ms; }
      .topbar.is-menu-open .mobile-menu a:nth-child(5) { animation-delay: 80ms; }
      .topbar.is-menu-open .mobile-menu a:nth-child(6) { animation-delay: 100ms; }
      @keyframes menu-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes menu-item-in { from { opacity: 0; transform: translateY(-3px); } to { opacity: 1; transform: translateY(0); } }
      @media (prefers-reduced-motion: reduce) { .topbar.is-menu-open .mobile-menu, .topbar.is-menu-open .mobile-menu a { animation: none; } }
      main {
        margin-top: 1.5rem;
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 28px;
        box-shadow: var(--shadow);
        padding: 2rem;
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
      }
      .card {
        display: block;
        padding: 1.2rem;
        border-radius: 20px;
        text-decoration: none;
        background: #fff;
        border: 1px solid var(--border);
        color: inherit;
      }
      .card h2 {
        margin-top: 0;
        font-size: 1.2rem;
      }
      article {
        max-width: 52rem;
        margin: 0 auto;
      }
      article h1:first-child {
        font-size: clamp(2rem, 3vw, 3rem);
      }
      article h2, article h3 {
        margin-top: 2rem;
      }
      article p, article li {
        font-size: 1.05rem;
        line-height: 1.75;
      }
      article code {
        background: #f3eee4;
        border-radius: 6px;
        padding: 0.12rem 0.35rem;
        font-size: 0.95em;
      }
      pre {
        overflow-x: auto;
        padding: 1rem;
        border-radius: 18px;
        background: #1f2430;
        color: #f4f1eb;
      }
      pre code {
        background: none;
        padding: 0;
      }
      ul, ol {
        padding-left: 1.3rem;
      }
      footer {
        max-width: 52rem;
        margin: 2rem auto 0;
        color: var(--muted);
        font: 0.95rem/1.6 "Helvetica Neue", Arial, sans-serif;
      }
      @media (max-width: 1020px) {
        :root { --wrap: min(100% - 36px, 768px); }
        .nav {
          padding: 0 28px;
        }
        .nav-links {
          display: none;
        }
        .nav-actions { display: none; }
        .menu-toggle { display: inline-flex; }
      }
      @media (max-width: 760px) {
        .nav {
          height: 64px;
        }
        .nav-links {
          display: none;
        }
        .nav-actions .button:first-child {
          display: none;
        }
        .nav-actions { display: none; }
      }
      @media (max-width: 560px) {
        :root { --wrap: min(100% - 26px, 375px); }
        .nav {
          padding: 0 16px;
        }
        .hero, main {
          padding: 1.4rem;
          border-radius: 22px;
        }
      }
    </style>
  </head>
  <body>
    <header class="topbar" id="topbar">
      <nav class="nav" aria-label="Primary">
        <a class="brand" href="${siteHref(siteRootDepth, page.slug, "")}" aria-label="Nodara home">
          <img src="${siteHref(siteRootDepth, page.slug, "assets/nodara-mark.png")}" alt="" aria-hidden="true" />
          <span>Nodara</span>
        </a>
        <div class="nav-links" aria-label="Sections">${nav}</div>
        <div class="nav-actions">
          <a class="button" href="https://nodara.si/">Sign in</a>
          <a class="button primary" href="${siteHref(siteRootDepth, page.slug, "public/install/")}">Get started</a>
        </div>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg><span>Menu</span></button>
      </nav>
      <div class="mobile-menu" id="mobile-menu">${nav}<a href="https://nodara.si/">Sign in</a><a class="mobile-primary" href="${siteHref(siteRootDepth, page.slug, "public/install/")}">Get started</a></div>
    </header>
    <script>
      (function () {
        var topbar = document.getElementById("topbar");
        if (!topbar) return;
        var menuToggle = topbar.querySelector(".menu-toggle");
        var mobileMenu = topbar.querySelector(".mobile-menu");
        function setMenuOpen(open) {
          topbar.classList.toggle("is-menu-open", open);
          menuToggle.setAttribute("aria-expanded", String(open));
        }
        menuToggle.addEventListener("click", function () { setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true"); });
        topbar.querySelectorAll(".mobile-menu a").forEach(function (link) { link.addEventListener("click", function () { setMenuOpen(false); }); });
        document.addEventListener("pointerdown", function (event) { if (!menuToggle.contains(event.target) && !mobileMenu.contains(event.target)) setMenuOpen(false); });
        document.addEventListener("keydown", function (event) { if (event.key === "Escape") { setMenuOpen(false); menuToggle.focus(); } });
        function updateTopbar() {
          topbar.classList.toggle("is-scrolled", window.scrollY > 16);
        }
        updateTopbar();
        window.addEventListener("scroll", updateTopbar, { passive: true });
      })();
    </script>
    <div class="shell">
      <header>
        <div class="hero">
          <span class="eyebrow">${escapeHtml(eyebrow)}</span>
          <h1>${escapeHtml(page.title)}</h1>
          <p>${escapeHtml(page.intro)}</p>
        </div>
      </header>
      <main>${body}</main>
      <footer>
        Built from the tracked markdown in this repository so the public docs site stays reviewable in pull requests.
      </footer>
    </div>
  </body>
</html>`;
}

function siteHref(siteRootDepth, currentSlug, target) {
  const depth = siteRootDepth + (currentSlug ? 1 : 0);
  const prefix = depth === 0 ? "./" : "../".repeat(depth);
  return `${prefix}${target}`;
}

function renderHome(homeIntro) {
  return `
    <article>
      <p>${escapeHtml(homeIntro)}</p>
      <div class="cards">
        ${pages
          .filter((entry) => entry.slug)
          .map(
            (entry) => `<a class="card" href="${relativeHref("", entry.slug)}">
              <h2>${escapeHtml(entry.title)}</h2>
              <p>${escapeHtml(entry.intro)}</p>
            </a>`,
          )
          .join("")}
      </div>
    </article>`;
}

function renderMarkdown(page, markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listType = null;
  let listItems = [];
  let codeFence = null;
  let codeLines = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listType || listItems.length === 0) return;
    html.push(`<${listType}>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${listType}>`);
    listType = null;
    listItems = [];
  };

  const flushCodeFence = () => {
    if (codeFence === null) return;
    const language = codeFence ? ` class="language-${escapeHtml(codeFence)}"` : "";
    html.push(`<pre><code${language}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeFence = null;
    codeLines = [];
  };

  for (const line of lines) {
    const fenceMatch = line.match(/^```(.*)$/);
    if (fenceMatch) {
      if (codeFence !== null) {
        flushCodeFence();
      } else {
        flushParagraph();
        flushList();
        codeFence = fenceMatch[1].trim();
      }
      continue;
    }

    if (codeFence !== null) {
      codeLines.push(line);
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      const nextType = /\d+\./.test(listMatch[2]) ? "ol" : "ul";
      if (listType && listType !== nextType) {
        flushList();
      }
      listType = nextType;
      listItems.push(listMatch[3]);
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushCodeFence();

  const summaryBlocks = [];
  if (page.slug === "device-identity") {
    summaryBlocks.push(
      `<section><h2>Current stance</h2><p>Nodara should prefer non-exportable device keys so the CLI, agent, and worker can request signatures without reading raw private-key bytes.</p></section>`,
    );
  }

  return `<article>${summaryBlocks.join("")}${html.join("\n")}</article>`;
}

function renderInline(text) {
  let rendered = escapeHtml(text);
  rendered = rendered.replace(/`([^`]+)`/g, "<code>$1</code>");
  rendered = rendered.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return rendered;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function relativeHref(fromSlug, toSlug) {
  if (fromSlug === toSlug) {
    return fromSlug === "" ? "./" : "../";
  }
  if (fromSlug === "") {
    return toSlug === "" ? "./" : `./${toSlug}/`;
  }
  if (toSlug === "") {
    return "../";
  }
  return `../${toSlug}/`;
}

function renderPublicInstallPage({ localPreview = false } = {}) {
  const rootHref = localPreview ? "../" : "../../";
  const installerHref = localPreview ? "../public/" : "../";
  const releaseHref = localPreview ? "../public/release/" : "../release/";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Install Nodara</title>
    <meta name="description" content="Download Nodara for Windows, macOS, or Linux and follow the setup steps for your operating system." />
    <link rel="icon" href="${rootHref}assets/nodara-icon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
      :root {
        color-scheme: dark;
        --page: #04121a;
        --surface: #0a2028;
        --surface-raised: #102b32;
        --line: rgba(132, 207, 189, .22);
        --text: #f1faf7;
        --muted: #a7c3bd;
        --green: #20dda0;
        --green-deep: #0b9c72;
        --wrap: min(1120px, calc(100% - 48px));
      }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        min-height: 100vh;
        color: var(--text);
        font: 400 16px/1.55 "Outfit", ui-sans-serif, system-ui, sans-serif;
        background: radial-gradient(circle at 78% 4%, rgba(17, 172, 127, .18), transparent 30rem),
          radial-gradient(circle at 0% 65%, rgba(14, 116, 111, .12), transparent 26rem), var(--page);
      }
      a { color: inherit; }
      button { font: inherit; }
      :focus-visible { outline: 3px solid var(--green); outline-offset: 4px; }
      [hidden] { display: none !important; }
      .shell { width: var(--wrap); margin: 0 auto; }
      .site-header { border-bottom: 1px solid var(--line); }
      .header-inner { min-height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
      .brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; font-size: 20px; font-weight: 700; }
      .brand img { width: 42px; height: 32px; object-fit: contain; }
      .header-links { display: flex; flex-wrap: wrap; align-items: center; gap: clamp(16px, 3vw, 36px); }
      .header-links a { text-decoration: none; color: var(--muted); font-size: 14px; font-weight: 600; }
      .header-links a:hover { color: var(--text); }
      main { padding: 76px 0 100px; }
      .eyebrow { margin: 0 0 18px; color: var(--green); font-size: 12px; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; }
      h1 { max-width: 820px; margin: 0; font-size: clamp(44px, 7vw, 82px); line-height: .99; letter-spacing: -.045em; font-weight: 700; }
      .lead { max-width: 650px; margin: 24px 0 0; color: var(--muted); font-size: clamp(16px, 2vw, 19px); line-height: 1.55; }
      .os-picker { margin-top: 46px; }
      .picker-label { display: block; margin-bottom: 13px; color: var(--muted); font-size: 13px; font-weight: 600; }
      .os-options { display: flex; flex-wrap: wrap; gap: 10px; }
      .os-option { display: inline-flex; min-height: 48px; min-width: 136px; align-items: center; justify-content: center; padding: 0 22px; border: 1px solid var(--line); border-radius: 100px; text-decoration: none; font-weight: 600; background: rgba(16, 43, 50, .7); transition: border-color .18s, background .18s; }
      .os-option:hover { border-color: var(--green); }
      .os-option[aria-current="page"] { border-color: var(--green); color: #05221a; background: var(--green); }
      .install-card { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); margin-top: 26px; overflow: hidden; border: 1px solid var(--line); border-radius: 20px; background: var(--surface); box-shadow: 0 24px 70px rgba(0, 0, 0, .22); }
      .download-pane { display: flex; flex-direction: column; align-items: flex-start; padding: clamp(28px, 4vw, 50px); border-right: 1px solid var(--line); background: radial-gradient(circle at 10% 0%, rgba(32, 221, 160, .16), transparent 18rem), var(--surface-raised); }
      .download-pane .step-label { margin: 0 0 20px; color: var(--green); font-size: 12px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
      .download-pane h2 { margin: 0; font-size: clamp(27px, 3vw, 38px); line-height: 1.1; letter-spacing: -.025em; }
      .download-pane p { margin: 16px 0 24px; color: var(--muted); }
      .download-button { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; padding: 0 25px; border-radius: 100px; color: #05221a; background: var(--green); text-decoration: none; font-weight: 700; }
      .download-button:hover { background: #5cf0be; }
      .file-name { margin-top: 15px; color: var(--muted); font-size: 13px; }
      .steps-pane { padding: clamp(28px, 4vw, 50px); }
      .steps-pane h2 { margin: 0 0 26px; font-size: 25px; letter-spacing: -.02em; }
      .steps { display: grid; gap: 26px; margin: 0; padding: 0; list-style: none; }
      .steps li { display: grid; grid-template-columns: 36px minmax(0, 1fr); gap: 16px; }
      .step-number { color: var(--green); font-size: 13px; font-weight: 700; letter-spacing: .1em; }
      .steps h3 { margin: 0 0 5px; font-size: 17px; font-weight: 600; }
      .steps p { margin: 0; color: var(--muted); font-size: 14px; }
      .steps pre { max-width: 100%; margin: 12px 0 0; padding: 14px 16px; overflow-x: auto; overflow-wrap: anywhere; white-space: pre-wrap; border: 1px solid var(--line); border-radius: 10px; background: #06171e; color: #d9fff0; font: 500 13px/1.6 ui-monospace, SFMono-Regular, Consolas, monospace; }
      .aftercare { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 20px; margin-top: 30px; padding: 0 2px; color: var(--muted); font-size: 14px; }
      .aftercare p { max-width: 650px; margin: 0; }
      .aftercare a { color: var(--green); text-underline-offset: 4px; }
      .site-footer { border-top: 1px solid var(--line); padding: 28px 0 36px; color: var(--muted); font-size: 13px; }
      @media (max-width: 760px) {
        :root { --wrap: min(100% - 32px, 560px); }
        .header-inner { min-height: 68px; }
        .brand { font-size: 18px; }
        .brand img { width: 37px; height: 29px; }
        main { padding: 54px 0 76px; }
        .os-picker { margin-top: 34px; }
        .os-option { flex: 1 1 100px; min-width: 0; padding: 0 12px; }
        .install-card { grid-template-columns: 1fr; }
        .download-pane { border-right: 0; border-bottom: 1px solid var(--line); }
      }
      @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } .os-option { transition: none; } }
    </style>
  </head>
  <body>
    <header class="site-header">
      <div class="shell header-inner">
        <a class="brand" href="${rootHref}" aria-label="Nodara home"><img src="${rootHref}assets/nodara-mark.png" alt="" />Nodara</a>
        <nav class="header-links" aria-label="Site"><a href="${rootHref}compute/">Compute</a><a href="../docs/">Docs</a></nav>
      </div>
    </header>
    <main class="shell">
      <p class="eyebrow">Nodara Compute</p>
      <h1>Get your machine ready.</h1>
      <p class="lead">Choose your operating system. We will download the installer, then guide you through the setup.</p>
      <div class="os-picker" aria-label="Choose an operating system">
        <span class="picker-label">Select your operating system</span>
        <div class="os-options">
          <a class="os-option" data-os="windows" href="?os=windows#install-steps">Windows</a>
          <a class="os-option" data-os="macos" href="?os=macos#install-steps">macOS</a>
          <a class="os-option" data-os="linux" href="?os=linux#install-steps">Linux</a>
        </div>
      </div>
      <div id="install-steps">
        <section class="install-card" data-panel="windows">
          <div class="download-pane"><p class="step-label">Windows 10 or 11 · 64-bit</p><h2>Download for Windows</h2><p data-status>Save the PowerShell installer, then follow the steps.</p><a class="download-button" data-download-link href="${installerHref}install.ps1" download="install.ps1">Download install.ps1</a><span class="file-name">Installer file · install.ps1</span></div>
          <div class="steps-pane"><h2>Install in three steps</h2><ol class="steps"><li><span class="step-number">01</span><div><h3>Save the installer</h3><p>Your browser saves it to its configured download location, usually Downloads.</p></div></li><li><span class="step-number">02</span><div><h3>Run it in PowerShell</h3><p>Open PowerShell and run this from your Downloads folder:</p><pre>cd "$HOME\\Downloads"
powershell -ExecutionPolicy Bypass -File .\\install.ps1</pre></div></li><li><span class="step-number">03</span><div><h3>Finish the guided setup</h3><p>The installer opens the Nodara setup. Choose your role, contribution cap, and model, then start your node when ready.</p></div></li></ol></div>
        </section>
        <section class="install-card" data-panel="macos" hidden>
          <div class="download-pane"><p class="step-label">macOS · Apple Silicon</p><h2>Download for macOS</h2><p data-status>Save the shell installer, then follow the steps.</p><a class="download-button" data-download-link href="${installerHref}install.sh" download="install.sh">Download install.sh</a><span class="file-name">Installer file · install.sh</span></div>
          <div class="steps-pane"><h2>Install in three steps</h2><ol class="steps"><li><span class="step-number">01</span><div><h3>Save the installer</h3><p>Your browser saves it to its configured download location, usually Downloads.</p></div></li><li><span class="step-number">02</span><div><h3>Run it in Terminal</h3><p>Open Terminal and run:</p><pre>bash ~/Downloads/install.sh</pre></div></li><li><span class="step-number">03</span><div><h3>Set up your node</h3><p>Run <code>opengpu install</code> to choose your control plane, contribution cap, and model. Then run <code>opengpu start</code>.</p></div></li></ol></div>
        </section>
        <section class="install-card" data-panel="linux" hidden>
          <div class="download-pane"><p class="step-label">Linux · 64-bit or ARM64</p><h2>Download for Linux</h2><p data-status>Save the shell installer, then follow the steps.</p><a class="download-button" data-download-link href="${installerHref}install.sh" download="install.sh">Download install.sh</a><span class="file-name">Installer file · install.sh</span></div>
          <div class="steps-pane"><h2>Install in three steps</h2><ol class="steps"><li><span class="step-number">01</span><div><h3>Save the installer</h3><p>Your browser saves it to its configured download location, usually Downloads.</p></div></li><li><span class="step-number">02</span><div><h3>Run it in Terminal</h3><p>Open Terminal and run:</p><pre>bash ~/Downloads/install.sh</pre></div></li><li><span class="step-number">03</span><div><h3>Set up your node</h3><p>Run <code>opengpu install</code> to choose your control plane, contribution cap, and model. Then run <code>opengpu start</code>.</p></div></li></ol></div>
        </section>
      </div>
      <div class="aftercare"><p>If your browser uses a different download folder, run the installer from that folder instead. The installer verifies the release before installing.</p><a href="${releaseHref}">Release details and checksums</a></div>
    </main>
    <footer class="site-footer"><div class="shell">Nodara · <a href="${rootHref}compute/">Back to Compute</a></div></footer>
    <script>
      const params = new URLSearchParams(window.location.search);
      const platforms = ["windows", "macos", "linux"];
      const requested = params.get("os");
      const browserPlatform = navigator.userAgent.toLowerCase();
      const detected = browserPlatform.includes("win") ? "windows" : browserPlatform.includes("mac") ? "macos" : "linux";
      const selected = platforms.includes(requested) ? requested : detected;
      for (const option of document.querySelectorAll("[data-os]")) {
        if (option.dataset.os === selected) option.setAttribute("aria-current", "page");
      }
      for (const panel of document.querySelectorAll("[data-panel]")) {
        panel.hidden = panel.dataset.panel !== selected;
      }
      if (platforms.includes(requested) && params.get("download") === "1") {
        const panel = document.querySelector('[data-panel="' + selected + '"]');
        panel.querySelector("[data-status]").textContent = "Your download should begin automatically. If it does not, use the button below.";
        window.addEventListener("load", () => {
          panel.querySelector("[data-download-link]").click();
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("download");
          history.replaceState(null, "", cleanUrl);
        }, { once: true });
      }
    </script>
  </body>
</html>`;
}

function renderLocalInstallPage() {
  return renderPublicInstallPage({ localPreview: true });
}

function renderPublicReleasePage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Public Release Mirror</title>
    <link rel="icon" href="../../assets/nodara-icon.svg" type="image/svg+xml" />
    <style>
      :root {
        color-scheme: light;
        --bg: #eef5f4;
        --panel: #fbfefd;
        --text: #162321;
        --muted: #526865;
        --accent: #0d8b78;
        --border: #c7ddd8;
        --shadow: 0 18px 56px rgba(18, 55, 48, 0.1);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Iowan Old Style", "Palatino Linotype", serif;
        background:
          radial-gradient(circle at top right, rgba(13, 139, 120, 0.14), transparent 28%),
          linear-gradient(180deg, #e7f1ee 0%, var(--bg) 30%, #f9fcfb 100%);
        color: var(--text);
      }
      a { color: var(--accent); }
      .shell {
        width: min(1080px, calc(100% - 2rem));
        margin: 0 auto;
        padding: 2.5rem 0 4rem;
      }
      .hero, .panel {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 28px;
        box-shadow: var(--shadow);
      }
      .hero {
        padding: 2rem;
      }
      .eyebrow {
        display: inline-block;
        margin-bottom: 1rem;
        padding: 0.3rem 0.7rem;
        border-radius: 999px;
        background: #ddeeea;
        color: var(--muted);
        font: 600 0.84rem/1.2 "Helvetica Neue", Arial, sans-serif;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0;
        font-size: clamp(2.6rem, 5vw, 4.4rem);
        line-height: 0.98;
      }
      .lead {
        max-width: 48rem;
        font-size: 1.1rem;
        line-height: 1.7;
        color: var(--muted);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1.5rem;
      }
      .actions a {
        text-decoration: none;
        font: 600 0.95rem/1.2 "Helvetica Neue", Arial, sans-serif;
        padding: 0.75rem 1rem;
        border-radius: 999px;
        border: 1px solid var(--border);
        color: var(--text);
        background: rgba(255, 255, 255, 0.8);
      }
      .actions a.primary {
        background: var(--accent);
        border-color: var(--accent);
        color: white;
      }
      .panel {
        margin-top: 1.4rem;
        padding: 1.8rem;
      }
      .panel h2 {
        margin-top: 0;
      }
      .manifest {
        overflow-x: auto;
        padding: 1rem 1.1rem;
        border-radius: 20px;
        background: #1e2a2a;
        color: #ecf6f4;
        font-size: 1rem;
        line-height: 1.6;
      }
      .status {
        margin-top: 1rem;
        color: var(--muted);
        font: 0.95rem/1.6 "Helvetica Neue", Arial, sans-serif;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }
      .card {
        padding: 1rem;
        border-radius: 20px;
        background: #fff;
        border: 1px solid var(--border);
      }
      .card h3 {
        margin-top: 0;
      }
      code {
        background: #e7f1ee;
        border-radius: 6px;
        padding: 0.12rem 0.35rem;
      }
      ul {
        padding-left: 1.2rem;
      }
      @media (max-width: 640px) {
        .hero, .panel {
          border-radius: 22px;
          padding: 1.4rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <section class="hero">
        <span class="eyebrow">Public Release Mirror</span>
        <h1>Review the live release channel before the final domain exists.</h1>
        <p class="lead">This Pages-backed release surface keeps the current GitHub-hosted distribution flow legible in pull requests. It points at the signed release artifact channel, the checked-in installer surface, and the release notes users should trust today.</p>
        <div class="actions">
          <a class="primary" href="https://github.com/mundusx/mundusx/releases/latest">Latest release notes</a>
          <a href="../install/">Install endpoint</a>
          <a href="../docs/release/">Release strategy docs</a>
        </div>
      </section>

      <section class="panel">
        <h2>Release channel manifest</h2>
        <div class="manifest" id="release-summary">Fetching ../release.json</div>
        <p class="status" id="release-state">This mirror loads its release-channel metadata from <code>../release.json</code>.</p>
      </section>

      <section class="panel">
        <h2>What this release surface covers</h2>
        <div class="grid">
          <div class="card">
            <h3>Artifact host</h3>
            <p>GitHub Releases stays the current public binary host, with the latest download set rooted at <code>/releases/latest/download</code>.</p>
          </div>
          <div class="card">
            <h3>Verification path</h3>
            <p>Each published asset is expected to ship with a checksum and a signed <code>release-manifest.json</code>.</p>
          </div>
          <div class="card">
            <h3>Install hand-off</h3>
            <p>The public install surface and checked-in installer scripts remain the supported way to consume that release channel.</p>
          </div>
        </div>
      </section>

      <section class="panel">
        <h2>Current release posture</h2>
        <ul>
          <li>Apple Silicon macOS remains the primary release lane today.</li>
          <li>Package-manager distribution can layer on later without changing the signed GitHub release source.</li>
          <li>The Pages mirror is for reviewability; the actual binary artifacts still come from GitHub Releases.</li>
        </ul>
      </section>
    </div>
    <script>
      const manifestUrl = new URL("../release.json", window.location.href);
      const summaryNode = document.getElementById("release-summary");
      const stateNode = document.getElementById("release-state");

      async function loadReleaseManifest() {
        const response = await fetch(manifestUrl, { headers: { Accept: "application/json" } });
        if (!response.ok) {
          throw new Error("release manifest request failed with " + response.status);
        }
        const manifest = await response.json();
        summaryNode.textContent =
          "Latest artifacts: " +
          manifest.release_base_url +
          " | Notes: " +
          manifest.release_notes_url +
          " | Pattern: " +
          manifest.artifact_name_pattern;
        stateNode.textContent =
          "Manifest loaded from ../release.json • Signed manifest: " + manifest.signed_manifest_name;
      }

      loadReleaseManifest().catch((error) => {
        summaryNode.textContent = "Failed to load release channel manifest";
        stateNode.textContent = "Unable to load ../release.json: " + error.message;
      });
    </script>
  </body>
</html>`;
}
