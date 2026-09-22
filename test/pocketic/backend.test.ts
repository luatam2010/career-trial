/**
 * PocketIC backend lane: installs this build's compiled canister into the
 * platform's replica and calls the real public API.
 *
 * The frontend suite mocks the actor, so it passes unchanged against a backend
 * whose methods are unimplemented stubs. This file is the only place the real
 * canister is exercised: the seeded catalogue, the seeded evidence, the
 * per-caller enrolment flow, and the explicit `#ok` success tag.
 *
 * Shapes here are the generated declarations' shapes, not the frontend
 * wrapper's: `Nat` is `bigint`, `?T` is `[] | [T]`, and a variant is
 * `{ variantName: null }`.
 */
import { PocketIc, createIdentity } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

/** A deterministic signed-in caller. */
const student = createIdentity("career-trial-student");
/** A second caller, used to prove per-caller isolation. */
const otherStudent = createIdentity("career-trial-other-student");

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  // `?.` because `beforeAll` may not have got that far; a failed
  // `PocketIc.create` otherwise buries the real error under a TypeError.
  await pic?.tearDown();
});

describe("seeded catalogue", () => {
  it("answers the public reads without trapping", async () => {
    await expect(actor.listTrials()).resolves.toBeInstanceOf(Array);
    await expect(actor.listEvidence()).resolves.toBeInstanceOf(Array);
    await expect(actor.getApiDoc()).resolves.toEqual(expect.any(String));
  });

  it("seeds five startable trials plus the non-startable placeholder", async () => {
    const trials = await actor.listTrials();
    expect(trials).toHaveLength(6);

    const startable = trials.filter(
      (trial) =>
        trial.brief.description.trim().length > 0 &&
        trial.brief.checklist.length > 0 &&
        trial.brief.deliverables.length > 0 &&
        trial.daysToComplete > 0n,
    );
    expect(startable).toHaveLength(5);

    // Every startable trial carries a summary, at least three tags and a day count.
    for (const trial of startable) {
      expect(trial.summary.trim().length).toBeGreaterThan(0);
      expect(trial.tags.length).toBeGreaterThanOrEqual(3);
      expect(trial.daysToComplete).toBeGreaterThan(0n);
    }

    // The placeholder has an empty brief and no days, so the UI never offers
    // Start Trial for it.
    const placeholder = trials.find((trial) => trial.id === 6n);
    expect(placeholder).toBeDefined();
    expect(placeholder?.brief.description).toBe("");
    expect(placeholder?.brief.checklist).toEqual([]);
    expect(placeholder?.brief.deliverables).toEqual([]);
    expect(placeholder?.daysToComplete).toBe(0n);
  });

  it("returns one trial by id and an empty option for an unknown id", async () => {
    const marketing = await actor.getTrial(1n);
    expect(marketing).toHaveLength(1);
    expect(marketing[0]).toMatchObject({ id: 1n, name: "Marketing" });

    await expect(actor.getTrial(999n)).resolves.toEqual([]);
  });

  it("seeds evidence cards with tester, career, completion, rating and aspect scores", async () => {
    const evidence = await actor.listEvidence();
    expect(evidence).toHaveLength(6);

    for (const card of evidence) {
      expect(card.testerName.trim().length).toBeGreaterThan(0);
      expect(card.trialName.trim().length).toBeGreaterThan(0);
      expect(card.completionPercent).toBeGreaterThanOrEqual(0n);
      expect(card.completionPercent).toBeLessThanOrEqual(100n);
      expect(card.aspectScores.length).toBeGreaterThanOrEqual(3);
      for (const aspect of card.aspectScores) {
        expect(aspect.aspect.trim().length).toBeGreaterThan(0);
        expect(aspect.score).toBeGreaterThanOrEqual(0n);
        expect(aspect.score).toBeLessThanOrEqual(100n);
      }
    }
  });
});

