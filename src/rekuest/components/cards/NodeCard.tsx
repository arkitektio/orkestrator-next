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
import {
  AssignNodeQuery,
  ListNodeFragment,
  useDetailNodeQuery,
} from "@/rekuest/api/graphql";
import {
  ActionAssignVariables,
  useAction,
  useUsage,
} from "@/rekuest/hooks/useNode";
import { usePortForm } from "@/rekuest/hooks/usePortForm";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { NodeDescription } from "@jhnnsrs/rekuest";
import { withRekuest } from "@jhnnsrs/rekuest-next";

interface Props {
  node: ListNodeFragment;
  mates?: MateFinder[];
}

export const DoForm = (props: {
  node: AssignNodeQuery["node"];
  assign: (data: ActionAssignVariables) => void;
}) => {
  const form = usePortForm({
    ports: props.node.args || [],
  });

  const { formState, watch } = form;

  const thedata = watch();

  const onSubmit = (data: any) => {
    console.log("Submitting");
    console.log(data);
    props.assign({
      node: props.node.id,
      args: data,
      hooks: [],
    });
  };

  const { registry } = useWidgetRegistry();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <ArgsContainer
            registry={registry}
            ports={props.node.args || []}
            path={[]}
          />
          <DialogFooter>
            <Button type="submit" className="btn">
              {" "}
              Submit{" "}
            </Button>
          </DialogFooter>
          {JSON.stringify(thedata)}
        </form>
      </Form>
    </>
  );
};

export const ActionButton = (props: { node: ListNodeFragment }) => {
  const { assign, latestAssignation, cancel, node } = useAction({
    hash: props.node.hash,
  });

  return (
    <>
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button> Do </Button>
          </DialogTrigger>
          <DialogContent className="text-white">
            {node && <DoForm node={node} assign={assign} />}
          </DialogContent>
        </Dialog>
      </>
    </>
  );
};

const TheCard = ({ node, mates }: Props) => {
  const reserveMate = useReserveMate();

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
