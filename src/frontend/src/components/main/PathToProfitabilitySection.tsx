import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout/PageShell";
import { Reveal } from "@/components/layout/Reveal";
import { useLanguage } from "@/lib/i18n";

interface PathStep {
  index: string;
  titleKey: string;
  bodyKey: string;
}

const STEPS: PathStep[] = [
  {
    index: "1",
    titleKey: "main.pathStep1Title",
    bodyKey: "main.pathStep1Body",
  },
  {
    index: "2",
    titleKey: "main.pathStep2Title",
    bodyKey: "main.pathStep2Body",
  },
  {
    index: "3",
    titleKey: "main.pathStep3Title",
    bodyKey: "main.pathStep3Body",
  },
  {
    index: "4",
    titleKey: "main.pathStep4Title",
    bodyKey: "main.pathStep4Body",
  },
];

/** Horizontal process flow on desktop, vertical stack on mobile. */
export function PathToProfitabilitySection() {
  const { t } = useLanguage();

  return (
    <Section id="path-to-profitability" className="surface-mint">
      <Reveal>
        <div className="max-w-3xl">
          <p className="eyebrow">{t("main.pathEyebrow")}</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            {t("main.pathTitle")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t("main.pathBody")}
          </p>
        </div>
      </Reveal>

      <ol
        data-ocid="main.path_list"
        className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-2"
      >
        {STEPS.map((step, index) => (
          <Reveal
            as="li"
            key={step.index}
            delay={index * 90}
            className="flex flex-1 items-stretch gap-2"
          >
            <div
              data-ocid={`main.path_step.${index + 1}`}
              className="wobble-hover flex flex-1 flex-col rounded-3xl border border-border bg-card p-6 shadow-subtle"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
                {step.index}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-heading-brand">
                {t(step.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(step.bodyKey)}
              </p>
            </div>
            {index < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="hidden shrink-0 items-center text-primary/50 lg:flex"
              >
                <ArrowRight className="size-5" />
              </span>
            )}
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
