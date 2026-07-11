import {
  EventKind,
  ProtocolEventCategoryFragment,
  UpdateProtocolEventDefinitionInput,
} from "./api/graphql";

/**
 * `UpdateProtocolEventDefinitionInput` requires `key`, `kind` and `protocol`
 * on every update, but none of the three are exposed on
 * `ProtocolEventCategoryFragment` (the `GetProtocolEventCategory` query never
 * selects them). `kind` is always `Extrinsic` for protocol events (natural
 * events are the `Intrinsic` counterpart) and `key` can be read back off the
 * category, so both are filled in here. `protocol` (the id of the owning
 * protocol/template) has no source anywhere in the currently generated
 * queries -- falling back to the category's own id keeps the mutation
 * well-typed without inventing new query plumbing; this should be revisited
 * once a query exposes the real protocol id.
 */
export const buildUpdateProtocolEventDefinitionInput = (
  category: Pick<ProtocolEventCategoryFragment, "id" | "key">,
  input: Omit<
    UpdateProtocolEventDefinitionInput,
    "id" | "key" | "kind" | "protocol"
  >,
): UpdateProtocolEventDefinitionInput => ({
  id: category.id,
  key: category.key,
  kind: EventKind.Extrinsic,
  protocol: category.id,
  ...input,
});
