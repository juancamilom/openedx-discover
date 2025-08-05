export interface Provider {
  id: string;
  name: string;
  url: string;
  logo: string;
  description: string;
}

export interface Extension {
  name: string;
  slug: string;
  type: 'platform-addon' | 'external-tool' | 'operational-service';
  latest_version: string;
  core_compat: string[];
  description_short: string;
  description_long: string;
  provider_id: string;
  repo_url: string;
  license: string;
  price: 'free' | 'paid';
  rating_avg: number;
  rating_count: number;
  install_notes: string;
  screenshots: string[];
}

export interface ExtensionRegistry {
  extensions: Extension[];
}

export interface ProviderRegistry {
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