import { PortKind, ProtocolAgentFragment } from "@/rekuest/api/graphql";

type ImportTracker = {
  needsDataclass: boolean;
  needsDatetime: boolean;
  needsFutureAnnotations: boolean;
  typing: Set<string>;
};

type PythonPort = {
  children?: Array<PythonPort | null> | null;
  identifier?: string | null;
  key?: string | null;
  kind: PortKind;
  // Deeply-nested child port fragments don't always select `nullable`.
  nullable?: boolean | null;
};

type ModelDefinition = {
  className: string;
  identifier: string;
  port: PythonPort;
};

type TypeRegistry = {
  modelDefinitions: Map<string, ModelDefinition>;
  structureAliases: Map<string, string>;
  usedNames: Set<string>;
};

const toPythonIdentifier = (value: string | null | undefined, fallback: string) => {
  const normalized = (value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!normalized) {
    return fallback;
  }

  return /^[0-9]/.test(normalized) ? `_${normalized}` : normalized;
};

const toPythonClassName = (name: string | null | undefined) => {
  const words = (name ?? "").trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (!words.length) return "Agent";
  const pascal = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
  return /^[0-9]/.test(pascal) ? `Agent${pascal}` : pascal;
};

const ensureStateClassName = (name: string) => {
  const className = toPythonClassName(name);
  return className.endsWith("State") ? className : `${className}State`;
};

const escapePyTripleString = (value?: string | null) =>
  value ? value.replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"') : null;

const identifierToClassName = (identifier?: string | null) => {
  if (!identifier) {
    return null;
  }

  const parts = String(identifier).split("/");
  return toPythonClassName(parts[parts.length - 1]);
};

const comparePortKeys = (left: { key?: string | null }, right: { key?: string | null }) => {
  const leftKey = left.key ?? "";
  const rightKey = right.key ?? "";
  return leftKey.localeCompare(rightKey);
};

const createTypeRegistry = (): TypeRegistry => ({
  modelDefinitions: new Map(),
  structureAliases: new Map(),
  usedNames: new Set(),
});

const reserveTypeName = (
  baseName: string,
  registry: TypeRegistry,
  preferredSuffix?: string,
) => {
  const normalizedBase = toPythonClassName(baseName);
  let candidate = preferredSuffix
    ? `${normalizedBase}${preferredSuffix}`
    : normalizedBase;

  if (registry.usedNames.has(candidate) && !preferredSuffix) {
    candidate = `${normalizedBase}Type`;
  }

  let suffix = 2;
  while (registry.usedNames.has(candidate)) {
    candidate = `${normalizedBase}${preferredSuffix ?? "Type"}${suffix}`;
    suffix += 1;
  }

  registry.usedNames.add(candidate);
  return candidate;
};

const getStructureAliasName = (
  identifier: string,
  registry: TypeRegistry,
) => {
  const existing = registry.structureAliases.get(identifier);
  if (existing) {
    return existing;
  }

  const baseName = identifierToClassName(identifier) ?? "Structure";
  const aliasName = reserveTypeName(baseName, registry, "Ref");
  registry.structureAliases.set(identifier, aliasName);
  return aliasName;
};

const getModelClassName = (
  identifier: string,
  port: PythonPort,
  registry: TypeRegistry,
) => {
  const existing = registry.modelDefinitions.get(identifier);
  if (existing) {
    return existing.className;
  }

  const baseName = identifierToClassName(identifier) ?? "Model";
  const className = reserveTypeName(baseName, registry, "Model");
  registry.modelDefinitions.set(identifier, {
    className,
    identifier,
    port,
  });
  return className;
};

const collectCustomTypes = (port: PythonPort, registry: TypeRegistry) => {
  if (port.kind === PortKind.Structure && port.identifier) {
    getStructureAliasName(String(port.identifier), registry);
  }

  if (port.kind === PortKind.Model && port.identifier) {
    getModelClassName(String(port.identifier), port, registry);
  }

  port.children?.forEach((child) => {
    if (child) {
      collectCustomTypes(child, registry);
    }
  });
};

const collectProtocolTypes = (agent: ProtocolAgentFragment, registry: TypeRegistry) => {
  agent.states.forEach((state) => {
    state.definition.ports.forEach((port) => collectCustomTypes(port, registry));
  });

  agent.implementations.forEach((implementation) => {
    implementation.action.args.forEach((arg) => collectCustomTypes(arg, registry));
    implementation.action.returns.forEach((ret) => collectCustomTypes(ret, registry));
  });
};

