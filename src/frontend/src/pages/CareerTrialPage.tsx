import { useNavigate, useSearch } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { useMemo, useState } from "react";

import { CareerCard } from "@/components/career/CareerCard";
import { CareerFilters } from "@/components/career/CareerFilters";
import { CareerTrialModal } from "@/components/career/CareerTrialModal";
import { ComingNextCard } from "@/components/career/ComingNextCard";
import { PageShell, Section } from "@/components/layout/PageShell";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListTrials } from "@/lib/backend-client";
import { useLanguage } from "@/lib/i18n";
import type { CareerTrial } from "@/types";

/**
 * A trial is startable only when it carries a complete brief: a non-empty
 * description, a non-empty checklist, a non-empty deliverables list and a
 * positive day count. The seeded "Coming next" placeholder has none of these,
 * so it always renders through ComingNextCard and never offers Start Trial.
 */
function isStartable(trial: CareerTrial): boolean {
  return (
    trial.brief.description.trim().length > 0 &&
    trial.brief.checklist.length > 0 &&
    trial.brief.deliverables.length > 0 &&
    trial.daysToComplete > 0n
  );
}

const SKELETON_IDS = Array.from(
  { length: 6 },
  (_, index) => `career-trial-skeleton-${index}`,
);

export default function CareerTrialPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as {
    q?: string;
    skill?: string;
  };

  const { data: trials, isLoading, isError, refetch } = useListTrials();
  const [selected, setSelected] = useState<CareerTrial | null>(null);

  const query = search.q ?? "";
  const activeCategory = search.skill ?? null;

  const catalogue = useMemo(() => trials ?? [], [trials]);

  const startable = useMemo(() => catalogue.filter(isStartable), [catalogue]);

  const comingNext = useMemo(
    () => catalogue.filter((trial) => !isStartable(trial)),
    [catalogue],
  );

  /**
   * Union of every skill tag across the startable catalogue, alphabetically
   * sorted. The "Coming next" placeholder is excluded so it cannot contribute a
   * stray filter chip.
   */
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const trial of startable) {
      for (const tag of trial.tags) set.add(tag);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [startable]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return startable.filter((trial) => {
      const matchesQuery =
        needle.length === 0 || trial.name.toLowerCase().includes(needle);
      const matchesCategory =
        activeCategory === null || trial.tags.includes(activeCategory);
      return matchesQuery && matchesCategory;
    });
  }, [startable, query, activeCategory]);

  const updateSearch = (next: { q?: string; skill?: string }) => {
    void navigate({
      to: "/career-trial",
      search: {
        q: next.q && next.q.length > 0 ? next.q : undefined,
        skill: next.skill ?? undefined,
      },
      replace: true,
    });
  };

  const clearFilters = () => updateSearch({});

  /**
   * Close the trial brief and land the student on the Evidence page, where the
   * card published by their just-scored attempt is listed.
   */
  const viewEvidence = () => {
    setSelected(null);
    void navigate({ to: "/evidence" });
  };

  const hasFilters = query.trim().length > 0 || activeCategory !== null;

  return (
    <PageShell
      eyebrow={t("trials.eyebrow")}
      title={t("careerTrial.title")}
      description={t("careerTrial.subtitle")}
    >
      <Section id="career-trial" className="pt-0">
        {/* Summary count */}
        <div
          data-ocid="career_trial.summary"
          className="mb-8 flex flex-wrap items-center gap-3"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Compass className="size-5" aria-hidden="true" />
          </span>
          <p className="text-sm text-muted-foreground">
            <span className="font-mono text-lg font-bold text-foreground">
              {startable.length}
            </span>{" "}
            {startable.length === 1
              ? t("careerTrial.countOne")
              : t("careerTrial.countLabel")}
          </p>
        </div>

        {isLoading && (
          <div
            data-ocid="career_trial.loading_state"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {SKELETON_IDS.map((id) => (
              <div
                key={id}
                className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-subtle"
              >
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
                <div className="mt-5 flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="mt-6 h-10 w-full rounded-full" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div
            data-ocid="career_trial.error_state"
            role="alert"
            className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center"
          >
            <p className="font-display text-lg font-semibold text-heading-brand">
              {t("trials.error")}
            </p>
            <Button
              type="button"
              onClick={() => void refetch()}
              data-ocid="career_trial.retry_button"
              className="mt-5 rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
            >
              {t("trials.retry")}
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <CareerFilters
              search={query}
              onSearchChange={(value) =>
                updateSearch({ q: value, skill: activeCategory ?? undefined })
              }
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={(category) =>
                updateSearch({ q: query, skill: category ?? undefined })
              }
              resultCount={filtered.length}
              totalCount={startable.length}
              onClear={clearFilters}
            />

            {filtered.length === 0 &&
              !hasFilters &&
              comingNext.length === 0 && (
                <div
                  data-ocid="career_trial.empty_state"
                  className="mt-10 rounded-3xl border border-border bg-card p-10 text-center shadow-subtle"
                >
                  <p className="font-display text-lg font-semibold text-heading-brand">
                    {t("trials.empty")}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("trials.emptyHint")}
                  </p>
                </div>
              )}

            {filtered.length === 0 && hasFilters && (
              <div
                data-ocid="career_trial.empty_state"
                className="mt-10 rounded-3xl border border-dashed border-border bg-card p-10 text-center shadow-subtle"
              >
                <p className="font-display text-lg font-semibold text-heading-brand">
                  {t("careerTrial.emptyTitle")}
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  {t("careerTrial.emptyBody")}
                </p>
                <Button
                  type="button"
                  onClick={clearFilters}
                  data-ocid="career_trial.empty_action_button"
                  className="mt-5 rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
                >
                  {t("careerTrial.emptyAction")}
                </Button>
              </div>
            )}

            {(filtered.length > 0 || comingNext.length > 0) && (
              <Reveal className="mt-10">
                <ul
                  data-ocid="career_trial.list"
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {filtered.map((trial, index) => (
                    <li key={trial.id.toString()} className="h-full">
                      <CareerCard
                        trial={trial}
                        index={index}
                        onStart={setSelected}
                      />
                    </li>
                  ))}
                  {/* The placeholder always renders last in the grid. */}
                  {comingNext.map((trial) => (
                    <li key={trial.id.toString()} className="h-full">
                      <ComingNextCard trial={trial} />
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </>
        )}
      </Section>

      <CareerTrialModal
        trial={selected}
        onClose={() => setSelected(null)}
        onViewEvidence={viewEvidence}
      />
    </PageShell>
  );
}
