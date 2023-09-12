import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
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
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { useConstantNodeQuery } from "@/rekuest/api/graphql";
import { usePostman, withRekuest } from "@jhnnsrs/rekuest-next";
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
    <ModelPageLayout identifier="@rekuest/node" object={props.id}>
      <DetailPane>
        <DetailPaneHeader>
          <DetailPaneTitle>{data?.node?.name}</DetailPaneTitle>
          <DetailPaneDescription>
            {data?.node?.description}
          </DetailPaneDescription>
        </DetailPaneHeader>

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
      </DetailPane>
    </ModelPageLayout>
  );
};

function Page() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>Missing id</div>;
  }

  return (
    <>
      <NodeInfo id={id} />
    </>
  );
}

export default Page;
