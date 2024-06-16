import { ToggleField } from "@/components/fields/ToggleField";
import { AutoSubmitter } from "@/components/form/AutoSubmitter";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GlobalSearchQueryVariables } from "@/lok-next/api/graphql";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { ArrowDown } from "lucide-react";
import { useForm } from "react-hook-form";

interface FilterProps {
  onFilterChanged: (values: GlobalSearchQueryVariables) => any;
  defaultValue: GlobalSearchQueryVariables & { search: string };
  className?: string;
  placeholder?: string;
}

export const FilterSearch = () => {
  return <Input type="text" placeholder="Search" />;
};

const Filter: React.FC<FilterProps> = ({ onFilterChanged, defaultValue }) => {
  const form = useForm({
    defaultValues: defaultValue,
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <AutoSubmitter onSubmit={onFilterChanged} debounce={200} />
      <div className="w-full flex flex-row">
        <Popover>
          <FormField
            control={form.control}
            name={"search"}
            render={({ field }) => (
              <PopoverAnchor asChild>
                <FormItem className="h-full w-full relative flex-row flex relative">
                  <FormControl>
                    <Input
                      placeholder={"Search...."}
                      {...field}
                      type="string"
                      className="flex-grow h-full bg-background text-foreground w-full"
                    />
                  </FormControl>

                  <PopoverTrigger className="absolute right-1 top-1 text-foreground">
                    <ArrowDown />
                  </PopoverTrigger>
                </FormItem>
              </PopoverAnchor>
            )}
          />
          <PopoverContent>
            <div className="flex flex-row gap-2">
              <ToggleField label="No Images" name="noImages">
                Exclude Globals
              </ToggleField>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Form>
  );
};

export default Filter;
