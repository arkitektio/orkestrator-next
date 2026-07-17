import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { DateTimeRangePicker } from "@/components/ui/date-time-range-picker";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@uidotdev/usehooks";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpWideNarrow,
  RotateCcw,
  Shapes,
} from "lucide-react";
import {
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { useMemo } from "react";
import {
  ADatasetFilter,
  ADatasetOrder,
  ADatasetSpec,
  Ordering,
} from "../../api/graphql";
import { ADATASET_SPEC_BY_SLUG, ADATASET_SPECS } from "../../specs";

const SORT_FIELDS = ["createdAt", "name", "id"] as const;
const SORT_FIELD_LABELS: Record<(typeof SORT_FIELDS)[number], string> = {
  createdAt: "Date created",
  name: "Name",
  id: "ID",
};

const SPEC_SLUGS = ADATASET_SPECS.map((entry) => entry.slug) as [
  string,
  ...string[],
];

export type UseADatasetFilterBarOptions = {
  /**
   * A spec the page itself is about — the one behind /adatasets/spec/:spec. It
   * is always applied and cannot be unticked; the picker still offers the rest,
   * because specs stack (VOLUME + TIMESERIES is a 3D timelapse).
   */
  lockedSpec?: ADatasetSpec;
};

/**
 * The filter set shared by every array-dataset list: search, sort, created-range
 * and spec. Returns the assembled query variables together with the controls to
 * drop into a ListPage's `pageActions`, so a page wires it in three lines rather
 * than restating ~90 lines of dropdowns (which is how the Sort block already
 * ended up copied across three pages).
 *
 * State lives in the URL (nuqs), so a filtered list is shareable — same idiom as
 * elektro's SimulationsPage.
 *
 * No user filter: ADatasetFilter.owner takes the creator's *sub*, while lok's
 * UserOptions yields user ids, so the shared UserFilter would filter on the
 * wrong key.
 */
export const useADatasetFilterBar = ({
  lockedSpec,
}: UseADatasetFilterBarOptions = {}) => {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );
  const [createdAfter, setCreatedAfter] = useQueryState(
    "after",
    parseAsIsoDateTime,
  );
  const [createdBefore, setCreatedBefore] = useQueryState(
    "before",
    parseAsIsoDateTime,
  );
  const [sortField, setSortField] = useQueryState(
    "sort",
    parseAsStringLiteral(SORT_FIELDS).withDefault("createdAt"),
  );
  const [sortDirection, setSortDirection] = useQueryState(
    "dir",
    parseAsStringLiteral(["ASC", "DESC"] as const).withDefault("DESC"),
  );
  const [specSlugs, setSpecSlugs] = useQueryState(
    "spec",
    parseAsArrayOf(parseAsStringLiteral(SPEC_SLUGS)).withDefault([]),
  );

  // Debounced so a keystroke does not refetch: the list refetches whenever
  // `filters` changes identity.
  const debouncedSearch = useDebounce(search.trim(), 400);

  // Unknown slugs (a hand-edited URL) drop out rather than reaching the server.
  const picked = useMemo(
    () =>
      specSlugs
        .map((slug) => ADATASET_SPEC_BY_SLUG[slug])
        .filter((entry) => entry !== undefined),
    [specSlugs],
  );

  const dir = sortDirection === "ASC" ? Ordering.Asc : Ordering.Desc;
  const isCustomOrder = sortField !== "createdAt" || sortDirection !== "DESC";

  const filters: ADatasetFilter = useMemo(() => {
    const specs = [
      ...new Set([
        ...(lockedSpec ? [lockedSpec] : []),
        ...picked.map((entry) => entry.spec),
      ]),
    ];

    return {
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(createdAfter ? { createdAfter: createdAfter.toISOString() } : {}),
      ...(createdBefore ? { createdBefore: createdBefore.toISOString() } : {}),
      ...(specs.length ? { spec: specs } : {}),
    };
  }, [debouncedSearch, createdAfter, createdBefore, picked, lockedSpec]);

  const ordering: ADatasetOrder[] = useMemo(() => {
    if (sortField === "name") return [{ name: dir }];
    if (sortField === "id") return [{ id: dir }];
    return [{ createdAt: dir }];
  }, [sortField, dir]);

  const toggleSpec = (slug: string, checked: boolean) => {
    const next = checked
      ? [...specSlugs, slug]
      : specSlugs.filter((entry) => entry !== slug);
    setSpecSlugs(next.length ? next : null);
  };

  const spatial = ADATASET_SPECS.filter((entry) => entry.kind === "spatial");
  const modifiers = ADATASET_SPECS.filter((entry) => entry.kind === "modifier");

  const specItem = (slug: string, label: string, spec: ADatasetSpec) => {
    const locked = lockedSpec === spec;
    return (
      <DropdownMenuCheckboxItem
        key={slug}
        checked={locked || specSlugs.includes(slug)}
        disabled={locked}
        onCheckedChange={(checked) => toggleSpec(slug, checked)}
        onSelect={(event) => event.preventDefault()}
      >
        {label}
        {locked && (
          <span className="ml-auto text-[10px] text-muted-foreground">
            this page
          </span>
        )}
      </DropdownMenuCheckboxItem>
    );
  };

  const actions = (
    <>
      <CollapsibleSearch
        value={search}
        onChange={(value) => setSearch(value || null)}
        placeholder="Search array datasets…"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Shapes className="h-4 w-4" />
            Spec
            {picked.length > 0 && (
              <Badge variant="secondary">{picked.length}</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {/* Spatial specs are mutually exclusive server-side — ticking two
              matches nothing — so they are offered as their own group. */}
          <DropdownMenuLabel>Spatial (pick one)</DropdownMenuLabel>
          {spatial.map((entry) => specItem(entry.slug, entry.label, entry.spec))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Acquisition</DropdownMenuLabel>
          {modifiers.map((entry) =>
            specItem(entry.slug, entry.label, entry.spec),
          )}
          {picked.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setSpecSlugs(null)}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sort
            {isCustomOrder && (
              <Badge variant="secondary" className="gap-1">
                {SORT_FIELD_LABELS[sortField]}
                {sortDirection === "ASC" ? (
                  <ArrowUpWideNarrow />
                ) : (
                  <ArrowDownWideNarrow />
                )}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={sortField}
            onValueChange={(value) =>
              setSortField(value as (typeof SORT_FIELDS)[number])
            }
          >
            {SORT_FIELDS.map((field) => (
              <DropdownMenuRadioItem key={field} value={field}>
                {SORT_FIELD_LABELS[field]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Direction</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={sortDirection}
            onValueChange={(value) => setSortDirection(value as "ASC" | "DESC")}
          >
            <DropdownMenuRadioItem value="DESC">
              Descending
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ASC">Ascending</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DateTimeRangePicker
        initialDateFrom={createdAfter || undefined}
        initialDateTo={createdBefore || undefined}
        onUpdate={({ range }) => {
          setCreatedAfter(range.from || null);
          setCreatedBefore(range.to || null);
        }}
      />
    </>
  );

  return { filters, ordering, actions };
};
