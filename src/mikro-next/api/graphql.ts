import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@/lib/mikro/funcs';
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
  Metric: { input: any; output: any; }
  MetricMap: { input: any; output: any; }
  Micrometers: { input: any; output: any; }
  Milliseconds: { input: any; output: any; }
  ParquetLike: { input: any; output: any; }
  ThreeDVector: { input: any; output: any; }
  UntypedPlateChild: { input: any; output: any; }
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

export type AttachEntityMetricInput = {
  dataKind?: InputMaybe<MetricDataType>;
  entity: Scalars['ID']['input'];
  kind?: InputMaybe<Scalars['ID']['input']>;
  kindName?: InputMaybe<Scalars['String']['input']>;
  metric?: InputMaybe<Scalars['ID']['input']>;
  value: Scalars['Metric']['input'];
};

export type AttachMetricsToEntitiesMetricInput = {
  metric?: InputMaybe<Scalars['ID']['input']>;
  pairs: Array<EntityValuePairInput>;
};

export type AttachRelationMetricInput = {
  dataKind?: InputMaybe<MetricDataType>;
  kind?: InputMaybe<Scalars['ID']['input']>;
  kindName?: InputMaybe<Scalars['String']['input']>;
  metric?: InputMaybe<Scalars['ID']['input']>;
  relation: Scalars['ID']['input'];
  value: Scalars['Metric']['input'];
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
  Intensity = 'INTENSITY',
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
  views?: InputMaybe<Array<PartialRgbViewInput>>;
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

export type DeleteCameraInput = {
  id: Scalars['ID']['input'];
};

export type DeleteChannelInput = {
  id: Scalars['ID']['input'];
};

export type DeleteDatasetInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEntityGroupInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEntityInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEntityKindInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEraInput = {
  id: Scalars['ID']['input'];
};

export type DeleteExperimentInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFileInput = {
  id: Scalars['ID']['input'];
};

export type DeleteImageInput = {
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

export type DeleteOntologyInput = {
  id: Scalars['ID']['input'];
};

export type DeleteProtocolInput = {
  id: Scalars['ID']['input'];
};

export type DeleteProtocolStepInput = {
  id: Scalars['ID']['input'];
};

export type DeleteRgbContextInput = {
  id: Scalars['ID']['input'];
};

export type DeleteRenderedPlot = {
  id: Scalars['ID']['input'];
};

export type DeleteRoiInput = {
  id: Scalars['ID']['input'];
};

export type DeleteSpecimenInput = {
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

export type Entity = {
  __typename?: 'Entity';
  epitope?: Maybe<Scalars['String']['output']>;
  group: EntityGroup;
  id: Scalars['ID']['output'];
  index: Scalars['Int']['output'];
  kind: EntityKind;
  metricMap: Scalars['MetricMap']['output'];
  metrics: Array<MetricAssociation>;
  name: Scalars['String']['output'];
  parent?: Maybe<Entity>;
  relations: Array<EntityRelation>;
  specimens: Array<Specimen>;
};


export type EntityMetricMapArgs = {
  metrics?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type EntityMetricsArgs = {
  metrics?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type EntityRelationsArgs = {
  filters?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type EntitySpecimensArgs = {
  filters?: InputMaybe<SpecimenFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type EntityFilter = {
  AND?: InputMaybe<EntityFilter>;
  OR?: InputMaybe<EntityFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kinds?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EntityGraph = {
  __typename?: 'EntityGraph';
  edges: Array<EntityRelationEdge>;
  nodes: Array<EntityNode>;
};

export type EntityGroup = {
  __typename?: 'EntityGroup';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type EntityGroupFilter = {
  AND?: InputMaybe<EntityGroupFilter>;
  OR?: InputMaybe<EntityGroupFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EntityGroupInput = {
  image?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type EntityInput = {
  group?: InputMaybe<Scalars['ID']['input']>;
  instanceKind?: InputMaybe<Scalars['String']['input']>;
  kind: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
};

export type EntityKind = {
  __typename?: 'EntityKind';
  color: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  entities: Array<Entity>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  ontology: Ontology;
  purl?: Maybe<Scalars['String']['output']>;
};


export type EntityKindEntitiesArgs = {
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type EntityKindFilter = {
  AND?: InputMaybe<EntityKindFilter>;
  OR?: InputMaybe<EntityKindFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  image?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EntityKindInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  ontology?: InputMaybe<Scalars['ID']['input']>;
  purl?: InputMaybe<Scalars['String']['input']>;
};

export type EntityKindNode = {
  __typename?: 'EntityKindNode';
  id: Scalars['String']['output'];
  label: Scalars['String']['output'];
  metrics: Array<EntityKindNodeMetric>;
};

export type EntityKindNodeMetric = {
  __typename?: 'EntityKindNodeMetric';
  dataKind: Scalars['String']['output'];
  kind: Scalars['String']['output'];
};

export type EntityKindRelationEdge = {
  __typename?: 'EntityKindRelationEdge';
  id: Scalars['String']['output'];
  label: Scalars['String']['output'];
  metrics: Array<EntityKindNodeMetric>;
  source: Scalars['String']['output'];
  target: Scalars['String']['output'];
};

export type EntityMetric = {
  __typename?: 'EntityMetric';
  dataKind: MetricDataType;
  id: Scalars['ID']['output'];
  kind: EntityKind;
  label: Scalars['String']['output'];
};

export type EntityMetricFilter = {
  AND?: InputMaybe<EntityMetricFilter>;
  OR?: InputMaybe<EntityMetricFilter>;
  dataKind?: InputMaybe<MetricDataType>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind?: InputMaybe<Scalars['ID']['input']>;
  kindLabel?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EntityMetricInput = {
  dataKind: MetricDataType;
  kind: Scalars['ID']['input'];
};

export type EntityNode = {
  __typename?: 'EntityNode';
  color: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isRoot: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  metrics: Array<EntityNodeMetric>;
  subtitle: Scalars['String']['output'];
};

export type EntityNodeMetric = {
  __typename?: 'EntityNodeMetric';
  dataKind: Scalars['String']['output'];
  kind: Scalars['String']['output'];
  metricId: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type EntityRelation = {
  __typename?: 'EntityRelation';
  id: Scalars['ID']['output'];
  kind: EntityRelationKind;
  label: Scalars['String']['output'];
  left: Entity;
  right: Entity;
};

export type EntityRelationEdge = {
  __typename?: 'EntityRelationEdge';
  id: Scalars['String']['output'];
  label: Scalars['String']['output'];
  metrics: Array<EntityNodeMetric>;
  source: Scalars['String']['output'];
  target: Scalars['String']['output'];
};

export type EntityRelationFilter = {
  AND?: InputMaybe<EntityRelationFilter>;
  OR?: InputMaybe<EntityRelationFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  left?: InputMaybe<Scalars['ID']['input']>;
  leftKind?: InputMaybe<Scalars['ID']['input']>;
  right?: InputMaybe<Scalars['ID']['input']>;
  rightKind?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EntityRelationInput = {
  kind: Scalars['ID']['input'];
  left: Scalars['ID']['input'];
  right: Scalars['ID']['input'];
};

export type EntityRelationKind = {
  __typename?: 'EntityRelationKind';
  id: Scalars['ID']['output'];
  kind: EntityKind;
  label: Scalars['String']['output'];
  leftKind: EntityKind;
  rightKind: EntityKind;
};

export type EntityRelationKindFilter = {
  AND?: InputMaybe<EntityRelationKindFilter>;
  OR?: InputMaybe<EntityRelationKindFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EntityRelationKindInput = {
  kind: Scalars['ID']['input'];
  leftKind: Scalars['ID']['input'];
  rightKind: Scalars['ID']['input'];
};

export type EntityValuePairInput = {
  entity: Scalars['ID']['input'];
  value: Scalars['Metric']['input'];
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

export type Experiment = {
  __typename?: 'Experiment';
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  history: Array<History>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  protocols: Array<Protocol>;
};


export type ExperimentHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ExperimentProtocolsArgs = {
  filters?: InputMaybe<ProtocolFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ExperimentFilter = {
  AND?: InputMaybe<ExperimentFilter>;
  OR?: InputMaybe<ExperimentFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ExperimentInput = {
  description?: InputMaybe<Scalars['String']['input']>;
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

export type FileEvent = {
  __typename?: 'FileEvent';
  create?: Maybe<File>;
  delete?: Maybe<Scalars['ID']['output']>;
  moved?: Maybe<File>;
  update?: Maybe<File>;
};

export type FileFilter = {
  AND?: InputMaybe<FileFilter>;
  OR?: InputMaybe<FileFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  provenance?: InputMaybe<ProvenanceFilter>;
  search?: InputMaybe<Scalars['String']['input']>;
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

export type FromArrayLikeInput = {
  acquisitionViews?: InputMaybe<Array<PartialAcquisitionViewInput>>;
  array: Scalars['ArrayLike']['input'];
  channelViews?: InputMaybe<Array<PartialChannelViewInput>>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
  fileOrigins?: InputMaybe<Array<Scalars['ID']['input']>>;
  name: Scalars['String']['input'];
  opticsViews?: InputMaybe<Array<PartialOpticsViewInput>>;
  origins?: InputMaybe<Array<Scalars['ID']['input']>>;
  pixelViews?: InputMaybe<Array<PartialPixelViewInput>>;
  rgbViews?: InputMaybe<Array<PartialRgbViewInput>>;
  roiOrigins?: InputMaybe<Array<Scalars['ID']['input']>>;
  scaleViews?: InputMaybe<Array<PartialScaleViewInput>>;
  specimenViews?: InputMaybe<Array<PartialSpecimenViewInput>>;
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
  derivedScaleViews: Array<ScaleView>;
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
  scaleViews: Array<ScaleView>;
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


export type ImageRoiOriginsArgs = {
  filters?: InputMaybe<RoiFilter>;
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

export type ImageEvent = {
  __typename?: 'ImageEvent';
  create?: Maybe<Image>;
  delete?: Maybe<Scalars['ID']['output']>;
  update?: Maybe<Image>;
};

export type ImageFilter = {
  AND?: InputMaybe<ImageFilter>;
  OR?: InputMaybe<ImageFilter>;
  dataset?: InputMaybe<DatasetFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  notDerived?: InputMaybe<Scalars['Boolean']['input']>;
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

export type KnowledgeGraph = {
  __typename?: 'KnowledgeGraph';
  edges: Array<EntityKindRelationEdge>;
  nodes: Array<EntityKindNode>;
};

export type LabelView = View & {
  __typename?: 'LabelView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  acquisitionMode?: Maybe<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  fluorophore?: Maybe<Entity>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  primaryAntibody?: Maybe<Entity>;
  secondaryAntibody?: Maybe<Entity>;
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

export type MapProtocolStepInput = {
  protocol: Scalars['ID']['input'];
  step: Scalars['ID']['input'];
  t: Scalars['Int']['input'];
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

export type MetricAssociation = {
  __typename?: 'MetricAssociation';
  metric: EntityMetric;
  value: Scalars['String']['output'];
};

export enum MetricDataType {
  Datetime = 'DATETIME',
  Float = 'FLOAT',
  Int = 'INT',
  String = 'STRING'
}

export type ModelChange = {
  __typename?: 'ModelChange';
  field: Scalars['String']['output'];
  newValue?: Maybe<Scalars['String']['output']>;
  oldValue?: Maybe<Scalars['String']['output']>;
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
  attachEntityMetric: Entity;
  attachMetricsToEntities: Array<Entity>;
  attachRelationMetric: EntityRelation;
  createAffineTransformationView: AffineTransformationView;
  createCamera: Camera;
  createChannel: Channel;
  createChannelView: ChannelView;
  createContinousScanView: ContinousScanView;
  createDataset: Dataset;
  createEntity: Entity;
  createEntityGroup: Entity;
  createEntityKind: EntityKind;
  createEntityMetric: EntityMetric;
  createEntityRelation: EntityRelation;
  createEntityRelationKind: EntityRelationKind;
  createEra: Era;
  createExperiment: Experiment;
  createInstrument: Instrument;
  createLabelView: LabelView;
  createMultiWellPlate: MultiWellPlate;
  createObjective: Objective;
  createOntology: Ontology;
  createOpticsView: OpticsView;
  createProtocol: Protocol;
  createProtocolStep: ProtocolStep;
  createRelationMetric: RelationMetric;
  createRenderTree: RenderTree;
  createRenderedPlot: RenderedPlot;
  createRgbContext: RgbContext;
  createRgbView: RgbView;
  createRoi: Roi;
  createSnapshot: Snapshot;
  createSpecimen: Specimen;
  createSpecimenView: SpecimenView;
  createStage: Stage;
  createTimepointView: TimepointView;
  createViewCollection: ViewCollection;
  createWellPositionView: WellPositionView;
  deleteAffineTransformationView: Scalars['ID']['output'];
  deleteCamera: Scalars['ID']['output'];
  deleteChannel: Scalars['ID']['output'];
  deleteChannelView: Scalars['ID']['output'];
  deleteDataset: Scalars['ID']['output'];
  deleteEntity: Scalars['ID']['output'];
  deleteEntityGroup: Scalars['ID']['output'];
  deleteEntityKind: Scalars['ID']['output'];
  deleteEra: Scalars['ID']['output'];
  deleteExperiment: Scalars['ID']['output'];
  deleteFile: Scalars['ID']['output'];
  deleteImage: Scalars['ID']['output'];
  deleteInstrument: Scalars['ID']['output'];
  deleteMultiWellPlate: Scalars['ID']['output'];
  deleteObjective: Scalars['ID']['output'];
  deleteOntology: Scalars['ID']['output'];
  deleteOpticsView: Scalars['ID']['output'];
  deleteProtocol: Scalars['ID']['output'];
  deleteProtocolStep: Scalars['ID']['output'];
  deleteRgbContext: Scalars['ID']['output'];
  deleteRgbView: Scalars['ID']['output'];
  deleteRoi: Scalars['ID']['output'];
  deleteSnapshot: Scalars['ID']['output'];
  deleteSpecimen: Scalars['ID']['output'];
  deleteStage: Scalars['ID']['output'];
  deleteTimepointView: Scalars['ID']['output'];
  deleteView: Scalars['ID']['output'];
  deleteViewCollection: Scalars['ID']['output'];
  ensureCamera: Camera;
  ensureChannel: Channel;
  ensureInstrument: Instrument;
  ensureMultiWellPlate: MultiWellPlate;
  ensureObjective: Objective;
  fromArrayLike: Image;
  fromFileLike: File;
  fromParquetLike: Table;
  mapProtocolStep: ProtocolStepMapping;
  pinCamera: Camera;
  pinChannel: Channel;
  pinDataset: Dataset;
  pinEra: Era;
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
  requestFileUploadPresigned: PresignedPostCredentials;
  requestMediaUpload: PresignedPostCredentials;
  requestTableAccess: AccessCredentials;
  requestTableUpload: Credentials;
  requestUpload: Credentials;
  revertDataset: Dataset;
  updateDataset: Dataset;
  updateExperiment: Experiment;
  updateImage: Image;
  updateProtocolStep: ProtocolStep;
  /** Update RGB Context */
  updateRgbContext: RgbContext;
};


export type MutationAttachEntityMetricArgs = {
  input: AttachEntityMetricInput;
};


export type MutationAttachMetricsToEntitiesArgs = {
  input: AttachMetricsToEntitiesMetricInput;
};


export type MutationAttachRelationMetricArgs = {
  input: AttachRelationMetricInput;
};


export type MutationCreateAffineTransformationViewArgs = {
  input: AffineTransformationViewInput;
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


export type MutationCreateEntityArgs = {
  input: EntityInput;
};


export type MutationCreateEntityGroupArgs = {
  input: EntityGroupInput;
};


export type MutationCreateEntityKindArgs = {
  input: EntityKindInput;
};


export type MutationCreateEntityMetricArgs = {
  input: EntityMetricInput;
};


export type MutationCreateEntityRelationArgs = {
  input: EntityRelationInput;
};


export type MutationCreateEntityRelationKindArgs = {
  input: EntityRelationKindInput;
};


export type MutationCreateEraArgs = {
  input: EraInput;
};


export type MutationCreateExperimentArgs = {
  input: ExperimentInput;
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


export type MutationCreateOntologyArgs = {
  input: OntologyInput;
};


export type MutationCreateOpticsViewArgs = {
  input: OpticsViewInput;
};


export type MutationCreateProtocolArgs = {
  input: ProtocolInput;
};


export type MutationCreateProtocolStepArgs = {
  input: ProtocolStepInput;
};


export type MutationCreateRelationMetricArgs = {
  input: RelationMetricInput;
};


export type MutationCreateRenderTreeArgs = {
  input: RenderTreeInput;
};


export type MutationCreateRenderedPlotArgs = {
  input: RenderedPlotInput;
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


export type MutationCreateSpecimenArgs = {
  input: SpecimenInput;
};


export type MutationCreateSpecimenViewArgs = {
  input: SpecimenViewInput;
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


export type MutationDeleteEntityArgs = {
  input: DeleteEntityInput;
};


export type MutationDeleteEntityGroupArgs = {
  input: DeleteEntityGroupInput;
};


export type MutationDeleteEntityKindArgs = {
  input: DeleteEntityKindInput;
};


export type MutationDeleteEraArgs = {
  input: DeleteEraInput;
};


export type MutationDeleteExperimentArgs = {
  input: DeleteExperimentInput;
};


export type MutationDeleteFileArgs = {
  input: DeleteFileInput;
};


export type MutationDeleteImageArgs = {
  input: DeleteImageInput;
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


export type MutationDeleteOntologyArgs = {
  input: DeleteOntologyInput;
};


export type MutationDeleteOpticsViewArgs = {
  input: DeleteViewInput;
};


export type MutationDeleteProtocolArgs = {
  input: DeleteProtocolInput;
};


export type MutationDeleteProtocolStepArgs = {
  input: DeleteProtocolStepInput;
};


export type MutationDeleteRgbContextArgs = {
  input: DeleteRgbContextInput;
};


export type MutationDeleteRgbViewArgs = {
  input: DeleteViewInput;
};


export type MutationDeleteRoiArgs = {
  input: DeleteRoiInput;
};


export type MutationDeleteSnapshotArgs = {
  input: DeleteRenderedPlot;
};


export type MutationDeleteSpecimenArgs = {
  input: DeleteSpecimenInput;
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


export type MutationEnsureCameraArgs = {
  input: CameraInput;
};


export type MutationEnsureChannelArgs = {
  input: ChannelInput;
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


export type MutationMapProtocolStepArgs = {
  input: MapProtocolStepInput;
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


export type MutationRequestFileUploadPresignedArgs = {
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


export type MutationUpdateExperimentArgs = {
  input: UpdateExperimentInput;
};


export type MutationUpdateImageArgs = {
  input: UpdateImageInput;
};


export type MutationUpdateProtocolStepArgs = {
  input: UpdateProtocolStepInput;
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

export type Ontology = {
  __typename?: 'Ontology';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  purl?: Maybe<Scalars['String']['output']>;
};

export type OntologyFilter = {
  AND?: InputMaybe<OntologyFilter>;
  OR?: InputMaybe<OntologyFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type OntologyInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  purl?: InputMaybe<Scalars['String']['input']>;
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

export type Overlay = {
  __typename?: 'Overlay';
  color: Scalars['String']['output'];
  identifier: Scalars['String']['output'];
  object: Scalars['String']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type OverlayInput = {
  color: Scalars['String']['input'];
  identifier: Scalars['String']['input'];
  object: Scalars['String']['input'];
  x: Scalars['Int']['input'];
  y: Scalars['Int']['input'];
};

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

export type PartialPixelViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  linkedView?: InputMaybe<Scalars['ID']['input']>;
  rangeLabels?: InputMaybe<Array<RangePixelLabel>>;
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
  active?: InputMaybe<Scalars['Boolean']['input']>;
  baseColor?: InputMaybe<Array<Scalars['Float']['input']>>;
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  colorMap?: InputMaybe<ColorMap>;
  context?: InputMaybe<Scalars['ID']['input']>;
  contrastLimitMax?: InputMaybe<Scalars['Float']['input']>;
  contrastLimitMin?: InputMaybe<Scalars['Float']['input']>;
  gamma?: InputMaybe<Scalars['Float']['input']>;
  rescale?: InputMaybe<Scalars['Boolean']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialScaleViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  scaleC?: InputMaybe<Scalars['Float']['input']>;
  scaleT?: InputMaybe<Scalars['Float']['input']>;
  scaleX?: InputMaybe<Scalars['Float']['input']>;
  scaleY?: InputMaybe<Scalars['Float']['input']>;
  scaleZ?: InputMaybe<Scalars['Float']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialSpecimenViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  specimen?: InputMaybe<Scalars['ID']['input']>;
  step?: InputMaybe<Scalars['ID']['input']>;
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

export type PlateChildInput = {
  backgroundColor?: InputMaybe<Scalars['String']['input']>;
  bold?: InputMaybe<Scalars['Boolean']['input']>;
  children?: InputMaybe<Array<PlateChildInput>>;
  color?: InputMaybe<Scalars['String']['input']>;
  fontSize?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  italic?: InputMaybe<Scalars['Boolean']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  underline?: InputMaybe<Scalars['Boolean']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type Plot = {
  entity?: Maybe<Entity>;
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

export type Protocol = {
  __typename?: 'Protocol';
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  experiment: Experiment;
  history: Array<History>;
  id: Scalars['ID']['output'];
  mappings: Array<ProtocolStepMapping>;
  name: Scalars['String']['output'];
};


export type ProtocolHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ProtocolMappingsArgs = {
  filters?: InputMaybe<ProtocolStepMappingFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ProtocolFilter = {
  AND?: InputMaybe<ProtocolFilter>;
  OR?: InputMaybe<ProtocolFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ProtocolInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  experiment: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type ProtocolStep = {
  __typename?: 'ProtocolStep';
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  history: Array<History>;
  id: Scalars['ID']['output'];
  kind: EntityKind;
  mappings: Array<ProtocolStepMapping>;
  name: Scalars['String']['output'];
  plateChildren: Array<Scalars['UntypedPlateChild']['output']>;
  reagents: Array<Entity>;
  views: Array<SpecimenView>;
};


export type ProtocolStepHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ProtocolStepMappingsArgs = {
  filters?: InputMaybe<ProtocolStepMappingFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ProtocolStepReagentsArgs = {
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ProtocolStepViewsArgs = {
  filters?: InputMaybe<SpecimenFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ProtocolStepFilter = {
  AND?: InputMaybe<ProtocolStepFilter>;
  OR?: InputMaybe<ProtocolStepFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  protocol?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ProtocolStepInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  kind: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  plateChildren?: InputMaybe<Array<PlateChildInput>>;
  reagents?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type ProtocolStepMapping = {
  __typename?: 'ProtocolStepMapping';
  id: Scalars['ID']['output'];
  protocol: Protocol;
  step: ProtocolStep;
  t?: Maybe<Scalars['Int']['output']>;
};

export type ProtocolStepMappingFilter = {
  AND?: InputMaybe<ProtocolStepMappingFilter>;
  OR?: InputMaybe<ProtocolStepMappingFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
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
  camera: Camera;
  channelViews: Array<ChannelView>;
  channels: Array<Channel>;
  continousScanViews: Array<ContinousScanView>;
  dataset: Dataset;
  datasets: Array<Dataset>;
  entities: Array<Entity>;
  entity: Entity;
  entityGraph: EntityGraph;
  entityGroup: EntityGroup;
  entityGroups: Array<EntityGroup>;
  entityKind: EntityKind;
  entityKinds: Array<EntityKind>;
  entityMetric: EntityMetric;
  entityMetrics: Array<EntityMetric>;
  entityRelation: EntityRelation;
  entityRelationKind: EntityRelationKind;
  entityRelationKinds: Array<EntityRelationKind>;
  entityRelations: Array<EntityRelation>;
  eras: Array<Era>;
  experiment: Experiment;
  experiments: Array<Experiment>;
  file: File;
  files: Array<File>;
  image: Image;
  images: Array<Image>;
  instrument: Instrument;
  instruments: Array<Instrument>;
  knowledgeGraph: KnowledgeGraph;
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
  ontologies: Array<Ontology>;
  ontology: Ontology;
  protocol: Protocol;
  protocolStep: ProtocolStep;
  protocolStepMappings: Array<ProtocolStepMapping>;
  protocolSteps: Array<ProtocolStep>;
  protocols: Array<Protocol>;
  randomImage: Image;
  relationMetric: RelationMetric;
  relationMetrics: Array<RelationMetric>;
  renderTree: RenderTree;
  renderTrees: Array<RenderTree>;
  renderedPlot: RenderedPlot;
  renderedPlots: Array<RenderedPlot>;
  rgbViews: Array<RgbView>;
  rgbcontext: RgbContext;
  rgbcontexts: Array<RgbContext>;
  roi: Roi;
  rois: Array<Roi>;
  scaleViews: Array<ScaleView>;
  snapshot: Snapshot;
  snapshots: Array<Snapshot>;
  specimen: Specimen;
  specimenViews: Array<SpecimenView>;
  specimens: Array<Specimen>;
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


export type QueryEntitiesArgs = {
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityGraphArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityGroupsArgs = {
  filters?: InputMaybe<EntityGroupFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEntityKindArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityKindsArgs = {
  filters?: InputMaybe<EntityKindFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEntityMetricArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityMetricsArgs = {
  filters?: InputMaybe<EntityMetricFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEntityRelationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityRelationKindArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityRelationKindsArgs = {
  filters?: InputMaybe<EntityRelationKindFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEntityRelationsArgs = {
  filters?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryErasArgs = {
  filters?: InputMaybe<EraFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryExperimentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExperimentsArgs = {
  filters?: InputMaybe<ExperimentFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryFileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFilesArgs = {
  filters?: InputMaybe<FileFilter>;
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


export type QueryKnowledgeGraphArgs = {
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
  filters?: InputMaybe<TableFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryObjectiveArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOntologiesArgs = {
  filters?: InputMaybe<OntologyFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryOntologyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProtocolArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProtocolStepArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProtocolStepMappingsArgs = {
  filters?: InputMaybe<ProtocolStepMappingFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryProtocolStepsArgs = {
  filters?: InputMaybe<ProtocolStepFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryProtocolsArgs = {
  filters?: InputMaybe<ProtocolFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRelationMetricArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRelationMetricsArgs = {
  filters?: InputMaybe<EntityMetricFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRenderTreeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRenderTreesArgs = {
  filters?: InputMaybe<RenderTreeFilter>;
  order?: InputMaybe<RenderTreeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRenderedPlotArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRenderedPlotsArgs = {
  filters?: InputMaybe<RenderedPlotFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRgbcontextArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRgbcontextsArgs = {
  filters?: InputMaybe<RgbContextFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRoiArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoisArgs = {
  filters?: InputMaybe<RoiFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QuerySnapshotArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySnapshotsArgs = {
  filters?: InputMaybe<SnapshotFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QuerySpecimenArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySpecimenViewsArgs = {
  filters?: InputMaybe<SpecimenFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QuerySpecimensArgs = {
  filters?: InputMaybe<SpecimenFilter>;
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
  filters?: InputMaybe<TableFilter>;
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

export type RgbView = View & {
  __typename?: 'RGBView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  active: Scalars['Boolean']['output'];
  baseColor?: Maybe<Array<Scalars['Int']['output']>>;
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
  active?: InputMaybe<Scalars['Boolean']['input']>;
  baseColor?: InputMaybe<Array<Scalars['Float']['input']>>;
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  colorMap?: InputMaybe<ColorMap>;
  context: Scalars['ID']['input'];
  contrastLimitMax?: InputMaybe<Scalars['Float']['input']>;
  contrastLimitMin?: InputMaybe<Scalars['Float']['input']>;
  gamma?: InputMaybe<Scalars['Float']['input']>;
  image: Scalars['ID']['input'];
  rescale?: InputMaybe<Scalars['Boolean']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
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
  __typename?: 'ROI';
  entity?: Maybe<Entity>;
  id: Scalars['ID']['output'];
  image: Image;
  kind: RoiKind;
  vectors: Array<Scalars['FiveDVector']['output']>;
};

export type RoiFilter = {
  AND?: InputMaybe<RoiFilter>;
  OR?: InputMaybe<RoiFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Scalars['ID']['input']>;
  kind?: InputMaybe<RoiKindChoices>;
};

export type RangePixelLabel = {
  entityKind: Scalars['ID']['input'];
  group?: InputMaybe<Scalars['ID']['input']>;
  max: Scalars['Int']['input'];
  min: Scalars['Int']['input'];
};

export type RelateToDatasetInput = {
  id: Scalars['ID']['input'];
  other: Scalars['ID']['input'];
};

export type RelationMetric = {
  __typename?: 'RelationMetric';
  dataKind: MetricDataType;
  id: Scalars['ID']['output'];
  kind: EntityKind;
  label: Scalars['String']['output'];
};

export type RelationMetricInput = {
  dataKind: MetricDataType;
  kind: Scalars['ID']['input'];
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

export type RenderedPlot = Plot & {
  __typename?: 'RenderedPlot';
  description?: Maybe<Scalars['String']['output']>;
  entity?: Maybe<Entity>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  overlays?: Maybe<Array<Overlay>>;
  store: MediaStore;
};

export type RenderedPlotFilter = {
  AND?: InputMaybe<RenderedPlotFilter>;
  OR?: InputMaybe<RenderedPlotFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type RenderedPlotInput = {
  name: Scalars['String']['input'];
  overlays?: InputMaybe<Array<OverlayInput>>;
  plot: Scalars['Upload']['input'];
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

export type RoiEvent = {
  __typename?: 'RoiEvent';
  create?: Maybe<Roi>;
  delete?: Maybe<Scalars['ID']['output']>;
  update?: Maybe<Roi>;
};

export type RoiInput = {
  entity?: InputMaybe<Scalars['ID']['input']>;
  entityGroup?: InputMaybe<Scalars['ID']['input']>;
  entityKind?: InputMaybe<Scalars['ID']['input']>;
  entityParent?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  kind: RoiKind;
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
  TemporalRectangle = 'TEMPORAL_RECTANGLE'
}

export enum RoiKindChoices {
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

export type ScaleView = View & {
  __typename?: 'ScaleView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  parent: Image;
  scaleC: Scalars['Float']['output'];
  scaleT: Scalars['Float']['output'];
  scaleX: Scalars['Float']['output'];
  scaleY: Scalars['Float']['output'];
  scaleZ: Scalars['Float']['output'];
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};

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

export type Specimen = {
  __typename?: 'Specimen';
  entity: Entity;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  protocol: Protocol;
};

export type SpecimenFilter = {
  AND?: InputMaybe<SpecimenFilter>;
  OR?: InputMaybe<SpecimenFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SpecimenInput = {
  entity: Scalars['ID']['input'];
  protocol?: InputMaybe<Scalars['ID']['input']>;
};

export type SpecimenView = View & {
  __typename?: 'SpecimenView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  specimen: Specimen;
  step?: Maybe<ProtocolStep>;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};

export type SpecimenViewInput = {
  cMax?: InputMaybe<Scalars['Int']['input']>;
  cMin?: InputMaybe<Scalars['Int']['input']>;
  collection?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  specimen?: InputMaybe<Scalars['ID']['input']>;
  step?: InputMaybe<Scalars['ID']['input']>;
  tMax?: InputMaybe<Scalars['Int']['input']>;
  tMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  zMax?: InputMaybe<Scalars['Int']['input']>;
  zMin?: InputMaybe<Scalars['Int']['input']>;
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
  files: FileEvent;
  historyEvents: Image;
  images: ImageEvent;
  rois: RoiEvent;
};


export type SubscriptionFilesArgs = {
  dataset?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionHistoryEventsArgs = {
  user: Scalars['String']['input'];
};


export type SubscriptionImagesArgs = {
  dataset?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionRoisArgs = {
  image: Scalars['ID']['input'];
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

export type TableFilter = {
  AND?: InputMaybe<TableFilter>;
  OR?: InputMaybe<TableFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
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

export type UpdateExperimentInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateImageInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateProtocolStepInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  kind?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  plateChildren?: InputMaybe<Array<PlateChildInput>>;
  reagents?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateRgbContextInput = {
  c?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  t?: InputMaybe<Scalars['Int']['input']>;
  thumbnail?: InputMaybe<Scalars['ID']['input']>;
  views?: InputMaybe<Array<PartialRgbViewInput>>;
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

export type CameraFragment = { __typename?: 'Camera', sensorSizeX?: number | null, sensorSizeY?: number | null, pixelSizeX?: any | null, pixelSizeY?: any | null, name: string, serialNumber: string };

export type ChannelFragment = { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null };

export type CredentialsFragment = { __typename?: 'Credentials', accessKey: string, status: string, secretKey: string, bucket: string, key: string, sessionToken: string, store: string };

export type AccessCredentialsFragment = { __typename?: 'AccessCredentials', accessKey: string, secretKey: string, bucket: string, key: string, sessionToken: string, path: string };

export type PresignedPostCredentialsFragment = { __typename?: 'PresignedPostCredentials', xAmzAlgorithm: string, xAmzCredential: string, xAmzDate: string, xAmzSignature: string, key: string, bucket: string, datalayer: string, policy: string, store: string };

export type DatasetFragment = { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null };

export type ListDatasetFragment = { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean };

export type EntityFragment = { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> };

export type EntityGraphFragment = { __typename?: 'EntityGraph', nodes: Array<{ __typename?: 'EntityNode', id: string, label: string, color: string, isRoot: boolean, subtitle: string, metrics: Array<{ __typename?: 'EntityNodeMetric', kind: string, dataKind: string, value: string }> }>, edges: Array<{ __typename?: 'EntityRelationEdge', id: string, label: string, source: string, target: string, metrics: Array<{ __typename?: 'EntityNodeMetric', kind: string, dataKind: string, value: string }> }> };

export type EntityKindFragment = { __typename?: 'EntityKind', id: string, label: string, description?: string | null, purl?: string | null, ontology: { __typename?: 'Ontology', id: string, name: string }, entities: Array<{ __typename?: 'Entity', id: string, name: string }> };

export type EntityMetricFragment = { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } } };

export type EraFragment = { __typename?: 'Era', id: string, begin?: any | null, name: string };

export type ExperimentFragment = { __typename?: 'Experiment', id: string, name: string, description?: string | null, createdAt: any, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, protocols: Array<{ __typename?: 'Protocol', id: string, name: string, experiment: { __typename?: 'Experiment', id: string, name: string } }> };

export type ListExperimentFragment = { __typename?: 'Experiment', id: string, name: string, description?: string | null, protocols: Array<{ __typename?: 'Protocol', id: string, name: string }> };

export type FileFragment = { __typename?: 'File', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'BigFileStore', id: string, key: string, bucket: string, path: string } };

export type ListFileFragment = { __typename?: 'File', id: string, name: string };

export type HistoryFragment = { __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> };

export type ImageFragment = { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, views: Array<{ __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null } | { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } } | { __typename?: 'ChannelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channel: { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null } } | { __typename?: 'ContinousScanView' } | { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null, primaryAntibody?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null, secondaryAntibody?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null } | { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null } | { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } | { __typename?: 'ScaleView' } | { __typename?: 'SpecimenView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string }, group: { __typename?: 'EntityGroup', id: string } }, protocol: { __typename?: 'Protocol', id: string } }, step?: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, kind: { __typename?: 'EntityKind', label: string }, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }> } | null } | { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } } | { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, creator?: { __typename?: 'User', sub: string } | null, metrics: Array<{ __typename?: 'ImageIntMetric', id: string, value: number }>, roiOrigins: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string }, entity?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string }, parent?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string } } | null } | null }>, fileOrigins: Array<{ __typename?: 'File', id: string, name: string }>, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }>, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string }, entity?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string }, parent?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string } } | null } | null }> };

export type ListImageFragment = { __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null };

export type InstrumentFragment = { __typename?: 'Instrument', model?: string | null, name: string, serialNumber: string };

export type KnowledgeGraphFragment = { __typename?: 'KnowledgeGraph', nodes: Array<{ __typename?: 'EntityKindNode', id: string, label: string, metrics: Array<{ __typename?: 'EntityKindNodeMetric', kind: string, dataKind: string }> }>, edges: Array<{ __typename?: 'EntityKindRelationEdge', id: string, label: string, source: string, target: string, metrics: Array<{ __typename?: 'EntityKindNodeMetric', kind: string, dataKind: string }> }> };

export type ImageIntMetricFragment = { __typename?: 'ImageIntMetric', id: string, value: number };

export type ImageMetricFragment = { __typename?: 'ImageIntMetric', id: string, value: number };

export type MultiWellPlateFragment = { __typename?: 'MultiWellPlate', id: string, name?: string | null, views: Array<{ __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }> };

export type ListMultiWellPlateFragment = { __typename?: 'MultiWellPlate', id: string, name?: string | null };

export type ObjectiveFragment = { __typename?: 'Objective', na?: number | null, name: string, serialNumber: string };

export type OntologyFragment = { __typename?: 'Ontology', id: string, name: string };

export type ListOntologyFragment = { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null };

export type ProtocolFragment = { __typename?: 'Protocol', id: string, name: string, description?: string | null, experiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null }, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, step: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, kind: { __typename?: 'EntityKind', label: string }, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, protocol: { __typename?: 'Protocol', id: string, name: string } }>, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }>, views: Array<{ __typename?: 'SpecimenView', id: string, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string } }, image: { __typename?: 'Image', id: string, name: string } }> } }> };

export type ListProtocolFragment = { __typename?: 'Protocol', id: string, name: string, experiment: { __typename?: 'Experiment', id: string, name: string } };

export type ProtocolStepFragment = { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, plateChildren: Array<any>, kind: { __typename?: 'EntityKind', label: string }, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }>, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, protocol: { __typename?: 'Protocol', id: string, name: string } }>, views: Array<{ __typename?: 'SpecimenView', id: string, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string } }, image: { __typename?: 'Image', id: string, name: string } }> };

export type ListProtocolStepFragment = { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, kind: { __typename?: 'EntityKind', label: string }, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, protocol: { __typename?: 'Protocol', id: string, name: string } }>, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }>, views: Array<{ __typename?: 'SpecimenView', id: string, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string } }, image: { __typename?: 'Image', id: string, name: string } }> };

export type ContextNodeNestedFragment = { __typename?: 'ContextNode', label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } };

export type OverlayNodeNestedFragment = { __typename?: 'OverlayNode', label?: string | null };

export type GridNodeNestedFragment = { __typename?: 'GridNode', label?: string | null, gap?: number | null };

type RenderNodeNested_ContextNode_Fragment = { __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } };

type RenderNodeNested_GridNode_Fragment = { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null };

type RenderNodeNested_OverlayNode_Fragment = { __typename?: 'OverlayNode', kind: string, label?: string | null };

type RenderNodeNested_SplitNode_Fragment = { __typename?: 'SplitNode', kind: string };

export type RenderNodeNestedFragment = RenderNodeNested_ContextNode_Fragment | RenderNodeNested_GridNode_Fragment | RenderNodeNested_OverlayNode_Fragment | RenderNodeNested_SplitNode_Fragment;

export type ContextNodeFragment = { __typename?: 'ContextNode', label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } };

export type OverlayNodeFragment = { __typename?: 'OverlayNode', label?: string | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> };

export type GridNodeFragment = { __typename?: 'GridNode', label?: string | null, gap?: number | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> };

type RenderNode_ContextNode_Fragment = { __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } };

type RenderNode_GridNode_Fragment = { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> };

type RenderNode_OverlayNode_Fragment = { __typename?: 'OverlayNode', kind: string, label?: string | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> };

type RenderNode_SplitNode_Fragment = { __typename?: 'SplitNode', kind: string };

export type RenderNodeFragment = RenderNode_ContextNode_Fragment | RenderNode_GridNode_Fragment | RenderNode_OverlayNode_Fragment | RenderNode_SplitNode_Fragment;

export type TreeFragment = { __typename?: 'Tree', children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'OverlayNode', kind: string, label?: string | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'SplitNode', kind: string }> };

export type RenderTreeFragment = { __typename?: 'RenderTree', id: string, name: string, tree: { __typename?: 'Tree', children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'OverlayNode', kind: string, label?: string | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'SplitNode', kind: string }> } };

export type ListRenderTreeFragment = { __typename?: 'RenderTree', id: string, name: string };

export type RenderedPlotFragment = { __typename?: 'RenderedPlot', id: string, name: string, store: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } };

export type ListRenderedPlotFragment = { __typename?: 'RenderedPlot', id: string, name: string, store: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } };

export type RgbContextFragment = { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } };

export type ListRgbContextFragment = { __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> };

export type ListRoiFragment = { __typename?: 'ROI', id: string, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string }, entity?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string }, parent?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string } } | null } | null };

export type SnapshotFragment = { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } };

export type SpecimenFragment = { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string }, group: { __typename?: 'EntityGroup', id: string } }, protocol: { __typename?: 'Protocol', id: string } };

export type StageFragment = { __typename?: 'Stage', id: string, pinned: boolean, name: string, affineViews: Array<{ __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, image: { __typename?: 'Image', id: string, name: string, store: { __typename?: 'ZarrStore', shape?: Array<number> | null } }, stage: { __typename?: 'Stage', id: string, name: string } }> };

export type ListStageFragment = { __typename?: 'Stage', id: string, name: string };

export type ZarrStoreFragment = { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null };

export type ParquetStoreFragment = { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string };

export type BigFileStoreFragment = { __typename?: 'BigFileStore', id: string, key: string, bucket: string, path: string };

export type MediaStoreFragment = { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string };

export type TableFragment = { __typename?: 'Table', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string } };

export type ListTableFragment = { __typename?: 'Table', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string } };

export type VideoFragment = { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } };

type View_AcquisitionView_Fragment = { __typename?: 'AcquisitionView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_AffineTransformationView_Fragment = { __typename?: 'AffineTransformationView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_ChannelView_Fragment = { __typename?: 'ChannelView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_ContinousScanView_Fragment = { __typename?: 'ContinousScanView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_LabelView_Fragment = { __typename?: 'LabelView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_OpticsView_Fragment = { __typename?: 'OpticsView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_RgbView_Fragment = { __typename?: 'RGBView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_ScaleView_Fragment = { __typename?: 'ScaleView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_SpecimenView_Fragment = { __typename?: 'SpecimenView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_TimepointView_Fragment = { __typename?: 'TimepointView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_WellPositionView_Fragment = { __typename?: 'WellPositionView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

export type ViewFragment = View_AcquisitionView_Fragment | View_AffineTransformationView_Fragment | View_ChannelView_Fragment | View_ContinousScanView_Fragment | View_LabelView_Fragment | View_OpticsView_Fragment | View_RgbView_Fragment | View_ScaleView_Fragment | View_SpecimenView_Fragment | View_TimepointView_Fragment | View_WellPositionView_Fragment;

export type ChannelViewFragment = { __typename?: 'ChannelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channel: { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null } };

export type AffineTransformationViewFragment = { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } };

export type RgbViewFragment = { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } };

export type TimepointViewFragment = { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } };

export type OpticsViewFragment = { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null };

export type LabelViewFragment = { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null, primaryAntibody?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null, secondaryAntibody?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null };

export type SpecimenViewFragment = { __typename?: 'SpecimenView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string }, group: { __typename?: 'EntityGroup', id: string } }, protocol: { __typename?: 'Protocol', id: string } }, step?: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, kind: { __typename?: 'EntityKind', label: string }, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }> } | null };

export type AcquisitionViewFragment = { __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null };

export type WellPositionViewFragment = { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null };

export type ContinousScanViewFragment = { __typename?: 'ContinousScanView', id: string, direction: ScanDirection, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

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


export type PinDatasetMutation = { __typename?: 'Mutation', pinDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type PutDatasetsInDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type PutDatasetsInDatasetMutation = { __typename?: 'Mutation', putDatasetsInDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ReleaseDatasetsFromDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type ReleaseDatasetsFromDatasetMutation = { __typename?: 'Mutation', releaseDatasetsFromDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type PutImagesInDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type PutImagesInDatasetMutation = { __typename?: 'Mutation', putImagesInDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ReleaseImagesFromDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type ReleaseImagesFromDatasetMutation = { __typename?: 'Mutation', releaseImagesFromDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type PutFilesInDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type PutFilesInDatasetMutation = { __typename?: 'Mutation', putFilesInDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ReleaseFilesFromDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type ReleaseFilesFromDatasetMutation = { __typename?: 'Mutation', releaseFilesFromDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

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

export type CreateExperimentMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateExperimentMutation = { __typename?: 'Mutation', createExperiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null, createdAt: any, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, protocols: Array<{ __typename?: 'Protocol', id: string, name: string, experiment: { __typename?: 'Experiment', id: string, name: string } }> } };

export type UpdateExperimentMutationVariables = Exact<{
  input: UpdateExperimentInput;
}>;


export type UpdateExperimentMutation = { __typename?: 'Mutation', updateExperiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null, createdAt: any, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, protocols: Array<{ __typename?: 'Protocol', id: string, name: string, experiment: { __typename?: 'Experiment', id: string, name: string } }> } };

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

export type RequestFileUploadPresignedMutationVariables = Exact<{
  key: Scalars['String']['input'];
  datalayer: Scalars['String']['input'];
}>;


export type RequestFileUploadPresignedMutation = { __typename?: 'Mutation', requestFileUploadPresigned: { __typename?: 'PresignedPostCredentials', xAmzAlgorithm: string, xAmzCredential: string, xAmzDate: string, xAmzSignature: string, key: string, bucket: string, datalayer: string, policy: string, store: string } };

export type RequestFileAccessMutationVariables = Exact<{
  store: Scalars['ID']['input'];
  duration?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RequestFileAccessMutation = { __typename?: 'Mutation', requestFileAccess: { __typename?: 'AccessCredentials', accessKey: string, secretKey: string, bucket: string, key: string, sessionToken: string, path: string } };

export type DeleteFileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: string };

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


export type PinImageMutation = { __typename?: 'Mutation', pinImage: { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, views: Array<{ __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null } | { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } } | { __typename?: 'ChannelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channel: { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null } } | { __typename?: 'ContinousScanView' } | { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null, primaryAntibody?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null, secondaryAntibody?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null } | { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null } | { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } | { __typename?: 'ScaleView' } | { __typename?: 'SpecimenView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string }, group: { __typename?: 'EntityGroup', id: string } }, protocol: { __typename?: 'Protocol', id: string } }, step?: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, kind: { __typename?: 'EntityKind', label: string }, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }> } | null } | { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } } | { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, creator?: { __typename?: 'User', sub: string } | null, metrics: Array<{ __typename?: 'ImageIntMetric', id: string, value: number }>, roiOrigins: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string }, entity?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string }, parent?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string } } | null } | null }>, fileOrigins: Array<{ __typename?: 'File', id: string, name: string }>, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }>, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string }, entity?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string }, parent?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string } } | null } | null }> } };

export type UpdateImageMutationVariables = Exact<{
  input: UpdateImageInput;
}>;


export type UpdateImageMutation = { __typename?: 'Mutation', updateImage: { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, views: Array<{ __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null } | { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } } | { __typename?: 'ChannelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channel: { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null } } | { __typename?: 'ContinousScanView' } | { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null, primaryAntibody?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null, secondaryAntibody?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null } | { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null } | { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } | { __typename?: 'ScaleView' } | { __typename?: 'SpecimenView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string }, group: { __typename?: 'EntityGroup', id: string } }, protocol: { __typename?: 'Protocol', id: string } }, step?: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, kind: { __typename?: 'EntityKind', label: string }, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }> } | null } | { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } } | { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, creator?: { __typename?: 'User', sub: string } | null, metrics: Array<{ __typename?: 'ImageIntMetric', id: string, value: number }>, roiOrigins: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string }, entity?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string }, parent?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string } } | null } | null }>, fileOrigins: Array<{ __typename?: 'File', id: string, name: string }>, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }>, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string }, entity?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string }, parent?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string } } | null } | null }> } };

