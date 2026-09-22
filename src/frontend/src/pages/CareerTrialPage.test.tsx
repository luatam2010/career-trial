/**
 * Career Trial page journey: the seeded catalogue renders five startable cards
 * plus the non-startable "Coming next" placeholder, and Start Trial opens the
 * detailed brief pop-up which closes via its X control.
 */
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import CareerTrialPage from "@/pages/CareerTrialPage";
import {
  createMockActor,
  mockCoreInfrastructure,
  renderWithRouter,
  renderWithShell,
} from "@/test/harness";

const actor = createMockActor();
mockCoreInfrastructure(actor);

function renderCareerTrialPage() {
  return renderWithRouter(() => <CareerTrialPage />, "/career-trial");
}

/** Render inside the full shell so the header language switcher is reachable. */
function renderCareerTrialPageWithShell() {
  return renderWithShell(() => <CareerTrialPage />);
}

describe("Career Trial page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders five startable career cards plus the Coming next placeholder", async () => {
    await renderCareerTrialPage();

    const list = await screen.findByTestId("career_trial.list");
    // Five startable trials + one placeholder, as direct children of the grid.
    // (Nested tag lists also render <li>, so count the grid's own children.)
    expect(list.children).toHaveLength(6);

    // Each startable card shows a summary, 3+ skill tags and a day count.
    for (let index = 1; index <= 5; index += 1) {
      const card = screen.getByTestId(`career_trial.card.${index}`);
      expect(
        within(card).getByTestId(`career_trial.tags.${index}`).children.length,
      ).toBeGreaterThanOrEqual(3);
      expect(
        within(card).getByTestId(`career_trial.days.${index}`),
      ).toHaveTextContent(/days/i);
      expect(
        within(card).getByRole("button", { name: /start trial/i }),
      ).toBeInTheDocument();
    }

    // The placeholder renders through ComingNextCard and offers no Start Trial.
    const comingNext = screen.getByTestId("career_trial.coming_next_card");
    expect(comingNext).toBeInTheDocument();
    expect(
      within(comingNext).queryByRole("button", { name: /start trial/i }),
    ).not.toBeInTheDocument();
  });

  it("opens the detailed task pop-up from Start Trial and closes it with the X", async () => {
    const user = userEvent.setup();
    await renderCareerTrialPage();

    await screen.findByTestId("career_trial.list");
    expect(screen.queryByTestId("career_trial.modal")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("career_trial.start_button.1"));

    const modal = screen.getByTestId("career_trial.modal");
    expect(modal).toBeInTheDocument();
    // Brief, checklist, deliverables and estimated days are all present.
    expect(
      within(modal).getByText(/build a one-page campaign plan/i),
    ).toBeInTheDocument();
    expect(
      within(modal).getByTestId("career_trial.modal_checklist").children.length,
    ).toBeGreaterThan(0);
    expect(
      within(modal).getByTestId("career_trial.modal_deliverables").children
        .length,
    ).toBeGreaterThan(0);
    expect(within(modal).getByText(/estimated time/i)).toBeInTheDocument();

    await user.click(screen.getByTestId("career_trial.modal_close_button"));
    expect(screen.queryByTestId("career_trial.modal")).not.toBeInTheDocument();
  });

  it("filters the catalogue by search text", async () => {
    const user = userEvent.setup();
    await renderCareerTrialPage();

    await screen.findByTestId("career_trial.list");

    await user.type(screen.getByTestId("career_trial.search_input"), "design");

    expect(screen.getByTestId("career_trial.card.1")).toHaveTextContent(
      /graphic design/i,
    );
    expect(screen.queryByText("Marketing")).not.toBeInTheDocument();
  });

  it("filters the catalogue by skill chip and clears the filter again", async () => {
    const user = userEvent.setup();
    await renderCareerTrialPage();

    await screen.findByTestId("career_trial.list");

    // "Communication" is shared by Marketing, Business Analysis and Event
    // Planning, so the chip narrows the five startable trials to three.
    await user.click(screen.getByTestId("career_trial.filter.communication"));

    expect(screen.getByTestId("career_trial.results_count")).toHaveTextContent(
      /3/,
    );
    expect(screen.queryByText("Graphic Design")).not.toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();

    // Clearing restores the full startable catalogue.
    await user.click(screen.getByTestId("career_trial.clear_filters_button"));

    expect(screen.getByTestId("career_trial.results_count")).toHaveTextContent(
      /5/,
    );
    expect(screen.getByText("Graphic Design")).toBeInTheDocument();
  });

  it("shows the filtered empty state and recovers through its clear action", async () => {
    const user = userEvent.setup();
    await renderCareerTrialPage();

    await screen.findByTestId("career_trial.list");

    await user.type(
      screen.getByTestId("career_trial.search_input"),
      "no-such-career",
    );

    expect(screen.getByTestId("career_trial.empty_state")).toBeInTheDocument();
    // No startable card survives the filter; only the Coming next placeholder
    // remains in the grid.
    expect(screen.queryByTestId("career_trial.card.1")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("career_trial.coming_next_card"),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("career_trial.empty_action_button"));

    expect(
      screen.queryByTestId("career_trial.empty_state"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("career_trial.card.1")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();
  });

  it("translates the catalogue page when the language switches to Vietnamese", async () => {
    const user = userEvent.setup();
    await renderCareerTrialPageWithShell();

    await screen.findByTestId("career_trial.list");
    expect(
      screen.getByRole("heading", {
        name: /choose a career trial and start real work/i,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("nav.language.vi"));

    expect(
      screen.getByRole("heading", {
        name: /chọn một bài thử nghề và bắt tay vào việc thật/i,
      }),
    ).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("vi");
  });
});
