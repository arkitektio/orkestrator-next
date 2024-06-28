import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { NodeAssignForm } from "../forms/NodeAssignForm";

export const NodeActionButton = (props: {
  id: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <>
        <Dialog>
          <DialogTrigger asChild>{props.children}</DialogTrigger>
          <DialogContent className="text-white">
            <NodeAssignForm id={props.id} />
          </DialogContent>
        </Dialog>
      </>
    </>
  );
};
