import { useRegisterDashboardWidget } from "../hooks";
import { ImageIcon, Loader2 } from "lucide-react";
import {
  useListImagesQuery,
  Ordering,
} from "@/mikro-next/api/graphql";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroImage } from "@/linkers";
import { ResponsiveContainerGrid } from "@/components/layout/ContainerGrid";
import { Card } from "@/components/ui/card";

const LatestImagesWidget = () => {
  const resolve = useResolve();
  const { data, loading } = useListImagesQuery({
    variables: {
      pagination: { limit: 8 },
      order: { createdAt: Ordering.Desc },
    },
    fetchPolicy: "cache-and-network",
  });

  const images = data?.images ?? [];

  return (
    <div className="flex flex-col h-full">
      {loading && images.length === 0 ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : images.length === 0 ? (
        <p className="text-xs text-muted-foreground">No images yet</p>
      ) : (
        <ResponsiveContainerGrid className="nchild:1">
            {images.map((img) => (
              <MikroImage.Smart key={img.id} object={img}>
                <MikroImage.DetailLink
                  object={img}
                  className={() => "block cursor-pointer group"}
                >
                  <Card className="relative aspect-square rounded-md overflow-hidden bg-muted ">
                    {img.latestSnapshot?.store.presignedUrl ? (
                      <Image
                        src={resolve(img.latestSnapshot.store.presignedUrl)}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[9px] text-white truncate">
                        {img.name}
                      </p>
                    </div>
                  </Card>
                </MikroImage.DetailLink>
              </MikroImage.Smart>
            ))}
        </ResponsiveContainerGrid>
      )}
    </div>
  );
};

export const LatestImagesDashboardWidget = () => {
  useRegisterDashboardWidget({
    key: "latest-images",
    label: "Latest Images",
    module: "mikro",
    icon: <ImageIcon className="w-3 h-3" />,
    component: () => <LatestImagesWidget />,
    defaultSize: "2x2",
    defaultWidth: 50,
    defaultHeight: 100,
  });

  return null;
};
