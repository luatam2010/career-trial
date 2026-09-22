import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AspectScore {
    aspect: string;
    score: bigint;
}
export interface CareerTrial {
    id: TrialId;
    name: string;
    tags: Array<string>;
    daysToComplete: bigint;
    summary: string;
    brief: TaskBrief;
}
export interface Cell {
    value: Value;
    name: string;
}
export type EnrollmentError = {
    __kind__: "ok";
    ok: EnrollmentId;
} | {
    __kind__: "unknownTrial";
    unknownTrial: TrialId;
} | {
    __kind__: "alreadyEnrolled";
    alreadyEnrolled: TrialId;
} | {
    __kind__: "notEnrolled";
    notEnrolled: EnrollmentId;
} | {
    __kind__: "notSignedIn";
    notSignedIn: null;
} | {
    __kind__: "invalidProgress";
    invalidProgress: bigint;
};
export type EnrollmentId = bigint;
export interface EnrollmentView {
    id: EnrollmentId;
    startedAt: Timestamp;
    trialId: TrialId;
    trialName: string;
    updatedAt: Timestamp;
    progressPercent: bigint;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface EvidenceCard {
    id: EvidenceId;
    testerName: string;
    trialName: string;
    completionPercent: bigint;
    aspectScores: Array<AspectScore>;
    rating: bigint;
}
export type EvidenceId = bigint;
export interface MyEvidenceCard {
    id: EvidenceId;
    trialId: TrialId;
    trialName: string;
    completionPercent: bigint;
    aspectScores: Array<AspectScore>;
    rating: bigint;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface StudentProfile {
    displayName: string;
}
export interface TaskBrief {
    description: string;
    deliverables: Array<string>;
    checklist: Array<string>;
}
export interface TestAnswer {
    optionId: bigint;
    questionId: bigint;
}
export type TestError = {
    __kind__: "ok";
    ok: TestResult;
} | {
    __kind__: "incomplete";
    incomplete: Array<bigint>;
} | {
    __kind__: "unknownTrial";
    unknownTrial: TrialId;
} | {
    __kind__: "notEnrolled";
    notEnrolled: TrialId;
} | {
    __kind__: "invalidAnswer";
    invalidAnswer: bigint;
} | {
    __kind__: "notSignedIn";
    notSignedIn: null;
};
export interface TestOption {
    id: bigint;
    text: string;
}
export interface TestQuestionView {
    id: bigint;
    aspect: string;
    prompt: string;
    options: Array<TestOption>;
}
export interface TestResult {
    trialId: TrialId;
    trialName: string;
    score: bigint;
    completionPercent: bigint;
    aspectScores: Array<AspectScore>;
    evidenceId: EvidenceId;
}
export type Timestamp = bigint;
export type TrialId = bigint;
export interface TrialTestView {
    trialId: TrialId;
    trialName: string;
    questions: Array<TestQuestionView>;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum ProfileError {
    ok = "ok",
    invalidName = "invalidName",
    notSignedIn = "notSignedIn"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Enrol the caller in a career trial.
     */
    enroll(trialId: TrialId): Promise<EnrollmentError>;
    execute(qJson: string): Promise<Result>;
    /**
     * / Static Markdown documentation of this backend's public API.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / The caller's stored display name, or null when unset.
     */
    getMyProfile(): Promise<StudentProfile | null>;
    /**
     * / The caller's own stored test result for a trial, or null when untested.
     */
    getMyTestResult(trialId: TrialId): Promise<TestResult | null>;
    /**
     * / One career trial by id.
     */
    getTrial(id: TrialId): Promise<CareerTrial | null>;
    /**
     * / A trial's knowledge test, without the correct answers.
     */
    getTrialTest(trialId: TrialId): Promise<TrialTestView | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Public evidence cards.
     */
    listEvidence(): Promise<Array<EvidenceCard>>;
    /**
     * / The caller's own enrolments.
     */
    listMyEnrollments(): Promise<Array<EnrollmentView>>;
    /**
     * / The caller's own evidence cards.
     */
    listMyEvidence(): Promise<Array<MyEvidenceCard>>;
    /**
     * / Public career trial catalogue.
     */
    listTrials(): Promise<Array<CareerTrial>>;
    schema(): Promise<string>;
    /**
     * / Store the caller's display name, used as `testerName` on published cards.
     */
    setMyDisplayName(displayName: string): Promise<ProfileError>;
    /**
     * / Submit a test attempt; the backend scores it and publishes an evidence card.
     */
    submitTest(trialId: TrialId, answers: Array<TestAnswer>): Promise<TestError>;
    /**
     * / Update the caller's own enrolment progress.
     */
    updateProgress(enrollmentId: EnrollmentId, progressPercent: bigint): Promise<EnrollmentError>;
}