const basePortTypePy = (
  port: PythonPort,
  tracker: ImportTracker,
  registry: TypeRegistry,
): string => {
  switch (port.kind) {
    case PortKind.String:
      return "str";
    case PortKind.Int:
      return "int";
    case PortKind.Float:
      return "float";
    case PortKind.Bool:
      return "bool";
    case PortKind.Date:
      tracker.needsDatetime = true;
      return "datetime";
    case PortKind.Enum:
      return "str";
    case PortKind.List: {
      const child = port.children?.find(Boolean) ?? null;
      if (!child) {
        tracker.typing.add("Any");
        return "list[Any]";
      }
      return `list[${portTypePy(child, tracker, registry)}]`;
    }
    case PortKind.Dict: {
      const child = port.children?.find(Boolean) ?? null;
      if (!child) {
        tracker.typing.add("Any");
        return "dict[str, Any]";
      }
      return `dict[str, ${portTypePy(child, tracker, registry)}]`;
    }
    case PortKind.Union: {
      const children = (port.children ?? []).filter(
        (child): child is PythonPort => Boolean(child),
      );

      if (!children.length) {
        tracker.typing.add("Any");
        return "Any";
      }

      const uniqueTypes = Array.from(
        new Set(children.map((child) => portTypePy(child, tracker, registry))),
      );

      if (uniqueTypes.length === 1) {
        return uniqueTypes[0];
      }

      tracker.typing.add("Union");
      return `Union[${uniqueTypes.join(", ")}]`;
    }
    case PortKind.Structure: {
      if (port.identifier) {
        tracker.typing.add("TypeAlias");
        return getStructureAliasName(String(port.identifier), registry);
      }
      return "str";
    }
    case PortKind.Model: {
      if (port.identifier) {
        tracker.needsFutureAnnotations = true;
        return getModelClassName(String(port.identifier), port, registry);
      }
      tracker.typing.add("Any");
      return "Any";
    }
    case PortKind.Interface:
    case PortKind.MemoryStructure: {
      const className = identifierToClassName(port.identifier);
      if (className) {
        return className;
      }
      tracker.typing.add("Any");
      return "Any";
    }
    default:
      tracker.typing.add("Any");
      return "Any";
  }
};

const portTypePy = (
  port: PythonPort,
  tracker: ImportTracker,
  registry: TypeRegistry,
): string => {
  const base = basePortTypePy(port, tracker, registry);
  if (!port.nullable) {
    return base;
  }

  tracker.typing.add("Optional");
  return `Optional[${base}]`;
};

const renderStateDataclasses = (
  agent: ProtocolAgentFragment,
  tracker: ImportTracker,
  registry: TypeRegistry,
) => {
  const uniqueStateDefinitions = Array.from(
    new Map(
      (agent.states ?? []).map((state) => [state.definition.hash, state]),
    ).values(),
  );

  if (!uniqueStateDefinitions.length) {
    return [] as string[];
  }

  tracker.needsDataclass = true;

  const usedClassNames = new Set<string>();

  return uniqueStateDefinitions.map((state, stateIndex) => {
    const preferredName =
      state.definition.name || state.interface || `State${stateIndex + 1}`;
    const baseClassName = ensureStateClassName(preferredName);

    let className = baseClassName;
    let suffix = 2;
    while (usedClassNames.has(className)) {
      className = `${baseClassName}${suffix}`;
      suffix += 1;
    }
    usedClassNames.add(className);

    const orderedPorts = [...state.definition.ports].sort((left, right) => {
      if (left.nullable === right.nullable) {
        return comparePortKeys(left, right);
      }

      return left.nullable ? 1 : -1;
    });

    const fieldLines = orderedPorts.length
      ? orderedPorts.map((port, portIndex) => {
          const fieldName = toPythonIdentifier(port.key, `field_${portIndex + 1}`);
          const typeName = portTypePy(port, tracker, registry);

          if (port.nullable) {
            return `    ${fieldName}: ${typeName} = None`;
          }

          return `    ${fieldName}: ${typeName}`;
        })
      : ["    pass"];

    return [
      "@dataclass",
      `class ${className}:`,
      ...fieldLines,
    ].join("\n");
  });
};

const renderTypeAliases = (registry: TypeRegistry) => {
  if (!registry.structureAliases.size) {
    return [] as string[];
  }

  return Array.from(registry.structureAliases.entries())
    .sort((left, right) => left[1].localeCompare(right[1]))
    .map(([, aliasName]) => `${aliasName}: TypeAlias = str`);
};

