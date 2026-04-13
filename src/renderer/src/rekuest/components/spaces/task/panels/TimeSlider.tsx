import { Slider } from "@/components/ui/slider";
import { useSpaceViewStore } from "../store"


export const TimeSlider = () => {

  const startTime = useSpaceViewStore((s) => new Date(s.task.createdAt).getTime());
  const endTime = useSpaceViewStore((s) => new Date(s.task.finishedAt).getTime());

  const setTimepoint = useSpaceViewStore((s) => s.selectTimepoint);
  const selectedTimepoint = useSpaceViewStore((s) => s.selectedTimepoint);

  return (
    <div className="w-full px-4 py-2 relative mb-2 group">
      <Slider defaultValue={[startTime]} min={startTime} max={endTime} step={1} onValueChange={(value) => {
        setTimepoint(value[0]);
      }} />
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>{new Date(startTime).toLocaleString()}</span>
        <span>{new Date(endTime).toLocaleString()}</span>
      </div>
      <div className="absolute group-hover:opacity-100 opacity-0 transition-opacity"
      style={{ top: "50%", transform: "translateX(-50%); translateY(100%)", left: `${((selectedTimepoint - startTime) / (endTime - startTime)) * 100}%` }}>



        <div className="text-sm  bg-muted/80 px-2 py-1 rounded rounded-full flex items-center gap-1 whitespace-nowrap">
          {new Date(selectedTimepoint).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
