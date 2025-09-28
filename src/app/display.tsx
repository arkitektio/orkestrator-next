import { EntityCategoryDisplay } from "@/kraph/displays/EntityCategoryDisplay";
import { createDisplayProvider } from "@/lib/display/registry";
import { ImageDisplay } from "@/mikro-next/displays/ImageDisplay";
import { RoiDisplay } from "@/mikro-next/displays/RoiDisplay";
import { PodDisplay } from "@/kabinet/displays/PodDisplay";
import SnapshotDisplay from "@/mikro-next/displays/SnapshotDisplay";
import { MetricDisplay } from "@/kraph/displays/MetricDisplay";
import { AnalogSignalChannelDisplay } from "@/elektro/displays/AnalogSignalChannelDisplay";

// Import your display components here
// Example:
// import { UserDisplay } from "@/components/displays/UserDisplay";
// import { ImageDisplay } from "@/components/displays/ImageDisplay";
// import { DatasetDisplay } from "@/components/displays/DatasetDisplay";

export const { DisplayProvider, useDisplay, useDisplayComponent } =
  createDisplayProvider({
    "@mikro-next/image": ImageDisplay,
    "@mikro/image": ImageDisplay,
    "@elektro/analogsignalchannel": AnalogSignalChannelDisplay,
    "@mikro-next/roi": RoiDisplay,
    "@mikro/roi": RoiDisplay,
    "@mikro/snapshot": SnapshotDisplay,
    "@kraph/entitycategory": EntityCategoryDisplay,
    "@kraph/metric": MetricDisplay,
    "@kabinet/pod": PodDisplay,
  });