export type DeleteImageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteImageMutation = { __typename?: 'Mutation', deleteImage: string };

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

export type CreateOntologyMutationVariables = Exact<{
  name: Scalars['String']['input'];
  purl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateOntologyMutation = { __typename?: 'Mutation', createOntology: { __typename?: 'Ontology', id: string, name: string } };

export type CreateProtocolMutationVariables = Exact<{
  name: Scalars['String']['input'];
  experiment: Scalars['ID']['input'];
}>;


export type CreateProtocolMutation = { __typename?: 'Mutation', createProtocol: { __typename?: 'Protocol', id: string, name: string, description?: string | null, experiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null }, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, step: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, kind: { __typename?: 'EntityKind', label: string }, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, protocol: { __typename?: 'Protocol', id: string, name: string } }>, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }>, views: Array<{ __typename?: 'SpecimenView', id: string, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string } }, image: { __typename?: 'Image', id: string, name: string } }> } }> } };

export type CreateProtocolStepMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
  kind: Scalars['ID']['input'];
}>;


export type CreateProtocolStepMutation = { __typename?: 'Mutation', createProtocolStep: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, plateChildren: Array<any>, kind: { __typename?: 'EntityKind', label: string }, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }>, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, protocol: { __typename?: 'Protocol', id: string, name: string } }>, views: Array<{ __typename?: 'SpecimenView', id: string, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string } }, image: { __typename?: 'Image', id: string, name: string } }> } };

