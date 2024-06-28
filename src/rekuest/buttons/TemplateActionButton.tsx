import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { TemplateAssignForm } from "../forms/TemplateAssignForm";

export const TemplateActionButton = (props: {
  id: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <>
        <Dialog>
          <DialogTrigger asChild>{props.children}</DialogTrigger>
          <DialogContent className="text-white">
            <TemplateAssignForm id={props.id} />
          </DialogContent>
        </Dialog>
      </>
    </>
  );
};
