import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RekuestAssignation, RekuestImplementation } from "@/linkers";
import { FlowFragment } from "@/reaktion/api/graphql";
import { flowToDefinition, flowToDependencies } from "@/reaktion/utils";
import {
  ListAgentFragment,
  ImplementationsDocument,
  useCreateForeignImplementationMutation,
  useImplementationAtQuery,
  useImplementationsQuery,
} from "@/rekuest/api/graphql";
import { ImplementationActionButton } from "@/rekuest/buttons/ImplementationActionButton";
import { useNavigate } from "react-router-dom";

export const DeployButton = (props: {
  flow: FlowFragment;
  agent: ListAgentFragment;
}) => {
  const { data } = useImplementationAtQuery({
    variables: {
      agent: props.agent.id,
      extension: "reaktion",
      interface: props.flow.id,
    },
  });

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
            result?.data &&
              navigate(
                RekuestImplementation.linkBuilder(
                  result?.data?.createForeignImplementation.id,
                ),
              );
          }),
        );
      }}
      variant={"outline"}
    >
      Deploy on {props.agent.name}
    </Button>
  );
};

export const RunButton = (props: { flow: FlowFragment }) => {
  const { data } = useImplementationsQuery({
    variables: {
      filters: {
        extension: "reaktion",
        parameters: [
          {
            key: "flow",
            value: props.flow.id,
          },
        ],
      },
    },
  });

  const navigate = useNavigate();

  const navigateToTemplate = (ass: { id: string }) => {
    navigate(RekuestAssignation.linkBuilder(ass.id));
  };

  return (
    <>
      {data?.implementations && data.implementations.length > 1 && (
        <Popover>
          <PopoverTrigger>
            <Button>Run</Button>
          </PopoverTrigger>
          <PopoverContent>
            {data?.implementations.map((template) => (
              <>
                <ImplementationActionButton id={template.id}>
                  <Button>Run on {template.agent.name} </Button>
                </ImplementationActionButton>
              </>
            ))}
          </PopoverContent>
        </Popover>
      )}
      {data?.implementations && data.implementations.length == 1 && (
        <>
          <ImplementationActionButton
            id={data.implementations.at(0)?.id}
            onAssign={navigateToTemplate}
          >
            <Button>Run on {data.implementations.at(0)?.agent.name} </Button>
          </ImplementationActionButton>
        </>
      )}
    </>
  );
};