export type UpdateProtocolStepMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  kind?: InputMaybe<Scalars['ID']['input']>;
  plateChildren?: InputMaybe<Array<PlateChildInput> | PlateChildInput>;
}>;


export type UpdateProtocolStepMutation = { __typename?: 'Mutation', updateProtocolStep: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, plateChildren: Array<any>, kind: { __typename?: 'EntityKind', label: string }, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }>, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, protocol: { __typename?: 'Protocol', id: string, name: string } }>, views: Array<{ __typename?: 'SpecimenView', id: string, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string } }, image: { __typename?: 'Image', id: string, name: string } }> } };

export type CreateRgbContextMutationVariables = Exact<{
  input: CreateRgbContextInput;
}>;


export type CreateRgbContextMutation = { __typename?: 'Mutation', createRgbContext: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } };

export type UpdateRgbContextMutationVariables = Exact<{
  input: UpdateRgbContextInput;
}>;


export type UpdateRgbContextMutation = { __typename?: 'Mutation', updateRgbContext: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } };

export type CreateSnapshotMutationVariables = Exact<{
  image: Scalars['ID']['input'];
  file: Scalars['Upload']['input'];
}>;


export type CreateSnapshotMutation = { __typename?: 'Mutation', createSnapshot: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } };

export type CreateSpecimenMutationVariables = Exact<{
  entity: Scalars['ID']['input'];
  protocol: Scalars['ID']['input'];
}>;


