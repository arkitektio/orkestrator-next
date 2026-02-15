import { useDialog } from "@/app/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    EntityCategoryFragment,
    ValueKind as MetricKind,
    useUpdateEntityCategoryMutation,
} from "@/kraph/api/graphql";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { useState } from "react";

type PropertyOption = {
    label: string;
    value: string;
    description?: string;
};

export type FormData = {
    key: string;
    label: string;
    description?: string;
    valueKind: MetricKind;
    optional: boolean;
    default?: string;
    options?: PropertyOption[];
};

export const AddPropertyDefinitionDialog = (props: {
    category: EntityCategoryFragment;
}) => {
    const { closeDialog } = useDialog();
    const [options, setOptions] = useState<PropertyOption[]>([]);
    const [newOptionLabel, setNewOptionLabel] = useState("");
    const [newOptionValue, setNewOptionValue] = useState("");
    const [newOptionDescription, setNewOptionDescription] = useState("");

    const form = useForm<FormData>({
        defaultValues: {
            key: "",
            label: "",
            description: "",
            valueKind: MetricKind.String,
            optional: true,
            default: "",
            options: [],
        },
    });

    const [updateEntityCategory, { loading }] = useUpdateEntityCategoryMutation({
        onCompleted: () => {
            toast.success("Property definition added successfully");
            closeDialog();
        },
        onError: (error) => {
            toast.error(`Failed to add property definition: ${error.message}`);
        },
    });

    const addOption = () => {
        if (newOptionLabel && newOptionValue) {
            setOptions([
                ...options,
                {
                    label: newOptionLabel,
                    value: newOptionValue,
                    description: newOptionDescription || undefined,
                },
            ]);
            setNewOptionLabel("");
            setNewOptionValue("");
            setNewOptionDescription("");
        }
    };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FormData) => {
        const existingPropertyDefinitions =
            props.category.propertyDefinitions?.map((pd) => ({
                key: pd.key,
                label: pd.label,
                description: pd.description,
                valueKind: pd.valueKind,
                optional: pd.optional,
                default: pd.default,
                options: pd.options?.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                    description: opt.description,
                })),
            })) || [];

        const newPropertyDefinition = {
            key: data.key,
            label: data.label || data.key,
            description: data.description,
            valueKind: data.valueKind,
            optional: data.optional,
            default: data.default || null,
            options: options.length > 0 ? options : null,
        };

        await updateEntityCategory({
            variables: {
                input: {
                    id: props.category.id,
                    propertyDefinitions: [
                        ...existingPropertyDefinitions,
                        newPropertyDefinition,
                    ],
                },
            },
            refetchQueries: ["EntityNodes", "GetEntity"],
        });
    };

    const valueKind = form.watch("valueKind");

    return (
        <div className="space-y-4 p-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Add Property Definition</h2>
                <p className="text-sm text-muted-foreground">
                    Add a new property definition to {props.category.label}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="key">Key *</Label>
                        <Input
                            id="key"
                            {...form.register("key", { required: true })}
                            placeholder="e.g., temperature"
                        />
                        <p className="text-xs text-muted-foreground">
                            The unique identifier for this property (used in code)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="label">Label</Label>
                        <Input
                            id="label"
                            {...form.register("label")}
                            placeholder="e.g., Temperature"
                        />
                        <p className="text-xs text-muted-foreground">
                            Human-readable name (defaults to key if empty)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...form.register("description")}
                            placeholder="Describe what this property represents..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="valueKind">Value Type *</Label>
                        <Select
                            value={form.watch("valueKind")}
                            onValueChange={(value) =>
                                form.setValue("valueKind", value as MetricKind)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select value type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={MetricKind.String}>String</SelectItem>
                                <SelectItem value={MetricKind.Int}>Integer</SelectItem>
                                <SelectItem value={MetricKind.Float}>Float</SelectItem>
                                <SelectItem value={MetricKind.Boolean}>Boolean</SelectItem>
                                <SelectItem value={MetricKind.Datetime}>DateTime</SelectItem>
                                <SelectItem value={MetricKind.Category}>Category</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="default">Default Value</Label>
                        <Input
                            id="default"
                            {...form.register("default")}
                            placeholder="Optional default value"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="optional"
                            checked={form.watch("optional")}
                            onCheckedChange={(checked) => form.setValue("optional", checked)}
                        />
                        <Label htmlFor="optional">Optional Property</Label>
                    </div>

                    {(valueKind === MetricKind.Category || valueKind === MetricKind.String) && (
                        <div className="space-y-2 border rounded-lg p-4">
                            <Label>Options (for dropdown/select)</Label>
                            <p className="text-xs text-muted-foreground mb-2">
                                Add predefined options for this property
                            </p>

                            {options.length > 0 && (
                                <div className="space-y-2 mb-3">
                                    {options.map((option, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 p-2 border rounded bg-muted"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{option.label}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Value: {option.value}
                                                </div>
                                                {option.description && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {option.description}
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeOption(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Input
                                    placeholder="Option Label"
                                    value={newOptionLabel}
                                    onChange={(e) => setNewOptionLabel(e.target.value)}
                                />
                                <Input
                                    placeholder="Option Value"
                                    value={newOptionValue}
                                    onChange={(e) => setNewOptionValue(e.target.value)}
                                />
                                <Input
                                    placeholder="Option Description (optional)"
                                    value={newOptionDescription}
                                    onChange={(e) => setNewOptionDescription(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addOption}
                                    disabled={!newOptionLabel || !newOptionValue}
                                    className="w-full"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Option
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? "Adding..." : "Add Property"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => closeDialog()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
