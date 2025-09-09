import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ViewFragment } from "@/mikro-next/api/graphql";
import { ComponentProps } from "react";

export interface ViewCardProps extends ComponentProps<typeof Card> {
  view: ViewFragment;
}
export const ViewCard = ({ view, className, ...props }: ViewCardProps) => {
  return (
    <Card
      data-viewactive={true}
      className={cn(
        "data-[viewactive=true]:border-accent data-[viewactive=false]:opacity-20 cursor-pointer @container ",
        className,
      )}
      {...props}
    />
  );
};
