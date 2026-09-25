# EcoLedger — Inspection Quick Start

**This is not a working-app setup promise.** The inspected default-branch frontend builds, then renders a blank page with `require is not defined`. Presentation changes do not repair that baseline. Do not connect a wallet or submit transactions to verify this slice.

## 1. Check presentation copy

From the repository root, using Node.js:

```bash
node --test scripts/test-presentation.mjs
```

These are dependency-free source-copy assertions. Passing them does not prove rendering, persistence, contract correctness or wallet confirmation.

## 2. Build a sanitized source export

Follow [local verification](docs/local-development.md) to export only the frontend paths, excluding environment files **before any content is read**. Then install from the unchanged lockfile and build inside that disposable export. Do not run the build in a checkout containing real environment values, copy those values, or add wallet credentials.

Expected results: the production build succeeds with a large-chunk warning; the production browser boot fails. The full [evidence summary](docs/evidence.md) records failing lint/typecheck and contract/API gates separately.

## 3. Read the system boundaries

- [Source architecture](docs/architecture.svg): bundled catalog, real testnet signing path and disconnected standalone API.
- [Engineering notes](docs/engineering.md): self-reported assertions, mutable ownership, illustrative factors/scores, no-op database submit and unchecked receipt lifecycle.
- [Project overview](README.md): owner-confirmed hackathon submission and historical companion repository.

The public Netlify site is a different asset set with an unverified source revision. It is not evidence that these setup commands produce a functioning app. Deployment, credential review, wallet testing and runtime repair require a separate scope.
