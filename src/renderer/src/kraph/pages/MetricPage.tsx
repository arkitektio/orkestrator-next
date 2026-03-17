import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import {
  KraphEntity,
  KraphMetric
} from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useGetMetricQuery } from "../api/graphql";
import { useKraphMediaUpload } from "@/datalayer/hooks/useKraphMediaUpload";

export default asDetailQueryRoute(useGetMetricQuery, ({ data, refetch }) => {
  const uploadFile = useKraphMediaUpload();

  return (
    <KraphMetric.ModelPage
      object={data.metric.id}
      title={data?.metric.category.label}
      sidebars={
        <MultiSidebar
          map={{ Comments: <KraphMetric.Komments object={data.metric.id} /> }}
        />
      }
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormSheet trigger={<HobbyKnifeIcon />}>Not implemented</FormSheet>
          </>
        </div>
      }
    >
      <KraphEntity.Drop
        object={data.metric.id}
        className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6"
      >
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data.metric.category.label}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground"></p>
          <p className="mt-3 text-xl text-muted-foreground">
            <Badge>{data.metric.category.label}</Badge>
          </p>
        </div>
      </KraphEntity.Drop>
      {data.metric.value}
    </KraphMetric.ModelPage>
  );
});
