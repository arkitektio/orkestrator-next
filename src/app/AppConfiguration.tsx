import { RekuestNextAutoConfigure } from "@/app/config/RekuestNextAutoConfigure";
import { MikroNextAutoConfigure } from "@/app/config/MikroNextAutoConfigure";
import { LokNextAutoConfigure } from "@/app/config/LokNextAutoConfigure";
import { AutoConfiguration } from "@jhnnsrs/arkitekt";

export const AppConfiguration = () => {
  return (
    <>
      <LokNextAutoConfigure />
      <RekuestNextAutoConfigure />
      <MikroNextAutoConfigure />
      <AutoConfiguration wellKnownEndpoints={["100.91.169.37:8010"]} />
    </>
  );
};
