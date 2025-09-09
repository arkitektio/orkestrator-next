import { FormSheet } from "@/components/dialog/FormDialog";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroStage } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useGetStageQuery, usePinStageMutation, WatchTransformationViewsDocument, WatchTransformationViewsSubscription, WatchTransformationViewsSubscriptionVariables } from "../api/graphql";
import { StageRender } from "../components/render/StageRender";
import { PinToggle } from "../components/ui/PinToggle";
import { UpdateStageForm } from "../forms/UpdateStageForm";

export type IRepresentationScreenProps = {};


const Page: React.FC<IRepresentationScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <></>;

  const { data, refetch, subscribeToMore } = useGetStageQuery({
    variables: {
      id: id,
    },
  });


  useEffect(() => {
    const unsubscribe = subscribeToMore<WatchTransformationViewsSubscription, WatchTransformationViewsSubscriptionVariables>({
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

        if (!subscriptionData.data.affineTransformationViews.create) return prev;


        const affineViews = [
          ...(stage.affineViews || []),
          newView,
        ];



        return {
          ...prev,
          stage: {
            ...stage,
            affineViews: affineViews,
          }
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
      actions={<MikroStage.Actions object={id} />}
      object={id}
      title={data?.stage?.name}
    >
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle
            actions={
              <>
                <PinToggle
                  onPin={(e) => {
                    data?.stage.id;
                  }}
                  pinned={data?.stage?.pinned || false}
                />
                <FormSheet trigger={<HobbyKnifeIcon />}>
                  {data?.stage && <UpdateStageForm stage={data?.stage} />}
                </FormSheet>
              </>
            }
          >
            {data?.stage?.name}
          </DetailPaneTitle>
        </DetailPaneHeader>
      </DetailPane>
      <div className="w-full h-full">
        {data?.stage && <StageRender stage={data?.stage} />}
      </div>
    </MikroStage.ModelPage>
  );
};

export default Page;
