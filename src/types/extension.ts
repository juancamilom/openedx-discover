export interface Organization {
  id: string;
  name: string;
  url: string;
  logo: string | null;
  description?: string;
  contact_email?: string;
  social_links?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Extension {
  name: string;
  slug: string;
  type: 'platform-native' | 'platform-connector' | 'courseware-native' | 'courseware-connector';
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

export interface OrganizationRegistry {
  organizations: Organization[];
}

export interface FilterOptions {
  search: string;
  type: string;
  compatibility: string;
  license: string;
  price: string;
  provider: string;
}