import { createDisplayProvider } from "@/lib/display/registry";
import { ImageDisplay } from "@/mikro-next/displays/ImageDisplay";
import { RoiDisplay } from "@/mikro-next/displays/RoiDisplay";

// Import your display components here
// Example:
// import { UserDisplay } from "@/components/displays/UserDisplay";
// import { ImageDisplay } from "@/components/displays/ImageDisplay";
// import { DatasetDisplay } from "@/components/displays/DatasetDisplay";

export const { DisplayProvider, useDisplay, useDisplayComponent } =
  createDisplayProvider({
    "@mikro-next/image": ImageDisplay,
    "@mikro-next/roi": RoiDisplay,
  });
