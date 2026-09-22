/**
 * Trial knowledge test journey: a signed-in student opens a trial, enrols,
 * starts the test, answers every question, submits, and sees the auto-scored
 * result with its per-aspect breakdown and a link to the Evidence page.
 *
 * The actor is the shared typed mock, so no canister is called; the backend
 * lane covers the real scoring and evidence publication.
 */
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { TrialTestPanel } from "@/components/career/TrialTestPanel";
import CareerTrialPage from "@/pages/CareerTrialPage";
import {
  TEST_RESULT,
  TRIAL_TEST,
  createMockActor,
  mockCoreInfrastructure,
  renderWithRouter,
} from "@/test/harness";

const signedInActor = createMockActor();
mockCoreInfrastructure(signedInActor, {
  isAuthenticated: true,
  principal: "renrk-eyaaa-aaaaa-aaada-cai",
});

function renderCareerTrialPage() {
  return renderWithRouter(() => <CareerTrialPage />, "/career-trial");
}

/** Open the Marketing brief, enrol, and start the test. */
async function openTest(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByTestId("career_trial.list");
  await user.click(screen.getByTestId("career_trial.start_button.1"));
  await user.click(screen.getByTestId("career_trial.modal_primary_button"));
  await user.click(
    await screen.findByTestId("career_trial.modal_start_test_button"),
  );
  return screen.findByTestId("test.panel");
}

/** Answer the currently displayed question by picking its first option. */
async function answerCurrent(
  user: ReturnType<typeof userEvent.setup>,
  questionNumber: number,
) {
  await user.click(screen.getByTestId(`test.option.${questionNumber}.1`));
}

describe("Trial knowledge test", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockCoreInfrastructure(signedInActor, {
      isAuthenticated: true,
      principal: "renrk-eyaaa-aaaaa-aaada-cai",
    });
  });

  it("opens the test after enrolment and shows the first of five questions", async () => {
    const user = userEvent.setup();
    await renderCareerTrialPage();

    const panel = await openTest(user);

    expect(
      within(panel).getByText(/show what you learned in marketing/i),
    ).toBeInTheDocument();
    const question = screen.getByTestId("test.question.1");
    expect(question).toBeInTheDocument();
    expect(
      within(question).getByRole("heading", {
        name: TRIAL_TEST.questions[0].prompt,
      }),
    ).toBeInTheDocument();
    // Five progress steps, one per question.
    expect(screen.getByTestId("test.progress_steps").children).toHaveLength(5);
  });

  it("blocks submission until every question is answered and names the gaps", async () => {
    const user = userEvent.setup();
    await renderCareerTrialPage();
    await openTest(user);

    // Nothing answered yet: the submit button is disabled and the nudge lists
    // every unanswered question.
    expect(screen.getByTestId("test.submit_button")).toBeDisabled();
    expect(screen.getByTestId("test.unanswered_nudge")).toHaveTextContent(
      "#1, #2, #3, #4, #5",
    );

    // Answer the first question only; the nudge drops it from the list.
    await answerCurrent(user, 1);
    expect(screen.getByTestId("test.submit_button")).toBeDisabled();
    expect(screen.getByTestId("test.unanswered_nudge")).toHaveTextContent(
      "#2, #3, #4, #5",
    );
  });

  it("moves back and forth without losing an answer", async () => {
    const user = userEvent.setup();
    await renderCareerTrialPage();
    await openTest(user);

    await answerCurrent(user, 1);
    await user.click(screen.getByTestId("test.next_button"));
    expect(screen.getByTestId("test.question.2")).toBeInTheDocument();

    // Back to question 1: the chosen option is still pressed.
    await user.click(screen.getByTestId("test.back_button"));
    expect(screen.getByTestId("test.question.1")).toBeInTheDocument();
    expect(screen.getByTestId("test.option.1.1")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("submits a complete attempt and shows the scored result with aspects and an evidence link", async () => {
    const user = userEvent.setup();
    await renderCareerTrialPage();
    await openTest(user);

    for (let question = 1; question <= 5; question += 1) {
      await answerCurrent(user, question);
      if (question < 5) {
        await user.click(screen.getByTestId("test.next_button"));
      }
    }

    expect(screen.getByTestId("test.submit_button")).toBeEnabled();
    await user.click(screen.getByTestId("test.submit_button"));

    const result = await screen.findByTestId("test.result_panel");
    // `score` is a 0-100 percentage, so a perfect attempt reads as 5 of 5
    // correct answers on the medallion.
    const medallion = within(result).getByTestId("test.score_medallion");
    expect(medallion).toHaveTextContent("5");
    expect(medallion).toHaveTextContent(/out of 5/i);
    // Per-aspect breakdown from the backend result.
    expect(
      within(result).getByTestId("test.aspect_list").children,
    ).toHaveLength(TEST_RESULT.aspectScores.length);
    expect(within(result).getByText("Creativity")).toBeInTheDocument();
    // The result links through to the Evidence page.
    expect(
      within(result).getByTestId("test.evidence_link"),
    ).toBeInTheDocument();

    // The attempt was submitted with one answer per question.
    expect(signedInActor.submitTest).toHaveBeenCalledTimes(1);
    const [, answers] = signedInActor.submitTest.mock.calls[0] as [
      bigint,
      { questionId: bigint; optionId: bigint }[],
    ];
    expect(answers).toHaveLength(5);
  });

  it("retakes the test and clears the previous answers", async () => {
    const user = userEvent.setup();
    await renderCareerTrialPage();
    await openTest(user);

    for (let question = 1; question <= 5; question += 1) {
      await answerCurrent(user, question);
      if (question < 5) {
        await user.click(screen.getByTestId("test.next_button"));
      }
    }
    await user.click(screen.getByTestId("test.submit_button"));
    await screen.findByTestId("test.result_panel");

    await user.click(screen.getByTestId("test.retake_button"));

    // Back at question 1 with no answer selected and submission blocked again.
    expect(screen.getByTestId("test.question.1")).toBeInTheDocument();
    expect(screen.getByTestId("test.option.1.1")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByTestId("test.submit_button")).toBeDisabled();
  });

  it("prompts a signed-out visitor to sign in instead of showing the questions", async () => {
    mockCoreInfrastructure(createMockActor(), { isAuthenticated: false });
    const user = userEvent.setup();

    renderWithRouter(
      () => (
        <TrialTestPanel
          trialId={1n}
          trialName="Marketing"
          onClose={() => {}}
          onViewEvidence={() => {}}
        />
      ),
      "/career-trial",
    );

    expect(await screen.findByTestId("test.sign_in_state")).toBeInTheDocument();
    expect(screen.getByTestId("test.sign_in_button")).toBeInTheDocument();
    expect(screen.queryByTestId("test.submit_button")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("test.sign_in_button"));
    expect(signedInActor.submitTest).not.toHaveBeenCalled();
  });
});
