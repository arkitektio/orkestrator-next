import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  build,
  buildAction,
  buildModule,
  buildState,
} from "@/hooks/use-metaapp";

export const TurretModule = buildModule({
  states: {
    objective: buildState(
      {
        current_objective: build.string(),
        objective_options: build.array(
          build.model({
            label: build.string(),
            value: build.string(),
            description: build.string(),
          }),
        ),
      },
      {
        forceHash:
          "aa7337c56b43bb8e7c8cb8d44f9bd40920ad25bf94fa8925fd05e89f623fa11f",
      },
    ),
  },
  actions: {
    set: buildAction(
      {
        objective: build.string(),
      },
      {},
      {
        forceHash:
          "1764173e85803aa16125810be183b68fec63cbc937bd9b3632ac433b80f5793d",
      },
    ),
  },
});

export default function TurretWidget() {
  const { value } = TurretModule.useState("objective");

  const { assign, done } = TurretModule.useAction("set", {
    ephemeral: true,
  });

  return (
    <div className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Change Objective</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid @md:grid-cols-2 grid-cols-1 gap-2">
          {value?.objective_options.map((objective) => (
            <Button
              key={objective.value}
              variant={
                value.current_objective === objective.value
                  ? "default"
                  : "outline"
              }
              onClick={() => assign({ objective: objective.value })}
              className="h-12 px-2 text-xs"
            >
              <span className="sr-only">
                Change to {objective.label} objective
              </span>
              <span className="ml-1">{objective.description}</span>
            </Button>
          ))}
        </div>
        <div className="mt-3 text-center text-sm text-muted-foreground">
          Current {!done ? "changing to" : ""} {value?.current_objective}
        </div>
      </CardContent>
    </div>
  );
}
