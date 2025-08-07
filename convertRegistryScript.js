// This script converts the registry.json file to use provider_id instead of provider objects
// Run with: node convertRegistryScript.js

import fs from 'fs';

const providerMapping = {
  "Open edX / Axim Collaborative": "open-edx-axim",
  "Axim collaborative": "open-edx-axim", 
  "Raccoon Gang": "raccoon-gang",
  "Overhang.io": "overhang-io",
  "Overhang.IO": "overhang-io",
  "OpenCraft": "opencraft",
  "edunext": "edunext",
  "eduNEXT": "edunext",
  "Appsembler": "appsembler",
  "edly": "edly",
  "hastexo": "hastexo",
  "MIT xPRO": "mitxpro",
  "MIT Office of distant learning": "mitxpro",
  "Stanford Online": "stanford-online",
  "Microsoft": "microsoft",
  "Google": "google",
  "IntelliBoard": "intelliboard",
  "Proversity": "proversity",
  "Triboo": "triboo",
  "HarvardX": "harvard",
  "openfun": "openfun",
  "Universidad de Chile": "universidad-chile",
  "Examus Inc": "examus",
  "Open learning initiative": "oli",
  "Jazkarta": "jazkarta",
  "IBL education": "ibl-education",
  "UBC - University of British Columbia": "ubc",
  "Abstract-Technology": "abstract-technology",
  "edX.org": "edx-org"
};

function getProviderId(providerName) {
  return providerMapping[providerName] || providerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Read current registry
const registry = JSON.parse(fs.readFileSync('./public/registry.json', 'utf8'));

console.log(`Converting ${registry.extensions.length} extensions...`);

// Convert each extension
const convertedExtensions = registry.extensions.map((ext, index) => {
  console.log(`Converting ${index + 1}: ${ext.name}`);
  
  const providerId = getProviderId(ext.provider?.name || 'unknown');
  
  // Return extension with provider_id instead of provider object
  const { provider, ...rest } = ext;
  return { ...rest, provider_id: providerId };
});

// Write converted registry
const newRegistry = { extensions: convertedExtensions };
fs.writeFileSync('./public/registry.json', JSON.stringify(newRegistry, null, 2));

console.log('✅ Registry converted successfully!');
console.log('Extensions now use provider_id instead of provider objects.');