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
  NodeID: { input: any; output: any; }
  RemoteUpload: { input: any; output: any; }
  StructureIdentifier: { input: any; output: any; }
  StructureString: { input: any; output: any; }
  UntypedPlateChild: { input: any; output: any; }
};

export type BaseCategory = {
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  bestQuery?: Maybe<GraphQuery>;
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ontology the expression belongs to. */
  graph: Graph;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  pinned: Scalars['Boolean']['output'];
  /** The unique identifier of the expression within its graph */
  purl?: Maybe<Scalars['String']['output']>;
  relevantNodeQueries: Array<NodeQuery>;
  relevantQueries: Array<GraphQuery>;
  /** The sequence of the expression within its graph */
  sequence?: Maybe<GraphSequence>;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The tags that are associated with the expression */
  tags: Array<Tag>;
};

/** Input for creating a new expression */
export type CategoryDefinitionInput = {
  /** A list of classes to filter the entities */
  categoryFilters?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** The default ACTIVE reagent to use for this port if a reagent is not provided */
  defaultUseActive?: InputMaybe<Scalars['ID']['input']>;
  /** The default creation of entity or reagent to use for this port if a reagent is not provided */
  defaultUseNew?: InputMaybe<Scalars['ID']['input']>;
  /** A list of tags to filter the entities by */
  tagFilters?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CategoryDefintion = {
  categoryExcludeFilters?: Maybe<Array<Scalars['ID']['output']>>;
  categoryFilters?: Maybe<Array<Scalars['ID']['output']>>;
  tagExcludeFilters?: Maybe<Array<Scalars['ID']['output']>>;
  tagFilters?: Maybe<Array<Scalars['String']['output']>>;
};

/** A column definition for a table view. */
export type Column = {
  __typename?: 'Column';
  category?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  idfor?: Maybe<Array<Scalars['ID']['output']>>;
  kind: ColumnKind;
  label?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  preferhidden?: Maybe<Scalars['Boolean']['output']>;
  searchable?: Maybe<Scalars['Boolean']['output']>;
  valueKind?: Maybe<MetricKind>;
};

export type ColumnInput = {
  category?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  idfor?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind: ColumnKind;
  label?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  preferhidden?: InputMaybe<Scalars['Boolean']['input']>;
  searchable?: InputMaybe<Scalars['Boolean']['input']>;
  valueKind?: InputMaybe<MetricKind>;
};

export enum ColumnKind {
  Edge = 'EDGE',
  Node = 'NODE',
  Value = 'VALUE'
}

export type ContextInput = {
  args?: InputMaybe<Scalars['Any']['input']>;
  assignationId?: InputMaybe<Scalars['ID']['input']>;
  assigneeId?: InputMaybe<Scalars['ID']['input']>;
  nodeId?: InputMaybe<Scalars['ID']['input']>;
  templateId?: InputMaybe<Scalars['ID']['input']>;
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

/** Input for deleting a generic category */
export type DeleteEntityCategoryInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

export type DeleteEntityInput = {
  id: Scalars['ID']['input'];
};

/** Input type for deleting an ontology */
export type DeleteGraphInput = {
  /** The ID of the ontology to delete */
  id: Scalars['ID']['input'];
};

/** Input for deleting an expression */
export type DeleteMeasurementCategoryInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

/** Input for deleting an expression */
export type DeleteMetricCategoryInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

/** Input for deleting an expression */
export type DeleteNaturalEventCategoryInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

/** Input for deleting an expression */
export type DeleteProtocolEventCategoryInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

/** Input for deleting a generic category */
export type DeleteReagentCategoryInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

export type DeleteReagentInput = {
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

/** Input for deleting an expression */
export type DeleteStructureRelationCategoryInput = {
  /** The ID of the expression to delete */
  id: Scalars['ID']['input'];
};

export type DeleteToldYouSoInput = {
  id: Scalars['ID']['input'];
};

/**
 * A participant edge maps bioentitiy to an event (valid from is not necessary)
 *
 */
export type Description = Edge & {
  __typename?: 'Description';
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  left: Node;
  leftId: Scalars['String']['output'];
  right: Node;
  rightId: Scalars['String']['output'];
};

export type Edge = {
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  left: Node;
  leftId: Scalars['String']['output'];
  right: Node;
  rightId: Scalars['String']['output'];
};

export type EdgeCategory = {
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
};

export type EdgeCategoryFilter = {
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  ontology?: InputMaybe<Scalars['ID']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** A Entity is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type Entity = Node & {
  __typename?: 'Entity';
  /** The best view of the node given the current context */
  bestView?: Maybe<NodeQueryView>;
  /** Protocol steps where this entity was the target */
  category: EntityCategory;
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  externalId?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the entity within its graph */
  graph: Graph;
  /** The unique identifier of the entity within its graph */
  graphId: Scalars['ID']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  localId?: Maybe<Scalars['String']['output']>;
  relevantQueries: Array<NodeQuery>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
  /** Subjectable to */
  subjectableTo: Array<PlayableEntityRoleInProtocolEvent>;
  /** Subjectable to */
  targetableBy: Array<PlayableEntityRoleInProtocolEvent>;
  views: Array<NodeQueryView>;
};


/** A Entity is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type EntityEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


/** A Entity is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type EntityLabelArgs = {
  full?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EntityCategory = BaseCategory & NodeCategory & {
  __typename?: 'EntityCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  bestQuery?: Maybe<GraphQuery>;
  /** The color of the node in the graph */
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ontology the expression belongs to. */
  graph: Graph;
  /** The height of the node in the graph */
  height?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The unique identifier of the expression within its graph */
  instanceKind: InstanceKind;
  /** The kind of expression */
  kind: ExpressionKind;
  /** The label of the expression */
  label: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  /** The x position of the node in the graph */
  positionX?: Maybe<Scalars['Float']['output']>;
  /** The y position of the node in the graph */
  positionY?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  purl?: Maybe<Scalars['String']['output']>;
  relevantNodeQueries: Array<NodeQuery>;
  relevantQueries: Array<GraphQuery>;
  /** The sequence of the expression within its graph */
  sequence?: Maybe<GraphSequence>;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The tags that are associated with the expression */
  tags: Array<Tag>;
  /** The width of the node in the graph */
  width?: Maybe<Scalars['Float']['output']>;
};


export type EntityCategoryTagsArgs = {
  filters?: InputMaybe<TagFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type EntityCategoryDefinition = CategoryDefintion & {
  __typename?: 'EntityCategoryDefinition';
  categoryExcludeFilters?: Maybe<Array<Scalars['ID']['output']>>;
  categoryFilters?: Maybe<Array<Scalars['ID']['output']>>;
  matches: Array<EntityCategory>;
  tagExcludeFilters?: Maybe<Array<Scalars['ID']['output']>>;
  tagFilters?: Maybe<Array<Scalars['String']['output']>>;
};

export type EntityCategoryFilter = {
  AND?: InputMaybe<EntityCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<EntityCategoryFilter>;
  OR?: InputMaybe<EntityCategoryFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  ontology?: InputMaybe<Scalars['ID']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Input for creating a new expression */
export type EntityCategoryInput = {
  /** Whether to create a sequence if it does not exist */
  autoCreateSequence?: InputMaybe<Scalars['Boolean']['input']>;
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph this expression belongs to. If not provided, uses default ontology */
  graph: Scalars['ID']['input'];
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the sequence this category will get internal_ids from */
  sequence?: InputMaybe<Scalars['ID']['input']>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

/** Filter for entities in the graph */
export type EntityFilter = {
  /** Filter by active status */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by list of entity categories */
  categories?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by creation date after this date */
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter by creation date before this date */
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter by list of entity IDs */
  externalIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of entity IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search entities by text */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of categorie tags */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Input type for creating a new entity */
export type EntityInput = {
  /** The ID of the kind (LinkedExpression) to create the entity from */
  entityCategory: Scalars['ID']['input'];
  /** An optional external ID for the entity (will upsert if exists) */
  externalId?: InputMaybe<Scalars['String']['input']>;
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

export type EntityRoleDefinition = {
  __typename?: 'EntityRoleDefinition';
  allowMultiple: Scalars['Boolean']['output'];
  categoryDefinition: EntityCategoryDefinition;
  currentDefault?: Maybe<Entity>;
  description?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  optional: Scalars['Boolean']['output'];
  role: Scalars['String']['output'];
};

/** Input for creating a new expression */
export type EntityRoleDefinitionInput = {
  /** Whether this port allows multiple entities or not */
  allowMultiple?: InputMaybe<Scalars['Boolean']['input']>;
  /** The category definition for this expression */
  categoryDefinition: CategoryDefinitionInput;
  /** A detailed description of the role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The label/name of the role */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Whether this port is optional or not */
  optional?: InputMaybe<Scalars['Boolean']['input']>;
  /** The parameter name */
  role: Scalars['String']['input'];
  /** Whether this port allows a variable amount of entities or not */
  variableAmount?: InputMaybe<Scalars['Boolean']['input']>;
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
  edgeCategories: Array<EdgeCategory>;
  /** The list of generic expressions defined in this ontology */
  entityCategories: Array<EntityCategory>;
  /** The list of metric expressions defined in this ontology */
  graphQueries: Array<GraphQuery>;
  id: Scalars['ID']['output'];
  latestNodes: Array<Node>;
  /** The list of measurement exprdessions defined in this ontology */
  measurementCategories: Array<MeasurementCategory>;
  /** The list of metric expressions defined in this ontology */
  metricCategories: Array<MetricCategory>;
  name: Scalars['String']['output'];
  /** The list of step expressions defined in this ontology */
  naturalEventCategories: Array<NaturalEventCategory>;
  nodeCategories: Array<NodeCategory>;
  /** The list of metric expressions defined in this ontology */
  nodeQueries: Array<NodeQuery>;
  pinned: Scalars['Boolean']['output'];
  /** The list of step expressions defined in this ontology */
  protocolEventCategories: Array<ProtocolEventCategory>;
  /** The list of reagent expressions defined in this ontology */
  reagentCategories: Array<ReagentCategory>;
  /** The list of relation expressions defined in this ontology */
  relationCategories: Array<RelationCategory>;
  /** The list of structure expressions defined in this ontology */
  structureCategories: Array<StructureCategory>;
  /** The list of structure relation expressions defined in this ontology */
  structureRelationCategories: Array<StructureRelationCategory>;
};


/** A graph, that contains entities and relations. */
export type GraphEdgeCategoriesArgs = {
  filters?: InputMaybe<EdgeCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphEntityCategoriesArgs = {
  filters?: InputMaybe<EntityCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphGraphQueriesArgs = {
  filters?: InputMaybe<GraphQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphLatestNodesArgs = {
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphMeasurementCategoriesArgs = {
  filters?: InputMaybe<MeasurementCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphMetricCategoriesArgs = {
  filters?: InputMaybe<MetricCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphNaturalEventCategoriesArgs = {
  filters?: InputMaybe<NaturalEventCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphNodeCategoriesArgs = {
  filters?: InputMaybe<NodeCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphNodeQueriesArgs = {
  filters?: InputMaybe<NodeQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphProtocolEventCategoriesArgs = {
  filters?: InputMaybe<ProtocolEventCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphReagentCategoriesArgs = {
  filters?: InputMaybe<ReagentCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphRelationCategoriesArgs = {
  filters?: InputMaybe<RelationCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphStructureCategoriesArgs = {
  filters?: InputMaybe<StructureCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A graph, that contains entities and relations. */
export type GraphStructureRelationCategoriesArgs = {
  filters?: InputMaybe<StructureRelationCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type GraphFilter = {
  AND?: InputMaybe<GraphFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<GraphFilter>;
  OR?: InputMaybe<GraphFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input type for creating a new ontology */
export type GraphInput = {
  /** An optional description of the ontology */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional ID reference to an associated image */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The name of the ontology (will be converted to snake_case) */
  name: Scalars['String']['input'];
  /** Whether this ontology should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Input type for creating a new ontology node */
export type GraphNodeInput = {
  /** An optional RGBA color for the ontology node */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** The AGE_NAME of the ontology */
  id: Scalars['String']['input'];
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type GraphPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** A view of a graph, that contains entities and relations. */
export type GraphQuery = {
  __typename?: 'GraphQuery';
  description?: Maybe<Scalars['String']['output']>;
  graph: Graph;
  id: Scalars['ID']['output'];
  kind: ViewKind;
  name: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  query: Scalars['String']['output'];
  render: PathPairsTable;
  /** The list of metric expressions defined in this ontology */
  scatterPlots: Array<ScatterPlot>;
};


/** A view of a graph, that contains entities and relations. */
export type GraphQueryScatterPlotsArgs = {
  filters?: InputMaybe<ScatterPlotFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type GraphQueryFilter = {
  AND?: InputMaybe<GraphQueryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<GraphQueryFilter>;
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
  /** The ID of the ontology this expression belongs to. If not provided, uses default ontology */
  graph: Scalars['ID']['input'];
  /** The kind/type of this expression */
  kind: ViewKind;
  /** The label/name of the expression */
  name: Scalars['String']['input'];
  /** Whether to pin this expression for the current user */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** The label/name of the expression */
  query: Scalars['Cypher']['input'];
  /** A list of categories where this query is releveant and should be shown */
  relevantFor?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type GraphSequence = {
  __typename?: 'GraphSequence';
  categories: Array<BaseCategory>;
  graph: Graph;
  id: Scalars['ID']['output'];
};

export type GraphSequenceFilter = {
  AND?: InputMaybe<GraphSequenceFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<GraphSequenceFilter>;
  OR?: InputMaybe<GraphSequenceFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

export enum InstanceKind {
  Entity = 'ENTITY',
  Lot = 'LOT',
  Sample = 'SAMPLE',
  Unknown = 'UNKNOWN'
}

export type KnowledgeView = {
  __typename?: 'KnowledgeView';
  structure?: Maybe<Structure>;
  structureCategory: StructureCategory;
};

/** A measurement is an edge from a structure to an entity. Importantly Measurement are always directed from the structure to the entity, and never the other way around. */
export type Measurement = Edge & {
  __typename?: 'Measurement';
  category: MeasurementCategory;
  /** When this entity was created */
  createdAt: Scalars['DateTime']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  left: Node;
  leftId: Scalars['String']['output'];
  right: Node;
  rightId: Scalars['String']['output'];
  /** Timestamp from when this entity is valid */
  validFrom: Scalars['DateTime']['output'];
  /** Timestamp until when this entity is valid */
  validTo: Scalars['DateTime']['output'];
};

export type MeasurementCategory = BaseCategory & EdgeCategory & {
  __typename?: 'MeasurementCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  bestQuery?: Maybe<GraphQuery>;
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ontology the expression belongs to. */
  graph: Graph;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  /** The label of the expression */
  label: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  /** The unique identifier of the expression within its graph */
  purl?: Maybe<Scalars['String']['output']>;
  relevantNodeQueries: Array<NodeQuery>;
  relevantQueries: Array<GraphQuery>;
  /** The sequence of the expression within its graph */
  sequence?: Maybe<GraphSequence>;
  /** The unique identifier of the expression within its graph */
  sourceDefinition: StructureCategoryDefinition;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The tags that are associated with the expression */
  tags: Array<Tag>;
  targetDefinition: EntityCategoryDefinition;
};


export type MeasurementCategoryTagsArgs = {
  filters?: InputMaybe<TagFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type MeasurementCategoryFilter = {
  AND?: InputMaybe<MeasurementCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<MeasurementCategoryFilter>;
  OR?: InputMaybe<MeasurementCategoryFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type MeasurementCategoryInput = {
  /** Whether to create a sequence if it does not exist */
  autoCreateSequence?: InputMaybe<Scalars['Boolean']['input']>;
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The target definition for this expression */
  entityDefinition: CategoryDefinitionInput;
  /** The ID of the graph this expression belongs to. If not provided, uses default ontology */
  graph: Scalars['ID']['input'];
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the sequence this category will get internal_ids from */
  sequence?: InputMaybe<Scalars['ID']['input']>;
  /** The source definition for this expression */
  structureDefinition: CategoryDefinitionInput;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Filter for entity relations in the graph */
export type MeasurementFilter = {
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of relation IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by relation kind */
  kind?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by left entity ID */
  leftId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by right entity ID */
  rightId?: InputMaybe<Scalars['ID']['input']>;
  /** Search relations by text */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Include self-relations */
  withSelf?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MeasurementInput = {
  category: Scalars['ID']['input'];
  /** The context of the measurement */
  context?: InputMaybe<ContextInput>;
  entity: Scalars['NodeID']['input'];
  structure: Scalars['NodeID']['input'];
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

/** A Metric is a recorded data point in a graph. It always describes a structure and through the structure it can bring meaning to the measured entity. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type Metric = Node & {
  __typename?: 'Metric';
  /** The best view of the node given the current context */
  bestView?: Maybe<NodeQueryView>;
  /** Protocol steps where this entity was the target */
  category: MetricCategory;
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  externalId?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the entity within its graph */
  graph: Graph;
  /** The unique identifier of the entity within its graph */
  graphId: Scalars['ID']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  localId?: Maybe<Scalars['String']['output']>;
  relevantQueries: Array<NodeQuery>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
  /** The value of the metric */
  value: Scalars['Float']['output'];
  views: Array<NodeQueryView>;
};


/** A Metric is a recorded data point in a graph. It always describes a structure and through the structure it can bring meaning to the measured entity. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type MetricEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


/** A Metric is a recorded data point in a graph. It always describes a structure and through the structure it can bring meaning to the measured entity. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type MetricLabelArgs = {
  full?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MetricCategory = BaseCategory & NodeCategory & {
  __typename?: 'MetricCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  bestQuery?: Maybe<GraphQuery>;
  /** The color of the node in the graph */
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ontology the expression belongs to. */
  graph: Graph;
  /** The height of the node in the graph */
  height?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  /** The label of the expression */
  label: Scalars['String']['output'];
  /** The kind of metric this expression represents */
  metricKind: MetricKind;
  pinned: Scalars['Boolean']['output'];
  /** The x position of the node in the graph */
  positionX?: Maybe<Scalars['Float']['output']>;
  /** The y position of the node in the graph */
  positionY?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  purl?: Maybe<Scalars['String']['output']>;
  relevantNodeQueries: Array<NodeQuery>;
  relevantQueries: Array<GraphQuery>;
  /** The sequence of the expression within its graph */
  sequence?: Maybe<GraphSequence>;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The unique identifier of the expression within its graph */
  structureDefinition: StructureCategoryDefinition;
  /** The tags that are associated with the expression */
  tags: Array<Tag>;
  /** The width of the node in the graph */
  width?: Maybe<Scalars['Float']['output']>;
};


export type MetricCategoryTagsArgs = {
  filters?: InputMaybe<TagFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type MetricCategoryFilter = {
  AND?: InputMaybe<MetricCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<MetricCategoryFilter>;
  OR?: InputMaybe<MetricCategoryFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type MetricCategoryInput = {
  /** Whether to create a sequence if it does not exist */
  autoCreateSequence?: InputMaybe<Scalars['Boolean']['input']>;
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph this expression belongs to. If not provided, uses default ontology */
  graph: Scalars['ID']['input'];
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The type of metric data this expression represents */
  kind: MetricKind;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the sequence this category will get internal_ids from */
  sequence?: InputMaybe<Scalars['ID']['input']>;
  /** The structure category for this expression */
  structureDefinition: CategoryDefinitionInput;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

/** Filter for entity relations in the graph */
export type MetricFilter = {
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of relation IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by relation kind */
  kind?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by linked expression ID */
  linkedExpression?: InputMaybe<Scalars['ID']['input']>;
  /** Search relations by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type MetricInput = {
  category: Scalars['ID']['input'];
  /** The context of the measurement */
  context?: InputMaybe<ContextInput>;
  structure: Scalars['NodeID']['input'];
  /** The value of the measurement */
  value: Scalars['Any']['input'];
};

export enum MetricKind {
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

export type ModelFilter = {
  AND?: InputMaybe<ModelFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ModelFilter>;
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
  createEntityCategory: EntityCategory;
  /** Create a new graph */
  createGraph: Graph;
  /** Create a new graph query */
  createGraphQuery: GraphQuery;
  /** Create a new measurement edge */
  createMeasurement: Measurement;
  /** Create a new expression */
  createMeasurementCategory: MeasurementCategory;
  /** Create a new metric for an entity */
  createMetric: Metric;
  /** Create a new expression */
  createMetricCategory: MetricCategory;
  /** Create a new model */
  createModel: Model;
  /** Create a new natural event category */
  createNaturalEventCategory: NaturalEventCategory;
  /** Create a new node query */
  createNodeQuery: NodeQuery;
  /** Create a new protocol event category */
  createProtocolEventCategory: ProtocolEventCategory;
  /** Create a new entity */
  createReagent: Reagent;
  /** Create a new expression */
  createReagentCategory: ReagentCategory;
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
  /** Create a new relation between entities */
  createStructureRelation: StructureRelation;
  /** Create a new expression */
  createStructureRelationCategory: StructureRelationCategory;
  /** Create a new 'told you so' supporting structure */
  createToldyouso: Structure;
  /** Delete an existing entity */
  deleteEntity: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteEntityCategory: Scalars['ID']['output'];
  /** Delete an existing graph */
  deleteGraph: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteMeasurementCategory: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteMetricCategory: Scalars['ID']['output'];
  /** Delete an existing natural event category */
  deleteNaturalEventCategory: Scalars['ID']['output'];
  /** Delete an existing protocol event category */
  deleteProtocolEventCategory: Scalars['ID']['output'];
  /** Delete an existing entity */
  deleteReagent: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteReagentCategory: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteRelationCategory: Scalars['ID']['output'];
  /** Delete an existing scatter plot */
  deleteScatterPlot: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteStructureCategory: Scalars['ID']['output'];
  /** Delete an existing expression */
  deleteStructureRelationCategory: Scalars['ID']['output'];
  /** Delete a 'told you so' supporting structure */
  deleteToldyouso: Scalars['ID']['output'];
  /** Pin or unpin a graph */
  pinGraph: Graph;
  /** Pin or unpin a graph query */
  pinGraphQuery: GraphQuery;
  /** Pin or unpin a node query */
  pinNodeQuery: NodeQuery;
  /** Record a new natural event */
  recordNaturalEvent: NaturalEvent;
  /** Record a new protocol event */
  recordProtocolEvent: ProtocolEvent;
  /** Request a new file upload */
  requestUpload: PresignedPostCredentials;
  /** Update an existing expression */
  updateEntityCategory: EntityCategory;
  /** Update an existing graph */
  updateGraph: Graph;
  /** Update an existing expression */
  updateMeasurementCategory: MeasurementCategory;
  /** Update an existing expression */
  updateMetricCategory: MetricCategory;
  /** Update an existing natural event category */
  updateNaturalEventCategory: NaturalEventCategory;
  /** Update an existing protocol event category */
  updateProtocolEventCategory: ProtocolEventCategory;
  /** Update an existing expression */
  updateReagentCategory: ReagentCategory;
  /** Update an existing expression */
  updateRelationCategory: RelationCategory;
  /** Update an existing expression */
  updateStructureCategory: StructureCategory;
  /** Update an existing expression */
  updateStructureRelationCategory: StructureRelationCategory;
};


export type MutationCreateEntityArgs = {
  input: EntityInput;
};


export type MutationCreateEntityCategoryArgs = {
  input: EntityCategoryInput;
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


export type MutationCreateMeasurementCategoryArgs = {
  input: MeasurementCategoryInput;
};


export type MutationCreateMetricArgs = {
  input: MetricInput;
};


export type MutationCreateMetricCategoryArgs = {
  input: MetricCategoryInput;
};


export type MutationCreateModelArgs = {
  input: CreateModelInput;
};


export type MutationCreateNaturalEventCategoryArgs = {
  input: NaturalEventCategoryInput;
};


export type MutationCreateNodeQueryArgs = {
  input: NodeQueryInput;
};


export type MutationCreateProtocolEventCategoryArgs = {
  input: ProtocolEventCategoryInput;
};


export type MutationCreateReagentArgs = {
  input: ReagentInput;
};


export type MutationCreateReagentCategoryArgs = {
  input: ReagentCategoryInput;
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


export type MutationCreateStructureRelationArgs = {
  input: StructureRelationInput;
};


export type MutationCreateStructureRelationCategoryArgs = {
  input: StructureRelationCategoryInput;
};


export type MutationCreateToldyousoArgs = {
  input: ToldYouSoInput;
};


export type MutationDeleteEntityArgs = {
  input: DeleteEntityInput;
};


export type MutationDeleteEntityCategoryArgs = {
  input: DeleteEntityCategoryInput;
};


export type MutationDeleteGraphArgs = {
  input: DeleteGraphInput;
};


export type MutationDeleteMeasurementCategoryArgs = {
  input: DeleteMeasurementCategoryInput;
};


export type MutationDeleteMetricCategoryArgs = {
  input: DeleteMetricCategoryInput;
};


export type MutationDeleteNaturalEventCategoryArgs = {
  input: DeleteNaturalEventCategoryInput;
};


export type MutationDeleteProtocolEventCategoryArgs = {
  input: DeleteProtocolEventCategoryInput;
};


export type MutationDeleteReagentArgs = {
  input: DeleteReagentInput;
};


export type MutationDeleteReagentCategoryArgs = {
  input: DeleteReagentCategoryInput;
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


export type MutationDeleteStructureRelationCategoryArgs = {
  input: DeleteStructureRelationCategoryInput;
};


export type MutationDeleteToldyousoArgs = {
  input: DeleteToldYouSoInput;
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


export type MutationRecordNaturalEventArgs = {
  input: RecordNaturalEventInput;
};


export type MutationRecordProtocolEventArgs = {
  input: RecordProtocolEventInput;
};


export type MutationRequestUploadArgs = {
  input: RequestMediaUploadInput;
};


export type MutationUpdateEntityCategoryArgs = {
  input: UpdateEntityCategoryInput;
};


export type MutationUpdateGraphArgs = {
  input: UpdateGraphInput;
};


export type MutationUpdateMeasurementCategoryArgs = {
  input: UpdateMeasurementCategoryInput;
};


export type MutationUpdateMetricCategoryArgs = {
  input: UpdateMetricCategoryInput;
};


export type MutationUpdateNaturalEventCategoryArgs = {
  input: UpdateNaturalEventCategoryInput;
};


export type MutationUpdateProtocolEventCategoryArgs = {
  input: UpdateProtocolEventCategoryInput;
};


export type MutationUpdateReagentCategoryArgs = {
  input: UpdateReagentCategoryInput;
};


export type MutationUpdateRelationCategoryArgs = {
  input: UpdateRelationCategoryInput;
};


export type MutationUpdateStructureCategoryArgs = {
  input: UpdateStructureCategoryInput;
};


export type MutationUpdateStructureRelationCategoryArgs = {
  input: UpdateStructureRelationCategoryInput;
};

/** A Metric is a recorded data point in a graph. It always describes a structure and through the structure it can bring meaning to the measured entity. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type NaturalEvent = Node & {
  __typename?: 'NaturalEvent';
  /** The best view of the node given the current context */
  bestView?: Maybe<NodeQueryView>;
  /** Protocol steps where this entity was the target */
  category: NaturalEventCategory;
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  externalId?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the entity within its graph */
  graph: Graph;
  /** The unique identifier of the entity within its graph */
  graphId: Scalars['ID']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  localId?: Maybe<Scalars['String']['output']>;
  relevantQueries: Array<NodeQuery>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
  /** Protocol steps where this entity was the target */
  validFrom?: Maybe<Scalars['DateTime']['output']>;
  /** Protocol steps where this entity was the target */
  validTo?: Maybe<Scalars['DateTime']['output']>;
  views: Array<NodeQueryView>;
};


/** A Metric is a recorded data point in a graph. It always describes a structure and through the structure it can bring meaning to the measured entity. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type NaturalEventEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


/** A Metric is a recorded data point in a graph. It always describes a structure and through the structure it can bring meaning to the measured entity. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type NaturalEventLabelArgs = {
  full?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NaturalEventCategory = BaseCategory & NodeCategory & {
  __typename?: 'NaturalEventCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  bestQuery?: Maybe<GraphQuery>;
  /** The color of the node in the graph */
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ontology the expression belongs to. */
  graph: Graph;
  /** The height of the node in the graph */
  height?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  /** The label of the expression */
  label: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  /** The children of this plate */
  plateChildren?: Maybe<Array<Scalars['UntypedPlateChild']['output']>>;
  /** The x position of the node in the graph */
  positionX?: Maybe<Scalars['Float']['output']>;
  /** The y position of the node in the graph */
  positionY?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  purl?: Maybe<Scalars['String']['output']>;
  relevantNodeQueries: Array<NodeQuery>;
  relevantQueries: Array<GraphQuery>;
  /** The sequence of the expression within its graph */
  sequence?: Maybe<GraphSequence>;
  /** The unique identifier of the expression within its graph */
  sourceEntityRoles: Array<EntityRoleDefinition>;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The tags that are associated with the expression */
  tags: Array<Tag>;
  /** The unique identifier of the expression within its graph */
  targetEntityRoles: Array<EntityRoleDefinition>;
  /** The width of the node in the graph */
  width?: Maybe<Scalars['Float']['output']>;
};


export type NaturalEventCategoryTagsArgs = {
  filters?: InputMaybe<TagFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type NaturalEventCategoryFilter = {
  AND?: InputMaybe<NaturalEventCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<NaturalEventCategoryFilter>;
  OR?: InputMaybe<NaturalEventCategoryFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type NaturalEventCategoryInput = {
  /** Whether to create a sequence if it does not exist */
  autoCreateSequence?: InputMaybe<Scalars['Boolean']['input']>;
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph this expression belongs to. If not provided, uses default ontology */
  graph: Scalars['ID']['input'];
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** A list of children for the plate */
  plateChildren?: InputMaybe<Array<PlateChildInput>>;
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the sequence this category will get internal_ids from */
  sequence?: InputMaybe<Scalars['ID']['input']>;
  /** The source definitions for this expression */
  sourceEntityRoles: Array<EntityRoleDefinitionInput>;
  /** The support definition for this expression */
  supportDefinition: CategoryDefinitionInput;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The target definitions for this expression */
  targetEntityRoles: Array<EntityRoleDefinitionInput>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

/** Filter for entity relations in the graph */
export type NaturalEventFilter = {
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of relation IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by relation kind */
  kind?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by linked expression ID */
  linkedExpression?: InputMaybe<Scalars['ID']['input']>;
  /** Search relations by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Node = {
  /** The best view of the node given the current context */
  bestView?: Maybe<NodeQueryView>;
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  externalId?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the entity within its graph */
  graph: Graph;
  /** The unique identifier of the entity within its graph */
  graphId: Scalars['ID']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  localId?: Maybe<Scalars['String']['output']>;
  relevantQueries: Array<NodeQuery>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
  views: Array<NodeQueryView>;
};


export type NodeEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type NodeLabelArgs = {
  full?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NodeCategory = {
  /** The color of the node in the graph */
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** The height of the node in the graph */
  height?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The x position of the node in the graph */
  positionX?: Maybe<Scalars['Float']['output']>;
  /** The y position of the node in the graph */
  positionY?: Maybe<Scalars['Float']['output']>;
  /** The width of the node in the graph */
  width?: Maybe<Scalars['Float']['output']>;
};

export type NodeCategoryFilter = {
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  ontology?: InputMaybe<Scalars['ID']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Filter for entity relations in the graph */
export type NodeFilter = {
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of relation IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by relation kind */
  kind?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by linked expression ID */
  linkedExpression?: InputMaybe<Scalars['ID']['input']>;
  /** Search relations by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type NodeMapping = {
  key: Scalars['String']['input'];
  node: Scalars['ID']['input'];
  quantity?: InputMaybe<Scalars['Float']['input']>;
};

/** A view of a node entities and relations. */
export type NodeQuery = {
  __typename?: 'NodeQuery';
  description?: Maybe<Scalars['String']['output']>;
  graph: Graph;
  id: Scalars['ID']['output'];
  kind: ViewKind;
  name: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  query: Scalars['String']['output'];
  render: PathPairsTable;
};


/** A view of a node entities and relations. */
export type NodeQueryRenderArgs = {
  nodeId: Scalars['ID']['input'];
};

export type NodeQueryFilter = {
  AND?: InputMaybe<NodeQueryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<NodeQueryFilter>;
  OR?: InputMaybe<NodeQueryFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type NodeQueryInput = {
  /** The columns (if ViewKind is Table) */
  columns?: InputMaybe<Array<ColumnInput>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the ontology this expression belongs to. If not provided, uses default ontology */
  graph: Scalars['ID']['input'];
  /** The kind/type of this expression */
  kind: ViewKind;
  /** The label/name of the expression */
  name: Scalars['String']['input'];
  /** Whether to pin this expression for the current user */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** The label/name of the expression */
  query: Scalars['Cypher']['input'];
  /** The list of categories this expression is relevant for */
  relevantFor?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** The node to test against */
  testAgainst?: InputMaybe<Scalars['ID']['input']>;
};

export type NodeQueryView = {
  __typename?: 'NodeQueryView';
  nodeId: Scalars['String']['output'];
  query: NodeQuery;
  render: PathPairsTable;
};

export type OffsetPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: Scalars['Int']['input'];
};

export type OptionInput = {
  /** A detailed description of the option */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The label of the option */
  label: Scalars['String']['input'];
  /** The value of the option. This can be a string, number, or boolean */
  value: Scalars['Any']['input'];
};

/** A paired structure two entities and the relation between them. */
export type Pair = {
  __typename?: 'Pair';
  /** The relation between the two entities. */
  edge: Edge;
  /** The left entity. */
  source: Node;
  /** The right entity. */
  target: Node;
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

/**
 * A participant edge maps bioentitiy to an event (valid from is not necessary)
 *
 */
export type Participant = Edge & {
  __typename?: 'Participant';
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  left: Node;
  leftId: Scalars['String']['output'];
  /** Timestamp from when this entity is valid */
  quantity?: Maybe<Scalars['Float']['output']>;
  right: Node;
  rightId: Scalars['String']['output'];
  /** Timestamp from when this entity is valid */
  role: Scalars['String']['output'];
};

/** Filter for entity relations in the graph */
export type ParticipantFilter = {
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of relation IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by relation kind */
  kind?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by left entity ID */
  leftId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by right entity ID */
  rightId?: InputMaybe<Scalars['ID']['input']>;
  /** Search relations by text */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Include self-relations */
  withSelf?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Path = {
  __typename?: 'Path';
  edges: Array<Edge>;
  nodes: Array<Node>;
};

export type PathPairsTable = Pairs | Path | Table;

/** Input type for pinning an ontology */
export type PinGraphInput = {
  /** The ID of the ontology to pin */
  id: Scalars['ID']['input'];
  /** Whether to pin the ontology or not */
  pinned: Scalars['Boolean']['input'];
};

export type PinGraphQueryInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type PinNodeQueryInput = {
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

/** Playable Role in Protocol Event */
export type PlayableEntityRoleInProtocolEvent = {
  __typename?: 'PlayableEntityRoleInProtocolEvent';
  /** The unique identifier of the entity within its graph */
  category: ProtocolEventCategory;
  /** The unique identifier of the entity within its graph */
  role: Scalars['String']['output'];
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

/** A Metric is a recorded data point in a graph. It always describes a structure and through the structure it can bring meaning to the measured entity. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type ProtocolEvent = Node & {
  __typename?: 'ProtocolEvent';
  /** The best view of the node given the current context */
  bestView?: Maybe<NodeQueryView>;
  /** Protocol steps where this entity was the target */
  category: ProtocolEventCategory;
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  externalId?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the entity within its graph */
  graph: Graph;
  /** The unique identifier of the entity within its graph */
  graphId: Scalars['ID']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  localId?: Maybe<Scalars['String']['output']>;
  relevantQueries: Array<NodeQuery>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
  /** Protocol steps where this entity was the target */
  validFrom?: Maybe<Scalars['DateTime']['output']>;
  /** Protocol steps where this entity was the target */
  validTo?: Maybe<Scalars['DateTime']['output']>;
  /** Protocol steps where this entity was the target */
  variables: Array<VariableMapping>;
  views: Array<NodeQueryView>;
};


/** A Metric is a recorded data point in a graph. It always describes a structure and through the structure it can bring meaning to the measured entity. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type ProtocolEventEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


/** A Metric is a recorded data point in a graph. It always describes a structure and through the structure it can bring meaning to the measured entity. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type ProtocolEventLabelArgs = {
  full?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProtocolEventCategory = BaseCategory & NodeCategory & {
  __typename?: 'ProtocolEventCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  bestQuery?: Maybe<GraphQuery>;
  /** The color of the node in the graph */
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ontology the expression belongs to. */
  graph: Graph;
  /** The height of the node in the graph */
  height?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  /** The label of the expression */
  label: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  /** The children of this plate */
  plateChildren?: Maybe<Array<Scalars['UntypedPlateChild']['output']>>;
  /** The x position of the node in the graph */
  positionX?: Maybe<Scalars['Float']['output']>;
  /** The y position of the node in the graph */
  positionY?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  purl?: Maybe<Scalars['String']['output']>;
  relevantNodeQueries: Array<NodeQuery>;
  relevantQueries: Array<GraphQuery>;
  /** The sequence of the expression within its graph */
  sequence?: Maybe<GraphSequence>;
  /** The unique identifier of the expression within its graph */
  sourceEntityRoles: Array<EntityRoleDefinition>;
  /** The unique identifier of the expression within its graph */
  sourceReagentRoles: Array<ReagentRoleDefinition>;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The tags that are associated with the expression */
  tags: Array<Tag>;
  /** The unique identifier of the expression within its graph */
  targetEntityRoles: Array<EntityRoleDefinition>;
  /** The unique identifier of the expression within its graph */
  targetReagentRoles: Array<ReagentRoleDefinition>;
  variableDefinitions: Array<VariableDefinition>;
  /** The width of the node in the graph */
  width?: Maybe<Scalars['Float']['output']>;
};


export type ProtocolEventCategoryTagsArgs = {
  filters?: InputMaybe<TagFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ProtocolEventCategoryFilter = {
  AND?: InputMaybe<ProtocolEventCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ProtocolEventCategoryFilter>;
  OR?: InputMaybe<ProtocolEventCategoryFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type ProtocolEventCategoryInput = {
  /** Whether to create a sequence if it does not exist */
  autoCreateSequence?: InputMaybe<Scalars['Boolean']['input']>;
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph this expression belongs to. If not provided, uses default ontology */
  graph: Scalars['ID']['input'];
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** A list of children for the plate */
  plateChildren?: InputMaybe<Array<PlateChildInput>>;
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the sequence this category will get internal_ids from */
  sequence?: InputMaybe<Scalars['ID']['input']>;
  /** The source definitions for this expression */
  sourceEntityRoles?: InputMaybe<Array<EntityRoleDefinitionInput>>;
  /** The target definitions for this expression */
  sourceReagentRoles?: InputMaybe<Array<ReagentRoleDefinitionInput>>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The target definitions for this expression */
  targetEntityRoles?: InputMaybe<Array<EntityRoleDefinitionInput>>;
  /** The target definitions for this expression */
  targetReagentRoles?: InputMaybe<Array<ReagentRoleDefinitionInput>>;
  /** The variable definitions for this expression */
  variableDefinitions?: InputMaybe<Array<VariableDefinitionInput>>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

/** Filter for entity relations in the graph */
export type ProtocolEventFilter = {
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of relation IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by relation kind */
  kind?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by linked expression ID */
  linkedExpression?: InputMaybe<Scalars['ID']['input']>;
  /** Search relations by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  edge: Edge;
  edgeCategories: Array<EdgeCategory>;
  /** List of all relationships between entities */
  edges: Array<Edge>;
  entities: Array<Entity>;
  entity: Entity;
  /** List of all generic categories */
  entityCategories: Array<EntityCategory>;
  entityCategory: EntityCategory;
  getEntityByCategoryAndExternalId: Entity;
  graph: Graph;
  /** List of all graph queries */
  graphQueries: Array<GraphQuery>;
  graphQuery: GraphQuery;
  graphSequence: GraphSequence;
  /** List of all graph sequences */
  graphSequences: Array<GraphSequence>;
  /** List of all knowledge graphs */
  graphs: Array<Graph>;
  knowledgeViews: Array<KnowledgeView>;
  measurement: Measurement;
  /** List of all measurement categories */
  measurementCategories: Array<MeasurementCategory>;
  measurementCategory: MeasurementCategory;
  measurements: Array<Measurement>;
  metric: Metric;
  /** List of all metric categories */
  metricCategories: Array<MetricCategory>;
  metricCategory: MetricCategory;
  metrics: Array<Metric>;
  model: Model;
  /** List of all deep learning models (e.g. neural networks) */
  models: Array<Model>;
  myActiveGraph: Graph;
  naturalEvent: NaturalEvent;
  /** List of all natural event categories */
  naturalEventCategories: Array<NaturalEventCategory>;
  naturalEventCategory: NaturalEventCategory;
  naturalEvents: Array<ProtocolEvent>;
  node: Node;
  nodeCategories: Array<NodeCategory>;
  /** List of all node queries */
  nodeQueries: Array<NodeQuery>;
  nodeQuery: NodeQuery;
  /** The best view of the node given the current context */
  nodeView: NodeQueryView;
  /** List of all entities in the system */
  nodes: Array<Entity>;
  participant: Participant;
  participants: Array<Participant>;
  protocolEvent: ProtocolEvent;
  /** List of all protocol event categories */
  protocolEventCategories: Array<ProtocolEventCategory>;
  protocolEventCategory: ProtocolEventCategory;
  protocolEvents: Array<ProtocolEvent>;
  reagent: Reagent;
  /** List of all reagent categories */
  reagentCategories: Array<ReagentCategory>;
  reagentCategory: ReagentCategory;
  reagents: Array<Reagent>;
  relation: Relation;
  /** List of all relation categories */
  relationCategories: Array<RelationCategory>;
  relationCategory: RelationCategory;
  relations: Array<Relation>;
  /** Render a node query */
  renderNodeQuery: PairsPathTable;
  scatterPlot: ScatterPlot;
  /** List of all scatter plots */
  scatterPlots: Array<ScatterPlot>;
  structure: Structure;
  structureByIdentifier: Structure;
  /** List of all structure categories */
  structureCategories: Array<StructureCategory>;
  structureCategory: StructureCategory;
  /** List of all structure relation categories */
  structureRelationCategories: Array<StructureRelationCategory>;
  structureRelationCategory: StructureRelationCategory;
  structures: Array<Structure>;
  /** List of all tags in the system */
  tags: Array<Tag>;
};


export type QueryEdgeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEdgeCategoriesArgs = {
  filters?: InputMaybe<NodeCategoryFilter>;
  input?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEdgesArgs = {
  filters?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryEntitiesArgs = {
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntityCategoriesArgs = {
  filters?: InputMaybe<EntityCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryEntityCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetEntityByCategoryAndExternalIdArgs = {
  category: Scalars['ID']['input'];
  externalId: Scalars['String']['input'];
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


export type QueryGraphSequenceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphSequencesArgs = {
  filters?: InputMaybe<GraphSequenceFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryGraphsArgs = {
  filters?: InputMaybe<GraphFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryKnowledgeViewsArgs = {
  identifier: Scalars['StructureIdentifier']['input'];
  object: Scalars['ID']['input'];
};


export type QueryMeasurementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMeasurementCategoriesArgs = {
  filters?: InputMaybe<MeasurementCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMeasurementCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMeasurementsArgs = {
  filters?: InputMaybe<MeasurementFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryMetricArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMetricCategoriesArgs = {
  filters?: InputMaybe<MetricCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMetricCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMetricsArgs = {
  filters?: InputMaybe<MetricFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryModelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryModelsArgs = {
  filters?: InputMaybe<ModelFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryNaturalEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNaturalEventCategoriesArgs = {
  filters?: InputMaybe<NaturalEventCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryNaturalEventCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNaturalEventsArgs = {
  filters?: InputMaybe<NaturalEventFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodeCategoriesArgs = {
  filters?: InputMaybe<NodeCategoryFilter>;
  input?: InputMaybe<OffsetPaginationInput>;
};


export type QueryNodeQueriesArgs = {
  filters?: InputMaybe<NodeQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryNodeQueryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodeViewArgs = {
  nodeId: Scalars['ID']['input'];
  query: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  filters?: InputMaybe<NodeFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryParticipantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryParticipantsArgs = {
  filters?: InputMaybe<ParticipantFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryProtocolEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProtocolEventCategoriesArgs = {
  filters?: InputMaybe<ProtocolEventCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryProtocolEventCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProtocolEventsArgs = {
  filters?: InputMaybe<ProtocolEventFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryReagentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReagentCategoriesArgs = {
  filters?: InputMaybe<ReagentCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryReagentCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReagentsArgs = {
  filters?: InputMaybe<ReagentFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryRelationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRelationCategoriesArgs = {
  filters?: InputMaybe<RelationCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRelationCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRelationsArgs = {
  filters?: InputMaybe<RelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryRenderNodeQueryArgs = {
  id: Scalars['ID']['input'];
  nodeId: Scalars['ID']['input'];
};


export type QueryScatterPlotArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScatterPlotsArgs = {
  filters?: InputMaybe<ScatterPlotFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStructureArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStructureByIdentifierArgs = {
  graph: Scalars['ID']['input'];
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


export type QueryStructureRelationCategoriesArgs = {
  filters?: InputMaybe<StructureRelationCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStructureRelationCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStructuresArgs = {
  filters?: InputMaybe<StructureFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


export type QueryTagsArgs = {
  filters?: InputMaybe<TagFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** A Entity is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type Reagent = Node & {
  __typename?: 'Reagent';
  /** The best view of the node given the current context */
  bestView?: Maybe<NodeQueryView>;
  /** Protocol steps where this entity was the target */
  category: ReagentCategory;
  /** Subjectable to */
  createableFrom: Array<ProtocolEventCategory>;
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  externalId?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the entity within its graph */
  graph: Graph;
  /** The unique identifier of the entity within its graph */
  graphId: Scalars['ID']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  /** The unique identifier of the entity within its graph */
  leftEdges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  localId?: Maybe<Scalars['String']['output']>;
  relevantQueries: Array<NodeQuery>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
  /** Subjectable to */
  usableIn: Array<ProtocolEventCategory>;
  views: Array<NodeQueryView>;
};


/** A Entity is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type ReagentEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


/** A Entity is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type ReagentLabelArgs = {
  full?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ReagentCategory = BaseCategory & NodeCategory & {
  __typename?: 'ReagentCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  bestQuery?: Maybe<GraphQuery>;
  /** The color of the node in the graph */
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ontology the expression belongs to. */
  graph: Graph;
  /** The height of the node in the graph */
  height?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The unique identifier of the expression within its graph */
  instanceKind: InstanceKind;
  /** The kind of expression */
  kind: ExpressionKind;
  /** The label of the expression */
  label: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  /** The x position of the node in the graph */
  positionX?: Maybe<Scalars['Float']['output']>;
  /** The y position of the node in the graph */
  positionY?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  purl?: Maybe<Scalars['String']['output']>;
  relevantNodeQueries: Array<NodeQuery>;
  relevantQueries: Array<GraphQuery>;
  /** The sequence of the expression within its graph */
  sequence?: Maybe<GraphSequence>;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The tags that are associated with the expression */
  tags: Array<Tag>;
  /** The width of the node in the graph */
  width?: Maybe<Scalars['Float']['output']>;
};


export type ReagentCategoryTagsArgs = {
  filters?: InputMaybe<TagFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ReagentCategoryDefinition = CategoryDefintion & {
  __typename?: 'ReagentCategoryDefinition';
  categoryExcludeFilters?: Maybe<Array<Scalars['ID']['output']>>;
  categoryFilters?: Maybe<Array<Scalars['ID']['output']>>;
  matches: Array<ReagentCategory>;
  tagExcludeFilters?: Maybe<Array<Scalars['ID']['output']>>;
  tagFilters?: Maybe<Array<Scalars['String']['output']>>;
};

export type ReagentCategoryFilter = {
  AND?: InputMaybe<ReagentCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ReagentCategoryFilter>;
  OR?: InputMaybe<ReagentCategoryFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  ontology?: InputMaybe<Scalars['ID']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type ReagentCategoryInput = {
  /** Whether to create a sequence if it does not exist */
  autoCreateSequence?: InputMaybe<Scalars['Boolean']['input']>;
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph this expression belongs to. If not provided, uses default ontology */
  graph: Scalars['ID']['input'];
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the sequence this category will get internal_ids from */
  sequence?: InputMaybe<Scalars['ID']['input']>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

/** Filter for entities in the graph */
export type ReagentFilter = {
  /** Filter by active status */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by list of entity categories */
  categories?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by creation date after this date */
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter by creation date before this date */
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter by list of entity IDs */
  externalIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of entity IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Search entities by text */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter by list of categorie tags */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Input type for creating a new entity */
export type ReagentInput = {
  /** An optional external ID for the entity (will upsert if exists) */
  externalId?: InputMaybe<Scalars['String']['input']>;
  /** Optional name for the entity */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the kind (LinkedExpression) to create the entity from */
  reagentCategory: Scalars['ID']['input'];
  /** Set the reagent as active */
  setActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ReagentRoleDefinition = {
  __typename?: 'ReagentRoleDefinition';
  allowMultiple: Scalars['Boolean']['output'];
  categoryDefinition: ReagentCategoryDefinition;
  currentDefault?: Maybe<Reagent>;
  description?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  needsQuantity: Scalars['Boolean']['output'];
  optional: Scalars['Boolean']['output'];
  role: Scalars['String']['output'];
};

/** Input for creating a new expression */
export type ReagentRoleDefinitionInput = {
  /** Whether this port allows multiple entities or not */
  allowMultiple?: InputMaybe<Scalars['Boolean']['input']>;
  /** The category definition for this expression */
  categoryDefinition: CategoryDefinitionInput;
  /** A detailed description of the role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The label/name of the role */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Whether this port needs a quantity or not */
  needsQuantity?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether this port is optional or not */
  optional?: InputMaybe<Scalars['Boolean']['input']>;
  /** The parameter name */
  role: Scalars['String']['input'];
  /** Whether this port allows a variable amount of entities or not */
  variableAmount?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RecordNaturalEventInput = {
  category: Scalars['ID']['input'];
  entitySources?: InputMaybe<Array<NodeMapping>>;
  entityTargets?: InputMaybe<Array<NodeMapping>>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  supportingStructure?: InputMaybe<Scalars['ID']['input']>;
  validFrom?: InputMaybe<Scalars['DateTime']['input']>;
  validTo?: InputMaybe<Scalars['DateTime']['input']>;
};

export type RecordProtocolEventInput = {
  category: Scalars['ID']['input'];
  entitySources?: InputMaybe<Array<NodeMapping>>;
  entityTargets?: InputMaybe<Array<NodeMapping>>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  reagentSources?: InputMaybe<Array<NodeMapping>>;
  reagentTargets?: InputMaybe<Array<NodeMapping>>;
  validFrom?: InputMaybe<Scalars['DateTime']['input']>;
  validTo?: InputMaybe<Scalars['DateTime']['input']>;
  variables?: InputMaybe<Array<VariableMappingInput>>;
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
  label: Scalars['String']['output'];
  left: Node;
  leftId: Scalars['String']['output'];
  right: Node;
  rightId: Scalars['String']['output'];
  /** Timestamp from when this entity is valid */
  validFrom: Scalars['DateTime']['output'];
  /** Timestamp until when this entity is valid */
  validTo: Scalars['DateTime']['output'];
};

export type RelationCategory = BaseCategory & EdgeCategory & {
  __typename?: 'RelationCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  bestQuery?: Maybe<GraphQuery>;
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ontology the expression belongs to. */
  graph: Graph;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  /** The label of the expression */
  label: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  /** The unique identifier of the expression within its graph */
  purl?: Maybe<Scalars['String']['output']>;
  relevantNodeQueries: Array<NodeQuery>;
  relevantQueries: Array<GraphQuery>;
  /** The sequence of the expression within its graph */
  sequence?: Maybe<GraphSequence>;
  /** The unique identifier of the expression within its graph */
  sourceDefinition: EntityCategoryDefinition;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The tags that are associated with the expression */
  tags: Array<Tag>;
  targetDefinition: EntityCategoryDefinition;
};


export type RelationCategoryTagsArgs = {
  filters?: InputMaybe<TagFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type RelationCategoryFilter = {
  AND?: InputMaybe<RelationCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<RelationCategoryFilter>;
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
  /** Whether to create a sequence if it does not exist */
  autoCreateSequence?: InputMaybe<Scalars['Boolean']['input']>;
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph this expression belongs to. If not provided, uses default ontology */
  graph: Scalars['ID']['input'];
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the sequence this category will get internal_ids from */
  sequence?: InputMaybe<Scalars['ID']['input']>;
  /** The source definition for this expression */
  sourceDefinition: CategoryDefinitionInput;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The target definition for this expression */
  targetDefinition: CategoryDefinitionInput;
};

/** Filter for entity relations in the graph */
export type RelationFilter = {
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of relation IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by relation kind */
  kind?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by left entity ID */
  leftId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by right entity ID */
  rightId?: InputMaybe<Scalars['ID']['input']>;
  /** Search relations by text */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Include self-relations */
  withSelf?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Input type for creating a relation between two entities */
export type RelationInput = {
  /** ID of the relation category (LinkedExpression) */
  category: Scalars['ID']['input'];
  /** The context of the measurement */
  context?: InputMaybe<ContextInput>;
  /** ID of the left entity (format: graph:id) */
  source: Scalars['ID']['input'];
  /** ID of the right entity (format: graph:id) */
  target: Scalars['ID']['input'];
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
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ScatterPlotFilter>;
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
  /** The active measurements of this entity according to the graph */
  activeMeasurements: Array<Measurement>;
  /** The best view of the node given the current context */
  bestView?: Maybe<NodeQueryView>;
  /** Protocol steps where this entity was the target */
  category: StructureCategory;
  /** The unique identifier of the entity within its graph */
  edges: Array<Edge>;
  /** The unique identifier of the entity within its graph */
  externalId?: Maybe<Scalars['String']['output']>;
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
  /** The unique identifier of the entity within its graph */
  localId?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the entity within its graph */
  measures: Array<Entity>;
  /** The expression that defines this entity's type */
  metrics: Array<Metric>;
  /** The expression that defines this entity's type */
  object: Scalars['String']['output'];
  relevantQueries: Array<NodeQuery>;
  /** The unique identifier of the entity within its graph */
  rightEdges: Array<Edge>;
  views: Array<NodeQueryView>;
};


/** A Structure is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type StructureEdgesArgs = {
  filter?: InputMaybe<EntityRelationFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
};


/** A Structure is a recorded data point in a graph. It can measure a property of an entity through a direct measurement edge, that connects the entity to the structure. It of course can relate to other structures through relation edges. */
export type StructureLabelArgs = {
  full?: InputMaybe<Scalars['Boolean']['input']>;
};

export type StructureCategory = BaseCategory & NodeCategory & {
  __typename?: 'StructureCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  bestQuery?: Maybe<GraphQuery>;
  /** The color of the node in the graph */
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ontology the expression belongs to. */
  graph: Graph;
  /** The height of the node in the graph */
  height?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The structure that this class represents */
  identifier: Scalars['String']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  pinned: Scalars['Boolean']['output'];
  /** The x position of the node in the graph */
  positionX?: Maybe<Scalars['Float']['output']>;
  /** The y position of the node in the graph */
  positionY?: Maybe<Scalars['Float']['output']>;
  /** The unique identifier of the expression within its graph */
  purl?: Maybe<Scalars['String']['output']>;
  relevantNodeQueries: Array<NodeQuery>;
  relevantQueries: Array<GraphQuery>;
  /** The sequence of the expression within its graph */
  sequence?: Maybe<GraphSequence>;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The tags that are associated with the expression */
  tags: Array<Tag>;
  /** The width of the node in the graph */
  width?: Maybe<Scalars['Float']['output']>;
};


export type StructureCategoryTagsArgs = {
  filters?: InputMaybe<TagFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type StructureCategoryDefinition = CategoryDefintion & {
  __typename?: 'StructureCategoryDefinition';
  categoryExcludeFilters?: Maybe<Array<Scalars['ID']['output']>>;
  categoryFilters?: Maybe<Array<Scalars['ID']['output']>>;
  matches: Array<StructureCategory>;
  tagExcludeFilters?: Maybe<Array<Scalars['ID']['output']>>;
  tagFilters?: Maybe<Array<Scalars['String']['output']>>;
};

export type StructureCategoryFilter = {
  AND?: InputMaybe<StructureCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<StructureCategoryFilter>;
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
  /** Whether to create a sequence if it does not exist */
  autoCreateSequence?: InputMaybe<Scalars['Boolean']['input']>;
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph this expression belongs to. If not provided, uses default ontology */
  graph: Scalars['ID']['input'];
  /** The label/name of the expression */
  identifier: Scalars['StructureIdentifier']['input'];
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['RemoteUpload']['input']>;
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the sequence this category will get internal_ids from */
  sequence?: InputMaybe<Scalars['ID']['input']>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Filter for entity relations in the graph */
export type StructureFilter = {
  /** Filter by graph ID */
  graph?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of relation IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by relation kind */
  kind?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by linked expression ID */
  linkedExpression?: InputMaybe<Scalars['ID']['input']>;
  /** Search relations by text */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type StructureInput = {
  /** The context of the measurement */
  context?: InputMaybe<ContextInput>;
  graph: Scalars['ID']['input'];
  structure: Scalars['StructureString']['input'];
};

/**
 * A relation is an edge between two entities. It is a directed edge, that connects two entities and established a relationship
 *                  that is not a measurement between them. I.e. when they are an subjective assertion about the entities.
 *
 *
 *
 *
 */
export type StructureRelation = Edge & {
  __typename?: 'StructureRelation';
  category: StructureRelationCategory;
  /** When this entity was created */
  createdAt: Scalars['DateTime']['output'];
  /** The unique identifier of the entity within its graph */
  id: Scalars['NodeID']['output'];
  label: Scalars['String']['output'];
  left: Node;
  leftId: Scalars['String']['output'];
  right: Node;
  rightId: Scalars['String']['output'];
  /** Timestamp from when this entity is valid */
  validFrom: Scalars['DateTime']['output'];
  /** Timestamp until when this entity is valid */
  validTo: Scalars['DateTime']['output'];
};

export type StructureRelationCategory = BaseCategory & EdgeCategory & {
  __typename?: 'StructureRelationCategory';
  /** The unique identifier of the expression within its graph */
  ageName: Scalars['String']['output'];
  bestQuery?: Maybe<GraphQuery>;
  color?: Maybe<Array<Scalars['Float']['output']>>;
  /** A description of the expression. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ontology the expression belongs to. */
  graph: Graph;
  /** The unique identifier of the expression within its graph */
  id: Scalars['ID']['output'];
  /** The kind of expression */
  kind: ExpressionKind;
  /** The label of the expression */
  label: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  /** The unique identifier of the expression within its graph */
  purl?: Maybe<Scalars['String']['output']>;
  relevantNodeQueries: Array<NodeQuery>;
  relevantQueries: Array<GraphQuery>;
  /** The sequence of the expression within its graph */
  sequence?: Maybe<GraphSequence>;
  /** The unique identifier of the expression within its graph */
  sourceDefinition: StructureCategoryDefinition;
  /** An image or other media file that can be used to represent the expression. */
  store?: Maybe<MediaStore>;
  /** The tags that are associated with the expression */
  tags: Array<Tag>;
  targetDefinition: StructureCategoryDefinition;
};


export type StructureRelationCategoryTagsArgs = {
  filters?: InputMaybe<TagFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type StructureRelationCategoryFilter = {
  AND?: InputMaybe<StructureRelationCategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<StructureRelationCategoryFilter>;
  OR?: InputMaybe<StructureRelationCategoryFilter>;
  graph?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  ontology?: InputMaybe<Scalars['ID']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sourceIdentifier?: InputMaybe<Scalars['String']['input']>;
  targetIdentifier?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new expression */
export type StructureRelationCategoryInput = {
  /** Whether to create a sequence if it does not exist */
  autoCreateSequence?: InputMaybe<Scalars['Boolean']['input']>;
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the graph this expression belongs to. If not provided, uses default ontology */
  graph: Scalars['ID']['input'];
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The label/name of the expression */
  label: Scalars['String']['input'];
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the sequence this category will get internal_ids from */
  sequence?: InputMaybe<Scalars['ID']['input']>;
  /** The source definition for this expression */
  sourceDefinition: CategoryDefinitionInput;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The target definition for this expression */
  targetDefinition: CategoryDefinitionInput;
};

/** Input type for creating a relation between two entities */
export type StructureRelationInput = {
  /** ID of the relation category (LinkedExpression) */
  category: Scalars['ID']['input'];
  /** The context of the measurement */
  context?: InputMaybe<ContextInput>;
  /** ID of the left entity (format: graph:id) */
  source: Scalars['ID']['input'];
  /** ID of the right entity (format: graph:id) */
  target: Scalars['ID']['input'];
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

/** A tag is a label that can be assigned to entities and relations. */
export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export type TagFilter = {
  AND?: InputMaybe<TagFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<TagFilter>;
  OR?: InputMaybe<TagFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by list of IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** Search by text */
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Input type for creating a new entity */
export type ToldYouSoInput = {
  /** The context of the measurement */
  context?: InputMaybe<ContextInput>;
  /** An optional external ID for the entity (will upsert if exists) */
  externalId?: InputMaybe<Scalars['String']['input']>;
  /** Optional name for the entity */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The reason why you made this assumption */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** The start date of the measurement */
  validFrom?: InputMaybe<Scalars['String']['input']>;
  /** The end date of the measurement */
  validTo?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an existing generic category */
export type UpdateEntityCategoryInput = {
  /** New RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** New description for the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** The ID of the expression to update */
  id: Scalars['ID']['input'];
  /** New image ID for the expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** New label for the generic category */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** New permanent URL for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

/** Input type for updating an existing ontology */
export type UpdateGraphInput = {
  /** New description for the ontology */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the ontology to update */
  id: Scalars['ID']['input'];
  /** New ID reference to an associated image */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** New name for the ontology (will be converted to snake_case) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** New nodes for the ontology */
  nodes?: InputMaybe<Array<GraphNodeInput>>;
  /** Whether this ontology should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** A new PURL for the ontology (will be converted to snake_case) */
  purl?: InputMaybe<Scalars['String']['input']>;
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

/** Input for updating an existing expression */
export type UpdateMetricCategoryInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The type of metric data this expression represents */
  kind?: InputMaybe<MetricKind>;
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The structure category for this expression */
  structureDefinition?: InputMaybe<CategoryDefinitionInput>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

/** Input for updating an existing expression */
export type UpdateNaturalEventCategoryInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** The ID of the expression to update */
  id: Scalars['ID']['input'];
  /** An optional ID reference to an associated image */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The label/name of the expression */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** A list of children for the plate */
  plateChildren?: InputMaybe<Array<PlateChildInput>>;
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The source definitions for this expression */
  sourceEntityRoles?: InputMaybe<Array<EntityRoleDefinitionInput>>;
  /** The support definition for this expression */
  supportDefinition?: InputMaybe<CategoryDefinitionInput>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The target definitions for this expression */
  targetEntityRoles?: InputMaybe<Array<EntityRoleDefinitionInput>>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

/** Input for updating an existing expression */
export type UpdateProtocolEventCategoryInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** The ID of the expression to update */
  id: Scalars['ID']['input'];
  /** An optional ID reference to an associated image */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** The label/name of the expression */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** A list of children for the plate */
  plateChildren?: InputMaybe<Array<PlateChildInput>>;
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** The source definitions for this expression */
  sourceEntityRoles?: InputMaybe<Array<EntityRoleDefinitionInput>>;
  /** The target definitions for this expression */
  sourceReagentRoles?: InputMaybe<Array<ReagentRoleDefinitionInput>>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The target definitions for this expression */
  targetEntityRoles?: InputMaybe<Array<EntityRoleDefinitionInput>>;
  /** The target definitions for this expression */
  targetReagentRoles?: InputMaybe<Array<ReagentRoleDefinitionInput>>;
  /** The variable definitions for this expression */
  variableDefinitions?: InputMaybe<Array<VariableDefinitionInput>>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

/** Input for updating an existing generic category */
export type UpdateReagentCategoryInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional height for the ontology node */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** The ID of the expression to update */
  id: Scalars['ID']['input'];
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** An optional x position for the ontology node */
  positionX?: InputMaybe<Scalars['Float']['input']>;
  /** An optional y position for the ontology node */
  positionY?: InputMaybe<Scalars['Float']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** An optional width for the ontology node */
  width?: InputMaybe<Scalars['Float']['input']>;
};

/** Input for updating an existing expression */
export type UpdateRelationCategoryInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** New label for the expression */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Input for updating an existing expression */
export type UpdateStructureCategoryInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the expression to update */
  id: Scalars['ID']['input'];
  /** The label/name of the expression */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Input for updating an existing expression */
export type UpdateStructureRelationCategoryInput = {
  /** RGBA color values as list of 3 or 4 integers */
  color?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** A detailed description of the expression */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional image associated with this expression */
  image?: InputMaybe<Scalars['ID']['input']>;
  /** New label for the expression */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Whether this expression should be pinned or not */
  pin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Permanent URL identifier for the expression */
  purl?: InputMaybe<Scalars['String']['input']>;
  /** A list of tags associated with this expression */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type VariableDefinition = {
  __typename?: 'VariableDefinition';
  default?: Maybe<Scalars['Any']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  needsQuantity: Scalars['Boolean']['output'];
  optional: Scalars['Boolean']['output'];
  options?: Maybe<Array<VariableOption>>;
  param: Scalars['String']['output'];
  valueKind: MetricKind;
};

/** Input for creating a new expression */
export type VariableDefinitionInput = {
  /** The default value for this port */
  default?: InputMaybe<Scalars['Any']['input']>;
  /** A detailed description of the role */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The label/name of the role */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Whether this port is optional or not */
  optional?: InputMaybe<Scalars['Boolean']['input']>;
  /** A list of options for this port (if only a few values are allowed) */
  options?: InputMaybe<Array<OptionInput>>;
  /** The parameter name */
  param: Scalars['String']['input'];
  /** The type of metric data this expression represents */
  valueKind: MetricKind;
};

export type VariableMapping = {
  __typename?: 'VariableMapping';
  role: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type VariableMappingInput = {
  key: Scalars['String']['input'];
  value: Scalars['Any']['input'];
};

export type VariableOption = {
  __typename?: 'VariableOption';
  description?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export enum ViewKind {
  EdgeList = 'EDGE_LIST',
  FloatMetric = 'FLOAT_METRIC',
  IntMetric = 'INT_METRIC',
  NodeList = 'NODE_LIST',
  Pairs = 'PAIRS',
  Path = 'PATH',
  Table = 'TABLE'
}

type BaseCategory_EntityCategory_Fragment = { __typename?: 'EntityCategory', id: string, purl?: string | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', id: string, purl?: string | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseCategory_MetricCategory_Fragment = { __typename?: 'MetricCategory', id: string, purl?: string | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseCategory_NaturalEventCategory_Fragment = { __typename?: 'NaturalEventCategory', id: string, purl?: string | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseCategory_ProtocolEventCategory_Fragment = { __typename?: 'ProtocolEventCategory', id: string, purl?: string | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseCategory_ReagentCategory_Fragment = { __typename?: 'ReagentCategory', id: string, purl?: string | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string, purl?: string | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string, purl?: string | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseCategory_StructureRelationCategory_Fragment = { __typename?: 'StructureRelationCategory', id: string, purl?: string | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type BaseCategoryFragment = BaseCategory_EntityCategory_Fragment | BaseCategory_MeasurementCategory_Fragment | BaseCategory_MetricCategory_Fragment | BaseCategory_NaturalEventCategory_Fragment | BaseCategory_ProtocolEventCategory_Fragment | BaseCategory_ReagentCategory_Fragment | BaseCategory_RelationCategory_Fragment | BaseCategory_StructureCategory_Fragment | BaseCategory_StructureRelationCategory_Fragment;

type BaseNodeCategory_EntityCategory_Fragment = { __typename?: 'EntityCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

type BaseNodeCategory_MetricCategory_Fragment = { __typename?: 'MetricCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

type BaseNodeCategory_NaturalEventCategory_Fragment = { __typename?: 'NaturalEventCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

type BaseNodeCategory_ProtocolEventCategory_Fragment = { __typename?: 'ProtocolEventCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

type BaseNodeCategory_ReagentCategory_Fragment = { __typename?: 'ReagentCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

type BaseNodeCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

export type BaseNodeCategoryFragment = BaseNodeCategory_EntityCategory_Fragment | BaseNodeCategory_MetricCategory_Fragment | BaseNodeCategory_NaturalEventCategory_Fragment | BaseNodeCategory_ProtocolEventCategory_Fragment | BaseNodeCategory_ReagentCategory_Fragment | BaseNodeCategory_StructureCategory_Fragment;

type BaseEdgeCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', id: string };

type BaseEdgeCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string };

type BaseEdgeCategory_StructureRelationCategory_Fragment = { __typename?: 'StructureRelationCategory', id: string };

export type BaseEdgeCategoryFragment = BaseEdgeCategory_MeasurementCategory_Fragment | BaseEdgeCategory_RelationCategory_Fragment | BaseEdgeCategory_StructureRelationCategory_Fragment;

type NodeCategory_EntityCategory_Fragment = { __typename?: 'EntityCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type NodeCategory_MetricCategory_Fragment = { __typename?: 'MetricCategory', ageName: string, label: string, metricKind: MetricKind, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type NodeCategory_NaturalEventCategory_Fragment = { __typename?: 'NaturalEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type NodeCategory_ProtocolEventCategory_Fragment = { __typename?: 'ProtocolEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, variableDefinitions: Array<{ __typename?: 'VariableDefinition', param: string, valueKind: MetricKind, default?: any | null, optional: boolean, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type NodeCategory_ReagentCategory_Fragment = { __typename?: 'ReagentCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type NodeCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type NodeCategoryFragment = NodeCategory_EntityCategory_Fragment | NodeCategory_MetricCategory_Fragment | NodeCategory_NaturalEventCategory_Fragment | NodeCategory_ProtocolEventCategory_Fragment | NodeCategory_ReagentCategory_Fragment | NodeCategory_StructureCategory_Fragment;

type BaseNode_Entity_Fragment = { __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseNode_Metric_Fragment = { __typename?: 'Metric', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseNode_NaturalEvent_Fragment = { __typename?: 'NaturalEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseNode_ProtocolEvent_Fragment = { __typename?: 'ProtocolEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseNode_Reagent_Fragment = { __typename?: 'Reagent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type BaseNode_Structure_Fragment = { __typename?: 'Structure', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type BaseNodeFragment = BaseNode_Entity_Fragment | BaseNode_Metric_Fragment | BaseNode_NaturalEvent_Fragment | BaseNode_ProtocolEvent_Fragment | BaseNode_Reagent_Fragment | BaseNode_Structure_Fragment;

type Node_Entity_Fragment = { __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }> };

type Node_Metric_Fragment = { __typename?: 'Metric', id: any, label: string, value: number, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'MetricCategory', id: string, label: string } };

type Node_NaturalEvent_Fragment = { __typename?: 'NaturalEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type Node_ProtocolEvent_Fragment = { __typename?: 'ProtocolEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type Node_Reagent_Fragment = { __typename?: 'Reagent', id: any, label: string, externalId?: string | null, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'ReagentCategory', id: string, label: string }, usableIn: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, createableFrom: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }> };

type Node_Structure_Fragment = { __typename?: 'Structure', id: any, label: string, object: string, identifier: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null } };

export type NodeFragment = Node_Entity_Fragment | Node_Metric_Fragment | Node_NaturalEvent_Fragment | Node_ProtocolEvent_Fragment | Node_Reagent_Fragment | Node_Structure_Fragment;

type DetailNode_Entity_Fragment = { __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }> };

type DetailNode_Metric_Fragment = { __typename?: 'Metric', id: any, label: string, value: number, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'MetricCategory', id: string, label: string } };

type DetailNode_NaturalEvent_Fragment = { __typename?: 'NaturalEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type DetailNode_ProtocolEvent_Fragment = { __typename?: 'ProtocolEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

type DetailNode_Reagent_Fragment = { __typename?: 'Reagent', id: any, label: string, externalId?: string | null, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'ReagentCategory', id: string, label: string }, usableIn: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, createableFrom: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }> };

type DetailNode_Structure_Fragment = { __typename?: 'Structure', id: any, label: string, object: string, identifier: string, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null } };

export type DetailNodeFragment = DetailNode_Entity_Fragment | DetailNode_Metric_Fragment | DetailNode_NaturalEvent_Fragment | DetailNode_ProtocolEvent_Fragment | DetailNode_Reagent_Fragment | DetailNode_Structure_Fragment;

type PathNode_Entity_Fragment = { __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

type PathNode_Metric_Fragment = { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

type PathNode_NaturalEvent_Fragment = { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

type PathNode_ProtocolEvent_Fragment = { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

type PathNode_Reagent_Fragment = { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

type PathNode_Structure_Fragment = { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type PathNodeFragment = PathNode_Entity_Fragment | PathNode_Metric_Fragment | PathNode_NaturalEvent_Fragment | PathNode_ProtocolEvent_Fragment | PathNode_Reagent_Fragment | PathNode_Structure_Fragment;

export type PresignedPostCredentialsFragment = { __typename?: 'PresignedPostCredentials', key: string, xAmzCredential: string, xAmzAlgorithm: string, xAmzDate: string, xAmzSignature: string, policy: string, datalayer: string, bucket: string, store: string };

export type PathDescriptionFragment = { __typename?: 'Description', leftId: string, rightId: string };

type BaseEdge_Description_Fragment = { __typename?: 'Description', id: any, leftId: string, rightId: string };

type BaseEdge_Measurement_Fragment = { __typename?: 'Measurement', id: any, leftId: string, rightId: string };

type BaseEdge_Participant_Fragment = { __typename?: 'Participant', id: any, leftId: string, rightId: string };

type BaseEdge_Relation_Fragment = { __typename?: 'Relation', id: any, leftId: string, rightId: string };

type BaseEdge_StructureRelation_Fragment = { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string };

export type BaseEdgeFragment = BaseEdge_Description_Fragment | BaseEdge_Measurement_Fragment | BaseEdge_Participant_Fragment | BaseEdge_Relation_Fragment | BaseEdge_StructureRelation_Fragment;

export type MeasurementFragment = { __typename?: 'Measurement', validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } };

export type RelationFragment = { __typename?: 'Relation', category: { __typename?: 'RelationCategory', id: string, label: string } };

export type StructureRelationFragment = { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string, left: { __typename?: 'Entity', id: any, label: string } | { __typename?: 'Metric', id: any, label: string } | { __typename?: 'NaturalEvent', id: any, label: string } | { __typename?: 'ProtocolEvent', id: any, label: string } | { __typename?: 'Reagent', id: any, label: string } | { __typename?: 'Structure', id: any, label: string }, right: { __typename?: 'Entity', id: any, label: string } | { __typename?: 'Metric', id: any, label: string } | { __typename?: 'NaturalEvent', id: any, label: string } | { __typename?: 'ProtocolEvent', id: any, label: string } | { __typename?: 'Reagent', id: any, label: string } | { __typename?: 'Structure', id: any, label: string } };

export type ParticipantFragment = { __typename?: 'Participant', role: string, quantity?: number | null };

type Edge_Description_Fragment = { __typename?: 'Description', id: any, leftId: string, rightId: string };

type Edge_Measurement_Fragment = { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } };

type Edge_Participant_Fragment = { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null };

type Edge_Relation_Fragment = { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } };

type Edge_StructureRelation_Fragment = { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string };

export type EdgeFragment = Edge_Description_Fragment | Edge_Measurement_Fragment | Edge_Participant_Fragment | Edge_Relation_Fragment | Edge_StructureRelation_Fragment;

type PathEdge_Description_Fragment = { __typename?: 'Description', leftId: string, rightId: string };

type PathEdge_Measurement_Fragment = { __typename?: 'Measurement', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'MeasurementCategory', id: string, label: string } };

type PathEdge_Participant_Fragment = { __typename?: 'Participant', role: string, leftId: string, rightId: string };

type PathEdge_Relation_Fragment = { __typename?: 'Relation', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } };

type PathEdge_StructureRelation_Fragment = { __typename?: 'StructureRelation' };

export type PathEdgeFragment = PathEdge_Description_Fragment | PathEdge_Measurement_Fragment | PathEdge_Participant_Fragment | PathEdge_Relation_Fragment | PathEdge_StructureRelation_Fragment;

export type EntityFragment = { __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type PathEntityFragment = { __typename?: 'Entity', externalId?: string | null, id: any, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type ListEntityFragment = { __typename?: 'Entity', id: any, label: string, category: { __typename?: 'EntityCategory', id: string, label: string } };

export type EntityCategoryFragment = { __typename?: 'EntityCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListEntityCategoryFragment = { __typename?: 'EntityCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

export type GraphFragment = { __typename?: 'Graph', id: string, name: string, description?: string | null, pinned: boolean, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> }>, entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, metricCategories: Array<{ __typename?: 'MetricCategory', label: string, metricKind: MetricKind, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, structureDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, reagentCategories: Array<{ __typename?: 'ReagentCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } }>, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }> } | { __typename?: 'Metric', id: any, label: string, value: number, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'MetricCategory', id: string, label: string } } | { __typename?: 'NaturalEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'ProtocolEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'Reagent', id: any, label: string, externalId?: string | null, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'ReagentCategory', id: string, label: string }, usableIn: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, createableFrom: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }> } | { __typename?: 'Structure', id: any, label: string, object: string, identifier: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null } }> };

export type ListGraphFragment = { __typename?: 'Graph', id: string, name: string, description?: string | null, pinned: boolean };

export type GraphQueryFragment = { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } };

export type ListGraphQueryFragment = { __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean };

type BaseListCategory_EntityCategory_Fragment = { __typename?: 'EntityCategory', id: string, description?: string | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

type BaseListCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', id: string, description?: string | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

type BaseListCategory_MetricCategory_Fragment = { __typename?: 'MetricCategory', id: string, description?: string | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

type BaseListCategory_NaturalEventCategory_Fragment = { __typename?: 'NaturalEventCategory', id: string, description?: string | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

type BaseListCategory_ProtocolEventCategory_Fragment = { __typename?: 'ProtocolEventCategory', id: string, description?: string | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

type BaseListCategory_ReagentCategory_Fragment = { __typename?: 'ReagentCategory', id: string, description?: string | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

type BaseListCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string, description?: string | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

type BaseListCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string, description?: string | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

type BaseListCategory_StructureRelationCategory_Fragment = { __typename?: 'StructureRelationCategory', id: string, description?: string | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

export type BaseListCategoryFragment = BaseListCategory_EntityCategory_Fragment | BaseListCategory_MeasurementCategory_Fragment | BaseListCategory_MetricCategory_Fragment | BaseListCategory_NaturalEventCategory_Fragment | BaseListCategory_ProtocolEventCategory_Fragment | BaseListCategory_ReagentCategory_Fragment | BaseListCategory_RelationCategory_Fragment | BaseListCategory_StructureCategory_Fragment | BaseListCategory_StructureRelationCategory_Fragment;

type BaseListNodeCategory_EntityCategory_Fragment = { __typename?: 'EntityCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

type BaseListNodeCategory_MetricCategory_Fragment = { __typename?: 'MetricCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

type BaseListNodeCategory_NaturalEventCategory_Fragment = { __typename?: 'NaturalEventCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

type BaseListNodeCategory_ProtocolEventCategory_Fragment = { __typename?: 'ProtocolEventCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

type BaseListNodeCategory_ReagentCategory_Fragment = { __typename?: 'ReagentCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

type BaseListNodeCategory_StructureCategory_Fragment = { __typename?: 'StructureCategory', id: string, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null };

export type BaseListNodeCategoryFragment = BaseListNodeCategory_EntityCategory_Fragment | BaseListNodeCategory_MetricCategory_Fragment | BaseListNodeCategory_NaturalEventCategory_Fragment | BaseListNodeCategory_ProtocolEventCategory_Fragment | BaseListNodeCategory_ReagentCategory_Fragment | BaseListNodeCategory_StructureCategory_Fragment;

type BaseListEdgeCategory_MeasurementCategory_Fragment = { __typename?: 'MeasurementCategory', id: string };

type BaseListEdgeCategory_RelationCategory_Fragment = { __typename?: 'RelationCategory', id: string };

type BaseListEdgeCategory_StructureRelationCategory_Fragment = { __typename?: 'StructureRelationCategory', id: string };

export type BaseListEdgeCategoryFragment = BaseListEdgeCategory_MeasurementCategory_Fragment | BaseListEdgeCategory_RelationCategory_Fragment | BaseListEdgeCategory_StructureRelationCategory_Fragment;

export type MeasurementCategoryFragment = { __typename?: 'MeasurementCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListMeasurementCategoryFragment = { __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

export type PathMeasurementFragment = { __typename?: 'Measurement', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'MeasurementCategory', id: string, label: string } };

export type MetricFragment = { __typename?: 'Metric', id: any, value: number, category: { __typename?: 'MetricCategory', id: string, label: string } };

export type ListMetricFragment = { __typename?: 'Metric', id: any, value: number, label: string };

export type PathMetricFragment = { __typename?: 'Metric', value: number, id: any, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type MetricCategoryFragment = { __typename?: 'MetricCategory', ageName: string, label: string, metricKind: MetricKind, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListMetricCategoryFragment = { __typename?: 'MetricCategory', label: string, metricKind: MetricKind, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, structureDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

export type ModelFragment = { __typename?: 'Model', id: string, name: string, store?: { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string } | null };

export type NaturalEventFragment = { __typename?: 'NaturalEvent', id: any, label: string, validFrom?: any | null, validTo?: any | null, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListNaturalEventFragment = { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string } };

export type PathNaturalEventFragment = { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type NaturalEventCategoryFragment = { __typename?: 'NaturalEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListNaturalEventCategoryFragment = { __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

export type NodeQueryFragment = { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } };

export type ListNodeQueryFragment = { __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean };

export type NodeQueryViewFragment = { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } };

export type PairsFragment = { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> };

export type PathParticipantFragment = { __typename?: 'Participant', role: string, leftId: string, rightId: string };

export type PathFragment = { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> };

export type ProtocolEventFragment = { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, label: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string, plateChildren?: Array<any> | null }, leftEdges: Array<{ __typename?: 'Description', leftId: string, rightId: string } | { __typename?: 'Measurement', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', role: string, leftId: string, rightId: string } | { __typename?: 'Relation', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation' }>, rightEdges: Array<{ __typename?: 'Description', leftId: string, rightId: string } | { __typename?: 'Measurement', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', role: string, leftId: string, rightId: string } | { __typename?: 'Relation', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation' }>, variables: Array<{ __typename?: 'VariableMapping', role: string, value: string }>, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListProtocolEventFragment = { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string } };

export type PathProtocolEventFragment = { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type ProtocolEventCategoryFragment = { __typename?: 'ProtocolEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, variableDefinitions: Array<{ __typename?: 'VariableDefinition', param: string, valueKind: MetricKind, default?: any | null, optional: boolean, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListProtocolEventCategoryFragment = { __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

export type ReagentFragment = { __typename?: 'Reagent', id: any, label: string, externalId?: string | null, category: { __typename?: 'ReagentCategory', id: string, label: string }, usableIn: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, createableFrom: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }> };

export type PathReagentFragment = { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type ListReagentFragment = { __typename?: 'Reagent', id: any, label: string };

export type ReagentCategoryFragment = { __typename?: 'ReagentCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListReagentCategoryFragment = { __typename?: 'ReagentCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

export type PathRelationFragment = { __typename?: 'Relation', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } };

export type RelationCategoryFragment = { __typename?: 'RelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListRelationCategoryFragment = { __typename?: 'RelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

export type EntityCategoryDefinitionFragment = { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null };

export type EntityRoleDefinitionFragment = { __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null };

export type ReagentCategoryDefinitionFragment = { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null };

export type ReagentRoleDefinitionFragment = { __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null };

export type VariableDefinitionFragment = { __typename?: 'VariableDefinition', param: string, valueKind: MetricKind, default?: any | null, optional: boolean, description?: string | null, label?: string | null };

export type ScatterPlotFragment = { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string };

export type ListScatterPlotFragment = { __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string };

export type MediaStoreFragment = { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string };

export type StructureFragment = { __typename?: 'Structure', id: any, object: string, identifier: string, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListStructureFragment = { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string } };

export type PathStructureFragment = { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } };

export type InformedStructureFragment = { __typename?: 'Structure', id: any, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string }, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type StructureCategoryFragment = { __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListStructureCategoryFragment = { __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type StructureRelationCategoryFragment = { __typename?: 'StructureRelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListStructureRelationCategoryFragment = { __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

export type ListStructureRelationCategoryWithGraphFragment = { __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string, description?: string | null }, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> };

export type ColumnFragment = { __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null };

export type TableFragment = { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> };

export type CreateMetricCategoryMutationVariables = Exact<{
  input: MetricCategoryInput;
}>;


export type CreateMetricCategoryMutation = { __typename?: 'Mutation', createMetricCategory: { __typename?: 'MetricCategory', ageName: string, label: string, metricKind: MetricKind, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type CreateReagentCategoryMutationVariables = Exact<{
  input: ReagentCategoryInput;
}>;


export type CreateReagentCategoryMutation = { __typename?: 'Mutation', createReagentCategory: { __typename?: 'ReagentCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type CreateEntityMutationVariables = Exact<{
  input: EntityInput;
}>;


export type CreateEntityMutation = { __typename?: 'Mutation', createEntity: { __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type CreateEntityCategoryMutationVariables = Exact<{
  input: EntityCategoryInput;
}>;


export type CreateEntityCategoryMutation = { __typename?: 'Mutation', createEntityCategory: { __typename?: 'EntityCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type UpdateEntityCategoryMutationVariables = Exact<{
  input: UpdateEntityCategoryInput;
}>;


export type UpdateEntityCategoryMutation = { __typename?: 'Mutation', updateEntityCategory: { __typename?: 'EntityCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type DeleteEntityCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteEntityCategoryMutation = { __typename?: 'Mutation', deleteEntityCategory: string };

export type CreateGraphMutationVariables = Exact<{
  input: GraphInput;
}>;


export type CreateGraphMutation = { __typename?: 'Mutation', createGraph: { __typename?: 'Graph', id: string, name: string, description?: string | null, pinned: boolean, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> }>, entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, metricCategories: Array<{ __typename?: 'MetricCategory', label: string, metricKind: MetricKind, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, structureDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, reagentCategories: Array<{ __typename?: 'ReagentCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } }>, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }> } | { __typename?: 'Metric', id: any, label: string, value: number, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'MetricCategory', id: string, label: string } } | { __typename?: 'NaturalEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'ProtocolEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'Reagent', id: any, label: string, externalId?: string | null, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'ReagentCategory', id: string, label: string }, usableIn: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, createableFrom: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }> } | { __typename?: 'Structure', id: any, label: string, object: string, identifier: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null } }> } };

export type PinGraphMutationVariables = Exact<{
  input: PinGraphInput;
}>;


export type PinGraphMutation = { __typename?: 'Mutation', pinGraph: { __typename?: 'Graph', id: string, name: string, description?: string | null, pinned: boolean, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> }>, entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, metricCategories: Array<{ __typename?: 'MetricCategory', label: string, metricKind: MetricKind, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, structureDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, reagentCategories: Array<{ __typename?: 'ReagentCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } }>, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }> } | { __typename?: 'Metric', id: any, label: string, value: number, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'MetricCategory', id: string, label: string } } | { __typename?: 'NaturalEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'ProtocolEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'Reagent', id: any, label: string, externalId?: string | null, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'ReagentCategory', id: string, label: string }, usableIn: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, createableFrom: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }> } | { __typename?: 'Structure', id: any, label: string, object: string, identifier: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null } }> } };

export type DeleteGraphMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteGraphMutation = { __typename?: 'Mutation', deleteGraph: string };

export type UpdateGraphMutationVariables = Exact<{
  input: UpdateGraphInput;
}>;


export type UpdateGraphMutation = { __typename?: 'Mutation', updateGraph: { __typename?: 'Graph', id: string, name: string, description?: string | null, pinned: boolean, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> }>, entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, metricCategories: Array<{ __typename?: 'MetricCategory', label: string, metricKind: MetricKind, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, structureDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, reagentCategories: Array<{ __typename?: 'ReagentCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } }>, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }> } | { __typename?: 'Metric', id: any, label: string, value: number, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'MetricCategory', id: string, label: string } } | { __typename?: 'NaturalEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'ProtocolEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'Reagent', id: any, label: string, externalId?: string | null, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'ReagentCategory', id: string, label: string }, usableIn: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, createableFrom: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }> } | { __typename?: 'Structure', id: any, label: string, object: string, identifier: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null } }> } };

export type CreateGraphQueryMutationVariables = Exact<{
  input: GraphQueryInput;
}>;


export type CreateGraphQueryMutation = { __typename?: 'Mutation', createGraphQuery: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } };

export type PinGraphQueryMutationVariables = Exact<{
  input: PinGraphQueryInput;
}>;


export type PinGraphQueryMutation = { __typename?: 'Mutation', pinGraphQuery: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } };

export type CreateMeasurementMutationVariables = Exact<{
  input: MeasurementInput;
}>;


export type CreateMeasurementMutation = { __typename?: 'Mutation', createMeasurement: { __typename?: 'Measurement', validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } };

export type CreateMeasurementCategoryMutationVariables = Exact<{
  input: MeasurementCategoryInput;
}>;


export type CreateMeasurementCategoryMutation = { __typename?: 'Mutation', createMeasurementCategory: { __typename?: 'MeasurementCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type UpdateMeasurementCategoryMutationVariables = Exact<{
  input: UpdateMeasurementCategoryInput;
}>;


export type UpdateMeasurementCategoryMutation = { __typename?: 'Mutation', updateMeasurementCategory: { __typename?: 'MeasurementCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type DeleteMeasurementCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMeasurementCategoryMutation = { __typename?: 'Mutation', deleteMeasurementCategory: string };

export type CreateMetricMutationVariables = Exact<{
  input: MetricInput;
}>;


export type CreateMetricMutation = { __typename?: 'Mutation', createMetric: { __typename?: 'Metric', id: any, value: number, category: { __typename?: 'MetricCategory', id: string, label: string } } };

export type UpdateMetricCategoryMutationVariables = Exact<{
  input: UpdateMetricCategoryInput;
}>;


export type UpdateMetricCategoryMutation = { __typename?: 'Mutation', updateMetricCategory: { __typename?: 'MetricCategory', ageName: string, label: string, metricKind: MetricKind, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type DeleteMetricCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMetricCategoryMutation = { __typename?: 'Mutation', deleteMetricCategory: string };

export type CreateModelMutationVariables = Exact<{
  input: CreateModelInput;
}>;


export type CreateModelMutation = { __typename?: 'Mutation', createModel: { __typename?: 'Model', id: string, name: string, store?: { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string } | null } };

export type RecordNaturalEventMutationVariables = Exact<{
  input: RecordNaturalEventInput;
}>;


export type RecordNaturalEventMutation = { __typename?: 'Mutation', recordNaturalEvent: { __typename?: 'NaturalEvent', id: any, label: string, validFrom?: any | null, validTo?: any | null, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type CreateNaturalEventCategoryMutationVariables = Exact<{
  input: NaturalEventCategoryInput;
}>;


export type CreateNaturalEventCategoryMutation = { __typename?: 'Mutation', createNaturalEventCategory: { __typename?: 'NaturalEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type UpdateNaturalEventCategoryMutationVariables = Exact<{
  input: UpdateNaturalEventCategoryInput;
}>;


export type UpdateNaturalEventCategoryMutation = { __typename?: 'Mutation', updateNaturalEventCategory: { __typename?: 'NaturalEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type DeleteNaturalEventCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteNaturalEventCategoryMutation = { __typename?: 'Mutation', deleteNaturalEventCategory: string };

export type CreateNodeQueryMutationVariables = Exact<{
  input: NodeQueryInput;
}>;


export type CreateNodeQueryMutation = { __typename?: 'Mutation', createNodeQuery: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } } };

export type PinNodeQueryMutationVariables = Exact<{
  input: PinNodeQueryInput;
}>;


export type PinNodeQueryMutation = { __typename?: 'Mutation', pinNodeQuery: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } } };

export type RecordProtocolEventMutationVariables = Exact<{
  input: RecordProtocolEventInput;
}>;


export type RecordProtocolEventMutation = { __typename?: 'Mutation', recordProtocolEvent: { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, label: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string, plateChildren?: Array<any> | null }, leftEdges: Array<{ __typename?: 'Description', leftId: string, rightId: string } | { __typename?: 'Measurement', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', role: string, leftId: string, rightId: string } | { __typename?: 'Relation', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation' }>, rightEdges: Array<{ __typename?: 'Description', leftId: string, rightId: string } | { __typename?: 'Measurement', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', role: string, leftId: string, rightId: string } | { __typename?: 'Relation', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation' }>, variables: Array<{ __typename?: 'VariableMapping', role: string, value: string }>, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type CreateProtocolEventCategoryMutationVariables = Exact<{
  input: ProtocolEventCategoryInput;
}>;


export type CreateProtocolEventCategoryMutation = { __typename?: 'Mutation', createProtocolEventCategory: { __typename?: 'ProtocolEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, variableDefinitions: Array<{ __typename?: 'VariableDefinition', param: string, valueKind: MetricKind, default?: any | null, optional: boolean, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type UpdateProtocolEventCategoryMutationVariables = Exact<{
  input: UpdateProtocolEventCategoryInput;
}>;


export type UpdateProtocolEventCategoryMutation = { __typename?: 'Mutation', updateProtocolEventCategory: { __typename?: 'ProtocolEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, variableDefinitions: Array<{ __typename?: 'VariableDefinition', param: string, valueKind: MetricKind, default?: any | null, optional: boolean, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type DeleteProtocolEventCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProtocolEventCategoryMutation = { __typename?: 'Mutation', deleteProtocolEventCategory: string };

export type CreateReagentMutationVariables = Exact<{
  input: ReagentInput;
}>;


export type CreateReagentMutation = { __typename?: 'Mutation', createReagent: { __typename?: 'Reagent', id: any, label: string, externalId?: string | null, category: { __typename?: 'ReagentCategory', id: string, label: string }, usableIn: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, createableFrom: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }> } };

export type UpdateReagentCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UpdateReagentCategoryMutation = { __typename?: 'Mutation', updateReagentCategory: { __typename?: 'ReagentCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type CreateRelationMutationVariables = Exact<{
  input: RelationInput;
}>;


export type CreateRelationMutation = { __typename?: 'Mutation', createRelation: { __typename?: 'Relation', category: { __typename?: 'RelationCategory', id: string, label: string } } };

export type CreateRelationCategoryMutationVariables = Exact<{
  input: RelationCategoryInput;
}>;


export type CreateRelationCategoryMutation = { __typename?: 'Mutation', createRelationCategory: { __typename?: 'RelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type UpdateRelationCategoryMutationVariables = Exact<{
  input: UpdateRelationCategoryInput;
}>;


export type UpdateRelationCategoryMutation = { __typename?: 'Mutation', updateRelationCategory: { __typename?: 'RelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type DeleteRelationCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRelationCategoryMutation = { __typename?: 'Mutation', deleteRelationCategory: string };

export type CreateScatterPlotMutationVariables = Exact<{
  input: ScatterPlotInput;
}>;


export type CreateScatterPlotMutation = { __typename?: 'Mutation', createScatterPlot: { __typename?: 'ScatterPlot', id: string, name: string, description?: string | null, xColumn: string, yColumn: string } };

export type DeleteScatterPlotMutationVariables = Exact<{
  input: DeleteScatterPlotInput;
}>;


export type DeleteScatterPlotMutation = { __typename?: 'Mutation', deleteScatterPlot: string };

export type CreateStructureMutationVariables = Exact<{
  input: StructureInput;
}>;


export type CreateStructureMutation = { __typename?: 'Mutation', createStructure: { __typename?: 'Structure', id: any, object: string, identifier: string, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type CreateStructureCategoryMutationVariables = Exact<{
  input: StructureCategoryInput;
}>;


export type CreateStructureCategoryMutation = { __typename?: 'Mutation', createStructureCategory: { __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type UpdateStructureCategoryMutationVariables = Exact<{
  input: UpdateStructureCategoryInput;
}>;


export type UpdateStructureCategoryMutation = { __typename?: 'Mutation', updateStructureCategory: { __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type DeleteStructureCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteStructureCategoryMutation = { __typename?: 'Mutation', deleteStructureCategory: string };

export type CreateStructureRelationMutationVariables = Exact<{
  input: StructureRelationInput;
}>;


export type CreateStructureRelationMutation = { __typename?: 'Mutation', createStructureRelation: { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string, left: { __typename?: 'Entity', id: any, label: string } | { __typename?: 'Metric', id: any, label: string } | { __typename?: 'NaturalEvent', id: any, label: string } | { __typename?: 'ProtocolEvent', id: any, label: string } | { __typename?: 'Reagent', id: any, label: string } | { __typename?: 'Structure', id: any, label: string }, right: { __typename?: 'Entity', id: any, label: string } | { __typename?: 'Metric', id: any, label: string } | { __typename?: 'NaturalEvent', id: any, label: string } | { __typename?: 'ProtocolEvent', id: any, label: string } | { __typename?: 'Reagent', id: any, label: string } | { __typename?: 'Structure', id: any, label: string } } };

export type CreateStructureRelationCategoryMutationVariables = Exact<{
  input: StructureRelationCategoryInput;
}>;


export type CreateStructureRelationCategoryMutation = { __typename?: 'Mutation', createStructureRelationCategory: { __typename?: 'StructureRelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type UpdateStructureRelationCategoryMutationVariables = Exact<{
  input: UpdateStructureRelationCategoryInput;
}>;


export type UpdateStructureRelationCategoryMutation = { __typename?: 'Mutation', updateStructureRelationCategory: { __typename?: 'StructureRelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type DeleteStructureRelationCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteStructureRelationCategoryMutation = { __typename?: 'Mutation', deleteStructureRelationCategory: string };

export type CreateToldyousoMutationVariables = Exact<{
  input: ToldYouSoInput;
}>;


export type CreateToldyousoMutation = { __typename?: 'Mutation', createToldyouso: { __typename?: 'Structure', id: any, object: string, identifier: string, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type RequestUploadMutationVariables = Exact<{
  input: RequestMediaUploadInput;
}>;


export type RequestUploadMutation = { __typename?: 'Mutation', requestUpload: { __typename?: 'PresignedPostCredentials', key: string, xAmzCredential: string, xAmzAlgorithm: string, xAmzDate: string, xAmzSignature: string, policy: string, datalayer: string, bucket: string, store: string } };

export type GetEntityQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEntityQuery = { __typename?: 'Query', entity: { __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string }, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchEntitiesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchEntitiesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Entity', value: any, label: string }> };

export type ListEntitiesQueryVariables = Exact<{
  filters?: InputMaybe<EntityFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
}>;


export type ListEntitiesQuery = { __typename?: 'Query', entities: Array<{ __typename?: 'Entity', id: any, label: string, category: { __typename?: 'EntityCategory', id: string, label: string } }> };

export type SearchEntitiesForRoleQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  categories?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchEntitiesForRoleQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Entity', value: any, label: string }> };

export type GetEntityCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEntityCategoryQuery = { __typename?: 'Query', entityCategory: { __typename?: 'EntityCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchEntityCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchEntityCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'EntityCategory', value: string, label: string }> };

export type ListEntityCategoryQueryVariables = Exact<{
  filters?: InputMaybe<EntityCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListEntityCategoryQuery = { __typename?: 'Query', entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }> };

export type GlobalSearchQueryVariables = Exact<{
  search: Scalars['String']['input'];
}>;


export type GlobalSearchQuery = { __typename?: 'Query', entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> }> };

export type GetGraphQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGraphQuery = { __typename?: 'Query', graph: { __typename?: 'Graph', id: string, name: string, description?: string | null, pinned: boolean, structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> }>, entityCategories: Array<{ __typename?: 'EntityCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, metricCategories: Array<{ __typename?: 'MetricCategory', label: string, metricKind: MetricKind, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, structureDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, reagentCategories: Array<{ __typename?: 'ReagentCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }>, graphQueries: Array<{ __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } }>, latestNodes: Array<{ __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }> } | { __typename?: 'Metric', id: any, label: string, value: number, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'MetricCategory', id: string, label: string } } | { __typename?: 'NaturalEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'ProtocolEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'Reagent', id: any, label: string, externalId?: string | null, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'ReagentCategory', id: string, label: string }, usableIn: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, createableFrom: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }> } | { __typename?: 'Structure', id: any, label: string, object: string, identifier: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null } }> } };

export type SearchGraphsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchGraphsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Graph', value: string, label: string }> };

export type ListGraphsQueryVariables = Exact<{
  filters?: InputMaybe<GraphFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListGraphsQuery = { __typename?: 'Query', graphs: Array<{ __typename?: 'Graph', id: string, name: string, description?: string | null, pinned: boolean }> };

export type GetGraphQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGraphQueryQuery = { __typename?: 'Query', graphQuery: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } };

export type SearchGraphQueriesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchGraphQueriesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'GraphQuery', value: string, label: string }> };

export type ListGraphQueriesQueryVariables = Exact<{
  filters?: InputMaybe<GraphQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListGraphQueriesQuery = { __typename?: 'Query', graphQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type ListPrerenderedGraphQueriesQueryVariables = Exact<{
  filters?: InputMaybe<GraphQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListPrerenderedGraphQueriesQuery = { __typename?: 'Query', graphQueries: Array<{ __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } }> };

export type GetMeasurementQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMeasurementQuery = { __typename?: 'Query', measurement: { __typename?: 'Measurement', validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } };

export type SearchMeasurementsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchMeasurementsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Measurement', value: any, label: string }> };

export type GetMeasurmentCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMeasurmentCategoryQuery = { __typename?: 'Query', measurementCategory: { __typename?: 'MeasurementCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchMeasurmentCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchMeasurmentCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'MeasurementCategory', value: string, label: string }> };

export type ListMeasurmentCategoryQueryVariables = Exact<{
  filters?: InputMaybe<MeasurementCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListMeasurmentCategoryQuery = { __typename?: 'Query', measurementCategories: Array<{ __typename?: 'MeasurementCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }> };

export type GetMetricQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMetricQuery = { __typename?: 'Query', metric: { __typename?: 'Metric', id: any, value: number, category: { __typename?: 'MetricCategory', id: string, label: string } } };

export type SearchMetricsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchMetricsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Metric', value: any, label: string }> };

export type ListMetricsQueryVariables = Exact<{
  filters?: InputMaybe<MetricFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
}>;


export type ListMetricsQuery = { __typename?: 'Query', metrics: Array<{ __typename?: 'Metric', id: any, value: number, label: string }> };

export type GetMetricCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMetricCategoryQuery = { __typename?: 'Query', metricCategory: { __typename?: 'MetricCategory', ageName: string, label: string, metricKind: MetricKind, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type ListMetricCategoryQueryVariables = Exact<{
  filters?: InputMaybe<MetricCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListMetricCategoryQuery = { __typename?: 'Query', metricCategories: Array<{ __typename?: 'MetricCategory', label: string, metricKind: MetricKind, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, structureDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }> };

export type SearchMetricCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchMetricCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'MetricCategory', value: string, label: string }> };

export type GetModelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetModelQuery = { __typename?: 'Query', model: { __typename?: 'Model', id: string, name: string, store?: { __typename?: 'MediaStore', id: string, presignedUrl: string, key: string } | null } };

export type SearchModelsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchModelsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Model', value: string, label: string }> };

export type GetNaturalEventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetNaturalEventQuery = { __typename?: 'Query', naturalEvent: { __typename?: 'NaturalEvent', id: any, label: string, validFrom?: any | null, validTo?: any | null, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchNaturalEventsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchNaturalEventsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'ProtocolEvent', value: any, label: string }> };

export type GetNaturalEventCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetNaturalEventCategoryQuery = { __typename?: 'Query', naturalEventCategory: { __typename?: 'NaturalEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchNaturalEventCategoriesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchNaturalEventCategoriesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'NaturalEventCategory', value: string, label: string }> };

export type ListNaturalEventCategoriesQueryVariables = Exact<{
  filters?: InputMaybe<NaturalEventCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListNaturalEventCategoriesQuery = { __typename?: 'Query', naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> }> };

export type GetNodeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetNodeQuery = { __typename?: 'Query', node: { __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }> } | { __typename?: 'Metric', id: any, label: string, value: number, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'MetricCategory', id: string, label: string } } | { __typename?: 'NaturalEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'ProtocolEvent', id: any, label: string, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'Reagent', id: any, label: string, externalId?: string | null, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'ReagentCategory', id: string, label: string }, usableIn: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, createableFrom: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }> } | { __typename?: 'Structure', id: any, label: string, object: string, identifier: string, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null } } };

export type SearchNodesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchNodesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Entity', value: any, label: string }> };

export type ListNodesQueryVariables = Exact<{
  filters?: InputMaybe<NodeFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
}>;


export type ListNodesQuery = { __typename?: 'Query', nodes: Array<{ __typename?: 'Entity', id: any, label: string, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, category: { __typename?: 'EntityCategory', id: string, label: string }, subjectableTo: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }>, targetableBy: Array<{ __typename?: 'PlayableEntityRoleInProtocolEvent', role: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string } }> }> };

export type NodeCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type NodeCategoriesQuery = { __typename?: 'Query', nodeCategories: Array<{ __typename?: 'EntityCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'MetricCategory', ageName: string, label: string, metricKind: MetricKind, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, graph: { __typename?: 'Graph', id: string }, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'NaturalEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'ProtocolEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, variableDefinitions: Array<{ __typename?: 'VariableDefinition', param: string, valueKind: MetricKind, default?: any | null, optional: boolean, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'ReagentCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | { __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> }> };

export type GetNodeQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetNodeQueryQuery = { __typename?: 'Query', nodeQuery: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } } };

export type RenderNodeQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  nodeId: Scalars['ID']['input'];
}>;


export type RenderNodeQueryQuery = { __typename?: 'Query', renderNodeQuery: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } };

export type SearchNodeQueriesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchNodeQueriesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'NodeQuery', value: string, label: string }> };

export type ListNodeQueriesQueryVariables = Exact<{
  filters?: InputMaybe<NodeQueryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListNodeQueriesQuery = { __typename?: 'Query', nodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> };

export type GetNodeViewQueryVariables = Exact<{
  query: Scalars['ID']['input'];
  nodeId: Scalars['ID']['input'];
}>;


export type GetNodeViewQuery = { __typename?: 'Query', nodeView: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } };

export type GetParticipantQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetParticipantQuery = { __typename?: 'Query', participant: { __typename?: 'Participant', role: string, quantity?: number | null } };

export type SearchParticipantsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchParticipantsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Participant', value: any, label: string }> };

export type GetProtocolEventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProtocolEventQuery = { __typename?: 'Query', protocolEvent: { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, label: string, category: { __typename?: 'ProtocolEventCategory', id: string, label: string, plateChildren?: Array<any> | null }, leftEdges: Array<{ __typename?: 'Description', leftId: string, rightId: string } | { __typename?: 'Measurement', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', role: string, leftId: string, rightId: string } | { __typename?: 'Relation', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation' }>, rightEdges: Array<{ __typename?: 'Description', leftId: string, rightId: string } | { __typename?: 'Measurement', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', role: string, leftId: string, rightId: string } | { __typename?: 'Relation', validFrom: any, validTo: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation' }>, variables: Array<{ __typename?: 'VariableMapping', role: string, value: string }>, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchProtocolEventsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchProtocolEventsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'ProtocolEvent', value: any, label: string }> };

export type GetProtocolEventCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProtocolEventCategoryQuery = { __typename?: 'Query', protocolEventCategory: { __typename?: 'ProtocolEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, variableDefinitions: Array<{ __typename?: 'VariableDefinition', param: string, valueKind: MetricKind, default?: any | null, optional: boolean, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchProtocolEventCategoriesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchProtocolEventCategoriesQuery = { __typename?: 'Query', options: Array<{ __typename?: 'ProtocolEventCategory', value: string, label: string }> };

export type ListProtocolEventCategoriesQueryVariables = Exact<{
  filters?: InputMaybe<ProtocolEventCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListProtocolEventCategoriesQuery = { __typename?: 'Query', protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', plateChildren?: Array<any> | null, label: string, ageName: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, sourceEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, targetEntityRoles: Array<{ __typename?: 'EntityRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Entity', id: any } | null }>, sourceReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, targetReagentRoles: Array<{ __typename?: 'ReagentRoleDefinition', role: string, allowMultiple: boolean, description?: string | null, label?: string | null, categoryDefinition: { __typename?: 'ReagentCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, currentDefault?: { __typename?: 'Reagent', id: any } | null }>, variableDefinitions: Array<{ __typename?: 'VariableDefinition', param: string, valueKind: MetricKind, default?: any | null, optional: boolean, description?: string | null, label?: string | null }>, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> }> };

export type GetReagentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetReagentQuery = { __typename?: 'Query', reagent: { __typename?: 'Reagent', id: any, label: string, externalId?: string | null, category: { __typename?: 'ReagentCategory', id: string, label: string }, usableIn: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, createableFrom: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }> } };

export type SearchReagentsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchReagentsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Entity', value: any, label: string }> };

export type ListReagentsQueryVariables = Exact<{
  filters?: InputMaybe<ReagentFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
}>;


export type ListReagentsQuery = { __typename?: 'Query', reagents: Array<{ __typename?: 'Reagent', id: any, label: string }> };

export type SearchReagentsForRoleQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  categories?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchReagentsForRoleQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Reagent', value: any, label: string }> };

export type GetReagentCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetReagentCategoryQuery = { __typename?: 'Query', reagentCategory: { __typename?: 'ReagentCategory', instanceKind: InstanceKind, ageName: string, label: string, description?: string | null, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchReagentCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchReagentCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'ReagentCategory', value: string, label: string }> };

export type ListReagentCategoryQueryVariables = Exact<{
  filters?: InputMaybe<ReagentCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListReagentCategoryQuery = { __typename?: 'Query', reagentCategories: Array<{ __typename?: 'ReagentCategory', instanceKind: InstanceKind, label: string, id: string, description?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }> };

export type GetRelationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRelationQuery = { __typename?: 'Query', relation: { __typename?: 'Relation', category: { __typename?: 'RelationCategory', id: string, label: string } } };

export type SearchRelationsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchRelationsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Relation', value: any, label: string }> };

export type GetRelationCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRelationCategoryQuery = { __typename?: 'Query', relationCategory: { __typename?: 'RelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchRelationCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchRelationCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'RelationCategory', value: string, label: string }> };

export type ListRelationCategoryQueryVariables = Exact<{
  filters?: InputMaybe<RelationCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListRelationCategoryQuery = { __typename?: 'Query', relationCategories: Array<{ __typename?: 'RelationCategory', label: string, id: string, description?: string | null, sourceDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'EntityCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }> };

export type StartPaneQueryVariables = Exact<{ [key: string]: never; }>;


export type StartPaneQuery = { __typename?: 'Query', reagentCategories: Array<{ __typename?: 'ReagentCategory', id: string, label: string }>, entityCategories: Array<{ __typename?: 'EntityCategory', id: string, label: string }>, relationCategories: Array<{ __typename?: 'RelationCategory', id: string, label: string }>, structureCategories: Array<{ __typename?: 'StructureCategory', id: string, identifier: string }>, protocolEventCategories: Array<{ __typename?: 'ProtocolEventCategory', id: string, label: string }>, naturalEventCategories: Array<{ __typename?: 'NaturalEventCategory', id: string, label: string }> };

export type GetStructureQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStructureQuery = { __typename?: 'Query', structure: { __typename?: 'Structure', id: any, object: string, identifier: string, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string, description?: string | null }, graph: { __typename?: 'Graph', id: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchStructuresQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchStructuresQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Structure', value: any, label: string }> };

export type GetInformedStructureQueryVariables = Exact<{
  graph: Scalars['ID']['input'];
  identifier: Scalars['StructureIdentifier']['input'];
  object: Scalars['ID']['input'];
}>;


export type GetInformedStructureQuery = { __typename?: 'Query', structureByIdentifier: { __typename?: 'Structure', id: any, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string }, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type GetKnowledgeViewsQueryVariables = Exact<{
  identifier: Scalars['StructureIdentifier']['input'];
  object: Scalars['ID']['input'];
}>;


export type GetKnowledgeViewsQuery = { __typename?: 'Query', knowledgeViews: Array<{ __typename?: 'KnowledgeView', structureCategory: { __typename?: 'StructureCategory', id: string, graph: { __typename?: 'Graph', id: string, name: string } }, structure?: { __typename?: 'Structure', id: any, label: string, category: { __typename?: 'StructureCategory', id: string, identifier: string }, graph: { __typename?: 'Graph', id: string, name: string }, bestView?: { __typename?: 'NodeQueryView', nodeId: string, query: { __typename?: 'NodeQuery', id: string, name: string, pinned: boolean, query: string, graph: { __typename?: 'Graph', id: string, name: string } }, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, relevantQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } | null }> };

export type ListStructuresQueryVariables = Exact<{
  filters?: InputMaybe<StructureFilter>;
  pagination?: InputMaybe<GraphPaginationInput>;
}>;


export type ListStructuresQuery = { __typename?: 'Query', structures: Array<{ __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string } }> };

export type GetStructureCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStructureCategoryQuery = { __typename?: 'Query', structureCategory: { __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchStructureCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchStructureCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'StructureCategory', value: string, label: string }> };

export type ListStructureCategoryQueryVariables = Exact<{
  filters?: InputMaybe<StructureCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListStructureCategoryQuery = { __typename?: 'Query', structureCategories: Array<{ __typename?: 'StructureCategory', identifier: string, ageName: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, positionX?: number | null, positionY?: number | null, width?: number | null, height?: number | null, graph: { __typename?: 'Graph', id: string, name: string }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> }> };

export type GetStructureRelationCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStructureRelationCategoryQuery = { __typename?: 'Query', structureRelationCategory: { __typename?: 'StructureRelationCategory', ageName: string, label: string, description?: string | null, pinned: boolean, id: string, purl?: string | null, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, bestQuery?: { __typename?: 'GraphQuery', id: string, query: string, name: string, pinned: boolean, graph: { __typename?: 'Graph', id: string, name: string }, scatterPlots: Array<{ __typename?: 'ScatterPlot', id: string, name: string, xColumn: string, yColumn: string }>, render: { __typename?: 'Pairs', pairs: Array<{ __typename?: 'Pair', source: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any }, target: { __typename?: 'Entity', id: any } | { __typename?: 'Metric', id: any } | { __typename?: 'NaturalEvent', id: any } | { __typename?: 'ProtocolEvent', id: any } | { __typename?: 'Reagent', id: any } | { __typename?: 'Structure', id: any } }> } | { __typename?: 'Path', nodes: Array<{ __typename?: 'Entity', id: any, externalId?: string | null, label: string, category: { __typename?: 'EntityCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Metric', id: any, value: number, label: string, category: { __typename?: 'MetricCategory', id: string, label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'NaturalEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'NaturalEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'ProtocolEvent', id: any, validFrom?: any | null, validTo?: any | null, category: { __typename?: 'ProtocolEventCategory', label: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Reagent', id: any, label: string, category: { __typename?: 'ReagentCategory', label: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } } | { __typename?: 'Structure', id: any, category: { __typename?: 'StructureCategory', identifier: string, id: string, store?: { __typename?: 'MediaStore', presignedUrl: string } | null } }>, edges: Array<{ __typename?: 'Description', id: any, leftId: string, rightId: string } | { __typename?: 'Measurement', id: any, leftId: string, rightId: string, validFrom: any, validTo: any, category: { __typename?: 'MeasurementCategory', id: string, label: string } } | { __typename?: 'Participant', id: any, leftId: string, rightId: string, role: string, quantity?: number | null } | { __typename?: 'Relation', id: any, leftId: string, rightId: string, category: { __typename?: 'RelationCategory', id: string, label: string } } | { __typename?: 'StructureRelation', id: any, leftId: string, rightId: string }> } | { __typename?: 'Table', rows: Array<any>, graph: { __typename?: 'Graph', ageName: string }, columns: Array<{ __typename?: 'Column', name: string, kind: ColumnKind, valueKind?: MetricKind | null, label?: string | null, description?: string | null, category?: string | null, searchable?: boolean | null, idfor?: Array<string> | null, preferhidden?: boolean | null }> } } | null, graph: { __typename?: 'Graph', id: string }, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, relevantQueries: Array<{ __typename?: 'GraphQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }>, relevantNodeQueries: Array<{ __typename?: 'NodeQuery', id: string, name: string, query: string, description?: string | null, pinned: boolean }> } };

export type SearchStructureRelationCategoryQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchStructureRelationCategoryQuery = { __typename?: 'Query', options: Array<{ __typename?: 'StructureRelationCategory', value: string, label: string }> };

export type ListStructureRelationCategoryQueryVariables = Exact<{
  filters?: InputMaybe<StructureRelationCategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListStructureRelationCategoryQuery = { __typename?: 'Query', structureRelationCategories: Array<{ __typename?: 'StructureRelationCategory', label: string, id: string, description?: string | null, graph: { __typename?: 'Graph', id: string, name: string, description?: string | null }, sourceDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, targetDefinition: { __typename?: 'StructureCategoryDefinition', tagFilters?: Array<string> | null, categoryFilters?: Array<string> | null }, store?: { __typename?: 'MediaStore', presignedUrl: string } | null, tags: Array<{ __typename?: 'Tag', id: string, value: string }> }> };

export type SearchTagsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type SearchTagsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Tag', value: string, label: string }> };

export const ListGraphQueryFragmentDoc = gql`
    fragment ListGraphQuery on GraphQuery {
  id
  name
  query
  description
  pinned
}
    `;
export const ListNodeQueryFragmentDoc = gql`
    fragment ListNodeQuery on NodeQuery {
  id
  name
  query
  description
  pinned
}
    `;
export const BaseCategoryFragmentDoc = gql`
    fragment BaseCategory on BaseCategory {
  id
  graph {
    id
  }
  tags {
    id
    value
  }
  purl
  relevantQueries {
    ...ListGraphQuery
  }
  relevantNodeQueries {
    ...ListNodeQuery
  }
}
    ${ListGraphQueryFragmentDoc}
${ListNodeQueryFragmentDoc}`;
export const BaseNodeCategoryFragmentDoc = gql`
    fragment BaseNodeCategory on NodeCategory {
  id
  positionX
  positionY
  width
  height
}
    `;
export const ListScatterPlotFragmentDoc = gql`
    fragment ListScatterPlot on ScatterPlot {
  id
  name
  xColumn
  yColumn
}
    `;
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
    store {
      presignedUrl
    }
  }
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
    store {
      presignedUrl
    }
  }
  externalId
}
    ${ListEntityFragmentDoc}`;
export const ListReagentFragmentDoc = gql`
    fragment ListReagent on Reagent {
  id
  label
}
    `;
export const PathReagentFragmentDoc = gql`
    fragment PathReagent on Reagent {
  ...ListReagent
  category {
    label
    store {
      presignedUrl
    }
  }
}
    ${ListReagentFragmentDoc}`;
export const ListNaturalEventFragmentDoc = gql`
    fragment ListNaturalEvent on NaturalEvent {
  id
  validFrom
  validTo
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
    store {
      presignedUrl
    }
  }
}
    ${ListNaturalEventFragmentDoc}`;
export const ListProtocolEventFragmentDoc = gql`
    fragment ListProtocolEvent on ProtocolEvent {
  id
  validFrom
  validTo
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
    store {
      presignedUrl
    }
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
    store {
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
  ...PathReagent
  ...PathNaturalEvent
  ...PathProtocolEvent
  ...PathMetric
}
    ${PathStructureFragmentDoc}
${PathEntityFragmentDoc}
${PathReagentFragmentDoc}
${PathNaturalEventFragmentDoc}
${PathProtocolEventFragmentDoc}
${PathMetricFragmentDoc}`;
export const BaseEdgeFragmentDoc = gql`
    fragment BaseEdge on Edge {
  id
  leftId
  rightId
}
    `;
export const MeasurementFragmentDoc = gql`
    fragment Measurement on Measurement {
  validFrom
  validTo
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
export const ParticipantFragmentDoc = gql`
    fragment Participant on Participant {
  role
  quantity
}
    `;
export const EdgeFragmentDoc = gql`
    fragment Edge on Edge {
  ...BaseEdge
  ...Measurement
  ...Relation
  ...Participant
}
    ${BaseEdgeFragmentDoc}
${MeasurementFragmentDoc}
${RelationFragmentDoc}
${ParticipantFragmentDoc}`;
export const PathFragmentDoc = gql`
    fragment Path on Path {
  nodes {
    ...PathNode
  }
  edges {
    ...Edge
  }
}
    ${PathNodeFragmentDoc}
${EdgeFragmentDoc}`;
export const PairsFragmentDoc = gql`
    fragment Pairs on Pairs {
  pairs {
    source {
      id
    }
    target {
      id
    }
  }
}
    `;
export const ColumnFragmentDoc = gql`
    fragment Column on Column {
  name
  kind
  valueKind
  label
  description
  category
  searchable
  idfor
  preferhidden
}
    `;
export const TableFragmentDoc = gql`
    fragment Table on Table {
  graph {
    ageName
  }
  rows
  columns {
    ...Column
  }
}
    ${ColumnFragmentDoc}`;
export const GraphQueryFragmentDoc = gql`
    fragment GraphQuery on GraphQuery {
  id
  query
  name
  graph {
    id
    name
  }
  scatterPlots(pagination: {limit: 1}) {
    ...ListScatterPlot
  }
  render {
    ...Path
    ...Pairs
    ...Table
  }
  pinned
}
    ${ListScatterPlotFragmentDoc}
${PathFragmentDoc}
${PairsFragmentDoc}
${TableFragmentDoc}`;
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
  store {
    presignedUrl
  }
  bestQuery {
    ...GraphQuery
  }
  pinned
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${GraphQueryFragmentDoc}`;
export const EntityCategoryFragmentDoc = gql`
    fragment EntityCategory on EntityCategory {
  ...BaseCategory
  ...BaseNodeCategory
  instanceKind
  ageName
  label
  description
  store {
    presignedUrl
  }
  bestQuery {
    ...GraphQuery
  }
  pinned
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${GraphQueryFragmentDoc}`;
export const EntityCategoryDefinitionFragmentDoc = gql`
    fragment EntityCategoryDefinition on EntityCategoryDefinition {
  tagFilters
  categoryFilters
}
    `;
export const EntityRoleDefinitionFragmentDoc = gql`
    fragment EntityRoleDefinition on EntityRoleDefinition {
  role
  categoryDefinition {
    ...EntityCategoryDefinition
  }
  allowMultiple
  description
  currentDefault {
    id
  }
  label
}
    ${EntityCategoryDefinitionFragmentDoc}`;
export const ReagentCategoryDefinitionFragmentDoc = gql`
    fragment ReagentCategoryDefinition on ReagentCategoryDefinition {
  tagFilters
  categoryFilters
}
    `;
export const ReagentRoleDefinitionFragmentDoc = gql`
    fragment ReagentRoleDefinition on ReagentRoleDefinition {
  role
  categoryDefinition {
    ...ReagentCategoryDefinition
  }
  allowMultiple
  description
  currentDefault {
    id
  }
  label
}
    ${ReagentCategoryDefinitionFragmentDoc}`;
export const VariableDefinitionFragmentDoc = gql`
    fragment VariableDefinition on VariableDefinition {
  param
  valueKind
  default
  optional
  description
  label
}
    `;
export const ProtocolEventCategoryFragmentDoc = gql`
    fragment ProtocolEventCategory on ProtocolEventCategory {
  ...BaseCategory
  ...BaseNodeCategory
  plateChildren
  label
  ageName
  label
  description
  store {
    presignedUrl
  }
  sourceEntityRoles {
    ...EntityRoleDefinition
  }
  targetEntityRoles {
    ...EntityRoleDefinition
  }
  sourceReagentRoles {
    ...ReagentRoleDefinition
  }
  targetReagentRoles {
    ...ReagentRoleDefinition
  }
  variableDefinitions {
    ...VariableDefinition
  }
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${EntityRoleDefinitionFragmentDoc}
${ReagentRoleDefinitionFragmentDoc}
${VariableDefinitionFragmentDoc}`;
export const NaturalEventCategoryFragmentDoc = gql`
    fragment NaturalEventCategory on NaturalEventCategory {
  ...BaseCategory
  ...BaseNodeCategory
  plateChildren
  label
  ageName
  description
  store {
    presignedUrl
  }
  sourceEntityRoles {
    ...EntityRoleDefinition
  }
  targetEntityRoles {
    ...EntityRoleDefinition
  }
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${EntityRoleDefinitionFragmentDoc}`;
export const MetricCategoryFragmentDoc = gql`
    fragment MetricCategory on MetricCategory {
  ...BaseCategory
  ...BaseNodeCategory
  ageName
  label
  metricKind
  description
  store {
    presignedUrl
  }
  bestQuery {
    ...GraphQuery
  }
  tags {
    id
    value
  }
  pinned
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${GraphQueryFragmentDoc}`;
export const ReagentCategoryFragmentDoc = gql`
    fragment ReagentCategory on ReagentCategory {
  ...BaseCategory
  ...BaseNodeCategory
  instanceKind
  ageName
  label
  description
  store {
    presignedUrl
  }
  bestQuery {
    ...GraphQuery
  }
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${GraphQueryFragmentDoc}`;
export const NodeCategoryFragmentDoc = gql`
    fragment NodeCategory on NodeCategory {
  ...StructureCategory
  ...EntityCategory
  ...ProtocolEventCategory
  ...NaturalEventCategory
  ...MetricCategory
  ...ReagentCategory
}
    ${StructureCategoryFragmentDoc}
${EntityCategoryFragmentDoc}
${ProtocolEventCategoryFragmentDoc}
${NaturalEventCategoryFragmentDoc}
${MetricCategoryFragmentDoc}
${ReagentCategoryFragmentDoc}`;
export const NodeQueryFragmentDoc = gql`
    fragment NodeQuery on NodeQuery {
  id
  graph {
    id
    name
  }
  name
  pinned
  query
}
    `;
export const NodeQueryViewFragmentDoc = gql`
    fragment NodeQueryView on NodeQueryView {
  nodeId
  query {
    ...NodeQuery
  }
  render {
    ...Table
    ...Pairs
    ...Path
  }
}
    ${NodeQueryFragmentDoc}
${TableFragmentDoc}
${PairsFragmentDoc}
${PathFragmentDoc}`;
export const BaseNodeFragmentDoc = gql`
    fragment BaseNode on Node {
  id
  label
  graph {
    id
  }
  label
  bestView {
    ...NodeQueryView
  }
  relevantQueries {
    ...ListNodeQuery
  }
}
    ${NodeQueryViewFragmentDoc}
${ListNodeQueryFragmentDoc}`;
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
  }
  label
  subjectableTo {
    role
    category {
      id
      label
    }
  }
  targetableBy {
    role
    category {
      id
      label
    }
  }
}
    ${BaseNodeFragmentDoc}`;
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
}
    ${BaseNodeFragmentDoc}`;
export const MetricFragmentDoc = gql`
    fragment Metric on Metric {
  id
  category {
    id
    label
  }
  value
}
    `;
export const ReagentFragmentDoc = gql`
    fragment Reagent on Reagent {
  id
  label
  category {
    id
    label
  }
  externalId
  usableIn {
    id
    label
  }
  createableFrom {
    id
    label
  }
}
    `;
export const NodeFragmentDoc = gql`
    fragment Node on Node {
  ...BaseNode
  ...Entity
  ...Structure
  ...Metric
  ...Reagent
}
    ${BaseNodeFragmentDoc}
${EntityFragmentDoc}
${StructureFragmentDoc}
${MetricFragmentDoc}
${ReagentFragmentDoc}`;
export const DetailNodeFragmentDoc = gql`
    fragment DetailNode on Node {
  ...Node
  graph {
    id
    name
  }
}
    ${NodeFragmentDoc}`;
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
export const StructureRelationFragmentDoc = gql`
    fragment StructureRelation on StructureRelation {
  id
  leftId
  rightId
  left {
    id
    label
  }
  right {
    id
    label
  }
}
    `;
export const ListStructureCategoryFragmentDoc = gql`
    fragment ListStructureCategory on StructureCategory {
  ...BaseCategory
  ...BaseNodeCategory
  identifier
  description
  store {
    presignedUrl
  }
  tags {
    id
    value
  }
}
    ${BaseCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}`;
export const BaseListCategoryFragmentDoc = gql`
    fragment BaseListCategory on BaseCategory {
  id
  description
  store {
    presignedUrl
  }
  tags {
    id
    value
  }
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
  metricKind
  structureDefinition {
    tagFilters
    categoryFilters
  }
}
    ${BaseListCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}`;
export const ListProtocolEventCategoryFragmentDoc = gql`
    fragment ListProtocolEventCategory on ProtocolEventCategory {
  ...BaseListCategory
  ...BaseNodeCategory
  label
  sourceEntityRoles {
    ...EntityRoleDefinition
  }
  targetEntityRoles {
    ...EntityRoleDefinition
  }
  sourceReagentRoles {
    ...ReagentRoleDefinition
  }
  targetReagentRoles {
    ...ReagentRoleDefinition
  }
}
    ${BaseListCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${EntityRoleDefinitionFragmentDoc}
${ReagentRoleDefinitionFragmentDoc}`;
export const ListNaturalEventCategoryFragmentDoc = gql`
    fragment ListNaturalEventCategory on NaturalEventCategory {
  ...BaseListCategory
  ...BaseNodeCategory
  label
  sourceEntityRoles {
    ...EntityRoleDefinition
  }
  targetEntityRoles {
    ...EntityRoleDefinition
  }
}
    ${BaseListCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}
${EntityRoleDefinitionFragmentDoc}`;
export const ListReagentCategoryFragmentDoc = gql`
    fragment ListReagentCategory on ReagentCategory {
  ...BaseListCategory
  ...BaseNodeCategory
  instanceKind
  label
}
    ${BaseListCategoryFragmentDoc}
${BaseNodeCategoryFragmentDoc}`;
export const BaseListEdgeCategoryFragmentDoc = gql`
    fragment BaseListEdgeCategory on EdgeCategory {
  id
}
    `;
export const ListRelationCategoryFragmentDoc = gql`
    fragment ListRelationCategory on RelationCategory {
  ...BaseListCategory
  ...BaseListEdgeCategory
  sourceDefinition {
    tagFilters
    categoryFilters
  }
  targetDefinition {
    tagFilters
    categoryFilters
  }
  label
}
    ${BaseListCategoryFragmentDoc}
${BaseListEdgeCategoryFragmentDoc}`;
export const ListMeasurementCategoryFragmentDoc = gql`
    fragment ListMeasurementCategory on MeasurementCategory {
  ...BaseListCategory
  ...BaseListEdgeCategory
  sourceDefinition {
    tagFilters
    categoryFilters
  }
  targetDefinition {
    tagFilters
    categoryFilters
  }
  label
}
    ${BaseListCategoryFragmentDoc}
${BaseListEdgeCategoryFragmentDoc}`;
export const ListStructureRelationCategoryFragmentDoc = gql`
    fragment ListStructureRelationCategory on StructureRelationCategory {
  ...BaseListCategory
  ...BaseListEdgeCategory
  sourceDefinition {
    tagFilters
    categoryFilters
  }
  targetDefinition {
    tagFilters
    categoryFilters
  }
  label
}
    ${BaseListCategoryFragmentDoc}
${BaseListEdgeCategoryFragmentDoc}`;
export const GraphFragmentDoc = gql`
    fragment Graph on Graph {
  id
  name
  description
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
  reagentCategories {
    ...ListReagentCategory
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
  graphQueries(pagination: {limit: 0}) {
    ...GraphQuery
  }
  latestNodes(pagination: {limit: 2}) {
    ...Node
  }
  pinned
}
    ${ListStructureCategoryFragmentDoc}
${ListEntityCategoryFragmentDoc}
${ListMetricCategoryFragmentDoc}
${ListProtocolEventCategoryFragmentDoc}
${ListNaturalEventCategoryFragmentDoc}
${ListReagentCategoryFragmentDoc}
${ListRelationCategoryFragmentDoc}
${ListMeasurementCategoryFragmentDoc}
${ListStructureRelationCategoryFragmentDoc}
${GraphQueryFragmentDoc}
${NodeFragmentDoc}`;
export const ListGraphFragmentDoc = gql`
    fragment ListGraph on Graph {
  id
  name
  description
  pinned
}
    `;
export const BaseListNodeCategoryFragmentDoc = gql`
    fragment BaseListNodeCategory on NodeCategory {
  id
  positionX
  positionY
  width
  height
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
  sourceDefinition {
    tagFilters
    categoryFilters
  }
  targetDefinition {
    tagFilters
    categoryFilters
  }
  ageName
  label
  description
  store {
    presignedUrl
  }
  bestQuery {
    ...GraphQuery
  }
  pinned
}
    ${BaseEdgeCategoryFragmentDoc}
${BaseCategoryFragmentDoc}
${GraphQueryFragmentDoc}`;
export const MediaStoreFragmentDoc = gql`
    fragment MediaStore on MediaStore {
  id
  presignedUrl
  key
}
    `;
export const ModelFragmentDoc = gql`
    fragment Model on Model {
  id
  name
  store {
    ...MediaStore
  }
}
    ${MediaStoreFragmentDoc}`;
export const NaturalEventFragmentDoc = gql`
    fragment NaturalEvent on NaturalEvent {
  ...BaseNode
  id
  label
  validFrom
  validTo
}
    ${BaseNodeFragmentDoc}`;
export const PathMeasurementFragmentDoc = gql`
    fragment PathMeasurement on Measurement {
  validFrom
  validTo
  category {
    id
    label
  }
  leftId
  rightId
}
    `;
export const PathRelationFragmentDoc = gql`
    fragment PathRelation on Relation {
  validFrom
  validTo
  category {
    id
    label
  }
  leftId
  rightId
}
    `;
export const PathParticipantFragmentDoc = gql`
    fragment PathParticipant on Participant {
  role
  leftId
  rightId
}
    `;
export const PathDescriptionFragmentDoc = gql`
    fragment PathDescription on Description {
  leftId
  rightId
}
    `;
export const PathEdgeFragmentDoc = gql`
    fragment PathEdge on Edge {
  ...PathMeasurement
  ...PathRelation
  ...PathParticipant
  ...PathDescription
}
    ${PathMeasurementFragmentDoc}
${PathRelationFragmentDoc}
${PathParticipantFragmentDoc}
${PathDescriptionFragmentDoc}`;
export const ProtocolEventFragmentDoc = gql`
    fragment ProtocolEvent on ProtocolEvent {
  ...BaseNode
  id
  validFrom
  validTo
  category {
    id
    label
    plateChildren
  }
  leftEdges {
    ...PathEdge
  }
  rightEdges {
    ...PathEdge
  }
  variables {
    role
    value
  }
}
    ${BaseNodeFragmentDoc}
${PathEdgeFragmentDoc}`;
export const RelationCategoryFragmentDoc = gql`
    fragment RelationCategory on RelationCategory {
  ...BaseEdgeCategory
  ...BaseCategory
  sourceDefinition {
    tagFilters
    categoryFilters
  }
  targetDefinition {
    tagFilters
    categoryFilters
  }
  ageName
  label
  description
  store {
    presignedUrl
  }
  bestQuery {
    ...GraphQuery
  }
  pinned
}
    ${BaseEdgeCategoryFragmentDoc}
${BaseCategoryFragmentDoc}
${GraphQueryFragmentDoc}`;
export const ScatterPlotFragmentDoc = gql`
    fragment ScatterPlot on ScatterPlot {
  id
  name
  description
  xColumn
  yColumn
}
    `;
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
}
    ${BaseNodeFragmentDoc}`;
export const StructureRelationCategoryFragmentDoc = gql`
    fragment StructureRelationCategory on StructureRelationCategory {
  ...BaseEdgeCategory
  ...BaseCategory
  sourceDefinition {
    tagFilters
    categoryFilters
  }
  targetDefinition {
    tagFilters
    categoryFilters
  }
  ageName
  label
  description
  store {
    presignedUrl
  }
  bestQuery {
    ...GraphQuery
  }
  pinned
}
    ${BaseEdgeCategoryFragmentDoc}
${BaseCategoryFragmentDoc}
${GraphQueryFragmentDoc}`;
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
export const CreateMetricCategoryDocument = gql`
    mutation CreateMetricCategory($input: MetricCategoryInput!) {
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
export const CreateReagentCategoryDocument = gql`
    mutation CreateReagentCategory($input: ReagentCategoryInput!) {
  createReagentCategory(input: $input) {
    ...ReagentCategory
  }
}
    ${ReagentCategoryFragmentDoc}`;
export type CreateReagentCategoryMutationFn = Apollo.MutationFunction<CreateReagentCategoryMutation, CreateReagentCategoryMutationVariables>;

/**
 * __useCreateReagentCategoryMutation__
 *
 * To run a mutation, you first call `useCreateReagentCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReagentCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReagentCategoryMutation, { data, loading, error }] = useCreateReagentCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateReagentCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateReagentCategoryMutation, CreateReagentCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateReagentCategoryMutation, CreateReagentCategoryMutationVariables>(CreateReagentCategoryDocument, options);
      }
export type CreateReagentCategoryMutationHookResult = ReturnType<typeof useCreateReagentCategoryMutation>;
export type CreateReagentCategoryMutationResult = Apollo.MutationResult<CreateReagentCategoryMutation>;
export type CreateReagentCategoryMutationOptions = Apollo.BaseMutationOptions<CreateReagentCategoryMutation, CreateReagentCategoryMutationVariables>;
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
export const CreateEntityCategoryDocument = gql`
    mutation CreateEntityCategory($input: EntityCategoryInput!) {
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
    mutation UpdateEntityCategory($input: UpdateEntityCategoryInput!) {
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
    mutation DeleteEntityCategory($id: ID!) {
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
export const CreateGraphQueryDocument = gql`
    mutation CreateGraphQuery($input: GraphQueryInput!) {
  createGraphQuery(input: $input) {
    ...GraphQuery
  }
}
    ${GraphQueryFragmentDoc}`;
export type CreateGraphQueryMutationFn = Apollo.MutationFunction<CreateGraphQueryMutation, CreateGraphQueryMutationVariables>;

/**
 * __useCreateGraphQueryMutation__
 *
 * To run a mutation, you first call `useCreateGraphQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGraphQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGraphQueryMutation, { data, loading, error }] = useCreateGraphQueryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGraphQueryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateGraphQueryMutation, CreateGraphQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateGraphQueryMutation, CreateGraphQueryMutationVariables>(CreateGraphQueryDocument, options);
      }
export type CreateGraphQueryMutationHookResult = ReturnType<typeof useCreateGraphQueryMutation>;
export type CreateGraphQueryMutationResult = Apollo.MutationResult<CreateGraphQueryMutation>;
export type CreateGraphQueryMutationOptions = Apollo.BaseMutationOptions<CreateGraphQueryMutation, CreateGraphQueryMutationVariables>;
export const PinGraphQueryDocument = gql`
    mutation PinGraphQuery($input: PinGraphQueryInput!) {
  pinGraphQuery(input: $input) {
    ...GraphQuery
  }
}
    ${GraphQueryFragmentDoc}`;
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
export const CreateMeasurementDocument = gql`
    mutation CreateMeasurement($input: MeasurementInput!) {
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
export const UpdateMeasurementCategoryDocument = gql`
    mutation UpdateMeasurementCategory($input: UpdateMeasurementCategoryInput!) {
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
    mutation DeleteMeasurementCategory($id: ID!) {
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
export const CreateMetricDocument = gql`
    mutation CreateMetric($input: MetricInput!) {
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
export const UpdateMetricCategoryDocument = gql`
    mutation UpdateMetricCategory($input: UpdateMetricCategoryInput!) {
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
    mutation DeleteMetricCategory($id: ID!) {
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
export const CreateModelDocument = gql`
    mutation CreateModel($input: CreateModelInput!) {
  createModel(input: $input) {
    ...Model
  }
}
    ${ModelFragmentDoc}`;
export type CreateModelMutationFn = Apollo.MutationFunction<CreateModelMutation, CreateModelMutationVariables>;

/**
 * __useCreateModelMutation__
 *
 * To run a mutation, you first call `useCreateModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createModelMutation, { data, loading, error }] = useCreateModelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateModelMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateModelMutation, CreateModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateModelMutation, CreateModelMutationVariables>(CreateModelDocument, options);
      }
export type CreateModelMutationHookResult = ReturnType<typeof useCreateModelMutation>;
export type CreateModelMutationResult = Apollo.MutationResult<CreateModelMutation>;
export type CreateModelMutationOptions = Apollo.BaseMutationOptions<CreateModelMutation, CreateModelMutationVariables>;
export const RecordNaturalEventDocument = gql`
    mutation RecordNaturalEvent($input: RecordNaturalEventInput!) {
  recordNaturalEvent(input: $input) {
    ...NaturalEvent
  }
}
    ${NaturalEventFragmentDoc}`;
export type RecordNaturalEventMutationFn = Apollo.MutationFunction<RecordNaturalEventMutation, RecordNaturalEventMutationVariables>;

/**
 * __useRecordNaturalEventMutation__
 *
 * To run a mutation, you first call `useRecordNaturalEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRecordNaturalEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [recordNaturalEventMutation, { data, loading, error }] = useRecordNaturalEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRecordNaturalEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RecordNaturalEventMutation, RecordNaturalEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RecordNaturalEventMutation, RecordNaturalEventMutationVariables>(RecordNaturalEventDocument, options);
      }
export type RecordNaturalEventMutationHookResult = ReturnType<typeof useRecordNaturalEventMutation>;
export type RecordNaturalEventMutationResult = Apollo.MutationResult<RecordNaturalEventMutation>;
export type RecordNaturalEventMutationOptions = Apollo.BaseMutationOptions<RecordNaturalEventMutation, RecordNaturalEventMutationVariables>;
export const CreateNaturalEventCategoryDocument = gql`
    mutation CreateNaturalEventCategory($input: NaturalEventCategoryInput!) {
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
    mutation UpdateNaturalEventCategory($input: UpdateNaturalEventCategoryInput!) {
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
    mutation DeleteNaturalEventCategory($id: ID!) {
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
export const CreateNodeQueryDocument = gql`
    mutation CreateNodeQuery($input: NodeQueryInput!) {
  createNodeQuery(input: $input) {
    ...NodeQuery
  }
}
    ${NodeQueryFragmentDoc}`;
export type CreateNodeQueryMutationFn = Apollo.MutationFunction<CreateNodeQueryMutation, CreateNodeQueryMutationVariables>;

/**
 * __useCreateNodeQueryMutation__
 *
 * To run a mutation, you first call `useCreateNodeQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNodeQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNodeQueryMutation, { data, loading, error }] = useCreateNodeQueryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNodeQueryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateNodeQueryMutation, CreateNodeQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateNodeQueryMutation, CreateNodeQueryMutationVariables>(CreateNodeQueryDocument, options);
      }
export type CreateNodeQueryMutationHookResult = ReturnType<typeof useCreateNodeQueryMutation>;
export type CreateNodeQueryMutationResult = Apollo.MutationResult<CreateNodeQueryMutation>;
export type CreateNodeQueryMutationOptions = Apollo.BaseMutationOptions<CreateNodeQueryMutation, CreateNodeQueryMutationVariables>;
export const PinNodeQueryDocument = gql`
    mutation PinNodeQuery($input: PinNodeQueryInput!) {
  pinNodeQuery(input: $input) {
    ...NodeQuery
  }
}
    ${NodeQueryFragmentDoc}`;
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
export const RecordProtocolEventDocument = gql`
    mutation RecordProtocolEvent($input: RecordProtocolEventInput!) {
  recordProtocolEvent(input: $input) {
    ...ProtocolEvent
  }
}
    ${ProtocolEventFragmentDoc}`;
export type RecordProtocolEventMutationFn = Apollo.MutationFunction<RecordProtocolEventMutation, RecordProtocolEventMutationVariables>;

/**
 * __useRecordProtocolEventMutation__
 *
 * To run a mutation, you first call `useRecordProtocolEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRecordProtocolEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [recordProtocolEventMutation, { data, loading, error }] = useRecordProtocolEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRecordProtocolEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RecordProtocolEventMutation, RecordProtocolEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RecordProtocolEventMutation, RecordProtocolEventMutationVariables>(RecordProtocolEventDocument, options);
      }
export type RecordProtocolEventMutationHookResult = ReturnType<typeof useRecordProtocolEventMutation>;
export type RecordProtocolEventMutationResult = Apollo.MutationResult<RecordProtocolEventMutation>;
export type RecordProtocolEventMutationOptions = Apollo.BaseMutationOptions<RecordProtocolEventMutation, RecordProtocolEventMutationVariables>;
export const CreateProtocolEventCategoryDocument = gql`
    mutation CreateProtocolEventCategory($input: ProtocolEventCategoryInput!) {
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
    mutation UpdateProtocolEventCategory($input: UpdateProtocolEventCategoryInput!) {
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
    mutation DeleteProtocolEventCategory($id: ID!) {
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
export const UpdateReagentCategoryDocument = gql`
    mutation UpdateReagentCategory($id: ID!) {
  updateReagentCategory(input: {id: $id}) {
    ...ReagentCategory
  }
}
    ${ReagentCategoryFragmentDoc}`;
export type UpdateReagentCategoryMutationFn = Apollo.MutationFunction<UpdateReagentCategoryMutation, UpdateReagentCategoryMutationVariables>;

/**
 * __useUpdateReagentCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateReagentCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReagentCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReagentCategoryMutation, { data, loading, error }] = useUpdateReagentCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateReagentCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateReagentCategoryMutation, UpdateReagentCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateReagentCategoryMutation, UpdateReagentCategoryMutationVariables>(UpdateReagentCategoryDocument, options);
      }
export type UpdateReagentCategoryMutationHookResult = ReturnType<typeof useUpdateReagentCategoryMutation>;
export type UpdateReagentCategoryMutationResult = Apollo.MutationResult<UpdateReagentCategoryMutation>;
export type UpdateReagentCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateReagentCategoryMutation, UpdateReagentCategoryMutationVariables>;
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
export const UpdateRelationCategoryDocument = gql`
    mutation UpdateRelationCategory($input: UpdateRelationCategoryInput!) {
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
    mutation DeleteRelationCategory($id: ID!) {
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
export const CreateScatterPlotDocument = gql`
    mutation CreateScatterPlot($input: ScatterPlotInput!) {
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
export const DeleteStructureCategoryDocument = gql`
    mutation DeleteStructureCategory($id: ID!) {
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
export const CreateStructureRelationDocument = gql`
    mutation CreateStructureRelation($input: StructureRelationInput!) {
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
export const CreateStructureRelationCategoryDocument = gql`
    mutation CreateStructureRelationCategory($input: StructureRelationCategoryInput!) {
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
    mutation UpdateStructureRelationCategory($input: UpdateStructureRelationCategoryInput!) {
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
    mutation DeleteStructureRelationCategory($id: ID!) {
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
export const CreateToldyousoDocument = gql`
    mutation CreateToldyouso($input: ToldYouSoInput!) {
  createToldyouso(input: $input) {
    ...Structure
  }
}
    ${StructureFragmentDoc}`;
export type CreateToldyousoMutationFn = Apollo.MutationFunction<CreateToldyousoMutation, CreateToldyousoMutationVariables>;

/**
 * __useCreateToldyousoMutation__
 *
 * To run a mutation, you first call `useCreateToldyousoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateToldyousoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createToldyousoMutation, { data, loading, error }] = useCreateToldyousoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateToldyousoMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateToldyousoMutation, CreateToldyousoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateToldyousoMutation, CreateToldyousoMutationVariables>(CreateToldyousoDocument, options);
      }
export type CreateToldyousoMutationHookResult = ReturnType<typeof useCreateToldyousoMutation>;
export type CreateToldyousoMutationResult = Apollo.MutationResult<CreateToldyousoMutation>;
export type CreateToldyousoMutationOptions = Apollo.BaseMutationOptions<CreateToldyousoMutation, CreateToldyousoMutationVariables>;
export const RequestUploadDocument = gql`
    mutation RequestUpload($input: RequestMediaUploadInput!) {
  requestUpload(input: $input) {
    ...PresignedPostCredentials
  }
}
    ${PresignedPostCredentialsFragmentDoc}`;
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
 *      input: // value for 'input'
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
export const SearchEntitiesForRoleDocument = gql`
    query SearchEntitiesForRole($search: String, $values: [ID!], $tags: [String!], $categories: [ID!]) {
  options: entities(
    filters: {search: $search, ids: $values, tags: $tags, categories: $categories}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchEntitiesForRoleQuery__
 *
 * To run a query within a React component, call `useSearchEntitiesForRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEntitiesForRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEntitiesForRoleQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *      tags: // value for 'tags'
 *      categories: // value for 'categories'
 *   },
 * });
 */
export function useSearchEntitiesForRoleQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchEntitiesForRoleQuery, SearchEntitiesForRoleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchEntitiesForRoleQuery, SearchEntitiesForRoleQueryVariables>(SearchEntitiesForRoleDocument, options);
      }
export function useSearchEntitiesForRoleLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchEntitiesForRoleQuery, SearchEntitiesForRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchEntitiesForRoleQuery, SearchEntitiesForRoleQueryVariables>(SearchEntitiesForRoleDocument, options);
        }
export type SearchEntitiesForRoleQueryHookResult = ReturnType<typeof useSearchEntitiesForRoleQuery>;
export type SearchEntitiesForRoleLazyQueryHookResult = ReturnType<typeof useSearchEntitiesForRoleLazyQuery>;
export type SearchEntitiesForRoleQueryResult = Apollo.QueryResult<SearchEntitiesForRoleQuery, SearchEntitiesForRoleQueryVariables>;
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
    query SearchEntityCategory($search: String, $values: [ID!]) {
  options: entityCategories(
    filters: {search: $search, ids: $values}
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
export const GetGraphQueryDocument = gql`
    query GetGraphQuery($id: ID!) {
  graphQuery(id: $id) {
    ...GraphQuery
  }
}
    ${GraphQueryFragmentDoc}`;

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
export const ListGraphQueriesDocument = gql`
    query ListGraphQueries($filters: GraphQueryFilter, $pagination: OffsetPaginationInput) {
  graphQueries(filters: $filters, pagination: $pagination) {
    ...ListGraphQuery
  }
}
    ${ListGraphQueryFragmentDoc}`;

/**
 * __useListGraphQueriesQuery__
 *
 * To run a query within a React component, call `useListGraphQueriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListGraphQueriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListGraphQueriesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListGraphQueriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListGraphQueriesQuery, ListGraphQueriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListGraphQueriesQuery, ListGraphQueriesQueryVariables>(ListGraphQueriesDocument, options);
      }
export function useListGraphQueriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListGraphQueriesQuery, ListGraphQueriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListGraphQueriesQuery, ListGraphQueriesQueryVariables>(ListGraphQueriesDocument, options);
        }
export type ListGraphQueriesQueryHookResult = ReturnType<typeof useListGraphQueriesQuery>;
export type ListGraphQueriesLazyQueryHookResult = ReturnType<typeof useListGraphQueriesLazyQuery>;
export type ListGraphQueriesQueryResult = Apollo.QueryResult<ListGraphQueriesQuery, ListGraphQueriesQueryVariables>;
export const ListPrerenderedGraphQueriesDocument = gql`
    query ListPrerenderedGraphQueries($filters: GraphQueryFilter, $pagination: OffsetPaginationInput) {
  graphQueries(filters: $filters, pagination: $pagination) {
    ...GraphQuery
  }
}
    ${GraphQueryFragmentDoc}`;

/**
 * __useListPrerenderedGraphQueriesQuery__
 *
 * To run a query within a React component, call `useListPrerenderedGraphQueriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPrerenderedGraphQueriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPrerenderedGraphQueriesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListPrerenderedGraphQueriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListPrerenderedGraphQueriesQuery, ListPrerenderedGraphQueriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListPrerenderedGraphQueriesQuery, ListPrerenderedGraphQueriesQueryVariables>(ListPrerenderedGraphQueriesDocument, options);
      }
export function useListPrerenderedGraphQueriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListPrerenderedGraphQueriesQuery, ListPrerenderedGraphQueriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListPrerenderedGraphQueriesQuery, ListPrerenderedGraphQueriesQueryVariables>(ListPrerenderedGraphQueriesDocument, options);
        }
export type ListPrerenderedGraphQueriesQueryHookResult = ReturnType<typeof useListPrerenderedGraphQueriesQuery>;
export type ListPrerenderedGraphQueriesLazyQueryHookResult = ReturnType<typeof useListPrerenderedGraphQueriesLazyQuery>;
export type ListPrerenderedGraphQueriesQueryResult = Apollo.QueryResult<ListPrerenderedGraphQueriesQuery, ListPrerenderedGraphQueriesQueryVariables>;
export const GetMeasurementDocument = gql`
    query GetMeasurement($id: ID!) {
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
    query SearchMeasurements($search: String, $values: [ID!]) {
  options: measurements(
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
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchMeasurementsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchMeasurementsQuery, SearchMeasurementsQueryVariables>) {
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
    ...ListMeasurementCategory
  }
}
    ${ListMeasurementCategoryFragmentDoc}`;

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
export const GetMetricDocument = gql`
    query GetMetric($id: ID!) {
  metric(id: $id) {
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
    query SearchMetrics($search: String, $values: [ID!]) {
  options: metrics(
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
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchMetricsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchMetricsQuery, SearchMetricsQueryVariables>) {
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
    query ListMetrics($filters: MetricFilter, $pagination: GraphPaginationInput) {
  metrics(filters: $filters, pagination: $pagination) {
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
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListMetricsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListMetricsQuery, ListMetricsQueryVariables>) {
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
export const GetModelDocument = gql`
    query GetModel($id: ID!) {
  model(id: $id) {
    ...Model
  }
}
    ${ModelFragmentDoc}`;

/**
 * __useGetModelQuery__
 *
 * To run a query within a React component, call `useGetModelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetModelQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetModelQuery, GetModelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetModelQuery, GetModelQueryVariables>(GetModelDocument, options);
      }
export function useGetModelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetModelQuery, GetModelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetModelQuery, GetModelQueryVariables>(GetModelDocument, options);
        }
export type GetModelQueryHookResult = ReturnType<typeof useGetModelQuery>;
export type GetModelLazyQueryHookResult = ReturnType<typeof useGetModelLazyQuery>;
export type GetModelQueryResult = Apollo.QueryResult<GetModelQuery, GetModelQueryVariables>;
export const SearchModelsDocument = gql`
    query SearchModels($search: String, $values: [ID!]) {
  options: models(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchModelsQuery__
 *
 * To run a query within a React component, call `useSearchModelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchModelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchModelsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchModelsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchModelsQuery, SearchModelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchModelsQuery, SearchModelsQueryVariables>(SearchModelsDocument, options);
      }
export function useSearchModelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchModelsQuery, SearchModelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchModelsQuery, SearchModelsQueryVariables>(SearchModelsDocument, options);
        }
export type SearchModelsQueryHookResult = ReturnType<typeof useSearchModelsQuery>;
export type SearchModelsLazyQueryHookResult = ReturnType<typeof useSearchModelsLazyQuery>;
export type SearchModelsQueryResult = Apollo.QueryResult<SearchModelsQuery, SearchModelsQueryVariables>;
export const GetNaturalEventDocument = gql`
    query GetNaturalEvent($id: ID!) {
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
    query SearchNaturalEvents($search: String, $values: [ID!]) {
  options: naturalEvents(
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
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchNaturalEventsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchNaturalEventsQuery, SearchNaturalEventsQueryVariables>) {
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
export const SearchNodesDocument = gql`
    query SearchNodes($search: String, $values: [ID!]) {
  options: nodes(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchNodesQuery__
 *
 * To run a query within a React component, call `useSearchNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchNodesQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchNodesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchNodesQuery, SearchNodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchNodesQuery, SearchNodesQueryVariables>(SearchNodesDocument, options);
      }
export function useSearchNodesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchNodesQuery, SearchNodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchNodesQuery, SearchNodesQueryVariables>(SearchNodesDocument, options);
        }
export type SearchNodesQueryHookResult = ReturnType<typeof useSearchNodesQuery>;
export type SearchNodesLazyQueryHookResult = ReturnType<typeof useSearchNodesLazyQuery>;
export type SearchNodesQueryResult = Apollo.QueryResult<SearchNodesQuery, SearchNodesQueryVariables>;
export const ListNodesDocument = gql`
    query ListNodes($filters: NodeFilter, $pagination: GraphPaginationInput) {
  nodes(filters: $filters, pagination: $pagination) {
    ...Node
  }
}
    ${NodeFragmentDoc}`;

/**
 * __useListNodesQuery__
 *
 * To run a query within a React component, call `useListNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListNodesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListNodesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListNodesQuery, ListNodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListNodesQuery, ListNodesQueryVariables>(ListNodesDocument, options);
      }
export function useListNodesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListNodesQuery, ListNodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListNodesQuery, ListNodesQueryVariables>(ListNodesDocument, options);
        }
export type ListNodesQueryHookResult = ReturnType<typeof useListNodesQuery>;
export type ListNodesLazyQueryHookResult = ReturnType<typeof useListNodesLazyQuery>;
export type ListNodesQueryResult = Apollo.QueryResult<ListNodesQuery, ListNodesQueryVariables>;
export const NodeCategoriesDocument = gql`
    query NodeCategories {
  nodeCategories {
    ...NodeCategory
  }
}
    ${NodeCategoryFragmentDoc}`;

/**
 * __useNodeCategoriesQuery__
 *
 * To run a query within a React component, call `useNodeCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useNodeCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNodeCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useNodeCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<NodeCategoriesQuery, NodeCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<NodeCategoriesQuery, NodeCategoriesQueryVariables>(NodeCategoriesDocument, options);
      }
export function useNodeCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<NodeCategoriesQuery, NodeCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<NodeCategoriesQuery, NodeCategoriesQueryVariables>(NodeCategoriesDocument, options);
        }
export type NodeCategoriesQueryHookResult = ReturnType<typeof useNodeCategoriesQuery>;
export type NodeCategoriesLazyQueryHookResult = ReturnType<typeof useNodeCategoriesLazyQuery>;
export type NodeCategoriesQueryResult = Apollo.QueryResult<NodeCategoriesQuery, NodeCategoriesQueryVariables>;
export const GetNodeQueryDocument = gql`
    query GetNodeQuery($id: ID!) {
  nodeQuery(id: $id) {
    ...NodeQuery
  }
}
    ${NodeQueryFragmentDoc}`;

/**
 * __useGetNodeQueryQuery__
 *
 * To run a query within a React component, call `useGetNodeQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNodeQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNodeQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetNodeQueryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetNodeQueryQuery, GetNodeQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetNodeQueryQuery, GetNodeQueryQueryVariables>(GetNodeQueryDocument, options);
      }
export function useGetNodeQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNodeQueryQuery, GetNodeQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetNodeQueryQuery, GetNodeQueryQueryVariables>(GetNodeQueryDocument, options);
        }
export type GetNodeQueryQueryHookResult = ReturnType<typeof useGetNodeQueryQuery>;
export type GetNodeQueryLazyQueryHookResult = ReturnType<typeof useGetNodeQueryLazyQuery>;
export type GetNodeQueryQueryResult = Apollo.QueryResult<GetNodeQueryQuery, GetNodeQueryQueryVariables>;
export const RenderNodeQueryDocument = gql`
    query RenderNodeQuery($id: ID!, $nodeId: ID!) {
  renderNodeQuery(id: $id, nodeId: $nodeId) {
    ...Path
    ...Table
    ...Pairs
  }
}
    ${PathFragmentDoc}
${TableFragmentDoc}
${PairsFragmentDoc}`;

/**
 * __useRenderNodeQueryQuery__
 *
 * To run a query within a React component, call `useRenderNodeQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRenderNodeQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRenderNodeQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *      nodeId: // value for 'nodeId'
 *   },
 * });
 */
export function useRenderNodeQueryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<RenderNodeQueryQuery, RenderNodeQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<RenderNodeQueryQuery, RenderNodeQueryQueryVariables>(RenderNodeQueryDocument, options);
      }
export function useRenderNodeQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RenderNodeQueryQuery, RenderNodeQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<RenderNodeQueryQuery, RenderNodeQueryQueryVariables>(RenderNodeQueryDocument, options);
        }
export type RenderNodeQueryQueryHookResult = ReturnType<typeof useRenderNodeQueryQuery>;
export type RenderNodeQueryLazyQueryHookResult = ReturnType<typeof useRenderNodeQueryLazyQuery>;
export type RenderNodeQueryQueryResult = Apollo.QueryResult<RenderNodeQueryQuery, RenderNodeQueryQueryVariables>;
export const SearchNodeQueriesDocument = gql`
    query SearchNodeQueries($search: String, $values: [ID!]) {
  options: nodeQueries(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchNodeQueriesQuery__
 *
 * To run a query within a React component, call `useSearchNodeQueriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchNodeQueriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchNodeQueriesQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchNodeQueriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchNodeQueriesQuery, SearchNodeQueriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchNodeQueriesQuery, SearchNodeQueriesQueryVariables>(SearchNodeQueriesDocument, options);
      }
export function useSearchNodeQueriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchNodeQueriesQuery, SearchNodeQueriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchNodeQueriesQuery, SearchNodeQueriesQueryVariables>(SearchNodeQueriesDocument, options);
        }
export type SearchNodeQueriesQueryHookResult = ReturnType<typeof useSearchNodeQueriesQuery>;
export type SearchNodeQueriesLazyQueryHookResult = ReturnType<typeof useSearchNodeQueriesLazyQuery>;
export type SearchNodeQueriesQueryResult = Apollo.QueryResult<SearchNodeQueriesQuery, SearchNodeQueriesQueryVariables>;
export const ListNodeQueriesDocument = gql`
    query ListNodeQueries($filters: NodeQueryFilter, $pagination: OffsetPaginationInput) {
  nodeQueries(filters: $filters, pagination: $pagination) {
    ...ListNodeQuery
  }
}
    ${ListNodeQueryFragmentDoc}`;

/**
 * __useListNodeQueriesQuery__
 *
 * To run a query within a React component, call `useListNodeQueriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListNodeQueriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListNodeQueriesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListNodeQueriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListNodeQueriesQuery, ListNodeQueriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListNodeQueriesQuery, ListNodeQueriesQueryVariables>(ListNodeQueriesDocument, options);
      }
export function useListNodeQueriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListNodeQueriesQuery, ListNodeQueriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListNodeQueriesQuery, ListNodeQueriesQueryVariables>(ListNodeQueriesDocument, options);
        }
export type ListNodeQueriesQueryHookResult = ReturnType<typeof useListNodeQueriesQuery>;
export type ListNodeQueriesLazyQueryHookResult = ReturnType<typeof useListNodeQueriesLazyQuery>;
export type ListNodeQueriesQueryResult = Apollo.QueryResult<ListNodeQueriesQuery, ListNodeQueriesQueryVariables>;
export const GetNodeViewDocument = gql`
    query GetNodeView($query: ID!, $nodeId: ID!) {
  nodeView(query: $query, nodeId: $nodeId) {
    ...NodeQueryView
  }
}
    ${NodeQueryViewFragmentDoc}`;

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
 *      query: // value for 'query'
 *      nodeId: // value for 'nodeId'
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
export const GetParticipantDocument = gql`
    query GetParticipant($id: ID!) {
  participant(id: $id) {
    ...Participant
  }
}
    ${ParticipantFragmentDoc}`;

/**
 * __useGetParticipantQuery__
 *
 * To run a query within a React component, call `useGetParticipantQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParticipantQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParticipantQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetParticipantQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetParticipantQuery, GetParticipantQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetParticipantQuery, GetParticipantQueryVariables>(GetParticipantDocument, options);
      }
export function useGetParticipantLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetParticipantQuery, GetParticipantQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetParticipantQuery, GetParticipantQueryVariables>(GetParticipantDocument, options);
        }
export type GetParticipantQueryHookResult = ReturnType<typeof useGetParticipantQuery>;
export type GetParticipantLazyQueryHookResult = ReturnType<typeof useGetParticipantLazyQuery>;
export type GetParticipantQueryResult = Apollo.QueryResult<GetParticipantQuery, GetParticipantQueryVariables>;
export const SearchParticipantsDocument = gql`
    query SearchParticipants($search: String, $values: [ID!]) {
  options: participants(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchParticipantsQuery__
 *
 * To run a query within a React component, call `useSearchParticipantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchParticipantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchParticipantsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchParticipantsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchParticipantsQuery, SearchParticipantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchParticipantsQuery, SearchParticipantsQueryVariables>(SearchParticipantsDocument, options);
      }
export function useSearchParticipantsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchParticipantsQuery, SearchParticipantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchParticipantsQuery, SearchParticipantsQueryVariables>(SearchParticipantsDocument, options);
        }
export type SearchParticipantsQueryHookResult = ReturnType<typeof useSearchParticipantsQuery>;
export type SearchParticipantsLazyQueryHookResult = ReturnType<typeof useSearchParticipantsLazyQuery>;
export type SearchParticipantsQueryResult = Apollo.QueryResult<SearchParticipantsQuery, SearchParticipantsQueryVariables>;
export const GetProtocolEventDocument = gql`
    query GetProtocolEvent($id: ID!) {
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
    query SearchProtocolEvents($search: String, $values: [ID!]) {
  options: protocolEvents(
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
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchProtocolEventsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchProtocolEventsQuery, SearchProtocolEventsQueryVariables>) {
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
export const SearchReagentsDocument = gql`
    query SearchReagents($search: String, $values: [ID!]) {
  options: nodes(
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
export const ListReagentsDocument = gql`
    query ListReagents($filters: ReagentFilter, $pagination: GraphPaginationInput) {
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
export const SearchReagentsForRoleDocument = gql`
    query SearchReagentsForRole($search: String, $values: [ID!], $tags: [String!], $categories: [ID!]) {
  options: reagents(
    filters: {search: $search, ids: $values, tags: $tags, categories: $categories}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchReagentsForRoleQuery__
 *
 * To run a query within a React component, call `useSearchReagentsForRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchReagentsForRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchReagentsForRoleQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *      tags: // value for 'tags'
 *      categories: // value for 'categories'
 *   },
 * });
 */
export function useSearchReagentsForRoleQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchReagentsForRoleQuery, SearchReagentsForRoleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchReagentsForRoleQuery, SearchReagentsForRoleQueryVariables>(SearchReagentsForRoleDocument, options);
      }
export function useSearchReagentsForRoleLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchReagentsForRoleQuery, SearchReagentsForRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchReagentsForRoleQuery, SearchReagentsForRoleQueryVariables>(SearchReagentsForRoleDocument, options);
        }
export type SearchReagentsForRoleQueryHookResult = ReturnType<typeof useSearchReagentsForRoleQuery>;
export type SearchReagentsForRoleLazyQueryHookResult = ReturnType<typeof useSearchReagentsForRoleLazyQuery>;
export type SearchReagentsForRoleQueryResult = Apollo.QueryResult<SearchReagentsForRoleQuery, SearchReagentsForRoleQueryVariables>;
export const GetReagentCategoryDocument = gql`
    query GetReagentCategory($id: ID!) {
  reagentCategory(id: $id) {
    ...ReagentCategory
  }
}
    ${ReagentCategoryFragmentDoc}`;

/**
 * __useGetReagentCategoryQuery__
 *
 * To run a query within a React component, call `useGetReagentCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReagentCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReagentCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetReagentCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetReagentCategoryQuery, GetReagentCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetReagentCategoryQuery, GetReagentCategoryQueryVariables>(GetReagentCategoryDocument, options);
      }
export function useGetReagentCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetReagentCategoryQuery, GetReagentCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetReagentCategoryQuery, GetReagentCategoryQueryVariables>(GetReagentCategoryDocument, options);
        }
export type GetReagentCategoryQueryHookResult = ReturnType<typeof useGetReagentCategoryQuery>;
export type GetReagentCategoryLazyQueryHookResult = ReturnType<typeof useGetReagentCategoryLazyQuery>;
export type GetReagentCategoryQueryResult = Apollo.QueryResult<GetReagentCategoryQuery, GetReagentCategoryQueryVariables>;
export const SearchReagentCategoryDocument = gql`
    query SearchReagentCategory($search: String, $values: [ID!]) {
  options: reagentCategories(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: label
  }
}
    `;

/**
 * __useSearchReagentCategoryQuery__
 *
 * To run a query within a React component, call `useSearchReagentCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchReagentCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchReagentCategoryQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchReagentCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchReagentCategoryQuery, SearchReagentCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchReagentCategoryQuery, SearchReagentCategoryQueryVariables>(SearchReagentCategoryDocument, options);
      }
export function useSearchReagentCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchReagentCategoryQuery, SearchReagentCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchReagentCategoryQuery, SearchReagentCategoryQueryVariables>(SearchReagentCategoryDocument, options);
        }
export type SearchReagentCategoryQueryHookResult = ReturnType<typeof useSearchReagentCategoryQuery>;
export type SearchReagentCategoryLazyQueryHookResult = ReturnType<typeof useSearchReagentCategoryLazyQuery>;
export type SearchReagentCategoryQueryResult = Apollo.QueryResult<SearchReagentCategoryQuery, SearchReagentCategoryQueryVariables>;
export const ListReagentCategoryDocument = gql`
    query ListReagentCategory($filters: ReagentCategoryFilter, $pagination: OffsetPaginationInput) {
  reagentCategories(filters: $filters, pagination: $pagination) {
    ...ListReagentCategory
  }
}
    ${ListReagentCategoryFragmentDoc}`;

/**
 * __useListReagentCategoryQuery__
 *
 * To run a query within a React component, call `useListReagentCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useListReagentCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListReagentCategoryQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListReagentCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListReagentCategoryQuery, ListReagentCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListReagentCategoryQuery, ListReagentCategoryQueryVariables>(ListReagentCategoryDocument, options);
      }
export function useListReagentCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListReagentCategoryQuery, ListReagentCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListReagentCategoryQuery, ListReagentCategoryQueryVariables>(ListReagentCategoryDocument, options);
        }
export type ListReagentCategoryQueryHookResult = ReturnType<typeof useListReagentCategoryQuery>;
export type ListReagentCategoryLazyQueryHookResult = ReturnType<typeof useListReagentCategoryLazyQuery>;
export type ListReagentCategoryQueryResult = Apollo.QueryResult<ListReagentCategoryQuery, ListReagentCategoryQueryVariables>;
export const GetRelationDocument = gql`
    query GetRelation($id: ID!) {
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
    query SearchRelations($search: String, $values: [ID!]) {
  options: relations(
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
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchRelationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchRelationsQuery, SearchRelationsQueryVariables>) {
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
export const StartPaneDocument = gql`
    query StartPane {
  reagentCategories(filters: {pinned: true}, pagination: {limit: 5}) {
    id
    label
  }
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
    query GetStructure($id: ID!) {
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
    query SearchStructures($search: String, $values: [ID!]) {
  options: structures(
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
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchStructuresQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchStructuresQuery, SearchStructuresQueryVariables>) {
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
    query GetInformedStructure($graph: ID!, $identifier: StructureIdentifier!, $object: ID!) {
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
export const GetKnowledgeViewsDocument = gql`
    query GetKnowledgeViews($identifier: StructureIdentifier!, $object: ID!) {
  knowledgeViews(identifier: $identifier, object: $object) {
    structureCategory {
      id
      graph {
        id
        name
      }
    }
    structure {
      ...InformedStructure
    }
  }
}
    ${InformedStructureFragmentDoc}`;

/**
 * __useGetKnowledgeViewsQuery__
 *
 * To run a query within a React component, call `useGetKnowledgeViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetKnowledgeViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetKnowledgeViewsQuery({
 *   variables: {
 *      identifier: // value for 'identifier'
 *      object: // value for 'object'
 *   },
 * });
 */
export function useGetKnowledgeViewsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetKnowledgeViewsQuery, GetKnowledgeViewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetKnowledgeViewsQuery, GetKnowledgeViewsQueryVariables>(GetKnowledgeViewsDocument, options);
      }
export function useGetKnowledgeViewsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetKnowledgeViewsQuery, GetKnowledgeViewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetKnowledgeViewsQuery, GetKnowledgeViewsQueryVariables>(GetKnowledgeViewsDocument, options);
        }
export type GetKnowledgeViewsQueryHookResult = ReturnType<typeof useGetKnowledgeViewsQuery>;
export type GetKnowledgeViewsLazyQueryHookResult = ReturnType<typeof useGetKnowledgeViewsLazyQuery>;
export type GetKnowledgeViewsQueryResult = Apollo.QueryResult<GetKnowledgeViewsQuery, GetKnowledgeViewsQueryVariables>;
export const ListStructuresDocument = gql`
    query ListStructures($filters: StructureFilter, $pagination: GraphPaginationInput) {
  structures(filters: $filters, pagination: $pagination) {
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
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListStructuresQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListStructuresQuery, ListStructuresQueryVariables>) {
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
export const SearchTagsDocument = gql`
    query SearchTags($search: String, $values: [String!]) {
  options: tags(
    filters: {search: $search, values: $values}
    pagination: {limit: 10}
  ) {
    value: value
    label: value
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