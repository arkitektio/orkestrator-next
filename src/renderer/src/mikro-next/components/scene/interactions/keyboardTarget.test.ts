import { describe, expect, it } from "vitest";
import { isTypingTarget } from "./keyboardTarget";

describe("isTypingTarget", () => {
  it("is false without a target", () => {
    expect(isTypingTarget(null)).toBe(false);
    expect(isTypingTarget(undefined)).toBe(false);
  });

  it.each(["INPUT", "TEXTAREA", "SELECT"])("is true for <%s>", (tagName) => {
    expect(isTypingTarget({ tagName })).toBe(true);
  });

  it("is true for a contenteditable host of any tag", () => {
    expect(isTypingTarget({ tagName: "DIV", isContentEditable: true })).toBe(true);
  });

  it("is false for the canvas and ordinary elements", () => {
    expect(isTypingTarget({ tagName: "CANVAS" })).toBe(false);
    expect(isTypingTarget({ tagName: "DIV" })).toBe(false);
    expect(isTypingTarget({ tagName: "BUTTON" })).toBe(false);
  });
});
