/**
 * Thin typed wrapper around the generated actor in src/frontend/src/backend.ts.
 * Exposes the public backend surface with react-query friendly helpers.
 * Never edit backend.ts / backend.d.ts — read them for exact signatures.
 */
import { createActor } from "@/backend";
import type {
  CareerTrial,
  EnrollmentError,
  EnrollmentId,
  EnrollmentView,
  EvidenceCard,
  MyEvidenceCard,
  ProfileError,
  StudentProfile,
  TestAnswer,
  TestError,
  TestResult,
  TrialId,
  TrialTestView,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type BackendActor = ReturnType<typeof createActor>;

/** The five failure variants of EnrollmentError. Anything else is a success. */
const ENROLLMENT_ERROR_KINDS = [
  "unknownTrial",
  "alreadyEnrolled",
  "notEnrolled",
  "notSignedIn",
  "invalidProgress",
] as const;

/**
 * `enroll` and `updateProgress` return EnrollmentError, whose variant set now
 * carries an explicit `ok` success tag (carrying the EnrollmentId). Treat only
 * the five known failure kinds as failures; every other variant — including
 * `ok` — is a success. The generated bindings may lag the backend repair, so
 * the check is deliberately structural rather than exhaustive.
 */
export function isEnrollmentFailure(
  result: EnrollmentError,
): result is EnrollmentError {
  return (ENROLLMENT_ERROR_KINDS as readonly string[]).includes(
    result.__kind__,
  );
}

/** True when the result is one of the five known failure variants. */
export function isEnrollmentErrorKind(kind: string): boolean {
  return (ENROLLMENT_ERROR_KINDS as readonly string[]).includes(kind);
}

export const queryKeys = {
  trials: ["trials"] as const,
  trial: (id: TrialId) => ["trial", id.toString()] as const,
  evidence: ["evidence"] as const,
  myEnrollments: ["myEnrollments"] as const,
  myEvidence: ["myEvidence"] as const,
  apiDoc: ["apiDoc"] as const,
  trialTest: (id: TrialId) => ["trialTest", id.toString()] as const,
  myProfile: ["myProfile"] as const,
  myTestResult: (id: TrialId) => ["myTestResult", id.toString()] as const,
};

/** Shared actor accessor so every hook uses the same configured instance. */
export function useBackendActor() {
  return useActor(createActor);
}

export function useListTrials() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CareerTrial[]>({
    queryKey: queryKeys.trials,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTrials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTrial(id: TrialId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CareerTrial | null>({
    queryKey: queryKeys.trial(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getTrial(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useListEvidence() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<EvidenceCard[]>({
    queryKey: queryKeys.evidence,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEvidence();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListMyEnrollments(enabled = true) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<EnrollmentView[]>({
    queryKey: queryKeys.myEnrollments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyEnrollments();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useListMyEvidence(enabled = true) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MyEvidenceCard[]>({
    queryKey: queryKeys.myEvidence,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyEvidence();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useGetApiDoc() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<string>({
    queryKey: queryKeys.apiDoc,
    queryFn: async () => {
      if (!actor) return "";
      return actor.getApiDoc();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEnroll() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<EnrollmentError, Error, TrialId>({
    mutationFn: async (trialId: TrialId) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.enroll(trialId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.myEnrollments });
    },
  });
}

/**
 * The caller's own auto-scored result for one trial, or null when the caller
 * has not tested that trial yet. This is the real per-enrolment result the
 * student area renders — never a self-rated value.
 */
export function useGetMyTestResult(trialId: TrialId | null, enabled = true) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TestResult | null>({
    queryKey: queryKeys.myTestResult(trialId ?? 0n),
    queryFn: async () => {
      if (!actor || trialId === null) return null;
      return actor.getMyTestResult(trialId);
    },
    enabled: !!actor && !isFetching && enabled && trialId !== null,
  });
}

export function useGetTrialTest(trialId: TrialId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TrialTestView | null>({
    queryKey: queryKeys.trialTest(trialId ?? 0n),
    queryFn: async () => {
      if (!actor || trialId === null) return null;
      return actor.getTrialTest(trialId);
    },
    enabled: !!actor && !isFetching && trialId !== null,
  });
}

/**
 * Submit a test attempt. The backend scores it and publishes an evidence card,
 * so a successful submit invalidates the evidence, my-evidence and
 * my-enrollments queries to surface the new card.
 */
export function useSubmitTest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    TestError,
    Error,
    { trialId: TrialId; answers: TestAnswer[] }
  >({
    mutationFn: async ({ trialId, answers }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.submitTest(trialId, answers);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.evidence });
      void queryClient.invalidateQueries({ queryKey: queryKeys.myEvidence });
      void queryClient.invalidateQueries({ queryKey: queryKeys.myEnrollments });
      void queryClient.invalidateQueries({ queryKey: ["myTestResult"] });
    },
  });
}

export function useGetMyProfile(enabled = true) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StudentProfile | null>({
    queryKey: queryKeys.myProfile,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useSetMyDisplayName() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<ProfileError, Error, string>({
    mutationFn: async (displayName: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setMyDisplayName(displayName);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.myProfile });
    },
  });
}

export function useUpdateProgress() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    EnrollmentError,
    Error,
    { enrollmentId: EnrollmentId; progressPercent: bigint }
  >({
    mutationFn: async ({ enrollmentId, progressPercent }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateProgress(enrollmentId, progressPercent);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.myEnrollments });
    },
  });
}
