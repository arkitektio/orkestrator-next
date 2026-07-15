import { buildModuleLink, buildSmart } from "@/providers/smart/builder";
import { FileViewFragment } from "./mikro-next/api/graphql";

// Linkers for the smart models
// Linkers represent ways to reference a smart model consistently in the ui, and
// can be used to create links to the smart model, details pages, etc.
// When building a smart model, we automate the creation of a few components:
// - `Smart`, a card like drag-n-drop component that can be used to wrap a react component
// - `Actions` a component that can be used to render actions for the smart model (like nodes that have registed this smart model as an input)
// - `DetailLink` a component that can be used to link to the detail page of the smart model
// - `ListLink` a component that can be used to link to the list page of the smart model
// - `linkBuilder` a function that can be used to build links to the smart model



export const RekuestTask = buildSmart(
  "@rekuest/task",
  "rekuest/tasks",
  { name: "Task" },
);

export const RekuestState = buildSmart(
  "@rekuest/state",
  "rekuest/states",
  { name: "State" },
);

export const BlokBlok = buildSmart(
  "@blok/blok",
  "blok/bloks",
  { name: "Blok" },
);

export const RekuestAction = buildSmart(
  "@rekuest/action",
  "rekuest/actions",
  { name: "Action" },
);
export const RekuestImplementation = buildSmart(
  "@rekuest/implementation",
  "rekuest/implementations",
  { name: "Implementation" },
);
export const RekuestBlok = buildSmart(
  "@rekuest/blok",
  "rekuest/bloks",
  { name: "Blok (Rekuest)" },
);
export const RekuestMaterializedBlok = buildSmart(
  "@rekuest/materialized_blok",
  "rekuest/materialized_bloks",
  { name: "Materialized Blok" },
);
export const RekuestDependency = buildSmart(
  "@rekuest/dependency",
  "rekuest/dependencies",
  { name: "Dependency" },
);
export const RekuestResolution = buildSmart(
  "@rekuest/resolution",
  "rekuest/resolutions",
  { name: "Resolution" },
);
export const FlussFlow = buildSmart(
  "@fluss/flow",
  "fluss/flows",
  { name: "Flow" },
);
export const FlussWorkspace = buildSmart(
  "@fluss/workspace",
  "fluss/workspaces",
  { name: "Workspace" },
);
export const FlussReactiveTemplate = buildSmart(
  "@fluss/reactive_template",
  "fluss/reactive_templates",
  { name: "Reactive Template" },
);

export const FlussRun = buildSmart(
  "@fluss/run",
  "fluss/runs",
  { name: "Run" },
);

export const RekuestProvision = buildSmart(
  "@rekuest/reservation",
  "rekuest/provisions",
  { name: "Provision" },
);
export const RekuestAgent = buildSmart(
  "@rekuest/agent",
  "rekuest/agents",
  { name: "Agent" },
);
export const RekuestMemoryShelve = buildSmart(
  "@rekuest/memoryshelve",
  "rekuest/memoryshelves",
  { name: "Memory Shelve" },
);

export const RekuestShortcut = buildSmart(
  "@rekuest/shortcut",
  "rekuest/shortcuts",
  { name: "Shortcut" },
);
export const RekuestToolbox = buildSmart(
  "@rekuest/toolbox",
  "rekuest/toolboxes",
  { name: "Toolbox" },
);
export const RekuestInputStructureUsage = buildSmart(
  "@rekuest/inputstructureusage",
  "rekuest/inputstructureusages",
  { name: "Input Structure Usage" },
);

export const RekuestOutputStructureUsage = buildSmart(
  "@rekuest/outputstructureusage",
  "rekuest/outputstructureusages",
  { name: "Output Structure Usage" },
);

export const RekuestInputInterfaceUsage = buildSmart(
  "@rekuest/inputinterfaceusage",
  "rekuest/inputinterfaceusages",
  { name: "Input Interface Usage" },
);

export const RekuestOutputInterfaceUsage = buildSmart(
  "@rekuest/inputstructureusage",
  "rekuest/inputstructureusages",
  { name: "Output Interface Usage" },
);

