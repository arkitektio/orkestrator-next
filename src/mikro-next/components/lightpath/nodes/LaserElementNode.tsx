import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { LaserElementNode, SourceElementNode } from "../types";

// Function to convert wavelength (nm) to RGB color
const wavelengthToColor = (wavelength: number) => {
  // Wavelength ranges for visible light (380-780 nm)
  if (wavelength >= 380 && wavelength < 440) {
    // Violet
    const intensity = (wavelength - 380) / (440 - 380);
    return {
      primary: `rgb(${Math.round(138 + intensity * 117)}, ${Math.round(43 + intensity * 82)}, ${Math.round(226 + intensity * 29)})`,
      secondary: `rgb(${Math.round(75 + intensity * 63)}, ${Math.round(0 + intensity * 43)}, ${Math.round(130 + intensity * 96)})`,
      accent: `rgb(${Math.round(199 + intensity * 56)}, ${Math.round(134 + intensity * 91)}, ${Math.round(255)})`,
      name: "Violet",
    };
  } else if (wavelength >= 440 && wavelength < 490) {
    // Blue
    const intensity = (wavelength - 440) / (490 - 440);
    return {
      primary: `rgb(${Math.round(0 + intensity * 59)}, ${Math.round(191 + intensity * 64)}, ${Math.round(255)})`,
      secondary: `rgb(${Math.round(30 + intensity * 29)}, ${Math.round(144 + intensity * 47)}, ${Math.round(255)})`,
      accent: `rgb(${Math.round(135 + intensity * 120)}, ${Math.round(206 + intensity * 49)}, ${Math.round(250 + intensity * 5)})`,
      name: "Blue",
    };
  } else if (wavelength >= 490 && wavelength < 510) {
    // Cyan
    const intensity = (wavelength - 490) / (510 - 490);
    return {
      primary: `rgb(${Math.round(0 + intensity * 34)}, ${Math.round(255)}, ${Math.round(146 + intensity * 109)})`,
      secondary: `rgb(${Math.round(6 + intensity * 28)}, ${Math.round(182 + intensity * 73)}, ${Math.round(212 + intensity * 43)})`,
      accent: `rgb(${Math.round(165 + intensity * 90)}, ${Math.round(243 + intensity * 12)}, ${Math.round(252 + intensity * 3)})`,
      name: "Cyan",
    };
  } else if (wavelength >= 510 && wavelength < 580) {
    // Green
    const intensity = (wavelength - 510) / (580 - 510);
    return {
      primary: `rgb(${Math.round(34 + intensity * 100)}, ${Math.round(197 + intensity * 58)}, ${Math.round(94 + intensity * 6)})`,
      secondary: `rgb(${Math.round(21 + intensity * 86)}, ${Math.round(128 + intensity * 72)}, ${Math.round(61 + intensity * 39)})`,
      accent: `rgb(${Math.round(187 + intensity * 68)}, ${Math.round(247 + intensity * 8)}, ${Math.round(208 + intensity * 47)})`,
      name: "Green",
    };
  } else if (wavelength >= 580 && wavelength < 645) {
    // Yellow to Orange
    const intensity = (wavelength - 580) / (645 - 580);
    return {
      primary: `rgb(${Math.round(255)}, ${Math.round(193 - intensity * 64)}, ${Math.round(7 + intensity * 17)})`,
      secondary: `rgb(${Math.round(245 + intensity * 10)}, ${Math.round(158 - intensity * 103)}, ${Math.round(11 + intensity * 44)})`,
      accent: `rgb(${Math.round(254 + intensity * 1)}, ${Math.round(240 - intensity * 117)}, ${Math.round(138 + intensity * 117)})`,
      name: intensity < 0.5 ? "Yellow" : "Orange",
    };
  } else if (wavelength >= 645 && wavelength <= 780) {
    // Red
    const intensity = (wavelength - 645) / (780 - 645);
    return {
      primary: `rgb(${Math.round(255)}, ${Math.round(59 - intensity * 59)}, ${Math.round(48 - intensity * 48)})`,
      secondary: `rgb(${Math.round(220 + intensity * 35)}, ${Math.round(38 - intensity * 38)}, ${Math.round(127 - intensity * 127)})`,
      accent: `rgb(${Math.round(248 + intensity * 7)}, ${Math.round(113 - intensity * 113)}, ${Math.round(133 - intensity * 133)})`,
      name: "Red",
    };
  } else {
    // Outside visible range - use white/warm white
    return {
      primary: "rgb(255, 248, 220)",
      secondary: "rgb(245, 245, 220)",
      accent: "rgb(255, 255, 255)",
      name: wavelength < 380 ? "UV" : "IR",
    };
  }
};

export default memo(({ data, selected }: NodeProps<LaserElementNode>) => {
  const wavelength = data.nominalWavelengthNm || 550; // Default to green if no wavelength
  const colors = wavelengthToColor(wavelength);

  return (
    <>
      <Handles self={data} />
      <div
        className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
        {/* Light source with wavelength-based color */}
        <div
          className="relative w-full h-full border-2 rounded-full shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            borderColor: colors.secondary,
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: `linear-gradient(135deg, white, ${colors.accent}, transparent)`,
            }}
          ></div>

          {/* Central bright spot */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full animate-pulse"
            style={{
              background: `linear-gradient(135deg, white, ${colors.accent}, transparent)`,
            }}
          ></div>

          {/* Light rays */}
          <div className="absolute inset-0 opacity-60">
            <div
              className="absolute top-0 left-1/2 w-0.5 h-2 transform -translate-x-1/2"
              style={{
                background: `linear-gradient(to top, ${colors.primary}, transparent)`,
              }}
            ></div>
            <div
              className="absolute bottom-0 left-1/2 w-0.5 h-2 transform -translate-x-1/2"
              style={{
                background: `linear-gradient(to bottom, ${colors.primary}, transparent)`,
              }}
            ></div>
            <div
              className="absolute left-0 top-1/2 h-0.5 w-2 transform -translate-y-1/2"
              style={{
                background: `linear-gradient(to left, ${colors.primary}, transparent)`,
              }}
            ></div>
            <div
              className="absolute right-0 top-1/2 h-0.5 w-2 transform -translate-y-1/2"
              style={{
                background: `linear-gradient(to right, ${colors.primary}, transparent)`,
              }}
            ></div>
          </div>

          {/* Label */}
          <div className="absolute inset-0 flex items-center justify-center pb-1 flex-col">
            <div className="bg-black/70 text-white text-xs font-semibold px-1 rounded text-center max-w-full truncate">
              <p
                className="text-xs font-light"
                style={{ color: colors.accent }}
              >
                {wavelength} nm
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
