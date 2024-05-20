import { ReactNode } from "react";
import { PortEffectFragment, PortFragment } from "../api/graphql";
import { WidgetRegistryType } from "./types";

export const EffectWrapper = ({
  effects,
  registry,
  children,
  port,
}: {
  registry: WidgetRegistryType;
  effects: (PortEffectFragment | null | undefined)[];
  children: ReactNode;
  port: PortFragment;
}) => {
  let [effect, ...resteffect] = effects;

  if (effect) {
    let Wrapper = registry.getEffectWidget(effect.__typename);

    return (
      <Wrapper effect={effect} port={port}>
        <EffectWrapper effects={resteffect} port={port} registry={registry}>
          {children}
        </EffectWrapper>
      </Wrapper>
    );
  }

  return <>{children}</>;
};
