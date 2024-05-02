import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { RekuestDependency, RekuestReservation } from "@/linkers";
import { useDetailProvisionQuery } from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { ClipboardIcon } from "@radix-ui/react-icons";
import DependencyCard from "../components/cards/DependencyCard";

export default asDetailQueryRoute(
  withRekuest(useDetailProvisionQuery),
  ({ data }) => {
    return (
      <ModelPageLayout
        identifier="@rekuest/provision"
        title={"Provision for" + data.provision.template.interface}
        object={data.provision.id}
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
              {data?.provision?.id}
              {data.provision.template.interface}
              <br />
              Linked Reservations:
              {data?.provision?.causedReservations.map((res) => (
                <Card>
                  <RekuestReservation.DetailLink object={res.id}>
                    {res.id}
                  </RekuestReservation.DetailLink>
                  {res.causingDependency && (
                    <>
                      <RekuestDependency.DetailLink
                        object={res.causingDependency.id}
                      >
                        {res.causingDependency.id}
                      </RekuestDependency.DetailLink>
                    </>
                  )}
                </Card>
              ))}
            </DetailPaneTitle>
            <DetailPaneDescription></DetailPaneDescription>
          </DetailPaneHeader>
          <ListRender array={data?.template?.dependencies}>
            {(template, key) => <DependencyCard item={template} key={key} />}
          </ListRender>
        </DetailPane>
      </ModelPageLayout>
    );
  },
);
