import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card } from "@/components/ui/card";
import { RekuestMemoryShelve } from "@/linkers";
import {
  useMemoryShelveQuery
} from "@/rekuest/api/graphql";
import { BellIcon } from "lucide-react";


export default asDetailQueryRoute(
  useMemoryShelveQuery,
  ({ data, refetch, subscribeToMore }) => {

    return (
      <RekuestMemoryShelve.ModelPage
        title={data.memoryShelve.name}
        object={data.memoryShelve.id}
        sidebars={
          <MultiSidebar
            map={{
              Comments: <RekuestMemoryShelve.Komments object={data?.memoryShelve?.id} />,
            }}
          />
        }
      >


        <div className="p-6 mt-2">
          {data.memoryShelve.drawers.map((d) => (
            <Card>
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                  <BellIcon className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
                  <p className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
                    {d.label} {d.resourceId}
                  </p>
                </div>
              </div>
            </Card>
          ))}

        </div>
      </RekuestMemoryShelve.ModelPage>
    );
  },
);
