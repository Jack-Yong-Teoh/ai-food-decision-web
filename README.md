# AI Food Decision Web

Next.js web application for AI-powered food decision making.

## 1. Prerequisites

Make sure you have these tools installed on your machine:

- Node.js `v23.2.0`
- Yarn Classic `v1.22.22`

> Current verified local setup:
>
> - `node --version` -> `v23.2.0`
> - `yarn --version` -> `1.22.22`

## 2. Install Node.js (macOS)

Install Node.js using the official installer or Homebrew. Do not use `nvm`.

Option A — Official Node.js installer (recommended for exact version):

1. Open https://nodejs.org/en/download/ and download the macOS installer for **v23.2.0** (or the closest matching version).
2. Run the installer and follow the prompts.

Verify:

```bash
node --version
```

Expected output:

```bash
v23.2.0
```

Option B — Homebrew (if you prefer Homebrew-managed packages):

```bash
brew install node
```

Note: Homebrew may install a different Node.js version. If you must match `v23.2.0` exactly, use the official installer.

## 3. Install Yarn Classic (v1) using npm

Install Yarn globally with `npm`, then use Yarn for all project commands.

```bash
npm install -g yarn@1.22.22
```

Verify:

```bash
yarn --version
```

Expected output:

```bash
1.22.22
```

## 4. Clone and open the project

```bash
git clone <your-repo-url>
cd ai-food-decision-web
```

## 5. Install dependencies

```bash
yarn install
```

## 6. Start development server

```bash
yarn dev
```

You should see the app running at:

- [http://localhost:3888](http://localhost:3888)

Open that URL in your browser to view the app.

## 7. Common commands (Yarn only)

```bash
yarn dev      # Start local development server
yarn build    # Build for production
yarn start    # Run production build
yarn lint --fix     # Run linter
```

## Troubleshooting

1. Wrong Node version:

```bash
nvm use 23.2.0
node --version
```

2. Yarn command not found:

```bash
npm install -g yarn@1.22.22
yarn --version
```

3. Dependency issues after switching Node version:

```bash
rm -rf node_modules yarn.lock
yarn install
```
