import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOptions } from "@/types/extension";
import { Filter, X } from "lucide-react";

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: string) => void;
  onClearFilters: () => void;
  resultCount: number;
}

const typeOptions = [
  { value: "platform-native", label: "Platform Module – Native" },
  { value: "platform-connector", label: "Platform Module – 3rd-Party Integration" },
  { value: "courseware-native", label: "Courseware Component – Native" },
  { value: "courseware-connector", label: "Courseware Component – 3rd-Party Integration" }
];
const compatibilityOptions = ["olive", "palm", "quince"];
const licenseOptions = ["MIT", "Apache-2.0", "AGPL-3.0", "GPL-3.0", "BSD-3-Clause"];
const providerOptions = ["edX", "OpenCraft", "Raccoon Gang", "Appsembler", "eduNEXT"];

export function FilterBar({ filters, onFilterChange, onClearFilters, resultCount }: FilterBarProps) {
  const hasActiveFilters = Object.values(filters).some(value => value && value !== "all");

  return (
    <div className="space-y-6">
      {/* Advanced Filters */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Category</label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {typeOptions.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Compatibility</label>
          <Select value={filters.compatibility} onValueChange={(value) => onFilterChange("compatibility", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All versions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All versions</SelectItem>
              {compatibilityOptions.map((version) => (
                <SelectItem key={version} value={version}>
                  {version.charAt(0).toUpperCase() + version.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">License</label>
          <Select value={filters.license} onValueChange={(value) => onFilterChange("license", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All licenses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All licenses</SelectItem>
              {licenseOptions.map((license) => (
                <SelectItem key={license} value={license}>
                  {license}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Rating</label>
          <Select value={filters.rating} onValueChange={(value) => onFilterChange("rating", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              <SelectItem value="4+">4+ stars</SelectItem>
              <SelectItem value="3+">3+ stars</SelectItem>
              <SelectItem value="2+">2+ stars</SelectItem>
              <SelectItem value="1+">1+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Provider</label>
          <Select value={filters.provider} onValueChange={(value) => onFilterChange("provider", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All providers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All providers</SelectItem>
              {providerOptions.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results and Clear Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>
            {resultCount} {resultCount === 1 ? "extension" : "extensions"} found
          </span>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}