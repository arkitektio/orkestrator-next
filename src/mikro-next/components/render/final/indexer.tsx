import { Chunk, DataType, Scalar, TypedArray } from "zarrita";

/** Similar to python's `range` function. Supports positive ranges only. */
export function* range(
  start: number,
  stop?: number,
  step = 1,
): Iterable<number> {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }
  for (let i = start; i < stop; i += step) {
    yield i;
  }
}

/**
 * python-like itertools.product generator
 * https://gist.github.com/cybercase/db7dde901d7070c98c48
 */
export function* product<T extends Array<Iterable<unknown>>>(
  ...iterables: T
): IterableIterator<{
  [K in keyof T]: T[K] extends Iterable<infer U> ? U : never;
}> {
  if (iterables.length === 0) {
    return;
  }
  // make a list of iterators from the iterables
  const iterators = iterables.map((it) => it[Symbol.iterator]());
  const results = iterators.map((it) => it.next());
  if (results.some((r) => r.done)) {
    throw new Error("Input contains an empty iterator.");
  }
  for (let i = 0; ;) {
    if (results[i].done) {
      // reset the current iterator
      iterators[i] = iterables[i][Symbol.iterator]();
      results[i] = iterators[i].next();
      // advance, and exit if we've reached the end
      if (++i >= iterators.length) {
        return;
      }
    } else {
      // @ts-expect-error - TS can't infer this
      yield results.map(({ value }) => value);
      i = 0;
    }
    results[i] = iterators[i].next();
  }
}

// https://github.com/python/cpython/blob/263c0dd16017613c5ea2fbfc270be4de2b41b5ad/Objects/sliceobject.c#L376-L519
export function slice_indices(
  { start, stop, step }: Slice,
  length: number,
): Indices {
  if (step === 0) {
    throw new Error("slice step cannot be zero");
  }
  step = step ?? 1;
  const step_is_negative = step < 0;

  /* Find lower and upper bounds for start and stop. */
  const [lower, upper] = step_is_negative ? [-1, length - 1] : [0, length];

  /* Compute start. */
  if (start === null) {
    start = step_is_negative ? upper : lower;
  } else {
    if (start < 0) {
      start += length;
      if (start < lower) {
        start = lower;
      }
    } else if (start > upper) {
      start = upper;
    }
  }

  /* Compute stop. */
  if (stop === null) {
    stop = step_is_negative ? lower : upper;
  } else {
    if (stop < 0) {
      stop += length;
      if (stop < lower) {
        stop = lower;
      }
    } else if (stop > upper) {
      stop = upper;
    }
  }

  return [start, stop, step];
}

/** @category Utilty */
export function slice(stop: number | null): Slice;
export function slice(
  start: number | null,
  stop?: number | null,
  step?: number | null,
): Slice;
export function slice(
  start: number | null,
  stop?: number | null,
  step: number | null = null,
): Slice {
  if (stop === undefined) {
    stop = start;
    start = null;
  }
  return {
    start,
    stop,
    step,
  };
}

/** Built-in "queue" for awaiting promises. */
export function create_queue(): ChunkQueue {
  const promises: Promise<void>[] = [];
  return {
    add: (fn) => promises.push(fn()),
    onIdle: () => Promise.all(promises),
  };
}

export type Indices = [start: number, stop: number, step: number];

export interface Slice {
  start: number | null;
  stop: number | null;
  step: number | null;
}

export type Projection =
  | { from: null; to: number }
  | { from: number; to: null }
  | {
    from: Indices;
    to: Indices;
  };

export type Prepare<D extends DataType, NdArray extends Chunk<D>> = (
  data: TypedArray<D>,
  shape: number[],
  stride: number[],
) => NdArray;

export type SetScalar<D extends DataType, NdArray extends Chunk<D>> = (
  target: NdArray,
  selection: (Indices | number)[],
  value: Scalar<D>,
) => void;

export type SetFromChunk<D extends DataType, NdArray extends Chunk<D>> = (
  a: NdArray,
  b: NdArray,
  proj: Projection[],
) => void;

