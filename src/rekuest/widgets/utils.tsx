import { notEmpty } from "@/lib/utils";
import { PortKind } from "../api/graphql";
import { LabellablePort, PortablePort } from "./types";

export const portToLabel = (port: LabellablePort): string => {
  if (port.kind == PortKind.Structure)
    return port.identifier || "Unknown Structure";
  if (port.kind == PortKind.List) {
    const firstChild = port.children?.at(0);

    return firstChild
      ? "List of " + portToLabel(firstChild) || "Unknown List"
      : "Unknown List";
  }
  if (port.kind == PortKind.Union)
    return (
      "Union of " +
      port?.children
        ?.filter(notEmpty)
        .map((x) => (x ? portToLabel(x) : "Unkown"))
        .join(", ")
    );
  if (port.kind == PortKind.Bool) return "Bool";
  if (port.kind == PortKind.Float) return "Float";
  if (port.kind == PortKind.Int) return "Int";
  if (port.kind == PortKind.String) return "String";
  if (port.kind == PortKind.Date) return "Date";
  return "Unknown";
};

import * as Yup from "yup";

export const buildModelSchema = (ports: LabellablePort[]) => {
  return Yup.object(
    ports.reduce(
      (prev, curr) => {
        prev[curr.key] = portToValidation(curr);
        return prev;
      },
      {} as { [key: string]: any },
    ),
  );
};

export const portToValidation = (port: LabellablePort): Yup.AnySchema => {
  let baseType;
  switch (port?.kind) {
    case PortKind.String:
      baseType = Yup.string().typeError("Please enter a string");
      break;
    case PortKind.Int:
      baseType = Yup.number()
        .integer("Please enter a valid integer")
        .typeError(`Please enter a valid integer`)
        .transform((v) => (v === "" || Number.isNaN(v) ? null : v));
      break;
    case PortKind.Float:
      baseType = Yup.number()
        .transform((v) => (v === "" || Number.isNaN(v) ? null : v))
        .typeError(`Please enter a valid number`);
      break;
    case PortKind.Structure:
      baseType = Yup.string().typeError(`Please select a ${port.identifier}`);
      break;
    case PortKind.Union:
      baseType = Yup.object({
        use: Yup.number().typeError(`Please select a valid choice`),
        value: Yup.mixed().typeError(`Please select a valid union`),
      }).typeError(`Please select a valid union`);
      break;
    case PortKind.Bool:
      baseType = Yup.boolean().typeError("Please select true or false");
      break;
    case PortKind.Dict:
      baseType = Yup.object().typeError("Please provide a valid dictionary");
      break;
    case PortKind.List:
      let child = port.children?.at(0);
      if (!child) {
        baseType = Yup.array().typeError(
          "This port is not configured correctly",
        );
        break;
      }

      baseType = Yup.array()
        .of(portToValidation(child))
        .typeError("The list is not valid");
      break;
    case PortKind.Date:
      baseType = Yup.date().typeError("Please provide a valid date");
      break;
    case PortKind.Model:
      baseType = buildModelSchema(port.children?.filter(notEmpty) || []);
      break;

    default:
      baseType = Yup.string();
      break;
  }
  if (port.nullable) {
    if (!baseType) throw new Error(`Base type for ${port} is not defined`);
    baseType = baseType.nullable("Please provide a value");
  }

  return baseType;
};

export const yupSchemaBuilder = (args: (PortablePort | undefined | null)[]) => {
  const schema: { [key: string]: any } = {};
  args.reduce((prev, curr) => {
    if (curr) {
      prev[curr?.key] = portToValidation(curr);
      return prev;
    }
    return prev;
  }, schema);
  return Yup.object(schema);
};

export const portToDefaults = (
  ports: PortablePort[],
  overwrites: { [key: string]: any },
): { [key: string]: any } => {
  return {
    ...ports.reduce(
      (result, port) => {
        result[port?.key || "test"] = port?.default;
        return result;
      },
      {} as { [key: string]: any },
    ),
    ...overwrites,
  };
};

export const argDictToArgs = (
  dict: { [key: string]: any },
  ports: PortablePort[],
) => {
  return ports.map((port) => {
    return dict[port.key] || port.default || null;
  });
};
