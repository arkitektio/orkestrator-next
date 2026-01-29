import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { SampleElementNode } from "../types";

export default memo(({ data, selected }: NodeProps<SampleElementNode>) => {
  return (
    <>
      <Handles self={data} />
      <div
        className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
        {/* Sample/Specimen with slide and coverslip */}
        <div className="relative w-full h-full bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 border-2 border-amber-600 shadow-lg rounded rounded-md overflow-hidden">
          {/* Glass slide */}
          <div className="absolute inset-1 bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-200 opacity-90">
            {/* Sample area */}
            <div className="absolute inset-4 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 border border-purple-300 rounded-sm">
              {/* Sample texture/pattern */}
              <div
                className="w-full h-full opacity-40"
                style={{
                  backgroundImage: `
                       radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.3) 2px, transparent 2px),
                       radial-gradient(circle at 70% 30%, rgba(236, 72, 153, 0.3) 1px, transparent 1px),
                       radial-gradient(circle at 50% 70%, rgba(59, 130, 246, 0.3) 1.5px, transparent 1.5px)
                     `,
                  backgroundSize: "12px 12px, 8px 8px, 10px 10px",
                }}
              ></div>
            </div>
          </div>

          {/* Coverslip highlight */}
          <div className="absolute top-1 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

          {/* Glass edge reflections */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300/50 via-white/60 to-blue-300/50"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300/50 via-gray-400/60 to-blue-300/50"></div>

          {/* Label */}
          <div className="absolute inset-0 flex items-center justify-center pb-1">
            <div className="bg-white/90 text-purple-800 text-xs font-semibold px-2 py-1 rounded border border-purple-300 shadow">
              {data.label}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
