import { notEmpty } from "@/lib/utils";
import ShadowRealm from "shadowrealm-api";
import { z } from "zod"; // Add new import
import { PortKind } from "../api/graphql";
import { LabellablePort, PortablePort } from "./types";

export const pathToName = (path: string[]): string => {
  return path.join(".");
};

export const isScalarPort = (port: { kind: PortKind }): boolean => {
  return (
    port.kind == PortKind.Bool ||
    port.kind == PortKind.Float ||
    port.kind == PortKind.Int ||
    port.kind == PortKind.String ||
    port.kind == PortKind.Date ||
    port.kind == PortKind.Structure ||
    port.kind == PortKind.List
  );
};

export const isObjectPort = (port: LabellablePort): boolean => {
  return port.kind == PortKind.Dict || port.kind == PortKind.Model;
};

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
  if (port.kind == PortKind.Model) {
    return port.identifier || "Unknown Model";
  }
  if (port.kind == PortKind.Dict) {
    const firstChild = port.children?.at(0);
    return firstChild
      ? "Dict of " + portToLabel(firstChild) || "Unknown Dict"
      : "Unknown Dict";
  }
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

export const portToZod = (port: LabellablePort): any => {
  let baseType;
  switch (port?.kind) {
    case PortKind.String:
      baseType = z.string({ message: "Please enter a string" });
      break;
    case PortKind.Int:
      baseType = z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number({ message: "Please enter a valid integer" }),
      );
      break;
    case PortKind.Float:
      baseType = z.preprocess(
        (a) => parseFloat(z.string().parse(a)),
        z.number({ message: "Please enter a float" }),
      );
      break;
    case PortKind.Structure:
      baseType = z.string();
      break;
    case PortKind.Union:
      let variants = port.children?.filter(notEmpty);
      if (!variants) {
        throw new Error("Union port is not defined");
        break;
      }
      baseType = z.discriminatedUnion(
        "__use",
        variants.map((v, index) =>
          z.object({
            __value: portToZod(v),
            __use: z.literal(index.toString()),
          }),
        ),
      );
      break;
    case PortKind.Bool:
      baseType = z.boolean({ message: "Please enter a valid boolean" });
      break;
    case PortKind.Dict:
      let dictChild = port.children?.at(0);
      if (!dictChild) {
        throw new Error("Dict port is not defined");
        break;
      }
      baseType = z.array(
        z.object({ __value: portToZod(dictChild), __key: z.string() }),
      );
      break;
    case PortKind.List:
      let child = port.children?.at(0);
      if (!child) {
        throw new Error("List port is not defined");
        break;
      }
      baseType = z.array(z.object({ __value: portToZod(child) }));

      break;
    case PortKind.Date:
      baseType = z.date();
      break;
    case PortKind.Model:
      baseType = buildZodSchema(port.children?.filter(notEmpty) || []);
      break;

    default:
      baseType = z.string();
      break;
  }
  if (port.nullable) {
    if (!baseType) throw new Error(`Base type for ${port} is not defined`);
    baseType = z.nullable(baseType, { message: "Please provide a value" });
  }

  return baseType;
};

export type ValidatorFunction = (
  v: any,
  x: { [key: string]: any },
) => string | undefined;

let ream = new ShadowRealm();

export const buildZodSchema = (ports: PortablePort[], path: string[] = []) => {
  let schema = z.object(
    ports.reduce(
      (prev, curr) => {
        prev[curr.key] = portToZod(curr);
        return prev;
      },
      {} as { [key: string]: any },
    ),
  );

  ports.forEach((port) => {
    // do somethin
    if (port.validators) {
      for (let validator of port.validators) {
        const wrappedValidator = (v: any, values: any) => {
          let wrappedValidatorFunc = `(v, values) => {
                const func = ${validator.function};

                let json_values = JSON.parse(values);

                return func(v, ...json_values);
            }`;

          let func = ream.evaluate(wrappedValidatorFunc) as (
            v: any,
            ...value: any
          ) => any;

          let params = validator.dependencies?.map((dep) => values[dep]);
          console.log("Params", params);
          if (params?.every((predicate) => predicate != undefined)) {
            console.log("Calling validator with params", params);
            let serialized_values = JSON.stringify(params);
            let x = func(v, serialized_values);
            console.log(x);
            return x;
          } else {
            return true;
          }
        };

        schema = schema.refine(
          (data) => {
            return wrappedValidator(data[port.key], data);
          },
          {
            message: validator.errorMessage || "Validation failed",
            path: pathToName([...path, port.key]),
          },
        );

        console.log("Refined schema with", validator);
      }
    }
  });

  return schema;
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
      let dictChild = port.children?.at(0);
      if (!dictChild) {
        baseType = Yup.array().typeError(
          "This port is not configured correctly",
        );
        break;
      }
      baseType = Yup.array()
        .of(
          Yup.object({
            __value: portToValidation(dictChild),
            __key: Yup.string(),
          }),
        )
        .typeError("The dictionary is not valid");
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
        .of(Yup.object({ __value: portToValidation(child) }))
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
  return setData(overwrites, ports);
};

export const recursiveExtract = (data: any, port: PortablePort): any => {
  if (!data) return null;
  if (!port) throw new Error("Port is not defined");

  if (port.kind == PortKind.List) {
    return data.map((item: any) =>
      recursiveExtract(item.__value, port.children?.at(0) || port),
    );
  }

  if (port.kind == PortKind.Dict) {
    return data
      .map(
        (item: any) => (
          item.__key,
          recursiveExtract(item.__value, port.children?.at(0) || port)
        ),
      )
      .reduce(
        (prev, curr) => {
          prev[curr.__key] = curr.__value;
          return prev;
        },
        {} as { [key: string]: any },
      );
  }

  if (port.kind == PortKind.Model) {
    return submittedDataToRekuestFormat(
      data,
      port.children?.filter(notEmpty) || [],
    );
  }

  return data;
};

export const submittedDataToRekuestFormat = (
  data: any,
  ports: PortablePort[],
): any => {
  return ports.reduce(
    (prev, curr) => {
      prev[curr.key] = recursiveExtract(data[curr.key], curr);
      return prev;
    },
    {} as { [key: string]: any },
  );
};

export const recursiveSet = (data: any, port: PortablePort): any => {
  if (!data) return null;
  if (!port) throw new Error("Port is not defined");

  if (port.kind == PortKind.List) {
    let childPort = port.children?.at(0);
    if (!childPort) throw new Error("List port is not defined");
    return data.map((item: any) => ({
      __value: recursiveSet(item, childPort),
    }));
  }

  if (port.kind == PortKind.Dict) {
    let childPort = port.children?.at(0);
    if (!childPort) throw new Error("Dict port is not defined");

    return Object.entries(data).map(([key, value]) => ({
      __key: key,
      __value: recursiveSet(value, childPort),
    }));
  }

  if (port.kind == PortKind.Model) {
    return submittedDataToRekuestFormat(
      data,
      port.children?.filter(notEmpty) || [],
    );
  }

  return data;
};

export const setData = (data: any, ports: PortablePort[]): any => {
  return ports.reduce(
    (prev, curr) => {
      prev[curr.key] = recursiveSet(data[curr.key], curr);
      return prev;
    },
    {} as { [key: string]: any },
  );
};

export const argDictToArgs = (
  dict: { [key: string]: any },
  ports: PortablePort[],
) => {
  return ports.map((port) => {
    return dict[port.key] || port.default || null;
  });
};
