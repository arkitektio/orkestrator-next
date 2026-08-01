import { describe, expect, it } from "vitest";
import {
  sceneStructureSignature,
  type SceneStructureLike,
} from "./sceneStructure";

/**
 * The signature IS the provider's rebuild key, so these tests pin its
 * discrimination: content edits (the things callers fold into the stores)
 * must not change it; structural changes must. A false "same" leaves stale
 * stores; a false "different" reintroduces the reload-on-every-save bug this
 * module exists to kill.
 */

const step = (id: string, version = 1, inverted = false) => ({
  transformation: { id, version },
  inverted,
});

const scene = (over: Partial<SceneStructureLike> = {}): SceneStructureLike => ({
  id: "scene:1",
  worldCoordinateSystem: { id: "cs:world" },
  layers: [
    { id: "layer:a", pathToWorld: [step("t:cal"), step("t:reg")] },
    { id: "layer:b", pathToWorld: null },
  ],
  ...over,
});

describe("sceneStructureSignature", () => {
  it("is stable across fragment identity churn (content-only changes)", () => {
    // A fresh object graph with the same structure — what Apollo re-emits
    // after a render-graph save, a pinned view, or a new animation.
    expect(sceneStructureSignature(scene())).toBe(
      sceneStructureSignature(scene()),
    );
  });

  it("changes when a layer is added", () => {
    const bigger = scene({
      layers: [...scene().layers, { id: "layer:c", pathToWorld: [] }],
    });
    expect(sceneStructureSignature(bigger)).not.toBe(
      sceneStructureSignature(scene()),
    );
  });

  it("changes when a layer is removed", () => {
    const smaller = scene({ layers: scene().layers.slice(0, 1) });
    expect(sceneStructureSignature(smaller)).not.toBe(
      sceneStructureSignature(scene()),
    );
  });

  it("changes when layers reorder", () => {
    const reordered = scene({ layers: [...scene().layers].reverse() });
    expect(sceneStructureSignature(reordered)).not.toBe(
      sceneStructureSignature(scene()),
    );
  });

  it("changes when the scene or world changes", () => {
    expect(sceneStructureSignature(scene({ id: "scene:2" }))).not.toBe(
      sceneStructureSignature(scene()),
    );
    expect(
      sceneStructureSignature(scene({ worldCoordinateSystem: { id: "cs:other" } })),
    ).not.toBe(sceneStructureSignature(scene()));
  });

  it("changes when a placement edge is refined in place (version bump)", () => {
    const refined = scene({
      layers: [
        { id: "layer:a", pathToWorld: [step("t:cal"), step("t:reg", 2)] },
        { id: "layer:b", pathToWorld: null },
      ],
    });
    expect(sceneStructureSignature(refined)).not.toBe(
      sceneStructureSignature(scene()),
    );
  });

  it("changes when a path step flips direction or swaps edges", () => {
    const flipped = scene({
      layers: [
        { id: "layer:a", pathToWorld: [step("t:cal"), step("t:reg", 1, true)] },
        { id: "layer:b", pathToWorld: null },
      ],
    });
    const swapped = scene({
      layers: [
        { id: "layer:a", pathToWorld: [step("t:cal"), step("t:other")] },
        { id: "layer:b", pathToWorld: null },
      ],
    });
    expect(sceneStructureSignature(flipped)).not.toBe(
      sceneStructureSignature(scene()),
    );
    expect(sceneStructureSignature(swapped)).not.toBe(
      sceneStructureSignature(scene()),
    );
  });

  it("distinguishes an unregistered layer (null path) from a world-rooted one ([])", () => {
    const unregistered = scene({
      layers: [{ id: "layer:a", pathToWorld: null }],
    });
    const worldRooted = scene({
      layers: [{ id: "layer:a", pathToWorld: [] }],
    });
    expect(sceneStructureSignature(unregistered)).not.toBe(
      sceneStructureSignature(worldRooted),
    );
  });
});
