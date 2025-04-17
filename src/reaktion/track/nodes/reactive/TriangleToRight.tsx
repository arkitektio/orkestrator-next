import { Card, CardHeader } from "@/components/ui/card";
import { ShapeProps } from "../ReactiveWidget";

export default ({ data, implementation }: ShapeProps) => {
    return (
      <>
        <svg height="40" width="40">
        <polygon
          points="0,40 40,20 0,0"
          style={{
            strokeWidth: 1,
            stroke: "hsl(var(--accent))",
            fill: "hsl(var(--accent))",
          }}
        />
        <text>{implementation}</text>
      </svg>
      </>
    );
  };