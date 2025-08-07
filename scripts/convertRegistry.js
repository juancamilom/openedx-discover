const fs = require('fs');
const path = require('path');

// Provider name to ID mapping
const providerNameToIdMap = {
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
  "edX.org": "edx-org",
};

function getProviderIdFromName(providerName) {
  return providerNameToIdMap[providerName] || providerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Read the current registry
const registryPath = path.join(__dirname, '../public/registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

console.log(`Converting ${registry.extensions.length} extensions...`);

// Convert each extension
const convertedExtensions = registry.extensions.map((extension, index) => {
  console.log(`Converting extension ${index + 1}: ${extension.name}`);
  
  const providerId = getProviderIdFromName(extension.provider?.name || 'unknown');
  
  // Create new extension object with provider_id instead of provider object
  const { provider, ...extensionWithoutProvider } = extension;
  
  return {
    ...extensionWithoutProvider,
    provider_id: providerId
  };
});

// Create the new registry structure
const newRegistry = {
  extensions: convertedExtensions
};

// Write the converted registry
fs.writeFileSync(registryPath, JSON.stringify(newRegistry, null, 2));

console.log(`Successfully converted ${convertedExtensions.length} extensions!`);
console.log('Registry now uses provider_id instead of provider objects.');