import { Section } from "@/components/layout/PageShell";
import { Reveal } from "@/components/layout/Reveal";
import { useLanguage } from "@/lib/i18n";

interface TeamMember {
  initialsKey: string;
  nameKey: string;
  roleKey: string;
  gradeKey: string;
  bioKey: string;
}

const MEMBERS: TeamMember[] = [
  {
    initialsKey: "main.teamMember1Initials",
    nameKey: "main.teamMember1Name",
    roleKey: "main.teamMember1Role",
    gradeKey: "main.teamMember1Grade",
    bioKey: "main.teamMember1Bio",
  },
  {
    initialsKey: "main.teamMember2Initials",
    nameKey: "main.teamMember2Name",
    roleKey: "main.teamMember2Role",
    gradeKey: "main.teamMember2Grade",
    bioKey: "main.teamMember2Bio",
  },
  {
    initialsKey: "main.teamMember3Initials",
    nameKey: "main.teamMember3Name",
    roleKey: "main.teamMember3Role",
    gradeKey: "main.teamMember3Grade",
    bioKey: "main.teamMember3Bio",
  },
];

/** The three students behind Career Trial. */
export function TeamSection() {
  const { t } = useLanguage();

  return (
    <Section id="our-team">
      <Reveal>
        <div className="max-w-2xl">
          <p className="eyebrow">{t("main.teamEyebrow")}</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            {t("main.teamTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("main.teamBody")}
          </p>
        </div>
      </Reveal>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {MEMBERS.map((member, index) => (
          <Reveal as="li" key={member.nameKey} delay={index * 100}>
            <div
              data-ocid={`main.team_card.${index + 1}`}
              className="wobble-hover flex h-full flex-col items-start rounded-3xl border border-border bg-card p-6 shadow-subtle"
            >
              <span
                aria-hidden="true"
                className="flex size-16 items-center justify-center rounded-full bg-secondary font-display text-xl font-bold text-primary"
              >
                {t(member.initialsKey)}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-heading-brand">
                {t(member.nameKey)}
              </h3>
              <p className="mt-1 text-sm font-medium text-primary">
                {t(member.roleKey)}
              </p>
              <span className="mt-3 rounded-full border border-border bg-background px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground">
                {t(member.gradeKey)}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {t(member.bioKey)}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
