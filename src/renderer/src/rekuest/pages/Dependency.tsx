import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { Button } from "@/components/ui/button";
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { RekuestAction } from "@/linkers";
import { useDependencyQuery } from "@/rekuest/api/graphql";
import { ClipboardIcon } from "@radix-ui/react-icons";
import DependencyCard from "../components/cards/DependencyCard";

export default asDetailQueryRoute(useDependencyQuery, ({ data }) => {
  return (
    <ModelPageLayout
      identifier="@rekuest/implementation"
      title={data.dependency.reference || "Dependency"}
      object={data.dependency.id}
    >
      <DetailPane>
        <DetailPaneHeader>
          <DetailPaneTitle
            actions={
              <Button variant={"outline"} title="Copy to clipboard">
                <ClipboardIcon />
              </Button>
            }
          >
            {data?.dependency?.reference}
            {data?.dependency?.initialHash}
            <br />
            {data?.dependency?.action && (
              <RekuestAction.DetailLink object={data?.dependency?.action?.id}>
                {data?.dependency?.action?.name}
              </RekuestAction.DetailLink>
            )}
          </DetailPaneTitle>
          <DetailPaneDescription></DetailPaneDescription>
        </DetailPaneHeader>
        <ListRender array={data?.implementation?.dependencies}>
          {(implementation, key) => <DependencyCard item={implementation} key={key} />}
        </ListRender>
      </DetailPane>
    </ModelPageLayout>
  );
});
