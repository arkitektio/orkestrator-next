import { CubeIcon } from "@radix-ui/react-icons";
import { FaDocker } from "react-icons/fa";

export const IconForBackendKind = ({
  kind,
  ...props
}: {
  kind: string;
  className?: string;
}) => {
  switch (kind) {
    case "docker":
      return <FaDocker {...props} />;
    default:
      return <CubeIcon {...props} />;
  }
};
