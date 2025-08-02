/**
 * Demo component showing instance segmentation colormap in action
 */
import React from "react";
import { generateInstanceSegmentationColors } from "@/lib/colormap";

interface ColorSwatchProps {
  color: { r: number; g: number; b: number };
  label: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, label }) => (
  <div className="flex items-center gap-2 p-2 border rounded">
    <div
      className="w-8 h-8 rounded border"
      style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
    />
    <div className="text-sm">
      <div className="font-medium">{label}</div>
      <div className="text-gray-500">
        RGB({color.r}, {color.g}, {color.b})
      </div>
    </div>
  </div>
);

export const InstanceSegmentationColormapDemo: React.FC = () => {
  const numInstances = 8;
  const colors = generateInstanceSegmentationColors(numInstances);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-2">
          Instance Segmentation Colormap Demo
        </h2>
        <p className="text-gray-600 mb-4">
          Demonstrating {numInstances} equidistant colors generated using HSV space
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {colors.map((color, index) => (
          <ColorSwatch
            key={index}
            color={color}
            label={`Instance ${index}`}
          />
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">Usage Example:</h3>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
{`import { generateInstanceSegmentationColors } from "@/lib/utils";

// Generate colors for 8 instances
const colors = generateInstanceSegmentationColors(8);

// Use individual color
const instanceColor = colors[instanceId];

// For masks or overlays
const rgbaColor = \`rgba(\${color.r}, \${color.g}, \${color.b}, 0.7)\`;`}
        </pre>
      </div>
    </div>
  );
};

export default InstanceSegmentationColormapDemo;