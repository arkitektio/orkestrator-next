import { ToggleField } from "@/components/fields/ToggleField";
import { AutoSubmitter } from "@/components/form/AutoSubmitter";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NodeFilter, NodeSearchQueryVariables } from "@/rekuest/api/graphql";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { ArrowDown } from "lucide-react";
import { useForm } from "react-hook-form";

interface FilterProps {
  onFilterChanged: (values: NodeFilter) => any;
  defaultValue: NodeFilter;
  className?: string;
  placeholder?: string;
}

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
                <FormItem className="w-full px-3 relative">
                  <FormControl>
                    <Input
                      placeholder={"Search...."}
                      {...field}
                      type="string"
                      className="flex-grow bg-background py-4"
                    />
                  </FormControl>
                  <PopoverTrigger className="absolute right-5 bottom-2">
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
      <div></div>
    </Form>
  );
};

export default Filter;
