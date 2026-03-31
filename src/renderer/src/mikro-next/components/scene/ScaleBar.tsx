import { useViewerStore } from "./store/viewerStore";
import { useSceneStore } from "./store/sceneStore";

const UNIT_LABELS: Record<string, string> = {
  MICROMETERS: "µm",
  NANOMETERS: "nm",
  ANGSTROMS: "Å",
  PIXELS: "px",
  UNKNOWN: "units",
};

function getNiceNumber(value: number): number {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);
  let niceFraction;
  if (fraction < 1.5) niceFraction = 1;
  else if (fraction < 3) niceFraction = 2;
  else if (fraction < 7) niceFraction = 5;
  else niceFraction = 10;
  return niceFraction * Math.pow(10, exponent);
}

export const ScaleBar = () => {
  const show = useViewerStore((s) => s.showScaleBar);
  const worldUnitsPerPixel = useViewerStore((s) => s.worldUnitsPerPixel);
  const spatialUnit = useSceneStore((s) => s.spatialUnit);

  if (!show) return null;

  const unitLabel = UNIT_LABELS[spatialUnit] ?? spatialUnit;
  const targetPx = 120;
  const rawWorldUnits = targetPx * worldUnitsPerPixel;
  const niceUnits = getNiceNumber(rawWorldUnits);
  const finalWidthPx = niceUnits / worldUnitsPerPixel;

  return (
    <div className="absolute bottom-8 left-8 z-10 flex flex-col items-center pointer-events-none">
      <div
        className="border-b-2 border-l-2 border-r-2 border-white h-2"
        style={{ width: `${finalWidthPx}px` }}
      />
      <span className="text-[10px] text-white font-mono mt-1 bg-black/40 px-1 rounded">
        {niceUnits} {unitLabel}
      </span>
    </div>
  );
};
