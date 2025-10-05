import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";

import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { CommandMenu } from "@/command/Menu";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { HelpSidebar } from "@/components/sidebars/help";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JustUsername } from "@/lok-next/components/UserAvatar";
import { Database } from "lucide-react";
import { usePeerHomePageQuery } from "../api/graphql";
import DatasetList from "../components/lists/DatasetList";
import FileList from "../components/lists/FileList";
import ImageList from "../components/lists/ImageList";
import { PeerStatisticsSidebar } from "../components/sidebars/PeerStatisticsSidebar";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRepresentationScreenProps { }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Page = asDetailQueryRoute(usePeerHomePageQuery, ({ data, id }) => {
  return (
    <PageLayout
      pageActions={<></>}
      sidebars={<MultiSidebar map={{
        Statistics: <PeerStatisticsSidebar sub={id} />,
        Help: <HelpSidebar />,
      }} />}
      title={
        <>
          <JustUsername sub={id} />
          {"'s Home"}
        </>
      }
    >
      <CommandMenu />
      <div className="space-y-8 p-3">
        {/* Welcome Header */}
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-500" />
            <JustUsername sub={id} />
            {"'s Data"}
          </CardTitle>
          <CardDescription className="text-lg">
            Their recently uploaded and managed data
          </CardDescription>
        </CardHeader>

        <ImageList
          pagination={{ limit: 30 }}
          filters={{ notDerived: true, owner: id }}
        />
        <Separator className="my-4" />
        <DatasetList
          pagination={{ limit: 30 }}
          filters={{ parentless: true, owner: id }}
        />
        <Separator className="my-4" />
        <FileList pagination={{ limit: 30 }} filters={{ owner: id }} />
      </div>
    </PageLayout>
  );
});

export default Page;
