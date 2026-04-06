import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { AlpakaProvider } from "@/linkers";
import {
  useGetProviderQuery
} from "../api/graphql";

export type IRepresentationScreenProps = {};

export const TPage = asDetailQueryRoute(
  useGetProviderQuery,
  ({ data, subscribeToMore }) => {
    return (
      <AlpakaProvider.ModelPage
        title={data?.provider?.name}
        object={data.provider}
        pageActions={
          <div className="flex flex-row gap-2">
            <AlpakaProvider.ObjectButton object={data.provider} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <AlpakaProvider.Komments object={data.provider} />,
            }}
          />
        }
      >
        {data.provider.id}
      </AlpakaProvider.ModelPage>
    );
  },
);


export default TPage;
