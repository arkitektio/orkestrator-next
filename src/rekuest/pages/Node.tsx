import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useConstantNodeQuery } from "@/rekuest/api/graphql";
import { EasyGuard } from "@jhnnsrs/arkitekt";
import { RekuestGuard, usePostman, withRekuest } from "@jhnnsrs/rekuest-next";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

export const ReserveForm = (props: { node: string }) => {
  const { reserve } = usePostman();

  const form = useForm({
    defaultValues: {
      node: props.node,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((value) => {
            reserve(value);
          })}
          className="space-y-6"
        >
          <Button type="submit">Reserve</Button>
        </form>
      </Form>
    </>
  );
};

export const NodeInfo = (props: { id: string }) => {
  const { data } = withRekuest(useConstantNodeQuery)({
    variables: {
      id: props.id,
    },
  });

  return (
    <>
      <h1 className="text-2xl font-bold">{data?.node?.__typename}</h1>
      <Dialog>
        <DialogTrigger>Reserve</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
            <ReserveForm node={props.id} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

function Page() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>Missing id</div>;
  }

  return (
    <>
      <EasyGuard>
        <RekuestGuard>
          <NodeInfo id={id} />
        </RekuestGuard>
      </EasyGuard>
    </>
  );
}

export default Page;
