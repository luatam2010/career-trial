import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Compass, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

const TRIAL_TASKS = [
  "main.heroEvidenceCardAspect1",
  "main.heroEvidenceCardAspect2",
  "main.heroEvidenceCardAspect3",
] as const;

const HERO_ASPECTS = [
  { labelKey: "main.heroEvidenceCardAspect1", value: 82 },
  { labelKey: "main.heroEvidenceCardAspect2", value: 68 },
  { labelKey: "main.heroEvidenceCardAspect3", value: 91 },
  { labelKey: "main.heroEvidenceCardAspect4", value: 74 },
] as const;

/**
 * Hero: headline, subcopy, primary CTA to the Career Trial route, and a
 * composed illustration built from divs — a trial card overlapping an
 * evidence card, both with the design system's tilt/wobble hover.
 */
export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      data-ocid="main.hero_section"
      className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-[28rem] rounded-full bg-secondary/70 blur-3xl"
      />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <p className="eyebrow">{t("main.heroEyebrow")}</p>
          <h1 className="mt-4 text-4xl leading-[1.06] font-semibold sm:text-5xl lg:text-6xl">
            {t("main.heroTitle")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {t("main.heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
            >
              <Link to="/career-trial" data-ocid="main.hero_cta_button">
                {t("main.heroCta")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-primary/40 px-6 font-semibold text-primary transition-smooth hover:bg-secondary hover:text-primary"
            >
              <Link to="/evidence" data-ocid="main.hero_evidence_link">
                {t("main.evidenceCta")}
              </Link>
            </Button>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
            {(
              [
                ["hero.stat1Value", "hero.stat1Label"],
                ["hero.stat2Value", "hero.stat2Label"],
                ["hero.stat3Value", "hero.stat3Label"],
              ] as const
            ).map(([valueKey, labelKey]) => (
              <div key={valueKey} className="min-w-0">
                <dt className="font-display text-xl font-bold text-primary sm:text-2xl">
                  {t(valueKey)}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                  {t(labelKey)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Composed illustration — no external image files */}
        <div
          data-ocid="main.hero_visual"
          aria-label={t("main.heroVisualLabel")}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="tilt-hover relative rounded-3xl border border-border bg-card p-6 shadow-elevated">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <Compass className="size-4" aria-hidden="true" />
                {t("main.heroTrialCardTitle")}
              </span>
              <span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[0.68rem] font-semibold text-primary">
                {t("main.heroTrialCardProgressValue")}
              </span>
            </div>

            <h2 className="mt-4 font-display text-xl font-semibold text-heading-brand">
              {t("main.heroTrialCardCareer")}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t("main.heroTrialCardTask")}
            </p>

            <div className="mt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t("main.heroTrialCardProgress")}
                </span>
                <span className="font-mono text-xs font-semibold text-primary">
                  {t("main.heroTrialCardProgressValue")}
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[72%] rounded-full bg-gradient-primary" />
              </div>
            </div>

            <ul className="mt-5 flex flex-col gap-2">
              {TRIAL_TASKS.map((key) => (
                <li key={key} className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    className="size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="truncate text-foreground">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Overlapping evidence card */}
          <div className="wobble-hover relative z-10 -mt-6 ml-auto w-[88%] rounded-3xl border border-border bg-card p-5 shadow-elevated sm:-mt-8">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="size-4" aria-hidden="true" />
                {t("main.heroEvidenceCardTitle")}
              </span>
              <span className="font-mono text-xs font-semibold text-primary">
                {t("main.heroEvidenceCardRating")}
              </span>
            </div>
            <p className="mt-3 truncate text-sm font-semibold text-heading-brand">
              {t("main.heroEvidenceCardStudent")}
            </p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {HERO_ASPECTS.map((aspect) => (
                <li key={aspect.labelKey}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-xs text-muted-foreground">
                      {t(aspect.labelKey)}
                    </span>
                    <span className="shrink-0 font-mono text-[0.68rem] font-semibold text-muted-foreground">
                      {aspect.value}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${aspect.value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
