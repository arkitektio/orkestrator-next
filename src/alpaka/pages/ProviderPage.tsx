import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { AlpakaProvider } from "@/linkers";
import {
  useGetProviderQuery
} from "../api/graphql";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useGetProviderQuery,
  ({ data, subscribeToMore }) => {
    return (
      <AlpakaProvider.ModelPage
        title={data?.provider?.name}
        object={data.provider.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <AlpakaProvider.ObjectButton object={data.provider.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <AlpakaProvider.Komments object={data.provider.id} />,
            }}
          />
        }
      >
        {data.provider.id}
      </AlpakaProvider.ModelPage>
    );
  },
);
