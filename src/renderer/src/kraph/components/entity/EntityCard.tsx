import {
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useGetEntityQuery } from "@/kraph/api/graphql";
import { KraphNode } from "@/linkers";

export const EntityCard = ({ id }: { id: string }) => {
  const { data } = useGetEntityQuery({
    variables: {
      id: id,
    },
  });

  return (
    <CardContent>
      {data?.entity?.id && (
        <KraphNode.DetailLink object={{ id: data.entity.id }}>
          <CardTitle>{data?.entity?.category?.label}</CardTitle>
        </KraphNode.DetailLink>
      )}

      <CardDescription>{data?.entity?.label}</CardDescription>
    </CardContent>
  );
};
