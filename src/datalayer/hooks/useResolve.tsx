import { Arkitekt } from "@/arkitekt";
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
  const fakts = Arkitekt.useFakts();

  const s3resolve = useCallback(
    (key: string) => {
      const endPointUrl = fakts?.datalayer?.endpoint_url;
      if (!endPointUrl) {
        console.error(fakts);
        throw Error("No client configured ");
      }
      let url = s3resolveWithEndpoint(endPointUrl, key);
      console.log("s3resolve", url);
      return url;
    },
    [fakts],
  );

  return s3resolve;
};
