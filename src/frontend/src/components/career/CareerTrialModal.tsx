import {
  Check,
  CircleCheck,
  Clock,
  ListChecks,
  Package,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { TrialTestPanel } from "@/components/career/TrialTestPanel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  isEnrollmentFailure,
  useEnroll,
  useListMyEnrollments,
} from "@/lib/backend-client";
import { formatDays } from "@/lib/format";
import { useLanguage } from "@/lib/i18n";
import type { CareerTrial } from "@/types";

interface CareerTrialModalProps {
  /** The trial whose brief is open, or null when the pop-up is closed. */
  trial: CareerTrial | null;
  onClose: () => void;
  /** Leave the brief and open the Evidence page (used after a test attempt). */
  onViewEvidence?: () => void;
}

type EnrollState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "already" }
  | { status: "error"; message: string };

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Detailed task pop-up for a career trial: brief, checklist, deliverables and
 * estimated days, plus the enrolment action.
 *
 * `enroll` returns an EnrollmentError whose variant set carries an explicit
 * `ok` success tag, so only the five known failure kinds are treated as
 * failures.
 */
export function CareerTrialModal({
  trial,
  onClose,
  onViewEvidence,
}: CareerTrialModalProps) {
  const { t } = useLanguage();
  const { isAuthenticated, login } = useAuth();
  const enroll = useEnroll();
  const { refetch: refetchEnrollments } = useListMyEnrollments(isAuthenticated);

  const [state, setState] = useState<EnrollState>({ status: "idle" });
  const [isTestOpen, setIsTestOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const isOpen = trial !== null;
  const trialId = trial?.id.toString() ?? null;

  // Reset the action state whenever a different trial is opened.
  useEffect(() => {
    if (trialId !== null) {
      setState({ status: "idle" });
      setIsTestOpen(false);
    }
  }, [trialId]);

  useEffect(() => {
    if (!isOpen || isTestOpen) return;

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
  }, [isOpen, isTestOpen, onClose]);

  if (!isOpen || !trial || typeof document === "undefined") return null;

  if (isTestOpen) {
    return (
      <TrialTestPanel
        trialId={trial.id}
        trialName={trial.name}
        onClose={() => setIsTestOpen(false)}
        onViewEvidence={() => {
          setIsTestOpen(false);
          onClose();
          onViewEvidence?.();
        }}
      />
    );
  }

  const handleStartTest = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    setIsTestOpen(true);
  };

  const handlePrimary = () => {
    if (!isAuthenticated) {
      login();
      return;
    }

    enroll.mutate(trial.id, {
      onSuccess: (result) => {
        if (!isEnrollmentFailure(result)) {
          setState({ status: "success" });
          void refetchEnrollments();
          return;
        }
        if (result.__kind__ === "alreadyEnrolled") {
          setState({ status: "already" });
          void refetchEnrollments();
          return;
        }
        setState({
          status: "error",
          message: t(`enroll.${result.__kind__}`),
        });
      },
      onError: () => {
        setState({ status: "error", message: t("enroll.genericError") });
      },
    });
  };

  const isSettled = state.status === "success" || state.status === "already";

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={t("careerTrial.modalClose")}
        data-ocid="career_trial.modal_backdrop"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-foreground/40 backdrop-blur-md"
      />

      <dialog
        ref={panelRef as never}
        open
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        data-ocid="career_trial.modal"
        className="relative z-10 m-0 my-auto block h-auto max-h-none w-full max-w-3xl overflow-visible rounded-3xl border border-border bg-card p-6 text-foreground shadow-elevated outline-none sm:p-8"
      >
        <button
          type="button"
          data-ocid="career_trial.modal_close_button"
          onClick={onClose}
          aria-label={t("careerTrial.modalClose")}
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <header className="pr-12">
          <p className="eyebrow">{t("careerTrial.modalEyebrow")}</p>
          <h2
            id={titleId}
            className="mt-3 font-display text-2xl font-semibold text-heading-brand sm:text-3xl"
          >
            {trial.name}
          </h2>
          <p id={descriptionId} className="mt-3 text-sm text-muted-foreground">
            {trial.summary}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-mono text-xs font-semibold text-secondary-foreground">
              <Clock className="size-3.5" aria-hidden="true" />
              {formatDays(trial.daysToComplete)}
            </span>
            {trial.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/30 bg-background px-3 py-1 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* Brief */}
          <section className="sm:col-span-2">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Package className="size-4 text-primary" aria-hidden="true" />
              {t("careerTrial.modalBriefLabel")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {trial.brief.description}
            </p>
          </section>

          {/* Checklist */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <ListChecks className="size-4 text-primary" aria-hidden="true" />
              {t("careerTrial.modalChecklistLabel")}
            </h3>
            <ul
              data-ocid="career_trial.modal_checklist"
              className="mt-3 flex flex-col gap-2.5"
            >
              {trial.brief.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-secondary text-primary">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Deliverables */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Package className="size-4 text-primary" aria-hidden="true" />
              {t("careerTrial.modalDeliverablesLabel")}
            </h3>
            <ul
              data-ocid="career_trial.modal_deliverables"
              className="mt-3 flex flex-col gap-2.5"
            >
              {trial.brief.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Action area */}
        <div className="mt-8 border-t border-border pt-6">
          {state.status === "success" && (
            <div
              data-ocid="career_trial.modal_success_state"
              className="flex flex-col gap-4 rounded-2xl border border-primary/25 bg-secondary p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <CircleCheck
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-display text-base font-semibold text-heading-brand">
                    {t("careerTrial.modalSuccessTitle")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("careerTrial.modalSuccessBody")}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  onClick={handleStartTest}
                  data-ocid="career_trial.modal_start_test_button"
                  className="rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
                >
                  <Sparkles className="size-4" aria-hidden="true" />
                  {t("test.startTest")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  data-ocid="career_trial.modal_done_button"
                  className="rounded-full border-border bg-background px-5 font-semibold text-foreground transition-smooth hover:bg-muted"
                >
                  {t("careerTrial.modalDone")}
                </Button>
              </div>
            </div>
          )}

          {state.status === "already" && (
            <div
              data-ocid="career_trial.modal_already_state"
              className="flex flex-col gap-4 rounded-2xl border border-border bg-muted p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <CircleCheck
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-display text-base font-semibold text-heading-brand">
                    {t("careerTrial.modalAlreadyTitle")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("careerTrial.modalAlreadyBody")}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  onClick={handleStartTest}
                  data-ocid="career_trial.modal_start_test_button"
                  className="rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
                >
                  <Sparkles className="size-4" aria-hidden="true" />
                  {t("test.startTest")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  data-ocid="career_trial.modal_done_button"
                  className="rounded-full border-border bg-background px-5 font-semibold text-foreground transition-smooth hover:bg-muted"
                >
                  {t("careerTrial.modalDone")}
                </Button>
              </div>
            </div>
          )}

          {state.status === "error" && (
            <div
              data-ocid="career_trial.modal_error_state"
              role="alert"
              className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4"
            >
              <p className="font-display text-sm font-semibold text-heading-brand">
                {t("careerTrial.modalErrorTitle")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {state.message}
              </p>
            </div>
          )}

          {!isSettled && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {t("careerTrial.modalDaysLabel")}:{" "}
                <span className="font-mono font-semibold text-foreground">
                  {formatDays(trial.daysToComplete)}
                </span>
              </p>
              <Button
                type="button"
                onClick={handlePrimary}
                disabled={enroll.isPending}
                data-ocid="career_trial.modal_primary_button"
                className="w-full rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90 sm:w-auto"
              >
                {enroll.isPending
                  ? t("careerTrial.modalStarting")
                  : isAuthenticated
                    ? state.status === "error"
                      ? t("careerTrial.modalRetry")
                      : t("careerTrial.modalStart")
                    : t("careerTrial.modalSignIn")}
              </Button>
            </div>
          )}
        </div>
      </dialog>
    </div>,
    document.body,
  );
}