export type Setter<D extends DataType, Arr extends Chunk<D>> = {
  prepare: Prepare<D, Arr>;
  set_from_chunk: SetFromChunk<D, Arr>;
  set_scalar: SetScalar<D, Arr>;
};

export type Options = {
  create_queue?: () => ChunkQueue;
};

export type GetOptions<O> = Options & { opts?: O };

export type SetOptions = Options;

// Compatible with https://github.com/sindresorhus/p-queue
export type ChunkQueue = {
  add(fn: () => Promise<void>): void;
  onIdle(): Promise<Array<void>>;
};

export class IndexError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "IndexError";
  }
}

function err_too_many_indices(
  selection: (number | Slice)[],
  shape: readonly number[],
) {
  throw new IndexError(
    `too many indicies for array; expected ${shape.length}, got ${selection.length}`,
  );
}

function err_boundscheck(dim_len: number) {
  throw new IndexError(
    `index out of bounds for dimension with length ${dim_len}`,
  );
}

function err_negative_step() {
  throw new IndexError("only slices with step >= 1 are supported");
}

function check_selection_length(
  selection: (number | Slice)[],
  shape: readonly number[],
) {
  if (selection.length > shape.length) {
    err_too_many_indices(selection, shape);
  }
}

export function normalize_integer_selection(dim_sel: number, dim_len: number) {
  // normalize type to int
  dim_sel = Math.trunc(dim_sel);
  // handle wraparound
  if (dim_sel < 0) {
    dim_sel = dim_len + dim_sel;
  }
  // handle out of bounds
  if (dim_sel >= dim_len || dim_sel < 0) {
    err_boundscheck(dim_len);
  }
  return dim_sel;
}

interface IntChunkDimProjection {
  dim_chunk_ix: number;
  dim_chunk_sel: number;
}

interface IntDimIndexerProps {
  dim_sel: number;
  dim_len: number;
  dim_chunk_len: number;
}

class IntDimIndexer {
  dim_sel: number;
  dim_len: number;
  dim_chunk_len: number;
  nitems: 1;

  constructor({ dim_sel, dim_len, dim_chunk_len }: IntDimIndexerProps) {
    // normalize
    dim_sel = normalize_integer_selection(dim_sel, dim_len);
    // store properties
    this.dim_sel = dim_sel;
    this.dim_len = dim_len;
    this.dim_chunk_len = dim_chunk_len;
    this.nitems = 1;
  }

  *[Symbol.iterator](): IterableIterator<IntChunkDimProjection> {
    const dim_chunk_ix = Math.floor(this.dim_sel / this.dim_chunk_len);
    const dim_offset = dim_chunk_ix * this.dim_chunk_len;
    const dim_chunk_sel = this.dim_sel - dim_offset;
    yield { dim_chunk_ix, dim_chunk_sel };
  }
}

interface SliceChunkDimProjection {
  dim_chunk_ix: number;
  dim_chunk_sel: Indices;
  dim_out_sel: Indices;
}

interface SliceDimIndexerProps {
  dim_sel: Slice;
  dim_len: number;
  dim_chunk_len: number;
}

class SliceDimIndexer {
  start: number;
  stop: number;
  step: number;

  dim_len: number;
  dim_chunk_len: number;
  nitems: number;
  nchunks: number;

  constructor({ dim_sel, dim_len, dim_chunk_len }: SliceDimIndexerProps) {
    // normalize
    const [start, stop, step] = slice_indices(dim_sel, dim_len);
    this.start = start;
    this.stop = stop;
    this.step = step;
    if (this.step < 1) err_negative_step();
    // store properties
    this.dim_len = dim_len;
    this.dim_chunk_len = dim_chunk_len;
    this.nitems = Math.max(0, Math.ceil((this.stop - this.start) / this.step));
    this.nchunks = Math.ceil(this.dim_len / this.dim_chunk_len);
  }

