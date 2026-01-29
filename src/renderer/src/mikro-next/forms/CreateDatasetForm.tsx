import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
    CreateDatasetInput,
    useCreateDatasetMutation
} from "../api/graphql";

export const CreateDatasetForm = (props: { parentDatasetId?: string }) => {
    const [createDataset] = useCreateDatasetMutation({
        refetchQueries: ["Children", "GetDatasets"],
    });

    const dialog = useGraphQlFormDialog(createDataset);

    const form = useForm<CreateDatasetInput>({
        defaultValues: {
            name: "New Dataset",
        },
    });

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(async (data) => {
                        dialog({
                            variables: {
                                input: {
                                    name: data.name,
                                    ...(props.parentDatasetId && { parent: props.parentDatasetId }),
                                },
                            },
                        });
                    })}
                >
                    <DialogHeader>
                        <DialogTitle>Create New Dataset</DialogTitle>
                        <DialogDescription>
                            Create a new dataset {props.parentDatasetId ? 'inside the current dataset' : 'in the root level'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-4 py-4">
                        <StringField
                            label="Dataset Name"
                            name="name"
                            description="Enter a name for the new dataset"
                            placeholder="My New Dataset"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit">Create Dataset</Button>
                    </DialogFooter>
                </form>
            </Form>
        </>
    );
};