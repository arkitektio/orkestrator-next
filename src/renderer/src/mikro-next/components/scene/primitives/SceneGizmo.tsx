import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { createPortal, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";

/**
 * Orientation gizmo — a local replacement for drei's `GizmoHelper` +
 * `GizmoViewport`.
 *
 * ## Why not drei's
 *
 * drei's `RenderHud` renders `main scene -> gl.clearDepth() -> hud scene`. That
 * middle call is expensive here in a way it is not in a typical scene: R3F
 * applies ACES tone mapping and sRGB output, so three's `needsFrameBufferTarget`
 * is true and the whole frame goes through an offscreen RGBA16F target. Every
 * `renderer.clear()` in that mode ends with a full-screen `_renderOutput` blit
 * (Renderer.js: `if (renderTarget !== null && this._renderTarget === null)`),
 * and that blit is itself a counted `render()` call. So a depth-only clear cost
 * a full-screen colour read+write of the entire canvas, every frame.
 *
 * Measured on the 4-layer volume scene: 5 render calls per frame, of which 3
 * were output blits. Dropping this one takes it to 4.
 *
 * ## What replaces the clear
 *
 * A depth-only quad (`colorWrite: false`, `depthWrite: true`, `depthTest:
 * false`) drawn first in the gizmo scene. It resets the depth buffer by
 * RASTERIZING rather than by calling `clear()`, so the gizmo's parts still
 * depth-test against each other exactly as before — the negative-axis heads
 * still go behind the positive ones — while the renderer never takes the
 * clear path and never blits. A depth-only fill is far cheaper than the
 * RGBA16F colour blit it replaces.
 *
 * Everything else (axis bars, labelled sprite heads, click-to-snap) mirrors
 * drei's behaviour; the gizmo Context it uses for `tweenCamera` is not
 * exported, which is why the viewport half had to come along too.
 */

const TURN_RATE = 2 * Math.PI; // radians/second for the snap animation

const dummy = new THREE.Object3D();
const matrix = new THREE.Matrix4();
const q1 = new THREE.Quaternion();
const q2 = new THREE.Quaternion();
const target = new THREE.Vector3();
const targetPosition = new THREE.Vector3();

type OrbitLike = { target: THREE.Vector3; update: () => void; minPolarAngle?: number };

/** One axis bar: a thin box from the origin toward +X, rotated into place. */
const Axis = ({ color, rotation }: { color: string; rotation: [number, number, number] }) => (
  <group rotation={rotation}>
    <mesh position={[0.4, 0, 0]}>
      <boxGeometry args={[0.8, 0.05, 0.05]} />
      {/* depthTest stays ON: the quad below has already reset depth, so the
          gizmo's own parts occlude each other correctly. */}
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  </group>
);

const AxisHead = ({
  position,
  arcStyle,
  label,
  labelColor,
  font,
  scale: headScale,
  onSnap,
}: {
  position: [number, number, number];
  arcStyle: string;
  label?: string;
  labelColor: string;
  font: string;
  scale: number;
  onSnap: (direction: THREE.Vector3) => void;
}) => {
  const gl = useThree((state) => state.gl);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d")!;
    context.beginPath();
    context.arc(32, 32, 16, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = arcStyle;
    context.fill();
    if (label) {
      context.font = font;
      context.textAlign = "center";
      context.fillStyle = labelColor;
      context.fillText(label, 32, 41);
    }
    return new THREE.CanvasTexture(canvas);
  }, [arcStyle, label, labelColor, font]);
  useEffect(() => () => texture.dispose(), [texture]);

  const [active, setActive] = useState(false);
  const scale = (label ? 1 : 0.75) * (active ? 1.2 : 1) * headScale;

  return (
    <sprite
      position={position}
      scale={scale}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        setActive(true);
      }}
      onPointerOut={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        setActive(false);
      }}
      onPointerDown={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        onSnap(event.object.position);
      }}
    >
      <spriteMaterial
        map={texture}
        map-anisotropy={gl.capabilities?.getMaxAnisotropy?.() ?? 1}
        alphaTest={0.3}
        opacity={label ? 1 : 0.75}
        toneMapped={false}
      />
    </sprite>
  );
};

/**
 * Owns the frame. Renders the main scene, then the gizmo scene on top, with NO
 * `clearDepth()` between them — see the module note.
 */
const GizmoRender = ({
  defaultScene,
  defaultCamera,
}: {
  defaultScene: THREE.Scene;
  defaultCamera: THREE.Camera;
}) => {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    const previousAutoClear = gl.autoClear;
    gl.autoClear = true;
    gl.render(defaultScene, defaultCamera);
    gl.autoClear = false;
    // No gl.clearDepth() here — the depth quad in the gizmo scene does it.
    gl.render(scene, camera);
    gl.autoClear = previousAutoClear;
  }, 1);

  return null;
};

