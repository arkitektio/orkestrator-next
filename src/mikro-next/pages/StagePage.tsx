import { FormSheet } from "@/components/dialog/FormDialog";
import {
  DetailPane,
  DetailPaneContent,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroStage } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import {
  useGetStageQuery,
  usePinStageMutation,
  WatchTransformationViewsDocument,
  WatchTransformationViewsSubscription,
  WatchTransformationViewsSubscriptionVariables,
} from "../api/graphql";
import { StageRender } from "../components/render/StageRender";
import { PinToggle } from "../components/ui/PinToggle";
import { UpdateStageForm } from "../forms/UpdateStageForm";
import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";

export type IRepresentationScreenProps = {};

const Page = asDetailQueryRoute(
  useGetStageQuery,
  ({ data, refetch, subscribeToMore, id }) => {
    useEffect(() => {
      const unsubscribe = subscribeToMore<
        WatchTransformationViewsSubscription,
        WatchTransformationViewsSubscriptionVariables
      >({
        document: WatchTransformationViewsDocument,
        variables: { stage: id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const stage = prev.stage;
          if (!stage) return prev;
          if (!stage.affineViews) {
            stage.affineViews = [];
          }

          let newView = subscriptionData.data.affineTransformationViews.create;

          if (!subscriptionData.data.affineTransformationViews.create)
            return prev;

          const affineViews = [...(stage.affineViews || []), newView];

          return {
            ...prev,
            stage: {
              ...stage,
              affineViews: affineViews,
            },
          };
        },
      });

      return () => {
        unsubscribe();
      };
    }, [id, subscribeToMore]);

    const [pinStage] = usePinStageMutation();

    return (
      <MikroStage.ModelPage
        variant={"black"}
        actions={<MikroStage.Actions object={id} />}
        object={id}
        title={data?.stage?.name}
      >


        <div className="w-full h-full">
          {data?.stage && <StageRender stage={data?.stage} />}
        </div>
        <DetailPane className="w-full absolute w-[200px] top-3 left-3 @container p-2 bg-black bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 z-100 overflow-hidden flex flex-col h-max-[400px]">
          <DetailPaneHeader>
            <DetailPaneTitle
              actions={
                <>
                  <PinToggle
                    onPin={(e) => {
                      data?.stage.id &&
                        pinImage({
                          variables: {
                            id: data?.stage.id,
                            pin: e,
                          },
                        });
                    }}
                    pinned={data?.stage?.pinned || false}
                  />
                </>
              }
              className="group "
            >
              {data?.stage?.name}
            </DetailPaneTitle>
          </DetailPaneHeader>

          <DetailPaneContent className="flex flex-col">
            {data?.stage?.name}
          </DetailPaneContent>
        </DetailPane>
      </MikroStage.ModelPage>
    );
  },
);

export default Page;