export type CreateSpecimenMutation = { __typename?: 'Mutation', createSpecimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string }, group: { __typename?: 'EntityGroup', id: string } }, protocol: { __typename?: 'Protocol', id: string } } };

export type CreateStageMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateStageMutation = { __typename?: 'Mutation', createStage: { __typename?: 'Stage', id: string, name: string } };

export type PinStageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
}>;


export type PinStageMutation = { __typename?: 'Mutation', pinStage: { __typename?: 'Stage', id: string, pinned: boolean, name: string, affineViews: Array<{ __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, image: { __typename?: 'Image', id: string, name: string, store: { __typename?: 'ZarrStore', shape?: Array<number> | null } }, stage: { __typename?: 'Stage', id: string, name: string } }> } };

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
  context: Scalars['ID']['input'];
  gamma?: InputMaybe<Scalars['Float']['input']>;
  contrastLimitMax?: InputMaybe<Scalars['Float']['input']>;
  contrastLimitMin?: InputMaybe<Scalars['Float']['input']>;
  rescale?: InputMaybe<Scalars['Boolean']['input']>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  colorMap?: InputMaybe<ColorMap>;
}>;


export type CreateRgbViewMutation = { __typename?: 'Mutation', createRgbView: { __typename?: 'RGBView', id: string } };

export type CreateWellPositionViewMutationVariables = Exact<{
  input: WellPositionViewInput;
}>;


export type CreateWellPositionViewMutation = { __typename?: 'Mutation', createWellPositionView: { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null } };

export type CreateContinousScanViewMutationVariables = Exact<{
  input: ContinousScanViewInput;
}>;


export type CreateContinousScanViewMutation = { __typename?: 'Mutation', createContinousScanView: { __typename?: 'ContinousScanView', id: string, direction: ScanDirection, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } };

export type CreateSpecimenViewMutationVariables = Exact<{
  input: SpecimenViewInput;
}>;


export type CreateSpecimenViewMutation = { __typename?: 'Mutation', createSpecimenView: { __typename?: 'SpecimenView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string }, group: { __typename?: 'EntityGroup', id: string } }, protocol: { __typename?: 'Protocol', id: string } }, step?: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, kind: { __typename?: 'EntityKind', label: string }, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }> } | null } };

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


export type GetDatasetQuery = { __typename?: 'Query', dataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type GetDatasetsQueryVariables = Exact<{
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetDatasetsQuery = { __typename?: 'Query', datasets: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }> };

export type GetEntityQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEntityQuery = { __typename?: 'Query', entity: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } };

export type ListEntitiesQueryVariables = Exact<{
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
  metrics?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type ListEntitiesQuery = { __typename?: 'Query', entities: Array<{ __typename?: 'Entity', metricMap: any, id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> }> };

export type SearchEntitiesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchEntitiesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Entity', value: string, label: string }> };

export type GetEntityGraphQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEntityGraphQuery = { __typename?: 'Query', entityGraph: { __typename?: 'EntityGraph', nodes: Array<{ __typename?: 'EntityNode', id: string, label: string, color: string, isRoot: boolean, subtitle: string, metrics: Array<{ __typename?: 'EntityNodeMetric', kind: string, dataKind: string, value: string }> }>, edges: Array<{ __typename?: 'EntityRelationEdge', id: string, label: string, source: string, target: string, metrics: Array<{ __typename?: 'EntityNodeMetric', kind: string, dataKind: string, value: string }> }> } };

export type GetEntityKindQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEntityKindQuery = { __typename?: 'Query', entityKind: { __typename?: 'EntityKind', id: string, label: string, description?: string | null, purl?: string | null, ontology: { __typename?: 'Ontology', id: string, name: string }, entities: Array<{ __typename?: 'Entity', id: string, name: string }> } };

export type SearchEntityKindQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchEntityKindQuery = { __typename?: 'Query', options: Array<{ __typename?: 'EntityKind', value: string, label: string }> };

export type GetEntityMetricQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEntityMetricQuery = { __typename?: 'Query', entityMetric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } } } };

export type SearchEntityMetricQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchEntityMetricQuery = { __typename?: 'Query', options: Array<{ __typename?: 'EntityMetric', value: string, label: string }> };

export type GetExperimentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetExperimentQuery = { __typename?: 'Query', experiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null, createdAt: any, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, protocols: Array<{ __typename?: 'Protocol', id: string, name: string, experiment: { __typename?: 'Experiment', id: string, name: string } }> } };

export type ListExperimentsQueryVariables = Exact<{
  filters?: InputMaybe<ExperimentFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListExperimentsQuery = { __typename?: 'Query', experiments: Array<{ __typename?: 'Experiment', id: string, name: string, description?: string | null, protocols: Array<{ __typename?: 'Protocol', id: string, name: string }> }> };

export type GetFileQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFileQuery = { __typename?: 'Query', file: { __typename?: 'File', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'BigFileStore', id: string, key: string, bucket: string, path: string } } };

export type GetFilesQueryVariables = Exact<{
  filters?: InputMaybe<FileFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetFilesQuery = { __typename?: 'Query', files: Array<{ __typename?: 'File', id: string, name: string }> };

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


export type GetImageQuery = { __typename?: 'Query', image: { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, views: Array<{ __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null } | { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } } | { __typename?: 'ChannelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channel: { __typename?: 'Channel', id: string, name: string, excitationWavelength?: number | null } } | { __typename?: 'ContinousScanView' } | { __typename?: 'LabelView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, fluorophore?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null, primaryAntibody?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null, secondaryAntibody?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string } }, group: { __typename?: 'EntityGroup', id: string, name: string }, specimens: Array<{ __typename?: 'Specimen', id: string, protocol: { __typename?: 'Protocol', id: string } }> } | null } | { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null } | { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } | { __typename?: 'ScaleView' } | { __typename?: 'SpecimenView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string }, group: { __typename?: 'EntityGroup', id: string } }, protocol: { __typename?: 'Protocol', id: string } }, step?: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, kind: { __typename?: 'EntityKind', label: string }, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }> } | null } | { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } } | { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, history: Array<{ __typename?: 'History', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, app?: { __typename?: 'App', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, creator?: { __typename?: 'User', sub: string } | null, metrics: Array<{ __typename?: 'ImageIntMetric', id: string, value: number }>, roiOrigins: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string }, entity?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string }, parent?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string } } | null } | null }>, fileOrigins: Array<{ __typename?: 'File', id: string, name: string }>, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }>, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string }, entity?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string }, parent?: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', label: string } } | null } | null }> } };

export type GetImagesQueryVariables = Exact<{
  filters?: InputMaybe<ImageFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetImagesQuery = { __typename?: 'Query', images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }> };

export type GetInstrumentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInstrumentQuery = { __typename?: 'Query', instrument: { __typename?: 'Instrument', model?: string | null, name: string, serialNumber: string } };

export type GetKnowledgeGraphQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetKnowledgeGraphQuery = { __typename?: 'Query', knowledgeGraph: { __typename?: 'KnowledgeGraph', nodes: Array<{ __typename?: 'EntityKindNode', id: string, label: string, metrics: Array<{ __typename?: 'EntityKindNodeMetric', kind: string, dataKind: string }> }>, edges: Array<{ __typename?: 'EntityKindRelationEdge', id: string, label: string, source: string, target: string, metrics: Array<{ __typename?: 'EntityKindNodeMetric', kind: string, dataKind: string }> }> } };

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

export type GetOntologyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOntologyQuery = { __typename?: 'Query', ontology: { __typename?: 'Ontology', id: string, name: string } };

export type ListOntologiesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListOntologiesQuery = { __typename?: 'Query', ontologies: Array<{ __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null }> };

export type SearchOntologiesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchOntologiesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Ontology', value: string, label: string }> };

export type GetProtocolStepQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProtocolStepQuery = { __typename?: 'Query', protocolStep: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, plateChildren: Array<any>, kind: { __typename?: 'EntityKind', label: string }, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }>, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, protocol: { __typename?: 'Protocol', id: string, name: string } }>, views: Array<{ __typename?: 'SpecimenView', id: string, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string } }, image: { __typename?: 'Image', id: string, name: string } }> } };

export type ListProtocolStepsQueryVariables = Exact<{
  filters?: InputMaybe<ProtocolStepFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListProtocolStepsQuery = { __typename?: 'Query', protocolSteps: Array<{ __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, kind: { __typename?: 'EntityKind', label: string }, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, protocol: { __typename?: 'Protocol', id: string, name: string } }>, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }>, views: Array<{ __typename?: 'SpecimenView', id: string, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string } }, image: { __typename?: 'Image', id: string, name: string } }> }> };

export type SearchProtocolStepsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchProtocolStepsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'ProtocolStep', value: string, label: string }> };

export type GetProtocolQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProtocolQuery = { __typename?: 'Query', protocol: { __typename?: 'Protocol', id: string, name: string, description?: string | null, experiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null }, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, step: { __typename?: 'ProtocolStep', id: string, name: string, description?: string | null, kind: { __typename?: 'EntityKind', label: string }, mappings: Array<{ __typename?: 'ProtocolStepMapping', t?: number | null, protocol: { __typename?: 'Protocol', id: string, name: string } }>, reagents: Array<{ __typename?: 'Entity', id: string, name: string, metrics: Array<{ __typename?: 'MetricAssociation', value: string, metric: { __typename?: 'EntityMetric', id: string, dataKind: MetricDataType, kind: { __typename?: 'EntityKind', label: string } } }> }>, views: Array<{ __typename?: 'SpecimenView', id: string, specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string } }, image: { __typename?: 'Image', id: string, name: string } }> } }> } };

export type ListProtocolsQueryVariables = Exact<{
  filters?: InputMaybe<ProtocolFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListProtocolsQuery = { __typename?: 'Query', protocols: Array<{ __typename?: 'Protocol', id: string, name: string, experiment: { __typename?: 'Experiment', id: string, name: string } }> };

export type RenderTreeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RenderTreeQuery = { __typename?: 'Query', renderTree: { __typename?: 'RenderTree', id: string, name: string, tree: { __typename?: 'Tree', children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'OverlayNode', kind: string, label?: string | null, children: Array<{ __typename?: 'ContextNode', kind: string, label?: string | null, context: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } } | { __typename?: 'GridNode', kind: string, label?: string | null, gap?: number | null } | { __typename?: 'OverlayNode', kind: string, label?: string | null } | { __typename?: 'SplitNode', kind: string }> } | { __typename?: 'SplitNode', kind: string }> } } };

export type RenderTreesQueryVariables = Exact<{
  filters?: InputMaybe<RenderTreeFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type RenderTreesQuery = { __typename?: 'Query', renderTrees: Array<{ __typename?: 'RenderTree', id: string, name: string }> };

export type GetRenderedPlotQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRenderedPlotQuery = { __typename?: 'Query', renderedPlot: { __typename?: 'RenderedPlot', id: string, name: string, store: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } } };

export type ListRenderedPlotsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListRenderedPlotsQuery = { __typename?: 'Query', renderedPlots: Array<{ __typename?: 'RenderedPlot', id: string, name: string, store: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } }> };

export type GetRgbContextQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRgbContextQuery = { __typename?: 'Query', rgbcontext: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> } } };

export type GetRgbContextsQueryVariables = Exact<{
  filters?: InputMaybe<RgbContextFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetRgbContextsQuery = { __typename?: 'Query', rgbcontexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, rescale: boolean, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }> };

export type RgbContextOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type RgbContextOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'RGBContext', value: string, label: string }> };

export type GetSpecimenQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSpecimenQuery = { __typename?: 'Query', specimen: { __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string }, group: { __typename?: 'EntityGroup', id: string } }, protocol: { __typename?: 'Protocol', id: string } } };

export type ListSpecimensQueryVariables = Exact<{ [key: string]: never; }>;


export type ListSpecimensQuery = { __typename?: 'Query', specimens: Array<{ __typename?: 'Specimen', id: string, entity: { __typename?: 'Entity', id: string, name: string, kind: { __typename?: 'EntityKind', id: string, label: string }, group: { __typename?: 'EntityGroup', id: string } }, protocol: { __typename?: 'Protocol', id: string } }> };

export type SearchSpecimensQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchSpecimensQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Specimen', value: string, label: string }> };

export type GetStageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStageQuery = { __typename?: 'Query', stage: { __typename?: 'Stage', id: string, pinned: boolean, name: string, affineViews: Array<{ __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, image: { __typename?: 'Image', id: string, name: string, store: { __typename?: 'ZarrStore', shape?: Array<number> | null } }, stage: { __typename?: 'Stage', id: string, name: string } }> } };

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

export type GetTablesQueryVariables = Exact<{
  filters?: InputMaybe<TableFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetTablesQuery = { __typename?: 'Query', tables: Array<{ __typename?: 'Table', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string } }> };

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
export const EntityGraphFragmentDoc = gql`
    fragment EntityGraph on EntityGraph {
  nodes {
    id
    label
    metrics {
      kind
      dataKind
      value
    }
    color
    isRoot
    subtitle
  }
  edges {
    id
    label
    source
    target
    metrics {
      kind
      dataKind
      value
    }
  }
}
    `;
export const EntityKindFragmentDoc = gql`
    fragment EntityKind on EntityKind {
  id
  label
  ontology {
    id
    name
  }
  description
  purl
  entities(pagination: {limit: 4}) {
    id
    name
  }
}
    `;
export const EntityMetricFragmentDoc = gql`
    fragment EntityMetric on EntityMetric {
  id
  kind {
    id
    label
    ontology {
      id
      name
    }
  }
  dataKind
}
    `;
export const ListProtocolFragmentDoc = gql`
    fragment ListProtocol on Protocol {
  id
  name
  experiment {
    id
    name
  }
}
    `;
export const ExperimentFragmentDoc = gql`
    fragment Experiment on Experiment {
  id
  name
  description
  createdAt
  history(pagination: {limit: 3}) {
    ...History
  }
  protocols {
    ...ListProtocol
  }
}
    ${HistoryFragmentDoc}
${ListProtocolFragmentDoc}`;
export const ListExperimentFragmentDoc = gql`
    fragment ListExperiment on Experiment {
  id
  name
  description
  protocols {
    id
    name
  }
}
    `;
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
export const EntityFragmentDoc = gql`
    fragment Entity on Entity {
  id
  name
  kind {
    id
    label
    ontology {
      id
      name
    }
  }
  group {
    id
    name
  }
  specimens {
    id
    protocol {
      id
    }
  }
}
    `;
export const LabelViewFragmentDoc = gql`
    fragment LabelView on LabelView {
  ...View
  id
  fluorophore {
    ...Entity
  }
  primaryAntibody {
    ...Entity
  }
  secondaryAntibody {
    ...Entity
  }
}
    ${ViewFragmentDoc}
${EntityFragmentDoc}`;
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
  baseColor
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
export const SpecimenFragmentDoc = gql`
    fragment Specimen on Specimen {
  id
  entity {
    id
    kind {
      id
      label
    }
    name
    group {
      id
    }
  }
  protocol {
    id
  }
}
    `;
