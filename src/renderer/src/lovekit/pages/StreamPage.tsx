import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { LovekitStream } from "@/linkers";
import { useGetStreamQuery } from "../api/graphql";

export default asDetailQueryRoute(
  useGetStreamQuery,
  ({ data, subscribeToMore }) => {
    return (
      <LovekitStream.ModelPage
        title={data?.stream.id}
        object={data.stream.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <LovekitStream.ObjectButton object={data.stream.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <LovekitStream.Komments object={data.stream.id} />,
            }}
          />
        }
      >
        {data.stream.id}
      </LovekitStream.ModelPage>
    );
  },
);