export const RekuestStructurePackage = buildSmart(
  "@rekuest/structurepackage",
  "rekuest/structurepackages",
  { name: "Structure Package" },
);

export const RekuestStructure = buildSmart(
  "@rekuest/structure",
  "rekuest/structures",
  { name: "Structure (Rekuest)" },
);

export const RekuestInterface = buildSmart(
  "@rekuest/interface",
  "rekuest/interfaces",
  { name: "Interface" },
);

export const RekuestDescriptor = buildSmart(
  "@rekuest/descriptor",
  "rekuest/descriptors",
  { name: "Descriptor" },
);

export const RekuestDashboard = buildSmart(
  "@rekuest/dashboard",
  "rekuest/dashboards",
  { name: "Dashboard" },
);

export const MikroImage = buildSmart(
  "@mikro/image",
  "mikro/images",
  { name: "Image (Mikro)" },
);
export const MikroSnapshot = buildSmart(
  "@mikro/snapshot",
  "mikro/snapshots",
  { name: "Snapshot" },
);
export const MikroEntityMetric = buildSmart(
  "@mikro/entitymetric",
  "mikro/entitymetric",
  { name: "Entity Metric" },
);
export const MikroEntityRelationMetric = buildSmart(
  "@mikro/entityrelationmetric",
  "mikro/entityrelationmetric",
  { name: "Entity Relation Metric" },
);
export const MikroSubjection = buildSmart(
  "@mikro/subjection",
  "mikro/subjections",
  { name: "Subjection" },
);
export const MikroRenderedPlot = buildSmart(
  "@mikro/renderedplot",
  "mikro/renderedplots",
  { name: "Rendered Plot" },
);
export const MikroRenderTree = buildSmart(
  "@mikronext/rendertree",
  "mikro/rendertrees",
  { name: "Render Tree" },
);

export const MikroDataset = buildSmart(
  "@mikro/dataset",
  "mikro/datasets",
  { name: "Dataset (Mikro)" },
);

export const MikroADataset = buildSmart(
  "@mikro/adataset",
  "mikro/adatasets",
  { name: "Array Dataset" },
);

export const MikroCoordinateSystem = buildSmart(
  "@mikro/coordinatesystem",
  "mikro/coordinatesystems",
  { name: "Coordinate System" },
);

export const ElektroTrace = buildSmart(
  "@elektro/trace",
  "elektro/traces",
  { name: "Trace" },
);
export const ElektroBlock = buildSmart(
  "@elektro/block",
  "elektro/blocks",
  { name: "Block" },
);
export const ElektroAnalogSignal = buildSmart(
  "@elektro/analogsignal",
  "elektro/analogsignals",
  { name: "Analog Signal" },
);
export const ElektroAnalogSignalChannel = buildSmart(
  "@elektro/analogsignalchannel",
  "elektro/analogsignalchannels",
  { name: "Analog Signal Channel" },
);

export const ElektroSimulation = buildSmart(
  "@elektro/simulation",
  "elektro/simulations",
  { name: "Simulation" },
);

export const ElektroMechanism = buildSmart(
  "@elektro/mechanism",
  "elektro/mechanisms",
  { name: "Mechanism" },
);

export const ElektroEnvironment = buildSmart(
  "@elektro/environment",
  "elektro/environments",
  { name: "Environment" },
);



export const ElektroModelCollection = buildSmart(
  "@elektro/modelcollection",
  "elektro/modelcollections",
  { name: "Model Collection" },
);
export const ElektroRecording = buildSmart(
  "@elektro/recording",
  "elektro/recordings",
  { name: "Recording" },
);
export const ElektroStimulus = buildSmart(
  "@elektro/stimulus",
  "elektro/stimuli",
  { name: "Stimulus" },
);
export const ElektroExperiment = buildSmart(
  "@elektro/experiment",
  "elektro/experiments",
  { name: "Experiment (Elektro)" },
);

