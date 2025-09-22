import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ActionAssignForm } from "../forms/ActionAssignForm";

export const ActionButton = (props: {
  id: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <>
        <Dialog>
          <DialogTrigger asChild>{props.children}</DialogTrigger>
          <DialogContent className="text-white">
            <ActionAssignForm id={props.id} />
          </DialogContent>
        </Dialog>
      </>
    </>
  );
};
