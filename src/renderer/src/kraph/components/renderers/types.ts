/**
 * What survived `DelegatingNodeViewRenderer`.
 *
 * That component switched on `NodeQueryFragment.__typename` to pick between the
 * pairs, path and table renderers. Eight of the nine saved-query kinds were
 * removed from the schema — they had types and mutations but no execution path
 * anywhere — so the only branch left was the table, and a switch with one case is
 * just the case. The pairs and path renderers went with it: one was already a
 * "not available" stub, the other had no fetch hook at all.
 *
 * `ViewOptions` is the part three live renderers actually shared, so it lives
 * here rather than in a file named for a component that no longer exists.
 */
export type ViewOptions = {
  minimal: boolean;
};
