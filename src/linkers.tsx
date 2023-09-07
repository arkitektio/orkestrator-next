import { buildModuleLink, buildSmart } from "@/providers/smart/builder";

export const RekuestAssignation = buildSmart(
  "@rekuest-next/assignation",
  "rekuest/assignation",
);

export const RekuestNode = buildSmart(
  "@rekuest-next/node",
  "rekuest/nodes",
);
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

export const MikroHistory = buildSmart(
  "@mikronext/history",
  "mikronext/history",
);

export const MikroTransformationView = buildSmart(
  "@mikronext/transformationview",
  "transformationviews",
);

export const MikroLabelView = buildSmart(
  "@mikronext/labelview",
  "mikronext/labelviews",
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
