import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { EditableCompartment } from "../../lib/modelSerialization";

type EditableSectionParam = EditableCompartment["sectionParams"][number];

const emptyParam = (): EditableSectionParam => ({
  mechanism: "",
  param: "",
  description: null,
  distribution: { value: 0 },
});

/**
 * Controlled editor for a compartment's `sectionParams` (mechanism-specific
 * parameters). Only the uniform `distribution.value` is edited here — LINEAR /
 * EXPRESSION distributions are not surfaced (the fragment reads only `value`).
 */
export const SectionParamsEditor = ({
  value,
  onChange,
}: {
  value: EditableSectionParam[];
  onChange: (params: EditableSectionParam[]) => void;
}) => {
  const patch = (index: number, update: Partial<EditableSectionParam>) =>
    onChange(value.map((p, i) => (i === index ? { ...p, ...update } : p)));

  return (
    <div className="space-y-2">
      {value.length === 0 && (
        <p className="text-[11px] text-muted-foreground">No section parameters.</p>
      )}
      {value.map((p, i) => (
        <div key={i} className="space-y-1.5 rounded border p-2">
          <div className="flex items-center gap-1">
            <Input
              className="h-7 font-mono"
              placeholder="mechanism"
              value={p.mechanism}
              onChange={(e) => patch(i, { mechanism: e.target.value })}
            />
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 flex-none p-0 text-muted-foreground"
              title="Remove parameter"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <Input
              className="h-7 font-mono"
              placeholder="param"
              value={p.param}
              onChange={(e) => patch(i, { param: e.target.value })}
            />
            <Input
              className="h-7"
              type="number"
              placeholder="value"
              value={p.distribution.value ?? ""}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                patch(i, { distribution: { ...p.distribution, value: Number.isNaN(v) ? null : v } });
              }}
            />
          </div>
          <Input
            className="h-7"
            placeholder="description (optional)"
            value={p.description ?? ""}
            onChange={(e) => patch(i, { description: e.target.value || null })}
          />
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() => onChange([...value, emptyParam()])}
      >
        <Plus className="mr-2 h-3 w-3" />
        Add section parameter
      </Button>
    </div>
  );
};
