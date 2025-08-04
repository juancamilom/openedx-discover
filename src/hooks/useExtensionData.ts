import { useState, useEffect } from "react";
import { ExtensionRegistry, ProviderRegistry, ExtensionWithProvider } from "@/types/extension";

export function useExtensionData() {
  const [extensions, setExtensions] = useState<ExtensionWithProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both registry files
        const [extensionsResponse, providersResponse] = await Promise.all([
          fetch('/registry.json'),
          fetch('/providers.json')
        ]);

        if (!extensionsResponse.ok || !providersResponse.ok) {
          throw new Error('Failed to fetch registry data');
        }

        const extensionsData: ExtensionRegistry = await extensionsResponse.json();
        const providersData: ProviderRegistry = await providersResponse.json();

        // Create a map of providers for quick lookup
        const providersMap = new Map();
        providersData.providers.forEach(provider => {
          providersMap.set(provider.id, provider);
        });

        // Merge extensions with their provider data
        const extensionsWithProviders: ExtensionWithProvider[] = extensionsData.extensions.map(extension => {
          const provider = providersMap.get(extension.provider_id);
          if (!provider) {
            console.warn(`Provider not found for extension ${extension.slug}: ${extension.provider_id}`);
            // Fallback to unknown provider
            return {
              ...extension,
              provider: {
                id: 'unknown',
                name: 'Unknown Provider',
                type: 'organization' as const,
                specializations: [],
                verified: false
              }
            };
          }

          return {
            ...extension,
            provider
          };
        });

        setExtensions(extensionsWithProviders);
      } catch (err) {
        console.error('Failed to load extension data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { extensions, loading, error };
}