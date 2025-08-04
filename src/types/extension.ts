export interface Provider {
  id: string;
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  website?: string;
  contact_email?: string;
  founded?: string;
  headquarters?: string;
  type: "organization" | "individual" | "community";
  specializations: string[];
  verified: boolean;
}

export interface Extension {
  name: string;
  slug: string;
  type: 'platform-addon' | 'external-tool' | 'operational-service';
  latest_version: string;
  core_compat: string[];
  description_short: string;
  description_long: string;
  provider_id: string; // Reference to provider ID instead of embedded object
  repo_url: string;
  license: string;
  price: 'free' | 'paid';
  rating_avg: number;
  rating_count: number;
  install_notes: string;
  screenshots: string[];
}

export interface ExtensionWithProvider extends Omit<Extension, 'provider_id'> {
  provider: Provider;
}

export interface ExtensionRegistry {
  version: string;
  last_updated: string;
  extensions: Extension[];
}

export interface ProviderRegistry {
  version: string;
  last_updated: string;
  providers: Provider[];
}

export interface FilterOptions {
  search: string;
  type: string;
  compatibility: string;
  license: string;
  rating: string;
  provider: string;
}