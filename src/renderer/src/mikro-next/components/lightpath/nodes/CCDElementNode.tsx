import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { CCDElementNode, DetectorElementNode } from "../types";

export default memo(({ data, selected }: NodeProps<CCDElementNode>) => {
  return (
    <>
      <Handles self={data} />
      <div
        className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
        {/* CCD/Camera detector with pixel grid */}
        <div className="relative w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-black border-2 border-gray-600 shadow-lg">
          {/* Active sensor area */}
          <div className="absolute inset-2 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 border border-blue-600">
            {/* Pixel grid pattern */}
            <div
              className="w-full h-full opacity-30"
              style={{
                backgroundImage: `
                       linear-gradient(to right, #ffffff 1px, transparent 1px),
                       linear-gradient(to bottom, #ffffff 1px, transparent 1px)
                     `,
                backgroundSize: "8px 8px",
              }}
            ></div>
          </div>

          {/* Active indicator */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>

          {/* Readout circuits */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></div>
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-yellow-500 via-orange-500 to-red-500"></div>

          {/* Label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 text-green-300 text-xs font-semibold px-2 py-1 rounded border border-green-500">
              {data.label}{" "}
              {data.pixelSizeUm && `, Pixel ${data.pixelSizeUm} µm`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
