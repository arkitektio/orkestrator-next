import { describe, expect, it, vi } from "vitest";

// `../api/graphql` is the 1.3MB generated Apollo module (and pulls in the
// rekuest hooks/client). We only need the PortKind enum, so stub it. The smart
// registry drags in UI components, and shadowrealm-api instantiates a realm at
// module load — both are stubbed so this stays a fast, isolated unit test.
vi.mock("../api/graphql", () => ({
  PortKind: {
    Bool: "BOOL",
    Date: "DATE",
    Dict: "DICT",
    Enum: "ENUM",
    Float: "FLOAT",
    Int: "INT",
    Interface: "INTERFACE",
    List: "LIST",
    MemoryStructure: "MEMORY_STRUCTURE",
    Model: "MODEL",
    String: "STRING",
    Structure: "STRUCTURE",
    Union: "UNION",
  },
}));

vi.mock("@/providers/smart/registry", () => ({
  smartRegistry: { getDisplayName: (identifier: string) => identifier },
}));

vi.mock("shadowrealm-api", () => ({
  default: class ShadowRealmStub {
    evaluate() {
      return () => true;
    }
  },
}));

import type { LabellablePort, PortablePort } from "./types";
import { PortKind } from "../api/graphql";
import {
  argDictToArgs,
  buildZodSchema,
  isObjectPort,
  isScalarPort,
  pathToName,
  portToDefaults,
  portToLabel,
  portToMinItemWidth,
  portToName,
  portToZod,
  recursiveExtract,
  recursiveSet,
  setData,
  submittedDataToRekuestFormat,
} from "./utils";

const p = (over: Partial<PortablePort> & { kind: PortKind; key: string }): PortablePort =>
  over as PortablePort;

describe("pathToName", () => {
  it("joins path segments with dots", () => {
    expect(pathToName(["a", "b", "c"])).toBe("a.b.c");
  });
});

describe("isScalarPort", () => {
  it("treats scalars, structures and lists as scalar", () => {
    for (const kind of [
      PortKind.Bool,
      PortKind.Float,
      PortKind.Int,
      PortKind.String,
      PortKind.Date,
      PortKind.Structure,
      PortKind.List,
    ]) {
      expect(isScalarPort({ kind })).toBe(true);
    }
  });

  it("is false for dict and model", () => {
    expect(isScalarPort({ kind: PortKind.Dict })).toBe(false);
    expect(isScalarPort({ kind: PortKind.Model })).toBe(false);
  });
});

describe("isObjectPort", () => {
  it("is true for dict and model only", () => {
    expect(isObjectPort({ kind: PortKind.Dict } as LabellablePort)).toBe(true);
    expect(isObjectPort({ kind: PortKind.Model } as LabellablePort)).toBe(true);
    expect(isObjectPort({ kind: PortKind.Int } as LabellablePort)).toBe(false);
  });
});

describe("portToMinItemWidth", () => {
  it("gives complex kinds a wider track", () => {
    expect(portToMinItemWidth({ kind: PortKind.Model })).toBe(320);
    expect(portToMinItemWidth({ kind: PortKind.Union })).toBe(320);
  });

  it("packs scalars densely", () => {
    expect(portToMinItemWidth({ kind: PortKind.Int })).toBe(200);
    expect(portToMinItemWidth({ kind: PortKind.String })).toBe(200);
  });
});

describe("portToName", () => {
  it("prefers the explicit label, falling back to the key", () => {
    expect(portToName({ kind: PortKind.Int, key: "age", label: "Age" } as LabellablePort)).toBe("Age");
    expect(portToName({ kind: PortKind.Int, key: "age" } as LabellablePort)).toBe("age");
  });
});

describe("portToLabel", () => {
  it("labels scalar kinds", () => {
    expect(portToLabel({ kind: PortKind.Bool, key: "b" } as LabellablePort)).toBe("Bool");
    expect(portToLabel({ kind: PortKind.Int, key: "i" } as LabellablePort)).toBe("Int");
    expect(portToLabel({ kind: PortKind.String, key: "s" } as LabellablePort)).toBe("String");
  });

  it("resolves a structure identifier via the smart registry", () => {
    expect(
      portToLabel({ kind: PortKind.Structure, key: "s", identifier: "@mikro/image" } as LabellablePort),
    ).toBe("@mikro/image");
  });

  it("describes a list by its child", () => {
    const list = {
      kind: PortKind.List,
      key: "l",
      children: [{ kind: PortKind.Int, key: "c" }],
    } as LabellablePort;
    expect(portToLabel(list)).toBe("List of Int");
  });

  it("falls back to 'Unknown List' for a childless list", () => {
    expect(portToLabel({ kind: PortKind.List, key: "l", children: [] } as LabellablePort)).toBe(
      "Unknown List",
    );
  });
});

