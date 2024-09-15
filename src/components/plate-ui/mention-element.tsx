import type { TMentionElement } from "@udecode/plate-mention";

import { useGetReagentQuery } from "@/mikro-next/api/graphql";
import { cn, withRef } from "@udecode/cn";
import { PlateElement, useElement } from "@udecode/plate-common";
import { useFocused, useSelected } from "slate-react";

export const MentionElement = withRef<
  typeof PlateElement,
  {
    onClick?: (mentionNode: any) => void;
    prefix?: string;
    renderLabel?: (mentionable: TMentionElement) => string;
  }
>(({ children, className, onClick, prefix, renderLabel, ...props }, ref) => {
  const element = useElement<TMentionElement>();
  const selected = useSelected();
  const focused = useFocused();

  const { data } = useGetReagentQuery({
    variables: {
      id: element.value,
    },
  });

  return (
    <PlateElement
      className={cn(
        "inline-block cursor-pointer rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm font-medium",
        selected && focused && "ring-2 ring-ring",
        element.children[0].bold === true && "font-bold",
        element.children[0].italic === true && "italic",
        element.children[0].underline === true && "underline",
        className,
      )}
      contentEditable={false}
      data-slate-value={element.value}
      ref={ref}
      {...props}
    >
      {prefix}
      {data?.reagent?.label}
    </PlateElement>
  );
});
