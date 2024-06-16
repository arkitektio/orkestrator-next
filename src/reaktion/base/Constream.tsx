import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PortFragment } from "@/rekuest/api/graphql";
import { Constants } from "./Constants";

export const Constream: React.FC<{
  constants: PortFragment[];
  constantsMap: { [key: string]: any };
  onClick?: (onposition: number) => void;
  open?: boolean | undefined;
}> = ({ constants, onClick, constantsMap, open }) => {
  return (
    <Popover open={open}>
      <PopoverTrigger className="absolute bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%] opacity-0 group-hover:opacity-100 transition-opacity easy-in-out duration-300 text-xs p-0  px-3 bg-background">
        Constants
      </PopoverTrigger>

      <PopoverContent side="bottom">
        {constants.length > 0 ? (
          <Constants
            ports={constants}
            overwrites={constantsMap}
            onClick={onClick}
          />
        ) : (
          "No configuration needed"
        )}
      </PopoverContent>
    </Popover>
  );
};
