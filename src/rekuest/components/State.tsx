import { useCallback, useEffect } from "react";
import { AssignationEventKind, DetailTemplateFragment } from "../api/graphql";
import { useTemplateAction } from "../hooks/useTemplateAction";
import { useWidgetRegistry } from "../widgets/WidgetsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnsContainer } from "@/components/widgets/returns/ReturnsContainer";
import { portToLabel } from "../widgets/utils";
import { toast } from "sonner";
import Timestamp from "react-timestamp";

export const StateDisplay = ({
  template,
}: {
  template: DetailTemplateFragment;
}) => {
  const { assign, latestAssignation, cancel } = useTemplateAction({
    id: template.id,
  });

  const watchState = useCallback(() => {
    assign({
      template: template.id,
      args: {},
      hooks: [],
    }).then(
      (v) => {
        console.log("Result", v);
      },
      (error) => {
        console.log("Error", error);
        toast.error(error.message);
      },
    );
  }, [template, assign]);

  const { registry } = useWidgetRegistry();

  console.log("Latest Assignation", latestAssignation);

  const yieldEvent = latestAssignation?.events.find(
    (x) => x.kind == AssignationEventKind.Yield,
  );

  const errorEvent = latestAssignation?.events.find(
    (x) => x.kind == AssignationEventKind.Critical,
  );

  return (
    <>
      <button onClick={watchState}>Watch</button>
      {yieldEvent ? (
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="font-light">Outs</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-2">
              Has yielded <Timestamp date={yieldEvent.createdAt} />
              <ReturnsContainer
                registry={registry}
                ports={template.node.returns}
                values={yieldEvent?.returns}
              ></ReturnsContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="font-light">Outs</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-2">
              {template?.node.returns?.map((p) => (
                <div>
                  <div className=" font-bold">{p.label || p.key}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.description}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {portToLabel(p)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {errorEvent && (
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="font-light text-red-800">Errors</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-2">{errorEvent.message}</div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
