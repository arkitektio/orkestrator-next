import { createSubscribingList } from "@/components/layout/createSubscribingList";
import { MikroImage } from "@/linkers";
import {
  useGetImagesQuery,
  WatchImagesDocument
} from "../../api/graphql";
import ImageCard from "../cards/ImageCard";


const ImageList = createSubscribingList(
  {
    useHook: useGetImagesQuery,
    dataKey: "images",
    ItemComponent: ImageCard,
    subscriptionDocument: WatchImagesDocument,
    subscriptionDataKey: "watchImages",
    title: "Images",
    smart: MikroImage,
  }
)


export default ImageList;
