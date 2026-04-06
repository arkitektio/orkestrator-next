import { GeneralPort, PortKind } from "../types";



export const isSameStream = (
  challenging: GeneralPort[] | undefined,
  having: GeneralPort[] | undefined,
): boolean => {
  if (challenging == undefined || having == undefined) return false;
  if (challenging.length != having.length) return false;
  for (let i = 0; i < having.length; i++) {
    if (having[i].kind != challenging[i].kind) return false;
    if (having[i].identifier != challenging[i].identifier) return false;
  }
  return true;
};

export const islistTransformable = (
  challenging: GeneralPort[] | undefined,
  having: GeneralPort[] | undefined,
): boolean => {
  if (challenging == undefined || having == undefined) return false;
  if (challenging.length != having.length) return false;
  for (let i = 0; i < challenging.length; i++) {
    if (having[i].kind != PortKind.List) return false;
    if (having[i].children?.at(0) == undefined) return false;
    if (having[i].children?.at(0)?.kind != challenging[i].kind) return false;
    if (having[i].children?.at(0)?.identifier != challenging[i].identifier)
      return false;
  }

  return true;
};

export const isFloatTransformable = (
  challenging: GeneralPort[] | undefined,
  having: GeneralPort[] | undefined,
): boolean => {
  if (challenging == undefined || having == undefined) return false;
  if (challenging.length != having.length) return false;
  for (let i = 0; i < challenging.length; i++) {
    if (having[i].kind != PortKind.Int) return false;
    if (challenging[i].kind != PortKind.Float) return false;
  }

  return true;
};

export const isIntTransformable = (
  challenging: GeneralPort[] | undefined,
  having: GeneralPort[] | undefined,
): boolean => {
  if (challenging == undefined || having == undefined) return false;
  if (challenging.length != having.length) return false;
  for (let i = 0; i < challenging.length; i++) {
    if (having[i].kind != PortKind.Float) return false;
    if (challenging[i].kind != PortKind.Int) return false;
  }

  return true;
};

export const isChunkTransformable = (
  challenging: GeneralPort[] | undefined,
  having: GeneralPort[] | undefined,
): boolean => {
  if (challenging == undefined || having == undefined) return false;
  if (challenging.length != having.length) return false;
  for (let i = 0; i < having.length; i++) {
    if (challenging[i].kind != PortKind.List) return false;
    if (challenging[i].children?.at(0) == undefined) return false;
    if (challenging[i].children?.at(0)?.kind != having[i].kind) return false;
    if (challenging[i].children?.at(0)?.identifier != having[i].identifier)
      return false;
  }

  return true;
};

export const isNullTransformable = (
  challenging: GeneralPort[] | undefined,
  having: GeneralPort[] | undefined,
): boolean => {
  if (challenging == undefined || having == undefined) return false;
  if (challenging.length != having.length) return false;
  let hasNonNullMismatch = false;

  for (let i = 0; i < challenging.length; i++) {
    if (having[i].identifier != challenging[i].identifier) return false;
    if (having[i].kind != challenging[i].kind) return false;
    if (having[i].nullable != challenging[i].nullable)
      hasNonNullMismatch = true;
  }

  return hasNonNullMismatch;
};

export const withNewStream = (
  oldStreams: GeneralPort[][],
  streamIndex: number,
  newStream: GeneralPort[],
): GeneralPort[][] => {
  const newStreams = [...oldStreams];
  newStreams[streamIndex] = newStream;
  return newStreams;
};

export const reduceStream = (streams: GeneralPort[][]): GeneralPort[] => {
  let reduced: GeneralPort[] = [];
  for (const stream of streams) {
    reduced = reduced.concat(stream);
  }
  return reduced;
};
