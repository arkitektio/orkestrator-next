
import React, { useState } from 'react';

import { cn, withRef } from '@udecode/cn';
import { getMentionOnSelectItem } from '@udecode/plate-mention';

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxInput,
  InlineComboboxItem,
} from '@/components/plate-ui/inline-combobox';
import { PlateElement } from '@/components/plate-ui/plate-element';
import { useSearchReagentsLazyQuery } from '@/mikro-next/api/graphql';

const onSelectItem = getMentionOnSelectItem();


export type Option {
  label: string;
  value: string;
}



export const MentionInputElement = withRef<typeof PlateElement>(
  ({ className, ...props }, ref) => {
    const { children, editor, element } = props;

    const [options, setOptions] = useState<(Option | null | undefined)[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const [searchF] = useSearchReagentsLazyQuery();

    const query = (string: string) => {
      searchF({ variables: { search: string } })
        .then((res) => {
          setOptions(res.data?.options || ([] as Option[]));
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
          setOptions([]);
        });
    };

    useEffect(() => {
      query(search);
    }, [search]);

    return (
      <PlateElement
        as="span"
        data-slate-value={element.value}
        ref={ref}
        {...props}
      >
        <InlineCombobox
          element={element}
          setValue={setSearch}
          showTrigger={false}
          trigger="@"
          value={search}
          filter={false}
        >
          <span
            className={cn(
              "inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm ring-ring focus-within:ring-2",
              className,
            )}
          >
            <InlineComboboxInput />
          </span>

          <InlineComboboxContent className="my-1.5">
            <InlineComboboxEmpty>No results found</InlineComboboxEmpty>

            {options.map((item) => (
              <InlineComboboxItem
                key={item?.value}
                onClick={() =>
                  onSelectItem(editor, { text: item?.value || "karl" }, search)
                }
                value={item?.label || ""}
                className="hover:bg-primary bg-slate-200"
              >
                {item?.label}
              </InlineComboboxItem>
            ))}
          </InlineComboboxContent>
        </InlineCombobox>

        {children}
      </PlateElement>
    );
  },
);

