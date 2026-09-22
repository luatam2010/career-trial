import { BadgeCheck, Star } from "lucide-react";

import { AspectBar } from "@/components/evidence/AspectBar";
import { clampPercent, formatPercent, formatRating } from "@/lib/format";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { EvidenceCard } from "@/types";

interface EvidenceCardTileProps {
  card: EvidenceCard;
  /** Position in the rendered grid, used for deterministic test markers. */
  index: number;
  /** True when this card belongs to the signed-in student. */
  isOwn?: boolean;
  className?: string;
}

/** Derive up to two initials from a tester name, e.g. "Linh Nguyen" -> "LN". */
function initialsFrom(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

/**
 * One published evidence card: who did the trial, which career it was for,
 * how far they got, the mentor's overall rating, and the aspect breakdown.
 *
 * The student's name is the card's headline — it is the proof of who did the
 * work — and the overall score is shown as a medallion next to the completion
 * and rating figures. Every value is read straight off the `EvidenceCard`
 * contract, so seeded and newly published cards render identically.
 */
export function EvidenceCardTile({
  card,
  index,
  isOwn = false,
  className,
}: EvidenceCardTileProps) {
  const { t } = useLanguage();
  const completion = formatPercent(card.completionPercent);
  const rating = formatRating(card.rating);
  const initials = initialsFrom(card.testerName);
  /**
   * `EvidenceCard.rating` is already a 0–100 score (the backend stores the
   * scored percentage there), so it is shown as-is and clamped to the 0–100
   * range rather than rescaled.
   */
  const overallScore = formatPercent(clampPercent(Number(card.rating)));

  return (
    <article
      data-ocid={`evidence.item.${index + 1}`}
      className={cn(
        "wobble-hover tilt-hover flex h-full flex-col rounded-2xl border bg-card p-6 shadow-subtle",
        isOwn ? "border-primary/60 ring-1 ring-primary/25" : "border-border",
        className,
      )}
    >
      <header className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-base font-semibold text-secondary-foreground"
        >
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {t("evidencePage.testerLabel")}
          </p>
          <h3 className="mt-0.5 truncate text-lg leading-tight font-semibold">
            {card.testerName}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {card.trialName}
          </p>
        </div>
      </header>

      {isOwn && (
        <p
          data-ocid={`evidence.own_badge.${index + 1}`}
          className="student-chip mt-4 self-start"
        >
          <span aria-hidden="true" className="student-chip-monogram">
            {initials}
          </span>
          <span className="student-chip-name">
            {t("evidencePage.ownCardBadge")}
          </span>
        </p>
      )}

      <div className="mt-5 flex items-center gap-4">
        <div
          data-ocid={`evidence.score.${index + 1}`}
          className="score-medallion size-20 shrink-0"
        >
          <span className="score-figure text-2xl">{overallScore}</span>
          <span className="mt-0.5 text-[0.625rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {t("evidencePage.scoreLabel")}
          </span>
        </div>

        <dl className="grid min-w-0 flex-1 grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/60 px-3 py-2.5">
            <dt className="text-[0.6875rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {t("evidencePage.completionLabel")}
            </dt>
            <dd className="mt-0.5 font-mono text-xl font-semibold text-heading-brand tabular-nums">
              {completion}
            </dd>
          </div>
          <div className="rounded-xl bg-muted/60 px-3 py-2.5">
            <dt className="text-[0.6875rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {t("evidencePage.ratingLabel")}
            </dt>
            <dd className="mt-0.5 flex items-center gap-1.5 font-mono text-xl font-semibold text-heading-brand tabular-nums">
              <Star
                aria-hidden="true"
                className="size-4 fill-primary text-primary"
              />
              {rating}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          <BadgeCheck aria-hidden="true" className="size-3.5" />
          {t("evidencePage.aspectsLabel")}
        </p>
        <div className="mt-4 space-y-4">
          {card.aspectScores.map((aspect) => (
            <AspectBar
              key={aspect.aspect}
              aspect={aspect.aspect}
              score={aspect.score}
              lowLabel={t("evidencePage.scaleLow")}
              highLabel={t("evidencePage.scaleHigh")}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
