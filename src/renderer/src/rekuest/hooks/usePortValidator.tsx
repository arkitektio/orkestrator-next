import { useCallback } from "react";
import { PortKind, ValidatorFragment } from "../api/graphql";
import { runPortValidators } from "../widgets/portValidators";

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
      const errors: string[] = [];

      if (!port.nullable && v == undefined) {
        errors.push(`${port.key} is required`);
      }

      if (port.kind === PortKind.Float && typeof v !== "number") {
        errors.push(`${port.key} must be a number`);
      }

      if (
        port.kind === PortKind.Quantity &&
        !(v == undefined || typeof v === "string")
      ) {
        errors.push(`${port.key} must be a quantity`);
      }

      // Server-defined validators are catalog calls (see portCalls.ts).
      errors.push(...runPortValidators(port.validators, v, values ?? {}));

      if (errors.length > 0) {
        return errors.join(", ");
      }

      return undefined;
    },
    [port],
  );
