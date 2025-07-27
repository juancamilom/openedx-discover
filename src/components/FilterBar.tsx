import { Badge } from "@/components/ui/badge";
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

const typeLabels = {
  "platform-addon": "Platform Add-ons",
  "external-tool": "External Tools (LTI)",
  "operational-service": "Operational Services",
};

const compatibilityOptions = ["olive", "palm", "quince"];
const licenseOptions = ["MIT", "Apache-2.0", "AGPL-3.0", "GPL-3.0", "BSD-3-Clause"];

export function FilterBar({ filters, onFilterChange, onClearFilters, resultCount }: FilterBarProps) {
  const hasActiveFilters = Object.values(filters).some(value => value && value !== "all");

  return (
    <div className="space-y-6">
      {/* Type Filter Pills */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.type === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("type", "all")}
            className="h-8"
          >
            All Extensions
          </Button>
          {Object.entries(typeLabels).map(([value, label]) => (
            <Button
              key={value}
              variant={filters.type === value ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("type", value)}
              className="h-8"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <label className="text-sm font-medium text-foreground">Price</label>
          <Select value={filters.price} onValueChange={(value) => onFilterChange("price", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All prices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
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