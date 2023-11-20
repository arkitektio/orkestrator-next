import { Action, useAction } from "@/providers/command/CommandContext";
import React, { useCallback, useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface ActionButtonProps extends Action {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  className,
  run,
  children,
  ...props
}) => {
  const [doing, setDoing] = useState(false);

  useAction({
    run: async (state) => {
      setDoing(true);
      try {
        let x = await run(state);
        setDoing(false);
        return x;
      } catch (e) {
        setDoing(false);
        throw e;
      }
    },
    ...props,
  });

  const onClick = useCallback(async () => {
    try {
      setDoing(true);
      await run();
      setDoing(false);
    } catch (e) {
      setDoing(false);
      throw e;
    }
  }, []);

  return (
    <Button
      className={cn("flex flex-row items-center justify-center", className)}
      disabled={doing || props.disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};



