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
  /** The `AnyScalar` scalar type represents an arbitrary JSON-like value */
  AnyScalar: { input: any; output: any; }
  /** The `CypherLiteral` scalar type represents a raw Cypher query or fragment */
  CypherLiteral: { input: any; output: any; }
  /** Date with time (isoformat) */
  DateTime: { input: any; output: any; }
  GlobalID: { input: any; output: any; }
  GraphID: { input: string; output: string; }
  /** The `StructureIdentifier` scalar type represents a structure identifier (e.g. '@mikro/roi') */
  StructureIdentifier: { input: any; output: any; }
  /** The `StructureObject` scalar type represents a structure object (e.g 1) on a specific identifier) */
  StructureObject: { input: any; output: any; }
  UnixMilliseconds: { input: any; output: any; }
  _Any: { input: any; output: any; }
};

export enum Action {
  AddEntityDefinitions = 'ADD_ENTITY_DEFINITIONS',
  AddRelationDefinitions = 'ADD_RELATION_DEFINITIONS',
  AddStructureDefinitions = 'ADD_STRUCTURE_DEFINITIONS',
  AutoAddMetrics = 'AUTO_ADD_METRICS',
  AutoAddStructures = 'AUTO_ADD_STRUCTURES',
  AutoAddStructureDefinitions = 'AUTO_ADD_STRUCTURE_DEFINITIONS',
  CreateBuilderArg = 'CREATE_BUILDER_ARG'
}

/** Simple boolean filter over request context for action rules */
export type ActionFilterInput = {
  /** All roles that must be present on the request */
  requiredRoles?: Array<Scalars['String']['input']>;
  /** All scopes that must be present on the request */
  requiredScopes?: Array<Scalars['String']['input']>;
};

/** Allow/deny rule for a graph action */
export type ActionRuleInput = {
  /** Action this rule controls */
  action: Action;
  /** Whether this rule allows or denies the action */
  allow?: Scalars['Boolean']['input'];
  /** Simple boolean filter against request context */
  filter: ActionFilterInput;
};

export enum AggregationFunction {
  Count = 'COUNT',
  EuclideanRange = 'EUCLIDEAN_RANGE',
  Latest = 'LATEST',
  Max = 'MAX',
  Mean = 'MEAN',
  Min = 'MIN',
  Range = 'RANGE',
  Sum = 'SUM'
}

/** Input for archiving a category tag */
export type ArchiveCategoryTagInput = {
  /** The category tag ID */
  id: Scalars['String']['input'];
};

/** Input for archiving an edge pairs query */
export type ArchiveEdgePairsQueryInput = {
  /** The ID of the edge pairs query to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving an edge path query */
export type ArchiveEdgePathQueryInput = {
  /** The ID of the edge path query to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving an edge table query */
export type ArchiveEdgeTableQueryInput = {
  /** The ID of the edge table query to archive */
  id: Scalars['String']['input'];
};

/** Input for recalculating an entity's derived properties */
export type ArchiveEntityInput = {
  /** The ID of the entity to archive */
  id: Scalars['GraphID']['input'];
};

/** Input for archiving a graph */
export type ArchiveGraphInput = {
  /** The ID of the graph to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving a graph pairs query */
export type ArchiveGraphPairsQueryInput = {
  /** The ID of the graph pairs query to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving a graph path query */
export type ArchiveGraphPathQueryInput = {
  /** The ID of the graph path query to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving a graph table query */
export type ArchiveGraphTableQueryInput = {
  /** The ID of the graph query to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving an existing measurement edge */
export type ArchiveMeasurementInput = {
  /** The ID of the measurement to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving an existing metric */
export type ArchiveMetricInput = {
  /** The ID of the metric to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving (soft deleting) an existing natural event instance */
export type ArchiveNaturalEventInput = {
  /** The ID of the natural event to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving a node pairs query */
export type ArchiveNodePairsQueryInput = {
  /** The ID of the node pairs query to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving a node path query */
export type ArchiveNodePathQueryInput = {
  /** The ID of the node path query to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving a node table query */
export type ArchiveNodeTableQueryInput = {
  /** The ID of the node table query to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving (soft deleting) an existing protocol event instance */
export type ArchiveProtocolEventInput = {
  /** The ID of the protocol event to archive */
  id: Scalars['String']['input'];
};

/** Input for archiving an existing relation */
export type ArchiveRelationInput = {
  /** The ID of the relation to archive */
  id: Scalars['GraphID']['input'];
};

/** Input for archiving a scatter plot */
export type ArchiveScatterPlotInput = {
  /** The database ID of the scatter plot to archive */
  id: Scalars['Int']['input'];
};

/** Input for deleting an existing structure */
export type ArchiveStructureInput = {
  /** The ID of the structure to archive */
  id: Scalars['GraphID']['input'];
};

/** Input for archiving an existing structure relation */
export type ArchiveStructureRelationInput = {
  /** The ID of the structure relation to archive */
  id: Scalars['String']['input'];
};

/** A natural event category/schema definition */
export type Asserted = Edge & {
  __typename?: 'Asserted';
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for edge lookup */
  id: Scalars['String']['output'];
  /** The edge label/type */
  label: Scalars['String']['output'];
  /** Global ID of the source/left node */
  sourceId: Scalars['String']['output'];
  /** Global ID of the target/right node */
  targetId: Scalars['String']['output'];
};

/** An assertion representing provenance information */
export type Assertion = Node & {
  __typename?: 'Assertion';
  /** Action arguments as JSON */
  actionArgs?: Maybe<Scalars['AnyScalar']['output']>;
  /** Action identifier */
  actionId?: Maybe<Scalars['String']['output']>;
  /** Human-readable action name */
  actionName?: Maybe<Scalars['String']['output']>;
  /** Application that made the assertion */
  appId?: Maybe<Scalars['String']['output']>;
  /** When this assertion was created */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** External ID if set */
  externalId?: Maybe<Scalars['String']['output']>;
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** The graph this node belongs to */
  graph: Graph;
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for node lookup */
  id: Scalars['String']['output'];
  /** The AGE graph label as recently materialized (e.g. 'Cell IAC100', 'ROI 1') */
  label: Scalars['String']['output'];
  /** Local ID if set */
  localId?: Maybe<Scalars['String']['output']>;
  /** User/subject who made the assertion */
  subject?: Maybe<Scalars['String']['output']>;
  /** Tags associated with this node */
  tags: Array<Scalars['String']['output']>;
};

/** Input type for creating a new graph query */
export type BuilderArgs = {
  __typename?: 'BuilderArgs';
  /** Optional patterns to match in the graph for this query */
  matchPaths?: Maybe<Array<MatchPath>>;
  /** The values to return for each matched pattern in the graph query */
  returnStatements?: Maybe<Array<ReturnStatement>>;
  /** Optional filtering conditions for the graph query */
  whereClauses?: Maybe<Array<WhereClause>>;
};

/** Builder arguments for generating a graph table query */
export type BuilderArgsInput = {
  /** Optional patterns to match in the graph for this query */
  matchPaths?: InputMaybe<Array<MatchPathInput>>;
  /** The values to return for each matched pattern in the graph query */
  returnStatements?: InputMaybe<Array<ReturnStatementInput>>;
  /** Optional filtering conditions for the graph query */
  whereClauses?: InputMaybe<Array<WhereClauseInput>>;
};

export enum Cardinality {
  ManyToOne = 'MANY_TO_ONE',
  OneToMany = 'ONE_TO_MANY',
  OneToOne = 'ONE_TO_ONE'
}

/** Base interface for structure categories/schemas */
export type Category = {
  /** The name of the category as used in AGE (e.g. 'Cell', 'ROI') */
  ageName: Scalars['String']['output'];
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this category belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** An image representing this category, for visualization purposes */
  image: MediaStore;
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  pinned: Scalars['Boolean']['output'];
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant queries that use this category as input */
  relevantQueries: Array<GraphQuery>;
  /** List of tags associated with this category */
  tags: Array<CategoryTag>;
};


/** Base interface for structure categories/schemas */
export type CategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
  ordering?: Array<CategoryTagOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Base interface for graph nodes representing entities */
export type CategoryTag = {
  __typename?: 'CategoryTag';
  /** Description of the category tag */
  description?: Maybe<Scalars['String']['output']>;
  /** Database ID of the category tag */
  id: Scalars['ID']['output'];
  /** Name of the category tag */
  name: Scalars['String']['output'];
};

/** Numeric/aggregatable fields of CategoryTag */
export enum CategoryTagField {
  CreatedAt = 'CREATED_AT'
}

export type CategoryTagFilter = {
  AND?: InputMaybe<CategoryTagFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<CategoryTagFilter>;
  OR?: InputMaybe<CategoryTagFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by list of IDs */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryTagOrder =
  { id: Ordering; name?: never; }
  |  { id?: never; name: Ordering; };

export type CategoryTagStats = {
  __typename?: 'CategoryTagStats';
  /** Average value */
  avg?: Maybe<Scalars['Float']['output']>;
  /** Total number of items in the selection */
  count: Scalars['Int']['output'];
  /** Count of distinct values */
  distinctCount: Scalars['Int']['output'];
  /** Maximum value */
  max?: Maybe<Scalars['Float']['output']>;
  /** Minimum value */
  min?: Maybe<Scalars['Float']['output']>;
  /** Sum of values */
  sum?: Maybe<Scalars['Float']['output']>;
};


export type CategoryTagStatsAvgArgs = {
  field: CategoryTagField;
};


export type CategoryTagStatsDistinctCountArgs = {
  field: CategoryTagField;
};


export type CategoryTagStatsMaxArgs = {
  field: CategoryTagField;
};


export type CategoryTagStatsMinArgs = {
  field: CategoryTagField;
};


export type CategoryTagStatsSumArgs = {
  field: CategoryTagField;
};

/** Input type for defining a graph schema */
export type Column = {
  __typename?: 'Column';
  /** Optional category/key for this column, used for grouping or filtering in the UI */
  categoryKey?: Maybe<Scalars['String']['output']>;
  /** Optional description for this column */
  description?: Maybe<Scalars['String']['output']>;
  /** If this column represents an ID that can be used to link to another table, specify the target table name here */
  isIdForKey?: Maybe<Scalars['String']['output']>;
  /** The property key for this column (inside the table query result) */
  key: Scalars['String']['output'];
  /** Optional human-readable label for this column (defaults to 'key' if not provided) */
  label?: Maybe<Scalars['String']['output']>;
  /** Whether this column should be hidden by default in the UI, even if it's not an ID or metadata column */
  preferHidden: Scalars['Boolean']['output'];
  /** Whether this column should be full-text searchable */
  searchable: Scalars['Boolean']['output'];
  /** The property type for this column (e.g., STRING, FLOAT) */
  type: Scalars['String']['output'];
  /** Unit of measurement if applicable */
  unit?: Maybe<Scalars['String']['output']>;
  /** Whether this column represents a raw property value, a derived value, or a metric */
  valueKind?: Maybe<ValueKind>;
};

/** Input for a graph table query column */
export type ColumnInput = {
  /** Optional category/key for this column, used for grouping or filtering in the UI */
  categoryKey?: InputMaybe<Scalars['String']['input']>;
  /** Optional description for this column */
  description?: InputMaybe<Scalars['String']['input']>;
  /** If this column represents an ID that can be used to link to another table, specify the target table name here */
  isIdForKey?: InputMaybe<Scalars['String']['input']>;
  /** The property key for this column (inside the table query result) */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this column (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Whether this column should be hidden by default in the UI, even if it's not an ID or metadata column */
  preferHidden?: Scalars['Boolean']['input'];
  /** Whether this column should be full-text searchable */
  searchable?: Scalars['Boolean']['input'];
  /** The property type for this column (e.g., STRING, FLOAT) */
  type: Scalars['String']['input'];
  /** Unit of measurement if applicable */
  unit?: InputMaybe<Scalars['String']['input']>;
  /** Whether this column represents a raw property value, a derived value, or a metric */
  valueKind?: InputMaybe<ValueKind>;
};

/** Input for creating a category tag */
export type CreateCategoryTagInput = {
  /** Optional category tag description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph ID this category tag belongs to */
  graph: Scalars['String']['input'];
  /** Optional human-readable name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Unique tag value within the graph */
  value: Scalars['String']['input'];
};

/** Input for creating a new edge pairs query */
export type CreateEdgePairsQueryInput = {
  /** Description of this edge query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this edge pairs query will belong to */
  graph: Scalars['String']['input'];
  /** Unique key for this edge query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this edge query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this edge query */
  query: Scalars['String']['input'];
};

/** Input for creating a new edge path query */
export type CreateEdgePathQueryInput = {
  /** Description of this edge query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this edge path query will belong to */
  graph: Scalars['String']['input'];
  /** Unique key for this edge query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this edge query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this edge query */
  query: Scalars['String']['input'];
};

/** Input for creating a new edge table query */
export type CreateEdgeTableQueryInput = {
  /** Definitions for the columns returned by this edge table query */
  columnInput?: Array<ColumnInput>;
  /** Description of this edge query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this edge table query will belong to */
  graph: Scalars['String']['input'];
  /** Unique key for this edge query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this edge query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this edge query */
  query: Scalars['String']['input'];
};

/** Input for creating a new entity definition in the graph schema */
export type CreateEntityDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this entitiy will beong to */
  graph: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Optional instance kind for this entity category (e.g. 'neuron', 'synapse', 'behavior'). This is used for further categorization and filtering of entities within the graph. */
  instanceKind?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for creating a new entity */
export type CreateEntityInput = {
  /** The ID of the entity category/type to create */
  entityCategory: Scalars['String']['input'];
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
};

/** Input for creating a new graph from a schema definition */
export type CreateGraphInput = {
  /** The complete graph schema definition */
  definition?: InputMaybe<GraphDefinitionInput>;
  /** Description of the graph */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Name of the graph */
  name: Scalars['String']['input'];
};

/** Input for creating a graph pairs query */
export type CreateGraphPairsQueryInput = {
  /** Description of this graph query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this graph pairs query will belong to */
  graph: Scalars['String']['input'];
  /** Unique key for this graph query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** Human-readable name for this graph query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this graph query */
  query: Scalars['String']['input'];
};

/** Input for creating a graph path query */
export type CreateGraphPathQueryInput = {
  /** Description of this graph query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this graph path query will belong to */
  graph: Scalars['String']['input'];
  /** Unique key for this graph query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** Human-readable name for this graph query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this graph query */
  query: Scalars['String']['input'];
};

/** Input for creating a new graph table query */
export type CreateGraphTableQueryInput = {
  /** Definitions for the columns returned by this graph query */
  columnInput?: Array<ColumnInput>;
  /** The Cypher query string that defines this graph query. Can include parameter placeholders (e.g. $param) for dynamic filtering */
  cypher: Scalars['String']['input'];
  /** Description of this graph query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this table query will belong to */
  graph: Scalars['String']['input'];
  /** Unique key for this graph query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** Human-readable name for this graph query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this graph query */
  query: Scalars['String']['input'];
};

/** Input for creating a graph table query through builder arguments */
export type CreateGraphTableQueryThroughBuilderInput = {
  /** Optional additional arguments for the graph query builder to support advanced features like dynamic filtering or pattern matching */
  builderArgs: BuilderArgsInput;
  /** Definitions for the columns returned by this graph query */
  columnInput?: Array<ColumnInput>;
  /** Description of this graph query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this table query will belong to */
  graph: Scalars['String']['input'];
  /** Unique key for this graph query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** Human-readable name for this graph query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this graph query */
  query: Scalars['String']['input'];
};

/** Input for creating a new measurement definition in the graph schema */
export type CreateMeasurementDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this measurement category will belong to */
  graph: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Optional instance kind for this entity category (e.g. 'neuron', 'synapse', 'behavior'). This is used for further categorization and filtering of entities within the graph. */
  instanceKind?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for creating a new measurement edge */
export type CreateMeasurementInput = {
  /** The unique ID of the measurement category */
  category: Scalars['String']['input'];
  /** The ID of the source entity/structure */
  sourceId: Scalars['String']['input'];
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
  /** The ID of the target entity/structure */
  targetId: Scalars['String']['input'];
};

/** Input for creating a new metric definition in the graph schema */
export type CreateMetricDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this metric will belong to */
  graph: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** The label of the describing structure to read from */
  structure: Scalars['String']['input'];
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
  /** Optional schema identifier for this structure (e.g. '@mikro/roi') */
  valueKind: PropertyType;
};

/** Input for creating a new metric */
export type CreateMetricInput = {
  key: Scalars['String']['input'];
  /** The unique ID of the structure this metric is associated with */
  structure: Scalars['GraphID']['input'];
  value: Scalars['AnyScalar']['input'];
};

/** Input for creating a new natural event definition in the graph schema */
export type CreateNaturalEventDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this event will belong to */
  graph: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Input node roles */
  inputs?: Array<EventRoleInput>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** The kind of event */
  kind: EventKind;
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Output node roles */
  outputs?: Array<EventRoleInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for creating a new natural event instance */
export type CreateNaturalEventInput = {
  /** The ID of the natural event category/type to create */
  eventCategory: Scalars['String']['input'];
  /** List of entity IDs that are inputs to this event */
  inputs?: Array<RoleMappingInput>;
  /** List of entity IDs that are outputs of this event */
  outputs?: Array<RoleMappingInput>;
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
};

/** Input for creating a new node pairs query */
export type CreateNodePairsQueryInput = {
  /** Description of this node query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this node pairs query will belong to */
  graph: Scalars['String']['input'];
  /** Unique key for this node query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this node query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this node query */
  query: Scalars['String']['input'];
};

/** Input for creating a new node path query */
export type CreateNodePathQueryInput = {
  /** Description of this node query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this node path query will belong to */
  graph: Scalars['String']['input'];
  /** Unique key for this node query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this node query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this node query */
  query: Scalars['String']['input'];
};

/** Input for creating a new node table query */
export type CreateNodeTableQueryInput = {
  /** Definitions for the columns returned by this node table query */
  columnInput?: Array<ColumnInput>;
  /** Description of this node query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this node table query will belong to */
  graph: Scalars['String']['input'];
  /** Unique key for this node query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this node query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this node query */
  query: Scalars['String']['input'];
};

/** Input for creating a new protocol event definition in the graph schema */
export type CreateProtocolEventDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this event will belong to */
  graph: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Input node roles */
  inputs?: Array<EventRoleInput>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** The kind of event */
  kind: EventKind;
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Output node roles */
  outputs?: Array<EventRoleInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** The protocol this event definition belongs to */
  protocol: Scalars['String']['input'];
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for creating a new protocol event instance */
export type CreateProtocolEventInput = {
  /** The ID of the protocol event category/type to create */
  eventCategory: Scalars['String']['input'];
  /** List of entity IDs that are inputs to this event */
  inputs?: Array<RoleMappingInput>;
  /** List of entity IDs that are outputs of this event */
  outputs?: Array<RoleMappingInput>;
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
};

/** Input for creating a new relation definition in the graph schema */
export type CreateRelationDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this entitiy will beong to */
  graph: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Optional instance kind for this entity category (e.g. 'neuron', 'synapse', 'behavior'). This is used for further categorization and filtering of entities within the graph. */
  instanceKind?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for creating a new relation between two entities with supporting evidence */
export type CreateRelationInput = {
  /** The unique ID of the structure this metric is associated with */
  category: Scalars['String']['input'];
  /** The ID of the source entity/structure */
  sourceId: Scalars['String']['input'];
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
  /** The ID of the target entity/structure */
  targetId: Scalars['String']['input'];
};

/** Input for creating a scatter plot */
export type CreateScatterPlotInput = {
  /** Optional column key used for point color */
  colorColumn?: InputMaybe<Scalars['String']['input']>;
  /** Optional description of the scatter plot */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Optional graph table query ID used by this scatter plot */
  graphQueryId?: InputMaybe<Scalars['Int']['input']>;
  /** Column key used for point identifiers */
  idColumn: Scalars['String']['input'];
  /** The display name of the scatter plot */
  name: Scalars['String']['input'];
  /** Optional node table query ID used by this scatter plot */
  nodeQueryId?: InputMaybe<Scalars['Int']['input']>;
  /** Optional node path query ID used by this scatter plot */
  pathQueryId?: InputMaybe<Scalars['Int']['input']>;
  /** Optional column key used for point shape */
  shapeColumn?: InputMaybe<Scalars['String']['input']>;
  /** Optional column key used for point size */
  sizeColumn?: InputMaybe<Scalars['String']['input']>;
  /** Column key used for x-axis values */
  xColumn?: InputMaybe<Scalars['String']['input']>;
  /** Column key used for x-axis identifiers */
  xIdColumn?: InputMaybe<Scalars['String']['input']>;
  /** Column key used for y-axis values */
  yColumn?: InputMaybe<Scalars['String']['input']>;
  /** Column key used for y-axis identifiers */
  yIdColumn?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new structure definition in the graph schema */
export type CreateStructureDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this structure will belong to */
  graph: Scalars['String']['input'];
  /** Optional schema identifier for this structure (e.g. '@mikro/roi') */
  identifier: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for creating a new entity category/type in the graph schema */
export type CreateStructureInput = {
  /** The ID of the structure category/type to create */
  category: Scalars['String']['input'];
  /** The graph id this structure will belong to */
  graph: Scalars['String']['input'];
  /** List of measurements associated with this structure */
  metrics?: Array<MetricInput>;
  /** The unique ID of the object this structure references */
  object: Scalars['String']['input'];
};

/** Input for creating a new structure relation definition in the graph schema */
export type CreateStructureRelationDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The graph id this entitiy will beong to */
  graph: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Optional instance kind for this entity category (e.g. 'neuron', 'synapse', 'behavior'). This is used for further categorization and filtering of entities within the graph. */
  instanceKind?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for creating a new structure relation */
export type CreateStructureRelationInput = {
  /** The unique ID of the structure relation category */
  category: Scalars['String']['input'];
  /** The ID of the source entity/structure */
  sourceId: Scalars['String']['input'];
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
  /** The ID of the target entity/structure */
  targetId: Scalars['String']['input'];
};

/** Input for deleting a category tag */
export type DeleteCategoryTagInput = {
  /** The category tag ID */
  id: Scalars['String']['input'];
};

/** Input for deleting an edge pairs query */
export type DeleteEdgePairsQueryInput = {
  /** The ID of the edge pairs query to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an edge path query */
export type DeleteEdgePathQueryInput = {
  /** The ID of the edge path query to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an edge table query */
export type DeleteEdgeTableQueryInput = {
  /** The ID of the edge table query to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing entity definition in the graph schema */
export type DeleteEntityDefinitionInput = {
  /** The ID of the structure category to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing entity */
export type DeleteEntityInput = {
  /** The ID of the entity to delete */
  id: Scalars['GraphID']['input'];
};

/** Input for deleting a graph */
export type DeleteGraphInput = {
  /** The ID of the graph to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting a graph pairs query */
export type DeleteGraphPairsQueryInput = {
  /** The ID of the graph pairs query to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting a graph path query */
export type DeleteGraphPathQueryInput = {
  /** The ID of the graph path query to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting a graph table query */
export type DeleteGraphTableQueryInput = {
  /** The ID of the graph query to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing measurement definition in the graph schema */
export type DeleteMeasurementDefinitionInput = {
  /** The ID of the measurement category to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing measurement edge */
export type DeleteMeasurementInput = {
  /** The ID of the measurement to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing metric definition in the graph schema */
export type DeleteMetricDefinitionInput = {
  /** The ID of the entity category to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing metric */
export type DeleteMetricInput = {
  /** The ID of the metric to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing natural event definition in the graph schema */
export type DeleteNaturalEventDefinitionInput = {
  /** The ID of the event category to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing natural event instance */
export type DeleteNaturalEventInput = {
  /** The ID of the natural event to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting a node pairs query */
export type DeleteNodePairsQueryInput = {
  /** The ID of the node pairs query to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting a node path query */
export type DeleteNodePathQueryInput = {
  /** The ID of the node path query to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting a node table query */
export type DeleteNodeTableQueryInput = {
  /** The ID of the node table query to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing protocol event definition in the graph schema */
export type DeleteProtocolEventDefinitionInput = {
  /** The ID of the event category to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing protocol event instance */
export type DeleteProtocolEventInput = {
  /** The ID of the protocol event to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing relation definition in the graph schema */
export type DeleteRelationDefinitionInput = {
  /** The ID of the relation category to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing relation */
export type DeleteRelationInput = {
  /** The ID of the metric to delete */
  id: Scalars['GraphID']['input'];
};

/** Input for deleting a scatter plot */
export type DeleteScatterPlotInput = {
  /** The database ID of the scatter plot to delete */
  id: Scalars['Int']['input'];
};

/** Input for deleting an existing structure definition in the graph schema */
export type DeleteStructureDefinitionInput = {
  /** The ID of the entity category to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing structure */
export type DeleteStructureInput = {
  /** The ID of the structure to delete */
  id: Scalars['GraphID']['input'];
};

/** Input for deleting an existing structure relation definition in the graph schema */
export type DeleteStructureRelationDefinitionInput = {
  /** The ID of the structure relation category to delete */
  id: Scalars['String']['input'];
};

/** Input for deleting an existing structure relation */
export type DeleteStructureRelationInput = {
  /** The ID of the structure relation to delete */
  id: Scalars['String']['input'];
};

/** A derivation rule in the graph schema */
export type DerivationRule = {
  __typename?: 'DerivationRule';
  /** Aggregation function (MEAN, SUM, MAX, MIN, COUNT, etc.) */
  aggregation?: Maybe<AggregationFunction>;
  /** The property key on the source node */
  key?: Maybe<Scalars['String']['output']>;
  /** The label of the describing structure to read from */
  sourceNode?: Maybe<Scalars['String']['output']>;
};

/** Configuration for property derivation rules */
export type DerivationRuleInput = {
  /** Aggregation function (MEAN, SUM, MAX, MIN, COUNT, etc.) */
  aggregation?: InputMaybe<AggregationFunction>;
  /** The property key on the source node */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The label of the describing structure to read from */
  sourceNode?: InputMaybe<Scalars['String']['input']>;
};

export enum DerivationType {
  Latest = 'LATEST',
  LatestAssertionTool = 'LATEST_ASSERTION_TOOL',
  PriorityLatest = 'PRIORITY_LATEST',
  Rollup = 'ROLLUP'
}

/** Base interface for all graph edges */
export type Edge = {
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for edge lookup */
  id: Scalars['String']['output'];
  /** The edge label/type */
  label: Scalars['String']['output'];
  /** Global ID of the source/left node */
  sourceId: Scalars['String']['output'];
  /** Global ID of the target/right node */
  targetId: Scalars['String']['output'];
};

/** Base interface for graph schemas */
export type EdgeCategory = {
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  materializableAs: Array<MaterializedEdge>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant queries that use this category as input */
  relevantEdgeQueries: Array<EdgeQuery>;
};

/** Base interface for graph schemas */
export type EdgePairsQuery = EdgeQuery & {
  __typename?: 'EdgePairsQuery';
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** Optional edge category/schema to filter pairs by */
  edgeCategory?: Maybe<EdgeCategory>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
  /** The source node category/schema to query */
  sourceCategory: NodeCategory;
  /** The target node category/schema to query */
  targetCategory: NodeCategory;
};

export type EdgePairsQueryFilter = {
  AND?: InputMaybe<EdgePairsQueryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<EdgePairsQueryFilter>;
  OR?: InputMaybe<EdgePairsQueryFilter>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full-text search over label and description */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EdgePairsQueryOrder =
  { id: Ordering; label?: never; }
  |  { id?: never; label: Ordering; };

/** Base interface for graph schemas */
export type EdgePathQuery = EdgeQuery & {
  __typename?: 'EdgePathQuery';
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
};

export type EdgePathQueryFilter = {
  AND?: InputMaybe<EdgePathQueryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<EdgePathQueryFilter>;
  OR?: InputMaybe<EdgePathQueryFilter>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full-text search over label and description */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EdgePathQueryOrder =
  { id: Ordering; label?: never; }
  |  { id?: never; label: Ordering; };

/** Base interface for entity categories/schemas */
export type EdgeQuery = {
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
};

/** Base interface for graph schemas */
export type EdgeTableQuery = EdgeQuery & Plottable & {
  __typename?: 'EdgeTableQuery';
  /** If this graph was built using a builder function, the arguments used for building it, which can be used for debugging or rebuilding the graph with different parameters */
  builderArgs?: Maybe<BuilderArgs>;
  /** List of columns to return in the table query result */
  columns: Array<Column>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The Cypher query to execute for this table query */
  query: Scalars['CypherLiteral']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
};

export type EdgeTableQueryFilter = {
  AND?: InputMaybe<EdgeTableQueryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<EdgeTableQueryFilter>;
  OR?: InputMaybe<EdgeTableQueryFilter>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full-text search over label and description */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EdgeTableQueryOrder =
  { id: Ordering; label?: never; }
  |  { id?: never; label: Ordering; };

/** Input for creating a new entity category/type in the graph schema */
export type EnsureStructureInput = {
  /** The graph id this structure will belong to */
  graph: Scalars['String']['input'];
  /** The unique identifier for this structure */
  identifier: Scalars['String']['input'];
  /** List of measurements associated with this structure */
  metrics?: Array<MetricInput>;
  /** The unique ID of the object this structure references */
  object: Scalars['String']['input'];
};

/** An entity in the knowledge graph with derived properties */
export type Entity = Node & VersionedNode & {
  __typename?: 'Entity';
  /** The graph this node belongs to */
  category: EntityCategory;
  /** Category ID linking to EntityCategory model */
  categoryId?: Maybe<Scalars['String']['output']>;
  /** External ID if set */
  externalId?: Maybe<Scalars['String']['output']>;
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** The graph this node belongs to */
  graph: Graph;
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for node lookup */
  id: Scalars['String']['output'];
  /** The entity type/kind (e.g. 'AIS', 'Cell') */
  kind: Scalars['String']['output'];
  /** The AGE graph label as recently materialized (e.g. 'Cell IAC100', 'ROI 1') */
  label: Scalars['String']['output'];
  /** Timestamp when properties were last derived (unix ms) */
  lastDerived?: Maybe<Scalars['UnixMilliseconds']['output']>;
  /** External object ID this entity references */
  lifecycle?: Maybe<Scalars['String']['output']>;
  /** Local ID if set */
  localId?: Maybe<Scalars['String']['output']>;
  /** The source entity of this relation */
  measuredBy: Array<Measurement>;
  /** The source entity of this relation */
  participatedIn: Array<InputParticipation>;
  /** List of the current derived properties for this entity */
  properties: Scalars['AnyScalar']['output'];
  /** The source entity of this relation */
  resultedOut: Array<OutputParticipation>;
  /** List of properties derived for this entity */
  richProperties: Array<RichProperty>;
  /** Schema version used to derive properties */
  schemaVersion: Scalars['String']['output'];
  /** Tags associated with this node */
  tags: Array<Scalars['String']['output']>;
  /** When this entity became valid */
  validFrom?: Maybe<Scalars['DateTime']['output']>;
  /** When this entity stopped being valid */
  validTo?: Maybe<Scalars['DateTime']['output']>;
};

/** An entity category/schema definition */
export type EntityCategory = Category & NodeCategory & {
  __typename?: 'EntityCategory';
  /** The name of the category as used in AGE (e.g. 'Cell', 'ROI') */
  ageName: Scalars['String']['output'];
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this category belongs to */
  entities: Array<Entity>;
  /** The graph this category belongs to */
  graph: Graph;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Height for visualization (optional) */
  height?: Maybe<Scalars['Float']['output']>;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** An image representing this category, for visualization purposes */
  image: MediaStore;
  /** What type of instance, (taking from the universe) 'LOT', 'BIOLOGICAL', 'PHYSICAL' */
  instanceKind?: Maybe<Scalars['String']['output']>;
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  pinned: Scalars['Boolean']['output'];
  /** X coordinate */
  positionX: Scalars['Float']['output'];
  /** Y coordinate */
  positionY: Scalars['Float']['output'];
  /** Z coordinate (optional) */
  positionZ?: Maybe<Scalars['Float']['output']>;
  /** List of property definitions for this entity category */
  propertyDefinitions: Array<PropertyDefinition>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant node queries that use this category as input */
  relevantNodeQueries: Array<NodeQuery>;
  /** List of relevant queries that use this category as input */
  relevantQueries: Array<GraphQuery>;
  /** List of tags associated with this category */
  tags: Array<CategoryTag>;
  /** Width for visualization (optional) */
  width?: Maybe<Scalars['Float']['output']>;
};


/** An entity category/schema definition */
export type EntityCategoryEntitiesArgs = {
  filters?: InputMaybe<EntityFilter>;
  ordering?: InputMaybe<Array<EntityOrder>>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


/** An entity category/schema definition */
export type EntityCategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
  ordering?: Array<CategoryTagOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Numeric/aggregatable fields of EntityCategory */
export enum EntityCategoryField {
  CreatedAt = 'CREATED_AT'
}

export type EntityCategoryFilter = {
  AND?: InputMaybe<EntityCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<EntityCategoryFilter>;
  OR?: InputMaybe<EntityCategoryFilter>;
  graph?: InputMaybe<GraphFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of IDs */
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by list of IDs */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EntityCategoryOrder =
  { id: Ordering; instanceKind?: never; label?: never; }
  |  { id?: never; instanceKind: Ordering; label?: never; }
  |  { id?: never; instanceKind?: never; label: Ordering; };

export type EntityCategoryStats = {
  __typename?: 'EntityCategoryStats';
  /** Average value */
  avg?: Maybe<Scalars['Float']['output']>;
  /** Total number of items in the selection */
  count: Scalars['Int']['output'];
  /** Count of distinct values */
  distinctCount: Scalars['Int']['output'];
  /** Maximum value */
  max?: Maybe<Scalars['Float']['output']>;
  /** Minimum value */
  min?: Maybe<Scalars['Float']['output']>;
  /** Sum of values */
  sum?: Maybe<Scalars['Float']['output']>;
};


export type EntityCategoryStatsAvgArgs = {
  field: EntityCategoryField;
};


export type EntityCategoryStatsDistinctCountArgs = {
  field: EntityCategoryField;
};


export type EntityCategoryStatsMaxArgs = {
  field: EntityCategoryField;
};


export type EntityCategoryStatsMinArgs = {
  field: EntityCategoryField;
};


export type EntityCategoryStatsSumArgs = {
  field: EntityCategoryField;
};

/** Definition of an entity type in the graph schema */
export type EntityDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Optional instance kind for this entity category (e.g. 'neuron', 'synapse', 'behavior'). This is used for further categorization and filtering of entities within the graph. */
  instanceKind?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input type for creating a new graph query */
export type EntityDescriptor = {
  __typename?: 'EntityDescriptor';
  /** Default category to link to if no entities match the filters */
  defaultCategoryKey?: Maybe<Scalars['String']['output']>;
  /** Filter by entity key/label */
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Filter by ontology references on the entity (format: 'PREFIX:TERM_ID') */
  ontotologyTerms?: Maybe<Array<Scalars['String']['output']>>;
  /** Filter by tags on the entity */
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

/** Input for creating a new natural event definition in the graph schema */
export type EntityDescriptorInput = {
  /** Default category to link to if no entities match the filters */
  defaultCategoryKey?: InputMaybe<Scalars['String']['input']>;
  /** Filter by entity key/label */
  keys?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter by ontology references on the entity (format: 'PREFIX:TERM_ID') */
  ontotologyTerms?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter by tags on the entity */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Filter options for querying entities */
export type EntityFilter = {
  /** Filter entities that have a specific property */
  hasProperty?: InputMaybe<Scalars['String']['input']>;
  /** Filter by specific entity IDs */
  ids?: InputMaybe<Array<Scalars['GraphID']['input']>>;
  /** Filter entities that match specific property conditions */
  matches?: InputMaybe<Array<PropertyMatch>>;
  /** Full-text search over entity properties */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Ordering options for entity queries */
export type EntityOrder = {
  /** Order by entity kind/type */
  category?: InputMaybe<Ordering>;
  /** Order by creation timestamp */
  createdAt?: InputMaybe<Ordering>;
  /** Order by entity ID */
  id?: InputMaybe<Ordering>;
  /** Order by a specific property value (requires 'has_property' filter) */
  property?: InputMaybe<PropertyOrder>;
};

/** Pagination options for querying entities */
export type EntityPaginationInput = {
  /** Maximum number of items to return */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to skip */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Base interface for event categories/schemas */
export type EventCategory = {
  /** The name of the category as used in AGE (e.g. 'Cell', 'ROI') */
  ageName: Scalars['String']['output'];
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this category belongs to */
  graph: Graph;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Height for visualization (optional) */
  height?: Maybe<Scalars['Float']['output']>;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** An image representing this category, for visualization purposes */
  image: MediaStore;
  /** The graph this category belongs to */
  inputs: Array<EventRole>;
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  outputs: Array<EventRole>;
  /** The graph this category belongs to */
  pinned: Scalars['Boolean']['output'];
  /** X coordinate */
  positionX: Scalars['Float']['output'];
  /** Y coordinate */
  positionY: Scalars['Float']['output'];
  /** Z coordinate (optional) */
  positionZ?: Maybe<Scalars['Float']['output']>;
  /** List of property definitions for this entity category */
  propertyDefinitions: Array<PropertyDefinition>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant node queries that use this category as input */
  relevantNodeQueries: Array<NodeQuery>;
  /** List of relevant queries that use this category as input */
  relevantQueries: Array<GraphQuery>;
  /** List of tags associated with this category */
  tags: Array<CategoryTag>;
  /** Width for visualization (optional) */
  width?: Maybe<Scalars['Float']['output']>;
};


/** Base interface for event categories/schemas */
export type EventCategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
  ordering?: Array<CategoryTagOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Definition of an event type in the graph schema */
export type EventDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Input node roles */
  inputs?: Array<EventRoleInput>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** The kind of event */
  kind: EventKind;
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Output node roles */
  outputs?: Array<EventRoleInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

export enum EventKind {
  Extrinsic = 'EXTRINSIC',
  Intrinsic = 'INTRINSIC'
}

/** Input type for defining roles in an event category */
export type EventRole = {
  __typename?: 'EventRole';
  /** Optional filters to apply when linking entities to structures for this role */
  descriptor: EntityDescriptor;
  /** The label of the node participating in the event */
  key: Scalars['String']['output'];
  /** Ontology references for this role */
  ontologyReferences: Array<OntologyReference>;
  /** What type of role does this node play in the event */
  role: Scalars['String']['output'];
};

/** Input for creating a new natural event definition in the graph schema */
export type EventRoleInput = {
  /** Optional filters to apply when linking entities to structures for this role */
  descriptor: EntityDescriptorInput;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** Ontology references for this role */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** What type of role does this node play in the event */
  role: Scalars['String']['input'];
};

/** Base interface for graph schemas */
export type Graph = {
  __typename?: 'Graph';
  /** The name of the graph as used in AGE (e.g. 'CellGraph') */
  ageName: Scalars['String']['output'];
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** List of edge categories/schemas defined in this graph */
  edgeCategories: Array<EdgeCategory>;
  /** List of entity categories/schemas defined in this graph */
  entityCategories: Array<EntityCategory>;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** An image representing this graph, for visualization purposes */
  image: MediaStore;
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** List of materialized edges in the graph */
  materializedEdges: Array<MaterializedEdge>;
  /** List of measurement categories/schemas defined in this graph */
  measurementCategories: Array<MeasurementCategory>;
  /** List of metric categories/schemas defined in this graph */
  metricCategories: Array<MetricCategory>;
  /** Name of the graph */
  name: Scalars['String']['output'];
  /** List of natural event categories/schemas defined in this graph */
  naturalEventCategories: Array<NaturalEventCategory>;
  /** List of node categories/schemas defined in this graph */
  nodeCategories: Array<NodeCategory>;
  /** The graph this category belongs to */
  pinned: Scalars['Boolean']['output'];
  /** List of protocol event categories/schemas defined in this graph */
  protocolEventCategories: Array<ProtocolEventCategory>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of graph queries defined in this graph */
  queries: Array<GraphQuery>;
  /** List of relation categories/schemas defined in this graph */
  relationCategories: Array<RelationCategory>;
  /** List of structure categories/schemas defined in this graph */
  structureCategories: Array<StructureCategory>;
  /** List of structure relation categories/schemas defined in this graph */
  structureRelationCategories: Array<StructureRelationCategory>;
  /** List of tags associated with this category */
  tags: Array<Scalars['String']['output']>;
};


/** Base interface for graph schemas */
export type GraphEntityCategoriesArgs = {
  filters?: InputMaybe<EntityCategoryFilter>;
  ordering?: Array<EntityCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** Base interface for graph schemas */
export type GraphMaterializedEdgesArgs = {
  filters?: InputMaybe<MaterializedEdgeFilter>;
  ordering?: Array<MaterializedEdgeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** Base interface for graph schemas */
export type GraphMeasurementCategoriesArgs = {
  filters?: InputMaybe<MeasurementCategoryFilter>;
  ordering?: Array<MeasurementCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** Base interface for graph schemas */
export type GraphMetricCategoriesArgs = {
  filters?: InputMaybe<MetricCategoryFilter>;
  ordering?: Array<MetricCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** Base interface for graph schemas */
export type GraphNaturalEventCategoriesArgs = {
  filters?: InputMaybe<NaturalEventCategoryFilter>;
  ordering?: Array<NaturalEventCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** Base interface for graph schemas */
export type GraphProtocolEventCategoriesArgs = {
  filters?: InputMaybe<ProtocolEventCategoryFilter>;
  ordering?: Array<ProtocolEventCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** Base interface for graph schemas */
export type GraphRelationCategoriesArgs = {
  filters?: InputMaybe<RelationCategoryFilter>;
  ordering?: Array<RelationCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** Base interface for graph schemas */
export type GraphStructureCategoriesArgs = {
  filters?: InputMaybe<StructureCategoryFilter>;
  ordering?: Array<StructureCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** Base interface for graph schemas */
export type GraphStructureRelationCategoriesArgs = {
  filters?: InputMaybe<StructureRelationCategoryFilter>;
  ordering?: Array<StructureRelationCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Input for creating a new graph from a schema definition */
export type GraphDefinitionInput = {
  /** The graph extensions containing all type definitions */
  extensions: GraphExtensionsInput;
  /** Action-level allow/deny rules evaluated against request context */
  rules?: Array<ActionRuleInput>;
  /** Semantic version for this schema definition (e.g., '1.0.0') */
  systemVersion?: Scalars['String']['input'];
};

/** Input for creating a new graph from a schema definition */
export type GraphExtensionsInput = {
  /** Entity definitions */
  entities?: Array<EntityDefinitionInput>;
  /** Event definitions */
  events?: Array<EventDefinitionInput>;
  /** Graph table query definitions */
  graphTableQueries?: Array<GraphTableQueryInput>;
  /** Graph prefixes for namespacing */
  prefixes?: Array<PrefixInput>;
  /** Relation definitions */
  relations?: Array<RelationDefinitionInput>;
  /** Scatter plot definitions */
  scatterPlots?: Array<ScatterPlotInput>;
  /** Graph sequences for ordering entities */
  sequences?: Array<SequenceInput>;
};

/** Numeric/aggregatable fields of Graph */
export enum GraphField {
  CreatedAt = 'CREATED_AT'
}

export type GraphFilter = {
  AND?: InputMaybe<GraphFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<GraphFilter>;
  OR?: InputMaybe<GraphFilter>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of IDs */
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by list of IDs */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Base interface for graph schemas */
export type GraphNodesQuery = GraphQuery & {
  __typename?: 'GraphNodesQuery';
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The node category/schema to query */
  nodeCategory: NodeCategory;
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
};

export type GraphNodesQueryFilter = {
  AND?: InputMaybe<GraphNodesQueryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<GraphNodesQueryFilter>;
  OR?: InputMaybe<GraphNodesQueryFilter>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full-text search over label and description */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GraphNodesQueryOrder =
  { id: Ordering; label?: never; }
  |  { id?: never; label: Ordering; };

/** Result of linking a structure to an entity */
export type GraphNodesRender = {
  __typename?: 'GraphNodesRender';
  /** The graph rendered by this query */
  graph: Graph;
  /** The graph name used for this render */
  graphName: Scalars['String']['output'];
  /** The graph query used for this render */
  query: GraphNodesQuery;
};

export type GraphOrder =
  { id: Ordering; name?: never; }
  |  { id?: never; name: Ordering; };

/** Pagination options for graph queries */
export type GraphPaginationInput = {
  /** Maximum number of items to return */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to skip before starting to collect the result set */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Base interface for graph schemas */
export type GraphPairsQuery = GraphQuery & {
  __typename?: 'GraphPairsQuery';
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** Optional edge category/schema to filter pairs by */
  edgeCategory?: Maybe<EdgeCategory>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
  /** The source node category/schema to query */
  sourceCategory: NodeCategory;
  /** The target node category/schema to query */
  targetCategory: NodeCategory;
};

export type GraphPairsQueryFilter = {
  AND?: InputMaybe<GraphPairsQueryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<GraphPairsQueryFilter>;
  OR?: InputMaybe<GraphPairsQueryFilter>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full-text search over label and description */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GraphPairsQueryOrder =
  { id: Ordering; label?: never; }
  |  { id?: never; label: Ordering; };

/** Base interface for graph schemas */
export type GraphPathQuery = GraphQuery & {
  __typename?: 'GraphPathQuery';
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
};

/** Result of linking a structure to an entity */
export type GraphPathRender = {
  __typename?: 'GraphPathRender';
  /** The graph rendered by this query */
  graph: Graph;
  /** The graph name used for this render */
  graphName: Scalars['String']['output'];
  /** The graph query used for this render */
  query: GraphPathQuery;
};

/** Base interface for entity categories/schemas */
export type GraphQuery = {
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
};

export type GraphStats = {
  __typename?: 'GraphStats';
  /** Average value */
  avg?: Maybe<Scalars['Float']['output']>;
  /** Total number of items in the selection */
  count: Scalars['Int']['output'];
  /** Count of distinct values */
  distinctCount: Scalars['Int']['output'];
  /** Maximum value */
  max?: Maybe<Scalars['Float']['output']>;
  /** Minimum value */
  min?: Maybe<Scalars['Float']['output']>;
  /** Sum of values */
  sum?: Maybe<Scalars['Float']['output']>;
};


export type GraphStatsAvgArgs = {
  field: GraphField;
};


export type GraphStatsDistinctCountArgs = {
  field: GraphField;
};


export type GraphStatsMaxArgs = {
  field: GraphField;
};


export type GraphStatsMinArgs = {
  field: GraphField;
};


export type GraphStatsSumArgs = {
  field: GraphField;
};

/** Base interface for graph schemas */
export type GraphTableQuery = GraphQuery & Plottable & {
  __typename?: 'GraphTableQuery';
  /** If this graph was built using a builder function, the arguments used for building it, which can be used for debugging or rebuilding the graph with different parameters */
  builderArgs?: Maybe<BuilderArgs>;
  /** List of columns to return in the table query result */
  columns: Array<Column>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The Cypher query to execute for this table query */
  query: Scalars['CypherLiteral']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
};

export type GraphTableQueryFilter = {
  AND?: InputMaybe<GraphTableQueryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<GraphTableQueryFilter>;
  OR?: InputMaybe<GraphTableQueryFilter>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full-text search over label and description */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new graph from a schema definition */
export type GraphTableQueryInput = {
  /** Description of this graph query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique key for this graph query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** Human-readable name for this graph query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this graph query */
  query: Scalars['String']['input'];
};

export type GraphTableQueryOrder =
  { id: Ordering; label?: never; }
  |  { id?: never; label: Ordering; };

/** Result of linking a structure to an entity */
export type GraphTableRender = {
  __typename?: 'GraphTableRender';
  /** The graph rendered by this query */
  graph: Graph;
  /** The graph name used for this render */
  graphName: Scalars['String']['output'];
  /** The query used to generate this table */
  query: GraphTableQuery;
  /** Rows of the rendered table */
  rows: Array<Scalars['AnyScalar']['output']>;
};

/** A natural event category/schema definition */
export type InputParticipation = Edge & {
  __typename?: 'InputParticipation';
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for edge lookup */
  id: Scalars['String']['output'];
  /** The edge label/type */
  label: Scalars['String']['output'];
  /** The graph this node belongs to */
  role: Scalars['String']['output'];
  /** The graph this node belongs to */
  source: Entity;
  /** Global ID of the source/left node */
  sourceId: Scalars['String']['output'];
  /** The graph this node belongs to */
  target: NaturalEvent;
  /** Global ID of the target/right node */
  targetId: Scalars['String']['output'];
};

/** Input type for creating a new graph */
export type MatchPath = {
  __typename?: 'MatchPath';
  /** Color for the matched path as RGB values */
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** List of node IDs to match */
  nodes: Array<Scalars['String']['output']>;
  /** Whether the path match is optional */
  optional: Scalars['Boolean']['output'];
  /** List of booleans indicating the direction of each relationship in the path (True for outgoing, False for incoming) */
  relationDirections?: Maybe<Array<Scalars['Boolean']['output']>>;
  /** List of node IDs representing the path */
  relations: Array<Scalars['String']['output']>;
  /** Title for the matched path */
  title?: Maybe<Scalars['String']['output']>;
};

/** Input for a graph match path */
export type MatchPathInput = {
  /** Color for the matched path as RGB values */
  color?: InputMaybe<Array<Scalars['Float']['input']>>;
  /** List of node IDs to match */
  nodes: Array<Scalars['String']['input']>;
  /** Whether the path match is optional */
  optional?: Scalars['Boolean']['input'];
  /** List of booleans indicating the direction of each relationship in the path (True for outgoing, False for incoming) */
  relationDirections?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** List of node IDs representing the path */
  relations: Array<Scalars['String']['input']>;
  /** Title for the matched path */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** A materialized edge representing a relationship in the graph */
export type MaterializedEdge = {
  __typename?: 'MaterializedEdge';
  edge: EdgeCategory;
  graph: Graph;
  /** Database ID of the edge */
  id: Scalars['ID']['output'];
  source: NodeCategory;
  target: NodeCategory;
};

export type MaterializedEdgeFilter = {
  AND?: InputMaybe<MaterializedEdgeFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<MaterializedEdgeFilter>;
  OR?: InputMaybe<MaterializedEdgeFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full-text search over connected category labels */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type MaterializedEdgeOrder =
  { id: Ordering; };

/** A natural event category/schema definition */
export type Measurement = Edge & {
  __typename?: 'Measurement';
  /** The graph this node belongs to */
  category: MeasurementCategory;
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for edge lookup */
  id: Scalars['String']['output'];
  /** The edge label/type */
  label: Scalars['String']['output'];
  /** When this relation became valid according to the evidence */
  measuredFrom?: Maybe<Scalars['DateTime']['output']>;
  /** When this relation stopped being valid according to the evidence */
  measuredTo?: Maybe<Scalars['DateTime']['output']>;
  /** The graph this node belongs to */
  source: Structure;
  /** Global ID of the source/left node */
  sourceId: Scalars['String']['output'];
  /** The graph this node belongs to */
  target: Entity;
  /** Global ID of the target/right node */
  targetId: Scalars['String']['output'];
};

/** A measurement category/schema definition */
export type MeasurementCategory = Category & EdgeCategory & {
  __typename?: 'MeasurementCategory';
  /** The name of the category as used in AGE (e.g. 'Cell', 'ROI') */
  ageName: Scalars['String']['output'];
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this category belongs to */
  graph: Graph;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** An image representing this category, for visualization purposes */
  image: MediaStore;
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  materializableAs: Array<MaterializedEdge>;
  /** The graph this category belongs to */
  pinned: Scalars['Boolean']['output'];
  /** List of property definitions for this entity category */
  propertyDefinitions: Array<PropertyDefinition>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant queries that use this category as input */
  relevantEdgeQueries: Array<EdgeQuery>;
  /** List of relevant queries that use this category as input */
  relevantQueries: Array<GraphQuery>;
  /** The graph this category belongs to */
  sourceDescriptor: StructureDescriptor;
  /** List of tags associated with this category */
  tags: Array<CategoryTag>;
  /** The graph this category belongs to */
  targetDescriptor: EntityDescriptor;
};


/** A measurement category/schema definition */
export type MeasurementCategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
  ordering?: Array<CategoryTagOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Numeric/aggregatable fields of MeasurementCategory */
export enum MeasurementCategoryField {
  CreatedAt = 'CREATED_AT'
}

export type MeasurementCategoryFilter = {
  AND?: InputMaybe<MeasurementCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<MeasurementCategoryFilter>;
  OR?: InputMaybe<MeasurementCategoryFilter>;
  graph?: InputMaybe<GraphFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of IDs */
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by list of IDs */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type MeasurementCategoryOrder =
  { id: Ordering; label?: never; }
  |  { id?: never; label: Ordering; };

export type MeasurementCategoryStats = {
  __typename?: 'MeasurementCategoryStats';
  /** Average value */
  avg?: Maybe<Scalars['Float']['output']>;
  /** Total number of items in the selection */
  count: Scalars['Int']['output'];
  /** Count of distinct values */
  distinctCount: Scalars['Int']['output'];
  /** Maximum value */
  max?: Maybe<Scalars['Float']['output']>;
  /** Minimum value */
  min?: Maybe<Scalars['Float']['output']>;
  /** Sum of values */
  sum?: Maybe<Scalars['Float']['output']>;
};


export type MeasurementCategoryStatsAvgArgs = {
  field: MeasurementCategoryField;
};


export type MeasurementCategoryStatsDistinctCountArgs = {
  field: MeasurementCategoryField;
};


export type MeasurementCategoryStatsMaxArgs = {
  field: MeasurementCategoryField;
};


export type MeasurementCategoryStatsMinArgs = {
  field: MeasurementCategoryField;
};


export type MeasurementCategoryStatsSumArgs = {
  field: MeasurementCategoryField;
};

/** Filter options for querying measurements */
export type MeasurementFilter = {
  /** Filter measurements that have a specific property */
  hasProperty?: InputMaybe<Scalars['String']['input']>;
  /** Filter by specific measurement IDs */
  ids?: InputMaybe<Array<Scalars['GraphID']['input']>>;
  /** Filter measurements that match specific property conditions */
  matches?: InputMaybe<Array<PropertyMatch>>;
  /** Full-text search over measurement properties */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Ordering options for measurement queries */
export type MeasurementOrder = {
  /** Order by measurement category */
  category?: InputMaybe<Ordering>;
  /** Order by creation timestamp */
  createdAt?: InputMaybe<Ordering>;
  /** Order by measurement ID */
  id?: InputMaybe<Ordering>;
  /** Order by a specific property value */
  property?: InputMaybe<PropertyOrder>;
};

/** Pagination options for querying measurements */
export type MeasurementPaginationInput = {
  /** Maximum number of items to return */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to skip */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type MediaStore = {
  __typename?: 'MediaStore';
  bucket: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  path: Scalars['String']['output'];
  /** Get a presigned URL for the media store. This is used to access the media store directly from the frontend without going through the backend. The URL is valid for 1 hour. If a host is provided, it will replace the AWS_S3_ENDPOINT_URL in the generated URL. This is useful for accessing the media store through a custom domain or a proxy. */
  presignedUrl: Scalars['String']['output'];
};


export type MediaStorePresignedUrlArgs = {
  host?: InputMaybe<Scalars['String']['input']>;
};

/** A metric node representing computed values */
export type Metric = Node & {
  __typename?: 'Metric';
  /** The source entity of this relation */
  category: MetricCategory;
  /** Category ID linking to MetricCategory model */
  categoryId?: Maybe<Scalars['String']['output']>;
  /** External ID if set */
  externalId?: Maybe<Scalars['String']['output']>;
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** The graph this node belongs to */
  graph: Graph;
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for node lookup */
  id: Scalars['String']['output'];
  /** The AGE graph label as recently materialized (e.g. 'Cell IAC100', 'ROI 1') */
  label: Scalars['String']['output'];
  /** Local ID if set */
  localId?: Maybe<Scalars['String']['output']>;
  /** Tags associated with this node */
  tags: Array<Scalars['String']['output']>;
  /** The metric value */
  value: Scalars['AnyScalar']['output'];
};

/** A metric category/schema definition */
export type MetricCategory = Category & NodeCategory & {
  __typename?: 'MetricCategory';
  /** The name of the category as used in AGE (e.g. 'Cell', 'ROI') */
  ageName: Scalars['String']['output'];
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this category belongs to */
  graph: Graph;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Height for visualization (optional) */
  height?: Maybe<Scalars['Float']['output']>;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** An image representing this category, for visualization purposes */
  image: MediaStore;
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  pinned: Scalars['Boolean']['output'];
  /** X coordinate */
  positionX: Scalars['Float']['output'];
  /** Y coordinate */
  positionY: Scalars['Float']['output'];
  /** Z coordinate (optional) */
  positionZ?: Maybe<Scalars['Float']['output']>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant node queries that use this category as input */
  relevantNodeQueries: Array<NodeQuery>;
  /** List of relevant queries that use this category as input */
  relevantQueries: Array<GraphQuery>;
  /** The structure category/schema this metric is relevant for, if applicable */
  structureCategory: StructureCategory;
  /** List of tags associated with this category */
  tags: Array<CategoryTag>;
  /** What type of value, (taking from the universe) 'QUANTITATIVE', 'QUALITATIVE', 'BOOLEAN' */
  valueKind: ValueKind;
  /** Width for visualization (optional) */
  width?: Maybe<Scalars['Float']['output']>;
};


/** A metric category/schema definition */
export type MetricCategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
  ordering?: Array<CategoryTagOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Numeric/aggregatable fields of MetricCategory */
export enum MetricCategoryField {
  CreatedAt = 'CREATED_AT'
}

export type MetricCategoryFilter = {
  AND?: InputMaybe<MetricCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<MetricCategoryFilter>;
  OR?: InputMaybe<MetricCategoryFilter>;
  graph?: InputMaybe<GraphFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of IDs */
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by list of IDs */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of IDs */
  valueKind?: InputMaybe<ValueKind>;
};

export type MetricCategoryOrder =
  { id: Ordering; instanceKind?: never; label?: never; }
  |  { id?: never; instanceKind: Ordering; label?: never; }
  |  { id?: never; instanceKind?: never; label: Ordering; };

export type MetricCategoryStats = {
  __typename?: 'MetricCategoryStats';
  /** Average value */
  avg?: Maybe<Scalars['Float']['output']>;
  /** Total number of items in the selection */
  count: Scalars['Int']['output'];
  /** Count of distinct values */
  distinctCount: Scalars['Int']['output'];
  /** Maximum value */
  max?: Maybe<Scalars['Float']['output']>;
  /** Minimum value */
  min?: Maybe<Scalars['Float']['output']>;
  /** Sum of values */
  sum?: Maybe<Scalars['Float']['output']>;
};


export type MetricCategoryStatsAvgArgs = {
  field: MetricCategoryField;
};


export type MetricCategoryStatsDistinctCountArgs = {
  field: MetricCategoryField;
};


export type MetricCategoryStatsMaxArgs = {
  field: MetricCategoryField;
};


export type MetricCategoryStatsMinArgs = {
  field: MetricCategoryField;
};


export type MetricCategoryStatsSumArgs = {
  field: MetricCategoryField;
};

/** Filter options for querying metrics */
export type MetricFilter = {
  /** Filter metrics that have a specific property */
  hasProperty?: InputMaybe<Scalars['String']['input']>;
  /** Filter by specific metric IDs */
  ids?: InputMaybe<Array<Scalars['GraphID']['input']>>;
  /** Filter metrics that match specific property conditions */
  matches?: InputMaybe<Array<PropertyMatch>>;
  /** Full-text search over metric properties */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new natural event definition in the graph schema */
export type MetricInput = {
  key: Scalars['String']['input'];
  value: Scalars['AnyScalar']['input'];
};

/** Ordering options for metric queries */
export type MetricOrder = {
  /** Order by metric category */
  category?: InputMaybe<Ordering>;
  /** Order by creation timestamp */
  createdAt?: InputMaybe<Ordering>;
  /** Order by metric ID */
  id?: InputMaybe<Ordering>;
  /** Order by a specific property value */
  property?: InputMaybe<PropertyOrder>;
};

/** Pagination options for querying metrics */
export type MetricPaginationInput = {
  /** Maximum number of items to return */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to skip */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Graph Engine Mutations */
export type Mutation = {
  __typename?: 'Mutation';
  /** Archive an existing category tag in the graph */
  archiveCategoryTag: CategoryTag;
  /** Archive an edge pairs query */
  archiveEdgePairsQuery: Scalars['ID']['output'];
  /** Archive an edge path query */
  archiveEdgePathQuery: Scalars['ID']['output'];
  /** Archive an edge table query */
  archiveEdgeTableQuery: Scalars['ID']['output'];
  /** Archive an entity in the graph (soft delete) */
  archiveEntity: Entity;
  /** Archive a graph in the graph engine (soft delete) */
  archiveGraph: Graph;
  /** Archive a graph pairs query */
  archiveGraphPairsQuery: Scalars['ID']['output'];
  /** Archive a graph path query */
  archiveGraphPathQuery: Scalars['ID']['output'];
  /** Archive a graph table query */
  archiveGraphTableQuery: Scalars['ID']['output'];
  /** Archive a measurement in the graph (soft delete) */
  archiveMeasurement: Measurement;
  /** Archive a metric in the graph (soft delete) */
  archiveMetric: Metric;
  /** Archive a natural event in the graph (soft delete) */
  archiveNaturalEvent: NaturalEvent;
  /** Archive a node pairs query */
  archiveNodePairsQuery: Scalars['ID']['output'];
  /** Archive a node path query */
  archiveNodePathQuery: Scalars['ID']['output'];
  /** Archive a node table query */
  archiveNodeTableQuery: Scalars['ID']['output'];
  /** Archive a protocol event in the graph (soft delete) */
  archiveProtocolEvent: ProtocolEvent;
  /** Archive a relation in the graph (soft delete) */
  archiveRelation: Relation;
  /** Archive a scatter plot */
  archiveScatterPlot: Scalars['ID']['output'];
  /** Archive a structure in the graph (soft delete) */
  archiveStructure: Structure;
  /** Archive a structure relation in the graph (soft delete) */
  archiveStructureRelation: StructureRelation;
  /** Create a new category tag in the graph */
  createCategoryTag: CategoryTag;
  /** Create an edge pairs query */
  createEdgePairsQuery: EdgePairsQuery;
  /** Create an edge path query */
  createEdgePathQuery: EdgePathQuery;
  /** Create an edge table query */
  createEdgeTableQuery: EdgeTableQuery;
  /** Create a new entity in the graph */
  createEntity: Entity;
  /** Create a new entity category/schema in the graph */
  createEntityCategory: EntityCategory;
  /** Create a new graph in the graph engine */
  createGraph: Graph;
  /** Create a graph pairs query */
  createGraphPairsQuery: GraphPairsQuery;
  /** Create a graph path query */
  createGraphPathQuery: GraphPathQuery;
  /** Create a graph table query */
  createGraphTableQuery: GraphTableQuery;
  /** Create or update a graph table query using builder arguments */
  createGraphTableQueryThroughBuilder: GraphTableQuery;
  /** Create a new measurement in the graph */
  createMeasurement: Measurement;
  /** Create a new measurement category/schema in the graph */
  createMeasurementCategory: MeasurementCategory;
  /** Create a new metric in the graph */
  createMetric: Metric;
  /** Create a new metric category/schema in the graph */
  createMetricCategory: MetricCategory;
  /** Create a new natural event in the graph */
  createNaturalEvent: NaturalEvent;
  /** Create a new natural event category/schema in the graph */
  createNaturalEventCategory: NaturalEventCategory;
  /** Create a node pairs query */
  createNodePairsQuery: NodePairsQuery;
  /** Create a node path query */
  createNodePathQuery: NodePathQuery;
  /** Create a node table query */
  createNodeTableQuery: NodeTableQuery;
  /** Create a new protocol event in the graph */
  createProtocolEvent: ProtocolEvent;
  /** Create a new protocol event category/schema in the graph */
  createProtocolEventCategory: ProtocolEventCategory;
  /** Create a new relation in the graph */
  createRelation: Relation;
  /** Create a new relation category/schema in the graph */
  createRelationCategory: RelationCategory;
  /** Create a scatter plot */
  createScatterPlot: ScatterPlot;
  /** Create a new structure in the graph */
  createStructure: Structure;
  /** Create a new structure category/schema in the graph */
  createStructureCategory: StructureCategory;
  /** Create a new structure relation in the graph */
  createStructureRelation: StructureRelation;
  /** Create a new structure relation category/schema in the graph */
  createStructureRelationCategory: StructureRelationCategory;
  /** Delete an existing category tag from the graph */
  deleteCategoryTag: Scalars['ID']['output'];
  /** Delete an edge pairs query */
  deleteEdgePairsQuery: Scalars['ID']['output'];
  /** Delete an edge path query */
  deleteEdgePathQuery: Scalars['ID']['output'];
  /** Delete an edge table query */
  deleteEdgeTableQuery: Scalars['ID']['output'];
  /** Delete an entity from the graph */
  deleteEntity: Scalars['GraphID']['output'];
  /** Delete an entity category/schema from the graph */
  deleteEntityCategory: Scalars['ID']['output'];
  /** Delete a graph from the graph engine */
  deleteGraph: Scalars['ID']['output'];
  /** Delete a graph pairs query */
  deleteGraphPairsQuery: Scalars['ID']['output'];
  /** Delete a graph path query */
  deleteGraphPathQuery: Scalars['ID']['output'];
  /** Delete a graph table query */
  deleteGraphTableQuery: Scalars['ID']['output'];
  /** Delete a measurement from the graph */
  deleteMeasurement: Scalars['GraphID']['output'];
  /** Delete a measurement category/schema from the graph */
  deleteMeasurementCategory: Scalars['ID']['output'];
  /** Delete a metric from the graph */
  deleteMetric: Scalars['GraphID']['output'];
  /** Delete a metric category/schema from the graph */
  deleteMetricCategory: Scalars['ID']['output'];
  /** Delete a natural event from the graph */
  deleteNaturalEvent: Scalars['GraphID']['output'];
  /** Delete a natural event category/schema from the graph */
  deleteNaturalEventCategory: Scalars['ID']['output'];
  /** Delete a node pairs query */
  deleteNodePairsQuery: Scalars['ID']['output'];
  /** Delete a node path query */
  deleteNodePathQuery: Scalars['ID']['output'];
  /** Delete a node table query */
  deleteNodeTableQuery: Scalars['ID']['output'];
  /** Delete a protocol event from the graph */
  deleteProtocolEvent: Scalars['GraphID']['output'];
  /** Delete a protocol event category/schema from the graph */
  deleteProtocolEventCategory: Scalars['ID']['output'];
  /** Delete a relation from the graph */
  deleteRelation: Scalars['GraphID']['output'];
  /** Delete a relation category/schema from the graph */
  deleteRelationCategory: Scalars['ID']['output'];
  /** Delete a scatter plot */
  deleteScatterPlot: Scalars['ID']['output'];
  /** Delete a structure from the graph */
  deleteStructure: Scalars['GraphID']['output'];
  /** Delete a structure category/schema from the graph */
  deleteStructureCategory: Scalars['ID']['output'];
  /** Delete a structure relation from the graph */
  deleteStructureRelation: Scalars['GraphID']['output'];
  /** Delete a structure relation category/schema from the graph */
  deleteStructureRelationCategory: Scalars['ID']['output'];
  /** Ensure a structure exists in the graph, creating it if it does not exist */
  ensureStructure: Structure;
  /** Pin a node in the UI for a user */
  pinNode: Node;
  /** Record a metric, auto-creating structure when allowed */
  recordMetric: Metric;
  /** Upload media and return a URL for access */
  requestMediaUpload: PresignedPostCredentials;
  /** Update an existing category tag in the graph */
  updateCategoryTag: CategoryTag;
  /** Update an edge pairs query */
  updateEdgePairsQuery: EdgePairsQuery;
  /** Update an edge path query */
  updateEdgePathQuery: EdgePathQuery;
  /** Update an edge table query */
  updateEdgeTableQuery: EdgeTableQuery;
  /** Update an existing entity in the graph */
  updateEntity: Entity;
  /** Update an existing entity category/schema in the graph */
  updateEntityCategory: EntityCategory;
  /** Update an existing graph in the graph engine */
  updateGraph: Graph;
  /** Update a graph pairs query */
  updateGraphPairsQuery: GraphPairsQuery;
  /** Update a graph path query */
  updateGraphPathQuery: GraphPathQuery;
  /** Update a graph table query */
  updateGraphTableQuery: GraphTableQuery;
  /** Update an existing measurement in the graph */
  updateMeasurement: Measurement;
  /** Update an existing measurement category/schema in the graph */
  updateMeasurementCategory: MeasurementCategory;
  /** Update an existing metric in the graph */
  updateMetric: Metric;
  /** Update an existing metric category/schema in the graph */
  updateMetricCategory: MetricCategory;
  /** Update an existing natural event in the graph */
  updateNaturalEvent: NaturalEvent;
  /** Update an existing natural event category/schema in the graph */
  updateNaturalEventCategory: NaturalEventCategory;
  /** Update a node pairs query */
  updateNodePairsQuery: NodePairsQuery;
  /** Update a node path query */
  updateNodePathQuery: NodePathQuery;
  /** Update a node table query */
  updateNodeTableQuery: NodeTableQuery;
  /** Update an existing protocol event in the graph */
  updateProtocolEvent: ProtocolEvent;
  /** Update an existing protocol event category/schema in the graph */
  updateProtocolEventCategory: ProtocolEventCategory;
  /** Update an existing relation in the graph */
  updateRelation: Relation;
  /** Update an existing relation category/schema in the graph */
  updateRelationCategory: RelationCategory;
  /** Update a scatter plot */
  updateScatterPlot: ScatterPlot;
  /** Update an existing structure in the graph */
  updateStructure: Structure;
  /** Update an existing structure category/schema in the graph */
  updateStructureCategory: StructureCategory;
  /** Update an existing structure relation in the graph */
  updateStructureRelation: StructureRelation;
  /** Update an existing structure relation category/schema in the graph */
  updateStructureRelationCategory: StructureRelationCategory;
};


/** Graph Engine Mutations */
export type MutationArchiveCategoryTagArgs = {
  input: ArchiveCategoryTagInput;
};


/** Graph Engine Mutations */
export type MutationArchiveEdgePairsQueryArgs = {
  input: ArchiveEdgePairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationArchiveEdgePathQueryArgs = {
  input: ArchiveEdgePathQueryInput;
};


/** Graph Engine Mutations */
export type MutationArchiveEdgeTableQueryArgs = {
  input: ArchiveEdgeTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationArchiveEntityArgs = {
  input: ArchiveEntityInput;
};


/** Graph Engine Mutations */
export type MutationArchiveGraphArgs = {
  input: ArchiveGraphInput;
};


/** Graph Engine Mutations */
export type MutationArchiveGraphPairsQueryArgs = {
  input: ArchiveGraphPairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationArchiveGraphPathQueryArgs = {
  input: ArchiveGraphPathQueryInput;
};


/** Graph Engine Mutations */
export type MutationArchiveGraphTableQueryArgs = {
  input: ArchiveGraphTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationArchiveMeasurementArgs = {
  input: ArchiveMeasurementInput;
};


/** Graph Engine Mutations */
export type MutationArchiveMetricArgs = {
  input: ArchiveMetricInput;
};


/** Graph Engine Mutations */
export type MutationArchiveNaturalEventArgs = {
  input: ArchiveNaturalEventInput;
};


/** Graph Engine Mutations */
export type MutationArchiveNodePairsQueryArgs = {
  input: ArchiveNodePairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationArchiveNodePathQueryArgs = {
  input: ArchiveNodePathQueryInput;
};


/** Graph Engine Mutations */
export type MutationArchiveNodeTableQueryArgs = {
  input: ArchiveNodeTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationArchiveProtocolEventArgs = {
  input: ArchiveProtocolEventInput;
};


/** Graph Engine Mutations */
export type MutationArchiveRelationArgs = {
  input: ArchiveRelationInput;
};


/** Graph Engine Mutations */
export type MutationArchiveScatterPlotArgs = {
  input: ArchiveScatterPlotInput;
};


/** Graph Engine Mutations */
export type MutationArchiveStructureArgs = {
  input: ArchiveStructureInput;
};


/** Graph Engine Mutations */
export type MutationArchiveStructureRelationArgs = {
  input: ArchiveStructureRelationInput;
};


/** Graph Engine Mutations */
export type MutationCreateCategoryTagArgs = {
  input: CreateCategoryTagInput;
};


/** Graph Engine Mutations */
export type MutationCreateEdgePairsQueryArgs = {
  input: CreateEdgePairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationCreateEdgePathQueryArgs = {
  input: CreateEdgePathQueryInput;
};


/** Graph Engine Mutations */
export type MutationCreateEdgeTableQueryArgs = {
  input: CreateEdgeTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationCreateEntityArgs = {
  input: CreateEntityInput;
};


/** Graph Engine Mutations */
export type MutationCreateEntityCategoryArgs = {
  input: CreateEntityDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationCreateGraphArgs = {
  input: CreateGraphInput;
};


/** Graph Engine Mutations */
export type MutationCreateGraphPairsQueryArgs = {
  input: CreateGraphPairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationCreateGraphPathQueryArgs = {
  input: CreateGraphPathQueryInput;
};


/** Graph Engine Mutations */
export type MutationCreateGraphTableQueryArgs = {
  input: CreateGraphTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationCreateGraphTableQueryThroughBuilderArgs = {
  input: CreateGraphTableQueryThroughBuilderInput;
};


/** Graph Engine Mutations */
export type MutationCreateMeasurementArgs = {
  input: CreateMeasurementInput;
};


/** Graph Engine Mutations */
export type MutationCreateMeasurementCategoryArgs = {
  input: CreateMeasurementDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationCreateMetricArgs = {
  input: CreateMetricInput;
};


/** Graph Engine Mutations */
export type MutationCreateMetricCategoryArgs = {
  input: CreateMetricDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationCreateNaturalEventArgs = {
  input: CreateNaturalEventInput;
};


/** Graph Engine Mutations */
export type MutationCreateNaturalEventCategoryArgs = {
  input: CreateNaturalEventDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationCreateNodePairsQueryArgs = {
  input: CreateNodePairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationCreateNodePathQueryArgs = {
  input: CreateNodePathQueryInput;
};


/** Graph Engine Mutations */
export type MutationCreateNodeTableQueryArgs = {
  input: CreateNodeTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationCreateProtocolEventArgs = {
  input: CreateProtocolEventInput;
};


/** Graph Engine Mutations */
export type MutationCreateProtocolEventCategoryArgs = {
  input: CreateProtocolEventDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationCreateRelationArgs = {
  input: CreateRelationInput;
};


/** Graph Engine Mutations */
export type MutationCreateRelationCategoryArgs = {
  input: CreateRelationDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationCreateScatterPlotArgs = {
  input: CreateScatterPlotInput;
};


/** Graph Engine Mutations */
export type MutationCreateStructureArgs = {
  input: CreateStructureInput;
};


/** Graph Engine Mutations */
export type MutationCreateStructureCategoryArgs = {
  input: CreateStructureDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationCreateStructureRelationArgs = {
  input: CreateStructureRelationInput;
};


/** Graph Engine Mutations */
export type MutationCreateStructureRelationCategoryArgs = {
  input: CreateStructureRelationDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationDeleteCategoryTagArgs = {
  input: DeleteCategoryTagInput;
};


/** Graph Engine Mutations */
export type MutationDeleteEdgePairsQueryArgs = {
  input: DeleteEdgePairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationDeleteEdgePathQueryArgs = {
  input: DeleteEdgePathQueryInput;
};


/** Graph Engine Mutations */
export type MutationDeleteEdgeTableQueryArgs = {
  input: DeleteEdgeTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationDeleteEntityArgs = {
  input: DeleteEntityInput;
};


/** Graph Engine Mutations */
export type MutationDeleteEntityCategoryArgs = {
  input: DeleteEntityDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationDeleteGraphArgs = {
  input: DeleteGraphInput;
};


/** Graph Engine Mutations */
export type MutationDeleteGraphPairsQueryArgs = {
  input: DeleteGraphPairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationDeleteGraphPathQueryArgs = {
  input: DeleteGraphPathQueryInput;
};


/** Graph Engine Mutations */
export type MutationDeleteGraphTableQueryArgs = {
  input: DeleteGraphTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationDeleteMeasurementArgs = {
  input: DeleteMeasurementInput;
};


/** Graph Engine Mutations */
export type MutationDeleteMeasurementCategoryArgs = {
  input: DeleteMeasurementDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationDeleteMetricArgs = {
  input: DeleteMetricInput;
};


/** Graph Engine Mutations */
export type MutationDeleteMetricCategoryArgs = {
  input: DeleteMetricDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationDeleteNaturalEventArgs = {
  input: DeleteNaturalEventInput;
};


/** Graph Engine Mutations */
export type MutationDeleteNaturalEventCategoryArgs = {
  input: DeleteNaturalEventDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationDeleteNodePairsQueryArgs = {
  input: DeleteNodePairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationDeleteNodePathQueryArgs = {
  input: DeleteNodePathQueryInput;
};


/** Graph Engine Mutations */
export type MutationDeleteNodeTableQueryArgs = {
  input: DeleteNodeTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationDeleteProtocolEventArgs = {
  input: DeleteProtocolEventInput;
};


/** Graph Engine Mutations */
export type MutationDeleteProtocolEventCategoryArgs = {
  input: DeleteProtocolEventDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationDeleteRelationArgs = {
  input: DeleteRelationInput;
};


/** Graph Engine Mutations */
export type MutationDeleteRelationCategoryArgs = {
  input: DeleteRelationDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationDeleteScatterPlotArgs = {
  input: DeleteScatterPlotInput;
};


/** Graph Engine Mutations */
export type MutationDeleteStructureArgs = {
  input: DeleteStructureInput;
};


/** Graph Engine Mutations */
export type MutationDeleteStructureCategoryArgs = {
  input: DeleteStructureDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationDeleteStructureRelationArgs = {
  input: DeleteStructureRelationInput;
};


/** Graph Engine Mutations */
export type MutationDeleteStructureRelationCategoryArgs = {
  input: DeleteStructureRelationDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationEnsureStructureArgs = {
  input: EnsureStructureInput;
};


/** Graph Engine Mutations */
export type MutationPinNodeArgs = {
  input: PinNodeInput;
};


/** Graph Engine Mutations */
export type MutationRecordMetricArgs = {
  input: RecordMetricInput;
};


/** Graph Engine Mutations */
export type MutationRequestMediaUploadArgs = {
  input: RequestMediaUploadInput;
};


/** Graph Engine Mutations */
export type MutationUpdateCategoryTagArgs = {
  input: UpdateCategoryTagInput;
};


/** Graph Engine Mutations */
export type MutationUpdateEdgePairsQueryArgs = {
  input: UpdateEdgePairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationUpdateEdgePathQueryArgs = {
  input: UpdateEdgePathQueryInput;
};


/** Graph Engine Mutations */
export type MutationUpdateEdgeTableQueryArgs = {
  input: UpdateEdgeTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationUpdateEntityArgs = {
  input: UpdateEntityInput;
};


/** Graph Engine Mutations */
export type MutationUpdateEntityCategoryArgs = {
  input: UpdateEntityDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationUpdateGraphArgs = {
  input: UpdateGraphInput;
};


/** Graph Engine Mutations */
export type MutationUpdateGraphPairsQueryArgs = {
  input: UpdateGraphPairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationUpdateGraphPathQueryArgs = {
  input: UpdateGraphPathQueryInput;
};


/** Graph Engine Mutations */
export type MutationUpdateGraphTableQueryArgs = {
  input: UpdateGraphTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationUpdateMeasurementArgs = {
  input: UpdateMeasurementInput;
};


/** Graph Engine Mutations */
export type MutationUpdateMeasurementCategoryArgs = {
  input: UpdateMeasurementDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationUpdateMetricArgs = {
  input: UpdateMetricInput;
};


/** Graph Engine Mutations */
export type MutationUpdateMetricCategoryArgs = {
  input: UpdateMetricDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationUpdateNaturalEventArgs = {
  input: UpdateNaturalEventInput;
};


/** Graph Engine Mutations */
export type MutationUpdateNaturalEventCategoryArgs = {
  input: UpdateNaturalEventDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationUpdateNodePairsQueryArgs = {
  input: UpdateNodePairsQueryInput;
};


/** Graph Engine Mutations */
export type MutationUpdateNodePathQueryArgs = {
  input: UpdateNodePathQueryInput;
};


/** Graph Engine Mutations */
export type MutationUpdateNodeTableQueryArgs = {
  input: UpdateNodeTableQueryInput;
};


/** Graph Engine Mutations */
export type MutationUpdateProtocolEventArgs = {
  input: UpdateProtocolEventInput;
};


/** Graph Engine Mutations */
export type MutationUpdateProtocolEventCategoryArgs = {
  input: UpdateProtocolEventDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationUpdateRelationArgs = {
  input: UpdateRelationInput;
};


/** Graph Engine Mutations */
export type MutationUpdateRelationCategoryArgs = {
  input: UpdateRelationDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationUpdateScatterPlotArgs = {
  input: UpdateScatterPlotInput;
};


/** Graph Engine Mutations */
export type MutationUpdateStructureArgs = {
  input: UpdateStructureInput;
};


/** Graph Engine Mutations */
export type MutationUpdateStructureCategoryArgs = {
  input: UpdateStructureDefinitionInput;
};


/** Graph Engine Mutations */
export type MutationUpdateStructureRelationArgs = {
  input: UpdateStructureRelationInput;
};


/** Graph Engine Mutations */
export type MutationUpdateStructureRelationCategoryArgs = {
  input: UpdateStructureRelationDefinitionInput;
};

/** A natural event in the knowledge graph */
export type NaturalEvent = Node & VersionedNode & {
  __typename?: 'NaturalEvent';
  /** The source entity of this relation */
  category: NaturalEventCategory;
  /** Category ID linking to NaturalEventCategory model */
  categoryId?: Maybe<Scalars['String']['output']>;
  /** External ID if set */
  externalId?: Maybe<Scalars['String']['output']>;
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** The graph this node belongs to */
  graph: Graph;
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for node lookup */
  id: Scalars['String']['output'];
  /** The event type/kind */
  kind: Scalars['String']['output'];
  /** The AGE graph label as recently materialized (e.g. 'Cell IAC100', 'ROI 1') */
  label: Scalars['String']['output'];
  /** Timestamp when properties were last derived (unix ms) */
  lastDerived?: Maybe<Scalars['UnixMilliseconds']['output']>;
  /** External object ID this entity references */
  lifecycle?: Maybe<Scalars['String']['output']>;
  /** Local ID if set */
  localId?: Maybe<Scalars['String']['output']>;
  /** List of the current derived properties for this event */
  measuredFrom: Scalars['DateTime']['output'];
  /** The source entity of this relation */
  measuredTo: Scalars['DateTime']['output'];
  /** List of the current derived properties for this entity */
  properties: Scalars['AnyScalar']['output'];
  /** List of properties derived for this entity */
  richProperties: Array<RichProperty>;
  /** Schema version used to derive properties */
  schemaVersion: Scalars['String']['output'];
  /** Tags associated with this node */
  tags: Array<Scalars['String']['output']>;
};

/** A relation category/schema definition */
export type NaturalEventCategory = Category & EventCategory & NodeCategory & {
  __typename?: 'NaturalEventCategory';
  /** The name of the category as used in AGE (e.g. 'Cell', 'ROI') */
  ageName: Scalars['String']['output'];
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this category belongs to */
  graph: Graph;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Height for visualization (optional) */
  height?: Maybe<Scalars['Float']['output']>;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** An image representing this category, for visualization purposes */
  image: MediaStore;
  /** The graph this category belongs to */
  inputs: Array<EventRole>;
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  outputs: Array<EventRole>;
  /** The graph this category belongs to */
  pinned: Scalars['Boolean']['output'];
  /** X coordinate */
  positionX: Scalars['Float']['output'];
  /** Y coordinate */
  positionY: Scalars['Float']['output'];
  /** Z coordinate (optional) */
  positionZ?: Maybe<Scalars['Float']['output']>;
  /** List of property definitions for this entity category */
  propertyDefinitions: Array<PropertyDefinition>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant node queries that use this category as input */
  relevantNodeQueries: Array<NodeQuery>;
  /** List of relevant queries that use this category as input */
  relevantQueries: Array<GraphQuery>;
  /** List of tags associated with this category */
  tags: Array<CategoryTag>;
  /** Width for visualization (optional) */
  width?: Maybe<Scalars['Float']['output']>;
};


/** A relation category/schema definition */
export type NaturalEventCategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
  ordering?: Array<CategoryTagOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Numeric/aggregatable fields of NaturalEventCategory */
export enum NaturalEventCategoryField {
  CreatedAt = 'CREATED_AT'
}

export type NaturalEventCategoryFilter = {
  AND?: InputMaybe<NaturalEventCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<NaturalEventCategoryFilter>;
  OR?: InputMaybe<NaturalEventCategoryFilter>;
  graph?: InputMaybe<GraphFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of IDs */
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by list of IDs */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type NaturalEventCategoryOrder =
  { id: Ordering; instanceKind?: never; label?: never; }
  |  { id?: never; instanceKind: Ordering; label?: never; }
  |  { id?: never; instanceKind?: never; label: Ordering; };

export type NaturalEventCategoryStats = {
  __typename?: 'NaturalEventCategoryStats';
  /** Average value */
  avg?: Maybe<Scalars['Float']['output']>;
  /** Total number of items in the selection */
  count: Scalars['Int']['output'];
  /** Count of distinct values */
  distinctCount: Scalars['Int']['output'];
  /** Maximum value */
  max?: Maybe<Scalars['Float']['output']>;
  /** Minimum value */
  min?: Maybe<Scalars['Float']['output']>;
  /** Sum of values */
  sum?: Maybe<Scalars['Float']['output']>;
};


export type NaturalEventCategoryStatsAvgArgs = {
  field: NaturalEventCategoryField;
};


export type NaturalEventCategoryStatsDistinctCountArgs = {
  field: NaturalEventCategoryField;
};


export type NaturalEventCategoryStatsMaxArgs = {
  field: NaturalEventCategoryField;
};


export type NaturalEventCategoryStatsMinArgs = {
  field: NaturalEventCategoryField;
};


export type NaturalEventCategoryStatsSumArgs = {
  field: NaturalEventCategoryField;
};

/** Filter options for querying natural events */
export type NaturalEventFilter = {
  /** Filter natural events that have a specific property */
  hasProperty?: InputMaybe<Scalars['String']['input']>;
  /** Filter by specific natural event IDs */
  ids?: InputMaybe<Array<Scalars['GraphID']['input']>>;
  /** Filter natural events that match specific property conditions */
  matches?: InputMaybe<Array<PropertyMatch>>;
  /** Full-text search over natural event properties */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Ordering options for natural event queries */
export type NaturalEventOrder = {
  /** Order by natural event category */
  category?: InputMaybe<Ordering>;
  /** Order by creation timestamp */
  createdAt?: InputMaybe<Ordering>;
  /** Order by natural event ID */
  id?: InputMaybe<Ordering>;
  /** Order by a specific property value */
  property?: InputMaybe<PropertyOrder>;
};

/** Pagination options for querying natural events */
export type NaturalEventPaginationInput = {
  /** Maximum number of items to return */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to skip */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Base interface for all graph nodes */
export type Node = {
  /** External ID if set */
  externalId?: Maybe<Scalars['String']['output']>;
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** The graph this node belongs to */
  graph: Graph;
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for node lookup */
  id: Scalars['String']['output'];
  /** The AGE graph label as recently materialized (e.g. 'Cell IAC100', 'ROI 1') */
  label: Scalars['String']['output'];
  /** Local ID if set */
  localId?: Maybe<Scalars['String']['output']>;
  /** Tags associated with this node */
  tags: Array<Scalars['String']['output']>;
};

/** Base interface for graph schemas */
export type NodeCategory = {
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Height for visualization (optional) */
  height?: Maybe<Scalars['Float']['output']>;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** X coordinate */
  positionX: Scalars['Float']['output'];
  /** Y coordinate */
  positionY: Scalars['Float']['output'];
  /** Z coordinate (optional) */
  positionZ?: Maybe<Scalars['Float']['output']>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant node queries that use this category as input */
  relevantNodeQueries: Array<NodeQuery>;
  /** Width for visualization (optional) */
  width?: Maybe<Scalars['Float']['output']>;
};

/** Base interface for graph schemas */
export type NodePairsQuery = NodeQuery & {
  __typename?: 'NodePairsQuery';
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** Optional edge category/schema to filter pairs by */
  edgeCategory?: Maybe<EdgeCategory>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
  /** The source node category/schema to query */
  sourceCategory: NodeCategory;
  /** The target node category/schema to query */
  targetCategory: NodeCategory;
};

export type NodePairsQueryFilter = {
  AND?: InputMaybe<NodePairsQueryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<NodePairsQueryFilter>;
  OR?: InputMaybe<NodePairsQueryFilter>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full-text search over label and description */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type NodePairsQueryOrder =
  { id: Ordering; label?: never; }
  |  { id?: never; label: Ordering; };

/** Base interface for graph schemas */
export type NodePathQuery = NodeQuery & {
  __typename?: 'NodePathQuery';
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
};

export type NodePathQueryFilter = {
  AND?: InputMaybe<NodePathQueryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<NodePathQueryFilter>;
  OR?: InputMaybe<NodePathQueryFilter>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full-text search over label and description */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type NodePathQueryOrder =
  { id: Ordering; label?: never; }
  |  { id?: never; label: Ordering; };

/** Base interface for entity categories/schemas */
export type NodeQuery = {
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
};

/** Base interface for graph schemas */
export type NodeTableQuery = NodeQuery & Plottable & {
  __typename?: 'NodeTableQuery';
  /** If this graph was built using a builder function, the arguments used for building it, which can be used for debugging or rebuilding the graph with different parameters */
  builderArgs?: Maybe<BuilderArgs>;
  /** List of columns to return in the table query result */
  columns: Array<Column>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this query belongs to */
  graph: Graph;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The Cypher query to execute for this table query */
  query: Scalars['CypherLiteral']['output'];
  /** List of node categories for which this query is relevant */
  relevantFor: Array<NodeCategory>;
};

export type NodeTableQueryFilter = {
  AND?: InputMaybe<NodeTableQueryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<NodeTableQueryFilter>;
  OR?: InputMaybe<NodeTableQueryFilter>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full-text search over label and description */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type NodeTableQueryOrder =
  { id: Ordering; label?: never; }
  |  { id?: never; label: Ordering; };

export type OffsetPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: Scalars['Int']['input'];
};

/** An ontology reference in the graph schema */
export type OntologyReference = {
  __typename?: 'OntologyReference';
  /** The ontology prefix (e.g. 'OBI'). Must be defined in graph prefixes. */
  prefix: Scalars['String']['output'];
  /** The ontology term ID (e.g., '0008150') */
  termId: Scalars['String']['output'];
};

/** Input for creating a new natural event definition in the graph schema */
export type OntologyReferenceInput = {
  /** The ontology prefix (e.g. 'OBI'). Must be defined in graph prefixes. */
  prefix: Scalars['String']['input'];
  /** The full URI for the ontology term */
  uri: Scalars['String']['input'];
};

export enum Ordering {
  Asc = 'ASC',
  AscNullsFirst = 'ASC_NULLS_FIRST',
  AscNullsLast = 'ASC_NULLS_LAST',
  Desc = 'DESC',
  DescNullsFirst = 'DESC_NULLS_FIRST',
  DescNullsLast = 'DESC_NULLS_LAST'
}

/** A natural event category/schema definition */
export type OutputParticipation = Edge & {
  __typename?: 'OutputParticipation';
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for edge lookup */
  id: Scalars['String']['output'];
  /** The edge label/type */
  label: Scalars['String']['output'];
  /** The graph this node belongs to */
  role: Scalars['String']['output'];
  /** The graph this node belongs to */
  source: NaturalEvent;
  /** Global ID of the source/left node */
  sourceId: Scalars['String']['output'];
  /** The graph this node belongs to */
  target: Entity;
  /** Global ID of the target/right node */
  targetId: Scalars['String']['output'];
};

/** Input for creating a new structure */
export type PinNodeInput = {
  /** The ID of the structure category/type to create */
  category: Scalars['String']['input'];
  /** The graph id this structure will belong to */
  graph: Scalars['String']['input'];
  /** List of measurements associated with this structure */
  metrics?: Array<MetricInput>;
  /** The unique ID of the object this structure references */
  object: Scalars['String']['input'];
};

/** Base interface for plottable queries */
export type Plottable = {
  /** List of columns to return in the table query result */
  columns: Array<Column>;
};

export type PrefixInput = {
  /** The prefix string (e.g. 'OBI') */
  prefix: Scalars['String']['input'];
  /** The URI that the prefix maps to (e.g. 'http://purl.obolibrary.org/obo/OBI_') */
  uri: Scalars['String']['input'];
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

/** A property definition from the graph schema */
export type PropertyDefinition = {
  __typename?: 'PropertyDefinition';
  /** Derivation type: LATEST, PRIORITY_LATEST, ROLLUP, LATEST_ASSERTION_TOOL */
  derivation: DerivationType;
  /** Description of this property */
  description?: Maybe<Scalars['String']['output']>;
  /** Whether to create an index on this property for faster queries */
  index: Scalars['Boolean']['output'];
  /** Property key/name */
  key: Scalars['String']['output'];
  /** Optional human-readable label for this property (defaults to 'key' if not provided) */
  label?: Maybe<Scalars['String']['output']>;
  /** Rule configuration for ROLLUP derivation */
  rule?: Maybe<DerivationRule>;
  /** Whether this property should be full-text searchable */
  searchable: Scalars['Boolean']['output'];
  /** Unit of measurement */
  unit?: Maybe<Scalars['String']['output']>;
  valueKind: ValueKind;
};

/** Definition of a property on an entity, structure, or relation */
export type PropertyDefinitionInput = {
  /** Derivation type: LATEST, PRIORITY_LATEST, ROLLUP, LATEST_ASSERTION_TOOL */
  derivation?: DerivationType;
  /** Description of this property */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Whether to create an index on this property for faster queries */
  index?: Scalars['Boolean']['input'];
  /** Property key/name */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this property (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Rule configuration for ROLLUP derivation */
  rule?: InputMaybe<DerivationRuleInput>;
  /** Whether this property should be full-text searchable */
  searchable?: Scalars['Boolean']['input'];
  /** Unit of measurement */
  unit?: InputMaybe<Scalars['String']['input']>;
  valueKind: ValueKind;
};

/** A property match condition for filtering entities */
export type PropertyMatch = {
  /** The property matching */
  key: Scalars['String']['input'];
  /** The operator to use */
  operator: WhereOperator;
  /** THe value to filter agains */
  value: Scalars['String']['input'];
};

/** Ordering options for graph table queries */
export type PropertyOrder = {
  /** The direction to order (ASC or DESC) */
  direction: Ordering;
  /** The property key to order by */
  key: Scalars['String']['input'];
};

export enum PropertyType {
  Boolean = 'BOOLEAN',
  Datetime = 'DATETIME',
  Float = 'FLOAT',
  Integer = 'INTEGER',
  Point_3D = 'POINT_3D',
  String = 'STRING'
}

/** A protocol event in the graph */
export type ProtocolEvent = Node & VersionedNode & {
  __typename?: 'ProtocolEvent';
  /** The source entity of this relation */
  category: ProtocolEventCategory;
  /** Category ID linking to ProtocolEventCategory model */
  categoryId?: Maybe<Scalars['String']['output']>;
  /** External ID if set */
  externalId?: Maybe<Scalars['String']['output']>;
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** The graph this node belongs to */
  graph: Graph;
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for node lookup */
  id: Scalars['String']['output'];
  /** The event type/kind */
  kind: Scalars['String']['output'];
  /** The AGE graph label as recently materialized (e.g. 'Cell IAC100', 'ROI 1') */
  label: Scalars['String']['output'];
  /** Timestamp when properties were last derived (unix ms) */
  lastDerived?: Maybe<Scalars['UnixMilliseconds']['output']>;
  /** External object ID this entity references */
  lifecycle?: Maybe<Scalars['String']['output']>;
  /** Local ID if set */
  localId?: Maybe<Scalars['String']['output']>;
  /** List of the current derived properties for this event */
  measuredFrom: Scalars['DateTime']['output'];
  /** The source entity of this relation */
  measuredTo: Scalars['DateTime']['output'];
  /** List of the current derived properties for this entity */
  properties: Scalars['AnyScalar']['output'];
  /** List of properties derived for this entity */
  richProperties: Array<RichProperty>;
  /** Schema version used to derive properties */
  schemaVersion: Scalars['String']['output'];
  /** Tags associated with this node */
  tags: Array<Scalars['String']['output']>;
};

/** A relation category/schema definition */
export type ProtocolEventCategory = Category & EventCategory & NodeCategory & {
  __typename?: 'ProtocolEventCategory';
  /** The name of the category as used in AGE (e.g. 'Cell', 'ROI') */
  ageName: Scalars['String']['output'];
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this category belongs to */
  graph: Graph;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Height for visualization (optional) */
  height?: Maybe<Scalars['Float']['output']>;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** An image representing this category, for visualization purposes */
  image: MediaStore;
  /** The graph this category belongs to */
  inputs: Array<EventRole>;
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  outputs: Array<EventRole>;
  /** The graph this category belongs to */
  pinned: Scalars['Boolean']['output'];
  /** X coordinate */
  positionX: Scalars['Float']['output'];
  /** Y coordinate */
  positionY: Scalars['Float']['output'];
  /** Z coordinate (optional) */
  positionZ?: Maybe<Scalars['Float']['output']>;
  /** List of property definitions for this entity category */
  propertyDefinitions: Array<PropertyDefinition>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant node queries that use this category as input */
  relevantNodeQueries: Array<NodeQuery>;
  /** List of relevant queries that use this category as input */
  relevantQueries: Array<GraphQuery>;
  /** List of tags associated with this category */
  tags: Array<CategoryTag>;
  /** Width for visualization (optional) */
  width?: Maybe<Scalars['Float']['output']>;
};


/** A relation category/schema definition */
export type ProtocolEventCategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
  ordering?: Array<CategoryTagOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Numeric/aggregatable fields of ProtocolEventCategory */
export enum ProtocolEventCategoryField {
  CreatedAt = 'CREATED_AT'
}

export type ProtocolEventCategoryFilter = {
  AND?: InputMaybe<ProtocolEventCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ProtocolEventCategoryFilter>;
  OR?: InputMaybe<ProtocolEventCategoryFilter>;
  graph?: InputMaybe<GraphFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of IDs */
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by list of IDs */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ProtocolEventCategoryOrder =
  { id: Ordering; instanceKind?: never; label?: never; }
  |  { id?: never; instanceKind: Ordering; label?: never; }
  |  { id?: never; instanceKind?: never; label: Ordering; };

export type ProtocolEventCategoryStats = {
  __typename?: 'ProtocolEventCategoryStats';
  /** Average value */
  avg?: Maybe<Scalars['Float']['output']>;
  /** Total number of items in the selection */
  count: Scalars['Int']['output'];
  /** Count of distinct values */
  distinctCount: Scalars['Int']['output'];
  /** Maximum value */
  max?: Maybe<Scalars['Float']['output']>;
  /** Minimum value */
  min?: Maybe<Scalars['Float']['output']>;
  /** Sum of values */
  sum?: Maybe<Scalars['Float']['output']>;
};


export type ProtocolEventCategoryStatsAvgArgs = {
  field: ProtocolEventCategoryField;
};


export type ProtocolEventCategoryStatsDistinctCountArgs = {
  field: ProtocolEventCategoryField;
};


export type ProtocolEventCategoryStatsMaxArgs = {
  field: ProtocolEventCategoryField;
};


export type ProtocolEventCategoryStatsMinArgs = {
  field: ProtocolEventCategoryField;
};


export type ProtocolEventCategoryStatsSumArgs = {
  field: ProtocolEventCategoryField;
};

/** Filter options for querying protocol events */
export type ProtocolEventFilter = {
  /** Filter protocol events that have a specific property */
  hasProperty?: InputMaybe<Scalars['String']['input']>;
  /** Filter by specific protocol event IDs */
  ids?: InputMaybe<Array<Scalars['GraphID']['input']>>;
  /** Filter protocol events that match specific property conditions */
  matches?: InputMaybe<Array<PropertyMatch>>;
  /** Full-text search over protocol event properties */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Ordering options for protocol event queries */
export type ProtocolEventOrder = {
  /** Order by protocol event category */
  category?: InputMaybe<Ordering>;
  /** Order by creation timestamp */
  createdAt?: InputMaybe<Ordering>;
  /** Order by protocol event ID */
  id?: InputMaybe<Ordering>;
  /** Order by a specific property value */
  property?: InputMaybe<PropertyOrder>;
};

/** Pagination options for querying protocol events */
export type ProtocolEventPaginationInput = {
  /** Maximum number of items to return */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to skip */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  _entities: Array<Maybe<_Entity>>;
  _service: _Service;
  /** Get aggregated category-tag stats with optional filters */
  categoryTagStats: CategoryTagStats;
  /** List all category tags */
  categoryTags: Array<CategoryTag>;
  /** Show all saved edge pairs queries */
  edgePairsQueries: Array<EdgePairsQuery>;
  /** Show a single saved edge pairs query by ID */
  edgePairsQuery: EdgePairsQuery;
  /** Show all saved edge path queries */
  edgePathQueries: Array<EdgePathQuery>;
  /** Show a single saved edge path query by ID */
  edgePathQuery: EdgePathQuery;
  /** Show all saved edge queries */
  edgeQueries: Array<EdgeQuery>;
  /** Show a single saved edge query by ID */
  edgeQuery: EdgeQuery;
  /** Show all saved edge table queries */
  edgeTableQueries: Array<EdgeTableQuery>;
  /** Show a single saved edge table query by ID */
  edgeTableQuery: EdgeTableQuery;
  /** List entities with optional filters, ordering, and pagination */
  entities: Array<Entity>;
  /** Get an entity by ID */
  entity: Entity;
  /** List all entity categories/schemas */
  entityCategories: Array<EntityCategory>;
  /** Get a single entity category/schema by ID */
  entityCategory: EntityCategory;
  /** Get aggregated entity-category stats with optional filters */
  entityCategoryStats: EntityCategoryStats;
  /** Get a graph by ID */
  graph: Graph;
  /** Show a single saved graph node query by ID */
  graphNodeQuery: GraphNodesQuery;
  /** Show all saved graph nodes queries */
  graphNodesQueries: Array<GraphNodesQuery>;
  /** Show all saved graph pairs queries */
  graphPairsQueries: Array<GraphPairsQuery>;
  /** Show a single saved graph pairs query by ID */
  graphPairsQuery: GraphPairsQuery;
  /** Show all saved graph queries */
  graphQueries: Array<GraphQuery>;
  /** Show a single saved graph query by ID */
  graphQuery: GraphQuery;
  /** Get aggregated graph stats with optional filters */
  graphStats: GraphStats;
  /** Show all saved graph table queries */
  graphTableQueries: Array<GraphTableQuery>;
  /** Show a single saved graph table query by ID */
  graphTableQuery: GraphTableQuery;
  /** List all graphs in the graph engine */
  graphs: Array<Graph>;
  /** Get a single materialized edge by ID */
  materializedEdge: MaterializedEdge;
  /** List all materialized edges in the graph */
  materializedEdges: Array<MaterializedEdge>;
  /** Get a measurement by composite graph ID */
  measurement: Measurement;
  /** List all measurement categories/schemas */
  measurementCategories: Array<MeasurementCategory>;
  /** Get a single measurement category/schema by ID */
  measurementCategory: MeasurementCategory;
  /** Get aggregated measurement-category stats with optional filters */
  measurementCategoryStats: MeasurementCategoryStats;
  /** List measurements for a measurement category */
  measurements: Array<Measurement>;
  /** Get a metric by ID */
  metric: Metric;
  /** List all metric categories/schemas */
  metricCategories: Array<MetricCategory>;
  /** Get a single metric category/schema by ID */
  metricCategory: MetricCategory;
  /** Get aggregated metric-category stats with optional filters */
  metricCategoryStats: MetricCategoryStats;
  /** List metrics for a metric category */
  metrics: Array<Metric>;
  /** Get a natural event by composite graph ID */
  naturalEvent: NaturalEvent;
  /** List all natural event categories/schemas */
  naturalEventCategories: Array<NaturalEventCategory>;
  /** Get a single natural event category/schema by ID */
  naturalEventCategory: NaturalEventCategory;
  /** Get aggregated natural-event-category stats with optional filters */
  naturalEventCategoryStats: NaturalEventCategoryStats;
  /** List natural events for a natural event category */
  naturalEvents: Array<NaturalEvent>;
  /** Show all saved node pairs queries */
  nodePairsQueries: Array<NodePairsQuery>;
  /** Show a single saved node pairs query by ID */
  nodePairsQuery: NodePairsQuery;
  /** Show all saved node path queries */
  nodePathQueries: Array<NodePathQuery>;
  /** Show a single saved node path query by ID */
  nodePathQuery: NodePathQuery;
  /** Show all saved node queries */
  nodeQueries: Array<NodeQuery>;
  /** Show a single saved node query by ID */
  nodeQuery: NodeQuery;
  /** Show all saved node table queries */
  nodeTableQueries: Array<NodeTableQuery>;
  /** Show a single saved node table query by ID */
  nodeTableQuery: NodeTableQuery;
  /** Get a protocol event by composite graph ID */
  protocolEvent: ProtocolEvent;
  /** List all protocol event categories/schemas */
  protocolEventCategories: Array<ProtocolEventCategory>;
  /** Get a single protocol event category/schema by ID */
  protocolEventCategory: ProtocolEventCategory;
  /** Get aggregated protocol-event-category stats with optional filters */
  protocolEventCategoryStats: ProtocolEventCategoryStats;
  /** List protocol events for a protocol event category */
  protocolEvents: Array<ProtocolEvent>;
  /** Get a relation by composite graph ID */
  relation: Relation;
  /** List all relation categories/schemas */
  relationCategories: Array<RelationCategory>;
  /** Get a single relation category/schema by ID */
  relationCategory: RelationCategory;
  /** Get aggregated relation-category stats with optional filters */
  relationCategoryStats: RelationCategoryStats;
  /** List relations for a relation category */
  relations: Array<Relation>;
  /** Render results for a graph nodes query */
  renderGraphNodes: GraphNodesRender;
  /** Render results for a graph pairs query */
  renderGraphPairs: GraphPathRender;
  /** Render results for a graph path query */
  renderGraphPath?: Maybe<Assertion>;
  /** Render results for a graph table query */
  renderGraphTable?: Maybe<GraphTableRender>;
  /** Show a single saved scatter plot by ID */
  scatterPlot: ScatterPlot;
  /** Show all saved scatter plots */
  scatterPlots: Array<ScatterPlot>;
  /** Get a structure by composite graph ID */
  structure?: Maybe<Structure>;
  /** Get a structure by graph, identifier and object */
  structureByIdentifier?: Maybe<Structure>;
  /** List all structure categories/schemas */
  structureCategories: Array<StructureCategory>;
  /** Get a single structure category/schema by ID */
  structureCategory: StructureCategory;
  /** Get aggregated structure-category stats with optional filters */
  structureCategoryStats: StructureCategoryStats;
  /** Get a structure relation by composite graph ID */
  structureRelation: StructureRelation;
  /** List all structure relation categories/schemas */
  structureRelationCategories: Array<StructureRelationCategory>;
  /** Get a single structure relation category/schema by ID */
  structureRelationCategory: StructureRelationCategory;
  /** Get aggregated structure-relation-category stats with optional filters */
  structureRelationCategoryStats: StructureRelationCategoryStats;
  /** List structure relations for a structure relation category */
  structureRelations: Array<StructureRelation>;
  /** List structures with optional filters, ordering, and pagination */
  structures: Array<Structure>;
};


export type Query_EntitiesArgs = {
  representations: Array<Scalars['_Any']['input']>;
};


export type QueryCategoryTagStatsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
};


export type QueryCategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
  ordering?: Array<CategoryTagOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEdgePairsQueriesArgs = {
  filters?: InputMaybe<EdgePairsQueryFilter>;
  ordering?: Array<EdgePairsQueryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEdgePairsQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEdgePathQueriesArgs = {
  filters?: InputMaybe<EdgePathQueryFilter>;
  ordering?: Array<EdgePathQueryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEdgePathQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEdgeQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEdgeTableQueriesArgs = {
  filters?: InputMaybe<EdgeTableQueryFilter>;
  ordering?: Array<EdgeTableQueryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEdgeTableQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntitiesArgs = {
  entityCategoryId: Scalars['ID']['input'];
  filters?: InputMaybe<EntityFilter>;
  ordering?: InputMaybe<Array<EntityOrder>>;
  pagination?: InputMaybe<EntityPaginationInput>;
};


export type QueryEntityArgs = {
  id: Scalars['GraphID']['input'];
};


export type QueryEntityCategoriesArgs = {
  filters?: InputMaybe<EntityCategoryFilter>;
  ordering?: Array<EntityCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEntityCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityCategoryStatsArgs = {
  filters?: InputMaybe<EntityCategoryFilter>;
};


export type QueryGraphArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphNodeQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphNodesQueriesArgs = {
  filters?: InputMaybe<GraphNodesQueryFilter>;
  ordering?: Array<GraphNodesQueryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryGraphPairsQueriesArgs = {
  filters?: InputMaybe<GraphPairsQueryFilter>;
  ordering?: Array<GraphPairsQueryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryGraphPairsQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphStatsArgs = {
  filters?: InputMaybe<GraphFilter>;
};


export type QueryGraphTableQueriesArgs = {
  filters?: InputMaybe<GraphTableQueryFilter>;
  ordering?: Array<GraphTableQueryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryGraphTableQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphsArgs = {
  filters?: InputMaybe<GraphFilter>;
  ordering?: Array<GraphOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMaterializedEdgeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMaterializedEdgesArgs = {
  filters?: InputMaybe<MaterializedEdgeFilter>;
  ordering?: Array<MaterializedEdgeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMeasurementArgs = {
  id: Scalars['GraphID']['input'];
};


export type QueryMeasurementCategoriesArgs = {
  filters?: InputMaybe<MeasurementCategoryFilter>;
  ordering?: Array<MeasurementCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMeasurementCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMeasurementCategoryStatsArgs = {
  filters?: InputMaybe<MeasurementCategoryFilter>;
};


export type QueryMeasurementsArgs = {
  filters?: InputMaybe<MeasurementFilter>;
  measurementCategoryId: Scalars['ID']['input'];
  ordering?: InputMaybe<Array<MeasurementOrder>>;
  pagination?: InputMaybe<MeasurementPaginationInput>;
};


export type QueryMetricArgs = {
  metricId: Scalars['GraphID']['input'];
};


export type QueryMetricCategoriesArgs = {
  filters?: InputMaybe<MetricCategoryFilter>;
  ordering?: Array<MetricCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMetricCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMetricCategoryStatsArgs = {
  filters?: InputMaybe<MetricCategoryFilter>;
};


export type QueryMetricsArgs = {
  filters?: InputMaybe<MetricFilter>;
  metricCategoryId: Scalars['ID']['input'];
  ordering?: InputMaybe<Array<MetricOrder>>;
  pagination?: InputMaybe<MetricPaginationInput>;
};


export type QueryNaturalEventArgs = {
  id: Scalars['GraphID']['input'];
};


export type QueryNaturalEventCategoriesArgs = {
  filters?: InputMaybe<NaturalEventCategoryFilter>;
  ordering?: Array<NaturalEventCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryNaturalEventCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNaturalEventCategoryStatsArgs = {
  filters?: InputMaybe<NaturalEventCategoryFilter>;
};


export type QueryNaturalEventsArgs = {
  filters?: InputMaybe<NaturalEventFilter>;
  naturalEventCategoryId: Scalars['ID']['input'];
  ordering?: InputMaybe<Array<NaturalEventOrder>>;
  pagination?: InputMaybe<NaturalEventPaginationInput>;
};


export type QueryNodePairsQueriesArgs = {
  filters?: InputMaybe<NodePairsQueryFilter>;
  ordering?: Array<NodePairsQueryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryNodePairsQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodePathQueriesArgs = {
  filters?: InputMaybe<NodePathQueryFilter>;
  ordering?: Array<NodePathQueryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryNodePathQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodeQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodeTableQueriesArgs = {
  filters?: InputMaybe<NodeTableQueryFilter>;
  ordering?: Array<NodeTableQueryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryNodeTableQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProtocolEventArgs = {
  id: Scalars['GraphID']['input'];
};


export type QueryProtocolEventCategoriesArgs = {
  filters?: InputMaybe<ProtocolEventCategoryFilter>;
  ordering?: Array<ProtocolEventCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryProtocolEventCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProtocolEventCategoryStatsArgs = {
  filters?: InputMaybe<ProtocolEventCategoryFilter>;
};


export type QueryProtocolEventsArgs = {
  filters?: InputMaybe<ProtocolEventFilter>;
  ordering?: InputMaybe<Array<ProtocolEventOrder>>;
  pagination?: InputMaybe<ProtocolEventPaginationInput>;
  protocolEventCategoryId: Scalars['ID']['input'];
};


export type QueryRelationArgs = {
  id: Scalars['GraphID']['input'];
};


export type QueryRelationCategoriesArgs = {
  filters?: InputMaybe<RelationCategoryFilter>;
  ordering?: Array<RelationCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRelationCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRelationCategoryStatsArgs = {
  filters?: InputMaybe<RelationCategoryFilter>;
};


export type QueryRelationsArgs = {
  filters?: InputMaybe<RelationFilter>;
  ordering?: InputMaybe<Array<RelationOrder>>;
  pagination?: InputMaybe<RelationPaginationInput>;
  relationCategoryId: Scalars['ID']['input'];
};


export type QueryRenderGraphNodesArgs = {
  filters?: InputMaybe<RenderGraphNodesFilter>;
  order?: InputMaybe<RenderGraphNodesOrder>;
  pagination?: InputMaybe<RenderGraphNodesPagination>;
  query: Scalars['ID']['input'];
};


export type QueryRenderGraphPairsArgs = {
  filters?: InputMaybe<RenderGraphPathFilter>;
  order?: InputMaybe<RenderGraphPathOrder>;
  pagination?: InputMaybe<RenderGraphPathPagination>;
  query: Scalars['ID']['input'];
};


export type QueryRenderGraphPathArgs = {
  filters?: InputMaybe<RenderGraphPathFilter>;
  order?: InputMaybe<RenderGraphPathOrder>;
  pagination?: InputMaybe<RenderGraphPathPagination>;
  query: Scalars['ID']['input'];
};


export type QueryRenderGraphTableArgs = {
  filters?: InputMaybe<RenderGraphTableFilter>;
  order?: InputMaybe<RenderGraphTableOrder>;
  pagination?: InputMaybe<RenderGraphTablePagination>;
  query: Scalars['ID']['input'];
};


export type QueryScatterPlotArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScatterPlotsArgs = {
  filters?: InputMaybe<ScatterPlotFilter>;
  ordering?: Array<ScatterPlotOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStructureArgs = {
  id: Scalars['GraphID']['input'];
};


export type QueryStructureByIdentifierArgs = {
  graph: Scalars['ID']['input'];
  identifier: Scalars['StructureIdentifier']['input'];
  object: Scalars['StructureObject']['input'];
};


export type QueryStructureCategoriesArgs = {
  filters?: InputMaybe<StructureCategoryFilter>;
  ordering?: Array<StructureCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStructureCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStructureCategoryStatsArgs = {
  filters?: InputMaybe<StructureCategoryFilter>;
};


export type QueryStructureRelationArgs = {
  id: Scalars['GraphID']['input'];
};


export type QueryStructureRelationCategoriesArgs = {
  filters?: InputMaybe<StructureRelationCategoryFilter>;
  ordering?: Array<StructureRelationCategoryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStructureRelationCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStructureRelationCategoryStatsArgs = {
  filters?: InputMaybe<StructureRelationCategoryFilter>;
};


export type QueryStructureRelationsArgs = {
  filters?: InputMaybe<StructureRelationFilter>;
  ordering?: InputMaybe<Array<StructureRelationOrder>>;
  pagination?: InputMaybe<StructureRelationPaginationInput>;
  structureRelationCategoryId: Scalars['ID']['input'];
};


export type QueryStructuresArgs = {
  filters?: InputMaybe<StructureFilter>;
  ordering?: InputMaybe<Array<StructureOrder>>;
  pagination?: InputMaybe<StructurePaginationInput>;
  structureCategoryId: Scalars['ID']['input'];
};

/** Input for creating a new metric */
export type RecordMetricInput = {
  /** The graph id this metric will belong to */
  graph: Scalars['String']['input'];
  /** The schema identifier for this metric (e.g. '@mikro/roi_volume') */
  identifier: Scalars['String']['input'];
  key: Scalars['String']['input'];
  /** The unique ID of the object this metric references */
  object: Scalars['String']['input'];
  value: Scalars['AnyScalar']['input'];
  /** The kind of value this metric represents (e.g. 'float', 'integer', 'string', etc.) */
  valueKind: PropertyType;
};

/** A relation edge between two entities */
export type Relation = Edge & {
  __typename?: 'Relation';
  /** The graph this node belongs to */
  category: RelationCategory;
  /** When this relation was created */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for edge lookup */
  id: Scalars['String']['output'];
  /** The edge label/type */
  label: Scalars['String']['output'];
  /** When this relation became valid according to the evidence */
  measuredFrom?: Maybe<Scalars['DateTime']['output']>;
  /** When this relation stopped being valid according to the evidence */
  measuredTo?: Maybe<Scalars['DateTime']['output']>;
  /** List of the current derived properties for this entity */
  properties: Scalars['AnyScalar']['output'];
  /** List of properties derived for this entity */
  richProperties: Array<RichProperty>;
  /** The graph this node belongs to */
  source: Entity;
  /** Global ID of the source/left node */
  sourceId: Scalars['String']['output'];
  /** The graph this node belongs to */
  target: Entity;
  /** Global ID of the target/right node */
  targetId: Scalars['String']['output'];
};

/** A relation category/schema definition */
export type RelationCategory = Category & EdgeCategory & {
  __typename?: 'RelationCategory';
  /** The name of the category as used in AGE (e.g. 'Cell', 'ROI') */
  ageName: Scalars['String']['output'];
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this category belongs to */
  graph: Graph;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** An image representing this category, for visualization purposes */
  image: MediaStore;
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  materializableAs: Array<MaterializedEdge>;
  /** The graph this category belongs to */
  pinned: Scalars['Boolean']['output'];
  /** List of property definitions for this entity category */
  propertyDefinitions: Array<PropertyDefinition>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant queries that use this category as input */
  relevantEdgeQueries: Array<EdgeQuery>;
  /** List of relevant queries that use this category as input */
  relevantQueries: Array<GraphQuery>;
  /** The graph this category belongs to */
  sourceDescriptor: EntityDescriptor;
  /** List of tags associated with this category */
  tags: Array<CategoryTag>;
  /** The graph this category belongs to */
  targetDescriptor: EntityDescriptor;
};


/** A relation category/schema definition */
export type RelationCategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
  ordering?: Array<CategoryTagOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Numeric/aggregatable fields of RelationCategory */
export enum RelationCategoryField {
  CreatedAt = 'CREATED_AT'
}

export type RelationCategoryFilter = {
  AND?: InputMaybe<RelationCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<RelationCategoryFilter>;
  OR?: InputMaybe<RelationCategoryFilter>;
  graph?: InputMaybe<GraphFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of IDs */
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by list of IDs */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type RelationCategoryOrder =
  { id: Ordering; instanceKind?: never; label?: never; }
  |  { id?: never; instanceKind: Ordering; label?: never; }
  |  { id?: never; instanceKind?: never; label: Ordering; };

export type RelationCategoryStats = {
  __typename?: 'RelationCategoryStats';
  /** Average value */
  avg?: Maybe<Scalars['Float']['output']>;
  /** Total number of items in the selection */
  count: Scalars['Int']['output'];
  /** Count of distinct values */
  distinctCount: Scalars['Int']['output'];
  /** Maximum value */
  max?: Maybe<Scalars['Float']['output']>;
  /** Minimum value */
  min?: Maybe<Scalars['Float']['output']>;
  /** Sum of values */
  sum?: Maybe<Scalars['Float']['output']>;
};


export type RelationCategoryStatsAvgArgs = {
  field: RelationCategoryField;
};


export type RelationCategoryStatsDistinctCountArgs = {
  field: RelationCategoryField;
};


export type RelationCategoryStatsMaxArgs = {
  field: RelationCategoryField;
};


export type RelationCategoryStatsMinArgs = {
  field: RelationCategoryField;
};


export type RelationCategoryStatsSumArgs = {
  field: RelationCategoryField;
};

/** Definition of a relation type in the graph schema */
export type RelationDefinitionInput = {
  /** Relation cardinality */
  cardinality?: Cardinality;
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Relation type name/key */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Derived property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Source entity type(s) */
  source: EntityDescriptorInput;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
  /** Target entity type(s) */
  target: EntityDescriptorInput;
};

/** Filter options for querying relations */
export type RelationFilter = {
  /** Filter relations that have a specific property */
  hasProperty?: InputMaybe<Scalars['String']['input']>;
  /** Filter by specific relation IDs */
  ids?: InputMaybe<Array<Scalars['GraphID']['input']>>;
  /** Filter relations that match specific property conditions */
  matches?: InputMaybe<Array<PropertyMatch>>;
  /** Full-text search over relation properties */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Ordering options for relation queries */
export type RelationOrder = {
  /** Order by relation category */
  category?: InputMaybe<Ordering>;
  /** Order by creation timestamp */
  createdAt?: InputMaybe<Ordering>;
  /** Order by relation ID */
  id?: InputMaybe<Ordering>;
  /** Order by a specific property value */
  property?: InputMaybe<PropertyOrder>;
};

/** Pagination options for querying relations */
export type RelationPaginationInput = {
  /** Maximum number of items to return */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to skip */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Filters for querying node lists */
export type RenderGraphNodesFilter = {
  key: Scalars['String']['input'];
  operator: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

/** Ordering options for querying node lists */
export type RenderGraphNodesOrder = {
  direction?: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

/** Pagination options for querying node lists */
export type RenderGraphNodesPagination = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

/** Filters for querying node lists */
export type RenderGraphPathFilter = {
  key: Scalars['String']['input'];
  operator: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

/** Ordering options for querying node lists */
export type RenderGraphPathOrder = {
  direction?: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

/** Pagination options for querying node lists */
export type RenderGraphPathPagination = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

/** Filters for querying node lists */
export type RenderGraphTableFilter = {
  key: Scalars['String']['input'];
  operator: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

/** Ordering options for querying node lists */
export type RenderGraphTableOrder = {
  direction?: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

/** Pagination options for querying node lists */
export type RenderGraphTablePagination = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type RequestMediaUploadInput = {
  contentType?: InputMaybe<Scalars['String']['input']>;
  datalayer: Scalars['String']['input'];
  fileSize?: InputMaybe<Scalars['Int']['input']>;
  key: Scalars['String']['input'];
};

/** Input type for creating a new graph */
export type ReturnStatement = {
  __typename?: 'ReturnStatement';
  /** The node ID to return */
  node?: Maybe<Scalars['String']['output']>;
  /** The path ID to return */
  path: Scalars['String']['output'];
  /** The property name to return */
  property?: Maybe<Scalars['String']['output']>;
};

/** Input for a return statement in a graph table query builder */
export type ReturnStatementInput = {
  /** The node ID to return */
  node?: InputMaybe<Scalars['String']['input']>;
  /** The path ID to return */
  path: Scalars['String']['input'];
  /** The property name to return */
  property?: InputMaybe<Scalars['String']['input']>;
};

/** A rich property with metadata from schema and graph */
export type RichProperty = {
  __typename?: 'RichProperty';
  /** The property key/name */
  definition?: Maybe<PropertyDefinition>;
  /** Local AGE graph ID */
  graphId: Scalars['GraphID']['output'];
  /** The timestamp when this property was last derived (unix ms) */
  key?: Maybe<Scalars['String']['output']>;
  /** Supporting evidence for this property, in form of metrics derived from observations/measurements */
  supportingEvidence: Array<Metric>;
  /** The property value */
  value?: Maybe<Scalars['AnyScalar']['output']>;
};

/** Input for creating a new natural event definition in the graph schema */
export type RoleMappingInput = {
  /** The ID of the entity assigned to this role */
  entityId: Scalars['String']['input'];
  /** The role name */
  role: Scalars['String']['input'];
};

/** Result of linking a structure to an entity */
export type ScatterPlot = {
  __typename?: 'ScatterPlot';
  /** The name of the column to use for color values (optional) */
  colorColumn?: Maybe<Scalars['String']['output']>;
  /** Description of the scatter plot definition */
  description?: Maybe<Scalars['String']['output']>;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** The name of the column to use for point identifiers (e.g. structure ID, or entity id) */
  idColumn: Scalars['String']['output'];
  /** Label/name of the scatter plot definition */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  query: Plottable;
  /** The name of the column to use for shape values (optional) */
  shapeColumn?: Maybe<Scalars['String']['output']>;
  /** The name of the column to use for size values (optional) */
  sizeColumn?: Maybe<Scalars['String']['output']>;
  /** The name of the column to use for x values */
  xColumn: Scalars['String']['output'];
  /** The name of the column to use for y values */
  yColumn: Scalars['String']['output'];
};

export type ScatterPlotFilter = {
  AND?: InputMaybe<ScatterPlotFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ScatterPlotFilter>;
  OR?: InputMaybe<ScatterPlotFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** Full-text search over label and description */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new graph from a schema definition */
export type ScatterPlotInput = {
  /** Optional column key to use for coloring the points */
  colorBy?: InputMaybe<Scalars['String']['input']>;
  /** The key of the graph table query that provides the data for this plot */
  graphTableQuery?: InputMaybe<Scalars['String']['input']>;
  /** Unique key for this plot definition, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** Human-readable label for this plot definition (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** The key of the node table query that provides the data for this plot */
  nodeTableQuery?: InputMaybe<Scalars['String']['input']>;
  /** The key of the path table query that provides the data for this plot */
  pathTableQuery?: InputMaybe<Scalars['String']['input']>;
  /** Optional column key to use for sizing the points */
  sizeBy?: InputMaybe<Scalars['String']['input']>;
  /** The column key to use for the x-axis */
  xAxis: Scalars['String']['input'];
  /** The column key to use for the y-axis */
  yAxis: Scalars['String']['input'];
};

export type ScatterPlotOrder =
  { id: Ordering; name?: never; }
  |  { id?: never; name: Ordering; };

/** Input for creating a new graph from a schema definition */
export type SequenceInput = {
  /** The prefix string (e.g. 'IAZ') */
  prefix: Scalars['String']['input'];
};

/** Input for creating a new natural event definition in the graph schema */
export type SequenceMappingInput = {
  /** The property key that will be set with the sequence value */
  property: Scalars['String']['input'];
  /** The sequence identifier (e.g., 'IAZ001') */
  sequence: Scalars['String']['input'];
};

/** A structure that provides evidence for entities */
export type Structure = Node & {
  __typename?: 'Structure';
  /** The graph this node belongs to */
  category: StructureCategory;
  /** Category ID linking to StructureCategory model */
  categoryId: Scalars['String']['output'];
  /** External ID if set */
  externalId?: Maybe<Scalars['String']['output']>;
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** The graph this node belongs to */
  graph: Graph;
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for node lookup */
  id: Scalars['String']['output'];
  /** Schema identifier (e.g. '@mikro/roi') */
  identifier: Scalars['StructureIdentifier']['output'];
  /** The AGE graph label as recently materialized (e.g. 'Cell IAC100', 'ROI 1') */
  label: Scalars['String']['output'];
  /** Local ID if set */
  localId?: Maybe<Scalars['String']['output']>;
  /** The graph this node belongs to */
  metrics: Array<Metric>;
  /** External object ID this structure references */
  object: Scalars['String']['output'];
  /** Tags associated with this node */
  tags: Array<Scalars['String']['output']>;
};

/** A structure category/schema definition */
export type StructureCategory = Category & NodeCategory & {
  __typename?: 'StructureCategory';
  /** The name of the category as used in AGE (e.g. 'Cell', 'ROI') */
  ageName: Scalars['String']['output'];
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this category belongs to */
  graph: Graph;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Height for visualization (optional) */
  height?: Maybe<Scalars['Float']['output']>;
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** The identifier for this structure category, which is used to link structures to entities (e.g. 'Cell', 'ROI', 'Tissue') */
  identifier: Scalars['String']['output'];
  /** An image representing this category, for visualization purposes */
  image: MediaStore;
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  pinned: Scalars['Boolean']['output'];
  /** X coordinate */
  positionX: Scalars['Float']['output'];
  /** Y coordinate */
  positionY: Scalars['Float']['output'];
  /** Z coordinate (optional) */
  positionZ?: Maybe<Scalars['Float']['output']>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant node queries that use this category as input */
  relevantNodeQueries: Array<NodeQuery>;
  /** List of relevant queries that use this category as input */
  relevantQueries: Array<GraphQuery>;
  /** List of tags associated with this category */
  tags: Array<CategoryTag>;
  /** Width for visualization (optional) */
  width?: Maybe<Scalars['Float']['output']>;
};


/** A structure category/schema definition */
export type StructureCategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
  ordering?: Array<CategoryTagOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Numeric/aggregatable fields of StructureCategory */
export enum StructureCategoryField {
  CreatedAt = 'CREATED_AT'
}

export type StructureCategoryFilter = {
  AND?: InputMaybe<StructureCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<StructureCategoryFilter>;
  OR?: InputMaybe<StructureCategoryFilter>;
  graph?: InputMaybe<GraphFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of IDs */
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by list of IDs */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type StructureCategoryOrder =
  { id: Ordering; instanceKind?: never; label?: never; }
  |  { id?: never; instanceKind: Ordering; label?: never; }
  |  { id?: never; instanceKind?: never; label: Ordering; };

export type StructureCategoryStats = {
  __typename?: 'StructureCategoryStats';
  /** Average value */
  avg?: Maybe<Scalars['Float']['output']>;
  /** Total number of items in the selection */
  count: Scalars['Int']['output'];
  /** Count of distinct values */
  distinctCount: Scalars['Int']['output'];
  /** Maximum value */
  max?: Maybe<Scalars['Float']['output']>;
  /** Minimum value */
  min?: Maybe<Scalars['Float']['output']>;
  /** Sum of values */
  sum?: Maybe<Scalars['Float']['output']>;
};


export type StructureCategoryStatsAvgArgs = {
  field: StructureCategoryField;
};


export type StructureCategoryStatsDistinctCountArgs = {
  field: StructureCategoryField;
};


export type StructureCategoryStatsMaxArgs = {
  field: StructureCategoryField;
};


export type StructureCategoryStatsMinArgs = {
  field: StructureCategoryField;
};


export type StructureCategoryStatsSumArgs = {
  field: StructureCategoryField;
};

/** Input type for creating a new graph query */
export type StructureDescriptor = {
  __typename?: 'StructureDescriptor';
  /** Default category to link to if no entities match the filters */
  defaultCategoryKey?: Maybe<Scalars['String']['output']>;
  /** Filter by entity key/label */
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Filter by ontology references on the entity (format: 'PREFIX:TERM_ID') */
  ontotologyTerms?: Maybe<Array<Scalars['String']['output']>>;
  /** Filter by tags on the entity */
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

/** Filter options for querying structures */
export type StructureFilter = {
  /** Filter structures that have a specific property */
  hasProperty?: InputMaybe<Scalars['String']['input']>;
  /** Filter by specific structure IDs */
  ids?: InputMaybe<Array<Scalars['GraphID']['input']>>;
  /** Filter structures that match specific property conditions */
  matches?: InputMaybe<Array<PropertyMatch>>;
  /** Full-text search over structure properties */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Ordering options for structure queries */
export type StructureOrder = {
  /** Order by structure kind/type */
  category?: InputMaybe<Ordering>;
  /** Order by creation timestamp */
  createdAt?: InputMaybe<Ordering>;
  /** Order by structure ID */
  id?: InputMaybe<Ordering>;
  /** Order by a specific property value (requires 'has_property' filter) */
  property?: InputMaybe<PropertyOrder>;
};

/** Pagination options for querying structures */
export type StructurePaginationInput = {
  /** Maximum number of items to return */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to skip */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for creating a new natural event definition in the graph schema */
export type StructureReferenceInput = {
  /** Schema identifier, e.g. '@mikro/roi' */
  identifier: Scalars['String']['input'];
  metrics?: Array<MetricInput>;
  /** The unique ID of the object this structure references */
  object: Scalars['String']['input'];
};

/** A relation edge between two structures */
export type StructureRelation = Edge & {
  __typename?: 'StructureRelation';
  /** The graph this node belongs to */
  category: StructureRelationCategory;
  /** Category ID linking to StructureRelationCategory model */
  categoryId?: Maybe<Scalars['String']['output']>;
  /** When this relation was created */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for edge lookup */
  id: Scalars['String']['output'];
  /** The edge label/type */
  label: Scalars['String']['output'];
  /** When this relation became valid according to the evidence */
  measuredFrom?: Maybe<Scalars['DateTime']['output']>;
  /** When this relation stopped being valid according to the evidence */
  measuredTo?: Maybe<Scalars['DateTime']['output']>;
  /** The graph this node belongs to */
  source: Structure;
  /** Global ID of the source/left node */
  sourceId: Scalars['String']['output'];
  /** The graph this node belongs to */
  target: Structure;
  /** Global ID of the target/right node */
  targetId: Scalars['String']['output'];
};

/** A relation category/schema definition */
export type StructureRelationCategory = Category & EdgeCategory & {
  __typename?: 'StructureRelationCategory';
  /** The name of the category as used in AGE (e.g. 'Cell', 'ROI') */
  ageName: Scalars['String']['output'];
  /** Color as RGBA list (0-255) */
  color?: Maybe<Array<Scalars['Int']['output']>>;
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** The graph this category belongs to */
  graph: Graph;
  /** ID of the graph this category belongs to */
  graphId: Scalars['ID']['output'];
  /** Database ID of the category */
  id: Scalars['ID']['output'];
  /** An image representing this category, for visualization purposes */
  image: MediaStore;
  /** Label/name of the category */
  label: Scalars['String']['output'];
  /** The graph this category belongs to */
  materializableAs: Array<MaterializedEdge>;
  /** The graph this category belongs to */
  pinned: Scalars['Boolean']['output'];
  /** List of property definitions for this entity category */
  propertyDefinitions: Array<PropertyDefinition>;
  /** Persistent URL for this category */
  purl?: Maybe<Scalars['String']['output']>;
  /** List of relevant queries that use this category as input */
  relevantEdgeQueries: Array<EdgeQuery>;
  /** List of relevant queries that use this category as input */
  relevantQueries: Array<GraphQuery>;
  /** The graph this category belongs to */
  sourceDescriptor: StructureDescriptor;
  /** List of tags associated with this category */
  tags: Array<CategoryTag>;
  /** The graph this category belongs to */
  targetDescriptor: StructureDescriptor;
};


/** A relation category/schema definition */
export type StructureRelationCategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFilter>;
  ordering?: Array<CategoryTagOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Numeric/aggregatable fields of StructureRelationCategory */
export enum StructureRelationCategoryField {
  CreatedAt = 'CREATED_AT'
}

export type StructureRelationCategoryFilter = {
  AND?: InputMaybe<StructureRelationCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<StructureRelationCategoryFilter>;
  OR?: InputMaybe<StructureRelationCategoryFilter>;
  graph?: InputMaybe<GraphFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  label?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of IDs */
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by list of IDs */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type StructureRelationCategoryOrder =
  { id: Ordering; instanceKind?: never; label?: never; }
  |  { id?: never; instanceKind: Ordering; label?: never; }
  |  { id?: never; instanceKind?: never; label: Ordering; };

export type StructureRelationCategoryStats = {
  __typename?: 'StructureRelationCategoryStats';
  /** Average value */
  avg?: Maybe<Scalars['Float']['output']>;
  /** Total number of items in the selection */
  count: Scalars['Int']['output'];
  /** Count of distinct values */
  distinctCount: Scalars['Int']['output'];
  /** Maximum value */
  max?: Maybe<Scalars['Float']['output']>;
  /** Minimum value */
  min?: Maybe<Scalars['Float']['output']>;
  /** Sum of values */
  sum?: Maybe<Scalars['Float']['output']>;
};


export type StructureRelationCategoryStatsAvgArgs = {
  field: StructureRelationCategoryField;
};


export type StructureRelationCategoryStatsDistinctCountArgs = {
  field: StructureRelationCategoryField;
};


export type StructureRelationCategoryStatsMaxArgs = {
  field: StructureRelationCategoryField;
};


export type StructureRelationCategoryStatsMinArgs = {
  field: StructureRelationCategoryField;
};


export type StructureRelationCategoryStatsSumArgs = {
  field: StructureRelationCategoryField;
};

/** Filter options for querying structure relations */
export type StructureRelationFilter = {
  /** Filter structure relations that have a specific property */
  hasProperty?: InputMaybe<Scalars['String']['input']>;
  /** Filter by specific structure relation IDs */
  ids?: InputMaybe<Array<Scalars['GraphID']['input']>>;
  /** Filter structure relations that match specific property conditions */
  matches?: InputMaybe<Array<PropertyMatch>>;
  /** Full-text search over structure relation properties */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Ordering options for structure relation queries */
export type StructureRelationOrder = {
  /** Order by structure relation category */
  category?: InputMaybe<Ordering>;
  /** Order by creation timestamp */
  createdAt?: InputMaybe<Ordering>;
  /** Order by structure relation ID */
  id?: InputMaybe<Ordering>;
  /** Order by a specific property value */
  property?: InputMaybe<PropertyOrder>;
};

/** Pagination options for querying structure relations */
export type StructureRelationPaginationInput = {
  /** Maximum number of items to return */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to skip */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Graph Engine Subscriptions */
export type Subscription = {
  __typename?: 'Subscription';
  /** Subscribe to updates for a specific graph */
  graphUpdated: Graph;
};


/** Graph Engine Subscriptions */
export type SubscriptionGraphUpdatedArgs = {
  graphId: Scalars['GraphID']['input'];
};

/** Input for updating a category tag */
export type UpdateCategoryTagInput = {
  /** Updated category tag description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The category tag ID */
  id: Scalars['String']['input'];
  /** Updated human-readable name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Updated unique tag value */
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an edge pairs query */
export type UpdateEdgePairsQueryInput = {
  /** Description of this edge query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the edge pairs query to update */
  id: Scalars['String']['input'];
  /** Unique key for this edge query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this edge query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Updated Cypher query string */
  query?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an edge path query */
export type UpdateEdgePathQueryInput = {
  /** Description of this edge query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the edge path query to update */
  id: Scalars['String']['input'];
  /** Unique key for this edge query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this edge query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Updated Cypher query string */
  query?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an edge table query */
export type UpdateEdgeTableQueryInput = {
  /** Definitions for the columns returned by this edge table query */
  columnInput?: InputMaybe<Array<ColumnInput>>;
  /** Description of this edge query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the edge table query to update */
  id: Scalars['String']['input'];
  /** Unique key for this edge query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this edge query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Updated Cypher query string */
  query?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an existing entity definition in the graph schema */
export type UpdateEntityDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the definition to update */
  id: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Optional instance kind for this entity category (e.g. 'neuron', 'synapse', 'behavior'). This is used for further categorization and filtering of entities within the graph. */
  instanceKind?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: InputMaybe<Array<OntologyReferenceInput>>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: InputMaybe<Array<PropertyDefinitionInput>>;
  /** Sequence mappings for this node */
  sequences?: InputMaybe<Array<SequenceMappingInput>>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Input for updating an existing entity */
export type UpdateEntityInput = {
  /** The ID of the entity to update */
  id: Scalars['String']['input'];
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
};

/** Input for updating an existing graph */
export type UpdateGraphInput = {
  /** Optional archived flag update */
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  /** New graph description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph to update */
  id: Scalars['String']['input'];
  /** New graph name */
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating a graph pairs query */
export type UpdateGraphPairsQueryInput = {
  /** Description of this graph query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph pairs query to update */
  id: Scalars['String']['input'];
  /** Unique key for this graph query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** Human-readable name for this graph query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Updated Cypher query string */
  query?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating a graph path query */
export type UpdateGraphPathQueryInput = {
  /** Description of this graph query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph path query to update */
  id: Scalars['String']['input'];
  /** Unique key for this graph query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** Human-readable name for this graph query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Updated Cypher query string */
  query?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating a graph table query through builder arguments */
export type UpdateGraphTableQueryInput = {
  /** Definitions for the columns returned by this graph query */
  columnInput?: InputMaybe<Array<ColumnInput>>;
  /** The Cypher query string that defines this graph query. Can include parameter placeholders (e.g. $param) for dynamic filtering */
  cypher?: InputMaybe<Scalars['String']['input']>;
  /** Description of this graph query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph query to update */
  id: Scalars['String']['input'];
  /** Unique key for this graph query, used for referencing in the UI */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Human-readable name for this graph query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Cypher query string that defines this graph query */
  query?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an existing measurement definition in the graph schema */
export type UpdateMeasurementDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the measurement category to update */
  id: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Optional instance kind for this entity category (e.g. 'neuron', 'synapse', 'behavior'). This is used for further categorization and filtering of entities within the graph. */
  instanceKind?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for updating an existing measurement edge */
export type UpdateMeasurementInput = {
  /** The ID of the measurement to update */
  id: Scalars['String']['input'];
  /** The ID of the source entity/structure */
  sourceId: Scalars['String']['input'];
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
  /** The ID of the target entity/structure */
  targetId: Scalars['String']['input'];
};

/** Input for updating an existing metric definition in the graph schema */
export type UpdateMetricDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the definition to update */
  id: Scalars['String']['input'];
  /** Optional schema identifier for this metric (e.g. '@mikro/roi') */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: InputMaybe<Array<OntologyReferenceInput>>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sequence mappings for this node */
  sequences?: InputMaybe<Array<SequenceMappingInput>>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Input for updating an existing metric */
export type UpdateMetricInput = {
  /** The ID of the metric to update */
  id: Scalars['String']['input'];
  key: Scalars['String']['input'];
  value: Scalars['AnyScalar']['input'];
};

/** Input for updating an existing natural event definition in the graph schema */
export type UpdateNaturalEventDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the event category to update */
  id: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Input node roles */
  inputs?: Array<EventRoleInput>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** The kind of event */
  kind: EventKind;
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Output node roles */
  outputs?: Array<EventRoleInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for updating an existing natural event instance */
export type UpdateNaturalEventInput = {
  /** The ID of the event category/type to create */
  eventCategory: Scalars['String']['input'];
  /** The ID of the natural event to update */
  id: Scalars['String']['input'];
  /** List of entity IDs that are inputs to this event */
  inputs?: Array<RoleMappingInput>;
  /** List of entity IDs that are outputs of this event */
  outputs?: Array<RoleMappingInput>;
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
};

/** Input for updating a node pairs query */
export type UpdateNodePairsQueryInput = {
  /** Description of this node query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the node pairs query to update */
  id: Scalars['String']['input'];
  /** Unique key for this node query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this node query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Updated Cypher query string */
  query?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating a node path query */
export type UpdateNodePathQueryInput = {
  /** Description of this node query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the node path query to update */
  id: Scalars['String']['input'];
  /** Unique key for this node query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this node query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Updated Cypher query string */
  query?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating a node table query */
export type UpdateNodeTableQueryInput = {
  /** Definitions for the columns returned by this node table query */
  columnInput?: InputMaybe<Array<ColumnInput>>;
  /** Description of this node query */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the node table query to update */
  id: Scalars['String']['input'];
  /** Unique key for this node query, used for referencing in the UI */
  key: Scalars['String']['input'];
  /** The kind/type of the query */
  kind?: Scalars['String']['input'];
  /** Human-readable name for this node query (defaults to 'key' if not provided) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Updated Cypher query string */
  query?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an existing protocol event definition in the graph schema */
export type UpdateProtocolEventDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the event category to update */
  id: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Input node roles */
  inputs?: Array<EventRoleInput>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** The kind of event */
  kind: EventKind;
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Output node roles */
  outputs?: Array<EventRoleInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** The protocol this event definition belongs to */
  protocol: Scalars['String']['input'];
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for updating an existing protocol event instance */
export type UpdateProtocolEventInput = {
  /** The ID of the event category/type to create */
  eventCategory: Scalars['String']['input'];
  /** The ID of the protocol event to update */
  id: Scalars['String']['input'];
  /** List of entity IDs that are inputs to this event */
  inputs?: Array<RoleMappingInput>;
  /** List of entity IDs that are outputs of this event */
  outputs?: Array<RoleMappingInput>;
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
};

/** Input for updating an existing relation definition in the graph schema */
export type UpdateRelationDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the entity category to update */
  id: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Optional instance kind for this entity category (e.g. 'neuron', 'synapse', 'behavior'). This is used for further categorization and filtering of entities within the graph. */
  instanceKind?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for updating an existing relation */
export type UpdateRelationInput = {
  /** The ID of the relation to update */
  id: Scalars['String']['input'];
  /** The ID of the source entity/structure */
  sourceId: Scalars['String']['input'];
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
  /** The ID of the target entity/structure */
  targetId: Scalars['String']['input'];
};

/** Input for updating a scatter plot */
export type UpdateScatterPlotInput = {
  /** Optional column key used for point color */
  colorColumn?: InputMaybe<Scalars['String']['input']>;
  /** Optional description of the scatter plot */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Optional graph table query ID used by this scatter plot */
  graphQueryId?: InputMaybe<Scalars['Int']['input']>;
  /** The database ID of the scatter plot to update */
  id: Scalars['Int']['input'];
  /** Column key used for point identifiers */
  idColumn: Scalars['String']['input'];
  /** The display name of the scatter plot */
  name: Scalars['String']['input'];
  /** Optional node table query ID used by this scatter plot */
  nodeQueryId?: InputMaybe<Scalars['Int']['input']>;
  /** Optional node path query ID used by this scatter plot */
  pathQueryId?: InputMaybe<Scalars['Int']['input']>;
  /** Optional column key used for point shape */
  shapeColumn?: InputMaybe<Scalars['String']['input']>;
  /** Optional column key used for point size */
  sizeColumn?: InputMaybe<Scalars['String']['input']>;
  /** Column key used for x-axis values */
  xColumn?: InputMaybe<Scalars['String']['input']>;
  /** Column key used for x-axis identifiers */
  xIdColumn?: InputMaybe<Scalars['String']['input']>;
  /** Column key used for y-axis values */
  yColumn?: InputMaybe<Scalars['String']['input']>;
  /** Column key used for y-axis identifiers */
  yIdColumn?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an existing structure definition in the graph schema */
export type UpdateStructureDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the definition to update */
  id: Scalars['String']['input'];
  /** Optional schema identifier for this structure (e.g. '@mikro/roi') */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: InputMaybe<Array<OntologyReferenceInput>>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sequence mappings for this node */
  sequences?: InputMaybe<Array<SequenceMappingInput>>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Input for updating an existing structure */
export type UpdateStructureInput = {
  /** The ID of the structure to update */
  id: Scalars['String']['input'];
  /** List of measurements associated with this structure */
  metrics?: Array<MetricInput>;
  /** The unique ID of the object this structure references */
  object: Scalars['String']['input'];
};

/** Input for updating an existing structure relation definition in the graph schema */
export type UpdateStructureRelationDefinitionInput = {
  /** Optional RGBA color for this node role (e.g. [255, 0, 0, 128]) */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Description of this node role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the structure relation category to update */
  id: Scalars['String']['input'];
  /** Optional media store ID for an image representing this node role */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Optional instance kind for this entity category (e.g. 'neuron', 'synapse', 'behavior'). This is used for further categorization and filtering of entities within the graph. */
  instanceKind?: InputMaybe<Scalars['String']['input']>;
  /** The label of the node participating in the event */
  key: Scalars['String']['input'];
  /** Optional human-readable label for this node role (defaults to 'key' if not provided) */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Ontology references for this event */
  ontologyReferences?: Array<OntologyReferenceInput>;
  /** Whether to pin this node role in the UI */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Property definitions */
  properties?: Array<PropertyDefinitionInput>;
  /** Sequence mappings for this node */
  sequences?: Array<SequenceMappingInput>;
  /** Optional tags for this node role (e.g. 'cell_body', 'dendrite', 'axon') */
  tags?: Array<Scalars['String']['input']>;
};

/** Input for updating an existing structure relation */
export type UpdateStructureRelationInput = {
  /** The ID of the structure relation to update */
  id: Scalars['String']['input'];
  /** The ID of the source entity/structure */
  sourceId: Scalars['String']['input'];
  /** List of evidence structures with measurements */
  supportingEvidence?: Array<StructureReferenceInput>;
  /** The ID of the target entity/structure */
  targetId: Scalars['String']['input'];
};

export enum ValueKind {
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

/** Interface for versioned nodes with schema tracking */
export type VersionedNode = {
  /** External ID if set */
  externalId?: Maybe<Scalars['String']['output']>;
  /** Global identifier in format 'graph_name:graph_id' */
  globalId: Scalars['GlobalID']['output'];
  /** The graph this node belongs to */
  graph: Graph;
  /** Local AGE graph ID */
  graphId: Scalars['Int']['output'];
  /** Composite ID for node lookup */
  id: Scalars['String']['output'];
  /** The AGE graph label as recently materialized (e.g. 'Cell IAC100', 'ROI 1') */
  label: Scalars['String']['output'];
  /** Timestamp when properties were last derived (unix ms) */
  lastDerived?: Maybe<Scalars['UnixMilliseconds']['output']>;
  /** External object ID this entity references */
  lifecycle?: Maybe<Scalars['String']['output']>;
  /** Local ID if set */
  localId?: Maybe<Scalars['String']['output']>;
  /** Schema version used to derive properties */
  schemaVersion: Scalars['String']['output'];
  /** Tags associated with this node */
  tags: Array<Scalars['String']['output']>;
};

/** Input type for defining a graph schema */
export type WhereClause = {
  __typename?: 'WhereClause';
  node?: Maybe<Scalars['String']['output']>;
  /** The operator to use for filtering */
  operator: WhereOperator;
  path: Scalars['String']['output'];
  /** The property name to filter on */
  property: Scalars['String']['output'];
  /** The value to compare against */
  value: Scalars['String']['output'];
};

/** Input for a where clause in a graph table query builder */
export type WhereClauseInput = {
  node?: InputMaybe<Scalars['String']['input']>;
  /** The operator to use for filtering */
  operator: WhereOperator;
  path: Scalars['String']['input'];
  /** The property name to filter on */
  property: Scalars['String']['input'];
  /** The value to compare against */
  value: Scalars['String']['input'];
};

export enum WhereOperator {
  Contains = 'CONTAINS',
  EndsWith = 'ENDS_WITH',
  Equals = 'EQUALS',
  GreaterOrEqual = 'GREATER_OR_EQUAL',
  GreaterThan = 'GREATER_THAN',
  In = 'IN',
  LessOrEqual = 'LESS_OR_EQUAL',
  LessThan = 'LESS_THAN',
  NotEquals = 'NOT_EQUALS',
  NotIn = 'NOT_IN',
  StartsWith = 'STARTS_WITH'
}

export type _Entity = CategoryTag | EdgePairsQuery | EdgePathQuery | EdgeTableQuery | EntityCategory | Graph | GraphNodesQuery | GraphPairsQuery | GraphPathQuery | GraphTableQuery | MaterializedEdge | MeasurementCategory | MediaStore | MetricCategory | NaturalEventCategory | NodePairsQuery | NodePathQuery | NodeTableQuery | ProtocolEventCategory | RelationCategory | ScatterPlot | StructureCategory | StructureRelationCategory;

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String']['output'];
};

type BaseNode_Assertion_Fragment = { __typename?: 'Assertion', id: string, label: string, graph: { __typename?: 'Graph', id: string } };

type BaseNode_Entity_Fragment = { __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string } };

type BaseNode_Metric_Fragment = { __typename?: 'Metric', id: string, label: string, graph: { __typename?: 'Graph', id: string } };

type BaseNode_NaturalEvent_Fragment = { __typename?: 'NaturalEvent', id: string, label: string, graph: { __typename?: 'Graph', id: string } };

type BaseNode_ProtocolEvent_Fragment = { __typename?: 'ProtocolEvent', id: string, label: string, graph: { __typename?: 'Graph', id: string } };

type BaseNode_Structure_Fragment = { __typename?: 'Structure', id: string, label: string, graph: { __typename?: 'Graph', id: string } };

export type BaseNodeFragment = BaseNode_Assertion_Fragment | BaseNode_Entity_Fragment | BaseNode_Metric_Fragment | BaseNode_NaturalEvent_Fragment | BaseNode_ProtocolEvent_Fragment | BaseNode_Structure_Fragment;

type Node_Assertion_Fragment = { __typename?: 'Assertion', id: string, label: string, graph: { __typename?: 'Graph', id: string } };

type Node_Entity_Fragment = { __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> };

type Node_Metric_Fragment = { __typename?: 'Metric', id: string, label: string, value: any, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'MetricCategory', id: string, label: string, description?: string | null } };

type Node_NaturalEvent_Fragment = { __typename?: 'NaturalEvent', id: string, label: string, graph: { __typename?: 'Graph', id: string } };

type Node_ProtocolEvent_Fragment = { __typename?: 'ProtocolEvent', id: string, label: string, graph: { __typename?: 'Graph', id: string } };

type Node_Structure_Fragment = { __typename?: 'Structure', id: string, label: string, object: string, identifier: any, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, metrics: Array<{ __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', label: string } }> };

export type NodeFragment = Node_Assertion_Fragment | Node_Entity_Fragment | Node_Metric_Fragment | Node_NaturalEvent_Fragment | Node_ProtocolEvent_Fragment | Node_Structure_Fragment;

type DetailNode_Assertion_Fragment = { __typename?: 'Assertion', id: string, label: string, graph: { __typename?: 'Graph', id: string, name: string } };

type DetailNode_Entity_Fragment = { __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string, name: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> };

type DetailNode_Metric_Fragment = { __typename?: 'Metric', id: string, label: string, value: any, graph: { __typename?: 'Graph', id: string, name: string }, category: { __typename?: 'MetricCategory', id: string, label: string, description?: string | null } };

type DetailNode_NaturalEvent_Fragment = { __typename?: 'NaturalEvent', id: string, label: string, graph: { __typename?: 'Graph', id: string, name: string } };

type DetailNode_ProtocolEvent_Fragment = { __typename?: 'ProtocolEvent', id: string, label: string, graph: { __typename?: 'Graph', id: string, name: string } };

type DetailNode_Structure_Fragment = { __typename?: 'Structure', id: string, label: string, object: string, identifier: any, graph: { __typename?: 'Graph', id: string, name: string }, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, metrics: Array<{ __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', label: string } }> };

export type DetailNodeFragment = DetailNode_Assertion_Fragment | DetailNode_Entity_Fragment | DetailNode_Metric_Fragment | DetailNode_NaturalEvent_Fragment | DetailNode_ProtocolEvent_Fragment | DetailNode_Structure_Fragment;

type PathNode_Assertion_Fragment = { __typename?: 'Assertion', id: string };

type PathNode_Entity_Fragment = { __typename?: 'Entity', id: string, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, image: { __typename?: 'MediaStore', presignedUrl: string } } };

type PathNode_Metric_Fragment = { __typename?: 'Metric', id: string, value: any, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, image: { __typename?: 'MediaStore', presignedUrl: string } } };

type PathNode_NaturalEvent_Fragment = { __typename?: 'NaturalEvent', id: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string, id: string, image: { __typename?: 'MediaStore', presignedUrl: string } } };

type PathNode_ProtocolEvent_Fragment = { __typename?: 'ProtocolEvent', id: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, image: { __typename?: 'MediaStore', presignedUrl: string } }, richProperties: Array<{ __typename?: 'RichProperty', value?: any | null }> };

type PathNode_Structure_Fragment = { __typename?: 'Structure', id: string, object: string, category: { __typename?: 'StructureCategory', identifier: string, id: string, image: { __typename?: 'MediaStore', presignedUrl: string } } };

export type PathNodeFragment = PathNode_Assertion_Fragment | PathNode_Entity_Fragment | PathNode_Metric_Fragment | PathNode_NaturalEvent_Fragment | PathNode_ProtocolEvent_Fragment | PathNode_Structure_Fragment;

export type PresignedPostCredentialsFragment = { __typename?: 'PresignedPostCredentials', key: string, xAmzCredential: string, xAmzAlgorithm: string, xAmzDate: string, xAmzSignature: string, policy: string, datalayer: string, bucket: string, store: string };

type BaseEdge_Asserted_Fragment = { __typename?: 'Asserted', id: string, sourceId: string, targetId: string };

type BaseEdge_InputParticipation_Fragment = { __typename?: 'InputParticipation', id: string, sourceId: string, targetId: string };

type BaseEdge_Measurement_Fragment = { __typename?: 'Measurement', id: string, sourceId: string, targetId: string };

type BaseEdge_OutputParticipation_Fragment = { __typename?: 'OutputParticipation', id: string, sourceId: string, targetId: string };

type BaseEdge_Relation_Fragment = { __typename?: 'Relation', id: string, sourceId: string, targetId: string };

type BaseEdge_StructureRelation_Fragment = { __typename?: 'StructureRelation', id: string, sourceId: string, targetId: string };

export type BaseEdgeFragment = BaseEdge_Asserted_Fragment | BaseEdge_InputParticipation_Fragment | BaseEdge_Measurement_Fragment | BaseEdge_OutputParticipation_Fragment | BaseEdge_Relation_Fragment | BaseEdge_StructureRelation_Fragment;

export type MeasurementFragment = { __typename?: 'Measurement', category: { __typename?: 'MeasurementCategory', id: string, label: string } };

export type RelationFragment = { __typename?: 'Relation', category: { __typename?: 'RelationCategory', id: string, label: string } };

export type StructureRelationFragment = { __typename?: 'StructureRelation', id: string, sourceId: string, targetId: string, source: { __typename?: 'Structure', id: string, label: string }, target: { __typename?: 'Structure', id: string, label: string }, category: { __typename?: 'StructureRelationCategory', id: string, label: string } };

type Edge_Asserted_Fragment = { __typename?: 'Asserted', sourceId: string, targetId: string, id: string };

type Edge_InputParticipation_Fragment = { __typename?: 'InputParticipation', sourceId: string, targetId: string, id: string };

type Edge_Measurement_Fragment = { __typename?: 'Measurement', sourceId: string, targetId: string, id: string, category: { __typename?: 'MeasurementCategory', id: string, label: string } };

type Edge_OutputParticipation_Fragment = { __typename?: 'OutputParticipation', sourceId: string, targetId: string, id: string };

type Edge_Relation_Fragment = { __typename?: 'Relation', sourceId: string, targetId: string, id: string, category: { __typename?: 'RelationCategory', id: string, label: string } };

type Edge_StructureRelation_Fragment = { __typename?: 'StructureRelation', sourceId: string, targetId: string, id: string, source: { __typename?: 'Structure', id: string, label: string }, target: { __typename?: 'Structure', id: string, label: string }, category: { __typename?: 'StructureRelationCategory', id: string, label: string } };

export type EdgeFragment = Edge_Asserted_Fragment | Edge_InputParticipation_Fragment | Edge_Measurement_Fragment | Edge_OutputParticipation_Fragment | Edge_Relation_Fragment | Edge_StructureRelation_Fragment;

export type EntityFragment = { __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> };

export type PathEntityFragment = { __typename?: 'Entity', externalId?: string | null, id: string, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, image: { __typename?: 'MediaStore', presignedUrl: string } } };

export type ListEntityFragment = { __typename?: 'Entity', id: string, label: string, category: { __typename?: 'EntityCategory', id: string, label: string } };

type BaseEdgeQuery_EdgePairsQuery_Fragment = { __typename?: 'EdgePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type BaseEdgeQuery_EdgePathQuery_Fragment = { __typename?: 'EdgePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type BaseEdgeQuery_EdgeTableQuery_Fragment = { __typename?: 'EdgeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

export type BaseEdgeQueryFragment = BaseEdgeQuery_EdgePairsQuery_Fragment | BaseEdgeQuery_EdgePathQuery_Fragment | BaseEdgeQuery_EdgeTableQuery_Fragment;

type ListEdgeQuery_EdgePairsQuery_Fragment = { __typename: 'EdgePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type ListEdgeQuery_EdgePathQuery_Fragment = { __typename: 'EdgePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type ListEdgeQuery_EdgeTableQuery_Fragment = { __typename: 'EdgeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

export type ListEdgeQueryFragment = ListEdgeQuery_EdgePairsQuery_Fragment | ListEdgeQuery_EdgePathQuery_Fragment | ListEdgeQuery_EdgeTableQuery_Fragment;

type EdgeQuery_EdgePairsQuery_Fragment = { __typename?: 'EdgePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type EdgeQuery_EdgePathQuery_Fragment = { __typename?: 'EdgePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type EdgeQuery_EdgeTableQuery_Fragment = { __typename?: 'EdgeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string }, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null };

export type EdgeQueryFragment = EdgeQuery_EdgePairsQuery_Fragment | EdgeQuery_EdgePathQuery_Fragment | EdgeQuery_EdgeTableQuery_Fragment;

export type EdgeTableQueryFragment = { __typename?: 'EdgeTableQuery', id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } };

type BaseGraphQuery_GraphNodesQuery_Fragment = { __typename?: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type BaseGraphQuery_GraphPairsQuery_Fragment = { __typename?: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type BaseGraphQuery_GraphPathQuery_Fragment = { __typename?: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type BaseGraphQuery_GraphTableQuery_Fragment = { __typename?: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

export type BaseGraphQueryFragment = BaseGraphQuery_GraphNodesQuery_Fragment | BaseGraphQuery_GraphPairsQuery_Fragment | BaseGraphQuery_GraphPathQuery_Fragment | BaseGraphQuery_GraphTableQuery_Fragment;

type ListGraphQuery_GraphNodesQuery_Fragment = { __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type ListGraphQuery_GraphPairsQuery_Fragment = { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type ListGraphQuery_GraphPathQuery_Fragment = { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type ListGraphQuery_GraphTableQuery_Fragment = { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

export type ListGraphQueryFragment = ListGraphQuery_GraphNodesQuery_Fragment | ListGraphQuery_GraphPairsQuery_Fragment | ListGraphQuery_GraphPathQuery_Fragment | ListGraphQuery_GraphTableQuery_Fragment;

type GraphQuery_GraphNodesQuery_Fragment = { __typename?: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type GraphQuery_GraphPairsQuery_Fragment = { __typename?: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type GraphQuery_GraphPathQuery_Fragment = { __typename?: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type GraphQuery_GraphTableQuery_Fragment = { __typename?: 'GraphTableQuery', id: string, label: string, description?: string | null, query: any, graph: { __typename?: 'Graph', id: string, name: string }, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null };

export type GraphQueryFragment = GraphQuery_GraphNodesQuery_Fragment | GraphQuery_GraphPairsQuery_Fragment | GraphQuery_GraphPathQuery_Fragment | GraphQuery_GraphTableQuery_Fragment;

export type ListGraphTableQueryFragment = { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

export type GraphTableQueryFragment = { __typename?: 'GraphTableQuery', query: any, id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } };

export type GraphTableRenderFragment = { __typename?: 'GraphTableRender', rows: Array<any>, query: { __typename?: 'GraphTableQuery', columns: Array<{ __typename?: 'Column', key: string, label?: string | null, valueKind?: ValueKind | null, description?: string | null }> } };

type BaseNodeQuery_NodePairsQuery_Fragment = { __typename?: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type BaseNodeQuery_NodePathQuery_Fragment = { __typename?: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type BaseNodeQuery_NodeTableQuery_Fragment = { __typename?: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

export type BaseNodeQueryFragment = BaseNodeQuery_NodePairsQuery_Fragment | BaseNodeQuery_NodePathQuery_Fragment | BaseNodeQuery_NodeTableQuery_Fragment;

type ListNodeQuery_NodePairsQuery_Fragment = { __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type ListNodeQuery_NodePathQuery_Fragment = { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type ListNodeQuery_NodeTableQuery_Fragment = { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

export type ListNodeQueryFragment = ListNodeQuery_NodePairsQuery_Fragment | ListNodeQuery_NodePathQuery_Fragment | ListNodeQuery_NodeTableQuery_Fragment;

type NodeQuery_NodePairsQuery_Fragment = { __typename?: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type NodeQuery_NodePathQuery_Fragment = { __typename?: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } };

type NodeQuery_NodeTableQuery_Fragment = { __typename?: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string }, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null };

export type NodeQueryFragment = NodeQuery_NodePairsQuery_Fragment | NodeQuery_NodePathQuery_Fragment | NodeQuery_NodeTableQuery_Fragment;

export type NodeTableQueryFragment = { __typename?: 'NodeTableQuery', id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } };

export type ScatterPlotFragment = { __typename?: 'ScatterPlot', id: string, label: string, description?: string | null, xColumn: string, yColumn: string, idColumn: string, colorColumn?: string | null, sizeColumn?: string | null, shapeColumn?: string | null, query: { __typename?: 'EdgeTableQuery', id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename?: 'GraphTableQuery', query: any, id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename?: 'NodeTableQuery', id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } };

export type ListScatterPlotFragment = { __typename?: 'ScatterPlot', id: string, label: string, xColumn: string, yColumn: string };

export type MatchPathFragment = { __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean };

export type ReturnStatementFragment = { __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null };

export type WhereClauseFragment = { __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string };

export type ColumnFragment = { __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean };

export type BuilderArgsFragment = { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null };

export type PathMeasurementFragment = { __typename?: 'Measurement', measuredTo?: any | null, measuredFrom?: any | null, sourceId: string, targetId: string, category: { __typename?: 'MeasurementCategory', id: string, label: string } };

export type MetricFragment = { __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', id: string, label: string, description?: string | null } };

export type ListMetricFragment = { __typename?: 'Metric', id: string, value: any, label: string };

export type PathMetricFragment = { __typename?: 'Metric', value: any, id: string, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, image: { __typename?: 'MediaStore', presignedUrl: string } } };

export type NaturalEventFragment = { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, graph: { __typename?: 'Graph', id: string } };

export type ListNaturalEventFragment = { __typename?: 'NaturalEvent', id: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string, id: string } };

export type PathNaturalEventFragment = { __typename?: 'NaturalEvent', id: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string, id: string, image: { __typename?: 'MediaStore', presignedUrl: string } } };

export type PropertyDefinitionFragment = { __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null };

export type ProtocolEventFragment = { __typename?: 'ProtocolEvent', id: string, measuredFrom: any, label: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string }, graph: { __typename?: 'Graph', id: string } };

export type ListProtocolEventFragment = { __typename?: 'ProtocolEvent', id: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'ProtocolEventCategory', label: string, id: string } };

export type PathProtocolEventFragment = { __typename?: 'ProtocolEvent', id: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, image: { __typename?: 'MediaStore', presignedUrl: string } }, richProperties: Array<{ __typename?: 'RichProperty', value?: any | null }> };

export type PathRelationFragment = { __typename?: 'Relation', id: string, measuredFrom?: any | null, measuredTo?: any | null, sourceId: string, targetId: string, category: { __typename?: 'RelationCategory', id: string, label: string } };

type BaseCategory_EntityCategory_Fragment = { __typename?: 'EntityCategory', id: string, purl?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string } };

type BaseCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', id: string, purl?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string } };

type BaseCategory_MetricCategory_Fragment = { __typename?: 'MetricCategory', id: string, purl?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string } };

type BaseCategory_NaturalEventCategory_Fragment = { __typename?: 'NaturalEventCategory', id: string, purl?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string } };

type BaseCategory_ProtocolEventCategory_Fragment = { __typename?: 'ProtocolEventCategory', id: string, purl?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string } };

type BaseCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string, purl?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string } };

type BaseCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string, purl?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string } };

type BaseCategory_StructureRelationCategory_Fragment = { __typename?: 'StructureRelationCategory', id: string, purl?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string } };

export type BaseCategoryFragment = BaseCategory_EntityCategory_Fragment | BaseCategory_MeasurementCategory_Fragment | BaseCategory_MetricCategory_Fragment | BaseCategory_NaturalEventCategory_Fragment | BaseCategory_ProtocolEventCategory_Fragment | BaseCategory_RelationCategory_Fragment | BaseCategory_StructureCategory_Fragment | BaseCategory_StructureRelationCategory_Fragment;

type BaseNodeCategory_EntityCategory_Fragment = { __typename?: 'EntityCategory', id: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

type BaseNodeCategory_MetricCategory_Fragment = { __typename?: 'MetricCategory', id: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

type BaseNodeCategory_NaturalEventCategory_Fragment = { __typename?: 'NaturalEventCategory', id: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

type BaseNodeCategory_ProtocolEventCategory_Fragment = { __typename?: 'ProtocolEventCategory', id: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

type BaseNodeCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type BaseNodeCategoryFragment = BaseNodeCategory_EntityCategory_Fragment | BaseNodeCategory_MetricCategory_Fragment | BaseNodeCategory_NaturalEventCategory_Fragment | BaseNodeCategory_ProtocolEventCategory_Fragment | BaseNodeCategory_StructureCategory_Fragment;

type BaseEdgeCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', id: string };

type BaseEdgeCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string };

type BaseEdgeCategory_StructureRelationCategory_Fragment = { __typename?: 'StructureRelationCategory', id: string };

export type BaseEdgeCategoryFragment = BaseEdgeCategory_MeasurementCategory_Fragment | BaseEdgeCategory_RelationCategory_Fragment | BaseEdgeCategory_StructureRelationCategory_Fragment;

type NodeCategory_EntityCategory_Fragment = { __typename?: 'EntityCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, latest: Array<{ __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

type NodeCategory_MetricCategory_Fragment = { __typename?: 'MetricCategory', ageName: string, label: string, valueKind: ValueKind, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

type NodeCategory_NaturalEventCategory_Fragment = { __typename?: 'NaturalEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

type NodeCategory_ProtocolEventCategory_Fragment = { __typename?: 'ProtocolEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

type NodeCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type NodeCategoryFragment = NodeCategory_EntityCategory_Fragment | NodeCategory_MetricCategory_Fragment | NodeCategory_NaturalEventCategory_Fragment | NodeCategory_ProtocolEventCategory_Fragment | NodeCategory_StructureCategory_Fragment;

export type EntityCategoryFragment = { __typename?: 'EntityCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, latest: Array<{ __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type ListEntityCategoryFragment = { __typename?: 'EntityCategory', instanceKind?: string | null, label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type ListMaterializedEdgeFragment = { __typename?: 'MaterializedEdge', id: string, source: { __typename?: 'EntityCategory', id: string } | { __typename?: 'MetricCategory', id: string } | { __typename?: 'NaturalEventCategory', id: string } | { __typename?: 'ProtocolEventCategory', id: string } | { __typename?: 'StructureCategory', id: string }, target: { __typename?: 'EntityCategory', id: string, label: string } | { __typename?: 'MetricCategory', id: string, label: string } | { __typename?: 'NaturalEventCategory', id: string, label: string } | { __typename?: 'ProtocolEventCategory', id: string, label: string } | { __typename?: 'StructureCategory', id: string, label: string }, edge: { __typename?: 'MeasurementCategory', id: string, label: string, description?: string | null } | { __typename?: 'RelationCategory', id: string, label: string, description?: string | null } | { __typename?: 'StructureRelationCategory', id: string, label: string, description?: string | null }, graph: { __typename?: 'Graph', id: string, name: string } };

export type GraphFragment = { __typename?: 'Graph', id: string, name: string, description?: string | null, ageName: string, pinned: boolean, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind?: string | null, label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, metricCategories: Array<{ __typename?: 'MetricCategory', label: string, valueKind: ValueKind, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, structureCategory: { __typename?: 'StructureCategory', id: string, identifier: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, queries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string }, materializedEdges: Array<{ __typename?: 'MaterializedEdge', id: string, source: { __typename?: 'EntityCategory', id: string } | { __typename?: 'MetricCategory', id: string } | { __typename?: 'NaturalEventCategory', id: string } | { __typename?: 'ProtocolEventCategory', id: string } | { __typename?: 'StructureCategory', id: string }, target: { __typename?: 'EntityCategory', id: string, label: string } | { __typename?: 'MetricCategory', id: string, label: string } | { __typename?: 'NaturalEventCategory', id: string, label: string } | { __typename?: 'ProtocolEventCategory', id: string, label: string } | { __typename?: 'StructureCategory', id: string, label: string }, edge: { __typename?: 'MeasurementCategory', id: string, label: string, description?: string | null } | { __typename?: 'RelationCategory', id: string, label: string, description?: string | null } | { __typename?: 'StructureRelationCategory', id: string, label: string, description?: string | null }, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type ListGraphFragment = { __typename?: 'Graph', id: string, name: string, description?: string | null, pinned: boolean, image: { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string } };

type BaseListCategory_EntityCategory_Fragment = { __typename?: 'EntityCategory', id: string, description?: string | null, ageName: string, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

type BaseListCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', id: string, description?: string | null, ageName: string, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

type BaseListCategory_MetricCategory_Fragment = { __typename?: 'MetricCategory', id: string, description?: string | null, ageName: string, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

type BaseListCategory_NaturalEventCategory_Fragment = { __typename?: 'NaturalEventCategory', id: string, description?: string | null, ageName: string, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

type BaseListCategory_ProtocolEventCategory_Fragment = { __typename?: 'ProtocolEventCategory', id: string, description?: string | null, ageName: string, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

type BaseListCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string, description?: string | null, ageName: string, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

type BaseListCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string, description?: string | null, ageName: string, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

type BaseListCategory_StructureRelationCategory_Fragment = { __typename?: 'StructureRelationCategory', id: string, description?: string | null, ageName: string, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

export type BaseListCategoryFragment = BaseListCategory_EntityCategory_Fragment | BaseListCategory_MeasurementCategory_Fragment | BaseListCategory_MetricCategory_Fragment | BaseListCategory_NaturalEventCategory_Fragment | BaseListCategory_ProtocolEventCategory_Fragment | BaseListCategory_RelationCategory_Fragment | BaseListCategory_StructureCategory_Fragment | BaseListCategory_StructureRelationCategory_Fragment;

type BaseListNodeCategory_EntityCategory_Fragment = { __typename?: 'EntityCategory', id: string, positionX: number, positionY: number, width?: number | null, height?: number | null };

type BaseListNodeCategory_MetricCategory_Fragment = { __typename?: 'MetricCategory', id: string, positionX: number, positionY: number, width?: number | null, height?: number | null };

type BaseListNodeCategory_NaturalEventCategory_Fragment = { __typename?: 'NaturalEventCategory', id: string, positionX: number, positionY: number, width?: number | null, height?: number | null };

type BaseListNodeCategory_ProtocolEventCategory_Fragment = { __typename?: 'ProtocolEventCategory', id: string, positionX: number, positionY: number, width?: number | null, height?: number | null };

type BaseListNodeCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string, positionX: number, positionY: number, width?: number | null, height?: number | null };

export type BaseListNodeCategoryFragment = BaseListNodeCategory_EntityCategory_Fragment | BaseListNodeCategory_MetricCategory_Fragment | BaseListNodeCategory_NaturalEventCategory_Fragment | BaseListNodeCategory_ProtocolEventCategory_Fragment | BaseListNodeCategory_StructureCategory_Fragment;

type BaseListEdgeCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', id: string };

type BaseListEdgeCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string };

type BaseListEdgeCategory_StructureRelationCategory_Fragment = { __typename?: 'StructureRelationCategory', id: string };

export type BaseListEdgeCategoryFragment = BaseListEdgeCategory_MeasurementCategory_Fragment | BaseListEdgeCategory_RelationCategory_Fragment | BaseListEdgeCategory_StructureRelationCategory_Fragment;

export type MaterializedEdgeFragment = { __typename?: 'MaterializedEdge', id: string, graph: { __typename?: 'Graph', id: string, name: string }, source: { __typename?: 'EntityCategory', id: string, label: string, description?: string | null } | { __typename?: 'MetricCategory', id: string, label: string, description?: string | null } | { __typename?: 'NaturalEventCategory', id: string, label: string, description?: string | null } | { __typename?: 'ProtocolEventCategory', id: string, label: string, description?: string | null } | { __typename?: 'StructureCategory', id: string, label: string, description?: string | null }, target: { __typename?: 'EntityCategory', id: string, label: string, description?: string | null } | { __typename?: 'MetricCategory', id: string, label: string, description?: string | null } | { __typename?: 'NaturalEventCategory', id: string, label: string, description?: string | null } | { __typename?: 'ProtocolEventCategory', id: string, label: string, description?: string | null } | { __typename?: 'StructureCategory', id: string, label: string, description?: string | null } };

export type MeasurementCategoryFragment = { __typename?: 'MeasurementCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type ListMeasurementCategoryFragment = { __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

export type ListMeasurementCategoryWithGraphFragment = { __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string, name: string }, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

export type MetricCategoryFragment = { __typename?: 'MetricCategory', ageName: string, label: string, valueKind: ValueKind, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type ListMetricCategoryFragment = { __typename?: 'MetricCategory', label: string, valueKind: ValueKind, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, structureCategory: { __typename?: 'StructureCategory', id: string, identifier: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type NaturalEventCategoryFragment = { __typename?: 'NaturalEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type ListNaturalEventCategoryFragment = { __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type ProtocolEventCategoryFragment = { __typename?: 'ProtocolEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type ListProtocolEventCategoryFragment = { __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type RelationCategoryFragment = { __typename?: 'RelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type ListRelationCategoryFragment = { __typename?: 'RelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

export type EventRoleFragment = { __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } };

export type EntityDescriptorFragment = { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null };

export type StructureDescriptorFragment = { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null };

export type StructureCategoryFragment = { __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type ListStructureCategoryFragment = { __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type StructureRelationCategoryFragment = { __typename?: 'StructureRelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type ListStructureRelationCategoryFragment = { __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

export type ListStructureRelationCategoryWithGraphFragment = { __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string, name: string, description?: string | null }, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> };

export type MediaStoreFragment = { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string };

export type StructureFragment = { __typename?: 'Structure', id: string, object: string, identifier: any, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, metrics: Array<{ __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', label: string } }>, graph: { __typename?: 'Graph', id: string } };

export type ListStructureFragment = { __typename?: 'Structure', id: string, category: { __typename?: 'StructureCategory', identifier: string, id: string } };

export type PathStructureFragment = { __typename?: 'Structure', object: string, id: string, category: { __typename?: 'StructureCategory', identifier: string, id: string, image: { __typename?: 'MediaStore', presignedUrl: string } } };

export type InformedStructureFragment = { __typename?: 'Structure', id: string, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string }, graph: { __typename?: 'Graph', id: string, name: string }, metrics: Array<{ __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', label: string } }> };

export type DetailStructureRelationFragment = { __typename?: 'StructureRelation', id: string, measuredFrom?: any | null, measuredTo?: any | null, sourceId: string, targetId: string, category: { __typename?: 'StructureRelationCategory', id: string, label: string }, source: { __typename?: 'Structure', identifier: any, object: string }, target: { __typename?: 'Structure', identifier: any, object: string } };

export type CreateEntityMutationVariables = Exact<{
  input: CreateEntityInput;
}>;


export type CreateEntityMutation = { __typename?: 'Mutation', createEntity: { __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> } };

export type UpdateEntityMutationVariables = Exact<{
  input: UpdateEntityInput;
}>;


export type UpdateEntityMutation = { __typename?: 'Mutation', updateEntity: { __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> } };

export type CreateEntityInlineMutationVariables = Exact<{
  category: Scalars['String']['input'];
}>;


export type CreateEntityInlineMutation = { __typename?: 'Mutation', result: { __typename?: 'Entity', value: string, label: string } };

export type ArchiveEntityMutationVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type ArchiveEntityMutation = { __typename?: 'Mutation', archiveEntity: { __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> } };

export type DeleteEntityMutationVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type DeleteEntityMutation = { __typename?: 'Mutation', deleteEntity: string };

export type CreateGraphTableQueryMutationVariables = Exact<{
  input: CreateGraphTableQueryInput;
}>;


export type CreateGraphTableQueryMutation = { __typename?: 'Mutation', createGraphTableQuery: { __typename?: 'GraphTableQuery', query: any, id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } };

export type UpdateGraphTableQueryMutationVariables = Exact<{
  input: UpdateGraphTableQueryInput;
}>;


export type UpdateGraphTableQueryMutation = { __typename?: 'Mutation', updateGraphTableQuery: { __typename?: 'GraphTableQuery', query: any, id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } };

export type DeleteGraphTableQueryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteGraphTableQueryMutation = { __typename?: 'Mutation', deleteGraphTableQuery: string };

export type CreateNodeTableQueryMutationVariables = Exact<{
  input: CreateNodeTableQueryInput;
}>;


export type CreateNodeTableQueryMutation = { __typename?: 'Mutation', createNodeTableQuery: { __typename?: 'NodeTableQuery', id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } };

export type UpdateNodeTableQueryMutationVariables = Exact<{
  input: UpdateNodeTableQueryInput;
}>;


export type UpdateNodeTableQueryMutation = { __typename?: 'Mutation', updateNodeTableQuery: { __typename?: 'NodeTableQuery', id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } };

export type CreateScatterPlotMutationVariables = Exact<{
  input: CreateScatterPlotInput;
}>;


export type CreateScatterPlotMutation = { __typename?: 'Mutation', createScatterPlot: { __typename?: 'ScatterPlot', id: string, label: string, description?: string | null, xColumn: string, yColumn: string, idColumn: string, colorColumn?: string | null, sizeColumn?: string | null, shapeColumn?: string | null, query: { __typename?: 'EdgeTableQuery', id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename?: 'GraphTableQuery', query: any, id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename?: 'NodeTableQuery', id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } } };

export type DeleteScatterPlotMutationVariables = Exact<{
  input: DeleteScatterPlotInput;
}>;


export type DeleteScatterPlotMutation = { __typename?: 'Mutation', deleteScatterPlot: string };

export type CreateMeasurementMutationVariables = Exact<{
  input: CreateMeasurementInput;
}>;


export type CreateMeasurementMutation = { __typename?: 'Mutation', createMeasurement: { __typename?: 'Measurement', category: { __typename?: 'MeasurementCategory', id: string, label: string } } };

export type CreateMetricMutationVariables = Exact<{
  input: CreateMetricInput;
}>;


export type CreateMetricMutation = { __typename?: 'Mutation', createMetric: { __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', id: string, label: string, description?: string | null } } };

export type DeleteMetricMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteMetricMutation = { __typename?: 'Mutation', deleteMetric: string };

export type ArchiveMetricMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ArchiveMetricMutation = { __typename?: 'Mutation', archiveMetric: { __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', id: string, label: string, description?: string | null } } };

export type UpdateMetricMutationVariables = Exact<{
  input: UpdateMetricInput;
}>;


export type UpdateMetricMutation = { __typename?: 'Mutation', updateMetric: { __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', id: string, label: string, description?: string | null } } };

export type CreateNaturalEventMutationVariables = Exact<{
  input: CreateNaturalEventInput;
}>;


export type CreateNaturalEventMutation = { __typename?: 'Mutation', createNaturalEvent: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, graph: { __typename?: 'Graph', id: string } } };

export type DeleteNaturalEventMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteNaturalEventMutation = { __typename?: 'Mutation', deleteNaturalEvent: string };

export type ArchiveNaturalEventMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ArchiveNaturalEventMutation = { __typename?: 'Mutation', archiveNaturalEvent: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, graph: { __typename?: 'Graph', id: string } } };

export type UpdateNaturalEventMutationVariables = Exact<{
  input: UpdateNaturalEventInput;
}>;


export type UpdateNaturalEventMutation = { __typename?: 'Mutation', updateNaturalEvent: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, graph: { __typename?: 'Graph', id: string } } };

export type CreateProtocolEventMutationVariables = Exact<{
  input: CreateProtocolEventInput;
}>;


export type CreateProtocolEventMutation = { __typename?: 'Mutation', createProtocolEvent: { __typename?: 'ProtocolEvent', id: string, measuredFrom: any, label: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string }, graph: { __typename?: 'Graph', id: string } } };

export type DeleteProtocolEventMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteProtocolEventMutation = { __typename?: 'Mutation', deleteProtocolEvent: string };

export type ArchiveProtocolEventMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ArchiveProtocolEventMutation = { __typename?: 'Mutation', archiveProtocolEvent: { __typename?: 'ProtocolEvent', id: string, measuredFrom: any, label: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string }, graph: { __typename?: 'Graph', id: string } } };

export type UpdateProtocolEventMutationVariables = Exact<{
  input: UpdateProtocolEventInput;
}>;


export type UpdateProtocolEventMutation = { __typename?: 'Mutation', updateProtocolEvent: { __typename?: 'ProtocolEvent', id: string, measuredFrom: any, label: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string }, graph: { __typename?: 'Graph', id: string } } };

export type CreateRelationMutationVariables = Exact<{
  input: CreateRelationInput;
}>;


export type CreateRelationMutation = { __typename?: 'Mutation', createRelation: { __typename?: 'Relation', category: { __typename?: 'RelationCategory', id: string, label: string } } };

export type DeleteRelationMutationVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type DeleteRelationMutation = { __typename?: 'Mutation', deleteRelation: string };

export type ArchiveRelationMutationVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type ArchiveRelationMutation = { __typename?: 'Mutation', archiveRelation: { __typename?: 'Relation', category: { __typename?: 'RelationCategory', id: string, label: string } } };

export type UpdateRelationMutationVariables = Exact<{
  input: UpdateRelationInput;
}>;


export type UpdateRelationMutation = { __typename?: 'Mutation', updateRelation: { __typename?: 'Relation', category: { __typename?: 'RelationCategory', id: string, label: string } } };

export type CreateEntityCategoryMutationVariables = Exact<{
  input: CreateEntityDefinitionInput;
}>;


export type CreateEntityCategoryMutation = { __typename?: 'Mutation', createEntityCategory: { __typename?: 'EntityCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, latest: Array<{ __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type UpdateEntityCategoryMutationVariables = Exact<{
  input: UpdateEntityDefinitionInput;
}>;


export type UpdateEntityCategoryMutation = { __typename?: 'Mutation', updateEntityCategory: { __typename?: 'EntityCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, latest: Array<{ __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type DeleteEntityCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteEntityCategoryMutation = { __typename?: 'Mutation', deleteEntityCategory: string };

export type CreateGraphMutationVariables = Exact<{
  input: CreateGraphInput;
}>;


export type CreateGraphMutation = { __typename?: 'Mutation', createGraph: { __typename?: 'Graph', id: string, name: string, description?: string | null, ageName: string, pinned: boolean, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind?: string | null, label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, metricCategories: Array<{ __typename?: 'MetricCategory', label: string, valueKind: ValueKind, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, structureCategory: { __typename?: 'StructureCategory', id: string, identifier: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, queries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string }, materializedEdges: Array<{ __typename?: 'MaterializedEdge', id: string, source: { __typename?: 'EntityCategory', id: string } | { __typename?: 'MetricCategory', id: string } | { __typename?: 'NaturalEventCategory', id: string } | { __typename?: 'ProtocolEventCategory', id: string } | { __typename?: 'StructureCategory', id: string }, target: { __typename?: 'EntityCategory', id: string, label: string } | { __typename?: 'MetricCategory', id: string, label: string } | { __typename?: 'NaturalEventCategory', id: string, label: string } | { __typename?: 'ProtocolEventCategory', id: string, label: string } | { __typename?: 'StructureCategory', id: string, label: string }, edge: { __typename?: 'MeasurementCategory', id: string, label: string, description?: string | null } | { __typename?: 'RelationCategory', id: string, label: string, description?: string | null } | { __typename?: 'StructureRelationCategory', id: string, label: string, description?: string | null }, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type CreateInlineGraphMutationVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type CreateInlineGraphMutation = { __typename?: 'Mutation', result: { __typename?: 'Graph', value: string, label: string } };

export type DeleteGraphMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteGraphMutation = { __typename?: 'Mutation', deleteGraph: string };

export type ArchiveGraphMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ArchiveGraphMutation = { __typename?: 'Mutation', archiveGraph: { __typename?: 'Graph', id: string, name: string, description?: string | null, ageName: string, pinned: boolean, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind?: string | null, label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, metricCategories: Array<{ __typename?: 'MetricCategory', label: string, valueKind: ValueKind, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, structureCategory: { __typename?: 'StructureCategory', id: string, identifier: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, queries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string }, materializedEdges: Array<{ __typename?: 'MaterializedEdge', id: string, source: { __typename?: 'EntityCategory', id: string } | { __typename?: 'MetricCategory', id: string } | { __typename?: 'NaturalEventCategory', id: string } | { __typename?: 'ProtocolEventCategory', id: string } | { __typename?: 'StructureCategory', id: string }, target: { __typename?: 'EntityCategory', id: string, label: string } | { __typename?: 'MetricCategory', id: string, label: string } | { __typename?: 'NaturalEventCategory', id: string, label: string } | { __typename?: 'ProtocolEventCategory', id: string, label: string } | { __typename?: 'StructureCategory', id: string, label: string }, edge: { __typename?: 'MeasurementCategory', id: string, label: string, description?: string | null } | { __typename?: 'RelationCategory', id: string, label: string, description?: string | null } | { __typename?: 'StructureRelationCategory', id: string, label: string, description?: string | null }, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type UpdateGraphMutationVariables = Exact<{
  input: UpdateGraphInput;
}>;


export type UpdateGraphMutation = { __typename?: 'Mutation', updateGraph: { __typename?: 'Graph', id: string, name: string, description?: string | null, ageName: string, pinned: boolean, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind?: string | null, label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, metricCategories: Array<{ __typename?: 'MetricCategory', label: string, valueKind: ValueKind, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, structureCategory: { __typename?: 'StructureCategory', id: string, identifier: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, queries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string }, materializedEdges: Array<{ __typename?: 'MaterializedEdge', id: string, source: { __typename?: 'EntityCategory', id: string } | { __typename?: 'MetricCategory', id: string } | { __typename?: 'NaturalEventCategory', id: string } | { __typename?: 'ProtocolEventCategory', id: string } | { __typename?: 'StructureCategory', id: string }, target: { __typename?: 'EntityCategory', id: string, label: string } | { __typename?: 'MetricCategory', id: string, label: string } | { __typename?: 'NaturalEventCategory', id: string, label: string } | { __typename?: 'ProtocolEventCategory', id: string, label: string } | { __typename?: 'StructureCategory', id: string, label: string }, edge: { __typename?: 'MeasurementCategory', id: string, label: string, description?: string | null } | { __typename?: 'RelationCategory', id: string, label: string, description?: string | null } | { __typename?: 'StructureRelationCategory', id: string, label: string, description?: string | null }, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type CreateMeasurementCategoryMutationVariables = Exact<{
  input: CreateMeasurementDefinitionInput;
}>;


export type CreateMeasurementCategoryMutation = { __typename?: 'Mutation', createMeasurementCategory: { __typename?: 'MeasurementCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type UpdateMeasurementCategoryMutationVariables = Exact<{
  input: UpdateMeasurementDefinitionInput;
}>;


export type UpdateMeasurementCategoryMutation = { __typename?: 'Mutation', updateMeasurementCategory: { __typename?: 'MeasurementCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type DeleteMeasurementCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteMeasurementCategoryMutation = { __typename?: 'Mutation', deleteMeasurementCategory: string };

export type CreateMetricCategoryMutationVariables = Exact<{
  input: CreateMetricDefinitionInput;
}>;


export type CreateMetricCategoryMutation = { __typename?: 'Mutation', createMetricCategory: { __typename?: 'MetricCategory', ageName: string, label: string, valueKind: ValueKind, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type UpdateMetricCategoryMutationVariables = Exact<{
  input: UpdateMetricDefinitionInput;
}>;


export type UpdateMetricCategoryMutation = { __typename?: 'Mutation', updateMetricCategory: { __typename?: 'MetricCategory', ageName: string, label: string, valueKind: ValueKind, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type DeleteMetricCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteMetricCategoryMutation = { __typename?: 'Mutation', deleteMetricCategory: string };

export type CreateNaturalEventCategoryMutationVariables = Exact<{
  input: CreateNaturalEventDefinitionInput;
}>;


export type CreateNaturalEventCategoryMutation = { __typename?: 'Mutation', createNaturalEventCategory: { __typename?: 'NaturalEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type UpdateNaturalEventCategoryMutationVariables = Exact<{
  input: UpdateNaturalEventDefinitionInput;
}>;


export type UpdateNaturalEventCategoryMutation = { __typename?: 'Mutation', updateNaturalEventCategory: { __typename?: 'NaturalEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type DeleteNaturalEventCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteNaturalEventCategoryMutation = { __typename?: 'Mutation', deleteNaturalEventCategory: string };

export type CreateProtocolEventCategoryMutationVariables = Exact<{
  input: CreateProtocolEventDefinitionInput;
}>;


export type CreateProtocolEventCategoryMutation = { __typename?: 'Mutation', createProtocolEventCategory: { __typename?: 'ProtocolEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type UpdateProtocolEventCategoryMutationVariables = Exact<{
  input: UpdateProtocolEventDefinitionInput;
}>;


export type UpdateProtocolEventCategoryMutation = { __typename?: 'Mutation', updateProtocolEventCategory: { __typename?: 'ProtocolEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type DeleteProtocolEventCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteProtocolEventCategoryMutation = { __typename?: 'Mutation', deleteProtocolEventCategory: string };

export type CreateRelationCategoryMutationVariables = Exact<{
  input: CreateRelationDefinitionInput;
}>;


export type CreateRelationCategoryMutation = { __typename?: 'Mutation', createRelationCategory: { __typename?: 'RelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type UpdateRelationCategoryMutationVariables = Exact<{
  input: UpdateRelationDefinitionInput;
}>;


export type UpdateRelationCategoryMutation = { __typename?: 'Mutation', updateRelationCategory: { __typename?: 'RelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type DeleteRelationCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteRelationCategoryMutation = { __typename?: 'Mutation', deleteRelationCategory: string };

export type CreateStructureCategoryMutationVariables = Exact<{
  input: CreateStructureDefinitionInput;
}>;


export type CreateStructureCategoryMutation = { __typename?: 'Mutation', createStructureCategory: { __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type UpdateStructureCategoryMutationVariables = Exact<{
  input: UpdateStructureDefinitionInput;
}>;


export type UpdateStructureCategoryMutation = { __typename?: 'Mutation', updateStructureCategory: { __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type DeleteStructureCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteStructureCategoryMutation = { __typename?: 'Mutation', deleteStructureCategory: string };

export type CreateStructureRelationCategoryMutationVariables = Exact<{
  input: CreateStructureRelationDefinitionInput;
}>;


export type CreateStructureRelationCategoryMutation = { __typename?: 'Mutation', createStructureRelationCategory: { __typename?: 'StructureRelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type UpdateStructureRelationCategoryMutationVariables = Exact<{
  input: UpdateStructureRelationDefinitionInput;
}>;


export type UpdateStructureRelationCategoryMutation = { __typename?: 'Mutation', updateStructureRelationCategory: { __typename?: 'StructureRelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type DeleteStructureRelationCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteStructureRelationCategoryMutation = { __typename?: 'Mutation', deleteStructureRelationCategory: string };

export type CreateStructureMutationVariables = Exact<{
  input: CreateStructureInput;
}>;


export type CreateStructureMutation = { __typename?: 'Mutation', createStructure: { __typename?: 'Structure', id: string, object: string, identifier: any, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, metrics: Array<{ __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', label: string } }>, graph: { __typename?: 'Graph', id: string } } };

export type EnsureStructureMutationVariables = Exact<{
  input: EnsureStructureInput;
}>;


export type EnsureStructureMutation = { __typename?: 'Mutation', ensureStructure: { __typename?: 'Structure', id: string, object: string, identifier: any, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, metrics: Array<{ __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', label: string } }>, graph: { __typename?: 'Graph', id: string } } };

export type DeleteStructureMutationVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type DeleteStructureMutation = { __typename?: 'Mutation', deleteStructure: string };

export type ArchiveStructureMutationVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type ArchiveStructureMutation = { __typename?: 'Mutation', archiveStructure: { __typename?: 'Structure', id: string, object: string, identifier: any, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, metrics: Array<{ __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', label: string } }>, graph: { __typename?: 'Graph', id: string } } };

export type UpdateStructureMutationVariables = Exact<{
  input: UpdateStructureInput;
}>;


export type UpdateStructureMutation = { __typename?: 'Mutation', updateStructure: { __typename?: 'Structure', id: string, object: string, identifier: any, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, metrics: Array<{ __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', label: string } }>, graph: { __typename?: 'Graph', id: string } } };

export type CreateStructureRelationMutationVariables = Exact<{
  input: CreateStructureRelationInput;
}>;


export type CreateStructureRelationMutation = { __typename?: 'Mutation', createStructureRelation: { __typename?: 'StructureRelation', id: string, sourceId: string, targetId: string, source: { __typename?: 'Structure', id: string, label: string }, target: { __typename?: 'Structure', id: string, label: string }, category: { __typename?: 'StructureRelationCategory', id: string, label: string } } };

export type CreateGraphTagInlineMutationVariables = Exact<{
  graph: Scalars['String']['input'];
  input: Scalars['String']['input'];
}>;


export type CreateGraphTagInlineMutation = { __typename?: 'Mutation', result: { __typename?: 'CategoryTag', value: string, label: string } };

export type RequestMediaUploadMutationVariables = Exact<{
  input: RequestMediaUploadInput;
}>;


export type RequestMediaUploadMutation = { __typename?: 'Mutation', requestMediaUpload: { __typename?: 'PresignedPostCredentials', key: string, xAmzCredential: string, xAmzAlgorithm: string, xAmzDate: string, xAmzSignature: string, policy: string, datalayer: string, bucket: string, store: string } };

export type GetEntityQueryVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type GetEntityQuery = { __typename?: 'Query', entity: { __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> } };

export type SearchEntitiesQueryVariables = Exact<{
  category: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['GraphID']['input']> | Scalars['GraphID']['input']>;
}>;


export type SearchEntitiesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Entity', value: string, label: string }> };

export type ListEntitiesQueryVariables = Exact<{
  entityCategoryId: Scalars['ID']['input'];
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<EntityPaginationInput>;
}>;


export type ListEntitiesQuery = { __typename?: 'Query', entities: Array<{ __typename?: 'Entity', id: string, label: string, category: { __typename?: 'EntityCategory', id: string, label: string } }> };

export type GlobalSearchQueryVariables = Exact<{
  search: Scalars['String']['input'];
}>;


export type GlobalSearchQuery = { __typename?: 'Query', entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind?: string | null, label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }> };

export type GetGraphQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGraphQuery = { __typename?: 'Query', graph: { __typename?: 'Graph', id: string, name: string, description?: string | null, ageName: string, pinned: boolean, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind?: string | null, label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, metricCategories: Array<{ __typename?: 'MetricCategory', label: string, valueKind: ValueKind, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, structureCategory: { __typename?: 'StructureCategory', id: string, identifier: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }>, queries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string }, materializedEdges: Array<{ __typename?: 'MaterializedEdge', id: string, source: { __typename?: 'EntityCategory', id: string } | { __typename?: 'MetricCategory', id: string } | { __typename?: 'NaturalEventCategory', id: string } | { __typename?: 'ProtocolEventCategory', id: string } | { __typename?: 'StructureCategory', id: string }, target: { __typename?: 'EntityCategory', id: string, label: string } | { __typename?: 'MetricCategory', id: string, label: string } | { __typename?: 'NaturalEventCategory', id: string, label: string } | { __typename?: 'ProtocolEventCategory', id: string, label: string } | { __typename?: 'StructureCategory', id: string, label: string }, edge: { __typename?: 'MeasurementCategory', id: string, label: string, description?: string | null } | { __typename?: 'RelationCategory', id: string, label: string, description?: string | null } | { __typename?: 'StructureRelationCategory', id: string, label: string, description?: string | null }, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type SearchGraphsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchGraphsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Graph', value: string, label: string }> };

export type ListGraphsQueryVariables = Exact<{
  filters?: InputMaybe<GraphFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
  ordering?: InputMaybe<Array<GraphOrder> | GraphOrder>;
}>;


export type ListGraphsQuery = { __typename?: 'Query', graphs: Array<{ __typename?: 'Graph', id: string, name: string, description?: string | null, pinned: boolean, image: { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string } }> };

export type GetGraphTableQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGraphTableQueryQuery = { __typename?: 'Query', graphTableQuery: { __typename?: 'GraphTableQuery', id: string, label: string, description?: string | null, query: any, graph: { __typename?: 'Graph', id: string, name: string }, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null } };

export type RenderGraphTableQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  filters?: InputMaybe<RenderGraphTableFilter>;
  pagination?: InputMaybe<RenderGraphTablePagination>;
  order?: InputMaybe<RenderGraphTableOrder>;
}>;


export type RenderGraphTableQuery = { __typename?: 'Query', renderGraphTable?: { __typename?: 'GraphTableRender', rows: Array<any>, query: { __typename?: 'GraphTableQuery', columns: Array<{ __typename?: 'Column', key: string, label?: string | null, valueKind?: ValueKind | null, description?: string | null }> } } | null };

export type SearchGraphTableQueriesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchGraphTableQueriesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'GraphTableQuery', value: string, label: string }> };

export type ListGraphTableQueriesQueryVariables = Exact<{
  filters?: InputMaybe<GraphTableQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListGraphTableQueriesQuery = { __typename?: 'Query', graphTableQueries: Array<{ __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type GetScatterPlotQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetScatterPlotQuery = { __typename?: 'Query', scatterPlot: { __typename?: 'ScatterPlot', id: string, label: string, description?: string | null, xColumn: string, yColumn: string, idColumn: string, colorColumn?: string | null, sizeColumn?: string | null, shapeColumn?: string | null, query: { __typename?: 'EdgeTableQuery', id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename?: 'GraphTableQuery', query: any, id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename?: 'NodeTableQuery', id: string, label: string, description?: string | null, columns: Array<{ __typename?: 'Column', key: string, valueKind?: ValueKind | null, label?: string | null, description?: string | null, categoryKey?: string | null, searchable: boolean, isIdForKey?: string | null, preferHidden: boolean }>, builderArgs?: { __typename?: 'BuilderArgs', matchPaths?: Array<{ __typename?: 'MatchPath', nodes: Array<string>, relations: Array<string>, relationDirections?: Array<boolean> | null, title?: string | null, color?: Array<number> | null, optional: boolean }> | null, whereClauses?: Array<{ __typename?: 'WhereClause', path: string, node?: string | null, property: string, operator: WhereOperator, value: string }> | null, returnStatements?: Array<{ __typename?: 'ReturnStatement', path: string, property?: string | null, node?: string | null }> | null } | null, graph: { __typename?: 'Graph', id: string, name: string } } } };

export type SearchScatterPlotsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchScatterPlotsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'ScatterPlot', value: string, label: string }> };

export type ListScatterPlotsQueryVariables = Exact<{
  filters?: InputMaybe<ScatterPlotFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListScatterPlotsQuery = { __typename?: 'Query', scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, label: string, xColumn: string, yColumn: string }> };

export type ListMaterializedEdgesQueryVariables = Exact<{
  filters?: InputMaybe<MaterializedEdgeFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
  ordering?: InputMaybe<Array<MaterializedEdgeOrder> | MaterializedEdgeOrder>;
}>;


export type ListMaterializedEdgesQuery = { __typename?: 'Query', materializedEdges: Array<{ __typename?: 'MaterializedEdge', id: string, source: { __typename?: 'EntityCategory', id: string } | { __typename?: 'MetricCategory', id: string } | { __typename?: 'NaturalEventCategory', id: string } | { __typename?: 'ProtocolEventCategory', id: string } | { __typename?: 'StructureCategory', id: string }, target: { __typename?: 'EntityCategory', id: string, label: string } | { __typename?: 'MetricCategory', id: string, label: string } | { __typename?: 'NaturalEventCategory', id: string, label: string } | { __typename?: 'ProtocolEventCategory', id: string, label: string } | { __typename?: 'StructureCategory', id: string, label: string }, edge: { __typename?: 'MeasurementCategory', id: string, label: string, description?: string | null } | { __typename?: 'RelationCategory', id: string, label: string, description?: string | null } | { __typename?: 'StructureRelationCategory', id: string, label: string, description?: string | null }, graph: { __typename?: 'Graph', id: string, name: string } }> };

export type GetMaterializedEdgeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMaterializedEdgeQuery = { __typename?: 'Query', materializedEdge: { __typename?: 'MaterializedEdge', id: string, graph: { __typename?: 'Graph', id: string, name: string }, source: { __typename?: 'EntityCategory', id: string, label: string, description?: string | null } | { __typename?: 'MetricCategory', id: string, label: string, description?: string | null } | { __typename?: 'NaturalEventCategory', id: string, label: string, description?: string | null } | { __typename?: 'ProtocolEventCategory', id: string, label: string, description?: string | null } | { __typename?: 'StructureCategory', id: string, label: string, description?: string | null }, target: { __typename?: 'EntityCategory', id: string, label: string, description?: string | null } | { __typename?: 'MetricCategory', id: string, label: string, description?: string | null } | { __typename?: 'NaturalEventCategory', id: string, label: string, description?: string | null } | { __typename?: 'ProtocolEventCategory', id: string, label: string, description?: string | null } | { __typename?: 'StructureCategory', id: string, label: string, description?: string | null } } };

export type GetMeasurementQueryVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type GetMeasurementQuery = { __typename?: 'Query', measurement: { __typename?: 'Measurement', category: { __typename?: 'MeasurementCategory', id: string, label: string } } };

export type SearchMeasurementsQueryVariables = Exact<{
  category: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['GraphID']['input']> | Scalars['GraphID']['input']>;
}>;


export type SearchMeasurementsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Measurement', value: string, label: string }> };

export type GetMetricQueryVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type GetMetricQuery = { __typename?: 'Query', metric: { __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', id: string, label: string, description?: string | null } } };

export type SearchMetricsQueryVariables = Exact<{
  category: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['GraphID']['input']> | Scalars['GraphID']['input']>;
}>;


export type SearchMetricsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Metric', value: string, label: string }> };

export type ListMetricsQueryVariables = Exact<{
  category: Scalars['ID']['input'];
  filters?: InputMaybe<MetricFilter>;
  pagination?: InputMaybe<MetricPaginationInput>;
  ordering?: InputMaybe<Array<MetricOrder> | MetricOrder>;
}>;


export type ListMetricsQuery = { __typename?: 'Query', metrics: Array<{ __typename?: 'Metric', id: string, value: any, label: string }> };

export type GetNaturalEventQueryVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type GetNaturalEventQuery = { __typename?: 'Query', naturalEvent: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, graph: { __typename?: 'Graph', id: string } } };

export type SearchNaturalEventsQueryVariables = Exact<{
  category: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['GraphID']['input']> | Scalars['GraphID']['input']>;
}>;


export type SearchNaturalEventsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'NaturalEvent', value: string, label: string }> };

export type GetProtocolEventQueryVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type GetProtocolEventQuery = { __typename?: 'Query', protocolEvent: { __typename?: 'ProtocolEvent', id: string, measuredFrom: any, label: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string }, graph: { __typename?: 'Graph', id: string } } };

export type SearchProtocolEventsQueryVariables = Exact<{
  category: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['GraphID']['input']> | Scalars['GraphID']['input']>;
}>;


export type SearchProtocolEventsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'ProtocolEvent', value: string, label: string }> };

export type GetRelationQueryVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type GetRelationQuery = { __typename?: 'Query', relation: { __typename?: 'Relation', category: { __typename?: 'RelationCategory', id: string, label: string } } };

export type SearchRelationsQueryVariables = Exact<{
  category: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['GraphID']['input']> | Scalars['GraphID']['input']>;
}>;


export type SearchRelationsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Relation', value: string, label: string }> };

export type GetEntityCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEntityCategoryQuery = { __typename?: 'Query', entityCategory: { __typename?: 'EntityCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, latest: Array<{ __typename?: 'Entity', id: string, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string, ageName: string, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }> }, richProperties: Array<{ __typename?: 'RichProperty', key?: string | null, value?: any | null }>, measuredBy: Array<{ __typename?: 'Measurement', id: string, category: { __typename?: 'MeasurementCategory', label: string }, source: { __typename?: 'Structure', identifier: any, object: string } }>, participatedIn: Array<{ __typename?: 'InputParticipation', id: string, role: string, target: { __typename?: 'NaturalEvent', id: string, label: string, measuredFrom: any, measuredTo: any, category: { __typename?: 'NaturalEventCategory', label: string } } }> }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type SearchEntityCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  graph?: InputMaybe<Scalars['ID']['input']>;
}>;


export type SearchEntityCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'EntityCategory', value: string, label: string }> };

export type ListEntityCategoryQueryVariables = Exact<{
  filters?: InputMaybe<EntityCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListEntityCategoryQuery = { __typename?: 'Query', entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind?: string | null, label: string, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }> };

export type EntityNodesQueryVariables = Exact<{
  category: Scalars['ID']['input'];
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<EntityPaginationInput>;
  ordering?: InputMaybe<Array<EntityOrder> | EntityOrder>;
}>;


export type EntityNodesQuery = { __typename?: 'Query', entities: Array<{ __typename: 'Entity', id: string, label: string, properties: any }> };

export type EntityCategoryStatsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EntityCategoryStatsQuery = { __typename?: 'Query', entityCategoryStats: { __typename?: 'EntityCategoryStats', count: number } };

export type HomePageQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageQuery = { __typename?: 'Query', graphs: Array<{ __typename?: 'Graph', id: string, name: string, description?: string | null, pinned: boolean, image: { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string } }> };

export type HomePageStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageStatsQuery = { __typename?: 'Query', graphStats: { __typename?: 'GraphStats', count: number } };

export type GetMeasurmentCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMeasurmentCategoryQuery = { __typename?: 'Query', measurementCategory: { __typename?: 'MeasurementCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type SearchMeasurmentCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchMeasurmentCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'MeasurementCategory', value: string, label: string }> };

export type ListMeasurmentCategoryQueryVariables = Exact<{
  filters?: InputMaybe<MeasurementCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListMeasurmentCategoryQuery = { __typename?: 'Query', measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string, name: string }, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }> };

export type GetMetricCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMetricCategoryQuery = { __typename?: 'Query', metricCategory: { __typename?: 'MetricCategory', ageName: string, label: string, valueKind: ValueKind, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type ListMetricCategoryQueryVariables = Exact<{
  filters?: InputMaybe<MetricCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListMetricCategoryQuery = { __typename?: 'Query', metricCategories: Array<{ __typename?: 'MetricCategory', label: string, valueKind: ValueKind, id: string, description?: string | null, ageName: string, positionX: number, positionY: number, width?: number | null, height?: number | null, structureCategory: { __typename?: 'StructureCategory', id: string, identifier: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }> };

export type SearchMetricCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchMetricCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'MetricCategory', value: string, label: string }> };

export type GetNaturalEventCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetNaturalEventCategoryQuery = { __typename?: 'Query', naturalEventCategory: { __typename?: 'NaturalEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type SearchNaturalEventCategoriesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchNaturalEventCategoriesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'NaturalEventCategory', value: string, label: string }> };

export type ListNaturalEventCategoriesQueryVariables = Exact<{
  filters?: InputMaybe<NaturalEventCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListNaturalEventCategoriesQuery = { __typename?: 'Query', naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, image: { __typename?: 'MediaStore', presignedUrl: string }, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }> };

export type GetProtocolEventCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProtocolEventCategoryQuery = { __typename?: 'Query', protocolEventCategory: { __typename?: 'ProtocolEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type SearchProtocolEventCategoriesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchProtocolEventCategoriesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'ProtocolEventCategory', value: string, label: string }> };

export type ListProtocolEventCategoriesQueryVariables = Exact<{
  filters?: InputMaybe<ProtocolEventCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListProtocolEventCategoriesQuery = { __typename?: 'Query', protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, height?: number | null, image: { __typename?: 'MediaStore', presignedUrl: string }, inputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, outputs: Array<{ __typename?: 'EventRole', key: string, role: string, descriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null } }>, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }> };

export type GetRelationCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRelationCategoryQuery = { __typename?: 'Query', relationCategory: { __typename?: 'RelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type SearchRelationCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchRelationCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'RelationCategory', value: string, label: string }> };

export type ListRelationCategoryQueryVariables = Exact<{
  filters?: InputMaybe<RelationCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListRelationCategoryQuery = { __typename?: 'Query', relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, ageName: string, sourceDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'EntityDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }> };

export type GetStructureRelationCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStructureRelationCategoryQuery = { __typename?: 'Query', structureRelationCategory: { __typename?: 'StructureRelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type SearchStructureRelationCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchStructureRelationCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'StructureRelationCategory', value: string, label: string }> };

export type ListStructureRelationCategoryQueryVariables = Exact<{
  filters?: InputMaybe<StructureRelationCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListStructureRelationCategoryQuery = { __typename?: 'Query', structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, ageName: string, graph: { __typename?: 'Graph', id: string, name: string, description?: string | null }, sourceDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, targetDescriptor: { __typename?: 'StructureDescriptor', keys?: Array<string> | null, tags?: Array<string> | null, ontotologyTerms?: Array<string> | null, defaultCategoryKey?: string | null }, propertyDefinitions: Array<{ __typename?: 'PropertyDefinition', key: string, valueKind: ValueKind, description?: string | null, label?: string | null, rule?: { __typename?: 'DerivationRule', aggregation?: AggregationFunction | null } | null }>, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string }> }> };

export type StartPaneQueryVariables = Exact<{ [key: string]: never; }>;


export type StartPaneQuery = { __typename?: 'Query', entityCategories: Array<{ __typename?: 'EntityCategory', id: string, label: string }>, relationCategories: Array<{ __typename?: 'RelationCategory', id: string, label: string }>, structureCategories: Array<{ __typename?: 'StructureCategory', id: string, identifier: string }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', id: string, label: string }> };

export type GetStructureQueryVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type GetStructureQuery = { __typename?: 'Query', structure?: { __typename?: 'Structure', id: string, object: string, identifier: any, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, metrics: Array<{ __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', label: string } }>, graph: { __typename?: 'Graph', id: string } } | null };

export type SearchStructuresQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['GraphID']['input']> | Scalars['GraphID']['input']>;
}>;


export type SearchStructuresQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Structure', value: string, label: string }> };

export type GetInformedStructureQueryVariables = Exact<{
  graph: Scalars['ID']['input'];
  identifier: Scalars['StructureIdentifier']['input'];
  object: Scalars['StructureObject']['input'];
}>;


export type GetInformedStructureQuery = { __typename?: 'Query', structureByIdentifier?: { __typename?: 'Structure', id: string, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string }, graph: { __typename?: 'Graph', id: string, name: string }, metrics: Array<{ __typename?: 'Metric', id: string, value: any, category: { __typename?: 'MetricCategory', label: string } }> } | null };

export type ListStructuresQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  filters?: InputMaybe<StructureFilter>;
  pagination?: InputMaybe<StructurePaginationInput>;
}>;


export type ListStructuresQuery = { __typename?: 'Query', structures: Array<{ __typename?: 'Structure', id: string, category: { __typename?: 'StructureCategory', identifier: string, id: string } }> };

export type GetStructureCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStructureCategoryQuery = { __typename?: 'Query', structureCategory: { __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> } };

export type SearchStructureCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchStructureCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'StructureCategory', value: string, label: string }> };

export type ListStructureCategoryQueryVariables = Exact<{
  filters?: InputMaybe<StructureCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListStructureCategoryQuery = { __typename?: 'Query', structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX: number, positionY: number, width?: number | null, label: string, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, image: { __typename?: 'MediaStore', presignedUrl: string }, tags: Array<{ __typename?: 'CategoryTag', id: string, name: string, description?: string | null }>, relevantQueries: Array<{ __typename: 'GraphNodesQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphPathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'GraphTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }>, relevantNodeQueries: Array<{ __typename: 'NodePairsQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodePathQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } } | { __typename: 'NodeTableQuery', id: string, label: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string } }> }> };

export type GetStructureRelationQueryVariables = Exact<{
  id: Scalars['GraphID']['input'];
}>;


export type GetStructureRelationQuery = { __typename?: 'Query', structureRelation: { __typename?: 'StructureRelation', id: string, measuredFrom?: any | null, measuredTo?: any | null, sourceId: string, targetId: string, category: { __typename?: 'StructureRelationCategory', id: string, label: string }, source: { __typename?: 'Structure', identifier: any, object: string }, target: { __typename?: 'Structure', identifier: any, object: string } } };

export type SearchStructureRelationsQueryVariables = Exact<{
  category: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['GraphID']['input']> | Scalars['GraphID']['input']>;
}>;


export type SearchStructureRelationsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'StructureRelation', value: string, label: string }> };

export type SearchTagsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchTagsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'CategoryTag', value: string, label: string }> };

export const BaseNodeFragmentDoc = gql`
    fragment BaseNode on Node {
  id
  label
  graph {
    id
  }
  label
}
    `;
export const PropertyDefinitionFragmentDoc = gql`
    fragment PropertyDefinition on PropertyDefinition {
  key
  valueKind
  description
  rule {
    aggregation
  }
  label
}
    `;
export const EntityFragmentDoc = gql`
    fragment Entity on Entity {
  ...BaseNode
  id
  graph {
    id
  }
  category {
    id
    label
    ageName
    propertyDefinitions {
      ...PropertyDefinition
    }
  }
  label
  richProperties {
    key
    value
  }
  measuredBy {
    id
    category {
      label
    }
    source {
      ... on Structure {
        identifier
        object
      }
    }
  }
  participatedIn {
    id
    role
    target {
      id
      label
      measuredFrom
      measuredTo
      category {
        label
      }
    }
  }
}
    ${BaseNodeFragmentDoc}
${PropertyDefinitionFragmentDoc}`;
export const StructureFragmentDoc = gql`
    fragment Structure on Structure {
  ...BaseNode
  id
  object
  identifier
  category {
    id
    identifier
    description
  }
  metrics {
    id
    category {
      label
    }
    value
  }
}
    ${BaseNodeFragmentDoc}`;
export const MetricFragmentDoc = gql`
    fragment Metric on Metric {
  id
  category {
    id
    label
    description
  }
  value
}
    `;
export const NodeFragmentDoc = gql`
    fragment Node on Node {
  ...BaseNode
  ...Entity
  ...Structure
  ...Metric
}
    ${BaseNodeFragmentDoc}
${EntityFragmentDoc}
${StructureFragmentDoc}
${MetricFragmentDoc}`;
export const DetailNodeFragmentDoc = gql`
    fragment DetailNode on Node {
  ...Node
  graph {
    id
    name
  }
}
    ${NodeFragmentDoc}`;
export const ListStructureFragmentDoc = gql`
    fragment ListStructure on Structure {
  id
  category {
    identifier
    id
  }
}
    `;
export const PathStructureFragmentDoc = gql`
    fragment PathStructure on Structure {
  ...ListStructure
  category {
    identifier
    image {
      presignedUrl
    }
  }
  object
}
    ${ListStructureFragmentDoc}`;
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
export const PathEntityFragmentDoc = gql`
    fragment PathEntity on Entity {
  ...ListEntity
  category {
    label
    image {
      presignedUrl
    }
  }
  externalId
}
    ${ListEntityFragmentDoc}`;
export const ListNaturalEventFragmentDoc = gql`
    fragment ListNaturalEvent on NaturalEvent {
  id
  measuredFrom
  measuredTo
  category {
    label
    id
  }
}
    `;
export const PathNaturalEventFragmentDoc = gql`
    fragment PathNaturalEvent on NaturalEvent {
  ...ListNaturalEvent
  category {
    label
    image {
      presignedUrl
    }
  }
}
    ${ListNaturalEventFragmentDoc}`;
export const ListProtocolEventFragmentDoc = gql`
    fragment ListProtocolEvent on ProtocolEvent {
  id
  measuredFrom
  measuredTo
  category {
    label
    id
  }
}
    `;
export const PathProtocolEventFragmentDoc = gql`
    fragment PathProtocolEvent on ProtocolEvent {
  ...ListProtocolEvent
  category {
    label
    image {
      presignedUrl
    }
  }
  richProperties {
    value
  }
}
    ${ListProtocolEventFragmentDoc}`;
export const ListMetricFragmentDoc = gql`
    fragment ListMetric on Metric {
  id
  value
  label
}
    `;
export const PathMetricFragmentDoc = gql`
    fragment PathMetric on Metric {
  ...ListMetric
  category {
    id
    label
    image {
      presignedUrl
    }
  }
  value
}
    ${ListMetricFragmentDoc}`;
export const PathNodeFragmentDoc = gql`
    fragment PathNode on Node {
  id
  ...PathStructure
  ...PathEntity
  ...PathNaturalEvent
  ...PathProtocolEvent
  ...PathMetric
}
    ${PathStructureFragmentDoc}
${PathEntityFragmentDoc}
${PathNaturalEventFragmentDoc}
${PathProtocolEventFragmentDoc}
${PathMetricFragmentDoc}`;
export const PresignedPostCredentialsFragmentDoc = gql`
    fragment PresignedPostCredentials on PresignedPostCredentials {
  key
  xAmzCredential
  xAmzAlgorithm
  xAmzDate
  xAmzSignature
  policy
  datalayer
  bucket
  store
}
    `;
export const BaseEdgeFragmentDoc = gql`
    fragment BaseEdge on Edge {
  id
  sourceId
  targetId
}
    `;
export const MeasurementFragmentDoc = gql`
    fragment Measurement on Measurement {
  category {
    id
    label
  }
}
    `;
export const RelationFragmentDoc = gql`
    fragment Relation on Relation {
  category {
    id
    label
  }
}
    `;
export const StructureRelationFragmentDoc = gql`
    fragment StructureRelation on StructureRelation {
  id
  sourceId
  targetId
  source {
    id
    label
  }
  target {
    id
    label
  }
  category {
    id
    label
  }
}
    `;
export const EdgeFragmentDoc = gql`
    fragment Edge on Edge {
  sourceId
  targetId
  ...BaseEdge
  ...Measurement
  ...Relation
  ...StructureRelation
}
    ${BaseEdgeFragmentDoc}
${MeasurementFragmentDoc}
${RelationFragmentDoc}
${StructureRelationFragmentDoc}`;
export const ListEdgeQueryFragmentDoc = gql`
    fragment ListEdgeQuery on EdgeQuery {
  id
  label
  description
  graph {
    id
    name
  }
  __typename
}
    `;
export const BaseEdgeQueryFragmentDoc = gql`
    fragment BaseEdgeQuery on EdgeQuery {
  id
  label
  description
  graph {
    id
    name
  }
}
    `;
export const ColumnFragmentDoc = gql`
    fragment Column on Column {
  key
  valueKind
  label
  description
  categoryKey
  searchable
  isIdForKey
  preferHidden
}
    `;
export const MatchPathFragmentDoc = gql`
    fragment MatchPath on MatchPath {
  nodes
  relations
  relationDirections
  title
  color
  optional
}
    `;
export const WhereClauseFragmentDoc = gql`
    fragment WhereClause on WhereClause {
  path
  node
  property
  operator
  value
}
    `;
export const ReturnStatementFragmentDoc = gql`
    fragment ReturnStatement on ReturnStatement {
  path
  property
  node
}
    `;
export const BuilderArgsFragmentDoc = gql`
    fragment BuilderArgs on BuilderArgs {
  matchPaths {
    ...MatchPath
  }
  whereClauses {
    ...WhereClause
  }
  returnStatements {
    ...ReturnStatement
  }
}
    ${MatchPathFragmentDoc}
${WhereClauseFragmentDoc}
${ReturnStatementFragmentDoc}`;
export const EdgeTableQueryFragmentDoc = gql`
    fragment EdgeTableQuery on EdgeTableQuery {
  ...BaseEdgeQuery
  columns {
    ...Column
  }
  builderArgs {
    ...BuilderArgs
  }
}
    ${BaseEdgeQueryFragmentDoc}
${ColumnFragmentDoc}
${BuilderArgsFragmentDoc}`;
export const EdgeQueryFragmentDoc = gql`
    fragment EdgeQuery on EdgeQuery {
  ...BaseEdgeQuery
  ...EdgeTableQuery
}
    ${BaseEdgeQueryFragmentDoc}
${EdgeTableQueryFragmentDoc}`;
export const BaseGraphQueryFragmentDoc = gql`
    fragment BaseGraphQuery on GraphQuery {
  id
  label
  description
  graph {
    id
    name
  }
}
    `;
export const GraphTableQueryFragmentDoc = gql`
    fragment GraphTableQuery on GraphTableQuery {
  ...BaseGraphQuery
  query
  columns {
    ...Column
  }
  builderArgs {
    ...BuilderArgs
  }
}
    ${BaseGraphQueryFragmentDoc}
${ColumnFragmentDoc}
${BuilderArgsFragmentDoc}`;
export const GraphQueryFragmentDoc = gql`
    fragment GraphQuery on GraphQuery {
  ...BaseGraphQuery
  ...GraphTableQuery
}
    ${BaseGraphQueryFragmentDoc}
${GraphTableQueryFragmentDoc}`;
export const ListGraphTableQueryFragmentDoc = gql`
    fragment ListGraphTableQuery on GraphTableQuery {
  ...BaseGraphQuery
  __typename
}
    ${BaseGraphQueryFragmentDoc}`;
export const GraphTableRenderFragmentDoc = gql`
    fragment GraphTableRender on GraphTableRender {
  query {
    columns {
      key
      label
      valueKind
      description
    }
  }
  rows
}
    `;
export const BaseNodeQueryFragmentDoc = gql`
    fragment BaseNodeQuery on NodeQuery {
  id
  label
  description
  graph {
    id
    name
  }
}
    `;
export const NodeTableQueryFragmentDoc = gql`
    fragment NodeTableQuery on NodeTableQuery {
  ...BaseNodeQuery
  columns {
    ...Column
  }
  builderArgs {
    ...BuilderArgs
  }
}
    ${BaseNodeQueryFragmentDoc}
${ColumnFragmentDoc}
${BuilderArgsFragmentDoc}`;
export const NodeQueryFragmentDoc = gql`
    fragment NodeQuery on NodeQuery {
  ...BaseNodeQuery
  ...NodeTableQuery
}
    ${BaseNodeQueryFragmentDoc}
${NodeTableQueryFragmentDoc}`;
export const ScatterPlotFragmentDoc = gql`
    fragment ScatterPlot on ScatterPlot {
  id
  label
  description
  xColumn
  yColumn
  idColumn
  colorColumn
  sizeColumn
  shapeColumn
  query {
    ...GraphTableQuery
    ...NodeTableQuery
    ...EdgeTableQuery
  }
}
    ${GraphTableQueryFragmentDoc}
${NodeTableQueryFragmentDoc}
${EdgeTableQueryFragmentDoc}`;
export const ListScatterPlotFragmentDoc = gql`
    fragment ListScatterPlot on ScatterPlot {
  id
  label
  xColumn
  yColumn
}
    `;
export const PathMeasurementFragmentDoc = gql`
    fragment PathMeasurement on Measurement {
  measuredTo
  measuredFrom
  category {
    id
    label
  }
  sourceId
  targetId
}
    `;
export const NaturalEventFragmentDoc = gql`
    fragment NaturalEvent on NaturalEvent {
  ...BaseNode
  id
  label
  measuredFrom
  measuredTo
}
    ${BaseNodeFragmentDoc}`;
export const ProtocolEventFragmentDoc = gql`
    fragment ProtocolEvent on ProtocolEvent {
  ...BaseNode
  id
  measuredFrom
  category {
    id
    label
  }
}
    ${BaseNodeFragmentDoc}`;
export const PathRelationFragmentDoc = gql`
    fragment PathRelation on Relation {
  id
  measuredFrom
  measuredTo
  category {
    id
    label
  }
  sourceId
  targetId
}
    `;
export const ListGraphQueryFragmentDoc = gql`
    fragment ListGraphQuery on GraphQuery {
  id
  label
  description
  graph {
    id
    name
  }
  __typename
}
    `;
export const BaseCategoryFragmentDoc = gql`
    fragment BaseCategory on Category {
  id
  graph {
    id
  }
  tags {
    id
    name
    description
  }
  purl
  relevantQueries {
    ...ListGraphQuery
  }
  image {
    presignedUrl
  }
  ageName
}
    ${ListGraphQueryFragmentDoc}`;
export const ListNodeQueryFragmentDoc = gql`
    fragment ListNodeQuery on NodeQuery {
  id
  label
  description
  graph {
    id
    name
  }
  __typename
}
    `;
export const BaseNodeCategoryFragmentDoc = gql`
    fragment BaseNodeCategory on NodeCategory {
  id
  positionX
  positionY
  width
  label
  height
  relevantNodeQueries {
    ...ListNodeQuery
  }
}
    ${ListNodeQueryFragmentDoc}`;
export const StructureCategoryFragmentDoc = gql`
    fragment StructureCategory on StructureCategory {
  ...BaseCategory
  ...BaseNodeCategory
  identifier
  graph {
    id
    name
  }
  ageName
  description
  image {
    presignedUrl
  }
  pinned
  tags {
    id
    name
  }
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}`;
export const EntityCategoryFragmentDoc = gql`
    fragment EntityCategory on EntityCategory {
  ...BaseCategory
  ...BaseNodeCategory
  ageName
  label
  description
  image {
    presignedUrl
  }
  latest: entities(ordering: [{createdAt: DESC}], pagination: {limit: 3}) {
    ...Entity
  }
  pinned
  propertyDefinitions {
    ...PropertyDefinition
  }
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${EntityFragmentDoc}
${PropertyDefinitionFragmentDoc}`;
export const EntityDescriptorFragmentDoc = gql`
    fragment EntityDescriptor on EntityDescriptor {
  keys
  tags
  ontotologyTerms
  defaultCategoryKey
}
    `;
export const EventRoleFragmentDoc = gql`
    fragment EventRole on EventRole {
  key
  role
  descriptor {
    ...EntityDescriptor
  }
}
    ${EntityDescriptorFragmentDoc}`;
export const ProtocolEventCategoryFragmentDoc = gql`
    fragment ProtocolEventCategory on ProtocolEventCategory {
  ...BaseCategory
  ...BaseNodeCategory
  label
  ageName
  label
  description
  image {
    presignedUrl
  }
  inputs {
    ...EventRole
  }
  outputs {
    ...EventRole
  }
  propertyDefinitions {
    ...PropertyDefinition
  }
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${EventRoleFragmentDoc}
${PropertyDefinitionFragmentDoc}`;
export const NaturalEventCategoryFragmentDoc = gql`
    fragment NaturalEventCategory on NaturalEventCategory {
  ...BaseCategory
  ...BaseNodeCategory
  label
  ageName
  description
  inputs {
    ...EventRole
  }
  outputs {
    ...EventRole
  }
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${EventRoleFragmentDoc}`;
export const MetricCategoryFragmentDoc = gql`
    fragment MetricCategory on MetricCategory {
  ...BaseCategory
  ...BaseNodeCategory
  ageName
  label
  valueKind
  description
  image {
    presignedUrl
  }
  tags {
    id
    name
  }
  pinned
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}`;
export const NodeCategoryFragmentDoc = gql`
    fragment NodeCategory on NodeCategory {
  ...StructureCategory
  ...EntityCategory
  ...ProtocolEventCategory
  ...NaturalEventCategory
  ...MetricCategory
}
    ${StructureCategoryFragmentDoc}
${EntityCategoryFragmentDoc}
${ProtocolEventCategoryFragmentDoc}
${NaturalEventCategoryFragmentDoc}
${MetricCategoryFragmentDoc}`;
export const ListStructureCategoryFragmentDoc = gql`
    fragment ListStructureCategory on StructureCategory {
  ...BaseCategory
  ...BaseNodeCategory
  identifier
  description
  image {
    presignedUrl
  }
  tags {
    id
    name
  }
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}`;
export const BaseListCategoryFragmentDoc = gql`
    fragment BaseListCategory on Category {
  id
  description
  image {
    presignedUrl
  }
  tags {
    id
    name
  }
  ageName
}
    `;
export const ListEntityCategoryFragmentDoc = gql`
    fragment ListEntityCategory on EntityCategory {
  ...BaseListCategory
  ...BaseNodeCategory
  instanceKind
  label
}
    ${BaseListCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}`;
export const ListMetricCategoryFragmentDoc = gql`
    fragment ListMetricCategory on MetricCategory {
  ...BaseListCategory
  ...BaseNodeCategory
  label
  valueKind
  structureCategory {
    id
    identifier
  }
}
    ${BaseListCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}`;
export const ListProtocolEventCategoryFragmentDoc = gql`
    fragment ListProtocolEventCategory on ProtocolEventCategory {
  ...BaseListCategory
  ...BaseNodeCategory
  label
  inputs {
    ...EventRole
  }
  outputs {
    ...EventRole
  }
  propertyDefinitions {
    ...PropertyDefinition
  }
}
    ${BaseListCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${EventRoleFragmentDoc}
${PropertyDefinitionFragmentDoc}`;
export const ListNaturalEventCategoryFragmentDoc = gql`
    fragment ListNaturalEventCategory on NaturalEventCategory {
  ...BaseListCategory
  ...BaseNodeCategory
  label
  inputs {
    ...EventRole
  }
  outputs {
    ...EventRole
  }
}
    ${BaseListCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${EventRoleFragmentDoc}`;
export const BaseListEdgeCategoryFragmentDoc = gql`
    fragment BaseListEdgeCategory on EdgeCategory {
  id
}
    `;
export const ListRelationCategoryFragmentDoc = gql`
    fragment ListRelationCategory on RelationCategory {
  ...BaseListCategory
  ...BaseListEdgeCategory
  sourceDescriptor {
    ...EntityDescriptor
  }
  targetDescriptor {
    ...EntityDescriptor
  }
  propertyDefinitions {
    ...PropertyDefinition
  }
  label
}
    ${BaseListCategoryFragmentDoc}
${BaseListEdgeCategoryFragmentDoc}
${EntityDescriptorFragmentDoc}
${PropertyDefinitionFragmentDoc}`;
export const StructureDescriptorFragmentDoc = gql`
    fragment StructureDescriptor on StructureDescriptor {
  keys
  tags
  ontotologyTerms
  defaultCategoryKey
}
    `;
export const ListMeasurementCategoryFragmentDoc = gql`
    fragment ListMeasurementCategory on MeasurementCategory {
  ...BaseListCategory
  ...BaseListEdgeCategory
  sourceDescriptor {
    ...StructureDescriptor
  }
  targetDescriptor {
    ...EntityDescriptor
  }
  label
}
    ${BaseListCategoryFragmentDoc}
${BaseListEdgeCategoryFragmentDoc}
${StructureDescriptorFragmentDoc}
${EntityDescriptorFragmentDoc}`;
export const ListStructureRelationCategoryFragmentDoc = gql`
    fragment ListStructureRelationCategory on StructureRelationCategory {
  ...BaseListCategory
  ...BaseListEdgeCategory
  sourceDescriptor {
    ...StructureDescriptor
  }
  targetDescriptor {
    ...StructureDescriptor
  }
  propertyDefinitions {
    ...PropertyDefinition
  }
  label
}
    ${BaseListCategoryFragmentDoc}
${BaseListEdgeCategoryFragmentDoc}
${StructureDescriptorFragmentDoc}
${PropertyDefinitionFragmentDoc}`;
export const MediaStoreFragmentDoc = gql`
    fragment MediaStore on MediaStore {
  id
  presignedUrl
  key
}
    `;
export const ListMaterializedEdgeFragmentDoc = gql`
    fragment ListMaterializedEdge on MaterializedEdge {
  id
  source {
    id
  }
  target {
    id
    label
  }
  edge {
    id
    label
    description
  }
  graph {
    id
    name
  }
}
    `;
export const GraphFragmentDoc = gql`
    fragment Graph on Graph {
  id
  name
  description
  ageName
  structureCategories {
    ...ListStructureCategory
  }
  entityCategories {
    ...ListEntityCategory
  }
  metricCategories {
    ...ListMetricCategory
  }
  protocolEventCategories {
    ...ListProtocolEventCategory
  }
  naturalEventCategories {
    ...ListNaturalEventCategory
  }
  relationCategories {
    ...ListRelationCategory
  }
  measurementCategories {
    ...ListMeasurementCategory
  }
  structureRelationCategories {
    ...ListStructureRelationCategory
  }
  queries {
    ...ListGraphQuery
  }
  pinned
  image {
    ...MediaStore
  }
  materializedEdges {
    ...ListMaterializedEdge
  }
}
    ${ListStructureCategoryFragmentDoc}
${ListEntityCategoryFragmentDoc}
${ListMetricCategoryFragmentDoc}
${ListProtocolEventCategoryFragmentDoc}
${ListNaturalEventCategoryFragmentDoc}
${ListRelationCategoryFragmentDoc}
${ListMeasurementCategoryFragmentDoc}
${ListStructureRelationCategoryFragmentDoc}
${ListGraphQueryFragmentDoc}
${MediaStoreFragmentDoc}
${ListMaterializedEdgeFragmentDoc}`;
export const ListGraphFragmentDoc = gql`
    fragment ListGraph on Graph {
  id
  name
  description
  pinned
  image {
    ...MediaStore
  }
}
    ${MediaStoreFragmentDoc}`;
export const BaseListNodeCategoryFragmentDoc = gql`
    fragment BaseListNodeCategory on NodeCategory {
  id
  positionX
  positionY
  width
  height
}
    `;
export const MaterializedEdgeFragmentDoc = gql`
    fragment MaterializedEdge on MaterializedEdge {
  id
  graph {
    id
    name
  }
  source {
    id
    label
    description
  }
  target {
    id
    label
    description
  }
}
    `;
export const BaseEdgeCategoryFragmentDoc = gql`
    fragment BaseEdgeCategory on EdgeCategory {
  id
}
    `;
export const MeasurementCategoryFragmentDoc = gql`
    fragment MeasurementCategory on MeasurementCategory {
  ...BaseEdgeCategory
  ...BaseCategory
  sourceDescriptor {
    ...StructureDescriptor
  }
  targetDescriptor {
    ...EntityDescriptor
  }
  ageName
  label
  description
  image {
    presignedUrl
  }
  pinned
}
    ${BaseEdgeCategoryFragmentDoc}
${BaseCategoryFragmentDoc}
${StructureDescriptorFragmentDoc}
${EntityDescriptorFragmentDoc}`;
export const ListMeasurementCategoryWithGraphFragmentDoc = gql`
    fragment ListMeasurementCategoryWithGraph on MeasurementCategory {
  ...ListMeasurementCategory
  graph {
    id
    name
  }
}
    ${ListMeasurementCategoryFragmentDoc}`;
export const RelationCategoryFragmentDoc = gql`
    fragment RelationCategory on RelationCategory {
  ...BaseEdgeCategory
  ...BaseCategory
  sourceDescriptor {
    ...EntityDescriptor
  }
  targetDescriptor {
    ...EntityDescriptor
  }
  propertyDefinitions {
    ...PropertyDefinition
  }
  ageName
  label
  description
  image {
    presignedUrl
  }
  pinned
}
    ${BaseEdgeCategoryFragmentDoc}
${BaseCategoryFragmentDoc}
${EntityDescriptorFragmentDoc}
${PropertyDefinitionFragmentDoc}`;
export const StructureRelationCategoryFragmentDoc = gql`
    fragment StructureRelationCategory on StructureRelationCategory {
  ...BaseEdgeCategory
  ...BaseCategory
  sourceDescriptor {
    ...StructureDescriptor
  }
  targetDescriptor {
    ...StructureDescriptor
  }
  propertyDefinitions {
    ...PropertyDefinition
  }
  ageName
  label
  description
  image {
    presignedUrl
  }
  pinned
}
    ${BaseEdgeCategoryFragmentDoc}
${BaseCategoryFragmentDoc}
${StructureDescriptorFragmentDoc}
${PropertyDefinitionFragmentDoc}`;
export const ListStructureRelationCategoryWithGraphFragmentDoc = gql`
    fragment ListStructureRelationCategoryWithGraph on StructureRelationCategory {
  ...ListStructureRelationCategory
  graph {
    id
    name
    description
  }
}
    ${ListStructureRelationCategoryFragmentDoc}`;
export const InformedStructureFragmentDoc = gql`
    fragment InformedStructure on Structure {
  ...BaseNode
  id
  category {
    id
    identifier
  }
  graph {
    id
    name
  }
  metrics {
    id
    category {
      label
    }
    value
  }
}
    ${BaseNodeFragmentDoc}`;
export const DetailStructureRelationFragmentDoc = gql`
    fragment DetailStructureRelation on StructureRelation {
  id
  measuredFrom
  measuredTo
  category {
    id
    label
  }
  sourceId
  targetId
  source {
    ... on Structure {
      identifier
      object
    }
  }
  target {
    ... on Structure {
      identifier
      object
    }
  }
}
    `;
export const CreateEntityDocument = gql`
    mutation CreateEntity($input: CreateEntityInput!) {
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
export const UpdateEntityDocument = gql`
    mutation UpdateEntity($input: UpdateEntityInput!) {
  updateEntity(input: $input) {
    ...Entity
  }
}
    ${EntityFragmentDoc}`;
export type UpdateEntityMutationFn = Apollo.MutationFunction<UpdateEntityMutation, UpdateEntityMutationVariables>;

/**
 * __useUpdateEntityMutation__
 *
 * To run a mutation, you first call `useUpdateEntityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEntityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEntityMutation, { data, loading, error }] = useUpdateEntityMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEntityMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateEntityMutation, UpdateEntityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateEntityMutation, UpdateEntityMutationVariables>(UpdateEntityDocument, options);
      }
export type UpdateEntityMutationHookResult = ReturnType<typeof useUpdateEntityMutation>;
export type UpdateEntityMutationResult = Apollo.MutationResult<UpdateEntityMutation>;
export type UpdateEntityMutationOptions = Apollo.BaseMutationOptions<UpdateEntityMutation, UpdateEntityMutationVariables>;
export const CreateEntityInlineDocument = gql`
    mutation CreateEntityInline($category: String!) {
  result: createEntity(input: {entityCategory: $category}) {
    value: id
    label: label
  }
}
    `;
export type CreateEntityInlineMutationFn = Apollo.MutationFunction<CreateEntityInlineMutation, CreateEntityInlineMutationVariables>;

/**
 * __useCreateEntityInlineMutation__
 *
 * To run a mutation, you first call `useCreateEntityInlineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEntityInlineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEntityInlineMutation, { data, loading, error }] = useCreateEntityInlineMutation({
 *   variables: {
 *      category: // value for 'category'
 *   },
 * });
 */
export function useCreateEntityInlineMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateEntityInlineMutation, CreateEntityInlineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateEntityInlineMutation, CreateEntityInlineMutationVariables>(CreateEntityInlineDocument, options);
      }
export type CreateEntityInlineMutationHookResult = ReturnType<typeof useCreateEntityInlineMutation>;
export type CreateEntityInlineMutationResult = Apollo.MutationResult<CreateEntityInlineMutation>;
export type CreateEntityInlineMutationOptions = Apollo.BaseMutationOptions<CreateEntityInlineMutation, CreateEntityInlineMutationVariables>;
export const ArchiveEntityDocument = gql`
    mutation ArchiveEntity($id: GraphID!) {
  archiveEntity(input: {id: $id}) {
    ...Entity
  }
}
    ${EntityFragmentDoc}`;
export type ArchiveEntityMutationFn = Apollo.MutationFunction<ArchiveEntityMutation, ArchiveEntityMutationVariables>;

/**
 * __useArchiveEntityMutation__
 *
 * To run a mutation, you first call `useArchiveEntityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveEntityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveEntityMutation, { data, loading, error }] = useArchiveEntityMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveEntityMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ArchiveEntityMutation, ArchiveEntityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ArchiveEntityMutation, ArchiveEntityMutationVariables>(ArchiveEntityDocument, options);
      }
export type ArchiveEntityMutationHookResult = ReturnType<typeof useArchiveEntityMutation>;
export type ArchiveEntityMutationResult = Apollo.MutationResult<ArchiveEntityMutation>;
export type ArchiveEntityMutationOptions = Apollo.BaseMutationOptions<ArchiveEntityMutation, ArchiveEntityMutationVariables>;
export const DeleteEntityDocument = gql`
    mutation DeleteEntity($id: GraphID!) {
  deleteEntity(input: {id: $id})
}
    `;
export type DeleteEntityMutationFn = Apollo.MutationFunction<DeleteEntityMutation, DeleteEntityMutationVariables>;

/**
 * __useDeleteEntityMutation__
 *
 * To run a mutation, you first call `useDeleteEntityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEntityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEntityMutation, { data, loading, error }] = useDeleteEntityMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEntityMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteEntityMutation, DeleteEntityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteEntityMutation, DeleteEntityMutationVariables>(DeleteEntityDocument, options);
      }
export type DeleteEntityMutationHookResult = ReturnType<typeof useDeleteEntityMutation>;
export type DeleteEntityMutationResult = Apollo.MutationResult<DeleteEntityMutation>;
export type DeleteEntityMutationOptions = Apollo.BaseMutationOptions<DeleteEntityMutation, DeleteEntityMutationVariables>;
export const CreateGraphTableQueryDocument = gql`
    mutation CreateGraphTableQuery($input: CreateGraphTableQueryInput!) {
  createGraphTableQuery(input: $input) {
    ...GraphTableQuery
  }
}
    ${GraphTableQueryFragmentDoc}`;
export type CreateGraphTableQueryMutationFn = Apollo.MutationFunction<CreateGraphTableQueryMutation, CreateGraphTableQueryMutationVariables>;

/**
 * __useCreateGraphTableQueryMutation__
 *
 * To run a mutation, you first call `useCreateGraphTableQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGraphTableQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGraphTableQueryMutation, { data, loading, error }] = useCreateGraphTableQueryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGraphTableQueryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateGraphTableQueryMutation, CreateGraphTableQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateGraphTableQueryMutation, CreateGraphTableQueryMutationVariables>(CreateGraphTableQueryDocument, options);
      }
export type CreateGraphTableQueryMutationHookResult = ReturnType<typeof useCreateGraphTableQueryMutation>;
export type CreateGraphTableQueryMutationResult = Apollo.MutationResult<CreateGraphTableQueryMutation>;
export type CreateGraphTableQueryMutationOptions = Apollo.BaseMutationOptions<CreateGraphTableQueryMutation, CreateGraphTableQueryMutationVariables>;
export const UpdateGraphTableQueryDocument = gql`
    mutation UpdateGraphTableQuery($input: UpdateGraphTableQueryInput!) {
  updateGraphTableQuery(input: $input) {
    ...GraphTableQuery
  }
}
    ${GraphTableQueryFragmentDoc}`;
export type UpdateGraphTableQueryMutationFn = Apollo.MutationFunction<UpdateGraphTableQueryMutation, UpdateGraphTableQueryMutationVariables>;

/**
 * __useUpdateGraphTableQueryMutation__
 *
 * To run a mutation, you first call `useUpdateGraphTableQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGraphTableQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGraphTableQueryMutation, { data, loading, error }] = useUpdateGraphTableQueryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGraphTableQueryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateGraphTableQueryMutation, UpdateGraphTableQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateGraphTableQueryMutation, UpdateGraphTableQueryMutationVariables>(UpdateGraphTableQueryDocument, options);
      }
export type UpdateGraphTableQueryMutationHookResult = ReturnType<typeof useUpdateGraphTableQueryMutation>;
export type UpdateGraphTableQueryMutationResult = Apollo.MutationResult<UpdateGraphTableQueryMutation>;
export type UpdateGraphTableQueryMutationOptions = Apollo.BaseMutationOptions<UpdateGraphTableQueryMutation, UpdateGraphTableQueryMutationVariables>;
export const DeleteGraphTableQueryDocument = gql`
    mutation DeleteGraphTableQuery($id: String!) {
  deleteGraphTableQuery(input: {id: $id})
}
    `;
export type DeleteGraphTableQueryMutationFn = Apollo.MutationFunction<DeleteGraphTableQueryMutation, DeleteGraphTableQueryMutationVariables>;

/**
 * __useDeleteGraphTableQueryMutation__
 *
 * To run a mutation, you first call `useDeleteGraphTableQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGraphTableQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGraphTableQueryMutation, { data, loading, error }] = useDeleteGraphTableQueryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteGraphTableQueryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteGraphTableQueryMutation, DeleteGraphTableQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteGraphTableQueryMutation, DeleteGraphTableQueryMutationVariables>(DeleteGraphTableQueryDocument, options);
      }
export type DeleteGraphTableQueryMutationHookResult = ReturnType<typeof useDeleteGraphTableQueryMutation>;
export type DeleteGraphTableQueryMutationResult = Apollo.MutationResult<DeleteGraphTableQueryMutation>;
export type DeleteGraphTableQueryMutationOptions = Apollo.BaseMutationOptions<DeleteGraphTableQueryMutation, DeleteGraphTableQueryMutationVariables>;
export const CreateNodeTableQueryDocument = gql`
    mutation CreateNodeTableQuery($input: CreateNodeTableQueryInput!) {
  createNodeTableQuery(input: $input) {
    ...NodeTableQuery
  }
}
    ${NodeTableQueryFragmentDoc}`;
export type CreateNodeTableQueryMutationFn = Apollo.MutationFunction<CreateNodeTableQueryMutation, CreateNodeTableQueryMutationVariables>;

/**
 * __useCreateNodeTableQueryMutation__
 *
 * To run a mutation, you first call `useCreateNodeTableQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNodeTableQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNodeTableQueryMutation, { data, loading, error }] = useCreateNodeTableQueryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNodeTableQueryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateNodeTableQueryMutation, CreateNodeTableQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateNodeTableQueryMutation, CreateNodeTableQueryMutationVariables>(CreateNodeTableQueryDocument, options);
      }
export type CreateNodeTableQueryMutationHookResult = ReturnType<typeof useCreateNodeTableQueryMutation>;
export type CreateNodeTableQueryMutationResult = Apollo.MutationResult<CreateNodeTableQueryMutation>;
export type CreateNodeTableQueryMutationOptions = Apollo.BaseMutationOptions<CreateNodeTableQueryMutation, CreateNodeTableQueryMutationVariables>;
export const UpdateNodeTableQueryDocument = gql`
    mutation UpdateNodeTableQuery($input: UpdateNodeTableQueryInput!) {
  updateNodeTableQuery(input: $input) {
    ...NodeTableQuery
  }
}
    ${NodeTableQueryFragmentDoc}`;
export type UpdateNodeTableQueryMutationFn = Apollo.MutationFunction<UpdateNodeTableQueryMutation, UpdateNodeTableQueryMutationVariables>;

/**
 * __useUpdateNodeTableQueryMutation__
 *
 * To run a mutation, you first call `useUpdateNodeTableQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNodeTableQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNodeTableQueryMutation, { data, loading, error }] = useUpdateNodeTableQueryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateNodeTableQueryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateNodeTableQueryMutation, UpdateNodeTableQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateNodeTableQueryMutation, UpdateNodeTableQueryMutationVariables>(UpdateNodeTableQueryDocument, options);
      }
export type UpdateNodeTableQueryMutationHookResult = ReturnType<typeof useUpdateNodeTableQueryMutation>;
export type UpdateNodeTableQueryMutationResult = Apollo.MutationResult<UpdateNodeTableQueryMutation>;
export type UpdateNodeTableQueryMutationOptions = Apollo.BaseMutationOptions<UpdateNodeTableQueryMutation, UpdateNodeTableQueryMutationVariables>;
export const CreateScatterPlotDocument = gql`
    mutation CreateScatterPlot($input: CreateScatterPlotInput!) {
  createScatterPlot(input: $input) {
    ...ScatterPlot
  }
}
    ${ScatterPlotFragmentDoc}`;
export type CreateScatterPlotMutationFn = Apollo.MutationFunction<CreateScatterPlotMutation, CreateScatterPlotMutationVariables>;

/**
 * __useCreateScatterPlotMutation__
 *
 * To run a mutation, you first call `useCreateScatterPlotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateScatterPlotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createScatterPlotMutation, { data, loading, error }] = useCreateScatterPlotMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateScatterPlotMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateScatterPlotMutation, CreateScatterPlotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateScatterPlotMutation, CreateScatterPlotMutationVariables>(CreateScatterPlotDocument, options);
      }
export type CreateScatterPlotMutationHookResult = ReturnType<typeof useCreateScatterPlotMutation>;
export type CreateScatterPlotMutationResult = Apollo.MutationResult<CreateScatterPlotMutation>;
export type CreateScatterPlotMutationOptions = Apollo.BaseMutationOptions<CreateScatterPlotMutation, CreateScatterPlotMutationVariables>;
export const DeleteScatterPlotDocument = gql`
    mutation DeleteScatterPlot($input: DeleteScatterPlotInput!) {
  deleteScatterPlot(input: $input)
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
 *      input: // value for 'input'
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
export const CreateMeasurementDocument = gql`
    mutation CreateMeasurement($input: CreateMeasurementInput!) {
  createMeasurement(input: $input) {
    ...Measurement
  }
}
    ${MeasurementFragmentDoc}`;
export type CreateMeasurementMutationFn = Apollo.MutationFunction<CreateMeasurementMutation, CreateMeasurementMutationVariables>;

/**
 * __useCreateMeasurementMutation__
 *
 * To run a mutation, you first call `useCreateMeasurementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMeasurementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMeasurementMutation, { data, loading, error }] = useCreateMeasurementMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMeasurementMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMeasurementMutation, CreateMeasurementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMeasurementMutation, CreateMeasurementMutationVariables>(CreateMeasurementDocument, options);
      }
export type CreateMeasurementMutationHookResult = ReturnType<typeof useCreateMeasurementMutation>;
export type CreateMeasurementMutationResult = Apollo.MutationResult<CreateMeasurementMutation>;
export type CreateMeasurementMutationOptions = Apollo.BaseMutationOptions<CreateMeasurementMutation, CreateMeasurementMutationVariables>;
export const CreateMetricDocument = gql`
    mutation CreateMetric($input: CreateMetricInput!) {
  createMetric(input: $input) {
    ...Metric
  }
}
    ${MetricFragmentDoc}`;
export type CreateMetricMutationFn = Apollo.MutationFunction<CreateMetricMutation, CreateMetricMutationVariables>;

/**
 * __useCreateMetricMutation__
 *
 * To run a mutation, you first call `useCreateMetricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMetricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMetricMutation, { data, loading, error }] = useCreateMetricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMetricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMetricMutation, CreateMetricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMetricMutation, CreateMetricMutationVariables>(CreateMetricDocument, options);
      }
export type CreateMetricMutationHookResult = ReturnType<typeof useCreateMetricMutation>;
export type CreateMetricMutationResult = Apollo.MutationResult<CreateMetricMutation>;
export type CreateMetricMutationOptions = Apollo.BaseMutationOptions<CreateMetricMutation, CreateMetricMutationVariables>;
export const DeleteMetricDocument = gql`
    mutation DeleteMetric($id: String!) {
  deleteMetric(input: {id: $id})
}
    `;
export type DeleteMetricMutationFn = Apollo.MutationFunction<DeleteMetricMutation, DeleteMetricMutationVariables>;

/**
 * __useDeleteMetricMutation__
 *
 * To run a mutation, you first call `useDeleteMetricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMetricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMetricMutation, { data, loading, error }] = useDeleteMetricMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMetricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteMetricMutation, DeleteMetricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteMetricMutation, DeleteMetricMutationVariables>(DeleteMetricDocument, options);
      }
export type DeleteMetricMutationHookResult = ReturnType<typeof useDeleteMetricMutation>;
export type DeleteMetricMutationResult = Apollo.MutationResult<DeleteMetricMutation>;
export type DeleteMetricMutationOptions = Apollo.BaseMutationOptions<DeleteMetricMutation, DeleteMetricMutationVariables>;
export const ArchiveMetricDocument = gql`
    mutation ArchiveMetric($id: String!) {
  archiveMetric(input: {id: $id}) {
    ...Metric
  }
}
    ${MetricFragmentDoc}`;
export type ArchiveMetricMutationFn = Apollo.MutationFunction<ArchiveMetricMutation, ArchiveMetricMutationVariables>;

/**
 * __useArchiveMetricMutation__
 *
 * To run a mutation, you first call `useArchiveMetricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveMetricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveMetricMutation, { data, loading, error }] = useArchiveMetricMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveMetricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ArchiveMetricMutation, ArchiveMetricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ArchiveMetricMutation, ArchiveMetricMutationVariables>(ArchiveMetricDocument, options);
      }
export type ArchiveMetricMutationHookResult = ReturnType<typeof useArchiveMetricMutation>;
export type ArchiveMetricMutationResult = Apollo.MutationResult<ArchiveMetricMutation>;
export type ArchiveMetricMutationOptions = Apollo.BaseMutationOptions<ArchiveMetricMutation, ArchiveMetricMutationVariables>;
export const UpdateMetricDocument = gql`
    mutation UpdateMetric($input: UpdateMetricInput!) {
  updateMetric(input: $input) {
    ...Metric
  }
}
    ${MetricFragmentDoc}`;
export type UpdateMetricMutationFn = Apollo.MutationFunction<UpdateMetricMutation, UpdateMetricMutationVariables>;

/**
 * __useUpdateMetricMutation__
 *
 * To run a mutation, you first call `useUpdateMetricMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMetricMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMetricMutation, { data, loading, error }] = useUpdateMetricMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMetricMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMetricMutation, UpdateMetricMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateMetricMutation, UpdateMetricMutationVariables>(UpdateMetricDocument, options);
      }
export type UpdateMetricMutationHookResult = ReturnType<typeof useUpdateMetricMutation>;
export type UpdateMetricMutationResult = Apollo.MutationResult<UpdateMetricMutation>;
export type UpdateMetricMutationOptions = Apollo.BaseMutationOptions<UpdateMetricMutation, UpdateMetricMutationVariables>;
export const CreateNaturalEventDocument = gql`
    mutation CreateNaturalEvent($input: CreateNaturalEventInput!) {
  createNaturalEvent(input: $input) {
    ...NaturalEvent
  }
}
    ${NaturalEventFragmentDoc}`;
export type CreateNaturalEventMutationFn = Apollo.MutationFunction<CreateNaturalEventMutation, CreateNaturalEventMutationVariables>;

/**
 * __useCreateNaturalEventMutation__
 *
 * To run a mutation, you first call `useCreateNaturalEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNaturalEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNaturalEventMutation, { data, loading, error }] = useCreateNaturalEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNaturalEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateNaturalEventMutation, CreateNaturalEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateNaturalEventMutation, CreateNaturalEventMutationVariables>(CreateNaturalEventDocument, options);
      }
export type CreateNaturalEventMutationHookResult = ReturnType<typeof useCreateNaturalEventMutation>;
export type CreateNaturalEventMutationResult = Apollo.MutationResult<CreateNaturalEventMutation>;
export type CreateNaturalEventMutationOptions = Apollo.BaseMutationOptions<CreateNaturalEventMutation, CreateNaturalEventMutationVariables>;
export const DeleteNaturalEventDocument = gql`
    mutation DeleteNaturalEvent($id: String!) {
  deleteNaturalEvent(input: {id: $id})
}
    `;
export type DeleteNaturalEventMutationFn = Apollo.MutationFunction<DeleteNaturalEventMutation, DeleteNaturalEventMutationVariables>;

/**
 * __useDeleteNaturalEventMutation__
 *
 * To run a mutation, you first call `useDeleteNaturalEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNaturalEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNaturalEventMutation, { data, loading, error }] = useDeleteNaturalEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteNaturalEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteNaturalEventMutation, DeleteNaturalEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteNaturalEventMutation, DeleteNaturalEventMutationVariables>(DeleteNaturalEventDocument, options);
      }
export type DeleteNaturalEventMutationHookResult = ReturnType<typeof useDeleteNaturalEventMutation>;
export type DeleteNaturalEventMutationResult = Apollo.MutationResult<DeleteNaturalEventMutation>;
export type DeleteNaturalEventMutationOptions = Apollo.BaseMutationOptions<DeleteNaturalEventMutation, DeleteNaturalEventMutationVariables>;
export const ArchiveNaturalEventDocument = gql`
    mutation ArchiveNaturalEvent($id: String!) {
  archiveNaturalEvent(input: {id: $id}) {
    ...NaturalEvent
  }
}
    ${NaturalEventFragmentDoc}`;
export type ArchiveNaturalEventMutationFn = Apollo.MutationFunction<ArchiveNaturalEventMutation, ArchiveNaturalEventMutationVariables>;

/**
 * __useArchiveNaturalEventMutation__
 *
 * To run a mutation, you first call `useArchiveNaturalEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveNaturalEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveNaturalEventMutation, { data, loading, error }] = useArchiveNaturalEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveNaturalEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ArchiveNaturalEventMutation, ArchiveNaturalEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ArchiveNaturalEventMutation, ArchiveNaturalEventMutationVariables>(ArchiveNaturalEventDocument, options);
      }
export type ArchiveNaturalEventMutationHookResult = ReturnType<typeof useArchiveNaturalEventMutation>;
export type ArchiveNaturalEventMutationResult = Apollo.MutationResult<ArchiveNaturalEventMutation>;
export type ArchiveNaturalEventMutationOptions = Apollo.BaseMutationOptions<ArchiveNaturalEventMutation, ArchiveNaturalEventMutationVariables>;
export const UpdateNaturalEventDocument = gql`
    mutation UpdateNaturalEvent($input: UpdateNaturalEventInput!) {
  updateNaturalEvent(input: $input) {
    ...NaturalEvent
  }
}
    ${NaturalEventFragmentDoc}`;
export type UpdateNaturalEventMutationFn = Apollo.MutationFunction<UpdateNaturalEventMutation, UpdateNaturalEventMutationVariables>;

/**
 * __useUpdateNaturalEventMutation__
 *
 * To run a mutation, you first call `useUpdateNaturalEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNaturalEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNaturalEventMutation, { data, loading, error }] = useUpdateNaturalEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateNaturalEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateNaturalEventMutation, UpdateNaturalEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateNaturalEventMutation, UpdateNaturalEventMutationVariables>(UpdateNaturalEventDocument, options);
      }
export type UpdateNaturalEventMutationHookResult = ReturnType<typeof useUpdateNaturalEventMutation>;
export type UpdateNaturalEventMutationResult = Apollo.MutationResult<UpdateNaturalEventMutation>;
export type UpdateNaturalEventMutationOptions = Apollo.BaseMutationOptions<UpdateNaturalEventMutation, UpdateNaturalEventMutationVariables>;
export const CreateProtocolEventDocument = gql`
    mutation CreateProtocolEvent($input: CreateProtocolEventInput!) {
  createProtocolEvent(input: $input) {
    ...ProtocolEvent
  }
}
    ${ProtocolEventFragmentDoc}`;
export type CreateProtocolEventMutationFn = Apollo.MutationFunction<CreateProtocolEventMutation, CreateProtocolEventMutationVariables>;

/**
 * __useCreateProtocolEventMutation__
 *
 * To run a mutation, you first call `useCreateProtocolEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProtocolEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProtocolEventMutation, { data, loading, error }] = useCreateProtocolEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProtocolEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProtocolEventMutation, CreateProtocolEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateProtocolEventMutation, CreateProtocolEventMutationVariables>(CreateProtocolEventDocument, options);
      }
export type CreateProtocolEventMutationHookResult = ReturnType<typeof useCreateProtocolEventMutation>;
export type CreateProtocolEventMutationResult = Apollo.MutationResult<CreateProtocolEventMutation>;
export type CreateProtocolEventMutationOptions = Apollo.BaseMutationOptions<CreateProtocolEventMutation, CreateProtocolEventMutationVariables>;
export const DeleteProtocolEventDocument = gql`
    mutation DeleteProtocolEvent($id: String!) {
  deleteProtocolEvent(input: {id: $id})
}
    `;
export type DeleteProtocolEventMutationFn = Apollo.MutationFunction<DeleteProtocolEventMutation, DeleteProtocolEventMutationVariables>;

/**
 * __useDeleteProtocolEventMutation__
 *
 * To run a mutation, you first call `useDeleteProtocolEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProtocolEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProtocolEventMutation, { data, loading, error }] = useDeleteProtocolEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProtocolEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteProtocolEventMutation, DeleteProtocolEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteProtocolEventMutation, DeleteProtocolEventMutationVariables>(DeleteProtocolEventDocument, options);
      }
export type DeleteProtocolEventMutationHookResult = ReturnType<typeof useDeleteProtocolEventMutation>;
export type DeleteProtocolEventMutationResult = Apollo.MutationResult<DeleteProtocolEventMutation>;
export type DeleteProtocolEventMutationOptions = Apollo.BaseMutationOptions<DeleteProtocolEventMutation, DeleteProtocolEventMutationVariables>;
export const ArchiveProtocolEventDocument = gql`
    mutation ArchiveProtocolEvent($id: String!) {
  archiveProtocolEvent(input: {id: $id}) {
    ...ProtocolEvent
  }
}
    ${ProtocolEventFragmentDoc}`;
export type ArchiveProtocolEventMutationFn = Apollo.MutationFunction<ArchiveProtocolEventMutation, ArchiveProtocolEventMutationVariables>;

/**
 * __useArchiveProtocolEventMutation__
 *
 * To run a mutation, you first call `useArchiveProtocolEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveProtocolEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveProtocolEventMutation, { data, loading, error }] = useArchiveProtocolEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveProtocolEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ArchiveProtocolEventMutation, ArchiveProtocolEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ArchiveProtocolEventMutation, ArchiveProtocolEventMutationVariables>(ArchiveProtocolEventDocument, options);
      }
export type ArchiveProtocolEventMutationHookResult = ReturnType<typeof useArchiveProtocolEventMutation>;
export type ArchiveProtocolEventMutationResult = Apollo.MutationResult<ArchiveProtocolEventMutation>;
export type ArchiveProtocolEventMutationOptions = Apollo.BaseMutationOptions<ArchiveProtocolEventMutation, ArchiveProtocolEventMutationVariables>;
export const UpdateProtocolEventDocument = gql`
    mutation UpdateProtocolEvent($input: UpdateProtocolEventInput!) {
  updateProtocolEvent(input: $input) {
    ...ProtocolEvent
  }
}
    ${ProtocolEventFragmentDoc}`;
export type UpdateProtocolEventMutationFn = Apollo.MutationFunction<UpdateProtocolEventMutation, UpdateProtocolEventMutationVariables>;

/**
 * __useUpdateProtocolEventMutation__
 *
 * To run a mutation, you first call `useUpdateProtocolEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProtocolEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProtocolEventMutation, { data, loading, error }] = useUpdateProtocolEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProtocolEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProtocolEventMutation, UpdateProtocolEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateProtocolEventMutation, UpdateProtocolEventMutationVariables>(UpdateProtocolEventDocument, options);
      }
export type UpdateProtocolEventMutationHookResult = ReturnType<typeof useUpdateProtocolEventMutation>;
export type UpdateProtocolEventMutationResult = Apollo.MutationResult<UpdateProtocolEventMutation>;
export type UpdateProtocolEventMutationOptions = Apollo.BaseMutationOptions<UpdateProtocolEventMutation, UpdateProtocolEventMutationVariables>;
export const CreateRelationDocument = gql`
    mutation CreateRelation($input: CreateRelationInput!) {
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
export const DeleteRelationDocument = gql`
    mutation DeleteRelation($id: GraphID!) {
  deleteRelation(input: {id: $id})
}
    `;
export type DeleteRelationMutationFn = Apollo.MutationFunction<DeleteRelationMutation, DeleteRelationMutationVariables>;

/**
 * __useDeleteRelationMutation__
 *
 * To run a mutation, you first call `useDeleteRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRelationMutation, { data, loading, error }] = useDeleteRelationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRelationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRelationMutation, DeleteRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteRelationMutation, DeleteRelationMutationVariables>(DeleteRelationDocument, options);
      }
export type DeleteRelationMutationHookResult = ReturnType<typeof useDeleteRelationMutation>;
export type DeleteRelationMutationResult = Apollo.MutationResult<DeleteRelationMutation>;
export type DeleteRelationMutationOptions = Apollo.BaseMutationOptions<DeleteRelationMutation, DeleteRelationMutationVariables>;
export const ArchiveRelationDocument = gql`
    mutation ArchiveRelation($id: GraphID!) {
  archiveRelation(input: {id: $id}) {
    ...Relation
  }
}
    ${RelationFragmentDoc}`;
export type ArchiveRelationMutationFn = Apollo.MutationFunction<ArchiveRelationMutation, ArchiveRelationMutationVariables>;

/**
 * __useArchiveRelationMutation__
 *
 * To run a mutation, you first call `useArchiveRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveRelationMutation, { data, loading, error }] = useArchiveRelationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveRelationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ArchiveRelationMutation, ArchiveRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ArchiveRelationMutation, ArchiveRelationMutationVariables>(ArchiveRelationDocument, options);
      }
export type ArchiveRelationMutationHookResult = ReturnType<typeof useArchiveRelationMutation>;
export type ArchiveRelationMutationResult = Apollo.MutationResult<ArchiveRelationMutation>;
export type ArchiveRelationMutationOptions = Apollo.BaseMutationOptions<ArchiveRelationMutation, ArchiveRelationMutationVariables>;
export const UpdateRelationDocument = gql`
    mutation UpdateRelation($input: UpdateRelationInput!) {
  updateRelation(input: $input) {
    ...Relation
  }
}
    ${RelationFragmentDoc}`;
export type UpdateRelationMutationFn = Apollo.MutationFunction<UpdateRelationMutation, UpdateRelationMutationVariables>;

/**
 * __useUpdateRelationMutation__
 *
 * To run a mutation, you first call `useUpdateRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRelationMutation, { data, loading, error }] = useUpdateRelationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRelationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRelationMutation, UpdateRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateRelationMutation, UpdateRelationMutationVariables>(UpdateRelationDocument, options);
      }
export type UpdateRelationMutationHookResult = ReturnType<typeof useUpdateRelationMutation>;
export type UpdateRelationMutationResult = Apollo.MutationResult<UpdateRelationMutation>;
export type UpdateRelationMutationOptions = Apollo.BaseMutationOptions<UpdateRelationMutation, UpdateRelationMutationVariables>;
export const CreateEntityCategoryDocument = gql`
    mutation CreateEntityCategory($input: CreateEntityDefinitionInput!) {
  createEntityCategory(input: $input) {
    ...EntityCategory
  }
}
    ${EntityCategoryFragmentDoc}`;
export type CreateEntityCategoryMutationFn = Apollo.MutationFunction<CreateEntityCategoryMutation, CreateEntityCategoryMutationVariables>;

/**
 * __useCreateEntityCategoryMutation__
 *
 * To run a mutation, you first call `useCreateEntityCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEntityCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEntityCategoryMutation, { data, loading, error }] = useCreateEntityCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEntityCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateEntityCategoryMutation, CreateEntityCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateEntityCategoryMutation, CreateEntityCategoryMutationVariables>(CreateEntityCategoryDocument, options);
      }
export type CreateEntityCategoryMutationHookResult = ReturnType<typeof useCreateEntityCategoryMutation>;
export type CreateEntityCategoryMutationResult = Apollo.MutationResult<CreateEntityCategoryMutation>;
export type CreateEntityCategoryMutationOptions = Apollo.BaseMutationOptions<CreateEntityCategoryMutation, CreateEntityCategoryMutationVariables>;
export const UpdateEntityCategoryDocument = gql`
    mutation UpdateEntityCategory($input: UpdateEntityDefinitionInput!) {
  updateEntityCategory(input: $input) {
    ...EntityCategory
  }
}
    ${EntityCategoryFragmentDoc}`;
export type UpdateEntityCategoryMutationFn = Apollo.MutationFunction<UpdateEntityCategoryMutation, UpdateEntityCategoryMutationVariables>;

/**
 * __useUpdateEntityCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateEntityCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEntityCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEntityCategoryMutation, { data, loading, error }] = useUpdateEntityCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEntityCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateEntityCategoryMutation, UpdateEntityCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateEntityCategoryMutation, UpdateEntityCategoryMutationVariables>(UpdateEntityCategoryDocument, options);
      }
export type UpdateEntityCategoryMutationHookResult = ReturnType<typeof useUpdateEntityCategoryMutation>;
export type UpdateEntityCategoryMutationResult = Apollo.MutationResult<UpdateEntityCategoryMutation>;
export type UpdateEntityCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateEntityCategoryMutation, UpdateEntityCategoryMutationVariables>;
export const DeleteEntityCategoryDocument = gql`
    mutation DeleteEntityCategory($id: String!) {
  deleteEntityCategory(input: {id: $id})
}
    `;
export type DeleteEntityCategoryMutationFn = Apollo.MutationFunction<DeleteEntityCategoryMutation, DeleteEntityCategoryMutationVariables>;

/**
 * __useDeleteEntityCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteEntityCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEntityCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEntityCategoryMutation, { data, loading, error }] = useDeleteEntityCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEntityCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteEntityCategoryMutation, DeleteEntityCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteEntityCategoryMutation, DeleteEntityCategoryMutationVariables>(DeleteEntityCategoryDocument, options);
      }
export type DeleteEntityCategoryMutationHookResult = ReturnType<typeof useDeleteEntityCategoryMutation>;
export type DeleteEntityCategoryMutationResult = Apollo.MutationResult<DeleteEntityCategoryMutation>;
export type DeleteEntityCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteEntityCategoryMutation, DeleteEntityCategoryMutationVariables>;
export const CreateGraphDocument = gql`
    mutation CreateGraph($input: CreateGraphInput!) {
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
export const CreateInlineGraphDocument = gql`
    mutation CreateInlineGraph($input: String!) {
  result: createGraph(input: {name: $input}) {
    value: id
    label: name
  }
}
    `;
export type CreateInlineGraphMutationFn = Apollo.MutationFunction<CreateInlineGraphMutation, CreateInlineGraphMutationVariables>;

/**
 * __useCreateInlineGraphMutation__
 *
 * To run a mutation, you first call `useCreateInlineGraphMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInlineGraphMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInlineGraphMutation, { data, loading, error }] = useCreateInlineGraphMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateInlineGraphMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateInlineGraphMutation, CreateInlineGraphMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateInlineGraphMutation, CreateInlineGraphMutationVariables>(CreateInlineGraphDocument, options);
      }
export type CreateInlineGraphMutationHookResult = ReturnType<typeof useCreateInlineGraphMutation>;
export type CreateInlineGraphMutationResult = Apollo.MutationResult<CreateInlineGraphMutation>;
export type CreateInlineGraphMutationOptions = Apollo.BaseMutationOptions<CreateInlineGraphMutation, CreateInlineGraphMutationVariables>;
export const DeleteGraphDocument = gql`
    mutation DeleteGraph($id: String!) {
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
export const ArchiveGraphDocument = gql`
    mutation ArchiveGraph($id: String!) {
  archiveGraph(input: {id: $id}) {
    ...Graph
  }
}
    ${GraphFragmentDoc}`;
export type ArchiveGraphMutationFn = Apollo.MutationFunction<ArchiveGraphMutation, ArchiveGraphMutationVariables>;

/**
 * __useArchiveGraphMutation__
 *
 * To run a mutation, you first call `useArchiveGraphMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveGraphMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveGraphMutation, { data, loading, error }] = useArchiveGraphMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveGraphMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ArchiveGraphMutation, ArchiveGraphMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ArchiveGraphMutation, ArchiveGraphMutationVariables>(ArchiveGraphDocument, options);
      }
export type ArchiveGraphMutationHookResult = ReturnType<typeof useArchiveGraphMutation>;
export type ArchiveGraphMutationResult = Apollo.MutationResult<ArchiveGraphMutation>;
export type ArchiveGraphMutationOptions = Apollo.BaseMutationOptions<ArchiveGraphMutation, ArchiveGraphMutationVariables>;
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
export const CreateMeasurementCategoryDocument = gql`
    mutation CreateMeasurementCategory($input: CreateMeasurementDefinitionInput!) {
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
export const UpdateMeasurementCategoryDocument = gql`
    mutation UpdateMeasurementCategory($input: UpdateMeasurementDefinitionInput!) {
  updateMeasurementCategory(input: $input) {
    ...MeasurementCategory
  }
}
    ${MeasurementCategoryFragmentDoc}`;
export type UpdateMeasurementCategoryMutationFn = Apollo.MutationFunction<UpdateMeasurementCategoryMutation, UpdateMeasurementCategoryMutationVariables>;

/**
 * __useUpdateMeasurementCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateMeasurementCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeasurementCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeasurementCategoryMutation, { data, loading, error }] = useUpdateMeasurementCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMeasurementCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMeasurementCategoryMutation, UpdateMeasurementCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateMeasurementCategoryMutation, UpdateMeasurementCategoryMutationVariables>(UpdateMeasurementCategoryDocument, options);
      }
export type UpdateMeasurementCategoryMutationHookResult = ReturnType<typeof useUpdateMeasurementCategoryMutation>;
export type UpdateMeasurementCategoryMutationResult = Apollo.MutationResult<UpdateMeasurementCategoryMutation>;
export type UpdateMeasurementCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateMeasurementCategoryMutation, UpdateMeasurementCategoryMutationVariables>;
export const DeleteMeasurementCategoryDocument = gql`
    mutation DeleteMeasurementCategory($id: String!) {
  deleteMeasurementCategory(input: {id: $id})
}
    `;
export type DeleteMeasurementCategoryMutationFn = Apollo.MutationFunction<DeleteMeasurementCategoryMutation, DeleteMeasurementCategoryMutationVariables>;

/**
 * __useDeleteMeasurementCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteMeasurementCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMeasurementCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMeasurementCategoryMutation, { data, loading, error }] = useDeleteMeasurementCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMeasurementCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteMeasurementCategoryMutation, DeleteMeasurementCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteMeasurementCategoryMutation, DeleteMeasurementCategoryMutationVariables>(DeleteMeasurementCategoryDocument, options);
      }
export type DeleteMeasurementCategoryMutationHookResult = ReturnType<typeof useDeleteMeasurementCategoryMutation>;
export type DeleteMeasurementCategoryMutationResult = Apollo.MutationResult<DeleteMeasurementCategoryMutation>;
export type DeleteMeasurementCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteMeasurementCategoryMutation, DeleteMeasurementCategoryMutationVariables>;
export const CreateMetricCategoryDocument = gql`
    mutation CreateMetricCategory($input: CreateMetricDefinitionInput!) {
  createMetricCategory(input: $input) {
    ...MetricCategory
  }
}
    ${MetricCategoryFragmentDoc}`;
export type CreateMetricCategoryMutationFn = Apollo.MutationFunction<CreateMetricCategoryMutation, CreateMetricCategoryMutationVariables>;

/**
 * __useCreateMetricCategoryMutation__
 *
 * To run a mutation, you first call `useCreateMetricCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMetricCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMetricCategoryMutation, { data, loading, error }] = useCreateMetricCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMetricCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMetricCategoryMutation, CreateMetricCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMetricCategoryMutation, CreateMetricCategoryMutationVariables>(CreateMetricCategoryDocument, options);
      }
export type CreateMetricCategoryMutationHookResult = ReturnType<typeof useCreateMetricCategoryMutation>;
export type CreateMetricCategoryMutationResult = Apollo.MutationResult<CreateMetricCategoryMutation>;
export type CreateMetricCategoryMutationOptions = Apollo.BaseMutationOptions<CreateMetricCategoryMutation, CreateMetricCategoryMutationVariables>;
export const UpdateMetricCategoryDocument = gql`
    mutation UpdateMetricCategory($input: UpdateMetricDefinitionInput!) {
  updateMetricCategory(input: $input) {
    ...MetricCategory
  }
}
    ${MetricCategoryFragmentDoc}`;
export type UpdateMetricCategoryMutationFn = Apollo.MutationFunction<UpdateMetricCategoryMutation, UpdateMetricCategoryMutationVariables>;

/**
 * __useUpdateMetricCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateMetricCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMetricCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMetricCategoryMutation, { data, loading, error }] = useUpdateMetricCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMetricCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMetricCategoryMutation, UpdateMetricCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateMetricCategoryMutation, UpdateMetricCategoryMutationVariables>(UpdateMetricCategoryDocument, options);
      }
export type UpdateMetricCategoryMutationHookResult = ReturnType<typeof useUpdateMetricCategoryMutation>;
export type UpdateMetricCategoryMutationResult = Apollo.MutationResult<UpdateMetricCategoryMutation>;
export type UpdateMetricCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateMetricCategoryMutation, UpdateMetricCategoryMutationVariables>;
export const DeleteMetricCategoryDocument = gql`
    mutation DeleteMetricCategory($id: String!) {
  deleteMetricCategory(input: {id: $id})
}
    `;
export type DeleteMetricCategoryMutationFn = Apollo.MutationFunction<DeleteMetricCategoryMutation, DeleteMetricCategoryMutationVariables>;

/**
 * __useDeleteMetricCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteMetricCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMetricCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMetricCategoryMutation, { data, loading, error }] = useDeleteMetricCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMetricCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteMetricCategoryMutation, DeleteMetricCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteMetricCategoryMutation, DeleteMetricCategoryMutationVariables>(DeleteMetricCategoryDocument, options);
      }
export type DeleteMetricCategoryMutationHookResult = ReturnType<typeof useDeleteMetricCategoryMutation>;
export type DeleteMetricCategoryMutationResult = Apollo.MutationResult<DeleteMetricCategoryMutation>;
export type DeleteMetricCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteMetricCategoryMutation, DeleteMetricCategoryMutationVariables>;
export const CreateNaturalEventCategoryDocument = gql`
    mutation CreateNaturalEventCategory($input: CreateNaturalEventDefinitionInput!) {
  createNaturalEventCategory(input: $input) {
    ...NaturalEventCategory
  }
}
    ${NaturalEventCategoryFragmentDoc}`;
export type CreateNaturalEventCategoryMutationFn = Apollo.MutationFunction<CreateNaturalEventCategoryMutation, CreateNaturalEventCategoryMutationVariables>;

/**
 * __useCreateNaturalEventCategoryMutation__
 *
 * To run a mutation, you first call `useCreateNaturalEventCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNaturalEventCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNaturalEventCategoryMutation, { data, loading, error }] = useCreateNaturalEventCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNaturalEventCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateNaturalEventCategoryMutation, CreateNaturalEventCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateNaturalEventCategoryMutation, CreateNaturalEventCategoryMutationVariables>(CreateNaturalEventCategoryDocument, options);
      }
export type CreateNaturalEventCategoryMutationHookResult = ReturnType<typeof useCreateNaturalEventCategoryMutation>;
export type CreateNaturalEventCategoryMutationResult = Apollo.MutationResult<CreateNaturalEventCategoryMutation>;
export type CreateNaturalEventCategoryMutationOptions = Apollo.BaseMutationOptions<CreateNaturalEventCategoryMutation, CreateNaturalEventCategoryMutationVariables>;
export const UpdateNaturalEventCategoryDocument = gql`
    mutation UpdateNaturalEventCategory($input: UpdateNaturalEventDefinitionInput!) {
  updateNaturalEventCategory(input: $input) {
    ...NaturalEventCategory
  }
}
    ${NaturalEventCategoryFragmentDoc}`;
export type UpdateNaturalEventCategoryMutationFn = Apollo.MutationFunction<UpdateNaturalEventCategoryMutation, UpdateNaturalEventCategoryMutationVariables>;

/**
 * __useUpdateNaturalEventCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateNaturalEventCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNaturalEventCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNaturalEventCategoryMutation, { data, loading, error }] = useUpdateNaturalEventCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateNaturalEventCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateNaturalEventCategoryMutation, UpdateNaturalEventCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateNaturalEventCategoryMutation, UpdateNaturalEventCategoryMutationVariables>(UpdateNaturalEventCategoryDocument, options);
      }
export type UpdateNaturalEventCategoryMutationHookResult = ReturnType<typeof useUpdateNaturalEventCategoryMutation>;
export type UpdateNaturalEventCategoryMutationResult = Apollo.MutationResult<UpdateNaturalEventCategoryMutation>;
export type UpdateNaturalEventCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateNaturalEventCategoryMutation, UpdateNaturalEventCategoryMutationVariables>;
export const DeleteNaturalEventCategoryDocument = gql`
    mutation DeleteNaturalEventCategory($id: String!) {
  deleteNaturalEventCategory(input: {id: $id})
}
    `;
export type DeleteNaturalEventCategoryMutationFn = Apollo.MutationFunction<DeleteNaturalEventCategoryMutation, DeleteNaturalEventCategoryMutationVariables>;

/**
 * __useDeleteNaturalEventCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteNaturalEventCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNaturalEventCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNaturalEventCategoryMutation, { data, loading, error }] = useDeleteNaturalEventCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteNaturalEventCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteNaturalEventCategoryMutation, DeleteNaturalEventCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteNaturalEventCategoryMutation, DeleteNaturalEventCategoryMutationVariables>(DeleteNaturalEventCategoryDocument, options);
      }
export type DeleteNaturalEventCategoryMutationHookResult = ReturnType<typeof useDeleteNaturalEventCategoryMutation>;
export type DeleteNaturalEventCategoryMutationResult = Apollo.MutationResult<DeleteNaturalEventCategoryMutation>;
export type DeleteNaturalEventCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteNaturalEventCategoryMutation, DeleteNaturalEventCategoryMutationVariables>;
export const CreateProtocolEventCategoryDocument = gql`
    mutation CreateProtocolEventCategory($input: CreateProtocolEventDefinitionInput!) {
  createProtocolEventCategory(input: $input) {
    ...ProtocolEventCategory
  }
}
    ${ProtocolEventCategoryFragmentDoc}`;
export type CreateProtocolEventCategoryMutationFn = Apollo.MutationFunction<CreateProtocolEventCategoryMutation, CreateProtocolEventCategoryMutationVariables>;

/**
 * __useCreateProtocolEventCategoryMutation__
 *
 * To run a mutation, you first call `useCreateProtocolEventCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProtocolEventCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProtocolEventCategoryMutation, { data, loading, error }] = useCreateProtocolEventCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProtocolEventCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProtocolEventCategoryMutation, CreateProtocolEventCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateProtocolEventCategoryMutation, CreateProtocolEventCategoryMutationVariables>(CreateProtocolEventCategoryDocument, options);
      }
export type CreateProtocolEventCategoryMutationHookResult = ReturnType<typeof useCreateProtocolEventCategoryMutation>;
export type CreateProtocolEventCategoryMutationResult = Apollo.MutationResult<CreateProtocolEventCategoryMutation>;
export type CreateProtocolEventCategoryMutationOptions = Apollo.BaseMutationOptions<CreateProtocolEventCategoryMutation, CreateProtocolEventCategoryMutationVariables>;
export const UpdateProtocolEventCategoryDocument = gql`
    mutation UpdateProtocolEventCategory($input: UpdateProtocolEventDefinitionInput!) {
  updateProtocolEventCategory(input: $input) {
    ...ProtocolEventCategory
  }
}
    ${ProtocolEventCategoryFragmentDoc}`;
export type UpdateProtocolEventCategoryMutationFn = Apollo.MutationFunction<UpdateProtocolEventCategoryMutation, UpdateProtocolEventCategoryMutationVariables>;

/**
 * __useUpdateProtocolEventCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateProtocolEventCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProtocolEventCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProtocolEventCategoryMutation, { data, loading, error }] = useUpdateProtocolEventCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProtocolEventCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProtocolEventCategoryMutation, UpdateProtocolEventCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateProtocolEventCategoryMutation, UpdateProtocolEventCategoryMutationVariables>(UpdateProtocolEventCategoryDocument, options);
      }
export type UpdateProtocolEventCategoryMutationHookResult = ReturnType<typeof useUpdateProtocolEventCategoryMutation>;
export type UpdateProtocolEventCategoryMutationResult = Apollo.MutationResult<UpdateProtocolEventCategoryMutation>;
export type UpdateProtocolEventCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateProtocolEventCategoryMutation, UpdateProtocolEventCategoryMutationVariables>;
export const DeleteProtocolEventCategoryDocument = gql`
    mutation DeleteProtocolEventCategory($id: String!) {
  deleteProtocolEventCategory(input: {id: $id})
}
    `;
export type DeleteProtocolEventCategoryMutationFn = Apollo.MutationFunction<DeleteProtocolEventCategoryMutation, DeleteProtocolEventCategoryMutationVariables>;

/**
 * __useDeleteProtocolEventCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteProtocolEventCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProtocolEventCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProtocolEventCategoryMutation, { data, loading, error }] = useDeleteProtocolEventCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProtocolEventCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteProtocolEventCategoryMutation, DeleteProtocolEventCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteProtocolEventCategoryMutation, DeleteProtocolEventCategoryMutationVariables>(DeleteProtocolEventCategoryDocument, options);
      }
export type DeleteProtocolEventCategoryMutationHookResult = ReturnType<typeof useDeleteProtocolEventCategoryMutation>;
export type DeleteProtocolEventCategoryMutationResult = Apollo.MutationResult<DeleteProtocolEventCategoryMutation>;
export type DeleteProtocolEventCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteProtocolEventCategoryMutation, DeleteProtocolEventCategoryMutationVariables>;
export const CreateRelationCategoryDocument = gql`
    mutation CreateRelationCategory($input: CreateRelationDefinitionInput!) {
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
export const UpdateRelationCategoryDocument = gql`
    mutation UpdateRelationCategory($input: UpdateRelationDefinitionInput!) {
  updateRelationCategory(input: $input) {
    ...RelationCategory
  }
}
    ${RelationCategoryFragmentDoc}`;
export type UpdateRelationCategoryMutationFn = Apollo.MutationFunction<UpdateRelationCategoryMutation, UpdateRelationCategoryMutationVariables>;

/**
 * __useUpdateRelationCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateRelationCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRelationCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRelationCategoryMutation, { data, loading, error }] = useUpdateRelationCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRelationCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRelationCategoryMutation, UpdateRelationCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateRelationCategoryMutation, UpdateRelationCategoryMutationVariables>(UpdateRelationCategoryDocument, options);
      }
export type UpdateRelationCategoryMutationHookResult = ReturnType<typeof useUpdateRelationCategoryMutation>;
export type UpdateRelationCategoryMutationResult = Apollo.MutationResult<UpdateRelationCategoryMutation>;
export type UpdateRelationCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateRelationCategoryMutation, UpdateRelationCategoryMutationVariables>;
export const DeleteRelationCategoryDocument = gql`
    mutation DeleteRelationCategory($id: String!) {
  deleteRelationCategory(input: {id: $id})
}
    `;
export type DeleteRelationCategoryMutationFn = Apollo.MutationFunction<DeleteRelationCategoryMutation, DeleteRelationCategoryMutationVariables>;

/**
 * __useDeleteRelationCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteRelationCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRelationCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRelationCategoryMutation, { data, loading, error }] = useDeleteRelationCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRelationCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRelationCategoryMutation, DeleteRelationCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteRelationCategoryMutation, DeleteRelationCategoryMutationVariables>(DeleteRelationCategoryDocument, options);
      }
export type DeleteRelationCategoryMutationHookResult = ReturnType<typeof useDeleteRelationCategoryMutation>;
export type DeleteRelationCategoryMutationResult = Apollo.MutationResult<DeleteRelationCategoryMutation>;
export type DeleteRelationCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteRelationCategoryMutation, DeleteRelationCategoryMutationVariables>;
export const CreateStructureCategoryDocument = gql`
    mutation CreateStructureCategory($input: CreateStructureDefinitionInput!) {
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
    mutation UpdateStructureCategory($input: UpdateStructureDefinitionInput!) {
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
export const DeleteStructureCategoryDocument = gql`
    mutation DeleteStructureCategory($id: String!) {
  deleteStructureCategory(input: {id: $id})
}
    `;
export type DeleteStructureCategoryMutationFn = Apollo.MutationFunction<DeleteStructureCategoryMutation, DeleteStructureCategoryMutationVariables>;

/**
 * __useDeleteStructureCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteStructureCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStructureCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStructureCategoryMutation, { data, loading, error }] = useDeleteStructureCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteStructureCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteStructureCategoryMutation, DeleteStructureCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteStructureCategoryMutation, DeleteStructureCategoryMutationVariables>(DeleteStructureCategoryDocument, options);
      }
export type DeleteStructureCategoryMutationHookResult = ReturnType<typeof useDeleteStructureCategoryMutation>;
export type DeleteStructureCategoryMutationResult = Apollo.MutationResult<DeleteStructureCategoryMutation>;
export type DeleteStructureCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteStructureCategoryMutation, DeleteStructureCategoryMutationVariables>;
export const CreateStructureRelationCategoryDocument = gql`
    mutation CreateStructureRelationCategory($input: CreateStructureRelationDefinitionInput!) {
  createStructureRelationCategory(input: $input) {
    ...StructureRelationCategory
  }
}
    ${StructureRelationCategoryFragmentDoc}`;
export type CreateStructureRelationCategoryMutationFn = Apollo.MutationFunction<CreateStructureRelationCategoryMutation, CreateStructureRelationCategoryMutationVariables>;

/**
 * __useCreateStructureRelationCategoryMutation__
 *
 * To run a mutation, you first call `useCreateStructureRelationCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStructureRelationCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStructureRelationCategoryMutation, { data, loading, error }] = useCreateStructureRelationCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateStructureRelationCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateStructureRelationCategoryMutation, CreateStructureRelationCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateStructureRelationCategoryMutation, CreateStructureRelationCategoryMutationVariables>(CreateStructureRelationCategoryDocument, options);
      }
export type CreateStructureRelationCategoryMutationHookResult = ReturnType<typeof useCreateStructureRelationCategoryMutation>;
export type CreateStructureRelationCategoryMutationResult = Apollo.MutationResult<CreateStructureRelationCategoryMutation>;
export type CreateStructureRelationCategoryMutationOptions = Apollo.BaseMutationOptions<CreateStructureRelationCategoryMutation, CreateStructureRelationCategoryMutationVariables>;
export const UpdateStructureRelationCategoryDocument = gql`
    mutation UpdateStructureRelationCategory($input: UpdateStructureRelationDefinitionInput!) {
  updateStructureRelationCategory(input: $input) {
    ...StructureRelationCategory
  }
}
    ${StructureRelationCategoryFragmentDoc}`;
export type UpdateStructureRelationCategoryMutationFn = Apollo.MutationFunction<UpdateStructureRelationCategoryMutation, UpdateStructureRelationCategoryMutationVariables>;

/**
 * __useUpdateStructureRelationCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateStructureRelationCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStructureRelationCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStructureRelationCategoryMutation, { data, loading, error }] = useUpdateStructureRelationCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateStructureRelationCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateStructureRelationCategoryMutation, UpdateStructureRelationCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateStructureRelationCategoryMutation, UpdateStructureRelationCategoryMutationVariables>(UpdateStructureRelationCategoryDocument, options);
      }
export type UpdateStructureRelationCategoryMutationHookResult = ReturnType<typeof useUpdateStructureRelationCategoryMutation>;
export type UpdateStructureRelationCategoryMutationResult = Apollo.MutationResult<UpdateStructureRelationCategoryMutation>;
export type UpdateStructureRelationCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateStructureRelationCategoryMutation, UpdateStructureRelationCategoryMutationVariables>;
export const DeleteStructureRelationCategoryDocument = gql`
    mutation DeleteStructureRelationCategory($id: String!) {
  deleteStructureRelationCategory(input: {id: $id})
}
    `;
export type DeleteStructureRelationCategoryMutationFn = Apollo.MutationFunction<DeleteStructureRelationCategoryMutation, DeleteStructureRelationCategoryMutationVariables>;

/**
 * __useDeleteStructureRelationCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteStructureRelationCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStructureRelationCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStructureRelationCategoryMutation, { data, loading, error }] = useDeleteStructureRelationCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteStructureRelationCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteStructureRelationCategoryMutation, DeleteStructureRelationCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteStructureRelationCategoryMutation, DeleteStructureRelationCategoryMutationVariables>(DeleteStructureRelationCategoryDocument, options);
      }
export type DeleteStructureRelationCategoryMutationHookResult = ReturnType<typeof useDeleteStructureRelationCategoryMutation>;
export type DeleteStructureRelationCategoryMutationResult = Apollo.MutationResult<DeleteStructureRelationCategoryMutation>;
export type DeleteStructureRelationCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteStructureRelationCategoryMutation, DeleteStructureRelationCategoryMutationVariables>;
export const CreateStructureDocument = gql`
    mutation CreateStructure($input: CreateStructureInput!) {
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
export const EnsureStructureDocument = gql`
    mutation EnsureStructure($input: EnsureStructureInput!) {
  ensureStructure(input: $input) {
    ...Structure
  }
}
    ${StructureFragmentDoc}`;
export type EnsureStructureMutationFn = Apollo.MutationFunction<EnsureStructureMutation, EnsureStructureMutationVariables>;

/**
 * __useEnsureStructureMutation__
 *
 * To run a mutation, you first call `useEnsureStructureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnsureStructureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ensureStructureMutation, { data, loading, error }] = useEnsureStructureMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEnsureStructureMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EnsureStructureMutation, EnsureStructureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<EnsureStructureMutation, EnsureStructureMutationVariables>(EnsureStructureDocument, options);
      }
export type EnsureStructureMutationHookResult = ReturnType<typeof useEnsureStructureMutation>;
export type EnsureStructureMutationResult = Apollo.MutationResult<EnsureStructureMutation>;
export type EnsureStructureMutationOptions = Apollo.BaseMutationOptions<EnsureStructureMutation, EnsureStructureMutationVariables>;
export const DeleteStructureDocument = gql`
    mutation DeleteStructure($id: GraphID!) {
  deleteStructure(input: {id: $id})
}
    `;
export type DeleteStructureMutationFn = Apollo.MutationFunction<DeleteStructureMutation, DeleteStructureMutationVariables>;

/**
 * __useDeleteStructureMutation__
 *
 * To run a mutation, you first call `useDeleteStructureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStructureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStructureMutation, { data, loading, error }] = useDeleteStructureMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteStructureMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteStructureMutation, DeleteStructureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteStructureMutation, DeleteStructureMutationVariables>(DeleteStructureDocument, options);
      }
export type DeleteStructureMutationHookResult = ReturnType<typeof useDeleteStructureMutation>;
export type DeleteStructureMutationResult = Apollo.MutationResult<DeleteStructureMutation>;
export type DeleteStructureMutationOptions = Apollo.BaseMutationOptions<DeleteStructureMutation, DeleteStructureMutationVariables>;
export const ArchiveStructureDocument = gql`
    mutation ArchiveStructure($id: GraphID!) {
  archiveStructure(input: {id: $id}) {
    ...Structure
  }
}
    ${StructureFragmentDoc}`;
export type ArchiveStructureMutationFn = Apollo.MutationFunction<ArchiveStructureMutation, ArchiveStructureMutationVariables>;

/**
 * __useArchiveStructureMutation__
 *
 * To run a mutation, you first call `useArchiveStructureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveStructureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveStructureMutation, { data, loading, error }] = useArchiveStructureMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveStructureMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ArchiveStructureMutation, ArchiveStructureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ArchiveStructureMutation, ArchiveStructureMutationVariables>(ArchiveStructureDocument, options);
      }
export type ArchiveStructureMutationHookResult = ReturnType<typeof useArchiveStructureMutation>;
export type ArchiveStructureMutationResult = Apollo.MutationResult<ArchiveStructureMutation>;
export type ArchiveStructureMutationOptions = Apollo.BaseMutationOptions<ArchiveStructureMutation, ArchiveStructureMutationVariables>;
export const UpdateStructureDocument = gql`
    mutation UpdateStructure($input: UpdateStructureInput!) {
  updateStructure(input: $input) {
    ...Structure
  }
}
    ${StructureFragmentDoc}`;
export type UpdateStructureMutationFn = Apollo.MutationFunction<UpdateStructureMutation, UpdateStructureMutationVariables>;

/**
 * __useUpdateStructureMutation__
 *
 * To run a mutation, you first call `useUpdateStructureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStructureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStructureMutation, { data, loading, error }] = useUpdateStructureMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateStructureMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateStructureMutation, UpdateStructureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateStructureMutation, UpdateStructureMutationVariables>(UpdateStructureDocument, options);
      }
export type UpdateStructureMutationHookResult = ReturnType<typeof useUpdateStructureMutation>;
export type UpdateStructureMutationResult = Apollo.MutationResult<UpdateStructureMutation>;
export type UpdateStructureMutationOptions = Apollo.BaseMutationOptions<UpdateStructureMutation, UpdateStructureMutationVariables>;
export const CreateStructureRelationDocument = gql`
    mutation CreateStructureRelation($input: CreateStructureRelationInput!) {
  createStructureRelation(input: $input) {
    ...StructureRelation
  }
}
    ${StructureRelationFragmentDoc}`;
export type CreateStructureRelationMutationFn = Apollo.MutationFunction<CreateStructureRelationMutation, CreateStructureRelationMutationVariables>;

/**
 * __useCreateStructureRelationMutation__
 *
 * To run a mutation, you first call `useCreateStructureRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStructureRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStructureRelationMutation, { data, loading, error }] = useCreateStructureRelationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateStructureRelationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateStructureRelationMutation, CreateStructureRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateStructureRelationMutation, CreateStructureRelationMutationVariables>(CreateStructureRelationDocument, options);
      }
export type CreateStructureRelationMutationHookResult = ReturnType<typeof useCreateStructureRelationMutation>;
export type CreateStructureRelationMutationResult = Apollo.MutationResult<CreateStructureRelationMutation>;
export type CreateStructureRelationMutationOptions = Apollo.BaseMutationOptions<CreateStructureRelationMutation, CreateStructureRelationMutationVariables>;
export const CreateGraphTagInlineDocument = gql`
    mutation CreateGraphTagInline($graph: String!, $input: String!) {
  result: createCategoryTag(input: {graph: $graph, value: $input}) {
    value: id
    label: name
  }
}
    `;
export type CreateGraphTagInlineMutationFn = Apollo.MutationFunction<CreateGraphTagInlineMutation, CreateGraphTagInlineMutationVariables>;

/**
 * __useCreateGraphTagInlineMutation__
 *
 * To run a mutation, you first call `useCreateGraphTagInlineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGraphTagInlineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGraphTagInlineMutation, { data, loading, error }] = useCreateGraphTagInlineMutation({
 *   variables: {
 *      graph: // value for 'graph'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGraphTagInlineMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateGraphTagInlineMutation, CreateGraphTagInlineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateGraphTagInlineMutation, CreateGraphTagInlineMutationVariables>(CreateGraphTagInlineDocument, options);
      }
export type CreateGraphTagInlineMutationHookResult = ReturnType<typeof useCreateGraphTagInlineMutation>;
export type CreateGraphTagInlineMutationResult = Apollo.MutationResult<CreateGraphTagInlineMutation>;
export type CreateGraphTagInlineMutationOptions = Apollo.BaseMutationOptions<CreateGraphTagInlineMutation, CreateGraphTagInlineMutationVariables>;
export const RequestMediaUploadDocument = gql`
    mutation RequestMediaUpload($input: RequestMediaUploadInput!) {
  requestMediaUpload(input: $input) {
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
 *      input: // value for 'input'
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
export const GetEntityDocument = gql`
    query GetEntity($id: GraphID!) {
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
export const SearchEntitiesDocument = gql`
    query SearchEntities($category: ID!, $search: String, $values: [GraphID!]) {
  options: entities(
    entityCategoryId: $category
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
 *      category: // value for 'category'
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchEntitiesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchEntitiesQuery, SearchEntitiesQueryVariables>) {
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
export const ListEntitiesDocument = gql`
    query ListEntities($entityCategoryId: ID!, $filters: EntityFilter, $pagination: EntityPaginationInput) {
  entities(
    entityCategoryId: $entityCategoryId
    filters: $filters
    pagination: $pagination
  ) {
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
 *      entityCategoryId: // value for 'entityCategoryId'
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListEntitiesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ListEntitiesQuery, ListEntitiesQueryVariables>) {
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
export const GlobalSearchDocument = gql`
    query GlobalSearch($search: String!) {
  entityCategories(filters: {search: $search}, pagination: {limit: 10}) {
    ...ListEntityCategory
  }
  relationCategories(filters: {search: $search}, pagination: {limit: 10}) {
    ...ListRelationCategory
  }
  measurementCategories(filters: {search: $search}, pagination: {limit: 10}) {
    ...ListMeasurementCategory
  }
  structureCategories(filters: {search: $search}, pagination: {limit: 10}) {
    ...ListStructureCategory
  }
}
    ${ListEntityCategoryFragmentDoc}
${ListRelationCategoryFragmentDoc}
${ListMeasurementCategoryFragmentDoc}
${ListStructureCategoryFragmentDoc}`;

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
export const ListGraphsDocument = gql`
    query ListGraphs($filters: GraphFilter, $pagination: OffsetPaginationInput, $ordering: [GraphOrder!]) {
  graphs(filters: $filters, pagination: $pagination, ordering: $ordering) {
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
 *      ordering: // value for 'ordering'
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
export const GetGraphTableQueryDocument = gql`
    query GetGraphTableQuery($id: ID!) {
  graphTableQuery(id: $id) {
    ...GraphQuery
  }
}
    ${GraphQueryFragmentDoc}`;

/**
 * __useGetGraphTableQueryQuery__
 *
 * To run a query within a React component, call `useGetGraphTableQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGraphTableQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGraphTableQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGraphTableQueryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetGraphTableQueryQuery, GetGraphTableQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetGraphTableQueryQuery, GetGraphTableQueryQueryVariables>(GetGraphTableQueryDocument, options);
      }
export function useGetGraphTableQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGraphTableQueryQuery, GetGraphTableQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetGraphTableQueryQuery, GetGraphTableQueryQueryVariables>(GetGraphTableQueryDocument, options);
        }
export type GetGraphTableQueryQueryHookResult = ReturnType<typeof useGetGraphTableQueryQuery>;
export type GetGraphTableQueryLazyQueryHookResult = ReturnType<typeof useGetGraphTableQueryLazyQuery>;
export type GetGraphTableQueryQueryResult = Apollo.QueryResult<GetGraphTableQueryQuery, GetGraphTableQueryQueryVariables>;
export const RenderGraphTableDocument = gql`
    query RenderGraphTable($id: ID!, $filters: RenderGraphTableFilter, $pagination: RenderGraphTablePagination, $order: RenderGraphTableOrder) {
  renderGraphTable(
    query: $id
    filters: $filters
    pagination: $pagination
    order: $order
  ) {
    ...GraphTableRender
  }
}
    ${GraphTableRenderFragmentDoc}`;

/**
 * __useRenderGraphTableQuery__
 *
 * To run a query within a React component, call `useRenderGraphTableQuery` and pass it any options that fit your needs.
 * When your component renders, `useRenderGraphTableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRenderGraphTableQuery({
 *   variables: {
 *      id: // value for 'id'
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useRenderGraphTableQuery(baseOptions: ApolloReactHooks.QueryHookOptions<RenderGraphTableQuery, RenderGraphTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<RenderGraphTableQuery, RenderGraphTableQueryVariables>(RenderGraphTableDocument, options);
      }
export function useRenderGraphTableLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RenderGraphTableQuery, RenderGraphTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<RenderGraphTableQuery, RenderGraphTableQueryVariables>(RenderGraphTableDocument, options);
        }
export type RenderGraphTableQueryHookResult = ReturnType<typeof useRenderGraphTableQuery>;
export type RenderGraphTableLazyQueryHookResult = ReturnType<typeof useRenderGraphTableLazyQuery>;
export type RenderGraphTableQueryResult = Apollo.QueryResult<RenderGraphTableQuery, RenderGraphTableQueryVariables>;
export const SearchGraphTableQueriesDocument = gql`
    query SearchGraphTableQueries($search: String, $values: [ID!]) {
  options: graphTableQueries(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchGraphTableQueriesQuery__
 *
 * To run a query within a React component, call `useSearchGraphTableQueriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchGraphTableQueriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchGraphTableQueriesQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchGraphTableQueriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchGraphTableQueriesQuery, SearchGraphTableQueriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchGraphTableQueriesQuery, SearchGraphTableQueriesQueryVariables>(SearchGraphTableQueriesDocument, options);
      }
export function useSearchGraphTableQueriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchGraphTableQueriesQuery, SearchGraphTableQueriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchGraphTableQueriesQuery, SearchGraphTableQueriesQueryVariables>(SearchGraphTableQueriesDocument, options);
        }
export type SearchGraphTableQueriesQueryHookResult = ReturnType<typeof useSearchGraphTableQueriesQuery>;
export type SearchGraphTableQueriesLazyQueryHookResult = ReturnType<typeof useSearchGraphTableQueriesLazyQuery>;
export type SearchGraphTableQueriesQueryResult = Apollo.QueryResult<SearchGraphTableQueriesQuery, SearchGraphTableQueriesQueryVariables>;
export const ListGraphTableQueriesDocument = gql`
    query ListGraphTableQueries($filters: GraphTableQueryFilter, $pagination: OffsetPaginationInput) {
  graphTableQueries(filters: $filters, pagination: $pagination) {
    ...ListGraphTableQuery
  }
}
    ${ListGraphTableQueryFragmentDoc}`;

/**
 * __useListGraphTableQueriesQuery__
 *
 * To run a query within a React component, call `useListGraphTableQueriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListGraphTableQueriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListGraphTableQueriesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListGraphTableQueriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListGraphTableQueriesQuery, ListGraphTableQueriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListGraphTableQueriesQuery, ListGraphTableQueriesQueryVariables>(ListGraphTableQueriesDocument, options);
      }
export function useListGraphTableQueriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListGraphTableQueriesQuery, ListGraphTableQueriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListGraphTableQueriesQuery, ListGraphTableQueriesQueryVariables>(ListGraphTableQueriesDocument, options);
        }
export type ListGraphTableQueriesQueryHookResult = ReturnType<typeof useListGraphTableQueriesQuery>;
export type ListGraphTableQueriesLazyQueryHookResult = ReturnType<typeof useListGraphTableQueriesLazyQuery>;
export type ListGraphTableQueriesQueryResult = Apollo.QueryResult<ListGraphTableQueriesQuery, ListGraphTableQueriesQueryVariables>;
export const GetScatterPlotDocument = gql`
    query GetScatterPlot($id: ID!) {
  scatterPlot(id: $id) {
    ...ScatterPlot
  }
}
    ${ScatterPlotFragmentDoc}`;

/**
 * __useGetScatterPlotQuery__
 *
 * To run a query within a React component, call `useGetScatterPlotQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScatterPlotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScatterPlotQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetScatterPlotQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetScatterPlotQuery, GetScatterPlotQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetScatterPlotQuery, GetScatterPlotQueryVariables>(GetScatterPlotDocument, options);
      }
export function useGetScatterPlotLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetScatterPlotQuery, GetScatterPlotQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetScatterPlotQuery, GetScatterPlotQueryVariables>(GetScatterPlotDocument, options);
        }
export type GetScatterPlotQueryHookResult = ReturnType<typeof useGetScatterPlotQuery>;
export type GetScatterPlotLazyQueryHookResult = ReturnType<typeof useGetScatterPlotLazyQuery>;
export type GetScatterPlotQueryResult = Apollo.QueryResult<GetScatterPlotQuery, GetScatterPlotQueryVariables>;
export const SearchScatterPlotsDocument = gql`
    query SearchScatterPlots($search: String, $values: [ID!]) {
  options: scatterPlots(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchScatterPlotsQuery__
 *
 * To run a query within a React component, call `useSearchScatterPlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchScatterPlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchScatterPlotsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchScatterPlotsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchScatterPlotsQuery, SearchScatterPlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchScatterPlotsQuery, SearchScatterPlotsQueryVariables>(SearchScatterPlotsDocument, options);
      }
export function useSearchScatterPlotsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchScatterPlotsQuery, SearchScatterPlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchScatterPlotsQuery, SearchScatterPlotsQueryVariables>(SearchScatterPlotsDocument, options);
        }
export type SearchScatterPlotsQueryHookResult = ReturnType<typeof useSearchScatterPlotsQuery>;
export type SearchScatterPlotsLazyQueryHookResult = ReturnType<typeof useSearchScatterPlotsLazyQuery>;
export type SearchScatterPlotsQueryResult = Apollo.QueryResult<SearchScatterPlotsQuery, SearchScatterPlotsQueryVariables>;
export const ListScatterPlotsDocument = gql`
    query ListScatterPlots($filters: ScatterPlotFilter, $pagination: OffsetPaginationInput) {
  scatterPlots(filters: $filters, pagination: $pagination) {
    ...ListScatterPlot
  }
}
    ${ListScatterPlotFragmentDoc}`;

/**
 * __useListScatterPlotsQuery__
 *
 * To run a query within a React component, call `useListScatterPlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListScatterPlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListScatterPlotsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListScatterPlotsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListScatterPlotsQuery, ListScatterPlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListScatterPlotsQuery, ListScatterPlotsQueryVariables>(ListScatterPlotsDocument, options);
      }
export function useListScatterPlotsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListScatterPlotsQuery, ListScatterPlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListScatterPlotsQuery, ListScatterPlotsQueryVariables>(ListScatterPlotsDocument, options);
        }
export type ListScatterPlotsQueryHookResult = ReturnType<typeof useListScatterPlotsQuery>;
export type ListScatterPlotsLazyQueryHookResult = ReturnType<typeof useListScatterPlotsLazyQuery>;
export type ListScatterPlotsQueryResult = Apollo.QueryResult<ListScatterPlotsQuery, ListScatterPlotsQueryVariables>;
export const ListMaterializedEdgesDocument = gql`
    query ListMaterializedEdges($filters: MaterializedEdgeFilter, $pagination: OffsetPaginationInput, $ordering: [MaterializedEdgeOrder!]) {
  materializedEdges(
    filters: $filters
    pagination: $pagination
    ordering: $ordering
  ) {
    ...ListMaterializedEdge
  }
}
    ${ListMaterializedEdgeFragmentDoc}`;

/**
 * __useListMaterializedEdgesQuery__
 *
 * To run a query within a React component, call `useListMaterializedEdgesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListMaterializedEdgesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListMaterializedEdgesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *      ordering: // value for 'ordering'
 *   },
 * });
 */
export function useListMaterializedEdgesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListMaterializedEdgesQuery, ListMaterializedEdgesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListMaterializedEdgesQuery, ListMaterializedEdgesQueryVariables>(ListMaterializedEdgesDocument, options);
      }
export function useListMaterializedEdgesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListMaterializedEdgesQuery, ListMaterializedEdgesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListMaterializedEdgesQuery, ListMaterializedEdgesQueryVariables>(ListMaterializedEdgesDocument, options);
        }
export type ListMaterializedEdgesQueryHookResult = ReturnType<typeof useListMaterializedEdgesQuery>;
export type ListMaterializedEdgesLazyQueryHookResult = ReturnType<typeof useListMaterializedEdgesLazyQuery>;
export type ListMaterializedEdgesQueryResult = Apollo.QueryResult<ListMaterializedEdgesQuery, ListMaterializedEdgesQueryVariables>;
export const GetMaterializedEdgeDocument = gql`
    query GetMaterializedEdge($id: ID!) {
  materializedEdge(id: $id) {
    ...MaterializedEdge
  }
}
    ${MaterializedEdgeFragmentDoc}`;

/**
 * __useGetMaterializedEdgeQuery__
 *
 * To run a query within a React component, call `useGetMaterializedEdgeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMaterializedEdgeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMaterializedEdgeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMaterializedEdgeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetMaterializedEdgeQuery, GetMaterializedEdgeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMaterializedEdgeQuery, GetMaterializedEdgeQueryVariables>(GetMaterializedEdgeDocument, options);
      }
export function useGetMaterializedEdgeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMaterializedEdgeQuery, GetMaterializedEdgeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMaterializedEdgeQuery, GetMaterializedEdgeQueryVariables>(GetMaterializedEdgeDocument, options);
        }
export type GetMaterializedEdgeQueryHookResult = ReturnType<typeof useGetMaterializedEdgeQuery>;
export type GetMaterializedEdgeLazyQueryHookResult = ReturnType<typeof useGetMaterializedEdgeLazyQuery>;
export type GetMaterializedEdgeQueryResult = Apollo.QueryResult<GetMaterializedEdgeQuery, GetMaterializedEdgeQueryVariables>;
export const GetMeasurementDocument = gql`
    query GetMeasurement($id: GraphID!) {
  measurement(id: $id) {
    ...Measurement
  }
}
    ${MeasurementFragmentDoc}`;

/**
 * __useGetMeasurementQuery__
 *
 * To run a query within a React component, call `useGetMeasurementQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeasurementQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeasurementQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMeasurementQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetMeasurementQuery, GetMeasurementQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMeasurementQuery, GetMeasurementQueryVariables>(GetMeasurementDocument, options);
      }
export function useGetMeasurementLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMeasurementQuery, GetMeasurementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMeasurementQuery, GetMeasurementQueryVariables>(GetMeasurementDocument, options);
        }
export type GetMeasurementQueryHookResult = ReturnType<typeof useGetMeasurementQuery>;
export type GetMeasurementLazyQueryHookResult = ReturnType<typeof useGetMeasurementLazyQuery>;
export type GetMeasurementQueryResult = Apollo.QueryResult<GetMeasurementQuery, GetMeasurementQueryVariables>;
export const SearchMeasurementsDocument = gql`
    query SearchMeasurements($category: ID!, $search: String, $values: [GraphID!]) {
  options: measurements(
    measurementCategoryId: $category
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchMeasurementsQuery__
 *
 * To run a query within a React component, call `useSearchMeasurementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMeasurementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMeasurementsQuery({
 *   variables: {
 *      category: // value for 'category'
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchMeasurementsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchMeasurementsQuery, SearchMeasurementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchMeasurementsQuery, SearchMeasurementsQueryVariables>(SearchMeasurementsDocument, options);
      }
export function useSearchMeasurementsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchMeasurementsQuery, SearchMeasurementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchMeasurementsQuery, SearchMeasurementsQueryVariables>(SearchMeasurementsDocument, options);
        }
export type SearchMeasurementsQueryHookResult = ReturnType<typeof useSearchMeasurementsQuery>;
export type SearchMeasurementsLazyQueryHookResult = ReturnType<typeof useSearchMeasurementsLazyQuery>;
export type SearchMeasurementsQueryResult = Apollo.QueryResult<SearchMeasurementsQuery, SearchMeasurementsQueryVariables>;
export const GetMetricDocument = gql`
    query GetMetric($id: GraphID!) {
  metric(metricId: $id) {
    ...Metric
  }
}
    ${MetricFragmentDoc}`;

/**
 * __useGetMetricQuery__
 *
 * To run a query within a React component, call `useGetMetricQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMetricQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMetricQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMetricQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetMetricQuery, GetMetricQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMetricQuery, GetMetricQueryVariables>(GetMetricDocument, options);
      }
export function useGetMetricLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMetricQuery, GetMetricQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMetricQuery, GetMetricQueryVariables>(GetMetricDocument, options);
        }
export type GetMetricQueryHookResult = ReturnType<typeof useGetMetricQuery>;
export type GetMetricLazyQueryHookResult = ReturnType<typeof useGetMetricLazyQuery>;
export type GetMetricQueryResult = Apollo.QueryResult<GetMetricQuery, GetMetricQueryVariables>;
export const SearchMetricsDocument = gql`
    query SearchMetrics($category: ID!, $search: String, $values: [GraphID!]) {
  options: metrics(
    metricCategoryId: $category
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchMetricsQuery__
 *
 * To run a query within a React component, call `useSearchMetricsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMetricsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMetricsQuery({
 *   variables: {
 *      category: // value for 'category'
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchMetricsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchMetricsQuery, SearchMetricsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchMetricsQuery, SearchMetricsQueryVariables>(SearchMetricsDocument, options);
      }
export function useSearchMetricsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchMetricsQuery, SearchMetricsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchMetricsQuery, SearchMetricsQueryVariables>(SearchMetricsDocument, options);
        }
export type SearchMetricsQueryHookResult = ReturnType<typeof useSearchMetricsQuery>;
export type SearchMetricsLazyQueryHookResult = ReturnType<typeof useSearchMetricsLazyQuery>;
export type SearchMetricsQueryResult = Apollo.QueryResult<SearchMetricsQuery, SearchMetricsQueryVariables>;
export const ListMetricsDocument = gql`
    query ListMetrics($category: ID!, $filters: MetricFilter, $pagination: MetricPaginationInput, $ordering: [MetricOrder!]) {
  metrics(
    metricCategoryId: $category
    filters: $filters
    pagination: $pagination
    ordering: $ordering
  ) {
    ...ListMetric
  }
}
    ${ListMetricFragmentDoc}`;

/**
 * __useListMetricsQuery__
 *
 * To run a query within a React component, call `useListMetricsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListMetricsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListMetricsQuery({
 *   variables: {
 *      category: // value for 'category'
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *      ordering: // value for 'ordering'
 *   },
 * });
 */
export function useListMetricsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ListMetricsQuery, ListMetricsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListMetricsQuery, ListMetricsQueryVariables>(ListMetricsDocument, options);
      }
export function useListMetricsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListMetricsQuery, ListMetricsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListMetricsQuery, ListMetricsQueryVariables>(ListMetricsDocument, options);
        }
export type ListMetricsQueryHookResult = ReturnType<typeof useListMetricsQuery>;
export type ListMetricsLazyQueryHookResult = ReturnType<typeof useListMetricsLazyQuery>;
export type ListMetricsQueryResult = Apollo.QueryResult<ListMetricsQuery, ListMetricsQueryVariables>;
export const GetNaturalEventDocument = gql`
    query GetNaturalEvent($id: GraphID!) {
  naturalEvent(id: $id) {
    ...NaturalEvent
  }
}
    ${NaturalEventFragmentDoc}`;

/**
 * __useGetNaturalEventQuery__
 *
 * To run a query within a React component, call `useGetNaturalEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNaturalEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNaturalEventQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetNaturalEventQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetNaturalEventQuery, GetNaturalEventQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetNaturalEventQuery, GetNaturalEventQueryVariables>(GetNaturalEventDocument, options);
      }
export function useGetNaturalEventLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNaturalEventQuery, GetNaturalEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetNaturalEventQuery, GetNaturalEventQueryVariables>(GetNaturalEventDocument, options);
        }
export type GetNaturalEventQueryHookResult = ReturnType<typeof useGetNaturalEventQuery>;
export type GetNaturalEventLazyQueryHookResult = ReturnType<typeof useGetNaturalEventLazyQuery>;
export type GetNaturalEventQueryResult = Apollo.QueryResult<GetNaturalEventQuery, GetNaturalEventQueryVariables>;
export const SearchNaturalEventsDocument = gql`
    query SearchNaturalEvents($category: ID!, $search: String, $values: [GraphID!]) {
  options: naturalEvents(
    naturalEventCategoryId: $category
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchNaturalEventsQuery__
 *
 * To run a query within a React component, call `useSearchNaturalEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchNaturalEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchNaturalEventsQuery({
 *   variables: {
 *      category: // value for 'category'
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchNaturalEventsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchNaturalEventsQuery, SearchNaturalEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchNaturalEventsQuery, SearchNaturalEventsQueryVariables>(SearchNaturalEventsDocument, options);
      }
export function useSearchNaturalEventsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchNaturalEventsQuery, SearchNaturalEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchNaturalEventsQuery, SearchNaturalEventsQueryVariables>(SearchNaturalEventsDocument, options);
        }
export type SearchNaturalEventsQueryHookResult = ReturnType<typeof useSearchNaturalEventsQuery>;
export type SearchNaturalEventsLazyQueryHookResult = ReturnType<typeof useSearchNaturalEventsLazyQuery>;
export type SearchNaturalEventsQueryResult = Apollo.QueryResult<SearchNaturalEventsQuery, SearchNaturalEventsQueryVariables>;
export const GetProtocolEventDocument = gql`
    query GetProtocolEvent($id: GraphID!) {
  protocolEvent(id: $id) {
    ...ProtocolEvent
  }
}
    ${ProtocolEventFragmentDoc}`;

/**
 * __useGetProtocolEventQuery__
 *
 * To run a query within a React component, call `useGetProtocolEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProtocolEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProtocolEventQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProtocolEventQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetProtocolEventQuery, GetProtocolEventQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetProtocolEventQuery, GetProtocolEventQueryVariables>(GetProtocolEventDocument, options);
      }
export function useGetProtocolEventLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProtocolEventQuery, GetProtocolEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetProtocolEventQuery, GetProtocolEventQueryVariables>(GetProtocolEventDocument, options);
        }
export type GetProtocolEventQueryHookResult = ReturnType<typeof useGetProtocolEventQuery>;
export type GetProtocolEventLazyQueryHookResult = ReturnType<typeof useGetProtocolEventLazyQuery>;
export type GetProtocolEventQueryResult = Apollo.QueryResult<GetProtocolEventQuery, GetProtocolEventQueryVariables>;
export const SearchProtocolEventsDocument = gql`
    query SearchProtocolEvents($category: ID!, $search: String, $values: [GraphID!]) {
  options: protocolEvents(
    protocolEventCategoryId: $category
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchProtocolEventsQuery__
 *
 * To run a query within a React component, call `useSearchProtocolEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProtocolEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProtocolEventsQuery({
 *   variables: {
 *      category: // value for 'category'
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchProtocolEventsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchProtocolEventsQuery, SearchProtocolEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchProtocolEventsQuery, SearchProtocolEventsQueryVariables>(SearchProtocolEventsDocument, options);
      }
export function useSearchProtocolEventsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchProtocolEventsQuery, SearchProtocolEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchProtocolEventsQuery, SearchProtocolEventsQueryVariables>(SearchProtocolEventsDocument, options);
        }
export type SearchProtocolEventsQueryHookResult = ReturnType<typeof useSearchProtocolEventsQuery>;
export type SearchProtocolEventsLazyQueryHookResult = ReturnType<typeof useSearchProtocolEventsLazyQuery>;
export type SearchProtocolEventsQueryResult = Apollo.QueryResult<SearchProtocolEventsQuery, SearchProtocolEventsQueryVariables>;
export const GetRelationDocument = gql`
    query GetRelation($id: GraphID!) {
  relation(id: $id) {
    ...Relation
  }
}
    ${RelationFragmentDoc}`;

/**
 * __useGetRelationQuery__
 *
 * To run a query within a React component, call `useGetRelationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRelationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRelationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRelationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRelationQuery, GetRelationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRelationQuery, GetRelationQueryVariables>(GetRelationDocument, options);
      }
export function useGetRelationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRelationQuery, GetRelationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRelationQuery, GetRelationQueryVariables>(GetRelationDocument, options);
        }
export type GetRelationQueryHookResult = ReturnType<typeof useGetRelationQuery>;
export type GetRelationLazyQueryHookResult = ReturnType<typeof useGetRelationLazyQuery>;
export type GetRelationQueryResult = Apollo.QueryResult<GetRelationQuery, GetRelationQueryVariables>;
export const SearchRelationsDocument = gql`
    query SearchRelations($category: ID!, $search: String, $values: [GraphID!]) {
  options: relations(
    relationCategoryId: $category
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchRelationsQuery__
 *
 * To run a query within a React component, call `useSearchRelationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchRelationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchRelationsQuery({
 *   variables: {
 *      category: // value for 'category'
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchRelationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchRelationsQuery, SearchRelationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchRelationsQuery, SearchRelationsQueryVariables>(SearchRelationsDocument, options);
      }
export function useSearchRelationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchRelationsQuery, SearchRelationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchRelationsQuery, SearchRelationsQueryVariables>(SearchRelationsDocument, options);
        }
export type SearchRelationsQueryHookResult = ReturnType<typeof useSearchRelationsQuery>;
export type SearchRelationsLazyQueryHookResult = ReturnType<typeof useSearchRelationsLazyQuery>;
export type SearchRelationsQueryResult = Apollo.QueryResult<SearchRelationsQuery, SearchRelationsQueryVariables>;
export const GetEntityCategoryDocument = gql`
    query GetEntityCategory($id: ID!) {
  entityCategory(id: $id) {
    ...EntityCategory
  }
}
    ${EntityCategoryFragmentDoc}`;

/**
 * __useGetEntityCategoryQuery__
 *
 * To run a query within a React component, call `useGetEntityCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEntityCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEntityCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEntityCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetEntityCategoryQuery, GetEntityCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetEntityCategoryQuery, GetEntityCategoryQueryVariables>(GetEntityCategoryDocument, options);
      }
export function useGetEntityCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetEntityCategoryQuery, GetEntityCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetEntityCategoryQuery, GetEntityCategoryQueryVariables>(GetEntityCategoryDocument, options);
        }
export type GetEntityCategoryQueryHookResult = ReturnType<typeof useGetEntityCategoryQuery>;
export type GetEntityCategoryLazyQueryHookResult = ReturnType<typeof useGetEntityCategoryLazyQuery>;
export type GetEntityCategoryQueryResult = Apollo.QueryResult<GetEntityCategoryQuery, GetEntityCategoryQueryVariables>;
export const SearchEntityCategoryDocument = gql`
    query SearchEntityCategory($search: String, $values: [ID!], $graph: ID) {
  options: entityCategories(
    filters: {search: $search, ids: $values, graph: {id: $graph}}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchEntityCategoryQuery__
 *
 * To run a query within a React component, call `useSearchEntityCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEntityCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEntityCategoryQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *      graph: // value for 'graph'
 *   },
 * });
 */
export function useSearchEntityCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchEntityCategoryQuery, SearchEntityCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchEntityCategoryQuery, SearchEntityCategoryQueryVariables>(SearchEntityCategoryDocument, options);
      }
export function useSearchEntityCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchEntityCategoryQuery, SearchEntityCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchEntityCategoryQuery, SearchEntityCategoryQueryVariables>(SearchEntityCategoryDocument, options);
        }
export type SearchEntityCategoryQueryHookResult = ReturnType<typeof useSearchEntityCategoryQuery>;
export type SearchEntityCategoryLazyQueryHookResult = ReturnType<typeof useSearchEntityCategoryLazyQuery>;
export type SearchEntityCategoryQueryResult = Apollo.QueryResult<SearchEntityCategoryQuery, SearchEntityCategoryQueryVariables>;
export const ListEntityCategoryDocument = gql`
    query ListEntityCategory($filters: EntityCategoryFilter, $pagination: OffsetPaginationInput) {
  entityCategories(filters: $filters, pagination: $pagination) {
    ...ListEntityCategory
  }
}
    ${ListEntityCategoryFragmentDoc}`;

/**
 * __useListEntityCategoryQuery__
 *
 * To run a query within a React component, call `useListEntityCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useListEntityCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListEntityCategoryQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListEntityCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListEntityCategoryQuery, ListEntityCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListEntityCategoryQuery, ListEntityCategoryQueryVariables>(ListEntityCategoryDocument, options);
      }
export function useListEntityCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListEntityCategoryQuery, ListEntityCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListEntityCategoryQuery, ListEntityCategoryQueryVariables>(ListEntityCategoryDocument, options);
        }
export type ListEntityCategoryQueryHookResult = ReturnType<typeof useListEntityCategoryQuery>;
export type ListEntityCategoryLazyQueryHookResult = ReturnType<typeof useListEntityCategoryLazyQuery>;
export type ListEntityCategoryQueryResult = Apollo.QueryResult<ListEntityCategoryQuery, ListEntityCategoryQueryVariables>;
export const EntityNodesDocument = gql`
    query EntityNodes($category: ID!, $filters: EntityFilter, $pagination: EntityPaginationInput, $ordering: [EntityOrder!]) {
  entities(
    entityCategoryId: $category
    filters: $filters
    pagination: $pagination
    ordering: $ordering
  ) {
    __typename
    id
    label
    properties
  }
}
    `;

/**
 * __useEntityNodesQuery__
 *
 * To run a query within a React component, call `useEntityNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntityNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntityNodesQuery({
 *   variables: {
 *      category: // value for 'category'
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *      ordering: // value for 'ordering'
 *   },
 * });
 */
export function useEntityNodesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<EntityNodesQuery, EntityNodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<EntityNodesQuery, EntityNodesQueryVariables>(EntityNodesDocument, options);
      }
export function useEntityNodesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EntityNodesQuery, EntityNodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<EntityNodesQuery, EntityNodesQueryVariables>(EntityNodesDocument, options);
        }
export type EntityNodesQueryHookResult = ReturnType<typeof useEntityNodesQuery>;
export type EntityNodesLazyQueryHookResult = ReturnType<typeof useEntityNodesLazyQuery>;
export type EntityNodesQueryResult = Apollo.QueryResult<EntityNodesQuery, EntityNodesQueryVariables>;
export const EntityCategoryStatsDocument = gql`
    query EntityCategoryStats($id: ID!) {
  entityCategoryStats(filters: {id: $id}) {
    count
  }
}
    `;

/**
 * __useEntityCategoryStatsQuery__
 *
 * To run a query within a React component, call `useEntityCategoryStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntityCategoryStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntityCategoryStatsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEntityCategoryStatsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<EntityCategoryStatsQuery, EntityCategoryStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<EntityCategoryStatsQuery, EntityCategoryStatsQueryVariables>(EntityCategoryStatsDocument, options);
      }
export function useEntityCategoryStatsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EntityCategoryStatsQuery, EntityCategoryStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<EntityCategoryStatsQuery, EntityCategoryStatsQueryVariables>(EntityCategoryStatsDocument, options);
        }
export type EntityCategoryStatsQueryHookResult = ReturnType<typeof useEntityCategoryStatsQuery>;
export type EntityCategoryStatsLazyQueryHookResult = ReturnType<typeof useEntityCategoryStatsLazyQuery>;
export type EntityCategoryStatsQueryResult = Apollo.QueryResult<EntityCategoryStatsQuery, EntityCategoryStatsQueryVariables>;
export const HomePageDocument = gql`
    query HomePage {
  graphs: graphs {
    ...ListGraph
  }
}
    ${ListGraphFragmentDoc}`;

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
  graphStats {
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
export const ListMeasurmentCategoryDocument = gql`
    query ListMeasurmentCategory($filters: MeasurementCategoryFilter, $pagination: OffsetPaginationInput) {
  measurementCategories(filters: $filters, pagination: $pagination) {
    ...ListMeasurementCategoryWithGraph
  }
}
    ${ListMeasurementCategoryWithGraphFragmentDoc}`;

/**
 * __useListMeasurmentCategoryQuery__
 *
 * To run a query within a React component, call `useListMeasurmentCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useListMeasurmentCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListMeasurmentCategoryQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListMeasurmentCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListMeasurmentCategoryQuery, ListMeasurmentCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListMeasurmentCategoryQuery, ListMeasurmentCategoryQueryVariables>(ListMeasurmentCategoryDocument, options);
      }
export function useListMeasurmentCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListMeasurmentCategoryQuery, ListMeasurmentCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListMeasurmentCategoryQuery, ListMeasurmentCategoryQueryVariables>(ListMeasurmentCategoryDocument, options);
        }
export type ListMeasurmentCategoryQueryHookResult = ReturnType<typeof useListMeasurmentCategoryQuery>;
export type ListMeasurmentCategoryLazyQueryHookResult = ReturnType<typeof useListMeasurmentCategoryLazyQuery>;
export type ListMeasurmentCategoryQueryResult = Apollo.QueryResult<ListMeasurmentCategoryQuery, ListMeasurmentCategoryQueryVariables>;
export const GetMetricCategoryDocument = gql`
    query GetMetricCategory($id: ID!) {
  metricCategory(id: $id) {
    ...MetricCategory
  }
}
    ${MetricCategoryFragmentDoc}`;

/**
 * __useGetMetricCategoryQuery__
 *
 * To run a query within a React component, call `useGetMetricCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMetricCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMetricCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMetricCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetMetricCategoryQuery, GetMetricCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMetricCategoryQuery, GetMetricCategoryQueryVariables>(GetMetricCategoryDocument, options);
      }
export function useGetMetricCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMetricCategoryQuery, GetMetricCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMetricCategoryQuery, GetMetricCategoryQueryVariables>(GetMetricCategoryDocument, options);
        }
export type GetMetricCategoryQueryHookResult = ReturnType<typeof useGetMetricCategoryQuery>;
export type GetMetricCategoryLazyQueryHookResult = ReturnType<typeof useGetMetricCategoryLazyQuery>;
export type GetMetricCategoryQueryResult = Apollo.QueryResult<GetMetricCategoryQuery, GetMetricCategoryQueryVariables>;
export const ListMetricCategoryDocument = gql`
    query ListMetricCategory($filters: MetricCategoryFilter, $pagination: OffsetPaginationInput) {
  metricCategories(filters: $filters, pagination: $pagination) {
    ...ListMetricCategory
  }
}
    ${ListMetricCategoryFragmentDoc}`;

/**
 * __useListMetricCategoryQuery__
 *
 * To run a query within a React component, call `useListMetricCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useListMetricCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListMetricCategoryQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListMetricCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListMetricCategoryQuery, ListMetricCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListMetricCategoryQuery, ListMetricCategoryQueryVariables>(ListMetricCategoryDocument, options);
      }
export function useListMetricCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListMetricCategoryQuery, ListMetricCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListMetricCategoryQuery, ListMetricCategoryQueryVariables>(ListMetricCategoryDocument, options);
        }
export type ListMetricCategoryQueryHookResult = ReturnType<typeof useListMetricCategoryQuery>;
export type ListMetricCategoryLazyQueryHookResult = ReturnType<typeof useListMetricCategoryLazyQuery>;
export type ListMetricCategoryQueryResult = Apollo.QueryResult<ListMetricCategoryQuery, ListMetricCategoryQueryVariables>;
export const SearchMetricCategoryDocument = gql`
    query SearchMetricCategory($search: String, $values: [ID!]) {
  options: metricCategories(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchMetricCategoryQuery__
 *
 * To run a query within a React component, call `useSearchMetricCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMetricCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMetricCategoryQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchMetricCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchMetricCategoryQuery, SearchMetricCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchMetricCategoryQuery, SearchMetricCategoryQueryVariables>(SearchMetricCategoryDocument, options);
      }
export function useSearchMetricCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchMetricCategoryQuery, SearchMetricCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchMetricCategoryQuery, SearchMetricCategoryQueryVariables>(SearchMetricCategoryDocument, options);
        }
export type SearchMetricCategoryQueryHookResult = ReturnType<typeof useSearchMetricCategoryQuery>;
export type SearchMetricCategoryLazyQueryHookResult = ReturnType<typeof useSearchMetricCategoryLazyQuery>;
export type SearchMetricCategoryQueryResult = Apollo.QueryResult<SearchMetricCategoryQuery, SearchMetricCategoryQueryVariables>;
export const GetNaturalEventCategoryDocument = gql`
    query GetNaturalEventCategory($id: ID!) {
  naturalEventCategory(id: $id) {
    ...NaturalEventCategory
  }
}
    ${NaturalEventCategoryFragmentDoc}`;

/**
 * __useGetNaturalEventCategoryQuery__
 *
 * To run a query within a React component, call `useGetNaturalEventCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNaturalEventCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNaturalEventCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetNaturalEventCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetNaturalEventCategoryQuery, GetNaturalEventCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetNaturalEventCategoryQuery, GetNaturalEventCategoryQueryVariables>(GetNaturalEventCategoryDocument, options);
      }
export function useGetNaturalEventCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNaturalEventCategoryQuery, GetNaturalEventCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetNaturalEventCategoryQuery, GetNaturalEventCategoryQueryVariables>(GetNaturalEventCategoryDocument, options);
        }
export type GetNaturalEventCategoryQueryHookResult = ReturnType<typeof useGetNaturalEventCategoryQuery>;
export type GetNaturalEventCategoryLazyQueryHookResult = ReturnType<typeof useGetNaturalEventCategoryLazyQuery>;
export type GetNaturalEventCategoryQueryResult = Apollo.QueryResult<GetNaturalEventCategoryQuery, GetNaturalEventCategoryQueryVariables>;
export const SearchNaturalEventCategoriesDocument = gql`
    query SearchNaturalEventCategories($search: String, $values: [ID!]) {
  options: naturalEventCategories(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchNaturalEventCategoriesQuery__
 *
 * To run a query within a React component, call `useSearchNaturalEventCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchNaturalEventCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchNaturalEventCategoriesQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchNaturalEventCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchNaturalEventCategoriesQuery, SearchNaturalEventCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchNaturalEventCategoriesQuery, SearchNaturalEventCategoriesQueryVariables>(SearchNaturalEventCategoriesDocument, options);
      }
export function useSearchNaturalEventCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchNaturalEventCategoriesQuery, SearchNaturalEventCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchNaturalEventCategoriesQuery, SearchNaturalEventCategoriesQueryVariables>(SearchNaturalEventCategoriesDocument, options);
        }
export type SearchNaturalEventCategoriesQueryHookResult = ReturnType<typeof useSearchNaturalEventCategoriesQuery>;
export type SearchNaturalEventCategoriesLazyQueryHookResult = ReturnType<typeof useSearchNaturalEventCategoriesLazyQuery>;
export type SearchNaturalEventCategoriesQueryResult = Apollo.QueryResult<SearchNaturalEventCategoriesQuery, SearchNaturalEventCategoriesQueryVariables>;
export const ListNaturalEventCategoriesDocument = gql`
    query ListNaturalEventCategories($filters: NaturalEventCategoryFilter, $pagination: OffsetPaginationInput) {
  naturalEventCategories(filters: $filters, pagination: $pagination) {
    ...NaturalEventCategory
  }
}
    ${NaturalEventCategoryFragmentDoc}`;

/**
 * __useListNaturalEventCategoriesQuery__
 *
 * To run a query within a React component, call `useListNaturalEventCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListNaturalEventCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListNaturalEventCategoriesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListNaturalEventCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListNaturalEventCategoriesQuery, ListNaturalEventCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListNaturalEventCategoriesQuery, ListNaturalEventCategoriesQueryVariables>(ListNaturalEventCategoriesDocument, options);
      }
export function useListNaturalEventCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListNaturalEventCategoriesQuery, ListNaturalEventCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListNaturalEventCategoriesQuery, ListNaturalEventCategoriesQueryVariables>(ListNaturalEventCategoriesDocument, options);
        }
export type ListNaturalEventCategoriesQueryHookResult = ReturnType<typeof useListNaturalEventCategoriesQuery>;
export type ListNaturalEventCategoriesLazyQueryHookResult = ReturnType<typeof useListNaturalEventCategoriesLazyQuery>;
export type ListNaturalEventCategoriesQueryResult = Apollo.QueryResult<ListNaturalEventCategoriesQuery, ListNaturalEventCategoriesQueryVariables>;
export const GetProtocolEventCategoryDocument = gql`
    query GetProtocolEventCategory($id: ID!) {
  protocolEventCategory(id: $id) {
    ...ProtocolEventCategory
  }
}
    ${ProtocolEventCategoryFragmentDoc}`;

/**
 * __useGetProtocolEventCategoryQuery__
 *
 * To run a query within a React component, call `useGetProtocolEventCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProtocolEventCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProtocolEventCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProtocolEventCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetProtocolEventCategoryQuery, GetProtocolEventCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetProtocolEventCategoryQuery, GetProtocolEventCategoryQueryVariables>(GetProtocolEventCategoryDocument, options);
      }
export function useGetProtocolEventCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProtocolEventCategoryQuery, GetProtocolEventCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetProtocolEventCategoryQuery, GetProtocolEventCategoryQueryVariables>(GetProtocolEventCategoryDocument, options);
        }
export type GetProtocolEventCategoryQueryHookResult = ReturnType<typeof useGetProtocolEventCategoryQuery>;
export type GetProtocolEventCategoryLazyQueryHookResult = ReturnType<typeof useGetProtocolEventCategoryLazyQuery>;
export type GetProtocolEventCategoryQueryResult = Apollo.QueryResult<GetProtocolEventCategoryQuery, GetProtocolEventCategoryQueryVariables>;
export const SearchProtocolEventCategoriesDocument = gql`
    query SearchProtocolEventCategories($search: String, $values: [ID!]) {
  options: protocolEventCategories(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchProtocolEventCategoriesQuery__
 *
 * To run a query within a React component, call `useSearchProtocolEventCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProtocolEventCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProtocolEventCategoriesQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchProtocolEventCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchProtocolEventCategoriesQuery, SearchProtocolEventCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchProtocolEventCategoriesQuery, SearchProtocolEventCategoriesQueryVariables>(SearchProtocolEventCategoriesDocument, options);
      }
export function useSearchProtocolEventCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchProtocolEventCategoriesQuery, SearchProtocolEventCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchProtocolEventCategoriesQuery, SearchProtocolEventCategoriesQueryVariables>(SearchProtocolEventCategoriesDocument, options);
        }
export type SearchProtocolEventCategoriesQueryHookResult = ReturnType<typeof useSearchProtocolEventCategoriesQuery>;
export type SearchProtocolEventCategoriesLazyQueryHookResult = ReturnType<typeof useSearchProtocolEventCategoriesLazyQuery>;
export type SearchProtocolEventCategoriesQueryResult = Apollo.QueryResult<SearchProtocolEventCategoriesQuery, SearchProtocolEventCategoriesQueryVariables>;
export const ListProtocolEventCategoriesDocument = gql`
    query ListProtocolEventCategories($filters: ProtocolEventCategoryFilter, $pagination: OffsetPaginationInput) {
  protocolEventCategories(filters: $filters, pagination: $pagination) {
    ...ProtocolEventCategory
  }
}
    ${ProtocolEventCategoryFragmentDoc}`;

/**
 * __useListProtocolEventCategoriesQuery__
 *
 * To run a query within a React component, call `useListProtocolEventCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListProtocolEventCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListProtocolEventCategoriesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListProtocolEventCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListProtocolEventCategoriesQuery, ListProtocolEventCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListProtocolEventCategoriesQuery, ListProtocolEventCategoriesQueryVariables>(ListProtocolEventCategoriesDocument, options);
      }
export function useListProtocolEventCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListProtocolEventCategoriesQuery, ListProtocolEventCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListProtocolEventCategoriesQuery, ListProtocolEventCategoriesQueryVariables>(ListProtocolEventCategoriesDocument, options);
        }
export type ListProtocolEventCategoriesQueryHookResult = ReturnType<typeof useListProtocolEventCategoriesQuery>;
export type ListProtocolEventCategoriesLazyQueryHookResult = ReturnType<typeof useListProtocolEventCategoriesLazyQuery>;
export type ListProtocolEventCategoriesQueryResult = Apollo.QueryResult<ListProtocolEventCategoriesQuery, ListProtocolEventCategoriesQueryVariables>;
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
export const ListRelationCategoryDocument = gql`
    query ListRelationCategory($filters: RelationCategoryFilter, $pagination: OffsetPaginationInput) {
  relationCategories(filters: $filters, pagination: $pagination) {
    ...ListRelationCategory
  }
}
    ${ListRelationCategoryFragmentDoc}`;

/**
 * __useListRelationCategoryQuery__
 *
 * To run a query within a React component, call `useListRelationCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useListRelationCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListRelationCategoryQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListRelationCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListRelationCategoryQuery, ListRelationCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListRelationCategoryQuery, ListRelationCategoryQueryVariables>(ListRelationCategoryDocument, options);
      }
export function useListRelationCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListRelationCategoryQuery, ListRelationCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListRelationCategoryQuery, ListRelationCategoryQueryVariables>(ListRelationCategoryDocument, options);
        }
export type ListRelationCategoryQueryHookResult = ReturnType<typeof useListRelationCategoryQuery>;
export type ListRelationCategoryLazyQueryHookResult = ReturnType<typeof useListRelationCategoryLazyQuery>;
export type ListRelationCategoryQueryResult = Apollo.QueryResult<ListRelationCategoryQuery, ListRelationCategoryQueryVariables>;
export const GetStructureRelationCategoryDocument = gql`
    query GetStructureRelationCategory($id: ID!) {
  structureRelationCategory(id: $id) {
    ...StructureRelationCategory
  }
}
    ${StructureRelationCategoryFragmentDoc}`;

/**
 * __useGetStructureRelationCategoryQuery__
 *
 * To run a query within a React component, call `useGetStructureRelationCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStructureRelationCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStructureRelationCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStructureRelationCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetStructureRelationCategoryQuery, GetStructureRelationCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetStructureRelationCategoryQuery, GetStructureRelationCategoryQueryVariables>(GetStructureRelationCategoryDocument, options);
      }
export function useGetStructureRelationCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetStructureRelationCategoryQuery, GetStructureRelationCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetStructureRelationCategoryQuery, GetStructureRelationCategoryQueryVariables>(GetStructureRelationCategoryDocument, options);
        }
export type GetStructureRelationCategoryQueryHookResult = ReturnType<typeof useGetStructureRelationCategoryQuery>;
export type GetStructureRelationCategoryLazyQueryHookResult = ReturnType<typeof useGetStructureRelationCategoryLazyQuery>;
export type GetStructureRelationCategoryQueryResult = Apollo.QueryResult<GetStructureRelationCategoryQuery, GetStructureRelationCategoryQueryVariables>;
export const SearchStructureRelationCategoryDocument = gql`
    query SearchStructureRelationCategory($search: String, $values: [ID!]) {
  options: structureRelationCategories(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchStructureRelationCategoryQuery__
 *
 * To run a query within a React component, call `useSearchStructureRelationCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchStructureRelationCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchStructureRelationCategoryQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchStructureRelationCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchStructureRelationCategoryQuery, SearchStructureRelationCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchStructureRelationCategoryQuery, SearchStructureRelationCategoryQueryVariables>(SearchStructureRelationCategoryDocument, options);
      }
export function useSearchStructureRelationCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchStructureRelationCategoryQuery, SearchStructureRelationCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchStructureRelationCategoryQuery, SearchStructureRelationCategoryQueryVariables>(SearchStructureRelationCategoryDocument, options);
        }
export type SearchStructureRelationCategoryQueryHookResult = ReturnType<typeof useSearchStructureRelationCategoryQuery>;
export type SearchStructureRelationCategoryLazyQueryHookResult = ReturnType<typeof useSearchStructureRelationCategoryLazyQuery>;
export type SearchStructureRelationCategoryQueryResult = Apollo.QueryResult<SearchStructureRelationCategoryQuery, SearchStructureRelationCategoryQueryVariables>;
export const ListStructureRelationCategoryDocument = gql`
    query ListStructureRelationCategory($filters: StructureRelationCategoryFilter, $pagination: OffsetPaginationInput) {
  structureRelationCategories(filters: $filters, pagination: $pagination) {
    ...ListStructureRelationCategoryWithGraph
  }
}
    ${ListStructureRelationCategoryWithGraphFragmentDoc}`;

/**
 * __useListStructureRelationCategoryQuery__
 *
 * To run a query within a React component, call `useListStructureRelationCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useListStructureRelationCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListStructureRelationCategoryQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListStructureRelationCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListStructureRelationCategoryQuery, ListStructureRelationCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListStructureRelationCategoryQuery, ListStructureRelationCategoryQueryVariables>(ListStructureRelationCategoryDocument, options);
      }
export function useListStructureRelationCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListStructureRelationCategoryQuery, ListStructureRelationCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListStructureRelationCategoryQuery, ListStructureRelationCategoryQueryVariables>(ListStructureRelationCategoryDocument, options);
        }
export type ListStructureRelationCategoryQueryHookResult = ReturnType<typeof useListStructureRelationCategoryQuery>;
export type ListStructureRelationCategoryLazyQueryHookResult = ReturnType<typeof useListStructureRelationCategoryLazyQuery>;
export type ListStructureRelationCategoryQueryResult = Apollo.QueryResult<ListStructureRelationCategoryQuery, ListStructureRelationCategoryQueryVariables>;
export const StartPaneDocument = gql`
    query StartPane {
  entityCategories(filters: {pinned: true}, pagination: {limit: 5}) {
    id
    label
  }
  relationCategories(filters: {pinned: true}, pagination: {limit: 5}) {
    id
    label
  }
  structureCategories(filters: {pinned: true}, pagination: {limit: 5}) {
    id
    identifier
  }
  protocolEventCategories(filters: {pinned: true}, pagination: {limit: 5}) {
    id
    label
  }
  naturalEventCategories(filters: {pinned: true}, pagination: {limit: 5}) {
    id
    label
  }
}
    `;

/**
 * __useStartPaneQuery__
 *
 * To run a query within a React component, call `useStartPaneQuery` and pass it any options that fit your needs.
 * When your component renders, `useStartPaneQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStartPaneQuery({
 *   variables: {
 *   },
 * });
 */
export function useStartPaneQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<StartPaneQuery, StartPaneQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<StartPaneQuery, StartPaneQueryVariables>(StartPaneDocument, options);
      }
export function useStartPaneLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<StartPaneQuery, StartPaneQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<StartPaneQuery, StartPaneQueryVariables>(StartPaneDocument, options);
        }
export type StartPaneQueryHookResult = ReturnType<typeof useStartPaneQuery>;
export type StartPaneLazyQueryHookResult = ReturnType<typeof useStartPaneLazyQuery>;
export type StartPaneQueryResult = Apollo.QueryResult<StartPaneQuery, StartPaneQueryVariables>;
export const GetStructureDocument = gql`
    query GetStructure($id: GraphID!) {
  structure(id: $id) {
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
 *      id: // value for 'id'
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
export const SearchStructuresDocument = gql`
    query SearchStructures($id: ID!, $search: String, $values: [GraphID!]) {
  options: structures(
    structureCategoryId: $id
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchStructuresQuery__
 *
 * To run a query within a React component, call `useSearchStructuresQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchStructuresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchStructuresQuery({
 *   variables: {
 *      id: // value for 'id'
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchStructuresQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchStructuresQuery, SearchStructuresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchStructuresQuery, SearchStructuresQueryVariables>(SearchStructuresDocument, options);
      }
export function useSearchStructuresLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchStructuresQuery, SearchStructuresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchStructuresQuery, SearchStructuresQueryVariables>(SearchStructuresDocument, options);
        }
export type SearchStructuresQueryHookResult = ReturnType<typeof useSearchStructuresQuery>;
export type SearchStructuresLazyQueryHookResult = ReturnType<typeof useSearchStructuresLazyQuery>;
export type SearchStructuresQueryResult = Apollo.QueryResult<SearchStructuresQuery, SearchStructuresQueryVariables>;
export const GetInformedStructureDocument = gql`
    query GetInformedStructure($graph: ID!, $identifier: StructureIdentifier!, $object: StructureObject!) {
  structureByIdentifier(graph: $graph, identifier: $identifier, object: $object) {
    ...InformedStructure
  }
}
    ${InformedStructureFragmentDoc}`;

/**
 * __useGetInformedStructureQuery__
 *
 * To run a query within a React component, call `useGetInformedStructureQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInformedStructureQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInformedStructureQuery({
 *   variables: {
 *      graph: // value for 'graph'
 *      identifier: // value for 'identifier'
 *      object: // value for 'object'
 *   },
 * });
 */
export function useGetInformedStructureQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetInformedStructureQuery, GetInformedStructureQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetInformedStructureQuery, GetInformedStructureQueryVariables>(GetInformedStructureDocument, options);
      }
export function useGetInformedStructureLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetInformedStructureQuery, GetInformedStructureQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetInformedStructureQuery, GetInformedStructureQueryVariables>(GetInformedStructureDocument, options);
        }
export type GetInformedStructureQueryHookResult = ReturnType<typeof useGetInformedStructureQuery>;
export type GetInformedStructureLazyQueryHookResult = ReturnType<typeof useGetInformedStructureLazyQuery>;
export type GetInformedStructureQueryResult = Apollo.QueryResult<GetInformedStructureQuery, GetInformedStructureQueryVariables>;
export const ListStructuresDocument = gql`
    query ListStructures($id: ID!, $filters: StructureFilter, $pagination: StructurePaginationInput) {
  structures(structureCategoryId: $id, filters: $filters, pagination: $pagination) {
    ...ListStructure
  }
}
    ${ListStructureFragmentDoc}`;

/**
 * __useListStructuresQuery__
 *
 * To run a query within a React component, call `useListStructuresQuery` and pass it any options that fit your needs.
 * When your component renders, `useListStructuresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListStructuresQuery({
 *   variables: {
 *      id: // value for 'id'
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListStructuresQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ListStructuresQuery, ListStructuresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListStructuresQuery, ListStructuresQueryVariables>(ListStructuresDocument, options);
      }
export function useListStructuresLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListStructuresQuery, ListStructuresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListStructuresQuery, ListStructuresQueryVariables>(ListStructuresDocument, options);
        }
export type ListStructuresQueryHookResult = ReturnType<typeof useListStructuresQuery>;
export type ListStructuresLazyQueryHookResult = ReturnType<typeof useListStructuresLazyQuery>;
export type ListStructuresQueryResult = Apollo.QueryResult<ListStructuresQuery, ListStructuresQueryVariables>;
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
    label: identifier
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
export const ListStructureCategoryDocument = gql`
    query ListStructureCategory($filters: StructureCategoryFilter, $pagination: OffsetPaginationInput) {
  structureCategories(filters: $filters, pagination: $pagination) {
    ...StructureCategory
  }
}
    ${StructureCategoryFragmentDoc}`;

/**
 * __useListStructureCategoryQuery__
 *
 * To run a query within a React component, call `useListStructureCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useListStructureCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListStructureCategoryQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListStructureCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListStructureCategoryQuery, ListStructureCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListStructureCategoryQuery, ListStructureCategoryQueryVariables>(ListStructureCategoryDocument, options);
      }
export function useListStructureCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListStructureCategoryQuery, ListStructureCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListStructureCategoryQuery, ListStructureCategoryQueryVariables>(ListStructureCategoryDocument, options);
        }
export type ListStructureCategoryQueryHookResult = ReturnType<typeof useListStructureCategoryQuery>;
export type ListStructureCategoryLazyQueryHookResult = ReturnType<typeof useListStructureCategoryLazyQuery>;
export type ListStructureCategoryQueryResult = Apollo.QueryResult<ListStructureCategoryQuery, ListStructureCategoryQueryVariables>;
export const GetStructureRelationDocument = gql`
    query GetStructureRelation($id: GraphID!) {
  structureRelation(id: $id) {
    ...DetailStructureRelation
  }
}
    ${DetailStructureRelationFragmentDoc}`;

/**
 * __useGetStructureRelationQuery__
 *
 * To run a query within a React component, call `useGetStructureRelationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStructureRelationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStructureRelationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStructureRelationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetStructureRelationQuery, GetStructureRelationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetStructureRelationQuery, GetStructureRelationQueryVariables>(GetStructureRelationDocument, options);
      }
export function useGetStructureRelationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetStructureRelationQuery, GetStructureRelationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetStructureRelationQuery, GetStructureRelationQueryVariables>(GetStructureRelationDocument, options);
        }
export type GetStructureRelationQueryHookResult = ReturnType<typeof useGetStructureRelationQuery>;
export type GetStructureRelationLazyQueryHookResult = ReturnType<typeof useGetStructureRelationLazyQuery>;
export type GetStructureRelationQueryResult = Apollo.QueryResult<GetStructureRelationQuery, GetStructureRelationQueryVariables>;
export const SearchStructureRelationsDocument = gql`
    query SearchStructureRelations($category: ID!, $search: String, $values: [GraphID!]) {
  options: structureRelations(
    structureRelationCategoryId: $category
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchStructureRelationsQuery__
 *
 * To run a query within a React component, call `useSearchStructureRelationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchStructureRelationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchStructureRelationsQuery({
 *   variables: {
 *      category: // value for 'category'
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchStructureRelationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchStructureRelationsQuery, SearchStructureRelationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchStructureRelationsQuery, SearchStructureRelationsQueryVariables>(SearchStructureRelationsDocument, options);
      }
export function useSearchStructureRelationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchStructureRelationsQuery, SearchStructureRelationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchStructureRelationsQuery, SearchStructureRelationsQueryVariables>(SearchStructureRelationsDocument, options);
        }
export type SearchStructureRelationsQueryHookResult = ReturnType<typeof useSearchStructureRelationsQuery>;
export type SearchStructureRelationsLazyQueryHookResult = ReturnType<typeof useSearchStructureRelationsLazyQuery>;
export type SearchStructureRelationsQueryResult = Apollo.QueryResult<SearchStructureRelationsQuery, SearchStructureRelationsQueryVariables>;
export const SearchTagsDocument = gql`
    query SearchTags($search: String, $values: [ID!]) {
  options: categoryTags(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchTagsQuery__
 *
 * To run a query within a React component, call `useSearchTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTagsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchTagsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchTagsQuery, SearchTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchTagsQuery, SearchTagsQueryVariables>(SearchTagsDocument, options);
      }
export function useSearchTagsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchTagsQuery, SearchTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchTagsQuery, SearchTagsQueryVariables>(SearchTagsDocument, options);
        }
export type SearchTagsQueryHookResult = ReturnType<typeof useSearchTagsQuery>;
export type SearchTagsLazyQueryHookResult = ReturnType<typeof useSearchTagsLazyQuery>;
export type SearchTagsQueryResult = Apollo.QueryResult<SearchTagsQuery, SearchTagsQueryVariables>;