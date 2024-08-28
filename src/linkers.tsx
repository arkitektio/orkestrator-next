import { buildModuleLink, buildSmart } from "@/providers/smart/builder";

// Linkers for the smart models
// Linkers represent ways to reference a smart model consistently in the ui, and
// can be used to create links to the smart model, details pages, etc.
// When building a smart model, we automate the creation of a few components:
// - `Smart`, a card like drag-n-drop component that can be used to wrap a react component
// - `Actions` a component that can be used to render actions for the smart model (like nodes that have registed this smart model as an input)
// - `DetailLink` a component that can be used to link to the detail page of the smart model
// - `ListLink` a component that can be used to link to the list page of the smart model
// - `linkBuilder` a function that can be used to build links to the smart model

export const RekuestAssignation = buildSmart(
  "@rekuest-next/assignation",
  "rekuest/assignations",
);

export const RekuestNode = buildSmart("@rekuest-next/node", "rekuest/nodes");
export const RekuestTemplate = buildSmart(
  "@rekuest-next/template",
  "rekuest/templates",
);
export const RekuestPanel = buildSmart("@rekuest-next/panel", "rekuest/panels");
export const RekuestDependency = buildSmart(
  "@rekuest-next/dependency",
  "rekuest/dependencies",
);
export const FlussFlow = buildSmart("@fluss/flow", "fluss/flows");
export const FlussWorkspace = buildSmart(
  "@fluss/workspace",
  "fluss/workspaces",
);
export const RekuestReservation = buildSmart(
  "@rekuest-next/reservation",
  "rekuest/reservations",
);

export const RekuestProvision = buildSmart(
  "@rekuest-next/reservation",
  "rekuest/provisions",
);
export const RekuestAgent = buildSmart("@rekuest-next/agent", "rekuest/agents");
export const RekuestDashboard = buildSmart(
  "@rekuest-next/dashboard",
  "rekuest/dashboards",
);

export const MikroImage = buildSmart("@mikro/image", "mikro/images");
export const MikroRenderedPlot = buildSmart(
  "@mikro/renderedplot",
  "mikro/renderedplots",
);
export const MikroRenderTree = buildSmart(
  "@mikronext/rendertree",
  "mikro/rendertrees",
);

export const MikroMetric = buildSmart("@mikro/metric", "mikro/metrics");

export const MikroEntity = buildSmart("@mikro/entitry", "mikro/entities");

export const MikroDataset = buildSmart("@mikro/dataset", "mikro/datasets");
export const MikroOntology = buildSmart("@mikro/ontology", "mikro/ontologies");
export const MikroExperiment = buildSmart(
  "@mikro/experiment",
  "mikro/experiments",
);
export const MikroProtocol = buildSmart("@mikro/protocol", "mikro/protocols");
export const MikroProtocolStep = buildSmart(
  "@mikro/protocolstep",
  "mikro/protocolsteps",
);

export const OmeroArkProject = buildSmart(
  "@omero-ark/project",
  "omero-ark/projects",
);

export const PortPod = buildSmart("@port-next/pod", "port-next/pod");
export const PortDefinition = buildSmart(
  "@port-next/definition",
  "port-next/definition",
);

export const OmeroArkDataset = buildSmart(
  "@omero-ark/dataset",
  "omero-ark/datasets",
);

export const OmeroArkImage = buildSmart("@omero-ark/image", "omero-ark/images");

export const MikroHistory = buildSmart("@mikro/history", "mikro/history");

export const MikroAffineTransformationView = buildSmart(
  "@mikro/affinetransformationview",
  "mikro/affinetransformationviews",
);

export const MikroLabelView = buildSmart(
  "@mikro/labelview",
  "mikro/labelviews",
);

export const MikroSpecimenView = buildSmart(
  "@mikro/specimenview",
  "mikro/specimenviews",
);

export const MikroMultiPositionView = buildSmart(
  "@mikro/multipositionview",
  "mikro/multipositionviews",
);

export const MikroAcquisitionView = buildSmart(
  "@mikro/acquisitionview",
  "mikro/acquisitionviews",
);

export const MikroFluorophore = buildSmart(
  "@mikro/fluorophore",
  "mikro/fluorophores",
);

export const MikroFile = buildSmart("@mikro/file", "mikro/files");

export const MikroStage = buildSmart("@mikro/stage", "mikro/stages");
export const MikroTable = buildSmart("@mikro/table", "mikro/tables");

export const MikroChannelView = buildSmart(
  "@mikro/channelview",
  "mikro/channelviews",
);

export const MikroRGBView = buildSmart("@mikronext/rgbview", "mikro/rgbviews");

export const MikroRGBContext = buildSmart(
  "@mikro/rgbcontext",
  "mikro/rgbcontexts",
);

export const MikroOpticsView = buildSmart(
  "@mikro/opticsview",
  "mikro/opticsviews",
);

export const MikroInstrument = buildSmart(
  "@mikro/instrument",
  "mikro/instruments",
);

export const MikroROI = buildSmart("@mikro/roi", "mikro/rois");

export const MikroSpecimen = buildSmart("@mikro/specimen", "mikro/specimens");

export const RekuestModuleLink = buildModuleLink("rekuestnext");
export const MikroModuleLink = buildModuleLink("mikro");
export const ReaktionModuleLink = buildModuleLink("fluss");
export const OmeroArkModuleLink = buildModuleLink("omero-ark");

export const LokUser = buildSmart("@lok/user", "lok/users");
export const LokRedeemToken = buildSmart("@lok/redeem_token", "lok/users");
export const LokGroup = buildSmart("@lok/group", "lok/groups");
export const LokClient = buildSmart("@lok/client", "lok/clients");
export const LokRoom = buildSmart("@lok/room", "lok/rooms");
export const LokMapping = buildSmart("@lok/mapping", "lok/mappings");
export const LokComposition = buildSmart("@lok/composition", "lok/composition");

export const KabinetDefinition = buildSmart(
  "@kabinet/definition",
  "kabinet/definitions",
);

export const KabinetBackend = buildSmart(
  "@kabinet/backend",
  "kabinet/backends",
);

export const KabinetPod = buildSmart("@kabinet/pod", "kabinet/pods");

export const KabinetRelease = buildSmart(
  "@kabinet/release",
  "kabinet/releases",
);

export const FlussRun = buildSmart("@fluss/run", "fluss/runs");