describe("portToZod", () => {
  it("validates strings", () => {
    const schema = portToZod(p({ kind: PortKind.String, key: "s" }));
    expect(schema.safeParse("hi").success).toBe(true);
    expect(schema.safeParse(5).success).toBe(false);
  });

  it("coerces ints", () => {
    const schema = portToZod(p({ kind: PortKind.Int, key: "i" }));
    expect(schema.parse("42")).toBe(42);
  });

  it("rejects non-numeric floats", () => {
    const schema = portToZod(p({ kind: PortKind.Float, key: "f" }));
    expect(schema.safeParse("not-a-number").success).toBe(false);
    expect(schema.parse("3.5")).toBe(3.5);
  });

  it("validates booleans", () => {
    const schema = portToZod(p({ kind: PortKind.Bool, key: "b" }));
    expect(schema.safeParse(true).success).toBe(true);
    expect(schema.safeParse("nope").success).toBe(false);
  });

  it("builds an enum from choices", () => {
    const schema = portToZod(
      p({ kind: PortKind.Enum, key: "e", choices: [{ value: "a" }, { value: "b" }] as any }),
    );
    expect(schema.safeParse("a").success).toBe(true);
    expect(schema.safeParse("z").success).toBe(false);
  });

  it("validates a structure as { __identifier, object }", () => {
    const schema = portToZod(p({ kind: PortKind.Structure, key: "s", identifier: "@x/s" }));
    expect(schema.safeParse({ __identifier: "@x/s", object: "id1" }).success).toBe(true);
    expect(schema.safeParse({ __identifier: "@other/s", object: "id1" }).success).toBe(false);
  });

  it("wraps nullable ports so null is accepted", () => {
    const schema = portToZod(p({ kind: PortKind.String, key: "s", nullable: true }));
    expect(schema.safeParse(null).success).toBe(true);
  });

  it("validates a list of wrapped values", () => {
    const schema = portToZod(
      p({ kind: PortKind.List, key: "l", children: [{ kind: PortKind.Int, key: "c" }] }),
    );
    expect(schema.safeParse([{ __value: 1 }, { __value: 2 }]).success).toBe(true);
  });

  it("validates a single-variant union as the { __use, __value } wrapper", () => {
    // The UnionWidget stores a union value as { __use: "<variantIndex>", __value }
    // so the chosen variant tab is unambiguous; portToZod validates that wrapper.
    const schema = portToZod(
      p({ kind: PortKind.Union, key: "u", children: [{ kind: PortKind.String, key: "c" }] }),
    );
    expect(schema.safeParse({ __use: "0", __value: "hi" }).success).toBe(true);
    expect(schema.safeParse("hi").success).toBe(false);
  });

  it("throws for an empty union", () => {
    expect(() => portToZod(p({ kind: PortKind.Union, key: "u", children: [] }))).toThrow(
      "Union port is not defined",
    );
  });

  it("throws for an unsupported kind", () => {
    expect(() => portToZod(p({ kind: PortKind.Interface, key: "x" }))).toThrow();
  });
});

describe("buildZodSchema", () => {
  it("composes a model object schema from its ports", () => {
    const schema = buildZodSchema([
      p({ kind: PortKind.String, key: "name" }),
      p({ kind: PortKind.Int, key: "age" }),
    ]);
    expect(schema.safeParse({ name: "Ada", age: "36" }).success).toBe(true);
    expect(schema.safeParse({ name: 5, age: "x" }).success).toBe(false);
  });

  it("adds an __identifier literal when given", () => {
    const schema = buildZodSchema([p({ kind: PortKind.String, key: "name" })], [], "@x/model");
    expect(schema.safeParse({ name: "Ada", __identifier: "@x/model" }).success).toBe(true);
    expect(schema.safeParse({ name: "Ada", __identifier: "@x/other" }).success).toBe(false);
  });
});

