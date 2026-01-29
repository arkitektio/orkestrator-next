import { ReactNode } from "react";

export const SubTreeTitle = (props: {
  children: ReactNode;
  action?: ReactNode;
}) => {
  return (
    <div className="text-muted-foreground text-xs font-semibold uppercase flex w-full h-10 py-2">
      <div className="my-auto">{props.children}</div>
      <div className="ml-auto my-auto">{props.action}</div>
    </div>
  );
};
