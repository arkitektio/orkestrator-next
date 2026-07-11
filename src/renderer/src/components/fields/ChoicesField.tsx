import { SearchField } from "./SearchField";
import { FieldProps } from "./types";

export type Option = {
  label: string;
  value: string;
  description?: string;
};

export const ChoicesField = (props: FieldProps & { options: Option[] }) => {
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

  return <SearchField search={search} {...props} />;
};