export const SceneGizmo = ({
  alignment = "bottom-right",
  margin = [100, 100],
  axisColors = ["rgb(78, 78, 78)", "rgb(78, 78, 78)", "rgb(78, 78, 78)"],
  labelColor = "white",
  axisHeadScale = 1,
  labels = ["X", "Y", "Z"],
  font = "18px Inter var, Arial, sans-serif",
}: {
  alignment?: `${"top" | "bottom" | "center"}-${"left" | "right" | "center"}`;
  margin?: [number, number];
  axisColors?: [string, string, string] | string[];
  labelColor?: string;
  axisHeadScale?: number;
  labels?: [string, string, string] | string[];
  font?: string;
}) => {
  const size = useThree((state) => state.size);
  const mainScene = useThree((state) => state.scene);
  const mainCamera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as OrbitLike | null;
  const invalidate = useThree((state) => state.invalidate);

  const [gizmoScene] = useState(() => new THREE.Scene());
  const gizmoRef = useRef<THREE.Group>(null);
  const animating = useRef(false);
  const radius = useRef(0);
  const focusPoint = useRef(new THREE.Vector3());
  const defaultUp = useRef(new THREE.Vector3());

  useEffect(() => {
    defaultUp.current.copy(mainCamera.up);
    dummy.up.copy(mainCamera.up);
  }, [mainCamera]);

  /** Click an axis head: animate the main camera onto that direction. */
  const snapTo = (direction: THREE.Vector3) => {
    animating.current = true;
    if (controls) focusPoint.current.copy(controls.target);
    radius.current = mainCamera.position.distanceTo(target);
    q1.copy(mainCamera.quaternion);
    targetPosition.copy(direction).multiplyScalar(radius.current).add(target);
    dummy.lookAt(targetPosition);
    q2.copy(dummy.quaternion);
    invalidate();
  };

  useFrame((_, delta) => {
    if (animating.current) {
      if (q1.angleTo(q2) < 0.01) {
        animating.current = false;
        // OrbitControls orbits around UP, so restore it once the tween ends or
        // the controls start behaving oddly afterwards.
        if (controls && "minPolarAngle" in controls) mainCamera.up.copy(defaultUp.current);
      } else {
        q1.rotateTowards(q2, delta * TURN_RATE);
        mainCamera.position
          .set(0, 0, 1)
          .applyQuaternion(q1)
          .multiplyScalar(radius.current)
          .add(focusPoint.current);
        mainCamera.up.set(0, 1, 0).applyQuaternion(q1).normalize();
        mainCamera.quaternion.copy(q1);
        controls?.update();
        invalidate();
      }
    }
    // Track the main camera's orientation.
    if (gizmoRef.current) {
      matrix.copy(mainCamera.matrix).invert();
      gizmoRef.current.quaternion.setFromRotationMatrix(matrix);
    }
  });

  const [marginX, marginY] = margin;
  const x = alignment.endsWith("-center")
    ? 0
    : alignment.endsWith("-left")
      ? -size.width / 2 + marginX
      : size.width / 2 - marginX;
  const y = alignment.startsWith("center-")
    ? 0
    : alignment.startsWith("top-")
      ? size.height / 2 - marginY
      : -size.height / 2 + marginY;

  const [colorX, colorY, colorZ] = axisColors;
  const headProps = { labelColor, font, scale: axisHeadScale, onSnap: snapTo };

  return createPortal(
    <>
      {/* near/far are explicit because the depth quad below is positioned
          relative to them; leaving them to the default would make its depth
          value implementation-defined. */}
      <OrthographicCamera makeDefault position={[0, 0, 200]} near={0.1} far={2000} />

      {/* Depth reset, as geometry rather than gl.clearDepth() — see the module
          note. renderOrder -1 draws it before every gizmo part; colorWrite off
          means it only touches depth; depthTest off means it overwrites
          whatever the main scene left there. It spans the viewport, so the
          effect is exactly clearDepth's, and sits far enough back
          (view-space z 1200 of 2000 -> depth ~0.6) that the gizmo geometry
          near the origin (~0.08) passes the depth test against it. */}
      <mesh renderOrder={-1} position={[0, 0, -1000]} frustumCulled={false}>
        <planeGeometry args={[size.width, size.height]} />
        <meshBasicMaterial colorWrite={false} depthWrite={true} depthTest={false} />
      </mesh>

      <group ref={gizmoRef} position={[x, y, 0]} scale={40}>
        <Axis color={colorX} rotation={[0, 0, 0]} />
        <Axis color={colorY} rotation={[0, 0, Math.PI / 2]} />
        <Axis color={colorZ} rotation={[0, -Math.PI / 2, 0]} />
        <AxisHead position={[1, 0, 0]} arcStyle={colorX} label={labels[0]} {...headProps} />
        <AxisHead position={[0, 1, 0]} arcStyle={colorY} label={labels[1]} {...headProps} />
        <AxisHead position={[0, 0, 1]} arcStyle={colorZ} label={labels[2]} {...headProps} />
        <AxisHead position={[-1, 0, 0]} arcStyle={colorX} {...headProps} />
        <AxisHead position={[0, -1, 0]} arcStyle={colorY} {...headProps} />
        <AxisHead position={[0, 0, -1]} arcStyle={colorZ} {...headProps} />
      </group>

      <GizmoRender defaultScene={mainScene} defaultCamera={mainCamera} />
    </>,
    gizmoScene,
    // Above the main scene's handlers, so a click on an axis head does not
    // also reach the layers behind it.
    { events: { priority: 2 } },
  );
};
