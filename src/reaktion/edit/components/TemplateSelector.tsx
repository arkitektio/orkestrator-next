import { Button } from "@/components/ui/button";
import { useTemplatesQuery } from "@/rekuest/api/graphql";

export const TemplateSelector = (props: {
  node: string;
  hash: string;
  onClick: (node: string, template: string) => void;
}) => {
  const { data } = useTemplatesQuery({
    variables: {
      filters: {
        nodeHash: props.hash,
      },
    },
  });

  return (
    <>
      {data?.templates?.map((template) => (
        <Button
          onClick={() => props.onClick(props.node, template.id)}
          className="px-2 py-1  rounded-full rounded"
        >
          {template.agent.name}
        </Button>
      ))}
    </>
  );
};
