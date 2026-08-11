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
import { FolderDisplay } from "@/mikro-next/displays/FolderDisplay";
import { FileDisplay } from "@/mikro-next/displays/FileDisplay";
import { InstrumentDisplay } from "@/mikro-next/displays/InstrumentDisplay";
import { SceneDisplay } from "@/mikro-next/displays/SceneDisplay";
import SnapshotDisplay from "@/mikro-next/displays/SnapshotDisplay";
import { TableDatasetDisplay } from "@/mikro-next/displays/TableDatasetDisplay";

// Import your display components here
// Example:
// import { UserDisplay } from "@/components/displays/UserDisplay";

export const { DisplayProvider, useDisplay, useDisplayComponent } =
  createDisplayProvider({
    // mikro
    "@mikro-next/file": FileDisplay,
    "@mikro-next/snapshot": SnapshotDisplay,
    "@mikro/file": FileDisplay,
    "@mikro/scene": SceneDisplay,
    "@mikro/snapshot": SnapshotDisplay,
    "@mikro/folder": FolderDisplay,
    "@mikro/tabledataset": TableDatasetDisplay,
    "@mikro/instrument": InstrumentDisplay,
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
