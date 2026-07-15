import { AnalogSignalChannelDisplay } from "@/elektro/displays/AnalogSignalChannelDisplay";
import { BlockDisplay } from "@/elektro/displays/BlockDisplay";
import { ModelWorkspaceDisplay } from "@/elektro/displays/ModelWorkspaceDisplay";
import { NeuronModelDisplay } from "@/elektro/displays/NeuronModelDisplay";
import { SimulationDisplay } from "@/elektro/displays/SimulationDisplay";
import { PodDisplay } from "@/kabinet/displays/PodDisplay";
import { EntityCategoryDisplay } from "@/kraph/displays/EntityCategoryDisplay";
import { EntityDisplay } from "@/kraph/displays/EntityDisplay";
import { GraphDisplay } from "@/kraph/displays/GraphDisplay";
import { MeasurementDisplay } from "@/kraph/displays/MeasurementDisplay";
import { MetricDisplay } from "@/kraph/displays/MetricDisplay";
import { MetricCategoryDisplay } from "@/kraph/displays/MetricCategoryDisplay";
import { NaturalEventDisplay } from "@/kraph/displays/NaturalEventDisplay";
import { NaturalEventCategoryDisplay } from "@/kraph/displays/NaturalEventCategoryDisplay";
import { ProtocolEventDisplay } from "@/kraph/displays/ProtocolEventDisplay";
import { ProtocolEventCategoryDisplay } from "@/kraph/displays/ProtocolEventCategoryDisplay";
import { RelationDisplay } from "@/kraph/displays/RelationDisplay";
import { RelationCategoryDisplay } from "@/kraph/displays/RelationCategoryDisplay";
import { StructureDisplay } from "@/kraph/displays/StructureDisplay";
import { StructureCategoryDisplay } from "@/kraph/displays/StructureCategoryDisplay";
import { StructureRelationCategoryDisplay } from "@/kraph/displays/StructureRelationCategoryDisplay";
import { createDisplayProvider } from "@/lib/display/registry";
import { MessageDisplay } from "@/alpaka/displays/MessageDisplay";
import { SoloBroadcastDisplay } from "@/lovekit/displays/SoloBroadcastDisplay";
import { DatasetDisplay } from "@/mikro-next/displays/DatasetDisplay";
import { FileDisplay } from "@/mikro-next/displays/FileDisplay";
import { ImageDisplay } from "@/mikro-next/displays/ImageDisplay";
import { InstrumentDisplay } from "@/mikro-next/displays/InstrumentDisplay";
import { MeshWidget as MeshDisplay } from "@/mikro-next/displays/MeshDisplay";
import { RoiDisplay } from "@/mikro-next/displays/RoiDisplay";
import { SceneDisplay } from "@/mikro-next/displays/SceneDisplay";
import SnapshotDisplay from "@/mikro-next/displays/SnapshotDisplay";
import { StageDisplay } from "@/mikro-next/displays/StageDisplay";
import { TableDisplay } from "@/mikro-next/displays/TableDisplay";
import { TableDatasetDisplay } from "@/mikro-next/displays/TableDatasetDisplay";

// Import your display components here
// Example:
// import { UserDisplay } from "@/components/displays/UserDisplay";

export const { DisplayProvider, useDisplay, useDisplayComponent } =
  createDisplayProvider({
    // mikro
    "@mikro-next/image": ImageDisplay,
    "@mikro-next/file": FileDisplay,
    "@mikro-next/dataset": DatasetDisplay,
    "@mikro-next/stage": StageDisplay,
    "@mikro-next/roi": RoiDisplay,
    "@mikro-next/snapshot": SnapshotDisplay,
    "@mikro/file": FileDisplay,
    "@mikro/scene": SceneDisplay,
    "@mikro/image": ImageDisplay,
    "@mikro/roi": RoiDisplay,
    "@mikro/snapshot": SnapshotDisplay,
    "@mikro/dataset": DatasetDisplay,
    "@mikro/stage": StageDisplay,
    "@mikro/table": TableDisplay,
    "@mikro/tabledataset": TableDatasetDisplay,
    "@mikro/instrument": InstrumentDisplay,
    "@mikro/mesh": MeshDisplay,
    // elektro
    "@elektro/analogsignalchannel": AnalogSignalChannelDisplay,
    "@elektro/simulation": SimulationDisplay,
    "@elektro/block": BlockDisplay,
    "@elektro/neuronmodel": NeuronModelDisplay,
    "@elektro/modelworkspace": ModelWorkspaceDisplay,
    // kraph — instances
    "@kraph/graph": GraphDisplay,
    "@kraph/entity": EntityDisplay,
    "@kraph/relation": RelationDisplay,
    "@kraph/measurement": MeasurementDisplay,
    "@kraph/structure": StructureDisplay,
    "@kraph/naturalevent": NaturalEventDisplay,
    "@kraph/protocolevent": ProtocolEventDisplay,
    // kraph — categories
    "@kraph/entitycategory": EntityCategoryDisplay,
    "@kraph/metric": MetricDisplay,
    "@kraph/metriccategory": MetricCategoryDisplay,
    "@kraph/relationcategory": RelationCategoryDisplay,
    "@kraph/structurerelationcategory": StructureRelationCategoryDisplay,
    "@kraph/naturaleventcategory": NaturalEventCategoryDisplay,
    "@kraph/protocoleventcategory": ProtocolEventCategoryDisplay,
    "@kraph/structurecategory": StructureCategoryDisplay,
    // kabinet
    "@kabinet/pod": PodDisplay,
    // lovekit
    "@lovekit/solo_broadcast": SoloBroadcastDisplay,
    // alpaka
    "@alpaka/message": MessageDisplay,
  });
