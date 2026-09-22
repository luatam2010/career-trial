/**
 * Evidence page journey: the wall renders evidence cards with tester, career,
 * completion, rating and aspect bars, and the career filter narrows the list.
 */
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import EvidencePage from "@/pages/EvidencePage";
import {
  STUDENT_PROFILE,
  createMockActor,
  mockCoreInfrastructure,
  renderWithRouter,
  renderWithShell,
} from "@/test/harness";
import type { EvidenceCard } from "@/types";

const actor = createMockActor();
mockCoreInfrastructure(actor);

function renderEvidencePage() {
  return renderWithRouter(() => <EvidencePage />, "/evidence");
}

/** Render inside the full shell so the header language switcher is reachable. */
function renderEvidencePageWithShell() {
  return renderWithShell(() => <EvidencePage />);
}

/**
 * Three cards whose completion, rating and name orders are all different, so a
 * sort assertion cannot pass by accident.
 */
const SORTABLE_EVIDENCE: EvidenceCard[] = [
  {
    id: 1n,
    testerName: "Zoe Adams",
    trialName: "Marketing",
    completionPercent: 50n,
    rating: 50n,
    aspectScores: [{ aspect: "Creativity", score: 50n }],
  },
  {
    id: 2n,
    testerName: "Mia Brown",
    trialName: "Graphic Design",
    completionPercent: 90n,
    rating: 30n,
    aspectScores: [{ aspect: "Creativity", score: 90n }],
  },
  {
    id: 3n,
    testerName: "Ana Clark",
    trialName: "Business Analysis",
    completionPercent: 70n,
    rating: 40n,
    aspectScores: [{ aspect: "Creativity", score: 70n }],
  },
];

/** Read the tester names in rendered order from the evidence list. */
function renderedTesterNames(): string[] {
  const list = screen.getByTestId("evidence.list");
  return within(list)
    .getAllByRole("heading", { level: 3 })
    .map((heading) => heading.textContent ?? "");
}

describe("Evidence page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    // Restore the shared default actor so a test that swaps in its own
    // evidence data cannot leak into the next one.
    mockCoreInfrastructure(actor);
  });

  it("renders evidence cards with tester, career, completion, rating and aspect bars", async () => {
    await renderEvidencePage();

    const list = await screen.findByTestId("evidence.list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);

    const first = screen.getByTestId("evidence.item.1");
    expect(within(first).getByText("Linh Nguyen")).toBeInTheDocument();
    expect(within(first).getByText("Marketing")).toBeInTheDocument();
    expect(within(first).getByText("92%")).toBeInTheDocument();
    // The overall score is the 0-100 rating, shown as a percentage.
    expect(within(first).getByText("88%")).toBeInTheDocument();
    expect(within(first).getByText("88.0")).toBeInTheDocument();

    // Aspect bars expose their score through role="meter".
    const meters = within(first).getAllByRole("meter");
    expect(meters.length).toBeGreaterThanOrEqual(3);
    expect(meters[0]).toHaveAttribute("aria-valuenow", "88");
    expect(meters[0]).toHaveAttribute("aria-valuemin", "0");
    expect(meters[0]).toHaveAttribute("aria-valuemax", "100");
  });

  it("filters evidence cards by career", async () => {
    const user = userEvent.setup();
    await renderEvidencePage();

    await screen.findByTestId("evidence.list");

    await user.click(screen.getByTestId("evidence.career.select"));
    await user.click(
      await screen.findByRole("option", { name: "Graphic Design" }),
    );

    expect(screen.getByTestId("evidence.item.1")).toHaveTextContent(
      "Minh Tran",
    );
    expect(screen.queryByText("Linh Nguyen")).not.toBeInTheDocument();
  });

  it("sorts the wall by completion, rating and tester name", async () => {
    const user = userEvent.setup();
    mockCoreInfrastructure(createMockActor({ evidence: SORTABLE_EVIDENCE }));
    await renderEvidencePage();

    await screen.findByTestId("evidence.list");

    // Default order is highest completion first.
    expect(renderedTesterNames()).toEqual([
      "Mia Brown",
      "Ana Clark",
      "Zoe Adams",
    ]);

    await user.click(screen.getByTestId("evidence.sort.select"));
    await user.click(
      await screen.findByRole("option", { name: /highest rating/i }),
    );
    expect(renderedTesterNames()).toEqual([
      "Zoe Adams",
      "Ana Clark",
      "Mia Brown",
    ]);

    await user.click(screen.getByTestId("evidence.sort.select"));
    await user.click(
      await screen.findByRole("option", { name: /tester name/i }),
    );
    expect(renderedTesterNames()).toEqual([
      "Ana Clark",
      "Mia Brown",
      "Zoe Adams",
    ]);
  });

  it("shows a newly published card with the signed-in student's name and trial", async () => {
    // The card the backend publishes after a scored attempt: the student's
    // display name, the trial name, completion and overall score.
    const published: EvidenceCard = {
      id: 42n,
      testerName: "Linh Nguyen",
      trialName: "Marketing",
      completionPercent: 80n,
      // The auto-scored overall percentage: the same 0-100 scale as completion.
      rating: 80n,
      aspectScores: [
        { aspect: "Creativity", score: 100n },
        { aspect: "Communication", score: 60n },
      ],
    };
    mockCoreInfrastructure(
      createMockActor({ evidence: [published], profile: STUDENT_PROFILE }),
      { isAuthenticated: true, principal: "renrk-eyaaa-aaaaa-aaada-cai" },
    );
    await renderEvidencePage();

    const card = await screen.findByTestId("evidence.item.1");
    expect(within(card).getByText("Linh Nguyen")).toBeInTheDocument();
    expect(within(card).getByText("Marketing")).toBeInTheDocument();
    // Completion and the overall score both read 80% for this card.
    expect(within(card).getAllByText("80%")).toHaveLength(2);
    expect(within(card).getByText("80.0")).toBeInTheDocument();
    // The signed-in student's own card is marked as theirs.
    expect(
      within(card).getByTestId("evidence.own_badge.1"),
    ).toBeInTheDocument();
  });

  it("translates the evidence page when the language switches to Vietnamese", async () => {
    const user = userEvent.setup();
    await renderEvidencePageWithShell();

    await screen.findByTestId("evidence.list");
    expect(
      screen.getByRole("heading", {
        name: /evidence from real student trials/i,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("nav.language.vi"));

    expect(
      screen.getByRole("heading", {
        name: /bằng chứng từ những bài thử nghề thật/i,
      }),
    ).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("vi");
  });
});
