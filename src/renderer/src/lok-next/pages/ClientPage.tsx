import { useDialog } from "@/app/dialog";
import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokClient, LokComputeNode, LokServiceInstance, RekuestAssignation } from "@/linkers";
import {
  AssignationEventKind,
  PostmanAssignationFragment,
  useListAssignationsDetailsQuery,
} from "@/rekuest/api/graphql";
import {
  AlertTriangle,
  Bug,
  ExternalLink,
  Link as LinkIcon,
  Server,
  User,
} from "lucide-react";
import { useDetailClientQuery } from "../api/graphql";

const FailedTasks = ({ clientId }: { clientId: string }) => {
  const { openDialog } = useDialog();

  const { data } = useListAssignationsDetailsQuery({
    variables: {
      filter: {
        clientId: clientId,
        state: [AssignationEventKind.Critical],
      },
    },
  });

  if (!data?.tasks?.length) return null;

  const handleReportBug = (assignation: PostmanAssignationFragment) => {
    openDialog("reportbug", {
      assignationId: assignation.id,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-red-500 font-medium">
        <AlertTriangle className="h-5 w-5" />
        <h3>Critical Failures</h3>
      </div>
      <div className="border rounded-md divide-y">
        {data.tasks.map((ex, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
          >
            <RekuestAssignation.DetailLink object={ex.id} className="flex flex-col gap-1">
              <div className="font-medium flex items-center gap-2">
                {ex.action.name}
                <Badge variant="destructive" className="text-[10px] h-5">
                  CRITICAL
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {ex.id}
              </div>
            </RekuestAssignation.DetailLink>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => handleReportBug(ex)}
            >
              <Bug className="h-4 w-4 mr-2" />
              Report
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default asDetailQueryRoute(useDetailClientQuery, ({ data }) => {
  const resolve = useResolve();
  const { openDialog } = useDialog();

  const handleReportClientBug = () => {
    openDialog("reportclientbug", {
      client: data.client,
      issueUrl: data.client.issueUrl || undefined,
    });
  };

  const pressLink = (url: string) => {
    window.api.openWebbrowser(url);
  };

  return (
    <LokClient.ModelPage
      object={data.client.id}
      pageActions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReportClientBug}
            className="gap-2"
          >
            <Bug className="h-4 w-4" />
            Report Bug
          </Button>
          {data.client.publicSources?.map((source, index) => (
            <Button
              key={index}
              onClick={() => pressLink(source.url)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {source.kind}
            </Button>
          ))}
        </>
      }
      title={data?.client?.release.app.identifier}
    >
      <div className="space-y-8 p-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex gap-6">
            {data.client.logo?.presignedUrl && (
              <div className="h-24 w-24 shrink-0 rounded-xl overflow-hidden border bg-muted shadow-sm">
                <Image
                  src={resolve(data?.client?.logo.presignedUrl)}
                  className="object-contain w-full h-full"
                  alt="Client Logo"
                />
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight">
                  {data.client.release.app.identifier}
                </h1>
                <Badge variant="secondary" className="text-sm px-2 py-0.5">
                  v{data.client.release.version}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>@{data.client.user?.username || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  {data.client.node ? (
                    <LokComputeNode.DetailLink
                      object={data.client.node.id}
                      className="hover:underline font-medium"
                    >
                      {data.client.node.name}
                    </LokComputeNode.DetailLink>
                  ) : (
                    "Unassigned"
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                    {data.client.oauth2Client.clientId}
                  </span>
                </div>
              </div>


            </div>
          </div>
        </div>

        <Separator />

        {/* Connected Services Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Connected Services
            </h3>
            <span className="text-sm text-muted-foreground">
              {data.client.mappings.length} services linked
            </span>
          </div>

          {data.client.mappings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.client.mappings.map((mapping) => (
                <div
                  key={mapping.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {mapping.key}
                    </span>
                    <LokServiceInstance.DetailLink
                      object={mapping.instance.id}
                      className="font-medium hover:underline flex items-center gap-2"
                    >
                      {mapping.instance.identifier}
                    </LokServiceInstance.DetailLink>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
              No services connected to this client.
            </div>
          )}
        </div>

        {/* Failed Tasks Section */}
        <FailedTasks clientId={data.client.oauth2Client.clientId} />
      </div>
    </LokClient.ModelPage>
  );
});
