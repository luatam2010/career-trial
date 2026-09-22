import { Building2, GraduationCap, School, Users, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import { Section } from "@/components/layout/PageShell";
import { Reveal } from "@/components/layout/Reveal";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface UserOption {
  id: string;
  icon: LucideIcon;
  labelKey: string;
  bodyKey: string;
}

const USER_OPTIONS: UserOption[] = [
  {
    id: "students",
    icon: GraduationCap,
    labelKey: "main.businessUser1",
    bodyKey: "main.businessUser1Body",
  },
  {
    id: "parents",
    icon: Users,
    labelKey: "main.businessUser2",
    bodyKey: "main.businessUser2Body",
  },
  {
    id: "schools",
    icon: School,
    labelKey: "main.businessUser3",
    bodyKey: "main.businessUser3Body",
  },
  {
    id: "companies",
    icon: Building2,
    labelKey: "main.businessUser4",
    bodyKey: "main.businessUser4Body",
  },
];

interface PayerOption {
  id: string;
  icon: LucideIcon;
  labelKey: string;
  bodyKey: string;
}

const PAYER_OPTIONS: PayerOption[] = [
  {
    id: "schools",
    icon: School,
    labelKey: "main.businessPayer1",
    bodyKey: "main.businessPayer1Body",
  },
  {
    id: "families",
    icon: Wallet,
    labelKey: "main.businessPayer2",
    bodyKey: "main.businessPayer2Body",
  },
  {
    id: "companies",
    icon: Building2,
    labelKey: "main.businessPayer3",
    bodyKey: "main.businessPayer3Body",
  },
];

interface RevenueCard {
  indexKey: string;
  titleKey: string;
  badgeKey: string;
  bodyKey: string;
}

const REVENUE_CARDS: RevenueCard[] = [
  {
    indexKey: "main.revenue1Index",
    titleKey: "main.revenue1Title",
    badgeKey: "main.revenue1Badge",
    bodyKey: "main.revenue1Body",
  },
  {
    indexKey: "main.revenue2Index",
    titleKey: "main.revenue2Title",
    badgeKey: "main.revenue2Badge",
    bodyKey: "main.revenue2Body",
  },
  {
    indexKey: "main.revenue3Index",
    titleKey: "main.revenue3Title",
    badgeKey: "main.revenue3Badge",
    bodyKey: "main.revenue3Body",
  },
];

/** Main Users + Who can pay selectors, then the three revenue cards. */
export function BusinessModelSection() {
  const { t } = useLanguage();
  const [activeUser, setActiveUser] = useState(USER_OPTIONS[0].id);
  const [activePayer, setActivePayer] = useState(PAYER_OPTIONS[0].id);

  const selectedUser =
    USER_OPTIONS.find((option) => option.id === activeUser) ?? USER_OPTIONS[0];
  const selectedPayer =
    PAYER_OPTIONS.find((option) => option.id === activePayer) ??
    PAYER_OPTIONS[0];

  return (
    <Section id="business-model">
      <Reveal>
        <div className="max-w-2xl">
          <p className="eyebrow">{t("main.businessEyebrow")}</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            {t("main.businessTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("main.businessSubtitle")}
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Main Users selector */}
        <Reveal>
          <div
            data-ocid="main.business_users_panel"
            className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-subtle"
          >
            <h3 className="font-display text-lg font-semibold text-heading-brand">
              {t("main.businessUsersLabel")}
            </h3>
            <fieldset
              aria-label={t("main.businessUsersLabel")}
              className="mt-4 flex flex-wrap gap-2"
            >
              {USER_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = option.id === activeUser;
                return (
                  <button
                    key={option.id}
                    type="button"
                    data-ocid={`main.business_user.${option.id}`}
                    aria-pressed={isActive}
                    onClick={() => setActiveUser(option.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-subtle"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {t(option.labelKey)}
                  </button>
                );
              })}
            </fieldset>
            <p
              data-ocid="main.business_user_description"
              className="mt-5 rounded-2xl bg-secondary p-4 text-sm leading-relaxed text-secondary-foreground"
            >
              {t(selectedUser.bodyKey)}
            </p>
          </div>
        </Reveal>

        {/* Who can pay selector */}
        <Reveal delay={100}>
          <div
            data-ocid="main.business_payers_panel"
            className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-subtle"
          >
            <h3 className="font-display text-lg font-semibold text-heading-brand">
              {t("main.businessPayersLabel")}
            </h3>
            <fieldset
              aria-label={t("main.businessPayersLabel")}
              className="mt-4 flex flex-col gap-2"
            >
              {PAYER_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = option.id === activePayer;
                return (
                  <button
                    key={option.id}
                    type="button"
                    data-ocid={`main.business_payer.${option.id}`}
                    aria-pressed={isActive}
                    onClick={() => setActivePayer(option.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "border-primary bg-secondary text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-xl transition-smooth",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-primary",
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">{t(option.labelKey)}</span>
                  </button>
                );
              })}
            </fieldset>
            <p
              data-ocid="main.business_payer_description"
              className="mt-5 rounded-2xl bg-secondary p-4 text-sm leading-relaxed text-secondary-foreground"
            >
              {t(selectedPayer.bodyKey)}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Revenue cards */}
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {REVENUE_CARDS.map((card, index) => (
          <Reveal as="li" key={card.indexKey} delay={index * 90}>
            <div
              data-ocid={`main.revenue_card.${index + 1}`}
              className="wobble-hover flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-subtle"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-secondary font-mono text-sm font-bold text-primary">
                  {t(card.indexKey)}
                </span>
                <span className="rounded-full border border-primary/25 bg-background px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                  {t(card.badgeKey)}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-heading-brand">
                {t(card.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(card.bodyKey)}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
