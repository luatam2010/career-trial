import { useNavigate, useSearch } from "@tanstack/react-router";
import { AlertCircle, SearchX, UserRoundCheck } from "lucide-react";
import { useMemo } from "react";

import { EvidenceCardTile } from "@/components/evidence/EvidenceCardTile";
import {
  ALL_CAREERS,
  EVIDENCE_SORTS,
  EvidenceFilters,
  type EvidenceSort,
} from "@/components/evidence/EvidenceFilters";
import { PageShell, Section } from "@/components/layout/PageShell";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useGetMyProfile, useListEvidence } from "@/lib/backend-client";
import { useLanguage } from "@/lib/i18n";
import type { EvidenceCard } from "@/types";

/** Shape of the `/evidence` search params, mirrored by the route's validateSearch. */
interface EvidenceSearch {
  career?: string;
  sort?: EvidenceSort;
  mine?: boolean;
}

function isEvidenceSort(value: unknown): value is EvidenceSort {
  return (
    typeof value === "string" &&
    (EVIDENCE_SORTS as readonly string[]).includes(value)
  );
}

/** Compare two cards by the active sort order. */
function compareCards(a: EvidenceCard, b: EvidenceCard, sort: EvidenceSort) {
  if (sort === "name") {
    return a.testerName.localeCompare(b.testerName);
  }
  if (sort === "rating") {
    return Number(b.rating - a.rating);
  }
  return Number(b.completionPercent - a.completionPercent);
}

/**
 * Evidence wall — every published evidence card from completed student trials,
 * filterable by career and sortable by completion, rating or tester name.
 * The active filter and sort live in the URL so the view is shareable.
 *
 * When a student is signed in, their own published cards are highlighted and a
 * "my results only" toggle lets them jump straight to their own evidence.
 */
