import { notEmpty } from "@/lib/utils";
import ShadowRealm from "shadowrealm-api";
import { z } from "zod"; // Add new import
import { PortKind } from "../api/graphql";
import { LabellablePort, PortablePort } from "./types";

export const pathToName = (path: string[]): string => {
  console.log(path);
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
  if (port.kind == PortKind.Enum) {
    return port.identifier || "Unknown Enum";
  }
  if (port.kind == PortKind.MemoryStructure) {
    return port.identifier || "Unknown Memory Structure";
  }
  if (port.kind == PortKind.Dict) {
    const firstChild = port.children?.at(0);
    return firstChild
      ? "Dict of " + portToLabel(firstChild) || "Unknown Dict"
      : "Unknown Dict";
  }
  return "Unknown";
};



export const portToZod = (port: LabellablePort): any => {
  let baseType;
  switch (port?.kind) {
    case PortKind.String:
      baseType = z.string({ message: "Please enter a string" });
      break;
    case PortKind.Enum:
      baseType = z.enum( (port.choices?.map(c => c.value) || ["fake"]) as [string], { message: "Please enter a kind" });
      break;
    case PortKind.Int:
      baseType = z.coerce.number({ message: "Please enter a valid integer" });
      break;
    case PortKind.MemoryStructure:
      baseType = z.string({ message: "Please enter a valid memory structure" });
      break;
    case PortKind.Float:
      baseType = z.coerce.number(
        { message: "Please enter a valid float" },
      ).refine((val) => !isNaN(val), {
        message: "Please enter a valid float",
      })
      break;
    case PortKind.Structure:
      baseType = z.string({ message: "Please enter a valid structure" });
      break;
    case PortKind.Union:
      let variants = port.children?.filter(notEmpty);
      if (!variants) {
        throw new Error("Union port is not defined");
        break;
      }
      baseType = z.discriminatedUnion(
        "__use",
        variants
          .map((v, index) =>
            z.object({
              __value: portToZod(v),
              __use: z.literal(index.toString()),
            }),
          ) || [],
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
      throw new Error(
        `Port kind ${port.kind} is not supported for zod validation`,
      );
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
          ) => boolean;

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

        schema.refine(
          (data) => {
            return wrappedValidator(data[port.key], data);
          },
          {
            message: validator.errorMessage || "Validation failed",
            path: [pathToName([...path, port.key])],
          },
        );

        console.log("Refined schema with", validator);
      }
    }
  });

  return schema;
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
  console.log("Parsing", data);
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
