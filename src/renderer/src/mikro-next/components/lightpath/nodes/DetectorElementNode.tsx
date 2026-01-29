import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { DetectorElementNode } from "../types";

export default memo(({ data, selected }: NodeProps<DetectorElementNode>) => {
  return (
    <>
      <Handles self={data} />
      <div
        className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
        {/* General photodetector with photodiode-like appearance */}
        <div className="relative w-full h-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 border-2 border-slate-500 shadow-lg rounded-lg">
          {/* Active detection area */}
          <div className="absolute inset-2 bg-gradient-to-br from-purple-900 via-indigo-800 to-slate-900 border border-purple-600 rounded">
            {/* Photosensitive surface pattern */}
            <div className="absolute inset-1 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded"></div>

            {/* Central detection zone */}
            <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full"></div>
          </div>

          {/* Signal indicator */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>

          {/* Electrical contacts */}
          <div className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-t"></div>
          <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-b"></div>

          {/* Label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 text-amber-300 text-xs font-semibold px-2 py-1 rounded border border-amber-500">
              {data.label}
              {data.nepdWPerSqrtHz && (
                <div className="text-xs font-light">
                  NEPD {data.nepdWPerSqrtHz} W/√Hz
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
