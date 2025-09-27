import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { MikroInstanceMaskViewLabel } from "@/linkers";
import { useGetInstanceMaskViewLabelQuery } from "../api/graphql";

export type IRepresentationScreenProps = {};

export const dimensionOrder = ["c", "t", "z", "y", "x"];

export default asDetailQueryRoute(
  useGetInstanceMaskViewLabelQuery,
  ({ data, refetch }) => {
    return (
      <MikroInstanceMaskViewLabel.ModelPage
        title={data?.instanceMaskViewLabel?.id}
        object={data?.instanceMaskViewLabel?.id}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <MikroInstanceMaskViewLabel.Komments
                  object={data?.instanceMaskViewLabel?.id}
                />
              ),
            }}
          />
        }
        pageActions={
          <>
            <MikroInstanceMaskViewLabel.ObjectButton
              object={data?.instanceMaskViewLabel?.id}
            />
          </>
        }
        variant="black"
      >
        <div className="grid grid-cols-12 grid-reverse flex-col rounded-md gap-4 mt-2 h-full">
          <div className="absolute w-full h-full overflow-hidden border-0">
            {JSON.stringify(data.instanceMaskViewLabel.values)}
          </div>
        </div>
      </MikroInstanceMaskViewLabel.ModelPage>
    );
  },
);
