/**
 * Test-only harness: a typed local actor mock, a mocked Internet Identity
 * provider, and a render helper that mounts the real app shell.
 *
 * Nothing here touches the network. The actor mock implements the generated
 * `backendInterface` so the frontend's consumer contract is exercised against
 * the same shapes the real bindings produce.
 */
import type { backendInterface } from "@/backend";
import type {
  CareerTrial,
  EnrollmentError,
  EnrollmentView,
  EvidenceCard,
  MyEvidenceCard,
  ProfileError,
  StudentProfile,
  TestAnswer,
  TestError,
  TestQuestionView,
  TestResult,
  TrialTestView,
  UserRole,
} from "@/backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { vi } from "vitest";

import { PricingModalProvider } from "@/components/layout/PricingModal";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LanguageProvider } from "@/lib/i18n";
import { coreInfrastructureMockState } from "@/test/mock-state";

/* ------------------------------------------------------------------ fixtures */

export const TRIAL_MARKETING: CareerTrial = {
  id: 1n,
  name: "Marketing",
  tags: ["Communication", "Creativity", "Strategy"],
  daysToComplete: 5n,
  summary: "Plan and pitch a small campaign for a real product.",
  brief: {
    description: "Build a one-page campaign plan for a local coffee brand.",
    checklist: ["Research the audience", "Draft the message", "Pick channels"],
    deliverables: ["Campaign one-pager", "Channel plan"],
  },
};

export const TRIAL_DESIGN: CareerTrial = {
  id: 2n,
  name: "Graphic Design",
  tags: ["Creativity", "Tools", "Visual"],
  daysToComplete: 7n,
  summary: "Design a poster set for a school event.",
  brief: {
    description: "Produce a three-poster set with a consistent visual system.",
    checklist: ["Collect references", "Sketch layouts", "Export final files"],
    deliverables: ["Three posters", "Style notes"],
  },
};

export const TRIAL_BUSINESS: CareerTrial = {
  id: 3n,
  name: "Business Analysis",
  tags: ["Strategy", "Data", "Communication"],
  daysToComplete: 6n,
  summary: "Analyse a small business and recommend one improvement.",
  brief: {
    description: "Interview a small business and write a short analysis.",
    checklist: ["Interview the owner", "Map the process", "Write findings"],
    deliverables: ["Analysis memo"],
  },
};

export const TRIAL_EVENT: CareerTrial = {
  id: 4n,
  name: "Event Planning",
  tags: ["Organisation", "Communication", "Creativity"],
  daysToComplete: 4n,
  summary: "Plan the run-sheet for a school showcase.",
  brief: {
    description: "Produce a run-sheet and budget for a one-evening showcase.",
    checklist: ["List the acts", "Build the timeline", "Estimate the budget"],
    deliverables: ["Run-sheet", "Budget sheet"],
  },
};

export const TRIAL_CONTENT: CareerTrial = {
  id: 5n,
  name: "Content Creation",
  tags: ["Writing", "Creativity", "Strategy"],
  daysToComplete: 5n,
  summary: "Write and schedule a week of social posts.",
  brief: {
    description: "Create a one-week content calendar with sample copy.",
    checklist: ["Pick the theme", "Write five posts", "Schedule them"],
    deliverables: ["Content calendar", "Five post drafts"],
  },
};

/** The seeded placeholder: no brief, no days — never startable. */
export const TRIAL_COMING_NEXT: CareerTrial = {
  id: 6n,
  name: "Data Science",
  tags: [],
  daysToComplete: 0n,
  summary: "We are still writing this trial.",
  brief: { description: "", checklist: [], deliverables: [] },
};

export const SEEDED_TRIALS: CareerTrial[] = [
  TRIAL_MARKETING,
  TRIAL_DESIGN,
  TRIAL_BUSINESS,
  TRIAL_EVENT,
  TRIAL_CONTENT,
  TRIAL_COMING_NEXT,
];

export const EVIDENCE_CARD: EvidenceCard = {
  id: 1n,
  testerName: "Linh Nguyen",
  trialName: "Marketing",
  completionPercent: 92n,
  // `rating` is a 0-100 overall score, matching the backend's seeded cards.
  rating: 88n,
  aspectScores: [
    { aspect: "Creativity", score: 88n },
    { aspect: "Communication", score: 74n },
    { aspect: "Strategy", score: 81n },
  ],
};

export const SEEDED_EVIDENCE: EvidenceCard[] = [
  EVIDENCE_CARD,
  {
    id: 2n,
    testerName: "Minh Tran",
    trialName: "Graphic Design",
    completionPercent: 78n,
    rating: 81n,
    aspectScores: [
      { aspect: "Creativity", score: 90n },
      { aspect: "Tools", score: 66n },
    ],
  },
];

export const MY_ENROLLMENT: EnrollmentView = {
  id: 10n,
  trialId: 1n,
  trialName: "Marketing",
  progressPercent: 40n,
  startedAt: 1_700_000_000_000_000_000n,
  updatedAt: 1_700_000_100_000_000_000n,
};

