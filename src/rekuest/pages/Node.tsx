import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
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
import { TestConstants } from "@/reaktion/base/Constants";
import {
  NodeKind,
  useConstantNodeQuery,
  useDetailNodeQuery,
} from "@/rekuest/api/graphql";
import { portToLabel, usePostman, withRekuest } from "@jhnnsrs/rekuest-next";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import TemplateCard from "../components/cards/TemplateCard";
import ReservationCard from "../components/cards/ReservationCard";

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

export default asDetailQueryRoute(
  withRekuest(useDetailNodeQuery),
  ({ data }) => {
    const copyHashToClipboard = useCallback(() => {
      navigator.clipboard.writeText(data?.node?.hash || "");
    }, [data?.node?.hash]);

    return (
      <ModelPageLayout
        identifier="@rekuest/node"
        title={data.node.name}
        object={data.node.id}
      >
        <DetailPane>
          <DetailPaneHeader>
            <DetailPaneTitle
              actions={
                <Button
                  variant={"outline"}
                  onClick={copyHashToClipboard}
                  title="Copy to clipboard"
                >
                  <ClipboardIcon />
                </Button>
              }
            >
              {data?.node?.name}
            </DetailPaneTitle>
            <DetailPaneDescription>
              {data?.node?.description}
              <div className="rounded shadow-md mt-2">
                {data?.node?.args && data?.node.args.length > 0 && (
                  <div className="font-light mb-1"> Arguments </div>
                )}
                <div className="flex flex-col gap-2">
                  {data?.node?.args?.map(portToLabel)}
                </div>
                {data?.node?.returns && data?.node.returns.length > 0 && (
                  <div className="font-light mt-3 mb-1">
                    {" "}
                    {data?.node?.kind == NodeKind.Function
                      ? "Returns"
                      : "Streams"}{" "}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {data?.node?.returns?.map(portToLabel)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {data?.node?.protocols?.map((p) => p.name)}
              </div>
            </DetailPaneDescription>
            <TestConstants ports={data?.node?.args || []} overwrites={{}} />
            <ListRender array={data?.node?.templates} title="Implementations">
              {(template, key) => <TemplateCard item={template} key={key} />}
            </ListRender>
            <ListRender array={data?.node?.reservations} title="Reservations">
              {(item, key) => <ReservationCard item={item} key={key} />}
            </ListRender>
          </DetailPaneHeader>

          <Dialog>
            <DialogTrigger>Reserve</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reserve</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
                <ReserveForm node={data.node.id} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </DetailPane>
      </ModelPageLayout>
    );
  },
);
