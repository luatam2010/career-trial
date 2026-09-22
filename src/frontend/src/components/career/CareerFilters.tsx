import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CareerFiltersProps {
  /** Current search text (owned by the page, mirrored in the URL). */
  search: string;
  onSearchChange: (value: string) => void;
  /** Every skill tag present in the catalogue, sorted for a stable order. */
  categories: string[];
  /** Active category, or null for "all skills". */
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  /** Number of trials currently matching the filters. */
  resultCount: number;
  /** Total number of startable trials in the catalogue. */
  totalCount: number;
  onClear: () => void;
}

/**
 * Search + skill-category filter bar for the career trial grid.
 * Purely controlled: the page owns the state and syncs it to the URL.
 */
export function CareerFilters({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  resultCount,
  totalCount,
  onClear,
}: CareerFiltersProps) {
  const { t } = useLanguage();
  const hasFilters = search.trim().length > 0 || activeCategory !== null;

  return (
    <div
      data-ocid="career_trial.filters"
      className="rounded-3xl border border-border bg-card p-5 shadow-subtle sm:p-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        {/* Search */}
        <div className="w-full lg:max-w-sm">
          <label
            htmlFor="career-trial-search"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
          >
            {t("careerTrial.searchLabel")}
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="career-trial-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t("careerTrial.searchPlaceholder")}
              data-ocid="career_trial.search_input"
              className="h-11 rounded-full border-input bg-background pl-9 pr-10"
            />
            {search.length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label={t("careerTrial.searchClear")}
                data-ocid="career_trial.search_clear_button"
                className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Result count + clear */}
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <p
            data-ocid="career_trial.results_count"
            className="text-sm text-muted-foreground"
          >
            {t("careerTrial.resultsLabel")}{" "}
            <span className="font-mono font-semibold text-foreground">
              {resultCount}
            </span>{" "}
            {t("careerTrial.resultsOf")}{" "}
            <span className="font-mono font-semibold text-foreground">
              {totalCount}
            </span>
          </p>
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              onClick={onClear}
              data-ocid="career_trial.clear_filters_button"
              className="rounded-full text-sm font-semibold text-primary hover:bg-secondary"
            >
              {t("careerTrial.clearFilters")}
            </Button>
          )}
        </div>
      </div>

      {/* Skill category chips */}
      <div className="mt-5 border-t border-border pt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t("careerTrial.filterLabel")}
        </p>
        <ul className="flex flex-wrap gap-2">
          <li>
            <button
              type="button"
              onClick={() => onCategoryChange(null)}
              aria-pressed={activeCategory === null}
              data-ocid="career_trial.filter.all"
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeCategory === null
                  ? "border-primary bg-primary text-primary-foreground shadow-subtle"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {t("careerTrial.filterAll")}
            </button>
          </li>
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => onCategoryChange(isActive ? null : category)}
                  aria-pressed={isActive}
                  data-ocid={`career_trial.filter.${category
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}`}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-subtle"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {category}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
