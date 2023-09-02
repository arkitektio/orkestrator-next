import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { PortFragment } from "@/rekuest/api/graphql";
import { usePortForm } from "@/rekuest/hooks/usePortForm";
import { useWidgetRegistry } from "@jhnnsrs/rekuest-next";

export const Constants = (props: {
  ports: PortFragment[];
  overwrites: { [key: string]: any };
  onClick?: (instream: number, onposition: number) => void;
}) => {
  const form = usePortForm({
    ports: props.ports,
    overwrites: props.overwrites,
  });

  function onSubmit(data: any) {
    console.log(data);
  }

  const { registry } = useWidgetRegistry();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, () => {
            toast({
              title: "Error",
              description: "Something went wrong",
            });
          })}
          className="space-y-6 mt-4"
        >
          <ArgsContainer registry={registry} ports={props.ports} />
        </form>
      </Form>
    </>
  );
};