export const MY_EVIDENCE: MyEvidenceCard = {
  id: 20n,
  trialId: 1n,
  trialName: "Marketing",
  completionPercent: 100n,
  // The auto-scored overall percentage, not a 1-5 self-rating.
  rating: 100n,
  aspectScores: [{ aspect: "Creativity", score: 90n }],
};

/* ------------------------------------------------- trial knowledge test fixtures */

/** A five-question test for the Marketing trial, mirroring the seeded shape. */
export const TRIAL_TEST: TrialTestView = {
  trialId: 1n,
  trialName: "Marketing",
  questions: [
    {
      id: 1n,
      prompt: "What is the first thing to decide when planning a campaign?",
      aspect: "Creativity",
      options: [
        { id: 1n, text: "The exact wording of every post" },
        { id: 2n, text: "Who the campaign is for" },
        { id: 3n, text: "The colour of the logo" },
      ],
    },
    {
      id: 2n,
      prompt: "Which channel choice is best for reaching students?",
      aspect: "Communication",
      options: [
        { id: 1n, text: "A channel your audience actually uses" },
        { id: 2n, text: "The channel that costs the most" },
        { id: 3n, text: "Every channel at once" },
      ],
    },
    {
      id: 3n,
      prompt: "What makes a campaign message effective?",
      aspect: "Communication",
      options: [
        { id: 1n, text: "It lists every feature of the club" },
        { id: 2n, text: "It says one clear thing" },
        { id: 3n, text: "It uses as many words as possible" },
      ],
    },
    {
      id: 4n,
      prompt: "Why track a single number for a campaign?",
      aspect: "Analytical",
      options: [
        { id: 1n, text: "To judge whether the campaign worked" },
        { id: 2n, text: "To make the plan look longer" },
        { id: 3n, text: "To replace the campaign message" },
      ],
    },
    {
      id: 5n,
      prompt: "A weekly posting schedule helps mainly because it…",
      aspect: "Reliability",
      options: [
        { id: 1n, text: "keeps the campaign consistent" },
        { id: 2n, text: "guarantees more followers" },
        { id: 3n, text: "removes the need for a message" },
      ],
    },
  ],
};

/** The auto-scored outcome of a perfect Marketing attempt. */
export const TEST_RESULT: TestResult = {
  trialId: 1n,
  trialName: "Marketing",
  score: 100n,
  completionPercent: 100n,
  aspectScores: [
    { aspect: "Creativity", score: 100n },
    { aspect: "Communication", score: 100n },
    { aspect: "Analytical", score: 100n },
    { aspect: "Reliability", score: 100n },
  ],
  evidenceId: 20n,
};

/** The caller's stored profile, used by the student area and evidence page. */
export const STUDENT_PROFILE: StudentProfile = { displayName: "Linh Nguyen" };

/* --------------------------------------------------------------- actor mock */

export interface MockActorOptions {
  trials?: CareerTrial[];
  evidence?: EvidenceCard[];
  enrollments?: EnrollmentView[];
  myEvidence?: MyEvidenceCard[];
  /** The trial test returned by `getTrialTest`; defaults to `TRIAL_TEST`. */
  trialTest?: TrialTestView | null;
  /** The caller's stored result returned by `getMyTestResult`; defaults to null. */
  myTestResult?: TestResult | null;
  /** The caller's stored profile returned by `getMyProfile`; defaults to null. */
  profile?: StudentProfile | null;
  /** Result returned by `enroll`; defaults to the `ok` success tag. */
  enrollResult?: EnrollmentError;
  /** Result returned by `updateProgress`; defaults to the `ok` success tag. */
  updateProgressResult?: EnrollmentError;
  /** Result returned by `submitTest`; defaults to a perfect `ok` result. */
  submitTestResult?: TestError;
  /** Result returned by `setMyDisplayName`; defaults to the `ok` success tag. */
  setMyDisplayNameResult?: ProfileError;
}

export type MockActor = backendInterface & {
  enroll: ReturnType<typeof vi.fn>;
  updateProgress: ReturnType<typeof vi.fn>;
  listTrials: ReturnType<typeof vi.fn>;
  listEvidence: ReturnType<typeof vi.fn>;
  listMyEnrollments: ReturnType<typeof vi.fn>;
  listMyEvidence: ReturnType<typeof vi.fn>;
  getTrialTest: ReturnType<typeof vi.fn>;
  submitTest: ReturnType<typeof vi.fn>;
  getMyTestResult: ReturnType<typeof vi.fn>;
  getMyProfile: ReturnType<typeof vi.fn>;
  setMyDisplayName: ReturnType<typeof vi.fn>;
};

/**
 * Build a fully typed stand-in for the generated backend actor. Every method
 * resolves locally; no agent, no canister, no network.
 */
