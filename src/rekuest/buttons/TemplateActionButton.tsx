import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  TemplateAssignForm,
  TemplateAssignFormProps,
} from "../forms/TemplateAssignForm";

export const TemplateActionButton = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & TemplateAssignFormProps) => {
  return (
    <>
      <>
        <Dialog>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="text-white">
            <TemplateAssignForm {...props} />
          </DialogContent>
        </Dialog>
      </>
    </>
  );
};
