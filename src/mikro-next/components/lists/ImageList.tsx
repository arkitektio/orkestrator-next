import { ListRender } from "@/components/layout/ListRender";
import { MikroImage } from "@/linkers";
import { useEffect } from "react";
import {
  ImageFilter,
  OffsetPaginationInput,
  Ordering,
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
    variables: { filters, pagination, order: { createdAt: Ordering.Desc } },
  });

  useEffect(() => {
    return subscribeToMore<
      WatchImagesSubscription,
      WatchImagesSubscriptionVariables
    >({
      document: WatchImagesDocument,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        if (subscriptionData.data.images.update) {
          const updatedImage = subscriptionData.data.images.update;
          console.log("updatedImage", updatedImage);
          return Object.assign({}, prev, {
            images: prev.images.map((image) =>
              image.id === updatedImage.id
                ? { ...updatedImage, retrigger: true }
                : image,
            ),
          });
        } else if (subscriptionData.data.images.delete) {
          const deletedImage = subscriptionData.data.images.delete;
          return Object.assign({}, prev, {
            images: prev.images.filter((image) => image.id !== deletedImage),
          });
        } else if (subscriptionData.data.images.create) {
          const newImage = subscriptionData.data.images.create;
          return Object.assign({}, prev, {
            images: [newImage, ...prev.images],
          });
        }
        return prev;
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
      actions={<MikroImage.NewButton minimal />}
      refetch={refetch}
    >
      {(ex, index) => <ImageCard key={ex.id} image={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
