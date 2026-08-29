import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import {
  AssignableTermFragment,
  TermKind,
  useCreateTermMutation,
  useSearchAssignableTermsQuery,
} from "@/kraph/api/graphql";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type TermAssignerProps = {
  /** Which sort of word to assign. A term's identity is (kind, key). */
  kind: TermKind;
  /** The chosen word's key, or null when nothing is chosen yet. */
  value: string | null;
  onChange: (key: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

/** Which graphs draw a word, phrased for someone about to use it. */
const declaredBy = (term: AssignableTermFragment) => {
  if (term.categories.length === 0) {
    return "no graph draws this word yet";
  }
  return term.categories
    .map((category) => category.graph.name)
    .join(", ");
};

/**
 * Picks the organization's word for something, and coins it if it does not
 * exist yet.
 *
 * Claims name a word, not a category row, so this is the control every claim
 * starts with. It shows which graphs declare each word, because that is what
 * decides whether the claim will be *drawn* anywhere — and a word nobody
 * declares is still a legitimate choice, just an invisible one for now.
 *
 * The kind is a prop rather than a separate query per kind: a term's identity
 * is (kind, key), so "AIS" as an entity and "AIS" as a relation are different
 * words and a picker only ever wants one of them.
 */
export const TermAssigner = ({
  kind,
  value,
  onChange,
  placeholder = "Search or type a new word…",
  disabled,
  className,
}: TermAssignerProps) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  // The list is rendered in flow rather than floating: this lives in a
  // scrolling sidebar, where an absolutely positioned dropdown gets clipped.
  const { data, loading } = useSearchAssignableTermsQuery({
    variables: { search: debouncedSearch || undefined, kinds: [kind] },
    skip: !!value,
    fetchPolicy: "cache-and-network",
  });

  const [createTerm, { loading: coining }] = useCreateTermMutation();

  const terms = data?.terms ?? [];
  const typed = search.trim();
  // Only offer to coin a word that is not already one. The search is fuzzy, so
  // an exact key match has to be checked rather than inferred from emptiness.
  const canCoin =
    typed.length > 0 && !terms.some((term) => term.key === typed) && !loading;

  const choose = (key: string) => {
    onChange(key);
    setSearch("");
  };

  const coin = async () => {
    try {
      const created = await createTerm({
        variables: { input: { kind, key: typed } },
      });
      const key = created.data?.createTerm.key;
      if (key) choose(key);
    } catch (e) {
      toast.error(`Could not coin “${typed}”: ${(e as Error).message}`);
    }
  };

  if (value) {
    return (
      <div className={cn("flex flex-row items-center gap-2", className)}>
        <Badge variant="secondary" className="px-2 py-1 text-sm">
          {value}
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          disabled={disabled}
          onClick={() => onChange(null)}
          aria-label="Clear the chosen word"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Input
        value={search}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Command shouldFilter={false} className="border">
        <CommandList className="max-h-56">
          {loading && terms.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Searching…
            </div>
          ) : null}

          {!loading && terms.length === 0 && !canCoin ? (
            <CommandEmpty>No words match.</CommandEmpty>
          ) : null}

          {terms.length > 0 && (
            <CommandGroup heading="Words">
              {terms.map((term) => (
                <CommandItem
                  key={term.id}
                  value={term.key}
                  onSelect={() => choose(term.key)}
                  className="flex flex-col items-start gap-0.5"
                >
                  <span className="font-medium">{term.label || term.key}</span>
                  <span className="text-xs text-muted-foreground">
                    {declaredBy(term)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {canCoin && (
            <CommandGroup heading="New word">
              <CommandItem
                value={`__coin__${typed}`}
                disabled={coining}
                onSelect={coin}
              >
                <Plus className="mr-2 h-3.5 w-3.5" />
                {coining ? "Coining…" : `Claim the new word “${typed}”`}
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default TermAssigner;
