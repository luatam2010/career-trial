import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { useLanguage } from "@/lib/i18n";

const STUDENT_LINKS = [
  { labelKey: "footer.exploreTrials", to: "/career-trial" },
  { labelKey: "footer.seeEvidence", to: "/evidence" },
  { labelKey: "nav.studentArea", to: "/student" },
] as const;

const PARTNER_LINKS = [
  { labelKey: "footer.becomeMentor", hash: "join-ecosystem" },
  { labelKey: "footer.partnerWithUs", hash: "join-ecosystem" },
  { labelKey: "footer.pricing", hash: "pilot-pricing" },
] as const;

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });
}

export function SiteFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const attributionHref = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
    typeof window === "undefined" ? "" : window.location.hostname,
  )}`;

  return (
    <footer
      data-ocid="site.footer"
      className="relative z-10 border-t border-border bg-secondary/60"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
                <Sparkles className="size-4.5" aria-hidden="true" />
              </span>
              <span className="font-display text-base font-bold tracking-tight text-heading-brand">
                {t("brand.name")}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("brand.blurb")}
            </p>
          </div>

          <nav aria-label={t("footer.forStudents")}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {t("footer.forStudents")}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {STUDENT_LINKS.map((item) => (
                <li key={item.labelKey}>
                  <Link
                    to={item.to}
                    data-ocid={`footer.link.${item.to.replace("/", "")}`}
                    className="text-sm text-muted-foreground transition-smooth hover:text-primary"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.forPartners")}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {t("footer.forPartners")}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {PARTNER_LINKS.map((item) => (
                <li key={item.labelKey}>
                  <button
                    type="button"
                    data-ocid={`footer.link.${item.hash}`}
                    onClick={() => scrollToSection(item.hash)}
                    className="text-sm text-muted-foreground transition-smooth hover:text-primary"
                  >
                    {t(item.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} {t("brand.name")}. {t("footer.rights")}
          </p>
          <a
            href={attributionHref}
            target="_blank"
            rel="noreferrer"
            data-ocid="footer.attribution_link"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-smooth hover:text-primary"
          >
            {t("footer.attribution")}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
