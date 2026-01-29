import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { OtherElementNode } from "../types";

export default memo(({ data, selected }: NodeProps<OtherElementNode>) => {
  return (
    <>
      <Handles self={data} />
      <div
        className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
        {/* Generic optical element - neutral design */}
        <div className="relative w-full h-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 border-2 border-slate-500 shadow-lg rounded-lg">
          {/* Inner surface */}
          <div className="absolute inset-1 bg-gradient-to-br from-white via-slate-100 to-slate-200 rounded"></div>

          {/* Corner highlights for 3D effect */}
          <div className="absolute top-1 left-1 w-3 h-3 bg-white/60 rounded-tl"></div>
          <div className="absolute bottom-1 right-1 w-3 h-3 bg-black/20 rounded-br"></div>

          {/* Central label area */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-semibold text-slate-700 bg-white/90 px-2 py-1 rounded shadow-sm">
                {data.label || "Element"}
              </div>
            </div>
          </div>

          {/* Subtle decoration pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 right-2 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
            <div className="absolute top-2 bottom-2 left-2 w-px bg-gradient-to-b from-transparent via-slate-400 to-transparent"></div>
            <div className="absolute top-2 bottom-2 right-2 w-px bg-gradient-to-b from-transparent via-slate-400 to-transparent"></div>
          </div>
        </div>
      </div>
    </>
  );
});
