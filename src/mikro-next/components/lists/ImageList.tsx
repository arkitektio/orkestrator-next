import { ListRender } from "@/components/layout/ListRender";
import {
  ImageFilter,
  OffsetPaginationInput,
  useGetImagesQuery,
} from "../../api/graphql";
import ImageCard from "../cards/ImageCard";
import { MikroImage } from "@/linkers";
import { withMikroNext } from "@jhnnsrs/mikro-next";

export type Props = {
  filters?: ImageFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = withMikroNext(
    useGetImagesQuery,
  )({
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
