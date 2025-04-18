import { Card, CardHeader } from "@/components/ui/card";
import { ShapeProps } from "../ReactiveWidget";

export default ({ data, implementation }: ShapeProps) => {
    return (
      <>
        <Card className="rounded-md border-blue-400/40 shadow-blue-400/20 dark:border-blue-300 dark:shadow-blue/20 shadow-xl">
          <CardHeader className="p-1">
            {implementation} <pre>{data.constantsMap.value}</pre>
          </CardHeader>
        </Card>
      </>
    );
  };