export const SpecimenViewFragmentDoc = gql`
    fragment SpecimenView on SpecimenView {
  ...View
  id
  specimen {
    ...Specimen
  }
  step {
    id
    name
    kind {
      label
    }
    description
    reagents {
      id
      name
      metrics {
        metric {
          id
          kind {
            label
          }
          dataKind
        }
        value
      }
    }
  }
}
    ${ViewFragmentDoc}
${SpecimenFragmentDoc}`;
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
  entity {
    id
    name
    kind {
      label
    }
    parent {
      id
      name
      kind {
        label
      }
    }
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
    derivedScaleViews {
      id
      image {
        id
        store {
          ...ZarrStore
        }
      }
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
    ...SpecimenView
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
${SpecimenViewFragmentDoc}
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
export const KnowledgeGraphFragmentDoc = gql`
    fragment KnowledgeGraph on KnowledgeGraph {
  nodes {
    id
    label
    metrics {
      kind
      dataKind
    }
  }
  edges {
    id
    label
    source
    target
    metrics {
      kind
      dataKind
    }
  }
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
export const OntologyFragmentDoc = gql`
    fragment Ontology on Ontology {
  id
  name
}
    `;
export const ListOntologyFragmentDoc = gql`
    fragment ListOntology on Ontology {
  id
  name
  description
  purl
}
    `;
export const ListProtocolStepFragmentDoc = gql`
    fragment ListProtocolStep on ProtocolStep {
  id
  name
  kind {
    label
  }
  description
  mappings {
    t
    protocol {
      id
      name
    }
  }
  reagents {
    id
    name
    metrics {
      metric {
        id
        kind {
          label
        }
        dataKind
      }
      value
    }
  }
  views {
    id
    specimen {
      id
      entity {
        id
      }
    }
    image {
      id
      name
    }
  }
}
    `;
export const ProtocolFragmentDoc = gql`
    fragment Protocol on Protocol {
  id
  name
  experiment {
    id
    name
    description
  }
  description
  mappings {
    t
    step {
      ...ListProtocolStep
    }
  }
}
    ${ListProtocolStepFragmentDoc}`;
export const ProtocolStepFragmentDoc = gql`
    fragment ProtocolStep on ProtocolStep {
  id
  name
  kind {
    label
  }
  description
  reagents {
    id
    name
    metrics {
      metric {
        id
        kind {
          label
        }
        dataKind
      }
      value
    }
  }
  mappings {
    t
    protocol {
      id
      name
    }
  }
  views {
    id
    specimen {
      id
      entity {
        id
      }
    }
    image {
      id
      name
    }
  }
  plateChildren
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
    derivedScaleViews {
      id
      image {
        id
        store {
          ...ZarrStore
        }
      }
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
export const MediaStoreFragmentDoc = gql`
    fragment MediaStore on MediaStore {
  id
  key
  presignedUrl
}
    `;
export const RenderedPlotFragmentDoc = gql`
    fragment RenderedPlot on RenderedPlot {
  id
  store {
    ...MediaStore
  }
  name
}
    ${MediaStoreFragmentDoc}`;
export const ListRenderedPlotFragmentDoc = gql`
    fragment ListRenderedPlot on RenderedPlot {
  id
  store {
    ...MediaStore
  }
  name
}
    ${MediaStoreFragmentDoc}`;
export const StageFragmentDoc = gql`
    fragment Stage on Stage {
  id
  affineViews {
    ...AffineTransformationView
    image {
      id
      store {
        shape
      }
      name
    }
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
export const ListTableFragmentDoc = gql`
    fragment ListTable on Table {
  ...Table
}
    ${TableFragmentDoc}`;
export const ContinousScanViewFragmentDoc = gql`
    fragment ContinousScanView on ContinousScanView {
  ...View
  id
  direction
}
    ${ViewFragmentDoc}`;
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
export function useCreateCameraMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCameraMutation, CreateCameraMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateCameraMutation, CreateCameraMutationVariables>(CreateCameraDocument, options);
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
export function useEnsureCameraMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EnsureCameraMutation, EnsureCameraMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<EnsureCameraMutation, EnsureCameraMutationVariables>(EnsureCameraDocument, options);
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
export function useCreateChannelMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateChannelMutation, CreateChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateChannelMutation, CreateChannelMutationVariables>(CreateChannelDocument, options);
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
export function useEnsureChannelMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EnsureChannelMutation, EnsureChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<EnsureChannelMutation, EnsureChannelMutationVariables>(EnsureChannelDocument, options);
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
export function useCreateDatasetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateDatasetMutation, CreateDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateDatasetMutation, CreateDatasetMutationVariables>(CreateDatasetDocument, options);
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
export function useUpdateDatasetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateDatasetMutation, UpdateDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateDatasetMutation, UpdateDatasetMutationVariables>(UpdateDatasetDocument, options);
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
export function usePinDatasetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PinDatasetMutation, PinDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PinDatasetMutation, PinDatasetMutationVariables>(PinDatasetDocument, options);
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
export function usePutDatasetsInDatasetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PutDatasetsInDatasetMutation, PutDatasetsInDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PutDatasetsInDatasetMutation, PutDatasetsInDatasetMutationVariables>(PutDatasetsInDatasetDocument, options);
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
export function useReleaseDatasetsFromDatasetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ReleaseDatasetsFromDatasetMutation, ReleaseDatasetsFromDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ReleaseDatasetsFromDatasetMutation, ReleaseDatasetsFromDatasetMutationVariables>(ReleaseDatasetsFromDatasetDocument, options);
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
export function usePutImagesInDatasetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PutImagesInDatasetMutation, PutImagesInDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PutImagesInDatasetMutation, PutImagesInDatasetMutationVariables>(PutImagesInDatasetDocument, options);
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
export function useReleaseImagesFromDatasetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ReleaseImagesFromDatasetMutation, ReleaseImagesFromDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ReleaseImagesFromDatasetMutation, ReleaseImagesFromDatasetMutationVariables>(ReleaseImagesFromDatasetDocument, options);
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
export function usePutFilesInDatasetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PutFilesInDatasetMutation, PutFilesInDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PutFilesInDatasetMutation, PutFilesInDatasetMutationVariables>(PutFilesInDatasetDocument, options);
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
export function useReleaseFilesFromDatasetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ReleaseFilesFromDatasetMutation, ReleaseFilesFromDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ReleaseFilesFromDatasetMutation, ReleaseFilesFromDatasetMutationVariables>(ReleaseFilesFromDatasetDocument, options);
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
export function useRevertDatasetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RevertDatasetMutation, RevertDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RevertDatasetMutation, RevertDatasetMutationVariables>(RevertDatasetDocument, options);
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
export function useCreateEraMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateEraMutation, CreateEraMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateEraMutation, CreateEraMutationVariables>(CreateEraDocument, options);
      }
export type CreateEraMutationHookResult = ReturnType<typeof useCreateEraMutation>;
export type CreateEraMutationResult = Apollo.MutationResult<CreateEraMutation>;
export type CreateEraMutationOptions = Apollo.BaseMutationOptions<CreateEraMutation, CreateEraMutationVariables>;
export const CreateExperimentDocument = gql`
    mutation CreateExperiment($name: String!, $description: String) {
  createExperiment(input: {name: $name, description: $description}) {
    ...Experiment
  }
}
    ${ExperimentFragmentDoc}`;
export type CreateExperimentMutationFn = Apollo.MutationFunction<CreateExperimentMutation, CreateExperimentMutationVariables>;

/**
 * __useCreateExperimentMutation__
 *
 * To run a mutation, you first call `useCreateExperimentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExperimentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExperimentMutation, { data, loading, error }] = useCreateExperimentMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useCreateExperimentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateExperimentMutation, CreateExperimentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateExperimentMutation, CreateExperimentMutationVariables>(CreateExperimentDocument, options);
      }
export type CreateExperimentMutationHookResult = ReturnType<typeof useCreateExperimentMutation>;
export type CreateExperimentMutationResult = Apollo.MutationResult<CreateExperimentMutation>;
export type CreateExperimentMutationOptions = Apollo.BaseMutationOptions<CreateExperimentMutation, CreateExperimentMutationVariables>;
export const UpdateExperimentDocument = gql`
    mutation UpdateExperiment($input: UpdateExperimentInput!) {
  updateExperiment(input: $input) {
    ...Experiment
  }
}
    ${ExperimentFragmentDoc}`;
export type UpdateExperimentMutationFn = Apollo.MutationFunction<UpdateExperimentMutation, UpdateExperimentMutationVariables>;

/**
 * __useUpdateExperimentMutation__
 *
 * To run a mutation, you first call `useUpdateExperimentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExperimentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExperimentMutation, { data, loading, error }] = useUpdateExperimentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateExperimentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateExperimentMutation, UpdateExperimentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateExperimentMutation, UpdateExperimentMutationVariables>(UpdateExperimentDocument, options);
      }
export type UpdateExperimentMutationHookResult = ReturnType<typeof useUpdateExperimentMutation>;
export type UpdateExperimentMutationResult = Apollo.MutationResult<UpdateExperimentMutation>;
export type UpdateExperimentMutationOptions = Apollo.BaseMutationOptions<UpdateExperimentMutation, UpdateExperimentMutationVariables>;
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
export function useFrom_File_LikeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<From_File_LikeMutation, From_File_LikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<From_File_LikeMutation, From_File_LikeMutationVariables>(From_File_LikeDocument, options);
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
export function useRequestFileUploadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RequestFileUploadMutation, RequestFileUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RequestFileUploadMutation, RequestFileUploadMutationVariables>(RequestFileUploadDocument, options);
      }
export type RequestFileUploadMutationHookResult = ReturnType<typeof useRequestFileUploadMutation>;
export type RequestFileUploadMutationResult = Apollo.MutationResult<RequestFileUploadMutation>;
export type RequestFileUploadMutationOptions = Apollo.BaseMutationOptions<RequestFileUploadMutation, RequestFileUploadMutationVariables>;
export const RequestFileUploadPresignedDocument = gql`
    mutation RequestFileUploadPresigned($key: String!, $datalayer: String!) {
  requestFileUploadPresigned(input: {key: $key, datalayer: $datalayer}) {
    ...PresignedPostCredentials
  }
}
    ${PresignedPostCredentialsFragmentDoc}`;
export type RequestFileUploadPresignedMutationFn = Apollo.MutationFunction<RequestFileUploadPresignedMutation, RequestFileUploadPresignedMutationVariables>;

/**
 * __useRequestFileUploadPresignedMutation__
 *
 * To run a mutation, you first call `useRequestFileUploadPresignedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestFileUploadPresignedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestFileUploadPresignedMutation, { data, loading, error }] = useRequestFileUploadPresignedMutation({
 *   variables: {
 *      key: // value for 'key'
 *      datalayer: // value for 'datalayer'
 *   },
 * });
 */
export function useRequestFileUploadPresignedMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RequestFileUploadPresignedMutation, RequestFileUploadPresignedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RequestFileUploadPresignedMutation, RequestFileUploadPresignedMutationVariables>(RequestFileUploadPresignedDocument, options);
      }
export type RequestFileUploadPresignedMutationHookResult = ReturnType<typeof useRequestFileUploadPresignedMutation>;
export type RequestFileUploadPresignedMutationResult = Apollo.MutationResult<RequestFileUploadPresignedMutation>;
export type RequestFileUploadPresignedMutationOptions = Apollo.BaseMutationOptions<RequestFileUploadPresignedMutation, RequestFileUploadPresignedMutationVariables>;
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
export function useRequestFileAccessMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RequestFileAccessMutation, RequestFileAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RequestFileAccessMutation, RequestFileAccessMutationVariables>(RequestFileAccessDocument, options);
      }
export type RequestFileAccessMutationHookResult = ReturnType<typeof useRequestFileAccessMutation>;
export type RequestFileAccessMutationResult = Apollo.MutationResult<RequestFileAccessMutation>;
export type RequestFileAccessMutationOptions = Apollo.BaseMutationOptions<RequestFileAccessMutation, RequestFileAccessMutationVariables>;
export const DeleteFileDocument = gql`
    mutation DeleteFile($id: ID!) {
  deleteFile(input: {id: $id})
}
    `;
export type DeleteFileMutationFn = Apollo.MutationFunction<DeleteFileMutation, DeleteFileMutationVariables>;

/**
 * __useDeleteFileMutation__
 *
 * To run a mutation, you first call `useDeleteFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFileMutation, { data, loading, error }] = useDeleteFileMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteFileMutation, DeleteFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteFileMutation, DeleteFileMutationVariables>(DeleteFileDocument, options);
      }
export type DeleteFileMutationHookResult = ReturnType<typeof useDeleteFileMutation>;
export type DeleteFileMutationResult = Apollo.MutationResult<DeleteFileMutation>;
export type DeleteFileMutationOptions = Apollo.BaseMutationOptions<DeleteFileMutation, DeleteFileMutationVariables>;
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
export function useRequestUploadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RequestUploadMutation, RequestUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RequestUploadMutation, RequestUploadMutationVariables>(RequestUploadDocument, options);
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
export function useRequestAccessMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RequestAccessMutation, RequestAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RequestAccessMutation, RequestAccessMutationVariables>(RequestAccessDocument, options);
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
export function usePinImageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PinImageMutation, PinImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PinImageMutation, PinImageMutationVariables>(PinImageDocument, options);
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
export function useUpdateImageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateImageMutation, UpdateImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateImageMutation, UpdateImageMutationVariables>(UpdateImageDocument, options);
      }
export type UpdateImageMutationHookResult = ReturnType<typeof useUpdateImageMutation>;
export type UpdateImageMutationResult = Apollo.MutationResult<UpdateImageMutation>;
export type UpdateImageMutationOptions = Apollo.BaseMutationOptions<UpdateImageMutation, UpdateImageMutationVariables>;
export const DeleteImageDocument = gql`
    mutation DeleteImage($id: ID!) {
  deleteImage(input: {id: $id})
}
    `;
export type DeleteImageMutationFn = Apollo.MutationFunction<DeleteImageMutation, DeleteImageMutationVariables>;

/**
 * __useDeleteImageMutation__
 *
 * To run a mutation, you first call `useDeleteImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteImageMutation, { data, loading, error }] = useDeleteImageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteImageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteImageMutation, DeleteImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteImageMutation, DeleteImageMutationVariables>(DeleteImageDocument, options);
      }
export type DeleteImageMutationHookResult = ReturnType<typeof useDeleteImageMutation>;
export type DeleteImageMutationResult = Apollo.MutationResult<DeleteImageMutation>;
export type DeleteImageMutationOptions = Apollo.BaseMutationOptions<DeleteImageMutation, DeleteImageMutationVariables>;
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
export function useCreateInstrumentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateInstrumentMutation, CreateInstrumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateInstrumentMutation, CreateInstrumentMutationVariables>(CreateInstrumentDocument, options);
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
export function useEnsureInstrumentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EnsureInstrumentMutation, EnsureInstrumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<EnsureInstrumentMutation, EnsureInstrumentMutationVariables>(EnsureInstrumentDocument, options);
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
export function useRequestMediaUploadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RequestMediaUploadMutation, RequestMediaUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RequestMediaUploadMutation, RequestMediaUploadMutationVariables>(RequestMediaUploadDocument, options);
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
export function useCreateMultiWellPlateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMultiWellPlateMutation, CreateMultiWellPlateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMultiWellPlateMutation, CreateMultiWellPlateMutationVariables>(CreateMultiWellPlateDocument, options);
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
export function useAutoCreateMultiWellPlateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AutoCreateMultiWellPlateMutation, AutoCreateMultiWellPlateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AutoCreateMultiWellPlateMutation, AutoCreateMultiWellPlateMutationVariables>(AutoCreateMultiWellPlateDocument, options);
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
export function useCreateObjectiveMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateObjectiveMutation, CreateObjectiveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateObjectiveMutation, CreateObjectiveMutationVariables>(CreateObjectiveDocument, options);
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
export function useEnsureObjectiveMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EnsureObjectiveMutation, EnsureObjectiveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<EnsureObjectiveMutation, EnsureObjectiveMutationVariables>(EnsureObjectiveDocument, options);
      }
export type EnsureObjectiveMutationHookResult = ReturnType<typeof useEnsureObjectiveMutation>;
export type EnsureObjectiveMutationResult = Apollo.MutationResult<EnsureObjectiveMutation>;
export type EnsureObjectiveMutationOptions = Apollo.BaseMutationOptions<EnsureObjectiveMutation, EnsureObjectiveMutationVariables>;
export const CreateOntologyDocument = gql`
    mutation CreateOntology($name: String!, $purl: String, $description: String) {
  createOntology(input: {name: $name, purl: $purl, description: $description}) {
    ...Ontology
  }
}
    ${OntologyFragmentDoc}`;
export type CreateOntologyMutationFn = Apollo.MutationFunction<CreateOntologyMutation, CreateOntologyMutationVariables>;

/**
 * __useCreateOntologyMutation__
 *
 * To run a mutation, you first call `useCreateOntologyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOntologyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOntologyMutation, { data, loading, error }] = useCreateOntologyMutation({
 *   variables: {
 *      name: // value for 'name'
 *      purl: // value for 'purl'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useCreateOntologyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateOntologyMutation, CreateOntologyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateOntologyMutation, CreateOntologyMutationVariables>(CreateOntologyDocument, options);
      }
export type CreateOntologyMutationHookResult = ReturnType<typeof useCreateOntologyMutation>;
export type CreateOntologyMutationResult = Apollo.MutationResult<CreateOntologyMutation>;
export type CreateOntologyMutationOptions = Apollo.BaseMutationOptions<CreateOntologyMutation, CreateOntologyMutationVariables>;
export const CreateProtocolDocument = gql`
    mutation CreateProtocol($name: String!, $experiment: ID!) {
  createProtocol(input: {name: $name, experiment: $experiment}) {
    ...Protocol
  }
}
    ${ProtocolFragmentDoc}`;
export type CreateProtocolMutationFn = Apollo.MutationFunction<CreateProtocolMutation, CreateProtocolMutationVariables>;

/**
 * __useCreateProtocolMutation__
 *
 * To run a mutation, you first call `useCreateProtocolMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProtocolMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProtocolMutation, { data, loading, error }] = useCreateProtocolMutation({
 *   variables: {
 *      name: // value for 'name'
 *      experiment: // value for 'experiment'
 *   },
 * });
 */
