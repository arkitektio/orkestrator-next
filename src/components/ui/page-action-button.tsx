import { Button, ButtonProps } from "./button";

export const PageActionButton = (props: Omit<ButtonProps, "variant">) => (
  <Button variant="outline" {...props} />
);
