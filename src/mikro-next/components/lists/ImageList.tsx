import { ListRender } from "@/components/layout/ListRender";
import { MikroImage } from "@/linkers";
import {
  ImageFilter,
  OffsetPaginationInput,
  useGetImagesQuery,
} from "../../api/graphql";
import ImageCard from "../cards/ImageCard";

export type Props = {
  filters?: ImageFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useGetImagesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.images}
      title={
        <MikroImage.ListLink className="flex-0">Images</MikroImage.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ImageCard key={index} image={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