describe("recursiveSet / recursiveExtract round-trip", () => {
  const intList = p({ kind: PortKind.List, key: "l", children: [{ kind: PortKind.Int, key: "c" }] });

  it("wraps list items under __value on set", () => {
    expect(recursiveSet([1, 2], intList)).toEqual([{ __value: 1 }, { __value: 2 }]);
  });

  it("unwraps list items on extract", () => {
    expect(recursiveExtract([{ __value: 1 }, { __value: 2 }], intList)).toEqual([1, 2]);
  });

  it("returns scalars unchanged", () => {
    const intPort = p({ kind: PortKind.Int, key: "i" });
    expect(recursiveSet(7, intPort)).toBe(7);
    expect(recursiveExtract(7, intPort)).toBe(7);
  });

  it("returns null for nullish input on set/extract", () => {
    const intPort = p({ kind: PortKind.Int, key: "i" });
    expect(recursiveSet(null, intPort)).toBeNull();
    expect(recursiveExtract(undefined, intPort)).toBeNull();
  });

  it("maps a dict to keyed __value/__key pairs on set", () => {
    const dict = p({ kind: PortKind.Dict, key: "d", children: [{ kind: PortKind.Int, key: "c" }] });
    expect(recursiveSet({ a: 1, b: 2 }, dict)).toEqual([
      { __key: "a", __value: 1 },
      { __key: "b", __value: 2 },
    ]);
  });

  it("wraps a union value as { __use, __value } on set and unwraps on extract", () => {
    const union = p({
      kind: PortKind.Union,
      key: "u",
      children: [{ kind: PortKind.String, key: "s" }],
    });
    const wrapped = recursiveSet("hello", union);
    expect(wrapped).toEqual({ __use: "0", __value: "hello" });
    expect(recursiveExtract(wrapped, union)).toBe("hello");
  });
});

describe("submittedDataToRekuestFormat / setData / portToDefaults", () => {
  const ports = [
    p({ kind: PortKind.String, key: "name" }),
    p({ kind: PortKind.List, key: "tags", children: [{ kind: PortKind.String, key: "c" }] }),
  ];

  it("extracts each port by key", () => {
    expect(
      submittedDataToRekuestFormat({ name: "Ada", tags: [{ __value: "x" }] }, ports),
    ).toEqual({ name: "Ada", tags: ["x"] });
  });

  it("sets each port by key", () => {
    expect(setData({ name: "Ada", tags: ["x", "y"] }, ports)).toEqual({
      name: "Ada",
      tags: [{ __value: "x" }, { __value: "y" }],
    });
  });

  it("portToDefaults delegates to setData over the overwrites", () => {
    expect(portToDefaults(ports, { name: "Ada", tags: ["x"] })).toEqual({
      name: "Ada",
      tags: [{ __value: "x" }],
    });
  });

  it("portToDefaults prefills scalar ports from their default when no overwrite", () => {
    const defaultedPorts = [
      p({ kind: PortKind.String, key: "name", default: "Ada" }),
      p({ kind: PortKind.Int, key: "age", default: 42 }),
    ];
    expect(portToDefaults(defaultedPorts, {})).toEqual({
      name: "Ada",
      age: 42,
    });
  });

  it("portToDefaults lets an overwrite win over the port default", () => {
    const defaultedPorts = [p({ kind: PortKind.String, key: "name", default: "Ada" })];
    expect(portToDefaults(defaultedPorts, { name: "Grace" })).toEqual({
      name: "Grace",
    });
  });

  it("portToDefaults preserves falsy defaults (0, false)", () => {
    const defaultedPorts = [
      p({ kind: PortKind.Int, key: "count", default: 0 }),
      p({ kind: PortKind.Bool, key: "flag", default: false }),
    ];
    expect(portToDefaults(defaultedPorts, {})).toEqual({
      count: 0,
      flag: false,
    });
  });

  it("portToDefaults hydrates a list default into rows", () => {
    const defaultedPorts = [
      p({
        kind: PortKind.List,
        key: "tags",
        children: [{ kind: PortKind.String, key: "c" }],
        default: ["x", "y"],
      }),
    ];
    expect(portToDefaults(defaultedPorts, {})).toEqual({
      tags: [{ __value: "x" }, { __value: "y" }],
    });
  });
});

describe("argDictToArgs", () => {
  it("maps ports to dict values, falling back to default then null", () => {
    const ports = [
      p({ kind: PortKind.String, key: "a" }),
      p({ kind: PortKind.Int, key: "b", default: 5 }),
      p({ kind: PortKind.Int, key: "c" }),
    ];
    expect(argDictToArgs({ a: "x" }, ports)).toEqual(["x", 5, null]);
  });
});
