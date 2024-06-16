import { PageLayout } from "@/components/layout/PageLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

export const DebugPage = (props: { data: any }) => {
  return (
    <PageLayout title="Error">
      <div className="text-foreground">Dbeug</div>
      <ScrollArea className="h-screen dark:text-white">
        <pre>{JSON.stringify(props.data, null, 2)}</pre>
      </ScrollArea>
    </PageLayout>
  );
};
