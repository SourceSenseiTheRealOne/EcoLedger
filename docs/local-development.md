# Local verification, not a working-app promise

[Overview](../README.md) · [Gate results](evidence.md)

The production frontend build succeeds on the inspected toolchain, but the browser fails with `require is not defined`. The commands below reproduce a build safely; they do **not** establish a functioning app. Do not repair bundler packages, connect a wallet or deploy as part of presentation verification.

## Source-copy checks

From the repository root, with Node.js available:

```bash
node --test scripts/test-presentation.mjs
```

No install or environment file is needed. Only explicitly named Markdown/HTML/React source files are read by these tests. They are source-copy assertions, not behavioral integration tests.

## Export before installing

Use an existing source checkout. Do not copy real environment values or run package commands in a credential-bearing checkout. The following Bash + Node recipe exports only Git-tracked frontend paths from the working tree to a new disposable directory. It filters environment filenames **before** reading any file contents, and exports no Git history. Existing files in the checkout are not deleted or changed.

Set `TMPDIR` to your owned scratch directory first. The command requires it rather than choosing a shared location. Paths with spaces are supported.

```bash
export ECOLEDGER_CHECK="$(node --input-type=module <<'NODE'
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
if (!process.env.TMPDIR) throw new Error('Set TMPDIR to an owned scratch directory');
const target = mkdtempSync(join(process.env.TMPDIR, 'ecoledger-check-'));
const paths = execFileSync('git', ['ls-files', '-z', '--', 'frontend'], { encoding: 'utf8' }).split('\0').filter(Boolean);
for (const path of paths) {
  const name = basename(path);
  if (name.startsWith('.env') || name.endsWith('.env') || name === 'env.example') continue;
  const out = join(target, path.slice('frontend/'.length));
  mkdirSync(dirname(out), { recursive: true });
  copyFileSync(path, out);
}
console.log(target);
NODE
)"
```

Then, in that sanitized export only:

```bash
cd "$ECOLEDGER_CHECK"
npm ci --ignore-scripts --no-audit --no-fund
npm run build
```

The prior locked Linux verification used Node 22.23.3 / npm 10.9.9. No exact Node pin exists in the project. Installs do not upgrade the lockfile; disabled lifecycle scripts are intentional. Do not create or populate an environment file. The mounted service already names the public testnet endpoint/address in source.

## Optional disconnected browser diagnostic

Use a free loopback port in the sanitized export:

```bash
npm run preview -- --host 127.0.0.1 --port 4365 --strictPort
```

Open `http://127.0.0.1:4365/` in a disposable browser profile with no wallet or user session. The accepted production baseline is an empty root and `ReferenceError: require is not defined`, not a successful UI journey. Stop the preview with Ctrl+C and verify the port is closed. No form entry, wallet connection or signing is necessary. Keep this failure as evidence; do not insert a CommonJS shim to make the check appear green.

## Optional baseline diagnostics

Run separately so a failing gate cannot be hidden by a later successful command:

```bash
npm run lint
./node_modules/.bin/tsc --noEmit -p tsconfig.app.json
./node_modules/.bin/tsc --noEmit -p tsconfig.node.json
```

Expected baseline: lint and application types fail; tooling types pass. There is no `npm run type-check` script. See [the exact results](evidence.md).

API/contracts commands in the evidence table describe prior sanitized runs, not instructions to load those packages' environment files or redeploy. Several historical package scripts target absent files. A future API/contract verification or wallet exercise needs its own isolated scope. Preserve original artifacts and the separate `online-version` branch.