export const DokumentsFile = buildSmart(
  "@dokuments/file",
  "dokuments/files",
  { name: "File (Dokuments)" },
);

export const DokumentsDocument = buildSmart(
  "@dokuments/document",
  "dokuments/documents",
  { name: "Document" },
);

export const DokumentsPage = buildSmart(
  "@dokuments/page",
  "dokuments/pages",
  { name: "Page" },
);

export const ElektroNeuronModel = buildSmart(
  "@elektro/neuronmodel",
  "elektro/neuronmodels",
  { name: "Neuron Model" },
);

export const ElektroModelWorkspace = buildSmart(
  "@elektro/modelworkspace",
  "elektro/modelworkspaces",
  { name: "Model Workspace" },
);

export const ElektroFile = buildSmart(
  "@elektro/file",
  "elektro/files",
  { name: "File (Elektro)" },
);

export const ElektroDataset = buildSmart(
  "@elektro/dataset",
  "elektro/datasets",
  { name: "Dataset (Elektro)" },
);

export const KraphNode = buildSmart(
  "@kraph/node",
  "kraph/nodes",
  { name: "Node" },
);

export const KraphExpression = buildSmart(
  "@kraph/expression",
  "kraph/expressions",
  { name: "Expression" },
);

export const KraphRelation = buildSmart(
  "@kraph/relation",
  "kraph/relations",
  { name: "Relation" },
);

export const KraphStructureRelation = buildSmart(
  "@kraph/structurerelation",
  "kraph/structurerelations",
  { name: "Structure Relation" },
);

export const KraphStructureCategory = buildSmart(
  "@kraph/structurecategory",
  "kraph/structurecategories",
  { name: "Structure Category" },
);

export const KraphNaturalEventCategory = buildSmart(
  "@kraph/naturaleventcategory",
  "kraph/naturaleventcategories",
  { name: "Natural Event Category" },
);

export const KraphProtocolEventCategory = buildSmart(
  "@kraph/protocoleventcategory",
  "kraph/protocoleventcategories",
  { name: "Protocol Event Category" },
);

export const KraphMetricCategory = buildSmart(
  "@kraph/metriccategory",
  "kraph/metriccategories",
  { name: "Metric Category" },
);

export const KraphMeasurementCategory = buildSmart(
  "@kraph/measurementcategory",
  "kraph/measurementcategories",
  { name: "Measurement Category" },
);

export const KraphRelationCategory = buildSmart(
  "@kraph/relationcategory",
  "kraph/relationcategories",
  { name: "Relation Category" },
);

export const KraphStructureRelationCategory = buildSmart(
  "@kraph/structurerelationcategory",
  "kraph/structurerelationcategories",
  { name: "Structure Relation Category" },
);

export const KraphGenericCategory = buildSmart(
  "@kraph/genericcategory",
  "kraph/genericcategories",
  { name: "Generic Category" },
);

export const KraphEntityCategory = buildSmart(
  "@kraph/entitycategory",
  "kraph/entitycategories",
  { name: "Entity Category" },
);

export const KraphReagentCategory = buildSmart(
  "@kraph/reagentcategory",
  "kraph/reagentcategories",
  { name: "Reagent Category" },
);

