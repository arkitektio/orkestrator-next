import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { EditableMechanismGlobal } from "../../lib/modelSerialization";

const emptyGlobal = (): EditableMechanismGlobal => ({
  mechanism: "",
  param: "",
  value: 0,
  description: null,
});

/**
 * Controlled editor for the model-wide `mechanismGlobals` — NEURON GLOBAL
 * variables (e.g. `q10` on `hh`) set once per model. Owns no state.
 */
export const MechanismGlobalsEditor = ({
  value,
  onChange,
}: {
  value: EditableMechanismGlobal[];
  onChange: (globals: EditableMechanismGlobal[]) => void;
}) => {
  const patch = (index: number, update: Partial<EditableMechanismGlobal>) =>
    onChange(value.map((g, i) => (i === index ? { ...g, ...update } : g)));

  return (
    <div className="space-y-2">
      {value.length === 0 && (
        <p className="text-[11px] text-muted-foreground">No global parameters.</p>
      )}
      {value.map((g, i) => (
        <div key={i} className="space-y-1.5 rounded border p-2">
          <div className="flex items-center gap-1">
            <Input
              className="h-7 font-mono"
              placeholder="mechanism (e.g. hh)"
              value={g.mechanism}
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
              placeholder="param (e.g. q10)"
              value={g.param}
              onChange={(e) => patch(i, { param: e.target.value })}
            />
            <Input
              className="h-7"
              type="number"
              placeholder="value"
              value={Number.isFinite(g.value) ? g.value : ""}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                patch(i, { value: Number.isNaN(v) ? 0 : v });
              }}
            />
          </div>
          <Input
            className="h-7"
            placeholder="description (optional)"
            value={g.description ?? ""}
            onChange={(e) => patch(i, { description: e.target.value || null })}
          />
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() => onChange([...value, emptyGlobal()])}
      >
        <Plus className="mr-2 h-3 w-3" />
        Add global parameter
      </Button>
    </div>
  );
};
