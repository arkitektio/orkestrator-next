import { ReturnWidgetProps } from "@/rekuest/widgets/types";

const BoolReturnWidget = ({
  value,
}: ReturnWidgetProps<any, boolean>) => {
  return <div className="text-white items-center flex justify-center h-full w-full">{value && "true" || "false"}</div>
};

export { BoolReturnWidget };
