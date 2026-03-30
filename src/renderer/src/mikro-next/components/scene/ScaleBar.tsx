import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";

/**
 * A Scale Bar that stays in the UI but calculates its length
 * based on the 3D world zoom level.
 */
export const WorldScaleBar = () => {
  const { size, camera } = useThree();
  const [scaleInfo, setScaleInfo] = useState({ widthPx: 0, label: "" });

  // Re-calculate whenever the camera zooms or the window resizes
  useEffect(() => {
    const calculateScale = () => {
      // 1. Get the width of the view in World Units
      // For Orthographic, the visible width is (canvasWidth / zoom)
      // Note: Three.js Ortho camera usually defines frustum by top/bottom/left/right.
      // If using @react-three/drei's OrthographicCamera, it handles the aspect ratio.

      const zoom = (camera as any).zoom || 1;

      // Determine a "nice" round number for the scale (e.g., 10, 50, 100, 500)
      // At zoom=1, 1 unit = 1 pixel (usually). We want a bar roughly 100px wide.
      const targetPx = 100;
      const worldUnitsPerPixel = 1 / zoom;
      const rawWorldUnits = targetPx * worldUnitsPerPixel;

      // Round to the nearest "clean" number (1, 2, 5, 10, 20, 50, 100...)
      const niceUnits = getNiceNumber(rawWorldUnits);
      const finalWidthPx = niceUnits / worldUnitsPerPixel;

      setScaleInfo({
        widthPx: finalWidthPx,
        label: `${niceUnits} µm`,
      });
    };

    calculateScale();
  }, [size, camera]);

  return (
    <Html>
      <div className="absolute bottom-12 right-4 flex flex-col items-center pointer-events-none">
        <div
          className="border-b-2 border-l-2 border-r-2 border-white h-2 transition-all duration-200"
          style={{ width: `${scaleInfo.widthPx}px` }}
        />
        <span className="text-[10px] text-white font-mono mt-1 bg-black/40 px-1 rounded">
          {scaleInfo.label}
        </span>
      </div>
    </Html>
  );
};

/**
 * Helper to find the nearest "human-readable" step for a scale bar
 */
function getNiceNumber(value: number): number {
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);
  let niceFraction;

  if (fraction < 1.5) niceFraction = 1;
  else if (fraction < 3) niceFraction = 2;
  else if (fraction < 7) niceFraction = 5;
  else niceFraction = 10;

  return niceFraction * Math.pow(10, exponent);
}
