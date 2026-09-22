/**
 * Mutable holder shared between the `vi.mock` factory (registered in
 * `setup.ts`, which Vitest hoists above every test module) and the harness
 * helpers that tests call. Keeping the state in its own module avoids the
 * hoisting trap where a mock factory cannot close over per-test values.
 */
import type { MockAuthOptions } from "@/test/harness";

export interface CoreInfrastructureMockState {
  actor: unknown;
  options: MockAuthOptions;
  login: ReturnType<typeof import("vitest").vi.fn>;
  clear: ReturnType<typeof import("vitest").vi.fn>;
}

export const coreInfrastructureMockState: CoreInfrastructureMockState = {
  actor: undefined,
  options: {},
  login: undefined as unknown as CoreInfrastructureMockState["login"],
  clear: undefined as unknown as CoreInfrastructureMockState["clear"],
};
