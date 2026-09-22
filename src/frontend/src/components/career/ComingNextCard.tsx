import { Sparkles } from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import type { CareerTrial } from "@/types";

interface ComingNextCardProps {
  /** The placeholder catalogue entry (no startable brief). */
  trial: CareerTrial;
}

/**
 * Visually lighter placeholder for a career that is still being written.
 * Deliberately has no Start Trial action.
 */
export function ComingNextCard({ trial }: ComingNextCardProps) {
  const { t } = useLanguage();

  return (
    <article
      data-ocid="career_trial.coming_next_card"
      className="flex h-full flex-col rounded-3xl border border-dashed border-primary/35 bg-secondary/60 p-6"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-background text-primary">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <span className="rounded-full border border-primary/30 bg-background px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary">
          {t("careerTrial.comingNextBadge")}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold text-heading-brand">
        {trial.name}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {trial.summary}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {t("careerTrial.comingNextBody")}
      </p>

      <p className="mt-auto pt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        {t("careerTrial.comingNextTitle")}
      </p>
    </article>
  );
}
