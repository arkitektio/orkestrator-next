import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  ColumnKind,
  GraphTableQueryFragment,
  ScatterPlotInput,
  useCreateScatterPlotMutation,
  ValueKind
} from "../api/graphql";

const TForm =  (props: { graphQuery: GraphTableQueryFragment }) => {
    const [add] = useCreateScatterPlotMutation();

    const dialog = useGraphQlFormDialog(add);

    // Get numeric columns from the query
    const numericColumns = props.graphQuery.columns.filter(
        (col) =>
            col.valueKind === ValueKind.Float ||
            col.valueKind === ValueKind.Int ||
            col.kind === ColumnKind.Value,
    );

    // Get ID columns
    const idColumns = props.graphQuery.columns.filter(
        (col) => col.kind === ColumnKind.Node || col.kind === ColumnKind.Edge,
    );

    const form = useForm<ScatterPlotInput>({
        defaultValues: {
            label: "New Scatter Plot",
            description: "A scatter plot visualization",
            query: props.graphQuery.id,
            xColumn: numericColumns[0]?.name || "",
            yColumn: numericColumns[1]?.name || numericColumns[0]?.name || "",
            idColumn: idColumns[0]?.name || "id",
        },
    });

    const columnOptions = numericColumns.map((col) => ({
        value: col.key,
        label: col.label
    }));

    const idColumnOptions = idColumns.map((col) => ({
        value: col.key,
        label: col.label
    }));

    const allColumnOptions = props.graphQuery.columns.map((col) => ({
        value: col.key,
        label: col.label
    }));

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(async (data) => {
                    dialog({
                        variables: {
                            input: data,
                        },
                    });
                })}
            >
                <div className="grid grid-cols-1 gap-4 p-4">
                    <StringField
                        label="Name"
                        name="label"
                        description="Name of the scatter plot"
                    />
                    <StringField
                        label="Description"
                        name="description"
                        description="Optional description"
                    />

                    <ChoicesField
                        label="X-Axis Column"
                        name="xColumn"
                        description="Select the column for X-axis"
                        options={columnOptions}
                    />

                    <ChoicesField
                        label="Y-Axis Column"
                        name="yColumn"
                        description="Select the column for Y-axis"
                        options={columnOptions}
                    />

                    <ChoicesField
                        label="ID Column"
                        name="idColumn"
                        description="Select the column to use for point IDs"
                        options={idColumnOptions}
                    />

                    <ChoicesField
                        label="Color Column (Optional)"
                        name="colorColumn"
                        description="Select a column to color points by"
                        options={allColumnOptions}
                    />

                    <ChoicesField
                        label="Size Column (Optional)"
                        name="sizeColumn"
                        description="Select a column to size points by"
                        options={columnOptions}
                    />

                    <ChoicesField
                        label="Shape Column (Optional)"
                        name="shapeColumn"
                        description="Select a column to vary point shapes by"
                        options={allColumnOptions}
                    />
                </div>

                <DialogFooter>
                    <Button type="submit">Create Plot</Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default TForm;
