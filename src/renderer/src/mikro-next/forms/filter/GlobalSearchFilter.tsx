import { FancyInput } from "@/components/ui/fancy-input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { GlobalSearchQueryVariables } from "@/mikro-next/api/graphql";
import { useDebounce } from "@uidotdev/usehooks";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

export type FilterProps = {
  onFilterChanged: (values: GlobalSearchQueryVariables) => any;
  defaultValue: GlobalSearchQueryVariables
  className?: string;
  placeholder?: string;
}

const Filter = ({
  onFilterChanged,
  defaultValue,
  className,
  placeholder = "Search...",
}: FilterProps) => {
  const [search, setSearch] = useState(defaultValue.search ?? "");
  const [noImages, setNoImages] = useState(defaultValue.noImages ?? false);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    onFilterChanged({ search: debouncedSearch, noImages });
  }, [debouncedSearch, noImages]);

  return (
    <div className={`w-full flex flex-row ${className ?? ""}`}>
      <Popover>
        <PopoverAnchor asChild>
          <div className="h-full w-full relative flex flex-row">
            <FancyInput
              placeholder={placeholder}
              type="string"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow h-full bg-background text-foreground w-full"
            />
            <PopoverTrigger className="absolute right-1 top-1 text-foreground">
              <ArrowDown />
            </PopoverTrigger>
          </div>
        </PopoverAnchor>
        <PopoverContent>
          <div className="flex flex-row gap-2">
            <Toggle
              isChecked={noImages}
              onCheckedChange={setNoImages}
            >
              Exclude Globals
            </Toggle>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Filter;