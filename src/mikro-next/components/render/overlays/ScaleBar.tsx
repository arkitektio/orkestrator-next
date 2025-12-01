import { useMemo } from "react";

export interface ScaleBarProps {
  /** Pixel size in micrometers per pixel */
  pixelSizeUm: number;
  /** Image width in pixels */
  imageWidth: number;
  /** Position of the scale bar */
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
}

/**
 * Formats the scale bar value with appropriate units
 * @param valueUm - Value in micrometers
 * @returns Formatted string with appropriate unit (nm, µm, mm)
 */
const formatScaleValue = (valueUm: number): string => {
  if (valueUm >= 1000) {
    return `${(valueUm / 1000).toFixed(1)} mm`;
  } else if (valueUm >= 1) {
    return `${valueUm.toFixed(1)} µm`;
  } else {
    return `${(valueUm * 1000).toFixed(0)} nm`;
  }
};

/**
 * Calculates a nice round number for the scale bar
 * @param targetUm - Target size in micrometers
 * @returns A nice round number close to the target
 */
const getNiceScaleValue = (targetUm: number): number => {
  // Find nice round numbers: 1, 2, 5, 10, 20, 50, 100, etc.
  const niceNumbers = [1, 2, 5];
  const magnitude = Math.pow(10, Math.floor(Math.log10(targetUm)));

  for (const nice of niceNumbers) {
    const candidate = nice * magnitude;
    if (candidate >= targetUm * 0.5 && candidate <= targetUm * 2) {
      return candidate;
    }
  }

  // Fallback to next magnitude
  return magnitude * 10;
};

/**
 * ScaleBar component that displays a scale reference for microscopy images.
 * This is an HTML overlay component that should be positioned absolutely
 * over the canvas.
 */
export const ScaleBar = ({
  pixelSizeUm,
  imageWidth,
  position = "bottom-left",
  backgroundColor = "rgba(0, 0, 0, 0.7)",
  textColor = "white",
}: ScaleBarProps) => {
  // Calculate the scale bar dimensions
  const scaleBarData = useMemo(() => {
    // Target scale bar width is about 20% of the image width
    const targetWidthPixels = imageWidth * 0.2;
    const targetWidthUm = targetWidthPixels * pixelSizeUm;

    // Get a nice round value for the scale bar
    const scaleValueUm = getNiceScaleValue(targetWidthUm);

    // Calculate actual pixel width for this nice value
    const scaleWidthPixels = scaleValueUm / pixelSizeUm;

    // Calculate percentage width relative to image
    const scaleWidthPercent = (scaleWidthPixels / imageWidth) * 100;

    return {
      widthPercent: Math.min(scaleWidthPercent, 40), // Cap at 40%
      label: formatScaleValue(scaleValueUm),
      pixelSizeLabel: `${pixelSizeUm.toFixed(3)} µm/px`,
    };
  }, [pixelSizeUm, imageWidth]);

  // Position styles
  const positionStyles: React.CSSProperties = {
    position: "absolute",
    ...(position.includes("bottom") ? { bottom: "60px" } : { top: "20px" }),
    ...(position.includes("left") ? { left: "20px" } : { right: "20px" }),
  };

  return (
    <div
      style={{
        ...positionStyles,
        backgroundColor,
        padding: "8px 12px",
        borderRadius: "4px",
        color: textColor,
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 10,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Scale bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: position.includes("right") ? "flex-end" : "flex-start",
          gap: "4px",
        }}
      >
        {/* Visual bar */}
        <div
          style={{
            width: `${scaleBarData.widthPercent * 2}px`, // Multiply by factor for visibility
            minWidth: "40px",
            maxWidth: "120px",
            height: "4px",
            backgroundColor: textColor,
            borderRadius: "1px",
          }}
        />
        {/* Scale label */}
        <div style={{ fontWeight: "bold" }}>{scaleBarData.label}</div>
        {/* Pixel size label */}
        <div style={{ fontSize: "10px", opacity: 0.8 }}>
          {scaleBarData.pixelSizeLabel}
        </div>
      </div>
    </div>
  );
};

/**
 * Props for ScaleBarOverlay which calculates pixel size from context
 */
export interface ScaleBarOverlayProps {
  /** Pixel size in X direction (micrometers) */
  pixelSizeX?: number | null;
  /** Pixel size in Y direction (micrometers) - if different from X */
  pixelSizeY?: number | null;
  /** Image width in pixels */
  imageWidth: number;
  /** Whether to show the scale bar */
  show?: boolean;
  /** Position of the scale bar */
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}

/**
 * ScaleBarOverlay component that handles cases where pixel size may not be available
 */
export const ScaleBarOverlay = ({
  pixelSizeX,
  pixelSizeY,
  imageWidth,
  show = true,
  position = "bottom-left",
}: ScaleBarOverlayProps) => {
  // Use pixelSizeX or pixelSizeY (they should typically be the same for isotropic images)
  const pixelSizeUm = pixelSizeX ?? pixelSizeY;

  if (!show || pixelSizeUm == null || pixelSizeUm <= 0) {
    return null;
  }

  return (
    <ScaleBar
      pixelSizeUm={pixelSizeUm}
      imageWidth={imageWidth}
      position={position}
    />
  );
};

export default ScaleBarOverlay;
