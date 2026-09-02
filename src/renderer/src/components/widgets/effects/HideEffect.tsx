import { PortEffectFragment } from "@/rekuest/api/graphql";
import {
  dependencyScope,
  parsePortCall,
  evaluatePortCall,
} from "@/rekuest/widgets/portCalls";
import { MappablePort } from "@/rekuest/widgets/types";
import React, { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

/**
 * Whether a hide effect currently SHOWS its port.
 *
 * The effect's call (see `rekuest/widgets/portCalls.ts`) is evaluated against
 * the port's own value and its declared dependencies, which are the only form
 * fields subscribed to. A call that cannot be evaluated keeps the port
 * visible and reports the error once, so a broken rule never hides an input.
 */
export const useEffectOn = (effect: PortEffectFragment, port: MappablePort) => {
  const { control } = useFormContext();

  const names = useMemo(
    () => [port.key, ...effect.dependencies],
    [port.key, effect.dependencies],
  );
  const watched = useWatch({ control, name: names }) as unknown[];

  const rawCall = effect.call;
  const parsed = useMemo(() => parsePortCall(rawCall), [rawCall]);

  const { show, error } = useMemo(() => {
    const [value, ...dependencyValues] = watched;
    const result = parsed.ok
      ? evaluatePortCall(parsed.value, {
          value,
          dependencies: dependencyScope(effect.dependencies, dependencyValues),
        })
      : parsed;

    return result.ok
      ? { show: Boolean(result.value), error: null }
      : { show: true, error: result.error };
  }, [effect.dependencies, parsed, watched]);

  // Reported once per distinct error, not per render.
  useEffect(() => {
    if (error) console.error(`Hide effect on port "${port.key}": ${error}`);
  }, [error, port.key]);

  return show;
};

export const HideEffect = ({
  effect,
  port,
  children,
}: {
  effect: PortEffectFragment;
  port: MappablePort;
  children?: React.ReactNode;
}) => {
  const effectOn = useEffectOn(effect, port);

  if (!effectOn) {
    return null;
  }

  return children;
};
