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
                Exclude Images
              </ToggleField>
              <ToggleField label="No Files" name="noFiles">
                Exclude Files
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
