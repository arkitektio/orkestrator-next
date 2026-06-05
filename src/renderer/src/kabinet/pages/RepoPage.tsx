import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KabinetFlavour, KabinetRepo } from "@/linkers";
import { ExternalLink, GitBranch, Github, ShieldAlert } from "lucide-react";
import { useGetRepoQuery } from "../api/graphql";
import FlavourCard from "../components/cards/FlavourCard";

const RepoPage = asDetailQueryRoute(useGetRepoQuery, ({ data, refetch }) => {
  const repo = data.repo;

  return (
    <KabinetRepo.ModelPage
      title={repo.name}
      object={repo}
      refetch={refetch}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KabinetRepo.Komments object={repo} />,
          }}
        />
      }
      pageActions={
        <div className="flex flex-row gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={repo.url} target="_blank" rel="noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Open Repo
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={repo.issueUrl} target="_blank" rel="noreferrer">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Issues
            </a>
          </Button>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-4 space-y-4">
            <div>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {repo.name}
              </h1>
              <p className="mt-3 text-xl text-muted-foreground flex items-center gap-2">
                <Github className="h-4 w-4" />
                {repo.user}/{repo.repo}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="gap-1 rounded-full px-2 py-0.5">
                <GitBranch className="h-3 w-3" />
                {repo.branch}
              </Badge>
              <span>Added {new Date(repo.addedAt).toLocaleString()}</span>
              <span>Updated {new Date(repo.updatedAt).toLocaleString()}</span>
            </div>
          </div>
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Flavours</div>
                  <div className="font-medium">{repo.flavours.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Default Branch</div>
                  <div className="font-medium">{repo.branch}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Repository</div>
                  <div className="font-medium break-all">{repo.user}/{repo.repo}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ListRender
          array={repo.flavours}
          title={
            <KabinetFlavour.ListLink className="flex-0 mb-5">
              <h2 className="text-2xl font-bold">Flavours</h2>
              <div className="text-muted-foreground text-xs mb-3">
                {repo.flavours.length} flavours discovered in this repository
              </div>
            </KabinetFlavour.ListLink>
          }
          refetch={refetch}
        >
          {(flavour) => <FlavourCard key={flavour.id} item={flavour} />}
        </ListRender>

        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              {repo.url}
            </a>
            <a
              href={repo.issueUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              {repo.issueUrl}
            </a>
          </CardContent>
        </Card>
      </div>
    </KabinetRepo.ModelPage>
  );
});

export default RepoPage;
