import { ArrowLeft, ArrowRight, CircleAlert, Send, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { TestQuestionCard } from "@/components/career/TestQuestionCard";
import { TestResultPanel } from "@/components/career/TestResultPanel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useGetTrialTest, useSubmitTest } from "@/lib/backend-client";
import { useLanguage } from "@/lib/i18n";
import type { TestAnswer, TestError, TestResult, TrialId } from "@/types";

interface TrialTestPanelProps {
  trialId: TrialId;
  trialName: string;
  /** Close the test and return to the trial brief. */
  onClose: () => void;
  /** Leave the test and open the Evidence page. */
  onViewEvidence: () => void;
}

type SubmitState =
  | { status: "idle" }
  | { status: "result"; result: TestResult }
  | { status: "error"; kind: string; missing: bigint[] };

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * The trial knowledge test flow.
 *
 * Loads the trial's questions, shows one at a time with a progress rail, and
 * submits every answer at once. The backend scores the attempt and publishes an
 * evidence card; the result panel links through to the Evidence page. A retake
 * is always allowed and replaces the previous result.
 */
export function TrialTestPanel({
  trialId,
  trialName,
  onClose,
  onViewEvidence,
}: TrialTestPanelProps) {
  const { t } = useLanguage();
  const { isAuthenticated, login } = useAuth();
  const testQuery = useGetTrialTest(trialId);
  const submitTest = useSubmitTest();

  const [answers, setAnswers] = useState<Record<string, bigint>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const questions = useMemo(
    () => testQuery.data?.questions ?? [],
    [testQuery.data],
  );
  const total = questions.length;
  const currentQuestion = questions[currentIndex] ?? null;

  const answeredCount = useMemo(
    () =>
      questions.filter(
        (question) => answers[question.id.toString()] !== undefined,
      ).length,
    [questions, answers],
  );

  const missingNumbers = useMemo(
    () =>
      questions
        .map((question, index) =>
          answers[question.id.toString()] === undefined ? index + 1 : null,
        )
        .filter((value): value is number => value !== null),
    [questions, answers],
  );

  const isComplete = total > 0 && missingNumbers.length === 0;

  // Reset the attempt whenever a different trial is opened. Adjusting state
  // during render (rather than in an effect) avoids a stale first paint and
  // keeps the reset out of a dependency array.
  const [activeTrialId, setActiveTrialId] = useState(trialId);
  if (activeTrialId !== trialId) {
    setActiveTrialId(trialId);
    setAnswers({});
    setCurrentIndex(0);
    setSubmitState({ status: "idle" });
  }

  // The panel is remounted per trial by its parent, so the reset above only
  // guards against a trial swap that reuses the same instance.

  // Modal behaviour: lock scroll, trap focus, close on Escape, restore focus.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panelRef.current)?.focus();
    }, 20);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      window.clearTimeout(focusTimer);
      previouslyFocused.current?.focus();
    };
  }, [onClose]);

  const handleSelect = (questionId: bigint, optionId: bigint) => {
    setAnswers((current) => ({
      ...current,
      [questionId.toString()]: optionId,
    }));
  };

  const handleSubmit = () => {
    if (!isComplete) return;

    const payload: TestAnswer[] = questions.map((question) => ({
      questionId: question.id,
      optionId: answers[question.id.toString()],
    }));

    submitTest.mutate(
      { trialId, answers: payload },
      {
        onSuccess: (result: TestError) => {
          if (result.__kind__ === "ok" && result.ok) {
            setSubmitState({ status: "result", result: result.ok });
            return;
          }
          setSubmitState({
            status: "error",
            kind: result.__kind__,
            missing: result.incomplete ?? [],
          });
        },
        onError: () => {
          setSubmitState({ status: "error", kind: "generic", missing: [] });
        },
      },
    );
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitState({ status: "idle" });
  };

  if (typeof document === "undefined") return null;

  const renderBody = () => {
    if (!isAuthenticated) {
      return (
        <div
          data-ocid="test.sign_in_state"
          className="flex flex-col items-start gap-4 rounded-2xl border border-primary/25 bg-secondary p-6"
        >
          <h3 className="font-display text-xl font-semibold text-heading-brand">
            {t("test.signInTitle")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("test.signInBody")}
          </p>
          <Button
            type="button"
            onClick={login}
            data-ocid="test.sign_in_button"
            className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
          >
            {t("test.signInCta")}
          </Button>
        </div>
      );
    }

    if (testQuery.isLoading) {
      return (
        <div
          data-ocid="test.loading_state"
          aria-live="polite"
          className="flex flex-col gap-4"
        >
          <div className="h-6 w-2/3 animate-pulse rounded-full bg-muted" />
          <div className="h-14 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-14 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-14 w-full animate-pulse rounded-2xl bg-muted" />
          <p className="text-sm text-muted-foreground">{t("test.loading")}</p>
        </div>
      );
    }

    if (testQuery.isError) {
      return (
        <div
          data-ocid="test.error_state"
          role="alert"
          className="flex flex-col items-start gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6"
        >
          <p className="font-display text-base font-semibold text-heading-brand">
            {t("test.loadError")}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void testQuery.refetch()}
            data-ocid="test.retry_button"
            className="rounded-full border-border bg-background px-5 font-semibold text-foreground transition-smooth hover:bg-muted"
          >
            {t("test.retry")}
          </Button>
        </div>
      );
    }

    if (total === 0) {
      return (
        <div
          data-ocid="test.empty_state"
          className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-muted p-6"
        >
          <p className="font-display text-base font-semibold text-heading-brand">
            {t("test.empty")}
          </p>
          <p className="text-sm text-muted-foreground">{t("test.emptyHint")}</p>
        </div>
      );
    }

    if (submitState.status === "result") {
      return (
        <TestResultPanel
          result={submitState.result}
          totalQuestions={total}
          onViewEvidence={onViewEvidence}
          onRetake={handleRetake}
        />
      );
    }

    const errorMessage = (() => {
      if (submitState.status !== "error") return null;
      switch (submitState.kind) {
        case "notSignedIn":
          return {
            title: t("test.signInTitle"),
            body: t("test.signInBody"),
          };
        case "notEnrolled":
          return {
            title: t("test.notEnrolledTitle"),
            body: t("test.notEnrolledBody"),
          };
        case "unknownTrial":
          return {
            title: t("test.unknownTrialTitle"),
            body: t("test.unknownTrialBody"),
          };
        case "invalidAnswer":
          return {
            title: t("test.invalidAnswerTitle"),
            body: t("test.invalidAnswerBody"),
          };
        case "incomplete":
          return {
            title: t("test.incompleteTitle"),
            body: t("test.incompleteBody"),
          };
        default:
          return {
            title: t("test.genericErrorTitle"),
            body: t("test.genericErrorBody"),
          };
      }
    })();

    const progressPercent = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("test.questionLabel")} {currentIndex + 1} {t("test.ofLabel")}{" "}
              {total}
            </p>
            <p className="font-mono text-xs font-semibold text-muted-foreground">
              {answeredCount}/{total} {t("test.answeredLabel")}
            </p>
          </div>
          <div className="progress-rail">
            <div
              className="progress-rail-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div
            data-ocid="test.progress_steps"
            className="flex items-center gap-2"
          >
            {questions.map((question, index) => {
              const state =
                index === currentIndex
                  ? "current"
                  : answers[question.id.toString()] !== undefined
                    ? "done"
                    : "todo";
              return (
                <span
                  key={question.id.toString()}
                  data-state={state}
                  data-ocid={`test.progress_step.${index + 1}`}
                  className="progress-step"
                />
              );
            })}
          </div>
        </div>

        {errorMessage && (
          <div
            data-ocid="test.submit_error_state"
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4"
          >
            <p className="flex items-center gap-2 font-display text-sm font-semibold text-heading-brand">
              <CircleAlert
                className="size-4 text-destructive"
                aria-hidden="true"
              />
              {errorMessage.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {errorMessage.body}
            </p>
            {submitState.status === "error" &&
              submitState.kind === "incomplete" &&
              submitState.missing.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {submitState.missing.map((number) => (
                    <li
                      key={number.toString()}
                      className="rounded-full border border-destructive/30 bg-background px-3 py-1 font-mono text-xs font-semibold text-destructive"
                    >
                      {t("test.unansweredQuestion").replace(
                        "{number}",
                        String(number),
                      )}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        )}

        {currentQuestion && (
          <TestQuestionCard
            question={currentQuestion}
            index={currentIndex + 1}
            selectedOptionId={answers[currentQuestion.id.toString()] ?? null}
            onSelect={(optionId) => handleSelect(currentQuestion.id, optionId)}
          />
        )}

        {!isComplete && (
          <p data-ocid="test.unanswered_nudge" className="quiz-nudge">
            {t("test.unansweredPrompt")}{" "}
            {missingNumbers.map((number) => `#${number}`).join(", ")}
          </p>
        )}

        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            disabled={currentIndex === 0}
            data-ocid="test.back_button"
            className="w-full rounded-full border-border bg-background px-5 font-semibold text-foreground transition-smooth hover:bg-muted sm:w-auto"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("test.back")}
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {currentIndex < total - 1 && (
              <Button
                type="button"
                onClick={() =>
                  setCurrentIndex((index) => Math.min(total - 1, index + 1))
                }
                data-ocid="test.next_button"
                className="w-full rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90 sm:w-auto"
              >
                {t("test.next")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isComplete || submitTest.isPending}
              data-ocid="test.submit_button"
              className="w-full rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90 sm:w-auto"
            >
              <Send className="size-4" aria-hidden="true" />
              {submitTest.isPending ? t("test.submitting") : t("test.submit")}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={t("test.close")}
        data-ocid="test.modal_backdrop"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-foreground/40 backdrop-blur-md"
      />

      <dialog
        ref={panelRef as never}
        open
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-ocid="test.panel"
        className="relative z-10 m-0 my-auto block h-auto max-h-none w-full max-w-2xl overflow-visible rounded-3xl border border-border bg-card p-6 text-foreground shadow-elevated outline-none sm:p-8"
      >
        <button
          type="button"
          data-ocid="test.close_button"
          onClick={onClose}
          aria-label={t("test.close")}
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <header className="pr-12">
          <p className="eyebrow">{t("test.eyebrow")}</p>
          <h2
            id={titleId}
            className="mt-3 font-display text-2xl font-semibold text-heading-brand sm:text-3xl"
          >
            {t("test.title").replace("{trial}", trialName)}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("test.intro")}
          </p>
        </header>

        <div className="mt-6">{renderBody()}</div>
      </dialog>
    </div>,
    document.body,
  );
}