export const KraphLinkedExpression = buildSmart(
  "@kraph/linkedexpression",
  "kraph/linkedexpressions",
  { name: "Linked Expression" },
);
export const KraphOntology = buildSmart(
  "@kraph/ontology",
  "kraph/ontologies",
  { name: "Ontology" },
);
export const KraphReagent = buildSmart(
  "@kraph/reagent",
  "kraph/reagents",
  { name: "Reagent" },
);
export const KraphProtocolEvent = buildSmart(
  "@kraph/protocolevent",
  "kraph/protocolevents",
  { name: "Protocol Event" },
);
export const KraphNaturalEvent = buildSmart(
  "@kraph/naturalevent",
  "kraph/naturalevents",
  { name: "Natural Event" },
);
export const KraphEntity = buildSmart(
  "@kraph/entity",
  "kraph/entities",
  { name: "Entity" },
);
export const KraphEditEvent = buildSmart(
  "@kraph/editevent",
  "kraph/editevents",
  { name: "Edit Event" },
);
export const KraphMeasurement = buildSmart(
  "@kraph/measurement",
  "kraph/measurements",
  { name: "Measurement" },
);
export const KraphStructure = buildSmart(
  "@kraph/structure",
  "kraph/structures",
  { name: "Structure (Kraph)" },
);
export const KraphMetric = buildSmart(
  "@kraph/metric",
  "kraph/metrics",
  { name: "Metric" },
);
export const KraphGraph = buildSmart(
  "@kraph/graph",
  "kraph/graphs",
  { name: "Graph" },
);
export const KraphGraphView = buildSmart(
  "@kraph/graphview",
  "kraph/graphviews",
  { name: "Graph View" },
);
export const KraphPlotView = buildSmart(
  "@kraph/plotview",
  "kraph/plotviews",
  { name: "Plot View" },
);
export const KraphNodeView = buildSmart(
  "@kraph/nodeview",
  "kraph/nodeviews",
  { name: "Node View" },
);
export const KraphGraphQuery = buildSmart(
  "@kraph/graphquery",
  "kraph/graphqueries",
  { name: "Graph Query" },
);

export const KraphScatterPlot = buildSmart(
  "@kraph/scatterplot",
  "kraph/scatterplots",
  { name: "Scatter Plot" },
);
export const KraphNodeQuery = buildSmart(
  "@kraph/nodequery",
  "kraph/nodequeries",
  { name: "Node Query" },
);

export const MikroExperiment = buildSmart(
  "@mikro/experiment",
  "mikro/experiments",
  { name: "Experiment (Mikro)" },
);

export const MikroInstanceMaskViewLabel = buildSmart(
  "@mikro/instancemaskviewlabel",
  "mikro/instancemaskviewlabels",
  { name: "Instance Mask View Label" },
);

export const KraphProtocol = buildSmart(
  "@kraph/protocol",
  "kraph/protocols",
  { name: "Protocol" },
);
export const KraphProtocolStep = buildSmart(
  "@kraph/protocolstep",
  "kraph/protocolsteps",
  { name: "Protocol Step" },
);
export const KraphProtocolStepTemplate = buildSmart(
  "@kraph/protocolsteptemplate",
  "kraph/protocolsteptemplates",
  { name: "Protocol Step Template" },
);

export const OmeroArkProject = buildSmart(
  "@omeroark/project",
  "omero_ark/projects",
  { name: "Project" },
);

export const PortPod = buildSmart(
  "@port-next/pod",
  "port-next/pod",
  { name: "Pod (Port)" },
);
export const PortDefinition = buildSmart(
  "@port-next/definition",
  "port-next/definition",
  { name: "Definition (Port)" },
);

export const OmeroArkDataset = buildSmart(
  "@omeroark/dataset",
  "omero_ark/datasets",
  { name: "Dataset (Omero Ark)" },
);

export const OmeroArkImage = buildSmart(
  "@omeroark/image",
  "omero_ark/images",
  { name: "Image (Omero Ark)" },
);

export const MikroHistory = buildSmart(
  "@mikro/history",
  "mikro/history",
  { name: "History" },
);

export const MikroAffineTransformationView = buildSmart(
  "@mikro/affinetransformationview",
  "mikro/affinetransformationviews",
  { name: "Affine Transformation View" },
);

export const MikroLabelView = buildSmart(
  "@mikro/labelview",
  "mikro/labelviews",
  { name: "Label View" },
);

export const MikroSpecimenView = buildSmart(
  "@mikro/specimenview",
  "mikro/specimenviews",
  { name: "Specimen View" },
);

export const MikroFileView = buildSmart<FileViewFragment>(
  "@mikro/fileview",
  "mikro/fileviews",
  { name: "File View" },
);
export const MikroHistogramView = buildSmart(
  "@mikro/histogramview",
  "mikro/histogramviews",
  { name: "Histogram View" },
);
export const MikroPixelView = buildSmart(
  "@mikro/pixelview",
  "mikro/pixelviews",
  { name: "Pixel View" },
);

