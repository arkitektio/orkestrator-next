// Constants used in the app

import { Manifest } from "@jhnnsrs/fakts";

export const manifest: Manifest = {
  version: "0.0.1",
  identifier: "github.io.jhnnsrs.orkestrator",
};


// The type of the smart model, used by the smart model and react-dnd
export const SMART_MODEL_DROP_TYPE = "smart";


// Which endpoints should be used to discover the fakts services
export const WELL_KNOWN_ENDPOINTS = ["100.91.169.37:8010", "127.0.0.1:8010"]