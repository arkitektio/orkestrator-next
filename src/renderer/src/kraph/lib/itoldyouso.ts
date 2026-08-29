import { PropertyType, ValueKind } from "@/kraph/api/graphql";

/**
 * Properties are derived, never set: a value reaches an entity as a metric on
 * some structure that measures it, and the category's derivation rule folds
 * those metrics into the property. A hand-entered value is no exception — it is
 * simply the weakest evidence there is, an assertion with no measurement behind
 * it, recorded against an "itoldyouso" structure standing for the entity.
 *
 * The backend materializes that structure and its measurement edge on demand,
 * so recording is a single `assertMetricValue` call.
 */
export const ITOLDYOUSO_IDENTIFIER = "@kraph/itoldyouso";

/** The structure reference a manual edit on `entityId` is recorded against. */
export const itoldyousoRef = (entityId: string) => ({
  identifier: ITOLDYOUSO_IDENTIFIER,
  object: entityId,
});

/**
 * `assertMetricValue` takes a `PropertyType`, which is coarser than the
 * `ValueKind` a property definition is declared with — it names the column the
 * value lands in. Vector kinds other than 3D have no column, so they cannot be
 * asserted by hand.
 */
const PROPERTY_TYPE_BY_VALUE_KIND: Partial<Record<ValueKind, PropertyType>> = {
  [ValueKind.Int]: PropertyType.Integer,
  [ValueKind.Float]: PropertyType.Float,
  [ValueKind.Boolean]: PropertyType.Boolean,
  [ValueKind.Datetime]: PropertyType.Datetime,
  [ValueKind.String]: PropertyType.String,
  [ValueKind.Category]: PropertyType.String,
  [ValueKind.ThreeDVector]: PropertyType.Point_3D,
};

export const propertyTypeForValueKind = (
  kind: ValueKind,
): PropertyType | undefined => PROPERTY_TYPE_BY_VALUE_KIND[kind];

/** Whether a property of this kind can be asserted by hand at all. */
export const isManuallyAssertable = (kind: ValueKind) =>
  propertyTypeForValueKind(kind) !== undefined;

/**
 * Coerce a widget value into the shape the metric column expects. The widgets
 * hand back strings, so an INT property would otherwise be recorded as text.
 */
export const coerceMetricValue = (value: unknown, kind: ValueKind) => {
  switch (kind) {
    case ValueKind.Int: {
      const parsed = typeof value === "number" ? value : parseInt(String(value), 10);
      return Number.isNaN(parsed) ? null : parsed;
    }
    case ValueKind.Float: {
      const parsed = typeof value === "number" ? value : parseFloat(String(value));
      return Number.isNaN(parsed) ? null : parsed;
    }
    case ValueKind.Boolean:
      return value === true || value === "true";
    case ValueKind.Datetime:
      if (value instanceof Date) return value.toISOString();
      return value === null || value === undefined ? null : String(value);
    default:
      return value === null || value === undefined ? null : String(value);
  }
};

/** Build the `AssertMetricValueInput` for asserting `key = value` on an entity. */
export const buildItoldyousoMetric = (args: {
  entityId: string;
  key: string;
  valueKind: ValueKind;
  value: unknown;
  unit?: string | null;
}) => {
  const valueKind = propertyTypeForValueKind(args.valueKind);
  if (!valueKind) {
    throw new Error(
      `${args.valueKind} properties cannot be asserted by hand — they have no metric column.`,
    );
  }
  return {
    ...itoldyousoRef(args.entityId),
    key: args.key,
    value: coerceMetricValue(args.value, args.valueKind),
    valueKind,
    unit: args.unit ?? null,
  };
};
