import { Check, Tag } from "lucide-react";

import { Section } from "@/components/layout/PageShell";
import { usePricingModal } from "@/components/layout/PricingModal";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface PlanCard {
  indexKey: string;
  categoryKey: string;
  titleKey: string;
  priceKey: string;
  bodyKey: string;
  featureKeys: string[];
  /** The fifth plan spans the full width beneath the row of four. */
  wide?: boolean;
}

const PLANS: PlanCard[] = [
  {
    indexKey: "main.pricingPlan1Index",
    categoryKey: "main.pricingPlan1Category",
    titleKey: "main.pricingPlan1Title",
    priceKey: "main.pricingPlan1Price",
    bodyKey: "main.pricingPlan1Body",
    featureKeys: [
      "main.pricingPlan1Feature1",
      "main.pricingPlan1Feature2",
      "main.pricingPlan1Feature3",
    ],
  },
  {
    indexKey: "main.pricingPlan2Index",
    categoryKey: "main.pricingPlan2Category",
    titleKey: "main.pricingPlan2Title",
    priceKey: "main.pricingPlan2Price",
    bodyKey: "main.pricingPlan2Body",
    featureKeys: [
      "main.pricingPlan2Feature1",
      "main.pricingPlan2Feature2",
      "main.pricingPlan2Feature3",
    ],
  },
  {
    indexKey: "main.pricingPlan3Index",
    categoryKey: "main.pricingPlan3Category",
    titleKey: "main.pricingPlan3Title",
    priceKey: "main.pricingPlan3Price",
    bodyKey: "main.pricingPlan3Body",
    featureKeys: [
      "main.pricingPlan3Feature1",
      "main.pricingPlan3Feature2",
      "main.pricingPlan3Feature3",
    ],
  },
  {
    indexKey: "main.pricingPlan4Index",
    categoryKey: "main.pricingPlan4Category",
    titleKey: "main.pricingPlan4Title",
    priceKey: "main.pricingPlan4Price",
    bodyKey: "main.pricingPlan4Body",
    featureKeys: [
      "main.pricingPlan4Feature1",
      "main.pricingPlan4Feature2",
      "main.pricingPlan4Feature3",
    ],
  },
  {
    indexKey: "main.pricingPlan5Index",
    categoryKey: "main.pricingPlan5Category",
    titleKey: "main.pricingPlan5Title",
    priceKey: "main.pricingPlan5Price",
    bodyKey: "main.pricingPlan5Body",
    featureKeys: [
      "main.pricingPlan5Feature1",
      "main.pricingPlan5Feature2",
      "main.pricingPlan5Feature3",
    ],
    wide: true,
  },
];

/** Pilot pricing: eyebrow, heading, badge and the five plan cards. */
export function PilotPricingSection() {
  const { t } = useLanguage();
  const { openPricing } = usePricingModal();

  return (
    <Section id="pilot-pricing" className="surface-mint">
      <Reveal>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">{t("main.pricingEyebrow")}</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              {t("main.pricingTitle")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("main.pricingBody")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
            <span
              data-ocid="main.pricing_badge"
              className="surface-cream inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
            >
              <Tag className="size-3.5" aria-hidden="true" />
              {t("main.pricingBadge")}
            </span>
            <Button
              type="button"
              size="lg"
              data-ocid="main.pricing_open_modal_button"
              onClick={openPricing}
              className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
            >
              {t("main.pricingOpenModal")}
            </Button>
          </div>
        </div>
      </Reveal>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan, index) => (
          <Reveal
            as="li"
            key={plan.indexKey}
            delay={index * 80}
            className={cn(plan.wide && "lg:col-span-4")}
          >
            <div
              data-ocid={`main.pricing_card.${index + 1}`}
              className={cn(
                "wobble-hover flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-subtle",
                plan.wide && "lg:flex-row lg:items-start lg:gap-10",
              )}
            >
              <div className={cn(plan.wide && "lg:flex-1")}>
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-secondary font-mono text-sm font-bold text-primary">
                    {t(plan.indexKey)}
                  </span>
                  <span className="text-right text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {t(plan.categoryKey)}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-heading-brand">
                  {t(plan.titleKey)}
                </h3>
                <p className="mt-2 font-mono text-2xl font-bold text-primary">
                  {t(plan.priceKey)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(plan.bodyKey)}
                </p>
              </div>

              <ul
                className={cn(
                  "mt-5 flex flex-col gap-2.5",
                  plan.wide && "lg:mt-0 lg:w-72 lg:shrink-0",
                )}
              >
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
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
