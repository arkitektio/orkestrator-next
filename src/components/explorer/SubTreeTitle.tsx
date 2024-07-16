import { ReactNode } from "react";

export const SubTreeTitle = (props: {
  children: ReactNode;
  action?: ReactNode;
}) => {
  return (
    <div className="text-muted-foreground text-xs font-semibold uppercase flex w-full mt-2 h-10">
      <div className="my-auto">{props.children}</div>
      <div className="ml-auto my-auto">{props.action}</div>
    </div>
  );
};
