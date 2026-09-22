import { Star } from "lucide-react";

import { clampPercent, formatPercent } from "@/lib/format";
import { useLanguage } from "@/lib/i18n";
import type { MyEvidenceCard } from "@/types";

interface StudentEvidenceCardProps {
  card: MyEvidenceCard;
  /** Position in the list, used for stable deterministic markers. */
  index: number;
  /** The student's display name, shown exactly as it appears on the public card. */
  studentName: string;
}

/** Derive up to two initials from a name, e.g. "Linh Nguyen" -> "LN". */
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
 * One of the signed-in student's own evidence cards, in the same format as the
 * public evidence wall: name, trial, completion, overall score and aspects.
 */
export function StudentEvidenceCard({
  card,
  index,
  studentName,
}: StudentEvidenceCardProps) {
  const { t } = useLanguage();

  return (
    <article
      className="wobble-hover flex flex-col gap-5 rounded-3xl border border-border/60 bg-card p-6 shadow-sm"
      data-ocid={`student.evidence_card.${index}`}
    >
      <header className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-base font-semibold text-secondary-foreground"
        >
          {initialsFrom(studentName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {t("studentArea.testerLabel")}
          </p>
          <h3
            className="mt-0.5 truncate text-lg leading-tight font-semibold"
            data-ocid={`student.evidence_name.${index}`}
          >
            {studentName}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {card.trialName}
          </p>
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted/60 px-3 py-2.5">
          <dt className="text-[0.6875rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {t("studentArea.completionLabel")}
          </dt>
          <dd className="mt-0.5 font-mono text-xl font-semibold text-heading-brand tabular-nums">
            {formatPercent(card.completionPercent)}
          </dd>
        </div>
        <div className="rounded-xl bg-muted/60 px-3 py-2.5">
          <dt className="text-[0.6875rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {t("studentArea.scoreLabel")}
          </dt>
          <dd className="mt-0.5 flex items-center gap-1.5 font-mono text-xl font-semibold text-heading-brand tabular-nums">
            <Star
              aria-hidden="true"
              className="size-4 fill-primary text-primary"
            />
            {formatPercent(clampPercent(Number(card.rating)))}
          </dd>
        </div>
      </dl>

      {card.aspectScores.length > 0 && (
        <div className="border-t border-border pt-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {t("studentArea.aspectsHeading")}
          </p>
          <ul className="mt-4 space-y-4">
            {card.aspectScores.map((aspect) => {
              const value = Math.min(100, Math.max(0, Number(aspect.score)));
              return (
                <li key={aspect.aspect}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-medium text-foreground">
                      {aspect.aspect}
                    </span>
                    <span className="shrink-0 font-mono text-sm font-semibold text-primary tabular-nums">
                      {formatPercent(aspect.score)}
                    </span>
                  </div>
                  <div className="aspect-track mt-1.5">
                    <div
                      className="aspect-fill"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex justify-between text-[0.6875rem] font-medium tracking-wide text-muted-foreground uppercase">
            <span>{t("studentArea.lowLabel")}</span>
            <span>{t("studentArea.highLabel")}</span>
          </div>
        </div>
      )}
    </article>
  );
}
