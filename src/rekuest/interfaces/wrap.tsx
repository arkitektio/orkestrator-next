import { serviceMap } from "@/arkitekt";
import { AppContext, ArkitektContext, Service } from "@/arkitekt/provider";
import { manifest } from "@/constants";
import r2wc from "@r2wc/react-to-web-component";
import { ReactNode, useEffect, useState } from "react";

export type WrappedProps = {
  fakts: any;
  token: string;
};

export const ComponentServiceProvier = ({
  children,
  fakts,
  token,
}: {
  children: ReactNode;
  token: string;
  fakts: any;
}) => {
  const [context, setContext] = useState<AppContext>({
    manifest: manifest,
    clients: {},
  });

  useEffect(() => {
    if (fakts && token) {
      let clients: { [key: string]: Service<any> } = {};

      console.log("Building clients for", fakts);

      for (let key in serviceMap) {
        let definition = serviceMap[key];
        try {
          clients[key] = definition.builder(manifest, fakts, token);
        } catch (e) {
          console.error(`Failed to build client for ${key}`, e);
          if (!definition.optional) {
            throw e;
          }
        }
      }

      setContext({ manifest: manifest, clients });
    }
  }, [fakts, token, serviceMap]);

  return (
    <ArkitektContext.Provider value={context}>
      {context.clients.mikro ? children : "No Mikro Client"}
    </ArkitektContext.Provider>
  );
};

export const wrap = (Component: React.ComponentType) =>
  r2wc(
    (props: WrappedProps) => {
      return (
        <>
          <ComponentServiceProvier token={props.token} fakts={props.fakts}>
            <Component></Component>
          </ComponentServiceProvier>
        </>
      );
    },
    {
      props: {
        fakts: "json",
        token: "string",
      },
    },
  );
