import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { KraphEntity, MikroSpecimen } from "@/linkers";
import { useGetEntityQuery } from "@/kraph/api/graphql";

export const EntityCard = ({ id }: { id: string }) => {
  const { data } = useGetEntityQuery({
    variables: {
      id: id,
    },
  });

  return (
    <CardContent>
      {data?.entity?.id && (
        <KraphEntity.DetailLink object={data?.entity?.id}>
          <CardTitle>{data?.entity?.kind?.label}</CardTitle>
        </KraphEntity.DetailLink>
      )}

      <CardDescription>{data?.entity?.name}</CardDescription>

      <CardDescription>
        {data?.entity.specimens && data?.entity?.specimens?.length > 0 && (
          <CardTitle>Specimens</CardTitle>
        )}
        {data?.entity?.specimens.map((field, i) => (
          <Card key={i}>
            <MikroSpecimen.DetailLink object={field.id}>
              {field.id}
            </MikroSpecimen.DetailLink>
          </Card>
        ))}
      </CardDescription>
    </CardContent>
  );
};