export const MikroROIView = buildSmart(
  "@mikro/roiview",
  "mikro/roiviews",
  { name: "ROI View" },
);

export const MikroDerivedView = buildSmart(
  "@mikro/derivedview",
  "mikro/derivedviews",
  { name: "Derived View" },
);

export const MikroProtocolStepView = buildSmart(
  "@mikro/protocolstepview",
  "mikro/protocolstepviews",
  { name: "Protocol Step View" },
);

export const MikroMultiPositionView = buildSmart(
  "@mikro/multipositionview",
  "mikro/multipositionviews",
  { name: "Multi Position View" },
);

export const MikroAcquisitionView = buildSmart(
  "@mikro/acquisitionview",
  "mikro/acquisitionviews",
  { name: "Acquisition View" },
);

export const MikroFluorophore = buildSmart(
  "@mikro/fluorophore",
  "mikro/fluorophores",
  { name: "Fluorophore" },
);

export const MikroFile = buildSmart(
  "@mikro/file",
  "mikro/files",
  { name: "File (Mikro)" },
);
export const MikroMesh = buildSmart(
  "@mikro/mesh",
  "mikro/meshes",
  { name: "Mesh" },
);

export const MikroStage = buildSmart(
  "@mikro/stage",
  "mikro/stages",
  { name: "Stage" },
);
export const MikroScene = buildSmart(
  "@mikro/scene",
  "mikro/scenes",
  { name: "Scene" },
);
export const MikroTable = buildSmart(
  "@mikro/table",
  "mikro/tables",
  { name: "Table" },
);
export const MikroTableDataset = buildSmart(
  "@mikro/tabledataset",
  "mikro/tabledatasets",
  { name: "Table Dataset" },
);

export const MikroChannelView = buildSmart(
  "@mikro/channelview",
  "mikro/channelviews",
  { name: "Channel View" },
);

export const MikroMaskView = buildSmart(
  "@mikro/maskview",
  "mikro/maskviews",
  { name: "Mask View" },
);
export const MikroInstanceMaskView = buildSmart(
  "@mikro/instancemaskview",
  "mikro/instancemaskviews",
  { name: "Instance Mask View" },
);
export const MikroReferenceView = buildSmart(
  "@mikro/referenceview",
  "mikro/referenceviews",
  { name: "Reference View" },
);

export const MikroRGBView = buildSmart(
  "@mikro/rgbview",
  "mikro/rgbviews",
  { name: "RGB View" },
);

export const MikroRGBContext = buildSmart(
  "@mikro/rgbcontext",
  "mikro/rgbcontexts",
  { name: "RGB Context" },
);

export const MikroOpticsView = buildSmart(
  "@mikro/opticsview",
  "mikro/opticsviews",
  { name: "Optics View" },
);

export const MikroLightpathView = buildSmart(
  "@mikro/lightpathview",
  "mikro/lightpathviews",
  { name: "Lightpath View" },
);

export const MikroInstrument = buildSmart(
  "@mikro/instrument",
  "mikro/instruments",
  { name: "Instrument" },
);

export const MikroROI = buildSmart(
  "@mikro/roi",
  "mikro/rois",
  { name: "R O I" },
);
export const MikroEntityRelation = buildSmart(
  "@mikro/entityrelation",
  "mikro/entityrelations",
  { name: "Entity Relation" },
);

export const MikroSpecimen = buildSmart(
  "@mikro/specimen",
  "mikro/specimens",
  { name: "Specimen" },
);

export const RekuestModuleLink = buildModuleLink("rekuestnext");
export const MikroModuleLink = buildModuleLink("mikro");
export const ReaktionModuleLink = buildModuleLink("fluss");
export const OmeroArkModuleLink = buildModuleLink("omero-ark");

