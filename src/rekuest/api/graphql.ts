import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
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
  AnyDefault: { input: any; output: any; }
  Arg: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Identifier: { input: any; output: any; }
  InstanceId: { input: any; output: any; }
  NodeHash: { input: any; output: any; }
  SearchQuery: { input: any; output: any; }
  ValidatorFunction: { input: any; output: any; }
};

export type AckInput = {
  assignation: Scalars['ID']['input'];
};

export type Agent = {
  __typename?: 'Agent';
  id: Scalars['ID']['output'];
  instanceId: Scalars['InstanceId']['output'];
  registry: Registry;
};

export type AgentFilter = {
  AND?: InputMaybe<AgentFilter>;
  OR?: InputMaybe<AgentFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  instanceId: Scalars['String']['input'];
};

export type App = {
  __typename?: 'App';
  id: Scalars['ID']['output'];
};

export type AssignInput = {
  args: Array<Scalars['Arg']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  reservation: Scalars['ID']['input'];
};

export type AssignWidget = {
  kind: AssignWidgetKind;
};

export type AssignWidgetInput = {
  asParagraph?: InputMaybe<Scalars['Boolean']['input']>;
  choices?: InputMaybe<Array<ChoiceInput>>;
  hook?: InputMaybe<Scalars['String']['input']>;
  kind: AssignWidgetKind;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['SearchQuery']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
  ward?: InputMaybe<Scalars['String']['input']>;
};

export enum AssignWidgetKind {
  Choice = 'CHOICE',
  Custom = 'CUSTOM',
  Search = 'SEARCH',
  Slider = 'SLIDER',
  String = 'STRING'
}

export type Assignation = {
  __typename?: 'Assignation';
  args: Scalars['AnyDefault']['output'];
  createdAt: Scalars['DateTime']['output'];
  events: Array<AssignationEvent>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  node: Node;
  parent: Assignation;
  reference?: Maybe<Scalars['String']['output']>;
  status: AssignationStatus;
  statusMessage?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  waiter: Waiter;
};


