import { InterfaceRegistry } from "./registry";

export const registry = new InterfaceRegistry();

registry.registerPackage({
  name: "Microscope",
  loader: () => import("@/rekuest/interfaces/components/Microscope"),
  componentname: "my-microscope",
  actionRequirements: {
    movex: "48ba103c0a0f303f27491f398063485fefcc55f076c158b6a45a653211809bfa",
  },
  stateRequirements: {
    positioner:
      "58bcc1b6487a801514b821a68cf6e792167320ade4179953de233cff85c1676c",
  },
});
