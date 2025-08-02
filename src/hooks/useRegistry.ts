import { useState, useEffect } from 'react';
import { Extension, ExtensionRegistry, Organization, OrganizationRegistry } from '@/types/extension';

export interface ExtensionWithProvider extends Extension {
  provider: Organization;
}

export function useRegistry() {
  const [extensions, setExtensions] = useState<ExtensionWithProvider[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRegistry() {
      try {
        // Load both registries in parallel
        const [extensionsResponse, organizationsResponse] = await Promise.all([
          fetch('/registry.json'),
          fetch('/organizations.json')
        ]);

        const extensionsData: ExtensionRegistry = await extensionsResponse.json();
        const organizationsData: OrganizationRegistry = await organizationsResponse.json();

        // Create a map for quick organization lookup
        const orgMap = new Map<string, Organization>();
        organizationsData.organizations.forEach(org => {
          orgMap.set(org.id, org);
        });

        // Join extensions with their providers
        const extensionsWithProviders: ExtensionWithProvider[] = extensionsData.extensions.map(extension => {
          const provider = orgMap.get(extension.provider_id);
          if (!provider) {
            throw new Error(`Provider with id "${extension.provider_id}" not found for extension "${extension.name}"`);
          }
          return {
            ...extension,
            provider
          };
        });

        setExtensions(extensionsWithProviders);
        setOrganizations(organizationsData.organizations);
      } catch (err) {
        console.error('Failed to load registry:', err);
        setError(err instanceof Error ? err.message : 'Failed to load registry');
      } finally {
        setLoading(false);
      }
    }

    loadRegistry();
  }, []);

  return { extensions, organizations, loading, error };
}