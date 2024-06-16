import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { Button } from "@/components/ui/button";
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { RekuestAgent } from "@/linkers";
import { useAgentQuery } from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { ClipboardIcon } from "@radix-ui/react-icons";
import ProvisionCard from "../components/cards/ProvisionCard";
import TemplateCard from "../components/cards/TemplateCard";

export default asDetailQueryRoute(
  withRekuest(useAgentQuery),
  ({ data, refetch }) => {
    return (
      <RekuestAgent.ModelPage
        title={data.agent.instanceId}
        object={data.agent.id}
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
              {data?.agent?.instanceId}
            </DetailPaneTitle>
            <DetailPaneDescription></DetailPaneDescription>
          </DetailPaneHeader>
          <ListRender array={data?.agent?.provisions}>
            {(template, key) => <ProvisionCard item={template} key={key} />}
          </ListRender>
          <ListRender array={data?.agent?.templates}>
            {(template, key) => <TemplateCard item={template} key={key} />}
          </ListRender>
        </DetailPane>
      </RekuestAgent.ModelPage>
    );
  },
);
