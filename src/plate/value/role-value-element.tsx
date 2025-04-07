import React from "react";

import type { TMentionElement } from "@udecode/plate-mention";

import { cn, withRef } from "@udecode/cn";
import { IS_APPLE, getHandler } from "@udecode/plate-common";
import { PlateElement, useElement } from "@udecode/plate-common/react";
import { useFocused, useSelected } from "slate-react";

import { useMounted } from "@/hooks/use-mounted";
import { useRoles } from "@/kraph/providers/RoleProvider";
import { useGetNodeQuery } from "@/kraph/api/graphql";
import { useRoleValue } from "./ValueProvider";


export const ValueDisplay = (props: {
  role: string,
  value: string
}) => {

  const { data, error, loading } = useGetNodeQuery({
    variables: {
      id: props.value,
    },
  });

  if (error) {
    return <span>{error.message}</span>;
  }

  if (!data) {
    return <span>{props.value}</span>;
  }


  return <span>{data.node.label}</span>;
}

export const RoleValueElement = withRef<
  typeof PlateElement,
  {
    prefix?: string;
    renderLabel?: (mentionable: TMentionElement) => string;
    onClick?: (mentionNode: any) => void;
  }
>(({ children, className, prefix, renderLabel, onClick, ...props }, ref) => {
  const element = useElement<TMentionElement>();
  const selected = useSelected();
  const focused = useFocused();
  const mounted = useMounted();


  const option = useRoleValue(element.value);



  return (
    <PlateElement
      ref={ref}
      className={cn(
        "inline-block cursor-pointer rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm font-medium",
        selected && focused && "ring-2 ring-ring",
        element.children[0].bold === true && "font-bold",
        element.children[0].italic === true && "italic",
        element.children[0].underline === true && "underline",
        className,
      )}
      onClick={getHandler(onClick, element)}
      data-slate-value={element.value}
      contentEditable={false}
      {...props}
    >
      {mounted && IS_APPLE ? (
        // Mac OS IME https://github.com/ianstormtaylor/slate/issues/3490
        <React.Fragment>
          {children}
          {option ? <ValueDisplay role={option.role} value={option.value} /> : <span className="text-muted-foreground">{element.value}</span>}
          {prefix}
        </React.Fragment>
      ) : (
        // Others like Android https://github.com/ianstormtaylor/slate/pull/5360
        <React.Fragment>
          {children}
          {option ? <ValueDisplay role={option.role} value={option.value} /> : <span className="text-muted-foreground">{element.value}</span>}
          {prefix}
        </React.Fragment>
      )}
    </PlateElement>
  );
});
