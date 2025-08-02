export interface Extension {
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
  rating_avg: number;
  rating_count: number;
  install_notes: string;
  screenshots: string[];
}

export interface ExtensionRegistry {
  extensions: Extension[];
}

export interface FilterOptions {
  search: string;
  type: string;
  compatibility: string;
  license: string;
  price: string;
  provider: string;
}