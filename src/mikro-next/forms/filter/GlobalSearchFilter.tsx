import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GlobalSearchQueryVariables } from "@/mikro-next/api/graphql";
import { useForm, useWatch } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowDown } from "lucide-react";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { SwitchField } from "@/components/fields/SwitchField";
import { ToggleField } from "@/components/fields/ToggleField";
import debounce from "debounce";
import { useEffect } from "react";
import { AutoSubmitter } from "@/components/form/AutoSubmitter";

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
                    <ArrowDown/>
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
