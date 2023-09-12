import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  ReserveRequest,
  useReserver,
} from "@/providers/reserver/ReserverContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const ResolveReserveOnce = ({
  request,
}: {
  request: ReserveRequest;
}) => {
  const { resolve, reject } = useReserver();

  const form = useForm({
    defaultValues: {
      ...request.variables,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            console.log("submitting", data);
            await resolve({ ...request, variables: data });
          })}
        >
          <DialogFooter className="mt-2">
            <Button type="submit">Reserve</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export const ReserveResolver: React.FC<{}> = () => {
  const { pending, resolve } = useReserver();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pending.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [pending]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <div className="border p-1">
          {pending.slice(-1).map((p) => (
            <ResolveReserveOnce key={p.id} request={p} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
