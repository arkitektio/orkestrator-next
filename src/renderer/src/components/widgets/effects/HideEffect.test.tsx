// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), success: vi.fn() },
}));

import type { PortEffectFragment } from "@/rekuest/api/graphql";
import type { MappablePort } from "@/rekuest/widgets/types";
import { HideEffect } from "./HideEffect";

const port = { key: "details", kind: "STRING" } as unknown as MappablePort;

const showWhenAdvanced = {
  __typename: "HideEffect",
  kind: "HIDE",
  fade: false,
  dependencies: ["mode"],
  call: {
    operation: "compare.eq",
    arguments: [
      { key: "a", value_path: "mode" },
      { key: "b", value_literal: "advanced" },
    ],
  },
} as unknown as PortEffectFragment;

const Harness = ({
  effect,
  onForm,
}: {
  effect: PortEffectFragment;
  onForm: (form: UseFormReturn) => void;
}) => {
  const form = useForm({ defaultValues: { mode: "basic", details: "" } });
  onForm(form);
  return (
    <FormProvider {...form}>
      <HideEffect effect={effect} port={port}>
        <span>details input</span>
      </HideEffect>
    </FormProvider>
  );
};

describe("HideEffect", () => {
  it("shows and hides its port as the watched dependency changes", async () => {
    let form: UseFormReturn | null = null;
    render(<Harness effect={showWhenAdvanced} onForm={(f) => (form = f)} />);

    expect(screen.queryByText("details input")).toBeNull();

    await act(async () => {
      form!.setValue("mode", "advanced");
    });
    expect(screen.getByText("details input")).toBeTruthy();

    await act(async () => {
      form!.setValue("mode", "basic");
    });
    expect(screen.queryByText("details input")).toBeNull();
  });

  it("keeps the port visible and reports once when the call is broken", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const broken = {
      ...showWhenAdvanced,
      call: { operation: "nope.missing", arguments: [] },
    } as unknown as PortEffectFragment;

    render(<Harness effect={broken} onForm={() => {}} />);

    expect(screen.getByText("details input")).toBeTruthy();
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0][0])).toMatch(/not found/);
    error.mockRestore();
  });
});
