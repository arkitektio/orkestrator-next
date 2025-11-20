import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DemandKind, PortKind, PrimaryActionFragment, useAllPrimaryActionsQuery } from "@/rekuest/api/graphql";
import { useAssign, useAssignWithCallback } from "@/rekuest/hooks/useAssign";
import { useDialog } from "@/app/dialog";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";





export type EnhanceButtonProps = {
  identifier: string;
  object: string;
  refetch?: () => Promise<any>;
};




export const EnhanceButton = (props: EnhanceButtonProps) => {









  const { data: enhanceActions } = useAllPrimaryActionsQuery({
    variables: {
      filters: {
        inCollection: "enhance",
        demands: [
          {
            kind: DemandKind.Args,
            matches: [{ at: 0, kind: PortKind.Structure, identifier: props.identifier }]
          },
          {
            kind: DemandKind.Returns,
            matches: [{ at: 0, kind: PortKind.Structure, identifier: props.identifier }]
          }
        ]
      }
    },
    skip: !props.identifier || !props.object
  });

  const { assign } = useAssignWithCallback({
    onDone: () => {
      props.refetch();
    }
  });
  const { openDialog } = useDialog();
  const [loading, setLoading] = useState(false);

  const onEnhance = async (action: PrimaryActionFragment) => {
    const key = action.args?.at(0)?.key;
    if (!key) return;

    const unknownKeys = action.args.filter((arg) => arg.key && arg.key !== key && arg.nullable == false);
    if (unknownKeys.length > 0) {
      openDialog("actionassign", {
        id: action.id,
        args: { [key]: props.object },
      });
      return;
    }

    try {
      setLoading(true);
      await assign({
        action: action.id,
        args: {
          [key]: props.object
        }
      })
      toast.success("Enhancement started");
    } catch (e) {
      console.error(e);
      toast.error("Failed to start enhancement");
    } finally {
      setLoading(false);
    }
  }

  if (!enhanceActions?.actions.length) return null;

  const actions = enhanceActions.actions;

  if (actions.length === 1) {
    return (
      <div className="p-[1px] rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-flex items-center justify-center shrink-0">
        <Button
          onClick={() => onEnhance(actions[0])}
          variant="ghost"
          size="icon"
          className="bg-background hover:bg-secondary/80 w-8 h-8 rounded-[5px] shrink-0"
          disabled={loading}
        >
          <Sparkles className={`w-4 h-4 text-purple-500 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    )
  }

  return (
    <div className="p-[1px] rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-flex items-center justify-center shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background hover:bg-secondary/80 w-8 h-8 rounded-[5px] shrink-0"
            disabled={loading}
          >
            <Sparkles className={`w-4 h-4 text-purple-500 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {actions.map(action => (
            <DropdownMenuItem key={action.id} onSelect={() => onEnhance(action)}>
              {action.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
