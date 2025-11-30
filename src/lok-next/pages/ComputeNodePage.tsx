import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { LokComputeNode } from "@/linkers";
import { useGetComputeNodeQuery } from "../api/graphql";
import { FormSheet } from "@/components/dialog/FormDialog";
import { Pencil } from "lucide-react";
import { UpdateComputeNodeForm } from "../forms/UpdateComputeNodeForm";
import ClientCard from "../components/cards/ClientCard";
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { Arkitekt } from "@/lib/arkitekt/Arkitekt";

export default asDetailQueryRoute(useGetComputeNodeQuery, ({ data }) => {

  const manifest = Arkitekt.useConnectedManifest()

  return (
    <LokComputeNode.ModelPage
      object={data.computeNode.id}
      actions={<LokComputeNode.Actions object={data?.computeNode?.id} />}
      title={data?.computeNode?.name || "Untitled Compute Node"}
    >
      <div className="grid grid-cols-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl group">
              {data?.computeNode?.name || data.computeNode.nodeId}
              <FormSheet
                trigger={
                  <Pencil className="inline-block ml-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                }
              >
                <UpdateComputeNodeForm computeNode={data?.computeNode} />
              </FormSheet>
            </div>
          </div>
        </div>

      </div>

      <div className="border-b border-seperator my-2 mx-4" />
      {manifest && manifest.node_id === data.computeNode.nodeId && (
        <div className="col-span-4 p-6 text-sm text-green-600 font-medium">
          This is the current compute node you are connected to.
        </div>
      )}

      <div className="col-span-4 p-6">
        {data?.computeNode?.nodeId}
      </div>
      <ContainerGrid>
        {data.computeNode.clients.map(c =>
          <ClientCard key={c.id} item={c} />
        )



        }
      </ContainerGrid>
    </LokComputeNode.ModelPage>
  );
});