export const LokUser = buildSmart(
  "@lok/user",
  "lok/users",
  { name: "User" },
);
export const LokOrganization = buildSmart(
  "@lok/organization",
  "lok/organizations",
  { name: "Organization" },
);
export const LokRedeemToken = buildSmart(
  "@lok/redeemtoken",
  "lok/redeemtokens",
  { name: "Redeem Token" },
);
export const LokGroup = buildSmart(
  "@lok/group",
  "lok/groups",
  { name: "Group" },
);
export const LokClient = buildSmart(
  "@lok/client",
  "lok/clients",
  { name: "Client" },
);
export const LokDevice = buildSmart(
  "@lok/device",
  "lok/devices",
  { name: "Device " },
);
export const LokApp = buildSmart(
  "@lok/app",
  "lok/apps",
  { name: "App" },
);
export const LokRelease = buildSmart(
  "@lok/release",
  "lok/releases",
  { name: "Release (Lok)" },
);
export const LokService = buildSmart(
  "@lok/service",
  "lok/services",
  { name: "Service" },
);
export const LokBackend = buildSmart(
  "@lok/backend",
  "lok/backends",
  { name: "Backend (Lok)" },
);
export const LokServiceInstance = buildSmart(
  "@lok/serviceinstance",
  "lok/serviceinstances",
  { name: "Service Instance" },
);
export const LokLayer = buildSmart(
  "@lok/layer",
  "lok/layers",
  { name: "Layer" },
);

export const LovekitStream = buildSmart(
  "@lovekit/stream",
  "lovekit/streams",
  { name: "Stream" },
);
export const LovekitSoloBroadcast = buildSmart(
  "@lovekit/solo_broadcast",
  "lovekit/solobroadcasts",
  { name: "Solo Broadcast" },
);

export const AlpakaRoom = buildSmart(
  "@alpaka/room",
  "alpaka/rooms",
  { name: "Room" },
);
export const AlpakaMessage = buildSmart(
  "@alpaka/message",
  "alpaka/messages",
  { name: "Message" },
);
export const AlpakaProvider = buildSmart(
  "@alpaka/provider",
  "alpaka/providers",
  { name: "Provider" },
);
export const AlpakaLLMModel = buildSmart(
  "@alpaka/llmmodel",
  "alpaka/llmmodels",
  { name: "LLM Model" },
);
export const AlpakaCollection = buildSmart(
  "@alpaka/collection",
  "alpaka/collections",
  { name: "Collection" },
);
export const LokComment = buildSmart(
  "@lok/comment",
  "lok/comments",
  { name: "Comment" },
);
export const LokMapping = buildSmart(
  "@lok/mapping",
  "lok/mappings",
  { name: "Mapping" },
);
export const LokComposition = buildSmart(
  "@lok/composition",
  "lok/composition",
  { name: "Composition" },
);

export const KabinetDefinition = buildSmart(
  "@kabinet/definition",
  "kabinet/definitions",
  { name: "Definition (Kabinet)" },
);

export const KabinetRepo = buildSmart(
  "@kabinet/repo",
  "kabinet/repos",
  { name: "Repo" },
);

export const KabinetBackend = buildSmart(
  "@kabinet/backend",
  "kabinet/backends",
  { name: "Backend (Kabinet)" },
);

export const KabinetPod = buildSmart(
  "@kabinet/pod",
  "kabinet/pods",
  { name: "Pod (Kabinet)" },
);
export const KabinetResource = buildSmart(
  "@kabinet/resource",
  "kabinet/resources",
  { name: "Resource" },
);

export const KabinetRelease = buildSmart(
  "@kabinet/release",
  "kabinet/releases",
  { name: "Release (Kabinet)" },
);

export const KabinetFlavour = buildSmart(
  "@kabinet/flavour",
  "kabinet/flavours",
  { name: "Flavour" },
);


export const RekuestSpace = buildSmart(
  "@rekuest/space",
  "rekuest/spaces",
  { name: "Space" },
);
export const RekuestAgentScene = buildSmart(
  "@rekuest/agentscene",
  "rekuest/agentscenes",
  { name: "Agent Scene" },
);
