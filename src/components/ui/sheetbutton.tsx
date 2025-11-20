import { registry, useDialog } from "@/app/dialog";
import { cn } from "@/lib/utils";
import React, { useCallback } from "react";
import { Button, ButtonProps } from "./button";

type DialogType = typeof registry;
type ExtractProps<T> =
  T extends React.ComponentType<infer P> ? Omit<P, "onClose"> : never;

export const SheetButton = <T extends keyof DialogType>({
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
  options?: { className?: string, size?: "small" | "medium" | "large" };
} & ButtonProps) => {
  const { openSheet } = useDialog<T>();

  const onClick = useCallback(async () => {
    openSheet(name, dialogProps, options || {});
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