const renderModelDataclasses = (
  tracker: ImportTracker,
  registry: TypeRegistry,
) => {
  const definitions = Array.from(registry.modelDefinitions.values()).sort((left, right) =>
    left.className.localeCompare(right.className),
  );

  if (!definitions.length) {
    return [] as string[];
  }

  tracker.needsDataclass = true;
  tracker.needsFutureAnnotations = true;

  return definitions.flatMap((definition, definitionIndex) => {
    const orderedChildren = [...(definition.port.children ?? [])]
      .filter((child): child is PythonPort => Boolean(child))
      .sort((left, right) => {
        if (left.nullable === right.nullable) {
          return comparePortKeys(left, right);
        }

        return left.nullable ? 1 : -1;
      });

    const fieldLines = orderedChildren.length
      ? orderedChildren.map((child, childIndex) => {
          const fieldName = toPythonIdentifier(child.key, `field_${childIndex + 1}`);
          const typeName = portTypePy(child, tracker, registry);

          if (child.nullable) {
            return `    ${fieldName}: ${typeName} = None`;
          }

          return `    ${fieldName}: ${typeName}`;
        })
      : ["    pass"];

    const block = ["@dataclass", `class ${definition.className}:`, ...fieldLines].join("\n");

    return definitionIndex === definitions.length - 1 ? [block] : [block, ""];
  });
};

export const protocolAgentToPythonString = (agent: ProtocolAgentFragment): string => {
  const className = toPythonClassName(agent.name);
  const usedMethodNames = new Set<string>();
  const registry = createTypeRegistry();
  const tracker: ImportTracker = {
    needsDataclass: false,
    needsDatetime: false,
    needsFutureAnnotations: false,
    typing: new Set(["Protocol"]),
  };

  collectProtocolTypes(agent, registry);

  const typeAliasBlocks = renderTypeAliases(registry);
  const modelBlocks = renderModelDataclasses(tracker, registry);
  const stateBlocks = renderStateDataclasses(agent, tracker, registry);

  const methodBlocks = agent.implementations.map((impl, index) => {
    const preferredName = impl.action.key;
    const baseMethodName = toPythonIdentifier(
      preferredName,
      `method_${index + 1}`,
    );

    let methodName = baseMethodName;
    let suffix = 2;
    while (usedMethodNames.has(methodName)) {
      methodName = `${baseMethodName}_${suffix}`;
      suffix += 1;
    }
    usedMethodNames.add(methodName);

    const argList = impl.action.args
      .map((arg, argIndex) => {
        const argName = toPythonIdentifier(arg.key, `arg_${argIndex + 1}`);
        const pyType = portTypePy(arg, tracker, registry);
        return `${argName}: ${pyType}`;
      })
      .join(", ");

    const returns = impl.action.returns;
    let returnType = "None";
    if (returns.length === 1) {
      returnType = portTypePy(returns[0], tracker, registry);
    } else if (returns.length > 1) {
      tracker.typing.add("Tuple");
      returnType = `Tuple[${returns.map((ret) => portTypePy(ret, tracker, registry)).join(", ")}]`;
    }

    const description = escapePyTripleString(impl.action.description);
    const params = argList ? `self, ${argList}` : "self";

    return [
      `    def ${methodName}(${params}) -> ${returnType}:`,
      `        """${description ?? impl.action.name}"""`,
      "        ...",
      "",
    ].join("\n");
  });

  const protocolBody = methodBlocks.length ? methodBlocks.join("\n") : "    pass\n";
  const importLines = [
    tracker.needsFutureAnnotations ? "from __future__ import annotations" : null,
    tracker.needsDataclass ? "from dataclasses import dataclass" : null,
    tracker.needsDatetime ? "from datetime import datetime" : null,
    `from typing import ${Array.from(tracker.typing).sort().join(", ")}`,
    "from arkitekt_next import declare",
  ].filter((line): line is string => Boolean(line));

  return [
    ...importLines,
    "",
    ...(typeAliasBlocks.length ? [...typeAliasBlocks, ""] : []),
    ...(modelBlocks.length ? [...modelBlocks, ""] : []),
    ...(stateBlocks.length ? [...stateBlocks, ""] : []),
    `@declare(app="${agent.app.identifier}")`,
    `class ${className}Like(Protocol):`,
    protocolBody,
  ].join("\n");
};
