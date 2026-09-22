import { ArrowRight, CircleCheck, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPercent } from "@/lib/format";
import { useLanguage } from "@/lib/i18n";
import type { TestResult } from "@/types";

interface TestResultPanelProps {
  result: TestResult;
  /** Total number of questions in the attempt, used for the "x of y" label. */
  totalQuestions: number;
  /** Navigate to the Evidence page. */
  onViewEvidence: () => void;
  /** Start a fresh attempt, replacing this result. */
  onRetake: () => void;
}

/**
 * The scored attempt: a large score medallion, the completion percentage, the
 * per-aspect breakdown and the link through to the Evidence page.
 */
export function TestResultPanel({
  result,
  totalQuestions,
  onViewEvidence,
  onRetake,
}: TestResultPanelProps) {
  const { t } = useLanguage();

  const total = totalQuestions > 0 ? totalQuestions : 5;
  /**
   * `TestResult.score` is a 0–100 percentage (the backend scores
   * `correct * 100 / total`), so the raw count of correct answers is derived
   * from it rather than shown directly — the medallion reads "x out of y".
   */
  const score = Math.round((Number(result.score) * total) / 100);
  const completion = Number(result.completionPercent);

  return (
    <div
      data-ocid="test.result_panel"
      className="flex flex-col gap-6 rounded-3xl border border-primary/25 bg-secondary p-6 sm:p-8"
    >
      <header className="flex flex-col items-center gap-4 text-center">
        <div
          data-ocid="test.score_medallion"
          className="score-medallion size-32 sm:size-36"
          style={{ animation: "score-pop 0.5s ease-out both" }}
        >
          <span className="score-figure text-4xl sm:text-5xl">{score}</span>
          <span className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t("test.scoreOutOf").replace("{total}", String(total))}
          </span>
        </div>
        <div>
          <p className="eyebrow">{t("test.resultEyebrow")}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-heading-brand">
            {t("test.resultTitle")}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {t("test.resultBody")}
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("test.completionLabel")}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-heading-brand">
            {formatPercent(result.completionPercent)}
          </p>
          <div className="progress-rail mt-3">
            <div
              className="progress-rail-fill"
              style={{ width: `${Math.min(100, Math.max(0, completion))}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("test.scoreLabel")}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-heading-brand">
            {score}
            <span className="ml-1 text-base font-medium text-muted-foreground">
              / {total}
            </span>
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <CircleCheck className="size-4 text-primary" aria-hidden="true" />
            {t("test.evidenceHint")}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t("test.aspectsLabel")}
        </h4>
        <ul data-ocid="test.aspect_list" className="mt-4 flex flex-col gap-4">
          {result.aspectScores.map((aspect, aspectIndex) => {
            const value = Number(aspect.score);
            const width = Math.min(100, Math.max(0, value));
            return (
              <li
                key={aspect.aspect}
                data-ocid={`test.aspect.${aspectIndex + 1}`}
                className="flex flex-col gap-2"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-sm font-medium text-foreground">
                    {aspect.aspect}
                  </span>
                  <span className="shrink-0 font-mono text-sm font-semibold text-heading-brand">
                    {formatPercent(aspect.score)}
                  </span>
                </div>
                <div className="aspect-track">
                  <div className="aspect-fill" style={{ width: `${width}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onRetake}
          data-ocid="test.retake_button"
          className="w-full rounded-full border-border bg-background px-5 font-semibold text-foreground transition-smooth hover:bg-muted sm:w-auto"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          {t("test.retake")}
        </Button>
        <Button
          type="button"
          onClick={onViewEvidence}
          aria-label={t("test.viewEvidenceAria")}
          data-ocid="test.evidence_link"
          className="w-full rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90 sm:w-auto"
        >
          {t("test.evidenceCta")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
