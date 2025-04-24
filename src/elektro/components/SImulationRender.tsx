import { useEffect, useState } from "react";
import { DetailSimulationFragment, DetailTraceFragment, RecordingFragment, RecordingKind } from "../api/graphql";
import { Plot, useTraceArray } from "../lib/useTraceArray";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, CartesianGrid, XAxis, AreaChart } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;



const useValuesForSimulation = (
  simulation: DetailSimulationFragment
): {
  values: { [key: string]: number }[];
  loading: boolean;
} => {
  const { renderView } = useTraceArray();
  const [values, setValues] = useState<{ [key: string]: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const render = async () => {
    if (simulation) {
      Promise.all(
        [...simulation.recordings.map((recording: RecordingFragment) => {
          return renderView(recording.trace, 0);
        }), renderView(simulation.timeTrace, 0)]
      ).then((data) => {

        const values = data.map((x) => ({})) ;

        simulation.recordings.forEach((recording: RecordingFragment, recordIndex: number) => {
          const array = data[recordIndex];

          array.forEach((value, index) => {
            values[index] = {
              ...values[index],
              [recording.label]: value,
            };
          }
          );
        });


        const timeTrace = data[data.length - 1];
        timeTrace.forEach((value, index) => {
          values[index] = {
            ...values[index],
            ["t"]: value,
          };
        });
        setValues(values);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (simulation) {
      render();
    }
  }, [simulation]);

  return { values, loading };
}


export const SimulationRender = (props: { simulation: DetailSimulationFragment }) => {
  
  const {loading, values} = useValuesForSimulation(props.simulation);

  
  if (loading) {
    return (
      <Card className="p-3">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Loading simulation data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  

  return (
    <Card className="p-3">
      {values.length}
      <ChartContainer config={chartConfig}>
        <AreaChart
          data={values}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey={"t"} tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          {props.simulation.recordings.map( record =>  <Area
            dataKey={record.label}
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
          />)})
        </AreaChart>
      </ChartContainer>
    </Card>
  );
};
