import { Arkitekt, useKraph } from "@/arkitekt/Arkitekt";
import {
  PresignedPostCredentialsFragment,
  RequestMediaUploadDocument,
  RequestMediaUploadMutation,
  RequestMediaUploadMutationVariables,
} from "@/kraph/api/graphql";
import { useCallback } from "react";

export const uploadFetch = (
  url: RequestInfo | URL,
  options?:
    | (RequestInit & { onProgress?: (ev: ProgressEvent) => void })
    | undefined,
) =>
  new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status !== 204) {
        reject(new Error(`Failed to upload file: ${xhr.responseText}`));
      }
      const body = "response" in xhr ? xhr.response : (xhr as any).responseText;
      resolve(new Response(body));
    };
    xhr.onerror = () => {
      reject(new TypeError("Network request failed"));
    };
    xhr.ontimeout = () => {
      reject(new TypeError("Network request failed"));
    };

    xhr.open(options?.method || "POST", url.toString(), true);

    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    if (options?.onProgress) {
      xhr.upload.addEventListener("progress", options.onProgress);
    }

    if (options?.signal) {
      let signal = options.signal;

      if (signal) {
        signal.addEventListener("abort", () => {
          xhr.abort();
          reject(new DOMException("Aborted", "AbortError"));
        });
      }
    }

    xhr.send(options?.body as any);
  });

export type ExtraRequest = RequestInit & {
  onProgress?: (this: any, e: ProgressEvent) => void;
};

const customFetch = (uri: any, options: ExtraRequest) => {
  if (options.onProgress) {
    console.log("uploadFetch", uri, options);
    return uploadFetch(uri, options);
  }
  return fetch(uri, options);
};

export type UploadOptions = {
  signal?: AbortSignal;
  onProgress?: (ev: ProgressEvent) => void;
};

const uploadToStore = async (
  file: File,
  endpointUrl: string,
  z: PresignedPostCredentialsFragment,
  options?: UploadOptions,
) => {
  if (!z) {
    throw Error("No client configured");
  }

  console.log("uploadToStore", z);

  let data = new FormData();
  data.append("key", z.key);
  data.append("bucket", z.bucket);
  data.append("X-Amz-Algorithm", z.xAmzAlgorithm);
  data.append("X-Amz-Credential", z.xAmzCredential);
  data.append("X-Amz-Date", z.xAmzDate);
  data.append("X-Amz-Signature", z.xAmzSignature);
  data.append("Policy", z.policy);

  data.append("file", file); // HYPER IMPORTANT TO BE THE LAST ITEM FOR FUCKS SAKE; HOW CAN THIS BE A STANDARD?

  let x = customFetch(`${endpointUrl}/${z.bucket}`, {
    body: data,
    mode: "cors",
    method: "POST",
    onProgress: options?.onProgress,
    signal: options?.signal,
  });

  await x;
  console.log("done", x, z.store);
  return `${z.store}`;
};

export const useKraphUpload = () => {
  const client = useKraph();
  const fakts = Arkitekt.useFakts();

  const upload = useCallback(
    async (file: File) => {
      if (!client) {
        throw Error("No client configured");
      }
      const endPointUrl = fakts?.datalayer?.endpoint_url;
      if (!endPointUrl) {
        throw Error("No client configured");
      }

      let data = await client.mutate<
        RequestMediaUploadMutation,
        RequestMediaUploadMutationVariables
      >({
        mutation: RequestMediaUploadDocument,
        variables: {
          key: file.name,
          datalayer: "default",
        },
      });

      if (!data.data?.requestUpload) {
        throw Error("Failed to request upload");
      }

      let z = data.data.requestUpload;

      return await uploadToStore(file, endPointUrl, z, {});
    },
    [client, fakts],
  );

  return upload;
};


