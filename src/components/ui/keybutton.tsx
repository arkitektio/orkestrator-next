import { useEffect } from "react";
import { Button, ButtonProps } from "./button";
import { p } from "node_modules/@udecode/plate-media/dist/BasePlaceholderPlugin-Huy5PFfu";
import React from "react";

export type Props = ButtonProps & {
  registerKey: string;
  children: React.ReactNode;
};

export const Keybutton = ({
  registerKey,
  ...props
}: {
  key: string;
  registerKey: string;
}) => {
  const ref = React.useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === registerKey && ref.current) {
        ref.current.click();
        window.removeEventListener("keydown", handleKeyDown);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [registerKey]);

  return <Button ref={ref} {...props} />;
};
