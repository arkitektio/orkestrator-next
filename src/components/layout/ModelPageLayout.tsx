import { Identifier, Structure } from "@/types";
import { PageLayout, PageVariant } from "./PageLayout";
import { useSmartDrop } from "@/providers/smart/hooks";
import { useState } from "react";
import { Card } from "../ui/card";
import { SmartContext } from "@/rekuest/buttons/ObjectButton";
import { toast } from "sonner";
import { useAssign } from "@/rekuest/hooks/useAssign";
import { ListTemplateFragment, PrimaryNodeFragment } from "@/rekuest/api/graphql";
import { Dialog, DialogContent } from "../ui/dialog";
import { NodeAssignForm } from "@/rekuest/forms/NodeAssignForm";

export type ModelPageLayoutProps = {
  children: React.ReactNode;
  identifier: Identifier;
  object: string;
  title?: React.ReactNode;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: PageVariant;
  callback?: (object: string) => void;
};

export const ModelPageLayout = ({
  sidebars,
  title,
  children,
  identifier,
  object,
  variant,
  callback,
  actions,
  pageActions,
}: ModelPageLayoutProps) => {

    const [partners, setPartners] = useState<Structure[]>([]);

    const [{ isOver, canDrop }, drop] = useSmartDrop((structures) => {
        if (!callback) {
          setPartners(structures);
        }
      });


      const [dialogNode, setDialogNode] = useState<{
        node: PrimaryNodeFragment;
        args: { [key: string]: any };
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
        setDialogNode({ node: node, args: { [the_key]: object } });
        return;
      }
  
      try {
        await assign({
          node: node.id,
          args: {
            [the_key]: object,
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
          setDialogNode({ node: node, args: { [the_key]: object } });
          return;
        }
    
        try {
          await assign({
            node: node.id,
            args: {
              [the_key]: object,
            },
          });
        } catch (e) {
          toast.error(e.message);
        }
      };

  return (
    <Dialog open={!!dialogNode} onOpenChange={() => setDialogNode(null)}>
    <div className="h-full w-full" ref={drop}>
       {(isOver )&& <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm z-50">
        <div className="flex items-center justify-center h-full">
          <Card className="p-4">
            Drop to Combine
          </Card>
        </div>
    </div>}
        {partners.length > 0 && <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm z-50" onClick={() => setPartners([])}>
        <div className="flex items-center justify-center h-full">
          <Card className="p-4">
             <SmartContext
              identifier={identifier}
              object={object}
              partners={partners}
              onSelectNode={conditionalAssign}
              onTemplateSelect={onTemplateSelect}
            />
          </Card>
        </div>
        </div>}

    <PageLayout
      title={title}
      sidebars={<>{sidebars}</>}
      actions={actions}
      variant={variant}
      pageActions={pageActions}
    >
      {children}
    </PageLayout>
    </div>
    <DialogContent>
        <NodeAssignForm
        id={dialogNode?.node.id || ""}
        args={dialogNode?.args}
        hidden={dialogNode?.args}
        />
      </DialogContent>
      </Dialog>
  );
};
