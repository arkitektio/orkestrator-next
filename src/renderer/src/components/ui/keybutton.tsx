import React, { useEffect } from "react";
import { Button, ButtonProps } from "./button";

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
