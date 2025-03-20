import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroHistogramView } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { HistogramViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { c } from "node_modules/@udecode/plate-emoji/dist/IndexSearch-Dvqq913n";

interface Props {
  view: HistogramViewFragment;
  mates?: MateFinder[];
}

const histogramViewToChartData = (view: HistogramViewFragment) => {
  return view.histogram.map((count, i) => ({
    bin: view.bins[i],
    count,
  }));
};

const chartConfig = {
  bin: {
    label: "Bin",
  },
  count: {
    label: "Count",
  },
};

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroHistogramView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            <p className="font-bold text-xs">
              {view.id && (
                <MikroHistogramView.DetailLink object={view.id}>
                  Histogram
                </MikroHistogramView.DetailLink>
              )}
              <div className="w-full h-[80px] mt-2">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[80px] max-h-[80px] w-full"
                >
                  <LineChart
                    accessibilityLayer
                    data={histogramViewToChartData(view)}
                  >
                    <XAxis
                      dataKey="bin"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={2}
                    />
                    <Line
                      dataKey="count"
                      type="natural"
                      stroke="hsl(var(--primary))"
                      strokeWidth={1}
                      dot={false}
                      activeDot={false}
                    ></Line>

                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ChartContainer>
              </div>
            </p>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroHistogramView.Smart>
  );
};

export default TheCard;
