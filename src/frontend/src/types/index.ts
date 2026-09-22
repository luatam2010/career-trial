/**
 * Shared TypeScript mirrors of the backend types plus view models used by pages.
 * Backend shapes come from src/frontend/src/backend.d.ts (generated — do not edit).
 */

export type TrialId = bigint;
export type EnrollmentId = bigint;
export type EvidenceId = bigint;
export type Timestamp = bigint;

export interface AspectScore {
  aspect: string;
  score: bigint;
}

export interface TaskBrief {
  description: string;
  deliverables: string[];
  checklist: string[];
}

export interface CareerTrial {
  id: TrialId;
  name: string;
  tags: string[];
  daysToComplete: bigint;
  summary: string;
  brief: TaskBrief;
}

export interface EvidenceCard {
  id: EvidenceId;
  testerName: string;
  trialName: string;
  completionPercent: bigint;
  aspectScores: AspectScore[];
  rating: bigint;
}

export interface MyEvidenceCard {
  id: EvidenceId;
  trialId: TrialId;
  trialName: string;
  completionPercent: bigint;
  aspectScores: AspectScore[];
  rating: bigint;
}

export interface EnrollmentView {
  id: EnrollmentId;
  startedAt: Timestamp;
  trialId: TrialId;
  trialName: string;
  updatedAt: Timestamp;
  progressPercent: bigint;
}

export type EnrollmentErrorKind =
  | "unknownTrial"
  | "alreadyEnrolled"
  | "notEnrolled"
  | "notSignedIn"
  | "invalidProgress";

export type EnrollmentError = {
  __kind__: EnrollmentErrorKind;
  unknownTrial?: TrialId;
  alreadyEnrolled?: TrialId;
  notEnrolled?: EnrollmentId;
  notSignedIn?: null;
  invalidProgress?: bigint;
};

/* ------------------------------------------------------- trial knowledge test */

export interface TestOption {
  id: bigint;
  text: string;
}

export interface TestQuestionView {
  id: bigint;
  prompt: string;
  options: TestOption[];
  aspect: string;
}

export interface TrialTestView {
  trialId: TrialId;
  trialName: string;
  questions: TestQuestionView[];
}

export interface TestAnswer {
  questionId: bigint;
  optionId: bigint;
}

export interface TestResult {
  trialId: TrialId;
  trialName: string;
  score: bigint;
  completionPercent: bigint;
  aspectScores: AspectScore[];
  evidenceId: EvidenceId;
}

export type TestErrorKind =
  | "ok"
  | "notSignedIn"
  | "unknownTrial"
  | "notEnrolled"
  | "incomplete"
  | "invalidAnswer";

export type TestError = {
  __kind__: TestErrorKind;
  ok?: TestResult;
  notSignedIn?: null;
  unknownTrial?: TrialId;
  notEnrolled?: TrialId;
  incomplete?: bigint[];
  invalidAnswer?: bigint;
};

export interface StudentProfile {
  displayName: string;
}

export type ProfileErrorKind = "ok" | "notSignedIn" | "invalidName";

export type ProfileError = {
  __kind__: ProfileErrorKind;
};

/** The five pilot pricing plans shown in the pricing pop-up. */
export interface PricingPlan {
  index: string;
  nameKey: string;
  priceKey: string;
  descriptionKey: string;
  featureKeys: string[];
  featured?: boolean;
}

/** A navigation entry that may be a route or an in-page anchor. */
export interface NavItem {
  labelKey: string;
  to?: string;
  hash?: string;
}

/** A single step in the "How It Works" section. */
export interface HowItWorksStep {
  index: string;
  titleKey: string;
  bodyKey: string;
}
