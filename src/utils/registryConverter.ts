import { Extension, ExtensionRegistry, Provider, ProviderRegistry } from "@/types/extension";
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
    logo: string;
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

  // Create providers map to track unique providers
  const providersMap = new Map<string, Provider>();
  let providerId = 1;

  // Convert extensions and extract providers
  const extensions: ExtensionWithProvider[] = oldRegistry.extensions.map(oldExt => {
    // Generate a provider ID based on name
    const providerKey = oldExt.provider?.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'unknown';
    
    if (!providersMap.has(providerKey) && oldExt.provider) {
      providersMap.set(providerKey, {
        id: providerKey,
        name: oldExt.provider.name || 'Unknown Provider',
        url: oldExt.provider.url || '',
        logo: oldExt.provider.logo || '',
        description: `Provider: ${oldExt.provider.name || 'Unknown'}`
      });
    }

    return {
      name: oldExt.name,
      slug: oldExt.slug,
      type: oldExt.type as 'platform-addon' | 'external-tool' | 'operational-service',
      latest_version: oldExt.latest_version,
      core_compat: oldExt.core_compat,
      description_short: oldExt.description_short,
      description_long: oldExt.description_long,
      provider: {
        name: oldExt.provider?.name || 'Unknown Provider',
        url: oldExt.provider?.url || '',
        logo: oldExt.provider?.logo || '',
      },
      repo_url: oldExt.repo_url,
      license: oldExt.license,
      price: oldExt.price as 'free' | 'paid',
      rating_avg: oldExt.rating_avg,
      rating_count: oldExt.rating_count,
      install_notes: oldExt.install_notes,
      screenshots: oldExt.screenshots
    };
  });

  return { extensions };
}