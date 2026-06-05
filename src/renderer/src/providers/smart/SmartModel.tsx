import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/providers/settings/SettingsContext";
import { getSmartBuilderAdapters } from "@/providers/smart/buildSmartAdapters";
import { SmartContext } from "@/providers/smart/extensions/context";
import { Structure } from "@/types";
import { Portal } from "@radix-ui/react-portal";
import React from "react";
import { motion } from "framer-motion";
import { useSelectionSelector } from "../selection/SelectionContext";
import {
  enterHoverGroup,
  leaveHoverGroup,
  useHoverGroupActive,
} from "./hoverGroup";
import { SmartModelProps } from "./types";
import { useSmartModel } from "./useSmartModel";

export const SmartModel = ({
  ...props
}: SmartModelProps) => {
  const {
    ref,
    floatingRef,
    floatingStyles,
    self,
    isOver,
    partners,
    clearPartners,
    handleClick,
    handleDragStart,
    getCurrentSelection,
  } = useSmartModel({ identifier: props.identifier, object: props.object,  });

  // Hover cards are opt-out via the user settings (default on).
  const hoverCardsEnabled = useSettingsStore(
    (state) => state.settings?.showHoverCards ?? true,
  );
  const hoverEnabled = Boolean(props.hover) && hoverCardsEnabled;

  const className = React.useMemo(
    () =>
      cn(
        props.className,
        "group @container relative z-10 cursor-pointer",
        "selected:ring selected:ring-1 selected:ring-offset-2 selected:ring-offset-transparent selected:ring-primary/80 selected:rounded",
        "b-selected:ring b-selected:ring-2 b-selected:rounded b-selected:ring-red-500",
        "dragging:animate-pulse dragging:ring-2 dragging:ring-gray-600 dragging:rounded dragging:rounded-md",
        "over:ring over:ring-offset-4 over:border-gray-200 over:ring-primary/80 over:rounded over:ring-offset-transparent",
        "selected:after:absolute selected:after:top-0 selected:after:right-0 selected:after:z-[9998] selected:after:flex selected:after:h-6 selected:after:w-6 selected:after:translate-x-1/2 selected:after:-translate-y-1/2 selected:after:items-center selected:after:justify-center selected:after:rounded-full selected:after:bg-primary selected:after:text-xs selected:after:font-semibold selected:after:text-white selected:after:content-[attr(data-selected-index)]",
        "b-selected:before:absolute b-selected:before:top-0 b-selected:before:right-0 b-selected:before:z-[9999] b-selected:before:flex b-selected:before:h-6 b-selected:before:w-6 b-selected:before:translate-x-1/2 b-selected:before:-translate-y-1/2 b-selected:before:items-center b-selected:before:justify-center b-selected:before:rounded-full b-selected:before:bg-red-500 b-selected:before:text-xs b-selected:before:font-semibold b-selected:before:text-white b-selected:before:content-[attr(data-bselected-index)]",
      ),
    [
      props.className,
    ],
  );

  const triggerContent = (
    <div
      key={`${props.identifier}:${props.object}`}
      ref={ref}
      onClick={handleClick}
      className={cn("relative", props.containerClassName, className)}
      onDragStart={handleDragStart}
      draggable={false}
    >
      {props.children}
      {isOver && <CombineButton />}

      {partners.length > 0 && (
        <Portal>
          <motion.div
            ref={floatingRef}
            style={floatingStyles}
            className="z-[10050] w-[320px] max-w-[min(90vw,320px)] shadow-2xl max-w-md rounded bg-popover border  rounded-lg p-1 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ filter: "blur(2px)" }}
            animate={{ filter: "none" }}
          >
            <SmartContext
              objects={
                getCurrentSelection().length > 1
                  ? getCurrentSelection()
                  : [self]
              }
              partners={partners}
              onDone={() => clearPartners()}
            />
          </motion.div>
        </Portal>
      )}
    </div>
  );

  const menu = (
    <ContextMenu modal={false}>
      <ContextMenuContent className="dark:border-gray-700 max-w-md">
        <SmartModelContext self={self} />
      </ContextMenuContent>
      <ContextMenuTrigger asChild>
        {hoverEnabled ? (
          <HoverCardTrigger asChild>{triggerContent}</HoverCardTrigger>
        ) : (
          triggerContent
        )}
      </ContextMenuTrigger>
    </ContextMenu>
  );

  if (!hoverEnabled) {
    return menu;
  }

  return <SmartHoverCard self={self}>{menu}</SmartHoverCard>;
};

// Wraps the model trigger in a shadcn HoverCard. The detailed hover content is
// resolved per-identifier through the smart builder adapters and is only
// mounted while the card is open, so the (potentially expensive) detail query
// is fired on demand when the item actually becomes visible.
const SmartHoverCard = ({
  self,
  children,
}: {
  self: Structure;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  const groupActive = useHoverGroupActive();
  const openRef = React.useRef(false);

  const handleOpenChange = React.useCallback((next: boolean) => {
    setOpen(next);
    if (next === openRef.current) {
      return;
    }
    openRef.current = next;
    if (next) {
      enterHoverGroup();
    } else {
      leaveHoverGroup();
    }
  }, []);

  // Make sure we release our slot in the group if we unmount while open
  // (e.g. the item scrolls out of view).
  React.useEffect(() => {
    return () => {
      if (openRef.current) {
        openRef.current = false;
        leaveHoverGroup();
      }
    };
  }, []);

  return (
    <HoverCard
      open={open}
      onOpenChange={handleOpenChange}
      openDelay={groupActive ? 80 : 600}
      closeDelay={100}
    >
      {children}
      <HoverCardContent
        side="right"
        align="center"
        sideOffset={12}
        className="w-80 max-w-[min(90vw,20rem)] p-0 ring-0 border-0 bg-transparent overflow-visible shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient "frame" — the padding lets this gradient show as a border
            around the solid body. The shadow lives here (on the actual visible
            element) so it isn't lost on the transparent portal container. */}
        <div className="rounded-3xl bg-gradient-to-br from-primary/70 via-primary/10 to-primary-similar/40 p-[1.5px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)]">
          <div className="rounded-3xl overflow-hidden bg-popover">
            {open &&
              getSmartBuilderAdapters().renderHover({
                identifier: self.identifier,
                object: self.object,
              })}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const SmartModelContext = ({ self }: { self: Structure }) => {
  const selection = useSelectionSelector((state) => state.selection);
  const bselection = useSelectionSelector((state) => state.bselection);

  if (selection.length > 0) {
    return <SmartContext objects={selection} partners={bselection} />;
  }

  return <SmartContext objects={[self]} partners={[]} />;
};

export const CombineButton = () => {
  return (
    <div className="absolute bottom-0 w-full h-full flex justify-center items-center z-10 bg-black bg-opacity-20 inset-0 rounded rounded-lg">
      <div className="font-light text-xs p-2 rounded-full bg-black bg-opacity-20">
        Drop to Combine
      </div>
    </div>
  );
};
