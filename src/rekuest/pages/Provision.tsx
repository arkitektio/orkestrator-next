import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
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
import { ClipboardIcon } from "@radix-ui/react-icons";

export default asDetailQueryRoute(useDetailProvisionQuery, ({ data }) => {
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
      </DetailPane>
    </ModelPageLayout>
  );
});
