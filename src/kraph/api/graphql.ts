import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@/lib/kraph/funcs';
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
  Cypher: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Metric: { input: any; output: any; }
  NodeID: { input: any; output: any; }
  RemoteUpload: { input: any; output: any; }
  StructureIdentifier: { input: any; output: any; }
  StructureString: { input: any; output: any; }
  UntypedPlateChild: { input: any; output: any; }
};

/** An app. */
export type App = {
  __typename?: 'App';
  clientId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Category = {
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  /** The unique identifier of the expression within its graph */
  label: Scalars['String']['output'];
  /** The ontology the expression belongs to. */
  ontology: Ontology;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
};

/** A column definition for a table view. */
export type Column = {
  __typename?: 'Column';
  description?: Maybe<Scalars['String']['output']>;
  expression?: Maybe<Scalars['ID']['output']>;
  kind: ColumnKind;
  label?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  searchable?: Maybe<Scalars['Boolean']['output']>;
  valueKind?: Maybe<MeasurementKind>;
};

export type ColumnInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  expression?: InputMaybe<Scalars['ID']['input']>;
  kind: ColumnKind;
  label?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  searchable?: InputMaybe<Scalars['Boolean']['input']>;
  valueKind?: InputMaybe<MeasurementKind>;
};

export enum ColumnKind {
  Edge = 'EDGE',
  Node = 'NODE',
  Value = 'VALUE'
}

/**  A ComputedMeasurement is a measurement that is computed from other measurements. It is a special kind of measurement that is derived from other measurements. */
export type ComputedMeasurement = Edge & {
  __typename?: 'ComputedMeasurement';
  category: MeasurementCategory;
  /** When this entity was created */
  computedFrom: Array<Measurement>;
  /** When this entity was created */
  createdAt: Scalars['DateTime']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  inferedBy: Edge;
  label: Scalars['String']['output'];
  leftId: Scalars['String']['output'];
  rightId: Scalars['String']['output'];
  /** Timestamp from when this entity is valid */
  validFrom: Scalars['DateTime']['output'];
  /** Timestamp until when this entity is valid */
  validTo: Scalars['DateTime']['output'];
  /** The value of the measurement */
  value: Scalars['Metric']['output'];
};

/** Input type for creating a new model */
export type CreateModelInput = {
  /** The uploaded model file (e.g. .h5, .onnx, .pt) */
  model: Scalars['RemoteUpload']['input'];
  /** The name of the model */
  name: Scalars['String']['input'];
  /** Optional view ID to associate with the model */
  view?: InputMaybe<Scalars['ID']['input']>;
};

export type DeleteEntityInput = {
  id: Scalars['ID']['input'];
};

/** Input for deleting a generic category */
export type DeleteGenericCategoryInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

export type DeleteGraphInput = {
  id: Scalars['ID']['input'];
};

/** Input for deleting an expression */
export type DeleteMeasurementCategoryInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

/** Input type for deleting an ontology */
export type DeleteOntologyInput = {
  /** The ID of the ontology to delete */
  id: Scalars['ID']['input'];
};

export type DeleteProtocolInput = {
  id: Scalars['ID']['input'];
};

export type DeleteProtocolStepInput = {
  id: Scalars['ID']['input'];
};

export type DeleteProtocolStepTemplateInput = {
  id: Scalars['ID']['input'];
};

/** Input for deleting an expression */
export type DeleteRelationCategoryInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

/** Input for deleting an expression */
export type DeleteScatterPlotInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

/** Input for deleting an expression */
export type DeleteStructureCategoryInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

export type Edge = {
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  inferedBy: Edge;
  label: Scalars['String']['output'];
  leftId: Scalars['String']['output'];
  rightId: Scalars['String']['output'];
};

export type EdgeCategory = {
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  left: NodeCategory;
  right: NodeCategory;
};

/** A Entity is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type Entity = Node & {
  __typename?: 'Entity';
  /** Protocol steps where this entity was the target */
  category: GenericCategory;
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  graph: Graph;
  /** The unique identifier of the entity within its graph */
  graphId: Scalars['ID']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
  nodeViews: Array<NodeView>;
  /** Protocol steps where this entity was the target */
  pinnedViews: Array<NodeView>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
  /** Protocol steps where this entity was the target */
  subjectedTo: Array<ProtocolStep>;
  /** Protocol steps where this entity was used */
  usedIn: Array<ProtocolStep>;
};


