import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { LokComputeNode } from "@/linkers";
import { useGetComputeNodeQuery } from "../api/graphql";
import { FormSheet } from "@/components/dialog/FormDialog";
import { Pencil } from "lucide-react";
import { UpdateComputeNodeForm } from "../forms/UpdateComputeNodeForm";

export default asDetailQueryRoute(useGetComputeNodeQuery, ({ data }) => {


  return (
    <LokComputeNode.ModelPage
      object={data.computeNode.id}
      actions={<LokComputeNode.Actions object={data?.computeNode?.id} />}
      title={data?.computeNode?.name || "Untitled Compute Node"}
      sidebars={<LokComputeNode.Komments object={data?.computeNode?.id} />}
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
        <div className="col-span-2">
        </div>
      </div>
    </LokComputeNode.ModelPage>
  );
});
