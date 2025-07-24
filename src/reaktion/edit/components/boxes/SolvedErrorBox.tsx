import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ValidationError } from "@/reaktion/validation/types";
import { RemainingErrorRender } from "../../ErrorRender";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const SolvedErrorBox = (props: { errors: ValidationError[] }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row py-2">
        <ExclamationTriangleIcon className="text-red-600 my-auto h-8 w-8 " />
        <CardContent className="flex flex-col w-full">
          <div className="font-semibold leading-none tracking-tight mb-2 my-auto">
            Invalid
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
