import { Card } from "@/components/ui/card";

export const NotImplementedYet = (props: { message?: string }) => {
  return (
    <Card className="text-xs bg-red-700 p-1">
      <b className=" font-semibold"> Not implemented: </b>
      {props.message || "This feature is not implemented yet"}
    </Card>
  );
};
