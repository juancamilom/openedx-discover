import { useQuery } from "@tanstack/react-query";
import { convertRegistryData } from "@/utils/registryConverter";

// Combined extension with provider info for backward compatibility
export interface ExtensionWithProvider {
  name: string;
  slug: string;
  type: 'platform-addon' | 'external-tool' | 'operational-service';
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
  price: 'free' | 'paid';
  rating_avg: number | null;
  rating_count: number | null;
  install_notes: string;
  screenshots: string[];
}

export function useExtensionRegistry() {
  return useQuery({
    queryKey: ["extensionRegistry"],
    queryFn: convertRegistryData,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}