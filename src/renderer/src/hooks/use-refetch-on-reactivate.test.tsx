// @vitest-environment jsdom
import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRefetchOnReactivate } from "./use-refetch-on-reactivate";

// The hook only needs `connection.serviceMap` from the provider; mock it so the
// test can hand it a fake set of services without a real Arkitekt connection.
const connectionRef: { current: unknown } = { current: undefined };
vi.mock("@/lib/arkitekt/provider", () => ({
  useConnection: () => connectionRef.current,
}));

const makeApolloService = () => ({
  type: "apollo",
  client: { refetchQueries: vi.fn() },
});

const Harness = () => {
  useRefetchOnReactivate();
  return null;
};

const focus = () =>
  act(() => {
    window.dispatchEvent(new Event("focus"));
  });

const visible = () =>
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
  });

afterEach(() => {
  connectionRef.current = undefined;
  vi.restoreAllMocks();
});

describe("useRefetchOnReactivate", () => {
  it("refetches active queries on every apollo service when the window regains focus", () => {
    const a = makeApolloService();
    const b = makeApolloService();
    connectionRef.current = { serviceMap: { mikro: a, rekuest: b } };

    render(<Harness />);
    focus();

    expect(a.client.refetchQueries).toHaveBeenCalledTimes(1);
    expect(a.client.refetchQueries).toHaveBeenCalledWith({ include: "active" });
    expect(b.client.refetchQueries).toHaveBeenCalledTimes(1);
  });

  it("skips non-apollo services", () => {
    const apollo = makeApolloService();
    const nonApollo = { type: "rest", client: { refetchQueries: vi.fn() } };
    connectionRef.current = { serviceMap: { apollo, nonApollo } };

    render(<Harness />);
    focus();

    expect(apollo.client.refetchQueries).toHaveBeenCalledTimes(1);
    expect(nonApollo.client.refetchQueries).not.toHaveBeenCalled();
  });

  it("collapses paired focus + visibilitychange into a single sweep", () => {
    const a = makeApolloService();
    connectionRef.current = { serviceMap: { mikro: a } };

    render(<Harness />);
    // Simulate one reactivation firing both events back-to-back.
    focus();
    visible(); // visibilityState defaults to "visible" in jsdom

    expect(a.client.refetchQueries).toHaveBeenCalledTimes(1);
  });

  it("does nothing when there is no connection", () => {
    connectionRef.current = undefined;
    render(<Harness />);
    expect(() => focus()).not.toThrow();
  });
});