export function useCreateProtocolMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProtocolMutation, CreateProtocolMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateProtocolMutation, CreateProtocolMutationVariables>(CreateProtocolDocument, options);
      }
export type CreateProtocolMutationHookResult = ReturnType<typeof useCreateProtocolMutation>;
export type CreateProtocolMutationResult = Apollo.MutationResult<CreateProtocolMutation>;
export type CreateProtocolMutationOptions = Apollo.BaseMutationOptions<CreateProtocolMutation, CreateProtocolMutationVariables>;
export const CreateProtocolStepDocument = gql`
    mutation CreateProtocolStep($name: String!, $description: String!, $kind: ID!) {
  createProtocolStep(input: {name: $name, description: $description, kind: $kind}) {
    ...ProtocolStep
  }
}
    ${ProtocolStepFragmentDoc}`;
export type CreateProtocolStepMutationFn = Apollo.MutationFunction<CreateProtocolStepMutation, CreateProtocolStepMutationVariables>;

/**
 * __useCreateProtocolStepMutation__
 *
 * To run a mutation, you first call `useCreateProtocolStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProtocolStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProtocolStepMutation, { data, loading, error }] = useCreateProtocolStepMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      kind: // value for 'kind'
 *   },
 * });
 */
export function useCreateProtocolStepMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProtocolStepMutation, CreateProtocolStepMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateProtocolStepMutation, CreateProtocolStepMutationVariables>(CreateProtocolStepDocument, options);
      }
export type CreateProtocolStepMutationHookResult = ReturnType<typeof useCreateProtocolStepMutation>;
export type CreateProtocolStepMutationResult = Apollo.MutationResult<CreateProtocolStepMutation>;
export type CreateProtocolStepMutationOptions = Apollo.BaseMutationOptions<CreateProtocolStepMutation, CreateProtocolStepMutationVariables>;
export const UpdateProtocolStepDocument = gql`
    mutation UpdateProtocolStep($id: ID!, $name: String, $description: String, $kind: ID, $plateChildren: [PlateChildInput!]) {
  updateProtocolStep(
    input: {id: $id, name: $name, description: $description, kind: $kind, plateChildren: $plateChildren}
  ) {
    ...ProtocolStep
  }
}
    ${ProtocolStepFragmentDoc}`;
export type UpdateProtocolStepMutationFn = Apollo.MutationFunction<UpdateProtocolStepMutation, UpdateProtocolStepMutationVariables>;

/**
 * __useUpdateProtocolStepMutation__
 *
 * To run a mutation, you first call `useUpdateProtocolStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProtocolStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProtocolStepMutation, { data, loading, error }] = useUpdateProtocolStepMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      kind: // value for 'kind'
 *      plateChildren: // value for 'plateChildren'
 *   },
 * });
 */
export function useUpdateProtocolStepMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProtocolStepMutation, UpdateProtocolStepMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateProtocolStepMutation, UpdateProtocolStepMutationVariables>(UpdateProtocolStepDocument, options);
      }
export type UpdateProtocolStepMutationHookResult = ReturnType<typeof useUpdateProtocolStepMutation>;
export type UpdateProtocolStepMutationResult = Apollo.MutationResult<UpdateProtocolStepMutation>;
export type UpdateProtocolStepMutationOptions = Apollo.BaseMutationOptions<UpdateProtocolStepMutation, UpdateProtocolStepMutationVariables>;
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
export function useCreateRgbContextMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRgbContextMutation, CreateRgbContextMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateRgbContextMutation, CreateRgbContextMutationVariables>(CreateRgbContextDocument, options);
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
export function useUpdateRgbContextMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRgbContextMutation, UpdateRgbContextMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateRgbContextMutation, UpdateRgbContextMutationVariables>(UpdateRgbContextDocument, options);
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
export function useCreateSnapshotMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSnapshotMutation, CreateSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateSnapshotMutation, CreateSnapshotMutationVariables>(CreateSnapshotDocument, options);
      }
export type CreateSnapshotMutationHookResult = ReturnType<typeof useCreateSnapshotMutation>;
export type CreateSnapshotMutationResult = Apollo.MutationResult<CreateSnapshotMutation>;
export type CreateSnapshotMutationOptions = Apollo.BaseMutationOptions<CreateSnapshotMutation, CreateSnapshotMutationVariables>;
export const CreateSpecimenDocument = gql`
    mutation CreateSpecimen($entity: ID!, $protocol: ID!) {
  createSpecimen(input: {entity: $entity, protocol: $protocol}) {
    ...Specimen
  }
}
    ${SpecimenFragmentDoc}`;
export type CreateSpecimenMutationFn = Apollo.MutationFunction<CreateSpecimenMutation, CreateSpecimenMutationVariables>;

/**
 * __useCreateSpecimenMutation__
 *
 * To run a mutation, you first call `useCreateSpecimenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSpecimenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSpecimenMutation, { data, loading, error }] = useCreateSpecimenMutation({
 *   variables: {
 *      entity: // value for 'entity'
 *      protocol: // value for 'protocol'
 *   },
 * });
 */
export function useCreateSpecimenMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSpecimenMutation, CreateSpecimenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateSpecimenMutation, CreateSpecimenMutationVariables>(CreateSpecimenDocument, options);
      }
export type CreateSpecimenMutationHookResult = ReturnType<typeof useCreateSpecimenMutation>;
export type CreateSpecimenMutationResult = Apollo.MutationResult<CreateSpecimenMutation>;
export type CreateSpecimenMutationOptions = Apollo.BaseMutationOptions<CreateSpecimenMutation, CreateSpecimenMutationVariables>;
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
export function useCreateStageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateStageMutation, CreateStageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateStageMutation, CreateStageMutationVariables>(CreateStageDocument, options);
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
export function usePinStageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PinStageMutation, PinStageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PinStageMutation, PinStageMutationVariables>(PinStageDocument, options);
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
export function useFrom_Parquet_LikeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<From_Parquet_LikeMutation, From_Parquet_LikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<From_Parquet_LikeMutation, From_Parquet_LikeMutationVariables>(From_Parquet_LikeDocument, options);
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
export function useRequestTableUploadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RequestTableUploadMutation, RequestTableUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RequestTableUploadMutation, RequestTableUploadMutationVariables>(RequestTableUploadDocument, options);
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
export function useRequestTableAccessMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RequestTableAccessMutation, RequestTableAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RequestTableAccessMutation, RequestTableAccessMutationVariables>(RequestTableAccessDocument, options);
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
export function useCreateAffineTransformationViewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateAffineTransformationViewMutation, CreateAffineTransformationViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateAffineTransformationViewMutation, CreateAffineTransformationViewMutationVariables>(CreateAffineTransformationViewDocument, options);
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
export function useDeleteAffineTransformationViewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAffineTransformationViewMutation, DeleteAffineTransformationViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteAffineTransformationViewMutation, DeleteAffineTransformationViewMutationVariables>(DeleteAffineTransformationViewDocument, options);
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
export function useDeleteRgbViewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRgbViewMutation, DeleteRgbViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteRgbViewMutation, DeleteRgbViewMutationVariables>(DeleteRgbViewDocument, options);
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
export function useDeleteChannelViewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteChannelViewMutation, DeleteChannelViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteChannelViewMutation, DeleteChannelViewMutationVariables>(DeleteChannelViewDocument, options);
      }
export type DeleteChannelViewMutationHookResult = ReturnType<typeof useDeleteChannelViewMutation>;
export type DeleteChannelViewMutationResult = Apollo.MutationResult<DeleteChannelViewMutation>;
export type DeleteChannelViewMutationOptions = Apollo.BaseMutationOptions<DeleteChannelViewMutation, DeleteChannelViewMutationVariables>;
export const CreateRgbViewDocument = gql`
    mutation CreateRgbView($image: ID!, $context: ID!, $gamma: Float, $contrastLimitMax: Float, $contrastLimitMin: Float, $rescale: Boolean, $active: Boolean, $colorMap: ColorMap) {
  createRgbView(
    input: {image: $image, context: $context, gamma: $gamma, contrastLimitMax: $contrastLimitMax, contrastLimitMin: $contrastLimitMin, rescale: $rescale, active: $active, colorMap: $colorMap}
  ) {
    id
  }
}
    `;
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
 *      context: // value for 'context'
 *      gamma: // value for 'gamma'
 *      contrastLimitMax: // value for 'contrastLimitMax'
 *      contrastLimitMin: // value for 'contrastLimitMin'
 *      rescale: // value for 'rescale'
 *      active: // value for 'active'
 *      colorMap: // value for 'colorMap'
 *   },
 * });
 */
export function useCreateRgbViewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRgbViewMutation, CreateRgbViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateRgbViewMutation, CreateRgbViewMutationVariables>(CreateRgbViewDocument, options);
      }
export type CreateRgbViewMutationHookResult = ReturnType<typeof useCreateRgbViewMutation>;
export type CreateRgbViewMutationResult = Apollo.MutationResult<CreateRgbViewMutation>;
export type CreateRgbViewMutationOptions = Apollo.BaseMutationOptions<CreateRgbViewMutation, CreateRgbViewMutationVariables>;
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
export function useCreateWellPositionViewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateWellPositionViewMutation, CreateWellPositionViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateWellPositionViewMutation, CreateWellPositionViewMutationVariables>(CreateWellPositionViewDocument, options);
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
export function useCreateContinousScanViewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateContinousScanViewMutation, CreateContinousScanViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateContinousScanViewMutation, CreateContinousScanViewMutationVariables>(CreateContinousScanViewDocument, options);
      }
export type CreateContinousScanViewMutationHookResult = ReturnType<typeof useCreateContinousScanViewMutation>;
export type CreateContinousScanViewMutationResult = Apollo.MutationResult<CreateContinousScanViewMutation>;
export type CreateContinousScanViewMutationOptions = Apollo.BaseMutationOptions<CreateContinousScanViewMutation, CreateContinousScanViewMutationVariables>;
export const CreateSpecimenViewDocument = gql`
    mutation CreateSpecimenView($input: SpecimenViewInput!) {
  createSpecimenView(input: $input) {
    ...SpecimenView
  }
}
    ${SpecimenViewFragmentDoc}`;
export type CreateSpecimenViewMutationFn = Apollo.MutationFunction<CreateSpecimenViewMutation, CreateSpecimenViewMutationVariables>;

/**
 * __useCreateSpecimenViewMutation__
 *
 * To run a mutation, you first call `useCreateSpecimenViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSpecimenViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSpecimenViewMutation, { data, loading, error }] = useCreateSpecimenViewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSpecimenViewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSpecimenViewMutation, CreateSpecimenViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateSpecimenViewMutation, CreateSpecimenViewMutationVariables>(CreateSpecimenViewDocument, options);
      }
export type CreateSpecimenViewMutationHookResult = ReturnType<typeof useCreateSpecimenViewMutation>;
export type CreateSpecimenViewMutationResult = Apollo.MutationResult<CreateSpecimenViewMutation>;
export type CreateSpecimenViewMutationOptions = Apollo.BaseMutationOptions<CreateSpecimenViewMutation, CreateSpecimenViewMutationVariables>;
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
export function useCreateViewCollectionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateViewCollectionMutation, CreateViewCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateViewCollectionMutation, CreateViewCollectionMutationVariables>(CreateViewCollectionDocument, options);
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
export function useGetCameraQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetCameraQuery, GetCameraQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCameraQuery, GetCameraQueryVariables>(GetCameraDocument, options);
      }
export function useGetCameraLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCameraQuery, GetCameraQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCameraQuery, GetCameraQueryVariables>(GetCameraDocument, options);
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
export function useGetDatasetQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetDatasetQuery, GetDatasetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetDatasetQuery, GetDatasetQueryVariables>(GetDatasetDocument, options);
      }
export function useGetDatasetLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDatasetQuery, GetDatasetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetDatasetQuery, GetDatasetQueryVariables>(GetDatasetDocument, options);
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
export function useGetDatasetsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetDatasetsQuery, GetDatasetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetDatasetsQuery, GetDatasetsQueryVariables>(GetDatasetsDocument, options);
      }
export function useGetDatasetsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDatasetsQuery, GetDatasetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetDatasetsQuery, GetDatasetsQueryVariables>(GetDatasetsDocument, options);
        }
export type GetDatasetsQueryHookResult = ReturnType<typeof useGetDatasetsQuery>;
export type GetDatasetsLazyQueryHookResult = ReturnType<typeof useGetDatasetsLazyQuery>;
export type GetDatasetsQueryResult = Apollo.QueryResult<GetDatasetsQuery, GetDatasetsQueryVariables>;
export const GetEntityDocument = gql`
    query GetEntity($id: ID!) {
  entity(id: $id) {
    ...Entity
  }
}
    ${EntityFragmentDoc}`;

/**
 * __useGetEntityQuery__
 *
 * To run a query within a React component, call `useGetEntityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEntityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEntityQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEntityQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetEntityQuery, GetEntityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetEntityQuery, GetEntityQueryVariables>(GetEntityDocument, options);
      }
export function useGetEntityLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetEntityQuery, GetEntityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetEntityQuery, GetEntityQueryVariables>(GetEntityDocument, options);
        }
export type GetEntityQueryHookResult = ReturnType<typeof useGetEntityQuery>;
export type GetEntityLazyQueryHookResult = ReturnType<typeof useGetEntityLazyQuery>;
export type GetEntityQueryResult = Apollo.QueryResult<GetEntityQuery, GetEntityQueryVariables>;
export const ListEntitiesDocument = gql`
    query ListEntities($filters: EntityFilter, $pagination: OffsetPaginationInput, $metrics: [ID!]) {
  entities(filters: $filters, pagination: $pagination) {
    ...Entity
    metricMap(metrics: $metrics)
  }
}
    ${EntityFragmentDoc}`;

/**
 * __useListEntitiesQuery__
 *
 * To run a query within a React component, call `useListEntitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListEntitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListEntitiesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *      metrics: // value for 'metrics'
 *   },
 * });
 */
export function useListEntitiesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListEntitiesQuery, ListEntitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListEntitiesQuery, ListEntitiesQueryVariables>(ListEntitiesDocument, options);
      }
export function useListEntitiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListEntitiesQuery, ListEntitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListEntitiesQuery, ListEntitiesQueryVariables>(ListEntitiesDocument, options);
        }
export type ListEntitiesQueryHookResult = ReturnType<typeof useListEntitiesQuery>;
export type ListEntitiesLazyQueryHookResult = ReturnType<typeof useListEntitiesLazyQuery>;
export type ListEntitiesQueryResult = Apollo.QueryResult<ListEntitiesQuery, ListEntitiesQueryVariables>;
export const SearchEntitiesDocument = gql`
    query SearchEntities($search: String, $values: [ID!]) {
  options: entities(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchEntitiesQuery__
 *
 * To run a query within a React component, call `useSearchEntitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEntitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEntitiesQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchEntitiesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchEntitiesQuery, SearchEntitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchEntitiesQuery, SearchEntitiesQueryVariables>(SearchEntitiesDocument, options);
      }
