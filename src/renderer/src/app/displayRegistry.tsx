import { DisplayRegistry } from "@/lib/display/registry";
import ImageDisplay from "@/mikro-next/displays/ImageDisplay";

export const displayRegistry = new DisplayRegistry();

displayRegistry.registerDisplayComponent("@mikro-next/image", ImageDisplay);
displayRegistry.registerDisplayComponent("@mikro-next/file", ImageDisplay);
displayRegistry.registerDisplayComponent("@elektro/simulation", SimulationDisplay);

