import fs from 'fs';

// Enhanced provider detection based on content analysis
function detectProviderFromContent(extension) {
  const { repo_url, description_short, description_long, install_notes, screenshots, name } = extension;
  
  // Combine all text content for analysis
  const allText = [description_short, description_long, install_notes, name].join(' ').toLowerCase();
  const repoUrl = (repo_url || '').toLowerCase();
  const screenshotUrls = (screenshots || []).join(' ').toLowerCase();
  
  // Provider detection rules based on content
  const detectionRules = [
    // Official Open edX / Axim
    {
      id: 'open-edx-axim',
      conditions: [
        () => repoUrl.includes('github.com/openedx/'),
        () => allText.includes('official') && (allText.includes('open edx') || allText.includes('openedx')),
        () => name.toLowerCase().includes('open edx') && !allText.includes('raccoon'),
        () => allText.includes('axim collaborative'),
        () => repoUrl.includes('openedx.org'),
      ]
    },
    // Raccoon Gang
    {
      id: 'raccoon-gang',
      conditions: [
        () => allText.includes('raccoon gang') || allText.includes('raccoong'),
        () => screenshotUrls.includes('raccoongang') || screenshotUrls.includes('rocketcdn.me'),
        () => name.toLowerCase().includes('mobile app') && allText.includes('raccoon'),
      ]
    },
    // Overhang.io
    {
      id: 'overhang-io',
      conditions: [
        () => repoUrl.includes('overhang.io'),
        () => screenshotUrls.includes('overhang.io'),
        () => allText.includes('overhang.io'),
        () => name.toLowerCase().includes('cairn'),
      ]
    },
    // OpenCraft
    {
      id: 'opencraft',
      conditions: [
        () => repoUrl.includes('open-craft') || repoUrl.includes('opencraft'),
        () => screenshotUrls.includes('open-craft'),
        () => allText.includes('opencraft') || allText.includes('open-craft'),
      ]
    },
    // eduNEXT
    {
      id: 'edunext',
      conditions: [
        () => allText.includes('edunext') || allText.includes('edu next'),
        () => screenshotUrls.includes('edunext.co'),
        () => name.toLowerCase().startsWith('eox'),
      ]
    },
    // Appsembler
    {
      id: 'appsembler',
      conditions: [
        () => allText.includes('appsembler'),
        () => repoUrl.includes('appsembler'),
        () => screenshotUrls.includes('appsembler'),
      ]
    },
    // edly
    {
      id: 'edly',
      conditions: [
        () => allText.includes('edly'),
        () => repoUrl.includes('edly'),
      ]
    },
    // hastexo
    {
      id: 'hastexo',
      conditions: [
        () => allText.includes('hastexo'),
        () => repoUrl.includes('hastexo'),
      ]
    },
    // MIT xPRO
    {
      id: 'mitxpro',
      conditions: [
        () => allText.includes('mit xpro') || allText.includes('mitxpro'),
        () => allText.includes('mit office of distant learning'),
      ]
    },
    // Stanford Online
    {
      id: 'stanford-online',
      conditions: [
        () => allText.includes('stanford'),
      ]
    },
    // Microsoft
    {
      id: 'microsoft',
      conditions: [
        () => allText.includes('microsoft'),
      ]
    },
    // Google
    {
      id: 'google',
      conditions: [
        () => allText.includes('google'),
      ]
    },
    // IntelliBoard
    {
      id: 'intelliboard',
      conditions: [
        () => allText.includes('intelliboard'),
      ]
    },
    // Proversity
    {
      id: 'proversity',
      conditions: [
        () => allText.includes('proversity'),
      ]
    },
    // Harvard
    {
      id: 'harvard',
      conditions: [
        () => allText.includes('harvard'),
      ]
    },
    // OpenFUN
    {
      id: 'openfun',
      conditions: [
        () => allText.includes('openfun'),
        () => allText.includes('fun-mooc'),
      ]
    }
  ];
  
  // Check each provider rule
  for (const rule of detectionRules) {
    if (rule.conditions.some(condition => condition())) {
      return rule.id;
    }
  }
  
  return 'unknown';
}

// Read current registry
const registry = JSON.parse(fs.readFileSync('./public/registry.json', 'utf8'));

console.log('Fixing provider_ids for extensions with "unknown" provider...');

let fixedCount = 0;
const fixedExtensions = registry.extensions.map(ext => {
  if (ext.provider_id === 'unknown') {
    const detectedProvider = detectProviderFromContent(ext);
    if (detectedProvider !== 'unknown') {
      console.log(`✅ Fixed ${ext.name}: unknown → ${detectedProvider}`);
      fixedCount++;
      return { ...ext, provider_id: detectedProvider };
    } else {
      console.log(`❌ Could not detect provider for: ${ext.name}`);
    }
  }
  return ext;
});

// Write updated registry
const updatedRegistry = { extensions: fixedExtensions };
fs.writeFileSync('./public/registry.json', JSON.stringify(updatedRegistry, null, 2));

console.log(`\n🎉 Fixed ${fixedCount} extensions with correct provider_ids!`);
console.log('Registry updated successfully.');