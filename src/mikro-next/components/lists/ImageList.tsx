import { ListRender } from "@/components/layout/ListRender";
import { MikroImage } from "@/linkers";
import { useEffect } from "react";
import {
  ImageFilter,
  OffsetPaginationInput,
  useGetImagesQuery,
  WatchImagesDocument,
  WatchImagesSubscription,
  WatchImagesSubscriptionVariables,
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

  useEffect(() => {
    return subscribeToMore<
      WatchImagesSubscription,
      WatchImagesSubscriptionVariables
    >({
      document: WatchImagesDocument,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newImage = subscriptionData.data.images.create;
        if (!newImage) return prev;
        return Object.assign({}, prev, {
          images: [newImage, ...prev.images],
        });
      },
    });
  }, [subscribeToMore]);

  return (
    <ListRender
      array={data?.images}
      title={
        <MikroImage.ListLink className="flex-0">
          Latest Images
        </MikroImage.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ImageCard key={index} image={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
