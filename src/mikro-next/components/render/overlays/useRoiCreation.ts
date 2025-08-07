import {
  GetImageDocument,
  useCreateRoiMutation,
  GetImageQuery,
} from "@/mikro-next/api/graphql";

export const useRoiCreation = (imageId: string) => {
  const [createRoi] = useCreateRoiMutation({
    update: (cache, { data }) => {
      if (data?.createRoi) {
        // Read the current cache for the image
        const existingImage = cache.readQuery<GetImageQuery>({
          query: GetImageDocument,
          variables: { id: imageId },
        });

        if (existingImage?.image) {
          // Update the cache by adding the new ROI to the rois array
          cache.writeQuery({
            query: GetImageDocument,
            variables: { id: imageId },
            data: {
              image: {
                ...existingImage.image,
                rois: [...existingImage.image.rois, data.createRoi],
              },
            },
          });
        }
      }
    },
  });

  return createRoi;
};
