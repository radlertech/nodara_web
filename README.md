# Nodara Web

Public marketing and documentation site for Nodara at `nodara.si`.

This repository builds the static web surface for the Nodara public site: the home page, Atlas, Compute, Network, Developers, public docs, release pages, and the install entry point for contributors.

## What Is Nodara?

Nodara is a distributed AI compute platform. It connects people who have available GPU capacity with developers and applications that need AI inference capacity.

The product is organized around three connected surfaces:

- **Nodara Compute**: the contributor side of the network. A user installs the node software, connects a machine, chooses how much capacity to contribute, and runs the local agent through the `opengpu` CLI.
- **Atlas**: the model and AI application surface for people building or using AI capabilities on top of Nodara.
- **Developer APIs**: OpenAI-compatible API surfaces for building applications that can use Nodara models and distributed GPU compute.

The contributor installation path is centered on the `opengpu` command. The installer downloads a platform-specific release asset, verifies checksums and signed manifest data, installs the CLI and node agent, then hands first-run setup to `opengpu install`. From there, contributors select a control plane, contribution cap, backend, and model path before starting the node.

## What This Repo Contains

- Static marketing pages for the public Nodara site.
- Public documentation pages generated from `docs/*.md`.
- Local and public install pages for the `opengpu` contributor CLI.
- Shell and PowerShell bootstrap installers.
- Build, watch, serve, and smoke-test scripts for the generated static site.
- Media assets used by the site, including responsive WebP variants, the Nodara mark, and favicon.

## Project Structure

```text
.
├── docs/                         # Source markdown for public docs pages
├── media/                        # Static HTML page sources and visual assets
├── scripts/                      # Site build, watch, and serve scripts
├── tests/                        # Static site smoke tests
├── dist/public-docs-site/        # Generated static site output
├── install.sh                    # macOS/Linux installer bootstrapper
├── install.ps1                   # Windows installer bootstrapper
├── docs-site.Dockerfile          # Container image for serving the generated site
└── package.json                  # Node scripts and dependencies
```

## Requirements

- Node.js
- npm
- Bash for the POSIX installer and shell tests
- PowerShell when testing the Windows installer path

Install dependencies:

```bash
npm install
```

## Development

Start a local docs-site watcher on port `3003`:

```bash
npm run dev
```

Build the static site:

```bash
npm run build:docs-site
```

Serve the generated site:

```bash
npm run serve:docs-site
```

Run the public docs-site smoke test:

```bash
npm run test:docs-site
```

## Generated Site

The build script writes the site to:

```text
dist/public-docs-site
```

Important generated routes include:

- `/` - public Nodara home page
- `/atlas/` - Atlas product page
- `/compute/` - contributor compute page
- `/network/` - network page
- `/developers/` - developer page
- `/docs/` - local docs preview
- `/public/docs/` - public endpoint mirror for docs
- `/public/install/` - public install surface
- `/public/release/` - public release surface

## Install Flow

The install docs and pages are designed around a localhost-first release preview during development, then a GitHub Releases-backed public flow later.

Local macOS/Linux preview command:

```bash
RELEASE_BASE_URL=http://127.0.0.1:8788/releases/latest/download bash install.sh
```

Local Windows preview command:

```powershell
.\install.ps1 -ReleaseBaseUrl http://127.0.0.1:8788/releases/latest/download
```

The current installer strategy is documented in [docs/install-strategy.md](docs/install-strategy.md). The install page behavior is documented in [docs/install-page.md](docs/install-page.md).

## Device Identity

Nodara contributor nodes use a stable device identity so a machine can be recognized across normal app reinstalls, OS updates, and restarts.

The current design stores signing material in encrypted-at-rest form and keeps raw private-key bytes out of normal CLI and agent records. Platform behavior differs by operating system:

- macOS uses Keychain when available, with a local encrypted fallback for constrained environments.
- Windows uses DPAPI-protected identity storage.
- Linux uses Secret Service when available, with a local encrypted fallback for local and UAT hosts.

See [docs/device-identity-lifecycle.md](docs/device-identity-lifecycle.md) for the full lifecycle.

## Release And Distribution Notes

The distribution plan favors signed native release assets instead of requiring users to install Rust, Node, or a development toolchain.

Primary release assets include:

- `opengpu` CLI binaries
- `opengpu-node-agent` binaries
- platform runtime bundles where required
- SHA-256 checksums
- a signed release manifest

See [docs/install-strategy.md](docs/install-strategy.md) for target platforms, Windows release requirements, manifest expectations, and future convenience channels such as Homebrew and WinGet.

## NPM Scripts

```bash
npm run dev              # Watch and rebuild the static site on port 3003
npm run build:docs-site  # Build dist/public-docs-site
npm run serve:docs-site  # Serve the generated site
npm run test:docs-site   # Run the public docs-site smoke test
```

## Notes For Contributors

- Keep installer commands in sync across `README.md`, `docs/install-page.md`, `docs/install-strategy.md`, `install.sh`, and `install.ps1`.
- Keep public-facing claims grounded in shipped or documented behavior.
- Do not add real-looking usage numbers, testimonials, compliance claims, or reward details unless there is a source for them in the project.
- Regenerate and smoke-test the site after changing page sources or generated docs behavior.
