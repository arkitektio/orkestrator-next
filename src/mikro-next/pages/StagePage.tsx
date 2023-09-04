import React from "react";
import { BsPinAngle, BsPinFill } from "react-icons/bs";
import { useParams } from "react-router";
import { useGetStageQuery, usePinStageMutation } from "../api/graphql";
import TransformationViewCard from "../components/cards/TransformationViewCard";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { PageLayout } from "@/components/layout/PageLayout";
import { MikroImage } from "@/linkers";
import { ListRender } from "@/components/layout/ListRender";

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
    <PageLayout actions={<MikroImage.Actions id={id} />}>
      <div className="p-3 @container">
        <div className="text-xl font-semibold text-white flex flex-row">
          {data?.stage?.id}
          <div className="flex-grow"></div>
          <div className="flex">
            {data?.stage?.id && (
              <button
                type="button"
                onClick={() =>
                  pinStage({
                    variables: {
                      id: data?.stage?.id,
                      pin: !data?.stage?.pinned || false,
                    },
                  })
                }
              >
                {data?.stage?.pinned ? <BsPinFill /> : <BsPinAngle />}
              </button>
            )}
          </div>
        </div>
        <ListRender array={data?.stage?.views}>
          {(view, index) => (
            <>
              {view.__typename == "TransformationView" && (
                <TransformationViewCard view={view} key={index} />
              )}
            </>
          )}
        </ListRender>
      </div>
    </PageLayout>
  );
};

export default Page;
