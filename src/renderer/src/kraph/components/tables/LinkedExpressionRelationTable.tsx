"use client";

// NOTE: The backend GraphQL schema no longer exposes a paginated
// `entityRelations` query (nor an `EntityRelationFragment`) to list relation
// instances for a given entity category. That concept has been fully removed
// upstream (the closest surviving concept, `MaterializedRelationEdge`,
// describes edges between *categories*, not individual relation instances,
// and has no equivalent left/right entity or metric-map fields), so this
// table has nothing to fetch anymore. Rather than invent new business logic
// around a different backend concept, this component conservatively renders
// an empty-state placeholder. It is not referenced anywhere else in the app.

export type FormValues = {
  metrics?: string[];
  kinds?: string[];
  search?: string | null;
};

export const LinkedExpressionRelationTable = (_props: {
  graph: string;
  linkedExpression?: string;
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground p-8">
      Relation listing is no longer available.
    </div>
  );
};
