import { Discovery, FaktsEndpoint, FaktsRequest } from "../../FaktsContext";
import { fetchWithTimeout } from "../../helpers";



export const discovery  = async (request: FaktsRequest, controller: AbortController) => {
    if (request.endpoint) {
        return request.endpoint;
    }
    else if (request.url) {
        return await introspectUrl(request.url, request.introspecTimeout || 2000, controller);
    }
    else {
        throw Error("No endpoint or url provided")
    }
}

export const introspectUrl = async (
    url: string,
    timeout: number,
    controller: AbortController,
  ): Promise<FaktsEndpoint> => {
    url = url.trim();
  
    if (!url.endsWith("/")) {
      url = url + "/";
    }
    let try_urls = [];
  
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      try_urls.push("https://" + url);
      try_urls.push("http://" + url);
    } else {
      try_urls.push(url);
    }


    console.log("Introspecting")
  
    let endpoints = await Promise.allSettled(
      try_urls.map(async (url) => {
         let response = await fetchWithTimeout(url + ".well-known/fakts", {
            timeout: timeout,
            controller: controller
          });
          if (response.status == 200) {
            let json = await response.json();
            return json as FaktsEndpoint;
        } else {
            throw new Error("Not a valid Fakts endpoint");
        }
      })
    );

    console.log("Endpoints are", endpoints)

    if (controller.signal.aborted) {
        console.log("User cancelled introspection. Throwing error")
        throw new Error("User Cancelled")
    }


    else {
        let endpoint = endpoints.find((e) => e.status == "fulfilled") as PromiseFulfilledResult<FaktsEndpoint> | undefined;
        if (endpoint) {
            return endpoint.value;
          }
          throw new Error(`No endpoint found on beacon ${url}`);
        }

}

