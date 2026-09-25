# Evidence and known failures

[Overview](../README.md) · [Engineering](engineering.md) · [Local verification](local-development.md)

## Scope of the evidence

Baseline inspection was pinned to `main` at `4fe2226cce89aa00f84ef9ad21100a0e23297a25`. The presentation refresh changes documentation and visible copy only; it does not upgrade dependencies, fix runtime behavior or alter the registry. The owner confirmed hackathon submission; no event, year or award evidence was supplied.

A locked install used Node **22.23.3** / npm **10.9.9** in `node:22-bookworm-slim`, image digest `sha256:43ac6c60b8f89723f746e8a92ce91abd5017e627ce1ddfe4238355d3a30b772c`. This is an observed verification toolchain, not a project version pin. Lifecycle scripts were disabled. Environment files were omitted before content access and never supplied to runtimes. Raw baseline logs were retained outside Git for review; the results below distinguish prior evidence from presentation-only checks.

## Baseline gates (not repaired)

| Area / command | Observed result |
| --- | --- |
| Frontend `npm run build` | Pass, with large bundle warning. This is not browser success. |
| Production build in isolated Edge, desktop/mobile | Blank root; `ReferenceError: require is not defined` at bundled `require("blakejs")`. HTML/JS/CSS returned HTTP 200. |
| Frontend `npm run lint` | Fail: 17 errors, 8 warnings. |
| Frontend `tsc --noEmit -p tsconfig.app.json` | Fail: 9 diagnostics, including incompatible/missing fields and SDK types. |
| Frontend `tsc --noEmit -p tsconfig.node.json` | Pass for tooling configuration only. |
| Frontend application tests | No existing application test suite or test script on the baseline. New presentation checks are source-copy assertions only. |
| Standalone API `npm run build` | Pass. |
| API `npm test -- --runInBand` | Fail: no tests found, not a passing suite. |
| API `npm run test:e2e -- --runInBand` | Fail: configured `test/jest-e2e.json` is absent. |
| API direct ESLint, without the package script's `--fix` | Fail: no ESLint configuration file. |
| Contracts `npm run compile` | Pass; three Solidity files compiled for Paris. |
| Contracts `npm test` | **5 passing / 12 failing**: tests call four-argument registration while the current contract requires five. |

A prior isolated API probe observed `/products` returning 16 entries, `/products/emission-factors` returning an empty body, and calculations accepting negative/missing/string inputs. The pure frontend calculation probe also exposed invalid-input acceptance and different score results between helpers. These probe observations are not a maintained integration suite.

Dependency audits reported unresolved findings in each package tree. Build success does not resolve those findings. No dependency or audit remediation is part of this slice. No checked-in GitHub Actions test pipeline was found on the inspected base.

## Testnet proof — narrower than product verification

Active registry: `0x92e647e3bc952154e8336673c4acd1acdcbe63eb` on VeChain **testnet**, as used by the [mounted service](../frontend/src/services/vechain-dappkit.ts).

Prior independent, read-only inspection established:

1. Account/code reads returned executable contract code: **9,427 runtime bytes**, SHA-256 `cdd1cc19df49547f2df5f1fe831f5735758c9242d24b2c94463df4d17ba9fb7b`.
2. Those bytes exactly matched the committed [EcoLedger artifact](../contracts/artifacts/contracts/EcoLedger.sol/EcoLedger.json).
3. Official solc **0.8.20**, optimizer **200** runs, **Paris** target reproduced the exact runtime from the committed original build-info, including its **CRLF** source bytes.
4. Fresh compilation of current **LF** contract source with locked OpenZeppelin **5.4.0** dependencies matched the **9,374-byte executable body**, excluding the **53-byte Solidity metadata trailer**. Full runtime bytes differ because of source line-ending metadata. This is executable parity, not byte-exact current-source parity.

The build-info files remain in [contracts/artifacts/build-info](../contracts/artifacts/build-info). Historical [deployment records](../contracts/deployments) include other addresses; they are not substituted for the active-address evidence.

This proves code presence and source correspondence, **not** environmental truth, wallet confirmation or successful use of the current frontend. No wallet connection, signing, funding or transaction submission was used in this verification. The presentation refresh does not rerun the unchanged chain/compiler probes.

## Public UI is a different evidence set

The [Netlify site](https://ecoledger-dapp.netlify.app/) rendered during prior anonymous desktop/mobile inspection. Its JavaScript assets differed from the main build. The exact deployed frontend revision is **unverified**. Additional bundler changes exist on `online-version`, but that is not proof that this branch is the live source; it remains untouched.

The public UI inspection also found crowded mobile tabs, registration-form horizontal overflow and an ineffective empty-state catalog shortcut. No public form was submitted and no wallet was connected. Do not use that site as proof of these candidate labels, a healthy main build or a confirmed transaction lifecycle.

## Presentation checks

`node --test scripts/test-presentation.mjs` checks exact title, disclaimer, card, onboarding and toast snippets in source. A disclaimer elsewhere cannot satisfy the no-persistence or unconfirmed-transaction toast checks. It does not execute handlers, certify accessibility or replace product tests. The source architecture graphic is used instead of a misleading working-app screenshot.

Credential/history review and repository-wide licensing remain outside scope. Existing environment values, Git entries and historical proof artifacts are untouched.