export function useSearchEntitiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchEntitiesQuery, SearchEntitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchEntitiesQuery, SearchEntitiesQueryVariables>(SearchEntitiesDocument, options);
        }
export type SearchEntitiesQueryHookResult = ReturnType<typeof useSearchEntitiesQuery>;
export type SearchEntitiesLazyQueryHookResult = ReturnType<typeof useSearchEntitiesLazyQuery>;
export type SearchEntitiesQueryResult = Apollo.QueryResult<SearchEntitiesQuery, SearchEntitiesQueryVariables>;
export const GetEntityGraphDocument = gql`
    query GetEntityGraph($id: ID!) {
  entityGraph(id: $id) {
    ...EntityGraph
  }
}
    ${EntityGraphFragmentDoc}`;

/**
 * __useGetEntityGraphQuery__
 *
 * To run a query within a React component, call `useGetEntityGraphQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEntityGraphQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEntityGraphQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEntityGraphQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetEntityGraphQuery, GetEntityGraphQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetEntityGraphQuery, GetEntityGraphQueryVariables>(GetEntityGraphDocument, options);
      }
export function useGetEntityGraphLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetEntityGraphQuery, GetEntityGraphQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetEntityGraphQuery, GetEntityGraphQueryVariables>(GetEntityGraphDocument, options);
        }
export type GetEntityGraphQueryHookResult = ReturnType<typeof useGetEntityGraphQuery>;
export type GetEntityGraphLazyQueryHookResult = ReturnType<typeof useGetEntityGraphLazyQuery>;
export type GetEntityGraphQueryResult = Apollo.QueryResult<GetEntityGraphQuery, GetEntityGraphQueryVariables>;
export const GetEntityKindDocument = gql`
    query GetEntityKind($id: ID!) {
  entityKind(id: $id) {
    ...EntityKind
  }
}
    ${EntityKindFragmentDoc}`;

/**
 * __useGetEntityKindQuery__
 *
 * To run a query within a React component, call `useGetEntityKindQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEntityKindQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEntityKindQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEntityKindQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetEntityKindQuery, GetEntityKindQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetEntityKindQuery, GetEntityKindQueryVariables>(GetEntityKindDocument, options);
      }
export function useGetEntityKindLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetEntityKindQuery, GetEntityKindQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetEntityKindQuery, GetEntityKindQueryVariables>(GetEntityKindDocument, options);
        }
export type GetEntityKindQueryHookResult = ReturnType<typeof useGetEntityKindQuery>;
export type GetEntityKindLazyQueryHookResult = ReturnType<typeof useGetEntityKindLazyQuery>;
export type GetEntityKindQueryResult = Apollo.QueryResult<GetEntityKindQuery, GetEntityKindQueryVariables>;
export const SearchEntityKindDocument = gql`
    query SearchEntityKind($search: String, $values: [ID!]) {
  options: entityKinds(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchEntityKindQuery__
 *
 * To run a query within a React component, call `useSearchEntityKindQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEntityKindQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEntityKindQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchEntityKindQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchEntityKindQuery, SearchEntityKindQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchEntityKindQuery, SearchEntityKindQueryVariables>(SearchEntityKindDocument, options);
      }
export function useSearchEntityKindLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchEntityKindQuery, SearchEntityKindQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchEntityKindQuery, SearchEntityKindQueryVariables>(SearchEntityKindDocument, options);
        }
export type SearchEntityKindQueryHookResult = ReturnType<typeof useSearchEntityKindQuery>;
export type SearchEntityKindLazyQueryHookResult = ReturnType<typeof useSearchEntityKindLazyQuery>;
export type SearchEntityKindQueryResult = Apollo.QueryResult<SearchEntityKindQuery, SearchEntityKindQueryVariables>;
export const GetEntityMetricDocument = gql`
    query GetEntityMetric($id: ID!) {
  entityMetric(id: $id) {
    ...EntityMetric
  }
}
    ${EntityMetricFragmentDoc}`;

/**
 * __useGetEntityMetricQuery__
 *
 * To run a query within a React component, call `useGetEntityMetricQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEntityMetricQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEntityMetricQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEntityMetricQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetEntityMetricQuery, GetEntityMetricQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetEntityMetricQuery, GetEntityMetricQueryVariables>(GetEntityMetricDocument, options);
      }
export function useGetEntityMetricLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetEntityMetricQuery, GetEntityMetricQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetEntityMetricQuery, GetEntityMetricQueryVariables>(GetEntityMetricDocument, options);
        }
export type GetEntityMetricQueryHookResult = ReturnType<typeof useGetEntityMetricQuery>;
export type GetEntityMetricLazyQueryHookResult = ReturnType<typeof useGetEntityMetricLazyQuery>;
export type GetEntityMetricQueryResult = Apollo.QueryResult<GetEntityMetricQuery, GetEntityMetricQueryVariables>;
export const SearchEntityMetricDocument = gql`
    query SearchEntityMetric($search: String, $values: [ID!]) {
  options: entityMetrics(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchEntityMetricQuery__
 *
 * To run a query within a React component, call `useSearchEntityMetricQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEntityMetricQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEntityMetricQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchEntityMetricQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchEntityMetricQuery, SearchEntityMetricQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchEntityMetricQuery, SearchEntityMetricQueryVariables>(SearchEntityMetricDocument, options);
      }
export function useSearchEntityMetricLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchEntityMetricQuery, SearchEntityMetricQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchEntityMetricQuery, SearchEntityMetricQueryVariables>(SearchEntityMetricDocument, options);
        }
export type SearchEntityMetricQueryHookResult = ReturnType<typeof useSearchEntityMetricQuery>;
export type SearchEntityMetricLazyQueryHookResult = ReturnType<typeof useSearchEntityMetricLazyQuery>;
export type SearchEntityMetricQueryResult = Apollo.QueryResult<SearchEntityMetricQuery, SearchEntityMetricQueryVariables>;
export const GetExperimentDocument = gql`
    query GetExperiment($id: ID!) {
  experiment(id: $id) {
    ...Experiment
  }
}
    ${ExperimentFragmentDoc}`;

/**
 * __useGetExperimentQuery__
 *
 * To run a query within a React component, call `useGetExperimentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExperimentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExperimentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetExperimentQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetExperimentQuery, GetExperimentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetExperimentQuery, GetExperimentQueryVariables>(GetExperimentDocument, options);
      }
export function useGetExperimentLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetExperimentQuery, GetExperimentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetExperimentQuery, GetExperimentQueryVariables>(GetExperimentDocument, options);
        }
export type GetExperimentQueryHookResult = ReturnType<typeof useGetExperimentQuery>;
export type GetExperimentLazyQueryHookResult = ReturnType<typeof useGetExperimentLazyQuery>;
export type GetExperimentQueryResult = Apollo.QueryResult<GetExperimentQuery, GetExperimentQueryVariables>;
export const ListExperimentsDocument = gql`
    query ListExperiments($filters: ExperimentFilter, $pagination: OffsetPaginationInput) {
  experiments(filters: $filters, pagination: $pagination) {
    ...ListExperiment
  }
}
    ${ListExperimentFragmentDoc}`;

/**
 * __useListExperimentsQuery__
 *
 * To run a query within a React component, call `useListExperimentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListExperimentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListExperimentsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListExperimentsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListExperimentsQuery, ListExperimentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListExperimentsQuery, ListExperimentsQueryVariables>(ListExperimentsDocument, options);
      }
export function useListExperimentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListExperimentsQuery, ListExperimentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListExperimentsQuery, ListExperimentsQueryVariables>(ListExperimentsDocument, options);
        }
export type ListExperimentsQueryHookResult = ReturnType<typeof useListExperimentsQuery>;
export type ListExperimentsLazyQueryHookResult = ReturnType<typeof useListExperimentsLazyQuery>;
export type ListExperimentsQueryResult = Apollo.QueryResult<ListExperimentsQuery, ListExperimentsQueryVariables>;
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
export function useGetFileQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetFileQuery, GetFileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetFileQuery, GetFileQueryVariables>(GetFileDocument, options);
      }
export function useGetFileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFileQuery, GetFileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetFileQuery, GetFileQueryVariables>(GetFileDocument, options);
        }
export type GetFileQueryHookResult = ReturnType<typeof useGetFileQuery>;
export type GetFileLazyQueryHookResult = ReturnType<typeof useGetFileLazyQuery>;
export type GetFileQueryResult = Apollo.QueryResult<GetFileQuery, GetFileQueryVariables>;
export const GetFilesDocument = gql`
    query GetFiles($filters: FileFilter, $pagination: OffsetPaginationInput) {
  files(filters: $filters, pagination: $pagination) {
    ...ListFile
  }
}
    ${ListFileFragmentDoc}`;

/**
 * __useGetFilesQuery__
 *
 * To run a query within a React component, call `useGetFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFilesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetFilesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFilesQuery, GetFilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetFilesQuery, GetFilesQueryVariables>(GetFilesDocument, options);
      }
export function useGetFilesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFilesQuery, GetFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetFilesQuery, GetFilesQueryVariables>(GetFilesDocument, options);
        }
export type GetFilesQueryHookResult = ReturnType<typeof useGetFilesQuery>;
export type GetFilesLazyQueryHookResult = ReturnType<typeof useGetFilesLazyQuery>;
export type GetFilesQueryResult = Apollo.QueryResult<GetFilesQuery, GetFilesQueryVariables>;
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
export function useGlobalSearchQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, options);
      }
export function useGlobalSearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, options);
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
export function useImagesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ImagesQuery, ImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ImagesQuery, ImagesQueryVariables>(ImagesDocument, options);
      }
export function useImagesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ImagesQuery, ImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ImagesQuery, ImagesQueryVariables>(ImagesDocument, options);
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
export function useGetImageQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetImageQuery, GetImageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetImageQuery, GetImageQueryVariables>(GetImageDocument, options);
      }
export function useGetImageLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetImageQuery, GetImageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetImageQuery, GetImageQueryVariables>(GetImageDocument, options);
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
export function useGetImagesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetImagesQuery, GetImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetImagesQuery, GetImagesQueryVariables>(GetImagesDocument, options);
      }
export function useGetImagesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetImagesQuery, GetImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetImagesQuery, GetImagesQueryVariables>(GetImagesDocument, options);
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
export function useGetInstrumentQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetInstrumentQuery, GetInstrumentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetInstrumentQuery, GetInstrumentQueryVariables>(GetInstrumentDocument, options);
      }
export function useGetInstrumentLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetInstrumentQuery, GetInstrumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetInstrumentQuery, GetInstrumentQueryVariables>(GetInstrumentDocument, options);
        }
export type GetInstrumentQueryHookResult = ReturnType<typeof useGetInstrumentQuery>;
export type GetInstrumentLazyQueryHookResult = ReturnType<typeof useGetInstrumentLazyQuery>;
export type GetInstrumentQueryResult = Apollo.QueryResult<GetInstrumentQuery, GetInstrumentQueryVariables>;
export const GetKnowledgeGraphDocument = gql`
    query GetKnowledgeGraph($id: ID!) {
  knowledgeGraph(id: $id) {
    ...KnowledgeGraph
  }
}
    ${KnowledgeGraphFragmentDoc}`;

/**
 * __useGetKnowledgeGraphQuery__
 *
 * To run a query within a React component, call `useGetKnowledgeGraphQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetKnowledgeGraphQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetKnowledgeGraphQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetKnowledgeGraphQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetKnowledgeGraphQuery, GetKnowledgeGraphQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetKnowledgeGraphQuery, GetKnowledgeGraphQueryVariables>(GetKnowledgeGraphDocument, options);
      }
export function useGetKnowledgeGraphLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetKnowledgeGraphQuery, GetKnowledgeGraphQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetKnowledgeGraphQuery, GetKnowledgeGraphQueryVariables>(GetKnowledgeGraphDocument, options);
        }
export type GetKnowledgeGraphQueryHookResult = ReturnType<typeof useGetKnowledgeGraphQuery>;
export type GetKnowledgeGraphLazyQueryHookResult = ReturnType<typeof useGetKnowledgeGraphLazyQuery>;
export type GetKnowledgeGraphQueryResult = Apollo.QueryResult<GetKnowledgeGraphQuery, GetKnowledgeGraphQueryVariables>;
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
export function useGetMultiWellPlateQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetMultiWellPlateQuery, GetMultiWellPlateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMultiWellPlateQuery, GetMultiWellPlateQueryVariables>(GetMultiWellPlateDocument, options);
      }
export function useGetMultiWellPlateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMultiWellPlateQuery, GetMultiWellPlateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMultiWellPlateQuery, GetMultiWellPlateQueryVariables>(GetMultiWellPlateDocument, options);
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
export function useGetMultiWellPlatesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMultiWellPlatesQuery, GetMultiWellPlatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMultiWellPlatesQuery, GetMultiWellPlatesQueryVariables>(GetMultiWellPlatesDocument, options);
      }
export function useGetMultiWellPlatesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMultiWellPlatesQuery, GetMultiWellPlatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMultiWellPlatesQuery, GetMultiWellPlatesQueryVariables>(GetMultiWellPlatesDocument, options);
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
export function useMultiWellPlateOptionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MultiWellPlateOptionsQuery, MultiWellPlateOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MultiWellPlateOptionsQuery, MultiWellPlateOptionsQueryVariables>(MultiWellPlateOptionsDocument, options);
      }
export function useMultiWellPlateOptionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MultiWellPlateOptionsQuery, MultiWellPlateOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MultiWellPlateOptionsQuery, MultiWellPlateOptionsQueryVariables>(MultiWellPlateOptionsDocument, options);
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
export function useGetObjectiveQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetObjectiveQuery, GetObjectiveQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetObjectiveQuery, GetObjectiveQueryVariables>(GetObjectiveDocument, options);
      }
export function useGetObjectiveLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetObjectiveQuery, GetObjectiveQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetObjectiveQuery, GetObjectiveQueryVariables>(GetObjectiveDocument, options);
        }
export type GetObjectiveQueryHookResult = ReturnType<typeof useGetObjectiveQuery>;
export type GetObjectiveLazyQueryHookResult = ReturnType<typeof useGetObjectiveLazyQuery>;
export type GetObjectiveQueryResult = Apollo.QueryResult<GetObjectiveQuery, GetObjectiveQueryVariables>;
export const GetOntologyDocument = gql`
    query GetOntology($id: ID!) {
  ontology(id: $id) {
    ...Ontology
  }
}
    ${OntologyFragmentDoc}`;

/**
 * __useGetOntologyQuery__
 *
 * To run a query within a React component, call `useGetOntologyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOntologyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOntologyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOntologyQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetOntologyQuery, GetOntologyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetOntologyQuery, GetOntologyQueryVariables>(GetOntologyDocument, options);
      }
export function useGetOntologyLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOntologyQuery, GetOntologyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetOntologyQuery, GetOntologyQueryVariables>(GetOntologyDocument, options);
        }
export type GetOntologyQueryHookResult = ReturnType<typeof useGetOntologyQuery>;
export type GetOntologyLazyQueryHookResult = ReturnType<typeof useGetOntologyLazyQuery>;
export type GetOntologyQueryResult = Apollo.QueryResult<GetOntologyQuery, GetOntologyQueryVariables>;
export const ListOntologiesDocument = gql`
    query ListOntologies {
  ontologies {
    ...ListOntology
  }
}
    ${ListOntologyFragmentDoc}`;

/**
 * __useListOntologiesQuery__
 *
 * To run a query within a React component, call `useListOntologiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListOntologiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListOntologiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useListOntologiesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListOntologiesQuery, ListOntologiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListOntologiesQuery, ListOntologiesQueryVariables>(ListOntologiesDocument, options);
      }
export function useListOntologiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListOntologiesQuery, ListOntologiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListOntologiesQuery, ListOntologiesQueryVariables>(ListOntologiesDocument, options);
        }
export type ListOntologiesQueryHookResult = ReturnType<typeof useListOntologiesQuery>;
export type ListOntologiesLazyQueryHookResult = ReturnType<typeof useListOntologiesLazyQuery>;
export type ListOntologiesQueryResult = Apollo.QueryResult<ListOntologiesQuery, ListOntologiesQueryVariables>;
export const SearchOntologiesDocument = gql`
    query SearchOntologies($search: String, $values: [ID!]) {
  options: ontologies(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchOntologiesQuery__
 *
 * To run a query within a React component, call `useSearchOntologiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchOntologiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchOntologiesQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchOntologiesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchOntologiesQuery, SearchOntologiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchOntologiesQuery, SearchOntologiesQueryVariables>(SearchOntologiesDocument, options);
      }
export function useSearchOntologiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchOntologiesQuery, SearchOntologiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchOntologiesQuery, SearchOntologiesQueryVariables>(SearchOntologiesDocument, options);
        }
export type SearchOntologiesQueryHookResult = ReturnType<typeof useSearchOntologiesQuery>;
export type SearchOntologiesLazyQueryHookResult = ReturnType<typeof useSearchOntologiesLazyQuery>;
export type SearchOntologiesQueryResult = Apollo.QueryResult<SearchOntologiesQuery, SearchOntologiesQueryVariables>;
export const GetProtocolStepDocument = gql`
    query GetProtocolStep($id: ID!) {
  protocolStep(id: $id) {
    ...ProtocolStep
  }
}
    ${ProtocolStepFragmentDoc}`;

/**
 * __useGetProtocolStepQuery__
 *
 * To run a query within a React component, call `useGetProtocolStepQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProtocolStepQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProtocolStepQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProtocolStepQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetProtocolStepQuery, GetProtocolStepQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetProtocolStepQuery, GetProtocolStepQueryVariables>(GetProtocolStepDocument, options);
      }
export function useGetProtocolStepLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProtocolStepQuery, GetProtocolStepQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetProtocolStepQuery, GetProtocolStepQueryVariables>(GetProtocolStepDocument, options);
        }
export type GetProtocolStepQueryHookResult = ReturnType<typeof useGetProtocolStepQuery>;
export type GetProtocolStepLazyQueryHookResult = ReturnType<typeof useGetProtocolStepLazyQuery>;
export type GetProtocolStepQueryResult = Apollo.QueryResult<GetProtocolStepQuery, GetProtocolStepQueryVariables>;
export const ListProtocolStepsDocument = gql`
    query ListProtocolSteps($filters: ProtocolStepFilter, $pagination: OffsetPaginationInput) {
  protocolSteps(filters: $filters, pagination: $pagination) {
    ...ListProtocolStep
  }
}
    ${ListProtocolStepFragmentDoc}`;

/**
 * __useListProtocolStepsQuery__
 *
 * To run a query within a React component, call `useListProtocolStepsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListProtocolStepsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListProtocolStepsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListProtocolStepsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListProtocolStepsQuery, ListProtocolStepsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListProtocolStepsQuery, ListProtocolStepsQueryVariables>(ListProtocolStepsDocument, options);
      }
export function useListProtocolStepsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListProtocolStepsQuery, ListProtocolStepsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListProtocolStepsQuery, ListProtocolStepsQueryVariables>(ListProtocolStepsDocument, options);
        }
export type ListProtocolStepsQueryHookResult = ReturnType<typeof useListProtocolStepsQuery>;
export type ListProtocolStepsLazyQueryHookResult = ReturnType<typeof useListProtocolStepsLazyQuery>;
export type ListProtocolStepsQueryResult = Apollo.QueryResult<ListProtocolStepsQuery, ListProtocolStepsQueryVariables>;
export const SearchProtocolStepsDocument = gql`
    query SearchProtocolSteps($search: String, $values: [ID!]) {
  options: protocolSteps(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchProtocolStepsQuery__
 *
 * To run a query within a React component, call `useSearchProtocolStepsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProtocolStepsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProtocolStepsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchProtocolStepsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchProtocolStepsQuery, SearchProtocolStepsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchProtocolStepsQuery, SearchProtocolStepsQueryVariables>(SearchProtocolStepsDocument, options);
      }
export function useSearchProtocolStepsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchProtocolStepsQuery, SearchProtocolStepsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchProtocolStepsQuery, SearchProtocolStepsQueryVariables>(SearchProtocolStepsDocument, options);
        }
export type SearchProtocolStepsQueryHookResult = ReturnType<typeof useSearchProtocolStepsQuery>;
export type SearchProtocolStepsLazyQueryHookResult = ReturnType<typeof useSearchProtocolStepsLazyQuery>;
export type SearchProtocolStepsQueryResult = Apollo.QueryResult<SearchProtocolStepsQuery, SearchProtocolStepsQueryVariables>;
export const GetProtocolDocument = gql`
    query GetProtocol($id: ID!) {
  protocol(id: $id) {
    ...Protocol
  }
}
    ${ProtocolFragmentDoc}`;

/**
 * __useGetProtocolQuery__
 *
 * To run a query within a React component, call `useGetProtocolQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProtocolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProtocolQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProtocolQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetProtocolQuery, GetProtocolQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetProtocolQuery, GetProtocolQueryVariables>(GetProtocolDocument, options);
      }
export function useGetProtocolLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProtocolQuery, GetProtocolQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetProtocolQuery, GetProtocolQueryVariables>(GetProtocolDocument, options);
        }
export type GetProtocolQueryHookResult = ReturnType<typeof useGetProtocolQuery>;
export type GetProtocolLazyQueryHookResult = ReturnType<typeof useGetProtocolLazyQuery>;
export type GetProtocolQueryResult = Apollo.QueryResult<GetProtocolQuery, GetProtocolQueryVariables>;
export const ListProtocolsDocument = gql`
    query ListProtocols($filters: ProtocolFilter, $pagination: OffsetPaginationInput) {
  protocols(filters: $filters, pagination: $pagination) {
    ...ListProtocol
  }
}
    ${ListProtocolFragmentDoc}`;

/**
 * __useListProtocolsQuery__
 *
 * To run a query within a React component, call `useListProtocolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListProtocolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListProtocolsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListProtocolsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListProtocolsQuery, ListProtocolsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListProtocolsQuery, ListProtocolsQueryVariables>(ListProtocolsDocument, options);
      }
export function useListProtocolsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListProtocolsQuery, ListProtocolsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListProtocolsQuery, ListProtocolsQueryVariables>(ListProtocolsDocument, options);
        }
export type ListProtocolsQueryHookResult = ReturnType<typeof useListProtocolsQuery>;
export type ListProtocolsLazyQueryHookResult = ReturnType<typeof useListProtocolsLazyQuery>;
export type ListProtocolsQueryResult = Apollo.QueryResult<ListProtocolsQuery, ListProtocolsQueryVariables>;
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
export function useRenderTreeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<RenderTreeQuery, RenderTreeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<RenderTreeQuery, RenderTreeQueryVariables>(RenderTreeDocument, options);
      }
export function useRenderTreeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RenderTreeQuery, RenderTreeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<RenderTreeQuery, RenderTreeQueryVariables>(RenderTreeDocument, options);
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
export function useRenderTreesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<RenderTreesQuery, RenderTreesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<RenderTreesQuery, RenderTreesQueryVariables>(RenderTreesDocument, options);
      }
export function useRenderTreesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RenderTreesQuery, RenderTreesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<RenderTreesQuery, RenderTreesQueryVariables>(RenderTreesDocument, options);
        }
export type RenderTreesQueryHookResult = ReturnType<typeof useRenderTreesQuery>;
export type RenderTreesLazyQueryHookResult = ReturnType<typeof useRenderTreesLazyQuery>;
export type RenderTreesQueryResult = Apollo.QueryResult<RenderTreesQuery, RenderTreesQueryVariables>;
export const GetRenderedPlotDocument = gql`
    query GetRenderedPlot($id: ID!) {
  renderedPlot(id: $id) {
    ...RenderedPlot
  }
}
    ${RenderedPlotFragmentDoc}`;

/**
 * __useGetRenderedPlotQuery__
 *
 * To run a query within a React component, call `useGetRenderedPlotQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRenderedPlotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRenderedPlotQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRenderedPlotQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRenderedPlotQuery, GetRenderedPlotQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRenderedPlotQuery, GetRenderedPlotQueryVariables>(GetRenderedPlotDocument, options);
      }
export function useGetRenderedPlotLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRenderedPlotQuery, GetRenderedPlotQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRenderedPlotQuery, GetRenderedPlotQueryVariables>(GetRenderedPlotDocument, options);
        }
export type GetRenderedPlotQueryHookResult = ReturnType<typeof useGetRenderedPlotQuery>;
export type GetRenderedPlotLazyQueryHookResult = ReturnType<typeof useGetRenderedPlotLazyQuery>;
export type GetRenderedPlotQueryResult = Apollo.QueryResult<GetRenderedPlotQuery, GetRenderedPlotQueryVariables>;
export const ListRenderedPlotsDocument = gql`
    query ListRenderedPlots {
  renderedPlots {
    ...ListRenderedPlot
  }
}
    ${ListRenderedPlotFragmentDoc}`;

/**
 * __useListRenderedPlotsQuery__
 *
 * To run a query within a React component, call `useListRenderedPlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListRenderedPlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListRenderedPlotsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListRenderedPlotsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListRenderedPlotsQuery, ListRenderedPlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListRenderedPlotsQuery, ListRenderedPlotsQueryVariables>(ListRenderedPlotsDocument, options);
      }
export function useListRenderedPlotsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListRenderedPlotsQuery, ListRenderedPlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListRenderedPlotsQuery, ListRenderedPlotsQueryVariables>(ListRenderedPlotsDocument, options);
        }
export type ListRenderedPlotsQueryHookResult = ReturnType<typeof useListRenderedPlotsQuery>;
export type ListRenderedPlotsLazyQueryHookResult = ReturnType<typeof useListRenderedPlotsLazyQuery>;
export type ListRenderedPlotsQueryResult = Apollo.QueryResult<ListRenderedPlotsQuery, ListRenderedPlotsQueryVariables>;
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
export function useGetRgbContextQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRgbContextQuery, GetRgbContextQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRgbContextQuery, GetRgbContextQueryVariables>(GetRgbContextDocument, options);
      }
export function useGetRgbContextLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRgbContextQuery, GetRgbContextQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRgbContextQuery, GetRgbContextQueryVariables>(GetRgbContextDocument, options);
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
export function useGetRgbContextsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRgbContextsQuery, GetRgbContextsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRgbContextsQuery, GetRgbContextsQueryVariables>(GetRgbContextsDocument, options);
      }
export function useGetRgbContextsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRgbContextsQuery, GetRgbContextsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRgbContextsQuery, GetRgbContextsQueryVariables>(GetRgbContextsDocument, options);
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
export function useRgbContextOptionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<RgbContextOptionsQuery, RgbContextOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<RgbContextOptionsQuery, RgbContextOptionsQueryVariables>(RgbContextOptionsDocument, options);
      }
export function useRgbContextOptionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RgbContextOptionsQuery, RgbContextOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<RgbContextOptionsQuery, RgbContextOptionsQueryVariables>(RgbContextOptionsDocument, options);
        }
export type RgbContextOptionsQueryHookResult = ReturnType<typeof useRgbContextOptionsQuery>;
export type RgbContextOptionsLazyQueryHookResult = ReturnType<typeof useRgbContextOptionsLazyQuery>;
export type RgbContextOptionsQueryResult = Apollo.QueryResult<RgbContextOptionsQuery, RgbContextOptionsQueryVariables>;
export const GetSpecimenDocument = gql`
    query GetSpecimen($id: ID!) {
  specimen(id: $id) {
    ...Specimen
  }
}
    ${SpecimenFragmentDoc}`;

/**
 * __useGetSpecimenQuery__
 *
 * To run a query within a React component, call `useGetSpecimenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSpecimenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSpecimenQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSpecimenQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetSpecimenQuery, GetSpecimenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetSpecimenQuery, GetSpecimenQueryVariables>(GetSpecimenDocument, options);
      }
export function useGetSpecimenLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetSpecimenQuery, GetSpecimenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetSpecimenQuery, GetSpecimenQueryVariables>(GetSpecimenDocument, options);
        }
export type GetSpecimenQueryHookResult = ReturnType<typeof useGetSpecimenQuery>;
export type GetSpecimenLazyQueryHookResult = ReturnType<typeof useGetSpecimenLazyQuery>;
export type GetSpecimenQueryResult = Apollo.QueryResult<GetSpecimenQuery, GetSpecimenQueryVariables>;
export const ListSpecimensDocument = gql`
    query ListSpecimens {
  specimens {
    ...Specimen
  }
}
    ${SpecimenFragmentDoc}`;

/**
 * __useListSpecimensQuery__
 *
 * To run a query within a React component, call `useListSpecimensQuery` and pass it any options that fit your needs.
 * When your component renders, `useListSpecimensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListSpecimensQuery({
 *   variables: {
 *   },
 * });
 */
