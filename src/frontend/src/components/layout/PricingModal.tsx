/**
 * Pilot pricing pop-up.
 *
 * Built on a custom portal rather than the stock shadcn DialogContent, because
 * that primitive hardcodes its own overlay and close button. This version dims
 * AND blurs everything behind the panel, closes on X / Escape / backdrop click,
 * traps focus, restores focus on close, and locks body scroll.
 */
import { Check, Sparkles, X } from "lucide-react";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface PricingModalContextValue {
  isOpen: boolean;
  openPricing: () => void;
  closePricing: () => void;
}

const PricingModalContext = createContext<PricingModalContextValue | null>(
  null,
);

interface Plan {
  index: string;
  nameKey: string;
  priceKey: string;
  descriptionKey: string;
  featureKeys: string[];
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    index: "01",
    nameKey: "pricing.plan1Name",
    priceKey: "pricing.plan1Price",
    descriptionKey: "pricing.plan1Description",
    featureKeys: [
      "pricing.plan1Feature1",
      "pricing.plan1Feature2",
      "pricing.plan1Feature3",
    ],
  },
  {
    index: "02",
    nameKey: "pricing.plan2Name",
    priceKey: "pricing.plan2Price",
    descriptionKey: "pricing.plan2Description",
    featureKeys: [
      "pricing.plan2Feature1",
      "pricing.plan2Feature2",
      "pricing.plan2Feature3",
    ],
    featured: true,
  },
  {
    index: "03",
    nameKey: "pricing.plan3Name",
    priceKey: "pricing.plan3Price",
    descriptionKey: "pricing.plan3Description",
    featureKeys: [
      "pricing.plan3Feature1",
      "pricing.plan3Feature2",
      "pricing.plan3Feature3",
    ],
  },
  {
    index: "04",
    nameKey: "pricing.plan4Name",
    priceKey: "pricing.plan4Price",
    descriptionKey: "pricing.plan4Description",
    featureKeys: [
      "pricing.plan4Feature1",
      "pricing.plan4Feature2",
      "pricing.plan4Feature3",
    ],
  },
  {
    index: "05",
    nameKey: "pricing.plan5Name",
    priceKey: "pricing.plan5Price",
    descriptionKey: "pricing.plan5Description",
    featureKeys: [
      "pricing.plan5Feature1",
      "pricing.plan5Feature2",
      "pricing.plan5Feature3",
    ],
  },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function PricingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPricing = useCallback(() => setIsOpen(true), []);
  const closePricing = useCallback(() => setIsOpen(false), []);

  const value = useMemo<PricingModalContextValue>(
    () => ({ isOpen, openPricing, closePricing }),
    [isOpen, openPricing, closePricing],
  );

  return (
    <PricingModalContext.Provider value={value}>
      {children}
      <PricingModal />
    </PricingModalContext.Provider>
  );
}

export function usePricingModal(): PricingModalContextValue {
  const context = useContext(PricingModalContext);
  if (!context) {
    throw new Error(
      "usePricingModal must be used inside a PricingModalProvider",
    );
  }
  return context;
}

function PricingModal() {
  const { isOpen, closePricing } = usePricingModal();
  const { t } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) return;

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
        closePricing();
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
  }, [isOpen, closePricing]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
      {/* Backdrop: dims AND blurs everything outside the pop-up */}
      <button
        type="button"
        aria-label={t("pricing.close")}
        data-ocid="pricing.backdrop"
        onClick={closePricing}
        className="fixed inset-0 cursor-default bg-foreground/40 backdrop-blur-md"
      />

      <dialog
        ref={panelRef as never}
        open
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        data-ocid="pricing.modal"
        className="relative z-10 m-0 my-auto block h-auto max-h-none w-full max-w-5xl overflow-visible rounded-3xl border border-border bg-card p-6 text-foreground shadow-elevated outline-none sm:p-8"
      >
        <button
          type="button"
          data-ocid="pricing.close_button"
          onClick={closePricing}
          aria-label={t("pricing.close")}
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <header className="max-w-2xl pr-12">
          <p className="eyebrow">{t("pricing.eyebrow")}</p>
          <h2 id={titleId} className="mt-3 text-2xl font-semibold sm:text-3xl">
            {t("pricing.modalTitle")}
          </h2>
          <p id={descriptionId} className="mt-3 text-sm text-muted-foreground">
            {t("pricing.modalSubtitle")}
          </p>
        </header>

        {/* 7-day free trial callout */}
        <div
          data-ocid="pricing.trial_callout"
          className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary/25 bg-secondary p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-base font-semibold text-heading-brand">
                {t("pricing.trialCalloutTitle")}
              </p>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                {t("pricing.trialCalloutBody")}
              </p>
            </div>
          </div>
          <Button
            type="button"
            data-ocid="pricing.trial_cta_button"
            onClick={closePricing}
            className="shrink-0 rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
          >
            {t("pricing.trialCalloutCta")}
          </Button>
        </div>

        {/* Five pilot plans */}
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <li
              key={plan.index}
              data-ocid={`pricing.plan.${plan.index}`}
              className={cn(
                "flex flex-col rounded-2xl border bg-background p-5 transition-smooth",
                plan.featured
                  ? "border-primary/40 shadow-subtle ring-1 ring-primary/20"
                  : "border-border",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold tracking-widest text-primary">
                  {plan.index}
                </span>
                {plan.featured && (
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary-foreground">
                    {t("pricing.plan2Name")}
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-heading-brand">
                {t(plan.nameKey)}
              </h3>
              <p className="mt-2 font-mono text-xl font-bold text-primary">
                {t(plan.priceKey)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(plan.descriptionKey)}
              </p>
              <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {t("pricing.featuresLabel")}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {plan.featureKeys.map((featureKey) => (
                  <li key={featureKey} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-foreground">
                      {t(featureKey)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </dialog>
    </div>,
    document.body,
  );
}
