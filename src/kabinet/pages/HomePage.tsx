import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";

import { asParamlessRoute } from "@/app/routes/ParamlessRoute";
import { CommandMenu } from "@/command/Menu";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Database,
  Network,
  ShoppingBasket,
  TrendingUp,
} from "lucide-react";
import {
  ListDefinitionsDocument,
  ListReleasesDocument,
  useHomePageQuery,
  useRescanReposMutation,
} from "../api/graphql";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { CreateRepoForm } from "../forms/CreateRepoForm";
import { ActionButton } from "@/components/ui/action";
import { Button } from "@/components/ui/button";
import { PopularCarousel } from "../components/PopularCarousel";
import DefinitionList from "../components/lists/DefinitionList";
import ReleasesList from "../components/lists/ReleasesList";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { HomePageStatisticsSidebar } from "../sidebars/HomePageStatisticsSidebar";
import { HelpSidebar } from "@/components/sidebars/help";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Page = asParamlessRoute(useHomePageQuery, ({ data }: { data: any }) => {
  const [rescan, { loading }] = useRescanReposMutation({
    refetchQueries: [ListReleasesDocument, ListDefinitionsDocument],
  });
  return (
    <PageLayout
      sidebars={
        <MultiSidebar map={{
          Statistics: <HomePageStatisticsSidebar />,
          Help: <HelpSidebar />
        }} />
      }
      pageActions={
        <div className="flex flex-row gap-1">
          <>
            <FormDialogAction
              label="Add Repo"
              variant="outline"
              size="sm"
              onSubmit={(item) => {
                console.log(item);
              }}
            >
              <CreateRepoForm />
            </FormDialogAction>
          </>

          <ActionButton
            label="Rescan Repos"
            run={async () => {
              await rescan();
            }}
            variant="outline"
            size="sm"
          >
            {loading ? "Rescanning..." : "Rescan Repos"}
          </ActionButton>
        </div>
      }
      title="Home"
    >
      <CommandMenu />

      {data?.repos?.length == 0 ? (
        // Empty State with Hero Design
        <div className="min-h-full w-full bg-gradient-to-br from-slate-50/20 to-slate-100/20 dark:from-slate-900/30 dark:to-slate-800/30 flex items-center justify-center rounded-lg">
          <div className="max-w-4xl mx-auto text-center px-6 py-16">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-200/20 dark:border-blue-700/20">
                  <ShoppingBasket className="h-16 w-16 text-blue-500" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to Kabinet
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Your personal organization wide app-store. That allows you to
                install and manage apps directly from your GitHub repositories.
              </p>
            </div>

            {/* Action Section */}
            <div className="mt-12 space-y-6">
              <div className="space-y-4">
                <Button variant="primary" size="lg" onClick={() => { }}>
                  Add your first Repo
                </Button>
              </div>
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Visualize Images</span>
                </div>
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  <span>Explore Stages</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analyze Tables</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Dashboard View with Data
        <div className="space-y-8 p-3">
          {/* Welcome Header */}
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <ShoppingBasket className="h-8 w-8 text-blue-500" />
              Apps
            </CardTitle>
            <CardDescription className="text-lg">
              Your recently uploaded and managed apps
            </CardDescription>
          </CardHeader>

          <PopularCarousel />

          <Separator className="mt-8 mb-2" />

          <DefinitionList />
          <ReleasesList />
        </div>
      )}
    </PageLayout>
  );
});

export default Page;
