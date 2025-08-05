import { ExtensionWithProvider } from "@/hooks/useExtensionRegistry";

interface OldExtension {
  name: string;
  slug: string;
  type: string;
  latest_version: string;
  core_compat: string[];
  description_short: string;
  description_long: string;
  provider: {
    name: string;
    url: string;
    logo: string | null;
  };
  repo_url: string;
  license: string;
  price: string;
  rating_avg: number | null;
  rating_count: number | null;
  install_notes: string;
  screenshots: string[];
}

interface OldRegistry {
  extensions: OldExtension[];
}

export async function convertRegistryData(): Promise<{ extensions: ExtensionWithProvider[] }> {
  // Load the old registry
  const response = await fetch('/registry.json');
  const oldRegistry: OldRegistry = await response.json();

  console.log(`Processing ${oldRegistry.extensions.length} extensions from registry`);

  // Convert extensions and extract providers
  const extensions: ExtensionWithProvider[] = oldRegistry.extensions.map((oldExt, index) => {
    console.log(`Processing extension ${index + 1}: ${oldExt.name}`);
    
    return {
      name: oldExt.name || 'Unknown Extension',
      slug: oldExt.slug || `unknown-${index}`,
      type: (oldExt.type === 'platform-native' || oldExt.type === 'platform-connector' || oldExt.type === 'courseware-native' || oldExt.type === 'courseware-connector') 
        ? oldExt.type as 'platform-addon' | 'external-tool' | 'operational-service'
        : 'platform-addon',
      latest_version: oldExt.latest_version || '',
      core_compat: Array.isArray(oldExt.core_compat) ? oldExt.core_compat : [],
      description_short: oldExt.description_short || '',
      description_long: oldExt.description_long || '',
      provider: {
        name: oldExt.provider?.name || 'Unknown Provider',
        url: oldExt.provider?.url || '',
        logo: oldExt.provider?.logo || '',
      },
      repo_url: oldExt.repo_url || '',
      license: oldExt.license || 'Unknown',
      price: (oldExt.price === 'free' || oldExt.price === 'paid') ? oldExt.price : 'free',
      rating_avg: oldExt.rating_avg,
      rating_count: oldExt.rating_count,
      install_notes: oldExt.install_notes || '',
      screenshots: Array.isArray(oldExt.screenshots) ? oldExt.screenshots : []
    };
  });

  console.log(`Converted ${extensions.length} extensions successfully`);
  return { extensions };
}