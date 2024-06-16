import { cn } from "@/lib/utils";
import { Action, useAction } from "@/providers/command/CommandContext";
import React, { useState } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";

export interface ActionButtonProps extends Omit<Action, "run"> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const DialogAction: React.FC<ActionButtonProps> = ({
  className,
  children,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  useAction({
    run: async (state) => {
      console.log("run");
      setOpen(true);
    },
    ...props,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          className={cn("flex flex-row items-center justify-center", className)}
        >
          {props.label}
        </Button>
      </DialogTrigger>

      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
