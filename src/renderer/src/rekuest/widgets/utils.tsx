import { notEmpty } from "@/lib/utils";
import { smartRegistry } from "@/providers/smart/registry";
import { ApolloClient, gql, NormalizedCache } from "@apollo/client";
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

/**
 * Sensible minimum width (in px) for a single item of the given kind when it is
 * laid out in a responsive `auto-fit` grid (see `ContainerGrid`'s
 * `minItemWidth`). Complex/nested kinds render tall, self-contained sub-forms
 * and want a wider track (fewer columns); simple scalar inputs pack densely.
 */
export const portToMinItemWidth = (port: { kind: PortKind }): number => {
  switch (port.kind) {
    case PortKind.Dict:
    case PortKind.Model:
    case PortKind.List:
    case PortKind.Union:
    case PortKind.Interface:
    case PortKind.MemoryStructure:
      return 320;
    default:
      // scalars, enums, dates and structure search widgets
      return 200;
  }
};

/** Human-readable name for a port, preferring the explicit label. */
export const portToName = (port: LabellablePort): string => {
  return port.label || port.key;
};

/**
 * Human-readable name for a port's structure identifier, via the smart
 * registry's reverse lookup (descriptive names are given in linkers.tsx).
 */
export const identifierToName = (
  identifier: string | null | undefined,
  fallback: string,
): string => {
  return identifier ? smartRegistry.getDisplayName(identifier) : fallback;
};

export const portToLabel = (port: LabellablePort): string => {
  if (port.kind == PortKind.Structure)
    return identifierToName(port.identifier, "Unknown Structure");
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
    return identifierToName(port.identifier, "Unknown Model");
  }
  if (port.kind == PortKind.Enum) {
    return identifierToName(port.identifier, "Unknown Enum");
  }
  if (port.kind == PortKind.MemoryStructure) {
    return identifierToName(port.identifier, "Unknown Memory Structure");
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
  const portName = portToName(port);
  let baseType;
  switch (port?.kind) {
    case PortKind.String:
      baseType = z.string({ message: `"${portName}" requires a text value` });
      break;
    case PortKind.Enum:
      baseType = z.enum(
        (port.choices?.map((c) => c.value) || ["fake"]) as [string],
        { message: `Please select a choice for "${portName}"` },
      );
      break;
    case PortKind.Int:
      baseType = z.coerce.number({
        message: `"${portName}" requires a valid integer`,
      });
      break;
    case PortKind.MemoryStructure:
      baseType = z.object(
        { __identifier: z.literal(port.identifier), object: z.string() },
        {
          message: `Please select a ${identifierToName(port.identifier, "memory structure")} for "${portName}"`,
        },
      );
      break;
    case PortKind.Float:
      baseType = z.coerce
        .number({ message: `"${portName}" requires a valid number` })
        .refine((val) => !isNaN(val), {
          message: `"${portName}" requires a valid number`,
        });
      break;
    case PortKind.Structure:
      baseType = z.object(
        { __identifier: z.literal(port.identifier), object: z.string() },
        {
          message: `Please select a ${identifierToName(port.identifier, "structure")} for "${portName}"`,
        },
      );
      break;
    case PortKind.Union:
      const variants = port.children?.filter(notEmpty);
      if (!variants || variants.length === 0) {
        throw new Error("Union port is not defined");
        break;
      }
      // The UnionWidget stores the value as { __use: "<variantIndex>", __value }
      // so the selected variant tab stays unambiguous (see UnionWidget.tsx).
      // Validate that wrapper, delegating the inner value to the selected
      // variant's schema. recursiveExtract unwraps it back to the bare value on
      // submit.
      const variantSchemas = variants.map((v, index) =>
        z.object({
          __use: z.literal(index.toString()),
          __value: portToZod(v),
        }),
      );
      baseType =
        variantSchemas.length === 1
          ? variantSchemas[0]
          : z.union(variantSchemas as [any, any, ...any[]]);
      break;
    case PortKind.Bool:
      baseType = z.boolean({
        message: `"${portName}" requires a true/false value`,
      });
      break;
    case PortKind.Dict:
      const dictChild = port.children?.at(0);
      if (!dictChild) {
        throw new Error("Dict port is not defined");
        break;
      }
      baseType = z.array(
        z.object({ __value: portToZod(dictChild), __key: z.string() }),
      );
      break;
    case PortKind.List:
      const child = port.children?.at(0);
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
    baseType = z.nullable(baseType);
  }

  return baseType;
};


export const buildDescribeFunction = (client: ApolloClient<NormalizedCache>) => {
  const document = gql(`
      query Describe($identifier: String!, $id: ID!) {
        describe(identifier: $identifier, id: $id) {
          key
          value
        }
      }
  `);

  return async (options: { identifier: string; id: string }) => {


    const result = await client.query({
      query: document,
      variables: {
        identifier: options.identifier,
        id: options.id,
      },
    });

    return result.data.describe as { key: string; value: string }[];
  }
}



export type ValidatorFunction = (
  v: any,
  x: { [key: string]: any },
) => string | undefined;

const ream = new ShadowRealm();

export const buildZodSchema = (ports: PortablePort[], path: string[] = [], __identifier?: string) => {

  let portSchemas =  ports.reduce(
      (prev, curr) => {
        prev[curr.key] = portToZod(curr);
        return prev;
      },
      {} as { [key: string]: any },
    )

  if (__identifier) {
    portSchemas = {
      ...portSchemas,
      __identifier: z.literal(__identifier),
    }
  }
  const schema = z.object(
    portSchemas
  );

  ports.forEach((port) => {
    // do somethin
    if (port.validators) {
      for (const validator of port.validators) {
        const wrappedValidator = (v: any, values: any) => {
          const wrappedValidatorFunc = `(v, values) => {
                const func = ${validator.function};

                let json_values = JSON.parse(values);

                return func(v, ...json_values);
            }`;

          const func = ream.evaluate(wrappedValidatorFunc) as (
            v: any,
            ...value: any
          ) => boolean;

          const params = validator.dependencies?.map((dep) => values[dep]);
          if (params?.every((predicate) => predicate != undefined)) {
            const serialized_values = JSON.stringify(params);
            const x = func(v, serialized_values);
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
  if (data == undefined || data == null) return null;
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

  if (port.kind == PortKind.Union) {
    const variants = port.children?.filter(notEmpty) || [];
    const variant = variants[Number(data.__use)];
    if (!variant) return null;
    return recursiveExtract(data.__value, variant);
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
    const childPort = port.children?.at(0);
    if (!childPort) throw new Error("List port is not defined");
    return data.map((item: any) => ({
      __value: recursiveSet(item, childPort),
    }));
  }

  if (port.kind == PortKind.Dict) {
    const childPort = port.children?.at(0);
    if (!childPort) throw new Error("Dict port is not defined");

    return Object.entries(data).map(([key, value]) => ({
      __key: key,
      __value: recursiveSet(value, childPort),
    }));
  }

  if (port.kind == PortKind.Union) {
    const variants = port.children?.filter(notEmpty) || [];
    // Pick the first variant whose schema accepts the raw value and wrap it in
    // the { __use, __value } shape the UnionWidget expects.
    const index = variants.findIndex(
      (v) => portToZod(v).safeParse(data).success,
    );
    const useIndex = index === -1 ? 0 : index;
    const variant = variants[useIndex];
    if (!variant) return null;
    return { __use: useIndex.toString(), __value: recursiveSet(data, variant) };
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
