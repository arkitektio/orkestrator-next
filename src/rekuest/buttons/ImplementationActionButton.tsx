import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  ImplementationAssignForm,
  ImplementationAssignFormProps,
} from "../forms/ImplementationAssignForm";

export const ImplementationActionButton = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & ImplementationAssignFormProps) => {
  return (
    <>
      <>
        <Dialog>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="text-white max-w-3xl w-full">
            <ImplementationAssignForm {...props} />
          </DialogContent>
        </Dialog>
      </>
    </>
  );
};
