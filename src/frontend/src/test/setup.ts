/**
 * Shared Vitest setup for the frontend suite.
 *
 * - registers jest-dom matchers
 * - points Testing Library's `getByTestId` at the app's `data-ocid` attribute
 * - provides the browser APIs jsdom does not implement but the app touches
 *   (matchMedia, IntersectionObserver, scrollTo, scrollIntoView, ResizeObserver)
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { Fragment, type ReactNode, createElement } from "react";
import { afterEach, vi } from "vitest";

import { coreInfrastructureMockState } from "@/test/mock-state";

// The generated components use `data-ocid` as their stable test marker.
configure({ testIdAttribute: "data-ocid" });

// Replace the real Internet Identity / actor provider with a local mock for
// every test file. The factory reads `coreInfrastructureMockState`, which the
// harness mutates per test, so no real sign-in or canister call happens.
//
// This module is a `.ts` file, so the mock factory must not contain JSX; the
// provider is built with `createElement` instead.
vi.mock("@caffeineai/core-infrastructure", () => ({
  InternetIdentityProvider: ({ children }: { children: ReactNode }) =>
    createElement(Fragment, null, children),
  useInternetIdentity: () => {
    const { options, login, clear } = coreInfrastructureMockState;
    const principal = options.principal ?? "aaaaa-aa";
    return {
      identity: options.isAuthenticated
        ? { getPrincipal: () => ({ toString: () => principal }) }
        : null,
      login,
      clear,
      isAuthenticated: options.isAuthenticated ?? false,
      isInitializing: options.isInitializing ?? false,
      isLoggingIn: options.isLoggingIn ?? false,
    };
  },
  useActor: () => ({
    actor: coreInfrastructureMockState.actor,
    isFetching: false,
  }),
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

if (!("IntersectionObserver" in window)) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  });
}

if (!("ResizeObserver" in window)) {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: MockResizeObserver,
  });
}

if (!window.scrollTo) {
  Object.defineProperty(window, "scrollTo", { writable: true, value: vi.fn() });
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// Radix UI primitives (Select, DropdownMenu, Dialog) call the Pointer Capture
// API, which jsdom does not implement. Without these stubs opening a Radix
// select throws `target.hasPointerCapture is not a function`.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}
