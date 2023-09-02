import { PortFragment, PortKind } from "@/rekuest/api/graphql";

export const isSameStream = (
  left: PortFragment[] | undefined,
  right: PortFragment[] | undefined,
): boolean => {
  if (left == undefined || right == undefined) return false;
  if (left.length != right.length) return false;
  for (let i = 0; i < left.length; i++) {
    if (left[i].kind != right[i].kind) return false;
    if (left[i].identifier != right[i].identifier) return false;
  }
  return true;
};

export const islistTransformable = (
  left: PortFragment[] | undefined,
  right: PortFragment[] | undefined,
): boolean => {
  if (left == undefined || right == undefined) return false;
  if (left.length != right.length) return false;
  for (let i = 0; i < left.length; i++) {
    if (left[i].kind != PortKind.List) return false;
    if (left[i].child == undefined) return false;
    if (left[i].child?.kind != right[i].kind) return false;
    if (left[i].child?.identifier != right[i].identifier) return false;
  }

  return true;
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
