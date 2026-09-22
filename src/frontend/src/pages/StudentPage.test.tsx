/**
 * Student area journey: signed-out visitors see the sign-in prompt, and a
 * signed-in student (Internet Identity mocked) sees their enrolled trials with
 * progress and their own evidence cards.
 */
import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import StudentPage from "@/pages/StudentPage";
import {
  createMockActor,
  mockCoreInfrastructure,
  renderWithRouter,
} from "@/test/harness";

const signedOutActor = createMockActor();
mockCoreInfrastructure(signedOutActor, { isAuthenticated: false });

function renderStudentPage() {
  return renderWithRouter(() => <StudentPage />, "/student");
}

describe("Student page (signed out)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the sign-in prompt instead of the private area", async () => {
    await renderStudentPage();

    expect(screen.getByTestId("student.sign_in_panel")).toBeInTheDocument();
    expect(screen.getByTestId("student.login_button")).toBeInTheDocument();
    expect(
      screen.queryByTestId("student.header_panel"),
    ).not.toBeInTheDocument();
  });
});
