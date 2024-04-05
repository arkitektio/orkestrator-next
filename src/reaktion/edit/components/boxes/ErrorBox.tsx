import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidationError } from "@/reaktion/validation/types";
import React from "react";
import { RemainingErrorRender } from "../../ErrorRender";
import { Ban } from "lucide-react";

export const ErrorBox = (props: { errors: ValidationError[] }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row py-2">
        <Ban className="text-red-600 my-auto h-8 w-8 " />
        <CardContent className="flex flex-col w-full">
          <div className="font-semibold leading-none tracking-tight mb-2 my-auto">
            Workflow is invalid
          </div>
          <div className="gap-1 flex flex-col">
            {props.errors.map((e) => (
              <RemainingErrorRender error={e} onClick={() => {}} />
            ))}
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
