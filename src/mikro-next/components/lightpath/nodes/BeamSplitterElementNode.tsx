import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { BeamSplitterElementNode } from "../types";

export default memo(
  ({ data, selected }: NodeProps<BeamSplitterElementNode>) => {
    return (
      <>
        <Handles self={data} />
        <div
          className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
        >
          {/* Beam splitter cube with 45-degree split */}
          <div className="relative w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 border-2 border-gray-500 shadow-lg">
            {/* Diagonal split line */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="w-full h-full bg-gradient-to-br from-transparent via-blue-200/30 to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent transform rotate-45 origin-top-left scale-150"></div>
              </div>
            </div>

            {/* Reflection and transmission indicators */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-700 bg-white/80 px-1 rounded">
                  R: {(data.rFraction * 100).toFixed(0)}%
                </div>
                <div className="text-xs font-semibold text-gray-700 bg-white/80 px-1 rounded mt-1">
                  T: {(data.tFraction * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Corner highlights for 3D effect */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-white/50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-black/20"></div>
          </div>
        </div>
      </>
    );
  },
);
