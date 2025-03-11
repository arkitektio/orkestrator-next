import { useEffect } from "react";
import { FaktsEndpoint, useFakts } from "./FaktsContext";
import { introspectUrl } from "./grants/remote/discovery";

export const WellKnownDiscovery = (props: {
  endpoints: string[];
  timeout?: number;
}) => {
  const { registerEndpoints } = useFakts();

  let introspectAll = async () => {
    let endpoints: FaktsEndpoint[] = [];

    for (let endpoint of props.endpoints) {
      try {
        let introspected = await introspectUrl(
          endpoint,
          props.timeout || 2000,
          new AbortController(),
        );
        endpoints.push(introspected);
      } catch (e) {
        console.error(e);
      }
    }
    return endpoints;
  };

  useEffect(() => {
    let x = introspectAll().then((endpoints) => {
      return registerEndpoints(endpoints);
    });

    return () => {
      x.then((unregister) => unregister());
    };
  }, [props.endpoints]);

  return <></>;
};
