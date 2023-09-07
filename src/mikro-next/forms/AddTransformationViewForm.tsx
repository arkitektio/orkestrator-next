import { useForm } from "react-hook-form";
import {
  useCreateAffineTransformationViewMutation,
  useStageOptionsLazyQuery,
} from "../api/graphql";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { Form } from "@/components/ui/form";
import { FloatField } from "@/components/fields/FloatField";
import { SearchField } from "@/components/fields/SearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { Button } from "@/components/ui/button";
import {
  useFormDialog,
  useGraphQlFormDialog,
} from "@/components/dialog/FormDialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogFooter } from "@/components/ui/dialog";

export const toAffineMatrix = (data: {
  positionX: number;
  positionY: number;
  positionZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}) => {
  return [
    [data.scaleX, 0, 0, data.positionX],
    [0, data.scaleY, 0, data.positionY],
    [0, 0, data.scaleZ, data.positionZ],
    [0, 0, 0, 1],
  ];
};

export const AddTransformationViewForm = (props: { image: string }) => {
  const [add] = withMikroNext(useCreateAffineTransformationViewMutation)();

  const [searchStage] = withMikroNext(useStageOptionsLazyQuery)();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm({
    defaultValues: {
      stage: undefined,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                image: props.image,
                stage: data.stage,
                affineMatrix: toAffineMatrix(data),
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <GraphQLSearchField
                name="stage"
                label="Stage"
                searchQuery={searchStage}
                description="The stage where this image will be put into"
                placeholder="Creating a new one.."
              />
            </div>

            <div className="col-span-1 flex-col gap-1 flex">
              <h1>Position</h1>
              <div className="text-muted-foreground text-xs mb-2">
                {" "}
                Where is the image located?{" "}
              </div>
              <FloatField
                label="Position X"
                name="positionX"
                description="The x Position (µm)"
              />
              <FloatField
                label="Position Y"
                name="positionY"
                description="The x Position (µm)"
              />
              <FloatField
                label="Position Z"
                name="positionZ"
                description="The x Position (µm)"
              />
            </div>
            <div className="col-span-1 flex-col gap-1 flex">
              <h1>Physical Scale</h1>
              <div className="text-muted-foreground text-xs mb-2">
                {" "}
                How is the image scaled?{" "}
              </div>
              <FloatField
                label="Scale X"
                name="scaleX"
                description="The scale of an X pixel  (µm)"
              />
              <FloatField
                label="Scale Y"
                name="scaleY"
                description="The scale of an X pixel (µm)"
              />
              <FloatField
                label="Scale Z"
                name="scaleZ"
                description="The scale of an X pixel (µm)"
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
