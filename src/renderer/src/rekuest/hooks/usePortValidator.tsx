import { useCallback } from "react";
import ShadowRealm from "shadowrealm-api";
import { PortKind, ValidatorFragment } from "../api/graphql";

const buildValidators = (validators: ValidatorFragment[]) => {
  let ream = new ShadowRealm();
  let buildValidators: ValidatorFunction[] = [];

  for (let validator of validators) {
    let wrappedValidatorFunc = `(v, values) => {
            const func = ${validator.function};

            let json_values = JSON.stringify(values);

            return func(v, json_values);
        }`;

    let func = ream.evaluate(wrappedValidatorFunc) as (
      v: any,
      ...value: any
    ) => any;

    const wrappedValidator = (v: any, values: any) => {
      let params = validator.dependencies?.map((param) => values[param]);
      if (params?.every((predicate) => predicate != undefined)) {
        console.log("Calling validator with params", params);
        return func(v, ...params);
      } else {
        return undefined;
      }
    };

    buildValidators.push(wrappedValidator);
  }

  return buildValidators;
};

export type ValidatorFunction = (
  v: any,
  x: { [key: string]: any },
) => string | undefined;

export const usePortValidate = <
  T extends {
    kind: PortKind;
    nullable: boolean;
    validators?: ValidatorFragment[] | null;
    key: string;
  },
>(
  port: T,
) =>
  useCallback(
    (v: any, values: any) => {
      let validators: ValidatorFunction[] = [];

      if (!port.nullable) {
        validators.push((v) =>
          v != undefined ? undefined : `${port.key} is required`,
        );
      }

      if (port.kind === PortKind.Float) {
        validators.push((v) =>
          typeof v === "number" ? undefined : `${port.key} must be a number`,
        );
      }

      console.log(port);

      if (port.validators) {
        console.log("Building validators", port.validators);
        let builtValidators = buildValidators(port.validators);
        validators.push(...builtValidators);
      }

      let errors: (string | undefined)[] = [];

      for (let validator of validators) {
        errors.push(validator(v, values));
      }

      const filtered_errors = errors.filter((e) => e?.length && e.length > 0);

      if (filtered_errors.length > 0) {
        return filtered_errors.join(", ");
      }

      return undefined;
    },
    [port],
  );
