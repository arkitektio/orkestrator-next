import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { ObjectiveElementNode } from "../types";

export default memo(({ data, selected }: NodeProps<ObjectiveElementNode>) => {
  return (
    <>
      <Handles self={data} />
      <div
        className={`h-full w-full relative ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
        {/* Objective lens with multiple lens elements */}
        <div className="relative w-full h-full justify-center items-center flex">
          <div className="relative w-full h-[60%] bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 border-2 border-gray-600 rounded-lg shadow-lg">
            {/* Lens body */}
            <div className="absolute inset-1 bg-gradient-to-br from-gray-100 via-white to-gray-200 rounded">
              {/* Multiple lens elements */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4/5 h-1 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 rounded-full opacity-80"></div>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 rounded-full opacity-80"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 rounded-full opacity-80"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-1 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 rounded-full opacity-80"></div>
            </div>

            {/* Threaded mount */}
            <div className="absolute left-0 top-0 w-full h-full">
              <div
                className="w-full h-full opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                       0deg,
                       transparent,
                       transparent 2px,
                       #666 2px,
                       #666 3px
                     )`,
                }}
              ></div>
            </div>

            {/* Magnification indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/80 text-white text-xs font-bold px-2 py-1 rounded border-2 border-blue-400">
                {data.magnification}
                {data.numericalAperture &&
                  `, NA ${data.numericalAperture.toFixed(2)}`}
                {data.workingDistanceMm && `, WD ${data.workingDistanceMm}mm`}
                {data.manufacturer} {data.model}
              </div>
              <div className="absolute bottom-1 right-1 text-[8px] text-gray-600 italic"></div>
            </div>

            {/* Front lens highlight */}
            <div className="absolute top-1 left-1 w-1/4 h-1/4 bg-gradient-to-br from-white/60 to-transparent rounded"></div>
          </div>
        </div>
      </div>
    </>
  );
});
