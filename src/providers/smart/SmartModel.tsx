import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import { SmartContext } from "@/rekuest/buttons/ObjectButton";
import { Structure } from "@/types";
import { useFloating } from "@floating-ui/react";
import { Portal } from "@radix-ui/react-portal";
import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useMySelection } from "../selection/SelectionContext";
import { SmartModelProps } from "./types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAssign } from "@/rekuest/hooks/useAssign";
import {
  ListTemplateFragment,
  PrimaryNodeFragment,
} from "@/rekuest/api/graphql";
import { toast } from "sonner";
import { NodeAssignForm } from "@/rekuest/forms/NodeAssignForm";
import { NativeTypes } from "react-dnd-html5-backend";
import { TemplateAssignForm } from "@/rekuest/forms/TemplateAssignForm";
import { p } from "node_modules/@udecode/plate-media/dist/BasePlaceholderPlugin-Huy5PFfu";
import { el } from "date-fns/locale";

export const SmartModel = ({
  showSelfMates = true,
  showSelectingIndex = true,
  hover = false,
  mates,
  ...props
}: SmartModelProps) => {
  const self: Structure = {
    identifier: props.identifier,
    object: props.object,
  };

  const [partners, setPartners] = useState<Structure[]>([]);
  const { refs, floatingStyles } = useFloating({
    strategy: "fixed",
    transform: true,
    open: partners.length > 0,
    onOpenChange: (open) => {
      if (!open) {
        setPartners([]);
      }
    },
  });

  useEffect(() => {
    if (partners.length > 0) {
      const listener = {
        handleEvent: (e: Event) => {
          const target = e.target as HTMLElement;
          const partnerCard = target.closest(".partnercard");
          if (!partnerCard) {
            setPartners([]);
          }
        },
      };
      document.addEventListener("mousedown", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
      };
    }
  }, [partners]);

  const [{ isOver, canDrop }, drop] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE, NativeTypes.TEXT, NativeTypes.URL],
      drop: (item, monitor) => {
        console.log("drop", item);

        if (monitor.getItemType() === SMART_MODEL_DROP_TYPE) {
          console.log("SMART", item);
          setPartners(items);
          return {};
        }

        if (monitor.getItemType() === NativeTypes.URL) {
          console.log("URL", item);
          let url = item.urls;
          let partners: Structure[] = [];
          for (let i = 0; i < url.length; i++) {
            let the_url = url[i];
            console.log("URL", the_url);
            let match = the_url.match(/arkitekt:\/\/([^:]+):([^\/]+)/);
            if (match) {
              console.log("MATCH", match);
              let [_, identifier, object] = match;
              let structure: Structure = { identifier, object };
              partners.push(structure);
            }
          }
          if (partners.length > 0) {
            setPartners(partners);
            return {};
          }
        }

        let text = item.text;

        if (item.text) {
          try {
            let structure: Structure = JSON.parse(text);
            setPartners([structure]);
            return {};
          } catch (e) {
            console.error(e);
          }
        }

        alert(`Drop unkonwn ${item}`);

        return {};
      },
      collect: (monitor) => {
        return {
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop(),
        };
      },
    };
  });

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: SMART_MODEL_DROP_TYPE,
      item: [self],
      collect: (monitor) => {
        console.log("dragging", monitor.isDragging());
        return {
          isDragging: monitor.isDragging(),
        };
      },
    }),
    [self],
  );

  const { isSelected } = useMySelection({
    identifier: props.identifier,
    object: props.object,
  });

  const [dialogNode, setDialogNode] = React.useState<{
    node: PrimaryNodeFragment;
    args: { [key: string]: any };
    template?: ListTemplateFragment;
  } | null>(null);

  const { assign } = useAssign();

  const conditionalAssign = async (node: PrimaryNodeFragment) => {
    let the_key = node.args?.at(0)?.key;

    let neededAdditionalPorts = node.args.filter(
      (x) => !x.nullable && x.key != the_key,
    );
    if (!the_key) {
      toast.error("No key found");
      return;
    }
    if (neededAdditionalPorts.length > 0) {
      setDialogNode({ node: node, args: { [the_key]: props.object } });
      return;
    }

    try {
      await assign({
        node: node.id,
        args: {
          [the_key]: props.object,
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onTemplateSelect = async (
    node: PrimaryNodeFragment,
    template: ListTemplateFragment,
  ) => {
    let the_key = node.args?.at(0)?.key;

    let neededAdditionalPorts = node.args.filter(
      (x) => !x.nullable && x.key != the_key,
    );
    if (!the_key) {
      toast.error("No key found");
      return;
    }

    if (neededAdditionalPorts.length > 0) {
      setDialogNode({
        node: node,
        args: { [the_key]: props.object },
        template: template,
      });
      return;
    }

    try {
      await assign({
        template: template.id,
        args: {
          [the_key]: props.object,
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div
      key={props.object}
      ref={drop}
      onDragStart={(e) => {
        // Package the data as text/uri-list
        const data = JSON.stringify(self);
        e.dataTransfer.setData("text/plain", data);
        e.dataTransfer.setData(
          "text/uri-list",
          `arkitekt://${props.identifier}:${props.object}`,
        );
      }}
      data-identifier={props.identifier}
      data-object={props.object}
    >
      <Dialog>
        <ContextMenu>
          <ContextMenuContent className="dark:border-gray-700 max-w-md">
            {isSelected ? (
              <>Multiselect is not implemented yet</>
            ) : (
              <SmartContext
                identifier={props.identifier}
                object={props.object}
                partners={[]}
                onSelectNode={conditionalAssign}
                onSelectTemplate={onTemplateSelect}
              />
            )}
          </ContextMenuContent>
          <ContextMenuTrigger asChild>
            <div
              ref={drag}
              className={cn(
                "@container relative z-10 cursor-pointer",
                isSelected && "group ring ring-1 ",
                isDragging &&
                  "opacity-50 ring-2 ring-gray-600 ring rounded rounded-md",
                isOver &&
                  "shadow-xl ring-2 border-gray-200 ring rounded rounded-md",
              )}
              draggable={true}
              onDragStart={(e) => {
                // Package the data as text/uri-list
                const data = JSON.stringify(self);
                e.dataTransfer.setData("text/plain", data);
              }}
              data-identifier={props.identifier}
              data-object={props.object}
            >
              {props.children}
              {isOver && <CombineButton />}
              <div
                className="absolute top-0 right-0 "
                ref={refs.setReference}
              />

              {partners.length > 0 && (
                <Portal>
                  <div
                    ref={refs.setFloating}
                    className={cn(
                      " bg-background border border-gray-500 rounded-lg shadow-lg p-2 z-[9999] w-[300px] aspect-square",
                    )}
                    style={floatingStyles}
                  >
                    <SmartContext
                      identifier={props.identifier}
                      object={props.object}
                      partners={partners}
                      onSelectNode={conditionalAssign}
                      onSelectTemplate={onTemplateSelect}
                    />
                  </div>
                </Portal>
              )}
            </div>
          </ContextMenuTrigger>
        </ContextMenu>
        <DialogContent>
          {dialogNode?.template ? (
            <TemplateAssignForm
              id={dialogNode.template.id}
              args={dialogNode.args}
              hidden={dialogNode.args}
            />
          ) : (
            <NodeAssignForm
              id={dialogNode?.node.id || ""}
              args={dialogNode?.args}
              hidden={dialogNode?.args}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const CombineButton = (props: { children?: React.ReactNode }) => {
  return (
    <div className="absolute bottom-0 w-full h-full flex justify-center items-center z-10 bg-black bg-opacity-75">
      <div className="font-light text-xs p-2 rounded-full bg-black bg-opacity-100">
        Drop to Combine
      </div>
    </div>
  );
};
