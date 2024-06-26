import { LokNextAutoConfigure } from "@/app/config/LokNextAutoConfigure";
import { MikroNextAutoConfigure } from "@/app/config/MikroNextAutoConfigure";
import { RekuestNextAutoConfigure } from "@/app/config/RekuestNextAutoConfigure";
import { WELL_KNOWN_ENDPOINTS } from "@/constants";
import { AutoConfiguration } from "@jhnnsrs/arkitekt";
import { FlussNextAutoConfigure } from "./config/FlussNextAutoConfigure";
import { OmeroArkAutoConfigure } from "./config/OmeroArkAutoConfigure";
import { PortAutoConfigure } from "./config/PortAutoConfigure";

// In the App Configuration we mount all the auto configuration components that are used in the application.
// Autoconfiguration components are used to configure their respective providers, based on the "fakts" received
// from the fakts provider
export const AppConfiguration = () => {
  return (
    <>
      <LokNextAutoConfigure />
      <RekuestNextAutoConfigure />
      <MikroNextAutoConfigure />
      <OmeroArkAutoConfigure />
      <FlussNextAutoConfigure />
      <PortAutoConfigure />
      <AutoConfiguration
        wellKnownEndpoints={WELL_KNOWN_ENDPOINTS} // this configures fakts to use the well known endpoints in order to discover the other services
      />
    </>
  );
};
