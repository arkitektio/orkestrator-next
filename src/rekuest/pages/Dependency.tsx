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
import { RekuestNode } from "@/linkers";
import { useDependencyQuery } from "@/rekuest/api/graphql";
import { ClipboardIcon } from "@radix-ui/react-icons";
import DependencyCard from "../components/cards/DependencyCard";

export default asDetailQueryRoute(useDependencyQuery, ({ data }) => {
  return (
    <ModelPageLayout
      identifier="@rekuest/template"
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
            {data?.dependency?.node && (
              <RekuestNode.DetailLink object={data?.dependency?.node?.id}>
                {data?.dependency?.node?.name}
              </RekuestNode.DetailLink>
            )}
          </DetailPaneTitle>
          <DetailPaneDescription></DetailPaneDescription>
        </DetailPaneHeader>
        <ListRender array={data?.template?.dependencies}>
          {(template, key) => <DependencyCard item={template} key={key} />}
        </ListRender>
      </DetailPane>
    </ModelPageLayout>
  );
});
