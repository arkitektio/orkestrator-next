import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Any: { input: any; output: any; }
  ArrayLike: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  FileLike: { input: any; output: any; }
  FiveDVector: { input: any; output: any; }
  FourByFourMatrix: { input: any; output: any; }
  ImageFileLike: { input: any; output: any; }
  JSON: { input: any; output: any; }
  LabelsLike: { input: any; output: any; }
  MeshLike: { input: any; output: any; }
  MetricMap: { input: any; output: any; }
  Micrometers: { input: any; output: any; }
  Milliseconds: { input: any; output: any; }
  ParquetLike: { input: any; output: any; }
  ThreeDVector: { input: any; output: any; }
  _Any: { input: any; output: any; }
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

export type Accessor = {
  id: Scalars['ID']['output'];
  keys: Array<Scalars['String']['output']>;
  maxIndex?: Maybe<Scalars['Int']['output']>;
  minIndex?: Maybe<Scalars['Int']['output']>;
  table: Table;
};

export type AccessorFilter = {
  AND?: InputMaybe<AccessorFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<AccessorFilter>;
  OR?: InputMaybe<AccessorFilter>;
  keys?: InputMaybe<Scalars['JSON']['input']>;
};

export enum AccessorKind {
  Image = 'IMAGE',
  Label = 'LABEL'
}

