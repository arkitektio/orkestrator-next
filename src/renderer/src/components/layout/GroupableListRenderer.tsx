import * as ListLayout from "@/components/ui/list-layout";
import React from "react";

export type GroupMeta = {
  id: string;
  title: React.ReactNode;
  count: number;
};

/**
 * A typed "group by" definition for a list of `T`. Reusable across any
 * `createList`-based list via `GroupableListRenderer` / the `groupBy` prop.
 */
export type GroupByDef<T> = {
  /** Stable option id — also used as the selector's query-state value. */
  key: string;
  /** Human label shown in the "Group by" selector. */
  label: string;
  /** Items sharing a group id are rendered together. */
  getGroupId: (item: T) => string;
  /** The section title for a group, given its id and a representative item. */
  getGroupTitle: (id: string, item: T) => React.ReactNode;
  /** Optional ordering of groups; default keeps first-seen (data) order. */
  compareGroups?: (a: GroupMeta, b: GroupMeta) => number;
};

export type GroupableListRendererProps<T> = {
  items: T[];
  groupBy?: GroupByDef<T>;
  ItemComponent: React.ComponentType<{ item: T } & any>;
  cardProps?: Record<string, any>;
};

type Group<T> = { id: string; title: React.ReactNode; items: T[] };

/**
 * Renders a list either as a single flat grid (no `groupBy`) or split into
 * titled sections (with `groupBy`). Grouping is client-side over the items it is
 * given — so with a paginated list it groups the currently loaded page.
 */
export function GroupableListRenderer<T extends { id?: string | number }>({
  items,
  groupBy,
  ItemComponent,
  cardProps,
}: GroupableListRendererProps<T>) {
  if (!groupBy) {
    return (
      <ListLayout.Grid>
        {items.map((item, index) => (
          <ItemComponent key={item.id ?? index} item={item} {...cardProps} />
        ))}
      </ListLayout.Grid>
    );
  }

  // Reduce into groups, preserving first-seen order (so a createdAt-desc list
  // yields date groups newest-first without extra sorting).
  const order: string[] = [];
  const byId = new Map<string, Group<T>>();
  items.forEach((item) => {
    const id = groupBy.getGroupId(item);
    let group = byId.get(id);
    if (!group) {
      group = { id, title: groupBy.getGroupTitle(id, item), items: [] };
      byId.set(id, group);
      order.push(id);
    }
    group.items.push(item);
  });

  let groups = order.map((id) => byId.get(id)!);
  if (groupBy.compareGroups) {
    const compare = groupBy.compareGroups;
    groups = [...groups].sort((a, b) =>
      compare(
        { id: a.id, title: a.title, count: a.items.length },
        { id: b.id, title: b.title, count: b.items.length },
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-2">
          <div className="flex items-center gap-2 ml-1 text-sm font-medium text-muted-foreground">
            <span className="truncate">{group.title}</span>
            <span className="text-xs tabular-nums">{group.items.length}</span>
          </div>
          <ListLayout.Grid>
            {group.items.map((item, index) => (
              <ItemComponent
                key={item.id ?? index}
                item={item}
                {...cardProps}
              />
            ))}
          </ListLayout.Grid>
        </div>
      ))}
    </div>
  );
}

export default GroupableListRenderer;
