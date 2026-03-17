import {
  useDatalayerEndpoint,
  useKraph,
  useMikro,
  useSeaweedfs
} from "@/app/Arkitekt";
import {
  BigFileUploadGrantFragment,
  FinishBigfileUploadDocument,
  FinishBigfileUploadMutation,
  FinishBigfileUploadMutationVariables,
  FinishMediaUploadDocument,
  FinishMediaUploadMutation,
  FinishMediaUploadMutationVariables,
  MediaUploadGrantFragment,
  RequestBigfileUploadDocument,
  RequestBigFileUploadInput,
  RequestBigfileUploadMutation,
  RequestBigfileUploadMutationVariables,
  RequestMediaUploadDocument,
  RequestMediaUploadMutation,
  RequestMediaUploadMutationVariables,
} from "@/mikro-next/api/graphql";
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
      const signal = options.signal;

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
  id?: string;
};

const uploadToStore = async (
  file: File,
  endpointUrl: string,
  z: BigFileUploadGrantFragment,
  options?: UploadOptions,
) => {
  if (!z) {
    throw Error("No client configured",);
  }

  console.log("uploadToStore (big file IPC)", z, file);

  // Fallback if we are not in Electron (shouldn't happen in this app context, but good for safety)
  if (!window.api?.uploadBigFile) {
     throw Error("Big file upload is only supported in the Electron app");
  }

  const uploadId = options?.id || crypto.randomUUID();

  return new Promise((resolve, reject) => {
    if (options?.signal) {
       options.signal.addEventListener("abort", () => {
         window.api.cancelBigFile({ uploadId });
         reject(new DOMException("Aborted", "AbortError"));
       });
    }

    window.api.uploadBigFile({
       uploadId,
       path: (file as any).path || file.name, // Electron extends File with .path, fallback to name
       grant: z,
       endpointUrl
    }).then((resultStore: string) => {
       resolve(resultStore);
    }).catch((err: any) => {
       reject(err);
    });
  });
};

export const useMikroBigFileUpload = () => {
  const client = useMikro();
  const datalayerEndpoint = useDatalayerEndpoint();

  const upload = useCallback(
    async (file: File, options?: UploadOptions) => {
      if (!client) {
        throw Error("No client configured");
      }

      const data = await client.mutate<
        RequestBigfileUploadMutation,
        RequestBigfileUploadMutationVariables
      >({
        mutation: RequestBigfileUploadDocument,
        variables: {
          input: { originalFileName: file.name,  },
        },
      });

      if (!data.data?.requestBigfileUpload) {
        throw Error(`Failed to get upload grant: ${JSON.stringify(data)}`);
        }

      if (!datalayerEndpoint) {
        throw Error("No datalayer endpoint configured");
      }

      const z = data.data.requestBigfileUpload;

      console.log("Got upload grant", z);

      const result = await uploadToStore(file, datalayerEndpoint, z, options);

      const finishData = await client.mutate<FinishBigfileUploadMutation, FinishBigfileUploadMutationVariables>({
        mutation: FinishBigfileUploadDocument,
        variables: {
          input: {
            storeId: z.store,
          },
        },
      });

      console.log("Finished upload", finishData);
      return z.store;
    },
    [client, datalayerEndpoint],
  );

  return upload;
};
