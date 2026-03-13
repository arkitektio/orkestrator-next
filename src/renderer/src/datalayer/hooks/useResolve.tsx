import { useDatalayerEndpoint } from "@/app/Arkitekt";
import { useCallback } from "react";

const s3resolveWithEndpoint = (endpointUrl: string, key: string) => {
  if (!endpointUrl) {
    throw Error("No client configured");
  }
  if (key.startsWith("http") || key.startsWith("s3")) {
    throw Error("Key is already a URL");
  }
  if (key.startsWith("/")) {
    return `${endpointUrl}${key}`;
  }

  return `${endpointUrl}/${key}`;
};

export const useResolve = () => {
  const endpoint = useDatalayerEndpoint();

  const s3resolve = useCallback(
    (key: string | undefined) => {
      if (key == undefined || key == null || key == "" || !endpoint) {
        return "";
      }

      const url = s3resolveWithEndpoint(endpoint, key);
      console.log("s3resolve", url);
      return url;
    },
    [endpoint],
  );

  return s3resolve;
};
