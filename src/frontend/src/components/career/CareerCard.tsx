import { ArrowRight, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import type { CareerTrial } from "@/types";

interface CareerCardProps {
  trial: CareerTrial;
  /** Opens the detailed task pop-up for this trial. */
  onStart: (trial: CareerTrial) => void;
  /** Stagger index for the scroll-reveal delay. */
  index?: number;
}

/**
 * A single career trial card: name, task summary, skill tags, day count and a
 * Start Trial action that opens the brief pop-up.
 */
export function CareerCard({ trial, onStart, index = 0 }: CareerCardProps) {
  const { t } = useLanguage();
  const days = Number(trial.daysToComplete);

  return (
    <article
      data-ocid={`career_trial.card.${index + 1}`}
      className="wobble-hover tilt-hover group flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-semibold text-heading-brand">
          {trial.name}
        </h3>
        <span
          data-ocid={`career_trial.days.${index + 1}`}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-mono text-xs font-semibold text-secondary-foreground"
        >
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {days} {t("careerTrial.daysBadge")}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {trial.summary}
      </p>

      <ul
        data-ocid={`career_trial.tags.${index + 1}`}
        className="mt-5 flex flex-wrap gap-2"
      >
        {trial.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-primary/30 bg-background px-3 py-1 text-xs font-medium text-primary"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <Button
          type="button"
          onClick={() => onStart(trial)}
          data-ocid={`career_trial.start_button.${index + 1}`}
          className="w-full rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
        >
          {t("careerTrial.startTrial")}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Button>
      </div>
    </article>
  );
}
