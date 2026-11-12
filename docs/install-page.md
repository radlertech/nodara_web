# Install Nodara Compute

Open [the public install page](/public/install/) and choose your operating system. A link from the Compute page selects Windows, macOS, or Linux and starts the matching installer download. The page also has a download button if the browser blocks automatic downloads.

The browser decides where files are saved. The commands below assume its usual Downloads folder; use the actual download location if yours differs.

## Windows

The page downloads `install.ps1` for 64-bit Windows 10 or 11.

### 1. Open PowerShell

### 2. Run the installer

```powershell
cd "$HOME\Downloads"
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

### 3. Finish setup

Follow the guided setup that opens after the installer finishes.

## macOS

The current public Mac release supports Apple Silicon. The page downloads `install.sh`.

### 1. Open Terminal

### 2. Run the installer

```bash
bash ~/Downloads/install.sh
```

### 3. Set up your node

Run `opengpu install` to choose your control plane, contribution cap, and model. Run `opengpu start` when you are ready.

## Linux

The page downloads `install.sh` for supported x86-64 and ARM64 systems.

### 1. Open Terminal

### 2. Run the installer

```bash
bash ~/Downloads/install.sh
```

### 3. Set up your node

Run `opengpu install` to choose your control plane, contribution cap, and model. Run `opengpu start` when you are ready.

The installer scripts download release assets and verify their checksums and signed manifest before installation. Some verified release files still carry legacy filenames. The [release page](/public/release/) shows the current release source. A local preview of the same install page is available at `/install/`.