export function createMockActor(options: MockActorOptions = {}): MockActor {
  const trials = options.trials ?? SEEDED_TRIALS;
  const evidence = options.evidence ?? SEEDED_EVIDENCE;
  const enrollments = options.enrollments ?? [];
  const myEvidence = options.myEvidence ?? [];
  const trialTest = options.trialTest ?? TRIAL_TEST;
  const myTestResult = options.myTestResult ?? null;
  const profile = options.profile ?? null;

  const actor = {
    _initialize_access_control: vi.fn(async () => undefined),
    _internet_identity_sign_in_finish: vi.fn(async () => ({
      __kind__: "ok" as const,
      ok: null,
    })),
    _internet_identity_sign_in_start: vi.fn(async () => new Uint8Array()),
    assignCallerUserRole: vi.fn(async () => undefined),
    enroll: vi.fn(
      async (): Promise<EnrollmentError> =>
        options.enrollResult ?? { __kind__: "ok", ok: 10n },
    ),
    execute: vi.fn(async () => ({ hasMore: false, rows: [] })),
    getApiDoc: vi.fn(async () => "# API"),
    getCallerUserRole: vi.fn(async (): Promise<UserRole> => "user" as UserRole),
    getMyProfile: vi.fn(async (): Promise<StudentProfile | null> => profile),
    getMyTestResult: vi.fn(
      async (): Promise<TestResult | null> => myTestResult,
    ),
    getTrial: vi.fn(async (id: bigint) => {
      const found = trials.find((trial) => trial.id === id);
      return found ?? null;
    }),
    getTrialTest: vi.fn(
      async (id: bigint): Promise<TrialTestView | null> =>
        trialTest && trialTest.trialId === id ? trialTest : null,
    ),
    isCallerAdmin: vi.fn(async () => false),
    listEvidence: vi.fn(async () => evidence),
    listMyEnrollments: vi.fn(async () => enrollments),
    listMyEvidence: vi.fn(async () => myEvidence),
    listTrials: vi.fn(async () => trials),
    schema: vi.fn(async () => "{}"),
    setMyDisplayName: vi.fn(
      async (): Promise<ProfileError> =>
        options.setMyDisplayNameResult ?? ("ok" as ProfileError),
    ),
    submitTest: vi.fn(
      async (_trialId: bigint, _answers: TestAnswer[]): Promise<TestError> =>
        options.submitTestResult ?? { __kind__: "ok", ok: TEST_RESULT },
    ),
    updateProgress: vi.fn(
      async (): Promise<EnrollmentError> =>
        options.updateProgressResult ?? { __kind__: "ok", ok: 10n },
    ),
  };

  return actor as unknown as MockActor;
}

/* --------------------------------------------------- Internet Identity mock */

export interface MockAuthOptions {
  isAuthenticated?: boolean;
  isInitializing?: boolean;
  isLoggingIn?: boolean;
  principal?: string;
}

export interface MockAuthControls {
  login: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
}

/**
 * Point the mocked `@caffeineai/core-infrastructure` (registered in
 * `setup.ts`) at a local actor and auth state. Returns the shared spies so
 * tests can assert on sign-in / sign-out without a real Internet Identity
 * popup.
 */
export function mockCoreInfrastructure(
  actor: MockActor,
  options: MockAuthOptions = {},
): MockAuthControls {
  const login = vi.fn();
  const clear = vi.fn();
  coreInfrastructureMockState.actor = actor;
  coreInfrastructureMockState.options = options;
  coreInfrastructureMockState.login = login;
  coreInfrastructureMockState.clear = clear;
  return { login, clear };
}

/* ------------------------------------------------------------- render helper */

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

/** Render a component inside a fresh react-query provider. */
export function renderWithProviders(ui: ReactElement): RenderResult {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

/**
 * Render a page inside a real TanStack Router (memory history) so `Link`,
 * `useNavigate` and `useSearch` resolve exactly as they do in the app.
 * `initialPath` seeds the URL, which lets tests assert on search-param state.
 *
 * The language and pricing providers wrap the router because every page reads
 * `useLanguage` and the pricing pop-up is reachable from the shell. The router
 * is loaded before rendering so the first paint already contains the matched
 * route; callers can query synchronously afterwards.
 */
export async function renderWithRouter(
  component: () => ReactElement,
  initialPath = "/",
): Promise<RenderResult> {
  const queryClient = createTestQueryClient();
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  // Register the page at the path under test so the memory router matches it
  // instead of falling through to its "Not Found" route.
  const path = initialPath.split("?")[0] || "/";
  const pageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path,
    component,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([pageRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  await router.load();

  return render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <PricingModalProvider>
          <RouterProvider router={router} />
        </PricingModalProvider>
      </LanguageProvider>
    </QueryClientProvider>,
  );
}

/**
 * Render a page inside the full app shell (header + footer + language and
 * pricing providers), matching the real `App` composition. Use this when a
 * journey crosses the navigation, footer or global pop-ups.
 */
export async function renderWithShell(
  component: () => ReactElement,
  initialPath = "/",
): Promise<RenderResult> {
  const queryClient = createTestQueryClient();
  const rootRoute = createRootRoute({
    component: () => (
      <div className="relative flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="relative z-10 flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    ),
  });
  const pageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([pageRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  await router.load();

  return render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <PricingModalProvider>
          <RouterProvider router={router} />
        </PricingModalProvider>
      </LanguageProvider>
    </QueryClientProvider>,
  );
}