export default function EvidencePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as EvidenceSearch;
  const { isAuthenticated, principal } = useAuth();

  const career = search.career ?? ALL_CAREERS;
  const sort: EvidenceSort = isEvidenceSort(search.sort)
    ? search.sort
    : "completion";
  const mineOnly = search.mine === true;

  const { data, isLoading, isError, refetch } = useListEvidence();
  const cards = useMemo(() => data ?? [], [data]);

  /**
   * The signed-in student's own display name. The public evidence contract
   * carries no principal, so the name the student publishes under is the only
   * identity signal available on the wall. Only fetched while signed in.
   */
  const { data: profile } = useGetMyProfile(isAuthenticated);

  const careers = useMemo(() => {
    const unique = new Set<string>();
    for (const card of cards) {
      if (card.trialName) unique.add(card.trialName);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [cards]);

  /**
   * A card belongs to the signed-in student when its tester name matches the
   * name the student publishes under. When the student is signed out, or has
   * not set a display name, no card is treated as their own.
   */
  const ownName = useMemo(() => {
    if (!isAuthenticated || !principal) return null;
    const name = profile?.displayName?.trim();
    return name && name.length > 0 ? name.toLowerCase() : null;
  }, [profile, isAuthenticated, principal]);

  const ownCardIds = useMemo(() => {
    const ids = new Set<string>();
    if (ownName === null) return ids;
    for (const card of cards) {
      if (card.testerName.trim().toLowerCase() === ownName) {
        ids.add(card.id.toString());
      }
    }
    return ids;
  }, [cards, ownName]);

  const ownCount = ownCardIds.size;

  const visibleCards = useMemo(() => {
    const byCareer =
      career === ALL_CAREERS
        ? cards
        : cards.filter((card) => card.trialName === career);
    const filtered = mineOnly
      ? byCareer.filter((card) => ownCardIds.has(card.id.toString()))
      : byCareer;
    return [...filtered].sort((a, b) => compareCards(a, b, sort));
  }, [cards, career, sort, mineOnly, ownCardIds]);

  const updateSearch = (next: EvidenceSearch) => {
    void navigate({
      to: "/evidence",
      search: {
        career: next.career ?? career,
        sort: next.sort ?? sort,
        mine: next.mine ?? mineOnly,
      },
      replace: true,
    });
  };

  return (
    <PageShell
      eyebrow={t("evidencePage.eyebrow")}
      title={t("evidencePage.title")}
      description={t("evidencePage.description")}
    >
      <Section id="evidence" data-ocid="evidence.section">
        {isLoading ? (
          <div
            data-ocid="evidence.loading_state"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, i) => `evidence-skeleton-${i}`).map(
              (id) => (
                <Skeleton key={id} className="h-96 w-full rounded-2xl" />
              ),
            )}
          </div>
        ) : isError ? (
          <div
            data-ocid="evidence.error_state"
            className="surface-mint flex flex-col items-start gap-4 rounded-2xl p-8"
          >
            <AlertCircle aria-hidden="true" className="size-6" />
            <p className="text-base font-medium">{t("evidencePage.error")}</p>
            <Button
              type="button"
              variant="outline"
              data-ocid="evidence.retry_button"
              className="rounded-full"
              onClick={() => void refetch()}
            >
              {t("evidencePage.retry")}
            </Button>
          </div>
        ) : cards.length === 0 ? (
          <div
            data-ocid="evidence.empty_state"
            className="surface-mint flex flex-col items-start gap-3 rounded-2xl p-8"
          >
            <SearchX aria-hidden="true" className="size-6" />
            <h2 className="text-xl font-semibold">{t("evidencePage.empty")}</h2>
            <p className="max-w-xl text-sm">{t("evidencePage.emptyHint")}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                data-ocid="evidence.count"
                className="text-sm font-medium text-muted-foreground"
              >
                {t("evidencePage.countLabel")} ·{" "}
                <span className="font-mono font-semibold text-primary tabular-nums">
                  {visibleCards.length}
                </span>
              </p>

              {isAuthenticated && ownCount > 0 && (
                <Button
                  type="button"
                  variant={mineOnly ? "default" : "outline"}
                  aria-pressed={mineOnly}
                  data-ocid="evidence.mine_toggle"
                  className="rounded-full"
                  onClick={() => updateSearch({ mine: !mineOnly })}
                >
                  <UserRoundCheck aria-hidden="true" className="size-4" />
                  {mineOnly
                    ? t("evidencePage.showAllCards")
                    : t("evidencePage.showMineOnly")}
                </Button>
              )}
            </div>

            {isAuthenticated && ownCount > 0 && (
              <p
                data-ocid="evidence.own_summary"
                className="student-chip self-start"
              >
                <span aria-hidden="true" className="student-chip-monogram">
                  <UserRoundCheck className="size-3.5" />
                </span>
                <span className="student-chip-name">
                  {t("evidencePage.ownSummary")} ·{" "}
                  <span className="font-mono tabular-nums">{ownCount}</span>
                </span>
              </p>
            )}

            <EvidenceFilters
              careers={careers}
              career={career}
              sort={sort}
              onCareerChange={(next) => updateSearch({ career: next })}
              onSortChange={(next) => updateSearch({ sort: next })}
            />

            {visibleCards.length === 0 ? (
              <div
                data-ocid="evidence.filtered_empty_state"
                className="surface-mint flex flex-col items-start gap-3 rounded-2xl p-8"
              >
                <SearchX aria-hidden="true" className="size-6" />
                <h2 className="text-xl font-semibold">
                  {mineOnly
                    ? t("evidencePage.noMine")
                    : t("evidencePage.noMatch")}
                </h2>
                <p className="max-w-xl text-sm">
                  {mineOnly
                    ? t("evidencePage.noMineHint")
                    : t("evidencePage.noMatchHint")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="evidence.clear_filter_button"
                  className="rounded-full"
                  onClick={() =>
                    updateSearch({ career: ALL_CAREERS, mine: false })
                  }
                >
                  {t("evidencePage.clearFilter")}
                </Button>
              </div>
            ) : (
              <Reveal>
                <ul
                  data-ocid="evidence.list"
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {visibleCards.map((card, index) => (
                    <li key={card.id.toString()} className="min-w-0">
                      <EvidenceCardTile
                        card={card}
                        index={index}
                        isOwn={ownCardIds.has(card.id.toString())}
                      />
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
