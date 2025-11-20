import { useDialog } from "@/app/dialog";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useUseModelForMutation } from "@/alpaka/api/graphql";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type UseModelForFormData = {
  kind: string;
};

export const UseModelForDialog = (props: { model: string }) => {
  const [useModelFor, { loading }] = useUseModelForMutation();
  const { closeDialog } = useDialog();

  const handleUseModelFor = async (data: UseModelForFormData) => {
    try {
      await useModelFor({
        variables: {
          input: {
            model: props.model,
            kind: data.kind,
          },
        },
      });
      toast.success(`Model set for ${data.kind}`);
      closeDialog();
    } catch (error) {
      toast.error("Failed to set model for use case");
      console.error(error);
    }
  };

  const form = useForm<UseModelForFormData>({
    defaultValues: {
      kind: "image_generation",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUseModelFor)}>
        <DialogHeader>
          <DialogTitle>Use Model For</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <ChoicesField
            name="kind"
            label="Use Case"
            description="Select the use case for this model"
            options={[
              { label: "Image Generation", value: "image_generation" },
              { label: "Text Generation", value: "text_generation" },
              { label: "Embeddings", value: "embeddings" },
            ]}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeDialog}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Setting..." : "Set"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
