import { PortFragment, PortKind } from "@/rekuest/api/graphql";

export const isSameStream = (
  challenging: PortFragment[] | undefined,
  having: PortFragment[] | undefined,
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
  challenging: PortFragment[] | undefined,
  having: PortFragment[] | undefined,
): boolean => {
  if (challenging == undefined || having == undefined) return false;
  if (challenging.length != having.length) return false;
  for (let i = 0; i < challenging.length; i++) {
    if (having[i].kind != PortKind.List) return false;
    if (having[i].child == undefined) return false;
    if (having[i].child?.kind != challenging[i].kind) return false;
    if (having[i].child?.identifier != challenging[i].identifier) return false;
  }

  return true;
};


export const isNullTransformable = (
  challenging: PortFragment[] | undefined,
  having: PortFragment[] | undefined,
): boolean => {
  if (challenging == undefined || having == undefined) return false;
  if (challenging.length != having.length) return false;
  let hasNonNullMismatch = false

  for (let i = 0; i < challenging.length; i++) {
    if (having[i].identifier != challenging[i].identifier) return false;
    if (having[i].kind != challenging[i].kind) return false;
    if (having[i].nullable != challenging[i].nullable) hasNonNullMismatch = true;
  }

  return hasNonNullMismatch;
};

export const withNewStream = (
  oldStreams: PortFragment[][],
  streamIndex: number,
  newStream: PortFragment[],
): PortFragment[][] => {
  let newStreams = [...oldStreams];
  newStreams[streamIndex] = newStream;
  return newStreams;
};

export const reduceStream = (streams: PortFragment[][]): PortFragment[] => {
  let reduced: PortFragment[] = [];
  for (let stream of streams) {
    reduced = reduced.concat(stream);
  }
  return reduced;
};
