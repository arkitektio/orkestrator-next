import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { MirrorElementNode } from "../types";

export default memo(({ data, selected }: NodeProps<MirrorElementNode>) => {
  return (
    <>
      <Handles self={data} />
      <div
        className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
        {/* Mirror with metallic surface and reflection */}
        <div className="relative w-full h-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-2 border-gray-700 shadow-xl transform skew-y-2">
          {/* Reflective surface */}
          <div className="absolute inset-1 bg-gradient-to-br from-white via-gray-100 to-gray-300 opacity-90"></div>

          {/* Reflection highlights */}
          <div className="absolute top-1 left-1 w-1/3 h-1/4 bg-gradient-to-br from-white/70 to-transparent"></div>
          <div className="absolute bottom-1 right-1 w-1/4 h-1/3 bg-gradient-to-tl from-gray-500/30 to-transparent"></div>

          {/* Angle indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
              {data.angleDeg}°
            </div>
          </div>

          {/* Mirror frame edges */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800"></div>
        </div>
      </div>
    </>
  );
});
