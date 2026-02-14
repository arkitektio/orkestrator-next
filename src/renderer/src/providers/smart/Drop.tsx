import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import {
  ListImplementationFragment,
  PrimaryActionFragment,
} from "@/rekuest/api/graphql";
import { SmartContext } from "@/rekuest/buttons/ObjectButton";
import { ActionAssignForm } from "@/rekuest/forms/ActionAssignForm";
import { ImplementationAssignForm } from "@/rekuest/forms/ImplementationAssignForm";
import { useAssign } from "@/rekuest/hooks/useAssign";
import { Structure } from "@/types";
import { useFloating } from "@floating-ui/react";
import { Portal } from "@radix-ui/react-portal";
import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { toast } from "sonner";
import { SmartModelProps } from "./types";

export const SmartDropZone = ({
  showSelfMates = true,
  showSelectingIndex = true,
  hover = false,
  mates,
  className,
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
          setPartners(item);
          return {};
        }

        if (monitor.getItemType() === NativeTypes.URL) {
          console.log("URL", item);
          const url = item.urls;
          const partners: Structure[] = [];
          for (let i = 0; i < url.length; i++) {
            const the_url = url[i];
            console.log("URL", the_url);
            const match = the_url.match(/arkitekt:\/\/([^:]+):([^\/]+)/);
            if (match) {
              console.log("MATCH", match);
              const [_, identifier, object] = match;
              const structure: Structure = { identifier, object };
              partners.push(structure);
            }
          }
          if (partners.length > 0) {
            setPartners(partners);
            return {};
          }
        }

        const text = item.text;

        if (item.text) {
          try {
            const structure: Structure = JSON.parse(text);
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

  const [dialogNode, setDialogNode] = React.useState<{
    node: PrimaryActionFragment;
    args: { [key: string]: any };
    template?: ListImplementationFragment;
  } | null>(null);

  const { assign } = useAssign();

  const conditionalAssign = async (node: PrimaryActionFragment) => {
    const the_key = node.args?.at(0)?.key;

    const neededAdditionalPorts = node.args.filter(
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
    node: PrimaryActionFragment,
    template: ListImplementationFragment,
  ) => {
    const the_key = node.args?.at(0)?.key;

    const neededAdditionalPorts = node.args.filter(
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
      data-identifier={props.identifier}
      data-object={props.object}
    >
      <Dialog>
        <div
          className={cn(className)}
          data-identifier={props.identifier}
          data-object={props.object}
        >
          {props.children}
          {isOver && <CombineButton />}
          <div className="absolute top-0 right-0 " ref={refs.setReference} />

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
                  objects={[{ identifier: props.identifier, object: props.object }]}
                  partners={partners}
                />
              </div>
            </Portal>
          )}
        </div>
        <DialogContent>
          {dialogNode?.template ? (
            <ImplementationAssignForm
              id={dialogNode.template.id}
              args={dialogNode.args}
              hidden={dialogNode.args}
            />
          ) : (
            <ActionAssignForm
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
