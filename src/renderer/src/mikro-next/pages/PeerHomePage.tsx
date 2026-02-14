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
import { DateTimeRangePicker } from "@/components/ui/date-time-range-picker";
import { parseAsIsoDateTime, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

 
export interface IRepresentationScreenProps { }

 
const Page = asDetailQueryRoute(usePeerHomePageQuery, ({ data, id }) => {

  const [parentless, setParentless] = useQueryState(
    "parentless",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => (v === "true" ? true : v === "false" ? false : undefined)
  );

  const [createdAfter, setCreatedAfter] = useQueryState(
    "after",
    parseAsIsoDateTime.withDefault(undefined)
  );

  const [createdBefore, setCreatedBefore] = useQueryState(
    "before",
    parseAsIsoDateTime.withDefault(undefined)
  );

  const temporalFilter = {
    createdAfter: createdAfter ?? undefined,
    createdBefore: createdBefore ?? undefined,
  };



  return (
    <PageLayout
      pageActions={<>
        <>
          {/* 3. Picker updates the URL params */}
          <DateTimeRangePicker
            // Optional: bind value to keep picker UI in sync on page refresh
            initialDateFrom={createdAfter || null}
            initialDateTo={createdBefore || null}
            onUpdate={({ range }) => {
              setCreatedAfter(range.from || null);
              setCreatedBefore(range.to || null);
            }}
          /></>
        <Button variant={"outline"} onClick={() => {
          setParentless(parentless ? null : true);
        }}>
          {parentless ? "No Parent" : "All Data"}
        </Button>



      </>}
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
            <Database className="h-8 w-8 text-primary" />
            <JustUsername sub={id} />
            {"'s Data"}
          </CardTitle>
          <CardDescription className="text-lg">
            Their recently uploaded and managed data
          </CardDescription>
        </CardHeader>

        <ImageList
          filters={{ notDerived: parentless ? true : undefined, owner: id, ...temporalFilter }}
        />
        <Separator className="my-4" />
        <DatasetList
          filters={{ parentless: parentless ? true : undefined, owner: id, ...temporalFilter }}
        />
        <Separator className="my-4" />
        <FileList filters={{ owner: id, ...temporalFilter }} />
      </div>
    </PageLayout>
  );
});

export default Page;
