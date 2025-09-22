import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { LensElementNode } from "../types";

export default memo(({ data, selected }: NodeProps<LensElementNode>) => {
  return (
    <>
      <Handles self={data} />
      <div
        className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
        {/* Optical lens with curved surfaces */}
        <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border-2 border-blue-400 rounded-full shadow-lg">
          {/* Lens body with optical clarity */}
          <div className="absolute inset-1 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-full border border-blue-200">
            {/* Lens curvature highlight */}
            <div className="absolute top-2 left-2 w-1/3 h-1/3 bg-gradient-to-br from-white/80 to-transparent rounded-full"></div>

            {/* Anti-reflective coating */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-green-100/20 to-blue-100/20 rounded-full"></div>
          </div>

          {/* Lens edge */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-50"></div>

          {/* Focal length indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-blue-900/80 text-white text-xs font-semibold px-2 py-1 rounded">
              f={data.focalLengthMm}mm
            </div>
          </div>

          {/* Light refraction lines */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent transform -rotate-12"></div>
            <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent transform rotate-12"></div>
          </div>
        </div>
      </div>
    </>
  );
});
