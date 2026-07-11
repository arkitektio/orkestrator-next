
import { withRef } from "@udecode/cn";
import {
  useListToolbarButton,
  useListToolbarButtonState,
} from "@udecode/plate-list/react";
import { KEYS } from "platejs";

import { Icons } from "@/components/icons";

import { ToolbarButton } from "./toolbar";

export const ListToolbarButton = withRef<
  typeof ToolbarButton,
  {
    nodeType?: string;
  }
>(({ nodeType = KEYS.ul, ...rest }, ref) => {
  const state = useListToolbarButtonState({ nodeType });
  const { props } = useListToolbarButton(state);

  return (
    <ToolbarButton
      ref={ref}
      tooltip={nodeType === KEYS.ul ? "Bulleted List" : "Numbered List"}
      {...props}
      {...rest}
    >
      {nodeType === KEYS.ul ? <Icons.ul /> : <Icons.ol />}
    </ToolbarButton>
  );
});
