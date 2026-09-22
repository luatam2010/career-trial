import { Compass, Lightbulb, ListChecks, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Section } from "@/components/layout/PageShell";
import { Reveal } from "@/components/layout/Reveal";
import { useLanguage } from "@/lib/i18n";

interface Step {
  index: string;
  icon: LucideIcon;
  titleKey: string;
  bodyKey: string;
}

const STEPS: Step[] = [
  {
    index: "01",
    icon: Compass,
    titleKey: "main.howStep1Title",
    bodyKey: "main.howStep1Body",
  },
  {
    index: "02",
    icon: ListChecks,
    titleKey: "main.howStep2Title",
    bodyKey: "main.howStep2Body",
  },
  {
    index: "03",
    icon: Lightbulb,
    titleKey: "main.howStep3Title",
    bodyKey: "main.howStep3Body",
  },
  {
    index: "04",
    icon: Trophy,
    titleKey: "main.howStep4Title",
    bodyKey: "main.howStep4Body",
  },
];

/** The four-step Explore → Trial → Reflect → Decide rhythm. */
export function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <Section id="how-it-works" className="surface-mint">
      <Reveal>
        <div className="max-w-2xl">
          <p className="eyebrow">{t("main.howEyebrow")}</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            {t("main.howTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("main.howSubtitle")}
          </p>
        </div>
      </Reveal>

      <ol
        data-ocid="main.how_it_works_list"
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <Reveal
              as="li"
              key={step.index}
              delay={index * 90}
              className="h-full"
            >
              <div
                data-ocid={`main.how_step.${index + 1}`}
                className="wobble-hover flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-subtle"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full border border-primary/25 bg-background font-mono text-xs font-bold text-primary">
                    {step.index}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-heading-brand">
                  {t(step.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(step.bodyKey)}
                </p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
