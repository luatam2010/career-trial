import { CalendarClock, ClipboardCheck, Route } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDate, formatPercent } from "@/lib/format";
import { useLanguage } from "@/lib/i18n";
import type { EnrollmentView } from "@/types";

interface EnrollmentCardProps {
  enrollment: EnrollmentView;
  /** Position in the list, used for stable deterministic markers. */
  index: number;
  /** The auto-generated result for this trial, when the student has tested. */
  result?: {
    score: bigint;
    completionPercent: bigint;
    aspectScores: { aspect: string; score: bigint }[];
  } | null;
  /** True while the result for this enrolment is still being fetched. */
  isLoading?: boolean;
  /** Opens the trial test for this enrolment. */
  onTakeTest?: () => void;
}

/**
 * One enrolled trial: the dates, plus the auto-generated result once the
 * student has taken the trial test. Progress is never self-rated.
 */
export function EnrollmentCard({
  enrollment,
  index,
  result,
  isLoading = false,
  onTakeTest,
}: EnrollmentCardProps) {
  const { t, language } = useLanguage();

  return (
    <article
      className="wobble-hover flex flex-col gap-5 rounded-3xl border border-border/60 bg-card p-6 shadow-sm"
      data-ocid={`student.enrollment_card.${index}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="min-w-0 text-lg font-semibold">
          {enrollment.trialName}
        </h3>
        {result ? (
          <span
            className="rounded-full bg-secondary px-3 py-1 font-mono text-xs font-medium text-secondary-foreground"
            data-ocid={`student.enrollment_progress.${index}`}
          >
            {formatPercent(result.completionPercent)}
          </span>
        ) : (
          <span
            className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
            data-ocid={`student.enrollment_status.${index}`}
          >
            {t("studentArea.notTestedBadge")}
          </span>
        )}
      </header>

      <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
          <dt>{t("student.startedLabel")}</dt>
          <dd className="font-medium text-foreground">
            {formatDate(enrollment.startedAt, language)}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
          <dt>{t("student.updatedLabel")}</dt>
          <dd className="font-medium text-foreground">
            {formatDate(enrollment.updatedAt, language)}
          </dd>
        </div>
      </dl>

      {isLoading ? (
        <div
          className="rounded-2xl bg-muted/60 p-5"
          data-ocid={`student.enrollment_result_loading.${index}`}
        >
          <p className="text-sm text-muted-foreground">
            {t("studentArea.resultLoading")}
          </p>
        </div>
      ) : result ? (
        <div
          className="rounded-2xl bg-muted/60 p-5"
          data-ocid={`student.enrollment_result.${index}`}
        >
          <p className="text-sm font-medium">
            {t("studentArea.resultHeading")}
          </p>

          <div className="mt-4 flex items-center gap-5">
            <div
              className="score-medallion size-20 shrink-0"
              data-ocid={`student.enrollment_score.${index}`}
            >
              <span className="score-figure text-2xl">
                {formatPercent(result.score)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {t("studentArea.scoreLabel")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("studentArea.completionLabel")}:{" "}
                <span className="font-mono font-medium text-foreground">
                  {formatPercent(result.completionPercent)}
                </span>
              </p>
            </div>
          </div>

          {result.aspectScores.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium">
                {t("studentArea.aspectsHeading")}
              </p>
              <ul className="mt-3 space-y-3">
                {result.aspectScores.map((aspect) => {
                  const value = Math.min(
                    100,
                    Math.max(0, Number(aspect.score)),
                  );
                  return (
                    <li key={aspect.aspect}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate text-muted-foreground">
                          {aspect.aspect}
                        </span>
                        <span className="shrink-0 font-mono text-xs font-medium">
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
            </div>
          )}
        </div>
      ) : (
        <div
          className="rounded-2xl border border-dashed border-border bg-muted/40 p-5"
          data-ocid={`student.enrollment_not_tested.${index}`}
        >
          <p className="flex items-center gap-2 text-sm font-medium">
            <ClipboardCheck className="size-4 shrink-0" aria-hidden="true" />
            {t("studentArea.notTestedTitle")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("studentArea.notTestedBody")}
          </p>
          {onTakeTest && (
            <Button
              type="button"
              className="mt-4 rounded-full"
              onClick={onTakeTest}
              data-ocid={`student.take_test_button.${index}`}
            >
              <Route className="size-4" aria-hidden="true" />
              {t("studentArea.takeTest")}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
