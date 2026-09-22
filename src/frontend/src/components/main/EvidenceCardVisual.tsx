import { BadgeCheck, Star } from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface EvidenceAspect {
  /** Translation key for the aspect label. */
  labelKey: string;
  /** 0–100 score. */
  value: number;
}

interface EvidenceCardVisualProps {
  studentName: string;
  careerName: string;
  completion: number;
  rating: string;
  aspects: EvidenceAspect[];
  className?: string;
}

/**
 * A composed Career Evidence Card: student, career, completion, mentor rating
 * and four aspect bars that fill left (low) to right (high).
 */
export function EvidenceCardVisual({
  studentName,
  careerName,
  completion,
  rating,
  aspects,
  className,
}: EvidenceCardVisualProps) {
  const { t } = useLanguage();
  const safeCompletion = Math.max(0, Math.min(100, Math.round(completion)));

  return (
    <article
      data-ocid="evidence.card"
      className={cn(
        "w-full rounded-3xl border border-border bg-card p-6 shadow-elevated",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{t("main.evidenceCardTitle")}</p>
          <h3 className="mt-2 truncate font-display text-lg font-semibold text-heading-brand">
            {careerName}
          </h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {studentName}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">
          <BadgeCheck className="size-3.5" aria-hidden="true" />
          {t("main.evidenceCardVerified")}
        </span>
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-background p-4">
          <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t("main.evidenceCardCompletion")}
          </dt>
          <dd className="mt-1.5 font-mono text-2xl font-bold text-primary">
            {safeCompletion}%
          </dd>
        </div>
        <div className="rounded-2xl bg-background p-4">
          <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t("main.evidenceCardRating")}
          </dt>
          <dd className="mt-1.5 flex items-center gap-1.5 font-mono text-2xl font-bold text-primary">
            <Star className="size-4 fill-current" aria-hidden="true" />
            {rating}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t("main.evidenceCardAspects")}
        </p>
        <ul className="mt-3 flex flex-col gap-3">
          {aspects.map((aspect) => {
            const value = Math.max(0, Math.min(100, Math.round(aspect.value)));
            return (
              <li key={aspect.labelKey}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm text-foreground">
                    {t(aspect.labelKey)}
                  </span>
                  <span className="shrink-0 font-mono text-xs font-semibold text-muted-foreground">
                    {value}%
                  </span>
                </div>
                <div
                  className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted"
                  role="meter"
                  aria-valuenow={value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={t(aspect.labelKey)}
                >
                  <div
                    className="h-full rounded-full bg-gradient-primary transition-[width] duration-700 ease-out"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
