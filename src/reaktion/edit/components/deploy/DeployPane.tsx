import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RekuestTemplate } from "@/linkers";
import { FlowFragment } from "@/reaktion/api/graphql";
import { flowToDefinition, flowToDependencies } from "@/reaktion/utils";
import {
  ListAgentFragment,
  useAgentsQuery,
  useCreateForeignTemplateMutation,
  useTemplateAtQuery,
} from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { set } from "date-fns";
import React from "react";
import { useNavigate } from "react-router-dom";

export const DeployButton = (props: {
  flow: FlowFragment;
  agent: ListAgentFragment;
}) => {
  const { data } = withRekuest(useTemplateAtQuery)({
    variables: {
      agent: props.agent.id,
      extension: "reaktion",
      interface: props.flow.id,
    },
  });

  const [deploy, tdata] = withRekuest(useCreateForeignTemplateMutation)({
    variables: {
      input: {
        agent: props.agent.id,
        extension: "reaktion",
        template: {
          definition: flowToDefinition(props.flow),
          dependencies: flowToDependencies(props.flow),
          interface: props.flow.id,
          params: {
            flow: props.flow.id,
          },
        },
      },
    },
  });

  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  return (
    <>
      <Button
        onClick={() => {
          console.log(
            deploy().then((result) => {
              result?.data;
              setOpen(true);
            }),
          );
        }}
      >
        Run and Deploy {}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div>
            <p>Template created</p>
            <Button
              onClick={() =>
                navigate(
                  RekuestTemplate.linkBuilder(
                    tdata?.data?.createForeignTemplate.id,
                  ),
                )
              }
            >
              Go to template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const DeployPane = (props: { flow: FlowFragment }) => {
  const { data } = withRekuest(useAgentsQuery)({
    variables: {
      filters: {
        extensions: ["reaktion"],
      },
    },
  });

  return (
    <>
      {data?.agents.map((agent) => (
        <>
          <DeployButton agent={agent} flow={props.flow} />
        </>
      ))}
    </>
  );
};
