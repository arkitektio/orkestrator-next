// Constants used in the app

import { Manifest } from "@jhnnsrs/fakts";

export const manifest: Manifest = {
  version: "0.0.1",
  identifier: "github.io.jhnnsrs.wiiibboo",
  scopes: ["openid"],
  requirements: {
    lok: {
      key: "lok",
      service: "live.arkitekt.lok"
    },  
    rekuest: {
      key: "rekuest",
      service: "live.arkitekt.rekuest",
      optional: false
    },  
    mikro: {
      key: "mikro",
      service: "live.arkitekt.mikro",
      optional: true
    },
    fluss: {
      key: "fluss",
      service: "live.arkitekt.fluss",
      optional: true
    },
    kabinet: {
      key: "kabinet",
      service: "live.arkitekt.kabinet",
      optional: true
    },
    datalayer: {
      key: "datalayer",
      service: "live.arkitekt.datalayer",
      optional: true
    },
  }
};

// The type of the smart model, used by the smart model and react-dnd
export const SMART_MODEL_DROP_TYPE = "smart";

// Which endpoints should be used to discover the fakts services
export const WELL_KNOWN_ENDPOINTS = [
  "127.0.0.1:8010",
  "127.0.0.1:8000",
  "127.0.0.1:12000",
];
