import { asParamlessRoute } from "@/app/routes/ParamlessRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { PageLayout } from "@/components/layout/PageLayout";
import { HelpSidebar } from "@/components/sidebars/help";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { BarChart3, Network, TrendingUp } from "lucide-react";
import { BsLightning } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useHomePageQuery } from "../api/graphql";
import BlockList from "../components/lists/BlockList";
import ExperimentList from "../components/lists/ExperimentList";
import NeuronModelList from "../components/lists/NeuronModelList";
import SimulationList from "../components/lists/SimulationList";
import { HomePageStatisticsSidebar } from "../sidebars/HomePageStatisticsSidebar";

const Page = asParamlessRoute(useHomePageQuery, ({ data }) => {
  const navigate = useNavigate();

  return (
    <PageLayout pageActions={<></>} title="Elektro" sidebars={
      <MultiSidebar map={{
        Statistics: <HomePageStatisticsSidebar />,
        Help: <HelpSidebar />
      }} />
    }>
      {data?.blocks.length == 0 ? (
        // Empty State with Hero Design
        <div className="min-h-full w-full bg-gradient-to-br from-slate-50/20 to-slate-100/20 dark:from-slate-900/30 dark:to-slate-800/30 flex items-center justify-center rounded-lg">
          <div className="max-w-4xl mx-auto text-center px-6 py-16">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-200/20 dark:border-blue-700/20">
                  <BsLightning className="h-16 w-16 text-blue-500" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to Elektro
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Your powerful data visualization and knowledge graph platform.
                Create your first graph to start exploring and organizing your
                data relationships.
              </p>
            </div>

            {/* Action Section */}
            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Visualize Relationships</span>
                </div>
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  <span>Build Connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analyze Data</span>
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
              <BsLightning className="h-8 w-8 text-blue-500" />
              Your Elektro Data
            </CardTitle>
            <CardDescription className="text-lg">
              Explore and manage your knowledge graphs with powerful
              visualization tools
            </CardDescription>
          </CardHeader>

          <BlockList />
          <SimulationList />
          <NeuronModelList />
          <ExperimentList />

          <Separator />
        </div>
      )}
    </PageLayout>
  );
});

export default Page;
