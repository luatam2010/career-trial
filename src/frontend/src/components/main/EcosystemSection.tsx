import { Handshake, Info, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Section } from "@/components/layout/PageShell";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

interface EcosystemCard {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  bodyKey: string;
  tagKeys: string[];
  ctaKey: string;
  /** Mentor card is solid teal; partner card is outlined. */
  solid: boolean;
}

const CARDS: EcosystemCard[] = [
  {
    id: "mentor",
    icon: Users,
    titleKey: "main.ecosystemMentorTitle",
    bodyKey: "main.ecosystemMentorBody",
    tagKeys: [
      "main.ecosystemMentorTag1",
      "main.ecosystemMentorTag2",
      "main.ecosystemMentorTag3",
    ],
    ctaKey: "main.ecosystemMentorCta",
    solid: true,
  },
  {
    id: "partner",
    icon: Handshake,
    titleKey: "main.ecosystemPartnerTitle",
    bodyKey: "main.ecosystemPartnerBody",
    tagKeys: [
      "main.ecosystemPartnerTag1",
      "main.ecosystemPartnerTag2",
      "main.ecosystemPartnerTag3",
    ],
    ctaKey: "main.ecosystemPartnerCta",
    solid: false,
  },
];

/** Join the Career Trial Ecosystem — informational cards only. */
export function EcosystemSection() {
  const { t } = useLanguage();

  return (
    <Section id="join-ecosystem">
      <Reveal>
        <div className="max-w-2xl">
          <p className="eyebrow">{t("main.ecosystemEyebrow")}</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            {t("main.ecosystemTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("main.ecosystemBody")}
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {CARDS.map((card, index) => {
          const Icon = card.icon;
          return (
            <Reveal key={card.id} delay={index * 110}>
              <div
                data-ocid={`main.ecosystem_card.${card.id}`}
                className="wobble-hover flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-subtle"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-heading-brand">
                  {t(card.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(card.bodyKey)}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {card.tagKeys.map((tagKey) => (
                    <li
                      key={tagKey}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {t(tagKey)}
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  size="lg"
                  data-ocid={`main.ecosystem_cta.${card.id}`}
                  className={
                    card.solid
                      ? "mt-7 w-fit rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
                      : "mt-7 w-fit rounded-full border border-primary/40 bg-background px-6 font-semibold text-primary transition-smooth hover:bg-secondary hover:text-primary"
                  }
                >
                  {t(card.ctaKey)}
                </Button>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Pilot pricing disclaimer banner */}
      <Reveal delay={120}>
        <div
          data-ocid="main.pricing_disclaimer"
          className="surface-cream mt-10 flex items-start gap-4 rounded-3xl p-6"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-background/70">
            <Info className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-base font-semibold">
              {t("main.disclaimerTitle")}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">
              {t("main.disclaimerBody")}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