  *[Symbol.iterator](): IterableIterator<SliceChunkDimProjection> {
    // figure out the range of chunks we need to visit
    const dim_chunk_ix_from = Math.floor(this.start / this.dim_chunk_len);
    const dim_chunk_ix_to = Math.ceil(this.stop / this.dim_chunk_len);
    for (const dim_chunk_ix of range(dim_chunk_ix_from, dim_chunk_ix_to)) {
      // compute offsets for chunk within overall array
      const dim_offset = dim_chunk_ix * this.dim_chunk_len;
      const dim_limit = Math.min(
        this.dim_len,
        (dim_chunk_ix + 1) * this.dim_chunk_len,
      );
      // determine chunk length, accounting for trailing chunk
      const dim_chunk_len = dim_limit - dim_offset;

      let dim_out_offset = 0;
      let dim_chunk_sel_start = 0;
      if (this.start < dim_offset) {
        // selection start before current chunk
        const remainder = (dim_offset - this.start) % this.step;
        if (remainder) dim_chunk_sel_start += this.step - remainder;
        // compute number of previous items, provides offset into output array
        dim_out_offset = Math.ceil((dim_offset - this.start) / this.step);
      } else {
        // selection starts within current chunk
        dim_chunk_sel_start = this.start - dim_offset;
      }
      // selection starts within current chunk if true,
      // otherwise selection ends after current chunk.
      const dim_chunk_sel_stop =
        this.stop > dim_limit ? dim_chunk_len : this.stop - dim_offset;

      const dim_chunk_sel: Indices = [
        dim_chunk_sel_start,
        dim_chunk_sel_stop,
        this.step,
      ];
      const dim_chunk_nitems = Math.ceil(
        (dim_chunk_sel_stop - dim_chunk_sel_start) / this.step,
      );

      const dim_out_sel: Indices = [
        dim_out_offset,
        dim_out_offset + dim_chunk_nitems,
        1,
      ];
      yield { dim_chunk_ix, dim_chunk_sel, dim_out_sel };
    }
  }
}

export function normalize_selection(
  selection: null | (Slice | null | number)[],
  shape: readonly number[],
): (number | Slice)[] {
  let normalized: (number | Slice)[] = [];
  if (selection === null) {
    normalized = shape.map((_) => slice(null));
  } else if (Array.isArray(selection)) {
    normalized = selection.map((s) => s ?? slice(null));
  }
  check_selection_length(normalized, shape);
  return normalized;
}

interface BasicIndexerProps {
  selection: null | (null | number | Slice)[];
  shape: readonly number[];
  chunk_shape: readonly number[];
}

export type IndexerProjection =
  | { from: number; to: null }
  | {
    from: Indices;
    to: Indices;
  };

interface ChunkProjection {
  chunk_coords: number[];
  mapping: IndexerProjection[];
}

export class BasicIndexer {
  dim_indexers: (SliceDimIndexer | IntDimIndexer)[];
  shape: number[];

  constructor({ selection, shape, chunk_shape }: BasicIndexerProps) {
    // setup per-dimension indexers
    this.dim_indexers = normalize_selection(selection, shape).map(
      (dim_sel, i) => {
        return new (
          typeof dim_sel === "number" ? IntDimIndexer : SliceDimIndexer
        )({
          // @ts-expect-error ts inference not strong enough to know correct chunk
          dim_sel: dim_sel,
          dim_len: shape[i],
          dim_chunk_len: chunk_shape[i],
        });
      },
    );
    this.shape = this.dim_indexers
      .filter((ixr) => ixr instanceof SliceDimIndexer)
      .map((sixr) => sixr.nitems);
  }

  *[Symbol.iterator](): IterableIterator<ChunkProjection> {
    for (const dim_projections of product(...this.dim_indexers)) {
      const chunk_coords = dim_projections.map((p) => p.dim_chunk_ix);
      const mapping: IndexerProjection[] = dim_projections.map((p) => {
        if ("dim_out_sel" in p) {
          return { from: p.dim_chunk_sel, to: p.dim_out_sel };
        }
        return { from: p.dim_chunk_sel, to: null };
      });
      yield { chunk_coords, mapping };
    }
  }
}
