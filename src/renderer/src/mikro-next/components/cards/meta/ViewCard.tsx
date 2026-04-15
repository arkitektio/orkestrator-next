import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ViewFragment } from "@/mikro-next/api/graphql";
import { ComponentProps } from "react";

export interface ViewCardProps extends ComponentProps<typeof Card> {
  view: ViewFragment;
}
export const ViewCard = ({ view, className, ...props }: ViewCardProps) => {
  return (
    <div
      data-viewactive={true}
      className={cn(
        "cursor-pointer @container text-xs rounded-md border group-data-[viewactive=true]:border-primary bg-background/80",
        className,
      )}
      {...props}
    />
  );
};
