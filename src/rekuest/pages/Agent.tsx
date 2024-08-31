import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RekuestAgent } from "@/linkers";
import { ListTemplateFragment, useAgentQuery } from "@/rekuest/api/graphql";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { BellIcon } from "lucide-react";
import { TemplateActionButton } from "../buttons/TemplateActionButton";
import TemplateCard from "../components/cards/TemplateCard";
import { RenderPlugins } from "../remote/Plugin";

export const sizer = (length: number, index: number): string => {
  const divider = 3;

  return (index || 1) % 3 == 0 && index != 0
    ? "col-span-2 row-span-1"
    : "col-span-1 row-span-1";
};

const TemplateBentoCard = ({
  template,
  className,
}: {
  template: ListTemplateFragment;
  className: string;
}) => (
  <div
    key={template.id}
    className={cn(
      "group relative  flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] ",
      // dark styles
      "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
  >
    <div>
      <img className="absolute -right-20 -top-20 opacity-60" />
    </div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-40 cursor-pointer">
      <BellIcon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
        {template.node.name}
      </h3>
      <p className="max-w-lg text-neutral-400"> @{template.interface}</p>
    </div>

    <div
      className={cn(
        "absolute bottom-0 flex w-full translate-y-[100%] flex-col items-start p-6 opacity-100 transition-all duration-300 group-hover:translate-y-0 ",
      )}
    >
      <p className="max-w-lg text-neutral-400"> {template.node.description}</p>
      <TemplateActionButton id={template.id}>
        <Button
          variant="ghost"
          asChild
          size="sm"
          className="cursor-pointer opacity-100"
        >
          <a>
            Assign
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </TemplateActionButton>
    </div>
  </div>
);

export default asDetailQueryRoute(useAgentQuery, ({ data, refetch }) => {
  const stateAction = data.agent.defaults.find(
    (x) => x.interface == "__state__",
  );

  return (
    <RekuestAgent.ModelPage title={data.agent.name} object={data.agent.id}>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {data?.agent.name}
      </h1>

      <p className="mt-3 text-xl text-muted-foreground">
        Is running as {data?.agent?.instanceId}
      </p>
      <p className="mt-3 text-xl text-muted-foreground">
        {data?.agent?.extensions.map((ext) => ext).join(", ")}
      </p>

      <ListRender array={data.agent.defaults} title="Registered Functions">
        {(item) => <TemplateCard item={item} />}
      </ListRender>
      <ListRender array={data.agent.workflows} title="Registered Workflows">
        {(item) => <TemplateCard item={item} />}
      </ListRender>
    </RekuestAgent.ModelPage>
  );
});
