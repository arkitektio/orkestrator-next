import { ListDependencyFragment, ResolvedDependencyInput, useAgentOptionsLazyQuery } from "@/rekuest/api/graphql";
import { ArgPort, PortGroup } from "@/rekuest/widgets/types";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn, notEmpty } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Badge } from "../ui/badge";
import { FormDescription, FormLabel } from "../ui/form";

export type FilledGroup = PortGroup & {
  filledPorts: ArgPort[];
};

export const portHash = (port: ArgPort[]) => {
  return port
    .map((port) => `${port.key}-${port.kind}-${port.identifier}`)
    .join("-");
};

export const NanaContainer = () => {
  return (
    <div className="grid @lg:grid-cols-2 @lg:grid-cols-2 @xl:grid-cols-3 @2xl:grid-cols-4 @3xl:grid-cols-5 @5xl:grid-cols-6 gap-5">
      {" "}
    </div>
  );
};

export type Option = {
  label: string;
  value: string;
};

export type DependencyFieldProps = {
  dependency: ListDependencyFragment;
};

export const DependencySearchField = ({
  dependency,
}: DependencyFieldProps) => {
  const form = useFormContext();

  const [options, setOptions] = useState<Option[]>([]);
  const [labelCache, setLabelCache] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [search] = useAgentOptionsLazyQuery();

  // Read selected agent IDs from the form's dependencies array
  const getSelectedAgentIds = (): string[] => {
    const deps = (form.getValues("dependencies") as ResolvedDependencyInput[] | undefined) || [];
    const entry = deps.find((d) => d.key === dependency.key);
    return entry?.mappedAgents?.map((ma) => ma.agent) || [];
  };

  // Write selected agent IDs back to the form's dependencies array
  const setSelectedAgentIds = (agentIds: string[]) => {
    const deps = [...((form.getValues("dependencies") as ResolvedDependencyInput[] | undefined) || [])];
    const newDep: ResolvedDependencyInput = {
      key: dependency.key,
      mappedAgents: agentIds.map((id) => ({
        agent: id,
        key: dependency.key,
        mappedActions: [],
      })),
    };
    const existingIndex = deps.findIndex((d) => d.key === dependency.key);
    if (existingIndex >= 0) {
      deps[existingIndex] = newDep;
    } else {
      deps.push(newDep);
    }
    // Remove entries with no agents selected
    const filtered = deps.filter((d) => d.mappedAgents.length > 0);
    form.setValue("dependencies", filtered, { shouldValidate: true });
  };

  const [selectedIds, setSelectedIds] = useState<string[]>(() => getSelectedAgentIds());

  const updateSelection = (agentIds: string[]) => {
    setSelectedIds(agentIds);
    setSelectedAgentIds(agentIds);
  };

  const queryAgents = (searchStr: string) => {
    search({ variables: { search: searchStr, dependency: dependency.id } })
      .then((res) => {
        const opts = (res.data?.options?.filter(notEmpty) || []) as Option[];
        setOptions(opts);
        // Update label cache
        const newCache: Record<string, string> = {};
        opts.forEach((o) => { newCache[o.value] = o.label; });
        setLabelCache((prev) => ({ ...prev, ...newCache }));
        setOpen(true);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setOptions([]);
      });
  };

  // Load initial options + resolve labels for pre-selected agents
  useEffect(() => {
    search({ variables: { search: "", dependency: dependency.id } })
      .then((res) => {
        const opts = (res.data?.options?.filter(notEmpty) || []) as Option[];
        setOptions(opts);
        const newCache: Record<string, string> = {};
        opts.forEach((o) => { newCache[o.value] = o.label; });
        setLabelCache((prev) => ({ ...prev, ...newCache }));
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setOptions([]);
      });

    // Also fetch labels for any pre-selected agents
    const preSelected = getSelectedAgentIds();
    if (preSelected.length > 0) {
      search({ variables: { values: preSelected } })
        .then((res) => {
          const opts = (res.data?.options?.filter(notEmpty) || []) as Option[];
          const newCache: Record<string, string> = {};
          opts.forEach((o) => { newCache[o.value] = o.label; });
          setLabelCache((prev) => ({ ...prev, ...newCache }));
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependency.id]);

  const toggleAgent = (agentId: string) => {
    const newIds = selectedIds.includes(agentId)
      ? selectedIds.filter((id) => id !== agentId)
      : [...selectedIds, agentId];
    updateSelection(newIds);
    setInputValue("");
  };

  const removeAgent = (agentId: string) => {
    updateSelection(selectedIds.filter((id) => id !== agentId));
  };

  return (
    <div className="flex flex-col gap-1.5">
      {dependency.key != null && <FormLabel>{dependency.key}</FormLabel>}
      <Command
        shouldFilter={false}
        className="overflow-visible bg-transparent"
      >
        <div className="group rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-row flex-wrap w-full">
            {selectedIds.length > 0 && (
              <div className="gap-1 flex flex-row flex-wrap p-1">
                {selectedIds.map((id) => (
                  <Badge
                    key={id}
                    onClick={() => removeAgent(id)}
                    className="cursor-pointer"
                  >
                    {labelCache[id] || id}
                  </Badge>
                ))}
              </div>
            )}
            <CommandInput
              ref={inputRef}
              placeholder="Search for an agent..."
              onValueChange={(e) => {
                setInputValue(e);
                queryAgents(e);
              }}
              value={inputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              className="flex-grow"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && (
            <CommandList className="w-full">
              <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandEmpty>No matching agent found</CommandEmpty>
                {error && (
                  <CommandGroup heading="Error">
                    <CommandItem>{error}</CommandItem>
                  </CommandGroup>
                )}
                {options.length > 0 && (
                  <CommandGroup heading="Agents">
                    {options.map((option) => (
                      <CommandItem
                        value={option.value}
                        key={option.value}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => toggleAgent(option.value)}
                      >
                        {option.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedIds.includes(option.value)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </div>
            </CommandList>
          )}
        </div>
      </Command>
      {dependency.description && (
        <FormDescription>{dependency.description}</FormDescription>
      )}
    </div>
  );
};

export type DependencyContainerProps = {
  dependencies: ListDependencyFragment[];
  bound: string;
};

export const DependenciesContainer = ({
  dependencies,
}: DependencyContainerProps) => {
  return (
    <div className="grid overflow-visible gap-4">
      {dependencies.map((dep) => (
        <DependencySearchField dependency={dep} key={dep.key} />
      ))}
    </div>
  );
};
