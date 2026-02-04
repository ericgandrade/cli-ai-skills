/**
 * Bundles command - install curated skill collections
 */

const fs = require('fs');
const path = require('path');

function loadBundles() {
  const bundlesPath = path.join(__dirname, '../../bundles.json');
  try {
    return JSON.parse(fs.readFileSync(bundlesPath, 'utf8'));
  } catch (e) {
    console.error('❌ bundles.json not found');
    process.exit(1);
  }
}

function listBundles() {
  const bundles = loadBundles();
  console.log('\n📦 Available Bundles:\n');
  
  for (const [key, bundle] of Object.entries(bundles.bundles)) {
    console.log(`  ${key.padEnd(15)} - ${bundle.name}`);
    console.log(`  ${' '.repeat(17)}${bundle.description}`);
    console.log(`  ${' '.repeat(17)}Skills: ${bundle.skills.join(', ')}\n`);
  }
}

function validateBundle(bundleName) {
  const bundles = loadBundles();
  if (!bundles.bundles[bundleName]) {
    console.error(`❌ Bundle '${bundleName}' not found`);
    console.log('\nAvailable bundles:');
    Object.keys(bundles.bundles).forEach(b => console.log(`  - ${b}`));
    process.exit(1);
  }
  return bundles.bundles[bundleName];
}

module.exports = {
  loadBundles,
  listBundles,
  validateBundle
};
