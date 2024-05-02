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
import { useTemplateQuery } from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { ClipboardIcon } from "@radix-ui/react-icons";
import DependencyCard from "../components/cards/DependencyCard";
import { DependencyGraphFlow } from "../components/dependencyGraph/DependencyGraph";

export default asDetailQueryRoute(
  withRekuest(useTemplateQuery),
  ({ data, refetch }) => {
    return (
      <ModelPageLayout
        identifier="@rekuest/template"
        title={data.template.interface}
        object={data.template.id}
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
              {data?.template?.interface}
            </DetailPaneTitle>
            <DetailPaneDescription></DetailPaneDescription>
          </DetailPaneHeader>
          <ListRender array={data?.template?.dependencies}>
            {(template, key) => <DependencyCard item={template} key={key} />}
          </ListRender>
          {data?.template?.dependencyGraph && (
            <>
              <DependencyGraphFlow
                graph={data?.template?.dependencyGraph}
                refetch={refetch}
              />
            </>
          )}
        </DetailPane>
      </ModelPageLayout>
    );
  },
);
