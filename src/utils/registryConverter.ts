import { ExtensionWithProvider } from "@/hooks/useExtensionRegistry";
import { getProviderIdFromName } from "./providerMapping";

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
  // Load the registry and providers
  const [registryResponse, providersResponse] = await Promise.all([
    fetch('/registry.json'),
    fetch('/providers.json')
  ]);
  
  const oldRegistry: OldRegistry = await registryResponse.json();
  const providersData = await providersResponse.json();

  console.log(`Processing ${oldRegistry.extensions.length} extensions from registry`);

  // Convert extensions and join with provider data
  const extensions: ExtensionWithProvider[] = oldRegistry.extensions.map((oldExt, index) => {
    console.log(`Processing extension ${index + 1}: ${oldExt.name}`);
    
    // Get provider ID from the provider name
    const providerId = getProviderIdFromName(oldExt.provider?.name || 'unknown');
    
    // Find provider data by ID
    const providerData = providersData.providers.find((p: any) => p.id === providerId) || {
      name: oldExt.provider?.name || 'Unknown Provider',
      url: oldExt.provider?.url || '',
      logo: oldExt.provider?.logo || ''
    };
    
    return {
      name: oldExt.name || 'Unknown Extension',
      slug: oldExt.slug || `unknown-${index}`,
      category: (oldExt.type === 'platform-native' || oldExt.type === 'platform-connector' || oldExt.type === 'courseware-native' || oldExt.type === 'courseware-connector') 
        ? oldExt.type as 'platform-addon' | 'external-tool' | 'operational-service'
        : 'platform-addon',
      type: '',
      latest_version: oldExt.latest_version || '',
      core_compat: Array.isArray(oldExt.core_compat) ? oldExt.core_compat : [],
      description_short: oldExt.description_short || '',
      description_long: oldExt.description_long || '',
      provider: {
        name: providerData.name,
        url: providerData.url,
        logo: providerData.logo,
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