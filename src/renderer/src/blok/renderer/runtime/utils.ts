const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

const decodeJsonLiteralString = (value: string): unknown => {
  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  const firstCharacter = trimmed[0];
  const looksLikeJsonLiteral =
    firstCharacter === '"' ||
    firstCharacter === '[' ||
    firstCharacter === '{' ||
    firstCharacter === '-' ||
    (firstCharacter >= '0' && firstCharacter <= '9') ||
    trimmed === 'true' ||
    trimmed === 'false' ||
    trimmed === 'null';

  if (!looksLikeJsonLiteral) {
    return value;
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return value;
  }
};

const normalizeLiteralValue = (value: unknown): unknown => {
  return isString(value) ? decodeJsonLiteralString(value) : value;
};

const getValueAtPath = (dataModel: unknown, path: string): unknown => {
  if (!path) {
    return dataModel;
  }

  const segments = path
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean);

  let current: unknown = dataModel;
  for (const segment of segments) {
    if (Array.isArray(current)) {
      const index = Number(segment);
      current = Number.isInteger(index) ? current[index] : undefined;
      continue;
    }

    if (!isRecord(current)) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
};

export {decodeJsonLiteralString, getValueAtPath, isRecord, isString, normalizeLiteralValue};