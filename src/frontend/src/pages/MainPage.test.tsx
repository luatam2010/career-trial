/**
 * Main Page journey: the landing route renders every accepted section with
 * real content, the language switcher translates the whole page, and the
 * pricing pop-up opens and closes via its X control.
 */
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MainPage from "@/pages/MainPage";
import {
  createMockActor,
  mockCoreInfrastructure,
  renderWithShell,
} from "@/test/harness";

const actor = createMockActor();
mockCoreInfrastructure(actor);

function renderMainPage() {
  return renderWithShell(() => <MainPage />);
}

describe("Main Page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the hero, all eight sections and the footer content", async () => {
    await renderMainPage();

    // Hero headline + primary CTA.
    expect(
      screen.getByRole("heading", {
        name: /try the work before you choose the career/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("main.hero_cta_button")).toHaveAttribute(
      "href",
      "/career-trial",
    );

    // How It Works: four numbered steps.
    const howList = screen.getByTestId("main.how_it_works_list");
    expect(within(howList).getAllByRole("listitem")).toHaveLength(4);
    for (const step of ["Explore", "Trial", "Reflect", "Decide"]) {
      expect(within(howList).getByText(step)).toBeInTheDocument();
    }

    // Evidence preview with an example card and a link to the Evidence page.
    expect(screen.getByTestId("evidence.card")).toBeInTheDocument();
    expect(screen.getByTestId("main.evidence_cta_button")).toHaveAttribute(
      "href",
      "/evidence",
    );

    // Business model: selectors + three revenue cards.
    expect(screen.getByTestId("main.business_users_panel")).toBeInTheDocument();
    expect(
      screen.getByTestId("main.business_payers_panel"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("main.revenue_card.1")).toBeInTheDocument();
    expect(screen.getByTestId("main.revenue_card.2")).toBeInTheDocument();
    expect(screen.getByTestId("main.revenue_card.3")).toBeInTheDocument();

    // Pilot pricing: badge + five plan cards.
    expect(screen.getByTestId("main.pricing_badge")).toHaveTextContent(
      /pilot prices — not final/i,
    );
    for (let index = 1; index <= 5; index += 1) {
      expect(
        screen.getByTestId(`main.pricing_card.${index}`),
      ).toBeInTheDocument();
    }

    // Our team: three student cards.
    for (let index = 1; index <= 3; index += 1) {
      expect(screen.getByTestId(`main.team_card.${index}`)).toBeInTheDocument();
    }

    // Path to profitability: four numbered steps.
    const pathList = screen.getByTestId("main.path_list");
    expect(within(pathList).getAllByRole("listitem")).toHaveLength(4);

    // Join the ecosystem: mentor + partner cards and the disclaimer banner.
    expect(
      screen.getByTestId("main.ecosystem_card.mentor"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("main.ecosystem_card.partner"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("main.pricing_disclaimer")).toBeInTheDocument();
  });

  it("translates the whole page when the language switches to Vietnamese", async () => {
    const user = userEvent.setup();
    await renderMainPage();

    expect(
      screen.getByRole("heading", {
        name: /try the work before you choose the career/i,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("nav.language.vi"));

    // The same heading now renders the Vietnamese translation.
    expect(
      screen.getByRole("heading", {
        name: /thử việc thật trước khi chọn nghề/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /try the work before you choose the career/i,
      }),
    ).not.toBeInTheDocument();
    expect(document.documentElement.lang).toBe("vi");
  });

  it("opens the pricing pop-up and closes it with the X control", async () => {
    const user = userEvent.setup();
    await renderMainPage();

    expect(screen.queryByTestId("pricing.modal")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("main.pricing_open_modal_button"));

    const modal = screen.getByTestId("pricing.modal");
    expect(modal).toBeInTheDocument();
    expect(screen.getByTestId("pricing.trial_callout")).toHaveTextContent(
      /7-day free trial/i,
    );
    for (let index = 1; index <= 5; index += 1) {
      expect(screen.getByTestId(`pricing.plan.0${index}`)).toBeInTheDocument();
    }

    await user.click(screen.getByTestId("pricing.close_button"));
    expect(screen.queryByTestId("pricing.modal")).not.toBeInTheDocument();
  });

  it("closes the pricing pop-up on Escape", async () => {
    const user = userEvent.setup();
    await renderMainPage();

    await user.click(screen.getByTestId("main.pricing_open_modal_button"));
    expect(screen.getByTestId("pricing.modal")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("pricing.modal")).not.toBeInTheDocument();
  });
});
