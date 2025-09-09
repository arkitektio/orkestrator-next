import { MeasurementOverlay } from "@/kraph/overlays/MeasurementOverlay";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import { Structure } from "@/types";

// FIXME: This is a placeholder. We should automatically detect the type of the object and render the appropriate component.
export const LinkOverlay = (props: { structure: Structure }) => {
  return (
    <Guard.Kraph>
      <MeasurementOverlay structure={props.structure} />
    </Guard.Kraph>
  );
};
