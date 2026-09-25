# Engineering boundaries

[Overview](../README.md) · [Evidence](evidence.md) · [Local verification](local-development.md)

## Mounted frontend path

[App.tsx](../frontend/src/App.tsx) configures React Query, React Router and DAppKit for VeChain testnet. `/` mounts [Dashboard](../frontend/src/pages/Dashboard.tsx); other routes use NotFound. This describes the source wiring, not a successful browser boot: the inspected `main` bundle throws `require is not defined`.

[ProductSelector](../frontend/src/components/ProductSelector.tsx) → [useProducts](../frontend/src/hooks/useProducts.ts) → [api.ts](../frontend/src/services/api.ts) → [local-api.ts](../frontend/src/services/local-api.ts) is the active catalog path. It uses 16 bundled products, not HTTP calls to NestJS. Selection lives in React state. The onboarding flag uses localStorage; it is not product persistence.

The mounted [RegisterProductForm](../frontend/src/components/RegisterProductForm.tsx) receives `onSubmit={() => {}}`. Its demo action validates, invokes that no-op callback and resets the form. The corrected toast says **not saved**; it does not add storage. No database registration endpoint is called.

## Numbers are assertions, not environmental evidence

- Catalog `carbonFootprint` is actually assigned the emission factor (`kg CO₂/kg`). The label is corrected, but the property name and algorithm are unchanged.
- Catalog EcoScore is a piecewise heuristic over that factor. No lifecycle-assessment methodology, measurement evidence or certification validates it.
- [useBlockchain](../frontend/src/hooks/useBlockchain.ts) assumes a 1 kg product and submits `floor(weight * ef * 1000)` claimed grams. The custom form reuses its entered CO₂ value as `ef`, preserving the same ambiguity.
- Retrieved testnet products receive a hardcoded EcoScore of **85**, with estimated best/worst bounds. The contract has no EcoScore field. A user-entered score or notes are not persisted on chain by this path.
- Dashboard totals add the existing `carbonFootprint` values: factors for catalog selection, claimed kilograms for testnet records. The copy labels these illustrative and unit-dependent; they are not a common footprint measure or carbon savings. No values were replaced with fabricated zeros.
- Local and standalone API calculation helpers use `weightKg * factor * 1000 + packagingG + transportG`. They are separate from the mounted catalog score path and lack robust input validation.

## Real signing code, incomplete confirmation

Dashboard/form → `useBlockchain` → [vechain-dappkit.ts](../frontend/src/services/vechain-dappkit.ts) calls `connex.vendor.sign('tx', [clause]).request()` against the real registry. The active registration route is not the random mock-write implementation found in dormant `vechain-simple.ts`.

The service accepts a returned `txid`, then requests another signed transaction to update the stored reference. Failure of that second operation is swallowed. There is no awaited receipt, revert-status check or event-to-product confirmation before the success path. The hook timeout does not cancel an underlying wallet operation. Copy now says **unconfirmed**; the transaction behavior is unchanged and was not exercised for this refresh.

Wallet readback uses `getWalletProducts`, but failures can be converted to an empty array. Global-statistics and alternative service/ABI paths include stale shapes. These are not an independently verified ingestion pipeline.

## Registry authority is not certification

[EcoLedger.sol](../contracts/contracts/EcoLedger.sol) lets any address register a globally unique product ID. Only the registering address may update that record's CO₂ value or nonempty transaction-reference string. A wallet is not a certified company identity. Reused catalog IDs can collide across wallets.

Owner-mutable records can coexist with durable transaction history. Neither proves an environmental assertion. There is no measurement oracle, independent verifier, certificate authority or carbon-credit mechanism in this path. Global scans and unpaginated reads also limit scale.

Catalog QR codes encode local JSON. Testnet QR codes use owner-supplied reference text for explorer URLs, except for two sentinel values. A `pending_...` placeholder is not excluded. The corrected copy warns that lookup can fail; it does not change QR payloads or reference handling.

## Standalone API — no frontend connection

The [Nest app module](../backend/api/src/app.module.ts) composes product and CO₂ modules. [ProductsService](../backend/api/src/products/products.service.ts) uses in-memory arrays, not a database. Controllers expose reads and calculations, without an authentication/persistence layer. CORS is not authorization.

The literal `/products/emission-factors` route is shadowed by the earlier `:id` route. Calculation endpoints accept invalid input types and negative quantities. The prior synthetic probe and missing-test results are summarized in [evidence](evidence.md); these are retained defects, not an invitation to connect the UI to the API.

![Source architecture and truth boundaries](architecture.svg)
