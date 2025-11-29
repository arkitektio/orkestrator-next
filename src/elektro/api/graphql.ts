import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@/lib/elektro/funcs';
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
  Any: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  FileLike: { input: any; output: any; }
  FiveDVector: { input: any; output: any; }
  Milliseconds: { input: any; output: any; }
  TraceLike: { input: any; output: any; }
  TwoDVector: { input: any; output: any; }
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

export type AnalogSignal = Signal & {
  __typename?: 'AnalogSignal';
  channels: Array<AnalogSignalChannel>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  samplingRate: Scalars['Float']['output'];
  segment: BlockSegment;
  timeTrace: Trace;
  unit?: Maybe<Scalars['String']['output']>;
};


export type AnalogSignalChannelsArgs = {
  filters?: InputMaybe<AnalogSignalChannelFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type AnalogSignalChannel = {
  __typename?: 'AnalogSignalChannel';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  index: Scalars['Int']['output'];
  label?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  signal: AnalogSignal;
  trace: Trace;
  unit?: Maybe<Scalars['String']['output']>;
};

export type AnalogSignalChannelFilter = {
  AND?: InputMaybe<AnalogSignalChannelFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<AnalogSignalChannelFilter>;
  OR?: InputMaybe<AnalogSignalChannelFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
  session?: InputMaybe<Scalars['ID']['input']>;
};

export type AnalogSignalChannelInput = {
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  index: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  trace: Scalars['TraceLike']['input'];
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type AnalogSignalFilter = {
  AND?: InputMaybe<AnalogSignalFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<AnalogSignalFilter>;
  OR?: InputMaybe<AnalogSignalFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
  session?: InputMaybe<Scalars['ID']['input']>;
};

export type AnalogSignalInput = {
  channels: Array<AnalogSignalChannelInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  samplingRate: Scalars['Float']['input'];
  tStart: Scalars['Float']['input'];
  timeTrace: Scalars['TraceLike']['input'];
  unit?: InputMaybe<Scalars['String']['input']>;
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

export type Biophysics = {
  __typename?: 'Biophysics';
  compartments: Array<Compartment>;
};

export type BiophysicsInput = {
  compartments?: Array<CompartmentInput>;
};

export type Block = {
  __typename?: 'Block';
  acquiredAt?: Maybe<Scalars['DateTime']['output']>;
  /** Who created this recording session */
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  /** The groups in this recording session */
  groups: Array<BlockGroup>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  provenanceEntries: Array<ProvenanceEntry>;
  /** The segments in this recording session */
  segments: Array<BlockSegment>;
  trace: Trace;
};


export type BlockGroupsArgs = {
  filters?: InputMaybe<BlockGroupFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type BlockProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type BlockSegmentsArgs = {
  filters?: InputMaybe<BlockSegmentFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Numeric/aggregatable fields of Block */
export enum BlockField {
  CreatedAt = 'CREATED_AT'
}

export type BlockFilter = {
  AND?: InputMaybe<BlockFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<BlockFilter>;
  OR?: InputMaybe<BlockFilter>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  groups?: InputMaybe<Array<Scalars['ID']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
  trace?: InputMaybe<Scalars['ID']['input']>;
};

export type BlockGroup = {
  __typename?: 'BlockGroup';
  /** The analog signals in this group */
  analogSignals: Array<AnalogSignal>;
  block: Block;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** The irregularly sampled signals in this group */
  irregularlySampledSignals: Array<IrregularlySampledSignal>;
  name: Scalars['String']['output'];
  /** The spike trains in this group */
  spikeTrains: Array<SpikeTrain>;
};


export type BlockGroupAnalogSignalsArgs = {
  filters?: InputMaybe<AnalogSignalFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type BlockGroupIrregularlySampledSignalsArgs = {
  filters?: InputMaybe<IrregularlySampledSignalFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type BlockGroupSpikeTrainsArgs = {
  filters?: InputMaybe<SpikeTrainFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type BlockGroupFilter = {
  AND?: InputMaybe<BlockGroupFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<BlockGroupFilter>;
  OR?: InputMaybe<BlockGroupFilter>;
  description?: InputMaybe<StrFilterLookup>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type BlockOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type BlockSegment = {
  __typename?: 'BlockSegment';
  /** The analog signals in this group */
  analogSignals: Array<AnalogSignal>;
  block: Block;
  /** Who created this segment */
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  endTime: Scalars['Float']['output'];
  /** The groups that this segment belongs to */
  groups: Array<BlockGroup>;
  id: Scalars['ID']['output'];
  /** The irregularly sampled signals in this group */
  irregularlySampledSignals: Array<IrregularlySampledSignal>;
  label: Scalars['String']['output'];
  provenanceEntries: Array<ProvenanceEntry>;
  /** The spike trains in this group */
  spikeTrains: Array<SpikeTrain>;
  startTime: Scalars['Float']['output'];
};


export type BlockSegmentAnalogSignalsArgs = {
  filters?: InputMaybe<AnalogSignalFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type BlockSegmentGroupsArgs = {
  filters?: InputMaybe<BlockGroupFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type BlockSegmentIrregularlySampledSignalsArgs = {
  filters?: InputMaybe<IrregularlySampledSignalFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type BlockSegmentProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type BlockSegmentSpikeTrainsArgs = {
  filters?: InputMaybe<SpikeTrainFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type BlockSegmentFilter = {
  AND?: InputMaybe<BlockSegmentFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<BlockSegmentFilter>;
  OR?: InputMaybe<BlockSegmentFilter>;
  description?: InputMaybe<StrFilterLookup>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type BlockSegmentInput = {
  analogSignals?: Array<AnalogSignalInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  irregularlySampledSignals?: Array<IrregularlySampledSignalInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  spikeTrains?: Array<SpikeTrainInput>;
};

export type BlockStats = {
  __typename?: 'BlockStats';
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


export type BlockStatsAvgArgs = {
  field: BlockField;
};


export type BlockStatsDistinctCountArgs = {
  field: BlockField;
};


export type BlockStatsMaxArgs = {
  field: BlockField;
};


export type BlockStatsMinArgs = {
  field: BlockField;
};


export type BlockStatsSeriesArgs = {
  by: Granularity;
  field: BlockField;
  timestampField: BlockTimestampField;
};


export type BlockStatsSumArgs = {
  field: BlockField;
};

/** Datetime fields of Block for bucketing */
export enum BlockTimestampField {
  CreatedAt = 'CREATED_AT'
}

export type Cell = {
  __typename?: 'Cell';
  biophysics: Biophysics;
  id: Scalars['String']['output'];
  topology: Topology;
};

export type CellInput = {
  biophysics: BiophysicsInput;
  id: Scalars['String']['input'];
  topology: TopologyInput;
};

export type Change = {
  __typename?: 'Change';
  path: Array<Scalars['String']['output']>;
  type: ChangeType;
  valueA?: Maybe<Scalars['Any']['output']>;
  valueB?: Maybe<Scalars['Any']['output']>;
};

export type ChangeDatasetInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export enum ChangeType {
  Added = 'ADDED',
  Changed = 'CHANGED',
  Removed = 'REMOVED'
}

export type Client = {
  __typename?: 'Client';
  clientId: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Comparison = {
  __typename?: 'Comparison';
  changes: Array<Change>;
  collection: ModelCollection;
};

export type Compartment = {
  __typename?: 'Compartment';
  globalParams: Array<GlobalParamMap>;
  id: Scalars['String']['output'];
  mechanisms: Array<Scalars['String']['output']>;
  sectionParams: Array<SectionParamMap>;
};

export type CompartmentInput = {
  globalParams?: InputMaybe<Array<GlobalParamMapInput>>;
  id: Scalars['String']['input'];
  mechanisms?: Array<Scalars['String']['input']>;
  sectionParams?: InputMaybe<Array<SectionParamMapInput>>;
};

export type Connection = {
  __typename?: 'Connection';
  location: Scalars['Float']['output'];
  parent: Scalars['String']['output'];
};

export type ConnectionInput = {
  location?: Scalars['Float']['input'];
  parent: Scalars['String']['input'];
};

export enum ConnectionKind {
  Synapse = 'SYNAPSE'
}

export type Coord = {
  __typename?: 'Coord';
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
  z: Scalars['Float']['output'];
};

export type CoordInput = {
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
  z: Scalars['Float']['input'];
};

export type CreateBlockInput = {
  file?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  recordingTime?: InputMaybe<Scalars['DateTime']['input']>;
  segments?: Array<BlockSegmentInput>;
};

export type CreateDatasetInput = {
  name: Scalars['String']['input'];
};

export type CreateExperimentInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  recordingViews: Array<RecordingViewInput>;
  stimulusViews: Array<StimulusViewInput>;
  timeTrace?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateModelCollectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  models: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type CreateNeuronModelInput = {
  config: ModelConfigInput;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parent?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateSimulationInput = {
  dt?: InputMaybe<Scalars['Milliseconds']['input']>;
  duration: Scalars['Milliseconds']['input'];
  model: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  recordings: Array<RecordingInput>;
  stimuli: Array<StimulusInput>;
  timeTrace?: InputMaybe<Scalars['TraceLike']['input']>;
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
  images: Array<Trace>;
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  provenanceEntries: Array<ProvenanceEntry>;
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


export type DatasetImagesArgs = {
  filters?: InputMaybe<TraceFilter>;
  order?: InputMaybe<TraceOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type DatasetProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type DatasetFilter = {
  AND?: InputMaybe<DatasetFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<DatasetFilter>;
  OR?: InputMaybe<DatasetFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<StrFilterLookup>;
};

export type DeleteBlockInput = {
  id: Scalars['ID']['input'];
};

export type DeleteDatasetInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFileInput = {
  id: Scalars['ID']['input'];
};

export type DeleteRoiInput = {
  id: Scalars['ID']['input'];
};

export type DeleteTraceInput = {
  id: Scalars['ID']['input'];
};

export type DesociateInput = {
  other: Scalars['ID']['input'];
  selfs: Array<Scalars['ID']['input']>;
};

export type Exp2Synapse = NetSynapse & {
  __typename?: 'Exp2Synapse';
  cell: Scalars['String']['output'];
  delay: Scalars['Float']['output'];
  e: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  position: Scalars['Float']['output'];
  tau1: Scalars['Float']['output'];
  tau2: Scalars['Float']['output'];
};

export type Experiment = {
  __typename?: 'Experiment';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recordingViews: Array<ExperimentRecordingView>;
  stimulusViews: Array<ExperimentStimulusView>;
  timeTrace: Trace;
};


export type ExperimentRecordingViewsArgs = {
  filters?: InputMaybe<ExperimentFilter>;
  order?: InputMaybe<ExperimentOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ExperimentStimulusViewsArgs = {
  filters?: InputMaybe<ExperimentFilter>;
  order?: InputMaybe<ExperimentOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ExperimentFilter = {
  AND?: InputMaybe<ExperimentFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ExperimentFilter>;
  OR?: InputMaybe<ExperimentFilter>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ExperimentOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type ExperimentRecordingView = {
  __typename?: 'ExperimentRecordingView';
  duration?: Maybe<Scalars['Float']['output']>;
  experiment: Experiment;
  id: Scalars['ID']['output'];
  label?: Maybe<Scalars['String']['output']>;
  offset?: Maybe<Scalars['Float']['output']>;
  recording: Recording;
};

export type ExperimentStimulusView = {
  __typename?: 'ExperimentStimulusView';
  duration?: Maybe<Scalars['Float']['output']>;
  experiment: Experiment;
  id: Scalars['ID']['output'];
  label?: Maybe<Scalars['String']['output']>;
  offset?: Maybe<Scalars['Float']['output']>;
  stimulus: Stimulus;
};

export type File = {
  __typename?: 'File';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  origins: Array<Trace>;
  store: BigFileStore;
};


export type FileOriginsArgs = {
  filters?: InputMaybe<TraceFilter>;
  order?: InputMaybe<TraceOrder>;
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
  search?: InputMaybe<Scalars['String']['input']>;
};

export type FromFileLike = {
  dataset?: InputMaybe<Scalars['ID']['input']>;
  file: Scalars['FileLike']['input'];
  name: Scalars['String']['input'];
  origins?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Input type for creating an image from an array-like object */
export type FromTraceLikeInput = {
  /** The array-like object to create the image from */
  array: Scalars['TraceLike']['input'];
  /** Optional dataset ID to associate the image with */
  dataset?: InputMaybe<Scalars['ID']['input']>;
  /** The name of the image */
  name: Scalars['String']['input'];
  /** Optional list of tags to associate with the image */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type GlobalParamMap = {
  __typename?: 'GlobalParamMap';
  description?: Maybe<Scalars['String']['output']>;
  param: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type GlobalParamMapInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  param: Scalars['String']['input'];
  value: Scalars['Float']['input'];
};

export enum Granularity {
  Day = 'DAY',
  Hour = 'HOUR',
  Month = 'MONTH',
  Quarter = 'QUARTER',
  Week = 'WEEK',
  Year = 'YEAR'
}

/** The type of change that was made. */
export enum HistoryKind {
  Create = 'CREATE',
  Delete = 'DELETE',
  Update = 'UPDATE'
}

export type IrregularlySampledSignal = Signal & {
  __typename?: 'IrregularlySampledSignal';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  segment: BlockSegment;
  trace: Trace;
  unit?: Maybe<Scalars['String']['output']>;
};

export type IrregularlySampledSignalFilter = {
  AND?: InputMaybe<IrregularlySampledSignalFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<IrregularlySampledSignalFilter>;
  OR?: InputMaybe<IrregularlySampledSignalFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
  session?: InputMaybe<Scalars['ID']['input']>;
};

export type IrregularlySampledSignalInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  times: Scalars['TraceLike']['input'];
  trace: Scalars['TraceLike']['input'];
  unit?: InputMaybe<Scalars['String']['input']>;
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

export type ModelCollection = {
  __typename?: 'ModelCollection';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  models: Array<NeuronModel>;
  name: Scalars['String']['output'];
};


export type ModelCollectionModelsArgs = {
  filters?: InputMaybe<NeuronModelFilter>;
  order?: InputMaybe<NeuronModelOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ModelCollectionFilter = {
  AND?: InputMaybe<ModelCollectionFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ModelCollectionFilter>;
  OR?: InputMaybe<ModelCollectionFilter>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ModelConfig = {
  __typename?: 'ModelConfig';
  cells: Array<Cell>;
  celsius: Scalars['Float']['output'];
  label?: Maybe<Scalars['String']['output']>;
  netConnections?: Maybe<Array<NetConnection>>;
  netStimulators?: Maybe<Array<NetStimulator>>;
  netSynapses?: Maybe<Array<NetSynapse>>;
  vInit: Scalars['Float']['output'];
};

export type ModelConfigInput = {
  cells?: Array<CellInput>;
  celsius?: Scalars['Float']['input'];
  environments?: Array<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  netConnections?: InputMaybe<Array<NetConnectionInput>>;
  netStimulators?: InputMaybe<Array<NetStimulatorInput>>;
  netSynapses?: InputMaybe<Array<NetSynapseInput>>;
  vInit?: Scalars['Float']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new block */
  createBlock: Block;
  /** Create a new dataset to organize data */
  createDataset: Dataset;
  /** Create a new experiment */
  createExperiment: Experiment;
  /** Create a new model collection */
  createModelCollection: ModelCollection;
  /** Create a new neuron model */
  createNeuronModel: NeuronModel;
  /** Create a new region of interest */
  createRoi: Roi;
  /** Create a new simulsation */
  createSimulation: Simulation;
  /** Delete an existing block */
  deleteBlock: Scalars['ID']['output'];
  /** Delete an existing dataset */
  deleteDataset: Scalars['ID']['output'];
  /** Delete an existing file */
  deleteFile: Scalars['ID']['output'];
  /** Delete an existing image */
  deleteImage: Scalars['ID']['output'];
  /** Delete an existing region of interest */
  deleteRoi: Scalars['ID']['output'];
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


export type MutationCreateBlockArgs = {
  input: CreateBlockInput;
};


export type MutationCreateDatasetArgs = {
  input: CreateDatasetInput;
};


export type MutationCreateExperimentArgs = {
  input: CreateExperimentInput;
};


export type MutationCreateModelCollectionArgs = {
  input: CreateModelCollectionInput;
};


export type MutationCreateNeuronModelArgs = {
  input: CreateNeuronModelInput;
};


export type MutationCreateRoiArgs = {
  input: RoiInput;
};


export type MutationCreateSimulationArgs = {
  input: CreateSimulationInput;
};


export type MutationDeleteBlockArgs = {
  input: DeleteBlockInput;
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

export type NetConnection = {
  delay?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  threshold?: Maybe<Scalars['Float']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type NetConnectionInput = {
  delay?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  kind?: ConnectionKind;
  netStimulator: Scalars['ID']['input'];
  synapse: Scalars['ID']['input'];
  threshold?: InputMaybe<Scalars['Float']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type NetStimulator = {
  __typename?: 'NetStimulator';
  id: Scalars['ID']['output'];
  interval?: Maybe<Scalars['Float']['output']>;
  number: Scalars['Int']['output'];
  start: Scalars['Float']['output'];
};

export type NetStimulatorInput = {
  id: Scalars['ID']['input'];
  interval?: InputMaybe<Scalars['Float']['input']>;
  number?: Scalars['Int']['input'];
  start?: Scalars['Float']['input'];
};

export type NetSynapse = {
  cell: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  position: Scalars['Float']['output'];
};

export type NetSynapseInput = {
  cell: Scalars['ID']['input'];
  e: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
  kind?: SynapseKind;
  location: Scalars['ID']['input'];
  position?: Scalars['Float']['input'];
  tau1: Scalars['Float']['input'];
  tau2: Scalars['Float']['input'];
};

export type NeuronModel = {
  __typename?: 'NeuronModel';
  changes: Array<Change>;
  comparisons: Array<Comparison>;
  config: ModelConfig;
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  modelCollections?: Maybe<Array<ModelCollection>>;
  name: Scalars['String']['output'];
  simulations: Array<Simulation>;
};


export type NeuronModelChangesArgs = {
  to?: InputMaybe<Scalars['ID']['input']>;
};


export type NeuronModelModelCollectionsArgs = {
  filters?: InputMaybe<ModelCollectionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type NeuronModelSimulationsArgs = {
  filters?: InputMaybe<SimulationFilter>;
  order?: InputMaybe<SimulationOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type NeuronModelFilter = {
  AND?: InputMaybe<NeuronModelFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<NeuronModelFilter>;
  OR?: InputMaybe<NeuronModelFilter>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type NeuronModelOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type OffsetPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: Scalars['Int']['input'];
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

export type PinDatasetInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinImageInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinRoiInput = {
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

export type Query = {
  __typename?: 'Query';
  /** Returns a list of images */
  analogSignal: AnalogSignal;
  /** Returns a list of images */
  analogSignalChannel: AnalogSignalChannel;
  analogSignalChannels: Array<AnalogSignalChannel>;
  analogSignals: Array<AnalogSignal>;
  block: Block;
  blockStats: BlockStats;
  blocks: Array<Block>;
  /** Returns a list of cells in a model */
  cells: Array<Cell>;
  dataset: Dataset;
  datasets: Array<Dataset>;
  experiment: Experiment;
  experiments: Array<Experiment>;
  file: File;
  files: Array<File>;
  modelCollection: ModelCollection;
  modelCollections: Array<ModelCollection>;
  mydatasets: Array<Dataset>;
  myfiles: Array<File>;
  /** Returns a single image by ID */
  neuronModel: NeuronModel;
  neuronModels: Array<NeuronModel>;
  randomTrace: Trace;
  /** Returns a list of images */
  recording: Recording;
  recordings: Array<Recording>;
  roi: Roi;
  rois: Array<Roi>;
  /** Returns a list of images */
  sections: Array<Section>;
  simulation: Simulation;
  simulations: Array<Simulation>;
  stimuli: Array<Stimulus>;
  /** Returns a list of images */
  stimulus: Stimulus;
  /** Returns a single image by ID */
  trace: Trace;
  traces: Array<Trace>;
};


export type QueryAnalogSignalArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAnalogSignalChannelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAnalogSignalChannelsArgs = {
  filters?: InputMaybe<AnalogSignalChannelFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryAnalogSignalsArgs = {
  filters?: InputMaybe<AnalogSignalFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryBlockArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBlockStatsArgs = {
  filters?: InputMaybe<BlockFilter>;
};


export type QueryBlocksArgs = {
  filters?: InputMaybe<BlockFilter>;
  order?: InputMaybe<BlockOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryCellsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  modelId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDatasetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDatasetsArgs = {
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryExperimentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExperimentsArgs = {
  filters?: InputMaybe<ExperimentFilter>;
  order?: InputMaybe<ExperimentOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryFileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFilesArgs = {
  filters?: InputMaybe<FileFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryModelCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryModelCollectionsArgs = {
  filters?: InputMaybe<ModelCollectionFilter>;
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


export type QueryNeuronModelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNeuronModelsArgs = {
  filters?: InputMaybe<NeuronModelFilter>;
  order?: InputMaybe<NeuronModelOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRecordingArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecordingsArgs = {
  filters?: InputMaybe<RecordingFilter>;
  order?: InputMaybe<RecordingOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRoiArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoisArgs = {
  filters?: InputMaybe<RoiFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QuerySectionsArgs = {
  cellId: Scalars['ID']['input'];
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  modelId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySimulationArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySimulationsArgs = {
  filters?: InputMaybe<SimulationFilter>;
  order?: InputMaybe<SimulationOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStimuliArgs = {
  filters?: InputMaybe<StimulusFilter>;
  order?: InputMaybe<StimulusOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStimulusArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTraceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTracesArgs = {
  filters?: InputMaybe<TraceFilter>;
  order?: InputMaybe<TraceOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type Roi = {
  __typename?: 'ROI';
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  id: Scalars['ID']['output'];
  kind: RoiKind;
  label?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  provenanceEntries: Array<ProvenanceEntry>;
  trace: Trace;
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
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind?: InputMaybe<RoiKindChoices>;
  search?: InputMaybe<Scalars['String']['input']>;
  trace?: InputMaybe<Scalars['ID']['input']>;
};

export type Recording = {
  __typename?: 'Recording';
  cell: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  kind: RecordingKind;
  label: Scalars['String']['output'];
  location: Scalars['String']['output'];
  position: Scalars['Float']['output'];
  simulation: Simulation;
  trace: Trace;
};

export type RecordingFilter = {
  AND?: InputMaybe<RecordingFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<RecordingFilter>;
  OR?: InputMaybe<RecordingFilter>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type RecordingInput = {
  cell?: InputMaybe<Scalars['ID']['input']>;
  kind: RecordingKind;
  location?: InputMaybe<Scalars['ID']['input']>;
  position?: InputMaybe<Scalars['Float']['input']>;
  trace: Scalars['TraceLike']['input'];
};

export enum RecordingKind {
  Current = 'CURRENT',
  Ina = 'INA',
  Time = 'TIME',
  Unknown = 'UNKNOWN',
  Voltage = 'VOLTAGE'
}

export type RecordingOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type RecordingViewInput = {
  duration?: InputMaybe<Scalars['Float']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  recording: Scalars['ID']['input'];
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
  hash?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
};

export type RequestMediaUploadInput = {
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
  /** The type/kind of ROI */
  kind: RoiKind;
  /** The label of the ROI */
  label?: InputMaybe<Scalars['String']['input']>;
  /** The image this ROI belongs to */
  trace: Scalars['ID']['input'];
  /** The vector coordinates defining the as XY */
  vectors: Array<Scalars['TwoDVector']['input']>;
};

export enum RoiKind {
  Line = 'LINE',
  Point = 'POINT',
  Slice = 'SLICE',
  Spike = 'SPIKE'
}

export enum RoiKindChoices {
  Line = 'LINE',
  Point = 'POINT',
  Slice = 'SLICE',
  Spike = 'SPIKE'
}

export type Section = {
  __typename?: 'Section';
  category: Scalars['String']['output'];
  connections: Array<Connection>;
  coords?: Maybe<Array<Coord>>;
  diam: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  /** Length of the section. Required if coords is not provided. */
  length?: Maybe<Scalars['Float']['output']>;
  nseg: Scalars['Int']['output'];
};

export type SectionInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  connections?: InputMaybe<Array<ConnectionInput>>;
  coords?: InputMaybe<Array<CoordInput>>;
  diam?: Scalars['Float']['input'];
  id: Scalars['String']['input'];
  /** Length of the section. Required if coords is not provided. */
  length?: InputMaybe<Scalars['Float']['input']>;
  nseg?: Scalars['Int']['input'];
};

export type SectionParamMap = {
  __typename?: 'SectionParamMap';
  /** Description of the parameter */
  description?: Maybe<Scalars['String']['output']>;
  /** The governing mechanism */
  mechanism: Scalars['String']['output'];
  param: Scalars['String']['output'];
  /** The value of the parameter */
  value: Scalars['Float']['output'];
};

export type SectionParamMapInput = {
  /** Description of the parameter */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The governing mechanism */
  mechanism: Scalars['String']['input'];
  param: Scalars['String']['input'];
  /** The value of the parameter */
  value: Scalars['Float']['input'];
};

/** A signal recorded during a recording session */
export type Signal = {
  name: Scalars['String']['output'];
  segment: BlockSegment;
};

export type Simulation = {
  __typename?: 'Simulation';
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  dt: Scalars['Float']['output'];
  duration: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  kind: StimulusKind;
  model: NeuronModel;
  name: Scalars['String']['output'];
  recordingViews: Array<ExperimentRecordingView>;
  recordings: Array<Recording>;
  stimuli: Array<Stimulus>;
  stimulusViews: Array<ExperimentStimulusView>;
  timeTrace: Trace;
};


export type SimulationRecordingViewsArgs = {
  filters?: InputMaybe<ExperimentFilter>;
  order?: InputMaybe<ExperimentOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type SimulationRecordingsArgs = {
  filters?: InputMaybe<RecordingFilter>;
  order?: InputMaybe<RecordingOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type SimulationStimuliArgs = {
  filters?: InputMaybe<StimulusFilter>;
  order?: InputMaybe<StimulusOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type SimulationStimulusViewsArgs = {
  filters?: InputMaybe<ExperimentFilter>;
  order?: InputMaybe<ExperimentOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type SimulationFilter = {
  AND?: InputMaybe<SimulationFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<SimulationFilter>;
  OR?: InputMaybe<SimulationFilter>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SimulationOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type SpikeTrain = Signal & {
  __typename?: 'SpikeTrain';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  segment: BlockSegment;
  trace: Trace;
};

export type SpikeTrainFilter = {
  AND?: InputMaybe<SpikeTrainFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<SpikeTrainFilter>;
  OR?: InputMaybe<SpikeTrainFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
  session?: InputMaybe<Scalars['ID']['input']>;
};

export type SpikeTrainInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  leftSweep?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  tStart: Scalars['Float']['input'];
  tStop: Scalars['Float']['input'];
  times: Scalars['TraceLike']['input'];
  waveforms?: InputMaybe<Scalars['TraceLike']['input']>;
};

export type Stimulus = {
  __typename?: 'Stimulus';
  cell: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  kind: StimulusKind;
  label: Scalars['String']['output'];
  location: Scalars['String']['output'];
  position: Scalars['Float']['output'];
  simulation: Simulation;
  trace: Trace;
};

export type StimulusFilter = {
  AND?: InputMaybe<StimulusFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<StimulusFilter>;
  OR?: InputMaybe<StimulusFilter>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type StimulusInput = {
  cell?: InputMaybe<Scalars['ID']['input']>;
  kind: StimulusKind;
  location?: InputMaybe<Scalars['ID']['input']>;
  position?: InputMaybe<Scalars['Float']['input']>;
  trace: Scalars['TraceLike']['input'];
};

export enum StimulusKind {
  Current = 'CURRENT',
  Unknown = 'UNKNOWN',
  Voltage = 'VOLTAGE'
}

export type StimulusOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type StimulusViewInput = {
  duration?: InputMaybe<Scalars['Float']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  stimulus: Scalars['ID']['input'];
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
  /** Subscribe to real-time file updates */
  files: FileEvent;
  /** Subscribe to real-time ROI updates */
  rois: RoiEvent;
  /** Subscribe to real-time image updates */
  traces: TraceEvent;
};


export type SubscriptionFilesArgs = {
  dataset?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionRoisArgs = {
  trace: Scalars['ID']['input'];
};


export type SubscriptionTracesArgs = {
  dataset?: InputMaybe<Scalars['ID']['input']>;
};

export enum SynapseKind {
  Exp2Syn = 'EXP2SYN',
  Gabaa = 'GABAA'
}

export type SynapticConnection = NetConnection & {
  __typename?: 'SynapticConnection';
  delay?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  netStimulator: Scalars['ID']['output'];
  synapse: Scalars['ID']['output'];
  threshold?: Maybe<Scalars['Float']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
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

export type Topology = {
  __typename?: 'Topology';
  sections: Array<Section>;
};

export type TopologyInput = {
  sections: Array<SectionInput>;
};

export type Trace = {
  __typename?: 'Trace';
  /** Who created this image */
  creator?: Maybe<User>;
  /** The dataset this image belongs to */
  dataset?: Maybe<Dataset>;
  events: Array<Roi>;
  id: Scalars['ID']['output'];
  /** The name of the image */
  name: Scalars['String']['output'];
  /** Is this image pinned by the current user */
  pinned: Scalars['Boolean']['output'];
  provenanceEntries: Array<ProvenanceEntry>;
  /** The rois of this image */
  rois: Array<Roi>;
  /** The store where the image data is stored. */
  store: ZarrStore;
  /** The tags of this image */
  tags: Array<Scalars['String']['output']>;
};


export type TraceEventsArgs = {
  filters?: InputMaybe<RoiFilter>;
};


export type TraceProvenanceEntriesArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type TraceRoisArgs = {
  filters?: InputMaybe<RoiFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type TraceEvent = {
  __typename?: 'TraceEvent';
  create?: Maybe<Trace>;
  delete?: Maybe<Scalars['ID']['output']>;
  update?: Maybe<Trace>;
};

export type TraceFilter = {
  AND?: InputMaybe<TraceFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<TraceFilter>;
  OR?: InputMaybe<TraceFilter>;
  dataset?: InputMaybe<DatasetFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  notDerived?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type TraceOrder = {
  createdAt?: InputMaybe<Ordering>;
};

export type UpdateRoiInput = {
  kind?: InputMaybe<RoiKind>;
  label?: InputMaybe<Scalars['String']['input']>;
  roi: Scalars['ID']['input'];
  vectors?: InputMaybe<Array<Scalars['TwoDVector']['input']>>;
};

export type UpdateTraceInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type User = {
  __typename?: 'User';
  activeOrganization?: Maybe<Organization>;
  preferredUsername: Scalars['String']['output'];
  sub: Scalars['String']['output'];
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

export type StimulusFragment = { __typename?: 'Stimulus', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } };

export type DetailStimulusFragment = { __typename?: 'Stimulus', id: string, label: string, simulation: { __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', id: string, name: string, description?: string | null, config: { __typename?: 'ModelConfig', cells: Array<{ __typename?: 'Cell', id: string, biophysics: { __typename?: 'Biophysics', compartments: Array<{ __typename?: 'Compartment', id: string, mechanisms: Array<string>, globalParams: Array<{ __typename?: 'GlobalParamMap', param: string, value: number }>, sectionParams: Array<{ __typename?: 'SectionParamMap', param: string, value: number }> }> }, topology: { __typename?: 'Topology', sections: Array<{ __typename?: 'Section', id: string, diam: number, length?: number | null, category: string, coords?: Array<{ __typename?: 'Coord', x: number, y: number, z: number }> | null, connections: Array<{ __typename?: 'Connection', parent: string, location: number }> }> } }> }, comparisons: Array<{ __typename?: 'Comparison', collection: { __typename?: 'ModelCollection', id: string, name: string }, changes: Array<{ __typename?: 'Change', type: ChangeType, path: Array<string>, valueA?: any | null, valueB?: any | null }> }>, simulations: Array<{ __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', name: string } }> }, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, recordings: Array<{ __typename?: 'Recording', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, label?: string | null, kind: RoiKind }> } }>, stimuli: Array<{ __typename?: 'Stimulus', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ListStimulusFragment = { __typename?: 'Stimulus', id: string, label: string, cell: string, simulation: { __typename?: 'Simulation', id: string } };

export type BlockGroupFragment = { __typename?: 'BlockGroup', id: string, name: string };

export type AnalogSignalChannelFragment = { __typename?: 'AnalogSignalChannel', id: string, name?: string | null, index: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } };

export type DetailAnalogSignalChannelFragment = { __typename?: 'AnalogSignalChannel', id: string, name?: string | null, index: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, signal: { __typename?: 'AnalogSignal', id: string, name: string, unit?: string | null, channels: Array<{ __typename?: 'AnalogSignalChannel', id: string, name?: string | null, index: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } };

export type AnalogSignalFragment = { __typename?: 'AnalogSignal', id: string, name: string, unit?: string | null, channels: Array<{ __typename?: 'AnalogSignalChannel', id: string, name?: string | null, index: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } };

export type ListAnalogSignalFragment = { __typename?: 'AnalogSignal', id: string, name: string, segment: { __typename?: 'BlockSegment', id: string } };

export type ListAnalogSignalChannelFragment = { __typename?: 'AnalogSignalChannel', id: string, name?: string | null, signal: { __typename?: 'AnalogSignal', id: string } };

export type BlockSegmentFragment = { __typename?: 'BlockSegment', id: string, analogSignals: Array<{ __typename?: 'AnalogSignal', id: string, name: string, unit?: string | null, channels: Array<{ __typename?: 'AnalogSignalChannel', id: string, name?: string | null, index: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> };

export type BlockFragment = { __typename?: 'Block', id: string, name: string, description?: string | null, segments: Array<{ __typename?: 'BlockSegment', id: string, analogSignals: Array<{ __typename?: 'AnalogSignal', id: string, name: string, unit?: string | null, channels: Array<{ __typename?: 'AnalogSignalChannel', id: string, name?: string | null, index: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }>, groups: Array<{ __typename?: 'BlockGroup', id: string, name: string }> };

export type ListBlockFragment = { __typename?: 'Block', id: string, name: string };

export type CredentialsFragment = { __typename?: 'Credentials', accessKey: string, status: string, secretKey: string, bucket: string, key: string, sessionToken: string, store: string };

export type AccessCredentialsFragment = { __typename?: 'AccessCredentials', accessKey: string, secretKey: string, bucket: string, key: string, sessionToken: string, path: string };

export type PresignedPostCredentialsFragment = { __typename?: 'PresignedPostCredentials', xAmzAlgorithm: string, xAmzCredential: string, xAmzDate: string, xAmzSignature: string, key: string, bucket: string, datalayer: string, policy: string, store: string };

export type ExperimentFragment = { __typename?: 'Experiment', id: string, name: string, description?: string | null, createdAt: any, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, stimulusViews: Array<{ __typename?: 'ExperimentStimulusView', id: string, label?: string | null, stimulus: { __typename?: 'Stimulus', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } }>, recordingViews: Array<{ __typename?: 'ExperimentRecordingView', id: string, label?: string | null, recording: { __typename?: 'Recording', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, label?: string | null, kind: RoiKind }> } } }> };

export type ListExperimentFragment = { __typename?: 'Experiment', id: string, name: string };

export type ModelCollectionFragment = { __typename?: 'ModelCollection', id: string, name: string, models: Array<{ __typename?: 'NeuronModel', id: string, name: string }> };

export type ListModelCollectionFragment = { __typename?: 'ModelCollection', id: string, name: string };

export type CoordFragment = { __typename?: 'Coord', x: number, y: number, z: number };

export type SectionFragment = { __typename?: 'Section', id: string, diam: number, length?: number | null, category: string, coords?: Array<{ __typename?: 'Coord', x: number, y: number, z: number }> | null, connections: Array<{ __typename?: 'Connection', parent: string, location: number }> };

export type ConnectionFragment = { __typename?: 'Connection', parent: string, location: number };

export type CompartmentFragment = { __typename?: 'Compartment', id: string, mechanisms: Array<string>, globalParams: Array<{ __typename?: 'GlobalParamMap', param: string, value: number }>, sectionParams: Array<{ __typename?: 'SectionParamMap', param: string, value: number }> };

export type DetailNeuronModelFragment = { __typename?: 'NeuronModel', id: string, name: string, description?: string | null, config: { __typename?: 'ModelConfig', cells: Array<{ __typename?: 'Cell', id: string, biophysics: { __typename?: 'Biophysics', compartments: Array<{ __typename?: 'Compartment', id: string, mechanisms: Array<string>, globalParams: Array<{ __typename?: 'GlobalParamMap', param: string, value: number }>, sectionParams: Array<{ __typename?: 'SectionParamMap', param: string, value: number }> }> }, topology: { __typename?: 'Topology', sections: Array<{ __typename?: 'Section', id: string, diam: number, length?: number | null, category: string, coords?: Array<{ __typename?: 'Coord', x: number, y: number, z: number }> | null, connections: Array<{ __typename?: 'Connection', parent: string, location: number }> }> } }> }, comparisons: Array<{ __typename?: 'Comparison', collection: { __typename?: 'ModelCollection', id: string, name: string }, changes: Array<{ __typename?: 'Change', type: ChangeType, path: Array<string>, valueA?: any | null, valueB?: any | null }> }>, simulations: Array<{ __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', name: string } }> };

export type ListNeuronModelFragment = { __typename?: 'NeuronModel', id: string, name: string };

export type RecordingFragment = { __typename?: 'Recording', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, label?: string | null, kind: RoiKind }> } };

export type DetailRecordingFragment = { __typename?: 'Recording', id: string, label: string, simulation: { __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', id: string, name: string, description?: string | null, config: { __typename?: 'ModelConfig', cells: Array<{ __typename?: 'Cell', id: string, biophysics: { __typename?: 'Biophysics', compartments: Array<{ __typename?: 'Compartment', id: string, mechanisms: Array<string>, globalParams: Array<{ __typename?: 'GlobalParamMap', param: string, value: number }>, sectionParams: Array<{ __typename?: 'SectionParamMap', param: string, value: number }> }> }, topology: { __typename?: 'Topology', sections: Array<{ __typename?: 'Section', id: string, diam: number, length?: number | null, category: string, coords?: Array<{ __typename?: 'Coord', x: number, y: number, z: number }> | null, connections: Array<{ __typename?: 'Connection', parent: string, location: number }> }> } }> }, comparisons: Array<{ __typename?: 'Comparison', collection: { __typename?: 'ModelCollection', id: string, name: string }, changes: Array<{ __typename?: 'Change', type: ChangeType, path: Array<string>, valueA?: any | null, valueB?: any | null }> }>, simulations: Array<{ __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', name: string } }> }, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, recordings: Array<{ __typename?: 'Recording', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, label?: string | null, kind: RoiKind }> } }>, stimuli: Array<{ __typename?: 'Stimulus', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ListRecordingFragment = { __typename?: 'Recording', id: string, label: string, cell: string, simulation: { __typename?: 'Simulation', id: string } };

export type DetailSimulationFragment = { __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', id: string, name: string, description?: string | null, config: { __typename?: 'ModelConfig', cells: Array<{ __typename?: 'Cell', id: string, biophysics: { __typename?: 'Biophysics', compartments: Array<{ __typename?: 'Compartment', id: string, mechanisms: Array<string>, globalParams: Array<{ __typename?: 'GlobalParamMap', param: string, value: number }>, sectionParams: Array<{ __typename?: 'SectionParamMap', param: string, value: number }> }> }, topology: { __typename?: 'Topology', sections: Array<{ __typename?: 'Section', id: string, diam: number, length?: number | null, category: string, coords?: Array<{ __typename?: 'Coord', x: number, y: number, z: number }> | null, connections: Array<{ __typename?: 'Connection', parent: string, location: number }> }> } }> }, comparisons: Array<{ __typename?: 'Comparison', collection: { __typename?: 'ModelCollection', id: string, name: string }, changes: Array<{ __typename?: 'Change', type: ChangeType, path: Array<string>, valueA?: any | null, valueB?: any | null }> }>, simulations: Array<{ __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', name: string } }> }, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, recordings: Array<{ __typename?: 'Recording', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, label?: string | null, kind: RoiKind }> } }>, stimuli: Array<{ __typename?: 'Stimulus', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, creator?: { __typename?: 'User', sub: string } | null };

export type ListSimulationFragment = { __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', name: string } };

export type ZarrStoreFragment = { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null };

export type DetailTraceFragment = { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } };

export type ListTraceFragment = { __typename?: 'Trace', id: string, name: string };

export type DeleteBlockMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteBlockMutation = { __typename?: 'Mutation', deleteBlock: string };

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

export type DetailBlockQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailBlockQuery = { __typename?: 'Query', block: { __typename?: 'Block', id: string, name: string, description?: string | null, segments: Array<{ __typename?: 'BlockSegment', id: string, analogSignals: Array<{ __typename?: 'AnalogSignal', id: string, name: string, unit?: string | null, channels: Array<{ __typename?: 'AnalogSignalChannel', id: string, name?: string | null, index: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }> }>, groups: Array<{ __typename?: 'BlockGroup', id: string, name: string }> } };

export type ListBlocksQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<BlockFilter>;
  order?: InputMaybe<BlockOrder>;
}>;


export type ListBlocksQuery = { __typename?: 'Query', blocks: Array<{ __typename?: 'Block', id: string, name: string }> };

export type DetailExperimentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailExperimentQuery = { __typename?: 'Query', experiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null, createdAt: any, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, stimulusViews: Array<{ __typename?: 'ExperimentStimulusView', id: string, label?: string | null, stimulus: { __typename?: 'Stimulus', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } }>, recordingViews: Array<{ __typename?: 'ExperimentRecordingView', id: string, label?: string | null, recording: { __typename?: 'Recording', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, label?: string | null, kind: RoiKind }> } } }> } };

export type ListExperimentsQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<ExperimentFilter>;
  order?: InputMaybe<ExperimentOrder>;
}>;


export type ListExperimentsQuery = { __typename?: 'Query', experiments: Array<{ __typename?: 'Experiment', id: string, name: string }> };

export type HomePageQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageQuery = { __typename?: 'Query', blocks: Array<{ __typename?: 'Block', id: string, name: string }>, models: Array<{ __typename?: 'NeuronModel', id: string, name: string }> };

export type HomePageStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageStatsQuery = { __typename?: 'Query', blockStats: { __typename?: 'BlockStats', count: number } };

export type DetailModelCollectionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailModelCollectionQuery = { __typename?: 'Query', modelCollection: { __typename?: 'ModelCollection', id: string, name: string, models: Array<{ __typename?: 'NeuronModel', id: string, name: string }> } };

export type ListModelCollectionsQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<ModelCollectionFilter>;
}>;


export type ListModelCollectionsQuery = { __typename?: 'Query', modelCollections: Array<{ __typename?: 'ModelCollection', id: string, name: string }> };

export type DetailNeuronModelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailNeuronModelQuery = { __typename?: 'Query', neuronModel: { __typename?: 'NeuronModel', id: string, name: string, description?: string | null, config: { __typename?: 'ModelConfig', cells: Array<{ __typename?: 'Cell', id: string, biophysics: { __typename?: 'Biophysics', compartments: Array<{ __typename?: 'Compartment', id: string, mechanisms: Array<string>, globalParams: Array<{ __typename?: 'GlobalParamMap', param: string, value: number }>, sectionParams: Array<{ __typename?: 'SectionParamMap', param: string, value: number }> }> }, topology: { __typename?: 'Topology', sections: Array<{ __typename?: 'Section', id: string, diam: number, length?: number | null, category: string, coords?: Array<{ __typename?: 'Coord', x: number, y: number, z: number }> | null, connections: Array<{ __typename?: 'Connection', parent: string, location: number }> }> } }> }, comparisons: Array<{ __typename?: 'Comparison', collection: { __typename?: 'ModelCollection', id: string, name: string }, changes: Array<{ __typename?: 'Change', type: ChangeType, path: Array<string>, valueA?: any | null, valueB?: any | null }> }>, simulations: Array<{ __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', name: string } }> } };

export type ListNeuronModelsQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<NeuronModelFilter>;
  order?: InputMaybe<NeuronModelOrder>;
}>;


export type ListNeuronModelsQuery = { __typename?: 'Query', neuronModels: Array<{ __typename?: 'NeuronModel', id: string, name: string }> };

export type DetailRecordingQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailRecordingQuery = { __typename?: 'Query', recording: { __typename?: 'Recording', id: string, label: string, simulation: { __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', id: string, name: string, description?: string | null, config: { __typename?: 'ModelConfig', cells: Array<{ __typename?: 'Cell', id: string, biophysics: { __typename?: 'Biophysics', compartments: Array<{ __typename?: 'Compartment', id: string, mechanisms: Array<string>, globalParams: Array<{ __typename?: 'GlobalParamMap', param: string, value: number }>, sectionParams: Array<{ __typename?: 'SectionParamMap', param: string, value: number }> }> }, topology: { __typename?: 'Topology', sections: Array<{ __typename?: 'Section', id: string, diam: number, length?: number | null, category: string, coords?: Array<{ __typename?: 'Coord', x: number, y: number, z: number }> | null, connections: Array<{ __typename?: 'Connection', parent: string, location: number }> }> } }> }, comparisons: Array<{ __typename?: 'Comparison', collection: { __typename?: 'ModelCollection', id: string, name: string }, changes: Array<{ __typename?: 'Change', type: ChangeType, path: Array<string>, valueA?: any | null, valueB?: any | null }> }>, simulations: Array<{ __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', name: string } }> }, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, recordings: Array<{ __typename?: 'Recording', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, label?: string | null, kind: RoiKind }> } }>, stimuli: Array<{ __typename?: 'Stimulus', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, creator?: { __typename?: 'User', sub: string } | null } } };

export type ListRecordingsQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<RecordingFilter>;
}>;


export type ListRecordingsQuery = { __typename?: 'Query', recordings: Array<{ __typename?: 'Recording', id: string, label: string, cell: string, simulation: { __typename?: 'Simulation', id: string } }> };

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', traces: Array<{ __typename?: 'Trace', id: string, name: string }> };

export type DetailAnalogSignalQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailAnalogSignalQuery = { __typename?: 'Query', analogSignal: { __typename?: 'AnalogSignal', id: string, name: string, unit?: string | null, channels: Array<{ __typename?: 'AnalogSignalChannel', id: string, name?: string | null, index: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } };

export type ListAnalogSignalQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<AnalogSignalFilter>;
}>;


export type ListAnalogSignalQuery = { __typename?: 'Query', analogSignals: Array<{ __typename?: 'AnalogSignal', id: string, name: string, segment: { __typename?: 'BlockSegment', id: string } }> };

export type DetailAnalogSignalChannelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailAnalogSignalChannelQuery = { __typename?: 'Query', analogSignalChannel: { __typename?: 'AnalogSignalChannel', id: string, name?: string | null, index: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, signal: { __typename?: 'AnalogSignal', id: string, name: string, unit?: string | null, channels: Array<{ __typename?: 'AnalogSignalChannel', id: string, name?: string | null, index: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } } } };

export type ListAnalogSignalChannelQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<AnalogSignalChannelFilter>;
}>;


export type ListAnalogSignalChannelQuery = { __typename?: 'Query', analogSignalChannels: Array<{ __typename?: 'AnalogSignalChannel', id: string, name?: string | null, signal: { __typename?: 'AnalogSignal', id: string } }> };

export type DetailSimulationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailSimulationQuery = { __typename?: 'Query', simulation: { __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', id: string, name: string, description?: string | null, config: { __typename?: 'ModelConfig', cells: Array<{ __typename?: 'Cell', id: string, biophysics: { __typename?: 'Biophysics', compartments: Array<{ __typename?: 'Compartment', id: string, mechanisms: Array<string>, globalParams: Array<{ __typename?: 'GlobalParamMap', param: string, value: number }>, sectionParams: Array<{ __typename?: 'SectionParamMap', param: string, value: number }> }> }, topology: { __typename?: 'Topology', sections: Array<{ __typename?: 'Section', id: string, diam: number, length?: number | null, category: string, coords?: Array<{ __typename?: 'Coord', x: number, y: number, z: number }> | null, connections: Array<{ __typename?: 'Connection', parent: string, location: number }> }> } }> }, comparisons: Array<{ __typename?: 'Comparison', collection: { __typename?: 'ModelCollection', id: string, name: string }, changes: Array<{ __typename?: 'Change', type: ChangeType, path: Array<string>, valueA?: any | null, valueB?: any | null }> }>, simulations: Array<{ __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', name: string } }> }, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, recordings: Array<{ __typename?: 'Recording', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, label?: string | null, kind: RoiKind }> } }>, stimuli: Array<{ __typename?: 'Stimulus', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, creator?: { __typename?: 'User', sub: string } | null } };

export type ListSimulationsQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<SimulationFilter>;
  order?: InputMaybe<SimulationOrder>;
}>;


export type ListSimulationsQuery = { __typename?: 'Query', simulations: Array<{ __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', name: string } }> };

export type DetailStimulusQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailStimulusQuery = { __typename?: 'Query', stimulus: { __typename?: 'Stimulus', id: string, label: string, simulation: { __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', id: string, name: string, description?: string | null, config: { __typename?: 'ModelConfig', cells: Array<{ __typename?: 'Cell', id: string, biophysics: { __typename?: 'Biophysics', compartments: Array<{ __typename?: 'Compartment', id: string, mechanisms: Array<string>, globalParams: Array<{ __typename?: 'GlobalParamMap', param: string, value: number }>, sectionParams: Array<{ __typename?: 'SectionParamMap', param: string, value: number }> }> }, topology: { __typename?: 'Topology', sections: Array<{ __typename?: 'Section', id: string, diam: number, length?: number | null, category: string, coords?: Array<{ __typename?: 'Coord', x: number, y: number, z: number }> | null, connections: Array<{ __typename?: 'Connection', parent: string, location: number }> }> } }> }, comparisons: Array<{ __typename?: 'Comparison', collection: { __typename?: 'ModelCollection', id: string, name: string }, changes: Array<{ __typename?: 'Change', type: ChangeType, path: Array<string>, valueA?: any | null, valueB?: any | null }> }>, simulations: Array<{ __typename?: 'Simulation', id: string, name: string, duration: number, dt: number, createdAt: any, model: { __typename?: 'NeuronModel', name: string } }> }, timeTrace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } }, recordings: Array<{ __typename?: 'Recording', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null }, rois: Array<{ __typename?: 'ROI', id: string, vectors: Array<any>, label?: string | null, kind: RoiKind }> } }>, stimuli: Array<{ __typename?: 'Stimulus', id: string, label: string, cell: string, location: string, position: number, trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } }>, creator?: { __typename?: 'User', sub: string } | null } } };

export type ListStimuliQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<StimulusFilter>;
}>;


export type ListStimuliQuery = { __typename?: 'Query', stimuli: Array<{ __typename?: 'Stimulus', id: string, label: string, cell: string, simulation: { __typename?: 'Simulation', id: string } }> };

export type DetailTraceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailTraceQuery = { __typename?: 'Query', trace: { __typename?: 'Trace', id: string, name: string, store: { __typename?: 'ZarrStore', id: string, key: string, bucket: string, path?: string | null, shape?: Array<number> | null, dtype?: string | null } } };

export type TracesQueryVariables = Exact<{ [key: string]: never; }>;


export type TracesQuery = { __typename?: 'Query', traces: Array<{ __typename?: 'Trace', id: string, name: string }> };

export const CompartmentFragmentDoc = gql`
    fragment Compartment on Compartment {
  id
  mechanisms
  globalParams {
    param
    value
  }
  sectionParams {
    param
    value
  }
}
    `;
export const CoordFragmentDoc = gql`
    fragment Coord on Coord {
  x
  y
  z
}
    `;
export const ConnectionFragmentDoc = gql`
    fragment Connection on Connection {
  parent
  location
}
    `;
export const SectionFragmentDoc = gql`
    fragment Section on Section {
  id
  diam
  length
  category
  coords {
    ...Coord
  }
  connections {
    ...Connection
  }
}
    ${CoordFragmentDoc}
${ConnectionFragmentDoc}`;
export const ListSimulationFragmentDoc = gql`
    fragment ListSimulation on Simulation {
  id
  name
  duration
  dt
  createdAt
  model {
    name
  }
}
    `;
export const DetailNeuronModelFragmentDoc = gql`
    fragment DetailNeuronModel on NeuronModel {
  id
  name
  config {
    cells {
      id
      biophysics {
        compartments {
          ...Compartment
        }
      }
      topology {
        sections {
          ...Section
        }
      }
    }
  }
  description
  comparisons {
    collection {
      id
      name
    }
    changes {
      type
      path
      valueA
      valueB
    }
  }
  simulations {
    ...ListSimulation
  }
}
    ${CompartmentFragmentDoc}
${SectionFragmentDoc}
${ListSimulationFragmentDoc}`;
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
export const RecordingFragmentDoc = gql`
    fragment Recording on Recording {
  id
  label
  cell
  location
  position
  trace {
    id
    name
    store {
      ...ZarrStore
    }
    rois {
      id
      vectors
      label
      kind
    }
  }
}
    ${ZarrStoreFragmentDoc}`;
export const StimulusFragmentDoc = gql`
    fragment Stimulus on Stimulus {
  id
  label
  cell
  location
  position
  trace {
    id
    name
    store {
      ...ZarrStore
    }
  }
}
    ${ZarrStoreFragmentDoc}`;
export const DetailSimulationFragmentDoc = gql`
    fragment DetailSimulation on Simulation {
  id
  name
  model {
    ...DetailNeuronModel
  }
  timeTrace {
    id
    name
    store {
      ...ZarrStore
    }
  }
  duration
  recordings {
    ...Recording
  }
  stimuli {
    ...Stimulus
  }
  dt
  createdAt
  creator {
    sub
  }
}
    ${DetailNeuronModelFragmentDoc}
${ZarrStoreFragmentDoc}
${RecordingFragmentDoc}
${StimulusFragmentDoc}`;
export const DetailStimulusFragmentDoc = gql`
    fragment DetailStimulus on Stimulus {
  id
  label
  simulation {
    ...DetailSimulation
  }
}
    ${DetailSimulationFragmentDoc}`;
export const ListStimulusFragmentDoc = gql`
    fragment ListStimulus on Stimulus {
  id
  label
  cell
  simulation {
    id
  }
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
    ${ZarrStoreFragmentDoc}`;
export const AnalogSignalChannelFragmentDoc = gql`
    fragment AnalogSignalChannel on AnalogSignalChannel {
  id
  name
  index
  trace {
    ...DetailTrace
  }
}
    ${DetailTraceFragmentDoc}`;
export const AnalogSignalFragmentDoc = gql`
    fragment AnalogSignal on AnalogSignal {
  id
  name
  unit
  channels {
    ...AnalogSignalChannel
  }
  timeTrace {
    ...DetailTrace
  }
}
    ${AnalogSignalChannelFragmentDoc}
${DetailTraceFragmentDoc}`;
export const DetailAnalogSignalChannelFragmentDoc = gql`
    fragment DetailAnalogSignalChannel on AnalogSignalChannel {
  id
  name
  index
  trace {
    ...DetailTrace
  }
  signal {
    ...AnalogSignal
  }
}
    ${DetailTraceFragmentDoc}
${AnalogSignalFragmentDoc}`;
export const ListAnalogSignalFragmentDoc = gql`
    fragment ListAnalogSignal on AnalogSignal {
  id
  name
  segment {
    id
  }
}
    `;
export const ListAnalogSignalChannelFragmentDoc = gql`
    fragment ListAnalogSignalChannel on AnalogSignalChannel {
  id
  name
  signal {
    id
  }
}
    `;
export const BlockSegmentFragmentDoc = gql`
    fragment BlockSegment on BlockSegment {
  id
  analogSignals {
    ...AnalogSignal
  }
}
    ${AnalogSignalFragmentDoc}`;
export const BlockGroupFragmentDoc = gql`
    fragment BlockGroup on BlockGroup {
  id
  name
}
    `;
export const BlockFragmentDoc = gql`
    fragment Block on Block {
  id
  name
  description
  segments {
    ...BlockSegment
  }
  groups {
    ...BlockGroup
  }
}
    ${BlockSegmentFragmentDoc}
${BlockGroupFragmentDoc}`;
export const ListBlockFragmentDoc = gql`
    fragment ListBlock on Block {
  id
  name
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
export const ExperimentFragmentDoc = gql`
    fragment Experiment on Experiment {
  id
  name
  description
  createdAt
  timeTrace {
    id
    name
    store {
      ...ZarrStore
    }
  }
  stimulusViews {
    id
    label
    stimulus {
      ...Stimulus
    }
  }
  recordingViews {
    id
    label
    recording {
      ...Recording
    }
  }
}
    ${ZarrStoreFragmentDoc}
${StimulusFragmentDoc}
${RecordingFragmentDoc}`;
export const ListExperimentFragmentDoc = gql`
    fragment ListExperiment on Experiment {
  id
  name
}
    `;
export const ListNeuronModelFragmentDoc = gql`
    fragment ListNeuronModel on NeuronModel {
  id
  name
}
    `;
export const ModelCollectionFragmentDoc = gql`
    fragment ModelCollection on ModelCollection {
  id
  name
  models {
    ...ListNeuronModel
  }
}
    ${ListNeuronModelFragmentDoc}`;
export const ListModelCollectionFragmentDoc = gql`
    fragment ListModelCollection on ModelCollection {
  id
  name
}
    `;
export const DetailRecordingFragmentDoc = gql`
    fragment DetailRecording on Recording {
  id
  label
  simulation {
    ...DetailSimulation
  }
}
    ${DetailSimulationFragmentDoc}`;
export const ListRecordingFragmentDoc = gql`
    fragment ListRecording on Recording {
  id
  label
  cell
  simulation {
    id
  }
}
    `;
export const ListTraceFragmentDoc = gql`
    fragment ListTrace on Trace {
  id
  name
}
    `;
export const DeleteBlockDocument = gql`
    mutation DeleteBlock($id: ID!) {
  deleteBlock(input: {id: $id})
}
    `;
export type DeleteBlockMutationFn = Apollo.MutationFunction<DeleteBlockMutation, DeleteBlockMutationVariables>;

/**
 * __useDeleteBlockMutation__
 *
 * To run a mutation, you first call `useDeleteBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBlockMutation, { data, loading, error }] = useDeleteBlockMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBlockMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteBlockMutation, DeleteBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteBlockMutation, DeleteBlockMutationVariables>(DeleteBlockDocument, options);
      }
export type DeleteBlockMutationHookResult = ReturnType<typeof useDeleteBlockMutation>;
export type DeleteBlockMutationResult = Apollo.MutationResult<DeleteBlockMutation>;
export type DeleteBlockMutationOptions = Apollo.BaseMutationOptions<DeleteBlockMutation, DeleteBlockMutationVariables>;
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
export const DetailBlockDocument = gql`
    query DetailBlock($id: ID!) {
  block(id: $id) {
    ...Block
  }
}
    ${BlockFragmentDoc}`;

/**
 * __useDetailBlockQuery__
 *
 * To run a query within a React component, call `useDetailBlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailBlockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailBlockQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailBlockQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailBlockQuery, DetailBlockQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailBlockQuery, DetailBlockQueryVariables>(DetailBlockDocument, options);
      }
export function useDetailBlockLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailBlockQuery, DetailBlockQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailBlockQuery, DetailBlockQueryVariables>(DetailBlockDocument, options);
        }
export type DetailBlockQueryHookResult = ReturnType<typeof useDetailBlockQuery>;
export type DetailBlockLazyQueryHookResult = ReturnType<typeof useDetailBlockLazyQuery>;
export type DetailBlockQueryResult = Apollo.QueryResult<DetailBlockQuery, DetailBlockQueryVariables>;
export const ListBlocksDocument = gql`
    query ListBlocks($pagination: OffsetPaginationInput, $filters: BlockFilter, $order: BlockOrder) {
  blocks(pagination: $pagination, filters: $filters, order: $order) {
    ...ListBlock
  }
}
    ${ListBlockFragmentDoc}`;

/**
 * __useListBlocksQuery__
 *
 * To run a query within a React component, call `useListBlocksQuery` and pass it any options that fit your needs.
 * When your component renders, `useListBlocksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListBlocksQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useListBlocksQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListBlocksQuery, ListBlocksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListBlocksQuery, ListBlocksQueryVariables>(ListBlocksDocument, options);
      }
export function useListBlocksLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListBlocksQuery, ListBlocksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListBlocksQuery, ListBlocksQueryVariables>(ListBlocksDocument, options);
        }
export type ListBlocksQueryHookResult = ReturnType<typeof useListBlocksQuery>;
export type ListBlocksLazyQueryHookResult = ReturnType<typeof useListBlocksLazyQuery>;
export type ListBlocksQueryResult = Apollo.QueryResult<ListBlocksQuery, ListBlocksQueryVariables>;
export const DetailExperimentDocument = gql`
    query DetailExperiment($id: ID!) {
  experiment(id: $id) {
    ...Experiment
  }
}
    ${ExperimentFragmentDoc}`;

/**
 * __useDetailExperimentQuery__
 *
 * To run a query within a React component, call `useDetailExperimentQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailExperimentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailExperimentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailExperimentQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailExperimentQuery, DetailExperimentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailExperimentQuery, DetailExperimentQueryVariables>(DetailExperimentDocument, options);
      }
export function useDetailExperimentLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailExperimentQuery, DetailExperimentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailExperimentQuery, DetailExperimentQueryVariables>(DetailExperimentDocument, options);
        }
export type DetailExperimentQueryHookResult = ReturnType<typeof useDetailExperimentQuery>;
export type DetailExperimentLazyQueryHookResult = ReturnType<typeof useDetailExperimentLazyQuery>;
export type DetailExperimentQueryResult = Apollo.QueryResult<DetailExperimentQuery, DetailExperimentQueryVariables>;
export const ListExperimentsDocument = gql`
    query ListExperiments($pagination: OffsetPaginationInput, $filters: ExperimentFilter, $order: ExperimentOrder) {
  experiments(pagination: $pagination, filters: $filters, order: $order) {
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
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *      order: // value for 'order'
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
export const HomePageDocument = gql`
    query HomePage {
  blocks: blocks(pagination: {limit: 1}, order: {createdAt: DESC}) {
    ...ListBlock
  }
  models: neuronModels(pagination: {limit: 1}, order: {createdAt: DESC}) {
    ...ListNeuronModel
  }
}
    ${ListBlockFragmentDoc}
${ListNeuronModelFragmentDoc}`;

/**
 * __useHomePageQuery__
 *
 * To run a query within a React component, call `useHomePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePageQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomePageQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<HomePageQuery, HomePageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<HomePageQuery, HomePageQueryVariables>(HomePageDocument, options);
      }
export function useHomePageLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<HomePageQuery, HomePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<HomePageQuery, HomePageQueryVariables>(HomePageDocument, options);
        }
export type HomePageQueryHookResult = ReturnType<typeof useHomePageQuery>;
export type HomePageLazyQueryHookResult = ReturnType<typeof useHomePageLazyQuery>;
export type HomePageQueryResult = Apollo.QueryResult<HomePageQuery, HomePageQueryVariables>;
export const HomePageStatsDocument = gql`
    query HomePageStats {
  blockStats {
    count
  }
}
    `;

/**
 * __useHomePageStatsQuery__
 *
 * To run a query within a React component, call `useHomePageStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePageStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePageStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomePageStatsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<HomePageStatsQuery, HomePageStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<HomePageStatsQuery, HomePageStatsQueryVariables>(HomePageStatsDocument, options);
      }
export function useHomePageStatsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<HomePageStatsQuery, HomePageStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<HomePageStatsQuery, HomePageStatsQueryVariables>(HomePageStatsDocument, options);
        }
export type HomePageStatsQueryHookResult = ReturnType<typeof useHomePageStatsQuery>;
export type HomePageStatsLazyQueryHookResult = ReturnType<typeof useHomePageStatsLazyQuery>;
export type HomePageStatsQueryResult = Apollo.QueryResult<HomePageStatsQuery, HomePageStatsQueryVariables>;
export const DetailModelCollectionDocument = gql`
    query DetailModelCollection($id: ID!) {
  modelCollection(id: $id) {
    ...ModelCollection
  }
}
    ${ModelCollectionFragmentDoc}`;

/**
 * __useDetailModelCollectionQuery__
 *
 * To run a query within a React component, call `useDetailModelCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailModelCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailModelCollectionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailModelCollectionQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailModelCollectionQuery, DetailModelCollectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailModelCollectionQuery, DetailModelCollectionQueryVariables>(DetailModelCollectionDocument, options);
      }
export function useDetailModelCollectionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailModelCollectionQuery, DetailModelCollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailModelCollectionQuery, DetailModelCollectionQueryVariables>(DetailModelCollectionDocument, options);
        }
export type DetailModelCollectionQueryHookResult = ReturnType<typeof useDetailModelCollectionQuery>;
export type DetailModelCollectionLazyQueryHookResult = ReturnType<typeof useDetailModelCollectionLazyQuery>;
export type DetailModelCollectionQueryResult = Apollo.QueryResult<DetailModelCollectionQuery, DetailModelCollectionQueryVariables>;
export const ListModelCollectionsDocument = gql`
    query ListModelCollections($pagination: OffsetPaginationInput, $filters: ModelCollectionFilter) {
  modelCollections(pagination: $pagination, filters: $filters) {
    ...ListModelCollection
  }
}
    ${ListModelCollectionFragmentDoc}`;

/**
 * __useListModelCollectionsQuery__
 *
 * To run a query within a React component, call `useListModelCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListModelCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListModelCollectionsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useListModelCollectionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListModelCollectionsQuery, ListModelCollectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListModelCollectionsQuery, ListModelCollectionsQueryVariables>(ListModelCollectionsDocument, options);
      }
export function useListModelCollectionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListModelCollectionsQuery, ListModelCollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListModelCollectionsQuery, ListModelCollectionsQueryVariables>(ListModelCollectionsDocument, options);
        }
export type ListModelCollectionsQueryHookResult = ReturnType<typeof useListModelCollectionsQuery>;
export type ListModelCollectionsLazyQueryHookResult = ReturnType<typeof useListModelCollectionsLazyQuery>;
export type ListModelCollectionsQueryResult = Apollo.QueryResult<ListModelCollectionsQuery, ListModelCollectionsQueryVariables>;
export const DetailNeuronModelDocument = gql`
    query DetailNeuronModel($id: ID!) {
  neuronModel(id: $id) {
    ...DetailNeuronModel
  }
}
    ${DetailNeuronModelFragmentDoc}`;

/**
 * __useDetailNeuronModelQuery__
 *
 * To run a query within a React component, call `useDetailNeuronModelQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailNeuronModelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailNeuronModelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailNeuronModelQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailNeuronModelQuery, DetailNeuronModelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailNeuronModelQuery, DetailNeuronModelQueryVariables>(DetailNeuronModelDocument, options);
      }
export function useDetailNeuronModelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailNeuronModelQuery, DetailNeuronModelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailNeuronModelQuery, DetailNeuronModelQueryVariables>(DetailNeuronModelDocument, options);
        }
export type DetailNeuronModelQueryHookResult = ReturnType<typeof useDetailNeuronModelQuery>;
export type DetailNeuronModelLazyQueryHookResult = ReturnType<typeof useDetailNeuronModelLazyQuery>;
export type DetailNeuronModelQueryResult = Apollo.QueryResult<DetailNeuronModelQuery, DetailNeuronModelQueryVariables>;
export const ListNeuronModelsDocument = gql`
    query ListNeuronModels($pagination: OffsetPaginationInput, $filters: NeuronModelFilter, $order: NeuronModelOrder) {
  neuronModels(pagination: $pagination, filters: $filters, order: $order) {
    ...ListNeuronModel
  }
}
    ${ListNeuronModelFragmentDoc}`;

/**
 * __useListNeuronModelsQuery__
 *
 * To run a query within a React component, call `useListNeuronModelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListNeuronModelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListNeuronModelsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useListNeuronModelsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListNeuronModelsQuery, ListNeuronModelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListNeuronModelsQuery, ListNeuronModelsQueryVariables>(ListNeuronModelsDocument, options);
      }
export function useListNeuronModelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListNeuronModelsQuery, ListNeuronModelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListNeuronModelsQuery, ListNeuronModelsQueryVariables>(ListNeuronModelsDocument, options);
        }
export type ListNeuronModelsQueryHookResult = ReturnType<typeof useListNeuronModelsQuery>;
export type ListNeuronModelsLazyQueryHookResult = ReturnType<typeof useListNeuronModelsLazyQuery>;
export type ListNeuronModelsQueryResult = Apollo.QueryResult<ListNeuronModelsQuery, ListNeuronModelsQueryVariables>;
export const DetailRecordingDocument = gql`
    query DetailRecording($id: ID!) {
  recording(id: $id) {
    ...DetailRecording
  }
}
    ${DetailRecordingFragmentDoc}`;

/**
 * __useDetailRecordingQuery__
 *
 * To run a query within a React component, call `useDetailRecordingQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailRecordingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailRecordingQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailRecordingQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailRecordingQuery, DetailRecordingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailRecordingQuery, DetailRecordingQueryVariables>(DetailRecordingDocument, options);
      }
export function useDetailRecordingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailRecordingQuery, DetailRecordingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailRecordingQuery, DetailRecordingQueryVariables>(DetailRecordingDocument, options);
        }
export type DetailRecordingQueryHookResult = ReturnType<typeof useDetailRecordingQuery>;
export type DetailRecordingLazyQueryHookResult = ReturnType<typeof useDetailRecordingLazyQuery>;
export type DetailRecordingQueryResult = Apollo.QueryResult<DetailRecordingQuery, DetailRecordingQueryVariables>;
export const ListRecordingsDocument = gql`
    query ListRecordings($pagination: OffsetPaginationInput, $filters: RecordingFilter) {
  recordings(pagination: $pagination, filters: $filters) {
    ...ListRecording
  }
}
    ${ListRecordingFragmentDoc}`;

/**
 * __useListRecordingsQuery__
 *
 * To run a query within a React component, call `useListRecordingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListRecordingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListRecordingsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useListRecordingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListRecordingsQuery, ListRecordingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListRecordingsQuery, ListRecordingsQueryVariables>(ListRecordingsDocument, options);
      }
export function useListRecordingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListRecordingsQuery, ListRecordingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListRecordingsQuery, ListRecordingsQueryVariables>(ListRecordingsDocument, options);
        }
export type ListRecordingsQueryHookResult = ReturnType<typeof useListRecordingsQuery>;
export type ListRecordingsLazyQueryHookResult = ReturnType<typeof useListRecordingsLazyQuery>;
export type ListRecordingsQueryResult = Apollo.QueryResult<ListRecordingsQuery, ListRecordingsQueryVariables>;
export const GlobalSearchDocument = gql`
    query GlobalSearch($search: String, $pagination: OffsetPaginationInput) {
  traces: traces(filters: {search: $search}, pagination: $pagination) {
    ...ListTrace
  }
}
    ${ListTraceFragmentDoc}`;

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
export function useGlobalSearchQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
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
export const DetailAnalogSignalDocument = gql`
    query DetailAnalogSignal($id: ID!) {
  analogSignal(id: $id) {
    ...AnalogSignal
  }
}
    ${AnalogSignalFragmentDoc}`;

/**
 * __useDetailAnalogSignalQuery__
 *
 * To run a query within a React component, call `useDetailAnalogSignalQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailAnalogSignalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailAnalogSignalQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailAnalogSignalQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailAnalogSignalQuery, DetailAnalogSignalQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailAnalogSignalQuery, DetailAnalogSignalQueryVariables>(DetailAnalogSignalDocument, options);
      }
export function useDetailAnalogSignalLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailAnalogSignalQuery, DetailAnalogSignalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailAnalogSignalQuery, DetailAnalogSignalQueryVariables>(DetailAnalogSignalDocument, options);
        }
export type DetailAnalogSignalQueryHookResult = ReturnType<typeof useDetailAnalogSignalQuery>;
export type DetailAnalogSignalLazyQueryHookResult = ReturnType<typeof useDetailAnalogSignalLazyQuery>;
export type DetailAnalogSignalQueryResult = Apollo.QueryResult<DetailAnalogSignalQuery, DetailAnalogSignalQueryVariables>;
export const ListAnalogSignalDocument = gql`
    query ListAnalogSignal($pagination: OffsetPaginationInput, $filters: AnalogSignalFilter) {
  analogSignals(pagination: $pagination, filters: $filters) {
    ...ListAnalogSignal
  }
}
    ${ListAnalogSignalFragmentDoc}`;

/**
 * __useListAnalogSignalQuery__
 *
 * To run a query within a React component, call `useListAnalogSignalQuery` and pass it any options that fit your needs.
 * When your component renders, `useListAnalogSignalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListAnalogSignalQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useListAnalogSignalQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListAnalogSignalQuery, ListAnalogSignalQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListAnalogSignalQuery, ListAnalogSignalQueryVariables>(ListAnalogSignalDocument, options);
      }
export function useListAnalogSignalLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListAnalogSignalQuery, ListAnalogSignalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListAnalogSignalQuery, ListAnalogSignalQueryVariables>(ListAnalogSignalDocument, options);
        }
export type ListAnalogSignalQueryHookResult = ReturnType<typeof useListAnalogSignalQuery>;
export type ListAnalogSignalLazyQueryHookResult = ReturnType<typeof useListAnalogSignalLazyQuery>;
export type ListAnalogSignalQueryResult = Apollo.QueryResult<ListAnalogSignalQuery, ListAnalogSignalQueryVariables>;
export const DetailAnalogSignalChannelDocument = gql`
    query DetailAnalogSignalChannel($id: ID!) {
  analogSignalChannel(id: $id) {
    ...DetailAnalogSignalChannel
  }
}
    ${DetailAnalogSignalChannelFragmentDoc}`;

/**
 * __useDetailAnalogSignalChannelQuery__
 *
 * To run a query within a React component, call `useDetailAnalogSignalChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailAnalogSignalChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailAnalogSignalChannelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailAnalogSignalChannelQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailAnalogSignalChannelQuery, DetailAnalogSignalChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailAnalogSignalChannelQuery, DetailAnalogSignalChannelQueryVariables>(DetailAnalogSignalChannelDocument, options);
      }
export function useDetailAnalogSignalChannelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailAnalogSignalChannelQuery, DetailAnalogSignalChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailAnalogSignalChannelQuery, DetailAnalogSignalChannelQueryVariables>(DetailAnalogSignalChannelDocument, options);
        }
export type DetailAnalogSignalChannelQueryHookResult = ReturnType<typeof useDetailAnalogSignalChannelQuery>;
export type DetailAnalogSignalChannelLazyQueryHookResult = ReturnType<typeof useDetailAnalogSignalChannelLazyQuery>;
export type DetailAnalogSignalChannelQueryResult = Apollo.QueryResult<DetailAnalogSignalChannelQuery, DetailAnalogSignalChannelQueryVariables>;
export const ListAnalogSignalChannelDocument = gql`
    query ListAnalogSignalChannel($pagination: OffsetPaginationInput, $filters: AnalogSignalChannelFilter) {
  analogSignalChannels(pagination: $pagination, filters: $filters) {
    ...ListAnalogSignalChannel
  }
}
    ${ListAnalogSignalChannelFragmentDoc}`;

/**
 * __useListAnalogSignalChannelQuery__
 *
 * To run a query within a React component, call `useListAnalogSignalChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useListAnalogSignalChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListAnalogSignalChannelQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useListAnalogSignalChannelQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListAnalogSignalChannelQuery, ListAnalogSignalChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListAnalogSignalChannelQuery, ListAnalogSignalChannelQueryVariables>(ListAnalogSignalChannelDocument, options);
      }
export function useListAnalogSignalChannelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListAnalogSignalChannelQuery, ListAnalogSignalChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListAnalogSignalChannelQuery, ListAnalogSignalChannelQueryVariables>(ListAnalogSignalChannelDocument, options);
        }
export type ListAnalogSignalChannelQueryHookResult = ReturnType<typeof useListAnalogSignalChannelQuery>;
export type ListAnalogSignalChannelLazyQueryHookResult = ReturnType<typeof useListAnalogSignalChannelLazyQuery>;
export type ListAnalogSignalChannelQueryResult = Apollo.QueryResult<ListAnalogSignalChannelQuery, ListAnalogSignalChannelQueryVariables>;
export const DetailSimulationDocument = gql`
    query DetailSimulation($id: ID!) {
  simulation(id: $id) {
    ...DetailSimulation
  }
}
    ${DetailSimulationFragmentDoc}`;

/**
 * __useDetailSimulationQuery__
 *
 * To run a query within a React component, call `useDetailSimulationQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailSimulationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailSimulationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailSimulationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailSimulationQuery, DetailSimulationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailSimulationQuery, DetailSimulationQueryVariables>(DetailSimulationDocument, options);
      }
export function useDetailSimulationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailSimulationQuery, DetailSimulationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailSimulationQuery, DetailSimulationQueryVariables>(DetailSimulationDocument, options);
        }
export type DetailSimulationQueryHookResult = ReturnType<typeof useDetailSimulationQuery>;
export type DetailSimulationLazyQueryHookResult = ReturnType<typeof useDetailSimulationLazyQuery>;
export type DetailSimulationQueryResult = Apollo.QueryResult<DetailSimulationQuery, DetailSimulationQueryVariables>;
export const ListSimulationsDocument = gql`
    query ListSimulations($pagination: OffsetPaginationInput, $filters: SimulationFilter, $order: SimulationOrder) {
  simulations(pagination: $pagination, filters: $filters, order: $order) {
    ...ListSimulation
  }
}
    ${ListSimulationFragmentDoc}`;

/**
 * __useListSimulationsQuery__
 *
 * To run a query within a React component, call `useListSimulationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListSimulationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListSimulationsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useListSimulationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListSimulationsQuery, ListSimulationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListSimulationsQuery, ListSimulationsQueryVariables>(ListSimulationsDocument, options);
      }
export function useListSimulationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListSimulationsQuery, ListSimulationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListSimulationsQuery, ListSimulationsQueryVariables>(ListSimulationsDocument, options);
        }
export type ListSimulationsQueryHookResult = ReturnType<typeof useListSimulationsQuery>;
export type ListSimulationsLazyQueryHookResult = ReturnType<typeof useListSimulationsLazyQuery>;
export type ListSimulationsQueryResult = Apollo.QueryResult<ListSimulationsQuery, ListSimulationsQueryVariables>;
export const DetailStimulusDocument = gql`
    query DetailStimulus($id: ID!) {
  stimulus(id: $id) {
    ...DetailStimulus
  }
}
    ${DetailStimulusFragmentDoc}`;

/**
 * __useDetailStimulusQuery__
 *
 * To run a query within a React component, call `useDetailStimulusQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailStimulusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailStimulusQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailStimulusQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailStimulusQuery, DetailStimulusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailStimulusQuery, DetailStimulusQueryVariables>(DetailStimulusDocument, options);
      }
export function useDetailStimulusLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailStimulusQuery, DetailStimulusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailStimulusQuery, DetailStimulusQueryVariables>(DetailStimulusDocument, options);
        }
export type DetailStimulusQueryHookResult = ReturnType<typeof useDetailStimulusQuery>;
export type DetailStimulusLazyQueryHookResult = ReturnType<typeof useDetailStimulusLazyQuery>;
export type DetailStimulusQueryResult = Apollo.QueryResult<DetailStimulusQuery, DetailStimulusQueryVariables>;
export const ListStimuliDocument = gql`
    query ListStimuli($pagination: OffsetPaginationInput, $filters: StimulusFilter) {
  stimuli(pagination: $pagination, filters: $filters) {
    ...ListStimulus
  }
}
    ${ListStimulusFragmentDoc}`;

/**
 * __useListStimuliQuery__
 *
 * To run a query within a React component, call `useListStimuliQuery` and pass it any options that fit your needs.
 * When your component renders, `useListStimuliQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListStimuliQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useListStimuliQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListStimuliQuery, ListStimuliQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListStimuliQuery, ListStimuliQueryVariables>(ListStimuliDocument, options);
      }
export function useListStimuliLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListStimuliQuery, ListStimuliQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListStimuliQuery, ListStimuliQueryVariables>(ListStimuliDocument, options);
        }
export type ListStimuliQueryHookResult = ReturnType<typeof useListStimuliQuery>;
export type ListStimuliLazyQueryHookResult = ReturnType<typeof useListStimuliLazyQuery>;
export type ListStimuliQueryResult = Apollo.QueryResult<ListStimuliQuery, ListStimuliQueryVariables>;
export const DetailTraceDocument = gql`
    query DetailTrace($id: ID!) {
  trace(id: $id) {
    ...DetailTrace
  }
}
    ${DetailTraceFragmentDoc}`;

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
export function useDetailTraceQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailTraceQuery, DetailTraceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailTraceQuery, DetailTraceQueryVariables>(DetailTraceDocument, options);
      }
export function useDetailTraceLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailTraceQuery, DetailTraceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailTraceQuery, DetailTraceQueryVariables>(DetailTraceDocument, options);
        }
export type DetailTraceQueryHookResult = ReturnType<typeof useDetailTraceQuery>;
export type DetailTraceLazyQueryHookResult = ReturnType<typeof useDetailTraceLazyQuery>;
export type DetailTraceQueryResult = Apollo.QueryResult<DetailTraceQuery, DetailTraceQueryVariables>;
export const TracesDocument = gql`
    query Traces {
  traces(pagination: {limit: 10}) {
    ...ListTrace
  }
}
    ${ListTraceFragmentDoc}`;

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
export function useTracesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TracesQuery, TracesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TracesQuery, TracesQueryVariables>(TracesDocument, options);
      }
export function useTracesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TracesQuery, TracesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TracesQuery, TracesQueryVariables>(TracesDocument, options);
        }
export type TracesQueryHookResult = ReturnType<typeof useTracesQuery>;
export type TracesLazyQueryHookResult = ReturnType<typeof useTracesLazyQuery>;
export type TracesQueryResult = Apollo.QueryResult<TracesQuery, TracesQueryVariables>;