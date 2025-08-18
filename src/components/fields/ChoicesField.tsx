import * as React from "react";

import { useFormContext } from "react-hook-form";
import { SearchField } from "./SearchField";
import { FieldProps } from "./types";

export type Option = {
  label: string;
  value: string;
  description?: string;
};

export const ChoicesField = (props: FieldProps & { options: Option[] }) => {
  const [open, setOpen] = React.useState(false);

  const search = async ({
    search,
    values,
  }: {
    search?: string;
    values?: (string | number)[];
  }) => {
    return props.options.filter((op) => {
      if (values) return values.includes(op.value);
      if (search) return op.label.includes(search);
      if (!search) return true;
      return false;
    });
  };

  const form = useFormContext();

  return <SearchField search={search} {...props} />;
};
