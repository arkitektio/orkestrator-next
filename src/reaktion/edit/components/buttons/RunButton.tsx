import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RekuestAssignation, RekuestTemplate } from "@/linkers";
import { FlowFragment } from "@/reaktion/api/graphql";
import { flowToDefinition, flowToDependencies } from "@/reaktion/utils";
import {
  ListAgentFragment,
  TemplatesDocument,
  useCreateForeignTemplateMutation,
  useTemplateAtQuery,
  useTemplatesQuery,
} from "@/rekuest/api/graphql";
import { TemplateActionButton } from "@/rekuest/buttons/TemplateActionButton";
import { useNavigate } from "react-router-dom";

export const DeployButton = (props: {
  flow: FlowFragment;
  agent: ListAgentFragment;
}) => {
  const { data } = useTemplateAtQuery({
    variables: {
      agent: props.agent.id,
      extension: "reaktion_next",
      interface: props.flow.id,
    },
  });

  const [deploy] = useCreateForeignTemplateMutation({
    variables: {
      input: {
        agent: props.agent.id,
        extension: "reaktion_next",
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
    refetchQueries: [TemplatesDocument],
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
      variant={"outline"}
    >
      Deploy on {props.agent.name}
    </Button>
  );
};

export const RunButton = (props: { flow: FlowFragment }) => {
  const { data } = useTemplatesQuery({
    variables: {
      filters: {
        extension: "reaktion_next",
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
      {data?.templates && data.templates.length > 1 && (
        <Popover>
          <PopoverTrigger>
            <Button>Run</Button>
          </PopoverTrigger>
          <PopoverContent>
            {data?.templates.map((template) => (
              <>
                <TemplateActionButton id={template.id}>
                  <Button>Run on {template.agent.name} </Button>
                </TemplateActionButton>
              </>
            ))}
          </PopoverContent>
        </Popover>
      )}
      {data?.templates && data.templates.length == 1 && (
        <>
          <TemplateActionButton
            id={data.templates.at(0).id}
            onAssign={navigateToTemplate}
          >
            <Button>Run on {data.templates.at(0).agent.name} </Button>
          </TemplateActionButton>
        </>
      )}
    </>
  );
};
