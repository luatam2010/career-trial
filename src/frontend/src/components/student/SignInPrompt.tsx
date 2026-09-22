import { Link } from "@tanstack/react-router";
import { ArrowRight, Lock, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";

/**
 * Shown to signed-out visitors on the student area route.
 * One Internet Identity flow covers both new sign-ups and returning students.
 */
export function SignInPrompt() {
  const { t } = useLanguage();
  const { login, isLoading } = useAuth();

  return (
    <div
      className="surface-mint wobble-hover rounded-3xl border border-border/60 p-8 sm:p-12"
      data-ocid="student.sign_in_panel"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span
          className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-card text-primary shadow-sm"
          aria-hidden="true"
        >
          <Lock className="size-6" />
        </span>

        <h2 className="text-2xl font-semibold sm:text-3xl">
          {t("studentArea.privateTitle")}
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          {t("studentArea.privateBody")}
        </p>

        <Button
          type="button"
          size="lg"
          className="mt-8 rounded-full px-8"
          onClick={login}
          disabled={isLoading}
          data-ocid="student.login_button"
        >
          <LogIn className="size-4" aria-hidden="true" />
          {isLoading ? t("student.signingIn") : t("student.signInCta")}
        </Button>

        <p className="mt-5 max-w-md text-sm text-muted-foreground">
          {t("studentArea.oneFlowNote")}
        </p>

        <Link
          to="/career-trial"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          data-ocid="student.browse_trials_link"
        >
          {t("studentArea.browseTrials")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
