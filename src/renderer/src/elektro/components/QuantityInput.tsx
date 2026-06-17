import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import {
  DIMENSIONS,
  Dimension,
  formatQuantity,
  parseQuantity,
} from "../lib/quantities";

export interface QuantityInputProps {
  /** Wire value, e.g. "100 ms". `null` / "" renders an empty magnitude. */
  value: string | null | undefined;
  /** Called with the re-serialized wire string on every magnitude/unit change. */
  onChange: (next: string) => void;
  /** Physical dimension — drives the unit dropdown and the default unit. */
  dimension: Dimension;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * A pint-like quantity editor: a numeric magnitude input paired with a unit
 * selector. Parses the incoming wire string ("100 ms") into a magnitude (100)
 * and unit ("ms") for display, and re-serializes to the wire format whenever
 * either part changes. Controlled — owns no value state itself.
 */
export const QuantityInput = ({
  value,
  onChange,
  dimension,
  placeholder,
  className,
  disabled,
}: QuantityInputProps) => {
  const def = DIMENSIONS[dimension];
  const { magnitude, unit } = parseQuantity(value, dimension);

  // Preserve an unexpected server unit by surfacing it as an extra option rather
  // than silently snapping it to a preset.
  const units = useMemo(() => {
    if (def.units.some((u) => u.symbol === unit)) return def.units;
    return [...def.units, { symbol: unit, toBase: NaN }];
  }, [def.units, unit]);

  const emit = (nextMagnitude: number | null, nextUnit: string) => {
    if (nextMagnitude == null) {
      onChange("");
      return;
    }
    onChange(formatQuantity(nextMagnitude, nextUnit));
  };

  return (
    <InputGroup className={cn("h-7", className)}>
      <InputGroupInput
        type="number"
        inputMode="decimal"
        placeholder={placeholder ?? "Value"}
        value={magnitude ?? ""}
        disabled={disabled}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            emit(null, unit);
            return;
          }
          const parsed = parseFloat(raw);
          if (!Number.isNaN(parsed)) emit(parsed, unit);
        }}
      />
      <InputGroupAddon align="inline-end" className="p-0">
        <Select
          value={unit}
          disabled={disabled}
          onValueChange={(nextUnit) => emit(magnitude ?? 0, nextUnit)}
        >
          <SelectTrigger
            size="sm"
            className="h-6 border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u.symbol} value={u.symbol}>
                {u.symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default QuantityInput;
