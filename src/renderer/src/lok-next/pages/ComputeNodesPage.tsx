import { Explainer } from "@/components/explainer/Explainer";
import { LokComputeNode } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useNavigate } from "react-router-dom";
import ComputeNodeList from "../components/lists/ComputeNodeList";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <LokComputeNode.ListPage
      title="Devices"
    >
      <Explainer
        title="Devices"
        description="Devices or virtual machines that provide computational resources within your Arkitekt Federation. Here you see all compute nodes that are registered and available for task execution."
      />
      <ComputeNodeList />

      <Separator />
    </LokComputeNode.ListPage>
  );
};

export default Page;
