import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { RekuestNode } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import { ListNodeFragment, useDetailNodeQuery } from "@/rekuest/api/graphql";
import { useAction, useUsage } from "@/rekuest/hooks/useNode";
import { usePortForm } from "@/rekuest/hooks/usePortForm";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { NodeDescription } from "@jhnnsrs/rekuest";
import { withRekuest } from "@jhnnsrs/rekuest-next";

interface Props {
  node: ListNodeFragment;
  mates?: MateFinder[];
}

export const DoForm = (props: {
  node: ListNodeFragment;
  assign: (data: any) => void;
}) => {
  const { data } = withRekuest(useDetailNodeQuery)({
    variables: {
      id: props.node.id,
    },
  });

  const form = usePortForm({
    ports: data?.node.args || [],
  });

  const onSubmit = (data: any) => {
    console.log(data);
    props.assign(data);
  };

  const { registry } = useWidgetRegistry();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <ArgsContainer
            registry={registry}
            ports={data?.node.args || []}
            path={[]}
          />
          <DialogFooter>
            <Button type="submit" className="btn">
              {" "}
              Submit{" "}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export const ActionButton = (props: { node: ListNodeFragment }) => {
  const {
    assign,
    latestAssignation,
    latestReservation,
    reserve,
    unreserve,
    cancel,
  } = useAction({
    hash: props.node.hash,
  });

  return (
    <>
      {latestReservation ? (
        <>
          {!latestAssignation ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button> Do </Button>
              </DialogTrigger>
              <DialogContent className="text-white">
                <DoForm node={props.node} assign={assign} />
              </DialogContent>
            </Dialog>
          ) : (
            <Button onClick={cancel}> Cancel</Button>
          )}
          <Button onClick={unreserve}> Do no longer use </Button>
        </>
      ) : (
        <>
          <Button onClick={reserve}> Use </Button>
        </>
      )}
    </>
  );
};

const TheCard = ({ node, mates }: Props) => {
  const reserveMate = useReserveMate();

  const [isUsed, toggle] = useUsage({ hash: node.hash });

  return (
    <RekuestNode.Smart object={node?.id} mates={[reserveMate]}>
      <Card className="group">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>
              <RekuestNode.DetailLink object={node?.id}>
                {" "}
                {node.name}
              </RekuestNode.DetailLink>
            </CardTitle>
            <CardDescription>
              {node?.description && (
                <NodeDescription description={node?.description} />
              )}
            </CardDescription>
          </div>
          <CardTitle>
            <ActionButton node={node} />
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestNode.Smart>
  );
};

export default TheCard;
