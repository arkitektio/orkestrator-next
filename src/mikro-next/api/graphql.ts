import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ArrayLike: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  FileLike: { input: any; output: any; }
  FiveDVector: { input: any; output: any; }
  FourByFourMatrix: { input: any; output: any; }
  Micrometers: { input: any; output: any; }
  Milliseconds: { input: any; output: any; }
  ParquetLike: { input: any; output: any; }
  ThreeDVector: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

/** Temporary Credentials for a file download that can be used by a Client (e.g. in a python datalayer) */
export type AccessCredentials = {
  __typename?: 'AccessCredentials';
  accessKey: Scalars['String']['output'];
  bucket: Scalars['String']['output'];
  key: Scalars['String']['output'];
  path: Scalars['String']['output'];
  secretKey: Scalars['String']['output'];
  sessionToken: Scalars['String']['output'];
};

export type AcquisitionView = View & {
  __typename?: 'AcquisitionView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  acquiredAt?: Maybe<Scalars['DateTime']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  operator?: Maybe<User>;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};

export type AffineTransformationView = View & {
  __typename?: 'AffineTransformationView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  affineMatrix: Scalars['FourByFourMatrix']['output'];
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  pixelSize: Scalars['ThreeDVector']['output'];
  pixelSizeX: Scalars['Micrometers']['output'];
  pixelSizeY: Scalars['Micrometers']['output'];
  position: Scalars['ThreeDVector']['output'];
  stage: Stage;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};

export type AffineTransformationViewFilter = {
  AND?: InputMaybe<AffineTransformationViewFilter>;
  OR?: InputMaybe<AffineTransformationViewFilter>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  pixelSize?: InputMaybe<FloatFilterLookup>;
  provenance?: InputMaybe<ProvenanceFilter>;
  stage?: InputMaybe<StageFilter>;
};

export type AffineTransformationViewInput = {
  affineMatrix: Scalars['FourByFourMatrix']['input'];
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  stage?: InputMaybe<Scalars['ID']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type Antibody = {
  __typename?: 'Antibody';
  epitope?: Maybe<Scalars['String']['output']>;
  history: Array<History>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  primaryViews: Array<LabelView>;
  secondaryViews: Array<LabelView>;
};


export type AntibodyHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type AntibodyFilter = {
  AND?: InputMaybe<AntibodyFilter>;
  OR?: InputMaybe<AntibodyFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type AntibodyInput = {
  epitope?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** An app. */
export type App = {
  __typename?: 'App';
  clientId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type AssociateInput = {
  other: Scalars['ID']['input'];
  selfs: Array<Scalars['ID']['input']>;
};

export type BigFileStore = {
  __typename?: 'BigFileStore';
  bucket: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  path: Scalars['String']['output'];
  presignedUrl: Scalars['String']['output'];
};

export enum Blending {
  Additive = 'ADDITIVE',
  Multiplicative = 'MULTIPLICATIVE'
}

export type Camera = {
  __typename?: 'Camera';
  bitDepth?: Maybe<Scalars['Int']['output']>;
  history: Array<History>;
  id: Scalars['ID']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  pixelSizeX?: Maybe<Scalars['Micrometers']['output']>;
  pixelSizeY?: Maybe<Scalars['Micrometers']['output']>;
  sensorSizeX?: Maybe<Scalars['Int']['output']>;
  sensorSizeY?: Maybe<Scalars['Int']['output']>;
  serialNumber: Scalars['String']['output'];
  views: Array<OpticsView>;
};


export type CameraHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type CameraViewsArgs = {
  filters?: InputMaybe<OpticsViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type CameraFilter = {
  AND?: InputMaybe<CameraFilter>;
  OR?: InputMaybe<CameraFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export type CameraInput = {
  bitDepth?: InputMaybe<Scalars['Int']['input']>;
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pixelSizeX?: InputMaybe<Scalars['Micrometers']['input']>;
  pixelSizeY?: InputMaybe<Scalars['Micrometers']['input']>;
  sensorSizeX?: InputMaybe<Scalars['Int']['input']>;
  sensorSizeY?: InputMaybe<Scalars['Int']['input']>;
  serialNumber: Scalars['String']['input'];
};

export type ChangeDatasetInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Channel = {
  __typename?: 'Channel';
  acquisitionMode?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  emissionWavelength?: Maybe<Scalars['Float']['output']>;
  excitationWavelength?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  views: Array<ChannelView>;
};

export type ChannelInput = {
  name: Scalars['String']['input'];
};

export type ChannelView = View & {
  __typename?: 'ChannelView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  channel: Channel;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};

export type ChannelViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  channel: Scalars['ID']['input'];
  collection?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export enum ColorFormat {
  Hsl = 'HSL',
  Rgb = 'RGB'
}

export enum ColorMap {
  Blue = 'BLUE',
  Green = 'GREEN',
  Inferno = 'INFERNO',
  Magma = 'MAGMA',
  Plasma = 'PLASMA',
  Red = 'RED',
  Viridis = 'VIRIDIS'
}

export type ContextNode = RenderNode & {
  __typename?: 'ContextNode';
  context: RgbContext;
  kind: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export enum ContinousScanDirection {
  ColumnRowSlice = 'COLUMN_ROW_SLICE',
  ColumnRowSliceSnake = 'COLUMN_ROW_SLICE_SNAKE',
  RowColumnSlice = 'ROW_COLUMN_SLICE',
  RowColumnSliceSnake = 'ROW_COLUMN_SLICE_SNAKE',
  SliceRowColumn = 'SLICE_ROW_COLUMN',
  SliceRowColumnSnake = 'SLICE_ROW_COLUMN_SNAKE'
}

export type ContinousScanView = View & {
  __typename?: 'ContinousScanView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  direction: ScanDirection;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};

export type ContinousScanViewFilter = {
  AND?: InputMaybe<ContinousScanViewFilter>;
  OR?: InputMaybe<ContinousScanViewFilter>;
  direction?: InputMaybe<ContinousScanDirection>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export type ContinousScanViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  direction: ScanDirection;
  image: Scalars['ID']['input'];
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateDatasetInput = {
  name: Scalars['String']['input'];
};

export type CreateRgbContextInput = {
  c?: InputMaybe<Scalars['Int']['input']>;
  image: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  t?: InputMaybe<Scalars['Int']['input']>;
  thumbnail?: InputMaybe<Scalars['ID']['input']>;
  views?: InputMaybe<Array<RgbContextViewInput>>;
  z?: InputMaybe<Scalars['Int']['input']>;
};

/** Temporary Credentials for a file upload that can be used by a Client (e.g. in a python datalayer) */
export type Credentials = {
  __typename?: 'Credentials';
  accessKey: Scalars['String']['output'];
  bucket: Scalars['String']['output'];
  datalayer: Scalars['String']['output'];
  key: Scalars['String']['output'];
  secretKey: Scalars['String']['output'];
  sessionToken: Scalars['String']['output'];
  status: Scalars['String']['output'];
  store: Scalars['String']['output'];
};

export type Dataset = {
  __typename?: 'Dataset';
  children: Array<Dataset>;
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  files: Array<File>;
  history: Array<History>;
  id: Scalars['ID']['output'];
  images: Array<Image>;
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  tags: Array<Scalars['String']['output']>;
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
  filters?: InputMaybe<ImageFilter>;
  order?: InputMaybe<ImageOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type DatasetFilter = {
  AND?: InputMaybe<DatasetFilter>;
  OR?: InputMaybe<DatasetFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<StrFilterLookup>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export type DeleteAntibodyInput = {
  id: Scalars['ID']['input'];
};

export type DeleteCameraInput = {
  id: Scalars['ID']['input'];
};

export type DeleteChannelInput = {
  id: Scalars['ID']['input'];
};

export type DeleteDatasetInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEraInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFluorophoreInput = {
  id: Scalars['ID']['input'];
};

export type DeleteInstrumentInput = {
  id: Scalars['ID']['input'];
};

export type DeleteMultiWellInput = {
  id: Scalars['ID']['input'];
};

export type DeleteObjectiveInput = {
  id: Scalars['ID']['input'];
};

export type DeleteRgbContextInput = {
  id: Scalars['ID']['input'];
};

export type DeleteSnaphotInput = {
  id: Scalars['ID']['input'];
};

export type DeleteStageInput = {
  id: Scalars['ID']['input'];
};

export type DeleteViewCollectionInput = {
  id: Scalars['ID']['input'];
};

export type DeleteViewInput = {
  id: Scalars['ID']['input'];
};

export type DesociateInput = {
  other: Scalars['ID']['input'];
  selfs: Array<Scalars['ID']['input']>;
};

export type Era = {
  __typename?: 'Era';
  begin?: Maybe<Scalars['DateTime']['output']>;
  history: Array<History>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  views: Array<TimepointView>;
};


export type EraHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type EraViewsArgs = {
  filters?: InputMaybe<TimepointViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type EraFilter = {
  AND?: InputMaybe<EraFilter>;
  OR?: InputMaybe<EraFilter>;
  begin?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export type EraInput = {
  begin?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
};

export type File = {
  __typename?: 'File';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  origins: Array<Image>;
  store: BigFileStore;
};


export type FileOriginsArgs = {
  filters?: InputMaybe<ImageFilter>;
  order?: InputMaybe<ImageOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type FileFilter = {
  AND?: InputMaybe<FileFilter>;
  OR?: InputMaybe<FileFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<StrFilterLookup>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export type FloatFilterLookup = {
  contains?: InputMaybe<Scalars['Float']['input']>;
  endsWith?: InputMaybe<Scalars['Float']['input']>;
  exact?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  iContains?: InputMaybe<Scalars['Float']['input']>;
  iEndsWith?: InputMaybe<Scalars['Float']['input']>;
  iExact?: InputMaybe<Scalars['Float']['input']>;
  iRegex?: InputMaybe<Scalars['String']['input']>;
  iStartsWith?: InputMaybe<Scalars['Float']['input']>;
  inList?: InputMaybe<Array<Scalars['Float']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  nContains?: InputMaybe<Scalars['Float']['input']>;
  nEndsWith?: InputMaybe<Scalars['Float']['input']>;
  nExact?: InputMaybe<Scalars['Float']['input']>;
  nGt?: InputMaybe<Scalars['Float']['input']>;
  nGte?: InputMaybe<Scalars['Float']['input']>;
  nIContains?: InputMaybe<Scalars['Float']['input']>;
  nIEndsWith?: InputMaybe<Scalars['Float']['input']>;
  nIExact?: InputMaybe<Scalars['Float']['input']>;
  nIRegex?: InputMaybe<Scalars['String']['input']>;
  nIStartsWith?: InputMaybe<Scalars['Float']['input']>;
  nInList?: InputMaybe<Array<Scalars['Float']['input']>>;
  nIsNull?: InputMaybe<Scalars['Boolean']['input']>;
  nLt?: InputMaybe<Scalars['Float']['input']>;
  nLte?: InputMaybe<Scalars['Float']['input']>;
  nRange?: InputMaybe<Array<Scalars['Float']['input']>>;
  nRegex?: InputMaybe<Scalars['String']['input']>;
  nStartsWith?: InputMaybe<Scalars['Float']['input']>;
  range?: InputMaybe<Array<Scalars['Float']['input']>>;
  regex?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['Float']['input']>;
};

export type Fluorophore = {
  __typename?: 'Fluorophore';
  emissionWavelength?: Maybe<Scalars['Micrometers']['output']>;
  excitationWavelength?: Maybe<Scalars['Micrometers']['output']>;
  history: Array<History>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  views: Array<LabelView>;
};


export type FluorophoreHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type FluorophoreFilter = {
  AND?: InputMaybe<FluorophoreFilter>;
  OR?: InputMaybe<FluorophoreFilter>;
  emissionWavelength?: InputMaybe<IntFilterLookup>;
  excitationWavelength?: InputMaybe<IntFilterLookup>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  provenance?: InputMaybe<ProvenanceFilter>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type FluorophoreInput = {
  emissionWavelength?: InputMaybe<Scalars['Micrometers']['input']>;
  excitationWavelength?: InputMaybe<Scalars['Micrometers']['input']>;
  name: Scalars['String']['input'];
};

export type FromArrayLikeInput = {
  acquisitionViews?: InputMaybe<Array<PartialAcquisitionViewInput>>;
  array: Scalars['ArrayLike']['input'];
  channelViews?: InputMaybe<Array<PartialChannelViewInput>>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
  labelViews?: InputMaybe<Array<PartialLabelViewInput>>;
  name: Scalars['String']['input'];
  opticsViews?: InputMaybe<Array<PartialOpticsViewInput>>;
  origins?: InputMaybe<Array<Scalars['ID']['input']>>;
  rgbViews?: InputMaybe<Array<PartialRgbViewInput>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  timepointViews?: InputMaybe<Array<PartialTimepointViewInput>>;
  transformationViews?: InputMaybe<Array<PartialAffineTransformationViewInput>>;
};

export type FromFileLike = {
  dataset?: InputMaybe<Scalars['ID']['input']>;
  file: Scalars['FileLike']['input'];
  name: Scalars['String']['input'];
  origins?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type FromParquetLike = {
  dataframe: Scalars['ParquetLike']['input'];
  dataset?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  origins?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type GridNode = RenderNode & {
  __typename?: 'GridNode';
  children: Array<RenderNode>;
  gap?: Maybe<Scalars['Int']['output']>;
  kind: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type History = {
  __typename?: 'History';
  app?: Maybe<App>;
  date: Scalars['DateTime']['output'];
  during?: Maybe<Scalars['String']['output']>;
  effectiveChanges: Array<ModelChange>;
  id: Scalars['ID']['output'];
  kind: HistoryKind;
  user?: Maybe<User>;
};

export enum HistoryKind {
  Create = 'CREATE',
  Delete = 'DELETE',
  Update = 'UPDATE'
}

export type Image = {
  __typename?: 'Image';
  /** The affine transformation views of the image. */
  affineTransformationViews: Array<AffineTransformationView>;
  channelViews: Array<ChannelView>;
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  dataset?: Maybe<Dataset>;
  fileOrigins: Array<File>;
  history: Array<History>;
  id: Scalars['ID']['output'];
  intMetrics: Array<ImageIntMetric>;
  labelViews: Array<LabelView>;
  latestSnapshot?: Maybe<Snapshot>;
  metrics: Array<ImageMetric>;
  name: Scalars['String']['output'];
  opticsViews: Array<OpticsView>;
  origins: Array<Image>;
  pinned: Scalars['Boolean']['output'];
  renders: Array<Render>;
  rgbContexts: Array<RgbContext>;
  roiOrigins: Array<Roi>;
  rois: Array<Roi>;
  snapshots: Array<Snapshot>;
  /** The store where the image data is stored. */
  store: ZarrStore;
  tags: Array<Scalars['String']['output']>;
  timepointViews: Array<TimepointView>;
  videos: Array<Video>;
  views: Array<View>;
};


export type ImageAffineTransformationViewsArgs = {
  filters?: InputMaybe<AffineTransformationViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageFileOriginsArgs = {
  filters?: InputMaybe<FileFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageIntMetricsArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageMetricsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<RenderKind>>;
};


export type ImageOpticsViewsArgs = {
  filters?: InputMaybe<OpticsViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageOriginsArgs = {
  filters?: InputMaybe<ImageFilter>;
  order?: InputMaybe<ImageOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageRendersArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<RenderKind>>;
};


export type ImageRgbContextsArgs = {
  filters?: InputMaybe<RgbContextFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageRoisArgs = {
  filters?: InputMaybe<RoiFilter>;
};


export type ImageSnapshotsArgs = {
  filters?: InputMaybe<SnapshotFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageTimepointViewsArgs = {
  filters?: InputMaybe<TimepointViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageVideosArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type ImageFilter = {
  AND?: InputMaybe<ImageFilter>;
  OR?: InputMaybe<ImageFilter>;
  dataset?: InputMaybe<DatasetFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  provenance?: InputMaybe<ProvenanceFilter>;
  store?: InputMaybe<ZarrStoreFilter>;
  timepointViews?: InputMaybe<TimepointViewFilter>;
  transformationViews?: InputMaybe<AffineTransformationViewFilter>;
};

export type ImageIntMetric = ImageMetric & IntMetric & {
  __typename?: 'ImageIntMetric';
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  id: Scalars['ID']['output'];
  image: Image;
  value: Scalars['Int']['output'];
};

export type ImageMetric = {
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  image: Image;
};

export type ImageOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type Instrument = {
  __typename?: 'Instrument';
  id: Scalars['ID']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  serialNumber: Scalars['String']['output'];
  views: Array<OpticsView>;
};


export type InstrumentViewsArgs = {
  filters?: InputMaybe<OpticsViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type InstrumentFilter = {
  AND?: InputMaybe<InstrumentFilter>;
  OR?: InputMaybe<InstrumentFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export type InstrumentInput = {
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  serialNumber: Scalars['String']['input'];
};

export type IntFilterLookup = {
  contains?: InputMaybe<Scalars['Int']['input']>;
  endsWith?: InputMaybe<Scalars['Int']['input']>;
  exact?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  iContains?: InputMaybe<Scalars['Int']['input']>;
  iEndsWith?: InputMaybe<Scalars['Int']['input']>;
  iExact?: InputMaybe<Scalars['Int']['input']>;
  iRegex?: InputMaybe<Scalars['String']['input']>;
  iStartsWith?: InputMaybe<Scalars['Int']['input']>;
  inList?: InputMaybe<Array<Scalars['Int']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  nContains?: InputMaybe<Scalars['Int']['input']>;
  nEndsWith?: InputMaybe<Scalars['Int']['input']>;
  nExact?: InputMaybe<Scalars['Int']['input']>;
  nGt?: InputMaybe<Scalars['Int']['input']>;
  nGte?: InputMaybe<Scalars['Int']['input']>;
  nIContains?: InputMaybe<Scalars['Int']['input']>;
  nIEndsWith?: InputMaybe<Scalars['Int']['input']>;
  nIExact?: InputMaybe<Scalars['Int']['input']>;
  nIRegex?: InputMaybe<Scalars['String']['input']>;
  nIStartsWith?: InputMaybe<Scalars['Int']['input']>;
  nInList?: InputMaybe<Array<Scalars['Int']['input']>>;
  nIsNull?: InputMaybe<Scalars['Boolean']['input']>;
  nLt?: InputMaybe<Scalars['Int']['input']>;
  nLte?: InputMaybe<Scalars['Int']['input']>;
  nRange?: InputMaybe<Array<Scalars['Int']['input']>>;
  nRegex?: InputMaybe<Scalars['String']['input']>;
  nStartsWith?: InputMaybe<Scalars['Int']['input']>;
  range?: InputMaybe<Array<Scalars['Int']['input']>>;
  regex?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['Int']['input']>;
};

export type IntMetric = {
  value: Scalars['Int']['output'];
};

export type LabelView = View & {
  __typename?: 'LabelView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  acquisitionMode?: Maybe<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  fluorophore?: Maybe<Fluorophore>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  primaryAntibody?: Maybe<Antibody>;
  secondaryAntibody?: Maybe<Antibody>;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};

export type LabelViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  fluorophore?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  primaryAntibody?: InputMaybe<Scalars['ID']['input']>;
  secondaryAntibody?: InputMaybe<Scalars['ID']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type MediaStore = {
  __typename?: 'MediaStore';
  bucket: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  path: Scalars['String']['output'];
  presignedUrl: Scalars['String']['output'];
};


export type MediaStorePresignedUrlArgs = {
  host?: InputMaybe<Scalars['String']['input']>;
};

export type ModelChange = {
  __typename?: 'ModelChange';
  field: Scalars['String']['output'];
  newValue: Scalars['String']['output'];
  oldValue: Scalars['String']['output'];
};

export type MultiWellPlate = {
  __typename?: 'MultiWellPlate';
  columns?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  rows?: Maybe<Scalars['Int']['output']>;
  views: Array<WellPositionView>;
};


export type MultiWellPlateViewsArgs = {
  filters?: InputMaybe<WellPositionViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type MultiWellPlateFilter = {
  AND?: InputMaybe<MultiWellPlateFilter>;
  OR?: InputMaybe<MultiWellPlateFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type MultiWellPlateInput = {
  columns?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  rows?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAffineTransformationView: AffineTransformationView;
  createAntibody: Antibody;
  createCamera: Camera;
  createChannel: Channel;
  createChannelView: ChannelView;
  createContinousScanView: ContinousScanView;
  createDataset: Dataset;
  createEra: Era;
  createFluorophore: Fluorophore;
  createInstrument: Instrument;
  createLabelView: LabelView;
  createMultiWellPlate: MultiWellPlate;
  createObjective: Objective;
  createOpticsView: OpticsView;
  createRenderTree: RenderTree;
  createRgbContext: RgbContext;
  createRgbView: RgbView;
  createRoi: Roi;
  createSnapshot: Snapshot;
  createStage: Stage;
  createTimepointView: TimepointView;
  createViewCollection: ViewCollection;
  createWellPositionView: WellPositionView;
  deleteAffineTransformationView: Scalars['ID']['output'];
  deleteAntibody: Scalars['ID']['output'];
  deleteCamera: Scalars['ID']['output'];
  deleteChannel: Scalars['ID']['output'];
  deleteChannelView: Scalars['ID']['output'];
  deleteDataset: Scalars['ID']['output'];
  deleteEra: Scalars['ID']['output'];
  deleteFluorophore: Scalars['ID']['output'];
  deleteInstrument: Scalars['ID']['output'];
  deleteMultiWellPlate: Scalars['ID']['output'];
  deleteObjective: Scalars['ID']['output'];
  deleteOpticsView: Scalars['ID']['output'];
  deleteRgbContext: Scalars['ID']['output'];
  deleteRgbView: Scalars['ID']['output'];
  deleteSnapshot: Scalars['ID']['output'];
  deleteStage: Scalars['ID']['output'];
  deleteTimepointView: Scalars['ID']['output'];
  deleteView: Scalars['ID']['output'];
  deleteViewCollection: Scalars['ID']['output'];
  ensureAntibody: Antibody;
  ensureCamera: Camera;
  ensureChannel: Channel;
  ensureFluorophore: Fluorophore;
  ensureInstrument: Instrument;
  ensureMultiWellPlate: MultiWellPlate;
  ensureObjective: Objective;
  fromArrayLike: Image;
  fromFileLike: File;
  fromParquetLike: Table;
  pinAntibody: Antibody;
  pinCamera: Camera;
  pinChannel: Channel;
  pinDataset: Dataset;
  pinEra: Era;
  pinFluorophore: Fluorophore;
  pinImage: Image;
  pinInstrument: Instrument;
  pinMultiWellPlate: MultiWellPlate;
  pinObjective: Objective;
  pinSnapshot: Snapshot;
  pinStage: Stage;
  pinView: View;
  pinViewCollection: ViewCollection;
  putDatasetsInDataset: Dataset;
  putFilesInDataset: Dataset;
  putImagesInDataset: Dataset;
  relateToDataset: Image;
  releaseDatasetsFromDataset: Dataset;
  releaseFilesFromDataset: Dataset;
  releaseImagesFromDataset: Dataset;
  /** Request upload credentials for a given key */
  requestAccess: AccessCredentials;
  requestFileAccess: AccessCredentials;
  requestFileUpload: Credentials;
  requestMediaUpload: PresignedPostCredentials;
  requestTableAccess: AccessCredentials;
  requestTableUpload: Credentials;
  requestUpload: Credentials;
  revertDataset: Dataset;
  updateDataset: Dataset;
  updateImage: Image;
  /** Update RGB Context */
  updateRgbContext: RgbContext;
};


export type MutationCreateAffineTransformationViewArgs = {
  input: AffineTransformationViewInput;
};


export type MutationCreateAntibodyArgs = {
  input: AntibodyInput;
};


export type MutationCreateCameraArgs = {
  input: CameraInput;
};


export type MutationCreateChannelArgs = {
  input: ChannelInput;
};


export type MutationCreateChannelViewArgs = {
  input: ChannelViewInput;
};


export type MutationCreateContinousScanViewArgs = {
  input: ContinousScanViewInput;
};


export type MutationCreateDatasetArgs = {
  input: CreateDatasetInput;
};


export type MutationCreateEraArgs = {
  input: EraInput;
};


export type MutationCreateFluorophoreArgs = {
  input: FluorophoreInput;
};


export type MutationCreateInstrumentArgs = {
  input: InstrumentInput;
};


export type MutationCreateLabelViewArgs = {
  input: LabelViewInput;
};


export type MutationCreateMultiWellPlateArgs = {
  input: MultiWellPlateInput;
};


export type MutationCreateObjectiveArgs = {
  input: ObjectiveInput;
};


export type MutationCreateOpticsViewArgs = {
  input: OpticsViewInput;
};


export type MutationCreateRenderTreeArgs = {
  input: RenderTreeInput;
};


export type MutationCreateRgbContextArgs = {
  input: CreateRgbContextInput;
};


export type MutationCreateRgbViewArgs = {
  input: RgbViewInput;
};


export type MutationCreateRoiArgs = {
  input: RoiInput;
};


export type MutationCreateSnapshotArgs = {
  input: SnaphotInput;
};


export type MutationCreateStageArgs = {
  input: StageInput;
};


export type MutationCreateTimepointViewArgs = {
  input: TimepointViewInput;
};


export type MutationCreateViewCollectionArgs = {
  input: ViewCollectionInput;
};


export type MutationCreateWellPositionViewArgs = {
  input: WellPositionViewInput;
};


export type MutationDeleteAffineTransformationViewArgs = {
  input: DeleteViewInput;
};


export type MutationDeleteAntibodyArgs = {
  input: DeleteAntibodyInput;
};


export type MutationDeleteCameraArgs = {
  input: DeleteCameraInput;
};


export type MutationDeleteChannelArgs = {
  input: DeleteChannelInput;
};


export type MutationDeleteChannelViewArgs = {
  input: DeleteViewInput;
};


export type MutationDeleteDatasetArgs = {
  input: DeleteDatasetInput;
};


export type MutationDeleteEraArgs = {
  input: DeleteEraInput;
};


export type MutationDeleteFluorophoreArgs = {
  input: DeleteFluorophoreInput;
};


export type MutationDeleteInstrumentArgs = {
  input: DeleteInstrumentInput;
};


export type MutationDeleteMultiWellPlateArgs = {
  input: DeleteMultiWellInput;
};


export type MutationDeleteObjectiveArgs = {
  input: DeleteObjectiveInput;
};


export type MutationDeleteOpticsViewArgs = {
  input: DeleteViewInput;
};


export type MutationDeleteRgbContextArgs = {
  input: DeleteRgbContextInput;
};


export type MutationDeleteRgbViewArgs = {
  input: DeleteViewInput;
};


export type MutationDeleteSnapshotArgs = {
  input: DeleteSnaphotInput;
};


export type MutationDeleteStageArgs = {
  input: DeleteStageInput;
};


export type MutationDeleteTimepointViewArgs = {
  input: DeleteViewInput;
};


export type MutationDeleteViewArgs = {
  input: DeleteViewInput;
};


export type MutationDeleteViewCollectionArgs = {
  input: DeleteViewCollectionInput;
};


export type MutationEnsureAntibodyArgs = {
  input: AntibodyInput;
};


export type MutationEnsureCameraArgs = {
  input: CameraInput;
};


export type MutationEnsureChannelArgs = {
  input: ChannelInput;
};


export type MutationEnsureFluorophoreArgs = {
  input: FluorophoreInput;
};


export type MutationEnsureInstrumentArgs = {
  input: InstrumentInput;
};


export type MutationEnsureMultiWellPlateArgs = {
  input: MultiWellPlateInput;
};


export type MutationEnsureObjectiveArgs = {
  input: ObjectiveInput;
};


export type MutationFromArrayLikeArgs = {
  input: FromArrayLikeInput;
};


export type MutationFromFileLikeArgs = {
  input: FromFileLike;
};


export type MutationFromParquetLikeArgs = {
  input: FromParquetLike;
};


export type MutationPinAntibodyArgs = {
  input: PinAntibodyInput;
};


export type MutationPinCameraArgs = {
  input: PinCameraInput;
};


export type MutationPinChannelArgs = {
  input: PinChannelInput;
};


export type MutationPinDatasetArgs = {
  input: PinDatasetInput;
};


export type MutationPinEraArgs = {
  input: PinEraInput;
};


export type MutationPinFluorophoreArgs = {
  input: PinFluorophoreInput;
};


export type MutationPinImageArgs = {
  input: PinImageInput;
};


export type MutationPinInstrumentArgs = {
  input: PinInstrumentInput;
};


export type MutationPinMultiWellPlateArgs = {
  input: PintMultiWellPlateInput;
};


export type MutationPinObjectiveArgs = {
  input: PinObjectiveInput;
};


export type MutationPinSnapshotArgs = {
  input: PinSnapshotInput;
};


export type MutationPinStageArgs = {
  input: PinStageInput;
};


export type MutationPinViewArgs = {
  input: PinViewInput;
};


export type MutationPinViewCollectionArgs = {
  input: PinViewCollectionInput;
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


export type MutationRelateToDatasetArgs = {
  input: RelateToDatasetInput;
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


export type MutationRequestMediaUploadArgs = {
  input: RequestMediaUploadInput;
};


export type MutationRequestTableAccessArgs = {
  input: RequestTableAccessInput;
};


export type MutationRequestTableUploadArgs = {
  input: RequestTableUploadInput;
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
  input: UpdateImageInput;
};


export type MutationUpdateRgbContextArgs = {
  input: UpdateRgbContextInput;
};

export type Objective = {
  __typename?: 'Objective';
  id: Scalars['ID']['output'];
  immersion?: Maybe<Scalars['String']['output']>;
  magnification?: Maybe<Scalars['Float']['output']>;
  na?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  serialNumber: Scalars['String']['output'];
  views: Array<OpticsView>;
};


export type ObjectiveViewsArgs = {
  filters?: InputMaybe<OpticsViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ObjectiveFilter = {
  AND?: InputMaybe<ObjectiveFilter>;
  OR?: InputMaybe<ObjectiveFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export type ObjectiveInput = {
  immersion?: InputMaybe<Scalars['String']['input']>;
  magnification?: InputMaybe<Scalars['Float']['input']>;
  na?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  serialNumber: Scalars['String']['input'];
};

export type OffsetPaginationInput = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type OpticsView = View & {
  __typename?: 'OpticsView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  camera?: Maybe<Camera>;
  id: Scalars['ID']['output'];
  image: Image;
  instrument?: Maybe<Instrument>;
  isGlobal: Scalars['Boolean']['output'];
  objective?: Maybe<Objective>;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};

export type OpticsViewFilter = {
  AND?: InputMaybe<OpticsViewFilter>;
  OR?: InputMaybe<OpticsViewFilter>;
  camera?: InputMaybe<CameraFilter>;
  instrument?: InputMaybe<InstrumentFilter>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  objective?: InputMaybe<ObjectiveFilter>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export type OpticsViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  camera?: InputMaybe<Scalars['ID']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  instrument?: InputMaybe<Scalars['ID']['input']>;
  objective?: InputMaybe<Scalars['ID']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export enum Ordering {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type OverlayNode = RenderNode & {
  __typename?: 'OverlayNode';
  children: Array<RenderNode>;
  kind: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type ParquetStore = {
  __typename?: 'ParquetStore';
  bucket: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type PartialAcquisitionViewInput = {
  acquiredAt?: InputMaybe<Scalars['DateTime']['input']>;
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  operator?: InputMaybe<Scalars['ID']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialAffineTransformationViewInput = {
  affineMatrix: Scalars['FourByFourMatrix']['input'];
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  stage?: InputMaybe<Scalars['ID']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialChannelViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  channel: Scalars['ID']['input'];
  collection?: InputMaybe<Scalars['ID']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialLabelViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  fluorophore?: InputMaybe<Scalars['ID']['input']>;
  primaryAntibody?: InputMaybe<Scalars['ID']['input']>;
  secondaryAntibody?: InputMaybe<Scalars['ID']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialOpticsViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  camera?: InputMaybe<Scalars['ID']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  instrument?: InputMaybe<Scalars['ID']['input']>;
  objective?: InputMaybe<Scalars['ID']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialRgbViewInput = {
  bScale: Scalars['Float']['input'];
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  context?: InputMaybe<Scalars['ID']['input']>;
  gScale: Scalars['Float']['input'];
  rScale: Scalars['Float']['input'];
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialTimepointViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  era?: InputMaybe<Scalars['ID']['input']>;
  indexSinceStart?: InputMaybe<Scalars['Int']['input']>;
  msSinceStart?: InputMaybe<Scalars['Milliseconds']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PathRoi = Roi & {
  __typename?: 'PathROI';
  id: Scalars['ID']['output'];
  image: Image;
  pathLength: Scalars['Int']['output'];
  vectors: Scalars['FiveDVector']['output'];
};

export type PinAntibodyInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinCameraInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinChannelInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinDatasetInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinEraInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinFluorophoreInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinImageInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinInstrumentInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinObjectiveInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinSnapshotInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinStageInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinViewCollectionInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinViewInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PintMultiWellPlateInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

/** Temporary Credentials for a file upload that can be used by a Client (e.g. in a python datalayer) */
export type PresignedPostCredentials = {
  __typename?: 'PresignedPostCredentials';
  bucket: Scalars['String']['output'];
  datalayer: Scalars['String']['output'];
  key: Scalars['String']['output'];
  policy: Scalars['String']['output'];
  store: Scalars['String']['output'];
  xAmzAlgorithm: Scalars['String']['output'];
  xAmzCredential: Scalars['String']['output'];
  xAmzDate: Scalars['String']['output'];
  xAmzSignature: Scalars['String']['output'];
};

export type ProvenanceFilter = {
  AND?: InputMaybe<ProvenanceFilter>;
  OR?: InputMaybe<ProvenanceFilter>;
  during?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  acquisitionViews: Array<AcquisitionView>;
  affineTransformationViews: Array<AffineTransformationView>;
  antibodies: Array<Antibody>;
  camera: Camera;
  channelViews: Array<ChannelView>;
  channels: Array<Channel>;
  continousScanViews: Array<ContinousScanView>;
  dataset: Dataset;
  datasets: Array<Dataset>;
  eras: Array<Era>;
  file: File;
  files: Array<File>;
  fluorophore: Fluorophore;
  fluorophores: Array<Fluorophore>;
  image: Image;
  images: Array<Image>;
  instrument: Instrument;
  instruments: Array<Instrument>;
  labelViews: Array<LabelView>;
  multiWellPlate: MultiWellPlate;
  multiWellPlates: Array<MultiWellPlate>;
  mychannels: Array<Channel>;
  mydatasets: Array<Dataset>;
  myeras: Array<Era>;
  myfiles: Array<File>;
  myimages: Array<Image>;
  myobjectives: Array<Objective>;
  mysnapshots: Array<Snapshot>;
  mytables: Array<Table>;
  objective: Objective;
  objectives: Array<Objective>;
  randomImage: Image;
  renderTree: RenderTree;
  renderTrees: Array<RenderTree>;
  rgbViews: Array<RgbView>;
  rgbcontext: RgbContext;
  rgbcontexts: Array<RgbContext>;
  snapshot: Snapshot;
  snapshots: Array<Snapshot>;
  stage: Stage;
  stages: Array<Stage>;
  table: Table;
  tables: Array<Table>;
  timepointViews: Array<TimepointView>;
  wellPositionViews: Array<WellPositionView>;
};


export type QueryAffineTransformationViewsArgs = {
  filters?: InputMaybe<AffineTransformationViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryAntibodiesArgs = {
  filters?: InputMaybe<AntibodyFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryCameraArgs = {
  id: Scalars['ID']['input'];
};


export type QueryContinousScanViewsArgs = {
  filters?: InputMaybe<ContinousScanViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryDatasetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDatasetsArgs = {
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryErasArgs = {
  filters?: InputMaybe<EraFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryFileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFilesArgs = {
  filters?: InputMaybe<FileFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryFluorophoreArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFluorophoresArgs = {
  filters?: InputMaybe<FluorophoreFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryImageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryImagesArgs = {
  filters?: InputMaybe<ImageFilter>;
  order?: InputMaybe<ImageOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryInstrumentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMultiWellPlateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMultiWellPlatesArgs = {
  filters?: InputMaybe<MultiWellPlateFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMydatasetsArgs = {
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMyerasArgs = {
  filters?: InputMaybe<EraFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMyfilesArgs = {
  filters?: InputMaybe<FileFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMyimagesArgs = {
  filters?: InputMaybe<ImageFilter>;
  order?: InputMaybe<ImageOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMysnapshotsArgs = {
  filters?: InputMaybe<SnapshotFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMytablesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryObjectiveArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRenderTreeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRenderTreesArgs = {
  filters?: InputMaybe<RenderTreeFilter>;
  order?: InputMaybe<RenderTreeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRgbcontextArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRgbcontextsArgs = {
  filters?: InputMaybe<RgbContextFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QuerySnapshotArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySnapshotsArgs = {
  filters?: InputMaybe<SnapshotFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStagesArgs = {
  filters?: InputMaybe<StageFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryTableArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTablesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryTimepointViewsArgs = {
  filters?: InputMaybe<TimepointViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryWellPositionViewsArgs = {
  filters?: InputMaybe<WellPositionViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type RgbContext = {
  __typename?: 'RGBContext';
  blending: Blending;
  c: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  image: Image;
  name: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  snapshots: Array<Snapshot>;
  t: Scalars['Int']['output'];
  views: Array<RgbView>;
  z: Scalars['Int']['output'];
};


export type RgbContextSnapshotsArgs = {
  filters?: InputMaybe<SnapshotFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type RgbContextFilter = {
  AND?: InputMaybe<RgbContextFilter>;
  OR?: InputMaybe<RgbContextFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  provenance?: InputMaybe<ProvenanceFilter>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type RgbContextViewInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  cMax: Scalars['Int']['input'];
  cMin: Scalars['Int']['input'];
  colorMap?: InputMaybe<ColorMap>;
  contrastLimitMax?: InputMaybe<Scalars['Float']['input']>;
  contrastLimitMin?: InputMaybe<Scalars['Float']['input']>;
  gamma?: InputMaybe<Scalars['Float']['input']>;
  rescale?: InputMaybe<Scalars['Boolean']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
};

export type RgbView = View & {
  __typename?: 'RGBView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  active: Scalars['Boolean']['output'];
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  colorMap: ColorMap;
  contexts: Array<RgbContext>;
  contrastLimitMax?: Maybe<Scalars['Float']['output']>;
  contrastLimitMin?: Maybe<Scalars['Float']['output']>;
  fullColour: Scalars['String']['output'];
  gamma?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rescale: Scalars['Boolean']['output'];
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};


export type RgbViewContextsArgs = {
  filters?: InputMaybe<RgbContextFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type RgbViewFullColourArgs = {
  format?: InputMaybe<ColorFormat>;
};


export type RgbViewNameArgs = {
  long?: Scalars['Boolean']['input'];
};

export type RgbViewInput = {
  bScale: Scalars['Float']['input'];
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  context?: InputMaybe<Scalars['ID']['input']>;
  gScale: Scalars['Float']['input'];
  image: Scalars['ID']['input'];
  rScale: Scalars['Float']['input'];
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type Roi = {
  id: Scalars['ID']['output'];
  image: Image;
  vectors: Scalars['FiveDVector']['output'];
};

export type RoiFilter = {
  AND?: InputMaybe<RoiFilter>;
  OR?: InputMaybe<RoiFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  kind?: InputMaybe<RoiKind>;
};

export type RectangleRoi = Roi & {
  __typename?: 'RectangleROI';
  depth: Scalars['Int']['output'];
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  image: Image;
  vectors: Scalars['FiveDVector']['output'];
  width: Scalars['Int']['output'];
};

export type RelateToDatasetInput = {
  id: Scalars['ID']['input'];
  other: Scalars['ID']['input'];
};

export type Render = {
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
};

export enum RenderKind {
  Snapshot = 'SNAPSHOT',
  Video = 'VIDEO'
}

export type RenderNode = {
  kind: Scalars['String']['output'];
};

export enum RenderNodeKind {
  Context = 'CONTEXT',
  Grid = 'GRID',
  Overlay = 'OVERLAY',
  Spit = 'SPIT'
}

export type RenderTree = {
  __typename?: 'RenderTree';
  id: Scalars['ID']['output'];
  linkedContexts: Array<RgbContext>;
  name: Scalars['String']['output'];
  tree: Tree;
};


export type RenderTreeLinkedContextsArgs = {
  filters?: InputMaybe<RgbContextFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type RenderTreeFilter = {
  AND?: InputMaybe<RenderTreeFilter>;
  OR?: InputMaybe<RenderTreeFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export type RenderTreeInput = {
  name: Scalars['String']['input'];
  tree: TreeInput;
};

export type RenderTreeOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type RequestAccessInput = {
  duration?: InputMaybe<Scalars['Int']['input']>;
  store: Scalars['ID']['input'];
};

export type RequestFileAccessInput = {
  duration?: InputMaybe<Scalars['Int']['input']>;
  store: Scalars['ID']['input'];
};

export type RequestFileUploadInput = {
  datalayer: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

export type RequestMediaUploadInput = {
  datalayer: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

export type RequestTableAccessInput = {
  duration?: InputMaybe<Scalars['Int']['input']>;
  store: Scalars['ID']['input'];
};

export type RequestTableUploadInput = {
  datalayer: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

export type RequestUploadInput = {
  datalayer: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

export type RevertInput = {
  historyId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};

export type RoiInput = {
  image: Scalars['ID']['input'];
  kind?: InputMaybe<RoiKind>;
  vectors: Array<Scalars['FiveDVector']['input']>;
};

export enum RoiKind {
  Cube = 'CUBE',
  Ellipsis = 'ELLIPSIS',
  Frame = 'FRAME',
  Hypercube = 'HYPERCUBE',
  Line = 'LINE',
  Path = 'PATH',
  Point = 'POINT',
  Polygon = 'POLYGON',
  Rectangle = 'RECTANGLE',
  Slice = 'SLICE',
  SpectralCube = 'SPECTRAL_CUBE',
  SpectralHypercube = 'SPECTRAL_HYPERCUBE',
  SpectralRectangle = 'SPECTRAL_RECTANGLE',
  TemporalCube = 'TEMPORAL_CUBE',
  TemporalRectangle = 'TEMPORAL_RECTANGLE',
  Unknown = 'UNKNOWN'
}

export enum ScanDirection {
  ColumnRowSlice = 'COLUMN_ROW_SLICE',
  ColumnRowSliceSnake = 'COLUMN_ROW_SLICE_SNAKE',
  RowColumnSlice = 'ROW_COLUMN_SLICE',
  RowColumnSliceSnake = 'ROW_COLUMN_SLICE_SNAKE',
  SliceRowColumn = 'SLICE_ROW_COLUMN',
  SliceRowColumnSnake = 'SLICE_ROW_COLUMN_SNAKE'
}

export type SnaphotInput = {
  file: Scalars['Upload']['input'];
  image: Scalars['ID']['input'];
};

export type Snapshot = Render & {
  __typename?: 'Snapshot';
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  store: MediaStore;
};

export type SnapshotFilter = {
  AND?: InputMaybe<SnapshotFilter>;
  OR?: InputMaybe<SnapshotFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
};

export type SplitNode = RenderNode & {
  __typename?: 'SplitNode';
  children: Array<RenderNode>;
  kind: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type Stage = {
  __typename?: 'Stage';
  affineViews: Array<AffineTransformationView>;
  description?: Maybe<Scalars['String']['output']>;
  history: Array<History>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
};


export type StageAffineViewsArgs = {
  filters?: InputMaybe<AffineTransformationViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type StageHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type StageFilter = {
  AND?: InputMaybe<StageFilter>;
  OR?: InputMaybe<StageFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<StrFilterLookup>;
  provenance?: InputMaybe<ProvenanceFilter>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type StageInput = {
  instrument?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type StrFilterLookup = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  exact?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  iContains?: InputMaybe<Scalars['String']['input']>;
  iEndsWith?: InputMaybe<Scalars['String']['input']>;
  iExact?: InputMaybe<Scalars['String']['input']>;
  iRegex?: InputMaybe<Scalars['String']['input']>;
  iStartsWith?: InputMaybe<Scalars['String']['input']>;
  inList?: InputMaybe<Array<Scalars['String']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  nContains?: InputMaybe<Scalars['String']['input']>;
  nEndsWith?: InputMaybe<Scalars['String']['input']>;
  nExact?: InputMaybe<Scalars['String']['input']>;
  nGt?: InputMaybe<Scalars['String']['input']>;
  nGte?: InputMaybe<Scalars['String']['input']>;
  nIContains?: InputMaybe<Scalars['String']['input']>;
  nIEndsWith?: InputMaybe<Scalars['String']['input']>;
  nIExact?: InputMaybe<Scalars['String']['input']>;
  nIRegex?: InputMaybe<Scalars['String']['input']>;
  nIStartsWith?: InputMaybe<Scalars['String']['input']>;
  nInList?: InputMaybe<Array<Scalars['String']['input']>>;
  nIsNull?: InputMaybe<Scalars['Boolean']['input']>;
  nLt?: InputMaybe<Scalars['String']['input']>;
  nLte?: InputMaybe<Scalars['String']['input']>;
  nRange?: InputMaybe<Array<Scalars['String']['input']>>;
  nRegex?: InputMaybe<Scalars['String']['input']>;
  nStartsWith?: InputMaybe<Scalars['String']['input']>;
  range?: InputMaybe<Array<Scalars['String']['input']>>;
  regex?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  historyEvents: Image;
};


export type SubscriptionHistoryEventsArgs = {
  user: Scalars['String']['input'];
};

export type Table = {
  __typename?: 'Table';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  origins: Array<Image>;
  store: ParquetStore;
};


export type TableOriginsArgs = {
  filters?: InputMaybe<ImageFilter>;
  order?: InputMaybe<ImageOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type TimepointView = View & {
  __typename?: 'TimepointView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  era: Era;
  id: Scalars['ID']['output'];
  image: Image;
  indexSinceStart?: Maybe<Scalars['Int']['output']>;
  isGlobal: Scalars['Boolean']['output'];
  msSinceStart?: Maybe<Scalars['Milliseconds']['output']>;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};

export type TimepointViewFilter = {
  AND?: InputMaybe<TimepointViewFilter>;
  OR?: InputMaybe<TimepointViewFilter>;
  era?: InputMaybe<EraFilter>;
  indexSinceStart?: InputMaybe<Scalars['Int']['input']>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  msSinceStart?: InputMaybe<Scalars['Float']['input']>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export type TimepointViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  era?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  indexSinceStart?: InputMaybe<Scalars['Int']['input']>;
  msSinceStart?: InputMaybe<Scalars['Milliseconds']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type Tree = {
  __typename?: 'Tree';
  children: Array<RenderNode>;
};

export type TreeInput = {
  children: Array<TreeNodeInput>;
  id?: InputMaybe<Scalars['String']['input']>;
};

export type TreeNodeInput = {
  children?: InputMaybe<Array<TreeNodeInput>>;
  context?: InputMaybe<Scalars['String']['input']>;
  gap?: InputMaybe<Scalars['Int']['input']>;
  kind: RenderNodeKind;
  label?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateImageInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateRgbContextInput = {
  c?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  t?: InputMaybe<Scalars['Int']['input']>;
  thumbnail?: InputMaybe<Scalars['ID']['input']>;
  views?: InputMaybe<Array<RgbContextViewInput>>;
  z?: InputMaybe<Scalars['Int']['input']>;
};

/** A user. */
export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  password: Scalars['String']['output'];
  sub: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type Video = Render & {
  __typename?: 'Video';
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  id: Scalars['ID']['output'];
  store: MediaStore;
  thumbnail: MediaStore;
};

export type View = {
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};

export type ViewCollection = {
  __typename?: 'ViewCollection';
  affineTransformationViews: Array<AffineTransformationView>;
  channelViews: Array<ChannelView>;
  history: Array<History>;
  id: Scalars['ID']['output'];
  labelViews: Array<LabelView>;
  name: Scalars['String']['output'];
  views: Array<View>;
};


export type ViewCollectionAffineTransformationViewsArgs = {
  filters?: InputMaybe<AffineTransformationViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ViewCollectionHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ViewCollectionInput = {
  name: Scalars['String']['input'];
};

export type ViewFilter = {
  AND?: InputMaybe<ViewFilter>;
  OR?: InputMaybe<ViewFilter>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  provenance?: InputMaybe<ProvenanceFilter>;
};

export enum ViewKind {
  AffineTransformation = 'AFFINE_TRANSFORMATION',
  Channel = 'CHANNEL',
  Label = 'LABEL',
  Optics = 'OPTICS',
  Timepoint = 'TIMEPOINT'
}

export type WellPositionView = View & {
  __typename?: 'WellPositionView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  column?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  row?: Maybe<Scalars['Int']['output']>;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  well?: Maybe<MultiWellPlate>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};

export type WellPositionViewFilter = {
  AND?: InputMaybe<WellPositionViewFilter>;
  OR?: InputMaybe<WellPositionViewFilter>;
  column?: InputMaybe<Scalars['Int']['input']>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  provenance?: InputMaybe<ProvenanceFilter>;
  row?: InputMaybe<Scalars['Int']['input']>;
  well?: InputMaybe<MultiWellPlateFilter>;
};

export type WellPositionViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  column?: InputMaybe<Scalars['Int']['input']>;
  image: Scalars['ID']['input'];
  row?: InputMaybe<Scalars['Int']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  well?: InputMaybe<Scalars['ID']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type ZarrStore = {
  __typename?: 'ZarrStore';
  /** The bucket where the data is stored. */
  bucket: Scalars['String']['output'];
  /** The chunks of the data. */
  chunks?: Maybe<Array<Scalars['Int']['output']>>;
  /** The dtype of the data. */
  dtype?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** The key where the data is stored. */
  key: Scalars['String']['output'];
  /** The path to the data. Relative to the bucket. */
  path?: Maybe<Scalars['String']['output']>;
  /** Whether the zarr store was populated (e.g. was a dataset created). */
  populated: Scalars['Boolean']['output'];
  /** The shape of the data. */
  shape?: Maybe<Array<Scalars['Int']['output']>>;
};

export type ZarrStoreFilter = {
  AND?: InputMaybe<ZarrStoreFilter>;
  OR?: InputMaybe<ZarrStoreFilter>;
  shape?: InputMaybe<IntFilterLookup>;
};

export type AntibodyFragment = { __typename?: 'Antibody', name: string, epitope?: string | null };

export type CameraFragment = { __typename?: 'Camera', sensorSizeX?: number | null, sensorSizeY?: number | null, pixelSizeX?: any | null, pixelSizeY?: any | null, name: string, serialNumber: string };

export type ChannelFragment = { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null };

export type CredentialsFragment = { __typename?: 'Credentials', accessKey: string, status: string, secretKey: string, bucket: string, key: string, sessionToken: string, store: string };

export type AccessCredentialsFragment = { __typename?: 'AccessCredentials', accessKey: string, secretKey: string, bucket: string, key: string, sessionToken: string, path: string };

export type PresignedPostCredentialsFragment = { __typename?: 'PresignedPostCredentials', xAmzAlgorithm: string, xAmzCredential: string, xAmzDate: string, xAmzSignature: string, key: string, bucket: string, datalayer: string, policy: string, store: string };

export type DatasetFragment = { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null };

export type ListDatasetFragment = { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean };

export type EraFragment = { __typename?: 'Era', id: string, begin?: any | null, name: string };

export type FileFragment = { __typename?: 'File', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'BigFileStore', id: string, key: string, bucket: string, path: string } };

export type ListFileFragment = { __typename?: 'File', id: string, name: string };

export type FluorophoreFragment = { __typename?: 'Fluorophore', id: string, name: string, emissionWavelength?: any | null, excitationWavelength?: any | null };

export type HistoryFragment = { __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> };

export type ImageFragment = { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, views: Array<{ __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null } | { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } } | { __typename?: 'ChannelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channel: { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null } } | { __typename?: 'ContinousScanView' } | { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Fluorophore', id: string, name: string, emissionWavelength?: any | null, excitationWavelength?: any | null } | null, primaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null, secondaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null } | { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null } | { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } | { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } } | { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, creator?: { __typename?: 'User', sub: string } | null, metrics: Array<{ __typename?: 'ImageIntMetric', id: string, value: number }>, roiOrigins: Array<{ __typename?: 'PathROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } } | { __typename?: 'RectangleROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } }>, fileOrigins: Array<{ __typename?: 'File', id: string, name: string }>, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }>, rois: Array<{ __typename?: 'PathROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } } | { __typename?: 'RectangleROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } }> };

export type ListImageFragment = { __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null };

export type InstrumentFragment = { __typename?: 'Instrument', model?: string | null, name: string, serialNumber: string };

export type ImageIntMetricFragment = { __typename?: 'ImageIntMetric', id: string, value: number };

export type ImageMetricFragment = { __typename?: 'ImageIntMetric', id: string, value: number };

export type MultiWellPlateFragment = { __typename?: 'MultiWellPlate', id: string, name?: string | null, views: Array<{ __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }> };

export type ListMultiWellPlateFragment = { __typename?: 'MultiWellPlate', id: string, name?: string | null };

export type ObjectiveFragment = { __typename?: 'Objective', na?: number | null, name: string, serialNumber: string };

export type ContextNodeNestedFragment = { __typename?: 'ContextNode', label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } };

export type OverlayNodeNestedFragment = { __typename?: 'OverlayNode', label?: string | null };

export type GridNodeNestedFragment = { __typename?: 'GridNode', label?: string | null, gap?: number | null };

type RenderNodeNested_ContextNode_Fragment = { __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } };

type RenderNodeNested_GridNode_Fragment = { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null };

type RenderNodeNested_OverlayNode_Fragment = { __typename?: 'OverlayNode', kind: string, label?: string | null };

type RenderNodeNested_SplitNode_Fragment = { __typename?: 'SplitNode', kind: string };

export type RenderNodeNestedFragment = RenderNodeNested_ContextNode_Fragment | RenderNodeNested_GridNode_Fragment | RenderNodeNested_OverlayNode_Fragment | RenderNodeNested_SplitNode_Fragment;

export type ContextNodeFragment = { __typename?: 'ContextNode', label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } };

export type OverlayNodeFragment = { __typename?: 'OverlayNode', label?: string | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> };

export type GridNodeFragment = { __typename?: 'GridNode', label?: string | null, gap?: number | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> };

type RenderNode_ContextNode_Fragment = { __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } };

type RenderNode_GridNode_Fragment = { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> };

type RenderNode_OverlayNode_Fragment = { __typename?: 'OverlayNode', kind: string, label?: string | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> };

type RenderNode_SplitNode_Fragment = { __typename?: 'SplitNode', kind: string };

export type RenderNodeFragment = RenderNode_ContextNode_Fragment | RenderNode_GridNode_Fragment | RenderNode_OverlayNode_Fragment | RenderNode_SplitNode_Fragment;

export type TreeFragment = { __typename?: 'Tree', children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'OverlayNode', kind: string, label?: string | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'SplitNode', kind: string }> };

export type RenderTreeFragment = { __typename?: 'RenderTree', id: string, name: string, tree: { __typename?: 'Tree', children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'OverlayNode', kind: string, label?: string | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'SplitNode', kind: string }> } };

export type ListRenderTreeFragment = { __typename?: 'RenderTree', id: string, name: string };

export type RgbContextFragment = { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } };

export type ListRgbContextFragment = { __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> };

type ListRoi_PathRoi_Fragment = { __typename?: 'PathROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } };

type ListRoi_RectangleRoi_Fragment = { __typename?: 'RectangleROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } };

export type ListRoiFragment = ListRoi_PathRoi_Fragment | ListRoi_RectangleRoi_Fragment;

export type SnapshotFragment = { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } };

export type StageFragment = { __typename?: 'Stage', id: string, pinned: boolean, name: string, affineViews: Array<{ __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } }> };

export type ListStageFragment = { __typename?: 'Stage', id: string, name: string };

export type ZarrStoreFragment = { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null };

export type ParquetStoreFragment = { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string };

export type BigFileStoreFragment = { __typename?: 'BigFileStore', id: string, key: string, bucket: string, path: string };

export type TableFragment = { __typename?: 'Table', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string } };

export type VideoFragment = { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } };

type View_AcquisitionView_Fragment = { __typename?: 'AcquisitionView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_AffineTransformationView_Fragment = { __typename?: 'AffineTransformationView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_ChannelView_Fragment = { __typename?: 'ChannelView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_ContinousScanView_Fragment = { __typename?: 'ContinousScanView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_LabelView_Fragment = { __typename?: 'LabelView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_OpticsView_Fragment = { __typename?: 'OpticsView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_RgbView_Fragment = { __typename?: 'RGBView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_TimepointView_Fragment = { __typename?: 'TimepointView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_WellPositionView_Fragment = { __typename?: 'WellPositionView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

export type ViewFragment = View_AcquisitionView_Fragment | View_AffineTransformationView_Fragment | View_ChannelView_Fragment | View_ContinousScanView_Fragment | View_LabelView_Fragment | View_OpticsView_Fragment | View_RgbView_Fragment | View_TimepointView_Fragment | View_WellPositionView_Fragment;

export type ChannelViewFragment = { __typename?: 'ChannelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channel: { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null } };

export type AffineTransformationViewFragment = { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } };

export type RgbViewFragment = { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } };

export type TimepointViewFragment = { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } };

export type OpticsViewFragment = { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null };

export type LabelViewFragment = { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Fluorophore', id: string, name: string, emissionWavelength?: any | null, excitationWavelength?: any | null } | null, primaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null, secondaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null };

export type AcquisitionViewFragment = { __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null };

export type WellPositionViewFragment = { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null };

export type ContinousScanViewFragment = { __typename?: 'ContinousScanView', id: string, direction: ScanDirection, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

export type CreateAntibodyMutationVariables = Exact<{
  name: Scalars['String']['input'];
  epitope?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateAntibodyMutation = { __typename?: 'Mutation', createAntibody: { __typename?: 'Antibody', id: string, name: string } };

export type EnsureAntibodyMutationVariables = Exact<{
  name: Scalars['String']['input'];
  epitope?: InputMaybe<Scalars['String']['input']>;
}>;


export type EnsureAntibodyMutation = { __typename?: 'Mutation', ensureAntibody: { __typename?: 'Antibody', id: string, name: string } };

export type CreateCameraMutationVariables = Exact<{
  serialNumber: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  pixelSizeX?: InputMaybe<Scalars['Micrometers']['input']>;
  pixelSizeY?: InputMaybe<Scalars['Micrometers']['input']>;
  sensorSizeX?: InputMaybe<Scalars['Int']['input']>;
  sensorSizeY?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CreateCameraMutation = { __typename?: 'Mutation', createCamera: { __typename?: 'Camera', id: string, name: string } };

export type EnsureCameraMutationVariables = Exact<{
  serialNumber: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  pixelSizeX?: InputMaybe<Scalars['Micrometers']['input']>;
  pixelSizeY?: InputMaybe<Scalars['Micrometers']['input']>;
  sensorSizeX?: InputMaybe<Scalars['Int']['input']>;
  sensorSizeY?: InputMaybe<Scalars['Int']['input']>;
}>;


export type EnsureCameraMutation = { __typename?: 'Mutation', ensureCamera: { __typename?: 'Camera', id: string, name: string } };

export type CreateChannelMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', createChannel: { __typename?: 'Channel', id: string, name: string } };

export type EnsureChannelMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type EnsureChannelMutation = { __typename?: 'Mutation', ensureChannel: { __typename?: 'Channel', id: string, name: string } };

export type CreateDatasetMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateDatasetMutation = { __typename?: 'Mutation', createDataset: { __typename?: 'Dataset', id: string, name: string } };

export type UpdateDatasetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateDatasetMutation = { __typename?: 'Mutation', updateDataset: { __typename?: 'Dataset', id: string, name: string } };

export type PinDatasetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
}>;


export type PinDatasetMutation = { __typename?: 'Mutation', pinDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type PutDatasetsInDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type PutDatasetsInDatasetMutation = { __typename?: 'Mutation', putDatasetsInDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ReleaseDatasetsFromDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type ReleaseDatasetsFromDatasetMutation = { __typename?: 'Mutation', releaseDatasetsFromDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type PutImagesInDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type PutImagesInDatasetMutation = { __typename?: 'Mutation', putImagesInDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ReleaseImagesFromDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type ReleaseImagesFromDatasetMutation = { __typename?: 'Mutation', releaseImagesFromDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type PutFilesInDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type PutFilesInDatasetMutation = { __typename?: 'Mutation', putFilesInDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ReleaseFilesFromDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type ReleaseFilesFromDatasetMutation = { __typename?: 'Mutation', releaseFilesFromDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type RevertDatasetMutationVariables = Exact<{
  dataset: Scalars['ID']['input'];
  history: Scalars['ID']['input'];
}>;


export type RevertDatasetMutation = { __typename?: 'Mutation', revertDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null } };

export type CreateEraMutationVariables = Exact<{
  name: Scalars['String']['input'];
  begin?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type CreateEraMutation = { __typename?: 'Mutation', createEra: { __typename?: 'Era', id: string, begin?: any | null } };

export type From_File_LikeMutationVariables = Exact<{
  file: Scalars['FileLike']['input'];
  name: Scalars['String']['input'];
  origins?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
}>;


export type From_File_LikeMutation = { __typename?: 'Mutation', fromFileLike: { __typename?: 'File', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'BigFileStore', id: string, key: string, bucket: string, path: string } } };

export type RequestFileUploadMutationVariables = Exact<{
  key: Scalars['String']['input'];
  datalayer: Scalars['String']['input'];
}>;


export type RequestFileUploadMutation = { __typename?: 'Mutation', requestFileUpload: { __typename?: 'Credentials', accessKey: string, status: string, secretKey: string, bucket: string, key: string, sessionToken: string, store: string } };

export type RequestFileAccessMutationVariables = Exact<{
  store: Scalars['ID']['input'];
  duration?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RequestFileAccessMutation = { __typename?: 'Mutation', requestFileAccess: { __typename?: 'AccessCredentials', accessKey: string, secretKey: string, bucket: string, key: string, sessionToken: string, path: string } };

export type CreateFluorophoreMutationVariables = Exact<{
  name: Scalars['String']['input'];
  excitationWavelength?: InputMaybe<Scalars['Micrometers']['input']>;
  emissionWavelength?: InputMaybe<Scalars['Micrometers']['input']>;
}>;


export type CreateFluorophoreMutation = { __typename?: 'Mutation', createFluorophore: { __typename?: 'Fluorophore', id: string, name: string } };

export type AutoCreateFluorophoreMutationVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type AutoCreateFluorophoreMutation = { __typename?: 'Mutation', result: { __typename?: 'Fluorophore', value: string, label: string } };

export type EnsureFluorophoreMutationVariables = Exact<{
  name: Scalars['String']['input'];
  excitationWavelength?: InputMaybe<Scalars['Micrometers']['input']>;
  emissionWavelength?: InputMaybe<Scalars['Micrometers']['input']>;
}>;


export type EnsureFluorophoreMutation = { __typename?: 'Mutation', ensureFluorophore: { __typename?: 'Fluorophore', id: string, name: string } };

export type From_Array_LikeMutationVariables = Exact<{
  array: Scalars['ArrayLike']['input'];
  name: Scalars['String']['input'];
  origins?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  channelViews?: InputMaybe<Array<PartialChannelViewInput> | PartialChannelViewInput>;
  transformationViews?: InputMaybe<Array<PartialAffineTransformationViewInput> | PartialAffineTransformationViewInput>;
  labelViews?: InputMaybe<Array<PartialLabelViewInput> | PartialLabelViewInput>;
  timepointViews?: InputMaybe<Array<PartialTimepointViewInput> | PartialTimepointViewInput>;
  opticsViews?: InputMaybe<Array<PartialOpticsViewInput> | PartialOpticsViewInput>;
}>;


export type From_Array_LikeMutation = { __typename?: 'Mutation', fromArrayLike: { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, views: Array<{ __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null } | { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } } | { __typename?: 'ChannelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channel: { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null } } | { __typename?: 'ContinousScanView' } | { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Fluorophore', id: string, name: string, emissionWavelength?: any | null, excitationWavelength?: any | null } | null, primaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null, secondaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null } | { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null } | { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } | { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } } | { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, creator?: { __typename?: 'User', sub: string } | null, metrics: Array<{ __typename?: 'ImageIntMetric', id: string, value: number }>, roiOrigins: Array<{ __typename?: 'PathROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } } | { __typename?: 'RectangleROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } }>, fileOrigins: Array<{ __typename?: 'File', id: string, name: string }>, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }>, rois: Array<{ __typename?: 'PathROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } } | { __typename?: 'RectangleROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } }> } };

export type RequestUploadMutationVariables = Exact<{
  key: Scalars['String']['input'];
  datalayer: Scalars['String']['input'];
}>;


export type RequestUploadMutation = { __typename?: 'Mutation', requestUpload: { __typename?: 'Credentials', accessKey: string, status: string, secretKey: string, bucket: string, key: string, sessionToken: string, store: string } };

export type RequestAccessMutationVariables = Exact<{
  store: Scalars['ID']['input'];
  duration?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RequestAccessMutation = { __typename?: 'Mutation', requestAccess: { __typename?: 'AccessCredentials', accessKey: string, secretKey: string, bucket: string, key: string, sessionToken: string, path: string } };

export type PinImageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
}>;


export type PinImageMutation = { __typename?: 'Mutation', pinImage: { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, views: Array<{ __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null } | { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } } | { __typename?: 'ChannelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channel: { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null } } | { __typename?: 'ContinousScanView' } | { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Fluorophore', id: string, name: string, emissionWavelength?: any | null, excitationWavelength?: any | null } | null, primaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null, secondaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null } | { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null } | { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } | { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } } | { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, creator?: { __typename?: 'User', sub: string } | null, metrics: Array<{ __typename?: 'ImageIntMetric', id: string, value: number }>, roiOrigins: Array<{ __typename?: 'PathROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } } | { __typename?: 'RectangleROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } }>, fileOrigins: Array<{ __typename?: 'File', id: string, name: string }>, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }>, rois: Array<{ __typename?: 'PathROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } } | { __typename?: 'RectangleROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } }> } };

export type UpdateImageMutationVariables = Exact<{
  input: UpdateImageInput;
}>;


export type UpdateImageMutation = { __typename?: 'Mutation', updateImage: { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, views: Array<{ __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null } | { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } } | { __typename?: 'ChannelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channel: { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null } } | { __typename?: 'ContinousScanView' } | { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Fluorophore', id: string, name: string, emissionWavelength?: any | null, excitationWavelength?: any | null } | null, primaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null, secondaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null } | { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null } | { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } | { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } } | { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, creator?: { __typename?: 'User', sub: string } | null, metrics: Array<{ __typename?: 'ImageIntMetric', id: string, value: number }>, roiOrigins: Array<{ __typename?: 'PathROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } } | { __typename?: 'RectangleROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } }>, fileOrigins: Array<{ __typename?: 'File', id: string, name: string }>, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }>, rois: Array<{ __typename?: 'PathROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } } | { __typename?: 'RectangleROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } }> } };

export type CreateInstrumentMutationVariables = Exact<{
  serialNumber: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateInstrumentMutation = { __typename?: 'Mutation', createInstrument: { __typename?: 'Instrument', id: string, name: string } };

export type EnsureInstrumentMutationVariables = Exact<{
  serialNumber: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
}>;


export type EnsureInstrumentMutation = { __typename?: 'Mutation', ensureInstrument: { __typename?: 'Instrument', id: string, name: string } };

export type RequestMediaUploadMutationVariables = Exact<{
  key: Scalars['String']['input'];
  datalayer: Scalars['String']['input'];
}>;


export type RequestMediaUploadMutation = { __typename?: 'Mutation', requestMediaUpload: { __typename?: 'PresignedPostCredentials', xAmzAlgorithm: string, xAmzCredential: string, xAmzDate: string, xAmzSignature: string, key: string, bucket: string, datalayer: string, policy: string, store: string } };

export type CreateMultiWellPlateMutationVariables = Exact<{
  input: MultiWellPlateInput;
}>;


export type CreateMultiWellPlateMutation = { __typename?: 'Mutation', createMultiWellPlate: { __typename?: 'MultiWellPlate', id: string, name?: string | null, views: Array<{ __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }> } };

export type AutoCreateMultiWellPlateMutationVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type AutoCreateMultiWellPlateMutation = { __typename?: 'Mutation', result: { __typename?: 'MultiWellPlate', label?: string | null, value: string } };

export type CreateObjectiveMutationVariables = Exact<{
  serialNumber: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  na?: InputMaybe<Scalars['Float']['input']>;
  magnification?: InputMaybe<Scalars['Float']['input']>;
}>;


export type CreateObjectiveMutation = { __typename?: 'Mutation', createObjective: { __typename?: 'Objective', id: string, name: string } };

export type EnsureObjectiveMutationVariables = Exact<{
  serialNumber: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  na?: InputMaybe<Scalars['Float']['input']>;
  magnification?: InputMaybe<Scalars['Float']['input']>;
}>;


export type EnsureObjectiveMutation = { __typename?: 'Mutation', ensureObjective: { __typename?: 'Objective', id: string, name: string } };

export type CreateRgbContextMutationVariables = Exact<{
  input: CreateRgbContextInput;
}>;


export type CreateRgbContextMutation = { __typename?: 'Mutation', createRgbContext: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } };

export type UpdateRgbContextMutationVariables = Exact<{
  input: UpdateRgbContextInput;
}>;


export type UpdateRgbContextMutation = { __typename?: 'Mutation', updateRgbContext: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } };

export type CreateSnapshotMutationVariables = Exact<{
  image: Scalars['ID']['input'];
  file: Scalars['Upload']['input'];
}>;


export type CreateSnapshotMutation = { __typename?: 'Mutation', createSnapshot: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } };

export type CreateStageMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateStageMutation = { __typename?: 'Mutation', createStage: { __typename?: 'Stage', id: string, name: string } };

export type PinStageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
}>;


export type PinStageMutation = { __typename?: 'Mutation', pinStage: { __typename?: 'Stage', id: string, pinned: boolean, name: string, affineViews: Array<{ __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } }> } };

export type From_Parquet_LikeMutationVariables = Exact<{
  dataframe: Scalars['ParquetLike']['input'];
  name: Scalars['String']['input'];
  origins?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
}>;


export type From_Parquet_LikeMutation = { __typename?: 'Mutation', fromParquetLike: { __typename?: 'Table', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string } } };

export type RequestTableUploadMutationVariables = Exact<{
  key: Scalars['String']['input'];
  datalayer: Scalars['String']['input'];
}>;


export type RequestTableUploadMutation = { __typename?: 'Mutation', requestTableUpload: { __typename?: 'Credentials', accessKey: string, status: string, secretKey: string, bucket: string, key: string, sessionToken: string, store: string } };

export type RequestTableAccessMutationVariables = Exact<{
  store: Scalars['ID']['input'];
  duration?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RequestTableAccessMutation = { __typename?: 'Mutation', requestTableAccess: { __typename?: 'AccessCredentials', accessKey: string, secretKey: string, bucket: string, key: string, sessionToken: string, path: string } };

export type CreateAffineTransformationViewMutationVariables = Exact<{
  image: Scalars['ID']['input'];
  affineMatrix: Scalars['FourByFourMatrix']['input'];
  stage?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CreateAffineTransformationViewMutation = { __typename?: 'Mutation', createAffineTransformationView: { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } } };

export type DeleteAffineTransformationViewMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAffineTransformationViewMutation = { __typename?: 'Mutation', deleteAffineTransformationView: string };

export type DeleteRgbViewMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRgbViewMutation = { __typename?: 'Mutation', deleteRgbView: string };

export type DeleteChannelViewMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteChannelViewMutation = { __typename?: 'Mutation', deleteChannelView: string };

export type CreateRgbViewMutationVariables = Exact<{
  image: Scalars['ID']['input'];
  rScale: Scalars['Float']['input'];
  gScale: Scalars['Float']['input'];
  bScale: Scalars['Float']['input'];
  context?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CreateRgbViewMutation = { __typename?: 'Mutation', createRgbView: { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } };

export type CreateLabelViewMutationVariables = Exact<{
  image: Scalars['ID']['input'];
  fluorophore?: InputMaybe<Scalars['ID']['input']>;
  primaryAntibody?: InputMaybe<Scalars['ID']['input']>;
  secondaryAntibody?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CreateLabelViewMutation = { __typename?: 'Mutation', createLabelView: { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Fluorophore', id: string, name: string, emissionWavelength?: any | null, excitationWavelength?: any | null } | null, primaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null, secondaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null } };

export type CreateWellPositionViewMutationVariables = Exact<{
  input: WellPositionViewInput;
}>;


export type CreateWellPositionViewMutation = { __typename?: 'Mutation', createWellPositionView: { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null } };

export type CreateContinousScanViewMutationVariables = Exact<{
  input: ContinousScanViewInput;
}>;


export type CreateContinousScanViewMutation = { __typename?: 'Mutation', createContinousScanView: { __typename?: 'ContinousScanView', id: string, direction: ScanDirection, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } };

export type CreateViewCollectionMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateViewCollectionMutation = { __typename?: 'Mutation', createViewCollection: { __typename?: 'ViewCollection', id: string, name: string } };

export type GetCameraQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCameraQuery = { __typename?: 'Query', camera: { __typename?: 'Camera', sensorSizeX?: number | null, sensorSizeY?: number | null, pixelSizeX?: any | null, pixelSizeY?: any | null, name: string, serialNumber: string } };

export type GetDatasetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDatasetQuery = { __typename?: 'Query', dataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type GetDatasetsQueryVariables = Exact<{
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetDatasetsQuery = { __typename?: 'Query', datasets: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }> };

export type GetFileQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFileQuery = { __typename?: 'Query', file: { __typename?: 'File', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'BigFileStore', id: string, key: string, bucket: string, path: string } } };

export type GetFluorophoreQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFluorophoreQuery = { __typename?: 'Query', fluorophore: { __typename?: 'Fluorophore', id: string, name: string, emissionWavelength?: any | null, excitationWavelength?: any | null } };

export type GetFluorophoresQueryVariables = Exact<{
  filters?: InputMaybe<FluorophoreFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetFluorophoresQuery = { __typename?: 'Query', fluorophores: Array<{ __typename?: 'Fluorophore', id: string, name: string, emissionWavelength?: any | null, excitationWavelength?: any | null }> };

export type FluorophoreOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type FluorophoreOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Fluorophore', value: string, label: string }> };

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  noImages: Scalars['Boolean']['input'];
  noFiles: Scalars['Boolean']['input'];
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', images?: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files?: Array<{ __typename?: 'File', id: string, name: string }> };

export type ImagesQueryVariables = Exact<{ [key: string]: never; }>;


export type ImagesQuery = { __typename?: 'Query', images: Array<{ __typename?: 'Image', id: string }> };

export type GetImageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetImageQuery = { __typename?: 'Query', image: { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, views: Array<{ __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null } | { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } } | { __typename?: 'ChannelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channel: { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null } } | { __typename?: 'ContinousScanView' } | { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Fluorophore', id: string, name: string, emissionWavelength?: any | null, excitationWavelength?: any | null } | null, primaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null, secondaryAntibody?: { __typename?: 'Antibody', name: string, epitope?: string | null } | null } | { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null } | { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } | { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } } | { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue: string, newValue: string }> }>, creator?: { __typename?: 'User', sub: string } | null, metrics: Array<{ __typename?: 'ImageIntMetric', id: string, value: number }>, roiOrigins: Array<{ __typename?: 'PathROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } } | { __typename?: 'RectangleROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } }>, fileOrigins: Array<{ __typename?: 'File', id: string, name: string }>, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }>, rois: Array<{ __typename?: 'PathROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } } | { __typename?: 'RectangleROI', id: string, vectors: any, image: { __typename?: 'Image', id: string, name: string } }> } };

export type GetImagesQueryVariables = Exact<{
  filters?: InputMaybe<ImageFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetImagesQuery = { __typename?: 'Query', images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }> };

export type GetInstrumentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInstrumentQuery = { __typename?: 'Query', instrument: { __typename?: 'Instrument', model?: string | null, name: string, serialNumber: string } };

export type GetMultiWellPlateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMultiWellPlateQuery = { __typename?: 'Query', multiWellPlate: { __typename?: 'MultiWellPlate', id: string, name?: string | null, views: Array<{ __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }> } };

export type GetMultiWellPlatesQueryVariables = Exact<{
  filters?: InputMaybe<MultiWellPlateFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetMultiWellPlatesQuery = { __typename?: 'Query', multiWellPlates: Array<{ __typename?: 'MultiWellPlate', id: string, name?: string | null }> };

export type MultiWellPlateOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type MultiWellPlateOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'MultiWellPlate', value: string, label?: string | null }> };

export type GetObjectiveQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetObjectiveQuery = { __typename?: 'Query', objective: { __typename?: 'Objective', na?: number | null, name: string, serialNumber: string } };

export type RenderTreeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RenderTreeQuery = { __typename?: 'Query', renderTree: { __typename?: 'RenderTree', id: string, name: string, tree: { __typename?: 'Tree', children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'OverlayNode', kind: string, label?: string | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'SplitNode', kind: string }> } } };

export type RenderTreesQueryVariables = Exact<{
  filters?: InputMaybe<RenderTreeFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type RenderTreesQuery = { __typename?: 'Query', renderTrees: Array<{ __typename?: 'RenderTree', id: string, name: string }> };

export type GetRgbContextQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRgbContextQuery = { __typename?: 'Query', rgbcontext: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } };

export type GetRgbContextsQueryVariables = Exact<{
  filters?: InputMaybe<RgbContextFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetRgbContextsQuery = { __typename?: 'Query', rgbcontexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }> };

export type RgbContextOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type RgbContextOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'RGBContext', value: string, label: string }> };

export type GetStageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStageQuery = { __typename?: 'Query', stage: { __typename?: 'Stage', id: string, pinned: boolean, name: string, affineViews: Array<{ __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } }> } };

export type GetStagesQueryVariables = Exact<{
  filters?: InputMaybe<StageFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetStagesQuery = { __typename?: 'Query', stages: Array<{ __typename?: 'Stage', id: string, name: string }> };

export type StageOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type StageOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Stage', value: string, label: string }> };

export type GetTableQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTableQuery = { __typename?: 'Query', table: { __typename?: 'Table', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string } } };

export const CameraFragmentDoc = gql`
    fragment Camera on Camera {
  sensorSizeX
  sensorSizeY
  pixelSizeX
  pixelSizeY
  name
  serialNumber
}
    `;
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
export const HistoryFragmentDoc = gql`
    fragment History on History {
  id
  during
  kind
  user {
    sub
  }
  app {
    clientId
  }
  date
  effectiveChanges {
    field
    oldValue
    newValue
  }
}
    `;
export const ListImageFragmentDoc = gql`
    fragment ListImage on Image {
  latestSnapshot {
    id
    store {
      key
      presignedUrl
    }
  }
  id
  name
}
    `;
export const ListFileFragmentDoc = gql`
    fragment ListFile on File {
  id
  name
}
    `;
export const ListDatasetFragmentDoc = gql`
    fragment ListDataset on Dataset {
  id
  name
  description
  isDefault
}
    `;
export const DatasetFragmentDoc = gql`
    fragment Dataset on Dataset {
  id
  name
  description
  history {
    ...History
  }
  images {
    ...ListImage
  }
  files {
    ...ListFile
  }
  children {
    ...ListDataset
  }
  isDefault
  pinned
  createdAt
  creator {
    sub
  }
  tags
}
    ${HistoryFragmentDoc}
${ListImageFragmentDoc}
${ListFileFragmentDoc}
${ListDatasetFragmentDoc}`;
export const BigFileStoreFragmentDoc = gql`
    fragment BigFileStore on BigFileStore {
  id
  key
  bucket
  path
}
    `;
export const FileFragmentDoc = gql`
    fragment File on File {
  origins {
    id
  }
  id
  name
  store {
    ...BigFileStore
  }
}
    ${BigFileStoreFragmentDoc}`;
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
export const ViewFragmentDoc = gql`
    fragment View on View {
  xMin
  xMax
  yMin
  yMax
  tMin
  tMax
  cMin
  cMax
  zMin
  zMax
}
    `;
export const ChannelFragmentDoc = gql`
    fragment Channel on Channel {
  id
  name
  excitationWavelength
}
    `;
export const ChannelViewFragmentDoc = gql`
    fragment ChannelView on ChannelView {
  ...View
  id
  channel {
    ...Channel
  }
}
    ${ViewFragmentDoc}
${ChannelFragmentDoc}`;
export const AffineTransformationViewFragmentDoc = gql`
    fragment AffineTransformationView on AffineTransformationView {
  ...View
  id
  affineMatrix
  stage {
    id
    name
  }
}
    ${ViewFragmentDoc}`;
export const FluorophoreFragmentDoc = gql`
    fragment Fluorophore on Fluorophore {
  id
  name
  emissionWavelength
  excitationWavelength
}
    `;
export const AntibodyFragmentDoc = gql`
    fragment Antibody on Antibody {
  name
  epitope
}
    `;
export const LabelViewFragmentDoc = gql`
    fragment LabelView on LabelView {
  ...View
  id
  fluorophore {
    ...Fluorophore
  }
  primaryAntibody {
    ...Antibody
  }
  secondaryAntibody {
    ...Antibody
  }
}
    ${ViewFragmentDoc}
${FluorophoreFragmentDoc}
${AntibodyFragmentDoc}`;
export const EraFragmentDoc = gql`
    fragment Era on Era {
  id
  begin
  name
}
    `;
export const TimepointViewFragmentDoc = gql`
    fragment TimepointView on TimepointView {
  ...View
  id
  msSinceStart
  indexSinceStart
  era {
    ...Era
  }
}
    ${ViewFragmentDoc}
${EraFragmentDoc}`;
export const OpticsViewFragmentDoc = gql`
    fragment OpticsView on OpticsView {
  ...View
  id
  objective {
    id
    name
    serialNumber
  }
  camera {
    id
    name
    serialNumber
  }
  instrument {
    id
    name
    serialNumber
  }
}
    ${ViewFragmentDoc}`;
export const AcquisitionViewFragmentDoc = gql`
    fragment AcquisitionView on AcquisitionView {
  ...View
  id
  description
  acquiredAt
  operator {
    sub
  }
}
    ${ViewFragmentDoc}`;
export const RgbViewFragmentDoc = gql`
    fragment RGBView on RGBView {
  ...View
  id
  contexts {
    id
    name
  }
  name
  image {
    id
    store {
      ...ZarrStore
    }
  }
  colorMap
  contrastLimitMin
  contrastLimitMax
  gamma
  rescale
  active
  fullColour
}
    ${ViewFragmentDoc}
${ZarrStoreFragmentDoc}`;
export const WellPositionViewFragmentDoc = gql`
    fragment WellPositionView on WellPositionView {
  ...View
  id
  column
  row
  well {
    id
    rows
    columns
    name
  }
}
    ${ViewFragmentDoc}`;
export const SnapshotFragmentDoc = gql`
    fragment Snapshot on Snapshot {
  id
  store {
    key
    presignedUrl
  }
}
    `;
export const VideoFragmentDoc = gql`
    fragment Video on Video {
  id
  store {
    key
    presignedUrl
  }
}
    `;
export const ImageIntMetricFragmentDoc = gql`
    fragment ImageIntMetric on ImageIntMetric {
  id
  value
}
    `;
export const ImageMetricFragmentDoc = gql`
    fragment ImageMetric on ImageMetric {
  ...ImageIntMetric
}
    ${ImageIntMetricFragmentDoc}`;
export const ListRoiFragmentDoc = gql`
    fragment ListROI on ROI {
  id
  image {
    id
    name
  }
  vectors
}
    `;
export const ListRgbContextFragmentDoc = gql`
    fragment ListRGBContext on RGBContext {
  image {
    id
    store {
      ...ZarrStore
    }
  }
  id
  name
  views {
    ...RGBView
  }
  blending
  t
  z
  c
}
    ${ZarrStoreFragmentDoc}
${RgbViewFragmentDoc}`;
export const ImageFragmentDoc = gql`
    fragment Image on Image {
  origins {
    id
  }
  id
  name
  store {
    ...ZarrStore
  }
  views {
    ...ChannelView
    ...AffineTransformationView
    ...LabelView
    ...TimepointView
    ...OpticsView
    ...AcquisitionView
    ...RGBView
    ...WellPositionView
  }
  pinned
  renders {
    ...Snapshot
    ...Video
  }
  dataset {
    name
    id
  }
  createdAt
  history(pagination: {limit: 3}) {
    ...History
  }
  creator {
    sub
  }
  tags
  metrics {
    ...ImageMetric
  }
  roiOrigins {
    ...ListROI
  }
  fileOrigins {
    ...ListFile
  }
  rgbContexts {
    ...ListRGBContext
  }
  rois {
    ...ListROI
  }
}
    ${ZarrStoreFragmentDoc}
${ChannelViewFragmentDoc}
${AffineTransformationViewFragmentDoc}
${LabelViewFragmentDoc}
${TimepointViewFragmentDoc}
${OpticsViewFragmentDoc}
${AcquisitionViewFragmentDoc}
${RgbViewFragmentDoc}
${WellPositionViewFragmentDoc}
${SnapshotFragmentDoc}
${VideoFragmentDoc}
${HistoryFragmentDoc}
${ImageMetricFragmentDoc}
${ListRoiFragmentDoc}
${ListFileFragmentDoc}
${ListRgbContextFragmentDoc}`;
export const InstrumentFragmentDoc = gql`
    fragment Instrument on Instrument {
  model
  name
  serialNumber
}
    `;
export const MultiWellPlateFragmentDoc = gql`
    fragment MultiWellPlate on MultiWellPlate {
  id
  views {
    ...WellPositionView
  }
  name
}
    ${WellPositionViewFragmentDoc}`;
export const ListMultiWellPlateFragmentDoc = gql`
    fragment ListMultiWellPlate on MultiWellPlate {
  id
  name
}
    `;
export const ObjectiveFragmentDoc = gql`
    fragment Objective on Objective {
  na
  name
  serialNumber
}
    `;
export const RgbContextFragmentDoc = gql`
    fragment RGBContext on RGBContext {
  id
  views {
    ...RGBView
  }
  image {
    id
    store {
      ...ZarrStore
    }
  }
  pinned
  name
  z
  t
  c
  blending
}
    ${RgbViewFragmentDoc}
${ZarrStoreFragmentDoc}`;
export const ContextNodeFragmentDoc = gql`
    fragment ContextNode on ContextNode {
  label
  context {
    ...RGBContext
  }
}
    ${RgbContextFragmentDoc}`;
export const ContextNodeNestedFragmentDoc = gql`
    fragment ContextNodeNested on ContextNode {
  label
  context {
    ...RGBContext
  }
}
    ${RgbContextFragmentDoc}`;
export const GridNodeNestedFragmentDoc = gql`
    fragment GridNodeNested on GridNode {
  label
  gap
}
    `;
export const OverlayNodeNestedFragmentDoc = gql`
    fragment OverlayNodeNested on OverlayNode {
  label
}
    `;
export const RenderNodeNestedFragmentDoc = gql`
    fragment RenderNodeNested on RenderNode {
  kind
  ...ContextNodeNested
  ...GridNodeNested
  ...OverlayNodeNested
}
    ${ContextNodeNestedFragmentDoc}
${GridNodeNestedFragmentDoc}
${OverlayNodeNestedFragmentDoc}`;
export const GridNodeFragmentDoc = gql`
    fragment GridNode on GridNode {
  label
  gap
  children {
    ...RenderNodeNested
  }
}
    ${RenderNodeNestedFragmentDoc}`;
export const OverlayNodeFragmentDoc = gql`
    fragment OverlayNode on OverlayNode {
  label
  children {
    ...RenderNodeNested
  }
}
    ${RenderNodeNestedFragmentDoc}`;
export const RenderNodeFragmentDoc = gql`
    fragment RenderNode on RenderNode {
  kind
  ...ContextNode
  ...GridNode
  ...OverlayNode
}
    ${ContextNodeFragmentDoc}
${GridNodeFragmentDoc}
${OverlayNodeFragmentDoc}`;
export const TreeFragmentDoc = gql`
    fragment Tree on Tree {
  children {
    ...RenderNode
  }
}
    ${RenderNodeFragmentDoc}`;
export const RenderTreeFragmentDoc = gql`
    fragment RenderTree on RenderTree {
  id
  name
  tree {
    ...Tree
  }
}
    ${TreeFragmentDoc}`;
export const ListRenderTreeFragmentDoc = gql`
    fragment ListRenderTree on RenderTree {
  id
  name
}
    `;
export const StageFragmentDoc = gql`
    fragment Stage on Stage {
  id
  affineViews {
    ...AffineTransformationView
  }
  pinned
  name
}
    ${AffineTransformationViewFragmentDoc}`;
export const ListStageFragmentDoc = gql`
    fragment ListStage on Stage {
  id
  name
}
    `;
export const ParquetStoreFragmentDoc = gql`
    fragment ParquetStore on ParquetStore {
  id
  key
  bucket
  path
}
    `;
export const TableFragmentDoc = gql`
    fragment Table on Table {
  origins {
    id
  }
  id
  name
  store {
    ...ParquetStore
  }
}
    ${ParquetStoreFragmentDoc}`;
export const ContinousScanViewFragmentDoc = gql`
    fragment ContinousScanView on ContinousScanView {
  ...View
  id
  direction
}
    ${ViewFragmentDoc}`;
export const CreateAntibodyDocument = gql`
    mutation CreateAntibody($name: String!, $epitope: String) {
  createAntibody(input: {name: $name, epitope: $epitope}) {
    id
    name
  }
}
    `;
export type CreateAntibodyMutationFn = Apollo.MutationFunction<CreateAntibodyMutation, CreateAntibodyMutationVariables>;

/**
 * __useCreateAntibodyMutation__
 *
 * To run a mutation, you first call `useCreateAntibodyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAntibodyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAntibodyMutation, { data, loading, error }] = useCreateAntibodyMutation({
 *   variables: {
 *      name: // value for 'name'
 *      epitope: // value for 'epitope'
 *   },
 * });
 */
export function useCreateAntibodyMutation(baseOptions?: Apollo.MutationHookOptions<CreateAntibodyMutation, CreateAntibodyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAntibodyMutation, CreateAntibodyMutationVariables>(CreateAntibodyDocument, options);
      }
export type CreateAntibodyMutationHookResult = ReturnType<typeof useCreateAntibodyMutation>;
export type CreateAntibodyMutationResult = Apollo.MutationResult<CreateAntibodyMutation>;
export type CreateAntibodyMutationOptions = Apollo.BaseMutationOptions<CreateAntibodyMutation, CreateAntibodyMutationVariables>;
export const EnsureAntibodyDocument = gql`
    mutation EnsureAntibody($name: String!, $epitope: String) {
  ensureAntibody(input: {name: $name, epitope: $epitope}) {
    id
    name
  }
}
    `;
export type EnsureAntibodyMutationFn = Apollo.MutationFunction<EnsureAntibodyMutation, EnsureAntibodyMutationVariables>;

/**
 * __useEnsureAntibodyMutation__
 *
 * To run a mutation, you first call `useEnsureAntibodyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnsureAntibodyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ensureAntibodyMutation, { data, loading, error }] = useEnsureAntibodyMutation({
 *   variables: {
 *      name: // value for 'name'
 *      epitope: // value for 'epitope'
 *   },
 * });
 */
export function useEnsureAntibodyMutation(baseOptions?: Apollo.MutationHookOptions<EnsureAntibodyMutation, EnsureAntibodyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnsureAntibodyMutation, EnsureAntibodyMutationVariables>(EnsureAntibodyDocument, options);
      }
export type EnsureAntibodyMutationHookResult = ReturnType<typeof useEnsureAntibodyMutation>;
export type EnsureAntibodyMutationResult = Apollo.MutationResult<EnsureAntibodyMutation>;
export type EnsureAntibodyMutationOptions = Apollo.BaseMutationOptions<EnsureAntibodyMutation, EnsureAntibodyMutationVariables>;
export const CreateCameraDocument = gql`
    mutation CreateCamera($serialNumber: String!, $name: String, $pixelSizeX: Micrometers, $pixelSizeY: Micrometers, $sensorSizeX: Int, $sensorSizeY: Int) {
  createCamera(
    input: {name: $name, pixelSizeX: $pixelSizeX, serialNumber: $serialNumber, pixelSizeY: $pixelSizeY, sensorSizeX: $sensorSizeX, sensorSizeY: $sensorSizeY}
  ) {
    id
    name
  }
}
    `;
export type CreateCameraMutationFn = Apollo.MutationFunction<CreateCameraMutation, CreateCameraMutationVariables>;

/**
 * __useCreateCameraMutation__
 *
 * To run a mutation, you first call `useCreateCameraMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCameraMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCameraMutation, { data, loading, error }] = useCreateCameraMutation({
 *   variables: {
 *      serialNumber: // value for 'serialNumber'
 *      name: // value for 'name'
 *      pixelSizeX: // value for 'pixelSizeX'
 *      pixelSizeY: // value for 'pixelSizeY'
 *      sensorSizeX: // value for 'sensorSizeX'
 *      sensorSizeY: // value for 'sensorSizeY'
 *   },
 * });
 */
export function useCreateCameraMutation(baseOptions?: Apollo.MutationHookOptions<CreateCameraMutation, CreateCameraMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCameraMutation, CreateCameraMutationVariables>(CreateCameraDocument, options);
      }
export type CreateCameraMutationHookResult = ReturnType<typeof useCreateCameraMutation>;
export type CreateCameraMutationResult = Apollo.MutationResult<CreateCameraMutation>;
export type CreateCameraMutationOptions = Apollo.BaseMutationOptions<CreateCameraMutation, CreateCameraMutationVariables>;
export const EnsureCameraDocument = gql`
    mutation EnsureCamera($serialNumber: String!, $name: String, $pixelSizeX: Micrometers, $pixelSizeY: Micrometers, $sensorSizeX: Int, $sensorSizeY: Int) {
  ensureCamera(
    input: {name: $name, pixelSizeX: $pixelSizeX, serialNumber: $serialNumber, pixelSizeY: $pixelSizeY, sensorSizeX: $sensorSizeX, sensorSizeY: $sensorSizeY}
  ) {
    id
    name
  }
}
    `;
export type EnsureCameraMutationFn = Apollo.MutationFunction<EnsureCameraMutation, EnsureCameraMutationVariables>;

/**
 * __useEnsureCameraMutation__
 *
 * To run a mutation, you first call `useEnsureCameraMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnsureCameraMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ensureCameraMutation, { data, loading, error }] = useEnsureCameraMutation({
 *   variables: {
 *      serialNumber: // value for 'serialNumber'
 *      name: // value for 'name'
 *      pixelSizeX: // value for 'pixelSizeX'
 *      pixelSizeY: // value for 'pixelSizeY'
 *      sensorSizeX: // value for 'sensorSizeX'
 *      sensorSizeY: // value for 'sensorSizeY'
 *   },
 * });
 */
export function useEnsureCameraMutation(baseOptions?: Apollo.MutationHookOptions<EnsureCameraMutation, EnsureCameraMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnsureCameraMutation, EnsureCameraMutationVariables>(EnsureCameraDocument, options);
      }
export type EnsureCameraMutationHookResult = ReturnType<typeof useEnsureCameraMutation>;
export type EnsureCameraMutationResult = Apollo.MutationResult<EnsureCameraMutation>;
export type EnsureCameraMutationOptions = Apollo.BaseMutationOptions<EnsureCameraMutation, EnsureCameraMutationVariables>;
export const CreateChannelDocument = gql`
    mutation CreateChannel($name: String!) {
  createChannel(input: {name: $name}) {
    id
    name
  }
}
    `;
export type CreateChannelMutationFn = Apollo.MutationFunction<CreateChannelMutation, CreateChannelMutationVariables>;

/**
 * __useCreateChannelMutation__
 *
 * To run a mutation, you first call `useCreateChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChannelMutation, { data, loading, error }] = useCreateChannelMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateChannelMutation(baseOptions?: Apollo.MutationHookOptions<CreateChannelMutation, CreateChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChannelMutation, CreateChannelMutationVariables>(CreateChannelDocument, options);
      }
export type CreateChannelMutationHookResult = ReturnType<typeof useCreateChannelMutation>;
export type CreateChannelMutationResult = Apollo.MutationResult<CreateChannelMutation>;
export type CreateChannelMutationOptions = Apollo.BaseMutationOptions<CreateChannelMutation, CreateChannelMutationVariables>;
export const EnsureChannelDocument = gql`
    mutation EnsureChannel($name: String!) {
  ensureChannel(input: {name: $name}) {
    id
    name
  }
}
    `;
export type EnsureChannelMutationFn = Apollo.MutationFunction<EnsureChannelMutation, EnsureChannelMutationVariables>;

/**
 * __useEnsureChannelMutation__
 *
 * To run a mutation, you first call `useEnsureChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnsureChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ensureChannelMutation, { data, loading, error }] = useEnsureChannelMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useEnsureChannelMutation(baseOptions?: Apollo.MutationHookOptions<EnsureChannelMutation, EnsureChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnsureChannelMutation, EnsureChannelMutationVariables>(EnsureChannelDocument, options);
      }
export type EnsureChannelMutationHookResult = ReturnType<typeof useEnsureChannelMutation>;
export type EnsureChannelMutationResult = Apollo.MutationResult<EnsureChannelMutation>;
export type EnsureChannelMutationOptions = Apollo.BaseMutationOptions<EnsureChannelMutation, EnsureChannelMutationVariables>;
export const CreateDatasetDocument = gql`
    mutation CreateDataset($name: String!) {
  createDataset(input: {name: $name}) {
    id
    name
  }
}
    `;
export type CreateDatasetMutationFn = Apollo.MutationFunction<CreateDatasetMutation, CreateDatasetMutationVariables>;

/**
 * __useCreateDatasetMutation__
 *
 * To run a mutation, you first call `useCreateDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDatasetMutation, { data, loading, error }] = useCreateDatasetMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateDatasetMutation(baseOptions?: Apollo.MutationHookOptions<CreateDatasetMutation, CreateDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDatasetMutation, CreateDatasetMutationVariables>(CreateDatasetDocument, options);
      }
export type CreateDatasetMutationHookResult = ReturnType<typeof useCreateDatasetMutation>;
export type CreateDatasetMutationResult = Apollo.MutationResult<CreateDatasetMutation>;
export type CreateDatasetMutationOptions = Apollo.BaseMutationOptions<CreateDatasetMutation, CreateDatasetMutationVariables>;
export const UpdateDatasetDocument = gql`
    mutation UpdateDataset($id: ID!, $name: String!) {
  updateDataset(input: {id: $id, name: $name}) {
    id
    name
  }
}
    `;
export type UpdateDatasetMutationFn = Apollo.MutationFunction<UpdateDatasetMutation, UpdateDatasetMutationVariables>;

/**
 * __useUpdateDatasetMutation__
 *
 * To run a mutation, you first call `useUpdateDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDatasetMutation, { data, loading, error }] = useUpdateDatasetMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateDatasetMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDatasetMutation, UpdateDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDatasetMutation, UpdateDatasetMutationVariables>(UpdateDatasetDocument, options);
      }
export type UpdateDatasetMutationHookResult = ReturnType<typeof useUpdateDatasetMutation>;
export type UpdateDatasetMutationResult = Apollo.MutationResult<UpdateDatasetMutation>;
export type UpdateDatasetMutationOptions = Apollo.BaseMutationOptions<UpdateDatasetMutation, UpdateDatasetMutationVariables>;
export const PinDatasetDocument = gql`
    mutation PinDataset($id: ID!, $pin: Boolean!) {
  pinDataset(input: {id: $id, pin: $pin}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export type PinDatasetMutationFn = Apollo.MutationFunction<PinDatasetMutation, PinDatasetMutationVariables>;

/**
 * __usePinDatasetMutation__
 *
 * To run a mutation, you first call `usePinDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinDatasetMutation, { data, loading, error }] = usePinDatasetMutation({
 *   variables: {
 *      id: // value for 'id'
 *      pin: // value for 'pin'
 *   },
 * });
 */
export function usePinDatasetMutation(baseOptions?: Apollo.MutationHookOptions<PinDatasetMutation, PinDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PinDatasetMutation, PinDatasetMutationVariables>(PinDatasetDocument, options);
      }
export type PinDatasetMutationHookResult = ReturnType<typeof usePinDatasetMutation>;
export type PinDatasetMutationResult = Apollo.MutationResult<PinDatasetMutation>;
export type PinDatasetMutationOptions = Apollo.BaseMutationOptions<PinDatasetMutation, PinDatasetMutationVariables>;
export const PutDatasetsInDatasetDocument = gql`
    mutation PutDatasetsInDataset($selfs: [ID!]!, $other: ID!) {
  putDatasetsInDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export type PutDatasetsInDatasetMutationFn = Apollo.MutationFunction<PutDatasetsInDatasetMutation, PutDatasetsInDatasetMutationVariables>;

/**
 * __usePutDatasetsInDatasetMutation__
 *
 * To run a mutation, you first call `usePutDatasetsInDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePutDatasetsInDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [putDatasetsInDatasetMutation, { data, loading, error }] = usePutDatasetsInDatasetMutation({
 *   variables: {
 *      selfs: // value for 'selfs'
 *      other: // value for 'other'
 *   },
 * });
 */
export function usePutDatasetsInDatasetMutation(baseOptions?: Apollo.MutationHookOptions<PutDatasetsInDatasetMutation, PutDatasetsInDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PutDatasetsInDatasetMutation, PutDatasetsInDatasetMutationVariables>(PutDatasetsInDatasetDocument, options);
      }
export type PutDatasetsInDatasetMutationHookResult = ReturnType<typeof usePutDatasetsInDatasetMutation>;
export type PutDatasetsInDatasetMutationResult = Apollo.MutationResult<PutDatasetsInDatasetMutation>;
export type PutDatasetsInDatasetMutationOptions = Apollo.BaseMutationOptions<PutDatasetsInDatasetMutation, PutDatasetsInDatasetMutationVariables>;
export const ReleaseDatasetsFromDatasetDocument = gql`
    mutation ReleaseDatasetsFromDataset($selfs: [ID!]!, $other: ID!) {
  releaseDatasetsFromDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export type ReleaseDatasetsFromDatasetMutationFn = Apollo.MutationFunction<ReleaseDatasetsFromDatasetMutation, ReleaseDatasetsFromDatasetMutationVariables>;

/**
 * __useReleaseDatasetsFromDatasetMutation__
 *
 * To run a mutation, you first call `useReleaseDatasetsFromDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReleaseDatasetsFromDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [releaseDatasetsFromDatasetMutation, { data, loading, error }] = useReleaseDatasetsFromDatasetMutation({
 *   variables: {
 *      selfs: // value for 'selfs'
 *      other: // value for 'other'
 *   },
 * });
 */
export function useReleaseDatasetsFromDatasetMutation(baseOptions?: Apollo.MutationHookOptions<ReleaseDatasetsFromDatasetMutation, ReleaseDatasetsFromDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReleaseDatasetsFromDatasetMutation, ReleaseDatasetsFromDatasetMutationVariables>(ReleaseDatasetsFromDatasetDocument, options);
      }
export type ReleaseDatasetsFromDatasetMutationHookResult = ReturnType<typeof useReleaseDatasetsFromDatasetMutation>;
export type ReleaseDatasetsFromDatasetMutationResult = Apollo.MutationResult<ReleaseDatasetsFromDatasetMutation>;
export type ReleaseDatasetsFromDatasetMutationOptions = Apollo.BaseMutationOptions<ReleaseDatasetsFromDatasetMutation, ReleaseDatasetsFromDatasetMutationVariables>;
export const PutImagesInDatasetDocument = gql`
    mutation PutImagesInDataset($selfs: [ID!]!, $other: ID!) {
  putImagesInDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export type PutImagesInDatasetMutationFn = Apollo.MutationFunction<PutImagesInDatasetMutation, PutImagesInDatasetMutationVariables>;

/**
 * __usePutImagesInDatasetMutation__
 *
 * To run a mutation, you first call `usePutImagesInDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePutImagesInDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [putImagesInDatasetMutation, { data, loading, error }] = usePutImagesInDatasetMutation({
 *   variables: {
 *      selfs: // value for 'selfs'
 *      other: // value for 'other'
 *   },
 * });
 */
export function usePutImagesInDatasetMutation(baseOptions?: Apollo.MutationHookOptions<PutImagesInDatasetMutation, PutImagesInDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PutImagesInDatasetMutation, PutImagesInDatasetMutationVariables>(PutImagesInDatasetDocument, options);
      }
export type PutImagesInDatasetMutationHookResult = ReturnType<typeof usePutImagesInDatasetMutation>;
export type PutImagesInDatasetMutationResult = Apollo.MutationResult<PutImagesInDatasetMutation>;
export type PutImagesInDatasetMutationOptions = Apollo.BaseMutationOptions<PutImagesInDatasetMutation, PutImagesInDatasetMutationVariables>;
export const ReleaseImagesFromDatasetDocument = gql`
    mutation ReleaseImagesFromDataset($selfs: [ID!]!, $other: ID!) {
  releaseImagesFromDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export type ReleaseImagesFromDatasetMutationFn = Apollo.MutationFunction<ReleaseImagesFromDatasetMutation, ReleaseImagesFromDatasetMutationVariables>;

/**
 * __useReleaseImagesFromDatasetMutation__
 *
 * To run a mutation, you first call `useReleaseImagesFromDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReleaseImagesFromDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [releaseImagesFromDatasetMutation, { data, loading, error }] = useReleaseImagesFromDatasetMutation({
 *   variables: {
 *      selfs: // value for 'selfs'
 *      other: // value for 'other'
 *   },
 * });
 */
export function useReleaseImagesFromDatasetMutation(baseOptions?: Apollo.MutationHookOptions<ReleaseImagesFromDatasetMutation, ReleaseImagesFromDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReleaseImagesFromDatasetMutation, ReleaseImagesFromDatasetMutationVariables>(ReleaseImagesFromDatasetDocument, options);
      }
export type ReleaseImagesFromDatasetMutationHookResult = ReturnType<typeof useReleaseImagesFromDatasetMutation>;
export type ReleaseImagesFromDatasetMutationResult = Apollo.MutationResult<ReleaseImagesFromDatasetMutation>;
export type ReleaseImagesFromDatasetMutationOptions = Apollo.BaseMutationOptions<ReleaseImagesFromDatasetMutation, ReleaseImagesFromDatasetMutationVariables>;
export const PutFilesInDatasetDocument = gql`
    mutation PutFilesInDataset($selfs: [ID!]!, $other: ID!) {
  putFilesInDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export type PutFilesInDatasetMutationFn = Apollo.MutationFunction<PutFilesInDatasetMutation, PutFilesInDatasetMutationVariables>;

/**
 * __usePutFilesInDatasetMutation__
 *
 * To run a mutation, you first call `usePutFilesInDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePutFilesInDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [putFilesInDatasetMutation, { data, loading, error }] = usePutFilesInDatasetMutation({
 *   variables: {
 *      selfs: // value for 'selfs'
 *      other: // value for 'other'
 *   },
 * });
 */
export function usePutFilesInDatasetMutation(baseOptions?: Apollo.MutationHookOptions<PutFilesInDatasetMutation, PutFilesInDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PutFilesInDatasetMutation, PutFilesInDatasetMutationVariables>(PutFilesInDatasetDocument, options);
      }
export type PutFilesInDatasetMutationHookResult = ReturnType<typeof usePutFilesInDatasetMutation>;
export type PutFilesInDatasetMutationResult = Apollo.MutationResult<PutFilesInDatasetMutation>;
export type PutFilesInDatasetMutationOptions = Apollo.BaseMutationOptions<PutFilesInDatasetMutation, PutFilesInDatasetMutationVariables>;
export const ReleaseFilesFromDatasetDocument = gql`
    mutation ReleaseFilesFromDataset($selfs: [ID!]!, $other: ID!) {
  releaseFilesFromDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export type ReleaseFilesFromDatasetMutationFn = Apollo.MutationFunction<ReleaseFilesFromDatasetMutation, ReleaseFilesFromDatasetMutationVariables>;

/**
 * __useReleaseFilesFromDatasetMutation__
 *
 * To run a mutation, you first call `useReleaseFilesFromDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReleaseFilesFromDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [releaseFilesFromDatasetMutation, { data, loading, error }] = useReleaseFilesFromDatasetMutation({
 *   variables: {
 *      selfs: // value for 'selfs'
 *      other: // value for 'other'
 *   },
 * });
 */
export function useReleaseFilesFromDatasetMutation(baseOptions?: Apollo.MutationHookOptions<ReleaseFilesFromDatasetMutation, ReleaseFilesFromDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReleaseFilesFromDatasetMutation, ReleaseFilesFromDatasetMutationVariables>(ReleaseFilesFromDatasetDocument, options);
      }
export type ReleaseFilesFromDatasetMutationHookResult = ReturnType<typeof useReleaseFilesFromDatasetMutation>;
export type ReleaseFilesFromDatasetMutationResult = Apollo.MutationResult<ReleaseFilesFromDatasetMutation>;
export type ReleaseFilesFromDatasetMutationOptions = Apollo.BaseMutationOptions<ReleaseFilesFromDatasetMutation, ReleaseFilesFromDatasetMutationVariables>;
export const RevertDatasetDocument = gql`
    mutation RevertDataset($dataset: ID!, $history: ID!) {
  revertDataset(input: {id: $dataset, historyId: $history}) {
    id
    name
    description
  }
}
    `;
export type RevertDatasetMutationFn = Apollo.MutationFunction<RevertDatasetMutation, RevertDatasetMutationVariables>;

/**
 * __useRevertDatasetMutation__
 *
 * To run a mutation, you first call `useRevertDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevertDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revertDatasetMutation, { data, loading, error }] = useRevertDatasetMutation({
 *   variables: {
 *      dataset: // value for 'dataset'
 *      history: // value for 'history'
 *   },
 * });
 */
export function useRevertDatasetMutation(baseOptions?: Apollo.MutationHookOptions<RevertDatasetMutation, RevertDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RevertDatasetMutation, RevertDatasetMutationVariables>(RevertDatasetDocument, options);
      }
export type RevertDatasetMutationHookResult = ReturnType<typeof useRevertDatasetMutation>;
export type RevertDatasetMutationResult = Apollo.MutationResult<RevertDatasetMutation>;
export type RevertDatasetMutationOptions = Apollo.BaseMutationOptions<RevertDatasetMutation, RevertDatasetMutationVariables>;
export const CreateEraDocument = gql`
    mutation CreateEra($name: String!, $begin: DateTime) {
  createEra(input: {name: $name, begin: $begin}) {
    id
    begin
  }
}
    `;
export type CreateEraMutationFn = Apollo.MutationFunction<CreateEraMutation, CreateEraMutationVariables>;

/**
 * __useCreateEraMutation__
 *
 * To run a mutation, you first call `useCreateEraMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEraMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEraMutation, { data, loading, error }] = useCreateEraMutation({
 *   variables: {
 *      name: // value for 'name'
 *      begin: // value for 'begin'
 *   },
 * });
 */
export function useCreateEraMutation(baseOptions?: Apollo.MutationHookOptions<CreateEraMutation, CreateEraMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEraMutation, CreateEraMutationVariables>(CreateEraDocument, options);
      }
export type CreateEraMutationHookResult = ReturnType<typeof useCreateEraMutation>;
export type CreateEraMutationResult = Apollo.MutationResult<CreateEraMutation>;
export type CreateEraMutationOptions = Apollo.BaseMutationOptions<CreateEraMutation, CreateEraMutationVariables>;
export const From_File_LikeDocument = gql`
    mutation from_file_like($file: FileLike!, $name: String!, $origins: [ID!], $dataset: ID) {
  fromFileLike(
    input: {file: $file, name: $name, origins: $origins, dataset: $dataset}
  ) {
    ...File
  }
}
    ${FileFragmentDoc}`;
export type From_File_LikeMutationFn = Apollo.MutationFunction<From_File_LikeMutation, From_File_LikeMutationVariables>;

/**
 * __useFrom_File_LikeMutation__
 *
 * To run a mutation, you first call `useFrom_File_LikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFrom_File_LikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fromFileLikeMutation, { data, loading, error }] = useFrom_File_LikeMutation({
 *   variables: {
 *      file: // value for 'file'
 *      name: // value for 'name'
 *      origins: // value for 'origins'
 *      dataset: // value for 'dataset'
 *   },
 * });
 */
export function useFrom_File_LikeMutation(baseOptions?: Apollo.MutationHookOptions<From_File_LikeMutation, From_File_LikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<From_File_LikeMutation, From_File_LikeMutationVariables>(From_File_LikeDocument, options);
      }
export type From_File_LikeMutationHookResult = ReturnType<typeof useFrom_File_LikeMutation>;
export type From_File_LikeMutationResult = Apollo.MutationResult<From_File_LikeMutation>;
export type From_File_LikeMutationOptions = Apollo.BaseMutationOptions<From_File_LikeMutation, From_File_LikeMutationVariables>;
export const RequestFileUploadDocument = gql`
    mutation RequestFileUpload($key: String!, $datalayer: String!) {
  requestFileUpload(input: {key: $key, datalayer: $datalayer}) {
    ...Credentials
  }
}
    ${CredentialsFragmentDoc}`;
export type RequestFileUploadMutationFn = Apollo.MutationFunction<RequestFileUploadMutation, RequestFileUploadMutationVariables>;

/**
 * __useRequestFileUploadMutation__
 *
 * To run a mutation, you first call `useRequestFileUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestFileUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestFileUploadMutation, { data, loading, error }] = useRequestFileUploadMutation({
 *   variables: {
 *      key: // value for 'key'
 *      datalayer: // value for 'datalayer'
 *   },
 * });
 */
export function useRequestFileUploadMutation(baseOptions?: Apollo.MutationHookOptions<RequestFileUploadMutation, RequestFileUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestFileUploadMutation, RequestFileUploadMutationVariables>(RequestFileUploadDocument, options);
      }
export type RequestFileUploadMutationHookResult = ReturnType<typeof useRequestFileUploadMutation>;
export type RequestFileUploadMutationResult = Apollo.MutationResult<RequestFileUploadMutation>;
export type RequestFileUploadMutationOptions = Apollo.BaseMutationOptions<RequestFileUploadMutation, RequestFileUploadMutationVariables>;
export const RequestFileAccessDocument = gql`
    mutation RequestFileAccess($store: ID!, $duration: Int) {
  requestFileAccess(input: {store: $store, duration: $duration}) {
    ...AccessCredentials
  }
}
    ${AccessCredentialsFragmentDoc}`;
export type RequestFileAccessMutationFn = Apollo.MutationFunction<RequestFileAccessMutation, RequestFileAccessMutationVariables>;

/**
 * __useRequestFileAccessMutation__
 *
 * To run a mutation, you first call `useRequestFileAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestFileAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestFileAccessMutation, { data, loading, error }] = useRequestFileAccessMutation({
 *   variables: {
 *      store: // value for 'store'
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useRequestFileAccessMutation(baseOptions?: Apollo.MutationHookOptions<RequestFileAccessMutation, RequestFileAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestFileAccessMutation, RequestFileAccessMutationVariables>(RequestFileAccessDocument, options);
      }
export type RequestFileAccessMutationHookResult = ReturnType<typeof useRequestFileAccessMutation>;
export type RequestFileAccessMutationResult = Apollo.MutationResult<RequestFileAccessMutation>;
export type RequestFileAccessMutationOptions = Apollo.BaseMutationOptions<RequestFileAccessMutation, RequestFileAccessMutationVariables>;
export const CreateFluorophoreDocument = gql`
    mutation CreateFluorophore($name: String!, $excitationWavelength: Micrometers, $emissionWavelength: Micrometers) {
  createFluorophore(
    input: {name: $name, excitationWavelength: $excitationWavelength, emissionWavelength: $emissionWavelength}
  ) {
    id
    name
  }
}
    `;
export type CreateFluorophoreMutationFn = Apollo.MutationFunction<CreateFluorophoreMutation, CreateFluorophoreMutationVariables>;

/**
 * __useCreateFluorophoreMutation__
 *
 * To run a mutation, you first call `useCreateFluorophoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFluorophoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFluorophoreMutation, { data, loading, error }] = useCreateFluorophoreMutation({
 *   variables: {
 *      name: // value for 'name'
 *      excitationWavelength: // value for 'excitationWavelength'
 *      emissionWavelength: // value for 'emissionWavelength'
 *   },
 * });
 */
export function useCreateFluorophoreMutation(baseOptions?: Apollo.MutationHookOptions<CreateFluorophoreMutation, CreateFluorophoreMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFluorophoreMutation, CreateFluorophoreMutationVariables>(CreateFluorophoreDocument, options);
      }
export type CreateFluorophoreMutationHookResult = ReturnType<typeof useCreateFluorophoreMutation>;
export type CreateFluorophoreMutationResult = Apollo.MutationResult<CreateFluorophoreMutation>;
export type CreateFluorophoreMutationOptions = Apollo.BaseMutationOptions<CreateFluorophoreMutation, CreateFluorophoreMutationVariables>;
export const AutoCreateFluorophoreDocument = gql`
    mutation AutoCreateFluorophore($input: String!) {
  result: createFluorophore(input: {name: $input}) {
    value: id
    label: name
  }
}
    `;
export type AutoCreateFluorophoreMutationFn = Apollo.MutationFunction<AutoCreateFluorophoreMutation, AutoCreateFluorophoreMutationVariables>;

/**
 * __useAutoCreateFluorophoreMutation__
 *
 * To run a mutation, you first call `useAutoCreateFluorophoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAutoCreateFluorophoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [autoCreateFluorophoreMutation, { data, loading, error }] = useAutoCreateFluorophoreMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAutoCreateFluorophoreMutation(baseOptions?: Apollo.MutationHookOptions<AutoCreateFluorophoreMutation, AutoCreateFluorophoreMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AutoCreateFluorophoreMutation, AutoCreateFluorophoreMutationVariables>(AutoCreateFluorophoreDocument, options);
      }
export type AutoCreateFluorophoreMutationHookResult = ReturnType<typeof useAutoCreateFluorophoreMutation>;
export type AutoCreateFluorophoreMutationResult = Apollo.MutationResult<AutoCreateFluorophoreMutation>;
export type AutoCreateFluorophoreMutationOptions = Apollo.BaseMutationOptions<AutoCreateFluorophoreMutation, AutoCreateFluorophoreMutationVariables>;
export const EnsureFluorophoreDocument = gql`
    mutation EnsureFluorophore($name: String!, $excitationWavelength: Micrometers, $emissionWavelength: Micrometers) {
  ensureFluorophore(
    input: {name: $name, excitationWavelength: $excitationWavelength, emissionWavelength: $emissionWavelength}
  ) {
    id
    name
  }
}
    `;
export type EnsureFluorophoreMutationFn = Apollo.MutationFunction<EnsureFluorophoreMutation, EnsureFluorophoreMutationVariables>;

/**
 * __useEnsureFluorophoreMutation__
 *
 * To run a mutation, you first call `useEnsureFluorophoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnsureFluorophoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ensureFluorophoreMutation, { data, loading, error }] = useEnsureFluorophoreMutation({
 *   variables: {
 *      name: // value for 'name'
 *      excitationWavelength: // value for 'excitationWavelength'
 *      emissionWavelength: // value for 'emissionWavelength'
 *   },
 * });
 */
export function useEnsureFluorophoreMutation(baseOptions?: Apollo.MutationHookOptions<EnsureFluorophoreMutation, EnsureFluorophoreMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnsureFluorophoreMutation, EnsureFluorophoreMutationVariables>(EnsureFluorophoreDocument, options);
      }
export type EnsureFluorophoreMutationHookResult = ReturnType<typeof useEnsureFluorophoreMutation>;
export type EnsureFluorophoreMutationResult = Apollo.MutationResult<EnsureFluorophoreMutation>;
export type EnsureFluorophoreMutationOptions = Apollo.BaseMutationOptions<EnsureFluorophoreMutation, EnsureFluorophoreMutationVariables>;
export const From_Array_LikeDocument = gql`
    mutation from_array_like($array: ArrayLike!, $name: String!, $origins: [ID!], $channelViews: [PartialChannelViewInput!], $transformationViews: [PartialAffineTransformationViewInput!], $labelViews: [PartialLabelViewInput!], $timepointViews: [PartialTimepointViewInput!], $opticsViews: [PartialOpticsViewInput!]) {
  fromArrayLike(
    input: {array: $array, name: $name, origins: $origins, channelViews: $channelViews, transformationViews: $transformationViews, labelViews: $labelViews, timepointViews: $timepointViews, opticsViews: $opticsViews}
  ) {
    ...Image
  }
}
    ${ImageFragmentDoc}`;
export type From_Array_LikeMutationFn = Apollo.MutationFunction<From_Array_LikeMutation, From_Array_LikeMutationVariables>;

/**
 * __useFrom_Array_LikeMutation__
 *
 * To run a mutation, you first call `useFrom_Array_LikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFrom_Array_LikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fromArrayLikeMutation, { data, loading, error }] = useFrom_Array_LikeMutation({
 *   variables: {
 *      array: // value for 'array'
 *      name: // value for 'name'
 *      origins: // value for 'origins'
 *      channelViews: // value for 'channelViews'
 *      transformationViews: // value for 'transformationViews'
 *      labelViews: // value for 'labelViews'
 *      timepointViews: // value for 'timepointViews'
 *      opticsViews: // value for 'opticsViews'
 *   },
 * });
 */
export function useFrom_Array_LikeMutation(baseOptions?: Apollo.MutationHookOptions<From_Array_LikeMutation, From_Array_LikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<From_Array_LikeMutation, From_Array_LikeMutationVariables>(From_Array_LikeDocument, options);
      }
export type From_Array_LikeMutationHookResult = ReturnType<typeof useFrom_Array_LikeMutation>;
export type From_Array_LikeMutationResult = Apollo.MutationResult<From_Array_LikeMutation>;
export type From_Array_LikeMutationOptions = Apollo.BaseMutationOptions<From_Array_LikeMutation, From_Array_LikeMutationVariables>;
export const RequestUploadDocument = gql`
    mutation RequestUpload($key: String!, $datalayer: String!) {
  requestUpload(input: {key: $key, datalayer: $datalayer}) {
    ...Credentials
  }
}
    ${CredentialsFragmentDoc}`;
export type RequestUploadMutationFn = Apollo.MutationFunction<RequestUploadMutation, RequestUploadMutationVariables>;

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
export function useRequestUploadMutation(baseOptions?: Apollo.MutationHookOptions<RequestUploadMutation, RequestUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestUploadMutation, RequestUploadMutationVariables>(RequestUploadDocument, options);
      }
export type RequestUploadMutationHookResult = ReturnType<typeof useRequestUploadMutation>;
export type RequestUploadMutationResult = Apollo.MutationResult<RequestUploadMutation>;
export type RequestUploadMutationOptions = Apollo.BaseMutationOptions<RequestUploadMutation, RequestUploadMutationVariables>;
export const RequestAccessDocument = gql`
    mutation RequestAccess($store: ID!, $duration: Int) {
  requestAccess(input: {store: $store, duration: $duration}) {
    ...AccessCredentials
  }
}
    ${AccessCredentialsFragmentDoc}`;
export type RequestAccessMutationFn = Apollo.MutationFunction<RequestAccessMutation, RequestAccessMutationVariables>;

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
export function useRequestAccessMutation(baseOptions?: Apollo.MutationHookOptions<RequestAccessMutation, RequestAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestAccessMutation, RequestAccessMutationVariables>(RequestAccessDocument, options);
      }
export type RequestAccessMutationHookResult = ReturnType<typeof useRequestAccessMutation>;
export type RequestAccessMutationResult = Apollo.MutationResult<RequestAccessMutation>;
export type RequestAccessMutationOptions = Apollo.BaseMutationOptions<RequestAccessMutation, RequestAccessMutationVariables>;
export const PinImageDocument = gql`
    mutation PinImage($id: ID!, $pin: Boolean!) {
  pinImage(input: {id: $id, pin: $pin}) {
    ...Image
  }
}
    ${ImageFragmentDoc}`;
export type PinImageMutationFn = Apollo.MutationFunction<PinImageMutation, PinImageMutationVariables>;

/**
 * __usePinImageMutation__
 *
 * To run a mutation, you first call `usePinImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinImageMutation, { data, loading, error }] = usePinImageMutation({
 *   variables: {
 *      id: // value for 'id'
 *      pin: // value for 'pin'
 *   },
 * });
 */
export function usePinImageMutation(baseOptions?: Apollo.MutationHookOptions<PinImageMutation, PinImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PinImageMutation, PinImageMutationVariables>(PinImageDocument, options);
      }
export type PinImageMutationHookResult = ReturnType<typeof usePinImageMutation>;
export type PinImageMutationResult = Apollo.MutationResult<PinImageMutation>;
export type PinImageMutationOptions = Apollo.BaseMutationOptions<PinImageMutation, PinImageMutationVariables>;
export const UpdateImageDocument = gql`
    mutation UpdateImage($input: UpdateImageInput!) {
  updateImage(input: $input) {
    ...Image
  }
}
    ${ImageFragmentDoc}`;
export type UpdateImageMutationFn = Apollo.MutationFunction<UpdateImageMutation, UpdateImageMutationVariables>;

/**
 * __useUpdateImageMutation__
 *
 * To run a mutation, you first call `useUpdateImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateImageMutation, { data, loading, error }] = useUpdateImageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateImageMutation(baseOptions?: Apollo.MutationHookOptions<UpdateImageMutation, UpdateImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateImageMutation, UpdateImageMutationVariables>(UpdateImageDocument, options);
      }
export type UpdateImageMutationHookResult = ReturnType<typeof useUpdateImageMutation>;
export type UpdateImageMutationResult = Apollo.MutationResult<UpdateImageMutation>;
export type UpdateImageMutationOptions = Apollo.BaseMutationOptions<UpdateImageMutation, UpdateImageMutationVariables>;
export const CreateInstrumentDocument = gql`
    mutation CreateInstrument($serialNumber: String!, $name: String, $model: String) {
  createInstrument(
    input: {name: $name, model: $model, serialNumber: $serialNumber}
  ) {
    id
    name
  }
}
    `;
export type CreateInstrumentMutationFn = Apollo.MutationFunction<CreateInstrumentMutation, CreateInstrumentMutationVariables>;

/**
 * __useCreateInstrumentMutation__
 *
 * To run a mutation, you first call `useCreateInstrumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInstrumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInstrumentMutation, { data, loading, error }] = useCreateInstrumentMutation({
 *   variables: {
 *      serialNumber: // value for 'serialNumber'
 *      name: // value for 'name'
 *      model: // value for 'model'
 *   },
 * });
 */
export function useCreateInstrumentMutation(baseOptions?: Apollo.MutationHookOptions<CreateInstrumentMutation, CreateInstrumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInstrumentMutation, CreateInstrumentMutationVariables>(CreateInstrumentDocument, options);
      }
export type CreateInstrumentMutationHookResult = ReturnType<typeof useCreateInstrumentMutation>;
export type CreateInstrumentMutationResult = Apollo.MutationResult<CreateInstrumentMutation>;
export type CreateInstrumentMutationOptions = Apollo.BaseMutationOptions<CreateInstrumentMutation, CreateInstrumentMutationVariables>;
export const EnsureInstrumentDocument = gql`
    mutation EnsureInstrument($serialNumber: String!, $name: String, $model: String) {
  ensureInstrument(
    input: {name: $name, model: $model, serialNumber: $serialNumber}
  ) {
    id
    name
  }
}
    `;
export type EnsureInstrumentMutationFn = Apollo.MutationFunction<EnsureInstrumentMutation, EnsureInstrumentMutationVariables>;

/**
 * __useEnsureInstrumentMutation__
 *
 * To run a mutation, you first call `useEnsureInstrumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnsureInstrumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ensureInstrumentMutation, { data, loading, error }] = useEnsureInstrumentMutation({
 *   variables: {
 *      serialNumber: // value for 'serialNumber'
 *      name: // value for 'name'
 *      model: // value for 'model'
 *   },
 * });
 */
export function useEnsureInstrumentMutation(baseOptions?: Apollo.MutationHookOptions<EnsureInstrumentMutation, EnsureInstrumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnsureInstrumentMutation, EnsureInstrumentMutationVariables>(EnsureInstrumentDocument, options);
      }
export type EnsureInstrumentMutationHookResult = ReturnType<typeof useEnsureInstrumentMutation>;
export type EnsureInstrumentMutationResult = Apollo.MutationResult<EnsureInstrumentMutation>;
export type EnsureInstrumentMutationOptions = Apollo.BaseMutationOptions<EnsureInstrumentMutation, EnsureInstrumentMutationVariables>;
export const RequestMediaUploadDocument = gql`
    mutation RequestMediaUpload($key: String!, $datalayer: String!) {
  requestMediaUpload(input: {key: $key, datalayer: $datalayer}) {
    ...PresignedPostCredentials
  }
}
    ${PresignedPostCredentialsFragmentDoc}`;
export type RequestMediaUploadMutationFn = Apollo.MutationFunction<RequestMediaUploadMutation, RequestMediaUploadMutationVariables>;

/**
 * __useRequestMediaUploadMutation__
 *
 * To run a mutation, you first call `useRequestMediaUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestMediaUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestMediaUploadMutation, { data, loading, error }] = useRequestMediaUploadMutation({
 *   variables: {
 *      key: // value for 'key'
 *      datalayer: // value for 'datalayer'
 *   },
 * });
 */
export function useRequestMediaUploadMutation(baseOptions?: Apollo.MutationHookOptions<RequestMediaUploadMutation, RequestMediaUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestMediaUploadMutation, RequestMediaUploadMutationVariables>(RequestMediaUploadDocument, options);
      }
export type RequestMediaUploadMutationHookResult = ReturnType<typeof useRequestMediaUploadMutation>;
export type RequestMediaUploadMutationResult = Apollo.MutationResult<RequestMediaUploadMutation>;
export type RequestMediaUploadMutationOptions = Apollo.BaseMutationOptions<RequestMediaUploadMutation, RequestMediaUploadMutationVariables>;
export const CreateMultiWellPlateDocument = gql`
    mutation CreateMultiWellPlate($input: MultiWellPlateInput!) {
  createMultiWellPlate(input: $input) {
    ...MultiWellPlate
  }
}
    ${MultiWellPlateFragmentDoc}`;
export type CreateMultiWellPlateMutationFn = Apollo.MutationFunction<CreateMultiWellPlateMutation, CreateMultiWellPlateMutationVariables>;

/**
 * __useCreateMultiWellPlateMutation__
 *
 * To run a mutation, you first call `useCreateMultiWellPlateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMultiWellPlateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMultiWellPlateMutation, { data, loading, error }] = useCreateMultiWellPlateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMultiWellPlateMutation(baseOptions?: Apollo.MutationHookOptions<CreateMultiWellPlateMutation, CreateMultiWellPlateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMultiWellPlateMutation, CreateMultiWellPlateMutationVariables>(CreateMultiWellPlateDocument, options);
      }
export type CreateMultiWellPlateMutationHookResult = ReturnType<typeof useCreateMultiWellPlateMutation>;
export type CreateMultiWellPlateMutationResult = Apollo.MutationResult<CreateMultiWellPlateMutation>;
export type CreateMultiWellPlateMutationOptions = Apollo.BaseMutationOptions<CreateMultiWellPlateMutation, CreateMultiWellPlateMutationVariables>;
export const AutoCreateMultiWellPlateDocument = gql`
    mutation AutoCreateMultiWellPlate($input: String!) {
  result: createMultiWellPlate(input: {name: $input}) {
    label: name
    value: id
  }
}
    `;
export type AutoCreateMultiWellPlateMutationFn = Apollo.MutationFunction<AutoCreateMultiWellPlateMutation, AutoCreateMultiWellPlateMutationVariables>;

/**
 * __useAutoCreateMultiWellPlateMutation__
 *
 * To run a mutation, you first call `useAutoCreateMultiWellPlateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAutoCreateMultiWellPlateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [autoCreateMultiWellPlateMutation, { data, loading, error }] = useAutoCreateMultiWellPlateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAutoCreateMultiWellPlateMutation(baseOptions?: Apollo.MutationHookOptions<AutoCreateMultiWellPlateMutation, AutoCreateMultiWellPlateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AutoCreateMultiWellPlateMutation, AutoCreateMultiWellPlateMutationVariables>(AutoCreateMultiWellPlateDocument, options);
      }
export type AutoCreateMultiWellPlateMutationHookResult = ReturnType<typeof useAutoCreateMultiWellPlateMutation>;
export type AutoCreateMultiWellPlateMutationResult = Apollo.MutationResult<AutoCreateMultiWellPlateMutation>;
export type AutoCreateMultiWellPlateMutationOptions = Apollo.BaseMutationOptions<AutoCreateMultiWellPlateMutation, AutoCreateMultiWellPlateMutationVariables>;
export const CreateObjectiveDocument = gql`
    mutation CreateObjective($serialNumber: String!, $name: String, $na: Float, $magnification: Float) {
  createObjective(
    input: {name: $name, na: $na, serialNumber: $serialNumber, magnification: $magnification}
  ) {
    id
    name
  }
}
    `;
export type CreateObjectiveMutationFn = Apollo.MutationFunction<CreateObjectiveMutation, CreateObjectiveMutationVariables>;

/**
 * __useCreateObjectiveMutation__
 *
 * To run a mutation, you first call `useCreateObjectiveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateObjectiveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createObjectiveMutation, { data, loading, error }] = useCreateObjectiveMutation({
 *   variables: {
 *      serialNumber: // value for 'serialNumber'
 *      name: // value for 'name'
 *      na: // value for 'na'
 *      magnification: // value for 'magnification'
 *   },
 * });
 */
export function useCreateObjectiveMutation(baseOptions?: Apollo.MutationHookOptions<CreateObjectiveMutation, CreateObjectiveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateObjectiveMutation, CreateObjectiveMutationVariables>(CreateObjectiveDocument, options);
      }
export type CreateObjectiveMutationHookResult = ReturnType<typeof useCreateObjectiveMutation>;
export type CreateObjectiveMutationResult = Apollo.MutationResult<CreateObjectiveMutation>;
export type CreateObjectiveMutationOptions = Apollo.BaseMutationOptions<CreateObjectiveMutation, CreateObjectiveMutationVariables>;
export const EnsureObjectiveDocument = gql`
    mutation EnsureObjective($serialNumber: String!, $name: String, $na: Float, $magnification: Float) {
  ensureObjective(
    input: {name: $name, na: $na, serialNumber: $serialNumber, magnification: $magnification}
  ) {
    id
    name
  }
}
    `;
export type EnsureObjectiveMutationFn = Apollo.MutationFunction<EnsureObjectiveMutation, EnsureObjectiveMutationVariables>;

/**
 * __useEnsureObjectiveMutation__
 *
 * To run a mutation, you first call `useEnsureObjectiveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnsureObjectiveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ensureObjectiveMutation, { data, loading, error }] = useEnsureObjectiveMutation({
 *   variables: {
 *      serialNumber: // value for 'serialNumber'
 *      name: // value for 'name'
 *      na: // value for 'na'
 *      magnification: // value for 'magnification'
 *   },
 * });
 */
export function useEnsureObjectiveMutation(baseOptions?: Apollo.MutationHookOptions<EnsureObjectiveMutation, EnsureObjectiveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnsureObjectiveMutation, EnsureObjectiveMutationVariables>(EnsureObjectiveDocument, options);
      }
export type EnsureObjectiveMutationHookResult = ReturnType<typeof useEnsureObjectiveMutation>;
export type EnsureObjectiveMutationResult = Apollo.MutationResult<EnsureObjectiveMutation>;
export type EnsureObjectiveMutationOptions = Apollo.BaseMutationOptions<EnsureObjectiveMutation, EnsureObjectiveMutationVariables>;
export const CreateRgbContextDocument = gql`
    mutation CreateRGBContext($input: CreateRGBContextInput!) {
  createRgbContext(input: $input) {
    ...RGBContext
  }
}
    ${RgbContextFragmentDoc}`;
export type CreateRgbContextMutationFn = Apollo.MutationFunction<CreateRgbContextMutation, CreateRgbContextMutationVariables>;

/**
 * __useCreateRgbContextMutation__
 *
 * To run a mutation, you first call `useCreateRgbContextMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRgbContextMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRgbContextMutation, { data, loading, error }] = useCreateRgbContextMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRgbContextMutation(baseOptions?: Apollo.MutationHookOptions<CreateRgbContextMutation, CreateRgbContextMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRgbContextMutation, CreateRgbContextMutationVariables>(CreateRgbContextDocument, options);
      }
export type CreateRgbContextMutationHookResult = ReturnType<typeof useCreateRgbContextMutation>;
export type CreateRgbContextMutationResult = Apollo.MutationResult<CreateRgbContextMutation>;
export type CreateRgbContextMutationOptions = Apollo.BaseMutationOptions<CreateRgbContextMutation, CreateRgbContextMutationVariables>;
export const UpdateRgbContextDocument = gql`
    mutation UpdateRGBContext($input: UpdateRGBContextInput!) {
  updateRgbContext(input: $input) {
    ...RGBContext
  }
}
    ${RgbContextFragmentDoc}`;
export type UpdateRgbContextMutationFn = Apollo.MutationFunction<UpdateRgbContextMutation, UpdateRgbContextMutationVariables>;

/**
 * __useUpdateRgbContextMutation__
 *
 * To run a mutation, you first call `useUpdateRgbContextMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRgbContextMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRgbContextMutation, { data, loading, error }] = useUpdateRgbContextMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRgbContextMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRgbContextMutation, UpdateRgbContextMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRgbContextMutation, UpdateRgbContextMutationVariables>(UpdateRgbContextDocument, options);
      }
export type UpdateRgbContextMutationHookResult = ReturnType<typeof useUpdateRgbContextMutation>;
export type UpdateRgbContextMutationResult = Apollo.MutationResult<UpdateRgbContextMutation>;
export type UpdateRgbContextMutationOptions = Apollo.BaseMutationOptions<UpdateRgbContextMutation, UpdateRgbContextMutationVariables>;
export const CreateSnapshotDocument = gql`
    mutation CreateSnapshot($image: ID!, $file: Upload!) {
  createSnapshot(input: {file: $file, image: $image}) {
    ...Snapshot
  }
}
    ${SnapshotFragmentDoc}`;
export type CreateSnapshotMutationFn = Apollo.MutationFunction<CreateSnapshotMutation, CreateSnapshotMutationVariables>;

/**
 * __useCreateSnapshotMutation__
 *
 * To run a mutation, you first call `useCreateSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSnapshotMutation, { data, loading, error }] = useCreateSnapshotMutation({
 *   variables: {
 *      image: // value for 'image'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useCreateSnapshotMutation(baseOptions?: Apollo.MutationHookOptions<CreateSnapshotMutation, CreateSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSnapshotMutation, CreateSnapshotMutationVariables>(CreateSnapshotDocument, options);
      }
export type CreateSnapshotMutationHookResult = ReturnType<typeof useCreateSnapshotMutation>;
export type CreateSnapshotMutationResult = Apollo.MutationResult<CreateSnapshotMutation>;
export type CreateSnapshotMutationOptions = Apollo.BaseMutationOptions<CreateSnapshotMutation, CreateSnapshotMutationVariables>;
export const CreateStageDocument = gql`
    mutation CreateStage($name: String!) {
  createStage(input: {name: $name}) {
    id
    name
  }
}
    `;
export type CreateStageMutationFn = Apollo.MutationFunction<CreateStageMutation, CreateStageMutationVariables>;

/**
 * __useCreateStageMutation__
 *
 * To run a mutation, you first call `useCreateStageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStageMutation, { data, loading, error }] = useCreateStageMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateStageMutation(baseOptions?: Apollo.MutationHookOptions<CreateStageMutation, CreateStageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStageMutation, CreateStageMutationVariables>(CreateStageDocument, options);
      }
export type CreateStageMutationHookResult = ReturnType<typeof useCreateStageMutation>;
export type CreateStageMutationResult = Apollo.MutationResult<CreateStageMutation>;
export type CreateStageMutationOptions = Apollo.BaseMutationOptions<CreateStageMutation, CreateStageMutationVariables>;
export const PinStageDocument = gql`
    mutation PinStage($id: ID!, $pin: Boolean!) {
  pinStage(input: {id: $id, pin: $pin}) {
    ...Stage
  }
}
    ${StageFragmentDoc}`;
export type PinStageMutationFn = Apollo.MutationFunction<PinStageMutation, PinStageMutationVariables>;

/**
 * __usePinStageMutation__
 *
 * To run a mutation, you first call `usePinStageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinStageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinStageMutation, { data, loading, error }] = usePinStageMutation({
 *   variables: {
 *      id: // value for 'id'
 *      pin: // value for 'pin'
 *   },
 * });
 */
export function usePinStageMutation(baseOptions?: Apollo.MutationHookOptions<PinStageMutation, PinStageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PinStageMutation, PinStageMutationVariables>(PinStageDocument, options);
      }
export type PinStageMutationHookResult = ReturnType<typeof usePinStageMutation>;
export type PinStageMutationResult = Apollo.MutationResult<PinStageMutation>;
export type PinStageMutationOptions = Apollo.BaseMutationOptions<PinStageMutation, PinStageMutationVariables>;
export const From_Parquet_LikeDocument = gql`
    mutation from_parquet_like($dataframe: ParquetLike!, $name: String!, $origins: [ID!], $dataset: ID) {
  fromParquetLike(
    input: {dataframe: $dataframe, name: $name, origins: $origins, dataset: $dataset}
  ) {
    ...Table
  }
}
    ${TableFragmentDoc}`;
export type From_Parquet_LikeMutationFn = Apollo.MutationFunction<From_Parquet_LikeMutation, From_Parquet_LikeMutationVariables>;

/**
 * __useFrom_Parquet_LikeMutation__
 *
 * To run a mutation, you first call `useFrom_Parquet_LikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFrom_Parquet_LikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fromParquetLikeMutation, { data, loading, error }] = useFrom_Parquet_LikeMutation({
 *   variables: {
 *      dataframe: // value for 'dataframe'
 *      name: // value for 'name'
 *      origins: // value for 'origins'
 *      dataset: // value for 'dataset'
 *   },
 * });
 */
export function useFrom_Parquet_LikeMutation(baseOptions?: Apollo.MutationHookOptions<From_Parquet_LikeMutation, From_Parquet_LikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<From_Parquet_LikeMutation, From_Parquet_LikeMutationVariables>(From_Parquet_LikeDocument, options);
      }
export type From_Parquet_LikeMutationHookResult = ReturnType<typeof useFrom_Parquet_LikeMutation>;
export type From_Parquet_LikeMutationResult = Apollo.MutationResult<From_Parquet_LikeMutation>;
export type From_Parquet_LikeMutationOptions = Apollo.BaseMutationOptions<From_Parquet_LikeMutation, From_Parquet_LikeMutationVariables>;
export const RequestTableUploadDocument = gql`
    mutation RequestTableUpload($key: String!, $datalayer: String!) {
  requestTableUpload(input: {key: $key, datalayer: $datalayer}) {
    ...Credentials
  }
}
    ${CredentialsFragmentDoc}`;
export type RequestTableUploadMutationFn = Apollo.MutationFunction<RequestTableUploadMutation, RequestTableUploadMutationVariables>;

/**
 * __useRequestTableUploadMutation__
 *
 * To run a mutation, you first call `useRequestTableUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestTableUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestTableUploadMutation, { data, loading, error }] = useRequestTableUploadMutation({
 *   variables: {
 *      key: // value for 'key'
 *      datalayer: // value for 'datalayer'
 *   },
 * });
 */
export function useRequestTableUploadMutation(baseOptions?: Apollo.MutationHookOptions<RequestTableUploadMutation, RequestTableUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestTableUploadMutation, RequestTableUploadMutationVariables>(RequestTableUploadDocument, options);
      }
export type RequestTableUploadMutationHookResult = ReturnType<typeof useRequestTableUploadMutation>;
export type RequestTableUploadMutationResult = Apollo.MutationResult<RequestTableUploadMutation>;
export type RequestTableUploadMutationOptions = Apollo.BaseMutationOptions<RequestTableUploadMutation, RequestTableUploadMutationVariables>;
export const RequestTableAccessDocument = gql`
    mutation RequestTableAccess($store: ID!, $duration: Int) {
  requestTableAccess(input: {store: $store, duration: $duration}) {
    ...AccessCredentials
  }
}
    ${AccessCredentialsFragmentDoc}`;
export type RequestTableAccessMutationFn = Apollo.MutationFunction<RequestTableAccessMutation, RequestTableAccessMutationVariables>;

/**
 * __useRequestTableAccessMutation__
 *
 * To run a mutation, you first call `useRequestTableAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestTableAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestTableAccessMutation, { data, loading, error }] = useRequestTableAccessMutation({
 *   variables: {
 *      store: // value for 'store'
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useRequestTableAccessMutation(baseOptions?: Apollo.MutationHookOptions<RequestTableAccessMutation, RequestTableAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestTableAccessMutation, RequestTableAccessMutationVariables>(RequestTableAccessDocument, options);
      }
export type RequestTableAccessMutationHookResult = ReturnType<typeof useRequestTableAccessMutation>;
export type RequestTableAccessMutationResult = Apollo.MutationResult<RequestTableAccessMutation>;
export type RequestTableAccessMutationOptions = Apollo.BaseMutationOptions<RequestTableAccessMutation, RequestTableAccessMutationVariables>;
export const CreateAffineTransformationViewDocument = gql`
    mutation CreateAffineTransformationView($image: ID!, $affineMatrix: FourByFourMatrix!, $stage: ID) {
  createAffineTransformationView(
    input: {image: $image, affineMatrix: $affineMatrix, stage: $stage}
  ) {
    ...AffineTransformationView
  }
}
    ${AffineTransformationViewFragmentDoc}`;
export type CreateAffineTransformationViewMutationFn = Apollo.MutationFunction<CreateAffineTransformationViewMutation, CreateAffineTransformationViewMutationVariables>;

/**
 * __useCreateAffineTransformationViewMutation__
 *
 * To run a mutation, you first call `useCreateAffineTransformationViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAffineTransformationViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAffineTransformationViewMutation, { data, loading, error }] = useCreateAffineTransformationViewMutation({
 *   variables: {
 *      image: // value for 'image'
 *      affineMatrix: // value for 'affineMatrix'
 *      stage: // value for 'stage'
 *   },
 * });
 */
export function useCreateAffineTransformationViewMutation(baseOptions?: Apollo.MutationHookOptions<CreateAffineTransformationViewMutation, CreateAffineTransformationViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAffineTransformationViewMutation, CreateAffineTransformationViewMutationVariables>(CreateAffineTransformationViewDocument, options);
      }
export type CreateAffineTransformationViewMutationHookResult = ReturnType<typeof useCreateAffineTransformationViewMutation>;
export type CreateAffineTransformationViewMutationResult = Apollo.MutationResult<CreateAffineTransformationViewMutation>;
export type CreateAffineTransformationViewMutationOptions = Apollo.BaseMutationOptions<CreateAffineTransformationViewMutation, CreateAffineTransformationViewMutationVariables>;
export const DeleteAffineTransformationViewDocument = gql`
    mutation DeleteAffineTransformationView($id: ID!) {
  deleteAffineTransformationView(input: {id: $id})
}
    `;
export type DeleteAffineTransformationViewMutationFn = Apollo.MutationFunction<DeleteAffineTransformationViewMutation, DeleteAffineTransformationViewMutationVariables>;

/**
 * __useDeleteAffineTransformationViewMutation__
 *
 * To run a mutation, you first call `useDeleteAffineTransformationViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAffineTransformationViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAffineTransformationViewMutation, { data, loading, error }] = useDeleteAffineTransformationViewMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAffineTransformationViewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAffineTransformationViewMutation, DeleteAffineTransformationViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAffineTransformationViewMutation, DeleteAffineTransformationViewMutationVariables>(DeleteAffineTransformationViewDocument, options);
      }
export type DeleteAffineTransformationViewMutationHookResult = ReturnType<typeof useDeleteAffineTransformationViewMutation>;
export type DeleteAffineTransformationViewMutationResult = Apollo.MutationResult<DeleteAffineTransformationViewMutation>;
export type DeleteAffineTransformationViewMutationOptions = Apollo.BaseMutationOptions<DeleteAffineTransformationViewMutation, DeleteAffineTransformationViewMutationVariables>;
export const DeleteRgbViewDocument = gql`
    mutation DeleteRGBView($id: ID!) {
  deleteRgbView(input: {id: $id})
}
    `;
export type DeleteRgbViewMutationFn = Apollo.MutationFunction<DeleteRgbViewMutation, DeleteRgbViewMutationVariables>;

/**
 * __useDeleteRgbViewMutation__
 *
 * To run a mutation, you first call `useDeleteRgbViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRgbViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRgbViewMutation, { data, loading, error }] = useDeleteRgbViewMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRgbViewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRgbViewMutation, DeleteRgbViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRgbViewMutation, DeleteRgbViewMutationVariables>(DeleteRgbViewDocument, options);
      }
export type DeleteRgbViewMutationHookResult = ReturnType<typeof useDeleteRgbViewMutation>;
export type DeleteRgbViewMutationResult = Apollo.MutationResult<DeleteRgbViewMutation>;
export type DeleteRgbViewMutationOptions = Apollo.BaseMutationOptions<DeleteRgbViewMutation, DeleteRgbViewMutationVariables>;
export const DeleteChannelViewDocument = gql`
    mutation DeleteChannelView($id: ID!) {
  deleteChannelView(input: {id: $id})
}
    `;
export type DeleteChannelViewMutationFn = Apollo.MutationFunction<DeleteChannelViewMutation, DeleteChannelViewMutationVariables>;

/**
 * __useDeleteChannelViewMutation__
 *
 * To run a mutation, you first call `useDeleteChannelViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChannelViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChannelViewMutation, { data, loading, error }] = useDeleteChannelViewMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteChannelViewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteChannelViewMutation, DeleteChannelViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteChannelViewMutation, DeleteChannelViewMutationVariables>(DeleteChannelViewDocument, options);
      }
export type DeleteChannelViewMutationHookResult = ReturnType<typeof useDeleteChannelViewMutation>;
export type DeleteChannelViewMutationResult = Apollo.MutationResult<DeleteChannelViewMutation>;
export type DeleteChannelViewMutationOptions = Apollo.BaseMutationOptions<DeleteChannelViewMutation, DeleteChannelViewMutationVariables>;
export const CreateRgbViewDocument = gql`
    mutation CreateRGBView($image: ID!, $rScale: Float!, $gScale: Float!, $bScale: Float!, $context: ID) {
  createRgbView(
    input: {image: $image, rScale: $rScale, gScale: $gScale, bScale: $bScale, context: $context}
  ) {
    ...RGBView
  }
}
    ${RgbViewFragmentDoc}`;
export type CreateRgbViewMutationFn = Apollo.MutationFunction<CreateRgbViewMutation, CreateRgbViewMutationVariables>;

/**
 * __useCreateRgbViewMutation__
 *
 * To run a mutation, you first call `useCreateRgbViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRgbViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRgbViewMutation, { data, loading, error }] = useCreateRgbViewMutation({
 *   variables: {
 *      image: // value for 'image'
 *      rScale: // value for 'rScale'
 *      gScale: // value for 'gScale'
 *      bScale: // value for 'bScale'
 *      context: // value for 'context'
 *   },
 * });
 */
export function useCreateRgbViewMutation(baseOptions?: Apollo.MutationHookOptions<CreateRgbViewMutation, CreateRgbViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRgbViewMutation, CreateRgbViewMutationVariables>(CreateRgbViewDocument, options);
      }
export type CreateRgbViewMutationHookResult = ReturnType<typeof useCreateRgbViewMutation>;
export type CreateRgbViewMutationResult = Apollo.MutationResult<CreateRgbViewMutation>;
export type CreateRgbViewMutationOptions = Apollo.BaseMutationOptions<CreateRgbViewMutation, CreateRgbViewMutationVariables>;
export const CreateLabelViewDocument = gql`
    mutation CreateLabelView($image: ID!, $fluorophore: ID, $primaryAntibody: ID, $secondaryAntibody: ID) {
  createLabelView(
    input: {image: $image, fluorophore: $fluorophore, primaryAntibody: $primaryAntibody, secondaryAntibody: $secondaryAntibody}
  ) {
    ...LabelView
  }
}
    ${LabelViewFragmentDoc}`;
export type CreateLabelViewMutationFn = Apollo.MutationFunction<CreateLabelViewMutation, CreateLabelViewMutationVariables>;

/**
 * __useCreateLabelViewMutation__
 *
 * To run a mutation, you first call `useCreateLabelViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLabelViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLabelViewMutation, { data, loading, error }] = useCreateLabelViewMutation({
 *   variables: {
 *      image: // value for 'image'
 *      fluorophore: // value for 'fluorophore'
 *      primaryAntibody: // value for 'primaryAntibody'
 *      secondaryAntibody: // value for 'secondaryAntibody'
 *   },
 * });
 */
export function useCreateLabelViewMutation(baseOptions?: Apollo.MutationHookOptions<CreateLabelViewMutation, CreateLabelViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLabelViewMutation, CreateLabelViewMutationVariables>(CreateLabelViewDocument, options);
      }
export type CreateLabelViewMutationHookResult = ReturnType<typeof useCreateLabelViewMutation>;
export type CreateLabelViewMutationResult = Apollo.MutationResult<CreateLabelViewMutation>;
export type CreateLabelViewMutationOptions = Apollo.BaseMutationOptions<CreateLabelViewMutation, CreateLabelViewMutationVariables>;
export const CreateWellPositionViewDocument = gql`
    mutation CreateWellPositionView($input: WellPositionViewInput!) {
  createWellPositionView(input: $input) {
    ...WellPositionView
  }
}
    ${WellPositionViewFragmentDoc}`;
export type CreateWellPositionViewMutationFn = Apollo.MutationFunction<CreateWellPositionViewMutation, CreateWellPositionViewMutationVariables>;

/**
 * __useCreateWellPositionViewMutation__
 *
 * To run a mutation, you first call `useCreateWellPositionViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWellPositionViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWellPositionViewMutation, { data, loading, error }] = useCreateWellPositionViewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateWellPositionViewMutation(baseOptions?: Apollo.MutationHookOptions<CreateWellPositionViewMutation, CreateWellPositionViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWellPositionViewMutation, CreateWellPositionViewMutationVariables>(CreateWellPositionViewDocument, options);
      }
export type CreateWellPositionViewMutationHookResult = ReturnType<typeof useCreateWellPositionViewMutation>;
export type CreateWellPositionViewMutationResult = Apollo.MutationResult<CreateWellPositionViewMutation>;
export type CreateWellPositionViewMutationOptions = Apollo.BaseMutationOptions<CreateWellPositionViewMutation, CreateWellPositionViewMutationVariables>;
export const CreateContinousScanViewDocument = gql`
    mutation CreateContinousScanView($input: ContinousScanViewInput!) {
  createContinousScanView(input: $input) {
    ...ContinousScanView
  }
}
    ${ContinousScanViewFragmentDoc}`;
export type CreateContinousScanViewMutationFn = Apollo.MutationFunction<CreateContinousScanViewMutation, CreateContinousScanViewMutationVariables>;

/**
 * __useCreateContinousScanViewMutation__
 *
 * To run a mutation, you first call `useCreateContinousScanViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContinousScanViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContinousScanViewMutation, { data, loading, error }] = useCreateContinousScanViewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateContinousScanViewMutation(baseOptions?: Apollo.MutationHookOptions<CreateContinousScanViewMutation, CreateContinousScanViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateContinousScanViewMutation, CreateContinousScanViewMutationVariables>(CreateContinousScanViewDocument, options);
      }
export type CreateContinousScanViewMutationHookResult = ReturnType<typeof useCreateContinousScanViewMutation>;
export type CreateContinousScanViewMutationResult = Apollo.MutationResult<CreateContinousScanViewMutation>;
export type CreateContinousScanViewMutationOptions = Apollo.BaseMutationOptions<CreateContinousScanViewMutation, CreateContinousScanViewMutationVariables>;
export const CreateViewCollectionDocument = gql`
    mutation CreateViewCollection($name: String!) {
  createViewCollection(input: {name: $name}) {
    id
    name
  }
}
    `;
export type CreateViewCollectionMutationFn = Apollo.MutationFunction<CreateViewCollectionMutation, CreateViewCollectionMutationVariables>;

/**
 * __useCreateViewCollectionMutation__
 *
 * To run a mutation, you first call `useCreateViewCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateViewCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createViewCollectionMutation, { data, loading, error }] = useCreateViewCollectionMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateViewCollectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateViewCollectionMutation, CreateViewCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateViewCollectionMutation, CreateViewCollectionMutationVariables>(CreateViewCollectionDocument, options);
      }
export type CreateViewCollectionMutationHookResult = ReturnType<typeof useCreateViewCollectionMutation>;
export type CreateViewCollectionMutationResult = Apollo.MutationResult<CreateViewCollectionMutation>;
export type CreateViewCollectionMutationOptions = Apollo.BaseMutationOptions<CreateViewCollectionMutation, CreateViewCollectionMutationVariables>;
export const GetCameraDocument = gql`
    query GetCamera($id: ID!) {
  camera(id: $id) {
    ...Camera
  }
}
    ${CameraFragmentDoc}`;

/**
 * __useGetCameraQuery__
 *
 * To run a query within a React component, call `useGetCameraQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCameraQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCameraQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCameraQuery(baseOptions: Apollo.QueryHookOptions<GetCameraQuery, GetCameraQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCameraQuery, GetCameraQueryVariables>(GetCameraDocument, options);
      }
export function useGetCameraLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCameraQuery, GetCameraQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCameraQuery, GetCameraQueryVariables>(GetCameraDocument, options);
        }
export type GetCameraQueryHookResult = ReturnType<typeof useGetCameraQuery>;
export type GetCameraLazyQueryHookResult = ReturnType<typeof useGetCameraLazyQuery>;
export type GetCameraQueryResult = Apollo.QueryResult<GetCameraQuery, GetCameraQueryVariables>;
export const GetDatasetDocument = gql`
    query GetDataset($id: ID!) {
  dataset(id: $id) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;

/**
 * __useGetDatasetQuery__
 *
 * To run a query within a React component, call `useGetDatasetQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDatasetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDatasetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDatasetQuery(baseOptions: Apollo.QueryHookOptions<GetDatasetQuery, GetDatasetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDatasetQuery, GetDatasetQueryVariables>(GetDatasetDocument, options);
      }
export function useGetDatasetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDatasetQuery, GetDatasetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDatasetQuery, GetDatasetQueryVariables>(GetDatasetDocument, options);
        }
export type GetDatasetQueryHookResult = ReturnType<typeof useGetDatasetQuery>;
export type GetDatasetLazyQueryHookResult = ReturnType<typeof useGetDatasetLazyQuery>;
export type GetDatasetQueryResult = Apollo.QueryResult<GetDatasetQuery, GetDatasetQueryVariables>;
export const GetDatasetsDocument = gql`
    query GetDatasets($filters: DatasetFilter, $pagination: OffsetPaginationInput) {
  datasets(filters: $filters, pagination: $pagination) {
    ...ListDataset
  }
}
    ${ListDatasetFragmentDoc}`;

/**
 * __useGetDatasetsQuery__
 *
 * To run a query within a React component, call `useGetDatasetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDatasetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDatasetsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetDatasetsQuery(baseOptions?: Apollo.QueryHookOptions<GetDatasetsQuery, GetDatasetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDatasetsQuery, GetDatasetsQueryVariables>(GetDatasetsDocument, options);
      }
export function useGetDatasetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDatasetsQuery, GetDatasetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDatasetsQuery, GetDatasetsQueryVariables>(GetDatasetsDocument, options);
        }
export type GetDatasetsQueryHookResult = ReturnType<typeof useGetDatasetsQuery>;
export type GetDatasetsLazyQueryHookResult = ReturnType<typeof useGetDatasetsLazyQuery>;
export type GetDatasetsQueryResult = Apollo.QueryResult<GetDatasetsQuery, GetDatasetsQueryVariables>;
export const GetFileDocument = gql`
    query GetFile($id: ID!) {
  file(id: $id) {
    ...File
  }
}
    ${FileFragmentDoc}`;

/**
 * __useGetFileQuery__
 *
 * To run a query within a React component, call `useGetFileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFileQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFileQuery(baseOptions: Apollo.QueryHookOptions<GetFileQuery, GetFileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFileQuery, GetFileQueryVariables>(GetFileDocument, options);
      }
export function useGetFileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFileQuery, GetFileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFileQuery, GetFileQueryVariables>(GetFileDocument, options);
        }
export type GetFileQueryHookResult = ReturnType<typeof useGetFileQuery>;
export type GetFileLazyQueryHookResult = ReturnType<typeof useGetFileLazyQuery>;
export type GetFileQueryResult = Apollo.QueryResult<GetFileQuery, GetFileQueryVariables>;
export const GetFluorophoreDocument = gql`
    query GetFluorophore($id: ID!) {
  fluorophore(id: $id) {
    ...Fluorophore
  }
}
    ${FluorophoreFragmentDoc}`;

/**
 * __useGetFluorophoreQuery__
 *
 * To run a query within a React component, call `useGetFluorophoreQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFluorophoreQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFluorophoreQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFluorophoreQuery(baseOptions: Apollo.QueryHookOptions<GetFluorophoreQuery, GetFluorophoreQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFluorophoreQuery, GetFluorophoreQueryVariables>(GetFluorophoreDocument, options);
      }
export function useGetFluorophoreLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFluorophoreQuery, GetFluorophoreQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFluorophoreQuery, GetFluorophoreQueryVariables>(GetFluorophoreDocument, options);
        }
export type GetFluorophoreQueryHookResult = ReturnType<typeof useGetFluorophoreQuery>;
export type GetFluorophoreLazyQueryHookResult = ReturnType<typeof useGetFluorophoreLazyQuery>;
export type GetFluorophoreQueryResult = Apollo.QueryResult<GetFluorophoreQuery, GetFluorophoreQueryVariables>;
export const GetFluorophoresDocument = gql`
    query GetFluorophores($filters: FluorophoreFilter, $pagination: OffsetPaginationInput) {
  fluorophores(filters: $filters, pagination: $pagination) {
    ...Fluorophore
  }
}
    ${FluorophoreFragmentDoc}`;

/**
 * __useGetFluorophoresQuery__
 *
 * To run a query within a React component, call `useGetFluorophoresQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFluorophoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFluorophoresQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetFluorophoresQuery(baseOptions?: Apollo.QueryHookOptions<GetFluorophoresQuery, GetFluorophoresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFluorophoresQuery, GetFluorophoresQueryVariables>(GetFluorophoresDocument, options);
      }
export function useGetFluorophoresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFluorophoresQuery, GetFluorophoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFluorophoresQuery, GetFluorophoresQueryVariables>(GetFluorophoresDocument, options);
        }
export type GetFluorophoresQueryHookResult = ReturnType<typeof useGetFluorophoresQuery>;
export type GetFluorophoresLazyQueryHookResult = ReturnType<typeof useGetFluorophoresLazyQuery>;
export type GetFluorophoresQueryResult = Apollo.QueryResult<GetFluorophoresQuery, GetFluorophoresQueryVariables>;
export const FluorophoreOptionsDocument = gql`
    query FluorophoreOptions($search: String, $values: [ID!]) {
  options: fluorophores(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useFluorophoreOptionsQuery__
 *
 * To run a query within a React component, call `useFluorophoreOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFluorophoreOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFluorophoreOptionsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useFluorophoreOptionsQuery(baseOptions?: Apollo.QueryHookOptions<FluorophoreOptionsQuery, FluorophoreOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FluorophoreOptionsQuery, FluorophoreOptionsQueryVariables>(FluorophoreOptionsDocument, options);
      }
export function useFluorophoreOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FluorophoreOptionsQuery, FluorophoreOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FluorophoreOptionsQuery, FluorophoreOptionsQueryVariables>(FluorophoreOptionsDocument, options);
        }
export type FluorophoreOptionsQueryHookResult = ReturnType<typeof useFluorophoreOptionsQuery>;
export type FluorophoreOptionsLazyQueryHookResult = ReturnType<typeof useFluorophoreOptionsLazyQuery>;
export type FluorophoreOptionsQueryResult = Apollo.QueryResult<FluorophoreOptionsQuery, FluorophoreOptionsQueryVariables>;
export const GlobalSearchDocument = gql`
    query GlobalSearch($search: String, $noImages: Boolean!, $noFiles: Boolean!, $pagination: OffsetPaginationInput) {
  images: images(filters: {name: {iContains: $search}}, pagination: $pagination) @skip(if: $noImages) {
    ...ListImage
  }
  files: files(filters: {name: {iContains: $search}}, pagination: $pagination) @skip(if: $noFiles) {
    ...ListFile
  }
}
    ${ListImageFragmentDoc}
${ListFileFragmentDoc}`;

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
 *      noImages: // value for 'noImages'
 *      noFiles: // value for 'noFiles'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGlobalSearchQuery(baseOptions: Apollo.QueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, options);
      }
export function useGlobalSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, options);
        }
export type GlobalSearchQueryHookResult = ReturnType<typeof useGlobalSearchQuery>;
export type GlobalSearchLazyQueryHookResult = ReturnType<typeof useGlobalSearchLazyQuery>;
export type GlobalSearchQueryResult = Apollo.QueryResult<GlobalSearchQuery, GlobalSearchQueryVariables>;
export const ImagesDocument = gql`
    query Images {
  images {
    id
  }
}
    `;

/**
 * __useImagesQuery__
 *
 * To run a query within a React component, call `useImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useImagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useImagesQuery(baseOptions?: Apollo.QueryHookOptions<ImagesQuery, ImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ImagesQuery, ImagesQueryVariables>(ImagesDocument, options);
      }
export function useImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ImagesQuery, ImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ImagesQuery, ImagesQueryVariables>(ImagesDocument, options);
        }
export type ImagesQueryHookResult = ReturnType<typeof useImagesQuery>;
export type ImagesLazyQueryHookResult = ReturnType<typeof useImagesLazyQuery>;
export type ImagesQueryResult = Apollo.QueryResult<ImagesQuery, ImagesQueryVariables>;
export const GetImageDocument = gql`
    query GetImage($id: ID!) {
  image(id: $id) {
    ...Image
  }
}
    ${ImageFragmentDoc}`;

/**
 * __useGetImageQuery__
 *
 * To run a query within a React component, call `useGetImageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetImageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetImageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetImageQuery(baseOptions: Apollo.QueryHookOptions<GetImageQuery, GetImageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetImageQuery, GetImageQueryVariables>(GetImageDocument, options);
      }
export function useGetImageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetImageQuery, GetImageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetImageQuery, GetImageQueryVariables>(GetImageDocument, options);
        }
export type GetImageQueryHookResult = ReturnType<typeof useGetImageQuery>;
export type GetImageLazyQueryHookResult = ReturnType<typeof useGetImageLazyQuery>;
export type GetImageQueryResult = Apollo.QueryResult<GetImageQuery, GetImageQueryVariables>;
export const GetImagesDocument = gql`
    query GetImages($filters: ImageFilter, $pagination: OffsetPaginationInput) {
  images(filters: $filters, pagination: $pagination) {
    ...ListImage
  }
}
    ${ListImageFragmentDoc}`;

/**
 * __useGetImagesQuery__
 *
 * To run a query within a React component, call `useGetImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetImagesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetImagesQuery(baseOptions?: Apollo.QueryHookOptions<GetImagesQuery, GetImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetImagesQuery, GetImagesQueryVariables>(GetImagesDocument, options);
      }
export function useGetImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetImagesQuery, GetImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetImagesQuery, GetImagesQueryVariables>(GetImagesDocument, options);
        }
export type GetImagesQueryHookResult = ReturnType<typeof useGetImagesQuery>;
export type GetImagesLazyQueryHookResult = ReturnType<typeof useGetImagesLazyQuery>;
export type GetImagesQueryResult = Apollo.QueryResult<GetImagesQuery, GetImagesQueryVariables>;
export const GetInstrumentDocument = gql`
    query GetInstrument($id: ID!) {
  instrument(id: $id) {
    ...Instrument
  }
}
    ${InstrumentFragmentDoc}`;

/**
 * __useGetInstrumentQuery__
 *
 * To run a query within a React component, call `useGetInstrumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstrumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstrumentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInstrumentQuery(baseOptions: Apollo.QueryHookOptions<GetInstrumentQuery, GetInstrumentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInstrumentQuery, GetInstrumentQueryVariables>(GetInstrumentDocument, options);
      }
export function useGetInstrumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInstrumentQuery, GetInstrumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInstrumentQuery, GetInstrumentQueryVariables>(GetInstrumentDocument, options);
        }
export type GetInstrumentQueryHookResult = ReturnType<typeof useGetInstrumentQuery>;
export type GetInstrumentLazyQueryHookResult = ReturnType<typeof useGetInstrumentLazyQuery>;
export type GetInstrumentQueryResult = Apollo.QueryResult<GetInstrumentQuery, GetInstrumentQueryVariables>;
export const GetMultiWellPlateDocument = gql`
    query GetMultiWellPlate($id: ID!) {
  multiWellPlate(id: $id) {
    ...MultiWellPlate
  }
}
    ${MultiWellPlateFragmentDoc}`;

/**
 * __useGetMultiWellPlateQuery__
 *
 * To run a query within a React component, call `useGetMultiWellPlateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMultiWellPlateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMultiWellPlateQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMultiWellPlateQuery(baseOptions: Apollo.QueryHookOptions<GetMultiWellPlateQuery, GetMultiWellPlateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMultiWellPlateQuery, GetMultiWellPlateQueryVariables>(GetMultiWellPlateDocument, options);
      }
export function useGetMultiWellPlateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMultiWellPlateQuery, GetMultiWellPlateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMultiWellPlateQuery, GetMultiWellPlateQueryVariables>(GetMultiWellPlateDocument, options);
        }
export type GetMultiWellPlateQueryHookResult = ReturnType<typeof useGetMultiWellPlateQuery>;
export type GetMultiWellPlateLazyQueryHookResult = ReturnType<typeof useGetMultiWellPlateLazyQuery>;
export type GetMultiWellPlateQueryResult = Apollo.QueryResult<GetMultiWellPlateQuery, GetMultiWellPlateQueryVariables>;
export const GetMultiWellPlatesDocument = gql`
    query GetMultiWellPlates($filters: MultiWellPlateFilter, $pagination: OffsetPaginationInput) {
  multiWellPlates(filters: $filters, pagination: $pagination) {
    ...ListMultiWellPlate
  }
}
    ${ListMultiWellPlateFragmentDoc}`;

/**
 * __useGetMultiWellPlatesQuery__
 *
 * To run a query within a React component, call `useGetMultiWellPlatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMultiWellPlatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMultiWellPlatesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetMultiWellPlatesQuery(baseOptions?: Apollo.QueryHookOptions<GetMultiWellPlatesQuery, GetMultiWellPlatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMultiWellPlatesQuery, GetMultiWellPlatesQueryVariables>(GetMultiWellPlatesDocument, options);
      }
export function useGetMultiWellPlatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMultiWellPlatesQuery, GetMultiWellPlatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMultiWellPlatesQuery, GetMultiWellPlatesQueryVariables>(GetMultiWellPlatesDocument, options);
        }
export type GetMultiWellPlatesQueryHookResult = ReturnType<typeof useGetMultiWellPlatesQuery>;
export type GetMultiWellPlatesLazyQueryHookResult = ReturnType<typeof useGetMultiWellPlatesLazyQuery>;
export type GetMultiWellPlatesQueryResult = Apollo.QueryResult<GetMultiWellPlatesQuery, GetMultiWellPlatesQueryVariables>;
export const MultiWellPlateOptionsDocument = gql`
    query MultiWellPlateOptions($search: String, $values: [ID!]) {
  options: multiWellPlates(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useMultiWellPlateOptionsQuery__
 *
 * To run a query within a React component, call `useMultiWellPlateOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMultiWellPlateOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMultiWellPlateOptionsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useMultiWellPlateOptionsQuery(baseOptions?: Apollo.QueryHookOptions<MultiWellPlateOptionsQuery, MultiWellPlateOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MultiWellPlateOptionsQuery, MultiWellPlateOptionsQueryVariables>(MultiWellPlateOptionsDocument, options);
      }
export function useMultiWellPlateOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MultiWellPlateOptionsQuery, MultiWellPlateOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MultiWellPlateOptionsQuery, MultiWellPlateOptionsQueryVariables>(MultiWellPlateOptionsDocument, options);
        }
export type MultiWellPlateOptionsQueryHookResult = ReturnType<typeof useMultiWellPlateOptionsQuery>;
export type MultiWellPlateOptionsLazyQueryHookResult = ReturnType<typeof useMultiWellPlateOptionsLazyQuery>;
export type MultiWellPlateOptionsQueryResult = Apollo.QueryResult<MultiWellPlateOptionsQuery, MultiWellPlateOptionsQueryVariables>;
export const GetObjectiveDocument = gql`
    query GetObjective($id: ID!) {
  objective(id: $id) {
    ...Objective
  }
}
    ${ObjectiveFragmentDoc}`;

/**
 * __useGetObjectiveQuery__
 *
 * To run a query within a React component, call `useGetObjectiveQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetObjectiveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetObjectiveQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetObjectiveQuery(baseOptions: Apollo.QueryHookOptions<GetObjectiveQuery, GetObjectiveQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetObjectiveQuery, GetObjectiveQueryVariables>(GetObjectiveDocument, options);
      }
export function useGetObjectiveLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetObjectiveQuery, GetObjectiveQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetObjectiveQuery, GetObjectiveQueryVariables>(GetObjectiveDocument, options);
        }
export type GetObjectiveQueryHookResult = ReturnType<typeof useGetObjectiveQuery>;
export type GetObjectiveLazyQueryHookResult = ReturnType<typeof useGetObjectiveLazyQuery>;
export type GetObjectiveQueryResult = Apollo.QueryResult<GetObjectiveQuery, GetObjectiveQueryVariables>;
export const RenderTreeDocument = gql`
    query RenderTree($id: ID!) {
  renderTree(id: $id) {
    ...RenderTree
  }
}
    ${RenderTreeFragmentDoc}`;

/**
 * __useRenderTreeQuery__
 *
 * To run a query within a React component, call `useRenderTreeQuery` and pass it any options that fit your needs.
 * When your component renders, `useRenderTreeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRenderTreeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRenderTreeQuery(baseOptions: Apollo.QueryHookOptions<RenderTreeQuery, RenderTreeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RenderTreeQuery, RenderTreeQueryVariables>(RenderTreeDocument, options);
      }
export function useRenderTreeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RenderTreeQuery, RenderTreeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RenderTreeQuery, RenderTreeQueryVariables>(RenderTreeDocument, options);
        }
export type RenderTreeQueryHookResult = ReturnType<typeof useRenderTreeQuery>;
export type RenderTreeLazyQueryHookResult = ReturnType<typeof useRenderTreeLazyQuery>;
export type RenderTreeQueryResult = Apollo.QueryResult<RenderTreeQuery, RenderTreeQueryVariables>;
export const RenderTreesDocument = gql`
    query RenderTrees($filters: RenderTreeFilter, $pagination: OffsetPaginationInput) {
  renderTrees(filters: $filters, pagination: $pagination) {
    ...ListRenderTree
  }
}
    ${ListRenderTreeFragmentDoc}`;

/**
 * __useRenderTreesQuery__
 *
 * To run a query within a React component, call `useRenderTreesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRenderTreesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRenderTreesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useRenderTreesQuery(baseOptions?: Apollo.QueryHookOptions<RenderTreesQuery, RenderTreesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RenderTreesQuery, RenderTreesQueryVariables>(RenderTreesDocument, options);
      }
export function useRenderTreesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RenderTreesQuery, RenderTreesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RenderTreesQuery, RenderTreesQueryVariables>(RenderTreesDocument, options);
        }
export type RenderTreesQueryHookResult = ReturnType<typeof useRenderTreesQuery>;
export type RenderTreesLazyQueryHookResult = ReturnType<typeof useRenderTreesLazyQuery>;
export type RenderTreesQueryResult = Apollo.QueryResult<RenderTreesQuery, RenderTreesQueryVariables>;
export const GetRgbContextDocument = gql`
    query GetRGBContext($id: ID!) {
  rgbcontext(id: $id) {
    ...RGBContext
  }
}
    ${RgbContextFragmentDoc}`;

/**
 * __useGetRgbContextQuery__
 *
 * To run a query within a React component, call `useGetRgbContextQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRgbContextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRgbContextQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRgbContextQuery(baseOptions: Apollo.QueryHookOptions<GetRgbContextQuery, GetRgbContextQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRgbContextQuery, GetRgbContextQueryVariables>(GetRgbContextDocument, options);
      }
export function useGetRgbContextLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRgbContextQuery, GetRgbContextQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRgbContextQuery, GetRgbContextQueryVariables>(GetRgbContextDocument, options);
        }
export type GetRgbContextQueryHookResult = ReturnType<typeof useGetRgbContextQuery>;
export type GetRgbContextLazyQueryHookResult = ReturnType<typeof useGetRgbContextLazyQuery>;
export type GetRgbContextQueryResult = Apollo.QueryResult<GetRgbContextQuery, GetRgbContextQueryVariables>;
export const GetRgbContextsDocument = gql`
    query GetRGBContexts($filters: RGBContextFilter, $pagination: OffsetPaginationInput) {
  rgbcontexts(filters: $filters, pagination: $pagination) {
    ...ListRGBContext
  }
}
    ${ListRgbContextFragmentDoc}`;

/**
 * __useGetRgbContextsQuery__
 *
 * To run a query within a React component, call `useGetRgbContextsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRgbContextsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRgbContextsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetRgbContextsQuery(baseOptions?: Apollo.QueryHookOptions<GetRgbContextsQuery, GetRgbContextsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRgbContextsQuery, GetRgbContextsQueryVariables>(GetRgbContextsDocument, options);
      }
export function useGetRgbContextsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRgbContextsQuery, GetRgbContextsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRgbContextsQuery, GetRgbContextsQueryVariables>(GetRgbContextsDocument, options);
        }
export type GetRgbContextsQueryHookResult = ReturnType<typeof useGetRgbContextsQuery>;
export type GetRgbContextsLazyQueryHookResult = ReturnType<typeof useGetRgbContextsLazyQuery>;
export type GetRgbContextsQueryResult = Apollo.QueryResult<GetRgbContextsQuery, GetRgbContextsQueryVariables>;
export const RgbContextOptionsDocument = gql`
    query RGBContextOptions($search: String, $values: [ID!]) {
  options: rgbcontexts(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useRgbContextOptionsQuery__
 *
 * To run a query within a React component, call `useRgbContextOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRgbContextOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRgbContextOptionsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useRgbContextOptionsQuery(baseOptions?: Apollo.QueryHookOptions<RgbContextOptionsQuery, RgbContextOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RgbContextOptionsQuery, RgbContextOptionsQueryVariables>(RgbContextOptionsDocument, options);
      }
export function useRgbContextOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RgbContextOptionsQuery, RgbContextOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RgbContextOptionsQuery, RgbContextOptionsQueryVariables>(RgbContextOptionsDocument, options);
        }
export type RgbContextOptionsQueryHookResult = ReturnType<typeof useRgbContextOptionsQuery>;
export type RgbContextOptionsLazyQueryHookResult = ReturnType<typeof useRgbContextOptionsLazyQuery>;
export type RgbContextOptionsQueryResult = Apollo.QueryResult<RgbContextOptionsQuery, RgbContextOptionsQueryVariables>;
export const GetStageDocument = gql`
    query GetStage($id: ID!) {
  stage(id: $id) {
    ...Stage
  }
}
    ${StageFragmentDoc}`;

/**
 * __useGetStageQuery__
 *
 * To run a query within a React component, call `useGetStageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStageQuery(baseOptions: Apollo.QueryHookOptions<GetStageQuery, GetStageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStageQuery, GetStageQueryVariables>(GetStageDocument, options);
      }
export function useGetStageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStageQuery, GetStageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStageQuery, GetStageQueryVariables>(GetStageDocument, options);
        }
export type GetStageQueryHookResult = ReturnType<typeof useGetStageQuery>;
export type GetStageLazyQueryHookResult = ReturnType<typeof useGetStageLazyQuery>;
export type GetStageQueryResult = Apollo.QueryResult<GetStageQuery, GetStageQueryVariables>;
export const GetStagesDocument = gql`
    query GetStages($filters: StageFilter, $pagination: OffsetPaginationInput) {
  stages(filters: $filters, pagination: $pagination) {
    ...ListStage
  }
}
    ${ListStageFragmentDoc}`;

/**
 * __useGetStagesQuery__
 *
 * To run a query within a React component, call `useGetStagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStagesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetStagesQuery(baseOptions?: Apollo.QueryHookOptions<GetStagesQuery, GetStagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStagesQuery, GetStagesQueryVariables>(GetStagesDocument, options);
      }
export function useGetStagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStagesQuery, GetStagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStagesQuery, GetStagesQueryVariables>(GetStagesDocument, options);
        }
export type GetStagesQueryHookResult = ReturnType<typeof useGetStagesQuery>;
export type GetStagesLazyQueryHookResult = ReturnType<typeof useGetStagesLazyQuery>;
export type GetStagesQueryResult = Apollo.QueryResult<GetStagesQuery, GetStagesQueryVariables>;
export const StageOptionsDocument = gql`
    query StageOptions($search: String, $values: [ID!]) {
  options: stages(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useStageOptionsQuery__
 *
 * To run a query within a React component, call `useStageOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStageOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStageOptionsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useStageOptionsQuery(baseOptions?: Apollo.QueryHookOptions<StageOptionsQuery, StageOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StageOptionsQuery, StageOptionsQueryVariables>(StageOptionsDocument, options);
      }
export function useStageOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StageOptionsQuery, StageOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StageOptionsQuery, StageOptionsQueryVariables>(StageOptionsDocument, options);
        }
export type StageOptionsQueryHookResult = ReturnType<typeof useStageOptionsQuery>;
export type StageOptionsLazyQueryHookResult = ReturnType<typeof useStageOptionsLazyQuery>;
export type StageOptionsQueryResult = Apollo.QueryResult<StageOptionsQuery, StageOptionsQueryVariables>;
export const GetTableDocument = gql`
    query GetTable($id: ID!) {
  table(id: $id) {
    ...Table
  }
}
    ${TableFragmentDoc}`;

/**
 * __useGetTableQuery__
 *
 * To run a query within a React component, call `useGetTableQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTableQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTableQuery(baseOptions: Apollo.QueryHookOptions<GetTableQuery, GetTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTableQuery, GetTableQueryVariables>(GetTableDocument, options);
      }
export function useGetTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTableQuery, GetTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTableQuery, GetTableQueryVariables>(GetTableDocument, options);
        }
export type GetTableQueryHookResult = ReturnType<typeof useGetTableQuery>;
export type GetTableLazyQueryHookResult = ReturnType<typeof useGetTableLazyQuery>;
export type GetTableQueryResult = Apollo.QueryResult<GetTableQuery, GetTableQueryVariables>;