describe("enrolment flow", () => {
  it("starts a fresh caller with no enrolments and no evidence", async () => {
    actor.setIdentity(student);
    await expect(actor.listMyEnrollments()).resolves.toEqual([]);
    await expect(actor.listMyEvidence()).resolves.toEqual([]);
  });

  it("enrols the caller and returns the explicit #ok success tag", async () => {
    actor.setIdentity(student);
    const result = await actor.enroll(1n);
    expect(result).toEqual({ ok: expect.any(BigInt) });

    const enrollments = await actor.listMyEnrollments();
    expect(enrollments).toHaveLength(1);
    expect(enrollments[0]).toMatchObject({
      trialId: 1n,
      trialName: "Marketing",
      progressPercent: 0n,
    });
  });

  it("rejects a second enrolment in the same trial", async () => {
    actor.setIdentity(student);
    await expect(actor.enroll(1n)).resolves.toEqual({ alreadyEnrolled: 1n });
  });

  it("rejects an unknown trial", async () => {
    actor.setIdentity(student);
    await expect(actor.enroll(999n)).resolves.toEqual({ unknownTrial: 999n });
  });

  it("updates progress and returns the explicit #ok success tag", async () => {
    actor.setIdentity(student);
    const [enrollment] = await actor.listMyEnrollments();
    expect(enrollment).toBeDefined();

    await expect(
      actor.updateProgress(enrollment.id, 40n),
    ).resolves.toEqual({ ok: enrollment.id });

    const [updated] = await actor.listMyEnrollments();
    expect(updated.progressPercent).toBe(40n);
  });

  it("rejects progress above 100 and an unknown enrolment", async () => {
    actor.setIdentity(student);
    const [enrollment] = await actor.listMyEnrollments();

    await expect(
      actor.updateProgress(enrollment.id, 101n),
    ).resolves.toEqual({ invalidProgress: 101n });
    await expect(actor.updateProgress(999n, 10n)).resolves.toEqual({
      notEnrolled: 999n,
    });
  });
});

