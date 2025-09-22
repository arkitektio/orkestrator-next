import { ListRender } from "@/components/layout/ListRender";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { OmeroArkDataset } from "@/linkers";
import { Komments } from "@/lok-next/components/komments/Komments";
import React from "react";
import { useParams } from "react-router";
import { useGetDatasetQuery } from "../api/graphql";
import ImageCard from "../components/cards/ImageCard";
import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";

export type IRepresentationScreenProps = {};

const Page = asDetailQueryRoute(useGetDatasetQuery, ({ data }) => {


  return (
    <OmeroArkDataset.ModelPage
      object={data.dataset.id}
      title={data?.dataset?.name}
    >
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle actions={<></>}>
            {data?.dataset?.name}
          </DetailPaneTitle>
        </DetailPaneHeader>
        <div className="flex flex-col p-3 rounded rounded-md mt-2 mb-2">
          <div className="font-light mt-2 ">Created At</div>
          <div className="font-light mt-2 ">Created by</div>

          <div className="font-light mt-2 ">Tags</div>
          <div className="text-xl flex mb-2">
            {data?.dataset?.tags?.map((tag, index) => (
              <>
                <span className="font-semibold mr-2">#{tag} </span>
              </>
            ))}
          </div>
        </div>
        <ListRender title="Contained Images" array={data?.dataset?.images}>
          {(item, index) => <ImageCard image={item} key={index} />}
        </ListRender>
      </DetailPane>
    </OmeroArkDataset.ModelPage>
  );
});

export default Page;
