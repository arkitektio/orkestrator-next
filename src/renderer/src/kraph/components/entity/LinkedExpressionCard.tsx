import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { KraphNode } from "@/linkers";

// NOTE: `useGetLinkedExpressionQuery`/`usePinLinkedExpressionMutation` and the
// `linkedExpression` query no longer exist on the current backend schema.
// This component has no callers anywhere in the app right now; it's kept
// compiling as a presentational component against a local,
// structurally-equivalent shape until a replacement query is designed
// against the current schema.
export type LinkedExpression = {
  expression: { label: string };
  graph: { id: string };
  entities: { id: string; name: string }[];
};

export const EntityKindCard = ({
  linkedExpression,
}: {
  linkedExpression: LinkedExpression | null | undefined;
}) => {
  return (
    <Card className="p-3">
      <CardContent>
        <CardTitle>{linkedExpression?.expression.label}</CardTitle>

        <CardDescription>{linkedExpression?.graph.id}</CardDescription>

        <CardDescription>
          {linkedExpression?.entities.map((field, i) => (
            <Card key={i}>
              <KraphNode.DetailLink object={{ id: field.id }}>
                {field.name}
              </KraphNode.DetailLink>
            </Card>
          ))}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
