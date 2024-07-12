import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";

export const DeployButton = (props: {
  flow: FlowFragment;
  agent: ListAgentFragment;
}) => {
  const { data } = useTemplateAtQuery({
    variables: {
      agent: props.agent.id,
      extension: "reaktion",
      interface: props.flow.id,
    },
  });

  const [deploy] = useCreateForeignTemplateMutation({
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

  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        console.log(
          deploy().then((result) => {
            result?.data &&
              navigate(
                RekuestTemplate.linkBuilder(
                  result?.data?.createForeignTemplate.id,
                ),
              );
          }),
        );
      }}
    >
      Deploy on {props.agent.id} {data?.templateAt ? "Update" : "Create"}
    </Button>
  );
};

export const DeployInterfaceButton = (props: { flow: FlowFragment }) => {
  const { data } = useAgentsQuery({
    variables: {
      filters: {
        extensions: ["reaktion"],
      },
    },
  });

  return (
    <Popover>
      <PopoverTrigger>
        <Button>Deploy</Button>
      </PopoverTrigger>
      <PopoverContent>
        {data?.agents.map((agent) => (
          <>
            <DeployButton agent={agent} flow={props.flow} />
          </>
        ))}
      </PopoverContent>
    </Popover>
  );
};
