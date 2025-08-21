import { usePerformAction } from "@/app/hooks/useLocalAction";
import { registry, useAction } from "@/app/localactions";
import { ActionState } from "@/lib/localactions/LocalActionProvider";
import { cn } from "@/lib/utils";
import React, { useCallback } from "react";
import { Button, ButtonProps } from "./button";

export interface LocalActionButtonProps extends ButtonProps {
  children?: React.ReactNode | string;
  name: keyof typeof registry; // Optional prop for action name
  className?: string;
  disabled?: boolean;
  state?: ActionState;
}

export const LocalActionButton = ({
  name,
  className,
  children,
  state,
  ...props
}: LocalActionButtonProps) => {
  const action = useAction(name);
  const { assign, progress } = usePerformAction({
    action,
    state: state,
  });

  const onClick = useCallback(async () => {
    try {
      await assign();
    } catch (e) {
      console.error("Error executing action:", e);
      // Optionally, you can show a dialog or toast here to inform the user
    }
  }, []);

  return (
    <Button
      className={cn("flex flex-row items-center justify-center", className)}
      onClick={onClick}
      {...props}
    >
      {children ? children : action.title}
    </Button>
  );
};
