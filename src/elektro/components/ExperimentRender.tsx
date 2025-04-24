import { useEffect, useState } from "react";
import { DetailSimulationFragment, DetailTraceFragment, ExperimentFragment, RecordingFragment, RecordingKind } from "../api/graphql";
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
import { Area, CartesianGrid, XAxis, AreaChart, LineChart, Line } from "recharts";
import { ElektroRecording, ElektroSimulation } from "@/linkers";
import { cn } from "@/lib/utils";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const viewToLabel = (view: any) => view.label || view.recording?.label || view.stimulus?.label || view.id;

const getColorFromView = (view: {id: string}) => {
  const hue = (parseInt(view.id) * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};



const useValuesForExperiment = (
  experiment: ExperimentFragment
): {
  values: { [key: string]: number }[];
  loading: boolean;
} => {
  const { renderView } = useTraceArray();
  const [values, setValues] = useState<{ [key: string]: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const render = async () => {
    if (experiment) {
      Promise.all(
        [...experiment.views.map((view) => {
          if (view.stimulus) {
            return renderView(view.stimulus.trace, 0);
          }
          if (view.recording) {
            return renderView(view.recording.trace, 0);
          }
          return Promise.resolve([]);
        })]
      ).then((data) => {

        const values = data.map((x) => ({})) ;

        experiment.views.forEach((view, recordIndex: number) => {
          const array = data[recordIndex];

          array.forEach((value, index) => {
            values[index] = {
              ...values[index],
              [viewToLabel(view)]: value,
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
    if (experiment) {
      render();
    }
  }, [experiment]);

  return { values, loading };
}


export const ExperimentRender = (props: { experiment: ExperimentFragment }) => {
  
  const {loading, values} = useValuesForExperiment(props.experiment);
  const [hidden, setHidden ] = useState<string[]>([]);
  
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
      <ChartContainer config={chartConfig}>
        <LineChart
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
          {props.experiment.views.filter((view) => !hidden.includes(view.id)).map( (view, index) =>  <Line
            dataKey={viewToLabel(view)}
            type="natural"
            stroke={getColorFromView(view)}
            fillOpacity={0.4}
            strokeWidth={2}
            dot={false}
          />)})
        </LineChart>
      </ChartContainer>
      <CardFooter>
        <div className="flex flex-row gap-2  mt-2">
        {props.experiment.views.map((view, index) => (
          <div className={cn("px-2 flex-1 cursor-pointer", hidden.includes(view.id) && "opacity-20")} key={index} onClick={() => {
            setHidden(prev => {
              return prev.find((x) => x === view.id) ? prev.filter((x) => x !== view.id) : [...prev, view.id]
            })
          }}>
            <div className="flex flex-row gap-2 my-auto">
              <div
      
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getColorFromView(view) }}
              />
              <div className="text-sm text-muted-foreground my-auto">
                {viewToLabel(view)}
              </div>
              <div className="text-sm text-muted-foreground my-auto">
              <ElektroRecording.DetailLink object={view.recording?.id || view.stimulus?.id || "null"} key={index} style={{ color: getColorFromView(index) }}>

Open
</ElektroRecording.DetailLink>
</div>
            </div>
            </div>
          
        ))}
        </div>
      </CardFooter>
    </Card>
  );
};
