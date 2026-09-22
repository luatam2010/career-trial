import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout/PageShell";
import { Reveal } from "@/components/layout/Reveal";
import { EvidenceCardVisual } from "@/components/main/EvidenceCardVisual";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

const PREVIEW_ASPECTS = [
  { labelKey: "main.evidenceCardAspect1", value: 88 },
  { labelKey: "main.evidenceCardAspect2", value: 72 },
  { labelKey: "main.evidenceCardAspect3", value: 64 },
  { labelKey: "main.evidenceCardAspect4", value: 81 },
] as const;

/** Intro to the Evidence Card feature plus a live example card. */
export function EvidencePreviewSection() {
  const { t } = useLanguage();

  return (
    <Section id="evidence-preview">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="max-w-xl">
            <p className="eyebrow">{t("main.evidenceEyebrow")}</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              {t("main.evidenceTitle")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {t("main.evidenceSubtitle")}
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
            >
              <Link to="/evidence" data-ocid="main.evidence_cta_button">
                {t("main.evidenceCta")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="tilt-hover mx-auto w-full max-w-md">
            <EvidenceCardVisual
              studentName={t("main.evidenceCardStudent")}
              careerName={t("main.evidenceCardCareer")}
              completion={86}
              rating="4.7 / 5"
              aspects={[...PREVIEW_ASPECTS]}
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
