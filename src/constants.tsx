// Constants used in the app

import { BrowserRouter, HashRouter } from "react-router-dom";
import { Manifest } from "./lib/fakts";

declare global {
  interface Window {
    __ORKESTRATOR_BASE_NAME__: string;
  }
}

export const Router = window.electron ? HashRouter : BrowserRouter;

export const baseName = window.electron ? "" : "orkestrator";

export const manifest: Manifest = {
  version: "0.0.1",
  identifier: "live.arkitekt.orkestrator",
  scopes: ["openid"],
  requirements: [
    {
      key: "lok",
      service: "live.arkitekt.lok",
    },
    {
      key: "rekuest",
      service: "live.arkitekt.rekuest",
      optional: false,
    },
    {
      key: "mikro",
      service: "live.arkitekt.mikro",
      optional: false,
    },
    {
      key: "fluss",
      service: "live.arkitekt.fluss",
      optional: false,
    },
    {
      key: "kabinet",
      service: "live.arkitekt.kabinet",
      optional: true,
    },
    {
      key: "datalayer",
      service: "live.arkitekt.datalayer",
      optional: false,
    },
    {
      key: "livekit",
      service: "io.livekit.livekit",
      optional: false,
    },
    {
      key: "omero_ark",
      service: "live.arkitekt.omero_ark",
      optional: true,
    },
  ],
};

// The type of the smart model, used by the smart model and react-dnd
export const SMART_MODEL_DROP_TYPE = "smart";

// Which endpoints should be used to discover the fakts services
export const WELL_KNOWN_ENDPOINTS = ["https://localhost:443"];

export const KABINET_REFRESH_POD_HASH =
  "3edf4d37e009b4273ffaf1fa1dc5316ded2363c6beb08e73a614055a22062b04";

export const KABINET_INSTALL_POD_HASH =
  "fad7fa309e1409bf301467286dad304dd729801155dd4d38899a470257859dc8";

export const KABINET_INSTALL_DEFINITION_HASH =
  "c83bc8b777196759490bf4b962ead42ae89548beacb94bcfded0dc0d348cee82";
