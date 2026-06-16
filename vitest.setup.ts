// Runs before every test file (see `test.setupFiles` in vitest.config.ts).
// Registers jest-dom matchers on Vitest's `expect` and stubs the browser APIs
// that components reach for but jsdom does not implement.
import "@testing-library/jest-dom/vitest";

// These stubs only apply in the jsdom environment; pure node suites have no
// `window` and skip this block entirely. We assign through a loose record cast
// so the stubs don't depend on the ambient DOM lib types being present.
if (typeof window !== "undefined") {
  const win = window as unknown as Record<string, unknown>;

  if (!win.matchMedia) {
    win.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  if (!win.ResizeObserver) {
    win.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  if (!win.IntersectionObserver) {
    win.IntersectionObserver = class {
      root = null;
      rootMargin = "";
      thresholds: ReadonlyArray<number> = [];
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    };
  }
}
