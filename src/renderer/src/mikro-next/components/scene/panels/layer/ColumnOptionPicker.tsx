import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  useMeshColorByOptionsLazyQuery,
  useMeshFilterByOptionsLazyQuery,
} from "@/mikro-next/api/graphql";
import { isMeasure, optionKey, optionLabel, type ColumnOption } from "./columnOptions";

/**
 * The "+" that turns a mesh collection's OFFERED columns into a stored colouring
 * or filter rule.
 *
 * `colorByOptions` and `filterByOptions` return the same candidate set under two
 * names, so this component is written once and takes which one to ask as a
 * prop: the shapes are identical (`ColumnOption`), and both pickers branch on
 * the same `control` split. Asking under the right name still matters — it is
 * the server's own invariant that everything `filterByOptions` returns is
 * something `createMeshLayer(filterBys:)` accepts.
 *
 * Both lazy hooks are declared unconditionally (hooks rules) and neither fires
 * until the popover opens: an options walk crosses the coordinate graph, so it
 * is not something a layer card should pay for on mount.
 *
 * Search is SERVER-side (`filters.search` matches the column's name, its
 * longName and its table's name), hence `shouldFilter={false}` — cmdk's own
 * filter would additionally hide rows the server deliberately returned.
 */

const SEARCH_DEBOUNCE_MS = 200;

export type ColumnOptionPickerMode = "color" | "filter";

export const ColumnOptionPicker = ({
  meshCollection,
  mode,
  taken,
  onPick,
  title,
}: {
  meshCollection: string;
  mode: ColumnOptionPickerMode;
  /** `optionKey`s already stored on the layer — offered, but marked as added. */
  taken: ReadonlySet<string>;
  onPick: (option: ColumnOption) => void;
  title?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [runColorBy, colorByResult] = useMeshColorByOptionsLazyQuery();
  const [runFilterBy, filterByResult] = useMeshFilterByOptionsLazyQuery();

  const run = mode === "color" ? runColorBy : runFilterBy;
  const result = mode === "color" ? colorByResult : filterByResult;

  const fetchOptions = useCallback(
    (term: string) => {
      void run({
        variables: {
          meshCollection,
          filters: term.trim() ? { search: term.trim() } : undefined,
        },
      }).catch((error) => {
        console.warn("[mesh] could not load column options:", error);
      });
    },
    [meshCollection, run],
  );

  // Fetch on open, then on every settled search term. Debounced because the
  // walk is server-side work, not a filter over something already in hand.
  useEffect(() => {
    if (!open) return;
    const handle = window.setTimeout(() => fetchOptions(search), search ? SEARCH_DEBOUNCE_MS : 0);
    return () => window.clearTimeout(handle);
  }, [open, search, fetchOptions]);

  // Memoized because the `?? []` would otherwise mint a new array every render
  // and re-run the grouping below for nothing.
  const options = useMemo(
    () => (result.data?.options ?? []) as ColumnOption[],
    [result.data],
  );

  /** Grouped by the table the value is READ FROM — the option's own `table`. */
  const groups = useMemo(() => {
    const byTable = new Map<string, { name: string; options: ColumnOption[] }>();
    for (const option of options) {
      const group = byTable.get(option.table.id) ?? { name: option.table.name, options: [] };
      group.options.push(option);
      byTable.set(option.table.id, group);
    }
    return [...byTable.values()];
  }, [options]);

  const empty = !result.loading && options.length === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={title ?? (mode === "color" ? "Add a colouring" : "Add a filter rule")}
          className="flex h-5 shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 text-[9px] font-medium uppercase tracking-[0.06em] text-white/50 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white/90"
        >
          <Plus className="h-2.5 w-2.5" />
          add
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={mode === "color" ? "Search a column to colour by…" : "Search a column to filter by…"}
            className="h-8 text-xs"
          />
          <CommandList>
            {result.loading && (
              <div className="px-3 py-2 text-[10px] text-muted-foreground">Loading columns…</div>
            )}
            {empty && (
              <CommandEmpty className="px-3 py-2 text-[10px]">
                {search
                  ? "No column matches."
                  : "This collection's ids reach no table worth colouring by."}
              </CommandEmpty>
            )}
            {groups.map((group) => (
              <CommandGroup key={group.name} heading={group.name}>
                {group.options.map((option) => {
                  const key = optionKey(option);
                  const added = taken.has(key);
                  return (
                    <CommandItem
                      key={key}
                      value={key}
                      onSelect={() => {
                        if (added) return;
                        onPick(option);
                        setOpen(false);
                      }}
                      className="gap-2 text-xs"
                      disabled={added}
                    >
                      <span className="flex-1 truncate">
                        {optionLabel(option)}
                        {option.column.unit ? (
                          <span className="ml-1 text-[9px] text-muted-foreground">
                            {String(option.column.unit)}
                          </span>
                        ) : null}
                      </span>
                      {/* A joined candidate is reached through a `references`
                          hop; say so, because the same column name can be
                          reachable both directly and through a hop. */}
                      {option.joinPath.length > 0 && (
                        <span
                          className="flex shrink-0 items-center text-[9px] text-muted-foreground"
                          title={`via ${option.joinPath
                            .map((step) => `${step.table.name}.${step.column.name}`)
                            .join(" → ")}`}
                        >
                          <ChevronRight className="h-2.5 w-2.5" />
                          joined
                        </span>
                      )}
                      <span className="shrink-0 rounded bg-white/5 px-1 text-[9px] text-muted-foreground">
                        {isMeasure(option) ? "measure" : "categorical"}
                      </span>
                      {added && <Check className="h-3 w-3 shrink-0" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