/** A Entity is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type EntityEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};

/** Filter for entities in the graph */
export type EntityFilter = {
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by structure identifier */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of entity IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by entity kind */
  kind?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by linked expression ID */
  linkedExpression?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by associated object ID */
  object?: InputMaybe<Scalars['ID']['input']>;
  /** Search entities by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input type for creating a new entity */
export type EntityInput = {
  /** The ID of the kind (LinkedExpression) to create the entity from */
  expression: Scalars['ID']['input'];
  graph: Scalars['ID']['input'];
  /** Optional name for the entity */
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Filter for entity relations in the graph */
export type EntityRelationFilter = {
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of relation IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by relation kind */
  kind?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by left entity ID */
  leftId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by linked expression ID */
  linkedExpression?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by right entity ID */
  rightId?: InputMaybe<Scalars['ID']['input']>;
  /** Search relations by text */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Include self-relations */
  withSelf?: InputMaybe<Scalars['Boolean']['input']>;
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

export type Expression = {
  __typename?: 'Expression';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  /** The unique identifier of the expression within its graph */
  label: Scalars['String']['output'];
  /** The ontology the expression belongs to. */
  ontology: Ontology;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /**  The unit  type of the metric */
  unit?: Maybe<Scalars['String']['output']>;
};

export type ExpressionFilter = {
  AND?: InputMaybe<ExpressionFilter>;
  OR?: InputMaybe<ExpressionFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind?: InputMaybe<ExpressionKind>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export enum ExpressionKind {
  Concept = 'CONCEPT',
  Entity = 'ENTITY',
  Measurement = 'MEASUREMENT',
  Metric = 'METRIC',
  Relation = 'RELATION',
  RelationMetric = 'RELATION_METRIC',
  Structure = 'STRUCTURE'
}

export type GenericCategory = Category & NodeCategory & {
  __typename?: 'GenericCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  /** The color of the node in the graph */
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The height of the node in the graph */
  height?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The unique identifier of the expression within its graph */
  instanceKind: InstanceKind;
  /** The kind of expression */
  kind: ExpressionKind;
  /** The unique identifier of the expression within its graph */
  label: Scalars['String']['output'];
  /** The ontology the expression belongs to. */
  ontology: Ontology;
  /** The x position of the node in the graph */
  positionX?: Maybe<Scalars['Float']['output']>;
  /** The y position of the node in the graph */
  positionY?: Maybe<Scalars['Float']['output']>;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The width of the node in the graph */
  width?: Maybe<Scalars['Float']['output']>;
};

export type GenericCategoryFilter = {
  AND?: InputMaybe<GenericCategoryFilter>;
  OR?: InputMaybe<GenericCategoryFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  ontology?: InputMaybe<Scalars['ID']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type GenericCategoryInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['RemoteUpload']['input']>;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** The ID of the ontology this expression belongs to. If not provided, uses default ontology */
  ontology?: InputMaybe<Scalars['ID']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
};

/** A graph, that contains entities and relations. */
export type Graph = {
  __typename?: 'Graph';
  ageName: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  graphViews: Array<GraphView>;
  id: Scalars['ID']['output'];
  latestNodes: Array<Node>;
  name: Scalars['String']['output'];
  nodeViews: Array<NodeView>;
  ontology: Ontology;
  pinned: Scalars['Boolean']['output'];
  plotViews: Array<PlotView>;
};


/** A graph, that contains entities and relations. */
export type GraphGraphViewsArgs = {
  filters?: InputMaybe<GraphViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphLatestNodesArgs = {
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphNodeViewsArgs = {
  filters?: InputMaybe<NodeViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphPlotViewsArgs = {
  filters?: InputMaybe<PlotViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type GraphFilter = {
  AND?: InputMaybe<GraphFilter>;
  OR?: InputMaybe<GraphFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GraphInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  experiment?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  ontology?: InputMaybe<Scalars['ID']['input']>;
};

export type GraphPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** A view of a graph, that contains entities and relations. */
export type GraphQuery = {
  __typename?: 'GraphQuery';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kind: ViewKind;
  name: Scalars['String']['output'];
  ontology: Ontology;
  pinned: Scalars['Boolean']['output'];
  query: Scalars['String']['output'];
  scatterPlots: Array<ScatterPlot>;
  views: Array<GraphView>;
};


/** A view of a graph, that contains entities and relations. */
export type GraphQueryScatterPlotsArgs = {
  filters?: InputMaybe<ScatterPlotFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A view of a graph, that contains entities and relations. */
export type GraphQueryViewsArgs = {
  filters?: InputMaybe<GraphViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type GraphQueryFilter = {
  AND?: InputMaybe<GraphQueryFilter>;
  OR?: InputMaybe<GraphQueryFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type GraphQueryInput = {
  /** The columns (if ViewKind is Table) */
  columns?: InputMaybe<Array<ColumnInput>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The kind/type of this expression */
  kind: ViewKind;
  /** The label/name of the expression */
  name: Scalars['String']['input'];
  /** The ID of the ontology this expression belongs to. If not provided, uses default ontology */
  ontology?: InputMaybe<Scalars['ID']['input']>;
  /** The label/name of the expression */
  query: Scalars['Cypher']['input'];
  /** The graph to test against */
  testAgainst?: InputMaybe<Scalars['ID']['input']>;
};

/** A view of a graph, that contains entities and relations. */
export type GraphView = {
  __typename?: 'GraphView';
  graph: Graph;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  plotViews: Array<PlotView>;
  query: GraphQuery;
  render: PairsPathTable;
};


/** A view of a graph, that contains entities and relations. */
export type GraphViewPlotViewsArgs = {
  filters?: InputMaybe<PlotViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type GraphViewFilter = {
  AND?: InputMaybe<GraphViewFilter>;
  OR?: InputMaybe<GraphViewFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type GraphViewInput = {
  graph: Scalars['ID']['input'];
  query: Scalars['ID']['input'];
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

export enum InstanceKind {
  Entity = 'ENTITY',
  Lot = 'LOT',
  Sample = 'SAMPLE',
  Unknown = 'UNKNOWN'
}

/**
 * A measurement is an edge from a structure to an entity. Importantly Measurement are always directed from the structure to the entity, and never the other way around.
 *
 * Why an edge?
 * Because a measurement is a relation between two entities, and it is important to keep track of the provenance of the data.
 *                  By making the measurement an edge, we can keep track of the timestamp when the data point (entity) was taken,
 *                   and the timestamp when the measurment was created. We can also keep track of the validity of the measurment
 *                  over time (valid_from, valid_to). Through these edges we can establish when a entity really existed (i.e. when it was measured)
 *
 */
export type Measurement = Edge & {
  __typename?: 'Measurement';
  category: MeasurementCategory;
  /** When this entity was created */
  createdAt: Scalars['DateTime']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  inferedBy: Edge;
  label: Scalars['String']['output'];
  leftId: Scalars['String']['output'];
  rightId: Scalars['String']['output'];
  /** Timestamp from when this entity is valid */
  validFrom: Scalars['DateTime']['output'];
  /** Timestamp until when this entity is valid */
  validTo: Scalars['DateTime']['output'];
  /** The value of the measurement */
  value: Scalars['Metric']['output'];
};

export type MeasurementCategory = Category & EdgeCategory & {
  __typename?: 'MeasurementCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  /** The unique identifier of the expression within its graph */
  label: Scalars['String']['output'];
  left: NodeCategory;
  /** The kind of metric this expression represents */
  metricKind: MeasurementKind;
  /** The ontology the expression belongs to. */
  ontology: Ontology;
  right: NodeCategory;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
};

export type MeasurementCategoryFilter = {
  AND?: InputMaybe<MeasurementCategoryFilter>;
  OR?: InputMaybe<MeasurementCategoryFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  metricKind?: InputMaybe<MeasurementKind>;
  ontology?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type MeasurementCategoryInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['RemoteUpload']['input']>;
  /** The type of metric data this expression represents */
  kind: MeasurementKind;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** The ID of the ontology this expression belongs to. If not provided, uses default ontology */
  ontology?: InputMaybe<Scalars['ID']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
};

export type MeasurementInput = {
  entity: Scalars['NodeID']['input'];
  expression: Scalars['ID']['input'];
  structure: Scalars['NodeID']['input'];
  validFrom?: InputMaybe<Scalars['DateTime']['input']>;
  validTo?: InputMaybe<Scalars['DateTime']['input']>;
  value?: InputMaybe<Scalars['Metric']['input']>;
};

export enum MeasurementKind {
  Boolean = 'BOOLEAN',
  Category = 'CATEGORY',
  Datetime = 'DATETIME',
  Float = 'FLOAT',
  FourDVector = 'FOUR_D_VECTOR',
  Int = 'INT',
  NVector = 'N_VECTOR',
  OneDVector = 'ONE_D_VECTOR',
  String = 'STRING',
  ThreeDVector = 'THREE_D_VECTOR',
  TwoDVector = 'TWO_D_VECTOR'
}

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

/** A model represents a trained machine learning model that can be used for analysis. */
export type Model = {
  __typename?: 'Model';
  /** The unique identifier of the model */
  id: Scalars['ID']['output'];
  /** The name of the model */
  name: Scalars['String']['output'];
  /** Optional file storage location containing the model weights/parameters */
  store?: Maybe<MediaStore>;
};

export type ModelChange = {
  __typename?: 'ModelChange';
  field: Scalars['String']['output'];
  newValue?: Maybe<Scalars['String']['output']>;
  oldValue?: Maybe<Scalars['String']['output']>;
};

export type ModelFilter = {
  AND?: InputMaybe<ModelFilter>;
  OR?: InputMaybe<ModelFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new entity */
  createEntity: Entity;
  /** Create a new expression */
  createGenericCategory: GenericCategory;
  /** Create a new graph */
  createGraph: Graph;
  /** Create a new graph query */
  createGraphQuery: GraphQuery;
  /** Create a new graph view */
  createGraphView: GraphView;
  /** Create a new metric for an entity */
  createMeasurement: Measurement;
  /** Create a new expression */
  createMeasurementCategory: MeasurementCategory;
  /** Create a new model */
  createModel: Model;
  /** Create a new node query */
  createNodeQuery: NodeQuery;
  /** Create a new node view */
  createNodeView: NodeView;
  /** Create a new ontology */
  createOntology: Ontology;
  /** Create a new plot view */
  createPlotView: PlotView;
  /** Create a new protocol */
  createProtocol: Protocol;
  /** Create a new protocol step */
  createProtocolStep: ProtocolStep;
  /** Create a new protocol step template */
  createProtocolStepTemplate: ProtocolStepTemplate;
  /** Create a new reagent */
  createReagent: Reagent;
  /** Create a new relation between entities */
  createRelation: Relation;
  /** Create a new expression */
  createRelationCategory: RelationCategory;
  /** Create a new scatter plot */
  createScatterPlot: ScatterPlot;
  /** Create a new structure */
  createStructure: Structure;
  /** Create a new expression */
  createStructureCategory: StructureCategory;
  /** Delete an existing entity */
  deleteEntity: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteGenericCategory: Scalars['ID']['output'];
  /** Delete an existing graph */
  deleteGraph: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteMeasurementCategory: Scalars['ID']['output'];
  /** Delete an existing ontology */
  deleteOntology: Scalars['ID']['output'];
  /** Delete an existing protocol */
  deleteProtocol: Scalars['ID']['output'];
  /** Delete an existing protocol step */
  deleteProtocolStep: Scalars['ID']['output'];
  /** Delete an existing protocol step template */
  deleteProtocolStepTemplate: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteRelationCategory: Scalars['ID']['output'];
  /** Delete an existing scatter plot */
  deleteScatterPlot: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteStructureCategory: Scalars['ID']['output'];
  /** Pin or unpin a graph */
  pinGraph: Graph;
  /** Pin or unpin a graph query */
  pinGraphQuery: GraphQuery;
  /** Pin or unpin a node query */
  pinNodeQuery: NodeQuery;
  /** Request a new file upload */
  requestUpload: PresignedPostCredentials;
  /** Update an existing expression */
  updateGenericCategory: GenericCategory;
  /** Update an existing graph */
  updateGraph: Graph;
  /** Update an existing expression */
  updateMeasurementCategory: MeasurementCategory;
  /** Update an existing ontology */
  updateOntology: Ontology;
  /** Update an existing protocol step */
  updateProtocolStep: ProtocolStep;
  /** Update an existing protocol step template */
  updateProtocolStepTemplate: ProtocolStepTemplate;
  /** Update an existing expression */
  updateRelationCategory: RelationCategory;
  /** Update an existing expression */
  updateStructureCategory: StructureCategory;
};


export type MutationCreateEntityArgs = {
  input: EntityInput;
};


export type MutationCreateGenericCategoryArgs = {
  input: GenericCategoryInput;
};


export type MutationCreateGraphArgs = {
  input: GraphInput;
};


export type MutationCreateGraphQueryArgs = {
  input: GraphQueryInput;
};


export type MutationCreateGraphViewArgs = {
  input: GraphViewInput;
};


export type MutationCreateMeasurementArgs = {
  input: MeasurementInput;
};


export type MutationCreateMeasurementCategoryArgs = {
  input: MeasurementCategoryInput;
};


export type MutationCreateModelArgs = {
  input: CreateModelInput;
};


export type MutationCreateNodeQueryArgs = {
  input: NodeQueryInput;
};


export type MutationCreateNodeViewArgs = {
  input: NodeViewInput;
};


export type MutationCreateOntologyArgs = {
  input: OntologyInput;
};


export type MutationCreatePlotViewArgs = {
  input: PlotViewInput;
};


export type MutationCreateProtocolArgs = {
  input: ProtocolInput;
};


export type MutationCreateProtocolStepArgs = {
  input: ProtocolStepInput;
};


export type MutationCreateProtocolStepTemplateArgs = {
  input: ProtocolStepTemplateInput;
};


export type MutationCreateReagentArgs = {
  input: ReagentInput;
};


export type MutationCreateRelationArgs = {
  input: RelationInput;
};


export type MutationCreateRelationCategoryArgs = {
  input: RelationCategoryInput;
};


export type MutationCreateScatterPlotArgs = {
  input: ScatterPlotInput;
};


export type MutationCreateStructureArgs = {
  input: StructureInput;
};


export type MutationCreateStructureCategoryArgs = {
  input: StructureCategoryInput;
};


export type MutationDeleteEntityArgs = {
  input: DeleteEntityInput;
};


export type MutationDeleteGenericCategoryArgs = {
  input: DeleteGenericCategoryInput;
};


export type MutationDeleteGraphArgs = {
  input: DeleteGraphInput;
};


export type MutationDeleteMeasurementCategoryArgs = {
  input: DeleteMeasurementCategoryInput;
};


export type MutationDeleteOntologyArgs = {
  input: DeleteOntologyInput;
};


export type MutationDeleteProtocolArgs = {
  input: DeleteProtocolInput;
};


export type MutationDeleteProtocolStepArgs = {
  input: DeleteProtocolStepInput;
};


export type MutationDeleteProtocolStepTemplateArgs = {
  input: DeleteProtocolStepTemplateInput;
};


export type MutationDeleteRelationCategoryArgs = {
  input: DeleteRelationCategoryInput;
};


export type MutationDeleteScatterPlotArgs = {
  input: DeleteScatterPlotInput;
};


export type MutationDeleteStructureCategoryArgs = {
  input: DeleteStructureCategoryInput;
};


export type MutationPinGraphArgs = {
  input: PinGraphInput;
};


export type MutationPinGraphQueryArgs = {
  input: PinGraphQueryInput;
};


export type MutationPinNodeQueryArgs = {
  input: PinNodeQueryInput;
};


export type MutationRequestUploadArgs = {
  input: RequestMediaUploadInput;
};


export type MutationUpdateGenericCategoryArgs = {
  input: UpdateGenericCategoryInput;
};


export type MutationUpdateGraphArgs = {
  input: UpdateGraphInput;
};


export type MutationUpdateMeasurementCategoryArgs = {
  input: UpdateMeasurementCategoryInput;
};


export type MutationUpdateOntologyArgs = {
  input: UpdateOntologyInput;
};


export type MutationUpdateProtocolStepArgs = {
  input: UpdateProtocolStepInput;
};


export type MutationUpdateProtocolStepTemplateArgs = {
  input: UpdateProtocolStepTemplateInput;
};


export type MutationUpdateRelationCategoryArgs = {
  input: UpdateRelationCategoryInput;
};


export type MutationUpdateStructureCategoryArgs = {
  input: UpdateStructureCategoryInput;
};

export type Node = {
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  graph: Graph;
  /** The unique identifier of the entity within its graph */
  graphId: Scalars['ID']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
  nodeViews: Array<NodeView>;
  /** Protocol steps where this entity was the target */
  pinnedViews: Array<NodeView>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
};


export type NodeEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};

export type NodeCategory = {
  /** The color of the node in the graph */
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** The height of the node in the graph */
  height?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The unique identifier of the expression within its graph */
  instanceKind: InstanceKind;
  /** The x position of the node in the graph */
  positionX?: Maybe<Scalars['Float']['output']>;
  /** The y position of the node in the graph */
  positionY?: Maybe<Scalars['Float']['output']>;
  /** The width of the node in the graph */
  width?: Maybe<Scalars['Float']['output']>;
};

/** A view of a node entities and relations. */
export type NodeQuery = {
  __typename?: 'NodeQuery';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kind: ViewKind;
  name: Scalars['String']['output'];
  ontology: Ontology;
  pinned: Scalars['Boolean']['output'];
  query: Scalars['String']['output'];
  relevantFor: Array<Category>;
};

export type NodeQueryFilter = {
  AND?: InputMaybe<NodeQueryFilter>;
  OR?: InputMaybe<NodeQueryFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type NodeQueryInput = {
  /** The allowed entitie classes for this query */
  allowedEntities?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** The columns (if ViewKind is Table) */
  columns?: InputMaybe<Array<ColumnInput>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The kind/type of this expression */
  kind: ViewKind;
  /** The label/name of the expression */
  name: Scalars['String']['input'];
  /** The ID of the ontology this expression belongs to. If not provided, uses default ontology */
  ontology?: InputMaybe<Scalars['ID']['input']>;
  /** The label/name of the expression */
  query: Scalars['Cypher']['input'];
  /** The node to test against */
  testAgainst?: InputMaybe<Scalars['ID']['input']>;
};

/** A view of a graph, that contains entities and relations. */
export type NodeView = {
  __typename?: 'NodeView';
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  node: Node;
  query: NodeQuery;
  render: PairsPathTable;
};

export type NodeViewFilter = {
  AND?: InputMaybe<NodeViewFilter>;
  OR?: InputMaybe<NodeViewFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type NodeViewInput = {
  node: Scalars['ID']['input'];
  query: Scalars['ID']['input'];
};

export type OffsetPaginationInput = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

/**
 * An ontology represents a formal naming and definition of types, properties, and
 *     interrelationships between entities in a specific domain. In kraph, ontologies provide the vocabulary
 *     and semantic structure for organizing data across graphs.
 */
export type Ontology = {
  __typename?: 'Ontology';
  /** A detailed description of what this ontology represents and how it should be used */
  description?: Maybe<Scalars['String']['output']>;
  edgeCategories: Array<EdgeCategory>;
  /** The list of expressions (terms/concepts) defined in this ontology */
  expressions: Array<Expression>;
  /** The list of generic expressions defined in this ontology */
  genericCategories: Array<GenericCategory>;
  /** The list of graph queries defined in this ontology */
  graphQueries: Array<GraphQuery>;
  /** The list of graphs defined in this ontology */
  graphs: Array<Graph>;
  /** The unique identifier of the ontology */
  id: Scalars['ID']['output'];
  /** The list of measurement exprdessions defined in this ontology */
  measurementCategories: Array<MeasurementCategory>;
  /** The name of the ontology */
  name: Scalars['String']['output'];
  nodeCategories: Array<NodeCategory>;
  /** The list of node queries defined in this ontology */
  nodeQueries: Array<NodeQuery>;
  /** The Persistent URL (PURL) that uniquely identifies this ontology globally */
  purl?: Maybe<Scalars['String']['output']>;
  /** The list of relation expressions defined in this ontology */
  relationCategories: Array<RelationCategory>;
  /** Optional associated media files like documentation or diagrams */
  store?: Maybe<MediaStore>;
  /** The list of structure expressions defined in this ontology */
  structureCategories: Array<StructureCategory>;
};


/**
 * An ontology represents a formal naming and definition of types, properties, and
 *     interrelationships between entities in a specific domain. In kraph, ontologies provide the vocabulary
 *     and semantic structure for organizing data across graphs.
 */
export type OntologyEdgeCategoriesArgs = {
  filters?: InputMaybe<ExpressionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/**
 * An ontology represents a formal naming and definition of types, properties, and
 *     interrelationships between entities in a specific domain. In kraph, ontologies provide the vocabulary
 *     and semantic structure for organizing data across graphs.
 */
export type OntologyExpressionsArgs = {
  filters?: InputMaybe<ExpressionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/**
 * An ontology represents a formal naming and definition of types, properties, and
 *     interrelationships between entities in a specific domain. In kraph, ontologies provide the vocabulary
 *     and semantic structure for organizing data across graphs.
 */
export type OntologyGenericCategoriesArgs = {
  filters?: InputMaybe<GenericCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/**
 * An ontology represents a formal naming and definition of types, properties, and
 *     interrelationships between entities in a specific domain. In kraph, ontologies provide the vocabulary
 *     and semantic structure for organizing data across graphs.
 */
export type OntologyGraphQueriesArgs = {
  filters?: InputMaybe<GraphQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/**
 * An ontology represents a formal naming and definition of types, properties, and
 *     interrelationships between entities in a specific domain. In kraph, ontologies provide the vocabulary
 *     and semantic structure for organizing data across graphs.
 */
export type OntologyGraphsArgs = {
  filters?: InputMaybe<GraphFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/**
 * An ontology represents a formal naming and definition of types, properties, and
 *     interrelationships between entities in a specific domain. In kraph, ontologies provide the vocabulary
 *     and semantic structure for organizing data across graphs.
 */
export type OntologyMeasurementCategoriesArgs = {
  filters?: InputMaybe<MeasurementCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/**
 * An ontology represents a formal naming and definition of types, properties, and
 *     interrelationships between entities in a specific domain. In kraph, ontologies provide the vocabulary
 *     and semantic structure for organizing data across graphs.
 */
export type OntologyNodeCategoriesArgs = {
  filters?: InputMaybe<ExpressionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/**
 * An ontology represents a formal naming and definition of types, properties, and
 *     interrelationships between entities in a specific domain. In kraph, ontologies provide the vocabulary
 *     and semantic structure for organizing data across graphs.
 */
export type OntologyNodeQueriesArgs = {
  filters?: InputMaybe<NodeQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/**
 * An ontology represents a formal naming and definition of types, properties, and
 *     interrelationships between entities in a specific domain. In kraph, ontologies provide the vocabulary
 *     and semantic structure for organizing data across graphs.
 */
export type OntologyRelationCategoriesArgs = {
  filters?: InputMaybe<RelationCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/**
 * An ontology represents a formal naming and definition of types, properties, and
 *     interrelationships between entities in a specific domain. In kraph, ontologies provide the vocabulary
 *     and semantic structure for organizing data across graphs.
 */
export type OntologyStructureCategoriesArgs = {
  filters?: InputMaybe<StructureCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Input type for creating a new ontology node */
export type OntologyEdgeInput = {
  /** The AGE_NAME of the ontology */
  ageName: Scalars['String']['input'];
  /** The allowed structures for the measurement edge */
  allowedStructures?: InputMaybe<Array<Scalars['StructureIdentifier']['input']>>;
  /** An optional description of the ontology node */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Whether the edge is self-referential or needs a different source than target */
  isSelfReferential?: InputMaybe<Scalars['Boolean']['input']>;
  /** The kind of the ontology node */
  kind: OntologyEdgeKind;
  /** The kind of the value for the ontology edge */
  measurementKind?: InputMaybe<MeasurementKind>;
  /** The name of the ontology node (will be converted to snake_case) */
  name: Scalars['String']['input'];
  /** An optional PURL (Persistent URL) for the ontology node */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the source ontology node */
  source: Scalars['ID']['input'];
  /** The ID of the target ontology node */
  target: Scalars['ID']['input'];
};

export enum OntologyEdgeKind {
  Measurement = 'MEASUREMENT',
  Relation = 'RELATION'
}

/** Filter for ontologies */
export type OntologyFilter = {
  AND?: InputMaybe<OntologyFilter>;
  OR?: InputMaybe<OntologyFilter>;
  /** Filter by ontology ID */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input type for creating a new ontology */
export type OntologyInput = {
  /** An optional description of the ontology */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional ID reference to an associated image */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The name of the ontology (will be converted to snake_case) */
  name: Scalars['String']['input'];
  /** An optional PURL (Persistent URL) for the ontology */
  purl?: InputMaybe<Scalars['String']['input']>;
};

/** Input type for creating a new ontology node */
export type OntologyNodeInput = {
  /** The AGE_NAME of the ontology */
  ageName: Scalars['String']['input'];
  /** An optional RGBA color for the ontology node */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** An optional description of the ontology node */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** An optional identifier for the ontology node */
  identifier?: InputMaybe<Scalars['StructureIdentifier']['input']>;
  /** An optional ID reference to an associated image */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The kind of the ontology node */
  kind: OntologyNodeKind;
  /** The label of the ontdology node */
  label: Scalars['String']['input'];
  /** The name of the ontology node (will be converted to snake_case) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** An optional PURL (Persistent URL) for the ontology node */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

export enum OntologyNodeKind {
  Entity = 'ENTITY',
  Structure = 'STRUCTURE'
}

/** A paired structure two entities and the relation between them. */
export type Pair = {
  __typename?: 'Pair';
  /** The relation between the two entities. */
  edge: Edge;
  /** The left entity. */
  left: Node;
  /** The right entity. */
  right: Node;
};

/** A collection of paired entities. */
export type Pairs = {
  __typename?: 'Pairs';
  /** The graph this table was queried from. */
  graph: Graph;
  /** The paired entities. */
  pairs: Array<Pair>;
};

export type PairsPathTable = Pairs | Path | Table;

export type Path = {
  __typename?: 'Path';
  edges: Array<Edge>;
  nodes: Array<Node>;
};

export type PinGraphInput = {
  id: Scalars['ID']['input'];
  pinned: Scalars['Boolean']['input'];
};

export type PinGraphQueryInput = {
  id: Scalars['ID']['input'];
  pinned: Scalars['Boolean']['input'];
};

export type PinNodeQueryInput = {
  id: Scalars['ID']['input'];
  pinned: Scalars['Boolean']['input'];
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

/** A view of a graph, that contains entities and relations. */
export type PlotView = {
  __typename?: 'PlotView';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  plot: ScatterPlot;
  view: GraphView;
};

export type PlotViewFilter = {
  AND?: InputMaybe<PlotViewFilter>;
  OR?: InputMaybe<PlotViewFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type PlotViewInput = {
  plot: Scalars['ID']['input'];
  view: Scalars['ID']['input'];
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
  name: Scalars['String']['output'];
};


export type ProtocolHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ProtocolFilter = {
  AND?: InputMaybe<ProtocolFilter>;
  OR?: InputMaybe<ProtocolFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ProtocolInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  experiment: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type ProtocolStep = {
  __typename?: 'ProtocolStep';
  forEntity?: Maybe<Entity>;
  forReagent?: Maybe<Reagent>;
  history: Array<History>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  performedAt?: Maybe<Scalars['DateTime']['output']>;
  performedBy?: Maybe<User>;
  reagentMappings: Array<ReagentMapping>;
  template: ProtocolStepTemplate;
  usedEntity?: Maybe<Entity>;
};


export type ProtocolStepHistoryArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ProtocolStepReagentMappingsArgs = {
  filters?: InputMaybe<ProtocolStepFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ProtocolStepFilter = {
  AND?: InputMaybe<ProtocolStepFilter>;
  OR?: InputMaybe<ProtocolStepFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  protocol?: InputMaybe<Scalars['ID']['input']>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input type for creating a new protocol step */
export type ProtocolStepInput = {
  /** ID of the entity this step is performed on */
  entity: Scalars['ID']['input'];
  /** When the step was performed */
  performedAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** ID of the user who performed the step */
  performedBy?: InputMaybe<Scalars['ID']['input']>;
  /** List of reagent mappings */
  reagentMappings: Array<ReagentMappingInput>;
  /** ID of the protocol step template */
  template: Scalars['ID']['input'];
  /** List of variable mappings */
  valueMappings: Array<VariableInput>;
};

export type ProtocolStepTemplate = {
  __typename?: 'ProtocolStepTemplate';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  plateChildren: Array<Scalars['UntypedPlateChild']['output']>;
};

export type ProtocolStepTemplateFilter = {
  AND?: InputMaybe<ProtocolStepTemplateFilter>;
  OR?: InputMaybe<ProtocolStepTemplateFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ProtocolStepTemplateInput = {
  name: Scalars['String']['input'];
  plateChildren: Array<PlateChildInput>;
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  edge: Edge;
  edgeCategories: Array<EdgeCategory>;
  edgeCategory: EdgeCategory;
  /** List of all relationships between entities */
  edges: Array<Edge>;
  expression: Expression;
  /** List of all expressions in the system */
  expressions: Array<Expression>;
  /** List of all generic categories */
  genericCategories: Array<GenericCategory>;
  genericCategory: GenericCategory;
  graph: Graph;
  /** List of all graph queries */
  graphQueries: Array<GraphQuery>;
  graphQuery: GraphQuery;
  graphView: GraphView;
  /** List of all graph views */
  graphViews: Array<GraphView>;
  /** List of all knowledge graphs */
  graphs: Array<Graph>;
  /** List of all measurement categories */
  measurementCategories: Array<MeasurementCategory>;
  measurementCategory: MeasurementCategory;
  model: Model;
  /** List of all deep learning models (e.g. neural networks) */
  models: Array<Model>;
  myActiveGraph: Graph;
  node: Node;
  nodeCategories: Array<NodeCategory>;
  nodeCategory: NodeCategory;
  /** List of all node queries */
  nodeQueries: Array<NodeQuery>;
  nodeQuery: NodeQuery;
  nodeView: NodeView;
  /** List of all node views */
  nodeViews: Array<NodeView>;
  /** List of all entities in the system */
  nodes: Array<Entity>;
  /** List of all ontologies */
  ontologies: Array<Ontology>;
  ontology: Ontology;
  plotView: PlotView;
  /** List of all plot views */
  plotViews: Array<PlotView>;
  protocol: Protocol;
  protocolStep: ProtocolStep;
  protocolStepTemplate: ProtocolStepTemplate;
  /** List of all protocol step templates */
  protocolStepTemplates: Array<ProtocolStepTemplate>;
  /** List of all protocol steps */
  protocolSteps: Array<ProtocolStep>;
  /** List of all protocols */
  protocols: Array<Protocol>;
  reagent: Reagent;
  /** List of all reagents used in protocols */
  reagents: Array<Reagent>;
  /** List of all relation categories */
  relationCategories: Array<RelationCategory>;
  relationCategory: RelationCategory;
  scatterPlot: ScatterPlot;
  /** List of all scatter plots */
  scatterPlots: Array<ScatterPlot>;
  /** Gets a specific structure e.g an image, video, or 3D model */
  structure: Structure;
  /** List of all structure categories */
  structureCategories: Array<StructureCategory>;
  structureCategory: StructureCategory;
};


export type QueryCategoriesArgs = {
  input: OffsetPaginationInput;
};


export type QueryEdgeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEdgeCategoriesArgs = {
  input: OffsetPaginationInput;
};


export type QueryEdgeCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEdgesArgs = {
  filters?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryExpressionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExpressionsArgs = {
  filters?: InputMaybe<ExpressionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryGenericCategoriesArgs = {
  filters?: InputMaybe<GenericCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryGenericCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphQueriesArgs = {
  filters?: InputMaybe<GraphQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryGraphQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphViewArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphViewsArgs = {
  filters?: InputMaybe<GraphViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryGraphsArgs = {
  filters?: InputMaybe<GraphFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMeasurementCategoriesArgs = {
  filters?: InputMaybe<MeasurementCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMeasurementCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryModelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryModelsArgs = {
  filters?: InputMaybe<ModelFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodeCategoriesArgs = {
  input: OffsetPaginationInput;
};


export type QueryNodeCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodeQueriesArgs = {
  filters?: InputMaybe<NodeQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryNodeQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodeViewArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodeViewsArgs = {
  filters?: InputMaybe<NodeViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryNodesArgs = {
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryOntologiesArgs = {
  filters?: InputMaybe<OntologyFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryOntologyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlotViewArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlotViewsArgs = {
  filters?: InputMaybe<PlotViewFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryProtocolArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProtocolStepArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProtocolStepTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProtocolStepTemplatesArgs = {
  filters?: InputMaybe<ProtocolStepTemplateFilter>;
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


export type QueryReagentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReagentsArgs = {
  filters?: InputMaybe<ReagentFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRelationCategoriesArgs = {
  filters?: InputMaybe<RelationCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRelationCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScatterPlotArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScatterPlotsArgs = {
  filters?: InputMaybe<ScatterPlotFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStructureArgs = {
  graph?: InputMaybe<Scalars['ID']['input']>;
  identifier: Scalars['StructureIdentifier']['input'];
  object: Scalars['ID']['input'];
};


export type QueryStructureCategoriesArgs = {
  filters?: InputMaybe<StructureCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStructureCategoryArgs = {
  id: Scalars['ID']['input'];
};

export type Reagent = {
  __typename?: 'Reagent';
  creationSteps: Array<ProtocolStep>;
  expression?: Maybe<Expression>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  lotId: Scalars['String']['output'];
  orderId?: Maybe<Scalars['String']['output']>;
  protocol?: Maybe<Protocol>;
  usedIn: Array<ReagentMapping>;
};


export type ReagentCreationStepsArgs = {
  filters?: InputMaybe<ProtocolStepFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type ReagentUsedInArgs = {
  filters?: InputMaybe<ProtocolStepFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ReagentFilter = {
  AND?: InputMaybe<ReagentFilter>;
  OR?: InputMaybe<ReagentFilter>;
  /** Filter by list of reagent IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search reagents by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ReagentInput = {
  expression: Scalars['ID']['input'];
  lotId: Scalars['String']['input'];
};

export type ReagentMapping = {
  __typename?: 'ReagentMapping';
  id: Scalars['ID']['output'];
  protocolStep: ProtocolStep;
  reagent: Reagent;
};

/** Input type for mapping reagents to protocol steps */
export type ReagentMappingInput = {
  /** ID of the reagent to map */
  reagent: Scalars['ID']['input'];
  /** Volume of the reagent in microliters */
  volume: Scalars['Int']['input'];
};

/**
 * A relation is an edge between two entities. It is a directed edge, that connects two entities and established a relationship
 *                  that is not a measurement between them. I.e. when they are an subjective assertion about the entities.
 *
 *
 *
 *
 */
export type Relation = Edge & {
  __typename?: 'Relation';
  category: RelationCategory;
  /** When this entity was created */
  createdAt: Scalars['DateTime']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  inferedBy: Edge;
  label: Scalars['String']['output'];
  leftId: Scalars['String']['output'];
  rightId: Scalars['String']['output'];
  /** Timestamp from when this entity is valid */
  validFrom: Scalars['DateTime']['output'];
  /** Timestamp until when this entity is valid */
  validTo: Scalars['DateTime']['output'];
};

export type RelationCategory = Category & EdgeCategory & {
  __typename?: 'RelationCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  /** The unique identifier of the expression within its graph */
  label: Scalars['String']['output'];
  left: NodeCategory;
  /** The ontology the expression belongs to. */
  ontology: Ontology;
  right: NodeCategory;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
};

export type RelationCategoryFilter = {
  AND?: InputMaybe<RelationCategoryFilter>;
  OR?: InputMaybe<RelationCategoryFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  ontology?: InputMaybe<Scalars['ID']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type RelationCategoryInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['RemoteUpload']['input']>;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** The ID of the ontology this expression belongs to. If not provided, uses default ontology */
  ontology?: InputMaybe<Scalars['ID']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
};

/** Input type for creating a relation between two entities */
export type RelationInput = {
  /** ID of the relation kind (LinkedExpression) */
  kind: Scalars['ID']['input'];
  /** ID of the left entity (format: graph:id) */
  left: Scalars['ID']['input'];
  /** ID of the right entity (format: graph:id) */
  right: Scalars['ID']['input'];
};

export type RequestMediaUploadInput = {
  datalayer: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

/** A scatter plot of a table graph, that contains entities and relations. */
export type ScatterPlot = {
  __typename?: 'ScatterPlot';
  colorColumn?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  graph: GraphQuery;
  id: Scalars['ID']['output'];
  idColumn: Scalars['String']['output'];
  name: Scalars['String']['output'];
  shapeColumn?: Maybe<Scalars['String']['output']>;
  sizeColumn?: Maybe<Scalars['String']['output']>;
  xColumn: Scalars['String']['output'];
  yColumn: Scalars['String']['output'];
};

export type ScatterPlotFilter = {
  AND?: InputMaybe<ScatterPlotFilter>;
  OR?: InputMaybe<ScatterPlotFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type ScatterPlotInput = {
  /** The column to use for the color of the points */
  colorColumn?: InputMaybe<Scalars['String']['input']>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The column to use for the ID of the points */
  idColumn: Scalars['String']['input'];
  /** The label/name of the expression */
  name: Scalars['String']['input'];
  /** The query to use */
  query: Scalars['ID']['input'];
  /** The column to use for the shape of the points */
  shapeColumn?: InputMaybe<Scalars['String']['input']>;
  /** The column to use for the size of the points */
  sizeColumn?: InputMaybe<Scalars['String']['input']>;
  /** The graph to test against */
  testAgainst?: InputMaybe<Scalars['ID']['input']>;
  /** The column to use for the x-axis */
  xColumn: Scalars['String']['input'];
  /** The column to use for the x-axis ID (node, or edge) */
  xIdColumn?: InputMaybe<Scalars['String']['input']>;
  /** The column to use for the y-axis */
  yColumn: Scalars['String']['input'];
  /** The column to use for the y-axis ID (node, or edge) */
  yIdColumn?: InputMaybe<Scalars['String']['input']>;
};

/** A Structure is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type Structure = Node & {
  __typename?: 'Structure';
  /** Protocol steps where this entity was the target */
  category: StructureCategory;
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  graph: Graph;
  /** The unique identifier of the entity within its graph */
  graphId: Scalars['ID']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  /** The unique identifier of the entity within its graph */
  identifier: Scalars['String']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
  nodeViews: Array<NodeView>;
  /** The expression that defines this entity's type */
  object: Scalars['String']['output'];
  /** Protocol steps where this entity was the target */
  pinnedViews: Array<NodeView>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
};


/** A Structure is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type StructureEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};

export type StructureCategory = Category & NodeCategory & {
  __typename?: 'StructureCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  /** The color of the node in the graph */
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The height of the node in the graph */
  height?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The structure that this class represents */
  identifier: Scalars['String']['output'];
  /** The unique identifier of the expression within its graph */
  instanceKind: InstanceKind;
  /** The kind of expression */
  kind: ExpressionKind;
  /** The unique identifier of the expression within its graph */
  label: Scalars['String']['output'];
  /** The ontology the expression belongs to. */
  ontology: Ontology;
  /** The x position of the node in the graph */
  positionX?: Maybe<Scalars['Float']['output']>;
  /** The y position of the node in the graph */
  positionY?: Maybe<Scalars['Float']['output']>;
  relevantQueries: Array<GraphQuery>;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The width of the node in the graph */
  width?: Maybe<Scalars['Float']['output']>;
};

export type StructureCategoryFilter = {
  AND?: InputMaybe<StructureCategoryFilter>;
  OR?: InputMaybe<StructureCategoryFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  ontology?: InputMaybe<Scalars['ID']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type StructureCategoryInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The label/name of the expression */
  identifier: Scalars['StructureIdentifier']['input'];
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['RemoteUpload']['input']>;
  /** The ID of the ontology this expression belongs to. If not provided, uses default ontology */
  ontology?: InputMaybe<Scalars['ID']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
};

export type StructureInput = {
  createDefaultView?: Scalars['Boolean']['input'];
  graph?: InputMaybe<Scalars['ID']['input']>;
  structure: Scalars['StructureString']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  historyEvents: Entity;
};


export type SubscriptionHistoryEventsArgs = {
  user: Scalars['String']['input'];
};

/** A collection of paired entities. */
export type Table = {
  __typename?: 'Table';
  /** The columns describind this table. */
  columns: Array<Column>;
  /** The graph this table was queried from. */
  graph: Graph;
  /** The paired entities. */
  rows: Array<Scalars['Any']['output']>;
};

/** Input for updating an existing generic category */
export type UpdateGenericCategoryInput = {
  /** New RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** New description for the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the expression to update */
  id: Scalars['ID']['input'];
  /** New image ID for the expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** New label for the generic category */
  label?: InputMaybe<Scalars['String']['input']>;
  /** New permanent URL for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGraphInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  experiment?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an existing expression */
export type UpdateMeasurementCategoryInput = {
  /** New RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** New description for the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the expression to update */
  id: Scalars['ID']['input'];
  /** New image ID for the expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** New label for the expression */
  label?: InputMaybe<Scalars['String']['input']>;
  /** New permanent URL for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
};

/** Input type for updating an existing ontology */
export type UpdateOntologyInput = {
  /** New description for the ontology */
  description?: InputMaybe<Scalars['String']['input']>;
  /** New edges for the ontology */
  edges?: InputMaybe<Array<OntologyEdgeInput>>;
  /** The ID of the ontology to update */
  id: Scalars['ID']['input'];
  /** New ID reference to an associated image */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** New name for the ontology (will be converted to snake_case) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** New nodes for the ontology */
  nodes?: InputMaybe<Array<OntologyNodeInput>>;
  /** New PURL (Persistent URL) for the ontology */
  purl?: InputMaybe<Scalars['String']['input']>;
};

/** Input type for updating an existing protocol step */
export type UpdateProtocolStepInput = {
  /** ID of the protocol step to update */
  id: Scalars['ID']['input'];
  /** New name for the protocol step */
  name: Scalars['String']['input'];
  /** When the step was performed */
  performedAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** ID of the user who performed the step */
  performedBy?: InputMaybe<Scalars['ID']['input']>;
  /** Updated list of reagent mappings */
  reagentMappings: Array<ReagentMappingInput>;
  /** ID of the new protocol step template */
  template: Scalars['ID']['input'];
  /** Updated list of variable mappings */
  valueMappings: Array<VariableInput>;
};

export type UpdateProtocolStepTemplateInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  plateChildren: Array<PlateChildInput>;
};

/** Input for updating an existing expression */
export type UpdateRelationCategoryInput = {
  /** New RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** New description for the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the expression to update */
  id: Scalars['ID']['input'];
  /** New image ID for the expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** New label for the expression */
  label?: InputMaybe<Scalars['String']['input']>;
  /** New permanent URL for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an existing expression */
export type UpdateStructureCategoryInput = {
  /** New RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** New description for the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the expression to update */
  id: Scalars['ID']['input'];
  /** The label/name of the expression */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** New image ID for the expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** New label for the expression */
  label?: InputMaybe<Scalars['String']['input']>;
  /** New permanent URL for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
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

/** Input type for mapping variables to protocol steps */
export type VariableInput = {
  /** Key of the variable */
  key: Scalars['String']['input'];
  /** Value of the variable */
  value: Scalars['String']['input'];
};

export enum ViewKind {
  FloatMetric = 'FLOAT_METRIC',
  IntMetric = 'INT_METRIC',
  Pairs = 'PAIRS',
  Path = 'PATH',
  Table = 'TABLE'
}

type BaseCategory_GenericCategory_Fragment = { __typename?: 'GenericCategory', id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

type BaseCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

type BaseCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

type BaseCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

export type BaseCategoryFragment = BaseCategory_GenericCategory_Fragment | BaseCategory_MeasurementCategory_Fragment | BaseCategory_RelationCategory_Fragment | BaseCategory_StructureCategory_Fragment;

type BaseNodeCategory_GenericCategory_Fragment = { __typename?: 'GenericCategory', id: string };

type BaseNodeCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string };

export type BaseNodeCategoryFragment = BaseNodeCategory_GenericCategory_Fragment | BaseNodeCategory_StructureCategory_Fragment;

type BaseEdgeCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

type BaseEdgeCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

export type BaseEdgeCategoryFragment = BaseEdgeCategory_MeasurementCategory_Fragment | BaseEdgeCategory_RelationCategory_Fragment;

export type MeasurementCategoryFragment = { __typename?: 'MeasurementCategory', metricKind: MeasurementKind, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

export type RelationCategoryFragment = { __typename?: 'RelationCategory', id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

export type StructureCategoryFragment = { __typename?: 'StructureCategory', identifier: string, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

export type GenericCategoryFragment = { __typename?: 'GenericCategory', instanceKind: InstanceKind, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

type NodeCategory_GenericCategory_Fragment = { __typename?: 'GenericCategory', instanceKind: InstanceKind, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

type NodeCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', identifier: string, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

export type NodeCategoryFragment = NodeCategory_GenericCategory_Fragment | NodeCategory_StructureCategory_Fragment;

type EdgeCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', metricKind: MeasurementKind, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

type EdgeCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

export type EdgeCategoryFragment = EdgeCategory_MeasurementCategory_Fragment | EdgeCategory_RelationCategory_Fragment;

export type PresignedPostCredentialsFragment = { __typename?: 'PresignedPostCredentials', xAmzAlgorithm: string, xAmzCredential: string, xAmzDate: string, xAmzSignature: string, key: string, bucket: string, datalayer: string, policy: string, store: string };

type Edge_ComputedMeasurement_Fragment = { __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string };

type Edge_Measurement_Fragment = { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any };

type Edge_Relation_Fragment = { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string };

export type EdgeFragment = Edge_ComputedMeasurement_Fragment | Edge_Measurement_Fragment | Edge_Relation_Fragment;

export type EntityFragment = { __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> };

export type ListEntityFragment = { __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string } };

export type EntityGraphNodeFragment = { __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', color?: Array<number> | null } };

export type GraphFragment = { __typename?: 'Graph', id: string, name: string, pinned: boolean, description?: string | null, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, ontology: { __typename?: 'Ontology', id: string, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string }> }, graphViews: Array<{ __typename?: 'GraphView', id: string, label: string }>, nodeViews: Array<{ __typename?: 'NodeView', id: string, label: string }>, plotViews: Array<{ __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } }> };

export type ListGraphFragment = { __typename?: 'Graph', id: string, name: string, pinned: boolean };

export type DetailGraphQueryFragment = { __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, ontology: { __typename?: 'Ontology', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string }> };

export type ListGraphQueryFragment = { __typename?: 'GraphQuery', id: string, name: string, description?: string | null, pinned: boolean };

export type GraphViewFragment = { __typename?: 'GraphView', id: string, label: string, graph: { __typename?: 'Graph', id: string, name: string }, query: { __typename?: 'GraphQuery', id: string, name: string, query: string }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', left: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any }, right: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } }, plotViews: Array<{ __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } }> };

export type ListGraphViewFragment = { __typename?: 'GraphView', id: string, label: string };

type BaseListCategory_GenericCategory_Fragment = { __typename?: 'GenericCategory', id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

type BaseListCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

type BaseListCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

type BaseListCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

export type BaseListCategoryFragment = BaseListCategory_GenericCategory_Fragment | BaseListCategory_MeasurementCategory_Fragment | BaseListCategory_RelationCategory_Fragment | BaseListCategory_StructureCategory_Fragment;

type BaseListNodeCategory_GenericCategory_Fragment = { __typename?: 'GenericCategory', id: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null };

type BaseListNodeCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null };

export type BaseListNodeCategoryFragment = BaseListNodeCategory_GenericCategory_Fragment | BaseListNodeCategory_StructureCategory_Fragment;

type BaseListEdgeCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

type BaseListEdgeCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

export type BaseListEdgeCategoryFragment = BaseListEdgeCategory_MeasurementCategory_Fragment | BaseListEdgeCategory_RelationCategory_Fragment;

export type ListMeasurementCategoryFragment = { __typename?: 'MeasurementCategory', metricKind: MeasurementKind, id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

export type ListRelationCategoryFragment = { __typename?: 'RelationCategory', id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

export type ListStructureCategoryFragment = { __typename?: 'StructureCategory', identifier: string, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

export type ListGenericCategoryFragment = { __typename?: 'GenericCategory', instanceKind: InstanceKind, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

type ListNodeCategory_GenericCategory_Fragment = { __typename?: 'GenericCategory', instanceKind: InstanceKind, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

type ListNodeCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', identifier: string, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null };

export type ListNodeCategoryFragment = ListNodeCategory_GenericCategory_Fragment | ListNodeCategory_StructureCategory_Fragment;

type ListEdgeCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', metricKind: MeasurementKind, id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

type ListEdgeCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } };

export type ListEdgeCategoryFragment = ListEdgeCategory_MeasurementCategory_Fragment | ListEdgeCategory_RelationCategory_Fragment;

export type MeasurementFragment = { __typename?: 'Measurement', id: any, value: any };

type Node_Entity_Fragment = { __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> };

type Node_Structure_Fragment = { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } };

export type NodeFragment = Node_Entity_Fragment | Node_Structure_Fragment;

type DetailNode_Entity_Fragment = { __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string, name: string, ontology: { __typename?: 'Ontology', nodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, description?: string | null, pinned: boolean }> } }, nodeViews: Array<{ __typename?: 'NodeView', id: string, label: string }>, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> };

type DetailNode_Structure_Fragment = { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, graph: { __typename?: 'Graph', id: string, name: string, ontology: { __typename?: 'Ontology', nodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, description?: string | null, pinned: boolean }> } }, nodeViews: Array<{ __typename?: 'NodeView', id: string, label: string }>, category: { __typename?: 'StructureCategory', identifier: string } };

export type DetailNodeFragment = DetailNode_Entity_Fragment | DetailNode_Structure_Fragment;

type ListNode_Entity_Fragment = { __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> };

type ListNode_Structure_Fragment = { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } };

export type ListNodeFragment = ListNode_Entity_Fragment | ListNode_Structure_Fragment;

export type DetailNodeQueryFragment = { __typename?: 'NodeQuery', name: string, query: string };

export type ListNodeQueryFragment = { __typename?: 'NodeQuery', id: string, name: string, description?: string | null, pinned: boolean };

export type NodeViewFragment = { __typename?: 'NodeView', id: string, label: string, node: { __typename?: 'Entity', id: any, graphId: string } | { __typename?: 'Structure', id: any, graphId: string }, query: { __typename?: 'NodeQuery', id: string, name: string, query: string }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', left: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any }, right: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } };

export type ListNodeViewFragment = { __typename?: 'NodeView', id: string, label: string };

export type OntologyFragment = { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null }>, genericCategories: Array<{ __typename?: 'GenericCategory', instanceKind: InstanceKind, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null }>, relationCategories: Array<{ __typename?: 'RelationCategory', id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', metricKind: MeasurementKind, id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null, graphs: Array<{ __typename?: 'Graph', id: string, name: string, pinned: boolean }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, description?: string | null, pinned: boolean }>, nodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, description?: string | null, pinned: boolean }> };

export type ListOntologyFragment = { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null };

export type PairsFragment = { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', left: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any }, right: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any } }> };

export type PathFragment = { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> };

export type PlotViewFragment = { __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } };

export type CarouselPlotViewFragment = { __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } };

export type ListPlotViewFragment = { __typename?: 'PlotView', id: string, name: string, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } };

export type ProtocolFragment = { __typename?: 'Protocol', id: string, name: string, description?: string | null, experiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null } };

export type ListProtocolFragment = { __typename?: 'Protocol', id: string, name: string, experiment: { __typename?: 'Experiment', id: string, name: string } };

export type ProtocolStepFragment = { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, template: { __typename?: 'ProtocolStepTemplate', name: string, plateChildren: Array<any> }, forReagent?: { __typename?: 'Reagent', id: string } | null, forEntity?: { __typename?: 'Entity', id: any } | null, performedBy?: { __typename?: 'User', id: string } | null };

export type ListProtocolStepFragment = { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, performedBy?: { __typename?: 'User', id: string } | null };

export type ProtocolStepTemplateFragment = { __typename?: 'ProtocolStepTemplate', id: string, name: string, plateChildren: Array<any> };

export type ListProtocolStepTemplateFragment = { __typename?: 'ProtocolStepTemplate', id: string, name: string, plateChildren: Array<any> };

export type ReagentFragment = { __typename?: 'Reagent', id: string, label: string, creationSteps: Array<{ __typename?: 'ProtocolStep', id: string, name: string }>, usedIn: Array<{ __typename?: 'ReagentMapping', id: string, protocolStep: { __typename?: 'ProtocolStep', performedAt?: any | null, name: string } }> };

export type ListReagentFragment = { __typename?: 'Reagent', id: string, label: string };

export type RelationFragment = { __typename?: 'Relation', id: any, label: string };

export type ScatterPlotFragment = { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null };

export type MediaStoreFragment = { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string };

export type KnowledgeStructureFragment = { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string }, pinnedViews: Array<{ __typename?: 'NodeView', id: string, label: string, node: { __typename?: 'Entity', id: any, graphId: string } | { __typename?: 'Structure', id: any, graphId: string }, query: { __typename?: 'NodeQuery', id: string, name: string, query: string }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', left: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any }, right: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }> };

export type StructureFragment = { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } };

export type ListStructureFragment = { __typename?: 'Structure', identifier: string, object: string, id: any, category: { __typename?: 'StructureCategory', identifier: string } };

export type StructureGraphNodeFragment = { __typename?: 'Structure', identifier: string, object: string, id: any };

export type ColumnFragment = { __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null };

export type TableFragment = { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } };

export type CreateMeasurementCategoryMutationVariables = Exact<{
  input: MeasurementCategoryInput;
}>;


export type CreateMeasurementCategoryMutation = { __typename?: 'Mutation', createMeasurementCategory: { __typename?: 'MeasurementCategory', metricKind: MeasurementKind, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } } };

export type CreateStructureCategoryMutationVariables = Exact<{
  input: StructureCategoryInput;
}>;


export type CreateStructureCategoryMutation = { __typename?: 'Mutation', createStructureCategory: { __typename?: 'StructureCategory', identifier: string, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type UpdateStructureCategoryMutationVariables = Exact<{
  input: UpdateStructureCategoryInput;
}>;


export type UpdateStructureCategoryMutation = { __typename?: 'Mutation', updateStructureCategory: { __typename?: 'StructureCategory', identifier: string, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type UpdateGenericCategoryMutationVariables = Exact<{
  input: UpdateGenericCategoryInput;
}>;


export type UpdateGenericCategoryMutation = { __typename?: 'Mutation', updateGenericCategory: { __typename?: 'GenericCategory', instanceKind: InstanceKind, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type CreateGenericCategoryMutationVariables = Exact<{
  input: GenericCategoryInput;
}>;


export type CreateGenericCategoryMutation = { __typename?: 'Mutation', createGenericCategory: { __typename?: 'GenericCategory', instanceKind: InstanceKind, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type CreateRelationCategoryMutationVariables = Exact<{
  input: RelationCategoryInput;
}>;


export type CreateRelationCategoryMutation = { __typename?: 'Mutation', createRelationCategory: { __typename?: 'RelationCategory', id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } } };

export type CreateEntityMutationVariables = Exact<{
  input: EntityInput;
}>;


export type CreateEntityMutation = { __typename?: 'Mutation', createEntity: { __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } };

export type CreateRelationMutationVariables = Exact<{
  input: RelationInput;
}>;


export type CreateRelationMutation = { __typename?: 'Mutation', createRelation: { __typename?: 'Relation', id: any, label: string } };

export type CreateGraphMutationVariables = Exact<{
  input: GraphInput;
}>;


export type CreateGraphMutation = { __typename?: 'Mutation', createGraph: { __typename?: 'Graph', id: string, name: string, pinned: boolean, description?: string | null, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, ontology: { __typename?: 'Ontology', id: string, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string }> }, graphViews: Array<{ __typename?: 'GraphView', id: string, label: string }>, nodeViews: Array<{ __typename?: 'NodeView', id: string, label: string }>, plotViews: Array<{ __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } }> } };

export type DeleteGraphMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteGraphMutation = { __typename?: 'Mutation', deleteGraph: string };

export type UpdateGraphMutationVariables = Exact<{
  input: UpdateGraphInput;
}>;


export type UpdateGraphMutation = { __typename?: 'Mutation', updateGraph: { __typename?: 'Graph', id: string, name: string, pinned: boolean, description?: string | null, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, ontology: { __typename?: 'Ontology', id: string, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string }> }, graphViews: Array<{ __typename?: 'GraphView', id: string, label: string }>, nodeViews: Array<{ __typename?: 'NodeView', id: string, label: string }>, plotViews: Array<{ __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } }> } };

export type PinGraphMutationVariables = Exact<{
  input: PinGraphInput;
}>;


export type PinGraphMutation = { __typename?: 'Mutation', pinGraph: { __typename?: 'Graph', id: string, name: string, pinned: boolean, description?: string | null, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, ontology: { __typename?: 'Ontology', id: string, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string }> }, graphViews: Array<{ __typename?: 'GraphView', id: string, label: string }>, nodeViews: Array<{ __typename?: 'NodeView', id: string, label: string }>, plotViews: Array<{ __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } }> } };

export type PinGraphQueryMutationVariables = Exact<{
  input: PinGraphQueryInput;
}>;


export type PinGraphQueryMutation = { __typename?: 'Mutation', pinGraphQuery: { __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, ontology: { __typename?: 'Ontology', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string }> } };

export type CreateGraphViewMutationVariables = Exact<{
  input: GraphViewInput;
}>;


export type CreateGraphViewMutation = { __typename?: 'Mutation', createGraphView: { __typename?: 'GraphView', id: string, label: string, graph: { __typename?: 'Graph', id: string, name: string }, query: { __typename?: 'GraphQuery', id: string, name: string, query: string }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', left: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any }, right: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } }, plotViews: Array<{ __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } }> } };

export type PinNodeQueryMutationVariables = Exact<{
  input: PinNodeQueryInput;
}>;


export type PinNodeQueryMutation = { __typename?: 'Mutation', pinNodeQuery: { __typename?: 'NodeQuery', name: string, query: string } };

export type CreateNodeViewMutationVariables = Exact<{
  input: NodeViewInput;
}>;


export type CreateNodeViewMutation = { __typename?: 'Mutation', createNodeView: { __typename?: 'NodeView', id: string, label: string, node: { __typename?: 'Entity', id: any, graphId: string } | { __typename?: 'Structure', id: any, graphId: string }, query: { __typename?: 'NodeQuery', id: string, name: string, query: string }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', left: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any }, right: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } } };

export type CreateOntologyMutationVariables = Exact<{
  input: OntologyInput;
}>;


export type CreateOntologyMutation = { __typename?: 'Mutation', createOntology: { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null }>, genericCategories: Array<{ __typename?: 'GenericCategory', instanceKind: InstanceKind, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null }>, relationCategories: Array<{ __typename?: 'RelationCategory', id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', metricKind: MeasurementKind, id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null, graphs: Array<{ __typename?: 'Graph', id: string, name: string, pinned: boolean }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, description?: string | null, pinned: boolean }>, nodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, description?: string | null, pinned: boolean }> } };

export type UpdateOntologyMutationVariables = Exact<{
  input: UpdateOntologyInput;
}>;


export type UpdateOntologyMutation = { __typename?: 'Mutation', updateOntology: { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null }>, genericCategories: Array<{ __typename?: 'GenericCategory', instanceKind: InstanceKind, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null }>, relationCategories: Array<{ __typename?: 'RelationCategory', id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', metricKind: MeasurementKind, id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null, graphs: Array<{ __typename?: 'Graph', id: string, name: string, pinned: boolean }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, description?: string | null, pinned: boolean }>, nodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, description?: string | null, pinned: boolean }> } };

export type DeleteOntologyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOntologyMutation = { __typename?: 'Mutation', deleteOntology: string };

export type CreateProtocolMutationVariables = Exact<{
  name: Scalars['String']['input'];
  experiment: Scalars['ID']['input'];
}>;


export type CreateProtocolMutation = { __typename?: 'Mutation', createProtocol: { __typename?: 'Protocol', id: string, name: string, description?: string | null, experiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null } } };

export type CreateProtocolStepMutationVariables = Exact<{
  input: ProtocolStepInput;
}>;


export type CreateProtocolStepMutation = { __typename?: 'Mutation', createProtocolStep: { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, template: { __typename?: 'ProtocolStepTemplate', name: string, plateChildren: Array<any> }, forReagent?: { __typename?: 'Reagent', id: string } | null, forEntity?: { __typename?: 'Entity', id: any } | null, performedBy?: { __typename?: 'User', id: string } | null } };

export type UpdateProtocolStepMutationVariables = Exact<{
  input: UpdateProtocolStepInput;
}>;


export type UpdateProtocolStepMutation = { __typename?: 'Mutation', updateProtocolStep: { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, template: { __typename?: 'ProtocolStepTemplate', name: string, plateChildren: Array<any> }, forReagent?: { __typename?: 'Reagent', id: string } | null, forEntity?: { __typename?: 'Entity', id: any } | null, performedBy?: { __typename?: 'User', id: string } | null } };

export type CreateProtocolStepTemplateMutationVariables = Exact<{
  input: ProtocolStepTemplateInput;
}>;


export type CreateProtocolStepTemplateMutation = { __typename?: 'Mutation', createProtocolStepTemplate: { __typename?: 'ProtocolStepTemplate', id: string, name: string, plateChildren: Array<any> } };

export type UpdateProtocolStepTemplateMutationVariables = Exact<{
  input: UpdateProtocolStepTemplateInput;
}>;


export type UpdateProtocolStepTemplateMutation = { __typename?: 'Mutation', updateProtocolStepTemplate: { __typename?: 'ProtocolStepTemplate', id: string, name: string, plateChildren: Array<any> } };

export type CreateReagentMutationVariables = Exact<{
  input: ReagentInput;
}>;


export type CreateReagentMutation = { __typename?: 'Mutation', createReagent: { __typename?: 'Reagent', id: string, label: string, creationSteps: Array<{ __typename?: 'ProtocolStep', id: string, name: string }>, usedIn: Array<{ __typename?: 'ReagentMapping', id: string, protocolStep: { __typename?: 'ProtocolStep', performedAt?: any | null, name: string } }> } };

export type DeleteScatterPlotMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteScatterPlotMutation = { __typename?: 'Mutation', deleteScatterPlot: string };

export type CreateStructureMutationVariables = Exact<{
  input: StructureInput;
}>;


export type CreateStructureMutation = { __typename?: 'Mutation', createStructure: { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } } };

export type RequestMediaUploadMutationVariables = Exact<{
  key: Scalars['String']['input'];
  datalayer: Scalars['String']['input'];
}>;


export type RequestMediaUploadMutation = { __typename?: 'Mutation', requestUpload: { __typename?: 'PresignedPostCredentials', xAmzAlgorithm: string, xAmzCredential: string, xAmzDate: string, xAmzSignature: string, key: string, bucket: string, datalayer: string, policy: string, store: string } };

export type GetEdgeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEdgeQuery = { __typename?: 'Query', edge: { __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string } };

export type GetGenericCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGenericCategoryQuery = { __typename?: 'Query', genericCategory: { __typename?: 'GenericCategory', instanceKind: InstanceKind, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type SearchGenericCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchGenericCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'GenericCategory', value: string, label: string }> };

export type GetGraphQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGraphQuery = { __typename?: 'Query', graph: { __typename?: 'Graph', id: string, name: string, pinned: boolean, description?: string | null, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, ontology: { __typename?: 'Ontology', id: string, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string }> }, graphViews: Array<{ __typename?: 'GraphView', id: string, label: string }>, nodeViews: Array<{ __typename?: 'NodeView', id: string, label: string }>, plotViews: Array<{ __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } }> } };

export type MyActiveGraphQueryVariables = Exact<{ [key: string]: never; }>;


export type MyActiveGraphQuery = { __typename?: 'Query', myActiveGraph: { __typename?: 'Graph', id: string, name: string, pinned: boolean } };

export type ListGraphsQueryVariables = Exact<{
  filters?: InputMaybe<GraphFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListGraphsQuery = { __typename?: 'Query', graphs: Array<{ __typename?: 'Graph', id: string, name: string, pinned: boolean }> };

export type SearchGraphsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchGraphsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Graph', value: string, label: string }> };

export type GetGraphQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGraphQueryQuery = { __typename?: 'Query', graphQuery: { __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, ontology: { __typename?: 'Ontology', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string }> } };

export type SearchGraphQueriesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchGraphQueriesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'GraphQuery', value: string, label: string }> };

export type GetGraphViewQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGraphViewQuery = { __typename?: 'Query', graphView: { __typename?: 'GraphView', id: string, label: string, graph: { __typename?: 'Graph', id: string, name: string }, query: { __typename?: 'GraphQuery', id: string, name: string, query: string }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', left: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any }, right: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } }, plotViews: Array<{ __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } }> } };

export type SearchGraphViewsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchGraphViewsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'GraphView', value: string, label: string }> };

export type GetMeasurmentCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMeasurmentCategoryQuery = { __typename?: 'Query', measurementCategory: { __typename?: 'MeasurementCategory', metricKind: MeasurementKind, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } } };

export type SearchMeasurmentCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchMeasurmentCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'MeasurementCategory', value: string, label: string }> };

export type GetNodeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetNodeQuery = { __typename?: 'Query', node: { __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string, name: string, ontology: { __typename?: 'Ontology', nodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, description?: string | null, pinned: boolean }> } }, nodeViews: Array<{ __typename?: 'NodeView', id: string, label: string }>, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, graph: { __typename?: 'Graph', id: string, name: string, ontology: { __typename?: 'Ontology', nodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, description?: string | null, pinned: boolean }> } }, nodeViews: Array<{ __typename?: 'NodeView', id: string, label: string }>, category: { __typename?: 'StructureCategory', identifier: string } } };

export type GetNodeViewQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetNodeViewQuery = { __typename?: 'Query', nodeView: { __typename?: 'NodeView', id: string, label: string, node: { __typename?: 'Entity', id: any, graphId: string } | { __typename?: 'Structure', id: any, graphId: string }, query: { __typename?: 'NodeQuery', id: string, name: string, query: string }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', left: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any }, right: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } } };

export type SearchNodeViewsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchNodeViewsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'NodeView', value: string, label: string }> };

export type GetOntologyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOntologyQuery = { __typename?: 'Query', ontology: { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null }>, genericCategories: Array<{ __typename?: 'GenericCategory', instanceKind: InstanceKind, id: string, label: string, description?: string | null, ageName: string, positionX?: number | null, positionY?: number | null, height?: number | null, width?: number | null, color?: Array<number> | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null }>, relationCategories: Array<{ __typename?: 'RelationCategory', id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', metricKind: MeasurementKind, id: string, label: string, description?: string | null, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null, graphs: Array<{ __typename?: 'Graph', id: string, name: string, pinned: boolean }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, description?: string | null, pinned: boolean }>, nodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, description?: string | null, pinned: boolean }> } };

export type ListOntologiesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListOntologiesQuery = { __typename?: 'Query', ontologies: Array<{ __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null }> };

export type SearchOntologiesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchOntologiesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Ontology', value: string, label: string }> };

export type GetPlotViewQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPlotViewQuery = { __typename?: 'Query', plotView: { __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } } };

export type LatestPlotViewsQueryVariables = Exact<{ [key: string]: never; }>;


export type LatestPlotViewsQuery = { __typename?: 'Query', plotViews: Array<{ __typename?: 'PlotView', id: string, name: string, view: { __typename?: 'GraphView', id: string, label: string, render: { __typename?: 'Pairs' } | { __typename?: 'Path' } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } }> };

export type ListPlotViewsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPlotViewsQuery = { __typename?: 'Query', plotViews: Array<{ __typename?: 'PlotView', id: string, name: string, plot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string, colorColumn?: string | null, sizeColumn?: string | null } }> };

export type SearchPlotViewsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchPlotViewsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'PlotView', value: string, label: string }> };

export type GetProtocolStepTemplateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProtocolStepTemplateQuery = { __typename?: 'Query', protocolStepTemplate: { __typename?: 'ProtocolStepTemplate', id: string, name: string, plateChildren: Array<any> } };

export type ListProtocolStepTemplatesQueryVariables = Exact<{
  filters?: InputMaybe<ProtocolStepTemplateFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListProtocolStepTemplatesQuery = { __typename?: 'Query', protocolStepTemplates: Array<{ __typename?: 'ProtocolStepTemplate', id: string, name: string, plateChildren: Array<any> }> };

export type SearchProtocolStepTemplatesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchProtocolStepTemplatesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'ProtocolStepTemplate', value: string, label: string }> };

export type GetProtocolStepQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProtocolStepQuery = { __typename?: 'Query', protocolStep: { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, template: { __typename?: 'ProtocolStepTemplate', name: string, plateChildren: Array<any> }, forReagent?: { __typename?: 'Reagent', id: string } | null, forEntity?: { __typename?: 'Entity', id: any } | null, performedBy?: { __typename?: 'User', id: string } | null } };

export type ListProtocolStepsQueryVariables = Exact<{
  filters?: InputMaybe<ProtocolStepFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListProtocolStepsQuery = { __typename?: 'Query', protocolSteps: Array<{ __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, performedBy?: { __typename?: 'User', id: string } | null }> };

export type SearchProtocolStepsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchProtocolStepsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'ProtocolStep', value: string, label: string }> };

export type GetProtocolQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProtocolQuery = { __typename?: 'Query', protocol: { __typename?: 'Protocol', id: string, name: string, description?: string | null, experiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null } } };

export type ListProtocolsQueryVariables = Exact<{
  filters?: InputMaybe<ProtocolFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListProtocolsQuery = { __typename?: 'Query', protocols: Array<{ __typename?: 'Protocol', id: string, name: string, experiment: { __typename?: 'Experiment', id: string, name: string } }> };

export type GetReagentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetReagentQuery = { __typename?: 'Query', reagent: { __typename?: 'Reagent', id: string, label: string, creationSteps: Array<{ __typename?: 'ProtocolStep', id: string, name: string }>, usedIn: Array<{ __typename?: 'ReagentMapping', id: string, protocolStep: { __typename?: 'ProtocolStep', performedAt?: any | null, name: string } }> } };

export type ListReagentsQueryVariables = Exact<{
  filters?: InputMaybe<ReagentFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListReagentsQuery = { __typename?: 'Query', reagents: Array<{ __typename?: 'Reagent', id: string, label: string }> };

export type SearchReagentsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchReagentsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Reagent', value: string, label: string }> };

export type GetRelationCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRelationCategoryQuery = { __typename?: 'Query', relationCategory: { __typename?: 'RelationCategory', id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, left: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string }, right: { __typename?: 'GenericCategory', ageName: string, id: string } | { __typename?: 'StructureCategory', ageName: string, id: string } } };

export type SearchRelationCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchRelationCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'RelationCategory', value: string, label: string }> };

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', graphs: Array<{ __typename?: 'Graph', id: string, name: string, pinned: boolean }>, ontologies: Array<{ __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null }> };

export type GetStructureQueryVariables = Exact<{
  identifier: Scalars['StructureIdentifier']['input'];
  object: Scalars['ID']['input'];
  graph?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetStructureQuery = { __typename?: 'Query', structure: { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string }, pinnedViews: Array<{ __typename?: 'NodeView', id: string, label: string, node: { __typename?: 'Entity', id: any, graphId: string } | { __typename?: 'Structure', id: any, graphId: string }, query: { __typename?: 'NodeQuery', id: string, name: string, query: string }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', left: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any }, right: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'GenericCategory', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object: string, category: { __typename?: 'StructureCategory', identifier: string } }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MeasurementKind | null, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string, ageName: string } } }> } };

export type GetStructureCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStructureCategoryQuery = { __typename?: 'Query', structureCategory: { __typename?: 'StructureCategory', identifier: string, id: string, label: string, ageName: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type SearchStructureCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchStructureCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'StructureCategory', value: string, label: string }> };

export const BaseCategoryFragmentDoc = gql`
    fragment BaseCategory on Category {
  id
  label
  ageName
  store {
    presignedUrl
  }
}
    `;
export const BaseNodeCategoryFragmentDoc = gql`
    fragment BaseNodeCategory on NodeCategory {
  id
}
    `;
export const StructureCategoryFragmentDoc = gql`
    fragment StructureCategory on StructureCategory {
  ...BaseCategory
  ...BaseNodeCategory
  identifier
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}`;
export const GenericCategoryFragmentDoc = gql`
    fragment GenericCategory on GenericCategory {
  ...BaseCategory
  ...BaseNodeCategory
  instanceKind
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}`;
export const NodeCategoryFragmentDoc = gql`
    fragment NodeCategory on NodeCategory {
  ...StructureCategory
  ...GenericCategory
}
    ${StructureCategoryFragmentDoc}
${GenericCategoryFragmentDoc}`;
export const BaseEdgeCategoryFragmentDoc = gql`
    fragment BaseEdgeCategory on EdgeCategory {
  left {
    id
    ... on Category {
      ageName
    }
  }
  right {
    id
    ... on Category {
      ageName
    }
  }
}
    `;
export const RelationCategoryFragmentDoc = gql`
    fragment RelationCategory on RelationCategory {
  ...BaseCategory
  ...BaseEdgeCategory
}
    ${BaseCategoryFragmentDoc}
${BaseEdgeCategoryFragmentDoc}`;
export const MeasurementCategoryFragmentDoc = gql`
    fragment MeasurementCategory on MeasurementCategory {
  ...BaseCategory
  ...BaseEdgeCategory
  metricKind
}
    ${BaseCategoryFragmentDoc}
${BaseEdgeCategoryFragmentDoc}`;
export const EdgeCategoryFragmentDoc = gql`
    fragment EdgeCategory on EdgeCategory {
  ...RelationCategory
  ...MeasurementCategory
}
    ${RelationCategoryFragmentDoc}
${MeasurementCategoryFragmentDoc}`;
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
export const ListEntityFragmentDoc = gql`
    fragment ListEntity on Entity {
  id
  label
  category {
    id
    label
  }
}
    `;
export const EntityGraphNodeFragmentDoc = gql`
    fragment EntityGraphNode on Entity {
  id
  label
  category {
    color
  }
}
    `;
export const EntityFragmentDoc = gql`
    fragment Entity on Entity {
  id
  label
  category {
    id
    label
  }
  subjectedTo {
    id
    performedAt
    name
  }
}
    `;
export const StructureFragmentDoc = gql`
    fragment Structure on Structure {
  id
  label
  identifier
  object
  category {
    identifier
  }
}
    `;
export const ListNodeFragmentDoc = gql`
    fragment ListNode on Node {
  id
  label
  ...Entity
  ...Structure
}
    ${EntityFragmentDoc}
${StructureFragmentDoc}`;
export const ListGraphViewFragmentDoc = gql`
    fragment ListGraphView on GraphView {
  id
  label
}
    `;
export const ListNodeViewFragmentDoc = gql`
    fragment ListNodeView on NodeView {
  id
  label
}
    `;
export const ColumnFragmentDoc = gql`
    fragment Column on Column {
  name
  kind
  valueKind
  description
  label
}
    `;
export const TableFragmentDoc = gql`
    fragment Table on Table {
  rows
  columns {
    ...Column
  }
  graph {
    id
    ageName
  }
}
    ${ColumnFragmentDoc}`;
export const ScatterPlotFragmentDoc = gql`
    fragment ScatterPlot on ScatterPlot {
  id
  name
  description
  xColumn
  yColumn
  colorColumn
  sizeColumn
}
    `;
export const CarouselPlotViewFragmentDoc = gql`
    fragment CarouselPlotView on PlotView {
  id
  name
  view {
    id
    label
    render {
      ...Table
    }
  }
  plot {
    ...ScatterPlot
  }
}
    ${TableFragmentDoc}
${ScatterPlotFragmentDoc}`;
export const GraphFragmentDoc = gql`
    fragment Graph on Graph {
  id
  name
  pinned
  description
  latestNodes(pagination: {limit: 10}) {
    ...ListNode
  }
  ontology {
    id
    graphQueries {
      id
      name
      query
    }
  }
  graphViews {
    ...ListGraphView
  }
  nodeViews {
    ...ListNodeView
  }
  plotViews(pagination: {limit: 2}) {
    ...CarouselPlotView
  }
}
    ${ListNodeFragmentDoc}
${ListGraphViewFragmentDoc}
${ListNodeViewFragmentDoc}
${CarouselPlotViewFragmentDoc}`;
export const DetailGraphQueryFragmentDoc = gql`
    fragment DetailGraphQuery on GraphQuery {
  id
  name
  query
  description
  ontology {
    id
    name
  }
  scatterPlots {
    id
    name
  }
}
    `;
export const NodeFragmentDoc = gql`
    fragment Node on Node {
  id
  label
  ...Entity
  ...Structure
}
    ${EntityFragmentDoc}
${StructureFragmentDoc}`;
export const MeasurementFragmentDoc = gql`
    fragment Measurement on Measurement {
  id
  value
}
    `;
export const RelationFragmentDoc = gql`
    fragment Relation on Relation {
  id
  label
}
    `;
export const EdgeFragmentDoc = gql`
    fragment Edge on Edge {
  id
  label
  leftId
  rightId
  ...Measurement
  ...Relation
}
    ${MeasurementFragmentDoc}
${RelationFragmentDoc}`;
export const PathFragmentDoc = gql`
    fragment Path on Path {
  nodes {
    ...Node
  }
  edges {
    ...Edge
  }
}
    ${NodeFragmentDoc}
${EdgeFragmentDoc}`;
export const PairsFragmentDoc = gql`
    fragment Pairs on Pairs {
  pairs {
    left {
      id
    }
    right {
      id
    }
  }
}
    `;
export const PlotViewFragmentDoc = gql`
    fragment PlotView on PlotView {
  id
  name
  view {
    id
    label
    render {
      ...Table
    }
  }
  plot {
    ...ScatterPlot
  }
}
    ${TableFragmentDoc}
${ScatterPlotFragmentDoc}`;
export const GraphViewFragmentDoc = gql`
    fragment GraphView on GraphView {
  id
  label
  graph {
    id
    name
  }
  query {
    id
    name
    query
  }
  render {
    ...Path
    ...Pairs
    ...Table
  }
  plotViews {
    ...PlotView
  }
}
    ${PathFragmentDoc}
${PairsFragmentDoc}
${TableFragmentDoc}
${PlotViewFragmentDoc}`;
export const BaseListCategoryFragmentDoc = gql`
    fragment BaseListCategory on Category {
  id
  label
  description
  ageName
  store {
    presignedUrl
  }
}
    `;
export const BaseListNodeCategoryFragmentDoc = gql`
    fragment BaseListNodeCategory on NodeCategory {
  id
  positionX
  positionY
  height
  width
  color
}
    `;
export const ListStructureCategoryFragmentDoc = gql`
    fragment ListStructureCategory on StructureCategory {
  ...BaseListCategory
  ...BaseListNodeCategory
  identifier
}
    ${BaseListCategoryFragmentDoc}
${BaseListNodeCategoryFragmentDoc}`;
export const ListGenericCategoryFragmentDoc = gql`
    fragment ListGenericCategory on GenericCategory {
  ...BaseListCategory
  ...BaseListNodeCategory
  instanceKind
}
    ${BaseListCategoryFragmentDoc}
${BaseListNodeCategoryFragmentDoc}`;
export const ListNodeCategoryFragmentDoc = gql`
    fragment ListNodeCategory on NodeCategory {
  ...ListStructureCategory
  ...ListGenericCategory
}
    ${ListStructureCategoryFragmentDoc}
${ListGenericCategoryFragmentDoc}`;
export const BaseListEdgeCategoryFragmentDoc = gql`
    fragment BaseListEdgeCategory on EdgeCategory {
  left {
    id
    ... on Category {
      ageName
    }
  }
  right {
    id
    ... on Category {
      ageName
    }
  }
}
    `;
export const ListRelationCategoryFragmentDoc = gql`
    fragment ListRelationCategory on RelationCategory {
  ...BaseListCategory
  ...BaseListEdgeCategory
}
    ${BaseListCategoryFragmentDoc}
${BaseListEdgeCategoryFragmentDoc}`;
export const ListMeasurementCategoryFragmentDoc = gql`
    fragment ListMeasurementCategory on MeasurementCategory {
  ...BaseListCategory
  ...BaseListEdgeCategory
  metricKind
}
    ${BaseListCategoryFragmentDoc}
${BaseListEdgeCategoryFragmentDoc}`;
export const ListEdgeCategoryFragmentDoc = gql`
    fragment ListEdgeCategory on EdgeCategory {
  ...ListRelationCategory
  ...ListMeasurementCategory
}
    ${ListRelationCategoryFragmentDoc}
${ListMeasurementCategoryFragmentDoc}`;
export const ListNodeQueryFragmentDoc = gql`
    fragment ListNodeQuery on NodeQuery {
  id
  name
  description
  pinned
}
    `;
export const DetailNodeFragmentDoc = gql`
    fragment DetailNode on Node {
  ...Node
  graph {
    id
    name
    ontology {
      nodeQueries {
        ...ListNodeQuery
      }
    }
  }
  nodeViews {
    ...ListNodeView
  }
}
    ${NodeFragmentDoc}
${ListNodeQueryFragmentDoc}
${ListNodeViewFragmentDoc}`;
export const DetailNodeQueryFragmentDoc = gql`
    fragment DetailNodeQuery on NodeQuery {
  name
  query
}
    `;
export const MediaStoreFragmentDoc = gql`
    fragment MediaStore on MediaStore {
  id
  key
  presignedUrl
}
    `;
export const ListGraphFragmentDoc = gql`
    fragment ListGraph on Graph {
  id
  name
  pinned
}
    `;
export const ListGraphQueryFragmentDoc = gql`
    fragment ListGraphQuery on GraphQuery {
  id
  name
  description
  pinned
}
    `;
export const OntologyFragmentDoc = gql`
    fragment Ontology on Ontology {
  id
  name
  description
  purl
  structureCategories {
    ...ListStructureCategory
  }
  genericCategories {
    ...ListGenericCategory
  }
  relationCategories {
    ...ListRelationCategory
  }
  measurementCategories {
    ...ListMeasurementCategory
  }
  store {
    ...MediaStore
  }
  graphs {
    ...ListGraph
  }
  graphQueries {
    ...ListGraphQuery
  }
  nodeQueries {
    ...ListNodeQuery
  }
}
    ${ListStructureCategoryFragmentDoc}
${ListGenericCategoryFragmentDoc}
${ListRelationCategoryFragmentDoc}
${ListMeasurementCategoryFragmentDoc}
${MediaStoreFragmentDoc}
${ListGraphFragmentDoc}
${ListGraphQueryFragmentDoc}
${ListNodeQueryFragmentDoc}`;
export const ListOntologyFragmentDoc = gql`
    fragment ListOntology on Ontology {
  id
  name
  description
  purl
}
    `;
export const ListPlotViewFragmentDoc = gql`
    fragment ListPlotView on PlotView {
  id
  name
  plot {
    ...ScatterPlot
  }
}
    ${ScatterPlotFragmentDoc}`;
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
export const ProtocolStepFragmentDoc = gql`
    fragment ProtocolStep on ProtocolStep {
  id
  name
  template {
    name
    plateChildren
  }
  forReagent {
    id
  }
  forEntity {
    id
  }
  performedAt
  performedBy {
    id
  }
}
    `;
export const ListProtocolStepFragmentDoc = gql`
    fragment ListProtocolStep on ProtocolStep {
  id
  name
  performedAt
  performedBy {
    id
  }
}
    `;
export const ProtocolStepTemplateFragmentDoc = gql`
    fragment ProtocolStepTemplate on ProtocolStepTemplate {
  id
  name
  plateChildren
}
    `;
export const ListProtocolStepTemplateFragmentDoc = gql`
    fragment ListProtocolStepTemplate on ProtocolStepTemplate {
  id
  name
  plateChildren
}
    `;
export const ReagentFragmentDoc = gql`
    fragment Reagent on Reagent {
  id
  label
  creationSteps {
    id
    name
  }
  usedIn {
    id
    protocolStep {
      performedAt
      name
    }
  }
}
    `;
export const ListReagentFragmentDoc = gql`
    fragment ListReagent on Reagent {
  id
  label
}
    `;
export const NodeViewFragmentDoc = gql`
    fragment NodeView on NodeView {
  id
  label
  node {
    id
    graphId
  }
  query {
    id
    name
    query
  }
  render {
    ...Path
    ...Pairs
    ...Table
  }
}
    ${PathFragmentDoc}
${PairsFragmentDoc}
${TableFragmentDoc}`;
export const KnowledgeStructureFragmentDoc = gql`
    fragment KnowledgeStructure on Structure {
  id
  label
  identifier
  object
  category {
    identifier
  }
  pinnedViews {
    ...NodeView
  }
}
    ${NodeViewFragmentDoc}`;
export const ListStructureFragmentDoc = gql`
    fragment ListStructure on Structure {
  identifier
  object
  id
  category {
    identifier
  }
}
    `;
export const StructureGraphNodeFragmentDoc = gql`
    fragment StructureGraphNode on Structure {
  identifier
  object
  id
}
    `;
export const CreateMeasurementCategoryDocument = gql`
    mutation CreateMeasurementCategory($input: MeasurementCategoryInput!) {
  createMeasurementCategory(input: $input) {
    ...MeasurementCategory
  }
}
    ${MeasurementCategoryFragmentDoc}`;
export type CreateMeasurementCategoryMutationFn = Apollo.MutationFunction<CreateMeasurementCategoryMutation, CreateMeasurementCategoryMutationVariables>;

/**
 * __useCreateMeasurementCategoryMutation__
 *
 * To run a mutation, you first call `useCreateMeasurementCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMeasurementCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMeasurementCategoryMutation, { data, loading, error }] = useCreateMeasurementCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMeasurementCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMeasurementCategoryMutation, CreateMeasurementCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMeasurementCategoryMutation, CreateMeasurementCategoryMutationVariables>(CreateMeasurementCategoryDocument, options);
      }
export type CreateMeasurementCategoryMutationHookResult = ReturnType<typeof useCreateMeasurementCategoryMutation>;
export type CreateMeasurementCategoryMutationResult = Apollo.MutationResult<CreateMeasurementCategoryMutation>;
export type CreateMeasurementCategoryMutationOptions = Apollo.BaseMutationOptions<CreateMeasurementCategoryMutation, CreateMeasurementCategoryMutationVariables>;
export const CreateStructureCategoryDocument = gql`
    mutation CreateStructureCategory($input: StructureCategoryInput!) {
  createStructureCategory(input: $input) {
    ...StructureCategory
  }
}
    ${StructureCategoryFragmentDoc}`;
export type CreateStructureCategoryMutationFn = Apollo.MutationFunction<CreateStructureCategoryMutation, CreateStructureCategoryMutationVariables>;

/**
 * __useCreateStructureCategoryMutation__
 *
 * To run a mutation, you first call `useCreateStructureCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStructureCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStructureCategoryMutation, { data, loading, error }] = useCreateStructureCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateStructureCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateStructureCategoryMutation, CreateStructureCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateStructureCategoryMutation, CreateStructureCategoryMutationVariables>(CreateStructureCategoryDocument, options);
      }
export type CreateStructureCategoryMutationHookResult = ReturnType<typeof useCreateStructureCategoryMutation>;
export type CreateStructureCategoryMutationResult = Apollo.MutationResult<CreateStructureCategoryMutation>;
export type CreateStructureCategoryMutationOptions = Apollo.BaseMutationOptions<CreateStructureCategoryMutation, CreateStructureCategoryMutationVariables>;
export const UpdateStructureCategoryDocument = gql`
    mutation UpdateStructureCategory($input: UpdateStructureCategoryInput!) {
  updateStructureCategory(input: $input) {
    ...StructureCategory
  }
}
    ${StructureCategoryFragmentDoc}`;
export type UpdateStructureCategoryMutationFn = Apollo.MutationFunction<UpdateStructureCategoryMutation, UpdateStructureCategoryMutationVariables>;

/**
 * __useUpdateStructureCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateStructureCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStructureCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStructureCategoryMutation, { data, loading, error }] = useUpdateStructureCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateStructureCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateStructureCategoryMutation, UpdateStructureCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateStructureCategoryMutation, UpdateStructureCategoryMutationVariables>(UpdateStructureCategoryDocument, options);
      }
export type UpdateStructureCategoryMutationHookResult = ReturnType<typeof useUpdateStructureCategoryMutation>;
export type UpdateStructureCategoryMutationResult = Apollo.MutationResult<UpdateStructureCategoryMutation>;
export type UpdateStructureCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateStructureCategoryMutation, UpdateStructureCategoryMutationVariables>;
export const UpdateGenericCategoryDocument = gql`
    mutation UpdateGenericCategory($input: UpdateGenericCategoryInput!) {
  updateGenericCategory(input: $input) {
    ...GenericCategory
  }
}
    ${GenericCategoryFragmentDoc}`;
export type UpdateGenericCategoryMutationFn = Apollo.MutationFunction<UpdateGenericCategoryMutation, UpdateGenericCategoryMutationVariables>;

/**
 * __useUpdateGenericCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateGenericCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGenericCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGenericCategoryMutation, { data, loading, error }] = useUpdateGenericCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGenericCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateGenericCategoryMutation, UpdateGenericCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateGenericCategoryMutation, UpdateGenericCategoryMutationVariables>(UpdateGenericCategoryDocument, options);
      }
export type UpdateGenericCategoryMutationHookResult = ReturnType<typeof useUpdateGenericCategoryMutation>;
export type UpdateGenericCategoryMutationResult = Apollo.MutationResult<UpdateGenericCategoryMutation>;
export type UpdateGenericCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateGenericCategoryMutation, UpdateGenericCategoryMutationVariables>;
export const CreateGenericCategoryDocument = gql`
    mutation CreateGenericCategory($input: GenericCategoryInput!) {
  createGenericCategory(input: $input) {
    ...GenericCategory
  }
}
    ${GenericCategoryFragmentDoc}`;
export type CreateGenericCategoryMutationFn = Apollo.MutationFunction<CreateGenericCategoryMutation, CreateGenericCategoryMutationVariables>;

/**
 * __useCreateGenericCategoryMutation__
 *
 * To run a mutation, you first call `useCreateGenericCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGenericCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGenericCategoryMutation, { data, loading, error }] = useCreateGenericCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGenericCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateGenericCategoryMutation, CreateGenericCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateGenericCategoryMutation, CreateGenericCategoryMutationVariables>(CreateGenericCategoryDocument, options);
      }
export type CreateGenericCategoryMutationHookResult = ReturnType<typeof useCreateGenericCategoryMutation>;
export type CreateGenericCategoryMutationResult = Apollo.MutationResult<CreateGenericCategoryMutation>;
export type CreateGenericCategoryMutationOptions = Apollo.BaseMutationOptions<CreateGenericCategoryMutation, CreateGenericCategoryMutationVariables>;
export const CreateRelationCategoryDocument = gql`
    mutation CreateRelationCategory($input: RelationCategoryInput!) {
  createRelationCategory(input: $input) {
    ...RelationCategory
  }
}
    ${RelationCategoryFragmentDoc}`;
export type CreateRelationCategoryMutationFn = Apollo.MutationFunction<CreateRelationCategoryMutation, CreateRelationCategoryMutationVariables>;

/**
 * __useCreateRelationCategoryMutation__
 *
 * To run a mutation, you first call `useCreateRelationCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRelationCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRelationCategoryMutation, { data, loading, error }] = useCreateRelationCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRelationCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRelationCategoryMutation, CreateRelationCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateRelationCategoryMutation, CreateRelationCategoryMutationVariables>(CreateRelationCategoryDocument, options);
      }
export type CreateRelationCategoryMutationHookResult = ReturnType<typeof useCreateRelationCategoryMutation>;
export type CreateRelationCategoryMutationResult = Apollo.MutationResult<CreateRelationCategoryMutation>;
export type CreateRelationCategoryMutationOptions = Apollo.BaseMutationOptions<CreateRelationCategoryMutation, CreateRelationCategoryMutationVariables>;
export const CreateEntityDocument = gql`
    mutation CreateEntity($input: EntityInput!) {
  createEntity(input: $input) {
    ...Entity
  }
}
    ${EntityFragmentDoc}`;
export type CreateEntityMutationFn = Apollo.MutationFunction<CreateEntityMutation, CreateEntityMutationVariables>;

/**
 * __useCreateEntityMutation__
 *
 * To run a mutation, you first call `useCreateEntityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEntityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEntityMutation, { data, loading, error }] = useCreateEntityMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEntityMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateEntityMutation, CreateEntityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateEntityMutation, CreateEntityMutationVariables>(CreateEntityDocument, options);
      }
export type CreateEntityMutationHookResult = ReturnType<typeof useCreateEntityMutation>;
export type CreateEntityMutationResult = Apollo.MutationResult<CreateEntityMutation>;
export type CreateEntityMutationOptions = Apollo.BaseMutationOptions<CreateEntityMutation, CreateEntityMutationVariables>;
export const CreateRelationDocument = gql`
    mutation CreateRelation($input: RelationInput!) {
  createRelation(input: $input) {
    ...Relation
  }
}
    ${RelationFragmentDoc}`;
export type CreateRelationMutationFn = Apollo.MutationFunction<CreateRelationMutation, CreateRelationMutationVariables>;

/**
 * __useCreateRelationMutation__
 *
 * To run a mutation, you first call `useCreateRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRelationMutation, { data, loading, error }] = useCreateRelationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRelationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRelationMutation, CreateRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateRelationMutation, CreateRelationMutationVariables>(CreateRelationDocument, options);
      }
export type CreateRelationMutationHookResult = ReturnType<typeof useCreateRelationMutation>;
export type CreateRelationMutationResult = Apollo.MutationResult<CreateRelationMutation>;
export type CreateRelationMutationOptions = Apollo.BaseMutationOptions<CreateRelationMutation, CreateRelationMutationVariables>;
export const CreateGraphDocument = gql`
    mutation CreateGraph($input: GraphInput!) {
  createGraph(input: $input) {
    ...Graph
  }
}
    ${GraphFragmentDoc}`;
export type CreateGraphMutationFn = Apollo.MutationFunction<CreateGraphMutation, CreateGraphMutationVariables>;

/**
 * __useCreateGraphMutation__
 *
 * To run a mutation, you first call `useCreateGraphMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGraphMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGraphMutation, { data, loading, error }] = useCreateGraphMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGraphMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateGraphMutation, CreateGraphMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateGraphMutation, CreateGraphMutationVariables>(CreateGraphDocument, options);
      }
export type CreateGraphMutationHookResult = ReturnType<typeof useCreateGraphMutation>;
export type CreateGraphMutationResult = Apollo.MutationResult<CreateGraphMutation>;
export type CreateGraphMutationOptions = Apollo.BaseMutationOptions<CreateGraphMutation, CreateGraphMutationVariables>;
export const DeleteGraphDocument = gql`
    mutation DeleteGraph($id: ID!) {
  deleteGraph(input: {id: $id})
}
    `;
export type DeleteGraphMutationFn = Apollo.MutationFunction<DeleteGraphMutation, DeleteGraphMutationVariables>;

/**
 * __useDeleteGraphMutation__
 *
 * To run a mutation, you first call `useDeleteGraphMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGraphMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGraphMutation, { data, loading, error }] = useDeleteGraphMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteGraphMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteGraphMutation, DeleteGraphMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteGraphMutation, DeleteGraphMutationVariables>(DeleteGraphDocument, options);
      }
export type DeleteGraphMutationHookResult = ReturnType<typeof useDeleteGraphMutation>;
export type DeleteGraphMutationResult = Apollo.MutationResult<DeleteGraphMutation>;
export type DeleteGraphMutationOptions = Apollo.BaseMutationOptions<DeleteGraphMutation, DeleteGraphMutationVariables>;
export const UpdateGraphDocument = gql`
    mutation UpdateGraph($input: UpdateGraphInput!) {
  updateGraph(input: $input) {
    ...Graph
  }
}
    ${GraphFragmentDoc}`;
export type UpdateGraphMutationFn = Apollo.MutationFunction<UpdateGraphMutation, UpdateGraphMutationVariables>;

/**
 * __useUpdateGraphMutation__
 *
 * To run a mutation, you first call `useUpdateGraphMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGraphMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGraphMutation, { data, loading, error }] = useUpdateGraphMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGraphMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateGraphMutation, UpdateGraphMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateGraphMutation, UpdateGraphMutationVariables>(UpdateGraphDocument, options);
      }
export type UpdateGraphMutationHookResult = ReturnType<typeof useUpdateGraphMutation>;
export type UpdateGraphMutationResult = Apollo.MutationResult<UpdateGraphMutation>;
export type UpdateGraphMutationOptions = Apollo.BaseMutationOptions<UpdateGraphMutation, UpdateGraphMutationVariables>;
export const PinGraphDocument = gql`
    mutation PinGraph($input: PinGraphInput!) {
  pinGraph(input: $input) {
    ...Graph
  }
}
    ${GraphFragmentDoc}`;
export type PinGraphMutationFn = Apollo.MutationFunction<PinGraphMutation, PinGraphMutationVariables>;

/**
 * __usePinGraphMutation__
 *
 * To run a mutation, you first call `usePinGraphMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinGraphMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinGraphMutation, { data, loading, error }] = usePinGraphMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePinGraphMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PinGraphMutation, PinGraphMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PinGraphMutation, PinGraphMutationVariables>(PinGraphDocument, options);
      }
export type PinGraphMutationHookResult = ReturnType<typeof usePinGraphMutation>;
export type PinGraphMutationResult = Apollo.MutationResult<PinGraphMutation>;
export type PinGraphMutationOptions = Apollo.BaseMutationOptions<PinGraphMutation, PinGraphMutationVariables>;
export const PinGraphQueryDocument = gql`
    mutation PinGraphQuery($input: PinGraphQueryInput!) {
  pinGraphQuery(input: $input) {
    ...DetailGraphQuery
  }
}
    ${DetailGraphQueryFragmentDoc}`;
export type PinGraphQueryMutationFn = Apollo.MutationFunction<PinGraphQueryMutation, PinGraphQueryMutationVariables>;

/**
 * __usePinGraphQueryMutation__
 *
 * To run a mutation, you first call `usePinGraphQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinGraphQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinGraphQueryMutation, { data, loading, error }] = usePinGraphQueryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePinGraphQueryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PinGraphQueryMutation, PinGraphQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PinGraphQueryMutation, PinGraphQueryMutationVariables>(PinGraphQueryDocument, options);
      }
export type PinGraphQueryMutationHookResult = ReturnType<typeof usePinGraphQueryMutation>;
export type PinGraphQueryMutationResult = Apollo.MutationResult<PinGraphQueryMutation>;
export type PinGraphQueryMutationOptions = Apollo.BaseMutationOptions<PinGraphQueryMutation, PinGraphQueryMutationVariables>;
export const CreateGraphViewDocument = gql`
    mutation CreateGraphView($input: GraphViewInput!) {
  createGraphView(input: $input) {
    ...GraphView
  }
}
    ${GraphViewFragmentDoc}`;
export type CreateGraphViewMutationFn = Apollo.MutationFunction<CreateGraphViewMutation, CreateGraphViewMutationVariables>;

/**
 * __useCreateGraphViewMutation__
 *
 * To run a mutation, you first call `useCreateGraphViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGraphViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGraphViewMutation, { data, loading, error }] = useCreateGraphViewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGraphViewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateGraphViewMutation, CreateGraphViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateGraphViewMutation, CreateGraphViewMutationVariables>(CreateGraphViewDocument, options);
      }
export type CreateGraphViewMutationHookResult = ReturnType<typeof useCreateGraphViewMutation>;
export type CreateGraphViewMutationResult = Apollo.MutationResult<CreateGraphViewMutation>;
export type CreateGraphViewMutationOptions = Apollo.BaseMutationOptions<CreateGraphViewMutation, CreateGraphViewMutationVariables>;
export const PinNodeQueryDocument = gql`
    mutation PinNodeQuery($input: PinNodeQueryInput!) {
  pinNodeQuery(input: $input) {
    ...DetailNodeQuery
  }
}
    ${DetailNodeQueryFragmentDoc}`;
export type PinNodeQueryMutationFn = Apollo.MutationFunction<PinNodeQueryMutation, PinNodeQueryMutationVariables>;

/**
 * __usePinNodeQueryMutation__
 *
 * To run a mutation, you first call `usePinNodeQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinNodeQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinNodeQueryMutation, { data, loading, error }] = usePinNodeQueryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePinNodeQueryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PinNodeQueryMutation, PinNodeQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PinNodeQueryMutation, PinNodeQueryMutationVariables>(PinNodeQueryDocument, options);
      }
export type PinNodeQueryMutationHookResult = ReturnType<typeof usePinNodeQueryMutation>;
export type PinNodeQueryMutationResult = Apollo.MutationResult<PinNodeQueryMutation>;
export type PinNodeQueryMutationOptions = Apollo.BaseMutationOptions<PinNodeQueryMutation, PinNodeQueryMutationVariables>;
export const CreateNodeViewDocument = gql`
    mutation CreateNodeView($input: NodeViewInput!) {
  createNodeView(input: $input) {
    ...NodeView
  }
}
    ${NodeViewFragmentDoc}`;
export type CreateNodeViewMutationFn = Apollo.MutationFunction<CreateNodeViewMutation, CreateNodeViewMutationVariables>;

/**
 * __useCreateNodeViewMutation__
 *
 * To run a mutation, you first call `useCreateNodeViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNodeViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNodeViewMutation, { data, loading, error }] = useCreateNodeViewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNodeViewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateNodeViewMutation, CreateNodeViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateNodeViewMutation, CreateNodeViewMutationVariables>(CreateNodeViewDocument, options);
      }
export type CreateNodeViewMutationHookResult = ReturnType<typeof useCreateNodeViewMutation>;
export type CreateNodeViewMutationResult = Apollo.MutationResult<CreateNodeViewMutation>;
export type CreateNodeViewMutationOptions = Apollo.BaseMutationOptions<CreateNodeViewMutation, CreateNodeViewMutationVariables>;
export const CreateOntologyDocument = gql`
    mutation CreateOntology($input: OntologyInput!) {
  createOntology(input: $input) {
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
 *      input: // value for 'input'
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
export const UpdateOntologyDocument = gql`
    mutation UpdateOntology($input: UpdateOntologyInput!) {
  updateOntology(input: $input) {
    ...Ontology
  }
}
    ${OntologyFragmentDoc}`;
export type UpdateOntologyMutationFn = Apollo.MutationFunction<UpdateOntologyMutation, UpdateOntologyMutationVariables>;

/**
 * __useUpdateOntologyMutation__
 *
 * To run a mutation, you first call `useUpdateOntologyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOntologyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOntologyMutation, { data, loading, error }] = useUpdateOntologyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOntologyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateOntologyMutation, UpdateOntologyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateOntologyMutation, UpdateOntologyMutationVariables>(UpdateOntologyDocument, options);
      }
export type UpdateOntologyMutationHookResult = ReturnType<typeof useUpdateOntologyMutation>;
export type UpdateOntologyMutationResult = Apollo.MutationResult<UpdateOntologyMutation>;
export type UpdateOntologyMutationOptions = Apollo.BaseMutationOptions<UpdateOntologyMutation, UpdateOntologyMutationVariables>;
export const DeleteOntologyDocument = gql`
    mutation DeleteOntology($id: ID!) {
  deleteOntology(input: {id: $id})
}
    `;
export type DeleteOntologyMutationFn = Apollo.MutationFunction<DeleteOntologyMutation, DeleteOntologyMutationVariables>;

/**
 * __useDeleteOntologyMutation__
 *
 * To run a mutation, you first call `useDeleteOntologyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOntologyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOntologyMutation, { data, loading, error }] = useDeleteOntologyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOntologyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteOntologyMutation, DeleteOntologyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteOntologyMutation, DeleteOntologyMutationVariables>(DeleteOntologyDocument, options);
      }
export type DeleteOntologyMutationHookResult = ReturnType<typeof useDeleteOntologyMutation>;
export type DeleteOntologyMutationResult = Apollo.MutationResult<DeleteOntologyMutation>;
export type DeleteOntologyMutationOptions = Apollo.BaseMutationOptions<DeleteOntologyMutation, DeleteOntologyMutationVariables>;
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
    mutation CreateProtocolStep($input: ProtocolStepInput!) {
  createProtocolStep(input: $input) {
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
 *      input: // value for 'input'
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
    mutation UpdateProtocolStep($input: UpdateProtocolStepInput!) {
  updateProtocolStep(input: $input) {
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
 *      input: // value for 'input'
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
export const CreateProtocolStepTemplateDocument = gql`
    mutation CreateProtocolStepTemplate($input: ProtocolStepTemplateInput!) {
  createProtocolStepTemplate(input: $input) {
    ...ProtocolStepTemplate
  }
}
    ${ProtocolStepTemplateFragmentDoc}`;
export type CreateProtocolStepTemplateMutationFn = Apollo.MutationFunction<CreateProtocolStepTemplateMutation, CreateProtocolStepTemplateMutationVariables>;

/**
 * __useCreateProtocolStepTemplateMutation__
 *
 * To run a mutation, you first call `useCreateProtocolStepTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProtocolStepTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProtocolStepTemplateMutation, { data, loading, error }] = useCreateProtocolStepTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProtocolStepTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProtocolStepTemplateMutation, CreateProtocolStepTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateProtocolStepTemplateMutation, CreateProtocolStepTemplateMutationVariables>(CreateProtocolStepTemplateDocument, options);
      }
export type CreateProtocolStepTemplateMutationHookResult = ReturnType<typeof useCreateProtocolStepTemplateMutation>;
export type CreateProtocolStepTemplateMutationResult = Apollo.MutationResult<CreateProtocolStepTemplateMutation>;
export type CreateProtocolStepTemplateMutationOptions = Apollo.BaseMutationOptions<CreateProtocolStepTemplateMutation, CreateProtocolStepTemplateMutationVariables>;
export const UpdateProtocolStepTemplateDocument = gql`
    mutation UpdateProtocolStepTemplate($input: UpdateProtocolStepTemplateInput!) {
  updateProtocolStepTemplate(input: $input) {
    ...ProtocolStepTemplate
  }
}
    ${ProtocolStepTemplateFragmentDoc}`;
export type UpdateProtocolStepTemplateMutationFn = Apollo.MutationFunction<UpdateProtocolStepTemplateMutation, UpdateProtocolStepTemplateMutationVariables>;

/**
 * __useUpdateProtocolStepTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateProtocolStepTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProtocolStepTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProtocolStepTemplateMutation, { data, loading, error }] = useUpdateProtocolStepTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProtocolStepTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProtocolStepTemplateMutation, UpdateProtocolStepTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateProtocolStepTemplateMutation, UpdateProtocolStepTemplateMutationVariables>(UpdateProtocolStepTemplateDocument, options);
      }
export type UpdateProtocolStepTemplateMutationHookResult = ReturnType<typeof useUpdateProtocolStepTemplateMutation>;
export type UpdateProtocolStepTemplateMutationResult = Apollo.MutationResult<UpdateProtocolStepTemplateMutation>;
export type UpdateProtocolStepTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateProtocolStepTemplateMutation, UpdateProtocolStepTemplateMutationVariables>;
export const CreateReagentDocument = gql`
    mutation CreateReagent($input: ReagentInput!) {
  createReagent(input: $input) {
    ...Reagent
  }
}
    ${ReagentFragmentDoc}`;
export type CreateReagentMutationFn = Apollo.MutationFunction<CreateReagentMutation, CreateReagentMutationVariables>;

/**
 * __useCreateReagentMutation__
 *
 * To run a mutation, you first call `useCreateReagentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReagentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReagentMutation, { data, loading, error }] = useCreateReagentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateReagentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateReagentMutation, CreateReagentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateReagentMutation, CreateReagentMutationVariables>(CreateReagentDocument, options);
      }
export type CreateReagentMutationHookResult = ReturnType<typeof useCreateReagentMutation>;
export type CreateReagentMutationResult = Apollo.MutationResult<CreateReagentMutation>;
export type CreateReagentMutationOptions = Apollo.BaseMutationOptions<CreateReagentMutation, CreateReagentMutationVariables>;
export const DeleteScatterPlotDocument = gql`
    mutation DeleteScatterPlot($id: ID!) {
  deleteScatterPlot(input: {id: $id})
}
    `;
export type DeleteScatterPlotMutationFn = Apollo.MutationFunction<DeleteScatterPlotMutation, DeleteScatterPlotMutationVariables>;

/**
 * __useDeleteScatterPlotMutation__
 *
 * To run a mutation, you first call `useDeleteScatterPlotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteScatterPlotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteScatterPlotMutation, { data, loading, error }] = useDeleteScatterPlotMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteScatterPlotMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteScatterPlotMutation, DeleteScatterPlotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteScatterPlotMutation, DeleteScatterPlotMutationVariables>(DeleteScatterPlotDocument, options);
      }
export type DeleteScatterPlotMutationHookResult = ReturnType<typeof useDeleteScatterPlotMutation>;
export type DeleteScatterPlotMutationResult = Apollo.MutationResult<DeleteScatterPlotMutation>;
export type DeleteScatterPlotMutationOptions = Apollo.BaseMutationOptions<DeleteScatterPlotMutation, DeleteScatterPlotMutationVariables>;
export const CreateStructureDocument = gql`
    mutation CreateStructure($input: StructureInput!) {
  createStructure(input: $input) {
    ...Structure
  }
}
    ${StructureFragmentDoc}`;
export type CreateStructureMutationFn = Apollo.MutationFunction<CreateStructureMutation, CreateStructureMutationVariables>;

/**
 * __useCreateStructureMutation__
 *
 * To run a mutation, you first call `useCreateStructureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStructureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStructureMutation, { data, loading, error }] = useCreateStructureMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateStructureMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateStructureMutation, CreateStructureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateStructureMutation, CreateStructureMutationVariables>(CreateStructureDocument, options);
      }
export type CreateStructureMutationHookResult = ReturnType<typeof useCreateStructureMutation>;
export type CreateStructureMutationResult = Apollo.MutationResult<CreateStructureMutation>;
export type CreateStructureMutationOptions = Apollo.BaseMutationOptions<CreateStructureMutation, CreateStructureMutationVariables>;
export const RequestMediaUploadDocument = gql`
    mutation RequestMediaUpload($key: String!, $datalayer: String!) {
  requestUpload(input: {key: $key, datalayer: $datalayer}) {
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
export const GetEdgeDocument = gql`
    query GetEdge($id: ID!) {
  edge(id: $id) {
    ...Edge
  }
}
    ${EdgeFragmentDoc}`;

/**
 * __useGetEdgeQuery__
 *
 * To run a query within a React component, call `useGetEdgeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEdgeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEdgeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEdgeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetEdgeQuery, GetEdgeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetEdgeQuery, GetEdgeQueryVariables>(GetEdgeDocument, options);
      }
export function useGetEdgeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetEdgeQuery, GetEdgeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetEdgeQuery, GetEdgeQueryVariables>(GetEdgeDocument, options);
        }
export type GetEdgeQueryHookResult = ReturnType<typeof useGetEdgeQuery>;
export type GetEdgeLazyQueryHookResult = ReturnType<typeof useGetEdgeLazyQuery>;
export type GetEdgeQueryResult = Apollo.QueryResult<GetEdgeQuery, GetEdgeQueryVariables>;
export const GetGenericCategoryDocument = gql`
    query GetGenericCategory($id: ID!) {
  genericCategory(id: $id) {
    ...GenericCategory
  }
}
    ${GenericCategoryFragmentDoc}`;

/**
 * __useGetGenericCategoryQuery__
 *
 * To run a query within a React component, call `useGetGenericCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGenericCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGenericCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGenericCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetGenericCategoryQuery, GetGenericCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetGenericCategoryQuery, GetGenericCategoryQueryVariables>(GetGenericCategoryDocument, options);
      }
export function useGetGenericCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGenericCategoryQuery, GetGenericCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetGenericCategoryQuery, GetGenericCategoryQueryVariables>(GetGenericCategoryDocument, options);
        }
export type GetGenericCategoryQueryHookResult = ReturnType<typeof useGetGenericCategoryQuery>;
export type GetGenericCategoryLazyQueryHookResult = ReturnType<typeof useGetGenericCategoryLazyQuery>;
export type GetGenericCategoryQueryResult = Apollo.QueryResult<GetGenericCategoryQuery, GetGenericCategoryQueryVariables>;
export const SearchGenericCategoryDocument = gql`
    query SearchGenericCategory($search: String, $values: [ID!]) {
  options: genericCategories(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchGenericCategoryQuery__
 *
 * To run a query within a React component, call `useSearchGenericCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchGenericCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchGenericCategoryQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchGenericCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchGenericCategoryQuery, SearchGenericCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchGenericCategoryQuery, SearchGenericCategoryQueryVariables>(SearchGenericCategoryDocument, options);
      }
export function useSearchGenericCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchGenericCategoryQuery, SearchGenericCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchGenericCategoryQuery, SearchGenericCategoryQueryVariables>(SearchGenericCategoryDocument, options);
        }
export type SearchGenericCategoryQueryHookResult = ReturnType<typeof useSearchGenericCategoryQuery>;
export type SearchGenericCategoryLazyQueryHookResult = ReturnType<typeof useSearchGenericCategoryLazyQuery>;
export type SearchGenericCategoryQueryResult = Apollo.QueryResult<SearchGenericCategoryQuery, SearchGenericCategoryQueryVariables>;
export const GetGraphDocument = gql`
    query GetGraph($id: ID!) {
  graph(id: $id) {
    ...Graph
  }
}
    ${GraphFragmentDoc}`;

/**
 * __useGetGraphQuery__
 *
 * To run a query within a React component, call `useGetGraphQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGraphQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGraphQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGraphQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetGraphQuery, GetGraphQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetGraphQuery, GetGraphQueryVariables>(GetGraphDocument, options);
      }
export function useGetGraphLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGraphQuery, GetGraphQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetGraphQuery, GetGraphQueryVariables>(GetGraphDocument, options);
        }
export type GetGraphQueryHookResult = ReturnType<typeof useGetGraphQuery>;
export type GetGraphLazyQueryHookResult = ReturnType<typeof useGetGraphLazyQuery>;
export type GetGraphQueryResult = Apollo.QueryResult<GetGraphQuery, GetGraphQueryVariables>;
export const MyActiveGraphDocument = gql`
    query MyActiveGraph {
  myActiveGraph {
    ...ListGraph
  }
}
    ${ListGraphFragmentDoc}`;

/**
 * __useMyActiveGraphQuery__
 *
 * To run a query within a React component, call `useMyActiveGraphQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyActiveGraphQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyActiveGraphQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyActiveGraphQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MyActiveGraphQuery, MyActiveGraphQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MyActiveGraphQuery, MyActiveGraphQueryVariables>(MyActiveGraphDocument, options);
      }
export function useMyActiveGraphLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyActiveGraphQuery, MyActiveGraphQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MyActiveGraphQuery, MyActiveGraphQueryVariables>(MyActiveGraphDocument, options);
        }
export type MyActiveGraphQueryHookResult = ReturnType<typeof useMyActiveGraphQuery>;
export type MyActiveGraphLazyQueryHookResult = ReturnType<typeof useMyActiveGraphLazyQuery>;
export type MyActiveGraphQueryResult = Apollo.QueryResult<MyActiveGraphQuery, MyActiveGraphQueryVariables>;
export const ListGraphsDocument = gql`
    query ListGraphs($filters: GraphFilter, $pagination: OffsetPaginationInput) {
  graphs(filters: $filters, pagination: $pagination) {
    ...ListGraph
  }
}
    ${ListGraphFragmentDoc}`;

/**
 * __useListGraphsQuery__
 *
 * To run a query within a React component, call `useListGraphsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListGraphsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListGraphsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListGraphsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListGraphsQuery, ListGraphsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListGraphsQuery, ListGraphsQueryVariables>(ListGraphsDocument, options);
      }
export function useListGraphsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListGraphsQuery, ListGraphsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListGraphsQuery, ListGraphsQueryVariables>(ListGraphsDocument, options);
        }
export type ListGraphsQueryHookResult = ReturnType<typeof useListGraphsQuery>;
export type ListGraphsLazyQueryHookResult = ReturnType<typeof useListGraphsLazyQuery>;
export type ListGraphsQueryResult = Apollo.QueryResult<ListGraphsQuery, ListGraphsQueryVariables>;
export const SearchGraphsDocument = gql`
    query SearchGraphs($search: String, $values: [ID!]) {
  options: graphs(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchGraphsQuery__
 *
 * To run a query within a React component, call `useSearchGraphsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchGraphsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchGraphsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchGraphsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchGraphsQuery, SearchGraphsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchGraphsQuery, SearchGraphsQueryVariables>(SearchGraphsDocument, options);
      }
export function useSearchGraphsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchGraphsQuery, SearchGraphsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchGraphsQuery, SearchGraphsQueryVariables>(SearchGraphsDocument, options);
        }
export type SearchGraphsQueryHookResult = ReturnType<typeof useSearchGraphsQuery>;
export type SearchGraphsLazyQueryHookResult = ReturnType<typeof useSearchGraphsLazyQuery>;
export type SearchGraphsQueryResult = Apollo.QueryResult<SearchGraphsQuery, SearchGraphsQueryVariables>;
export const GetGraphQueryDocument = gql`
    query GetGraphQuery($id: ID!) {
  graphQuery(id: $id) {
    ...DetailGraphQuery
  }
}
    ${DetailGraphQueryFragmentDoc}`;

/**
 * __useGetGraphQueryQuery__
 *
 * To run a query within a React component, call `useGetGraphQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGraphQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGraphQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGraphQueryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetGraphQueryQuery, GetGraphQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetGraphQueryQuery, GetGraphQueryQueryVariables>(GetGraphQueryDocument, options);
      }
export function useGetGraphQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGraphQueryQuery, GetGraphQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetGraphQueryQuery, GetGraphQueryQueryVariables>(GetGraphQueryDocument, options);
        }
export type GetGraphQueryQueryHookResult = ReturnType<typeof useGetGraphQueryQuery>;
export type GetGraphQueryLazyQueryHookResult = ReturnType<typeof useGetGraphQueryLazyQuery>;
export type GetGraphQueryQueryResult = Apollo.QueryResult<GetGraphQueryQuery, GetGraphQueryQueryVariables>;
export const SearchGraphQueriesDocument = gql`
    query SearchGraphQueries($search: String, $values: [ID!]) {
  options: graphQueries(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchGraphQueriesQuery__
 *
 * To run a query within a React component, call `useSearchGraphQueriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchGraphQueriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchGraphQueriesQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchGraphQueriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchGraphQueriesQuery, SearchGraphQueriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchGraphQueriesQuery, SearchGraphQueriesQueryVariables>(SearchGraphQueriesDocument, options);
      }
export function useSearchGraphQueriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchGraphQueriesQuery, SearchGraphQueriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchGraphQueriesQuery, SearchGraphQueriesQueryVariables>(SearchGraphQueriesDocument, options);
        }
export type SearchGraphQueriesQueryHookResult = ReturnType<typeof useSearchGraphQueriesQuery>;
export type SearchGraphQueriesLazyQueryHookResult = ReturnType<typeof useSearchGraphQueriesLazyQuery>;
export type SearchGraphQueriesQueryResult = Apollo.QueryResult<SearchGraphQueriesQuery, SearchGraphQueriesQueryVariables>;
export const GetGraphViewDocument = gql`
    query GetGraphView($id: ID!) {
  graphView(id: $id) {
    ...GraphView
  }
}
    ${GraphViewFragmentDoc}`;

/**
 * __useGetGraphViewQuery__
 *
 * To run a query within a React component, call `useGetGraphViewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGraphViewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGraphViewQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGraphViewQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetGraphViewQuery, GetGraphViewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetGraphViewQuery, GetGraphViewQueryVariables>(GetGraphViewDocument, options);
      }
export function useGetGraphViewLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGraphViewQuery, GetGraphViewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetGraphViewQuery, GetGraphViewQueryVariables>(GetGraphViewDocument, options);
        }
export type GetGraphViewQueryHookResult = ReturnType<typeof useGetGraphViewQuery>;
export type GetGraphViewLazyQueryHookResult = ReturnType<typeof useGetGraphViewLazyQuery>;
export type GetGraphViewQueryResult = Apollo.QueryResult<GetGraphViewQuery, GetGraphViewQueryVariables>;
export const SearchGraphViewsDocument = gql`
    query SearchGraphViews($search: String, $values: [ID!]) {
  options: graphViews(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchGraphViewsQuery__
 *
 * To run a query within a React component, call `useSearchGraphViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchGraphViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchGraphViewsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchGraphViewsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchGraphViewsQuery, SearchGraphViewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchGraphViewsQuery, SearchGraphViewsQueryVariables>(SearchGraphViewsDocument, options);
      }
export function useSearchGraphViewsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchGraphViewsQuery, SearchGraphViewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchGraphViewsQuery, SearchGraphViewsQueryVariables>(SearchGraphViewsDocument, options);
        }
export type SearchGraphViewsQueryHookResult = ReturnType<typeof useSearchGraphViewsQuery>;
export type SearchGraphViewsLazyQueryHookResult = ReturnType<typeof useSearchGraphViewsLazyQuery>;
export type SearchGraphViewsQueryResult = Apollo.QueryResult<SearchGraphViewsQuery, SearchGraphViewsQueryVariables>;
export const GetMeasurmentCategoryDocument = gql`
    query GetMeasurmentCategory($id: ID!) {
  measurementCategory(id: $id) {
    ...MeasurementCategory
  }
}
    ${MeasurementCategoryFragmentDoc}`;

/**
 * __useGetMeasurmentCategoryQuery__
 *
 * To run a query within a React component, call `useGetMeasurmentCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeasurmentCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeasurmentCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMeasurmentCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetMeasurmentCategoryQuery, GetMeasurmentCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMeasurmentCategoryQuery, GetMeasurmentCategoryQueryVariables>(GetMeasurmentCategoryDocument, options);
      }
export function useGetMeasurmentCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMeasurmentCategoryQuery, GetMeasurmentCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMeasurmentCategoryQuery, GetMeasurmentCategoryQueryVariables>(GetMeasurmentCategoryDocument, options);
        }
export type GetMeasurmentCategoryQueryHookResult = ReturnType<typeof useGetMeasurmentCategoryQuery>;
export type GetMeasurmentCategoryLazyQueryHookResult = ReturnType<typeof useGetMeasurmentCategoryLazyQuery>;
export type GetMeasurmentCategoryQueryResult = Apollo.QueryResult<GetMeasurmentCategoryQuery, GetMeasurmentCategoryQueryVariables>;
export const SearchMeasurmentCategoryDocument = gql`
    query SearchMeasurmentCategory($search: String, $values: [ID!]) {
  options: measurementCategories(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchMeasurmentCategoryQuery__
 *
 * To run a query within a React component, call `useSearchMeasurmentCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMeasurmentCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMeasurmentCategoryQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchMeasurmentCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchMeasurmentCategoryQuery, SearchMeasurmentCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchMeasurmentCategoryQuery, SearchMeasurmentCategoryQueryVariables>(SearchMeasurmentCategoryDocument, options);
      }
export function useSearchMeasurmentCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchMeasurmentCategoryQuery, SearchMeasurmentCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchMeasurmentCategoryQuery, SearchMeasurmentCategoryQueryVariables>(SearchMeasurmentCategoryDocument, options);
        }
export type SearchMeasurmentCategoryQueryHookResult = ReturnType<typeof useSearchMeasurmentCategoryQuery>;
export type SearchMeasurmentCategoryLazyQueryHookResult = ReturnType<typeof useSearchMeasurmentCategoryLazyQuery>;
export type SearchMeasurmentCategoryQueryResult = Apollo.QueryResult<SearchMeasurmentCategoryQuery, SearchMeasurmentCategoryQueryVariables>;
export const GetNodeDocument = gql`
    query GetNode($id: ID!) {
  node(id: $id) {
    ...DetailNode
  }
}
    ${DetailNodeFragmentDoc}`;

/**
 * __useGetNodeQuery__
 *
 * To run a query within a React component, call `useGetNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNodeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetNodeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetNodeQuery, GetNodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetNodeQuery, GetNodeQueryVariables>(GetNodeDocument, options);
      }
export function useGetNodeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNodeQuery, GetNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetNodeQuery, GetNodeQueryVariables>(GetNodeDocument, options);
        }
export type GetNodeQueryHookResult = ReturnType<typeof useGetNodeQuery>;
export type GetNodeLazyQueryHookResult = ReturnType<typeof useGetNodeLazyQuery>;
export type GetNodeQueryResult = Apollo.QueryResult<GetNodeQuery, GetNodeQueryVariables>;
export const GetNodeViewDocument = gql`
    query GetNodeView($id: ID!) {
  nodeView(id: $id) {
    ...NodeView
  }
}
    ${NodeViewFragmentDoc}`;

/**
 * __useGetNodeViewQuery__
 *
 * To run a query within a React component, call `useGetNodeViewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNodeViewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNodeViewQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetNodeViewQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetNodeViewQuery, GetNodeViewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetNodeViewQuery, GetNodeViewQueryVariables>(GetNodeViewDocument, options);
      }
export function useGetNodeViewLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNodeViewQuery, GetNodeViewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetNodeViewQuery, GetNodeViewQueryVariables>(GetNodeViewDocument, options);
        }
export type GetNodeViewQueryHookResult = ReturnType<typeof useGetNodeViewQuery>;
export type GetNodeViewLazyQueryHookResult = ReturnType<typeof useGetNodeViewLazyQuery>;
export type GetNodeViewQueryResult = Apollo.QueryResult<GetNodeViewQuery, GetNodeViewQueryVariables>;
export const SearchNodeViewsDocument = gql`
    query SearchNodeViews($search: String, $values: [ID!]) {
  options: nodeViews(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchNodeViewsQuery__
 *
 * To run a query within a React component, call `useSearchNodeViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchNodeViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchNodeViewsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchNodeViewsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchNodeViewsQuery, SearchNodeViewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchNodeViewsQuery, SearchNodeViewsQueryVariables>(SearchNodeViewsDocument, options);
      }
export function useSearchNodeViewsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchNodeViewsQuery, SearchNodeViewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchNodeViewsQuery, SearchNodeViewsQueryVariables>(SearchNodeViewsDocument, options);
        }
export type SearchNodeViewsQueryHookResult = ReturnType<typeof useSearchNodeViewsQuery>;
export type SearchNodeViewsLazyQueryHookResult = ReturnType<typeof useSearchNodeViewsLazyQuery>;
export type SearchNodeViewsQueryResult = Apollo.QueryResult<SearchNodeViewsQuery, SearchNodeViewsQueryVariables>;
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
export const GetPlotViewDocument = gql`
    query GetPlotView($id: ID!) {
  plotView(id: $id) {
    ...PlotView
  }
}
    ${PlotViewFragmentDoc}`;

/**
 * __useGetPlotViewQuery__
 *
 * To run a query within a React component, call `useGetPlotViewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlotViewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlotViewQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPlotViewQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPlotViewQuery, GetPlotViewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPlotViewQuery, GetPlotViewQueryVariables>(GetPlotViewDocument, options);
      }
export function useGetPlotViewLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPlotViewQuery, GetPlotViewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPlotViewQuery, GetPlotViewQueryVariables>(GetPlotViewDocument, options);
        }
export type GetPlotViewQueryHookResult = ReturnType<typeof useGetPlotViewQuery>;
export type GetPlotViewLazyQueryHookResult = ReturnType<typeof useGetPlotViewLazyQuery>;
export type GetPlotViewQueryResult = Apollo.QueryResult<GetPlotViewQuery, GetPlotViewQueryVariables>;
export const LatestPlotViewsDocument = gql`
    query LatestPlotViews {
  plotViews(pagination: {limit: 10}) {
    ...CarouselPlotView
  }
}
    ${CarouselPlotViewFragmentDoc}`;

/**
 * __useLatestPlotViewsQuery__
 *
 * To run a query within a React component, call `useLatestPlotViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLatestPlotViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLatestPlotViewsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLatestPlotViewsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<LatestPlotViewsQuery, LatestPlotViewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<LatestPlotViewsQuery, LatestPlotViewsQueryVariables>(LatestPlotViewsDocument, options);
      }
export function useLatestPlotViewsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LatestPlotViewsQuery, LatestPlotViewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<LatestPlotViewsQuery, LatestPlotViewsQueryVariables>(LatestPlotViewsDocument, options);
        }
export type LatestPlotViewsQueryHookResult = ReturnType<typeof useLatestPlotViewsQuery>;
export type LatestPlotViewsLazyQueryHookResult = ReturnType<typeof useLatestPlotViewsLazyQuery>;
export type LatestPlotViewsQueryResult = Apollo.QueryResult<LatestPlotViewsQuery, LatestPlotViewsQueryVariables>;
export const ListPlotViewsDocument = gql`
    query ListPlotViews {
  plotViews {
    ...ListPlotView
  }
}
    ${ListPlotViewFragmentDoc}`;

/**
 * __useListPlotViewsQuery__
 *
 * To run a query within a React component, call `useListPlotViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPlotViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPlotViewsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListPlotViewsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListPlotViewsQuery, ListPlotViewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListPlotViewsQuery, ListPlotViewsQueryVariables>(ListPlotViewsDocument, options);
      }
export function useListPlotViewsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListPlotViewsQuery, ListPlotViewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListPlotViewsQuery, ListPlotViewsQueryVariables>(ListPlotViewsDocument, options);
        }
export type ListPlotViewsQueryHookResult = ReturnType<typeof useListPlotViewsQuery>;
export type ListPlotViewsLazyQueryHookResult = ReturnType<typeof useListPlotViewsLazyQuery>;
export type ListPlotViewsQueryResult = Apollo.QueryResult<ListPlotViewsQuery, ListPlotViewsQueryVariables>;
export const SearchPlotViewsDocument = gql`
    query SearchPlotViews($search: String, $values: [ID!]) {
  options: plotViews(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchPlotViewsQuery__
 *
 * To run a query within a React component, call `useSearchPlotViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPlotViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPlotViewsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchPlotViewsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchPlotViewsQuery, SearchPlotViewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchPlotViewsQuery, SearchPlotViewsQueryVariables>(SearchPlotViewsDocument, options);
      }
export function useSearchPlotViewsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchPlotViewsQuery, SearchPlotViewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchPlotViewsQuery, SearchPlotViewsQueryVariables>(SearchPlotViewsDocument, options);
        }
export type SearchPlotViewsQueryHookResult = ReturnType<typeof useSearchPlotViewsQuery>;
export type SearchPlotViewsLazyQueryHookResult = ReturnType<typeof useSearchPlotViewsLazyQuery>;
export type SearchPlotViewsQueryResult = Apollo.QueryResult<SearchPlotViewsQuery, SearchPlotViewsQueryVariables>;
export const GetProtocolStepTemplateDocument = gql`
    query GetProtocolStepTemplate($id: ID!) {
  protocolStepTemplate(id: $id) {
    ...ProtocolStepTemplate
  }
}
    ${ProtocolStepTemplateFragmentDoc}`;

/**
 * __useGetProtocolStepTemplateQuery__
 *
 * To run a query within a React component, call `useGetProtocolStepTemplateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProtocolStepTemplateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProtocolStepTemplateQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProtocolStepTemplateQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetProtocolStepTemplateQuery, GetProtocolStepTemplateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetProtocolStepTemplateQuery, GetProtocolStepTemplateQueryVariables>(GetProtocolStepTemplateDocument, options);
      }
export function useGetProtocolStepTemplateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProtocolStepTemplateQuery, GetProtocolStepTemplateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetProtocolStepTemplateQuery, GetProtocolStepTemplateQueryVariables>(GetProtocolStepTemplateDocument, options);
        }
export type GetProtocolStepTemplateQueryHookResult = ReturnType<typeof useGetProtocolStepTemplateQuery>;
export type GetProtocolStepTemplateLazyQueryHookResult = ReturnType<typeof useGetProtocolStepTemplateLazyQuery>;
export type GetProtocolStepTemplateQueryResult = Apollo.QueryResult<GetProtocolStepTemplateQuery, GetProtocolStepTemplateQueryVariables>;
export const ListProtocolStepTemplatesDocument = gql`
    query ListProtocolStepTemplates($filters: ProtocolStepTemplateFilter, $pagination: OffsetPaginationInput) {
  protocolStepTemplates(filters: $filters, pagination: $pagination) {
    ...ListProtocolStepTemplate
  }
}
    ${ListProtocolStepTemplateFragmentDoc}`;

/**
 * __useListProtocolStepTemplatesQuery__
 *
 * To run a query within a React component, call `useListProtocolStepTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListProtocolStepTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListProtocolStepTemplatesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListProtocolStepTemplatesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListProtocolStepTemplatesQuery, ListProtocolStepTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListProtocolStepTemplatesQuery, ListProtocolStepTemplatesQueryVariables>(ListProtocolStepTemplatesDocument, options);
      }
export function useListProtocolStepTemplatesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListProtocolStepTemplatesQuery, ListProtocolStepTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListProtocolStepTemplatesQuery, ListProtocolStepTemplatesQueryVariables>(ListProtocolStepTemplatesDocument, options);
        }
export type ListProtocolStepTemplatesQueryHookResult = ReturnType<typeof useListProtocolStepTemplatesQuery>;
export type ListProtocolStepTemplatesLazyQueryHookResult = ReturnType<typeof useListProtocolStepTemplatesLazyQuery>;
export type ListProtocolStepTemplatesQueryResult = Apollo.QueryResult<ListProtocolStepTemplatesQuery, ListProtocolStepTemplatesQueryVariables>;
export const SearchProtocolStepTemplatesDocument = gql`
    query SearchProtocolStepTemplates($search: String, $values: [ID!]) {
  options: protocolStepTemplates(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchProtocolStepTemplatesQuery__
 *
 * To run a query within a React component, call `useSearchProtocolStepTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProtocolStepTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProtocolStepTemplatesQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchProtocolStepTemplatesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchProtocolStepTemplatesQuery, SearchProtocolStepTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchProtocolStepTemplatesQuery, SearchProtocolStepTemplatesQueryVariables>(SearchProtocolStepTemplatesDocument, options);
      }
export function useSearchProtocolStepTemplatesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchProtocolStepTemplatesQuery, SearchProtocolStepTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchProtocolStepTemplatesQuery, SearchProtocolStepTemplatesQueryVariables>(SearchProtocolStepTemplatesDocument, options);
        }
export type SearchProtocolStepTemplatesQueryHookResult = ReturnType<typeof useSearchProtocolStepTemplatesQuery>;
export type SearchProtocolStepTemplatesLazyQueryHookResult = ReturnType<typeof useSearchProtocolStepTemplatesLazyQuery>;
export type SearchProtocolStepTemplatesQueryResult = Apollo.QueryResult<SearchProtocolStepTemplatesQuery, SearchProtocolStepTemplatesQueryVariables>;
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
export const GetReagentDocument = gql`
    query GetReagent($id: ID!) {
  reagent(id: $id) {
    ...Reagent
  }
}
    ${ReagentFragmentDoc}`;

/**
 * __useGetReagentQuery__
 *
 * To run a query within a React component, call `useGetReagentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReagentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReagentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetReagentQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetReagentQuery, GetReagentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetReagentQuery, GetReagentQueryVariables>(GetReagentDocument, options);
      }
export function useGetReagentLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetReagentQuery, GetReagentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetReagentQuery, GetReagentQueryVariables>(GetReagentDocument, options);
        }
export type GetReagentQueryHookResult = ReturnType<typeof useGetReagentQuery>;
export type GetReagentLazyQueryHookResult = ReturnType<typeof useGetReagentLazyQuery>;
export type GetReagentQueryResult = Apollo.QueryResult<GetReagentQuery, GetReagentQueryVariables>;
export const ListReagentsDocument = gql`
    query ListReagents($filters: ReagentFilter, $pagination: OffsetPaginationInput) {
  reagents(filters: $filters, pagination: $pagination) {
    ...ListReagent
  }
}
    ${ListReagentFragmentDoc}`;

/**
 * __useListReagentsQuery__
 *
 * To run a query within a React component, call `useListReagentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListReagentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListReagentsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListReagentsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListReagentsQuery, ListReagentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListReagentsQuery, ListReagentsQueryVariables>(ListReagentsDocument, options);
      }
export function useListReagentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListReagentsQuery, ListReagentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListReagentsQuery, ListReagentsQueryVariables>(ListReagentsDocument, options);
        }
export type ListReagentsQueryHookResult = ReturnType<typeof useListReagentsQuery>;
export type ListReagentsLazyQueryHookResult = ReturnType<typeof useListReagentsLazyQuery>;
export type ListReagentsQueryResult = Apollo.QueryResult<ListReagentsQuery, ListReagentsQueryVariables>;
export const SearchReagentsDocument = gql`
    query SearchReagents($search: String, $values: [ID!]) {
  options: reagents(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchReagentsQuery__
 *
 * To run a query within a React component, call `useSearchReagentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchReagentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchReagentsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchReagentsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchReagentsQuery, SearchReagentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchReagentsQuery, SearchReagentsQueryVariables>(SearchReagentsDocument, options);
      }
export function useSearchReagentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchReagentsQuery, SearchReagentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchReagentsQuery, SearchReagentsQueryVariables>(SearchReagentsDocument, options);
        }
export type SearchReagentsQueryHookResult = ReturnType<typeof useSearchReagentsQuery>;
export type SearchReagentsLazyQueryHookResult = ReturnType<typeof useSearchReagentsLazyQuery>;
export type SearchReagentsQueryResult = Apollo.QueryResult<SearchReagentsQuery, SearchReagentsQueryVariables>;
export const GetRelationCategoryDocument = gql`
    query GetRelationCategory($id: ID!) {
  relationCategory(id: $id) {
    ...RelationCategory
  }
}
    ${RelationCategoryFragmentDoc}`;

/**
 * __useGetRelationCategoryQuery__
 *
 * To run a query within a React component, call `useGetRelationCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRelationCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRelationCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRelationCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRelationCategoryQuery, GetRelationCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRelationCategoryQuery, GetRelationCategoryQueryVariables>(GetRelationCategoryDocument, options);
      }
export function useGetRelationCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRelationCategoryQuery, GetRelationCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRelationCategoryQuery, GetRelationCategoryQueryVariables>(GetRelationCategoryDocument, options);
        }
export type GetRelationCategoryQueryHookResult = ReturnType<typeof useGetRelationCategoryQuery>;
export type GetRelationCategoryLazyQueryHookResult = ReturnType<typeof useGetRelationCategoryLazyQuery>;
export type GetRelationCategoryQueryResult = Apollo.QueryResult<GetRelationCategoryQuery, GetRelationCategoryQueryVariables>;
export const SearchRelationCategoryDocument = gql`
    query SearchRelationCategory($search: String, $values: [ID!]) {
  options: relationCategories(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchRelationCategoryQuery__
 *
 * To run a query within a React component, call `useSearchRelationCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchRelationCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchRelationCategoryQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchRelationCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchRelationCategoryQuery, SearchRelationCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchRelationCategoryQuery, SearchRelationCategoryQueryVariables>(SearchRelationCategoryDocument, options);
      }
export function useSearchRelationCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchRelationCategoryQuery, SearchRelationCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchRelationCategoryQuery, SearchRelationCategoryQueryVariables>(SearchRelationCategoryDocument, options);
        }
export type SearchRelationCategoryQueryHookResult = ReturnType<typeof useSearchRelationCategoryQuery>;
export type SearchRelationCategoryLazyQueryHookResult = ReturnType<typeof useSearchRelationCategoryLazyQuery>;
export type SearchRelationCategoryQueryResult = Apollo.QueryResult<SearchRelationCategoryQuery, SearchRelationCategoryQueryVariables>;
export const GlobalSearchDocument = gql`
    query GlobalSearch($search: String, $pagination: OffsetPaginationInput) {
  graphs: graphs(filters: {search: $search}, pagination: $pagination) {
    ...ListGraph
  }
  ontologies: ontologies(filters: {search: $search}, pagination: $pagination) {
    ...ListOntology
  }
}
    ${ListGraphFragmentDoc}
${ListOntologyFragmentDoc}`;

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
export const GetStructureDocument = gql`
    query GetStructure($identifier: StructureIdentifier!, $object: ID!, $graph: ID) {
  structure(graph: $graph, identifier: $identifier, object: $object) {
    ...KnowledgeStructure
  }
}
    ${KnowledgeStructureFragmentDoc}`;

/**
 * __useGetStructureQuery__
 *
 * To run a query within a React component, call `useGetStructureQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStructureQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStructureQuery({
 *   variables: {
 *      identifier: // value for 'identifier'
 *      object: // value for 'object'
 *      graph: // value for 'graph'
 *   },
 * });
 */
export function useGetStructureQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetStructureQuery, GetStructureQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetStructureQuery, GetStructureQueryVariables>(GetStructureDocument, options);
      }
export function useGetStructureLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetStructureQuery, GetStructureQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetStructureQuery, GetStructureQueryVariables>(GetStructureDocument, options);
        }
export type GetStructureQueryHookResult = ReturnType<typeof useGetStructureQuery>;
export type GetStructureLazyQueryHookResult = ReturnType<typeof useGetStructureLazyQuery>;
export type GetStructureQueryResult = Apollo.QueryResult<GetStructureQuery, GetStructureQueryVariables>;
export const GetStructureCategoryDocument = gql`
    query GetStructureCategory($id: ID!) {
  structureCategory(id: $id) {
    ...StructureCategory
  }
}
    ${StructureCategoryFragmentDoc}`;

/**
 * __useGetStructureCategoryQuery__
 *
 * To run a query within a React component, call `useGetStructureCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStructureCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStructureCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStructureCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetStructureCategoryQuery, GetStructureCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetStructureCategoryQuery, GetStructureCategoryQueryVariables>(GetStructureCategoryDocument, options);
      }
export function useGetStructureCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetStructureCategoryQuery, GetStructureCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetStructureCategoryQuery, GetStructureCategoryQueryVariables>(GetStructureCategoryDocument, options);
        }
export type GetStructureCategoryQueryHookResult = ReturnType<typeof useGetStructureCategoryQuery>;
export type GetStructureCategoryLazyQueryHookResult = ReturnType<typeof useGetStructureCategoryLazyQuery>;
export type GetStructureCategoryQueryResult = Apollo.QueryResult<GetStructureCategoryQuery, GetStructureCategoryQueryVariables>;
export const SearchStructureCategoryDocument = gql`
    query SearchStructureCategory($search: String, $values: [ID!]) {
  options: structureCategories(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchStructureCategoryQuery__
 *
 * To run a query within a React component, call `useSearchStructureCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchStructureCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchStructureCategoryQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchStructureCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchStructureCategoryQuery, SearchStructureCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchStructureCategoryQuery, SearchStructureCategoryQueryVariables>(SearchStructureCategoryDocument, options);
      }
export function useSearchStructureCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchStructureCategoryQuery, SearchStructureCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchStructureCategoryQuery, SearchStructureCategoryQueryVariables>(SearchStructureCategoryDocument, options);
        }
export type SearchStructureCategoryQueryHookResult = ReturnType<typeof useSearchStructureCategoryQuery>;
export type SearchStructureCategoryLazyQueryHookResult = ReturnType<typeof useSearchStructureCategoryLazyQuery>;
export type SearchStructureCategoryQueryResult = Apollo.QueryResult<SearchStructureCategoryQuery, SearchStructureCategoryQueryVariables>;