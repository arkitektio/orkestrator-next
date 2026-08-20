import { ArrowLeftRight } from "lucide-react";

export const DimPill = ({
  label,
  value,
  onSwapNext,
}: {
  label: string;
  value: string | null | undefined;
  onSwapNext?: () => void;
}) => (
  <div className="flex items-center gap-0">
    <div className="flex flex-col items-center rounded bg-background/50 px-1.5 py-0.5 min-w-[28px]">
      <span className="text-[8px] text-muted-foreground leading-none">
        {label}
      </span>
      <span className="text-[10px] font-mono font-medium leading-tight">
        {value ?? "—"}
      </span>
    </div>
    {onSwapNext && (
      <button
        className="text-muted-foreground hover:text-foreground p-0 mx-[-2px] z-10"
        onClick={onSwapNext}
        title={`Swap ${label} with next`}
      >
        <ArrowLeftRight className="h-2.5 w-2.5" />
      </button>
    )}
  </div>
);
