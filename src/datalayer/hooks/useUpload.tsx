import {
  useDatalayerEndpoint,
  useMikro
} from "@/lib/arkitekt/Arkitekt";
import {
  PresignedPostCredentialsFragment,
  RequestFileUploadPresignedDocument,
  RequestFileUploadPresignedMutation,
  RequestFileUploadPresignedMutationVariables,
  RequestMediaUploadDocument,
  RequestMediaUploadMutation,
  RequestMediaUploadMutationVariables,
} from "@/mikro-next/api/graphql";
import { useCallback } from "react";
import { toast } from "sonner";

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

export const useMediaUpload = () => {
  const client = useMikro();
  const datalayerEndpoint = useDatalayerEndpoint();

  const upload = useCallback(
    async (file: File) => {
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

      if (!data.data?.requestMediaUpload) {
        throw Error("Failed to request upload");
      }

      let z = data.data.requestMediaUpload;

      return await uploadToStore(file, datalayerEndpoint, z, {});
    },
    [client, datalayerEndpoint],
  );

  return upload;
};

export type FileUploadOptions = {
  signal?: AbortSignal;
  onProgress?: (ev: ProgressEvent) => void;
};

export const useBigFileUpload = () => {
  const client = useMikro();
  const datalayerEndpoint = useDatalayerEndpoint();

  const upload = useCallback(
    async (file: File, options: FileUploadOptions) => {
      if (!client) {
        throw Error("No client configured");
      }

      console.log("uploading", file, options, datalayerEndpoint);

      try {
        const data = await client.mutate<
          RequestFileUploadPresignedMutation,
          RequestFileUploadPresignedMutationVariables
        >({
          mutation: RequestFileUploadPresignedDocument,
          variables: {
            key: file.name,
            datalayer: "default",
          },
        });

        if (data.errors) {
          toast.error(
            `Failed to request upload: ${data.errors.map((e) => e.message).join(", ")}`,
          );
        }

        if (!data.data?.requestFileUploadPresigned) {
          throw Error("Failed to request upload");
        }

        let z = data.data.requestFileUploadPresigned;

        return await uploadToStore(file, datalayerEndpoint, z, options);
      } catch (e) {
        console.error("Failed to upload file", e);
        toast.error(`Failed to upload file: ${(e as Error).message}`);
        throw e;
      }
    },
    [client, datalayerEndpoint],
  );

  return upload;
};