describe("trial knowledge test", () => {
  /** A dedicated caller so the test flow cannot disturb the enrolment tests. */
  const tester = createIdentity("career-trial-test-taker");

  /** The seeded Marketing test's correct option per question (from the migration). */
  const CORRECT_OPTIONS: Record<string, bigint> = {
    "1": 2n,
    "2": 1n,
    "3": 2n,
    "4": 1n,
    "5": 1n,
  };

  it("delivers a five-question test without leaking the correct answers", async () => {
    const test = await actor.getTrialTest(1n);
    expect(test).toHaveLength(1);
    const view = test[0];
    expect(view.trialName).toBe("Marketing");
    expect(view.questions).toHaveLength(5);
    for (const question of view.questions) {
      expect(question.prompt.trim().length).toBeGreaterThan(0);
      expect(question.aspect.trim().length).toBeGreaterThan(0);
      expect(question.options.length).toBeGreaterThanOrEqual(2);
      // `correctOptionId` is not part of the delivered view.
      expect(question).not.toHaveProperty("correctOptionId");
    }
  });

  it("returns an empty option for a trial with no test", async () => {
    // Trial 6 is the non-startable placeholder: no days, no test.
    await expect(actor.getTrialTest(6n)).resolves.toEqual([]);
    await expect(actor.getTrialTest(999n)).resolves.toEqual([]);
  });

  it("rejects a submission from a caller who is not enrolled", async () => {
    actor.setIdentity(tester);
    await expect(actor.submitTest(1n, [])).resolves.toEqual({
      notEnrolled: 1n,
    });
  });

  it("rejects an incomplete attempt and names the missing questions", async () => {
    actor.setIdentity(tester);
    await actor.enroll(1n);
    // Only question 1 answered.
    await expect(
      actor.submitTest(1n, [{ questionId: 1n, optionId: 2n }]),
    ).resolves.toEqual({ incomplete: [2n, 3n, 4n, 5n] });
  });

  it("rejects an answer that references an unknown option", async () => {
    actor.setIdentity(tester);
    await expect(
      actor.submitTest(1n, [
        { questionId: 1n, optionId: 99n },
        { questionId: 2n, optionId: 1n },
        { questionId: 3n, optionId: 2n },
        { questionId: 4n, optionId: 1n },
        { questionId: 5n, optionId: 1n },
      ]),
    ).resolves.toEqual({ invalidAnswer: 1n });
  });

  it("scores a perfect attempt, publishes a card and reflects it on the enrolment", async () => {
    actor.setIdentity(tester);
    const answers = Object.entries(CORRECT_OPTIONS).map(
      ([questionId, optionId]) => ({
        questionId: BigInt(questionId),
        optionId,
      }),
    );

    const result = await actor.submitTest(1n, answers);
    expect(result).toHaveProperty("ok");
    const scored = (result as { ok: { score: bigint; completionPercent: bigint; aspectScores: unknown[]; evidenceId: bigint } }).ok;
    expect(scored.score).toBe(100n);
    expect(scored.completionPercent).toBe(100n);
    expect(scored.aspectScores.length).toBeGreaterThan(0);

    // The published card is visible on the public wall under the tester's name.
    const evidence = await actor.listEvidence();
    const published = evidence.find((card) => card.id === scored.evidenceId);
    expect(published).toBeDefined();
    expect(published?.trialName).toBe("Marketing");
    expect(published?.completionPercent).toBe(100n);
    expect(published?.rating).toBe(100n);

    // The enrolment progress is set from the test outcome, not typed in.
    const [enrollment] = await actor.listMyEnrollments();
    expect(enrollment.progressPercent).toBe(100n);

    // The caller's own result reads back with the same score.
    const mine = await actor.getMyTestResult(1n);
    expect(mine).toHaveLength(1);
    expect(mine[0].score).toBe(100n);
  });

  it("replaces the previous result on a retake instead of adding a card", async () => {
    actor.setIdentity(tester);
    const before = await actor.listEvidence();
    const beforeCount = before.length;

    // A deliberately wrong attempt: every question answered with option 3.
    const wrong = [1n, 2n, 3n, 4n, 5n].map((questionId) => ({
      questionId,
      optionId: 3n,
    }));
    const result = await actor.submitTest(1n, wrong);
    expect(result).toHaveProperty("ok");
    const scored = (result as { ok: { score: bigint; evidenceId: bigint } }).ok;
    expect(scored.score).toBeLessThan(100n);

    // The retake replaced the card in place: same id, no new card.
    const after = await actor.listEvidence();
    expect(after).toHaveLength(beforeCount);
    const replaced = after.find((card) => card.id === scored.evidenceId);
    expect(replaced?.rating).toBe(scored.score);

    const mine = await actor.getMyTestResult(1n);
    expect(mine[0].score).toBe(scored.score);
  });

  it("stores the display name used as the published tester name", async () => {
    actor.setIdentity(tester);
    await expect(actor.setMyDisplayName("  Linh Nguyen  ")).resolves.toEqual({
      ok: null,
    });
    const profile = await actor.getMyProfile();
    expect(profile).toHaveLength(1);
    expect(profile[0].displayName).toBe("Linh Nguyen");

    // A blank name is rejected and the stored name is unchanged.
    await expect(actor.setMyDisplayName("   ")).resolves.toEqual({
      invalidName: null,
    });
    const still = await actor.getMyProfile();
    expect(still[0].displayName).toBe("Linh Nguyen");
  });

  it("rejects an anonymous caller for the test and profile writes", async () => {
    const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
    await expect(guest.submitTest(1n, [])).resolves.toEqual({
      notSignedIn: null,
    });
    await expect(guest.setMyDisplayName("Guest")).resolves.toEqual({
      notSignedIn: null,
    });
    await expect(guest.getMyTestResult(1n)).resolves.toEqual([]);
  });
});

describe("caller isolation", () => {
  it("rejects an anonymous caller", async () => {
    // A freshly created actor calls as the anonymous principal until an
    // identity is set.
    const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
    await expect(guest.enroll(1n)).resolves.toEqual({ notSignedIn: null });
    await expect(guest.updateProgress(1n, 10n)).resolves.toEqual({
      notSignedIn: null,
    });
  });

  it("does not show one caller's enrolments to another", async () => {
    actor.setIdentity(otherStudent);
    await expect(actor.listMyEnrollments()).resolves.toEqual([]);
  });
});