export type AcquisitionView = View & {
  __typename?: 'AcquisitionView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  acquiredAt?: Maybe<Scalars['DateTime']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
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


export type AcquisitionViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type AffineTransformationView = View & {
  __typename?: 'AffineTransformationView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  affineMatrix: Scalars['FourByFourMatrix']['output'];
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  isotropic: Scalars['Boolean']['output'];
  pixelSize: Scalars['ThreeDVector']['output'];
  pixelSizeX: Scalars['Micrometers']['output'];
  pixelSizeY: Scalars['Micrometers']['output'];
  pixelSizeZ: Scalars['Micrometers']['output'];
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


export type AffineTransformationViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type AffineTransformationViewEvent = {
  __typename?: 'AffineTransformationViewEvent';
  create?: Maybe<AffineTransformationView>;
  delete?: Maybe<Scalars['ID']['output']>;
  update?: Maybe<AffineTransformationView>;
};

export type AffineTransformationViewFilter = {
  AND?: InputMaybe<AffineTransformationViewFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<AffineTransformationViewFilter>;
  OR?: InputMaybe<AffineTransformationViewFilter>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  pixelSize?: InputMaybe<FloatFilterLookup>;
  stage?: InputMaybe<StageFilter>;
};

export type AffineTransformationViewInput = {
  affineMatrix: Scalars['FourByFourMatrix']['input'];
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  stage?: InputMaybe<Scalars['ID']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type AssignUserPermissionInput = {
  identifier: Scalars['String']['input'];
  object: Scalars['ID']['input'];
  permissions: Array<Scalars['String']['input']>;
  user: Scalars['ID']['input'];
};

export type AssociateInput = {
  other: Scalars['ID']['input'];
  selfs: Array<Scalars['ID']['input']>;
};

/** Beam splitter */
export type BeamSplitterElement = OpticalElement & {
  __typename?: 'BeamSplitterElement';
  band?: Maybe<Spectrum>;
  id: Scalars['ID']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  rFraction: Scalars['Float']['output'];
  serialNumber?: Maybe<Scalars['String']['output']>;
  tFraction: Scalars['Float']['output'];
};

/** Beam properties carried on a light edge */
export type BeamState = {
  __typename?: 'BeamState';
  modeHint?: Maybe<Scalars['String']['output']>;
  polarization?: Maybe<Scalars['String']['output']>;
  powerMw?: Maybe<Scalars['Float']['output']>;
  wavelengthNm?: Maybe<Scalars['Float']['output']>;
};

/** State of the optical beam on a particular path segment. */
export type BeamStateInput = {
  modeHint?: InputMaybe<Scalars['String']['input']>;
  polarization?: InputMaybe<Scalars['String']['input']>;
  powerMw?: InputMaybe<Scalars['Float']['input']>;
  wavelengthNm?: InputMaybe<Scalars['Float']['input']>;
};

export type BigFileStore = {
  __typename?: 'BigFileStore';
  bucket: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  path: Scalars['String']['output'];
  presignedUrl: Scalars['String']['output'];
};

export enum Blending {
  Additive = 'ADDITIVE',
  Multiplicative = 'MULTIPLICATIVE'
}

/** Detector */
export type CcdElement = OpticalElement & {
  __typename?: 'CCDElement';
  id: Scalars['ID']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  pixelSizeUm?: Maybe<Scalars['Float']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  resolution?: Maybe<Array<Scalars['Int']['output']>>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

export type Camera = {
  __typename?: 'Camera';
  bitDepth?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  organization: DjangoModelType;
  pixelSizeX?: Maybe<Scalars['Micrometers']['output']>;
  pixelSizeY?: Maybe<Scalars['Micrometers']['output']>;
  /** Provenance entries for this camera */
  provenanceEntries: Array<ProvenanceEntry>;
  sensorSizeX?: Maybe<Scalars['Int']['output']>;
  sensorSizeY?: Maybe<Scalars['Int']['output']>;
  serialNumber: Scalars['String']['output'];
  views: Array<OpticsView>;
};


export type CameraProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type CameraViewsArgs = {
  filters?: InputMaybe<OpticsViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type CameraFilter = {
  AND?: InputMaybe<CameraFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<CameraFilter>;
  OR?: InputMaybe<CameraFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
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
  parent?: InputMaybe<Scalars['ID']['input']>;
};

/** A channel descriptor */
export type ChannelInfo = {
  __typename?: 'ChannelInfo';
  index: Scalars['Int']['output'];
  label: Scalars['String']['output'];
};


/** A channel descriptor */
export type ChannelInfoLabelArgs = {
  withColorName?: Scalars['Boolean']['input'];
};

export type ChannelInfoFilter = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export enum ChannelKind {
  FiberMm = 'FIBER_MM',
  FiberSm = 'FIBER_SM',
  FreeSpace = 'FREE_SPACE',
  Waveguide = 'WAVEGUIDE'
}

export type ChannelView = View & {
  __typename?: 'ChannelView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  /** The acquisition mode of the channel */
  acquisitionMode?: Maybe<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
  /** The emission wavelength of the channel in nanometers */
  emissionWavelength?: Maybe<Scalars['Float']['output']>;
  /** The excitation wavelength of the channel in nanometers */
  excitationWavelength?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  /** The name of the channel  */
  name?: Maybe<Scalars['String']['output']>;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};


export type ChannelViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type ChannelViewInput = {
  /** The acquisition mode of the channel */
  acquisitionMode?: InputMaybe<Scalars['String']['input']>;
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  /** The emission wavelength of the channel in nanometers */
  emissionWavelength?: InputMaybe<Scalars['Float']['input']>;
  /** The excitation wavelength of the channel in nanometers */
  excitationWavelength?: InputMaybe<Scalars['Float']['input']>;
  /** The ID of the image this view is for */
  image: Scalars['ID']['input'];
  /** The name of the channel */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type ChildrenOrder = {
  direction: ChildrenOrderDirection;
  field: ChildrenOrderField;
};

export enum ChildrenOrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum ChildrenOrderField {
  CreatedAt = 'CREATED_AT',
  Name = 'NAME',
  UpdatedAt = 'UPDATED_AT'
}

export type ChildrenPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Client = {
  __typename?: 'Client';
  clientId: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export enum ColorFormat {
  Hsl = 'HSL',
  Rgb = 'RGB'
}

export enum ColorMap {
  Black = 'BLACK',
  Blue = 'BLUE',
  Brown = 'BROWN',
  Cool = 'COOL',
  Cyan = 'CYAN',
  Green = 'GREEN',
  Grey = 'GREY',
  Inferno = 'INFERNO',
  Intensity = 'INTENSITY',
  Magenta = 'MAGENTA',
  Magma = 'MAGMA',
  Orange = 'ORANGE',
  Pink = 'PINK',
  Plasma = 'PLASMA',
  Purple = 'PURPLE',
  Rainbow = 'RAINBOW',
  Red = 'RED',
  Spectral = 'SPECTRAL',
  Viridis = 'VIRIDIS',
  Warm = 'WARM',
  White = 'WHITE',
  Yellow = 'YELLOW'
}

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
  /** All views of this image */
  congruentViews: Array<View>;
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


export type ContinousScanViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type ContinousScanViewFilter = {
  AND?: InputMaybe<ContinousScanViewFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ContinousScanViewFilter>;
  OR?: InputMaybe<ContinousScanViewFilter>;
  direction?: InputMaybe<ContinousScanDirection>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ContinousScanViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  direction: ScanDirection;
  image: Scalars['ID']['input'];
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateDatasetInput = {
  name: Scalars['String']['input'];
  parent?: InputMaybe<Scalars['ID']['input']>;
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
  id: Scalars['ID']['output'];
  images: Array<Image>;
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<Dataset>;
  pinned: Scalars['Boolean']['output'];
  /** Provenance entries for this camera */
  provenanceEntries: Array<ProvenanceEntry>;
  tags: Array<Scalars['String']['output']>;
};


export type DatasetChildrenArgs = {
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type DatasetFilesArgs = {
  filters?: InputMaybe<FileFilter>;
  order?: InputMaybe<FileOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type DatasetImagesArgs = {
  filters?: InputMaybe<ImageFilter>;
  order?: InputMaybe<ImageOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type DatasetProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type DatasetChildrenFilter = {
  search?: InputMaybe<Scalars['String']['input']>;
  showChildren?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DatasetFilter = {
  AND?: InputMaybe<DatasetFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<DatasetFilter>;
  OR?: InputMaybe<DatasetFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  owner?: InputMaybe<Scalars['ID']['input']>;
  parentless?: InputMaybe<Scalars['Boolean']['input']>;
  scope?: InputMaybe<ScopeFilter>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type DatasetImageFile = Dataset | File | Image;

export type DeleteCameraInput = {
  id: Scalars['ID']['input'];
};

export type DeleteDatasetInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEraInput = {
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

export type DeleteMeshInput = {
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

export type DeleteRoiInput = {
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

export type DerivedView = View & {
  __typename?: 'DerivedView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  operation?: Maybe<Scalars['String']['output']>;
  originImage: Image;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};


export type DerivedViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type Descriptor = {
  __typename?: 'Descriptor';
  description?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  value: Scalars['Any']['output'];
};

export type DesociateInput = {
  other: Scalars['ID']['input'];
  selfs: Array<Scalars['ID']['input']>;
};

/** Detector */
export type DetectorElement = OpticalElement & {
  __typename?: 'DetectorElement';
  /** Amplifier gain (dB) */
  amplifierGainDb?: Maybe<Scalars['Float']['output']>;
  /** Overall gain (unitless) */
  gain?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  nepdWPerSqrtHz?: Maybe<Scalars['Float']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

export type DimSelector = {
  end?: InputMaybe<Scalars['Int']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  indices?: InputMaybe<Array<Scalars['Int']['input']>>;
  kind: DimSelectorKind;
  start?: InputMaybe<Scalars['Int']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};

export enum DimSelectorKind {
  All = 'ALL',
  Index = 'INDEX',
  Indices = 'INDICES',
  Slice = 'SLICE'
}

export type DjangoModelType = {
  __typename?: 'DjangoModelType';
  pk: Scalars['ID']['output'];
};

export enum DuckDbDataType {
  /** Large integer for large numeric values */
  Bigint = 'BIGINT',
  /** Array of large integers */
  BigintArray = 'BIGINT_ARRAY',
  /** 2D Array of large integers */
  BigintArrayArray = 'BIGINT_ARRAY_ARRAY',
  /** Binary large object for storing binary data */
  Blob = 'BLOB',
  /** Represents a True/False value */
  Boolean = 'BOOLEAN',
  /** Array of boolean values */
  BooleanArray = 'BOOLEAN_ARRAY',
  /** Specific date (year, month, day) */
  Date = 'DATE',
  /** Array of dates */
  DateArray = 'DATE_ARRAY',
  /** Exact decimal number with defined precision and scale */
  Decimal = 'DECIMAL',
  /** Double-precision floating point number */
  Double = 'DOUBLE',
  /** Array of double-precision floating point numbers */
  DoubleArray = 'DOUBLE_ARRAY',
  /** Enumeration of predefined values */
  Enum = 'ENUM',
  /** Single-precision floating point number */
  Float = 'FLOAT',
  /** Extremely large integer for very large numeric ranges */
  Hugeint = 'HUGEINT',
  /** Standard integer (-2,147,483,648 to 2,147,483,647) */
  Integer = 'INTEGER',
  /** Span of time between two dates or times */
  Interval = 'INTERVAL',
  /** JSON object, a structured text format used for representing data */
  Json = 'JSON',
  /** A list of values of the same data type */
  List = 'LIST',
  /** A collection of key-value pairs where each key is unique */
  Map = 'MAP',
  /** Small integer (-32,768 to 32,767) */
  Smallint = 'SMALLINT',
  /** Composite type grouping several fields with different data types */
  Struct = 'STRUCT',
  /** Specific time of the day (hours, minutes, seconds) */
  Time = 'TIME',
  /** Date and time with precision */
  Timestamp = 'TIMESTAMP',
  /** Array of times */
  TimeArray = 'TIME_ARRAY',
  /** Very small integer (-128 to 127) */
  Tinyint = 'TINYINT',
  /** Universally Unique Identifier used to uniquely identify objects */
  Uuid = 'UUID',
  /** Variable-length string (text) */
  Varchar = 'VARCHAR',
  /** Array of variable-length strings */
  VarcharArray = 'VARCHAR_ARRAY'
}

export enum ElementKind {
  Aperture = 'APERTURE',
  BeamSplitter = 'BEAM_SPLITTER',
  Ccd = 'CCD',
  Detector = 'DETECTOR',
  Filter = 'FILTER',
  Lamp = 'LAMP',
  Laser = 'LASER',
  Lens = 'LENS',
  Mirror = 'MIRROR',
  Objective = 'OBJECTIVE',
  Other = 'OTHER',
  OtherSource = 'OTHER_SOURCE',
  Pinhole = 'PINHOLE',
  Polarizer = 'POLARIZER',
  Sample = 'SAMPLE',
  Shutter = 'SHUTTER',
  Waveplate = 'WAVEPLATE'
}

export type Era = {
  __typename?: 'Era';
  begin?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** Provenance entries for this camera */
  provenanceEntries: Array<ProvenanceEntry>;
  views: Array<TimepointView>;
};


export type EraProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type EraViewsArgs = {
  filters?: InputMaybe<TimepointViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type EraFilter = {
  AND?: InputMaybe<EraFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<EraFilter>;
  OR?: InputMaybe<EraFilter>;
  begin?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type EraInput = {
  begin?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
};

/** Euler angles for 3D orientation */
export type Euler = {
  __typename?: 'Euler';
  rx?: Maybe<Scalars['Float']['output']>;
  ry?: Maybe<Scalars['Float']['output']>;
  rz?: Maybe<Scalars['Float']['output']>;
};

/** Euler angles representing rotation in 3D space. */
export type EulerInput = {
  rx?: InputMaybe<Scalars['Float']['input']>;
  ry?: InputMaybe<Scalars['Float']['input']>;
  rz?: InputMaybe<Scalars['Float']['input']>;
};

export type Experiment = {
  __typename?: 'Experiment';
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** Provenance entries for this camera */
  provenanceEntries: Array<ProvenanceEntry>;
};


export type ExperimentProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ExperimentFilter = {
  AND?: InputMaybe<ExperimentFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ExperimentFilter>;
  OR?: InputMaybe<ExperimentFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type File = {
  __typename?: 'File';
  /** The user who created this file */
  creator: User;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** The organization this file belongs to */
  organization: Organization;
  origins: Array<Image>;
  /** Provenance entries for this camera */
  provenanceEntries: Array<ProvenanceEntry>;
  store: BigFileStore;
  views: Array<FileView>;
};


export type FileOriginsArgs = {
  filters?: InputMaybe<ImageFilter>;
  order?: InputMaybe<ImageOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type FileProvenanceEntriesArgs = {
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
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<FileFilter>;
  OR?: InputMaybe<FileFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  owner?: InputMaybe<Scalars['ID']['input']>;
  scope?: InputMaybe<ScopeKind>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type FileOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type FileView = View & {
  __typename?: 'FileView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
  file: File;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  seriesIdentifier?: Maybe<Scalars['String']['output']>;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};


export type FileViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type FileViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  file: Scalars['ID']['input'];
  image: Scalars['ID']['input'];
  seriesIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter */
export type FilterElement = OpticalElement & {
  __typename?: 'FilterElement';
  id: Scalars['ID']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  serialNumber?: Maybe<Scalars['String']['output']>;
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
  range?: InputMaybe<Array<Scalars['Float']['input']>>;
  regex?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['Float']['input']>;
};

/** A channel descriptor */
export type FrameInfo = {
  __typename?: 'FrameInfo';
  label: Scalars['String']['output'];
};

/** Input type for creating an image from an array-like object */
export type FromArrayLikeInput = {
  /** Optional list of acquisition views */
  acquisitionViews?: InputMaybe<Array<PartialAcquisitionViewInput>>;
  /** The array-like object to create the image from */
  array: Scalars['ArrayLike']['input'];
  /** Optional list of channel views */
  channelViews?: InputMaybe<Array<PartialChannelViewInput>>;
  /** Optional dataset ID to associate the image with */
  dataset?: InputMaybe<Scalars['ID']['input']>;
  /** Optional list of derived views */
  derivedViews?: InputMaybe<Array<PartialDerivedViewInput>>;
  /** Optional list of file views */
  fileViews?: InputMaybe<Array<PartialFileViewInput>>;
  /** Optional list of instance mask views */
  instanceMaskViews?: InputMaybe<Array<PartialInstanceMaskViewInput>>;
  /** Optional list of lightpath views */
  lightpathViews?: InputMaybe<Array<PartialLightpathViewInput>>;
  /** Optional list of mask views */
  maskViews?: InputMaybe<Array<PartialMaskViewInput>>;
  /** The name of the image */
  name: Scalars['String']['input'];
  /** Optional list of optics views */
  opticsViews?: InputMaybe<Array<PartialOpticsViewInput>>;
  /** Optional list of reference views */
  referenceViews?: InputMaybe<Array<PartialReferenceViewInput>>;
  /** Optional list of RGB views */
  rgbViews?: InputMaybe<Array<PartialRgbViewInput>>;
  /** Optional list of ROI views */
  roiViews?: InputMaybe<Array<PartialRoiViewInput>>;
  /** Optional list of scale views */
  scaleViews?: InputMaybe<Array<PartialScaleViewInput>>;
  /** Optional list of tags to associate with the image */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Optional list of timepoint views */
  timepointViews?: InputMaybe<Array<PartialTimepointViewInput>>;
  /** Optional list of affine transformation views */
  transformationViews?: InputMaybe<Array<PartialAffineTransformationViewInput>>;
};

export type FromFileLike = {
  dataset?: InputMaybe<Scalars['ID']['input']>;
  file: Scalars['FileLike']['input'];
  fileName: Scalars['String']['input'];
  origins?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type FromParquetLike = {
  /** The parquet dataframe to create the table from */
  dataframe: Scalars['ParquetLike']['input'];
  /** The dataset ID this table belongs to */
  dataset?: InputMaybe<Scalars['ID']['input']>;
  /** Image accessors to create for this table */
  imageAccessors?: InputMaybe<Array<PartialImageAccessorInput>>;
  /** Label accessors to create for this table */
  labelAccessors?: InputMaybe<Array<PartialLabelAccessorInput>>;
  /** The name of the table */
  name: Scalars['String']['input'];
  /** The IDs of tables this table was derived from */
  origins?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export enum Granularity {
  Day = 'DAY',
  Hour = 'HOUR',
  Month = 'MONTH',
  Quarter = 'QUARTER',
  Week = 'WEEK',
  Year = 'YEAR'
}

export type HistogramView = View & {
  __typename?: 'HistogramView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  bins: Array<Scalars['Float']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
  histogram: Array<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};


export type HistogramViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type HistogramViewInput = {
  bins: Array<Scalars['Float']['input']>;
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  histogram: Array<Scalars['Float']['input']>;
  image: Scalars['ID']['input'];
  max: Scalars['Float']['input'];
  min: Scalars['Float']['input'];
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

/** The type of change that was made. */
export enum HistoryKind {
  Create = 'CREATE',
  Delete = 'DELETE',
  Update = 'UPDATE'
}

export type Image = {
  __typename?: 'Image';
  /** The affine transformation views describing position and scale */
  affineTransformationViews: Array<AffineTransformationView>;
  /** Channel views relating to acquisition channels */
  channelViews: Array<ChannelView>;
  /** The channels of this image */
  channels: Array<ChannelInfo>;
  /** When this image was created */
  createdAt: Scalars['DateTime']['output'];
  /** Who created this image */
  creator?: Maybe<User>;
  /** The dataset this image belongs to */
  dataset?: Maybe<Dataset>;
  /** Views this image was derived from */
  derivedFromViews: Array<DerivedView>;
  /** Instance mask views */
  derivedInstanceMaskViews: Array<InstanceMaskView>;
  /** Scale views derived from this image */
  derivedScaleViews: Array<ScaleView>;
  /** Views derived from this image */
  derivedViews: Array<DerivedView>;
  /** File views relating to source files */
  fileViews: Array<FileView>;
  /** The channels of this image */
  frames: Array<FrameInfo>;
  /** Histogram views describing pixel value distribution */
  histogramViews: Array<HistogramView>;
  id: Scalars['ID']['output'];
  /** Instance mask views relating other Arkitekt types to a subsection of the image */
  instanceMaskViews: Array<InstanceMaskView>;
  /** Label views mapping channels to labels */
  labelViews: Array<LabelView>;
  /** The latest snapshot of this image */
  latestSnapshot?: Maybe<Snapshot>;
  /** Lightpath views describing the lightpath used to acquire this image */
  lightpathViews: Array<LightpathView>;
  /** Structure views relating other Arkitekt types to a subsection of the image */
  maskViews: Array<MaskView>;
  /** The name of the image */
  name: Scalars['String']['output'];
  /** Optics views describing acquisition settings */
  opticsViews: Array<OpticsView>;
  /** Is this image pinned by the current user */
  pinned: Scalars['Boolean']['output'];
  /** The channels of this image */
  planes: Array<PlaneInfo>;
  /** Provenance entries for this camera */
  provenanceEntries: Array<ProvenanceEntry>;
  /** Reference views describing relationships to other views */
  referenceViews: Array<ReferenceView>;
  renders: Array<Render>;
  /** RGB rendering contexts */
  rgbContexts: Array<RgbContext>;
  /** Region of interest views */
  roiViews: Array<RoiView>;
  rois: Array<Roi>;
  /** Scale views describing physical dimensions */
  scaleViews: Array<ScaleView>;
  /** Associated snapshots */
  snapshots: Array<Snapshot>;
  /** The store where the image data is stored. */
  store: ZarrStore;
  /** The tags of this image */
  tags: Array<Scalars['String']['output']>;
  /** Timepoint views describing temporal relationships */
  timepointViews: Array<TimepointView>;
  /** Associated videos */
  videos: Array<Video>;
  /** All views of this image */
  views: Array<View>;
};


export type ImageAffineTransformationViewsArgs = {
  filters?: InputMaybe<AffineTransformationViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageDerivedInstanceMaskViewsArgs = {
  filters?: InputMaybe<InstanceMaskViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageInstanceMaskViewsArgs = {
  filters?: InputMaybe<InstanceMaskViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageLightpathViewsArgs = {
  filters?: InputMaybe<OpticsViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageMaskViewsArgs = {
  filters?: InputMaybe<MaskViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageOpticsViewsArgs = {
  filters?: InputMaybe<OpticsViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ImageReferenceViewsArgs = {
  filters?: InputMaybe<ReferenceViewFilter>;
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

export type ImageAccessor = Accessor & {
  __typename?: 'ImageAccessor';
  id: Scalars['ID']['output'];
  keys: Array<Scalars['String']['output']>;
  maxIndex?: Maybe<Scalars['Int']['output']>;
  minIndex?: Maybe<Scalars['Int']['output']>;
  table: Table;
};

export type ImageEvent = {
  __typename?: 'ImageEvent';
  create?: Maybe<Image>;
  delete?: Maybe<Scalars['ID']['output']>;
  update?: Maybe<Image>;
};

/** Numeric/aggregatable fields of Image */
export enum ImageField {
  Pk = 'PK'
}

export type ImageFilter = {
  AND?: InputMaybe<ImageFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ImageFilter>;
  OR?: InputMaybe<ImageFilter>;
  dataset?: InputMaybe<DatasetFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  notDerived?: InputMaybe<Scalars['Boolean']['input']>;
  owner?: InputMaybe<Scalars['ID']['input']>;
  scope?: InputMaybe<ScopeFilter>;
  search?: InputMaybe<Scalars['String']['input']>;
  store?: InputMaybe<ZarrStoreFilter>;
  timepointViews?: InputMaybe<TimepointViewFilter>;
  transformationViews?: InputMaybe<AffineTransformationViewFilter>;
};

export type ImageOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type ImageStats = {
  __typename?: 'ImageStats';
  /** Average */
  avg?: Maybe<Scalars['Float']['output']>;
  /** Total number of items in the selection */
  count: Scalars['Int']['output'];
  /** Number of distinct values for the field */
  distinctCount: Scalars['Int']['output'];
  /** Maximum */
  max?: Maybe<Scalars['Float']['output']>;
  /** Minimum */
  min?: Maybe<Scalars['Float']['output']>;
  /** Time-bucketed stats over a datetime field. */
  series: Array<TimeBucket>;
  /** Sum */
  sum?: Maybe<Scalars['Float']['output']>;
};


export type ImageStatsAvgArgs = {
  field: ImageField;
};


export type ImageStatsDistinctCountArgs = {
  field: ImageField;
};


export type ImageStatsMaxArgs = {
  field: ImageField;
};


export type ImageStatsMinArgs = {
  field: ImageField;
};


export type ImageStatsSeriesArgs = {
  by: Granularity;
  field: ImageField;
  timestampField: ImageTimestampField;
};


export type ImageStatsSumArgs = {
  field: ImageField;
};

/** Datetime fields of Image for bucketing */
export enum ImageTimestampField {
  CreatedAt = 'CREATED_AT'
}

export type InstanceMaskView = View & {
  __typename?: 'InstanceMaskView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  labels?: Maybe<ParquetStore>;
  operation?: Maybe<Scalars['String']['output']>;
  referenceView: ReferenceView;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};


export type InstanceMaskViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type InstanceMaskViewFilter = {
  AND?: InputMaybe<InstanceMaskViewFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<InstanceMaskViewFilter>;
  OR?: InputMaybe<InstanceMaskViewFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  image?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type InstanceMaskViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  labels?: InputMaybe<Scalars['LabelsLike']['input']>;
  referenceView?: InputMaybe<Scalars['ID']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type InstanceMaskViewLabel = {
  __typename?: 'InstanceMaskViewLabel';
  id: Scalars['String']['output'];
  mask: InstanceMaskView;
  values: Scalars['Any']['output'];
};

export type Instrument = {
  __typename?: 'Instrument';
  id: Scalars['ID']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  organization: DjangoModelType;
  serialNumber: Scalars['String']['output'];
  views: Array<OpticsView>;
};


export type InstrumentViewsArgs = {
  filters?: InputMaybe<OpticsViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type InstrumentFilter = {
  AND?: InputMaybe<InstrumentFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<InstrumentFilter>;
  OR?: InputMaybe<InstrumentFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
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
  range?: InputMaybe<Array<Scalars['Int']['input']>>;
  regex?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['Int']['input']>;
};

export type LabelAccessor = Accessor & {
  __typename?: 'LabelAccessor';
  id: Scalars['ID']['output'];
  keys: Array<Scalars['String']['output']>;
  maskView: MaskView;
  maxIndex?: Maybe<Scalars['Int']['output']>;
  minIndex?: Maybe<Scalars['Int']['output']>;
  table: Table;
};

export type LabelView = View & {
  __typename?: 'LabelView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};


export type LabelViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type LabelViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  label: Scalars['String']['input'];
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

/** Light source */
export type LampElement = OpticalElement & {
  __typename?: 'LampElement';
  channel?: Maybe<ChannelKind>;
  id: Scalars['ID']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  lampType?: Maybe<Scalars['String']['output']>;
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

/** Light source */
export type LaserElement = OpticalElement & {
  __typename?: 'LaserElement';
  channel?: Maybe<ChannelKind>;
  hasPockelsCell?: Maybe<Scalars['Boolean']['output']>;
  hasQSwitch?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  laserMedium?: Maybe<Scalars['String']['output']>;
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  nominalWavelengthNm?: Maybe<Scalars['Float']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  powerMw?: Maybe<Scalars['Float']['output']>;
  pulseKind?: Maybe<PulseKind>;
  repetitionRateHz?: Maybe<Scalars['Float']['output']>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

/** Thin lens */
export type LensElement = OpticalElement & {
  __typename?: 'LensElement';
  focalLengthMm: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

/** Directed edge connecting two ports */
export type LightEdge = {
  __typename?: 'LightEdge';
  beam?: Maybe<BeamState>;
  id: Scalars['ID']['output'];
  lossDb?: Maybe<Scalars['Float']['output']>;
  medium?: Maybe<Scalars['String']['output']>;
  pathLengthMm?: Maybe<Scalars['Float']['output']>;
  sourceElementId: Scalars['ID']['output'];
  sourcePortId: Scalars['ID']['output'];
  targetElementId: Scalars['ID']['output'];
  targetPortId: Scalars['ID']['output'];
};

/** Input for connecting two optical ports. */
export type LightEdgeInput = {
  beam?: InputMaybe<BeamStateInput>;
  id: Scalars['String']['input'];
  lossDb?: InputMaybe<Scalars['Float']['input']>;
  medium?: InputMaybe<Scalars['String']['input']>;
  pathLengthMm?: InputMaybe<Scalars['Float']['input']>;
  sourceElementId: Scalars['ID']['input'];
  sourcePortId: Scalars['ID']['input'];
  targetElementId: Scalars['ID']['input'];
  targetPortId: Scalars['ID']['input'];
};

/** Optical port on an element */
export type LightPort = {
  __typename?: 'LightPort';
  channel: ChannelKind;
  id: Scalars['ID']['output'];
  maxIncomingEdges?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  role: PortRole;
  spectrum?: Maybe<Spectrum>;
};

/** Input definition for an optical port on an element. */
export type LightPortInput = {
  channel?: ChannelKind;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  role: PortRole;
  spectrum?: InputMaybe<SpectrumInput>;
};

/** Graph of optical elements and edges */
export type LightpathGraph = {
  __typename?: 'LightpathGraph';
  edges: Array<LightEdge>;
  elements: Array<OpticalElement>;
};

/** Bulk input for a full lightpath graph, including elements and edges. */
export type LightpathGraphInput = {
  edges: Array<LightEdgeInput>;
  elements: Array<OpticalElementInput>;
};

export type LightpathView = View & {
  __typename?: 'LightpathView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
  /** The lightpath graph describing the lightpath used to acquire this image */
  graph: LightpathGraph;
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


export type LightpathViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type MaskView = View & {
  __typename?: 'MaskView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  labels?: Maybe<ParquetStore>;
  referenceView: ReferenceView;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};


export type MaskViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type MaskViewFilter = {
  AND?: InputMaybe<MaskViewFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<MaskViewFilter>;
  OR?: InputMaybe<MaskViewFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  image?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type MaskViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  labels?: InputMaybe<Scalars['LabelsLike']['input']>;
  referenceView?: InputMaybe<Scalars['ID']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type MaskedPixelInfo = {
  __typename?: 'MaskedPixelInfo';
  color: Scalars['String']['output'];
  label: Scalars['String']['output'];
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

export type Membership = {
  __typename?: 'Membership';
  datasets: Array<Dataset>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  organization: Organization;
  roles: Array<Scalars['String']['output']>;
  user: User;
};


export type MembershipDatasetsArgs = {
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type Mesh = {
  __typename?: 'Mesh';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  store: MeshStore;
};

export type MeshFilter = {
  AND?: InputMaybe<MeshFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<MeshFilter>;
  OR?: InputMaybe<MeshFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type MeshInput = {
  mesh: Scalars['MeshLike']['input'];
  name: Scalars['String']['input'];
};

export type MeshStore = {
  __typename?: 'MeshStore';
  bucket: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  path: Scalars['String']['output'];
  presignedUrl: Scalars['String']['output'];
};


export type MeshStorePresignedUrlArgs = {
  host?: InputMaybe<Scalars['String']['input']>;
};

/** Mirror */
export type MirrorElement = OpticalElement & {
  __typename?: 'MirrorElement';
  angleDeg?: Maybe<Scalars['Float']['output']>;
  band?: Maybe<Spectrum>;
  id: Scalars['ID']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

/** A change made to a model. */
export type ModelChange = {
  __typename?: 'ModelChange';
  /** The field that was changed. */
  field: Scalars['String']['output'];
  /** The new value of the field. */
  newValue?: Maybe<Scalars['String']['output']>;
  /** The old value of the field. */
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
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<MultiWellPlateFilter>;
  OR?: InputMaybe<MultiWellPlateFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type MultiWellPlateInput = {
  columns?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  rows?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Assign a user permission to an object */
  assignUserPermission: Array<UserObjectPermission>;
  /** Create a new view for affine transformation data */
  createAffineTransformationView: AffineTransformationView;
  /** Create a new camera configuration */
  createCamera: Camera;
  /** Create a new view for channel data */
  createChannelView: ChannelView;
  /** Create a new view for continuous scan data */
  createContinousScanView: ContinousScanView;
  /** Create a new dataset to organize data */
  createDataset: Dataset;
  /** Create a new era for temporal organization */
  createEra: Era;
  /** Create a new view for file data */
  createFileView: FileView;
  /** Create a new view for histogram data */
  createHistogramView: HistogramView;
  /** Create a new view for instance mask data */
  createInstanceMaskView: InstanceMaskView;
  /** Create a new instrument configuration */
  createInstrument: Instrument;
  /** Create a new view for label data */
  createLabelView: LabelView;
  /** Create a new view for masked data */
  createMaskView: MaskView;
  /** Create a new mesh */
  createMesh: Mesh;
  /** Create a new multi-well plate configuration */
  createMultiWellPlate: MultiWellPlate;
  /** Create a new microscope objective configuration */
  createObjective: Objective;
  /** Create a new view for optical settings */
  createOpticsView: OpticsView;
  /** Create a new reference view for image data */
  createReferenceView: ReferenceView;
  /** Create a new render tree for image visualization */
  createRenderTree: RenderTree;
  /** Create a new RGB context for image visualization */
  createRgbContext: RgbContext;
  /** Create a new view for RGB image data */
  createRgbView: RgbView;
  /** Create a new region of interest */
  createRoi: Roi;
  /** Create a new view for region of interest data */
  createRoiView: RoiView;
  /** Create a new state snapshot */
  createSnapshot: Snapshot;
  /** Create a new stage for organizing data */
  createStage: Stage;
  /** Create a new view for temporal data */
  createTimepointView: TimepointView;
  /** Create a new collection of views to organize related views */
  createViewCollection: ViewCollection;
  /** Create a new view for well position data */
  createWellPositionView: WellPositionView;
  /** Delete an existing affine transformation view */
  deleteAffineTransformationView: Scalars['ID']['output'];
  /** Delete an existing camera */
  deleteCamera: Scalars['ID']['output'];
  /** Delete an existing channel view */
  deleteChannelView: Scalars['ID']['output'];
  /** Delete an existing dataset */
  deleteDataset: Scalars['ID']['output'];
  /** Delete an existing era */
  deleteEra: Scalars['ID']['output'];
  /** Delete an existing file */
  deleteFile: Scalars['ID']['output'];
  /** Delete an existing histogram view */
  deleteHistogramView: Scalars['ID']['output'];
  /** Delete an existing image */
  deleteImage: Scalars['ID']['output'];
  /** Delete an existing instrument */
  deleteInstrument: Scalars['ID']['output'];
  /** Delete an existing mesh */
  deleteMesh: Scalars['ID']['output'];
  /** Delete an existing multi-well plate configuration */
  deleteMultiWellPlate: Scalars['ID']['output'];
  /** Delete an existing objective */
  deleteObjective: Scalars['ID']['output'];
  /** Delete an existing optics view */
  deleteOpticsView: Scalars['ID']['output'];
  /** Delete an existing RGB context */
  deleteRgbContext: Scalars['ID']['output'];
  /** Delete an existing RGB view */
  deleteRgbView: Scalars['ID']['output'];
  /** Delete an existing region of interest */
  deleteRoi: Scalars['ID']['output'];
  /** Delete an existing snapshot */
  deleteSnapshot: Scalars['ID']['output'];
  /** Delete an existing stage */
  deleteStage: Scalars['ID']['output'];
  /** Delete an existing timepoint view */
  deleteTimepointView: Scalars['ID']['output'];
  /** Delete any type of view */
  deleteView: Scalars['ID']['output'];
  /** Delete an existing view collection */
  deleteViewCollection: Scalars['ID']['output'];
  /** Ensure a camera exists, creating if needed */
  ensureCamera: Camera;
  /** Create a new dataset to organize data */
  ensureDataset: Dataset;
  /** Ensure an instrument exists, creating if needed */
  ensureInstrument: Instrument;
  /** Ensure a multi-well plate exists, creating if needed */
  ensureMultiWellPlate: MultiWellPlate;
  /** Ensure an objective exists, creating if needed */
  ensureObjective: Objective;
  /** Create an image from array-like data */
  fromArrayLike: Image;
  /** Create a file from file-like data */
  fromFileLike: File;
  /** Create a table from parquet-like data */
  fromParquetLike: Table;
  /** Pin a camera for quick access */
  pinCamera: Camera;
  /** Pin a dataset for quick access */
  pinDataset: Dataset;
  /** Pin an era for quick access */
  pinEra: Era;
  /** Pin an image for quick access */
  pinImage: Image;
  /** Pin an instrument for quick access */
  pinInstrument: Instrument;
  /** Pin a mesh for quick access */
  pinMesh: Snapshot;
  /** Pin a multi-well plate for quick access */
  pinMultiWellPlate: MultiWellPlate;
  /** Pin an objective for quick access */
  pinObjective: Objective;
  /** Pin a region of interest for quick access */
  pinRoi: Roi;
  /** Pin a snapshot for quick access */
  pinSnapshot: Snapshot;
  /** Pin a stage for quick access */
  pinStage: Stage;
  /** Pin a view for quick access */
  pinView: View;
  /** Pin a view collection for quick access */
  pinViewCollection: ViewCollection;
  /** Add datasets as children of another dataset */
  putDatasetsInDataset: Dataset;
  /** Add files to a dataset */
  putFilesInDataset: Dataset;
  /** Add images to a dataset */
  putImagesInDataset: Dataset;
  /** Relate an image to a dataset */
  relateToDataset: Image;
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
  /** Request presigned credentials for mesh upload */
  requestMeshUpload: PresignedPostCredentials;
  /** Request credentials to access a table */
  requestTableAccess: AccessCredentials;
  /** Request credentials to upload a new table */
  requestTableUpload: Credentials;
  /** Request credentials to upload a new image */
  requestUpload: Credentials;
  /** Revert dataset to a previous version */
  revertDataset: Dataset;
  /** Update dataset metadata */
  updateDataset: Dataset;
  /** Update an existing image's metadata */
  updateImage: Image;
  /** Update settings of an existing RGB context */
  updateRgbContext: RgbContext;
  /** Update an existing RGB view */
  updateRgbView: RgbView;
  /** Update an existing region of interest */
  updateRoi: Roi;
};


export type MutationAssignUserPermissionArgs = {
  input: AssignUserPermissionInput;
};


export type MutationCreateAffineTransformationViewArgs = {
  input: AffineTransformationViewInput;
};


export type MutationCreateCameraArgs = {
  input: CameraInput;
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


export type MutationCreateFileViewArgs = {
  input: FileViewInput;
};


export type MutationCreateHistogramViewArgs = {
  input: HistogramViewInput;
};


export type MutationCreateInstanceMaskViewArgs = {
  input: InstanceMaskViewInput;
};


export type MutationCreateInstrumentArgs = {
  input: InstrumentInput;
};


export type MutationCreateLabelViewArgs = {
  input: LabelViewInput;
};


export type MutationCreateMaskViewArgs = {
  input: MaskViewInput;
};


export type MutationCreateMeshArgs = {
  input: MeshInput;
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


export type MutationCreateReferenceViewArgs = {
  input: ReferenceViewInput;
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


export type MutationCreateRoiViewArgs = {
  input: RoiViewInput;
};


export type MutationCreateSnapshotArgs = {
  input: SnapshotInput;
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


export type MutationDeleteChannelViewArgs = {
  input: DeleteViewInput;
};


export type MutationDeleteDatasetArgs = {
  input: DeleteDatasetInput;
};


export type MutationDeleteEraArgs = {
  input: DeleteEraInput;
};


export type MutationDeleteFileArgs = {
  input: DeleteFileInput;
};


export type MutationDeleteHistogramViewArgs = {
  input: DeleteViewInput;
};


export type MutationDeleteImageArgs = {
  input: DeleteImageInput;
};


export type MutationDeleteInstrumentArgs = {
  input: DeleteInstrumentInput;
};


export type MutationDeleteMeshArgs = {
  input: DeleteMeshInput;
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


export type MutationDeleteRoiArgs = {
  input: DeleteRoiInput;
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


export type MutationEnsureCameraArgs = {
  input: CameraInput;
};


export type MutationEnsureDatasetArgs = {
  input: CreateDatasetInput;
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


export type MutationPinCameraArgs = {
  input: PinCameraInput;
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


export type MutationPinMeshArgs = {
  input: DeleteMeshInput;
};


export type MutationPinMultiWellPlateArgs = {
  input: PintMultiWellPlateInput;
};


export type MutationPinObjectiveArgs = {
  input: PinObjectiveInput;
};


export type MutationPinRoiArgs = {
  input: PinRoiInput;
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
  id: Scalars['ID']['input'];
  other: Scalars['ID']['input'];
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


export type MutationRequestMeshUploadArgs = {
  input: RequestMeshUploadInput;
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


export type MutationUpdateRgbViewArgs = {
  input: UpdateRgbViewInput;
};


export type MutationUpdateRoiArgs = {
  input: UpdateRoiInput;
};

export type Objective = {
  __typename?: 'Objective';
  id: Scalars['ID']['output'];
  immersion?: Maybe<Scalars['String']['output']>;
  magnification?: Maybe<Scalars['Float']['output']>;
  na?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  organization: DjangoModelType;
  serialNumber: Scalars['String']['output'];
  views: Array<OpticsView>;
};


export type ObjectiveViewsArgs = {
  filters?: InputMaybe<OpticsViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export enum ObjectiveCorrectionKind {
  Achro = 'ACHRO',
  Achromat = 'ACHROMAT',
  Apo = 'APO',
  Fl = 'FL',
  Fluar = 'FLUAR',
  Fluor = 'FLUOR',
  Fluotar = 'FLUOTAR',
  Neofluar = 'NEOFLUAR',
  Other = 'OTHER',
  PlanApo = 'PLAN_APO',
  PlanFluor = 'PLAN_FLUOR',
  PlanNeofluar = 'PLAN_NEOFLUAR',
  SuperFluor = 'SUPER_FLUOR',
  Uv = 'UV',
  VioletCorrected = 'VIOLET_CORRECTED'
}

/** Microscope objective */
export type ObjectiveElement = OpticalElement & {
  __typename?: 'ObjectiveElement';
  correctionKind?: Maybe<ObjectiveCorrectionKind>;
  id: Scalars['ID']['output'];
  immersionMedium?: Maybe<ObjectiveImmersion>;
  /** Has iris (aperture stop) */
  iris: Scalars['Boolean']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  magnification?: Maybe<Scalars['Float']['output']>;
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  numericalAperture?: Maybe<Scalars['Float']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  serialNumber?: Maybe<Scalars['String']['output']>;
  workingDistanceMm?: Maybe<Scalars['Float']['output']>;
};

export type ObjectiveFilter = {
  AND?: InputMaybe<ObjectiveFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ObjectiveFilter>;
  OR?: InputMaybe<ObjectiveFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export enum ObjectiveImmersion {
  Air = 'AIR',
  Glycerol = 'GLYCEROL',
  Multi = 'MULTI',
  Oil = 'OIL',
  Other = 'OTHER',
  Water = 'WATER',
  WaterDipping = 'WATER_DIPPING'
}

export type ObjectiveInput = {
  immersion?: InputMaybe<Scalars['String']['input']>;
  magnification?: InputMaybe<Scalars['Float']['input']>;
  na?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  serialNumber: Scalars['String']['input'];
};

export type OffsetPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: Scalars['Int']['input'];
};

/** Common interface for all optical elements */
export type OpticalElement = {
  /** Element UUID */
  id: Scalars['ID']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

/** Input for creating or updating any optical element. Fill only fields relevant to the chosen `kind`. */
export type OpticalElementInput = {
  amplifierGainDb?: InputMaybe<Scalars['Float']['input']>;
  angleDeg?: InputMaybe<Scalars['Float']['input']>;
  bandMaxNm?: InputMaybe<Scalars['Float']['input']>;
  bandMinNm?: InputMaybe<Scalars['Float']['input']>;
  brand?: InputMaybe<Scalars['String']['input']>;
  channel?: InputMaybe<ChannelKind>;
  diameterUm?: InputMaybe<Scalars['Float']['input']>;
  focalLengthMm?: InputMaybe<Scalars['Float']['input']>;
  gain?: InputMaybe<Scalars['Float']['input']>;
  hasPockelsCell?: InputMaybe<Scalars['Boolean']['input']>;
  hasQSwitch?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  immersionMedium?: InputMaybe<ObjectiveImmersion>;
  iris?: InputMaybe<Scalars['Boolean']['input']>;
  kind: ElementKind;
  label: Scalars['String']['input'];
  laserMedium?: InputMaybe<Scalars['String']['input']>;
  magnification?: InputMaybe<Scalars['Float']['input']>;
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  nepdWPerSqrtHz?: InputMaybe<Scalars['Float']['input']>;
  nominalWavelengthNm?: InputMaybe<Scalars['Float']['input']>;
  numericalAperture?: InputMaybe<Scalars['Float']['input']>;
  pixelSizeUm?: InputMaybe<Scalars['Float']['input']>;
  ports: Array<LightPortInput>;
  pose?: InputMaybe<Pose3DInput>;
  powerMw?: InputMaybe<Scalars['Float']['input']>;
  pulseKind?: InputMaybe<PulseKind>;
  rFraction?: InputMaybe<Scalars['Float']['input']>;
  repetitionRateHz?: InputMaybe<Scalars['Float']['input']>;
  resolution?: InputMaybe<Array<Scalars['Int']['input']>>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  tFraction?: InputMaybe<Scalars['Float']['input']>;
  workingDistanceMm?: InputMaybe<Scalars['Float']['input']>;
};

export type OpticsView = View & {
  __typename?: 'OpticsView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  camera?: Maybe<Camera>;
  /** All views of this image */
  congruentViews: Array<View>;
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


export type OpticsViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type OpticsViewFilter = {
  AND?: InputMaybe<OpticsViewFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<OpticsViewFilter>;
  OR?: InputMaybe<OpticsViewFilter>;
  camera?: InputMaybe<CameraFilter>;
  instrument?: InputMaybe<InstrumentFilter>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  objective?: InputMaybe<ObjectiveFilter>;
};

export type OpticsViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  camera?: InputMaybe<Scalars['ID']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  instrument?: InputMaybe<Scalars['ID']['input']>;
  objective?: InputMaybe<Scalars['ID']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export enum Ordering {
  Asc = 'ASC',
  AscNullsFirst = 'ASC_NULLS_FIRST',
  AscNullsLast = 'ASC_NULLS_LAST',
  Desc = 'DESC',
  DescNullsFirst = 'DESC_NULLS_FIRST',
  DescNullsLast = 'DESC_NULLS_LAST'
}

export type Organization = {
  __typename?: 'Organization';
  id: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

/** The sample */
export type OtherElement = OpticalElement & {
  __typename?: 'OtherElement';
  id: Scalars['ID']['output'];
  kind: ElementKind;
  label: Scalars['String']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

/** Light source */
export type OtherSourceElement = OpticalElement & {
  __typename?: 'OtherSourceElement';
  channel?: Maybe<ChannelKind>;
  id: Scalars['ID']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  lampType?: Maybe<Scalars['String']['output']>;
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

export type ParquetStore = {
  __typename?: 'ParquetStore';
  bucket: Scalars['String']['output'];
  columns: Array<TableColumn>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  path: Scalars['String']['output'];
  presignedUrl: Scalars['String']['output'];
};


export type ParquetStorePresignedUrlArgs = {
  host?: InputMaybe<Scalars['String']['input']>;
};

export type PartialAcquisitionViewInput = {
  acquiredAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  operator?: InputMaybe<Scalars['ID']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialAffineTransformationViewInput = {
  affineMatrix: Scalars['FourByFourMatrix']['input'];
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  stage?: InputMaybe<Scalars['ID']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialChannelViewInput = {
  /** The acquisition mode of the channel */
  acquisitionMode?: InputMaybe<Scalars['String']['input']>;
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  /** The emission wavelength of the channel in nanometers */
  emissionWavelength?: InputMaybe<Scalars['Float']['input']>;
  /** The excitation wavelength of the channel in nanometers */
  excitationWavelength?: InputMaybe<Scalars['Float']['input']>;
  /** The name of the channel */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialDerivedViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  originImage: Scalars['ID']['input'];
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialFileViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  file: Scalars['ID']['input'];
  seriesIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialImageAccessorInput = {
  image: Scalars['ID']['input'];
  keys: Array<Scalars['String']['input']>;
  maxIndex?: InputMaybe<Scalars['Int']['input']>;
  minIndex?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialInstanceMaskViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  labels?: InputMaybe<Scalars['LabelsLike']['input']>;
  referenceView?: InputMaybe<Scalars['ID']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialLabelAccessorInput = {
  keys: Array<Scalars['String']['input']>;
  maxIndex?: InputMaybe<Scalars['Int']['input']>;
  minIndex?: InputMaybe<Scalars['Int']['input']>;
  pixelView: Scalars['ID']['input'];
};

export type PartialLightpathViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  graph: LightpathGraphInput;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialMaskViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  labels?: InputMaybe<Scalars['LabelsLike']['input']>;
  referenceView?: InputMaybe<Scalars['ID']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialOpticsViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  camera?: InputMaybe<Scalars['ID']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  instrument?: InputMaybe<Scalars['ID']['input']>;
  objective?: InputMaybe<Scalars['ID']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialRgbViewInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  baseColor?: InputMaybe<Array<Scalars['Float']['input']>>;
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  colorMap?: InputMaybe<ColorMap>;
  context?: InputMaybe<Scalars['ID']['input']>;
  contrastLimitMax?: InputMaybe<Scalars['Float']['input']>;
  contrastLimitMin?: InputMaybe<Scalars['Float']['input']>;
  gamma?: InputMaybe<Scalars['Float']['input']>;
  rescale?: InputMaybe<Scalars['Boolean']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialRoiViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  roi: Scalars['ID']['input'];
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialReferenceViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialScaleViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  scaleC?: InputMaybe<Scalars['Float']['input']>;
  scaleT?: InputMaybe<Scalars['Float']['input']>;
  scaleX?: InputMaybe<Scalars['Float']['input']>;
  scaleY?: InputMaybe<Scalars['Float']['input']>;
  scaleZ?: InputMaybe<Scalars['Float']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PartialTimepointViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  era?: InputMaybe<Scalars['ID']['input']>;
  indexSinceStart?: InputMaybe<Scalars['Int']['input']>;
  msSinceStart?: InputMaybe<Scalars['Milliseconds']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type PermissionOption = {
  __typename?: 'PermissionOption';
  label: Scalars['String']['output'];
  value: Scalars['ID']['output'];
};

export type PinCameraInput = {
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

export type PinRoiInput = {
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

/** Pinhole */
export type PinholeElement = OpticalElement & {
  __typename?: 'PinholeElement';
  diameterUm?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  /** Element kind */
  kind: ElementKind;
  /** Element label */
  label: Scalars['String']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

export type PintMultiWellPlateInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

/** A channel descriptor */
export type PlaneInfo = {
  __typename?: 'PlaneInfo';
  label: Scalars['String']['output'];
};

export enum PortRole {
  Input = 'INPUT',
  Output = 'OUTPUT'
}

/** Optional 3D pose; position and/or orientation can be omitted */
export type Pose3D = {
  __typename?: 'Pose3D';
  orientation?: Maybe<Euler>;
  position?: Maybe<Vec3>;
};

/** A 3D pose consisting of position and orientation. */
export type Pose3DInput = {
  orientation?: InputMaybe<EulerInput>;
  position?: InputMaybe<Vec3Input>;
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

/** A provenance event for a model. */
export type ProvenanceEntry = {
  __typename?: 'ProvenanceEntry';
  client?: Maybe<Client>;
  /** The date of the change. */
  date: Scalars['DateTime']['output'];
  /** The assignation ID during which the change occurred. If it was happening outside of an assignation, it will be None. */
  during?: Maybe<Scalars['String']['output']>;
  /** The effective changes made to the model. */
  effectiveChanges: Array<ModelChange>;
  /** The ID of the history entry. */
  id: Scalars['ID']['output'];
  /** The type of change that was made. */
  kind: HistoryKind;
  /** User who made the change. */
  user?: Maybe<User>;
};

export enum PulseKind {
  Cw = 'CW',
  ModeLocked = 'MODE_LOCKED',
  Other = 'OTHER',
  Qswitched = 'QSWITCHED',
  Repetitive = 'REPETITIVE',
  Single = 'SINGLE'
}

export type Query = {
  __typename?: 'Query';
  _entities: Array<Maybe<_Entity>>;
  _service: _Service;
  acquisitionViews: Array<AcquisitionView>;
  /** Get all active views for a specific image */
  activeViews: Array<View>;
  affineTransformationViews: Array<AffineTransformationView>;
  /** Get available permissions for a specific identifier */
  availablePermissions: Array<PermissionOption>;
  camera: Camera;
  channelViews: Array<ChannelView>;
  channelsFor: Array<ChannelInfo>;
  children: Array<DatasetImageFile>;
  continousScanViews: Array<ContinousScanView>;
  dataset: Dataset;
  datasets: Array<Dataset>;
  describe: Array<Descriptor>;
  eras: Array<Era>;
  experiment: Experiment;
  experiments: Array<Experiment>;
  file: File;
  files: Array<File>;
  /** Returns a single image by ID */
  image: Image;
  imageAccessors: Array<ImageAccessor>;
  images: Array<Image>;
  /** Get statistics about images */
  imagesStats: ImageStats;
  instanceMaskViewLabel: InstanceMaskViewLabel;
  instrument: Instrument;
  instruments: Array<Instrument>;
  labelAccessors: Array<LabelAccessor>;
  labelViews: Array<LabelView>;
  /** Returns a single image by ID */
  lightpathView: LightpathView;
  maskedPixelInfo: MaskedPixelInfo;
  members: Array<Membership>;
  mesh: Mesh;
  meshes: Array<Mesh>;
  multiWellPlate: MultiWellPlate;
  multiWellPlates: Array<MultiWellPlate>;
  mydatasets: Array<Dataset>;
  myeras: Array<Era>;
  myfiles: Array<File>;
  myimages: Array<Image>;
  myobjectives: Array<Objective>;
  mysnapshots: Array<Snapshot>;
  mytables: Array<Table>;
  objective: Objective;
  objectives: Array<Objective>;
  /** Get permissions for a specific object */
  permissions: Array<UserObjectPermission>;
  randomImage: Image;
  renderTree: RenderTree;
  renderTrees: Array<RenderTree>;
  rgbView: RgbView;
  rgbViews: Array<RgbView>;
  rgbcontext: RgbContext;
  rgbcontexts: Array<RgbContext>;
  roi: Roi;
  rois: Array<Roi>;
  rows: Array<Scalars['MetricMap']['output']>;
  scaleViews: Array<ScaleView>;
  snapshot: Snapshot;
  snapshots: Array<Snapshot>;
  stage: Stage;
  stages: Array<Stage>;
  table: Table;
  tableCell: TableCell;
  tableCells: Array<TableCell>;
  tableRow: TableRow;
  tableRows: Array<TableRow>;
  tables: Array<Table>;
  timepointViews: Array<TimepointView>;
  wellPositionViews: Array<WellPositionView>;
};


export type Query_EntitiesArgs = {
  representations: Array<Scalars['_Any']['input']>;
};


export type QueryActiveViewsArgs = {
  exclude?: InputMaybe<Array<ViewKind>>;
  image: Scalars['ID']['input'];
  include?: InputMaybe<Array<ViewKind>>;
  selector?: InputMaybe<Selector>;
};


export type QueryAffineTransformationViewsArgs = {
  filters?: InputMaybe<AffineTransformationViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryAvailablePermissionsArgs = {
  identifier: Scalars['String']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type QueryCameraArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChannelsForArgs = {
  filters?: InputMaybe<ChannelInfoFilter>;
  image: Scalars['ID']['input'];
};


export type QueryChildrenArgs = {
  filters?: InputMaybe<DatasetChildrenFilter>;
  order?: InputMaybe<ChildrenOrder>;
  pagination?: InputMaybe<ChildrenPaginationInput>;
  parent: Scalars['ID']['input'];
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


export type QueryDescribeArgs = {
  id: Scalars['ID']['input'];
  identifier: Scalars['String']['input'];
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
  order?: InputMaybe<FileOrder>;
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


export type QueryImagesStatsArgs = {
  filters?: InputMaybe<ImageFilter>;
};


export type QueryInstanceMaskViewLabelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInstrumentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLightpathViewArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMaskedPixelInfoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMeshArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMeshesArgs = {
  filters?: InputMaybe<MeshFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
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
  order?: InputMaybe<FileOrder>;
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


export type QueryPermissionsArgs = {
  identifier: Scalars['String']['input'];
  object: Scalars['ID']['input'];
};


export type QueryRenderTreeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRenderTreesArgs = {
  filters?: InputMaybe<RenderTreeFilter>;
  order?: InputMaybe<RenderTreeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRgbViewArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRgbViewsArgs = {
  filters?: InputMaybe<RgbViewFilter>;
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
  order?: InputMaybe<RoiOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRowsArgs = {
  filters?: InputMaybe<RowFilter>;
  pagination?: InputMaybe<TablePaginationInput>;
  table: Scalars['ID']['input'];
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


export type QueryTableCellArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTableCellsArgs = {
  filters: TableCellFilter;
  pagination: OffsetPaginationInput;
};


export type QueryTableRowArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTableRowsArgs = {
  filters: TableRowFilter;
  pagination: OffsetPaginationInput;
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
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<RgbContextFilter>;
  OR?: InputMaybe<RgbContextFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
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
  /** All views of this image */
  congruentViews: Array<View>;
  contexts: Array<RgbContext>;
  contrastLimitMax?: Maybe<Scalars['Float']['output']>;
  contrastLimitMin?: Maybe<Scalars['Float']['output']>;
  fullColour: Scalars['String']['output'];
  gamma?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};


export type RgbViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
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

export type RgbViewFilter = {
  AND?: InputMaybe<RgbViewFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<RgbViewFilter>;
  OR?: InputMaybe<RgbViewFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type RgbViewInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  baseColor?: InputMaybe<Array<Scalars['Float']['input']>>;
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  colorMap?: InputMaybe<ColorMap>;
  context: Scalars['ID']['input'];
  contrastLimitMax?: InputMaybe<Scalars['Float']['input']>;
  contrastLimitMin?: InputMaybe<Scalars['Float']['input']>;
  gamma?: InputMaybe<Scalars['Float']['input']>;
  image: Scalars['ID']['input'];
  rescale?: InputMaybe<Scalars['Boolean']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type Roi = {
  __typename?: 'ROI';
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  id: Scalars['ID']['output'];
  image: Image;
  kind: RoiKind;
  name: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  /** Provenance entries for this camera */
  provenanceEntries: Array<ProvenanceEntry>;
  vectors: Array<Scalars['FiveDVector']['output']>;
};


export type RoiProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type RoiFilter = {
  AND?: InputMaybe<RoiFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<RoiFilter>;
  OR?: InputMaybe<RoiFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  image?: InputMaybe<Scalars['ID']['input']>;
  kind?: InputMaybe<RoiKindChoices>;
  owner?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type RoiOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type RoiView = View & {
  __typename?: 'ROIView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
  id: Scalars['ID']['output'];
  image: Image;
  isGlobal: Scalars['Boolean']['output'];
  roi: Roi;
  tMax?: Maybe<Scalars['Int']['output']>;
  tMin?: Maybe<Scalars['Int']['output']>;
  xMax?: Maybe<Scalars['Int']['output']>;
  xMin?: Maybe<Scalars['Int']['output']>;
  yMax?: Maybe<Scalars['Int']['output']>;
  yMin?: Maybe<Scalars['Int']['output']>;
  zMax?: Maybe<Scalars['Int']['output']>;
  zMin?: Maybe<Scalars['Int']['output']>;
};


export type RoiViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type RoiViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  roi: Scalars['ID']['input'];
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type ReferenceView = View & {
  __typename?: 'ReferenceView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
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


export type ReferenceViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type ReferenceViewFilter = {
  AND?: InputMaybe<ReferenceViewFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ReferenceViewFilter>;
  OR?: InputMaybe<ReferenceViewFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  image?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ReferenceViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type Render = {
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
};

export enum RenderKind {
  Snapshot = 'SNAPSHOT',
  Video = 'VIDEO'
}

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
};


export type RenderTreeLinkedContextsArgs = {
  filters?: InputMaybe<RgbContextFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type RenderTreeFilter = {
  AND?: InputMaybe<RenderTreeFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<RenderTreeFilter>;
  OR?: InputMaybe<RenderTreeFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
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
  fileName: Scalars['String']['input'];
};

export type RequestMediaUploadInput = {
  datalayer: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
};

export type RequestMeshUploadInput = {
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
  /** The image this ROI belongs to */
  image: Scalars['ID']['input'];
  /** The type/kind of ROI */
  kind: RoiKind;
  /** The vector coordinates defining the ROI */
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

export type RowFilter = {
  clause?: InputMaybe<Scalars['String']['input']>;
};

/** The sample */
export type SampleElement = OpticalElement & {
  __typename?: 'SampleElement';
  id: Scalars['ID']['output'];
  kind: ElementKind;
  label: Scalars['String']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  /** List of ports on the element */
  ports: Array<LightPort>;
  /** 3D pose of the element */
  pose?: Maybe<Pose3D>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

export type ScaleView = View & {
  __typename?: 'ScaleView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
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


export type ScaleViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export enum ScanDirection {
  ColumnRowSlice = 'COLUMN_ROW_SLICE',
  ColumnRowSliceSnake = 'COLUMN_ROW_SLICE_SNAKE',
  RowColumnSlice = 'ROW_COLUMN_SLICE',
  RowColumnSliceSnake = 'ROW_COLUMN_SLICE_SNAKE',
  SliceRowColumn = 'SLICE_ROW_COLUMN',
  SliceRowColumnSnake = 'SLICE_ROW_COLUMN_SNAKE'
}

export type ScopeFilter = {
  me?: InputMaybe<Scalars['Boolean']['input']>;
  org?: InputMaybe<Scalars['Boolean']['input']>;
  public?: InputMaybe<Scalars['Boolean']['input']>;
  shared?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum ScopeKind {
  Me = 'ME',
  Org = 'ORG',
  Public = 'PUBLIC',
  Shared = 'SHARED'
}

export type Selector = {
  c?: InputMaybe<DimSelector>;
  t?: InputMaybe<DimSelector>;
  x?: InputMaybe<DimSelector>;
  y?: InputMaybe<DimSelector>;
  z?: InputMaybe<DimSelector>;
};

export type Snapshot = Render & {
  __typename?: 'Snapshot';
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  id: Scalars['ID']['output'];
  majorColor?: Maybe<Array<Scalars['Float']['output']>>;
  name: Scalars['String']['output'];
  store: MediaStore;
};

export type SnapshotFilter = {
  AND?: InputMaybe<SnapshotFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<SnapshotFilter>;
  OR?: InputMaybe<SnapshotFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
};

export type SnapshotInput = {
  file: Scalars['ImageFileLike']['input'];
  image: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Spectral window in nanometers */
export type Spectrum = {
  __typename?: 'Spectrum';
  maxNm: Scalars['Float']['output'];
  minNm: Scalars['Float']['output'];
};

/** Spectral window in nanometers for wavelength-dependent components. */
export type SpectrumInput = {
  maxNm: Scalars['Float']['input'];
  minNm: Scalars['Float']['input'];
};

export type Stage = {
  __typename?: 'Stage';
  affineViews: Array<AffineTransformationView>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  /** Provenance entries for this camera */
  provenanceEntries: Array<ProvenanceEntry>;
};


export type StageAffineViewsArgs = {
  filters?: InputMaybe<AffineTransformationViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type StageProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type StageFilter = {
  AND?: InputMaybe<StageFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<StageFilter>;
  OR?: InputMaybe<StageFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<StrFilterLookup>;
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
  range?: InputMaybe<Array<Scalars['String']['input']>>;
  regex?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Subscribe to real-time affine transformation view updatess */
  affineTransformationViews: AffineTransformationViewEvent;
  /** Subscribe to real-time file updates */
  files: FileEvent;
  /** Subscribe to real-time image updates */
  images: ImageEvent;
  /** Subscribe to real-time ROI updates */
  rois: RoiEvent;
};


export type SubscriptionAffineTransformationViewsArgs = {
  stage: Scalars['ID']['input'];
};


export type SubscriptionFilesArgs = {
  dataset?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionImagesArgs = {
  dataset?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionRoisArgs = {
  image: Scalars['ID']['input'];
};

export type Table = {
  __typename?: 'Table';
  accessors: Array<Accessor>;
  columns: Array<TableColumn>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  origins: Array<Image>;
  rows: Array<Scalars['MetricMap']['output']>;
  store: ParquetStore;
};


export type TableAccessorsArgs = {
  filters?: InputMaybe<AccessorFilter>;
  types?: InputMaybe<Array<AccessorKind>>;
};


export type TableOriginsArgs = {
  filters?: InputMaybe<ImageFilter>;
  order?: InputMaybe<ImageOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** A cell of a table */
export type TableCell = {
  __typename?: 'TableCell';
  column: TableColumn;
  columnId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  rowId: Scalars['Int']['output'];
  table: Table;
  value: Scalars['Any']['output'];
};

export type TableCellFilter = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** A column descriptor */
export type TableColumn = {
  __typename?: 'TableColumn';
  accessors: Array<Accessor>;
  default?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  nullable: Scalars['Boolean']['output'];
  type: DuckDbDataType;
};


/** A column descriptor */
export type TableColumnAccessorsArgs = {
  filters?: InputMaybe<AccessorFilter>;
  types?: InputMaybe<Array<AccessorKind>>;
};

export type TableFilter = {
  AND?: InputMaybe<TableFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<TableFilter>;
  OR?: InputMaybe<TableFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type TablePaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** A cell of a table */
export type TableRow = {
  __typename?: 'TableRow';
  columns: Array<TableColumn>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  rowId: Scalars['Int']['output'];
  table: Table;
  values: Array<Scalars['Any']['output']>;
};

export type TableRowFilter = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type TimeBucket = {
  __typename?: 'TimeBucket';
  avg?: Maybe<Scalars['Float']['output']>;
  count: Scalars['Int']['output'];
  distinctCount: Scalars['Int']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  sum?: Maybe<Scalars['Float']['output']>;
  ts: Scalars['DateTime']['output'];
};

export type TimepointView = View & {
  __typename?: 'TimepointView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
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


export type TimepointViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type TimepointViewFilter = {
  AND?: InputMaybe<TimepointViewFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<TimepointViewFilter>;
  OR?: InputMaybe<TimepointViewFilter>;
  era?: InputMaybe<EraFilter>;
  indexSinceStart?: InputMaybe<Scalars['Int']['input']>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  msSinceStart?: InputMaybe<Scalars['Float']['input']>;
};

export type TimepointViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  era?: InputMaybe<Scalars['ID']['input']>;
  image: Scalars['ID']['input'];
  indexSinceStart?: InputMaybe<Scalars['Int']['input']>;
  msSinceStart?: InputMaybe<Scalars['Milliseconds']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
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
  views?: InputMaybe<Array<PartialRgbViewInput>>;
  z?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateRgbViewInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  baseColor?: InputMaybe<Array<Scalars['Float']['input']>>;
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  colorMap?: InputMaybe<ColorMap>;
  context?: InputMaybe<Scalars['ID']['input']>;
  contrastLimitMax?: InputMaybe<Scalars['Float']['input']>;
  contrastLimitMin?: InputMaybe<Scalars['Float']['input']>;
  gamma?: InputMaybe<Scalars['Float']['input']>;
  /** The ID of the RGB view to update */
  id: Scalars['ID']['input'];
  rescale?: InputMaybe<Scalars['Boolean']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
  zMin?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateRoiInput = {
  entity?: InputMaybe<Scalars['ID']['input']>;
  entityGroup?: InputMaybe<Scalars['ID']['input']>;
  entityKind?: InputMaybe<Scalars['ID']['input']>;
  entityParent?: InputMaybe<Scalars['ID']['input']>;
  kind?: InputMaybe<RoiKind>;
  roi: Scalars['ID']['input'];
  vectors?: InputMaybe<Array<Scalars['FiveDVector']['input']>>;
};

export type User = {
  __typename?: 'User';
  activeOrganization?: Maybe<Organization>;
  preferredUsername: Scalars['String']['output'];
  sub: Scalars['String']['output'];
};

export type UserObjectPermission = {
  __typename?: 'UserObjectPermission';
  permission: Scalars['String']['output'];
  user: User;
};

/** 3D vector or point in space */
export type Vec3 = {
  __typename?: 'Vec3';
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** A 3D vector representing a point or offset in space. */
export type Vec3Input = {
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  z?: InputMaybe<Scalars['Float']['input']>;
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
  /** All views of this image */
  congruentViews: Array<View>;
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


export type ViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type ViewCollection = {
  __typename?: 'ViewCollection';
  affineTransformationViews: Array<AffineTransformationView>;
  channelViews: Array<ChannelView>;
  id: Scalars['ID']['output'];
  labelViews: Array<LabelView>;
  name: Scalars['String']['output'];
  /** Provenance entries for this camera */
  provenanceEntries: Array<ProvenanceEntry>;
  views: Array<View>;
};


export type ViewCollectionAffineTransformationViewsArgs = {
  filters?: InputMaybe<AffineTransformationViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ViewCollectionProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ViewCollectionInput = {
  name: Scalars['String']['input'];
};

export type ViewFilter = {
  AND?: InputMaybe<ViewFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ViewFilter>;
  OR?: InputMaybe<ViewFilter>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum ViewKind {
  AffineTransformation = 'AFFINE_TRANSFORMATION',
  Channel = 'CHANNEL',
  Histogram = 'HISTOGRAM',
  InstanceMaskView = 'INSTANCE_MASK_VIEW',
  Label = 'LABEL',
  Lightpath = 'LIGHTPATH',
  MaskView = 'MASK_VIEW',
  Optics = 'OPTICS',
  Reference = 'REFERENCE',
  Rgb = 'RGB',
  Timepoint = 'TIMEPOINT'
}

export type WellPositionView = View & {
  __typename?: 'WellPositionView';
  /** The accessor */
  accessor: Array<Scalars['String']['output']>;
  cMax?: Maybe<Scalars['Int']['output']>;
  cMin?: Maybe<Scalars['Int']['output']>;
  column?: Maybe<Scalars['Int']['output']>;
  /** All views of this image */
  congruentViews: Array<View>;
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


export type WellPositionViewCongruentViewsArgs = {
  filters?: InputMaybe<ViewFilter>;
  types?: InputMaybe<Array<ViewKind>>;
};

export type WellPositionViewFilter = {
  AND?: InputMaybe<WellPositionViewFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<WellPositionViewFilter>;
  OR?: InputMaybe<WellPositionViewFilter>;
  column?: InputMaybe<Scalars['Int']['input']>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  row?: InputMaybe<Scalars['Int']['input']>;
  well?: InputMaybe<MultiWellPlateFilter>;
};

export type WellPositionViewInput = {
  /** The maximum c (channel) coordinate of the view */
  cMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum c (channel) coordinate of the view */
  cMin?: InputMaybe<Scalars['Int']['input']>;
  /** The collection this view belongs to */
  collection?: InputMaybe<Scalars['ID']['input']>;
  column?: InputMaybe<Scalars['Int']['input']>;
  image: Scalars['ID']['input'];
  row?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum t coordinate of the view */
  tMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum t coordinate of the view */
  tMin?: InputMaybe<Scalars['Int']['input']>;
  well?: InputMaybe<Scalars['ID']['input']>;
  /** The maximum x coordinate of the view */
  xMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum x coordinate of the view */
  xMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum y coordinate of the view */
  yMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum y coordinate of the view */
  yMin?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum z coordinate of the view */
  zMax?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum z coordinate of the view */
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
  /** The version of the zarr store (e.g. the version of the dataset). */
  version: Scalars['String']['output'];
};

export type ZarrStoreFilter = {
  AND?: InputMaybe<ZarrStoreFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ZarrStoreFilter>;
  OR?: InputMaybe<ZarrStoreFilter>;
  shape?: InputMaybe<IntFilterLookup>;
};

export type _Entity = File | Image | Table;

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String']['output'];
};

type Accessor_ImageAccessor_Fragment = { __typename?: 'ImageAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null };

type Accessor_LabelAccessor_Fragment = { __typename?: 'LabelAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null };

export type AccessorFragment = Accessor_ImageAccessor_Fragment | Accessor_LabelAccessor_Fragment;

export type LabelAccessorFragment = { __typename?: 'LabelAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null, maskView: { __typename?: 'MaskView', id: string } };

export type ImageAccessorFragment = { __typename?: 'ImageAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null };

export type CameraFragment = { __typename?: 'Camera', sensorSizeX?: number | null, sensorSizeY?: number | null, pixelSizeX?: any | null, pixelSizeY?: any | null, name: string, serialNumber: string };

export type CredentialsFragment = { __typename?: 'Credentials', accessKey: string, status: string, secretKey: string, bucket: string, key: string, sessionToken: string, store: string };

export type AccessCredentialsFragment = { __typename?: 'AccessCredentials', accessKey: string, secretKey: string, bucket: string, key: string, sessionToken: string, path: string };

export type PresignedPostCredentialsFragment = { __typename?: 'PresignedPostCredentials', xAmzAlgorithm: string, xAmzCredential: string, xAmzDate: string, xAmzSignature: string, key: string, bucket: string, datalayer: string, policy: string, store: string };

export type DatasetFragment = { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null };

export type ListDatasetFragment = { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean };

export type EraFragment = { __typename?: 'Era', id: string, begin?: any | null, name: string };

export type FileFragment = { __typename?: 'File', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'BigFileStore', id: string, key: string, bucket: string, path: string, presignedUrl: string }, views: Array<{ __typename?: 'FileView', id: string, seriesIdentifier?: string | null, image: { __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null } }>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, organization: { __typename?: 'Organization', slug: string } };

export type ListFileFragment = { __typename?: 'File', id: string, name: string };

export type ImageFragment = { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedFromViews: Array<{ __typename?: 'DerivedView', image: { __typename?: 'Image', id: string, name: string } }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, creator?: { __typename?: 'User', sub: string } | null, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }> }>, rois: Array<{ __typename?: 'ROI', id: string, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string } }> };

export type RgbImageFragment = { __typename?: 'Image', name: string, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }> }> };

export type ListImageFragment = { __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null };

export type InstanceMaskViewLabelFragment = { __typename?: 'InstanceMaskViewLabel', id: string, values: any };

export type InstrumentFragment = { __typename?: 'Instrument', model?: string | null, name: string, serialNumber: string };

type OpticalElement_BeamSplitterElement_Fragment = { __typename?: 'BeamSplitterElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_CcdElement_Fragment = { __typename?: 'CCDElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_DetectorElement_Fragment = { __typename?: 'DetectorElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_FilterElement_Fragment = { __typename?: 'FilterElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_LampElement_Fragment = { __typename?: 'LampElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_LaserElement_Fragment = { __typename?: 'LaserElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_LensElement_Fragment = { __typename?: 'LensElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_MirrorElement_Fragment = { __typename?: 'MirrorElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_ObjectiveElement_Fragment = { __typename?: 'ObjectiveElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_OtherElement_Fragment = { __typename?: 'OtherElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_OtherSourceElement_Fragment = { __typename?: 'OtherSourceElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_PinholeElement_Fragment = { __typename?: 'PinholeElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

type OpticalElement_SampleElement_Fragment = { __typename?: 'SampleElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type OpticalElementFragment = OpticalElement_BeamSplitterElement_Fragment | OpticalElement_CcdElement_Fragment | OpticalElement_DetectorElement_Fragment | OpticalElement_FilterElement_Fragment | OpticalElement_LampElement_Fragment | OpticalElement_LaserElement_Fragment | OpticalElement_LensElement_Fragment | OpticalElement_MirrorElement_Fragment | OpticalElement_ObjectiveElement_Fragment | OpticalElement_OtherElement_Fragment | OpticalElement_OtherSourceElement_Fragment | OpticalElement_PinholeElement_Fragment | OpticalElement_SampleElement_Fragment;

export type SpectrumFragment = { __typename?: 'Spectrum', minNm: number, maxNm: number };

export type DetectorElementFragment = { __typename?: 'DetectorElement', nepdWPerSqrtHz?: number | null, id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type LaserElementFragment = { __typename?: 'LaserElement', nominalWavelengthNm?: number | null, id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type CcdElementFragment = { __typename?: 'CCDElement', pixelSizeUm?: number | null, id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type ObjectiveElementFragment = { __typename?: 'ObjectiveElement', magnification?: number | null, numericalAperture?: number | null, workingDistanceMm?: number | null, id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type FilterElementFragment = { __typename?: 'FilterElement', label: string, id: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type OtherElementFragment = { __typename?: 'OtherElement', label: string, id: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type OtherSourceElementFragment = { __typename?: 'OtherSourceElement', channel?: ChannelKind | null, id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type MirrorElementFragment = { __typename?: 'MirrorElement', angleDeg?: number | null, id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, band?: { __typename?: 'Spectrum', minNm: number, maxNm: number } | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type BeamSplitterElementFragment = { __typename?: 'BeamSplitterElement', rFraction: number, tFraction: number, id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, band?: { __typename?: 'Spectrum', minNm: number, maxNm: number } | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type LensElementFragment = { __typename?: 'LensElement', focalLengthMm: number, id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type PinholeElementFragment = { __typename?: 'PinholeElement', diameterUm?: number | null, id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type SampleElementFragment = { __typename?: 'SampleElement', label: string, id: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> };

export type LightEdgeFragment = { __typename?: 'LightEdge', id: string, sourceElementId: string, sourcePortId: string, targetElementId: string, targetPortId: string, medium?: string | null };

export type LightpathGraphFragment = { __typename?: 'LightpathGraph', elements: Array<{ __typename: 'BeamSplitterElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, rFraction: number, tFraction: number, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }>, band?: { __typename?: 'Spectrum', minNm: number, maxNm: number } | null } | { __typename: 'CCDElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'DetectorElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, nepdWPerSqrtHz?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'FilterElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LampElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LaserElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, nominalWavelengthNm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LensElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, focalLengthMm: number, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'MirrorElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, angleDeg?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }>, band?: { __typename?: 'Spectrum', minNm: number, maxNm: number } | null } | { __typename: 'ObjectiveElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, magnification?: number | null, numericalAperture?: number | null, workingDistanceMm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'OtherElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'OtherSourceElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, channel?: ChannelKind | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'PinholeElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, diameterUm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'SampleElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> }>, edges: Array<{ __typename?: 'LightEdge', id: string, sourceElementId: string, sourcePortId: string, targetElementId: string, targetPortId: string, medium?: string | null }> };

export type MeshFragment = { __typename?: 'Mesh', id: string, name: string, store: { __typename?: 'MeshStore', id: string, key: string, presignedUrl: string } };

export type ListMeshFragment = { __typename?: 'Mesh', id: string, name: string };

export type MultiWellPlateFragment = { __typename?: 'MultiWellPlate', id: string, name?: string | null, views: Array<{ __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }> };

export type ListMultiWellPlateFragment = { __typename?: 'MultiWellPlate', id: string, name?: string | null };

export type ObjectiveFragment = { __typename?: 'Objective', na?: number | null, name: string, serialNumber: string };

export type ProvenanceEntryFragment = { __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> };

export type RgbContextFragment = { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> } };

export type ListRgbContextFragment = { __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }> };

export type ListRoiFragment = { __typename?: 'ROI', id: string, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string } };

export type RoiFragment = { __typename?: 'ROI', id: string, pinned: boolean, createdAt: any, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }> }> }, creator?: { __typename?: 'User', sub: string } | null, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }> };

export type SnapshotFragment = { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } };

export type StageFragment = { __typename?: 'Stage', id: string, pinned: boolean, name: string, affineViews: Array<{ __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, image: { __typename?: 'Image', id: string, name: string, store: { __typename?: 'ZarrStore', shape?: Array<number> | null } }, stage: { __typename?: 'Stage', id: string, name: string } }> };

export type ListStageFragment = { __typename?: 'Stage', id: string, name: string };

export type ZarrStoreFragment = { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string };

export type ParquetStoreFragment = { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string, presignedUrl: string };

export type BigFileStoreFragment = { __typename?: 'BigFileStore', id: string, key: string, bucket: string, path: string, presignedUrl: string };

export type MediaStoreFragment = { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string };

export type MeshStoreFragment = { __typename?: 'MeshStore', id: string, key: string, presignedUrl: string };

export type TableFragment = { __typename?: 'Table', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string, presignedUrl: string }, columns: Array<{ __typename?: 'TableColumn', name: string, type: DuckDbDataType, accessors: Array<{ __typename?: 'ImageAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null } | { __typename?: 'LabelAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null, maskView: { __typename?: 'MaskView', id: string } }> }>, accessors: Array<{ __typename?: 'ImageAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null } | { __typename?: 'LabelAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null, maskView: { __typename?: 'MaskView', id: string } }> };

export type ListTableFragment = { __typename?: 'Table', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string, presignedUrl: string } };

export type VideoFragment = { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } };

type View_AcquisitionView_Fragment = { __typename?: 'AcquisitionView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_AffineTransformationView_Fragment = { __typename?: 'AffineTransformationView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_ChannelView_Fragment = { __typename?: 'ChannelView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_ContinousScanView_Fragment = { __typename?: 'ContinousScanView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_DerivedView_Fragment = { __typename?: 'DerivedView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_FileView_Fragment = { __typename?: 'FileView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_HistogramView_Fragment = { __typename?: 'HistogramView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_InstanceMaskView_Fragment = { __typename?: 'InstanceMaskView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_LabelView_Fragment = { __typename?: 'LabelView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_LightpathView_Fragment = { __typename?: 'LightpathView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_MaskView_Fragment = { __typename?: 'MaskView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_OpticsView_Fragment = { __typename?: 'OpticsView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_RgbView_Fragment = { __typename?: 'RGBView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_RoiView_Fragment = { __typename?: 'ROIView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_ReferenceView_Fragment = { __typename?: 'ReferenceView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_ScaleView_Fragment = { __typename?: 'ScaleView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_TimepointView_Fragment = { __typename?: 'TimepointView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

type View_WellPositionView_Fragment = { __typename?: 'WellPositionView', xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

export type ViewFragment = View_AcquisitionView_Fragment | View_AffineTransformationView_Fragment | View_ChannelView_Fragment | View_ContinousScanView_Fragment | View_DerivedView_Fragment | View_FileView_Fragment | View_HistogramView_Fragment | View_InstanceMaskView_Fragment | View_LabelView_Fragment | View_LightpathView_Fragment | View_MaskView_Fragment | View_OpticsView_Fragment | View_RgbView_Fragment | View_RoiView_Fragment | View_ReferenceView_Fragment | View_ScaleView_Fragment | View_TimepointView_Fragment | View_WellPositionView_Fragment;

export type ChannelViewFragment = { __typename?: 'ChannelView', id: string, excitationWavelength?: number | null, emissionWavelength?: number | null, acquisitionMode?: string | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channelName?: string | null };

export type LightpathViewFragment = { __typename?: 'LightpathView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, graph: { __typename?: 'LightpathGraph', elements: Array<{ __typename: 'BeamSplitterElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, rFraction: number, tFraction: number, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }>, band?: { __typename?: 'Spectrum', minNm: number, maxNm: number } | null } | { __typename: 'CCDElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'DetectorElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, nepdWPerSqrtHz?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'FilterElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LampElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LaserElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, nominalWavelengthNm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LensElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, focalLengthMm: number, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'MirrorElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, angleDeg?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }>, band?: { __typename?: 'Spectrum', minNm: number, maxNm: number } | null } | { __typename: 'ObjectiveElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, magnification?: number | null, numericalAperture?: number | null, workingDistanceMm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'OtherElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'OtherSourceElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, channel?: ChannelKind | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'PinholeElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, diameterUm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'SampleElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> }>, edges: Array<{ __typename?: 'LightEdge', id: string, sourceElementId: string, sourcePortId: string, targetElementId: string, targetPortId: string, medium?: string | null }> } };

export type DerivedViewFragment = { __typename?: 'DerivedView', id: string, operation?: string | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, originImage: { __typename?: 'Image', id: string, name: string } };

export type RoiViewFragment = { __typename?: 'ROIView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, roi: { __typename?: 'ROI', id: string, name: string } };

export type FileViewFragment = { __typename?: 'FileView', id: string, seriesIdentifier?: string | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, file: { __typename?: 'File', id: string, name: string } };

export type AffineTransformationViewFragment = { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } };

export type RgbViewFragment = { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> };

export type TimepointViewFragment = { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } };

export type OpticsViewFragment = { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null };

export type MaskViewFragment = { __typename?: 'MaskView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, referenceView: { __typename?: 'ReferenceView', id: string, image: { __typename?: 'Image', id: string, name: string } } };

export type ReferenceViewFragment = { __typename?: 'ReferenceView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

export type InstanceMaskViewFragment = { __typename?: 'InstanceMaskView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, referenceView: { __typename?: 'ReferenceView', id: string, image: { __typename?: 'Image', id: string, name: string } }, labels?: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string, presignedUrl: string } | null };

export type AcquisitionViewFragment = { __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null };

export type WellPositionViewFragment = { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null };

export type ContinousScanViewFragment = { __typename?: 'ContinousScanView', id: string, direction: ScanDirection, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

export type HistogramViewFragment = { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null };

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

export type CreateDatasetMutationVariables = Exact<{
  input: CreateDatasetInput;
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


export type PinDatasetMutation = { __typename?: 'Mutation', pinDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type PutDatasetsInDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type PutDatasetsInDatasetMutation = { __typename?: 'Mutation', putDatasetsInDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ReleaseDatasetsFromDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type ReleaseDatasetsFromDatasetMutation = { __typename?: 'Mutation', releaseDatasetsFromDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type PutImagesInDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type PutImagesInDatasetMutation = { __typename?: 'Mutation', putImagesInDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ReleaseImagesFromDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type ReleaseImagesFromDatasetMutation = { __typename?: 'Mutation', releaseImagesFromDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type PutFilesInDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type PutFilesInDatasetMutation = { __typename?: 'Mutation', putFilesInDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ReleaseFilesFromDatasetMutationVariables = Exact<{
  selfs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  other: Scalars['ID']['input'];
}>;


export type ReleaseFilesFromDatasetMutation = { __typename?: 'Mutation', releaseFilesFromDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type RevertDatasetMutationVariables = Exact<{
  dataset: Scalars['ID']['input'];
  history: Scalars['ID']['input'];
}>;


export type RevertDatasetMutation = { __typename?: 'Mutation', revertDataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null } };

export type DeleteDatasetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteDatasetMutation = { __typename?: 'Mutation', deleteDataset: string };

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


export type From_File_LikeMutation = { __typename?: 'Mutation', fromFileLike: { __typename?: 'File', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'BigFileStore', id: string, key: string, bucket: string, path: string, presignedUrl: string }, views: Array<{ __typename?: 'FileView', id: string, seriesIdentifier?: string | null, image: { __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null } }>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, organization: { __typename?: 'Organization', slug: string } } };

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


export type PinImageMutation = { __typename?: 'Mutation', pinImage: { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedFromViews: Array<{ __typename?: 'DerivedView', image: { __typename?: 'Image', id: string, name: string } }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, creator?: { __typename?: 'User', sub: string } | null, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }> }>, rois: Array<{ __typename?: 'ROI', id: string, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string } }> } };

export type UpdateImageMutationVariables = Exact<{
  input: UpdateImageInput;
}>;


export type UpdateImageMutation = { __typename?: 'Mutation', updateImage: { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedFromViews: Array<{ __typename?: 'DerivedView', image: { __typename?: 'Image', id: string, name: string } }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, creator?: { __typename?: 'User', sub: string } | null, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }> }>, rois: Array<{ __typename?: 'ROI', id: string, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string } }> } };

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

export type AssignUserPermissionsMutationVariables = Exact<{
  input: AssignUserPermissionInput;
}>;


export type AssignUserPermissionsMutation = { __typename?: 'Mutation', assignUserPermission: Array<{ __typename?: 'UserObjectPermission', permission: string, user: { __typename?: 'User', sub: string } }> };

export type CreateRgbContextMutationVariables = Exact<{
  input: CreateRgbContextInput;
}>;


export type CreateRgbContextMutation = { __typename?: 'Mutation', createRgbContext: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> } } };

export type UpdateRgbContextMutationVariables = Exact<{
  input: UpdateRgbContextInput;
}>;


export type UpdateRgbContextMutation = { __typename?: 'Mutation', updateRgbContext: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> } } };

export type PinRoiMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
}>;


export type PinRoiMutation = { __typename?: 'Mutation', pinRoi: { __typename?: 'ROI', id: string, pinned: boolean, createdAt: any, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }> }> }, creator?: { __typename?: 'User', sub: string } | null, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }> } };

export type CreateRoiMutationVariables = Exact<{
  input: RoiInput;
}>;


export type CreateRoiMutation = { __typename?: 'Mutation', createRoi: { __typename?: 'ROI', id: string, pinned: boolean, createdAt: any, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }> }> }, creator?: { __typename?: 'User', sub: string } | null, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }> } };

export type DeleteRoiMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRoiMutation = { __typename?: 'Mutation', deleteRoi: string };

export type CreateSnapshotMutationVariables = Exact<{
  image: Scalars['ID']['input'];
  file: Scalars['ImageFileLike']['input'];
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


export type PinStageMutation = { __typename?: 'Mutation', pinStage: { __typename?: 'Stage', id: string, pinned: boolean, name: string, affineViews: Array<{ __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, image: { __typename?: 'Image', id: string, name: string, store: { __typename?: 'ZarrStore', shape?: Array<number> | null } }, stage: { __typename?: 'Stage', id: string, name: string } }> } };

export type From_Parquet_LikeMutationVariables = Exact<{
  dataframe: Scalars['ParquetLike']['input'];
  name: Scalars['String']['input'];
  origins?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
}>;


export type From_Parquet_LikeMutation = { __typename?: 'Mutation', fromParquetLike: { __typename?: 'Table', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string, presignedUrl: string }, columns: Array<{ __typename?: 'TableColumn', name: string, type: DuckDbDataType, accessors: Array<{ __typename?: 'ImageAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null } | { __typename?: 'LabelAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null, maskView: { __typename?: 'MaskView', id: string } }> }>, accessors: Array<{ __typename?: 'ImageAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null } | { __typename?: 'LabelAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null, maskView: { __typename?: 'MaskView', id: string } }> } };

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

export type DeleteHistogramViewMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteHistogramViewMutation = { __typename?: 'Mutation', deleteHistogramView: string };

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

export type CreateMaskViewMutationVariables = Exact<{
  input: MaskViewInput;
}>;


export type CreateMaskViewMutation = { __typename?: 'Mutation', createMaskView: { __typename?: 'MaskView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, referenceView: { __typename?: 'ReferenceView', id: string, image: { __typename?: 'Image', id: string, name: string } } } };

export type CreateInstanceMaskViewMutationVariables = Exact<{
  input: InstanceMaskViewInput;
}>;


export type CreateInstanceMaskViewMutation = { __typename?: 'Mutation', createInstanceMaskView: { __typename?: 'InstanceMaskView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, referenceView: { __typename?: 'ReferenceView', id: string, image: { __typename?: 'Image', id: string, name: string } }, labels?: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string, presignedUrl: string } | null } };

export type UpdateRgbViewMutationVariables = Exact<{
  input: UpdateRgbViewInput;
}>;


export type UpdateRgbViewMutation = { __typename?: 'Mutation', updateRgbView: { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> } };

export type CreateViewCollectionMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateViewCollectionMutation = { __typename?: 'Mutation', createViewCollection: { __typename?: 'ViewCollection', id: string, name: string } };

export type GetCameraQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCameraQuery = { __typename?: 'Query', camera: { __typename?: 'Camera', sensorSizeX?: number | null, sensorSizeY?: number | null, pixelSizeX?: any | null, pixelSizeY?: any | null, name: string, serialNumber: string } };

export type ChildrenQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  pagination?: InputMaybe<ChildrenPaginationInput>;
  filters?: InputMaybe<DatasetChildrenFilter>;
}>;


export type ChildrenQuery = { __typename?: 'Query', children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean } | { __typename?: 'File', id: string, name: string } | { __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }> };

export type GetDatasetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDatasetQuery = { __typename?: 'Query', dataset: { __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean, pinned: boolean, createdAt: any, tags: Array<string>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }>, children: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }>, creator?: { __typename?: 'User', sub: string } | null } };

export type GetDatasetsQueryVariables = Exact<{
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetDatasetsQuery = { __typename?: 'Query', datasets: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }> };

export type GetFileQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFileQuery = { __typename?: 'Query', file: { __typename?: 'File', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'BigFileStore', id: string, key: string, bucket: string, path: string, presignedUrl: string }, views: Array<{ __typename?: 'FileView', id: string, seriesIdentifier?: string | null, image: { __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null } }>, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, organization: { __typename?: 'Organization', slug: string } } };

export type GetFilesQueryVariables = Exact<{
  filters?: InputMaybe<FileFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
  order?: InputMaybe<FileOrder>;
}>;


export type GetFilesQuery = { __typename?: 'Query', files: Array<{ __typename?: 'File', id: string, name: string }> };

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  noImages: Scalars['Boolean']['input'];
  noFiles: Scalars['Boolean']['input'];
  noDatasets: Scalars['Boolean']['input'];
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', images?: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files?: Array<{ __typename?: 'File', id: string, name: string }>, datasets?: Array<{ __typename?: 'Dataset', id: string, name: string, description?: string | null, isDefault: boolean }> };

export type ImagesQueryVariables = Exact<{ [key: string]: never; }>;


export type ImagesQuery = { __typename?: 'Query', images: Array<{ __typename?: 'Image', id: string }> };

export type HomePageQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageQuery = { __typename?: 'Query', images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }> };

export type PeerHomePageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PeerHomePageQuery = { __typename?: 'Query', images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }>, files: Array<{ __typename?: 'File', id: string, name: string }> };

export type HomePageStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageStatsQuery = { __typename?: 'Query', imagesStats: { __typename?: 'ImageStats', count: number, series: Array<{ __typename?: 'TimeBucket', count: number }> } };

export type PeerHomePageStatsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PeerHomePageStatsQuery = { __typename?: 'Query', imagesStats: { __typename?: 'ImageStats', count: number, series: Array<{ __typename?: 'TimeBucket', count: number }> } };

export type GetImageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetImageQuery = { __typename?: 'Query', image: { __typename?: 'Image', id: string, name: string, pinned: boolean, createdAt: any, tags: Array<string>, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedFromViews: Array<{ __typename?: 'DerivedView', image: { __typename?: 'Image', id: string, name: string } }>, renders: Array<{ __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | { __typename?: 'Video', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } }>, dataset?: { __typename?: 'Dataset', name: string, id: string } | null, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }>, creator?: { __typename?: 'User', sub: string } | null, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }> }>, rois: Array<{ __typename?: 'ROI', id: string, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string } }> } };

export type GetImagesQueryVariables = Exact<{
  filters?: InputMaybe<ImageFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
  order?: InputMaybe<ImageOrder>;
}>;


export type GetImagesQuery = { __typename?: 'Query', images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }> };

export type ListImagesQueryVariables = Exact<{
  filters?: InputMaybe<ImageFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
  order?: InputMaybe<ImageOrder>;
}>;


export type ListImagesQuery = { __typename?: 'Query', images: Array<{ __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null }> };

export type GetInstanceMaskViewLabelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInstanceMaskViewLabelQuery = { __typename?: 'Query', instanceMaskViewLabel: { __typename?: 'InstanceMaskViewLabel', id: string, values: any } };

export type GetInstrumentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInstrumentQuery = { __typename?: 'Query', instrument: { __typename?: 'Instrument', model?: string | null, name: string, serialNumber: string } };

export type GetLightpathViewQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLightpathViewQuery = { __typename?: 'Query', lightpathView: { __typename?: 'LightpathView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, graph: { __typename?: 'LightpathGraph', elements: Array<{ __typename: 'BeamSplitterElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, rFraction: number, tFraction: number, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }>, band?: { __typename?: 'Spectrum', minNm: number, maxNm: number } | null } | { __typename: 'CCDElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'DetectorElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, nepdWPerSqrtHz?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'FilterElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LampElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LaserElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, nominalWavelengthNm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LensElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, focalLengthMm: number, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'MirrorElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, angleDeg?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }>, band?: { __typename?: 'Spectrum', minNm: number, maxNm: number } | null } | { __typename: 'ObjectiveElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, magnification?: number | null, numericalAperture?: number | null, workingDistanceMm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'OtherElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'OtherSourceElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, channel?: ChannelKind | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'PinholeElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, diameterUm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'SampleElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> }>, edges: Array<{ __typename?: 'LightEdge', id: string, sourceElementId: string, sourcePortId: string, targetElementId: string, targetPortId: string, medium?: string | null }> } } };

export type MembersQueryVariables = Exact<{ [key: string]: never; }>;


export type MembersQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Membership', user: { __typename?: 'User', sub: string }, datasets: Array<{ __typename?: 'Dataset', id: string, name: string }> }> };

export type DetailMeshQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailMeshQuery = { __typename?: 'Query', mesh: { __typename?: 'Mesh', id: string, name: string, store: { __typename?: 'MeshStore', id: string, key: string, presignedUrl: string } } };

export type ListMeshesQueryVariables = Exact<{
  filters?: InputMaybe<MeshFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListMeshesQuery = { __typename?: 'Query', meshes: Array<{ __typename?: 'Mesh', id: string, name: string }> };

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

export type GetPermissionsQueryVariables = Exact<{
  identifier: Scalars['String']['input'];
  object: Scalars['ID']['input'];
}>;


export type GetPermissionsQuery = { __typename?: 'Query', permissions: Array<{ __typename?: 'UserObjectPermission', permission: string, user: { __typename?: 'User', sub: string } }> };

export type PermissionOptionsQueryVariables = Exact<{
  identifier: Scalars['String']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type PermissionOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'PermissionOption', value: string, label: string }> };

export type GetMaskedPixelInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMaskedPixelInfoQuery = { __typename?: 'Query', maskedPixelInfo: { __typename?: 'MaskedPixelInfo', label: string } };

export type GetRgbContextQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRgbContextQuery = { __typename?: 'Query', rgbcontext: { __typename?: 'RGBContext', id: string, pinned: boolean, name: string, z: number, t: number, c: number, blending: Blending, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> } } };

export type GetRgbContextsQueryVariables = Exact<{
  filters?: InputMaybe<RgbContextFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetRgbContextsQuery = { __typename?: 'Query', rgbcontexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }> }> };

export type RgbContextOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type RgbContextOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'RGBContext', value: string, label: string }> };

export type GetRoiQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRoiQuery = { __typename?: 'Query', roi: { __typename?: 'ROI', id: string, pinned: boolean, createdAt: any, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string, rgbContexts: Array<{ __typename?: 'RGBContext', id: string, name: string, blending: Blending, t: number, z: number, c: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, views: Array<{ __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> }> }> }, creator?: { __typename?: 'User', sub: string } | null, provenanceEntries: Array<{ __typename?: 'ProvenanceEntry', id: string, during?: string | null, kind: HistoryKind, date: any, user?: { __typename?: 'User', sub: string } | null, client?: { __typename?: 'Client', clientId: string } | null, effectiveChanges: Array<{ __typename?: 'ModelChange', field: string, oldValue?: string | null, newValue?: string | null }> }> } };

export type GetRoIsQueryVariables = Exact<{
  filters?: InputMaybe<RoiFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
  order?: InputMaybe<RoiOrder>;
}>;


export type GetRoIsQuery = { __typename?: 'Query', rois: Array<{ __typename?: 'ROI', id: string, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string } }> };

export type RowsQueryVariables = Exact<{
  table: Scalars['ID']['input'];
  filters?: InputMaybe<RowFilter>;
  pagination?: InputMaybe<TablePaginationInput>;
}>;


export type RowsQuery = { __typename?: 'Query', rows: Array<any> };

export type GetSnapshotQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSnapshotQuery = { __typename?: 'Query', snapshot: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', presignedUrl: string } } };

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


export type GetTableQuery = { __typename?: 'Query', table: { __typename?: 'Table', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string, presignedUrl: string }, columns: Array<{ __typename?: 'TableColumn', name: string, type: DuckDbDataType, accessors: Array<{ __typename?: 'ImageAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null } | { __typename?: 'LabelAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null, maskView: { __typename?: 'MaskView', id: string } }> }>, accessors: Array<{ __typename?: 'ImageAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null } | { __typename?: 'LabelAccessor', id: string, keys: Array<string>, minIndex?: number | null, maxIndex?: number | null, maskView: { __typename?: 'MaskView', id: string } }> } };

export type GetTablesQueryVariables = Exact<{
  filters?: InputMaybe<TableFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GetTablesQuery = { __typename?: 'Query', tables: Array<{ __typename?: 'Table', id: string, name: string, origins: Array<{ __typename?: 'Image', id: string }>, store: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string, presignedUrl: string } }> };

export type GetRgbViewQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRgbViewQuery = { __typename?: 'Query', rgbView: { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> } };

export type SearchRgbViewsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchRgbViewsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'RGBView', value: string, label: string }> };

export type ActiveImageViewsQueryVariables = Exact<{
  image: Scalars['ID']['input'];
  selector?: InputMaybe<Selector>;
  exclude?: InputMaybe<Array<ViewKind> | ViewKind>;
}>;


export type ActiveImageViewsQuery = { __typename?: 'Query', activeViews: Array<{ __typename?: 'AcquisitionView', id: string, description?: string | null, acquiredAt?: any | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, operator?: { __typename?: 'User', sub: string } | null } | { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, stage: { __typename?: 'Stage', id: string, name: string } } | { __typename?: 'ChannelView', id: string, excitationWavelength?: number | null, emissionWavelength?: number | null, acquisitionMode?: string | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, channelName?: string | null } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView', id: string, operation?: string | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, originImage: { __typename?: 'Image', id: string, name: string } } | { __typename?: 'FileView', id: string, seriesIdentifier?: string | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, file: { __typename?: 'File', id: string, name: string } } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, referenceView: { __typename?: 'ReferenceView', id: string, image: { __typename?: 'Image', id: string, name: string } }, labels?: { __typename?: 'ParquetStore', id: string, key: string, bucket: string, path: string, presignedUrl: string } | null } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, graph: { __typename?: 'LightpathGraph', elements: Array<{ __typename: 'BeamSplitterElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, rFraction: number, tFraction: number, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }>, band?: { __typename?: 'Spectrum', minNm: number, maxNm: number } | null } | { __typename: 'CCDElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'DetectorElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, nepdWPerSqrtHz?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'FilterElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LampElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LaserElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, nominalWavelengthNm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'LensElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, focalLengthMm: number, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'MirrorElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, angleDeg?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }>, band?: { __typename?: 'Spectrum', minNm: number, maxNm: number } | null } | { __typename: 'ObjectiveElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, magnification?: number | null, numericalAperture?: number | null, workingDistanceMm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'OtherElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'OtherSourceElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, channel?: ChannelKind | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'PinholeElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, diameterUm?: number | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> } | { __typename: 'SampleElement', id: string, label: string, kind: ElementKind, manufacturer?: string | null, model?: string | null, pose?: { __typename?: 'Pose3D', position?: { __typename?: 'Vec3', x?: number | null, y?: number | null, z?: number | null } | null, orientation?: { __typename?: 'Euler', rx?: number | null, ry?: number | null, rz?: number | null } | null } | null, ports: Array<{ __typename?: 'LightPort', id: string, name: string, role: PortRole, channel: ChannelKind }> }>, edges: Array<{ __typename?: 'LightEdge', id: string, sourceElementId: string, sourcePortId: string, targetElementId: string, targetPortId: string, medium?: string | null }> } } | { __typename?: 'MaskView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, referenceView: { __typename?: 'ReferenceView', id: string, image: { __typename?: 'Image', id: string, name: string } } } | { __typename?: 'OpticsView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, objective?: { __typename?: 'Objective', id: string, name: string, serialNumber: string } | null, camera?: { __typename?: 'Camera', id: string, name: string, serialNumber: string } | null, instrument?: { __typename?: 'Instrument', id: string, name: string, serialNumber: string } | null } | { __typename?: 'RGBView', id: string, name: string, colorMap: ColorMap, contrastLimitMin?: number | null, contrastLimitMax?: number | null, gamma?: number | null, active: boolean, fullColour: string, baseColor?: Array<number> | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, contexts: Array<{ __typename?: 'RGBContext', id: string, name: string }>, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string }, derivedScaleViews: Array<{ __typename?: 'ScaleView', id: string, scaleX: number, scaleY: number, scaleZ: number, scaleT: number, scaleC: number, image: { __typename?: 'Image', id: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null, chunks?: Array<number> | null, version: string } } }> }, congruentViews: Array<{ __typename?: 'AcquisitionView' } | { __typename?: 'AffineTransformationView' } | { __typename?: 'ChannelView' } | { __typename?: 'ContinousScanView' } | { __typename?: 'DerivedView' } | { __typename?: 'FileView' } | { __typename?: 'HistogramView', id: string, bins: Array<number>, min: number, max: number, histogram: Array<number>, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null } | { __typename?: 'InstanceMaskView' } | { __typename?: 'LabelView' } | { __typename?: 'LightpathView' } | { __typename?: 'MaskView' } | { __typename?: 'OpticsView' } | { __typename?: 'RGBView' } | { __typename?: 'ROIView' } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView' } | { __typename?: 'WellPositionView' }> } | { __typename?: 'ROIView', id: string, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, roi: { __typename?: 'ROI', id: string, name: string } } | { __typename?: 'ReferenceView' } | { __typename?: 'ScaleView' } | { __typename?: 'TimepointView', id: string, msSinceStart?: any | null, indexSinceStart?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, era: { __typename?: 'Era', id: string, begin?: any | null, name: string } } | { __typename?: 'WellPositionView', id: string, column?: number | null, row?: number | null, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, well?: { __typename?: 'MultiWellPlate', id: string, rows?: number | null, columns?: number | null, name?: string | null } | null }> };

export type WatchImagesSubscriptionVariables = Exact<{
  dataset?: InputMaybe<Scalars['ID']['input']>;
}>;


export type WatchImagesSubscription = { __typename?: 'Subscription', images: { __typename?: 'ImageEvent', delete?: string | null, create?: { __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null } | null, update?: { __typename?: 'Image', id: string, name: string, latestSnapshot?: { __typename?: 'Snapshot', id: string, store: { __typename?: 'MediaStore', key: string, presignedUrl: string } } | null } | null } };

export type WatchRoisSubscriptionVariables = Exact<{
  image: Scalars['ID']['input'];
}>;


export type WatchRoisSubscription = { __typename?: 'Subscription', rois: { __typename?: 'RoiEvent', delete?: string | null, create?: { __typename?: 'ROI', id: string, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string } } | null, update?: { __typename?: 'ROI', id: string, kind: RoiKind, vectors: Array<any>, image: { __typename?: 'Image', id: string, name: string } } | null } };

export type WatchTransformationViewsSubscriptionVariables = Exact<{
  stage: Scalars['ID']['input'];
}>;


export type WatchTransformationViewsSubscription = { __typename?: 'Subscription', affineTransformationViews: { __typename?: 'AffineTransformationViewEvent', delete?: string | null, create?: { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, image: { __typename?: 'Image', id: string, name: string, store: { __typename?: 'ZarrStore', shape?: Array<number> | null } }, stage: { __typename?: 'Stage', id: string, name: string } } | null, update?: { __typename?: 'AffineTransformationView', id: string, affineMatrix: any, xMin?: number | null, xMax?: number | null, yMin?: number | null, yMax?: number | null, tMin?: number | null, tMax?: number | null, cMin?: number | null, cMax?: number | null, zMin?: number | null, zMax?: number | null, image: { __typename?: 'Image', id: string, name: string, store: { __typename?: 'ZarrStore', shape?: Array<number> | null } }, stage: { __typename?: 'Stage', id: string, name: string } } | null } };

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
export const ProvenanceEntryFragmentDoc = gql`
    fragment ProvenanceEntry on ProvenanceEntry {
  id
  during
  kind
  user {
    sub
  }
  client {
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
  provenanceEntries {
    ...ProvenanceEntry
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
    ${ProvenanceEntryFragmentDoc}
${ListImageFragmentDoc}
${ListFileFragmentDoc}
${ListDatasetFragmentDoc}`;
export const BigFileStoreFragmentDoc = gql`
    fragment BigFileStore on BigFileStore {
  id
  key
  bucket
  path
  presignedUrl
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
  views {
    id
    seriesIdentifier
    image {
      ...ListImage
    }
  }
  provenanceEntries {
    ...ProvenanceEntry
  }
  organization {
    slug
  }
}
    ${BigFileStoreFragmentDoc}
${ListImageFragmentDoc}
${ProvenanceEntryFragmentDoc}`;
export const ZarrStoreFragmentDoc = gql`
    fragment ZarrStore on ZarrStore {
  id
  key
  bucket
  path
  shape
  dtype
  chunks
  version
}
    `;
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
export const HistogramViewFragmentDoc = gql`
    fragment HistogramView on HistogramView {
  ...View
  id
  bins
  min
  max
  histogram
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
    derivedScaleViews {
      id
      image {
        id
        store {
          ...ZarrStore
        }
      }
      scaleX
      scaleY
      scaleZ
      scaleT
      scaleC
    }
  }
  congruentViews(types: [HISTOGRAM]) {
    ...HistogramView
  }
  colorMap
  contrastLimitMin
  contrastLimitMax
  gamma
  active
  fullColour
  baseColor
}
    ${ViewFragmentDoc}
${ZarrStoreFragmentDoc}
${HistogramViewFragmentDoc}`;
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
      scaleX
      scaleY
      scaleZ
      scaleT
      scaleC
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
export const ListRoiFragmentDoc = gql`
    fragment ListROI on ROI {
  id
  image {
    id
    name
  }
  kind
  vectors
}
    `;
export const ImageFragmentDoc = gql`
    fragment Image on Image {
  id
  name
  store {
    ...ZarrStore
  }
  derivedFromViews {
    image {
      id
      name
    }
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
  provenanceEntries {
    ...ProvenanceEntry
  }
  creator {
    sub
  }
  tags
  rgbContexts {
    ...ListRGBContext
  }
  rois {
    ...ListROI
  }
}
    ${ZarrStoreFragmentDoc}
${SnapshotFragmentDoc}
${VideoFragmentDoc}
${ProvenanceEntryFragmentDoc}
${ListRgbContextFragmentDoc}
${ListRoiFragmentDoc}`;
export const InstanceMaskViewLabelFragmentDoc = gql`
    fragment InstanceMaskViewLabel on InstanceMaskViewLabel {
  id
  values
}
    `;
export const InstrumentFragmentDoc = gql`
    fragment Instrument on Instrument {
  model
  name
  serialNumber
}
    `;
export const OpticalElementFragmentDoc = gql`
    fragment OpticalElement on OpticalElement {
  id
  label
  kind
  manufacturer
  model
  pose {
    position {
      x
      y
      z
    }
    orientation {
      rx
      ry
      rz
    }
  }
  ports {
    id
    name
    role
    channel
  }
}
    `;
export const CcdElementFragmentDoc = gql`
    fragment CCDElement on CCDElement {
  ...OpticalElement
  pixelSizeUm
}
    ${OpticalElementFragmentDoc}`;
export const MeshStoreFragmentDoc = gql`
    fragment MeshStore on MeshStore {
  id
  key
  presignedUrl
}
    `;
export const MeshFragmentDoc = gql`
    fragment Mesh on Mesh {
  id
  name
  store {
    ...MeshStore
  }
}
    ${MeshStoreFragmentDoc}`;
export const ListMeshFragmentDoc = gql`
    fragment ListMesh on Mesh {
  id
  name
}
    `;
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
    derivedScaleViews {
      id
      image {
        id
        store {
          ...ZarrStore
        }
      }
      scaleX
      scaleY
      scaleZ
      scaleT
      scaleC
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
export const RgbImageFragmentDoc = gql`
    fragment RGBImage on Image {
  name
  rgbContexts {
    ...ListRGBContext
  }
}
    ${ListRgbContextFragmentDoc}`;
export const RoiFragmentDoc = gql`
    fragment ROI on ROI {
  id
  pinned
  image {
    id
    ...RGBImage
  }
  createdAt
  creator {
    sub
  }
  provenanceEntries {
    ...ProvenanceEntry
  }
  kind
  vectors
}
    ${RgbImageFragmentDoc}
${ProvenanceEntryFragmentDoc}`;
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
export const MediaStoreFragmentDoc = gql`
    fragment MediaStore on MediaStore {
  id
  key
  presignedUrl
}
    `;
export const ParquetStoreFragmentDoc = gql`
    fragment ParquetStore on ParquetStore {
  id
  key
  bucket
  path
  presignedUrl
}
    `;
export const AccessorFragmentDoc = gql`
    fragment Accessor on Accessor {
  id
  keys
  minIndex
  maxIndex
}
    `;
export const ImageAccessorFragmentDoc = gql`
    fragment ImageAccessor on ImageAccessor {
  ...Accessor
  id
}
    ${AccessorFragmentDoc}`;
export const LabelAccessorFragmentDoc = gql`
    fragment LabelAccessor on LabelAccessor {
  ...Accessor
  maskView {
    id
  }
}
    ${AccessorFragmentDoc}`;
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
  columns {
    name
    type
    accessors {
      ...Accessor
      ...ImageAccessor
      ...LabelAccessor
    }
  }
  accessors {
    ...ImageAccessor
    ...LabelAccessor
  }
}
    ${ParquetStoreFragmentDoc}
${AccessorFragmentDoc}
${ImageAccessorFragmentDoc}
${LabelAccessorFragmentDoc}`;
export const ListTableFragmentDoc = gql`
    fragment ListTable on Table {
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
export const ChannelViewFragmentDoc = gql`
    fragment ChannelView on ChannelView {
  ...View
  id
  channelName: name
  excitationWavelength
  emissionWavelength
  acquisitionMode
}
    ${ViewFragmentDoc}`;
export const SampleElementFragmentDoc = gql`
    fragment SampleElement on SampleElement {
  ...OpticalElement
  label
}
    ${OpticalElementFragmentDoc}`;
export const OtherSourceElementFragmentDoc = gql`
    fragment OtherSourceElement on OtherSourceElement {
  ...OpticalElement
  channel
}
    ${OpticalElementFragmentDoc}`;
export const DetectorElementFragmentDoc = gql`
    fragment DetectorElement on DetectorElement {
  ...OpticalElement
  nepdWPerSqrtHz
}
    ${OpticalElementFragmentDoc}`;
export const SpectrumFragmentDoc = gql`
    fragment Spectrum on Spectrum {
  minNm
  maxNm
}
    `;
export const MirrorElementFragmentDoc = gql`
    fragment MirrorElement on MirrorElement {
  ...OpticalElement
  angleDeg
  band {
    ...Spectrum
  }
}
    ${OpticalElementFragmentDoc}
${SpectrumFragmentDoc}`;
export const BeamSplitterElementFragmentDoc = gql`
    fragment BeamSplitterElement on BeamSplitterElement {
  ...OpticalElement
  rFraction
  tFraction
  band {
    ...Spectrum
  }
}
    ${OpticalElementFragmentDoc}
${SpectrumFragmentDoc}`;
export const LensElementFragmentDoc = gql`
    fragment LensElement on LensElement {
  ...OpticalElement
  focalLengthMm
}
    ${OpticalElementFragmentDoc}`;
export const ObjectiveElementFragmentDoc = gql`
    fragment ObjectiveElement on ObjectiveElement {
  ...OpticalElement
  magnification
  numericalAperture
  workingDistanceMm
}
    ${OpticalElementFragmentDoc}`;
export const LaserElementFragmentDoc = gql`
    fragment LaserElement on LaserElement {
  ...OpticalElement
  nominalWavelengthNm
}
    ${OpticalElementFragmentDoc}`;
export const FilterElementFragmentDoc = gql`
    fragment FilterElement on FilterElement {
  ...OpticalElement
  label
}
    ${OpticalElementFragmentDoc}`;
export const OtherElementFragmentDoc = gql`
    fragment OtherElement on OtherElement {
  ...OpticalElement
  label
}
    ${OpticalElementFragmentDoc}`;
export const PinholeElementFragmentDoc = gql`
    fragment PinholeElement on PinholeElement {
  ...OpticalElement
  diameterUm
}
    ${OpticalElementFragmentDoc}`;
export const LightEdgeFragmentDoc = gql`
    fragment LightEdge on LightEdge {
  id
  sourceElementId
  sourcePortId
  targetElementId
  targetPortId
  medium
}
    `;
export const LightpathGraphFragmentDoc = gql`
    fragment LightpathGraph on LightpathGraph {
  elements {
    __typename
    ...OpticalElement
    ...SampleElement
    ...OtherSourceElement
    ...DetectorElement
    ...MirrorElement
    ...BeamSplitterElement
    ...LensElement
    ...ObjectiveElement
    ...LaserElement
    ...FilterElement
    ...OtherElement
    ...PinholeElement
  }
  edges {
    ...LightEdge
  }
}
    ${OpticalElementFragmentDoc}
${SampleElementFragmentDoc}
${OtherSourceElementFragmentDoc}
${DetectorElementFragmentDoc}
${MirrorElementFragmentDoc}
${BeamSplitterElementFragmentDoc}
${LensElementFragmentDoc}
${ObjectiveElementFragmentDoc}
${LaserElementFragmentDoc}
${FilterElementFragmentDoc}
${OtherElementFragmentDoc}
${PinholeElementFragmentDoc}
${LightEdgeFragmentDoc}`;
export const LightpathViewFragmentDoc = gql`
    fragment LightpathView on LightpathView {
  ...View
  id
  graph {
    ...LightpathGraph
  }
}
    ${ViewFragmentDoc}
${LightpathGraphFragmentDoc}`;
export const DerivedViewFragmentDoc = gql`
    fragment DerivedView on DerivedView {
  ...View
  id
  originImage {
    id
    name
  }
  operation
}
    ${ViewFragmentDoc}`;
export const RoiViewFragmentDoc = gql`
    fragment ROIView on ROIView {
  ...View
  id
  roi {
    id
    name
  }
}
    ${ViewFragmentDoc}`;
export const FileViewFragmentDoc = gql`
    fragment FileView on FileView {
  ...View
  id
  seriesIdentifier
  file {
    id
    name
  }
}
    ${ViewFragmentDoc}`;
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
export const MaskViewFragmentDoc = gql`
    fragment MaskView on MaskView {
  ...View
  id
  referenceView {
    id
    image {
      id
      name
    }
  }
}
    ${ViewFragmentDoc}`;
export const ReferenceViewFragmentDoc = gql`
    fragment ReferenceView on ReferenceView {
  ...View
  id
}
    ${ViewFragmentDoc}`;
export const InstanceMaskViewFragmentDoc = gql`
    fragment InstanceMaskView on InstanceMaskView {
  ...View
  id
  referenceView {
    id
    image {
      id
      name
    }
  }
  labels {
    ...ParquetStore
  }
}
    ${ViewFragmentDoc}
${ParquetStoreFragmentDoc}`;
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
export const CreateDatasetDocument = gql`
    mutation CreateDataset($input: CreateDatasetInput!) {
  createDataset(input: $input) {
    id
    name
  }
}
    `;
export const UpdateDatasetDocument = gql`
    mutation UpdateDataset($id: ID!, $name: String!) {
  updateDataset(input: {id: $id, name: $name}) {
    id
    name
  }
}
    `;
export const PinDatasetDocument = gql`
    mutation PinDataset($id: ID!, $pin: Boolean!) {
  pinDataset(input: {id: $id, pin: $pin}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export const PutDatasetsInDatasetDocument = gql`
    mutation PutDatasetsInDataset($selfs: [ID!]!, $other: ID!) {
  putDatasetsInDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export const ReleaseDatasetsFromDatasetDocument = gql`
    mutation ReleaseDatasetsFromDataset($selfs: [ID!]!, $other: ID!) {
  releaseDatasetsFromDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export const PutImagesInDatasetDocument = gql`
    mutation PutImagesInDataset($selfs: [ID!]!, $other: ID!) {
  putImagesInDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export const ReleaseImagesFromDatasetDocument = gql`
    mutation ReleaseImagesFromDataset($selfs: [ID!]!, $other: ID!) {
  releaseImagesFromDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export const PutFilesInDatasetDocument = gql`
    mutation PutFilesInDataset($selfs: [ID!]!, $other: ID!) {
  putFilesInDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export const ReleaseFilesFromDatasetDocument = gql`
    mutation ReleaseFilesFromDataset($selfs: [ID!]!, $other: ID!) {
  releaseFilesFromDataset(input: {selfs: $selfs, other: $other}) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export const RevertDatasetDocument = gql`
    mutation RevertDataset($dataset: ID!, $history: ID!) {
  revertDataset(input: {id: $dataset, historyId: $history}) {
    id
    name
    description
  }
}
    `;
export const DeleteDatasetDocument = gql`
    mutation DeleteDataset($id: ID!) {
  deleteDataset(input: {id: $id})
}
    `;
export const CreateEraDocument = gql`
    mutation CreateEra($name: String!, $begin: DateTime) {
  createEra(input: {name: $name, begin: $begin}) {
    id
    begin
  }
}
    `;
export const From_File_LikeDocument = gql`
    mutation from_file_like($file: FileLike!, $name: String!, $origins: [ID!], $dataset: ID) {
  fromFileLike(
    input: {file: $file, fileName: $name, origins: $origins, dataset: $dataset}
  ) {
    ...File
  }
}
    ${FileFragmentDoc}`;
export const RequestFileUploadDocument = gql`
    mutation RequestFileUpload($key: String!, $datalayer: String!) {
  requestFileUpload(input: {fileName: $key, datalayer: $datalayer}) {
    ...Credentials
  }
}
    ${CredentialsFragmentDoc}`;
export const RequestFileUploadPresignedDocument = gql`
    mutation RequestFileUploadPresigned($key: String!, $datalayer: String!) {
  requestFileUploadPresigned(input: {fileName: $key, datalayer: $datalayer}) {
    ...PresignedPostCredentials
  }
}
    ${PresignedPostCredentialsFragmentDoc}`;
export const RequestFileAccessDocument = gql`
    mutation RequestFileAccess($store: ID!, $duration: Int) {
  requestFileAccess(input: {store: $store, duration: $duration}) {
    ...AccessCredentials
  }
}
    ${AccessCredentialsFragmentDoc}`;
export const DeleteFileDocument = gql`
    mutation DeleteFile($id: ID!) {
  deleteFile(input: {id: $id})
}
    `;
export const RequestUploadDocument = gql`
    mutation RequestUpload($key: String!, $datalayer: String!) {
  requestUpload(input: {key: $key, datalayer: $datalayer}) {
    ...Credentials
  }
}
    ${CredentialsFragmentDoc}`;
export const RequestAccessDocument = gql`
    mutation RequestAccess($store: ID!, $duration: Int) {
  requestAccess(input: {store: $store, duration: $duration}) {
    ...AccessCredentials
  }
}
    ${AccessCredentialsFragmentDoc}`;
export const PinImageDocument = gql`
    mutation PinImage($id: ID!, $pin: Boolean!) {
  pinImage(input: {id: $id, pin: $pin}) {
    ...Image
  }
}
    ${ImageFragmentDoc}`;
export const UpdateImageDocument = gql`
    mutation UpdateImage($input: UpdateImageInput!) {
  updateImage(input: $input) {
    ...Image
  }
}
    ${ImageFragmentDoc}`;
export const DeleteImageDocument = gql`
    mutation DeleteImage($id: ID!) {
  deleteImage(input: {id: $id})
}
    `;
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
export const RequestMediaUploadDocument = gql`
    mutation RequestMediaUpload($key: String!, $datalayer: String!) {
  requestMediaUpload(input: {fileName: $key, datalayer: $datalayer}) {
    ...PresignedPostCredentials
  }
}
    ${PresignedPostCredentialsFragmentDoc}`;
export const CreateMultiWellPlateDocument = gql`
    mutation CreateMultiWellPlate($input: MultiWellPlateInput!) {
  createMultiWellPlate(input: $input) {
    ...MultiWellPlate
  }
}
    ${MultiWellPlateFragmentDoc}`;
export const AutoCreateMultiWellPlateDocument = gql`
    mutation AutoCreateMultiWellPlate($input: String!) {
  result: createMultiWellPlate(input: {name: $input}) {
    label: name
    value: id
  }
}
    `;
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
export const AssignUserPermissionsDocument = gql`
    mutation AssignUserPermissions($input: AssignUserPermissionInput!) {
  assignUserPermission(input: $input) {
    user {
      sub
    }
    permission
  }
}
    `;
export const CreateRgbContextDocument = gql`
    mutation CreateRGBContext($input: CreateRGBContextInput!) {
  createRgbContext(input: $input) {
    ...RGBContext
  }
}
    ${RgbContextFragmentDoc}`;
export const UpdateRgbContextDocument = gql`
    mutation UpdateRGBContext($input: UpdateRGBContextInput!) {
  updateRgbContext(input: $input) {
    ...RGBContext
  }
}
    ${RgbContextFragmentDoc}`;
export const PinRoiDocument = gql`
    mutation PinROI($id: ID!, $pin: Boolean!) {
  pinRoi(input: {id: $id, pin: $pin}) {
    ...ROI
  }
}
    ${RoiFragmentDoc}`;
export const CreateRoiDocument = gql`
    mutation CreateROI($input: RoiInput!) {
  createRoi(input: $input) {
    ...ROI
  }
}
    ${RoiFragmentDoc}`;
export const DeleteRoiDocument = gql`
    mutation DeleteROI($id: ID!) {
  deleteRoi(input: {id: $id})
}
    `;
export const CreateSnapshotDocument = gql`
    mutation CreateSnapshot($image: ID!, $file: ImageFileLike!) {
  createSnapshot(input: {file: $file, image: $image}) {
    ...Snapshot
  }
}
    ${SnapshotFragmentDoc}`;
export const CreateStageDocument = gql`
    mutation CreateStage($name: String!) {
  createStage(input: {name: $name}) {
    id
    name
  }
}
    `;
export const PinStageDocument = gql`
    mutation PinStage($id: ID!, $pin: Boolean!) {
  pinStage(input: {id: $id, pin: $pin}) {
    ...Stage
  }
}
    ${StageFragmentDoc}`;
export const From_Parquet_LikeDocument = gql`
    mutation from_parquet_like($dataframe: ParquetLike!, $name: String!, $origins: [ID!], $dataset: ID) {
  fromParquetLike(
    input: {dataframe: $dataframe, name: $name, origins: $origins, dataset: $dataset}
  ) {
    ...Table
  }
}
    ${TableFragmentDoc}`;
export const RequestTableUploadDocument = gql`
    mutation RequestTableUpload($key: String!, $datalayer: String!) {
  requestTableUpload(input: {key: $key, datalayer: $datalayer}) {
    ...Credentials
  }
}
    ${CredentialsFragmentDoc}`;
export const RequestTableAccessDocument = gql`
    mutation RequestTableAccess($store: ID!, $duration: Int) {
  requestTableAccess(input: {store: $store, duration: $duration}) {
    ...AccessCredentials
  }
}
    ${AccessCredentialsFragmentDoc}`;
export const CreateAffineTransformationViewDocument = gql`
    mutation CreateAffineTransformationView($image: ID!, $affineMatrix: FourByFourMatrix!, $stage: ID) {
  createAffineTransformationView(
    input: {image: $image, affineMatrix: $affineMatrix, stage: $stage}
  ) {
    ...AffineTransformationView
  }
}
    ${AffineTransformationViewFragmentDoc}`;
export const DeleteAffineTransformationViewDocument = gql`
    mutation DeleteAffineTransformationView($id: ID!) {
  deleteAffineTransformationView(input: {id: $id})
}
    `;
export const DeleteRgbViewDocument = gql`
    mutation DeleteRGBView($id: ID!) {
  deleteRgbView(input: {id: $id})
}
    `;
export const DeleteChannelViewDocument = gql`
    mutation DeleteChannelView($id: ID!) {
  deleteChannelView(input: {id: $id})
}
    `;
export const DeleteHistogramViewDocument = gql`
    mutation DeleteHistogramView($id: ID!) {
  deleteHistogramView(input: {id: $id})
}
    `;
export const CreateRgbViewDocument = gql`
    mutation CreateRgbView($image: ID!, $context: ID!, $gamma: Float, $contrastLimitMax: Float, $contrastLimitMin: Float, $rescale: Boolean, $active: Boolean, $colorMap: ColorMap) {
  createRgbView(
    input: {image: $image, context: $context, gamma: $gamma, contrastLimitMax: $contrastLimitMax, contrastLimitMin: $contrastLimitMin, rescale: $rescale, active: $active, colorMap: $colorMap}
  ) {
    id
  }
}
    `;
export const CreateWellPositionViewDocument = gql`
    mutation CreateWellPositionView($input: WellPositionViewInput!) {
  createWellPositionView(input: $input) {
    ...WellPositionView
  }
}
    ${WellPositionViewFragmentDoc}`;
export const CreateContinousScanViewDocument = gql`
    mutation CreateContinousScanView($input: ContinousScanViewInput!) {
  createContinousScanView(input: $input) {
    ...ContinousScanView
  }
}
    ${ContinousScanViewFragmentDoc}`;
export const CreateMaskViewDocument = gql`
    mutation CreateMaskView($input: MaskViewInput!) {
  createMaskView(input: $input) {
    ...MaskView
  }
}
    ${MaskViewFragmentDoc}`;
export const CreateInstanceMaskViewDocument = gql`
    mutation CreateInstanceMaskView($input: InstanceMaskViewInput!) {
  createInstanceMaskView(input: $input) {
    ...InstanceMaskView
  }
}
    ${InstanceMaskViewFragmentDoc}`;
export const UpdateRgbViewDocument = gql`
    mutation UpdateRGBView($input: UpdateRGBViewInput!) {
  updateRgbView(input: $input) {
    ...RGBView
  }
}
    ${RgbViewFragmentDoc}`;
export const CreateViewCollectionDocument = gql`
    mutation CreateViewCollection($name: String!) {
  createViewCollection(input: {name: $name}) {
    id
    name
  }
}
    `;
export const GetCameraDocument = gql`
    query GetCamera($id: ID!) {
  camera(id: $id) {
    ...Camera
  }
}
    ${CameraFragmentDoc}`;
export const ChildrenDocument = gql`
    query Children($id: ID!, $pagination: ChildrenPaginationInput, $filters: DatasetChildrenFilter) {
  children(parent: $id, pagination: $pagination, filters: $filters) {
    ...ListFile
    ...ListImage
    ...ListDataset
  }
}
    ${ListFileFragmentDoc}
${ListImageFragmentDoc}
${ListDatasetFragmentDoc}`;
export const GetDatasetDocument = gql`
    query GetDataset($id: ID!) {
  dataset(id: $id) {
    ...Dataset
  }
}
    ${DatasetFragmentDoc}`;
export const GetDatasetsDocument = gql`
    query GetDatasets($filters: DatasetFilter, $pagination: OffsetPaginationInput) {
  datasets(filters: $filters, pagination: $pagination) {
    ...ListDataset
  }
}
    ${ListDatasetFragmentDoc}`;
export const GetFileDocument = gql`
    query GetFile($id: ID!) {
  file(id: $id) {
    ...File
  }
}
    ${FileFragmentDoc}`;
export const GetFilesDocument = gql`
    query GetFiles($filters: FileFilter, $pagination: OffsetPaginationInput, $order: FileOrder) {
  files(filters: $filters, pagination: $pagination, order: $order) {
    ...ListFile
  }
}
    ${ListFileFragmentDoc}`;
export const GlobalSearchDocument = gql`
    query GlobalSearch($search: String, $noImages: Boolean!, $noFiles: Boolean!, $noDatasets: Boolean!, $pagination: OffsetPaginationInput) {
  images: images(filters: {search: $search}, pagination: $pagination) @skip(if: $noImages) {
    ...ListImage
  }
  files: files(filters: {search: $search}, pagination: $pagination) @skip(if: $noFiles) {
    ...ListFile
  }
  datasets: datasets(filters: {search: $search}, pagination: $pagination) @skip(if: $noDatasets) {
    ...ListDataset
  }
}
    ${ListImageFragmentDoc}
${ListFileFragmentDoc}
${ListDatasetFragmentDoc}`;
export const ImagesDocument = gql`
    query Images {
  images {
    id
  }
}
    `;
export const HomePageDocument = gql`
    query HomePage {
  images: images(pagination: {limit: 1}, order: {createdAt: DESC}) {
    ...ListImage
  }
  files: files(pagination: {limit: 1}, order: {createdAt: DESC}) {
    ...ListFile
  }
}
    ${ListImageFragmentDoc}
${ListFileFragmentDoc}`;
export const PeerHomePageDocument = gql`
    query PeerHomePage($id: ID!) {
  images: images(
    pagination: {limit: 1}
    filters: {owner: $id}
    order: {createdAt: DESC}
  ) {
    ...ListImage
  }
  files: files(
    pagination: {limit: 1}
    filters: {owner: $id}
    order: {createdAt: DESC}
  ) {
    ...ListFile
  }
}
    ${ListImageFragmentDoc}
${ListFileFragmentDoc}`;
export const HomePageStatsDocument = gql`
    query HomePageStats {
  imagesStats(filters: {owner: null}) {
    count
    series(by: DAY, field: PK, timestampField: CREATED_AT) {
      count
    }
  }
}
    `;
export const PeerHomePageStatsDocument = gql`
    query PeerHomePageStats($id: ID!) {
  imagesStats(filters: {owner: $id}) {
    count
    series(by: DAY, field: PK, timestampField: CREATED_AT) {
      count
    }
  }
}
    `;
export const GetImageDocument = gql`
    query GetImage($id: ID!) {
  image(id: $id) {
    ...Image
  }
}
    ${ImageFragmentDoc}`;
export const GetImagesDocument = gql`
    query GetImages($filters: ImageFilter, $pagination: OffsetPaginationInput, $order: ImageOrder) {
  images(filters: $filters, pagination: $pagination, order: $order) {
    ...ListImage
  }
}
    ${ListImageFragmentDoc}`;
export const ListImagesDocument = gql`
    query ListImages($filters: ImageFilter, $pagination: OffsetPaginationInput, $order: ImageOrder) {
  images(filters: $filters, pagination: $pagination, order: $order) {
    ...ListImage
  }
}
    ${ListImageFragmentDoc}`;
export const GetInstanceMaskViewLabelDocument = gql`
    query GetInstanceMaskViewLabel($id: ID!) {
  instanceMaskViewLabel(id: $id) {
    ...InstanceMaskViewLabel
  }
}
    ${InstanceMaskViewLabelFragmentDoc}`;
export const GetInstrumentDocument = gql`
    query GetInstrument($id: ID!) {
  instrument(id: $id) {
    ...Instrument
  }
}
    ${InstrumentFragmentDoc}`;
export const GetLightpathViewDocument = gql`
    query GetLightpathView($id: ID!) {
  lightpathView(id: $id) {
    ...LightpathView
  }
}
    ${LightpathViewFragmentDoc}`;
export const MembersDocument = gql`
    query Members {
  members {
    user {
      sub
    }
    datasets(pagination: {limit: 3}, filters: {parentless: true}) {
      id
      name
    }
  }
}
    `;
export const DetailMeshDocument = gql`
    query DetailMesh($id: ID!) {
  mesh(id: $id) {
    ...Mesh
  }
}
    ${MeshFragmentDoc}`;
export const ListMeshesDocument = gql`
    query ListMeshes($filters: MeshFilter, $pagination: OffsetPaginationInput) {
  meshes(filters: $filters, pagination: $pagination) {
    ...ListMesh
  }
}
    ${ListMeshFragmentDoc}`;
export const GetMultiWellPlateDocument = gql`
    query GetMultiWellPlate($id: ID!) {
  multiWellPlate(id: $id) {
    ...MultiWellPlate
  }
}
    ${MultiWellPlateFragmentDoc}`;
export const GetMultiWellPlatesDocument = gql`
    query GetMultiWellPlates($filters: MultiWellPlateFilter, $pagination: OffsetPaginationInput) {
  multiWellPlates(filters: $filters, pagination: $pagination) {
    ...ListMultiWellPlate
  }
}
    ${ListMultiWellPlateFragmentDoc}`;
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
export const GetObjectiveDocument = gql`
    query GetObjective($id: ID!) {
  objective(id: $id) {
    ...Objective
  }
}
    ${ObjectiveFragmentDoc}`;
export const GetPermissionsDocument = gql`
    query GetPermissions($identifier: String!, $object: ID!) {
  permissions(identifier: $identifier, object: $object) {
    user {
      sub
    }
    permission
  }
}
    `;
export const PermissionOptionsDocument = gql`
    query PermissionOptions($identifier: String!, $search: String, $values: [ID!]) {
  options: availablePermissions(
    identifier: $identifier
    search: $search
    values: $values
  ) {
    value
    label
  }
}
    `;
export const GetMaskedPixelInfoDocument = gql`
    query GetMaskedPixelInfo($id: ID!) {
  maskedPixelInfo(id: $id) {
    label
  }
}
    `;
export const GetRgbContextDocument = gql`
    query GetRGBContext($id: ID!) {
  rgbcontext(id: $id) {
    ...RGBContext
  }
}
    ${RgbContextFragmentDoc}`;
export const GetRgbContextsDocument = gql`
    query GetRGBContexts($filters: RGBContextFilter, $pagination: OffsetPaginationInput) {
  rgbcontexts(filters: $filters, pagination: $pagination) {
    ...ListRGBContext
  }
}
    ${ListRgbContextFragmentDoc}`;
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
export const GetRoiDocument = gql`
    query GetROI($id: ID!) {
  roi(id: $id) {
    ...ROI
  }
}
    ${RoiFragmentDoc}`;
export const GetRoIsDocument = gql`
    query GetROIs($filters: ROIFilter, $pagination: OffsetPaginationInput, $order: ROIOrder) {
  rois(filters: $filters, pagination: $pagination, order: $order) {
    ...ListROI
  }
}
    ${ListRoiFragmentDoc}`;
export const RowsDocument = gql`
    query Rows($table: ID!, $filters: RowFilter, $pagination: TablePaginationInput) {
  rows(table: $table, filters: $filters, pagination: $pagination)
}
    `;
export const GetSnapshotDocument = gql`
    query GetSnapshot($id: ID!) {
  snapshot(id: $id) {
    id
    store {
      presignedUrl
    }
  }
}
    `;
export const GetStageDocument = gql`
    query GetStage($id: ID!) {
  stage(id: $id) {
    ...Stage
  }
}
    ${StageFragmentDoc}`;
export const GetStagesDocument = gql`
    query GetStages($filters: StageFilter, $pagination: OffsetPaginationInput) {
  stages(filters: $filters, pagination: $pagination) {
    ...ListStage
  }
}
    ${ListStageFragmentDoc}`;
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
export const GetTableDocument = gql`
    query GetTable($id: ID!) {
  table(id: $id) {
    ...Table
  }
}
    ${TableFragmentDoc}`;
export const GetTablesDocument = gql`
    query GetTables($filters: TableFilter, $pagination: OffsetPaginationInput) {
  tables(filters: $filters, pagination: $pagination) {
    ...ListTable
  }
}
    ${ListTableFragmentDoc}`;
export const GetRgbViewDocument = gql`
    query GetRGBView($id: ID!) {
  rgbView(id: $id) {
    ...RGBView
  }
}
    ${RgbViewFragmentDoc}`;
export const SearchRgbViewsDocument = gql`
    query SearchRGBViews($search: String, $values: [ID!]) {
  options: rgbViews(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;
export const ActiveImageViewsDocument = gql`
    query ActiveImageViews($image: ID!, $selector: Selector, $exclude: [ViewKind!]) {
  activeViews(image: $image, selector: $selector, exclude: $exclude) {
    ...ChannelView
    ...AffineTransformationView
    ...MaskView
    ...InstanceMaskView
    ...TimepointView
    ...OpticsView
    ...AcquisitionView
    ...RGBView
    ...WellPositionView
    ...DerivedView
    ...ROIView
    ...FileView
    ...HistogramView
    ...LightpathView
  }
}
    ${ChannelViewFragmentDoc}
${AffineTransformationViewFragmentDoc}
${MaskViewFragmentDoc}
${InstanceMaskViewFragmentDoc}
${TimepointViewFragmentDoc}
${OpticsViewFragmentDoc}
${AcquisitionViewFragmentDoc}
${RgbViewFragmentDoc}
${WellPositionViewFragmentDoc}
${DerivedViewFragmentDoc}
${RoiViewFragmentDoc}
${FileViewFragmentDoc}
${HistogramViewFragmentDoc}
${LightpathViewFragmentDoc}`;
export const WatchImagesDocument = gql`
    subscription WatchImages($dataset: ID) {
  images(dataset: $dataset) {
    create {
      ...ListImage
    }
    delete
    update {
      ...ListImage
    }
  }
}
    ${ListImageFragmentDoc}`;
export const WatchRoisDocument = gql`
    subscription WatchRois($image: ID!) {
  rois(image: $image) {
    create {
      ...ListROI
    }
    delete
    update {
      ...ListROI
    }
  }
}
    ${ListRoiFragmentDoc}`;
export const WatchTransformationViewsDocument = gql`
    subscription WatchTransformationViews($stage: ID!) {
  affineTransformationViews(stage: $stage) {
    create {
      ...AffineTransformationView
      image {
        id
        store {
          shape
        }
        name
      }
    }
    delete
    update {
      ...AffineTransformationView
      image {
        id
        store {
          shape
        }
        name
      }
    }
  }
}
    ${AffineTransformationViewFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CreateCamera(variables: CreateCameraMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateCameraMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCameraMutation>({ document: CreateCameraDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateCamera', 'mutation', variables);
    },
    EnsureCamera(variables: EnsureCameraMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<EnsureCameraMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EnsureCameraMutation>({ document: EnsureCameraDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'EnsureCamera', 'mutation', variables);
    },
    CreateDataset(variables: CreateDatasetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateDatasetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateDatasetMutation>({ document: CreateDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateDataset', 'mutation', variables);
    },
    UpdateDataset(variables: UpdateDatasetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateDatasetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateDatasetMutation>({ document: UpdateDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateDataset', 'mutation', variables);
    },
    PinDataset(variables: PinDatasetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PinDatasetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<PinDatasetMutation>({ document: PinDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PinDataset', 'mutation', variables);
    },
    PutDatasetsInDataset(variables: PutDatasetsInDatasetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PutDatasetsInDatasetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<PutDatasetsInDatasetMutation>({ document: PutDatasetsInDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PutDatasetsInDataset', 'mutation', variables);
    },
    ReleaseDatasetsFromDataset(variables: ReleaseDatasetsFromDatasetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ReleaseDatasetsFromDatasetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ReleaseDatasetsFromDatasetMutation>({ document: ReleaseDatasetsFromDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ReleaseDatasetsFromDataset', 'mutation', variables);
    },
    PutImagesInDataset(variables: PutImagesInDatasetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PutImagesInDatasetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<PutImagesInDatasetMutation>({ document: PutImagesInDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PutImagesInDataset', 'mutation', variables);
    },
    ReleaseImagesFromDataset(variables: ReleaseImagesFromDatasetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ReleaseImagesFromDatasetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ReleaseImagesFromDatasetMutation>({ document: ReleaseImagesFromDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ReleaseImagesFromDataset', 'mutation', variables);
    },
    PutFilesInDataset(variables: PutFilesInDatasetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PutFilesInDatasetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<PutFilesInDatasetMutation>({ document: PutFilesInDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PutFilesInDataset', 'mutation', variables);
    },
    ReleaseFilesFromDataset(variables: ReleaseFilesFromDatasetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ReleaseFilesFromDatasetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ReleaseFilesFromDatasetMutation>({ document: ReleaseFilesFromDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ReleaseFilesFromDataset', 'mutation', variables);
    },
    RevertDataset(variables: RevertDatasetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RevertDatasetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RevertDatasetMutation>({ document: RevertDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RevertDataset', 'mutation', variables);
    },
    DeleteDataset(variables: DeleteDatasetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteDatasetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteDatasetMutation>({ document: DeleteDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteDataset', 'mutation', variables);
    },
    CreateEra(variables: CreateEraMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateEraMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateEraMutation>({ document: CreateEraDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateEra', 'mutation', variables);
    },
    from_file_like(variables: From_File_LikeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<From_File_LikeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<From_File_LikeMutation>({ document: From_File_LikeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'from_file_like', 'mutation', variables);
    },
    RequestFileUpload(variables: RequestFileUploadMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RequestFileUploadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestFileUploadMutation>({ document: RequestFileUploadDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RequestFileUpload', 'mutation', variables);
    },
    RequestFileUploadPresigned(variables: RequestFileUploadPresignedMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RequestFileUploadPresignedMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestFileUploadPresignedMutation>({ document: RequestFileUploadPresignedDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RequestFileUploadPresigned', 'mutation', variables);
    },
    RequestFileAccess(variables: RequestFileAccessMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RequestFileAccessMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestFileAccessMutation>({ document: RequestFileAccessDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RequestFileAccess', 'mutation', variables);
    },
    DeleteFile(variables: DeleteFileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteFileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteFileMutation>({ document: DeleteFileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteFile', 'mutation', variables);
    },
    RequestUpload(variables: RequestUploadMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RequestUploadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestUploadMutation>({ document: RequestUploadDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RequestUpload', 'mutation', variables);
    },
    RequestAccess(variables: RequestAccessMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RequestAccessMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestAccessMutation>({ document: RequestAccessDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RequestAccess', 'mutation', variables);
    },
    PinImage(variables: PinImageMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PinImageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<PinImageMutation>({ document: PinImageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PinImage', 'mutation', variables);
    },
    UpdateImage(variables: UpdateImageMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateImageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateImageMutation>({ document: UpdateImageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateImage', 'mutation', variables);
    },
    DeleteImage(variables: DeleteImageMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteImageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteImageMutation>({ document: DeleteImageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteImage', 'mutation', variables);
    },
    CreateInstrument(variables: CreateInstrumentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateInstrumentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateInstrumentMutation>({ document: CreateInstrumentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateInstrument', 'mutation', variables);
    },
    EnsureInstrument(variables: EnsureInstrumentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<EnsureInstrumentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EnsureInstrumentMutation>({ document: EnsureInstrumentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'EnsureInstrument', 'mutation', variables);
    },
    RequestMediaUpload(variables: RequestMediaUploadMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RequestMediaUploadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestMediaUploadMutation>({ document: RequestMediaUploadDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RequestMediaUpload', 'mutation', variables);
    },
    CreateMultiWellPlate(variables: CreateMultiWellPlateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateMultiWellPlateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateMultiWellPlateMutation>({ document: CreateMultiWellPlateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateMultiWellPlate', 'mutation', variables);
    },
    AutoCreateMultiWellPlate(variables: AutoCreateMultiWellPlateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AutoCreateMultiWellPlateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AutoCreateMultiWellPlateMutation>({ document: AutoCreateMultiWellPlateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AutoCreateMultiWellPlate', 'mutation', variables);
    },
    CreateObjective(variables: CreateObjectiveMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateObjectiveMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateObjectiveMutation>({ document: CreateObjectiveDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateObjective', 'mutation', variables);
    },
    EnsureObjective(variables: EnsureObjectiveMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<EnsureObjectiveMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EnsureObjectiveMutation>({ document: EnsureObjectiveDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'EnsureObjective', 'mutation', variables);
    },
    AssignUserPermissions(variables: AssignUserPermissionsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AssignUserPermissionsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AssignUserPermissionsMutation>({ document: AssignUserPermissionsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AssignUserPermissions', 'mutation', variables);
    },
    CreateRGBContext(variables: CreateRgbContextMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateRgbContextMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateRgbContextMutation>({ document: CreateRgbContextDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateRGBContext', 'mutation', variables);
    },
    UpdateRGBContext(variables: UpdateRgbContextMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateRgbContextMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateRgbContextMutation>({ document: UpdateRgbContextDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateRGBContext', 'mutation', variables);
    },
    PinROI(variables: PinRoiMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PinRoiMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<PinRoiMutation>({ document: PinRoiDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PinROI', 'mutation', variables);
    },
    CreateROI(variables: CreateRoiMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateRoiMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateRoiMutation>({ document: CreateRoiDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateROI', 'mutation', variables);
    },
    DeleteROI(variables: DeleteRoiMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteRoiMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteRoiMutation>({ document: DeleteRoiDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteROI', 'mutation', variables);
    },
    CreateSnapshot(variables: CreateSnapshotMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateSnapshotMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateSnapshotMutation>({ document: CreateSnapshotDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateSnapshot', 'mutation', variables);
    },
    CreateStage(variables: CreateStageMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateStageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateStageMutation>({ document: CreateStageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateStage', 'mutation', variables);
    },
    PinStage(variables: PinStageMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PinStageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<PinStageMutation>({ document: PinStageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PinStage', 'mutation', variables);
    },
    from_parquet_like(variables: From_Parquet_LikeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<From_Parquet_LikeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<From_Parquet_LikeMutation>({ document: From_Parquet_LikeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'from_parquet_like', 'mutation', variables);
    },
    RequestTableUpload(variables: RequestTableUploadMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RequestTableUploadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestTableUploadMutation>({ document: RequestTableUploadDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RequestTableUpload', 'mutation', variables);
    },
    RequestTableAccess(variables: RequestTableAccessMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RequestTableAccessMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestTableAccessMutation>({ document: RequestTableAccessDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RequestTableAccess', 'mutation', variables);
    },
    CreateAffineTransformationView(variables: CreateAffineTransformationViewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateAffineTransformationViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateAffineTransformationViewMutation>({ document: CreateAffineTransformationViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateAffineTransformationView', 'mutation', variables);
    },
    DeleteAffineTransformationView(variables: DeleteAffineTransformationViewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteAffineTransformationViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteAffineTransformationViewMutation>({ document: DeleteAffineTransformationViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteAffineTransformationView', 'mutation', variables);
    },
    DeleteRGBView(variables: DeleteRgbViewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteRgbViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteRgbViewMutation>({ document: DeleteRgbViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteRGBView', 'mutation', variables);
    },
    DeleteChannelView(variables: DeleteChannelViewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteChannelViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteChannelViewMutation>({ document: DeleteChannelViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteChannelView', 'mutation', variables);
    },
    DeleteHistogramView(variables: DeleteHistogramViewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteHistogramViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteHistogramViewMutation>({ document: DeleteHistogramViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteHistogramView', 'mutation', variables);
    },
    CreateRgbView(variables: CreateRgbViewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateRgbViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateRgbViewMutation>({ document: CreateRgbViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateRgbView', 'mutation', variables);
    },
    CreateWellPositionView(variables: CreateWellPositionViewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateWellPositionViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateWellPositionViewMutation>({ document: CreateWellPositionViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateWellPositionView', 'mutation', variables);
    },
    CreateContinousScanView(variables: CreateContinousScanViewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateContinousScanViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateContinousScanViewMutation>({ document: CreateContinousScanViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateContinousScanView', 'mutation', variables);
    },
    CreateMaskView(variables: CreateMaskViewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateMaskViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateMaskViewMutation>({ document: CreateMaskViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateMaskView', 'mutation', variables);
    },
    CreateInstanceMaskView(variables: CreateInstanceMaskViewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateInstanceMaskViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateInstanceMaskViewMutation>({ document: CreateInstanceMaskViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateInstanceMaskView', 'mutation', variables);
    },
    UpdateRGBView(variables: UpdateRgbViewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateRgbViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateRgbViewMutation>({ document: UpdateRgbViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateRGBView', 'mutation', variables);
    },
    CreateViewCollection(variables: CreateViewCollectionMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateViewCollectionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateViewCollectionMutation>({ document: CreateViewCollectionDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateViewCollection', 'mutation', variables);
    },
    GetCamera(variables: GetCameraQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCameraQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCameraQuery>({ document: GetCameraDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCamera', 'query', variables);
    },
    Children(variables: ChildrenQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ChildrenQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ChildrenQuery>({ document: ChildrenDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Children', 'query', variables);
    },
    GetDataset(variables: GetDatasetQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetDatasetQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetDatasetQuery>({ document: GetDatasetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetDataset', 'query', variables);
    },
    GetDatasets(variables?: GetDatasetsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetDatasetsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetDatasetsQuery>({ document: GetDatasetsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetDatasets', 'query', variables);
    },
    GetFile(variables: GetFileQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetFileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFileQuery>({ document: GetFileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFile', 'query', variables);
    },
    GetFiles(variables?: GetFilesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetFilesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFilesQuery>({ document: GetFilesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFiles', 'query', variables);
    },
    GlobalSearch(variables: GlobalSearchQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GlobalSearchQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GlobalSearchQuery>({ document: GlobalSearchDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GlobalSearch', 'query', variables);
    },
    Images(variables?: ImagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ImagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ImagesQuery>({ document: ImagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Images', 'query', variables);
    },
    HomePage(variables?: HomePageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<HomePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HomePageQuery>({ document: HomePageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'HomePage', 'query', variables);
    },
    PeerHomePage(variables: PeerHomePageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PeerHomePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PeerHomePageQuery>({ document: PeerHomePageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PeerHomePage', 'query', variables);
    },
    HomePageStats(variables?: HomePageStatsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<HomePageStatsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HomePageStatsQuery>({ document: HomePageStatsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'HomePageStats', 'query', variables);
    },
    PeerHomePageStats(variables: PeerHomePageStatsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PeerHomePageStatsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PeerHomePageStatsQuery>({ document: PeerHomePageStatsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PeerHomePageStats', 'query', variables);
    },
    GetImage(variables: GetImageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetImageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetImageQuery>({ document: GetImageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetImage', 'query', variables);
    },
    GetImages(variables?: GetImagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetImagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetImagesQuery>({ document: GetImagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetImages', 'query', variables);
    },
    ListImages(variables?: ListImagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListImagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListImagesQuery>({ document: ListImagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListImages', 'query', variables);
    },
    GetInstanceMaskViewLabel(variables: GetInstanceMaskViewLabelQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetInstanceMaskViewLabelQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetInstanceMaskViewLabelQuery>({ document: GetInstanceMaskViewLabelDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetInstanceMaskViewLabel', 'query', variables);
    },
    GetInstrument(variables: GetInstrumentQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetInstrumentQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetInstrumentQuery>({ document: GetInstrumentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetInstrument', 'query', variables);
    },
    GetLightpathView(variables: GetLightpathViewQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetLightpathViewQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLightpathViewQuery>({ document: GetLightpathViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetLightpathView', 'query', variables);
    },
    Members(variables?: MembersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MembersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MembersQuery>({ document: MembersDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Members', 'query', variables);
    },
    DetailMesh(variables: DetailMeshQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DetailMeshQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DetailMeshQuery>({ document: DetailMeshDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DetailMesh', 'query', variables);
    },
    ListMeshes(variables?: ListMeshesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListMeshesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListMeshesQuery>({ document: ListMeshesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListMeshes', 'query', variables);
    },
    GetMultiWellPlate(variables: GetMultiWellPlateQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetMultiWellPlateQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMultiWellPlateQuery>({ document: GetMultiWellPlateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetMultiWellPlate', 'query', variables);
    },
    GetMultiWellPlates(variables?: GetMultiWellPlatesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetMultiWellPlatesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMultiWellPlatesQuery>({ document: GetMultiWellPlatesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetMultiWellPlates', 'query', variables);
    },
    MultiWellPlateOptions(variables?: MultiWellPlateOptionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MultiWellPlateOptionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MultiWellPlateOptionsQuery>({ document: MultiWellPlateOptionsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'MultiWellPlateOptions', 'query', variables);
    },
    GetObjective(variables: GetObjectiveQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetObjectiveQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetObjectiveQuery>({ document: GetObjectiveDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetObjective', 'query', variables);
    },
    GetPermissions(variables: GetPermissionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetPermissionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPermissionsQuery>({ document: GetPermissionsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetPermissions', 'query', variables);
    },
    PermissionOptions(variables: PermissionOptionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PermissionOptionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PermissionOptionsQuery>({ document: PermissionOptionsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PermissionOptions', 'query', variables);
    },
    GetMaskedPixelInfo(variables: GetMaskedPixelInfoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetMaskedPixelInfoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMaskedPixelInfoQuery>({ document: GetMaskedPixelInfoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetMaskedPixelInfo', 'query', variables);
    },
    GetRGBContext(variables: GetRgbContextQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetRgbContextQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRgbContextQuery>({ document: GetRgbContextDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetRGBContext', 'query', variables);
    },
    GetRGBContexts(variables?: GetRgbContextsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetRgbContextsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRgbContextsQuery>({ document: GetRgbContextsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetRGBContexts', 'query', variables);
    },
    RGBContextOptions(variables?: RgbContextOptionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RgbContextOptionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RgbContextOptionsQuery>({ document: RgbContextOptionsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RGBContextOptions', 'query', variables);
    },
    GetROI(variables: GetRoiQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetRoiQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRoiQuery>({ document: GetRoiDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetROI', 'query', variables);
    },
    GetROIs(variables?: GetRoIsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetRoIsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRoIsQuery>({ document: GetRoIsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetROIs', 'query', variables);
    },
    Rows(variables: RowsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RowsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RowsQuery>({ document: RowsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Rows', 'query', variables);
    },
    GetSnapshot(variables: GetSnapshotQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetSnapshotQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSnapshotQuery>({ document: GetSnapshotDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetSnapshot', 'query', variables);
    },
    GetStage(variables: GetStageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetStageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetStageQuery>({ document: GetStageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetStage', 'query', variables);
    },
    GetStages(variables?: GetStagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetStagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetStagesQuery>({ document: GetStagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetStages', 'query', variables);
    },
    StageOptions(variables?: StageOptionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<StageOptionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<StageOptionsQuery>({ document: StageOptionsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'StageOptions', 'query', variables);
    },
    GetTable(variables: GetTableQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetTableQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTableQuery>({ document: GetTableDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetTable', 'query', variables);
    },
    GetTables(variables?: GetTablesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetTablesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTablesQuery>({ document: GetTablesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetTables', 'query', variables);
    },
    GetRGBView(variables: GetRgbViewQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetRgbViewQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRgbViewQuery>({ document: GetRgbViewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetRGBView', 'query', variables);
    },
    SearchRGBViews(variables?: SearchRgbViewsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SearchRgbViewsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchRgbViewsQuery>({ document: SearchRgbViewsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SearchRGBViews', 'query', variables);
    },
    ActiveImageViews(variables: ActiveImageViewsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ActiveImageViewsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActiveImageViewsQuery>({ document: ActiveImageViewsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ActiveImageViews', 'query', variables);
    },
    WatchImages(variables?: WatchImagesSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WatchImagesSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<WatchImagesSubscription>({ document: WatchImagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'WatchImages', 'subscription', variables);
    },
    WatchRois(variables: WatchRoisSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WatchRoisSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<WatchRoisSubscription>({ document: WatchRoisDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'WatchRois', 'subscription', variables);
    },
    WatchTransformationViews(variables: WatchTransformationViewsSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WatchTransformationViewsSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<WatchTransformationViewsSubscription>({ document: WatchTransformationViewsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'WatchTransformationViews', 'subscription', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;