export type AssignationEventsArgs = {
  filters?: InputMaybe<AssignationEventFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type AssignationEvent = {
  __typename?: 'AssignationEvent';
  assignation: Assignation;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  kind: AssignationEventKind;
  level: LogLevel;
  name: Scalars['String']['output'];
  returns: Scalars['AnyDefault']['output'];
};

export type AssignationEventFilter = {
  AND?: InputMaybe<AssignationEventFilter>;
  OR?: InputMaybe<AssignationEventFilter>;
  kind?: InputMaybe<Array<AssignationEventKind>>;
};

export enum AssignationEventKind {
  Assign = 'ASSIGN',
  Bound = 'BOUND',
  Done = 'DONE',
  Log = 'LOG',
  Progress = 'PROGRESS',
  Unassign = 'UNASSIGN',
  Yield = 'YIELD'
}

export type AssignationFilter = {
  AND?: InputMaybe<AssignationFilter>;
  OR?: InputMaybe<AssignationFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  reservation?: InputMaybe<ReservationFilter>;
  status?: InputMaybe<Array<AssignationStatus>>;
};

export enum AssignationStatus {
  Assigning = 'ASSIGNING',
  Cancelled = 'CANCELLED',
  Critical = 'CRITICAL',
  Done = 'DONE',
  Ongoing = 'ONGOING'
}

export type Binds = {
  __typename?: 'Binds';
  clients: Array<Scalars['ID']['output']>;
  desiredInstances: Scalars['Int']['output'];
  templates: Array<Scalars['ID']['output']>;
};

export type BindsInput = {
  clients?: InputMaybe<Array<Scalars['String']['input']>>;
  desiredInstances?: Scalars['Int']['input'];
  templates?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ChildPort = {
  __typename?: 'ChildPort';
  assignWidget?: Maybe<AssignWidget>;
  child?: Maybe<ChildPort>;
  default?: Maybe<Scalars['AnyDefault']['output']>;
  identifier?: Maybe<Scalars['Identifier']['output']>;
  kind: PortKind;
  label?: Maybe<Scalars['String']['output']>;
  nullable: Scalars['Boolean']['output'];
  returnWidget?: Maybe<ReturnWidget>;
  scope: PortScope;
  variants?: Maybe<Array<ChildPort>>;
};

export type ChildPortInput = {
  assignWidget?: InputMaybe<AssignWidgetInput>;
  child?: InputMaybe<ChildPortInput>;
  default?: InputMaybe<Scalars['AnyDefault']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  effects?: InputMaybe<Array<EffectInput>>;
  identifier?: InputMaybe<Scalars['Identifier']['input']>;
  kind: PortKind;
  label?: InputMaybe<Scalars['String']['input']>;
  nullable: Scalars['Boolean']['input'];
  returnWidget?: InputMaybe<ReturnWidgetInput>;
  scope: PortScope;
  variants?: InputMaybe<Array<ChildPortInput>>;
};

export type Choice = {
  __typename?: 'Choice';
  description?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ChoiceAssignWidget = AssignWidget & {
  __typename?: 'ChoiceAssignWidget';
  choices?: Maybe<Array<Choice>>;
  kind: AssignWidgetKind;
};

export type ChoiceInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  value: Scalars['AnyDefault']['input'];
};

export type ChoiceReturnWidget = ReturnWidget & {
  __typename?: 'ChoiceReturnWidget';
  choices?: Maybe<Array<Choice>>;
  kind: ReturnWidgetKind;
};

export type Collection = {
  __typename?: 'Collection';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nodes: Array<Node>;
};


export type CollectionNodesArgs = {
  filters?: InputMaybe<NodeFilter>;
  order?: InputMaybe<NodeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type CreateTemplateInput = {
  definition: DefinitionInput;
  dependencies?: InputMaybe<DependencyInput>;
  instanceId?: InputMaybe<Scalars['InstanceId']['input']>;
  interface: Scalars['String']['input'];
  params?: InputMaybe<Scalars['AnyDefault']['input']>;
};

export type CreateTestCaseInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isBenchmark?: Scalars['Boolean']['input'];
  key: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  node: Scalars['ID']['input'];
};

export type CreateTestResultInput = {
  case: Scalars['ID']['input'];
  passed: Scalars['Boolean']['input'];
  result?: InputMaybe<Scalars['String']['input']>;
  template: Scalars['ID']['input'];
};

export type CustomAssignWidget = AssignWidget & {
  __typename?: 'CustomAssignWidget';
  hook: Scalars['String']['output'];
  kind: AssignWidgetKind;
  ward: Scalars['String']['output'];
};

export type CustomEffect = Effect & {
  __typename?: 'CustomEffect';
  dependencies: Array<EffectDependency>;
  hook: Scalars['String']['output'];
  kind: EffectKind;
  ward: Scalars['String']['output'];
};

export type CustomReturnWidget = ReturnWidget & {
  __typename?: 'CustomReturnWidget';
  hook: Scalars['String']['output'];
  kind: ReturnWidgetKind;
  ward: Scalars['String']['output'];
};

export type DefinitionInput = {
  args?: InputMaybe<Array<PortInput>>;
  collections?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  interfaces?: InputMaybe<Array<Scalars['String']['input']>>;
  isTestFor?: InputMaybe<Array<Scalars['String']['input']>>;
  kind: NodeKind;
  name: Scalars['String']['input'];
  portGroups?: InputMaybe<Array<PortGroupInput>>;
  returns?: InputMaybe<Array<PortInput>>;
};

export type DependencyInput = {
  binds?: InputMaybe<BindsInput>;
  hash?: InputMaybe<Scalars['NodeHash']['input']>;
  node?: InputMaybe<Scalars['ID']['input']>;
  optional?: Scalars['Boolean']['input'];
  reference?: InputMaybe<Scalars['String']['input']>;
  viableInstances?: InputMaybe<Scalars['Int']['input']>;
};

export type Effect = {
  dependencies: Array<EffectDependency>;
  kind: EffectKind;
};

export type EffectDependency = {
  __typename?: 'EffectDependency';
  condition: LogicalCondition;
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type EffectDependencyInput = {
  condition: LogicalCondition;
  key: Scalars['String']['input'];
  value: Scalars['AnyDefault']['input'];
};

export type EffectInput = {
  dependencies: Array<EffectDependencyInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  kind: EffectKind;
  label: Scalars['String']['input'];
};

export enum EffectKind {
  Custom = 'CUSTOM',
  Message = 'MESSAGE'
}

export enum LogLevel {
  Critical = 'CRITICAL',
  Debug = 'DEBUG',
  Error = 'ERROR',
  Info = 'INFO',
  Warn = 'WARN'
}

export enum LogicalCondition {
  In = 'IN',
  Is = 'IS',
  IsNot = 'IS_NOT'
}

export type MessageEffect = Effect & {
  __typename?: 'MessageEffect';
  dependencies: Array<EffectDependency>;
  kind: EffectKind;
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  ack: Assignation;
  assign: Assignation;
  createTemplate: Template;
  createTestCase: TestCase;
  createTestResult: TestResult;
  reserve: Reservation;
  unassign: Assignation;
  unreserve: Reservation;
};


export type MutationAckArgs = {
  input: AckInput;
};


export type MutationAssignArgs = {
  input: AssignInput;
};


export type MutationCreateTemplateArgs = {
  input: CreateTemplateInput;
};


export type MutationCreateTestCaseArgs = {
  input: CreateTestCaseInput;
};


export type MutationCreateTestResultArgs = {
  input: CreateTestResultInput;
};


export type MutationReserveArgs = {
  input: ReserveInput;
};


export type MutationUnassignArgs = {
  input: UnassignInput;
};


export type MutationUnreserveArgs = {
  input: UnreserveInput;
};

export type Node = {
  __typename?: 'Node';
  args: Array<Port>;
  collections: Array<Collection>;
  definedAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  hash: Scalars['NodeHash']['output'];
  id: Scalars['ID']['output'];
  isTestFor: Array<Node>;
  kind: NodeKind;
  name: Scalars['String']['output'];
  portGroups: Array<PortGroup>;
  protocols: Array<Protocol>;
  returns: Array<Port>;
  scope: NodeScope;
  templates: Array<Template>;
  tests: Array<Node>;
};


export type NodeIsTestForArgs = {
  filters?: InputMaybe<NodeFilter>;
  order?: InputMaybe<NodeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type NodeTemplatesArgs = {
  filters?: InputMaybe<TemplateFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type NodeTestsArgs = {
  filters?: InputMaybe<NodeFilter>;
  order?: InputMaybe<NodeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type NodeFilter = {
  AND?: InputMaybe<NodeFilter>;
  OR?: InputMaybe<NodeFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export enum NodeKind {
  Function = 'FUNCTION',
  Generator = 'GENERATOR'
}

export type NodeOrder = {
  definedAt?: InputMaybe<Ordering>;
};

export enum NodeScope {
  BridgeGlobalToLocal = 'BRIDGE_GLOBAL_TO_LOCAL',
  BridgeLocalToGlobal = 'BRIDGE_LOCAL_TO_GLOBAL',
  Global = 'GLOBAL',
  Local = 'LOCAL'
}

export type OffsetPaginationInput = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export enum Ordering {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Port = {
  __typename?: 'Port';
  assignWidget?: Maybe<AssignWidget>;
  child?: Maybe<ChildPort>;
  default?: Maybe<Scalars['AnyDefault']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  effects?: Maybe<Array<Effect>>;
  groups?: Maybe<Array<Scalars['String']['output']>>;
  identifier?: Maybe<Scalars['Identifier']['output']>;
  key: Scalars['String']['output'];
  kind: PortKind;
  label?: Maybe<Scalars['String']['output']>;
  nullable: Scalars['Boolean']['output'];
  returnWidget?: Maybe<ReturnWidget>;
  scope: PortScope;
  validators?: Maybe<Array<Validator>>;
  variants?: Maybe<Array<ChildPort>>;
};

export type PortGroup = {
  __typename?: 'PortGroup';
  hidden: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
};

export type PortGroupInput = {
  hidden: Scalars['Boolean']['input'];
  key: Scalars['String']['input'];
};

export type PortInput = {
  assignWidget?: InputMaybe<AssignWidgetInput>;
  child?: InputMaybe<ChildPortInput>;
  default?: InputMaybe<Scalars['AnyDefault']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  effects?: InputMaybe<Array<EffectInput>>;
  groups?: InputMaybe<Array<Scalars['String']['input']>>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  kind: PortKind;
  label?: InputMaybe<Scalars['String']['input']>;
  nullable: Scalars['Boolean']['input'];
  returnWidget?: InputMaybe<ReturnWidgetInput>;
  scope: PortScope;
  validators?: InputMaybe<Array<ValidatorInput>>;
  variants?: InputMaybe<Array<ChildPortInput>>;
};

export enum PortKind {
  Bool = 'BOOL',
  Date = 'DATE',
  Dict = 'DICT',
  Float = 'FLOAT',
  Int = 'INT',
  List = 'LIST',
  String = 'STRING',
  Structure = 'STRUCTURE',
  Union = 'UNION'
}

export enum PortScope {
  Global = 'GLOBAL',
  Local = 'LOCAL'
}

export type Protocol = {
  __typename?: 'Protocol';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nodes: Array<Node>;
};


export type ProtocolNodesArgs = {
  filters?: InputMaybe<NodeFilter>;
  order?: InputMaybe<NodeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type Provision = {
  __typename?: 'Provision';
  agent: Agent;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  status: ProvisionStatus;
  template: Template;
};

export type ProvisionEvent = {
  __typename?: 'ProvisionEvent';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  kind: ProvisionEventKind;
  level: LogLevel;
  provision: Provision;
};

export enum ProvisionEventKind {
  Change = 'CHANGE',
  Log = 'LOG'
}

export type ProvisionFilter = {
  AND?: InputMaybe<ProvisionFilter>;
  OR?: InputMaybe<ProvisionFilter>;
  agent?: InputMaybe<AgentFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  status?: InputMaybe<Array<ProvisionStatus>>;
};

export enum ProvisionStatus {
  Active = 'ACTIVE',
  Bound = 'BOUND',
  Canceling = 'CANCELING',
  Cancelled = 'CANCELLED',
  Critical = 'CRITICAL',
  Denied = 'DENIED',
  Disconnected = 'DISCONNECTED',
  Ended = 'ENDED',
  Error = 'ERROR',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
  Providing = 'PROVIDING',
  Reconnecting = 'RECONNECTING',
  Refused = 'REFUSED'
}

export type Query = {
  __typename?: 'Query';
  agent: Agent;
  assignation: Assignation;
  assignations: Array<Assignation>;
  myreservations: Array<Reservation>;
  node: Node;
  nodes: Array<Node>;
  provision: Provision;
  provisions: Array<Provision>;
  reservation: Reservation;
  reservations: Array<Reservation>;
  template: Template;
  templates: Array<Template>;
  testCase: TestCase;
  testCases: Array<TestCase>;
  testResult: TestResult;
  testResults: Array<TestResult>;
};


export type QueryAgentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAssignationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAssignationsArgs = {
  filters?: InputMaybe<AssignationFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMyreservationsArgs = {
  instanceId?: InputMaybe<Scalars['InstanceId']['input']>;
};


export type QueryNodeArgs = {
  assignation?: InputMaybe<Scalars['ID']['input']>;
  hash?: InputMaybe<Scalars['NodeHash']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  reservation?: InputMaybe<Scalars['ID']['input']>;
  template?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryNodesArgs = {
  filters?: InputMaybe<NodeFilter>;
  order?: InputMaybe<NodeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryProvisionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProvisionsArgs = {
  filters?: InputMaybe<ProvisionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryReservationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReservationsArgs = {
  filters?: InputMaybe<ReservationFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTemplatesArgs = {
  filters?: InputMaybe<TemplateFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryTestCaseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTestCasesArgs = {
  filters?: InputMaybe<TestCaseFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryTestResultArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTestResultsArgs = {
  filters?: InputMaybe<TestResultFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type Registry = {
  __typename?: 'Registry';
  agents: Array<Agent>;
  app: App;
  id: Scalars['ID']['output'];
  user: User;
};


export type RegistryAgentsArgs = {
  filters?: InputMaybe<AgentFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type Reservation = {
  __typename?: 'Reservation';
  binds?: Maybe<Binds>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  node: Node;
  provisions: Array<Provision>;
  reference: Scalars['String']['output'];
  status: ReservationStatus;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  waiter: Waiter;
};


export type ReservationProvisionsArgs = {
  filters?: InputMaybe<ProvisionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ReservationEvent = {
  __typename?: 'ReservationEvent';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  kind: ReservationEventKind;
  level: LogLevel;
  reservation: Reservation;
};

export enum ReservationEventKind {
  Change = 'CHANGE',
  Log = 'LOG'
}

export type ReservationFilter = {
  AND?: InputMaybe<ReservationFilter>;
  OR?: InputMaybe<ReservationFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  status?: InputMaybe<Array<ReservationStatus>>;
  waiter?: InputMaybe<WaiterFilter>;
};

export enum ReservationStatus {
  Active = 'ACTIVE',
  Ended = 'ENDED',
  Inactive = 'INACTIVE',
  Unconnected = 'UNCONNECTED'
}

export type ReserveInput = {
  binds?: InputMaybe<BindsInput>;
  hash?: InputMaybe<Scalars['NodeHash']['input']>;
  instanceId: Scalars['InstanceId']['input'];
  node?: InputMaybe<Scalars['ID']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  template?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ReturnWidget = {
  kind: ReturnWidgetKind;
};

export type ReturnWidgetInput = {
  choices?: InputMaybe<Array<ChoiceInput>>;
  hook?: InputMaybe<Scalars['String']['input']>;
  kind: ReturnWidgetKind;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['SearchQuery']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
  ward?: InputMaybe<Scalars['String']['input']>;
};

export enum ReturnWidgetKind {
  Choice = 'CHOICE',
  Custom = 'CUSTOM'
}

export type SearchAssignWidget = AssignWidget & {
  __typename?: 'SearchAssignWidget';
  kind: AssignWidgetKind;
  query: Scalars['String']['output'];
  ward: Scalars['String']['output'];
};

export type SliderAssignWidget = AssignWidget & {
  __typename?: 'SliderAssignWidget';
  kind: AssignWidgetKind;
  max?: Maybe<Scalars['Int']['output']>;
  min?: Maybe<Scalars['Int']['output']>;
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

export type StringAssignWidget = AssignWidget & {
  __typename?: 'StringAssignWidget';
  asParagraph: Scalars['Boolean']['output'];
  kind: AssignWidgetKind;
  placeholder: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  assignations: AssignationEvent;
  newNodes: Node;
  provisions: ProvisionEvent;
  reservations: ReservationEvent;
};


export type SubscriptionAssignationsArgs = {
  instanceId: Scalars['InstanceId']['input'];
};


export type SubscriptionNewNodesArgs = {
  cage: Scalars['ID']['input'];
};


export type SubscriptionProvisionsArgs = {
  instanceId: Scalars['InstanceId']['input'];
};


export type SubscriptionReservationsArgs = {
  instanceId: Scalars['InstanceId']['input'];
};

export type Template = {
  __typename?: 'Template';
  agent: Agent;
  id: Scalars['ID']['output'];
  interface: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  node: Node;
  params: Scalars['AnyDefault']['output'];
};

export type TemplateFilter = {
  AND?: InputMaybe<TemplateFilter>;
  OR?: InputMaybe<TemplateFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  interface?: InputMaybe<StrFilterLookup>;
};

export type TestCase = {
  __typename?: 'TestCase';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isBenchmark: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  node: Node;
  results: Array<TestResult>;
};


export type TestCaseResultsArgs = {
  filters?: InputMaybe<TestResultFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type TestCaseFilter = {
  AND?: InputMaybe<TestCaseFilter>;
  OR?: InputMaybe<TestCaseFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
};

export type TestResult = {
  __typename?: 'TestResult';
  case: TestCase;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  passed: Scalars['Boolean']['output'];
  template: Template;
  updatedAt: Scalars['DateTime']['output'];
};

export type TestResultFilter = {
  AND?: InputMaybe<TestResultFilter>;
  OR?: InputMaybe<TestResultFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
};

export type UnassignInput = {
  assignation: Scalars['ID']['input'];
};

export type UnreserveInput = {
  reservation: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
};

export type Validator = {
  __typename?: 'Validator';
  dependencies?: Maybe<Array<Scalars['String']['output']>>;
  function: Scalars['ValidatorFunction']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type ValidatorInput = {
  dependencies?: InputMaybe<Array<Scalars['String']['input']>>;
  function: Scalars['ValidatorFunction']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
};

export type Waiter = {
  __typename?: 'Waiter';
  id: Scalars['ID']['output'];
  instanceId: Scalars['InstanceId']['output'];
  registry: Registry;
};

export type WaiterFilter = {
  AND?: InputMaybe<WaiterFilter>;
  OR?: InputMaybe<WaiterFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  instanceId: Scalars['InstanceId']['input'];
};

export type PostmanAssignationFragment = { __typename?: 'Assignation', id: string, status: AssignationStatus, args: any, reference?: string | null };

export type AssignationEventFragment = { __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level: LogLevel, returns: any, createdAt: any, assignation: { __typename?: 'Assignation', id: string } };

export type ListNodeFragment = { __typename?: 'Node', id: string, name: string, description?: string | null };

export type GraphNodeNodeFragment = { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, hidden: boolean }> };

export type StringAssignWidgetFragment = { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean };

export type SliderAssignWidgetFragment = { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null };

export type SearchAssignWidgetFragment = { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string };

export type CustomAssignWidgetFragment = { __typename: 'CustomAssignWidget', ward: string, hook: string };

export type ChoiceAssignWidgetFragment = { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null };

export type ChildPortNestedFragment = { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null };

export type ChildPortFragment = { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null };

export type EffectDependencyFragment = { __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string };

export type CustomEffectFragment = { __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string };

export type MessageEffectFragment = { __typename: 'MessageEffect', kind: EffectKind, message: string };

type PortEffect_CustomEffect_Fragment = { __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> };

type PortEffect_MessageEffect_Fragment = { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> };

export type PortEffectFragment = PortEffect_CustomEffect_Fragment | PortEffect_MessageEffect_Fragment;

type AssignWidget_ChoiceAssignWidget_Fragment = { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null };

type AssignWidget_CustomAssignWidget_Fragment = { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string };

type AssignWidget_SearchAssignWidget_Fragment = { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string };

type AssignWidget_SliderAssignWidget_Fragment = { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null };

type AssignWidget_StringAssignWidget_Fragment = { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean };

export type AssignWidgetFragment = AssignWidget_ChoiceAssignWidget_Fragment | AssignWidget_CustomAssignWidget_Fragment | AssignWidget_SearchAssignWidget_Fragment | AssignWidget_SliderAssignWidget_Fragment | AssignWidget_StringAssignWidget_Fragment;

export type ValidatorFragment = { __typename?: 'Validator', function: any, dependencies?: Array<string> | null };

export type PortFragment = { __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null };

export type CustomReturnWidgetFragment = { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string };

export type ChoiceReturnWidgetFragment = { __typename: 'ChoiceReturnWidget', choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null };

type ReturnWidget_ChoiceReturnWidget_Fragment = { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null };

type ReturnWidget_CustomReturnWidget_Fragment = { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string };

export type ReturnWidgetFragment = ReturnWidget_ChoiceReturnWidget_Fragment | ReturnWidget_CustomReturnWidget_Fragment;

export type PortGroupFragment = { __typename?: 'PortGroup', key: string, hidden: boolean };

export type PortsFragment = { __typename?: 'Node', args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, hidden: boolean }> };

export type BindsFragment = { __typename?: 'Binds', templates: Array<string> };

export type PostmanReservationFragment = { __typename?: 'Reservation', title?: string | null, status: ReservationStatus, id: string, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, hidden: boolean }> }, binds?: { __typename?: 'Binds', templates: Array<string> } | null };

export type ReservationEventFragment = { __typename?: 'ReservationEvent', id: string, kind: ReservationEventKind, level: LogLevel, createdAt: any, reservation: { __typename?: 'Reservation', id: string } };

export type DetailTemplateFragment = { __typename?: 'Template', id: string, interface: string };

export type AcknowledgeMutationVariables = Exact<{
  assignation: Scalars['ID']['input'];
}>;


export type AcknowledgeMutation = { __typename?: 'Mutation', ack: { __typename?: 'Assignation', id: string, status: AssignationStatus, args: any, reference?: string | null } };

export type AssignMutationVariables = Exact<{
  reservation: Scalars['ID']['input'];
  args: Array<Scalars['Arg']['input']>;
}>;


export type AssignMutation = { __typename?: 'Mutation', assign: { __typename?: 'Assignation', id: string, status: AssignationStatus, args: any, reference?: string | null } };

export type ReserveMutationVariables = Exact<{
  instanceId: Scalars['InstanceId']['input'];
  node?: InputMaybe<Scalars['ID']['input']>;
  hash?: InputMaybe<Scalars['NodeHash']['input']>;
  template?: InputMaybe<Scalars['ID']['input']>;
  binds?: InputMaybe<BindsInput>;
  title?: InputMaybe<Scalars['String']['input']>;
}>;


export type ReserveMutation = { __typename?: 'Mutation', reserve: { __typename?: 'Reservation', title?: string | null, status: ReservationStatus, id: string, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, hidden: boolean }> }, binds?: { __typename?: 'Binds', templates: Array<string> } | null } };

export type UnassignMutationVariables = Exact<{
  assignation: Scalars['ID']['input'];
}>;


export type UnassignMutation = { __typename?: 'Mutation', unassign: { __typename?: 'Assignation', id: string } };

export type UnreserveMutationVariables = Exact<{
  reservation: Scalars['ID']['input'];
}>;


export type UnreserveMutation = { __typename?: 'Mutation', unreserve: { __typename?: 'Reservation', id: string } };

export type AssignationsQueryVariables = Exact<{
  instanceId: Scalars['InstanceId']['input'];
}>;


export type AssignationsQuery = { __typename?: 'Query', assignations: Array<{ __typename?: 'Assignation', id: string, status: AssignationStatus, args: any, reference?: string | null }> };

export type NodeSearchQueryVariables = Exact<{
  filters?: InputMaybe<NodeFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type NodeSearchQuery = { __typename?: 'Query', nodes: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null }> };

export type ConstantNodeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ConstantNodeQuery = { __typename?: 'Query', node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, hidden: boolean }> } };

export type AssignNodeQueryVariables = Exact<{
  reservation: Scalars['ID']['input'];
}>;


export type AssignNodeQuery = { __typename?: 'Query', node: { __typename?: 'Node', name: string, description?: string | null, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, hidden: boolean }> } };

export type ReturnNodeQueryVariables = Exact<{
  assignation: Scalars['ID']['input'];
}>;


export type ReturnNodeQuery = { __typename?: 'Query', node: { __typename?: 'Node', name: string, description?: string | null, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, hidden: boolean }> } };

export type AllNodesQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<NodeFilter>;
  order?: InputMaybe<NodeOrder>;
}>;


export type AllNodesQuery = { __typename?: 'Query', nodes: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null }> };

export type ReservationsQueryVariables = Exact<{
  instanceId: Scalars['InstanceId']['input'];
}>;


export type ReservationsQuery = { __typename?: 'Query', myreservations: Array<{ __typename?: 'Reservation', title?: string | null, status: ReservationStatus, id: string, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, hidden: boolean }> }, binds?: { __typename?: 'Binds', templates: Array<string> } | null }> };

export type DetailReservationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailReservationQuery = { __typename?: 'Query', reservation: { __typename?: 'Reservation', title?: string | null, status: ReservationStatus, id: string, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, groups?: Array<string> | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<{ __typename?: 'EffectDependency', key: string, condition: LogicalCondition, value: string }> }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, nullable: boolean, child?: { __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, child?: { __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null } | null, variants?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, hidden: boolean }> }, binds?: { __typename?: 'Binds', templates: Array<string> } | null } };

export type TemplateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TemplateQuery = { __typename?: 'Query', template: { __typename?: 'Template', id: string, interface: string } };

export const PostmanAssignationFragmentDoc = gql`
    fragment PostmanAssignation on Assignation {
  id
  status
  args
  reference
}
    `;
export const AssignationEventFragmentDoc = gql`
    fragment AssignationEvent on AssignationEvent {
  id
  kind
  level
  returns
  assignation {
    id
  }
  createdAt
}
    `;
export const ListNodeFragmentDoc = gql`
    fragment ListNode on Node {
  id
  name
  description
}
    `;
export const EffectDependencyFragmentDoc = gql`
    fragment EffectDependency on EffectDependency {
  key
  condition
  value
}
    `;
export const CustomEffectFragmentDoc = gql`
    fragment CustomEffect on CustomEffect {
  __typename
  kind
  hook
  ward
}
    `;
export const MessageEffectFragmentDoc = gql`
    fragment MessageEffect on MessageEffect {
  __typename
  kind
  message
}
    `;
export const PortEffectFragmentDoc = gql`
    fragment PortEffect on Effect {
  __typename
  kind
  dependencies {
    ...EffectDependency
  }
  ...CustomEffect
  ...MessageEffect
}
    ${EffectDependencyFragmentDoc}
${CustomEffectFragmentDoc}
${MessageEffectFragmentDoc}`;
export const StringAssignWidgetFragmentDoc = gql`
    fragment StringAssignWidget on StringAssignWidget {
  __typename
  kind
  placeholder
  asParagraph
}
    `;
export const SearchAssignWidgetFragmentDoc = gql`
    fragment SearchAssignWidget on SearchAssignWidget {
  __typename
  kind
  query
  ward
}
    `;
export const SliderAssignWidgetFragmentDoc = gql`
    fragment SliderAssignWidget on SliderAssignWidget {
  __typename
  kind
  min
  max
}
    `;
export const ChoiceAssignWidgetFragmentDoc = gql`
    fragment ChoiceAssignWidget on ChoiceAssignWidget {
  __typename
  kind
  choices {
    value
    label
    description
  }
}
    `;
export const CustomAssignWidgetFragmentDoc = gql`
    fragment CustomAssignWidget on CustomAssignWidget {
  __typename
  ward
  hook
}
    `;
export const AssignWidgetFragmentDoc = gql`
    fragment AssignWidget on AssignWidget {
  __typename
  kind
  ...StringAssignWidget
  ...SearchAssignWidget
  ...SliderAssignWidget
  ...ChoiceAssignWidget
  ...CustomAssignWidget
}
    ${StringAssignWidgetFragmentDoc}
${SearchAssignWidgetFragmentDoc}
${SliderAssignWidgetFragmentDoc}
${ChoiceAssignWidgetFragmentDoc}
${CustomAssignWidgetFragmentDoc}`;
export const CustomReturnWidgetFragmentDoc = gql`
    fragment CustomReturnWidget on CustomReturnWidget {
  __typename
  kind
  hook
  ward
}
    `;
export const ChoiceReturnWidgetFragmentDoc = gql`
    fragment ChoiceReturnWidget on ChoiceReturnWidget {
  __typename
  choices {
    label
    value
    description
  }
}
    `;
export const ReturnWidgetFragmentDoc = gql`
    fragment ReturnWidget on ReturnWidget {
  __typename
  kind
  ...CustomReturnWidget
  ...ChoiceReturnWidget
}
    ${CustomReturnWidgetFragmentDoc}
${ChoiceReturnWidgetFragmentDoc}`;
export const ChildPortNestedFragmentDoc = gql`
    fragment ChildPortNested on ChildPort {
  __typename
  kind
  identifier
  child {
    kind
    identifier
    scope
    assignWidget {
      ...AssignWidget
    }
    returnWidget {
      ...ReturnWidget
    }
  }
  variants {
    kind
    identifier
    scope
    assignWidget {
      ...AssignWidget
    }
    returnWidget {
      ...ReturnWidget
    }
  }
  scope
  assignWidget {
    ...AssignWidget
  }
  returnWidget {
    ...ReturnWidget
  }
}
    ${AssignWidgetFragmentDoc}
${ReturnWidgetFragmentDoc}`;
export const ChildPortFragmentDoc = gql`
    fragment ChildPort on ChildPort {
  __typename
  kind
  identifier
  scope
  child {
    ...ChildPortNested
  }
  variants {
    ...ChildPortNested
  }
  assignWidget {
    ...AssignWidget
  }
  returnWidget {
    ...ReturnWidget
  }
  nullable
}
    ${ChildPortNestedFragmentDoc}
${AssignWidgetFragmentDoc}
${ReturnWidgetFragmentDoc}`;
export const ValidatorFragmentDoc = gql`
    fragment Validator on Validator {
  function
  dependencies
}
    `;
export const PortFragmentDoc = gql`
    fragment Port on Port {
  __typename
  key
  label
  nullable
  description
  scope
  effects {
    ...PortEffect
  }
  assignWidget {
    ...AssignWidget
  }
  returnWidget {
    ...ReturnWidget
  }
  kind
  identifier
  child {
    ...ChildPort
  }
  variants {
    ...ChildPort
  }
  default
  nullable
  groups
  validators {
    ...Validator
  }
}
    ${PortEffectFragmentDoc}
${AssignWidgetFragmentDoc}
${ReturnWidgetFragmentDoc}
${ChildPortFragmentDoc}
${ValidatorFragmentDoc}`;
export const PortGroupFragmentDoc = gql`
    fragment PortGroup on PortGroup {
  key
  hidden
}
    `;
export const PortsFragmentDoc = gql`
    fragment Ports on Node {
  args {
    ...Port
  }
  returns {
    ...Port
  }
  portGroups {
    ...PortGroup
  }
}
    ${PortFragmentDoc}
${PortGroupFragmentDoc}`;
export const GraphNodeNodeFragmentDoc = gql`
    fragment GraphNodeNode on Node {
  name
  description
  kind
  hash
  id
  collections {
    id
    name
  }
  ...Ports
  protocols {
    name
  }
}
    ${PortsFragmentDoc}`;
export const BindsFragmentDoc = gql`
    fragment Binds on Binds {
  templates
}
    `;
export const PostmanReservationFragmentDoc = gql`
    fragment PostmanReservation on Reservation {
  title
  status
  id
  reference
  node {
    ...Ports
    name
    description
  }
  binds {
    ...Binds
  }
}
    ${PortsFragmentDoc}
${BindsFragmentDoc}`;
export const ReservationEventFragmentDoc = gql`
    fragment ReservationEvent on ReservationEvent {
  id
  kind
  level
  reservation {
    id
  }
  createdAt
}
    `;
export const DetailTemplateFragmentDoc = gql`
    fragment DetailTemplate on Template {
  id
  interface
}
    `;
export const AcknowledgeDocument = gql`
    mutation Acknowledge($assignation: ID!) {
  ack(input: {assignation: $assignation}) {
    ...PostmanAssignation
  }
}
    ${PostmanAssignationFragmentDoc}`;
export type AcknowledgeMutationFn = Apollo.MutationFunction<AcknowledgeMutation, AcknowledgeMutationVariables>;

/**
 * __useAcknowledgeMutation__
 *
 * To run a mutation, you first call `useAcknowledgeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcknowledgeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acknowledgeMutation, { data, loading, error }] = useAcknowledgeMutation({
 *   variables: {
 *      assignation: // value for 'assignation'
 *   },
 * });
 */
export function useAcknowledgeMutation(baseOptions?: Apollo.MutationHookOptions<AcknowledgeMutation, AcknowledgeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcknowledgeMutation, AcknowledgeMutationVariables>(AcknowledgeDocument, options);
      }
export type AcknowledgeMutationHookResult = ReturnType<typeof useAcknowledgeMutation>;
export type AcknowledgeMutationResult = Apollo.MutationResult<AcknowledgeMutation>;
export type AcknowledgeMutationOptions = Apollo.BaseMutationOptions<AcknowledgeMutation, AcknowledgeMutationVariables>;
export const AssignDocument = gql`
    mutation Assign($reservation: ID!, $args: [Arg!]!) {
  assign(input: {reservation: $reservation, args: $args}) {
    ...PostmanAssignation
  }
}
    ${PostmanAssignationFragmentDoc}`;
export type AssignMutationFn = Apollo.MutationFunction<AssignMutation, AssignMutationVariables>;

/**
 * __useAssignMutation__
 *
 * To run a mutation, you first call `useAssignMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignMutation, { data, loading, error }] = useAssignMutation({
 *   variables: {
 *      reservation: // value for 'reservation'
 *      args: // value for 'args'
 *   },
 * });
 */
export function useAssignMutation(baseOptions?: Apollo.MutationHookOptions<AssignMutation, AssignMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignMutation, AssignMutationVariables>(AssignDocument, options);
      }
export type AssignMutationHookResult = ReturnType<typeof useAssignMutation>;
export type AssignMutationResult = Apollo.MutationResult<AssignMutation>;
export type AssignMutationOptions = Apollo.BaseMutationOptions<AssignMutation, AssignMutationVariables>;
export const ReserveDocument = gql`
    mutation Reserve($instanceId: InstanceId!, $node: ID, $hash: NodeHash, $template: ID, $binds: BindsInput, $title: String) {
  reserve(
    input: {instanceId: $instanceId, node: $node, template: $template, hash: $hash, binds: $binds, title: $title}
  ) {
    ...PostmanReservation
  }
}
    ${PostmanReservationFragmentDoc}`;
export type ReserveMutationFn = Apollo.MutationFunction<ReserveMutation, ReserveMutationVariables>;

/**
 * __useReserveMutation__
 *
 * To run a mutation, you first call `useReserveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReserveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reserveMutation, { data, loading, error }] = useReserveMutation({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *      node: // value for 'node'
 *      hash: // value for 'hash'
 *      template: // value for 'template'
 *      binds: // value for 'binds'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useReserveMutation(baseOptions?: Apollo.MutationHookOptions<ReserveMutation, ReserveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReserveMutation, ReserveMutationVariables>(ReserveDocument, options);
      }
export type ReserveMutationHookResult = ReturnType<typeof useReserveMutation>;
export type ReserveMutationResult = Apollo.MutationResult<ReserveMutation>;
export type ReserveMutationOptions = Apollo.BaseMutationOptions<ReserveMutation, ReserveMutationVariables>;
export const UnassignDocument = gql`
    mutation Unassign($assignation: ID!) {
  unassign(input: {assignation: $assignation}) {
    id
  }
}
    `;
export type UnassignMutationFn = Apollo.MutationFunction<UnassignMutation, UnassignMutationVariables>;

/**
 * __useUnassignMutation__
 *
 * To run a mutation, you first call `useUnassignMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnassignMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unassignMutation, { data, loading, error }] = useUnassignMutation({
 *   variables: {
 *      assignation: // value for 'assignation'
 *   },
 * });
 */
export function useUnassignMutation(baseOptions?: Apollo.MutationHookOptions<UnassignMutation, UnassignMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnassignMutation, UnassignMutationVariables>(UnassignDocument, options);
      }
export type UnassignMutationHookResult = ReturnType<typeof useUnassignMutation>;
export type UnassignMutationResult = Apollo.MutationResult<UnassignMutation>;
export type UnassignMutationOptions = Apollo.BaseMutationOptions<UnassignMutation, UnassignMutationVariables>;
export const UnreserveDocument = gql`
    mutation Unreserve($reservation: ID!) {
  unreserve(input: {reservation: $reservation}) {
    id
  }
}
    `;
export type UnreserveMutationFn = Apollo.MutationFunction<UnreserveMutation, UnreserveMutationVariables>;

/**
 * __useUnreserveMutation__
 *
 * To run a mutation, you first call `useUnreserveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnreserveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unreserveMutation, { data, loading, error }] = useUnreserveMutation({
 *   variables: {
 *      reservation: // value for 'reservation'
 *   },
 * });
 */
export function useUnreserveMutation(baseOptions?: Apollo.MutationHookOptions<UnreserveMutation, UnreserveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnreserveMutation, UnreserveMutationVariables>(UnreserveDocument, options);
      }
export type UnreserveMutationHookResult = ReturnType<typeof useUnreserveMutation>;
export type UnreserveMutationResult = Apollo.MutationResult<UnreserveMutation>;
export type UnreserveMutationOptions = Apollo.BaseMutationOptions<UnreserveMutation, UnreserveMutationVariables>;
export const AssignationsDocument = gql`
    query Assignations($instanceId: InstanceId!) {
  assignations(
    filters: {status: [DONE, CRITICAL, CANCELLED], reservation: {waiter: {instanceId: $instanceId}}}
  ) {
    ...PostmanAssignation
  }
}
    ${PostmanAssignationFragmentDoc}`;

/**
 * __useAssignationsQuery__
 *
 * To run a query within a React component, call `useAssignationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAssignationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAssignationsQuery({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *   },
 * });
 */
export function useAssignationsQuery(baseOptions: Apollo.QueryHookOptions<AssignationsQuery, AssignationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AssignationsQuery, AssignationsQueryVariables>(AssignationsDocument, options);
      }
export function useAssignationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AssignationsQuery, AssignationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AssignationsQuery, AssignationsQueryVariables>(AssignationsDocument, options);
        }
export type AssignationsQueryHookResult = ReturnType<typeof useAssignationsQuery>;
export type AssignationsLazyQueryHookResult = ReturnType<typeof useAssignationsLazyQuery>;
export type AssignationsQueryResult = Apollo.QueryResult<AssignationsQuery, AssignationsQueryVariables>;
export const NodeSearchDocument = gql`
    query NodeSearch($filters: NodeFilter, $pagination: OffsetPaginationInput) {
  nodes: nodes(filters: $filters, pagination: $pagination) {
    ...ListNode
  }
}
    ${ListNodeFragmentDoc}`;

/**
 * __useNodeSearchQuery__
 *
 * To run a query within a React component, call `useNodeSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useNodeSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNodeSearchQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useNodeSearchQuery(baseOptions?: Apollo.QueryHookOptions<NodeSearchQuery, NodeSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NodeSearchQuery, NodeSearchQueryVariables>(NodeSearchDocument, options);
      }
export function useNodeSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NodeSearchQuery, NodeSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NodeSearchQuery, NodeSearchQueryVariables>(NodeSearchDocument, options);
        }
export type NodeSearchQueryHookResult = ReturnType<typeof useNodeSearchQuery>;
export type NodeSearchLazyQueryHookResult = ReturnType<typeof useNodeSearchLazyQuery>;
export type NodeSearchQueryResult = Apollo.QueryResult<NodeSearchQuery, NodeSearchQueryVariables>;
export const ConstantNodeDocument = gql`
    query ConstantNode($id: ID!) {
  node(id: $id) {
    ...GraphNodeNode
  }
}
    ${GraphNodeNodeFragmentDoc}`;

/**
 * __useConstantNodeQuery__
 *
 * To run a query within a React component, call `useConstantNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useConstantNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConstantNodeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useConstantNodeQuery(baseOptions: Apollo.QueryHookOptions<ConstantNodeQuery, ConstantNodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConstantNodeQuery, ConstantNodeQueryVariables>(ConstantNodeDocument, options);
      }
export function useConstantNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConstantNodeQuery, ConstantNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConstantNodeQuery, ConstantNodeQueryVariables>(ConstantNodeDocument, options);
        }
export type ConstantNodeQueryHookResult = ReturnType<typeof useConstantNodeQuery>;
export type ConstantNodeLazyQueryHookResult = ReturnType<typeof useConstantNodeLazyQuery>;
export type ConstantNodeQueryResult = Apollo.QueryResult<ConstantNodeQuery, ConstantNodeQueryVariables>;
export const AssignNodeDocument = gql`
    query AssignNode($reservation: ID!) {
  node(reservation: $reservation) {
    name
    description
    ...Ports
  }
}
    ${PortsFragmentDoc}`;

/**
 * __useAssignNodeQuery__
 *
 * To run a query within a React component, call `useAssignNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useAssignNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAssignNodeQuery({
 *   variables: {
 *      reservation: // value for 'reservation'
 *   },
 * });
 */
export function useAssignNodeQuery(baseOptions: Apollo.QueryHookOptions<AssignNodeQuery, AssignNodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AssignNodeQuery, AssignNodeQueryVariables>(AssignNodeDocument, options);
      }
export function useAssignNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AssignNodeQuery, AssignNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AssignNodeQuery, AssignNodeQueryVariables>(AssignNodeDocument, options);
        }
export type AssignNodeQueryHookResult = ReturnType<typeof useAssignNodeQuery>;
export type AssignNodeLazyQueryHookResult = ReturnType<typeof useAssignNodeLazyQuery>;
export type AssignNodeQueryResult = Apollo.QueryResult<AssignNodeQuery, AssignNodeQueryVariables>;
export const ReturnNodeDocument = gql`
    query ReturnNode($assignation: ID!) {
  node(assignation: $assignation) {
    name
    description
    ...Ports
  }
}
    ${PortsFragmentDoc}`;

/**
 * __useReturnNodeQuery__
 *
 * To run a query within a React component, call `useReturnNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useReturnNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReturnNodeQuery({
 *   variables: {
 *      assignation: // value for 'assignation'
 *   },
 * });
 */
export function useReturnNodeQuery(baseOptions: Apollo.QueryHookOptions<ReturnNodeQuery, ReturnNodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReturnNodeQuery, ReturnNodeQueryVariables>(ReturnNodeDocument, options);
      }
export function useReturnNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReturnNodeQuery, ReturnNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReturnNodeQuery, ReturnNodeQueryVariables>(ReturnNodeDocument, options);
        }
export type ReturnNodeQueryHookResult = ReturnType<typeof useReturnNodeQuery>;
export type ReturnNodeLazyQueryHookResult = ReturnType<typeof useReturnNodeLazyQuery>;
export type ReturnNodeQueryResult = Apollo.QueryResult<ReturnNodeQuery, ReturnNodeQueryVariables>;
export const AllNodesDocument = gql`
    query AllNodes($pagination: OffsetPaginationInput, $filters: NodeFilter, $order: NodeOrder) {
  nodes(order: $order, pagination: $pagination, filters: $filters) {
    ...ListNode
  }
}
    ${ListNodeFragmentDoc}`;

/**
 * __useAllNodesQuery__
 *
 * To run a query within a React component, call `useAllNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllNodesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useAllNodesQuery(baseOptions?: Apollo.QueryHookOptions<AllNodesQuery, AllNodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllNodesQuery, AllNodesQueryVariables>(AllNodesDocument, options);
      }
export function useAllNodesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllNodesQuery, AllNodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllNodesQuery, AllNodesQueryVariables>(AllNodesDocument, options);
        }
export type AllNodesQueryHookResult = ReturnType<typeof useAllNodesQuery>;
export type AllNodesLazyQueryHookResult = ReturnType<typeof useAllNodesLazyQuery>;
export type AllNodesQueryResult = Apollo.QueryResult<AllNodesQuery, AllNodesQueryVariables>;
export const ReservationsDocument = gql`
    query Reservations($instanceId: InstanceId!) {
  myreservations(instanceId: $instanceId) {
    ...PostmanReservation
  }
}
    ${PostmanReservationFragmentDoc}`;

/**
 * __useReservationsQuery__
 *
 * To run a query within a React component, call `useReservationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useReservationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReservationsQuery({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *   },
 * });
 */
export function useReservationsQuery(baseOptions: Apollo.QueryHookOptions<ReservationsQuery, ReservationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReservationsQuery, ReservationsQueryVariables>(ReservationsDocument, options);
      }
export function useReservationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReservationsQuery, ReservationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReservationsQuery, ReservationsQueryVariables>(ReservationsDocument, options);
        }
export type ReservationsQueryHookResult = ReturnType<typeof useReservationsQuery>;
export type ReservationsLazyQueryHookResult = ReturnType<typeof useReservationsLazyQuery>;
export type ReservationsQueryResult = Apollo.QueryResult<ReservationsQuery, ReservationsQueryVariables>;
export const DetailReservationDocument = gql`
    query DetailReservation($id: ID!) {
  reservation(id: $id) {
    ...PostmanReservation
    node {
      name
      description
      ...Ports
    }
  }
}
    ${PostmanReservationFragmentDoc}
${PortsFragmentDoc}`;

/**
 * __useDetailReservationQuery__
 *
 * To run a query within a React component, call `useDetailReservationQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailReservationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailReservationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailReservationQuery(baseOptions: Apollo.QueryHookOptions<DetailReservationQuery, DetailReservationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DetailReservationQuery, DetailReservationQueryVariables>(DetailReservationDocument, options);
      }
export function useDetailReservationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DetailReservationQuery, DetailReservationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DetailReservationQuery, DetailReservationQueryVariables>(DetailReservationDocument, options);
        }
export type DetailReservationQueryHookResult = ReturnType<typeof useDetailReservationQuery>;
export type DetailReservationLazyQueryHookResult = ReturnType<typeof useDetailReservationLazyQuery>;
export type DetailReservationQueryResult = Apollo.QueryResult<DetailReservationQuery, DetailReservationQueryVariables>;
export const TemplateDocument = gql`
    query Template($id: ID!) {
  template(id: $id) {
    ...DetailTemplate
  }
}
    ${DetailTemplateFragmentDoc}`;

/**
 * __useTemplateQuery__
 *
 * To run a query within a React component, call `useTemplateQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplateQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTemplateQuery(baseOptions: Apollo.QueryHookOptions<TemplateQuery, TemplateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplateQuery, TemplateQueryVariables>(TemplateDocument, options);
      }
export function useTemplateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplateQuery, TemplateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplateQuery, TemplateQueryVariables>(TemplateDocument, options);
        }
export type TemplateQueryHookResult = ReturnType<typeof useTemplateQuery>;
export type TemplateLazyQueryHookResult = ReturnType<typeof useTemplateLazyQuery>;
export type TemplateQueryResult = Apollo.QueryResult<TemplateQuery, TemplateQueryVariables>;