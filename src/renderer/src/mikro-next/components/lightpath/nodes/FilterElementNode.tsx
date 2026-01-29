import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { FilterElementNode } from "../types";

export default memo(({ data, selected }: NodeProps<FilterElementNode>) => {
  return (
    <>
      <Handles self={data} />
      <div
        className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
        {/* Optical filter with colored glass appearance */}
        <div className="relative w-full h-full bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 border-2 border-emerald-700 shadow-lg rounded">
          {/* Filter glass surface */}
          <div className="absolute inset-1 bg-gradient-to-br from-emerald-200/80 via-emerald-300/60 to-emerald-500/40 rounded"></div>

          {/* Anti-reflective coating shimmers */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 via-blue-200/20 to-green-200/20 rounded opacity-60"></div>

          {/* Glass surface highlights */}
          <div className="absolute top-1 left-1 w-1/3 h-1/4 bg-gradient-to-br from-white/70 to-transparent rounded-tl"></div>
          <div className="absolute bottom-1 right-1 w-1/4 h-1/3 bg-gradient-to-tl from-emerald-800/30 to-transparent rounded-br"></div>

          {/* Filter type label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg">
              {data.label || "Filter"}
            </div>
          </div>

          {/* Transmission lines indicating filtering */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
            <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
          </div>
        </div>
      </div>
    </>
  );
});
