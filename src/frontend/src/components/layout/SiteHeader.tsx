import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  GraduationCap,
  Handshake,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface NavLink {
  labelKey: string;
  to?: string;
  hash?: string;
}

const NAV_LINKS: NavLink[] = [
  { labelKey: "nav.howItWorks", to: "/", hash: "how-it-works" },
  { labelKey: "nav.careerTrial", to: "/career-trial" },
  { labelKey: "nav.evidence", to: "/evidence" },
  { labelKey: "nav.businessModel", to: "/", hash: "business-model" },
  { labelKey: "nav.ourTeam", to: "/", hash: "our-team" },
];

/** Smooth-scroll to an in-page section, falling back to a plain jump. */
function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });
}

export function SiteHeader() {
  const { t, language, setLanguage } = useLanguage();
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const handleLogoClick = () => {
    setMobileOpen(false);
    void navigate({ to: "/" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnchor = (hash: string) => {
    setMobileOpen(false);
    void navigate({ to: "/" });
    window.setTimeout(() => scrollToSection(hash), 60);
  };

  const handleLogin = () => {
    setMobileOpen(false);
    login();
  };

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
  };

  return (
    <header
      data-ocid="site.header"
      className="sticky top-0 z-50 border-b border-border bg-card/95 shadow-subtle backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        {/* Logo / wordmark — returns to the top of the Main Page */}
        <button
          type="button"
          data-ocid="nav.logo"
          onClick={handleLogoClick}
          aria-label={t("nav.logoHome")}
          className="group flex shrink-0 items-center gap-2.5 rounded-lg px-1 py-1 text-left transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-subtle transition-smooth group-hover:scale-105">
            <Sparkles className="size-4.5" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight text-heading-brand">
              {t("brand.name")}
            </span>
            <span className="mt-0.5 hidden text-[0.68rem] font-medium text-muted-foreground sm:block">
              {t("brand.tagline")}
            </span>
          </span>
        </button>

        {/* Desktop navigation */}
        <nav
          aria-label={t("nav.openMenu")}
          className="ml-4 hidden items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map((item) =>
            item.hash ? (
              <button
                key={item.labelKey}
                type="button"
                data-ocid={`nav.link.${item.hash}`}
                onClick={() => handleAnchor(item.hash as string)}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t(item.labelKey)}
              </button>
            ) : (
              <Link
                key={item.labelKey}
                to={item.to as string}
                data-ocid={`nav.link.${item.to?.replace("/", "")}`}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                activeProps={{ className: "text-primary" }}
              >
                {t(item.labelKey)}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Language switcher */}
          <fieldset
            data-ocid="nav.language_switcher"
            aria-label={t("nav.languageSwitcher")}
            className="hidden items-center rounded-full border border-border bg-background p-0.5 sm:flex"
          >
            {(["en", "vi"] as const).map((code) => (
              <button
                key={code}
                type="button"
                data-ocid={`nav.language.${code}`}
                onClick={() => setLanguage(code)}
                aria-pressed={language === code}
                aria-label={
                  code === "en"
                    ? t("nav.switchToEnglish")
                    : t("nav.switchToVietnamese")
                }
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  language === code
                    ? "bg-primary text-primary-foreground shadow-subtle"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {code}
              </button>
            ))}
          </fieldset>

          {/* Get involved dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                data-ocid="nav.get_involved_button"
                className="hidden rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground md:inline-flex"
              >
                {t("nav.getInvolved")}
                <ChevronDown className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              data-ocid="nav.get_involved_menu"
              className="w-72 rounded-2xl border-border p-2 shadow-elevated"
            >
              <DropdownMenuItem
                data-ocid="nav.become_mentor_item"
                onSelect={() => handleAnchor("join-ecosystem")}
                className="flex cursor-pointer items-start gap-3 rounded-xl p-3"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <GraduationCap className="size-4.5" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {t("nav.becomeMentor")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t("nav.becomeMentorHint")}
                  </span>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                data-ocid="nav.partner_item"
                onSelect={() => handleAnchor("join-ecosystem")}
                className="flex cursor-pointer items-start gap-3 rounded-xl p-3"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Handshake className="size-4.5" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {t("nav.partnerWithUs")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t("nav.partnerWithUsHint")}
                  </span>
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth controls */}
          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Button
                asChild
                variant="ghost"
                className="rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              >
                <Link to="/student" data-ocid="nav.student_area_link">
                  <UserRound className="size-4" aria-hidden="true" />
                  {t("nav.studentArea")}
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                data-ocid="nav.sign_out_button"
                onClick={handleLogout}
                className="rounded-full border-border px-3 text-sm font-medium"
              >
                <LogOut className="size-4" aria-hidden="true" />
                {t("nav.signOut")}
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button
                type="button"
                data-ocid="nav.student_login_button"
                onClick={handleLogin}
                disabled={isLoading}
                className="rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-subtle transition-smooth hover:bg-primary/90"
              >
                {t("nav.studentLogin")}
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-primary/40 px-4 text-sm font-semibold text-primary transition-smooth hover:bg-secondary hover:text-primary"
              >
                <Link to="/career-trial" data-ocid="nav.explore_career_button">
                  {t("nav.exploreCareer")}
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            data-ocid="nav.mobile_menu_button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="site-mobile-menu"
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-smooth hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div
          id="site-mobile-menu"
          data-ocid="nav.mobile_menu"
          className="border-t border-border bg-card lg:hidden"
        >
          <nav
            aria-label={t("nav.openMenu")}
            className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6"
          >
            {NAV_LINKS.map((item) =>
              item.hash ? (
                <button
                  key={item.labelKey}
                  type="button"
                  data-ocid={`nav.mobile_link.${item.hash}`}
                  onClick={() => handleAnchor(item.hash as string)}
                  className="rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground transition-smooth hover:bg-secondary"
                >
                  {t(item.labelKey)}
                </button>
              ) : (
                <Link
                  key={item.labelKey}
                  to={item.to as string}
                  data-ocid={`nav.mobile_link.${item.to?.replace("/", "")}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-smooth hover:bg-secondary"
                >
                  {t(item.labelKey)}
                </Link>
              ),
            )}

            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              <button
                type="button"
                data-ocid="nav.mobile_become_mentor"
                onClick={() => handleAnchor("join-ecosystem")}
                className="flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-smooth hover:bg-secondary"
              >
                <GraduationCap
                  className="mt-0.5 size-4.5 text-primary"
                  aria-hidden="true"
                />
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {t("nav.becomeMentor")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t("nav.becomeMentorHint")}
                  </span>
                </span>
              </button>
              <button
                type="button"
                data-ocid="nav.mobile_partner"
                onClick={() => handleAnchor("join-ecosystem")}
                className="flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-smooth hover:bg-secondary"
              >
                <Handshake
                  className="mt-0.5 size-4.5 text-primary"
                  aria-hidden="true"
                />
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {t("nav.partnerWithUs")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t("nav.partnerWithUsHint")}
                  </span>
                </span>
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between rounded-xl bg-background px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("nav.languageSwitcher")}
              </span>
              <div className="flex items-center gap-1">
                {(["en", "vi"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    data-ocid={`nav.mobile_language.${code}`}
                    onClick={() => setLanguage(code)}
                    aria-pressed={language === code}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-smooth",
                      language === code
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Button
                    asChild
                    className="w-full rounded-full bg-primary text-primary-foreground"
                  >
                    <Link
                      to="/student"
                      data-ocid="nav.mobile_student_area"
                      onClick={() => setMobileOpen(false)}
                    >
                      <UserRound className="size-4" aria-hidden="true" />
                      {t("nav.studentArea")}
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="nav.mobile_sign_out"
                    onClick={handleLogout}
                    className="w-full rounded-full border-border"
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    {t("nav.signOut")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    data-ocid="nav.mobile_student_login"
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full rounded-full bg-primary text-primary-foreground"
                  >
                    {t("nav.studentLogin")}
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-full border-primary/40 text-primary"
                  >
                    <Link
                      to="/career-trial"
                      data-ocid="nav.mobile_explore_career"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t("nav.exploreCareer")}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
