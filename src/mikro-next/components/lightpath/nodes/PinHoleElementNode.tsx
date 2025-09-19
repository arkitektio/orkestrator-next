import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { PinholeElementNode } from "../types";

export default memo(({ data, selected }: NodeProps<PinholeElementNode>) => {
  const diameter = data.diameterUm || 50; // Default diameter in micrometers

  return (
    <>
      <Handles self={data} />
      <div
        className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
        {/* Pinhole aperture with metal plate */}
        <div className="relative w-full h-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 border-2 border-gray-500 shadow-lg rounded-lg">
          {/* Metal plate surface */}
          <div className="absolute inset-1 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded"></div>

          {/* Central pinhole */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className="bg-black rounded-full shadow-inner"
              style={{
                width: `${Math.max(8, Math.min(16, diameter / 10))}px`,
                height: `${Math.max(8, Math.min(16, diameter / 10))}px`,
              }}
            >
              {/* Inner shadow for depth */}
              <div className="absolute inset-0.5 bg-gradient-to-br from-gray-800 to-black rounded-full"></div>
            </div>
          </div>

          {/* Surface scratches and texture */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-2 left-3 w-1/3 h-px bg-gray-300"></div>
            <div className="absolute bottom-3 right-2 w-1/4 h-px bg-gray-300"></div>
          </div>

          {/* Label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg mt-8">
              {data.label || "Pinhole"}
              <div className="text-xs font-light text-gray-300">
                ⌀ {diameter} µm
              </div>
            </div>
          </div>

          {/* Corner highlights for 3D effect */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-tl"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-black/40 rounded-br"></div>
        </div>
      </div>
    </>
  );
});
