import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { OtherSourceElementNode } from "../types";

export default memo(({ data, selected }: NodeProps<OtherSourceElementNode>) => {
  return (
    <>
      <Handles self={data} />
      <div
        className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
        {/* Generic light source - broadband/white light */}
        <div className="relative w-full h-full bg-gradient-to-br from-yellow-200 via-white to-orange-200 border-2 border-orange-400 rounded-full shadow-lg">
          {/* Inner glow effect */}
          <div className="absolute inset-2 bg-gradient-to-br from-white via-yellow-100 to-orange-100 rounded-full"></div>

          {/* Central emission area */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-br from-white via-yellow-200 to-orange-200 rounded-full animate-pulse">
            {/* Hot spot */}
            <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-white rounded-full opacity-80"></div>
          </div>

          {/* Broadband light rays */}
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-0 left-1/2 w-1 h-3 transform -translate-x-1/2 bg-gradient-to-t from-yellow-300 to-transparent"></div>
            <div className="absolute bottom-0 left-1/2 w-1 h-3 transform -translate-x-1/2 bg-gradient-to-b from-yellow-300 to-transparent"></div>
            <div className="absolute left-0 top-1/2 h-1 w-3 transform -translate-y-1/2 bg-gradient-to-l from-yellow-300 to-transparent"></div>
            <div className="absolute right-0 top-1/2 h-1 w-3 transform -translate-y-1/2 bg-gradient-to-r from-yellow-300 to-transparent"></div>

            {/* Diagonal rays */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-gradient-to-br from-orange-300 to-transparent transform rotate-45"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-bl from-orange-300 to-transparent transform -rotate-45"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-gradient-to-tr from-orange-300 to-transparent transform -rotate-45"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-gradient-to-tl from-orange-300 to-transparent transform rotate-45"></div>
          </div>

          {/* Label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg mt-8">
              {data.label || "Source"}
              <div className="text-xs font-light text-yellow-200">
                Broadband
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
