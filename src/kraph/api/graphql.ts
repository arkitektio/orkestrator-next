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
  DateTime: { input: any; output: any; }
  Metric: { input: any; output: any; }
  MetricMap: { input: any; output: any; }
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

export type AttachMetricsToEntitiesMetricInput = {
  metric: Scalars['ID']['input'];
  pairs: Array<EntityValuePairInput>;
};

export type CreateEntityMetricInput = {
  /** The entity to attach the metric to. */
  entity: Scalars['ID']['input'];
  /** The metric to attach to the entity. */
  metric: Scalars['ID']['input'];
  /** The timepoint of the metric. */
  timepoint?: InputMaybe<Scalars['DateTime']['input']>;
  /** The value of the metric. */
  value: Scalars['Metric']['input'];
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

export type CreateRelationMetricInput = {
  metric?: InputMaybe<Scalars['ID']['input']>;
  relation: Scalars['ID']['input'];
  timepoint?: InputMaybe<Scalars['DateTime']['input']>;
  value: Scalars['Metric']['input'];
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

export type DeleteLinkedExpressionInput = {
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

/**
 * An entity is a node in a graph. Entities are the building blocks of the data model in kraph.
 *
 *                  They are used to represent the different objects in your data model, and how they are connected to each other, through
 *                  relations.
 *
 *                  Kraph distinguishes between two core types of entities: Biological entities and Data entities. Biological entities
 *                  are describing real-world objects, such as cells, tissues, organs, etc. Data entities are describing data objects, such as
 *                  images, tables, etc.
 *
 *                  While you can relate any entity to any other entity, it is important to keep in mind that the relations between entities
 *                     should be meaningful, and should reflect the real-world relationships between the objects they represent.
 *
 *                  If you want to attach measurments or metrics to an entity, you should never attach them directly to the entity, but rather
 *                  point from the measurement (the data object) to the entity. This way, you can keep track of the provenance of the data, and
 *                  ensure that you never know anything about the entity that is not backed by data.
 *
 *
 */
export type Entity = {
  __typename?: 'Entity';
  /** When this entity was created */
  createdAt: Scalars['DateTime']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['ID']['output'];
  /** A unique identifier for this entity if available */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The name of the entity's type/kind */
  kindName: Scalars['String']['output'];
  /** A human readable label for this entity */
  label: Scalars['String']['output'];
  /** The expression that defines this entity's type */
  linkedExpression: LinkedExpression;
  /** Map of metric values associated with this entity */
  metricMap: Scalars['MetricMap']['output'];
  /** List of metrics associated with this entity */
  metrics: Array<NodeMetric>;
  /** Reference to an external object if this entity represents one */
  object?: Maybe<Scalars['String']['output']>;
  /** Relations this entity has with other entities */
  relations: Array<EntityRelation>;
  /** Protocol steps where this entity was the target */
  subjectedTo: Array<ProtocolStep>;
  /** Protocol steps where this entity was used */
  usedIn: Array<ProtocolStep>;
  /** Timestamp from when this entity is valid */
  validFrom: Scalars['DateTime']['output'];
  /** Timestamp until when this entity is valid */
  validTo: Scalars['DateTime']['output'];
};


/**
 * An entity is a node in a graph. Entities are the building blocks of the data model in kraph.
 *
 *                  They are used to represent the different objects in your data model, and how they are connected to each other, through
 *                  relations.
 *
 *                  Kraph distinguishes between two core types of entities: Biological entities and Data entities. Biological entities
 *                  are describing real-world objects, such as cells, tissues, organs, etc. Data entities are describing data objects, such as
 *                  images, tables, etc.
 *
 *                  While you can relate any entity to any other entity, it is important to keep in mind that the relations between entities
 *                     should be meaningful, and should reflect the real-world relationships between the objects they represent.
 *
 *                  If you want to attach measurments or metrics to an entity, you should never attach them directly to the entity, but rather
 *                  point from the measurement (the data object) to the entity. This way, you can keep track of the provenance of the data, and
 *                  ensure that you never know anything about the entity that is not backed by data.
 *
 *
 */
export type EntityRelationsArgs = {
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

export type EntityGraph = {
  __typename?: 'EntityGraph';
  edges: Array<EntityRelation>;
  graph: Graph;
  nodes: Array<Entity>;
};

/** Input type for creating a new entity */
export type EntityInput = {
  /** Optional group ID to associate the entity with */
  group?: InputMaybe<Scalars['ID']['input']>;
  /** Optional instance kind specification */
  instanceKind?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the kind (LinkedExpression) to create the entity from */
  kind: Scalars['ID']['input'];
  /** Optional name for the entity */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Optional parent entity ID */
  parent?: InputMaybe<Scalars['ID']['input']>;
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

export type EntityRelation = {
  __typename?: 'EntityRelation';
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  left: Entity;
  leftId: Scalars['String']['output'];
  linkedExpression: LinkedExpression;
  metricMap: Scalars['MetricMap']['output'];
  metrics: Array<RelationMetric>;
  right: Entity;
  rightId: Scalars['String']['output'];
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

/** Input type for creating a relation between two entities */
export type EntityRelationInput = {
  /** ID of the relation kind (LinkedExpression) */
  kind: Scalars['ID']['input'];
  /** ID of the left entity (format: graph:id) */
  left: Scalars['ID']['input'];
  /** ID of the right entity (format: graph:id) */
  right: Scalars['ID']['input'];
};

export type EntityValuePairInput = {
  entity: Scalars['ID']['input'];
  value: Scalars['Metric']['input'];
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

/**
 * An expression in an ontology. Expression are used to label entities and their relations in a graph like structure. Depending on the kind of the expression
 *     it can be used to describe different aspects of the entities and relations.
 */
export type Expression = {
  __typename?: 'Expression';
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the expression. */
  id: Scalars['ID']['output'];
  /** The kind of the expression. */
  kind: ExpressionKind;
  /** The label of the expression. The class */
  label: Scalars['String']['output'];
  /** The linked expressions of the expression. i.e in which graphs the expression is used. */
  linkedExpressions: Array<LinkedExpression>;
  /** The kind of metric that can be attached to the expression. */
  metricKind?: Maybe<MetricDataType>;
  /** The ontology the expression belongs to. */
  ontology: Ontology;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
};


/**
 * An expression in an ontology. Expression are used to label entities and their relations in a graph like structure. Depending on the kind of the expression
 *     it can be used to describe different aspects of the entities and relations.
 */
export type ExpressionLinkedExpressionsArgs = {
  filters?: InputMaybe<LinkedExpressionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
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
  linkedExpressions: Array<LinkedExpression>;
  name: Scalars['String']['output'];
};


/** A graph, that contains entities and relations. */
export type GraphLinkedExpressionsArgs = {
  filters?: InputMaybe<LinkedExpressionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
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
};

export type GraphPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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

export type KnowledgeGraph = {
  __typename?: 'KnowledgeGraph';
  edges: Array<EntityKindRelationEdge>;
  nodes: Array<EntityKindNode>;
};

export type LinkExpressionInput = {
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  expression: Scalars['ID']['input'];
  graph: Scalars['ID']['input'];
};

export type LinkedExpression = {
  __typename?: 'LinkedExpression';
  color: Scalars['String']['output'];
  dataKind?: Maybe<MetricDataType>;
  description?: Maybe<Scalars['String']['output']>;
  entities: Array<Entity>;
  expression: Expression;
  graph: Graph;
  id: Scalars['ID']['output'];
  kind: ExpressionKind;
  label: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  purl?: Maybe<Scalars['String']['output']>;
};


export type LinkedExpressionEntitiesArgs = {
  filter?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};

export type LinkedExpressionFilter = {
  AND?: InputMaybe<LinkedExpressionFilter>;
  OR?: InputMaybe<LinkedExpressionFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind?: InputMaybe<ExpressionKind>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type MeasurementInput = {
  graph: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  structure: Scalars['StructureString']['input'];
  validFrom?: InputMaybe<Scalars['DateTime']['input']>;
  validTo?: InputMaybe<Scalars['DateTime']['input']>;
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
  /** Attach metrics to multiple entities */
  attachMetricsToEntities: Array<Entity>;
  /** Create a new entity */
  createEntity: Entity;
  /** Create a new metric for an entity */
  createEntityMetric: Entity;
  /** Create a new relation between entities */
  createEntityRelation: EntityRelation;
  /** Create a new expression */
  createExpression: Expression;
  /** Create a new graph */
  createGraph: Graph;
  /** Create a new measurement */
  createMeasurement: Entity;
  /** Create a new model */
  createModel: Model;
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
  /** Create a new metric for a relation */
  createRelationMetric: EntityRelation;
  /** Create a relation between structures */
  createStructureRelation: EntityRelation;
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
  /** Link an expression to an entity */
  linkExpression: LinkedExpression;
  /** Pin a linked expression */
  pinLinkedExpression: LinkedExpression;
  /** Request a new file upload */
  requestUpload: PresignedPostCredentials;
  /** Unlink an expression from an entity */
  unlinkExpression: Scalars['ID']['output'];
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


export type MutationAttachMetricsToEntitiesArgs = {
  input: AttachMetricsToEntitiesMetricInput;
};


export type MutationCreateEntityArgs = {
  input: EntityInput;
};


export type MutationCreateEntityMetricArgs = {
  input: CreateEntityMetricInput;
};


export type MutationCreateEntityRelationArgs = {
  input: EntityRelationInput;
};


export type MutationCreateExpressionArgs = {
  input: ExpressionInput;
};


export type MutationCreateGraphArgs = {
  input: GraphInput;
};


export type MutationCreateMeasurementArgs = {
  input: MeasurementInput;
};


export type MutationCreateModelArgs = {
  input: CreateModelInput;
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


export type MutationCreateRelationMetricArgs = {
  input: CreateRelationMetricInput;
};


export type MutationCreateStructureRelationArgs = {
  input: StructureRelationInput;
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


export type MutationLinkExpressionArgs = {
  input: LinkExpressionInput;
};


export type MutationPinLinkedExpressionArgs = {
  input: PinLinkedExpressionInput;
};


export type MutationRequestUploadArgs = {
  input: RequestMediaUploadInput;
};


export type MutationUnlinkExpressionArgs = {
  input: DeleteLinkedExpressionInput;
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

export type NodeMetric = {
  __typename?: 'NodeMetric';
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  linkedExpression: LinkedExpression;
  validFrom?: Maybe<Scalars['DateTime']['output']>;
  validTo?: Maybe<Scalars['DateTime']['output']>;
  value?: Maybe<Scalars['Metric']['output']>;
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
  /** The list of expressions (terms/concepts) defined in this ontology */
  expressions: Array<Expression>;
  /** The unique identifier of the ontology */
  id: Scalars['ID']['output'];
  /** The name of the ontology */
  name: Scalars['String']['output'];
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
export type PairedStructure = {
  __typename?: 'PairedStructure';
  /** The left entity. */
  left: Entity;
  /** The relation between the two entities. */
  relation: EntityRelation;
  /** The right entity. */
  right: Entity;
};

export type PinLinkedExpressionInput = {
  id: Scalars['ID']['input'];
  pin?: InputMaybe<Scalars['Boolean']['input']>;
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
  /** List of all entities in the system */
  entities: Array<Entity>;
  entity: Entity;
  /** Retrieves the graph of entities and their relationships */
  entityGraph: EntityGraph;
  entityRelation: EntityRelation;
  /** List of all relationships between entities */
  entityRelations: Array<EntityRelation>;
  expression: Expression;
  /** List of all expressions in the system */
  expressions: Array<Expression>;
  graph: Graph;
  /** List of all knowledge graphs */
  graphs: Array<Graph>;
  /** Retrieves the complete knowledge graph starting from an entity */
  knowledgeGraph: KnowledgeGraph;
  linkedExpression: LinkedExpression;
  /** Gets a linked expression by its AGE name */
  linkedExpressionByAgename: LinkedExpression;
  /** List of all expressions that are linked in a Graph */
  linkedExpressions: Array<LinkedExpression>;
  model: Model;
  /** List of all deep learning models (e.g. neural networks) */
  models: Array<Model>;
  myActiveGraph: Graph;
  /** List of all ontologies */
  ontologies: Array<Ontology>;
  ontology: Ontology;
  /** Retrieves paired entities */
  pairedEntities: Array<PairedStructure>;
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
  /** Gets a specific structure e.g an image, video, or 3D model */
  structure: Entity;
};


export type QueryEntitiesArgs = {
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityGraphArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityRelationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityRelationsArgs = {
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


export type QueryKnowledgeGraphArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLinkedExpressionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLinkedExpressionByAgenameArgs = {
  ageName: Scalars['String']['input'];
  graphId: Scalars['ID']['input'];
};


export type QueryLinkedExpressionsArgs = {
  filters?: InputMaybe<LinkedExpressionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryModelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryModelsArgs = {
  filters?: InputMaybe<ModelFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryOntologiesArgs = {
  filters?: InputMaybe<OntologyFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryOntologyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPairedEntitiesArgs = {
  graph?: InputMaybe<Scalars['ID']['input']>;
  leftFilter?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
  relationFilter?: InputMaybe<EntityRelationFilter>;
  rightFilter?: InputMaybe<EntityFilter>;
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

export type RelationMetric = {
  __typename?: 'RelationMetric';
  linkedExpression: LinkedExpression;
  value: Scalars['String']['output'];
};

export type RequestMediaUploadInput = {
  datalayer: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

export type Structure = {
  id: Scalars['ID']['input'];
  identifier: Scalars['String']['input'];
};

/** Input type for creating a relation between two structures */
export type StructureRelationInput = {
  /** ID of the relation kind (LinkedExpression) */
  kind: Scalars['ID']['input'];
  /** Left structure of the relation */
  left: Structure;
  /** Right structure of the relation */
  right: Structure;
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

export type EntityFragment = { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> };

export type ListEntityFragment = { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, createdAt: any, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } };

export type EntityGraphNodeFragment = { __typename?: 'Entity', id: string, label: string, kindName: string, linkedExpression: { __typename?: 'LinkedExpression', color: string }, metrics: Array<{ __typename?: 'NodeMetric', value?: any | null }> };

export type EntityGraphFragment = { __typename?: 'EntityGraph', graph: { __typename?: 'Graph', id: string }, nodes: Array<{ __typename?: 'Entity', id: string, label: string, kindName: string, linkedExpression: { __typename?: 'LinkedExpression', color: string }, metrics: Array<{ __typename?: 'NodeMetric', value?: any | null }> }>, edges: Array<{ __typename?: 'EntityRelation', id: string, label: string, leftId: string, rightId: string }> };

export type EntityRelationFragment = { __typename?: 'EntityRelation', id: string, left: { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> }, right: { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> }, metrics: Array<{ __typename?: 'RelationMetric', value: string }>, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', label: string } } };

export type ListEntityRelationFragment = { __typename?: 'EntityRelation', id: string, leftId: string, rightId: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', label: string } } };

export type EntityGraphEdgeFragment = { __typename?: 'EntityRelation', id: string, label: string, leftId: string, rightId: string };

export type ExpressionFragment = { __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, metricKind?: MetricDataType | null, ontology: { __typename?: 'Ontology', id: string, name: string }, linkedExpressions: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, entities: Array<{ __typename?: 'Entity', id: string, label: string }>, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null };

export type ListExpressionFragment = { __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null };

export type GraphFragment = { __typename?: 'Graph', id: string, name: string, description?: string | null, relations: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, entities: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, metrics: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, structures: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }> };

export type ListGraphFragment = { __typename?: 'Graph', id: string, name: string };

export type KnowledgeGraphFragment = { __typename?: 'KnowledgeGraph', nodes: Array<{ __typename?: 'EntityKindNode', id: string, label: string, metrics: Array<{ __typename?: 'EntityKindNodeMetric', kind: string, dataKind: string }> }>, edges: Array<{ __typename?: 'EntityKindRelationEdge', id: string, label: string, source: string, target: string, metrics: Array<{ __typename?: 'EntityKindNodeMetric', kind: string, dataKind: string }> }> };

export type LinkedExpressionFragment = { __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, metricKind?: MetricDataType | null, ontology: { __typename?: 'Ontology', id: string, name: string }, linkedExpressions: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, entities: Array<{ __typename?: 'Entity', id: string, label: string }>, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }, entities: Array<{ __typename?: 'Entity', id: string, label: string }> };

export type ListLinkedExpressionFragment = { __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } };

export type OntologyFragment = { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, expressions: Array<{ __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null };

export type ListOntologyFragment = { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null };

export type ProtocolFragment = { __typename?: 'Protocol', id: string, name: string, description?: string | null, experiment: { __typename?: 'Experiment', id: string, name: string, description?: string | null } };

export type ListProtocolFragment = { __typename?: 'Protocol', id: string, name: string, experiment: { __typename?: 'Experiment', id: string, name: string } };

export type ProtocolStepFragment = { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, template: { __typename?: 'ProtocolStepTemplate', name: string, plateChildren: Array<any> }, forReagent?: { __typename?: 'Reagent', id: string } | null, forEntity?: { __typename?: 'Entity', id: string } | null, performedBy?: { __typename?: 'User', id: string } | null };

export type ListProtocolStepFragment = { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, performedBy?: { __typename?: 'User', id: string } | null };

export type ProtocolStepTemplateFragment = { __typename?: 'ProtocolStepTemplate', id: string, name: string, plateChildren: Array<any> };

export type ListProtocolStepTemplateFragment = { __typename?: 'ProtocolStepTemplate', id: string, name: string, plateChildren: Array<any> };

export type ReagentFragment = { __typename?: 'Reagent', id: string, label: string, creationSteps: Array<{ __typename?: 'ProtocolStep', id: string, name: string }>, usedIn: Array<{ __typename?: 'ReagentMapping', id: string, protocolStep: { __typename?: 'ProtocolStep', performedAt?: any | null, name: string } }> };

export type ListReagentFragment = { __typename?: 'Reagent', id: string, label: string };

export type MediaStoreFragment = { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string };

export type CreateEntityMutationVariables = Exact<{
  input: EntityInput;
}>;


export type CreateEntityMutation = { __typename?: 'Mutation', createEntity: { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> } };

export type CreateEntityRelationMutationVariables = Exact<{
  input: EntityRelationInput;
}>;


export type CreateEntityRelationMutation = { __typename?: 'Mutation', createEntityRelation: { __typename?: 'EntityRelation', id: string, left: { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> }, right: { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> }, metrics: Array<{ __typename?: 'RelationMetric', value: string }>, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', label: string } } } };

export type CreateEntityGraphRelationMutationVariables = Exact<{
  input: EntityRelationInput;
}>;


export type CreateEntityGraphRelationMutation = { __typename?: 'Mutation', createEntityRelation: { __typename?: 'EntityRelation', id: string, label: string, leftId: string, rightId: string } };

export type CreateEntityMetricMutationVariables = Exact<{
  input: CreateEntityMetricInput;
}>;


export type CreateEntityMetricMutation = { __typename?: 'Mutation', createEntityMetric: { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> } };

export type CreateExpressionMutationVariables = Exact<{
  input: ExpressionInput;
}>;


export type CreateExpressionMutation = { __typename?: 'Mutation', createExpression: { __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, metricKind?: MetricDataType | null, ontology: { __typename?: 'Ontology', id: string, name: string }, linkedExpressions: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, entities: Array<{ __typename?: 'Entity', id: string, label: string }>, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } };

export type UpdateExpressionMutationVariables = Exact<{
  input: UpdateExpressionInput;
}>;


export type UpdateExpressionMutation = { __typename?: 'Mutation', updateExpression: { __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, metricKind?: MetricDataType | null, ontology: { __typename?: 'Ontology', id: string, name: string }, linkedExpressions: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, entities: Array<{ __typename?: 'Entity', id: string, label: string }>, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } };

export type CreateGraphMutationVariables = Exact<{
  input: GraphInput;
}>;


export type CreateGraphMutation = { __typename?: 'Mutation', createGraph: { __typename?: 'Graph', id: string, name: string, description?: string | null, relations: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, entities: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, metrics: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, structures: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }> } };

export type DeleteGraphMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteGraphMutation = { __typename?: 'Mutation', deleteGraph: string };

export type UpdateGraphMutationVariables = Exact<{
  input: UpdateGraphInput;
}>;


export type UpdateGraphMutation = { __typename?: 'Mutation', updateGraph: { __typename?: 'Graph', id: string, name: string, description?: string | null, relations: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, entities: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, metrics: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, structures: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }> } };

export type PinLinkedExpressionMutationVariables = Exact<{
  input: PinLinkedExpressionInput;
}>;


export type PinLinkedExpressionMutation = { __typename?: 'Mutation', pinLinkedExpression: { __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, metricKind?: MetricDataType | null, ontology: { __typename?: 'Ontology', id: string, name: string }, linkedExpressions: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, entities: Array<{ __typename?: 'Entity', id: string, label: string }>, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }, entities: Array<{ __typename?: 'Entity', id: string, label: string }> } };

export type LinkExpressionMutationVariables = Exact<{
  input: LinkExpressionInput;
}>;


export type LinkExpressionMutation = { __typename?: 'Mutation', linkExpression: { __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, metricKind?: MetricDataType | null, ontology: { __typename?: 'Ontology', id: string, name: string }, linkedExpressions: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, entities: Array<{ __typename?: 'Entity', id: string, label: string }>, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }, entities: Array<{ __typename?: 'Entity', id: string, label: string }> } };

export type CreateOntologyMutationVariables = Exact<{
  input: OntologyInput;
}>;


export type CreateOntologyMutation = { __typename?: 'Mutation', createOntology: { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, expressions: Array<{ __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } };

export type UpdateOntologyMutationVariables = Exact<{
  input: UpdateOntologyInput;
}>;


export type UpdateOntologyMutation = { __typename?: 'Mutation', updateOntology: { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, expressions: Array<{ __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } };

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


export type CreateProtocolStepMutation = { __typename?: 'Mutation', createProtocolStep: { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, template: { __typename?: 'ProtocolStepTemplate', name: string, plateChildren: Array<any> }, forReagent?: { __typename?: 'Reagent', id: string } | null, forEntity?: { __typename?: 'Entity', id: string } | null, performedBy?: { __typename?: 'User', id: string } | null } };

export type UpdateProtocolStepMutationVariables = Exact<{
  input: UpdateProtocolStepInput;
}>;


export type UpdateProtocolStepMutation = { __typename?: 'Mutation', updateProtocolStep: { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, template: { __typename?: 'ProtocolStepTemplate', name: string, plateChildren: Array<any> }, forReagent?: { __typename?: 'Reagent', id: string } | null, forEntity?: { __typename?: 'Entity', id: string } | null, performedBy?: { __typename?: 'User', id: string } | null } };

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
  input: MeasurementInput;
}>;


export type CreateStructureMutation = { __typename?: 'Mutation', createMeasurement: { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> } };

export type GetEntityQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEntityQuery = { __typename?: 'Query', entity: { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> } };

export type GetEntityGraphNodeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEntityGraphNodeQuery = { __typename?: 'Query', entity: { __typename?: 'Entity', id: string, label: string, kindName: string, linkedExpression: { __typename?: 'LinkedExpression', color: string }, metrics: Array<{ __typename?: 'NodeMetric', value?: any | null }> } };

export type ListEntitiesQueryVariables = Exact<{
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
}>;


export type ListEntitiesQuery = { __typename?: 'Query', entities: Array<{ __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, createdAt: any, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }> };

export type SearchEntitiesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchEntitiesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Entity', value: string, label: string }> };

export type SearchGraphEntitiesQueryVariables = Exact<{
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
}>;


export type SearchGraphEntitiesQuery = { __typename?: 'Query', entities: Array<{ __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, createdAt: any, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }> };

export type GetEntityGraphQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEntityGraphQuery = { __typename?: 'Query', entityGraph: { __typename?: 'EntityGraph', graph: { __typename?: 'Graph', id: string }, nodes: Array<{ __typename?: 'Entity', id: string, label: string, kindName: string, linkedExpression: { __typename?: 'LinkedExpression', color: string }, metrics: Array<{ __typename?: 'NodeMetric', value?: any | null }> }>, edges: Array<{ __typename?: 'EntityRelation', id: string, label: string, leftId: string, rightId: string }> } };

export type GetExpressionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetExpressionQuery = { __typename?: 'Query', expression: { __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, metricKind?: MetricDataType | null, ontology: { __typename?: 'Ontology', id: string, name: string }, linkedExpressions: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, entities: Array<{ __typename?: 'Entity', id: string, label: string }>, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } };

export type ListExpressionsQueryVariables = Exact<{
  filters?: InputMaybe<ExpressionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListExpressionsQuery = { __typename?: 'Query', expressions: Array<{ __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }> };

export type SearchExpressionQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchExpressionQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Expression', value: string, label: string }> };

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  noImages: Scalars['Boolean']['input'];
  noFiles: Scalars['Boolean']['input'];
  pagination?: InputMaybe<GraphPaginationInput>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', entities?: Array<{ __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, createdAt: any, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }> };

export type GetGraphQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGraphQuery = { __typename?: 'Query', graph: { __typename?: 'Graph', id: string, name: string, description?: string | null, relations: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, entities: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, metrics: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, structures: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }> } };

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

export type GetKnowledgeGraphQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetKnowledgeGraphQuery = { __typename?: 'Query', knowledgeGraph: { __typename?: 'KnowledgeGraph', nodes: Array<{ __typename?: 'EntityKindNode', id: string, label: string, metrics: Array<{ __typename?: 'EntityKindNodeMetric', kind: string, dataKind: string }> }>, edges: Array<{ __typename?: 'EntityKindRelationEdge', id: string, label: string, source: string, target: string, metrics: Array<{ __typename?: 'EntityKindNodeMetric', kind: string, dataKind: string }> }> } };

export type GetLinkedExpressionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLinkedExpressionQuery = { __typename?: 'Query', linkedExpression: { __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, metricKind?: MetricDataType | null, ontology: { __typename?: 'Ontology', id: string, name: string }, linkedExpressions: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, entities: Array<{ __typename?: 'Entity', id: string, label: string }>, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }, entities: Array<{ __typename?: 'Entity', id: string, label: string }> } };

export type GetLinkedExpressionByAgeNameQueryVariables = Exact<{
  ageName: Scalars['String']['input'];
  graph: Scalars['ID']['input'];
}>;


export type GetLinkedExpressionByAgeNameQuery = { __typename?: 'Query', linkedExpressionByAgename: { __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, metricKind?: MetricDataType | null, ontology: { __typename?: 'Ontology', id: string, name: string }, linkedExpressions: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, entities: Array<{ __typename?: 'Entity', id: string, label: string }>, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }, entities: Array<{ __typename?: 'Entity', id: string, label: string }> } };

export type SearchLinkedExpressionQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  graph?: InputMaybe<Scalars['ID']['input']>;
}>;


export type SearchLinkedExpressionQuery = { __typename?: 'Query', options: Array<{ __typename?: 'LinkedExpression', value: string, label: string }> };

export type SearchLinkedRelationsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  graph?: InputMaybe<Scalars['ID']['input']>;
}>;


export type SearchLinkedRelationsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'LinkedExpression', value: string, label: string }> };

export type SearchLinkedEntitiesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  graph?: InputMaybe<Scalars['ID']['input']>;
}>;


export type SearchLinkedEntitiesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'LinkedExpression', value: string, label: string }> };

export type ListLinkedExpressionQueryVariables = Exact<{
  filters?: InputMaybe<LinkedExpressionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListLinkedExpressionQuery = { __typename?: 'Query', linkedExpressions: Array<{ __typename?: 'LinkedExpression', id: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, expression: { __typename?: 'Expression', id: string, label: string, ontology: { __typename?: 'Ontology', id: string, name: string }, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } }> };

export type GetOntologyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOntologyQuery = { __typename?: 'Query', ontology: { __typename?: 'Ontology', id: string, name: string, description?: string | null, purl?: string | null, expressions: Array<{ __typename?: 'Expression', id: string, label: string, description?: string | null, kind: ExpressionKind, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null }>, store?: { __typename?: 'MediaStore', id: string, key: string, presignedUrl: string } | null } };

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


export type GetProtocolStepQuery = { __typename?: 'Query', protocolStep: { __typename?: 'ProtocolStep', id: string, name: string, performedAt?: any | null, template: { __typename?: 'ProtocolStepTemplate', name: string, plateChildren: Array<any> }, forReagent?: { __typename?: 'Reagent', id: string } | null, forEntity?: { __typename?: 'Entity', id: string } | null, performedBy?: { __typename?: 'User', id: string } | null } };

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

export type GetEntityRelationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEntityRelationQuery = { __typename?: 'Query', entityRelation: { __typename?: 'EntityRelation', id: string, left: { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> }, right: { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> }, metrics: Array<{ __typename?: 'RelationMetric', value: string }>, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', label: string } } } };

export type ListEntityRelationsQueryVariables = Exact<{
  filters?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
}>;


export type ListEntityRelationsQuery = { __typename?: 'Query', entityRelations: Array<{ __typename?: 'EntityRelation', metricMap: any, id: string, leftId: string, rightId: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', label: string } } }> };

export type SearchEntityRelationsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchEntityRelationsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'EntityRelation', value: string, label: string }> };

export type GetStructureQueryVariables = Exact<{
  graph: Scalars['ID']['input'];
  structure: Scalars['StructureString']['input'];
}>;


export type GetStructureQuery = { __typename?: 'Query', structure: { __typename?: 'Entity', id: string, label: string, object?: string | null, identifier?: string | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string, expression: { __typename?: 'Expression', id: string, label: string }, graph: { __typename?: 'Graph', id: string, name: string } }, subjectedTo: Array<{ __typename?: 'ProtocolStep', id: string, performedAt?: any | null, name: string }>, metrics: Array<{ __typename?: 'NodeMetric', id: string, value?: any | null, validFrom?: any | null, linkedExpression: { __typename?: 'LinkedExpression', id: string, label: string } }>, relations: Array<{ __typename?: 'EntityRelation', id: string, right: { __typename?: 'Entity', id: string, label: string, linkedExpression: { __typename?: 'LinkedExpression', id: string, expression: { __typename?: 'Expression', id: string, label: string } } }, linkedExpression: { __typename?: 'LinkedExpression', label: string } }> } };

export const ListEntityFragmentDoc = gql`
    fragment ListEntity on Entity {
  id
  label
  linkedExpression {
    id
    label
  }
  object
  identifier
  createdAt
}
    `;
export const EntityGraphNodeFragmentDoc = gql`
    fragment EntityGraphNode on Entity {
  id
  label
  kindName
  linkedExpression {
    color
  }
  metrics {
    value
  }
}
    `;
export const EntityGraphEdgeFragmentDoc = gql`
    fragment EntityGraphEdge on EntityRelation {
  id
  label
  leftId
  rightId
}
    `;
export const EntityGraphFragmentDoc = gql`
    fragment EntityGraph on EntityGraph {
  graph {
    id
  }
  nodes {
    ...EntityGraphNode
  }
  edges {
    ...EntityGraphEdge
  }
}
    ${EntityGraphNodeFragmentDoc}
${EntityGraphEdgeFragmentDoc}`;
export const EntityFragmentDoc = gql`
    fragment Entity on Entity {
  id
  label
  linkedExpression {
    id
    label
    expression {
      id
      label
    }
    graph {
      id
      name
    }
  }
  subjectedTo {
    id
    performedAt
    name
  }
  metrics {
    id
    linkedExpression {
      id
      label
    }
    value
    validFrom
  }
  object
  identifier
  relations {
    id
    right {
      id
      label
      linkedExpression {
        id
        expression {
          id
          label
        }
      }
    }
    linkedExpression {
      label
    }
  }
}
    `;
export const EntityRelationFragmentDoc = gql`
    fragment EntityRelation on EntityRelation {
  id
  left {
    ...Entity
  }
  right {
    ...Entity
  }
  metrics {
    value
  }
  linkedExpression {
    id
    expression {
      label
    }
  }
}
    ${EntityFragmentDoc}`;
export const ListEntityRelationFragmentDoc = gql`
    fragment ListEntityRelation on EntityRelation {
  id
  leftId
  rightId
  linkedExpression {
    id
    expression {
      label
    }
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
export const ListLinkedExpressionFragmentDoc = gql`
    fragment ListLinkedExpression on LinkedExpression {
  id
  graph {
    id
    name
  }
  expression {
    id
    label
    ontology {
      id
      name
    }
    store {
      ...MediaStore
    }
  }
  pinned
}
    ${MediaStoreFragmentDoc}`;
export const GraphFragmentDoc = gql`
    fragment Graph on Graph {
  id
  name
  description
  relations: linkedExpressions(
    filters: {kind: RELATION}
    pagination: {limit: 200}
  ) {
    ...ListLinkedExpression
  }
  entities: linkedExpressions(filters: {kind: ENTITY}, pagination: {limit: 200}) {
    ...ListLinkedExpression
  }
  metrics: linkedExpressions(filters: {kind: METRIC}, pagination: {limit: 200}) {
    ...ListLinkedExpression
  }
  structures: linkedExpressions(
    filters: {kind: STRUCTURE}
    pagination: {limit: 200}
  ) {
    ...ListLinkedExpression
  }
}
    ${ListLinkedExpressionFragmentDoc}`;
export const ListGraphFragmentDoc = gql`
    fragment ListGraph on Graph {
  id
  name
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
export const ExpressionFragmentDoc = gql`
    fragment Expression on Expression {
  id
  label
  ontology {
    id
    name
  }
  description
  linkedExpressions {
    ...ListLinkedExpression
    entities(pagination: {limit: 10}) {
      id
      label
    }
  }
  store {
    ...MediaStore
  }
  kind
  metricKind
}
    ${ListLinkedExpressionFragmentDoc}
${MediaStoreFragmentDoc}`;
export const LinkedExpressionFragmentDoc = gql`
    fragment LinkedExpression on LinkedExpression {
  id
  graph {
    id
    name
  }
  expression {
    ...Expression
  }
  entities(pagination: {limit: 10}) {
    id
    label
  }
  pinned
}
    ${ExpressionFragmentDoc}`;
export const ListExpressionFragmentDoc = gql`
    fragment ListExpression on Expression {
  id
  label
  description
  kind
  store {
    ...MediaStore
  }
}
    ${MediaStoreFragmentDoc}`;
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
}
    ${ListExpressionFragmentDoc}
${MediaStoreFragmentDoc}`;
export const ListOntologyFragmentDoc = gql`
    fragment ListOntology on Ontology {
  id
  name
  description
  purl
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
export const CreateEntityRelationDocument = gql`
    mutation CreateEntityRelation($input: EntityRelationInput!) {
  createEntityRelation(input: $input) {
    ...EntityRelation
  }
}
    ${EntityRelationFragmentDoc}`;
export type CreateEntityRelationMutationFn = Apollo.MutationFunction<CreateEntityRelationMutation, CreateEntityRelationMutationVariables>;

/**
 * __useCreateEntityRelationMutation__
 *
 * To run a mutation, you first call `useCreateEntityRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEntityRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEntityRelationMutation, { data, loading, error }] = useCreateEntityRelationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEntityRelationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateEntityRelationMutation, CreateEntityRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateEntityRelationMutation, CreateEntityRelationMutationVariables>(CreateEntityRelationDocument, options);
      }
export type CreateEntityRelationMutationHookResult = ReturnType<typeof useCreateEntityRelationMutation>;
export type CreateEntityRelationMutationResult = Apollo.MutationResult<CreateEntityRelationMutation>;
export type CreateEntityRelationMutationOptions = Apollo.BaseMutationOptions<CreateEntityRelationMutation, CreateEntityRelationMutationVariables>;
export const CreateEntityGraphRelationDocument = gql`
    mutation CreateEntityGraphRelation($input: EntityRelationInput!) {
  createEntityRelation(input: $input) {
    ...EntityGraphEdge
  }
}
    ${EntityGraphEdgeFragmentDoc}`;
export type CreateEntityGraphRelationMutationFn = Apollo.MutationFunction<CreateEntityGraphRelationMutation, CreateEntityGraphRelationMutationVariables>;

/**
 * __useCreateEntityGraphRelationMutation__
 *
 * To run a mutation, you first call `useCreateEntityGraphRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEntityGraphRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEntityGraphRelationMutation, { data, loading, error }] = useCreateEntityGraphRelationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEntityGraphRelationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateEntityGraphRelationMutation, CreateEntityGraphRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateEntityGraphRelationMutation, CreateEntityGraphRelationMutationVariables>(CreateEntityGraphRelationDocument, options);
      }
export type CreateEntityGraphRelationMutationHookResult = ReturnType<typeof useCreateEntityGraphRelationMutation>;
export type CreateEntityGraphRelationMutationResult = Apollo.MutationResult<CreateEntityGraphRelationMutation>;
export type CreateEntityGraphRelationMutationOptions = Apollo.BaseMutationOptions<CreateEntityGraphRelationMutation, CreateEntityGraphRelationMutationVariables>;
export const CreateEntityMetricDocument = gql`
    mutation CreateEntityMetric($input: CreateEntityMetricInput!) {
  createEntityMetric(input: $input) {
    ...Entity
  }
}
    ${EntityFragmentDoc}`;
export type CreateEntityMetricMutationFn = Apollo.MutationFunction<CreateEntityMetricMutation, CreateEntityMetricMutationVariables>;

/**
 * __useCreateEntityMetricMutation__
 *
 * To run a mutation, you first call `useCreateEntityMetricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEntityMetricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEntityMetricMutation, { data, loading, error }] = useCreateEntityMetricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEntityMetricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateEntityMetricMutation, CreateEntityMetricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateEntityMetricMutation, CreateEntityMetricMutationVariables>(CreateEntityMetricDocument, options);
      }
export type CreateEntityMetricMutationHookResult = ReturnType<typeof useCreateEntityMetricMutation>;
export type CreateEntityMetricMutationResult = Apollo.MutationResult<CreateEntityMetricMutation>;
export type CreateEntityMetricMutationOptions = Apollo.BaseMutationOptions<CreateEntityMetricMutation, CreateEntityMetricMutationVariables>;
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
export const PinLinkedExpressionDocument = gql`
    mutation PinLinkedExpression($input: PinLinkedExpressionInput!) {
  pinLinkedExpression(input: $input) {
    ...LinkedExpression
  }
}
    ${LinkedExpressionFragmentDoc}`;
export type PinLinkedExpressionMutationFn = Apollo.MutationFunction<PinLinkedExpressionMutation, PinLinkedExpressionMutationVariables>;

/**
 * __usePinLinkedExpressionMutation__
 *
 * To run a mutation, you first call `usePinLinkedExpressionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinLinkedExpressionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinLinkedExpressionMutation, { data, loading, error }] = usePinLinkedExpressionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePinLinkedExpressionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PinLinkedExpressionMutation, PinLinkedExpressionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PinLinkedExpressionMutation, PinLinkedExpressionMutationVariables>(PinLinkedExpressionDocument, options);
      }
export type PinLinkedExpressionMutationHookResult = ReturnType<typeof usePinLinkedExpressionMutation>;
export type PinLinkedExpressionMutationResult = Apollo.MutationResult<PinLinkedExpressionMutation>;
export type PinLinkedExpressionMutationOptions = Apollo.BaseMutationOptions<PinLinkedExpressionMutation, PinLinkedExpressionMutationVariables>;
export const LinkExpressionDocument = gql`
    mutation LinkExpression($input: LinkExpressionInput!) {
  linkExpression(input: $input) {
    ...LinkedExpression
  }
}
    ${LinkedExpressionFragmentDoc}`;
export type LinkExpressionMutationFn = Apollo.MutationFunction<LinkExpressionMutation, LinkExpressionMutationVariables>;

/**
 * __useLinkExpressionMutation__
 *
 * To run a mutation, you first call `useLinkExpressionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkExpressionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkExpressionMutation, { data, loading, error }] = useLinkExpressionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLinkExpressionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LinkExpressionMutation, LinkExpressionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LinkExpressionMutation, LinkExpressionMutationVariables>(LinkExpressionDocument, options);
      }
export type LinkExpressionMutationHookResult = ReturnType<typeof useLinkExpressionMutation>;
export type LinkExpressionMutationResult = Apollo.MutationResult<LinkExpressionMutation>;
export type LinkExpressionMutationOptions = Apollo.BaseMutationOptions<LinkExpressionMutation, LinkExpressionMutationVariables>;
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
    mutation CreateStructure($input: MeasurementInput!) {
  createMeasurement(input: $input) {
    ...Entity
  }
}
    ${EntityFragmentDoc}`;
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
export const GetEntityGraphNodeDocument = gql`
    query GetEntityGraphNode($id: ID!) {
  entity(id: $id) {
    ...EntityGraphNode
  }
}
    ${EntityGraphNodeFragmentDoc}`;

/**
 * __useGetEntityGraphNodeQuery__
 *
 * To run a query within a React component, call `useGetEntityGraphNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEntityGraphNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEntityGraphNodeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEntityGraphNodeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetEntityGraphNodeQuery, GetEntityGraphNodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetEntityGraphNodeQuery, GetEntityGraphNodeQueryVariables>(GetEntityGraphNodeDocument, options);
      }
export function useGetEntityGraphNodeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetEntityGraphNodeQuery, GetEntityGraphNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetEntityGraphNodeQuery, GetEntityGraphNodeQueryVariables>(GetEntityGraphNodeDocument, options);
        }
export type GetEntityGraphNodeQueryHookResult = ReturnType<typeof useGetEntityGraphNodeQuery>;
export type GetEntityGraphNodeLazyQueryHookResult = ReturnType<typeof useGetEntityGraphNodeLazyQuery>;
export type GetEntityGraphNodeQueryResult = Apollo.QueryResult<GetEntityGraphNodeQuery, GetEntityGraphNodeQueryVariables>;
export const ListEntitiesDocument = gql`
    query ListEntities($filters: EntityFilter, $pagination: GraphPaginationInput) {
  entities(filters: $filters, pagination: $pagination) {
    ...ListEntity
  }
}
    ${ListEntityFragmentDoc}`;

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
    label: label
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
export const SearchGraphEntitiesDocument = gql`
    query SearchGraphEntities($filters: EntityFilter, $pagination: GraphPaginationInput) {
  entities(filters: $filters, pagination: $pagination) {
    ...ListEntity
  }
}
    ${ListEntityFragmentDoc}`;

/**
 * __useSearchGraphEntitiesQuery__
 *
 * To run a query within a React component, call `useSearchGraphEntitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchGraphEntitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchGraphEntitiesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useSearchGraphEntitiesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchGraphEntitiesQuery, SearchGraphEntitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchGraphEntitiesQuery, SearchGraphEntitiesQueryVariables>(SearchGraphEntitiesDocument, options);
      }
export function useSearchGraphEntitiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchGraphEntitiesQuery, SearchGraphEntitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchGraphEntitiesQuery, SearchGraphEntitiesQueryVariables>(SearchGraphEntitiesDocument, options);
        }
export type SearchGraphEntitiesQueryHookResult = ReturnType<typeof useSearchGraphEntitiesQuery>;
export type SearchGraphEntitiesLazyQueryHookResult = ReturnType<typeof useSearchGraphEntitiesLazyQuery>;
export type SearchGraphEntitiesQueryResult = Apollo.QueryResult<SearchGraphEntitiesQuery, SearchGraphEntitiesQueryVariables>;
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
export const GlobalSearchDocument = gql`
    query GlobalSearch($search: String, $noImages: Boolean!, $noFiles: Boolean!, $pagination: GraphPaginationInput) {
  entities: entities(filters: {search: $search}, pagination: $pagination) @skip(if: $noImages) {
    ...ListEntity
  }
}
    ${ListEntityFragmentDoc}`;

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
export const GetLinkedExpressionDocument = gql`
    query GetLinkedExpression($id: ID!) {
  linkedExpression(id: $id) {
    ...LinkedExpression
  }
}
    ${LinkedExpressionFragmentDoc}`;

/**
 * __useGetLinkedExpressionQuery__
 *
 * To run a query within a React component, call `useGetLinkedExpressionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLinkedExpressionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLinkedExpressionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLinkedExpressionQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetLinkedExpressionQuery, GetLinkedExpressionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetLinkedExpressionQuery, GetLinkedExpressionQueryVariables>(GetLinkedExpressionDocument, options);
      }
export function useGetLinkedExpressionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLinkedExpressionQuery, GetLinkedExpressionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetLinkedExpressionQuery, GetLinkedExpressionQueryVariables>(GetLinkedExpressionDocument, options);
        }
export type GetLinkedExpressionQueryHookResult = ReturnType<typeof useGetLinkedExpressionQuery>;
export type GetLinkedExpressionLazyQueryHookResult = ReturnType<typeof useGetLinkedExpressionLazyQuery>;
export type GetLinkedExpressionQueryResult = Apollo.QueryResult<GetLinkedExpressionQuery, GetLinkedExpressionQueryVariables>;
export const GetLinkedExpressionByAgeNameDocument = gql`
    query GetLinkedExpressionByAgeName($ageName: String!, $graph: ID!) {
  linkedExpressionByAgename(ageName: $ageName, graphId: $graph) {
    ...LinkedExpression
  }
}
    ${LinkedExpressionFragmentDoc}`;

/**
 * __useGetLinkedExpressionByAgeNameQuery__
 *
 * To run a query within a React component, call `useGetLinkedExpressionByAgeNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLinkedExpressionByAgeNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLinkedExpressionByAgeNameQuery({
 *   variables: {
 *      ageName: // value for 'ageName'
 *      graph: // value for 'graph'
 *   },
 * });
 */
export function useGetLinkedExpressionByAgeNameQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetLinkedExpressionByAgeNameQuery, GetLinkedExpressionByAgeNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetLinkedExpressionByAgeNameQuery, GetLinkedExpressionByAgeNameQueryVariables>(GetLinkedExpressionByAgeNameDocument, options);
      }
export function useGetLinkedExpressionByAgeNameLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLinkedExpressionByAgeNameQuery, GetLinkedExpressionByAgeNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetLinkedExpressionByAgeNameQuery, GetLinkedExpressionByAgeNameQueryVariables>(GetLinkedExpressionByAgeNameDocument, options);
        }
export type GetLinkedExpressionByAgeNameQueryHookResult = ReturnType<typeof useGetLinkedExpressionByAgeNameQuery>;
export type GetLinkedExpressionByAgeNameLazyQueryHookResult = ReturnType<typeof useGetLinkedExpressionByAgeNameLazyQuery>;
export type GetLinkedExpressionByAgeNameQueryResult = Apollo.QueryResult<GetLinkedExpressionByAgeNameQuery, GetLinkedExpressionByAgeNameQueryVariables>;
export const SearchLinkedExpressionDocument = gql`
    query SearchLinkedExpression($search: String, $values: [ID!], $graph: ID) {
  options: linkedExpressions(
    filters: {search: $search, ids: $values, graph: $graph}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchLinkedExpressionQuery__
 *
 * To run a query within a React component, call `useSearchLinkedExpressionQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchLinkedExpressionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchLinkedExpressionQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *      graph: // value for 'graph'
 *   },
 * });
 */
export function useSearchLinkedExpressionQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchLinkedExpressionQuery, SearchLinkedExpressionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchLinkedExpressionQuery, SearchLinkedExpressionQueryVariables>(SearchLinkedExpressionDocument, options);
      }
export function useSearchLinkedExpressionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchLinkedExpressionQuery, SearchLinkedExpressionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchLinkedExpressionQuery, SearchLinkedExpressionQueryVariables>(SearchLinkedExpressionDocument, options);
        }
export type SearchLinkedExpressionQueryHookResult = ReturnType<typeof useSearchLinkedExpressionQuery>;
export type SearchLinkedExpressionLazyQueryHookResult = ReturnType<typeof useSearchLinkedExpressionLazyQuery>;
export type SearchLinkedExpressionQueryResult = Apollo.QueryResult<SearchLinkedExpressionQuery, SearchLinkedExpressionQueryVariables>;
export const SearchLinkedRelationsDocument = gql`
    query SearchLinkedRelations($search: String, $values: [ID!], $graph: ID) {
  options: linkedExpressions(
    filters: {search: $search, ids: $values, graph: $graph, kind: RELATION}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchLinkedRelationsQuery__
 *
 * To run a query within a React component, call `useSearchLinkedRelationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchLinkedRelationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchLinkedRelationsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *      graph: // value for 'graph'
 *   },
 * });
 */
export function useSearchLinkedRelationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchLinkedRelationsQuery, SearchLinkedRelationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchLinkedRelationsQuery, SearchLinkedRelationsQueryVariables>(SearchLinkedRelationsDocument, options);
      }
export function useSearchLinkedRelationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchLinkedRelationsQuery, SearchLinkedRelationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchLinkedRelationsQuery, SearchLinkedRelationsQueryVariables>(SearchLinkedRelationsDocument, options);
        }
export type SearchLinkedRelationsQueryHookResult = ReturnType<typeof useSearchLinkedRelationsQuery>;
export type SearchLinkedRelationsLazyQueryHookResult = ReturnType<typeof useSearchLinkedRelationsLazyQuery>;
export type SearchLinkedRelationsQueryResult = Apollo.QueryResult<SearchLinkedRelationsQuery, SearchLinkedRelationsQueryVariables>;
export const SearchLinkedEntitiesDocument = gql`
    query SearchLinkedEntities($search: String, $values: [ID!], $graph: ID) {
  options: linkedExpressions(
    filters: {search: $search, ids: $values, graph: $graph, kind: ENTITY}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchLinkedEntitiesQuery__
 *
 * To run a query within a React component, call `useSearchLinkedEntitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchLinkedEntitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchLinkedEntitiesQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *      graph: // value for 'graph'
 *   },
 * });
 */
export function useSearchLinkedEntitiesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchLinkedEntitiesQuery, SearchLinkedEntitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchLinkedEntitiesQuery, SearchLinkedEntitiesQueryVariables>(SearchLinkedEntitiesDocument, options);
      }
export function useSearchLinkedEntitiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchLinkedEntitiesQuery, SearchLinkedEntitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchLinkedEntitiesQuery, SearchLinkedEntitiesQueryVariables>(SearchLinkedEntitiesDocument, options);
        }
export type SearchLinkedEntitiesQueryHookResult = ReturnType<typeof useSearchLinkedEntitiesQuery>;
export type SearchLinkedEntitiesLazyQueryHookResult = ReturnType<typeof useSearchLinkedEntitiesLazyQuery>;
export type SearchLinkedEntitiesQueryResult = Apollo.QueryResult<SearchLinkedEntitiesQuery, SearchLinkedEntitiesQueryVariables>;
export const ListLinkedExpressionDocument = gql`
    query ListLinkedExpression($filters: LinkedExpressionFilter, $pagination: OffsetPaginationInput) {
  linkedExpressions(filters: $filters, pagination: $pagination) {
    ...ListLinkedExpression
  }
}
    ${ListLinkedExpressionFragmentDoc}`;

/**
 * __useListLinkedExpressionQuery__
 *
 * To run a query within a React component, call `useListLinkedExpressionQuery` and pass it any options that fit your needs.
 * When your component renders, `useListLinkedExpressionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListLinkedExpressionQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListLinkedExpressionQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListLinkedExpressionQuery, ListLinkedExpressionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListLinkedExpressionQuery, ListLinkedExpressionQueryVariables>(ListLinkedExpressionDocument, options);
      }
export function useListLinkedExpressionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListLinkedExpressionQuery, ListLinkedExpressionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListLinkedExpressionQuery, ListLinkedExpressionQueryVariables>(ListLinkedExpressionDocument, options);
        }
export type ListLinkedExpressionQueryHookResult = ReturnType<typeof useListLinkedExpressionQuery>;
export type ListLinkedExpressionLazyQueryHookResult = ReturnType<typeof useListLinkedExpressionLazyQuery>;
export type ListLinkedExpressionQueryResult = Apollo.QueryResult<ListLinkedExpressionQuery, ListLinkedExpressionQueryVariables>;
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
export const GetEntityRelationDocument = gql`
    query GetEntityRelation($id: ID!) {
  entityRelation(id: $id) {
    ...EntityRelation
  }
}
    ${EntityRelationFragmentDoc}`;

/**
 * __useGetEntityRelationQuery__
 *
 * To run a query within a React component, call `useGetEntityRelationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEntityRelationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEntityRelationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEntityRelationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetEntityRelationQuery, GetEntityRelationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetEntityRelationQuery, GetEntityRelationQueryVariables>(GetEntityRelationDocument, options);
      }
export function useGetEntityRelationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetEntityRelationQuery, GetEntityRelationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetEntityRelationQuery, GetEntityRelationQueryVariables>(GetEntityRelationDocument, options);
        }
export type GetEntityRelationQueryHookResult = ReturnType<typeof useGetEntityRelationQuery>;
export type GetEntityRelationLazyQueryHookResult = ReturnType<typeof useGetEntityRelationLazyQuery>;
export type GetEntityRelationQueryResult = Apollo.QueryResult<GetEntityRelationQuery, GetEntityRelationQueryVariables>;
export const ListEntityRelationsDocument = gql`
    query ListEntityRelations($filters: EntityRelationFilter, $pagination: GraphPaginationInput) {
  entityRelations(filters: $filters, pagination: $pagination) {
    ...ListEntityRelation
    metricMap
  }
}
    ${ListEntityRelationFragmentDoc}`;

/**
 * __useListEntityRelationsQuery__
 *
 * To run a query within a React component, call `useListEntityRelationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListEntityRelationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListEntityRelationsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListEntityRelationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListEntityRelationsQuery, ListEntityRelationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListEntityRelationsQuery, ListEntityRelationsQueryVariables>(ListEntityRelationsDocument, options);
      }
export function useListEntityRelationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListEntityRelationsQuery, ListEntityRelationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListEntityRelationsQuery, ListEntityRelationsQueryVariables>(ListEntityRelationsDocument, options);
        }
export type ListEntityRelationsQueryHookResult = ReturnType<typeof useListEntityRelationsQuery>;
export type ListEntityRelationsLazyQueryHookResult = ReturnType<typeof useListEntityRelationsLazyQuery>;
export type ListEntityRelationsQueryResult = Apollo.QueryResult<ListEntityRelationsQuery, ListEntityRelationsQueryVariables>;
export const SearchEntityRelationsDocument = gql`
    query SearchEntityRelations($search: String, $values: [ID!]) {
  options: entityRelations(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchEntityRelationsQuery__
 *
 * To run a query within a React component, call `useSearchEntityRelationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEntityRelationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEntityRelationsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchEntityRelationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchEntityRelationsQuery, SearchEntityRelationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchEntityRelationsQuery, SearchEntityRelationsQueryVariables>(SearchEntityRelationsDocument, options);
      }
export function useSearchEntityRelationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchEntityRelationsQuery, SearchEntityRelationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchEntityRelationsQuery, SearchEntityRelationsQueryVariables>(SearchEntityRelationsDocument, options);
        }
export type SearchEntityRelationsQueryHookResult = ReturnType<typeof useSearchEntityRelationsQuery>;
export type SearchEntityRelationsLazyQueryHookResult = ReturnType<typeof useSearchEntityRelationsLazyQuery>;
export type SearchEntityRelationsQueryResult = Apollo.QueryResult<SearchEntityRelationsQuery, SearchEntityRelationsQueryVariables>;
export const GetStructureDocument = gql`
    query GetStructure($graph: ID!, $structure: StructureString!) {
  structure(graph: $graph, structure: $structure) {
    ...Entity
  }
}
    ${EntityFragmentDoc}`;

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