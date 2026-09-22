import { ArrowDownWideNarrow, Briefcase } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";

/** Sort orders supported by the evidence wall. */
export type EvidenceSort = "completion" | "rating" | "name";

export const EVIDENCE_SORTS: readonly EvidenceSort[] = [
  "completion",
  "rating",
  "name",
] as const;

/** Sentinel used for the "all careers" option (Radix forbids an empty value). */
export const ALL_CAREERS = "all";

interface EvidenceFiltersProps {
  /** Distinct career names present in the evidence data. */
  careers: string[];
  /** Active career filter, or `ALL_CAREERS`. */
  career: string;
  /** Active sort order. */
  sort: EvidenceSort;
  onCareerChange: (career: string) => void;
  onSortChange: (sort: EvidenceSort) => void;
}

/**
 * Career filter + sort control for the evidence wall. Both values live in the
 * page URL, so the parent owns the state and this component only reports
 * changes.
 */
export function EvidenceFilters({
  careers,
  career,
  sort,
  onCareerChange,
  onSortChange,
}: EvidenceFiltersProps) {
  const { t } = useLanguage();

  return (
    <div
      data-ocid="evidence.filters"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-subtle sm:flex-row sm:items-end sm:gap-6 sm:p-5"
    >
      <div className="min-w-0 flex-1">
        <label
          htmlFor="evidence-career-filter"
          className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase"
        >
          <Briefcase aria-hidden="true" className="size-3.5" />
          {t("evidencePage.filterCareerLabel")}
        </label>
        <Select value={career} onValueChange={onCareerChange}>
          <SelectTrigger
            id="evidence-career-filter"
            data-ocid="evidence.career.select"
            className="mt-2 h-11 w-full rounded-full bg-background px-4"
          >
            <SelectValue placeholder={t("evidencePage.filterAllCareers")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CAREERS}>
              {t("evidencePage.filterAllCareers")}
            </SelectItem>
            {careers.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0 flex-1">
        <label
          htmlFor="evidence-sort"
          className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase"
        >
          <ArrowDownWideNarrow aria-hidden="true" className="size-3.5" />
          {t("evidencePage.sortLabel")}
        </label>
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as EvidenceSort)}
        >
          <SelectTrigger
            id="evidence-sort"
            data-ocid="evidence.sort.select"
            className="mt-2 h-11 w-full rounded-full bg-background px-4"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completion">
              {t("evidencePage.sortCompletion")}
            </SelectItem>
            <SelectItem value="rating">
              {t("evidencePage.sortRating")}
            </SelectItem>
            <SelectItem value="name">{t("evidencePage.sortName")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
