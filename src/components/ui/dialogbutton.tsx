import { registry, useDialog } from "@/app/dialog";
import { cn } from "@/lib/utils";
import React, { useCallback } from "react";
import { Button, ButtonProps } from "./button";

type DialogType = typeof registry;
type ExtractProps<T> =
  T extends React.ComponentType<infer P> ? Omit<P, "onClose"> : never;

export const DialogButton = <T extends keyof DialogType>({
  name,
  className,
  children,
  dialogProps,
  options,
  ...props
}: {
  name: T;
  className?: string;
  dialogProps: ExtractProps<DialogType[T]>;
  options?: { className?: string };
} & ButtonProps) => {
  const { openDialog } = useDialog();

  const onClick = useCallback(async () => {
    openDialog(name, dialogProps, options || {});
  }, []);

  return (
    <Button
      className={cn("flex flex-row items-center justify-center", className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};
