import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { MikroEntity, MikroSpecimen } from "@/linkers";
import { useGetEntityQuery } from "@/mikro-next/api/graphql";

export const EntityCard = ({ id }: { id: string }) => {
  const { data } = useGetEntityQuery({
    variables: {
      id: id,
    },
  });

  return (
    <CardContent>
      {data?.entity?.id && (
        <MikroEntity.DetailLink object={data?.entity?.id}>
          <CardTitle>{data?.entity?.kind?.label}</CardTitle>
        </MikroEntity.DetailLink>
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
