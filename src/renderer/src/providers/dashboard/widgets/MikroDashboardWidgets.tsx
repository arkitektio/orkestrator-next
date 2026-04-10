import { useRegisterDashboardWidget } from "../hooks";
import { ImageIcon, Loader2 } from "lucide-react";
import {
  useHomePageQuery as useMikroHomePageQuery,
  useHomePageStatsQuery as useMikroHomePageStatsQuery,
} from "@/mikro-next/api/graphql";

const MikroWidget = () => {
  const { data: statsData, loading: statsLoading } =
    useMikroHomePageStatsQuery({ fetchPolicy: "cache-and-network" });
  const { data: homeData } = useMikroHomePageQuery({
    fetchPolicy: "cache-and-network",
  });

  const latestImage = homeData?.images?.[0];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <ImageIcon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Images</span>
      </div>
      {statsLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : (
        <div className="flex gap-4 items-center">
          <div>
            <p className="text-2xl font-bold">
              {statsData?.imagesStats?.count ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          {latestImage?.latestSnapshot?.store?.presignedUrl && (
            <img
              src={latestImage.latestSnapshot.store.presignedUrl}
              alt={latestImage.name}
              className="w-10 h-10 rounded object-cover ml-auto"
            />
          )}
        </div>
      )}
    </div>
  );
};

export const MikroDashboardWidgets = () => {
  useRegisterDashboardWidget({
    key: "mikro-stats",
    label: "Images",
    module: "mikro",
    icon: <ImageIcon className="w-3 h-3" />,
    component: () => <MikroWidget />,
    defaultSize: "1x1",
    defaultWidth: 25,
    defaultHeight: 50,
  });

  return null;
};
