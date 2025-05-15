import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { Button } from "@/components/ui/button";
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { toast } from "@/components/ui/use-toast";
import { RekuestAssignation } from "@/linkers";
import { TestConstants } from "@/reaktion/base/Constants";
import {
  useAssignMutation,
  useDetailReservationQuery
} from "@/rekuest/api/graphql";
import { ClipboardIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default asDetailQueryRoute(
  useDetailReservationQuery,
  ({ data, refetch }) => {
    const [assign, _] = useAssignMutation();

    const navigate = useNavigate();

    return (
      <ModelPageLayout
        identifier="@rekuest/reservation"
        title={data?.reservation?.title || data?.reservation.action?.name}
        object={data.reservation.id}
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
              {data?.reservation?.title || data?.reservation.action?.name}
            </DetailPaneTitle>
            <DetailPaneDescription>
              {data?.reservation?.action?.description}

              {JSON.stringify(data?.reservation?.binds)}
            </DetailPaneDescription>
          </DetailPaneHeader>
          
        </DetailPane>
        <DetailPane className="mt-2">
          <DetailPaneHeader>Assign</DetailPaneHeader>
          <TestConstants
            ports={data?.reservation.action?.args || []}
            overwrites={{}}
            onSubmit={(e) => {
              console.log("submit", e);
              assign({
                variables: {
                  reservation: data.reservation.id,
                  args:
                    data?.reservation?.action?.args.map(
                      (arg) => e[arg.key] || null,
                    ) || [],
                },
              })
                .then((res) => {
                  toast({
                    title: "Assigned",
                    description: "The reservation has been assigned",
                  });
                  res.data?.assign.id &&
                    navigate(
                      RekuestAssignation.linkBuilder(res.data?.assign.id),
                    );
                })
                .catch((e) => {
                  toast({
                    title: "Error",
                    description: e.message,
                  });
                });
            }}
          />
        </DetailPane>
      </ModelPageLayout>
    );
  },
);
