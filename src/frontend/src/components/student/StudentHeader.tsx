import { Award, LogOut, Route } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";

interface StudentHeaderProps {
  /** Number of trials the student has enrolled in. */
  enrollmentCount: number;
  /** Number of evidence cards the student has collected. */
  evidenceCount: number;
  /** The student's display name, or null when they have not set one yet. */
  displayName: string | null;
}

/** Shorten a principal to `first5…last3` so it stays readable in a header. */
function shortenPrincipal(principal: string): string {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 5)}…${principal.slice(-3)}`;
}

/** Derive up to two initials from a name, e.g. "Linh Nguyen" -> "LN". */
function initialsFrom(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

/** Welcome panel for a signed-in student: greeting, identity and summary stats. */
export function StudentHeader({
  enrollmentCount,
  evidenceCount,
  displayName,
}: StudentHeaderProps) {
  const { t } = useLanguage();
  const { principal, logout } = useAuth();

  const stats = [
    {
      key: "trials",
      icon: Route,
      value: enrollmentCount,
      label: t("studentArea.statTrials"),
    },
    {
      key: "evidence",
      icon: Award,
      value: evidenceCount,
      label: t("studentArea.statEvidence"),
    },
  ];

  return (
    <div
      className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8"
      data-ocid="student.header_panel"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">{t("student.eyebrow")}</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            {displayName
              ? t("studentArea.greetingNamed").replace("{name}", displayName)
              : t("studentArea.greeting")}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {displayName ? (
              <>
                <span className="student-chip" data-ocid="student.name_chip">
                  <span className="student-chip-monogram" aria-hidden="true">
                    {initialsFrom(displayName)}
                  </span>
                  <span className="student-chip-name">{displayName}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>{t("studentArea.principalLabel")}</span>
                  <span
                    className="rounded-full bg-secondary px-3 py-1 font-mono text-xs text-secondary-foreground"
                    title={principal ?? undefined}
                    data-ocid="student.principal"
                  >
                    {principal ? shortenPrincipal(principal) : "—"}
                  </span>
                </span>
              </>
            ) : (
              <>
                <span>{t("studentArea.principalLabel")}</span>
                <span
                  className="rounded-full bg-secondary px-3 py-1 font-mono text-xs text-secondary-foreground"
                  title={principal ?? undefined}
                  data-ocid="student.principal"
                >
                  {principal ? shortenPrincipal(principal) : "—"}
                </span>
              </>
            )}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="shrink-0 rounded-full"
          onClick={logout}
          data-ocid="student.sign_out_button"
        >
          <LogOut className="size-4" aria-hidden="true" />
          {t("studentArea.signOut")}
        </Button>
      </div>

      <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="flex items-center gap-4 rounded-2xl bg-muted/60 px-5 py-4"
            data-ocid={`student.stat.${stat.key}`}
          >
            <span
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm"
              aria-hidden="true"
            >
              <stat.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <dd className="font-display text-2xl font-semibold text-heading-brand">
                {stat.value}
              </dd>
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
