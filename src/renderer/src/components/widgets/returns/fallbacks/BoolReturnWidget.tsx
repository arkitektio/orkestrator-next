import { ReturnWidgetProps } from "@/rekuest/widgets/types";

const BoolReturnWidget = ({
  value,
}: ReturnWidgetProps) => {
  return <div className="text-white items-center flex justify-center h-full w-full">{value && "true" || "false"}</div>
};

export { BoolReturnWidget };
