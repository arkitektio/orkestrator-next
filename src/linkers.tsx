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
  "rekuest/assignation",
);

export const RekuestNode = buildSmart("@rekuest-next/node", "rekuest/nodes");
export const RekuestTemplate = buildSmart(
  "@rekuest-next/template",
  "rekuest/templates",
);
export const RekuestFlow = buildSmart("@rekuest-next/flow", "reaktion/flows");
export const RekuestWorkspace = buildSmart(
  "@rekuest-next/workspace",
  "reaktion/workspaces",
);
export const RekuestReservation = buildSmart(
  "@rekuest-next/reservation",
  "rekuest/reservations",
);

export const MikroImage = buildSmart("@mikronext/image", "mikronext/images");

export const MikroMetric = buildSmart("@mikronext/metric", "mikronext/metrics");

export const MikroDataset = buildSmart(
  "@mikronext/dataset",
  "mikronext/datasets",
);

export const OmeroArkProject = buildSmart(
  "@omero-ark/project",
  "omero-ark/projects",
);

export const PortPod = buildSmart(
  "@port-next/pod",
  "port-next/pod",
);


export const OmeroArkDataset = buildSmart(
  "@omero-ark/dataset",
  "omero-ark/datasets",
);

export const OmeroArkImage = buildSmart(
  "@omero-ark/image",
  "omero-ark/images",
);



export const MikroHistory = buildSmart(
  "@mikronext/history",
  "mikronext/history",
);

export const MikroAffineTransformationView = buildSmart(
  "@mikronext/affinetransformationview",
  "affinetransformationviews",
);

export const MikroLabelView = buildSmart(
  "@mikronext/labelview",
  "mikronext/labelviews",
);

export const MikroMultiPositionView = buildSmart(
  "@mikronext/multipositionview",
  "mikronext/multipositionviews",
);

export const MikroAcquisitionView = buildSmart(
  "@mikronext/acquisitionview",
  "mikronext/acquisitionviews",
);

export const MikroFluorophore = buildSmart(
  "@mikronext/fluorophore",
  "mikronext/fluorophores",
);

export const MikroFile = buildSmart("@mikronext/file", "mikronext/files");

export const MikroStage = buildSmart("@mikronext/stage", "mikronext/stages");

export const MikroChannelView = buildSmart(
  "@mikronext/channelview",
  "mikronext/channelviews",
);

export const MikroRGBView = buildSmart(
  "@mikronext/rgbview",
  "mikronext/rgbviews",
);

export const MikroRGBContext = buildSmart(
  "@mikronext/rgbcontext",
  "mikronext/rgbcontexts",
);

export const MikroOpticsView = buildSmart(
  "@mikronext/opticsview",
  "mikronext/opticsviews",
);

export const MikroInstrument = buildSmart(
  "@mikronext/instrument",
  "mikronext/instruments",
);

export const RekuestModuleLink = buildModuleLink("rekuestnext");
export const MikroModuleLink = buildModuleLink("mikronext");
export const ReaktionModuleLink = buildModuleLink("reaktion");
export const OmeroArkModuleLink = buildModuleLink("omero-ark");

export const LokUser = buildSmart("@loknext/user", "lok/users");
export const LokGroup = buildSmart("@lokgroup/group", "lok/groups");
