import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FlowFragment } from "@/reaktion/api/graphql";
import { flowToDefinition, flowToDependencies } from "@/reaktion/utils";
import {
  ImplementationsDocument,
  ListAgentFragment,
  useAgentsQuery,
  useCreateForeignImplementationMutation,
} from "@/rekuest/api/graphql";
import { useNavigate } from "react-router-dom";

export const DeployButton = (props: {
  flow: FlowFragment;
  agent: ListAgentFragment;
}) => {
  const [deploy] = useCreateForeignImplementationMutation({
    variables: {
      input: {
        agent: props.agent.id,
        extension: "reaktion",
        implementation: {
          definition: flowToDefinition(props.flow),
          dependencies: flowToDependencies(props.flow),
          interface: props.flow.id,
          params: {
            flow: props.flow.id,
          },
        },
      },
    },
    refetchQueries: [ImplementationsDocument],
  });

  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        console.log(
          deploy().then((result) => {
            result?.data;
          }),
        );
      }}
      variant={"outline"}
    >
      Deploy on {props.agent.name}
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
