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
  Cypher: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Metric: { input: any; output: any; }
  NodeID: { input: any; output: any; }
  RemoteUpload: { input: any; output: any; }
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

/**  A ComputedMeasurement is a measurement that is computed from other measurements. It is a special kind of measurement that is derived from other measurements. */
export type ComputedMeasurement = Edge & {
  __typename?: 'ComputedMeasurement';
  /** When this entity was created */
  computedFrom: Array<Measurement>;
  /** When this entity was created */
  createdAt: Scalars['DateTime']['output'];
  expression: Expression;
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

/** Input for deleting an expression */
export type DeleteExpressionInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

export type DeleteGraphInput = {
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

export type Edge = {
  expression: Expression;
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  inferedBy: Edge;
  label: Scalars['String']['output'];
  leftId: Scalars['String']['output'];
  rightId: Scalars['String']['output'];
};

/** A Entity is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type Entity = Node & {
  __typename?: 'Entity';
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  expression: Expression;
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
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
  /**  The value  type of the metric */
  metricKind?: Maybe<MetricKind>;
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

/** Input for creating a new expression */
export type ExpressionInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['RemoteUpload']['input']>;
  /** The kind/type of this expression */
  kind: ExpressionKind;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** The type of metric data this expression represents */
  metricKind?: InputMaybe<MetricDataType>;
  /** The ID of the ontology this expression belongs to. If not provided, uses default ontology */
  ontology?: InputMaybe<Scalars['ID']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
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

/** A graph, that contains entities and relations. */
export type Graph = {
  __typename?: 'Graph';
  ageName: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  latestNodes: Array<Node>;
  name: Scalars['String']['output'];
  ontology: Ontology;
};


/** A graph, that contains entities and relations. */
export type GraphLatestNodesArgs = {
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};

export type GraphFilter = {
  AND?: InputMaybe<GraphFilter>;
  OR?: InputMaybe<GraphFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GraphInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  experiment?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  ontology: Scalars['ID']['input'];
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
  query: Scalars['String']['output'];
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
  /** When this entity was created */
  createdAt: Scalars['DateTime']['output'];
  expression: Expression;
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

export type MeasurementInput = {
  entity: Scalars['NodeID']['input'];
  expression: Scalars['ID']['input'];
  structure: Scalars['NodeID']['input'];
  validFrom?: InputMaybe<Scalars['DateTime']['input']>;
  validTo?: InputMaybe<Scalars['DateTime']['input']>;
  value?: InputMaybe<Scalars['Metric']['input']>;
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

export enum MetricDataType {
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

export enum MetricKind {
  Boolean = 'BOOLEAN',
  Date = 'DATE',
  Number = 'NUMBER',
  String = 'STRING',
  Vector = 'VECTOR'
}

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
  createExpression: Expression;
  /** Create a new graph */
  createGraph: Graph;
  /** Create a new graph query */
  createGraphQuery: GraphQuery;
  /** Create a new metric for an entity */
  createMeasurement: Measurement;
  /** Create a new model */
  createModel: Model;
  /** Create a new node query */
  createNodeQuery: NodeQuery;
  /** Create a new ontology */
  createOntology: Ontology;
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
  /** Create a new structure */
  createStructure: Structure;
  /** Delete an existing entity */
  deleteEntity: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteExpression: Scalars['ID']['output'];
  /** Delete an existing graph */
  deleteGraph: Scalars['ID']['output'];
  /** Delete an existing ontology */
  deleteOntology: Scalars['ID']['output'];
  /** Delete an existing protocol */
  deleteProtocol: Scalars['ID']['output'];
  /** Delete an existing protocol step */
  deleteProtocolStep: Scalars['ID']['output'];
  /** Delete an existing protocol step template */
  deleteProtocolStepTemplate: Scalars['ID']['output'];
  /** Request a new file upload */
  requestUpload: PresignedPostCredentials;
  /** Update an existing expression */
  updateExpression: Expression;
  /** Update an existing graph */
  updateGraph: Graph;
  /** Update an existing ontology */
  updateOntology: Ontology;
  /** Update an existing protocol step */
  updateProtocolStep: ProtocolStep;
  /** Update an existing protocol step template */
  updateProtocolStepTemplate: ProtocolStepTemplate;
};


export type MutationCreateEntityArgs = {
  input: EntityInput;
};


export type MutationCreateExpressionArgs = {
  input: ExpressionInput;
};


export type MutationCreateGraphArgs = {
  input: GraphInput;
};


export type MutationCreateGraphQueryArgs = {
  input: GraphQueryInput;
};


export type MutationCreateMeasurementArgs = {
  input: MeasurementInput;
};


export type MutationCreateModelArgs = {
  input: CreateModelInput;
};


export type MutationCreateNodeQueryArgs = {
  input: NodeQueryInput;
};


export type MutationCreateOntologyArgs = {
  input: OntologyInput;
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


export type MutationCreateStructureArgs = {
  input: StructureInput;
};


export type MutationDeleteEntityArgs = {
  input: DeleteEntityInput;
};


export type MutationDeleteExpressionArgs = {
  input: DeleteExpressionInput;
};


export type MutationDeleteGraphArgs = {
  input: DeleteGraphInput;
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


export type MutationRequestUploadArgs = {
  input: RequestMediaUploadInput;
};


export type MutationUpdateExpressionArgs = {
  input: UpdateExpressionInput;
};


export type MutationUpdateGraphArgs = {
  input: UpdateGraphInput;
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

export type Node = {
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
};


export type NodeEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};

/** A view of a node entities and relations. */
export type NodeQuery = {
  __typename?: 'NodeQuery';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kind: ViewKind;
  name: Scalars['String']['output'];
  ontology: Ontology;
  query: Scalars['String']['output'];
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
  expressions: Array<Expression>;
  /** The list of graph queries defined in this ontology */
  graphQueries: Array<GraphQuery>;
  /** The list of graphs defined in this ontology */
  graphs: Array<Graph>;
  /** The unique identifier of the ontology */
  id: Scalars['ID']['output'];
  /** The name of the ontology */
  name: Scalars['String']['output'];
  /** The list of node queries defined in this ontology */
  nodeQueries: Array<NodeQuery>;
  /** The Persistent URL (PURL) that uniquely identifies this ontology globally */
  purl?: Maybe<Scalars['String']['output']>;
  /** Optional associated media files like documentation or diagrams */
  store?: Maybe<MediaStore>;
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
export type OntologyNodeQueriesArgs = {
  filters?: InputMaybe<NodeQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

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
  /** The paired entities. */
  pairs: Array<Pair>;
};

export type Path = {
  __typename?: 'Path';
  edges: Array<Edge>;
  nodes: Array<Node>;
};

export type PathPairs = Pairs | Path;

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
  edge: Edge;
  /** List of all relationships between entities */
  edges: Array<Edge>;
  expression: Expression;
  expressions: Array<Expression>;
  graph: Graph;
  /** List of all knowledge graphs */
  graphs: Array<Graph>;
  model: Model;
  /** List of all deep learning models (e.g. neural networks) */
  models: Array<Model>;
  myActiveGraph: Graph;
  node: Node;
  /** List of all entities in the system */
  nodes: Array<Entity>;
  /** List of all ontologies */
  ontologies: Array<Ontology>;
  ontology: Ontology;
  /** Retrieves paired entities */
  pairs: Array<Pair>;
  /** Retrieves the complete knowledge graph starting from an entity */
  path: Path;
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
  /** Renders a graph query */
  renderGraph: PathPairs;
  /** Gets a specific structure e.g an image, video, or 3D model */
  structure: Structure;
};


export type QueryEdgeArgs = {
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


export type QueryGraphArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphsArgs = {
  filters?: InputMaybe<GraphFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
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


export type QueryPairsArgs = {
  graph: Scalars['ID']['input'];
  query: Scalars['String']['input'];
};


export type QueryPathArgs = {
  graph: Scalars['ID']['input'];
  query: Scalars['String']['input'];
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


export type QueryRenderGraphArgs = {
  graph: Scalars['ID']['input'];
  query: Scalars['ID']['input'];
};


export type QueryStructureArgs = {
  graph: Scalars['ID']['input'];
  structure: Scalars['StructureString']['input'];
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
  /** When this entity was created */
  createdAt: Scalars['DateTime']['output'];
  expression: Expression;
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

/** A Structure is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type Structure = Node & {
  __typename?: 'Structure';
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  /** The unique identifier of the entity within its graph */
  identifier: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
  /** The expression that defines this entity's type */
  object?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
};


/** A Structure is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type StructureEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};

export type StructureInput = {
  graph: Scalars['ID']['input'];
  structure: Scalars['StructureString']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  historyEvents: Entity;
};


export type SubscriptionHistoryEventsArgs = {
  user: Scalars['String']['input'];
};

/** Input for updating an existing expression */
export type UpdateExpressionInput = {
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

export type UpdateGraphInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  experiment?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Input type for updating an existing ontology */
export type UpdateOntologyInput = {
  /** New description for the ontology */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the ontology to update */
  id: Scalars['ID']['input'];
  /** New ID reference to an associated image */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** New name for the ontology (will be converted to snake_case) */
  name?: InputMaybe<Scalars['String']['input']>;
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
  Path = 'PATH'
}

type Edge_ComputedMeasurement_Fragment = { __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string };

type Edge_Measurement_Fragment = { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any };

type Edge_Relation_Fragment = { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string };

export type EdgeFragment = Edge_ComputedMeasurement_Fragment | Edge_Measurement_Fragment | Edge_Relation_Fragment;

export type EntityFragment = { __typename?: 'Entity', id: any, label: string, expression: { __typename?: 'Expression', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> };

export type ListEntityFragment = { __typename?: 'Entity', id: any, label: string, expression: { __typename?: 'Expression', id: string, label: string } };

export type EntityGraphNodeFragment = { __typename?: 'Entity', id: any, label: string, expression: { __typename?: 'Expression', color?: Array<number> | null } };

export type ExpressionFragment = { __typename?: 'Expression', id: string, label: string, description?: string | null, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null };

export type ListExpressionFragment = { __typename?: 'Expression', id: string, label: string, description?: string | null, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null };

export type GraphFragment = { __typename?: 'Graph', id: string, name: string, description?: string | null, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string } | { __typename?: 'Structure', id: any, label: string }>, ontology: { __typename?: 'Ontology', graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string }> } };

export type ListGraphFragment = { __typename?: 'Graph', id: string, name: string };

export type DetailGraphQueryFragment = { __typename?: 'GraphQuery', name: string, query: string };

export type ListGraphQueryFragment = { __typename?: 'GraphQuery', id: string, name: string };

export type MeasurementFragment = { __typename?: 'Measurement', id: any, value: any };

type Node_Entity_Fragment = { __typename?: 'Entity', id: any, label: string, expression: { __typename?: 'Expression', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> };

type Node_Structure_Fragment = { __typename?: 'Structure', id: any, label: string, identifier: string, object?: string | null };

export type NodeFragment = Node_Entity_Fragment | Node_Structure_Fragment;

export type OntologyFragment = { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, expressions: Array<{ __typename?: 'Expression', id: string, label: string, description?: string | null, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null, graphs: Array<{ __typename?: 'Graph', id: string, name: string }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string }> };

export type ListOntologyFragment = { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null };

export type PairsFragment = { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', left: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any }, right: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any } }> };

export type PathFragment = { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, expression: { __typename?: 'Expression', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object?: string | null }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> };

export type ProtocolFragment = { __typename?: 'Protocol', id: string, name: string, description?: string | null, experiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null } };

export type ListProtocolFragment = { __typename?: 'Protocol', id: string, name: string, experiment: { __typename?: 'Experiment', id: string, name: string } };

export type ProtocolStepFragment = { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, template: { __typename?: 'ProtocolStepTemplate', name: string, plateChildren: Array<any> }, forReagent?: { __typename?: 'Reagent', id: string } | null, forEntity?: { __typename?: 'Entity', id: any } | null, performedBy?: { __typename?: 'User', id: string } | null };

export type ListProtocolStepFragment = { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, performedBy?: { __typename?: 'User', id: string } | null };

export type ProtocolStepTemplateFragment = { __typename?: 'ProtocolStepTemplate', id: string, name: string, plateChildren: Array<any> };

export type ListProtocolStepTemplateFragment = { __typename?: 'ProtocolStepTemplate', id: string, name: string, plateChildren: Array<any> };

export type ReagentFragment = { __typename?: 'Reagent', id: string, label: string, creationSteps: Array<{ __typename?: 'ProtocolStep', id: string, name: string }>, usedIn: Array<{ __typename?: 'ReagentMapping', id: string, protocolStep: { __typename?: 'ProtocolStep', performedAt?: any | null, name: string } }> };

export type ListReagentFragment = { __typename?: 'Reagent', id: string, label: string };

export type RelationFragment = { __typename?: 'Relation', id: any, label: string };

export type MediaStoreFragment = { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string };

export type StructureFragment = { __typename?: 'Structure', id: any, label: string, identifier: string, object?: string | null };

export type ListStructureFragment = { __typename?: 'Structure', identifier: string, object?: string | null, id: any };

export type StructureGraphNodeFragment = { __typename?: 'Structure', identifier: string, object?: string | null, id: any };

export type CreateEntityMutationVariables = Exact<{
  input: EntityInput;
}>;


export type CreateEntityMutation = { __typename?: 'Mutation', createEntity: { __typename?: 'Entity', id: any, label: string, expression: { __typename?: 'Expression', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } };

export type CreateRelationMutationVariables = Exact<{
  input: RelationInput;
}>;


export type CreateRelationMutation = { __typename?: 'Mutation', createRelation: { __typename?: 'Relation', id: any, label: string } };

export type CreateExpressionMutationVariables = Exact<{
  input: ExpressionInput;
}>;


export type CreateExpressionMutation = { __typename?: 'Mutation', createExpression: { __typename?: 'Expression', id: string, label: string, description?: string | null, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } };

export type UpdateExpressionMutationVariables = Exact<{
  input: UpdateExpressionInput;
}>;


export type UpdateExpressionMutation = { __typename?: 'Mutation', updateExpression: { __typename?: 'Expression', id: string, label: string, description?: string | null, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } };

export type CreateGraphMutationVariables = Exact<{
  input: GraphInput;
}>;


export type CreateGraphMutation = { __typename?: 'Mutation', createGraph: { __typename?: 'Graph', id: string, name: string, description?: string | null, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string } | { __typename?: 'Structure', id: any, label: string }>, ontology: { __typename?: 'Ontology', graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string }> } } };

export type DeleteGraphMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteGraphMutation = { __typename?: 'Mutation', deleteGraph: string };

export type UpdateGraphMutationVariables = Exact<{
  input: UpdateGraphInput;
}>;


export type UpdateGraphMutation = { __typename?: 'Mutation', updateGraph: { __typename?: 'Graph', id: string, name: string, description?: string | null, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string } | { __typename?: 'Structure', id: any, label: string }>, ontology: { __typename?: 'Ontology', graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string }> } } };

export type CreateOntologyMutationVariables = Exact<{
  input: OntologyInput;
}>;


export type CreateOntologyMutation = { __typename?: 'Mutation', createOntology: { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, expressions: Array<{ __typename?: 'Expression', id: string, label: string, description?: string | null, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null, graphs: Array<{ __typename?: 'Graph', id: string, name: string }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string }> } };

export type UpdateOntologyMutationVariables = Exact<{
  input: UpdateOntologyInput;
}>;


export type UpdateOntologyMutation = { __typename?: 'Mutation', updateOntology: { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, expressions: Array<{ __typename?: 'Expression', id: string, label: string, description?: string | null, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null, graphs: Array<{ __typename?: 'Graph', id: string, name: string }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string }> } };

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

export type CreateStructureMutationVariables = Exact<{
  input: StructureInput;
}>;


export type CreateStructureMutation = { __typename?: 'Mutation', createStructure: { __typename?: 'Structure', id: any, label: string, identifier: string, object?: string | null } };

export type GetEdgeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEdgeQuery = { __typename?: 'Query', edge: { __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string } };

export type GetExpressionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetExpressionQuery = { __typename?: 'Query', expression: { __typename?: 'Expression', id: string, label: string, description?: string | null, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } };

export type ListExpressionsQueryVariables = Exact<{
  filters?: InputMaybe<ExpressionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListExpressionsQuery = { __typename?: 'Query', expressions: Array<{ __typename?: 'Expression', id: string, label: string, description?: string | null, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }> };

export type SearchExpressionQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchExpressionQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Expression', value: string, label: string }> };

export type GetGraphQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGraphQuery = { __typename?: 'Query', graph: { __typename?: 'Graph', id: string, name: string, description?: string | null, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string } | { __typename?: 'Structure', id: any, label: string }>, ontology: { __typename?: 'Ontology', graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string }> } } };

export type MyActiveGraphQueryVariables = Exact<{ [key: string]: never; }>;


export type MyActiveGraphQuery = { __typename?: 'Query', myActiveGraph: { __typename?: 'Graph', id: string, name: string } };

export type ListGraphsQueryVariables = Exact<{
  filters?: InputMaybe<GraphFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListGraphsQuery = { __typename?: 'Query', graphs: Array<{ __typename?: 'Graph', id: string, name: string }> };

export type SearchGraphsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchGraphsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Graph', value: string, label: string }> };

export type PathQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  query: Scalars['String']['input'];
}>;


export type PathQuery = { __typename?: 'Query', path: { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, expression: { __typename?: 'Expression', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object?: string | null }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> } };

export type GetNodeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetNodeQuery = { __typename?: 'Query', node: { __typename?: 'Entity', id: any, label: string, expression: { __typename?: 'Expression', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object?: string | null } };

export type GetOntologyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOntologyQuery = { __typename?: 'Query', ontology: { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, expressions: Array<{ __typename?: 'Expression', id: string, label: string, description?: string | null, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null, graphs: Array<{ __typename?: 'Graph', id: string, name: string }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string }> } };

export type ListOntologiesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListOntologiesQuery = { __typename?: 'Query', ontologies: Array<{ __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null }> };

export type SearchOntologiesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchOntologiesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Ontology', value: string, label: string }> };

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

export type RenderGraphQueryVariables = Exact<{
  graph: Scalars['ID']['input'];
  query: Scalars['ID']['input'];
}>;


export type RenderGraphQuery = { __typename?: 'Query', renderGraph: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', left: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any }, right: { __typename?: 'Entity', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, label: string, expression: { __typename?: 'Expression', id: string, label: string }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }> } | { __typename?: 'Structure', id: any, label: string, identifier: string, object?: string | null }>, edges: Array<{ __typename?: 'ComputedMeasurement', id: any, label: string, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, label: string, leftId: string, rightId: string, value: any } | { __typename?: 'Relation', id: any, label: string, leftId: string, rightId: string }> } };

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', graphs: Array<{ __typename?: 'Graph', id: string, name: string }>, ontologies: Array<{ __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null }> };

export type GetStructureQueryVariables = Exact<{
  graph: Scalars['ID']['input'];
  structure: Scalars['StructureString']['input'];
}>;


export type GetStructureQuery = { __typename?: 'Query', structure: { __typename?: 'Structure', id: any, label: string, identifier: string, object?: string | null } };

export const ListEntityFragmentDoc = gql`
    fragment ListEntity on Entity {
  id
  label
  expression {
    id
    label
  }
}
    `;
export const EntityGraphNodeFragmentDoc = gql`
    fragment EntityGraphNode on Entity {
  id
  label
  expression {
    color
  }
}
    `;
export const MediaStoreFragmentDoc = gql`
    fragment MediaStore on MediaStore {
  id
  key
  presignedUrl
}
    `;
export const ExpressionFragmentDoc = gql`
    fragment Expression on Expression {
  id
  label
  ontology {
    id
    name
  }
  description
  store {
    ...MediaStore
  }
}
    ${MediaStoreFragmentDoc}`;
export const GraphFragmentDoc = gql`
    fragment Graph on Graph {
  id
  name
  description
  latestNodes {
    id
    label
  }
  ontology {
    graphQueries {
      id
      name
      query
    }
  }
}
    `;
export const DetailGraphQueryFragmentDoc = gql`
    fragment DetailGraphQuery on GraphQuery {
  name
  query
}
    `;
export const ListExpressionFragmentDoc = gql`
    fragment ListExpression on Expression {
  id
  label
  description
  store {
    ...MediaStore
  }
}
    ${MediaStoreFragmentDoc}`;
export const ListGraphFragmentDoc = gql`
    fragment ListGraph on Graph {
  id
  name
}
    `;
export const ListGraphQueryFragmentDoc = gql`
    fragment ListGraphQuery on GraphQuery {
  id
  name
}
    `;
export const OntologyFragmentDoc = gql`
    fragment Ontology on Ontology {
  id
  name
  description
  purl
  expressions {
    ...ListExpression
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
}
    ${ListExpressionFragmentDoc}
${MediaStoreFragmentDoc}
${ListGraphFragmentDoc}
${ListGraphQueryFragmentDoc}`;
export const ListOntologyFragmentDoc = gql`
    fragment ListOntology on Ontology {
  id
  name
  description
  purl
}
    `;
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
export const EntityFragmentDoc = gql`
    fragment Entity on Entity {
  id
  label
  expression {
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
export const ListStructureFragmentDoc = gql`
    fragment ListStructure on Structure {
  identifier
  object
  id
}
    `;
export const StructureGraphNodeFragmentDoc = gql`
    fragment StructureGraphNode on Structure {
  identifier
  object
  id
}
    `;
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
export const CreateExpressionDocument = gql`
    mutation CreateExpression($input: ExpressionInput!) {
  createExpression(input: $input) {
    ...Expression
  }
}
    ${ExpressionFragmentDoc}`;
export type CreateExpressionMutationFn = Apollo.MutationFunction<CreateExpressionMutation, CreateExpressionMutationVariables>;

/**
 * __useCreateExpressionMutation__
 *
 * To run a mutation, you first call `useCreateExpressionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExpressionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExpressionMutation, { data, loading, error }] = useCreateExpressionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateExpressionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateExpressionMutation, CreateExpressionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateExpressionMutation, CreateExpressionMutationVariables>(CreateExpressionDocument, options);
      }
export type CreateExpressionMutationHookResult = ReturnType<typeof useCreateExpressionMutation>;
export type CreateExpressionMutationResult = Apollo.MutationResult<CreateExpressionMutation>;
export type CreateExpressionMutationOptions = Apollo.BaseMutationOptions<CreateExpressionMutation, CreateExpressionMutationVariables>;
export const UpdateExpressionDocument = gql`
    mutation UpdateExpression($input: UpdateExpressionInput!) {
  updateExpression(input: $input) {
    ...Expression
  }
}
    ${ExpressionFragmentDoc}`;
export type UpdateExpressionMutationFn = Apollo.MutationFunction<UpdateExpressionMutation, UpdateExpressionMutationVariables>;

/**
 * __useUpdateExpressionMutation__
 *
 * To run a mutation, you first call `useUpdateExpressionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExpressionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExpressionMutation, { data, loading, error }] = useUpdateExpressionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateExpressionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateExpressionMutation, UpdateExpressionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateExpressionMutation, UpdateExpressionMutationVariables>(UpdateExpressionDocument, options);
      }
export type UpdateExpressionMutationHookResult = ReturnType<typeof useUpdateExpressionMutation>;
export type UpdateExpressionMutationResult = Apollo.MutationResult<UpdateExpressionMutation>;
export type UpdateExpressionMutationOptions = Apollo.BaseMutationOptions<UpdateExpressionMutation, UpdateExpressionMutationVariables>;
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
export const GetExpressionDocument = gql`
    query GetExpression($id: ID!) {
  expression(id: $id) {
    ...Expression
  }
}
    ${ExpressionFragmentDoc}`;

/**
 * __useGetExpressionQuery__
 *
 * To run a query within a React component, call `useGetExpressionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExpressionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExpressionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetExpressionQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetExpressionQuery, GetExpressionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetExpressionQuery, GetExpressionQueryVariables>(GetExpressionDocument, options);
      }
export function useGetExpressionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetExpressionQuery, GetExpressionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetExpressionQuery, GetExpressionQueryVariables>(GetExpressionDocument, options);
        }
export type GetExpressionQueryHookResult = ReturnType<typeof useGetExpressionQuery>;
export type GetExpressionLazyQueryHookResult = ReturnType<typeof useGetExpressionLazyQuery>;
export type GetExpressionQueryResult = Apollo.QueryResult<GetExpressionQuery, GetExpressionQueryVariables>;
export const ListExpressionsDocument = gql`
    query ListExpressions($filters: ExpressionFilter, $pagination: OffsetPaginationInput) {
  expressions(filters: $filters, pagination: $pagination) {
    ...ListExpression
  }
}
    ${ListExpressionFragmentDoc}`;

/**
 * __useListExpressionsQuery__
 *
 * To run a query within a React component, call `useListExpressionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListExpressionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListExpressionsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListExpressionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListExpressionsQuery, ListExpressionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListExpressionsQuery, ListExpressionsQueryVariables>(ListExpressionsDocument, options);
      }
export function useListExpressionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListExpressionsQuery, ListExpressionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListExpressionsQuery, ListExpressionsQueryVariables>(ListExpressionsDocument, options);
        }
export type ListExpressionsQueryHookResult = ReturnType<typeof useListExpressionsQuery>;
export type ListExpressionsLazyQueryHookResult = ReturnType<typeof useListExpressionsLazyQuery>;
export type ListExpressionsQueryResult = Apollo.QueryResult<ListExpressionsQuery, ListExpressionsQueryVariables>;
export const SearchExpressionDocument = gql`
    query SearchExpression($search: String, $values: [ID!]) {
  options: expressions(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchExpressionQuery__
 *
 * To run a query within a React component, call `useSearchExpressionQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchExpressionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchExpressionQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchExpressionQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchExpressionQuery, SearchExpressionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchExpressionQuery, SearchExpressionQueryVariables>(SearchExpressionDocument, options);
      }
export function useSearchExpressionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchExpressionQuery, SearchExpressionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchExpressionQuery, SearchExpressionQueryVariables>(SearchExpressionDocument, options);
        }
export type SearchExpressionQueryHookResult = ReturnType<typeof useSearchExpressionQuery>;
export type SearchExpressionLazyQueryHookResult = ReturnType<typeof useSearchExpressionLazyQuery>;
export type SearchExpressionQueryResult = Apollo.QueryResult<SearchExpressionQuery, SearchExpressionQueryVariables>;
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
export const PathDocument = gql`
    query Path($id: ID!, $query: String!) {
  path(graph: $id, query: $query) {
    ...Path
  }
}
    ${PathFragmentDoc}`;

/**
 * __usePathQuery__
 *
 * To run a query within a React component, call `usePathQuery` and pass it any options that fit your needs.
 * When your component renders, `usePathQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePathQuery({
 *   variables: {
 *      id: // value for 'id'
 *      query: // value for 'query'
 *   },
 * });
 */
export function usePathQuery(baseOptions: ApolloReactHooks.QueryHookOptions<PathQuery, PathQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PathQuery, PathQueryVariables>(PathDocument, options);
      }
export function usePathLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PathQuery, PathQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PathQuery, PathQueryVariables>(PathDocument, options);
        }
export type PathQueryHookResult = ReturnType<typeof usePathQuery>;
export type PathLazyQueryHookResult = ReturnType<typeof usePathLazyQuery>;
export type PathQueryResult = Apollo.QueryResult<PathQuery, PathQueryVariables>;
export const GetNodeDocument = gql`
    query GetNode($id: ID!) {
  node(id: $id) {
    ...Node
  }
}
    ${NodeFragmentDoc}`;

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
export const RenderGraphDocument = gql`
    query RenderGraph($graph: ID!, $query: ID!) {
  renderGraph(graph: $graph, query: $query) {
    ...Pairs
    ...Path
  }
}
    ${PairsFragmentDoc}
${PathFragmentDoc}`;

/**
 * __useRenderGraphQuery__
 *
 * To run a query within a React component, call `useRenderGraphQuery` and pass it any options that fit your needs.
 * When your component renders, `useRenderGraphQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRenderGraphQuery({
 *   variables: {
 *      graph: // value for 'graph'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useRenderGraphQuery(baseOptions: ApolloReactHooks.QueryHookOptions<RenderGraphQuery, RenderGraphQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<RenderGraphQuery, RenderGraphQueryVariables>(RenderGraphDocument, options);
      }
export function useRenderGraphLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RenderGraphQuery, RenderGraphQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<RenderGraphQuery, RenderGraphQueryVariables>(RenderGraphDocument, options);
        }
export type RenderGraphQueryHookResult = ReturnType<typeof useRenderGraphQuery>;
export type RenderGraphLazyQueryHookResult = ReturnType<typeof useRenderGraphLazyQuery>;
export type RenderGraphQueryResult = Apollo.QueryResult<RenderGraphQuery, RenderGraphQueryVariables>;
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
    query GetStructure($graph: ID!, $structure: StructureString!) {
  structure(graph: $graph, structure: $structure) {
    ...Structure
  }
}
    ${StructureFragmentDoc}`;

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
 *      graph: // value for 'graph'
 *      structure: // value for 'structure'
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