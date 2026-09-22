import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, Route } from "lucide-react";

import { PageShell, Section } from "@/components/layout/PageShell";
import { Reveal } from "@/components/layout/Reveal";
import { EnrollmentCard } from "@/components/student/EnrollmentCard";
import { SignInPrompt } from "@/components/student/SignInPrompt";
import { StudentEvidenceCard } from "@/components/student/StudentEvidenceCard";
import { StudentHeader } from "@/components/student/StudentHeader";
import { StudentNameForm } from "@/components/student/StudentNameForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  useGetMyProfile,
  useGetMyTestResult,
  useListMyEnrollments,
  useListMyEvidence,
} from "@/lib/backend-client";
import { useLanguage } from "@/lib/i18n";
import type { EnrollmentView } from "@/types";

const SKELETON_IDS = Array.from(
  { length: 3 },
  (_, i) => `student-skeleton-${i}`,
);

/**
 * One enrolled trial wired to its own auto-generated result. A dedicated
 * component keeps `useGetMyTestResult` at hook top level for every enrolment.
 */
function EnrollmentRow({
  enrollment,
  index,
}: {
  enrollment: EnrollmentView;
  index: number;
}) {
  const result = useGetMyTestResult(enrollment.trialId);
  return (
    <EnrollmentCard
      enrollment={enrollment}
      index={index}
      result={result.data ?? null}
      isLoading={result.isLoading}
    />
  );
}

/** Private student area: enrolled trials with results, plus own evidence cards. */
export default function StudentPage() {
  const { t } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();

  const enrollments = useListMyEnrollments(isAuthenticated);
  const evidence = useListMyEvidence(isAuthenticated);
  const profile = useGetMyProfile(isAuthenticated);

  if (isLoading) {
    return (
      <PageShell eyebrow={t("student.eyebrow")} title={t("student.title")}>
        <Section data-ocid="student.loading_state">
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-3xl" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {SKELETON_IDS.map((id) => (
                <Skeleton key={id} className="h-56 w-full rounded-3xl" />
              ))}
            </div>
          </div>
        </Section>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageShell
        eyebrow={t("student.eyebrow")}
        title={t("student.signInTitle")}
        description={t("student.signInBody")}
      >
        <Section>
          <Reveal>
            <SignInPrompt />
          </Reveal>
        </Section>
      </PageShell>
    );
  }

  const enrollmentList = enrollments.data ?? [];
  const evidenceList = evidence.data ?? [];
  const displayName = profile.data?.displayName?.trim() ?? "";
  const hasName = displayName.length > 0;

  return (
    <PageShell
      eyebrow={t("student.eyebrow")}
      title={t("student.title")}
      description={t("student.description")}
    >
      <Section className="pt-0">
        <Reveal>
          <StudentHeader
            enrollmentCount={enrollmentList.length}
            evidenceCount={evidenceList.length}
            displayName={hasName ? displayName : null}
          />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <StudentNameForm />
        </Reveal>
      </Section>

      <Section id="my-trials" className="pt-0">
        <Reveal>
          <div className="mb-8 flex items-center gap-3">
            <span
              className="inline-flex size-10 items-center justify-center rounded-xl bg-secondary text-primary"
              aria-hidden="true"
            >
              <Route className="size-5" />
            </span>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              {t("student.enrollmentsTitle")}
            </h2>
          </div>
        </Reveal>

        {enrollments.isLoading ? (
          <div
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
            data-ocid="student.enrollments_loading"
          >
            {SKELETON_IDS.map((id) => (
              <Skeleton key={id} className="h-56 w-full rounded-3xl" />
            ))}
          </div>
        ) : enrollments.isError ? (
          <div
            className="rounded-3xl border border-border/60 bg-card p-8 text-center"
            data-ocid="student.enrollments_error_state"
          >
            <p className="text-muted-foreground">{t("student.error")}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-5 rounded-full"
              onClick={() => void enrollments.refetch()}
              data-ocid="student.enrollments_retry_button"
            >
              {t("student.retry")}
            </Button>
          </div>
        ) : enrollmentList.length === 0 ? (
          <div
            className="surface-mint rounded-3xl border border-border/60 p-8 text-center sm:p-12"
            data-ocid="student.enrollments_empty_state"
          >
            <h3 className="text-xl font-semibold">
              {t("student.enrollmentsEmpty")}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              {t("student.enrollmentsEmptyHint")}
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/career-trial" data-ocid="student.browse_trials_button">
                {t("student.browseTrials")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {enrollmentList.map((enrollment, index) => (
              <Reveal as="li" key={enrollment.id.toString()} delay={index * 60}>
                <EnrollmentRow enrollment={enrollment} index={index + 1} />
              </Reveal>
            ))}
          </ul>
        )}
      </Section>

      <Section id="my-evidence" className="pt-0">
        <Reveal>
          <div className="mb-8 flex items-center gap-3">
            <span
              className="inline-flex size-10 items-center justify-center rounded-xl bg-secondary text-primary"
              aria-hidden="true"
            >
              <Award className="size-5" />
            </span>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              {t("student.evidenceTitle")}
            </h2>
          </div>
        </Reveal>

        {evidence.isLoading ? (
          <div
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
            data-ocid="student.evidence_loading"
          >
            {SKELETON_IDS.map((id) => (
              <Skeleton key={id} className="h-56 w-full rounded-3xl" />
            ))}
          </div>
        ) : evidence.isError ? (
          <div
            className="rounded-3xl border border-border/60 bg-card p-8 text-center"
            data-ocid="student.evidence_error_state"
          >
            <p className="text-muted-foreground">{t("student.error")}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-5 rounded-full"
              onClick={() => void evidence.refetch()}
              data-ocid="student.evidence_retry_button"
            >
              {t("student.retry")}
            </Button>
          </div>
        ) : evidenceList.length === 0 ? (
          <div
            className="rounded-3xl border border-dashed border-border bg-card p-8 text-center sm:p-12"
            data-ocid="student.evidence_empty_state"
          >
            <h3 className="text-xl font-semibold">
              {t("student.evidenceEmpty")}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              {t("student.evidenceEmptyHint")}
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-full">
              <Link to="/career-trial" data-ocid="student.evidence_empty_cta">
                {t("studentArea.evidenceEmptyCta")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {evidenceList.map((card, index) => (
              <Reveal as="li" key={card.id.toString()} delay={index * 60}>
                <StudentEvidenceCard
                  card={card}
                  index={index + 1}
                  studentName={
                    hasName ? displayName : t("studentArea.unnamedStudent")
                  }
                />
              </Reveal>
            ))}
          </ul>
        )}
      </Section>
    </PageShell>
  );
}
