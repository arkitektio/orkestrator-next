import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
import * as ApolloReactHooks from "@/lib/elektro/funcs";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  FileLike: { input: any; output: any };
  FiveDVector: { input: any; output: any };
  TraceLike: { input: any; output: any };
};

/** Temporary Credentials for a file download that can be used by a Client (e.g. in a python datalayer) */
export type AccessCredentials = {
  __typename?: "AccessCredentials";
  accessKey: Scalars["String"]["output"];
  bucket: Scalars["String"]["output"];
  key: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
  secretKey: Scalars["String"]["output"];
  sessionToken: Scalars["String"]["output"];
};

/** An app. */
export type App = {
  __typename?: "App";
  clientId: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export type AssociateInput = {
  other: Scalars["ID"]["input"];
  selfs: Array<Scalars["ID"]["input"]>;
};

export type BigFileStore = {
  __typename?: "BigFileStore";
  bucket: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  key: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
  presignedUrl: Scalars["String"]["output"];
};

export type ChangeDatasetInput = {
  id: Scalars["ID"]["input"];
  name: Scalars["String"]["input"];
};

export type CreateDatasetInput = {
  name: Scalars["String"]["input"];
};

/** Temporary Credentials for a file upload that can be used by a Client (e.g. in a python datalayer) */
export type Credentials = {
  __typename?: "Credentials";
  accessKey: Scalars["String"]["output"];
  bucket: Scalars["String"]["output"];
  datalayer: Scalars["String"]["output"];
  key: Scalars["String"]["output"];
  secretKey: Scalars["String"]["output"];
  sessionToken: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  store: Scalars["String"]["output"];
};

export type Dataset = {
  __typename?: "Dataset";
  children: Array<Dataset>;
  createdAt: Scalars["DateTime"]["output"];
  creator?: Maybe<User>;
  description?: Maybe<Scalars["String"]["output"]>;
  files: Array<File>;
  history: Array<History>;
  id: Scalars["ID"]["output"];
  images: Array<Trace>;
  isDefault: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  pinned: Scalars["Boolean"]["output"];
  tags: Array<Scalars["String"]["output"]>;
};

export type DatasetChildrenArgs = {
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type DatasetFilesArgs = {
  filters?: InputMaybe<FileFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type DatasetHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type DatasetImagesArgs = {
  filters?: InputMaybe<TraceFilter>;
  order?: InputMaybe<TraceOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type DatasetFilter = {
  AND?: InputMaybe<DatasetFilter>;
  OR?: InputMaybe<DatasetFilter>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  name?: InputMaybe<StrFilterLookup>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export type DeleteDatasetInput = {
  id: Scalars["ID"]["input"];
};

export type DeleteFileInput = {
  id: Scalars["ID"]["input"];
};

export type DeleteRoiInput = {
  id: Scalars["ID"]["input"];
};

export type DeleteTraceInput = {
  id: Scalars["ID"]["input"];
};

export type DesociateInput = {
  other: Scalars["ID"]["input"];
  selfs: Array<Scalars["ID"]["input"]>;
};

export type File = {
  __typename?: "File";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  origins: Array<Trace>;
  store: BigFileStore;
};

export type FileOriginsArgs = {
  filters?: InputMaybe<TraceFilter>;
  order?: InputMaybe<TraceOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type FileEvent = {
  __typename?: "FileEvent";
  create?: Maybe<File>;
  delete?: Maybe<Scalars["ID"]["output"]>;
  moved?: Maybe<File>;
  update?: Maybe<File>;
};

export type FileFilter = {
  AND?: InputMaybe<FileFilter>;
  OR?: InputMaybe<FileFilter>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  name?: InputMaybe<StrFilterLookup>;
  provenance?: InputMaybe<ProvenanceFilter>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type FromFileLike = {
  dataset?: InputMaybe<Scalars["ID"]["input"]>;
  file: Scalars["FileLike"]["input"];
  name: Scalars["String"]["input"];
  origins?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

/** Input type for creating an image from an array-like object */
export type FromTraceLikeInput = {
  /** The array-like object to create the image from */
  array: Scalars["TraceLike"]["input"];
  /** Optional dataset ID to associate the image with */
  dataset?: InputMaybe<Scalars["ID"]["input"]>;
  /** The name of the image */
  name: Scalars["String"]["input"];
  /** Optional list of tags to associate with the image */
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type History = {
  __typename?: "History";
  app?: Maybe<App>;
  date: Scalars["DateTime"]["output"];
  during?: Maybe<Scalars["String"]["output"]>;
  effectiveChanges: Array<ModelChange>;
  id: Scalars["ID"]["output"];
  kind: HistoryKind;
  user?: Maybe<User>;
};

export enum HistoryKind {
  Create = "CREATE",
  Delete = "DELETE",
  Update = "UPDATE",
}

export type ModelChange = {
  __typename?: "ModelChange";
  field: Scalars["String"]["output"];
  newValue?: Maybe<Scalars["String"]["output"]>;
  oldValue?: Maybe<Scalars["String"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  /** Create a new dataset to organize data */
  createDataset: Dataset;
  /** Create a new region of interest */
  createRoi: Roi;
  /** Delete an existing dataset */
  deleteDataset: Scalars["ID"]["output"];
  /** Delete an existing file */
  deleteFile: Scalars["ID"]["output"];
  /** Delete an existing image */
  deleteImage: Scalars["ID"]["output"];
  /** Delete an existing region of interest */
  deleteRoi: Scalars["ID"]["output"];
  /** Create a file from file-like data */
  fromFileLike: File;
  /** Create an image from array-like data */
  fromTraceLike: Trace;
  /** Pin a dataset for quick access */
  pinDataset: Dataset;
  /** Pin an image for quick access */
  pinImage: Trace;
  /** Pin a region of interest for quick access */
  pinRoi: Roi;
  /** Add datasets as children of another dataset */
  putDatasetsInDataset: Dataset;
  /** Add files to a dataset */
  putFilesInDataset: Dataset;
  /** Add images to a dataset */
  putImagesInDataset: Dataset;
  /** Remove datasets from being children of another dataset */
  releaseDatasetsFromDataset: Dataset;
  /** Remove files from a dataset */
  releaseFilesFromDataset: Dataset;
  /** Remove images from a dataset */
  releaseImagesFromDataset: Dataset;
  /** Request credentials to access an image */
  requestAccess: AccessCredentials;
  /** Request credentials to access a file */
  requestFileAccess: AccessCredentials;
  /** Request credentials to upload a new file */
  requestFileUpload: Credentials;
  /** Request presigned credentials for file upload */
  requestFileUploadPresigned: PresignedPostCredentials;
  /** Request credentials for media file upload */
  requestMediaUpload: PresignedPostCredentials;
  /** Request credentials to upload a new image */
  requestUpload: Credentials;
  /** Revert dataset to a previous version */
  revertDataset: Dataset;
  /** Update dataset metadata */
  updateDataset: Dataset;
  /** Update an existing image's metadata */
  updateImage: Trace;
  /** Update an existing region of interest */
  updateRoi: Roi;
};

export type MutationCreateDatasetArgs = {
  input: CreateDatasetInput;
};

export type MutationCreateRoiArgs = {
  input: RoiInput;
};

export type MutationDeleteDatasetArgs = {
  input: DeleteDatasetInput;
};

export type MutationDeleteFileArgs = {
  input: DeleteFileInput;
};

export type MutationDeleteImageArgs = {
  input: DeleteTraceInput;
};

export type MutationDeleteRoiArgs = {
  input: DeleteRoiInput;
};

export type MutationFromFileLikeArgs = {
  input: FromFileLike;
};

export type MutationFromTraceLikeArgs = {
  input: FromTraceLikeInput;
};

export type MutationPinDatasetArgs = {
  input: PinDatasetInput;
};

export type MutationPinImageArgs = {
  input: PinImageInput;
};

export type MutationPinRoiArgs = {
  input: PinRoiInput;
};

export type MutationPutDatasetsInDatasetArgs = {
  input: AssociateInput;
};

export type MutationPutFilesInDatasetArgs = {
  input: AssociateInput;
};

export type MutationPutImagesInDatasetArgs = {
  input: AssociateInput;
};

export type MutationReleaseDatasetsFromDatasetArgs = {
  input: DesociateInput;
};

export type MutationReleaseFilesFromDatasetArgs = {
  input: DesociateInput;
};

export type MutationReleaseImagesFromDatasetArgs = {
  input: DesociateInput;
};

export type MutationRequestAccessArgs = {
  input: RequestAccessInput;
};

export type MutationRequestFileAccessArgs = {
  input: RequestFileAccessInput;
};

export type MutationRequestFileUploadArgs = {
  input: RequestFileUploadInput;
};

export type MutationRequestFileUploadPresignedArgs = {
  input: RequestFileUploadInput;
};

export type MutationRequestMediaUploadArgs = {
  input: RequestMediaUploadInput;
};

export type MutationRequestUploadArgs = {
  input: RequestUploadInput;
};

export type MutationRevertDatasetArgs = {
  input: RevertInput;
};

export type MutationUpdateDatasetArgs = {
  input: ChangeDatasetInput;
};

export type MutationUpdateImageArgs = {
  input: UpdateTraceInput;
};

export type MutationUpdateRoiArgs = {
  input: UpdateRoiInput;
};

export type OffsetPaginationInput = {
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
};

export enum Ordering {
  Asc = "ASC",
  Desc = "DESC",
}

export type PinDatasetInput = {
  id: Scalars["ID"]["input"];
  pin: Scalars["Boolean"]["input"];
};

export type PinImageInput = {
  id: Scalars["ID"]["input"];
  pin: Scalars["Boolean"]["input"];
};

export type PinRoiInput = {
  id: Scalars["ID"]["input"];
  pin: Scalars["Boolean"]["input"];
};

/** Temporary Credentials for a file upload that can be used by a Client (e.g. in a python datalayer) */
export type PresignedPostCredentials = {
  __typename?: "PresignedPostCredentials";
  bucket: Scalars["String"]["output"];
  datalayer: Scalars["String"]["output"];
  key: Scalars["String"]["output"];
  policy: Scalars["String"]["output"];
  store: Scalars["String"]["output"];
  xAmzAlgorithm: Scalars["String"]["output"];
  xAmzCredential: Scalars["String"]["output"];
  xAmzDate: Scalars["String"]["output"];
  xAmzSignature: Scalars["String"]["output"];
};

export type ProvenanceFilter = {
  AND?: InputMaybe<ProvenanceFilter>;
  OR?: InputMaybe<ProvenanceFilter>;
  during?: InputMaybe<Scalars["String"]["input"]>;
};

export type Query = {
  __typename?: "Query";
  dataset: Dataset;
  datasets: Array<Dataset>;
  file: File;
  files: Array<File>;
  mydatasets: Array<Dataset>;
  myfiles: Array<File>;
  randomTrace: Trace;
  roi: Roi;
  rois: Array<Roi>;
  /** Returns a single image by ID */
  trace: Trace;
  traces: Array<Trace>;
};

export type QueryDatasetArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryDatasetsArgs = {
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type QueryFileArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryFilesArgs = {
  filters?: InputMaybe<FileFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type QueryMydatasetsArgs = {
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type QueryMyfilesArgs = {
  filters?: InputMaybe<FileFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type QueryRoiArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryRoisArgs = {
  filters?: InputMaybe<RoiFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type QueryTraceArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryTracesArgs = {
  filters?: InputMaybe<TraceFilter>;
  order?: InputMaybe<TraceOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type Roi = {
  __typename?: "ROI";
  createdAt: Scalars["DateTime"]["output"];
  creator?: Maybe<User>;
  history: Array<History>;
  id: Scalars["ID"]["output"];
  kind: RoiKind;
  name: Scalars["String"]["output"];
  pinned: Scalars["Boolean"]["output"];
  trace: Trace;
  vectors: Array<Scalars["FiveDVector"]["output"]>;
};

export type RoiHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type RoiFilter = {
  AND?: InputMaybe<RoiFilter>;
  OR?: InputMaybe<RoiFilter>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  image?: InputMaybe<Scalars["ID"]["input"]>;
  kind?: InputMaybe<RoiKindChoices>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type RequestAccessInput = {
  duration?: InputMaybe<Scalars["Int"]["input"]>;
  store: Scalars["ID"]["input"];
};

export type RequestFileAccessInput = {
  duration?: InputMaybe<Scalars["Int"]["input"]>;
  store: Scalars["ID"]["input"];
};

export type RequestFileUploadInput = {
  datalayer: Scalars["String"]["input"];
  key: Scalars["String"]["input"];
};

export type RequestMediaUploadInput = {
  datalayer: Scalars["String"]["input"];
  key: Scalars["String"]["input"];
};

export type RequestUploadInput = {
  datalayer: Scalars["String"]["input"];
  key: Scalars["String"]["input"];
};

export type RevertInput = {
  historyId: Scalars["ID"]["input"];
  id: Scalars["ID"]["input"];
};

export type RoiEvent = {
  __typename?: "RoiEvent";
  create?: Maybe<Roi>;
  delete?: Maybe<Scalars["ID"]["output"]>;
  update?: Maybe<Roi>;
};

export type RoiInput = {
  /** The image this ROI belongs to */
  image: Scalars["ID"]["input"];
  /** The type/kind of ROI */
  kind: RoiKind;
  /** The vector coordinates defining the ROI */
  vectors: Array<Scalars["FiveDVector"]["input"]>;
};

export enum RoiKind {
  Cube = "CUBE",
  Ellipsis = "ELLIPSIS",
  Frame = "FRAME",
  Hypercube = "HYPERCUBE",
  Line = "LINE",
  Path = "PATH",
  Point = "POINT",
  Polygon = "POLYGON",
  Rectangle = "RECTANGLE",
  Slice = "SLICE",
  SpectralCube = "SPECTRAL_CUBE",
  SpectralHypercube = "SPECTRAL_HYPERCUBE",
  SpectralRectangle = "SPECTRAL_RECTANGLE",
  TemporalCube = "TEMPORAL_CUBE",
  TemporalRectangle = "TEMPORAL_RECTANGLE",
}

export enum RoiKindChoices {
  Cube = "CUBE",
  Ellipsis = "ELLIPSIS",
  Frame = "FRAME",
  Hypercube = "HYPERCUBE",
  Line = "LINE",
  Path = "PATH",
  Point = "POINT",
  Polygon = "POLYGON",
  Rectangle = "RECTANGLE",
  Slice = "SLICE",
  SpectralCube = "SPECTRAL_CUBE",
  SpectralHypercube = "SPECTRAL_HYPERCUBE",
  SpectralRectangle = "SPECTRAL_RECTANGLE",
  TemporalCube = "TEMPORAL_CUBE",
  TemporalRectangle = "TEMPORAL_RECTANGLE",
  Unknown = "UNKNOWN",
}

export type StrFilterLookup = {
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  exact?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  iContains?: InputMaybe<Scalars["String"]["input"]>;
  iEndsWith?: InputMaybe<Scalars["String"]["input"]>;
  iExact?: InputMaybe<Scalars["String"]["input"]>;
  iRegex?: InputMaybe<Scalars["String"]["input"]>;
  iStartsWith?: InputMaybe<Scalars["String"]["input"]>;
  inList?: InputMaybe<Array<Scalars["String"]["input"]>>;
  isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  nContains?: InputMaybe<Scalars["String"]["input"]>;
  nEndsWith?: InputMaybe<Scalars["String"]["input"]>;
  nExact?: InputMaybe<Scalars["String"]["input"]>;
  nGt?: InputMaybe<Scalars["String"]["input"]>;
  nGte?: InputMaybe<Scalars["String"]["input"]>;
  nIContains?: InputMaybe<Scalars["String"]["input"]>;
  nIEndsWith?: InputMaybe<Scalars["String"]["input"]>;
  nIExact?: InputMaybe<Scalars["String"]["input"]>;
  nIRegex?: InputMaybe<Scalars["String"]["input"]>;
  nIStartsWith?: InputMaybe<Scalars["String"]["input"]>;
  nInList?: InputMaybe<Array<Scalars["String"]["input"]>>;
  nIsNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  nLt?: InputMaybe<Scalars["String"]["input"]>;
  nLte?: InputMaybe<Scalars["String"]["input"]>;
  nRange?: InputMaybe<Array<Scalars["String"]["input"]>>;
  nRegex?: InputMaybe<Scalars["String"]["input"]>;
  nStartsWith?: InputMaybe<Scalars["String"]["input"]>;
  range?: InputMaybe<Array<Scalars["String"]["input"]>>;
  regex?: InputMaybe<Scalars["String"]["input"]>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  /** Subscribe to real-time file updates */
  files: FileEvent;
  /** Subscribe to real-time image history events */
  historyEvents: Trace;
  /** Subscribe to real-time ROI updates */
  rois: RoiEvent;
  /** Subscribe to real-time image updates */
  traces: TraceEvent;
};

export type SubscriptionFilesArgs = {
  dataset?: InputMaybe<Scalars["ID"]["input"]>;
};

export type SubscriptionRoisArgs = {
  image: Scalars["ID"]["input"];
};

export type SubscriptionTracesArgs = {
  dataset?: InputMaybe<Scalars["ID"]["input"]>;
};

export type Trace = {
  __typename?: "Trace";
  /** Who created this image */
  creator?: Maybe<User>;
  /** The dataset this image belongs to */
  dataset?: Maybe<Dataset>;
  events: Array<Roi>;
  /** History of changes to this image */
  history: Array<History>;
  id: Scalars["ID"]["output"];
  /** The name of the image */
  name: Scalars["String"]["output"];
  /** Is this image pinned by the current user */
  pinned: Scalars["Boolean"]["output"];
  /** The store where the image data is stored. */
  store: ZarrStore;
  /** The tags of this image */
  tags: Array<Scalars["String"]["output"]>;
};

export type TraceEventsArgs = {
  filters?: InputMaybe<RoiFilter>;
};

export type TraceHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type TraceEvent = {
  __typename?: "TraceEvent";
  create?: Maybe<Trace>;
  delete?: Maybe<Scalars["ID"]["output"]>;
  update?: Maybe<Trace>;
};

export type TraceFilter = {
  AND?: InputMaybe<TraceFilter>;
  OR?: InputMaybe<TraceFilter>;
  dataset?: InputMaybe<DatasetFilter>;
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  name?: InputMaybe<StrFilterLookup>;
  notDerived?: InputMaybe<Scalars["Boolean"]["input"]>;
  provenance?: InputMaybe<ProvenanceFilter>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type TraceOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type UpdateRoiInput = {
  entity?: InputMaybe<Scalars["ID"]["input"]>;
  entityGroup?: InputMaybe<Scalars["ID"]["input"]>;
  entityKind?: InputMaybe<Scalars["ID"]["input"]>;
  entityParent?: InputMaybe<Scalars["ID"]["input"]>;
  kind?: InputMaybe<RoiKind>;
  roi: Scalars["ID"]["input"];
  vectors?: InputMaybe<Array<Scalars["FiveDVector"]["input"]>>;
};

export type UpdateTraceInput = {
  id: Scalars["ID"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** A user. */
export type User = {
  __typename?: "User";
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  password: Scalars["String"]["output"];
  sub: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
};

export type ZarrStore = {
  __typename?: "ZarrStore";
  /** The bucket where the data is stored. */
  bucket: Scalars["String"]["output"];
  /** The chunks of the data. */
  chunks?: Maybe<Array<Scalars["Int"]["output"]>>;
  /** The dtype of the data. */
  dtype?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  /** The key where the data is stored. */
  key: Scalars["String"]["output"];
  /** The path to the data. Relative to the bucket. */
  path?: Maybe<Scalars["String"]["output"]>;
  /** Whether the zarr store was populated (e.g. was a dataset created). */
  populated: Scalars["Boolean"]["output"];
  /** The shape of the data. */
  shape?: Maybe<Array<Scalars["Int"]["output"]>>;
};

export type CredentialsFragment = {
  __typename?: "Credentials";
  accessKey: string;
  status: string;
  secretKey: string;
  bucket: string;
  key: string;
  sessionToken: string;
  store: string;
};

export type AccessCredentialsFragment = {
  __typename?: "AccessCredentials";
  accessKey: string;
  secretKey: string;
  bucket: string;
  key: string;
  sessionToken: string;
  path: string;
};

export type PresignedPostCredentialsFragment = {
  __typename?: "PresignedPostCredentials";
  xAmzAlgorithm: string;
  xAmzCredential: string;
  xAmzDate: string;
  xAmzSignature: string;
  key: string;
  bucket: string;
  datalayer: string;
  policy: string;
  store: string;
};

export type ZarrStoreFragment = {
  __typename?: "ZarrStore";
  id: string;
  key: string;
  bucket: string;
  path?: string | null;
  shape?: Array<number> | null;
  dtype?: string | null;
};

export type DetailTraceFragment = {
  __typename?: "Trace";
  id: string;
  name: string;
  store: {
    __typename?: "ZarrStore";
    id: string;
    key: string;
    bucket: string;
    path?: string | null;
    shape?: Array<number> | null;
    dtype?: string | null;
  };
};

export type ListTraceFragment = {
  __typename?: "Trace";
  id: string;
  name: string;
};

export type RequestUploadMutationVariables = Exact<{
  key: Scalars["String"]["input"];
  datalayer: Scalars["String"]["input"];
}>;

export type RequestUploadMutation = {
  __typename?: "Mutation";
  requestUpload: {
    __typename?: "Credentials";
    accessKey: string;
    status: string;
    secretKey: string;
    bucket: string;
    key: string;
    sessionToken: string;
    store: string;
  };
};

export type RequestAccessMutationVariables = Exact<{
  store: Scalars["ID"]["input"];
  duration?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type RequestAccessMutation = {
  __typename?: "Mutation";
  requestAccess: {
    __typename?: "AccessCredentials";
    accessKey: string;
    secretKey: string;
    bucket: string;
    key: string;
    sessionToken: string;
    path: string;
  };
};

export type DetailTraceQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type DetailTraceQuery = {
  __typename?: "Query";
  trace: {
    __typename?: "Trace";
    id: string;
    name: string;
    store: {
      __typename?: "ZarrStore";
      id: string;
      key: string;
      bucket: string;
      path?: string | null;
      shape?: Array<number> | null;
      dtype?: string | null;
    };
  };
};

export type TracesQueryVariables = Exact<{ [key: string]: never }>;

export type TracesQuery = {
  __typename?: "Query";
  traces: Array<{ __typename?: "Trace"; id: string; name: string }>;
};

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars["String"]["input"]>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;

export type GlobalSearchQuery = {
  __typename?: "Query";
  traces: Array<{ __typename?: "Trace"; id: string; name: string }>;
};

export const CredentialsFragmentDoc = gql`
  fragment Credentials on Credentials {
    accessKey
    status
    secretKey
    bucket
    key
    sessionToken
    store
  }
`;
export const AccessCredentialsFragmentDoc = gql`
  fragment AccessCredentials on AccessCredentials {
    accessKey
    secretKey
    bucket
    key
    sessionToken
    path
  }
`;
export const PresignedPostCredentialsFragmentDoc = gql`
  fragment PresignedPostCredentials on PresignedPostCredentials {
    xAmzAlgorithm
    xAmzCredential
    xAmzDate
    xAmzSignature
    key
    bucket
    datalayer
    policy
    store
  }
`;
export const ZarrStoreFragmentDoc = gql`
  fragment ZarrStore on ZarrStore {
    id
    key
    bucket
    path
    shape
    dtype
  }
`;
export const DetailTraceFragmentDoc = gql`
  fragment DetailTrace on Trace {
    id
    name
    store {
      ...ZarrStore
    }
  }
  ${ZarrStoreFragmentDoc}
`;
export const ListTraceFragmentDoc = gql`
  fragment ListTrace on Trace {
    id
    name
  }
`;
export const RequestUploadDocument = gql`
  mutation RequestUpload($key: String!, $datalayer: String!) {
    requestUpload(input: { key: $key, datalayer: $datalayer }) {
      ...Credentials
    }
  }
  ${CredentialsFragmentDoc}
`;
export type RequestUploadMutationFn = Apollo.MutationFunction<
  RequestUploadMutation,
  RequestUploadMutationVariables
>;

/**
 * __useRequestUploadMutation__
 *
 * To run a mutation, you first call `useRequestUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestUploadMutation, { data, loading, error }] = useRequestUploadMutation({
 *   variables: {
 *      key: // value for 'key'
 *      datalayer: // value for 'datalayer'
 *   },
 * });
 */
export function useRequestUploadMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RequestUploadMutation,
    RequestUploadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    RequestUploadMutation,
    RequestUploadMutationVariables
  >(RequestUploadDocument, options);
}
export type RequestUploadMutationHookResult = ReturnType<
  typeof useRequestUploadMutation
>;
export type RequestUploadMutationResult =
  Apollo.MutationResult<RequestUploadMutation>;
export type RequestUploadMutationOptions = Apollo.BaseMutationOptions<
  RequestUploadMutation,
  RequestUploadMutationVariables
>;
export const RequestAccessDocument = gql`
  mutation RequestAccess($store: ID!, $duration: Int) {
    requestAccess(input: { store: $store, duration: $duration }) {
      ...AccessCredentials
    }
  }
  ${AccessCredentialsFragmentDoc}
`;
export type RequestAccessMutationFn = Apollo.MutationFunction<
  RequestAccessMutation,
  RequestAccessMutationVariables
>;

/**
 * __useRequestAccessMutation__
 *
 * To run a mutation, you first call `useRequestAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestAccessMutation, { data, loading, error }] = useRequestAccessMutation({
 *   variables: {
 *      store: // value for 'store'
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useRequestAccessMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RequestAccessMutation,
    RequestAccessMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    RequestAccessMutation,
    RequestAccessMutationVariables
  >(RequestAccessDocument, options);
}
export type RequestAccessMutationHookResult = ReturnType<
  typeof useRequestAccessMutation
>;
export type RequestAccessMutationResult =
  Apollo.MutationResult<RequestAccessMutation>;
export type RequestAccessMutationOptions = Apollo.BaseMutationOptions<
  RequestAccessMutation,
  RequestAccessMutationVariables
>;
export const DetailTraceDocument = gql`
  query DetailTrace($id: ID!) {
    trace(id: $id) {
      ...DetailTrace
    }
  }
  ${DetailTraceFragmentDoc}
`;

/**
 * __useDetailTraceQuery__
 *
 * To run a query within a React component, call `useDetailTraceQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailTraceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailTraceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailTraceQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    DetailTraceQuery,
    DetailTraceQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<DetailTraceQuery, DetailTraceQueryVariables>(
    DetailTraceDocument,
    options,
  );
}
export function useDetailTraceLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    DetailTraceQuery,
    DetailTraceQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    DetailTraceQuery,
    DetailTraceQueryVariables
  >(DetailTraceDocument, options);
}
export type DetailTraceQueryHookResult = ReturnType<typeof useDetailTraceQuery>;
export type DetailTraceLazyQueryHookResult = ReturnType<
  typeof useDetailTraceLazyQuery
>;
export type DetailTraceQueryResult = Apollo.QueryResult<
  DetailTraceQuery,
  DetailTraceQueryVariables
>;
export const TracesDocument = gql`
  query Traces {
    traces(pagination: { limit: 10 }) {
      ...ListTrace
    }
  }
  ${ListTraceFragmentDoc}
`;

/**
 * __useTracesQuery__
 *
 * To run a query within a React component, call `useTracesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTracesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTracesQuery({
 *   variables: {
 *   },
 * });
 */
export function useTracesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    TracesQuery,
    TracesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<TracesQuery, TracesQueryVariables>(
    TracesDocument,
    options,
  );
}
export function useTracesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    TracesQuery,
    TracesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<TracesQuery, TracesQueryVariables>(
    TracesDocument,
    options,
  );
}
export type TracesQueryHookResult = ReturnType<typeof useTracesQuery>;
export type TracesLazyQueryHookResult = ReturnType<typeof useTracesLazyQuery>;
export type TracesQueryResult = Apollo.QueryResult<
  TracesQuery,
  TracesQueryVariables
>;
export const GlobalSearchDocument = gql`
  query GlobalSearch($search: String, $pagination: OffsetPaginationInput) {
    traces: traces(filters: { search: $search }, pagination: $pagination) {
      ...ListTrace
    }
  }
  ${ListTraceFragmentDoc}
`;

/**
 * __useGlobalSearchQuery__
 *
 * To run a query within a React component, call `useGlobalSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useGlobalSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGlobalSearchQuery({
 *   variables: {
 *      search: // value for 'search'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGlobalSearchQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GlobalSearchQuery,
    GlobalSearchQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<
    GlobalSearchQuery,
    GlobalSearchQueryVariables
  >(GlobalSearchDocument, options);
}
export function useGlobalSearchLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GlobalSearchQuery,
    GlobalSearchQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    GlobalSearchQuery,
    GlobalSearchQueryVariables
  >(GlobalSearchDocument, options);
}
export type GlobalSearchQueryHookResult = ReturnType<
  typeof useGlobalSearchQuery
>;
export type GlobalSearchLazyQueryHookResult = ReturnType<
  typeof useGlobalSearchLazyQuery
>;
export type GlobalSearchQueryResult = Apollo.QueryResult<
  GlobalSearchQuery,
  GlobalSearchQueryVariables
>;
