import { FormSheet } from "@/components/dialog/FormDialog";
import { ListRender } from "@/components/layout/ListRender";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroImage } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import React from "react";
import { useParams } from "react-router";
import { useGetStageQuery, usePinStageMutation } from "../api/graphql";
import TransformationViewCard from "../components/cards/TransformationViewCard";
import { PinToggle } from "../components/ui/PinToggle";
import { UpdateStageForm } from "../forms/UpdateStageForm";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <></>;

  const { data, refetch } = useGetStageQuery({
    variables: {
      id: id,
    },
  });

  const [pinStage] = usePinStageMutation();

  return (
    <ModelPageLayout
      actions={<MikroImage.Actions id={id} />}
      identifier="@mikro/image"
      object={id}
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
        <ListRender array={data?.stage?.affineViews}>
          {(view, index) => (
            <>
              {view.__typename == "AffineTransformationView" && (
                <TransformationViewCard view={view} key={index} />
              )}
            </>
          )}
        </ListRender>
      </DetailPane>
    </ModelPageLayout>
  );
};

export default Page;