export function useListSpecimensQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListSpecimensQuery, ListSpecimensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListSpecimensQuery, ListSpecimensQueryVariables>(ListSpecimensDocument, options);
      }
export function useListSpecimensLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListSpecimensQuery, ListSpecimensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListSpecimensQuery, ListSpecimensQueryVariables>(ListSpecimensDocument, options);
        }
export type ListSpecimensQueryHookResult = ReturnType<typeof useListSpecimensQuery>;
export type ListSpecimensLazyQueryHookResult = ReturnType<typeof useListSpecimensLazyQuery>;
export type ListSpecimensQueryResult = Apollo.QueryResult<ListSpecimensQuery, ListSpecimensQueryVariables>;
export const SearchSpecimensDocument = gql`
    query SearchSpecimens($search: String, $values: [ID!]) {
  options: specimens(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchSpecimensQuery__
 *
 * To run a query within a React component, call `useSearchSpecimensQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSpecimensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSpecimensQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchSpecimensQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchSpecimensQuery, SearchSpecimensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchSpecimensQuery, SearchSpecimensQueryVariables>(SearchSpecimensDocument, options);
      }
export function useSearchSpecimensLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchSpecimensQuery, SearchSpecimensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchSpecimensQuery, SearchSpecimensQueryVariables>(SearchSpecimensDocument, options);
        }
export type SearchSpecimensQueryHookResult = ReturnType<typeof useSearchSpecimensQuery>;
export type SearchSpecimensLazyQueryHookResult = ReturnType<typeof useSearchSpecimensLazyQuery>;
export type SearchSpecimensQueryResult = Apollo.QueryResult<SearchSpecimensQuery, SearchSpecimensQueryVariables>;
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
export function useGetStageQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetStageQuery, GetStageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetStageQuery, GetStageQueryVariables>(GetStageDocument, options);
      }
export function useGetStageLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetStageQuery, GetStageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetStageQuery, GetStageQueryVariables>(GetStageDocument, options);
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
export function useGetStagesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetStagesQuery, GetStagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetStagesQuery, GetStagesQueryVariables>(GetStagesDocument, options);
      }
export function useGetStagesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetStagesQuery, GetStagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetStagesQuery, GetStagesQueryVariables>(GetStagesDocument, options);
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
export function useStageOptionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<StageOptionsQuery, StageOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<StageOptionsQuery, StageOptionsQueryVariables>(StageOptionsDocument, options);
      }
export function useStageOptionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<StageOptionsQuery, StageOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<StageOptionsQuery, StageOptionsQueryVariables>(StageOptionsDocument, options);
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
export function useGetTableQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetTableQuery, GetTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetTableQuery, GetTableQueryVariables>(GetTableDocument, options);
      }
export function useGetTableLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetTableQuery, GetTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetTableQuery, GetTableQueryVariables>(GetTableDocument, options);
        }
export type GetTableQueryHookResult = ReturnType<typeof useGetTableQuery>;
export type GetTableLazyQueryHookResult = ReturnType<typeof useGetTableLazyQuery>;
export type GetTableQueryResult = Apollo.QueryResult<GetTableQuery, GetTableQueryVariables>;
export const GetTablesDocument = gql`
    query GetTables($filters: TableFilter, $pagination: OffsetPaginationInput) {
  tables(filters: $filters, pagination: $pagination) {
    ...ListTable
  }
}
    ${ListTableFragmentDoc}`;

/**
 * __useGetTablesQuery__
 *
 * To run a query within a React component, call `useGetTablesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTablesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTablesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetTablesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetTablesQuery, GetTablesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetTablesQuery, GetTablesQueryVariables>(GetTablesDocument, options);
      }
export function useGetTablesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetTablesQuery, GetTablesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetTablesQuery, GetTablesQueryVariables>(GetTablesDocument, options);
        }
export type GetTablesQueryHookResult = ReturnType<typeof useGetTablesQuery>;
export type GetTablesLazyQueryHookResult = ReturnType<typeof useGetTablesLazyQuery>;
export type GetTablesQueryResult = Apollo.QueryResult<GetTablesQuery, GetTablesQueryVariables>;