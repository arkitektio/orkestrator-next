import { RekuestNextAutoConfigure } from "@/app/config/RekuestNextAutoConfigure";
import { MikroNextAutoConfigure } from "@/app/config/MikroNextAutoConfigure";
import { LokNextAutoConfigure } from "@/app/config/LokNextAutoConfigure";
import { AutoConfiguration } from "@jhnnsrs/arkitekt";
import { OmeroArkAutoConfigure } from "./config/OmeroArkAutoConfigure";

export const AppConfiguration = () => {
  return (
    <>
      <LokNextAutoConfigure />
      <RekuestNextAutoConfigure />
      <MikroNextAutoConfigure />
      <OmeroArkAutoConfigure/>
      <AutoConfiguration
        wellKnownEndpoints={["100.91.169.37:8010", "127.0.0.1:8010"]}
      />
    </>
  );
};
