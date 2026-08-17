import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  placeAnchoredPanel,
  projectToScreen,
  type ScreenPoint,
} from "../core/selectionAnchor";
import { useSelectionAnchorChannel } from "./selectionAnchorChannel";

/**
 * Keeps the anchored selection panel over the thing it describes: once per
 * rendered frame it builds the view-projection matrix from the LIVE camera,
 * projects the panel's world anchor, and writes the resulting placement
 * straight onto the DOM node.
 *
 * Why the live camera and not `viewStore.viewProjectionMatrix`: that one is
 * published on a throttle with a trailing settle (`CameraMatrixSync`), which
 * is right for replanning chunk loads and wrong for a label — at 60 ms cadence
 * the panel visibly drags behind the shape through a pan. Reading the camera
 * here costs one matrix invert and one multiply on frames where the anchor
 * actually moved.
 *
 * Nothing here re-renders: no state, no store subscription that React sees.
 * The only React work is `invalidate()` on an anchor change, because
 * `frameloop="demand"` renders nothing while the camera sits still — without
 * it a newly selected shape would place its panel only on the next pan.
 *
 * Must be mounted INSIDE the Canvas (it needs the frame loop); the panel it
 * drives lives outside it. `SelectionAnchorProvider` spans both.
 */

/** Where an unanchored panel parks, in CSS px from the canvas's top-left. */
const FALLBACK_X = 8;
const FALLBACK_Y = 8;

export const SelectionAnchorProjector = () => {
  const channel = useSelectionAnchorChannel();
  const invalidate = useThree((state) => state.invalidate);

  // Wake the demand loop when the anchor (or the panel node) changes.
  useEffect(() => channel.subscribe(() => invalidate()), [channel, invalidate]);

  const viewProjection = useRef(new THREE.Matrix4());
  const inverseWorld = useRef(new THREE.Matrix4());
  const projected = useRef<ScreenPoint>({ x: 0, y: 0, behind: false });
  const placement = useRef({ x: 0, y: 0 });
  // Last WRITTEN placement, so a still camera writes nothing at all.
  const written = useRef({ x: Number.NaN, y: Number.NaN, hidden: true });

  useFrame(({ camera, size }) => {
    const { element, world, size: panel } = channel.read();
    if (!element) return;

    let hidden = false;
    let x = FALLBACK_X;
    let y = FALLBACK_Y;

    if (world) {
      // `matrixWorldInverse` is refreshed by the renderer AFTER the frame
      // callbacks, so reading it here would place the panel one frame behind
      // the shape — inverting the (freshly updated) world matrix ourselves is
      // what keeps them locked together during a drag.
      camera.updateMatrixWorld();
      inverseWorld.current.copy(camera.matrixWorld).invert();
      viewProjection.current.multiplyMatrices(
        camera.projectionMatrix,
        inverseWorld.current,
      );

      const point = projectToScreen(world, viewProjection.current, size, projected.current);
      // Behind the camera the projection mirrors: the panel would slide to the
      // opposite edge and point at nothing. Hide it until the anchor is in
      // front again — the selection itself is untouched.
      hidden = point.behind;
      const placed = placeAnchoredPanel({
        anchor: point,
        panel,
        viewport: size,
        out: placement.current,
      });
      x = placed.x;
      y = placed.y;
    }

    if (
      hidden === written.current.hidden &&
      Math.abs(x - written.current.x) < 0.5 &&
      Math.abs(y - written.current.y) < 0.5
    ) {
      return;
    }
    written.current.x = x;
    written.current.y = y;
    written.current.hidden = hidden;

    element.style.visibility = hidden ? "hidden" : "visible";
    // translate3d is compositor-only; animating left/top would force a layout
    // on every frame of a pan. Whole pixels keep the text from resampling.
    element.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  });

  return null;
};
