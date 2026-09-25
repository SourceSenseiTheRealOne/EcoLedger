// Source-copy regression checks only: no browser, wallet or integration proof.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8').replace(/^\uFEFF/, '');
const component = (name) => read(`frontend/src/components/${name}.tsx`);

test('README names the prototype and separates source from deployed UI', () => {
  const source = read('README.md');
  assert.ok(source.startsWith('# EcoLedger — Sustainability Record Prototype\n'));
  assert.match(source, /self-reported.*not independently verified/);
  assert.match(source, /standalone NestJS API is not connected to the mounted catalog/);
  assert.match(source, /main.*builds.*blank.*`require is not defined`/);
  assert.match(source, /exact deployed frontend revision is unverified/);
  assert.match(source, /historical companion/);
  assert.doesNotMatch(source, /Hackathon 2024|Production version coming soon|licensed under the MIT/);
});

test('HTML metadata does not advertise environmental verification', () => {
  const source = read('frontend/index.html');
  assert.match(source, /<title>EcoLedger — Sustainability Record Prototype<\/title>/);
  assert.match(source, /content="Self-reported sustainability records on VeChain testnet; not independently verified\."/);
  assert.doesNotMatch(source, /eco-verification|Track and verify|Blockchain Sustainability Platform/);
});

test('quick start warns about the broken default-branch runtime', () => {
  const source = read('QUICK_START.md');
  assert.match(source, /require is not defined/);
  assert.match(source, /sanitized/);
  assert.match(source, /source-copy assertions/);
  assert.doesNotMatch(source, /up and running in 5 minutes|your-username|npm run deploy/);
});

test('the no-op form toast and button explicitly deny persistence', () => {
  const source = component('RegisterProductForm');
  assert.match(source, /title: "Demo only — not saved",\s*description: `\$\{formData.name\} was not saved; database registration is not implemented\.`/);
  assert.match(source, />\s*Demo only \(not saved\)\s*<\/Button>/);
  assert.match(source, /<CardDescription>\s*Self-reported inputs only\. Demo submit does not save; testnet submit does not confirm a receipt\./);
  assert.doesNotMatch(source, /has been added to the database|Product registered!|Register to Database/);
});

for (const path of ['frontend/src/pages/Dashboard.tsx', 'frontend/src/components/RegisterProductForm.tsx']) {
  test(`${path}: returned transaction ID is not a confirmation toast`, () => {
    const source = read(path);
    assert.match(source, /title: "Transaction ID returned — unconfirmed",\s*description: `Receipt not checked: \$\{txHash.slice\(0, 10\)\}\.\.\.`/);
    assert.doesNotMatch(source, /title: "Product Added to Blockchain!?"/);
  });
}

test('catalog and testnet cards label different units and score provenance', () => {
  const catalog = component('ProductCard');
  assert.match(catalog, /Illustrative score: \{getEcoScoreLabel\(ecoScore\)\}/);
  assert.match(catalog, />Illustrative emission factor<\/span>/);
  assert.match(catalog, /\{carbonFootprint\} kg CO₂\/kg/);
  assert.match(catalog, /Scan for local data, not proof of authenticity/);
  assert.doesNotMatch(catalog, /Scan to verify product authenticity|>Carbon Footprint</);
  const chain = component('BlockchainProductCard');
  assert.match(chain, /Illustrative score \(fixed\): \{getEcoScoreLabel\(ecoScore\)\}/);
  assert.match(chain, />Self-reported CO₂<\/span>/);
  assert.match(chain, /<strong>Unverified reference:<\/strong> Owner-supplied text, not a checked receipt\. Explorer lookup may fail\./);
  assert.doesNotMatch(chain, /Live Transaction:|This is a real VeChain testnet transaction/);
});

test('dashboard discloses mutable assertions and hardcoded scores beside records', () => {
  const source = read('frontend/src/pages/Dashboard.tsx');
  assert.match(source, /Sustainability Record Prototype/);
  assert.match(source, />Illustrative average score<\/p>/);
  assert.match(source, />Illustrative total \(units vary by tab\)<\/p>/);
  assert.match(source, /Self-reported records are owner-mutable, not independently verified sustainability\./);
  assert.match(source, /Scores here are hardcoded to 85; transaction references are not checked receipts\./);
  assert.doesNotMatch(source, /Live Blockchain Integration|All data is real|Carbon Tracked|Add from DB/);
});

test('onboarding and catalog explain local illustrative data and QR limits', () => {
  const welcome = component('WelcomeModal');
  assert.match(welcome, /Self-reported records, not verified sustainability/);
  assert.match(welcome, /Receipt confirmation is not implemented/);
  assert.match(welcome, /Records can be changed by their owner/);
  assert.match(welcome, /Catalog selections stay in memory; do not enter sensitive data/);
  assert.match(welcome, /QR codes contain sample or self-reported data, not verified product claims/);
  assert.doesNotMatch(welcome, /All your data is stored locally and securely|QR codes work offline for product verification/);
  assert.doesNotMatch(welcome, /complete transparency and verification|real carbon footprint data|immutable record|verify product authenticity|Live Blockchain:/);
  const selector = component('ProductSelector');
  assert.match(selector, /Bundled illustrative catalog; selections stay in memory, not a database\./);
  assert.doesNotMatch(selector, /from the database|in the database/);
});
