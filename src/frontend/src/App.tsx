import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { CursorGlow } from "@/components/layout/CursorGlow";
import { PricingModalProvider } from "@/components/layout/PricingModal";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LanguageProvider } from "@/lib/i18n";
import CareerTrialPage from "@/pages/CareerTrialPage";
import EvidencePage from "@/pages/EvidencePage";
import MainPage from "@/pages/MainPage";
import StudentPage from "@/pages/StudentPage";

/** Shared shell: header, routed page, footer, plus the global cursor glow. */
function RootLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <CursorGlow />
      <SiteHeader />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: MainPage,
});

const careerTrialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/career-trial",
  component: CareerTrialPage,
});

const evidenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/evidence",
  component: EvidencePage,
});

const studentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student",
  component: StudentPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  careerTrialRoute,
  evidenceRoute,
  studentRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <LanguageProvider>
      <PricingModalProvider>
        <RouterProvider router={router} />
      </PricingModalProvider>
    </LanguageProvider>
  );
}
