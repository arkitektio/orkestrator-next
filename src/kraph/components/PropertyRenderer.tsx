import { MetricKind, PropertyDefinitionFragment } from "@/kraph/api/graphql";
import { Check, X } from "lucide-react";
import Timestamp from "react-timestamp";

export const PropertyRenderer = ({
    value,
    definition,
}: {
    value: string | number | boolean | null | undefined;
    definition: PropertyDefinitionFragment;
}) => {
    if (value === null || value === undefined || value === "") {
        return <span className="text-muted-foreground italic">Empty</span>;
    }

    switch (definition.valueKind) {
        case MetricKind.Boolean:
            return value === "true" || value === true ? (
                <div className="flex items-center gap-1 text-emerald-500">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">True</span>
                </div>
            ) : (
                <div className="flex items-center gap-1 text-rose-500">
                    <X className="h-4 w-4" />
                    <span className="text-sm font-medium">False</span>
                </div>
            );

        case MetricKind.Datetime:
            return (
                <span className="text-sm">
                    <Timestamp date={String(value)} />
                </span>
            );

        case MetricKind.Int:
            return <span className="text-sm font-mono">{value}</span>;

        case MetricKind.Float:
            return <span className="text-sm font-mono">{value}</span>;

        case MetricKind.Category: {
            // If options are available, try to find the label for the value
            const option = definition.options?.find((opt) => opt.value === value);
            return <span className="text-sm">{option?.label || value}</span>;
        }

        case MetricKind.String:
        default:
            return <span className="text-sm">{value}</span>;
    }
};
