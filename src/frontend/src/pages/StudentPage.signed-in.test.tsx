/**
 * Student area journey for a signed-in student. Internet Identity is mocked
 * through the shared harness, so no real sign-in happens; the actor mock
 * returns the student's enrolments and evidence.
 */
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import StudentPage from "@/pages/StudentPage";
import {
  MY_ENROLLMENT,
  MY_EVIDENCE,
  STUDENT_PROFILE,
  TEST_RESULT,
  createMockActor,
  mockCoreInfrastructure,
  renderWithRouter,
  renderWithShell,
} from "@/test/harness";

const actor = createMockActor({
  enrollments: [MY_ENROLLMENT],
  myEvidence: [MY_EVIDENCE],
  myTestResult: TEST_RESULT,
  profile: STUDENT_PROFILE,
});
mockCoreInfrastructure(actor, {
  isAuthenticated: true,
  principal: "renrk-eyaaa-aaaaa-aaada-cai",
});

function renderStudentPage() {
  return renderWithRouter(() => <StudentPage />, "/student");
}

/** Render inside the full shell so the header language switcher is reachable. */
function renderStudentPageWithShell() {
  return renderWithShell(() => <StudentPage />);
}

describe("Student page (signed in)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the auto-generated result on the enrolled trial card", async () => {
    await renderStudentPage();

    const card = await screen.findByTestId("student.enrollment_card.1");
    expect(within(card).getByText("Marketing")).toBeInTheDocument();
    // The result is the backend-scored outcome, not a self-rated slider.
    expect(
      await within(card).findByTestId("student.enrollment_result.1"),
    ).toBeInTheDocument();
    expect(
      within(card).getByTestId("student.enrollment_score.1"),
    ).toHaveTextContent("100%");
    // The completion badge is the auto-generated result, and there is no
    // self-rating control left on the card.
    expect(
      within(card).getByTestId("student.enrollment_progress.1"),
    ).toHaveTextContent("100%");
    expect(within(card).queryByRole("slider")).not.toBeInTheDocument();
    expect(screen.getByTestId("student.header_panel")).toBeInTheDocument();
  });

  it("lists the student's own evidence cards with the published name and score", async () => {
    await renderStudentPage();

    const card = await screen.findByTestId("student.evidence_card.1");
    expect(within(card).getByText("Marketing")).toBeInTheDocument();
    // The card carries the signed-in student's published name and overall score.
    expect(
      within(card).getByTestId("student.evidence_name.1"),
    ).toHaveTextContent("Linh Nguyen");
    // Completion and the auto-scored overall percentage both read 100%.
    expect(within(card).getAllByText("100%")).toHaveLength(2);
    expect(within(card).getByText("Overall score")).toBeInTheDocument();
  });

  it("saves the display name that becomes the published tester name", async () => {
    const user = userEvent.setup();
    await renderStudentPage();

    const form = await screen.findByTestId("student.name_form");
    // The stored profile pre-fills the field once the profile query resolves.
    const input = await within(form).findByDisplayValue("Linh Nguyen");

    await user.clear(input);
    await user.type(input, "  Bao Tran  ");
    await user.click(within(form).getByTestId("student.name_save_button"));

    // The trimmed name is what reaches the backend.
    expect(actor.setMyDisplayName).toHaveBeenCalledWith("Bao Tran");
    expect(
      await within(form).findByTestId("student.name_success_state"),
    ).toBeInTheDocument();
  });

  it("translates the student area when the language switches to Vietnamese", async () => {
    const user = userEvent.setup();
    await renderStudentPageWithShell();

    await screen.findByTestId("student.enrollment_card.1");
    expect(
      screen.getByRole("heading", { name: /your trials and evidence/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("nav.language.vi"));

    expect(
      screen.getByRole("heading", {
        name: /bài thử nghề và bằng chứng của bạn/i,
      }),
    ).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("vi");
  });
});
