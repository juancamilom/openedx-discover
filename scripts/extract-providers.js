// Script to extract providers from registry.json and create new structure
const fs = require('fs');
const path = require('path');

// Read the current registry
const registryPath = path.join(__dirname, '../public/registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

// Extract unique providers
const providersMap = new Map();
const extensions = [];

let providerIdCounter = 1;

registry.extensions.forEach(extension => {
  const provider = extension.provider;
  
  // Create a unique key for the provider based on name and URL
  const providerKey = `${provider.name.toLowerCase().trim()}-${provider.url || ''}`;
  
  let providerId;
  if (providersMap.has(providerKey)) {
    // Provider already exists, get its ID
    providerId = providersMap.get(providerKey).id;
  } else {
    // New provider, create entry
    providerId = `provider-${providerIdCounter++}`;
    providersMap.set(providerKey, {
      id: providerId,
      name: provider.name,
      url: provider.url,
      logo: provider.logo,
      description: null, // Can be added later with more detailed info
      website: provider.url,
      contact_email: null,
      founded: null,
      headquarters: null,
      type: "organization", // Can be "organization", "individual", "community"
      specializations: [],
      verified: false
    });
  }
  
  // Create extension without provider object, just provider_id
  const newExtension = {
    ...extension,
    provider_id: providerId
  };
  delete newExtension.provider;
  
  extensions.push(newExtension);
});

// Convert providers map to array
const providers = Array.from(providersMap.values());

// Create new registry structure
const newRegistry = {
  version: "2.0",
  last_updated: new Date().toISOString(),
  extensions: extensions
};

const providersRegistry = {
  version: "1.0", 
  last_updated: new Date().toISOString(),
  providers: providers
};

// Write new files
fs.writeFileSync(
  path.join(__dirname, '../public/registry.json'), 
  JSON.stringify(newRegistry, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, '../public/providers.json'), 
  JSON.stringify(providersRegistry, null, 2)
);

console.log(`✅ Extracted ${providers.length} unique providers from ${extensions.length} extensions`);
console.log(`📁 Created public/providers.json and updated public/registry.json`);

// Output stats
console.log('\nProvider statistics:');
providers.forEach(provider => {
  const extensionCount = extensions.filter(ext => ext.provider_id === provider.id).length;
  console.log(`  - ${provider.name}: ${extensionCount} extension(s)`);
});