import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { Portal } from "@radix-ui/react-portal";
import React from "react";
import { toast } from "sonner";
import { SmartModelProps } from "./types";
import { useSmartDropZone } from "./useSmartDropZone";

export const SmartDropZone = ({
  showSelfMates = true,
  showSelectingIndex = true,
  hover = false,
  className,
  ...props
}: SmartModelProps) => {
  const {
    ref,
    self,
    isOver,
    canDrop,
    partners,
    clearPartners,
    floatingRef,
    floatingStyles,
  } = useSmartDropZone({ identifier: props.identifier, object: props.object });

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
    <Dialog>
      <div
        key={props.object}
        ref={ref}
        className={cn(
          "group relative over:shadow-xl over:ring-2 over:ring-gray-300 over:rounded-md can-drop:border-gray-200",
          className,
        )}
        style={props.dropStyle?.({
          isOver,
          isDragging: false,
          canDrop,
          progress: undefined,
        })}
      >
          {props.children}
          {isOver && <CombineButton />}

          {partners.length > 0 && (
            <Portal>
              <div
                ref={floatingRef}
                className={cn(
                  " bg-background border border-gray-500 rounded-lg shadow-lg p-2 z-[9999] w-[300px] aspect-square",
                )}
                style={floatingStyles}
              >
                <SmartContext
                  objects={[self]}
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
  );
};

export const CombineButton = () => {
  return (
    <div className="absolute bottom-0 w-full h-full flex justify-center items-center z-10 bg-black bg-opacity-75">
      <div className="font-light text-xs p-2 rounded-full bg-black bg-opacity-100">
        Drop to Combine
      </div>
    </div>
  );
};
