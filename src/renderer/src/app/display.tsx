import { AnalogSignalChannelDisplay } from "@/elektro/displays/AnalogSignalChannelDisplay";
import { BlockDisplay } from "@/elektro/displays/BlockDisplay";
import { NeuronModelDisplay } from "@/elektro/displays/NeuronModelDisplay";
import { SimulationDisplay } from "@/elektro/displays/SimulationDisplay";
import { PodDisplay } from "@/kabinet/displays/PodDisplay";
import { EntityCategoryDisplay } from "@/kraph/displays/EntityCategoryDisplay";
import { MetricDisplay } from "@/kraph/displays/MetricDisplay";
import { createDisplayProvider } from "@/lib/display/registry";
import { SoloBroadcastDisplay } from "@/lovekit/displays/SoloBroadcastDisplay";
import { ImageDisplay } from "@/mikro-next/displays/ImageDisplay";
import { RoiDisplay } from "@/mikro-next/displays/RoiDisplay";
import SnapshotDisplay from "@/mikro-next/displays/SnapshotDisplay";

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
    "@elektro/simulation": SimulationDisplay,
    "@elektro/block": BlockDisplay,
    "@lovekit/solo_broadcast": SoloBroadcastDisplay,
    "@elektro/neuronmodel": NeuronModelDisplay,
  });
