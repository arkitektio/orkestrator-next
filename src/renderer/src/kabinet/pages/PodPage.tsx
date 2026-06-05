import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { KabinetPod } from "@/linkers";
import {
  ListImplementationFragment,
  useAgentsQuery,
  useImplementationsQuery,
} from "@/rekuest/api/graphql";
import { useImplementationAction } from "@/rekuest/hooks/useImplementationAction";
import {
  DemandKind,
  PodFragment,
  PortKind,
  useGetPodQuery,
} from "../api/graphql";
import ResourceCard from "../components/cards/ResourceCard";

export const AssignButton = (props: {
  template: ListImplementationFragment;
  pod: string;
  refetch: () => void;
}) => {
  const { assign } = useImplementationAction({
    id: props.template.id,
  });

  const doassign = async () => {
    console.log(
      await assign({
        cached: false,
        capture: false,
        ephemeral: false,
        log: false,
        args: {
          pod: { __identifier: KabinetPod.identifier, object: props.pod },
        },
      }),
      props.refetch(),
    );
  };

  return (
    <Button onClick={doassign} variant="outline" size="sm">
      {props.template.action.name}
    </Button>
  );
};

const RefreshLogsButton = (props: {
  pod: PodFragment;
  agentId: string;
  refetch: () => void;
}) => {
  const { data } = useImplementationsQuery({
    variables: {
      filters: {
        agent: {
          ids: [props.agentId],
        },
        action: {
          demands: [
            {
              kind: DemandKind.Args,
              matches: [
                {
                  key: "pod",
                  kind: PortKind.Structure,
                  identifier: "@kabinet/pod",
                },
              ],
            },
          ],
        },
      },
    },
  });

  return (
    <div className="flex flex-row gap-2">
      {data?.implementations.map((implementation) => (
        <Tooltip key={implementation.id}>
          <TooltipTrigger asChild>
            <div>
              <AssignButton
                template={implementation}
                pod={props.pod.id}
                refetch={props.refetch}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2 text-sm">
              Refresh logs on {props.pod.backend.name}
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export const AgentButtons = (props: {
  pod: PodFragment;
}) => {
  const { data, error } = useAgentsQuery({
    variables: {
      filters: {
        clientId: props.pod.backend.clientId,
      },
    },
  });

  if (error) {
    return <div>Error loading agent {error.message}</div>;
  }

  return (
    <>
      {data?.agents.map((agent) => (
        <RefreshLogsButton
          key={agent.id}
          pod={props.pod}
          agentId={agent.id}
          refetch={() => {}}
        />
      ))}
    </>
  );
};

const PodPage = asDetailQueryRoute(useGetPodQuery, ({ data }) => {
  const pod = data.pod;

  return (
    <KabinetPod.ModelPage
      title={pod.backend.name}
      object={pod}
      pageActions={<AgentButtons pod={pod} />}
    >
      <div className="space-y-6 p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <div className="space-y-4 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                <span>{pod.deployment.flavour.release.app.identifier}</span>
                <span>•</span>
                <span>{pod.deployment.flavour.release.version}</span>
              </div>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {pod.backend.name}
              </h1>
              <CardDescription className="max-w-2xl text-base leading-7">
                Live pod for {pod.deployment.flavour.release.app.identifier} on{" "}
                {pod.backend.name}. The log stream and deployment details below
                summarise the current runtime state.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {pod.deployment.flavour.release.app.identifier}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {pod.deployment.flavour.release.version}
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {pod.status || "Unknown status"}
              </Badge>
            </div>
          </div>

          <Card className="border-dashed bg-muted/20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Facts</CardTitle>
              <CardDescription>Current pod runtime details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <div className="text-muted-foreground">Backend</div>
                <div className="font-medium break-all">{pod.backend.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Flavour</div>
                <div className="font-medium break-all">
                  {pod.deployment.flavour.release.id}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Release</div>
                <div className="font-medium break-all">
                  {pod.deployment.flavour.release.id}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Resource</div>
                <div className="font-medium break-all">
                  {pod.resource?.name || "No resource attached"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Latest Logs</CardTitle>
              <CardDescription>
                The newest log dump emitted by this pod.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="max-h-[28rem] overflow-auto rounded-2xl bg-muted/30 p-4 text-xs leading-6 whitespace-pre-wrap break-words">
                {pod.latestLogDump?.logs || "No logs available yet."}
              </pre>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {pod.resource && (
              <Card>
                <CardHeader>
                  <CardTitle>Running On</CardTitle>
                  <CardDescription>
                    The resource currently hosting this pod.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <ResourceCard item={pod.resource} />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Deployment Path</CardTitle>
                <CardDescription>
                  The release and flavour stack used for this pod.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">App</div>
                  <div className="font-medium break-all">
                    {pod.deployment.flavour.release.app.identifier}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Release</div>
                  <div className="font-medium break-all">
                    {pod.deployment.flavour.release.version}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Backend</div>
                  <div className="font-medium break-all">{pod.backend.name}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </KabinetPod.ModelPage>
  );
});

export default PodPage;
