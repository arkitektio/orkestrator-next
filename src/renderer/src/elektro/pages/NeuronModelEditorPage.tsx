import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ElektroNeuronModel } from "@/linkers";
import { toast } from "sonner";
import { useCreateNeuronModelMutation, useDetailNeuronModelQuery } from "../api/graphql";
import { NeuronEditor } from "../components/NeuronEditor";

export const NeuronModelEditorPage = asDetailQueryRoute(
  useDetailNeuronModelQuery,
  ({ data }) => {
    const [createModel] = useCreateNeuronModelMutation();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSave = async (config: any) => {
      try {
        const result = await createModel({
          variables: {
            input: {
              name: `${data.neuronModel.name} (Edited)`,
              description: `Edited version of ${data.neuronModel.name}`,
              config: config
            }
          }
        });
        toast.success("Model saved successfully!");
        if (result.data?.createNeuronModel?.id) {
          // Navigate to the new model
          // We need to know the route. Assuming standard linker.
          // ElektroNeuronModel.link(result.data.createNeuronModel.id)
          // But linkers usually return a component or string.
          // I'll just reload or stay here.
          // Ideally navigate to the new model page.
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to save model");
      }
    };

    return (
      <ElektroNeuronModel.ModelPage
        variant="black"
        title={`Edit: ${data.neuronModel.name}`}
        object={data.neuronModel}
      >
        <div className="h-full w-full">
          <NeuronEditor initialModel={data.neuronModel} onSave={handleSave} />
        </div>
      </ElektroNeuronModel.ModelPage>
    );
  },
);


export default NeuronModelEditorPage;
