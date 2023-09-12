import React from "react";
import { BsPinAngle, BsPinFill } from "react-icons/bs";
import { useParams } from "react-router";
import { useGetStageQuery, usePinStageMutation } from "../api/graphql";
import TransformationViewCard from "../components/cards/TransformationViewCard";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { MikroImage } from "@/linkers";
import { ListRender } from "@/components/layout/ListRender";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { PinToggle } from "../components/ui/PinToggle";
import { FormSheet } from "@/components/dialog/FormDialog";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { UpdateStageForm } from "../forms/UpdateStageForm";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <></>;

  const { data, refetch } = withMikroNext(useGetStageQuery)({
    variables: {
      id: id,
    },
  });

  const [pinStage] = withMikroNext(usePinStageMutation)();

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
