import { HideEffectFragment, PortFragment } from "@/rekuest/api/graphql";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import ShadowRealm from "shadowrealm-api";

export const useEffectOn = (effect: HideEffectFragment, port: PortFragment) => {
  const values = useFormContext();

  const [effectOn, setEffectOn] = React.useState(false);

  useEffect(() => {
    console.log(values);
    console.log("Effect dependencies", effect.dependencies);
    const chosenValues = effect.dependencies.map((dep) => {
      return values.getValues(dep);
    });

    const selfValue = values.getValues(port.key);

    const ream = new ShadowRealm();

    const wrappedValidatorFunc = `(v, ...values) => {
            const func = ${effect.function};
            console.log("HideEffect func", func);
            console.log("HideEffect selfValue", v);
            console.log("HideEffect chosenValues", values);


            return func(v, ...values);
        }`;

    const func = ream.evaluate(wrappedValidatorFunc) as (
      v: unknown,
      ...value: unknown[]
    ) => unknown;

    console.log("HideEffect chosenValues", chosenValues);
    const dependendent_values = values.getValues(effect.dependencies);
    const effectOn = func(selfValue, ...chosenValues);
    console.log("HideEffect effectOn", effectOn);
    setEffectOn(effectOn as boolean);
    console.log("HideEffect values", dependendent_values);
  }, [effect.dependencies, values]);

  return effectOn;
};

export const HideEffect = ({
  effect,
  port,
  children,
}: {
  effect: HideEffectFragment;
  port: PortFragment;
  children?: React.ReactNode;
}) => {
  const values = useFormContext();

  const effectOn = useEffectOn(effect, port);

  if (!effectOn) {
    return null;
  }

  return children;
};
