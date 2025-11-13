import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
    DetailComputeNodeFragment,
    UpdateComputeNodeMutationVariables,
    useUpdateComputeNodeMutation,
} from "../api/graphql";

export const UpdateComputeNodeForm = (props: {
    computeNode: Partial<DetailComputeNodeFragment>;
}) => {
    const [updateComputeNode] = useUpdateComputeNodeMutation();

    const update = useGraphQlFormDialog(updateComputeNode);

    const form = useForm<UpdateComputeNodeMutationVariables["input"]>({
        defaultValues: {
            id: props.computeNode.id,
            name: props.computeNode.name ?? "",
        },
    });

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(async (data) => {
                        return await update({
                            variables: {
                                input: data,
                            },
                        });
                    })}
                >
                    <div className="grid grid-cols-2 gap-2 w-full">
                        <div className="col-span-2 flex-col gap-1 flex">
                            <StringField
                                label="Name"
                                name="name"
                                description="The name of the compute node."
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-2">
                        <Button type="submit">Update</Button>
                    </DialogFooter>
                </form>
            </Form>
        </>
    );
};
