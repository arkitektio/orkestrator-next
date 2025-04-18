import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@/lib/rekuest/hooks';
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
  Args: { input: any; output: any; }
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
  active: Scalars['Boolean']['output'];
  connected: Scalars['Boolean']['output'];
  extensions: Array<Scalars['String']['output']>;
  hardwareRecords: Array<HardwareRecord>;
  id: Scalars['ID']['output'];
  instanceId: Scalars['InstanceId']['output'];
  lastSeen?: Maybe<Scalars['DateTime']['output']>;
  latestHardwareRecord?: Maybe<HardwareRecord>;
  name: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  registry: Registry;
  states: Array<State>;
  template?: Maybe<Template>;
  templates: Array<Template>;
};


export type AgentHardwareRecordsArgs = {
  filters?: InputMaybe<HardwareRecordFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type AgentTemplateArgs = {
  interface: Scalars['String']['input'];
};


export type AgentTemplatesArgs = {
  filters?: InputMaybe<TemplateFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type AgentChangeEvent = {
  __typename?: 'AgentChangeEvent';
  create?: Maybe<Agent>;
  delete?: Maybe<Scalars['ID']['output']>;
  update?: Maybe<Agent>;
};

export type AgentFilter = {
  AND?: InputMaybe<AgentFilter>;
  OR?: InputMaybe<AgentFilter>;
  clientId?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  extensions?: InputMaybe<Array<Scalars['String']['input']>>;
  hasStates?: InputMaybe<Array<Scalars['String']['input']>>;
  hasTemplates?: InputMaybe<Array<Scalars['String']['input']>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  instanceId?: InputMaybe<Scalars['String']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type AgentInput = {
  extensions?: InputMaybe<Array<Scalars['String']['input']>>;
  instanceId: Scalars['InstanceId']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type AgentOrder = {
  lastSeen?: InputMaybe<Ordering>;
};

export type App = {
  __typename?: 'App';
  clientId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type AppFilter = {
  AND?: InputMaybe<AppFilter>;
  OR?: InputMaybe<AppFilter>;
  hasTemplatesFor?: InputMaybe<Array<Scalars['NodeHash']['input']>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  interface?: InputMaybe<StrFilterLookup>;
  mine?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AppOrder = {
  definedAt?: InputMaybe<Ordering>;
};

export type ArchiveStateInput = {
  stateSchema: Scalars['ID']['input'];
};

export type AssignInput = {
  agent?: InputMaybe<Scalars['ID']['input']>;
  args: Scalars['Args']['input'];
  cached?: Scalars['Boolean']['input'];
  ephemeral?: Scalars['Boolean']['input'];
  hooks?: InputMaybe<Array<HookInput>>;
  instanceId: Scalars['InstanceId']['input'];
  interface?: InputMaybe<Scalars['String']['input']>;
  isHook?: Scalars['Boolean']['input'];
  log?: Scalars['Boolean']['input'];
  node?: InputMaybe<Scalars['ID']['input']>;
  nodeHash?: InputMaybe<Scalars['NodeHash']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  reservation?: InputMaybe<Scalars['ID']['input']>;
  template?: InputMaybe<Scalars['ID']['input']>;
};

export type AssignWidget = {
  followValue?: Maybe<Scalars['String']['output']>;
  kind: AssignWidgetKind;
};

export type AssignWidgetInput = {
  asParagraph?: InputMaybe<Scalars['Boolean']['input']>;
  choices?: InputMaybe<Array<ChoiceInput>>;
  dependencies?: InputMaybe<Array<Scalars['String']['input']>>;
  fallback?: InputMaybe<AssignWidgetInput>;
  filters?: InputMaybe<Array<ChildPortInput>>;
  followValue?: InputMaybe<Scalars['String']['input']>;
  hook?: InputMaybe<Scalars['String']['input']>;
  kind: AssignWidgetKind;
  max?: InputMaybe<Scalars['Float']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['SearchQuery']['input']>;
  stateChoices?: InputMaybe<Scalars['String']['input']>;
  step?: InputMaybe<Scalars['Float']['input']>;
  ward?: InputMaybe<Scalars['String']['input']>;
};

export enum AssignWidgetKind {
  Choice = 'CHOICE',
  Custom = 'CUSTOM',
  Search = 'SEARCH',
  Slider = 'SLIDER',
  StateChoice = 'STATE_CHOICE',
  String = 'STRING'
}

export type Assignation = {
  __typename?: 'Assignation';
  arg?: Maybe<Scalars['Args']['output']>;
  args: Scalars['AnyDefault']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** If true, this assignation will be deleted after the assignation is completed */
  ephemeral: Scalars['Boolean']['output'];
  events: Array<AssignationEvent>;
  id: Scalars['ID']['output'];
  instructs: Array<AssignationInstruct>;
  isDone: Scalars['Boolean']['output'];
  /** The status of this assignation */
  latestEventKind: AssignationEventKind;
  /** The latest instruct that was sent to this assignation */
  latestInstructKind: AssignationInstructKind;
  /** The node that this assignation is assigned to */
  node: Node;
  /** A parent assignation is the next assignation in the chain of assignations that caused this assignation to be created. Parents can be created by intent or by the system. If null, this assignation is the parent */
  parent?: Maybe<Assignation>;
  reference?: Maybe<Scalars['String']['output']>;
  /** If this assignation is the result of a reservation, this field will contain the reservation that caused this assignation to be created */
  reservation?: Maybe<Reservation>;
  /** A root assignation is the root assignation that caused this assignation to be created. This mother is always created by intent (e.g a user action). If null, this assignation is the mother */
  root?: Maybe<Assignation>;
  statusMessage?: Maybe<Scalars['String']['output']>;
  /** The template that this assignation is assigned to */
  template: Template;
  updatedAt: Scalars['DateTime']['output'];
  /** The Waiter that this assignation was created by */
  waiter: Waiter;
};


export type AssignationArgArgs = {
  key: Scalars['String']['input'];
};

export type AssignationChangeEvent = {
  __typename?: 'AssignationChangeEvent';
  create?: Maybe<Assignation>;
  event?: Maybe<AssignationEvent>;
};

export type AssignationEvent = {
  __typename?: 'AssignationEvent';
  assignation: Assignation;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  kind: AssignationEventKind;
  level?: Maybe<LogLevel>;
  message?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  progress?: Maybe<Scalars['Int']['output']>;
  reference: Scalars['String']['output'];
  returns?: Maybe<Scalars['AnyDefault']['output']>;
};

export enum AssignationEventKind {
  Assign = 'ASSIGN',
  Bound = 'BOUND',
  Canceling = 'CANCELING',
  Cancelled = 'CANCELLED',
  Critical = 'CRITICAL',
  Disconnected = 'DISCONNECTED',
  Done = 'DONE',
  Error = 'ERROR',
  Interupted = 'INTERUPTED',
  Interupting = 'INTERUPTING',
  Log = 'LOG',
  Progress = 'PROGRESS',
  Queued = 'QUEUED',
  Yield = 'YIELD'
}

export type AssignationInstruct = {
  __typename?: 'AssignationInstruct';
  assignation: Assignation;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  kind: AssignationInstructKind;
};

export enum AssignationInstructKind {
  Assign = 'ASSIGN',
  Cancel = 'CANCEL',
  Interrupt = 'INTERRUPT',
  Pause = 'PAUSE',
  Resume = 'RESUME',
  Step = 'STEP'
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

export type CancelInput = {
  assignation: Scalars['ID']['input'];
};

export type ChildPort = {
  __typename?: 'ChildPort';
  assignWidget?: Maybe<AssignWidget>;
  children?: Maybe<Array<ChildPort>>;
  default?: Maybe<Scalars['AnyDefault']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['Identifier']['output']>;
  key: Scalars['String']['output'];
  kind: PortKind;
  label?: Maybe<Scalars['String']['output']>;
  nullable: Scalars['Boolean']['output'];
  returnWidget?: Maybe<ReturnWidget>;
  scope: PortScope;
};

export type ChildPortInput = {
  assignWidget?: InputMaybe<AssignWidgetInput>;
  children?: InputMaybe<Array<ChildPortInput>>;
  default?: InputMaybe<Scalars['AnyDefault']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  effects?: InputMaybe<Array<EffectInput>>;
  identifier?: InputMaybe<Scalars['Identifier']['input']>;
  key: Scalars['String']['input'];
  kind: PortKind;
  label?: InputMaybe<Scalars['String']['input']>;
  nullable: Scalars['Boolean']['input'];
  returnWidget?: InputMaybe<ReturnWidgetInput>;
  scope: PortScope;
};

export type Choice = {
  __typename?: 'Choice';
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ChoiceAssignWidget = AssignWidget & {
  __typename?: 'ChoiceAssignWidget';
  choices?: Maybe<Array<Choice>>;
  followValue?: Maybe<Scalars['String']['output']>;
  kind: AssignWidgetKind;
};

export type ChoiceInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  value: Scalars['AnyDefault']['input'];
};

export type ChoiceReturnWidget = ReturnWidget & {
  __typename?: 'ChoiceReturnWidget';
  choices?: Maybe<Array<Choice>>;
  kind: ReturnWidgetKind;
};

export type CollectInput = {
  assignation: Scalars['ID']['input'];
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

export type CreateDashboardInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  panels?: InputMaybe<Array<Scalars['ID']['input']>>;
  tree?: InputMaybe<UiTreeInput>;
};

export type CreateForeignTemplateInput = {
  agent: Scalars['ID']['input'];
  extension: Scalars['String']['input'];
  template: TemplateInput;
};

export type CreateHardwareRecordInput = {
  cpuCount?: InputMaybe<Scalars['Int']['input']>;
  cpuFrequency?: InputMaybe<Scalars['Float']['input']>;
  cpuVendorName?: InputMaybe<Scalars['String']['input']>;
  instanceId?: InputMaybe<Scalars['InstanceId']['input']>;
};

export type CreatePanelInput = {
  args?: InputMaybe<Scalars['Args']['input']>;
  instanceId?: InputMaybe<Scalars['InstanceId']['input']>;
  interface?: InputMaybe<Scalars['String']['input']>;
  kind: PanelKind;
  name: Scalars['String']['input'];
  reservation?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['ID']['input']>;
  stateAccessors?: InputMaybe<Array<Scalars['String']['input']>>;
  stateKey?: InputMaybe<Scalars['String']['input']>;
  submitOnChange?: InputMaybe<Scalars['Boolean']['input']>;
  submitOnLoad?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateShortcutInput = {
  allowQuick?: Scalars['Boolean']['input'];
  args: Scalars['Args']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  node: Scalars['ID']['input'];
  template?: InputMaybe<Scalars['ID']['input']>;
  toolbox?: InputMaybe<Scalars['ID']['input']>;
  useReturns?: Scalars['Boolean']['input'];
};

export type CreateStateSchemaInput = {
  stateSchema: StateSchemaInput;
};

export type CreateTemplateInput = {
  extension: Scalars['String']['input'];
  instanceId: Scalars['InstanceId']['input'];
  template: TemplateInput;
};

export type CreateTestCaseInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  node: Scalars['ID']['input'];
  tester: Scalars['ID']['input'];
};

export type CreateTestResultInput = {
  case: Scalars['ID']['input'];
  passed: Scalars['Boolean']['input'];
  result?: InputMaybe<Scalars['String']['input']>;
  template: Scalars['ID']['input'];
  tester: Scalars['ID']['input'];
};

export type CreateToolboxInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CustomAssignWidget = AssignWidget & {
  __typename?: 'CustomAssignWidget';
  followValue?: Maybe<Scalars['String']['output']>;
  hook: Scalars['String']['output'];
  kind: AssignWidgetKind;
  ward: Scalars['String']['output'];
};

export type CustomEffect = Effect & {
  __typename?: 'CustomEffect';
  dependencies: Array<Scalars['String']['output']>;
  function: Scalars['ValidatorFunction']['output'];
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

export type Dashboard = {
  __typename?: 'Dashboard';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  panels?: Maybe<Array<Panel>>;
  uiTree?: Maybe<UiTree>;
};

export type DefinitionInput = {
  args?: Array<PortInput>;
  collections?: Array<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  interfaces?: Array<Scalars['String']['input']>;
  isDev?: Scalars['Boolean']['input'];
  isTestFor?: Array<Scalars['String']['input']>;
  kind: NodeKind;
  name: Scalars['String']['input'];
  portGroups?: Array<PortGroupInput>;
  returns?: Array<PortInput>;
  stateful?: Scalars['Boolean']['input'];
};

export type DeleteAgentInput = {
  id: Scalars['ID']['input'];
};

export type DeleteShortcutInput = {
  id: Scalars['ID']['input'];
};

export type DeleteTemplateInput = {
  template: Scalars['ID']['input'];
};

export enum DemandKind {
  Args = 'ARGS',
  Returns = 'RETURNS'
}

export type Dependency = {
  __typename?: 'Dependency';
  binds?: Maybe<Binds>;
  hash: Scalars['NodeHash']['output'];
  id: Scalars['ID']['output'];
  initialHash: Scalars['NodeHash']['output'];
  node?: Maybe<Node>;
  optional: Scalars['Boolean']['output'];
  reference?: Maybe<Scalars['String']['output']>;
  resolvable: Scalars['Boolean']['output'];
  template: Template;
};

export type DependencyEdge = {
  __typename?: 'DependencyEdge';
  depId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  optional: Scalars['Boolean']['output'];
  reservationId?: Maybe<Scalars['String']['output']>;
  source: Scalars['String']['output'];
  target: Scalars['String']['output'];
};

export type DependencyEdgeImplementationEdge = DependencyEdge | ImplementationEdge;

export type DependencyFilter = {
  AND?: InputMaybe<DependencyFilter>;
  OR?: InputMaybe<DependencyFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type DependencyGraph = {
  __typename?: 'DependencyGraph';
  edges: Array<DependencyEdgeImplementationEdge>;
  nodes: Array<NodeNodeInvalidNodeTemplateNode>;
};

export type DependencyInput = {
  binds?: InputMaybe<BindsInput>;
  hash?: InputMaybe<Scalars['NodeHash']['input']>;
  optional?: Scalars['Boolean']['input'];
  reference?: InputMaybe<Scalars['String']['input']>;
  viableInstances?: InputMaybe<Scalars['Int']['input']>;
};

export type Effect = {
  dependencies: Array<Scalars['String']['output']>;
  function: Scalars['ValidatorFunction']['output'];
  kind: EffectKind;
};

export type EffectInput = {
  dependencies?: Array<Scalars['String']['input']>;
  function: Scalars['ValidatorFunction']['input'];
  hook?: InputMaybe<Scalars['String']['input']>;
  kind: EffectKind;
  message?: InputMaybe<Scalars['String']['input']>;
  ward?: InputMaybe<Scalars['String']['input']>;
};

export enum EffectKind {
  Custom = 'CUSTOM',
  Hide = 'HIDE',
  Message = 'MESSAGE'
}

export type HardwareRecord = {
  __typename?: 'HardwareRecord';
  agent: Agent;
  cpuCount: Scalars['Int']['output'];
  cpuFrequency: Scalars['Float']['output'];
  cpuVendorName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
};

export type HardwareRecordFilter = {
  AND?: InputMaybe<HardwareRecordFilter>;
  OR?: InputMaybe<HardwareRecordFilter>;
  cpuVendorName?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type HistoricalState = {
  __typename?: 'HistoricalState';
  archivedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  state: State;
  value: Scalars['Args']['output'];
};

export type HookInput = {
  hash: Scalars['String']['input'];
  kind: HookKind;
};

export enum HookKind {
  Cleanup = 'CLEANUP',
  Init = 'INIT'
}

export type ImplementationEdge = {
  __typename?: 'ImplementationEdge';
  id: Scalars['String']['output'];
  linked: Scalars['Boolean']['output'];
  reservationId?: Maybe<Scalars['String']['output']>;
  source: Scalars['String']['output'];
  target: Scalars['String']['output'];
};

export type InterruptInput = {
  assignation: Scalars['ID']['input'];
};

export type InvalidNode = {
  __typename?: 'InvalidNode';
  id: Scalars['String']['output'];
  initialHash: Scalars['String']['output'];
};

export enum LogLevel {
  Critical = 'CRITICAL',
  Debug = 'DEBUG',
  Error = 'ERROR',
  Info = 'INFO',
  Warn = 'WARN'
}

export type MessageEffect = Effect & {
  __typename?: 'MessageEffect';
  dependencies: Array<Scalars['String']['output']>;
  function: Scalars['ValidatorFunction']['output'];
  kind: EffectKind;
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  ack: Assignation;
  archiveState: StateSchema;
  assign: Assignation;
  cancel: Assignation;
  /** Collect data from a assignation */
  collect: Assignation;
  createDashboard: Dashboard;
  createForeignTemplate: Template;
  createHardwareRecord: HardwareRecord;
  createPanel: Panel;
  createShortcut: Shortcut;
  createStateSchema: StateSchema;
  createTemplate: Template;
  createTestCase: TestCase;
  createTestResult: TestResult;
  createToolbox: Toolbox;
  deleteAgent: Scalars['ID']['output'];
  deleteShortcut: Scalars['String']['output'];
  /** Delete a template */
  deleteTemplate: Scalars['String']['output'];
  ensureAgent: Agent;
  interrupt: Assignation;
  /** Pause a assignation */
  pause: Assignation;
  pinAgent: Agent;
  pinTemplate: Template;
  reinit: Scalars['String']['output'];
  reserve: Reservation;
  /** Resume a assignation */
  resume: Assignation;
  setExtensionTemplates: Array<Template>;
  setState: State;
  /** Step a assignation */
  step: Assignation;
  unreserve: Scalars['String']['output'];
  updateState: State;
};


export type MutationAckArgs = {
  input: AckInput;
};


export type MutationArchiveStateArgs = {
  input: ArchiveStateInput;
};


export type MutationAssignArgs = {
  input: AssignInput;
};


export type MutationCancelArgs = {
  input: CancelInput;
};


export type MutationCollectArgs = {
  input: CollectInput;
};


export type MutationCreateDashboardArgs = {
  input: CreateDashboardInput;
};


export type MutationCreateForeignTemplateArgs = {
  input: CreateForeignTemplateInput;
};


export type MutationCreateHardwareRecordArgs = {
  input: CreateHardwareRecordInput;
};


export type MutationCreatePanelArgs = {
  input: CreatePanelInput;
};


export type MutationCreateShortcutArgs = {
  input: CreateShortcutInput;
};


export type MutationCreateStateSchemaArgs = {
  input: CreateStateSchemaInput;
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


export type MutationCreateToolboxArgs = {
  input: CreateToolboxInput;
};


export type MutationDeleteAgentArgs = {
  input: DeleteAgentInput;
};


export type MutationDeleteShortcutArgs = {
  input: DeleteShortcutInput;
};


export type MutationDeleteTemplateArgs = {
  input: DeleteTemplateInput;
};


export type MutationEnsureAgentArgs = {
  input: AgentInput;
};


export type MutationInterruptArgs = {
  input: InterruptInput;
};


export type MutationPauseArgs = {
  input: PauseInput;
};


export type MutationPinAgentArgs = {
  input: PinInput;
};


export type MutationPinTemplateArgs = {
  input: PinInput;
};


export type MutationReinitArgs = {
  input: ReInitInput;
};


export type MutationReserveArgs = {
  input: ReserveInput;
};


export type MutationResumeArgs = {
  input: ResumeInput;
};


export type MutationSetExtensionTemplatesArgs = {
  input: SetExtensionTemplatesInput;
};


export type MutationSetStateArgs = {
  input: SetStateInput;
};


export type MutationStepArgs = {
  input: StepInput;
};


export type MutationUnreserveArgs = {
  input: UnreserveInput;
};


export type MutationUpdateStateArgs = {
  input: UpdateStateInput;
};

export type Node = {
  __typename?: 'Node';
  args: Array<Port>;
  collections: Array<Collection>;
  definedAt: Scalars['DateTime']['output'];
  dependencyGraph: DependencyGraph;
  description?: Maybe<Scalars['String']['output']>;
  hash: Scalars['NodeHash']['output'];
  id: Scalars['ID']['output'];
  interfaces: Array<Scalars['String']['output']>;
  isDev: Scalars['Boolean']['output'];
  isTestFor: Array<Node>;
  kind: NodeKind;
  name: Scalars['String']['output'];
  pinned: Scalars['Boolean']['output'];
  portGroups: Array<PortGroup>;
  protocols: Array<Protocol>;
  reservations?: Maybe<Array<Reservation>>;
  returns: Array<Port>;
  runs?: Maybe<Array<Assignation>>;
  scope: NodeScope;
  stateful: Scalars['Boolean']['output'];
  templates: Array<Template>;
  testCases?: Maybe<Array<TestCase>>;
  tests: Array<Node>;
};


export type NodeIsTestForArgs = {
  filters?: InputMaybe<NodeFilter>;
  order?: InputMaybe<NodeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type NodeProtocolsArgs = {
  filters?: InputMaybe<ProtocolFilter>;
  order?: InputMaybe<ProtocolOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type NodeReservationsArgs = {
  filters?: InputMaybe<ReservationFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type NodeTemplatesArgs = {
  filters?: InputMaybe<TemplateFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type NodeTestCasesArgs = {
  filters?: InputMaybe<TestCaseFilter>;
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
  demands?: InputMaybe<Array<PortDemandInput>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind?: InputMaybe<NodeKind>;
  name?: InputMaybe<StrFilterLookup>;
  protocols?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export enum NodeKind {
  Function = 'FUNCTION',
  Generator = 'GENERATOR'
}

export type NodeNode = {
  __typename?: 'NodeNode';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nodeId: Scalars['String']['output'];
  reservationId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type NodeNodeInvalidNodeTemplateNode = InvalidNode | NodeNode | TemplateNode;

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

export type Panel = {
  __typename?: 'Panel';
  accessors?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['ID']['output'];
  kind: PanelKind;
  name: Scalars['String']['output'];
  reservation?: Maybe<Reservation>;
  state?: Maybe<State>;
  submitOnChange: Scalars['Boolean']['output'];
  submitOnLoad: Scalars['Boolean']['output'];
};

export enum PanelKind {
  Assign = 'ASSIGN',
  State = 'STATE'
}

export type ParamPair = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type PauseInput = {
  assignation: Scalars['ID']['input'];
};

export type PinInput = {
  id: Scalars['ID']['input'];
  pin: Scalars['Boolean']['input'];
};

export type Port = {
  __typename?: 'Port';
  assignWidget?: Maybe<AssignWidget>;
  children?: Maybe<Array<ChildPort>>;
  default?: Maybe<Scalars['AnyDefault']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  effects?: Maybe<Array<Effect>>;
  identifier?: Maybe<Scalars['Identifier']['output']>;
  key: Scalars['String']['output'];
  kind: PortKind;
  label?: Maybe<Scalars['String']['output']>;
  nullable: Scalars['Boolean']['output'];
  returnWidget?: Maybe<ReturnWidget>;
  scope: PortScope;
  validators?: Maybe<Array<Validator>>;
};

export type PortDemandInput = {
  forceLength?: InputMaybe<Scalars['Int']['input']>;
  forceNonNullableLength?: InputMaybe<Scalars['Int']['input']>;
  forceStructureLength?: InputMaybe<Scalars['Int']['input']>;
  kind: DemandKind;
  matches?: InputMaybe<Array<PortMatchInput>>;
};

export type PortGroup = {
  __typename?: 'PortGroup';
  description?: Maybe<Scalars['String']['output']>;
  effects?: Maybe<Array<Effect>>;
  key: Scalars['String']['output'];
  ports: Array<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type PortGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  effects?: InputMaybe<Array<EffectInput>>;
  key: Scalars['String']['input'];
  ports?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PortInput = {
  assignWidget?: InputMaybe<AssignWidgetInput>;
  children?: InputMaybe<Array<ChildPortInput>>;
  default?: InputMaybe<Scalars['AnyDefault']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  effects?: InputMaybe<Array<EffectInput>>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  kind: PortKind;
  label?: InputMaybe<Scalars['String']['input']>;
  nullable?: Scalars['Boolean']['input'];
  returnWidget?: InputMaybe<ReturnWidgetInput>;
  scope: PortScope;
  validators?: InputMaybe<Array<ValidatorInput>>;
};

export enum PortKind {
  Bool = 'BOOL',
  Date = 'DATE',
  Dict = 'DICT',
  Float = 'FLOAT',
  Int = 'INT',
  List = 'LIST',
  Model = 'MODEL',
  String = 'STRING',
  Structure = 'STRUCTURE',
  Union = 'UNION'
}

export type PortMatchInput = {
  at?: InputMaybe<Scalars['Int']['input']>;
  children?: InputMaybe<Array<PortMatchInput>>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  kind?: InputMaybe<PortKind>;
  nullable?: InputMaybe<Scalars['Boolean']['input']>;
};

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

export type ProtocolFilter = {
  AND?: InputMaybe<ProtocolFilter>;
  OR?: InputMaybe<ProtocolFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ProtocolOrder = {
  name?: InputMaybe<Ordering>;
};

export type Query = {
  __typename?: 'Query';
  agent: Agent;
  agents: Array<Agent>;
  assignation: Assignation;
  assignations: Array<Assignation>;
  clients: Array<App>;
  dashboard: Dashboard;
  dashboards: Array<Dashboard>;
  dependency: Dependency;
  event: Array<AssignationEvent>;
  hardwareRecord: HardwareRecord;
  hardwareRecords: Array<HardwareRecord>;
  myTemplateAt: Template;
  myreservations: Array<Reservation>;
  node: Node;
  nodes: Array<Node>;
  panel: Panel;
  panels: Array<Panel>;
  protocols: Array<Protocol>;
  reservation: Reservation;
  reservations: Array<Reservation>;
  shortcut: Shortcut;
  shortcuts: Array<Shortcut>;
  state: State;
  stateFor: State;
  stateSchema: StateSchema;
  stateSchemas: Array<StateSchema>;
  states: Array<State>;
  template: Template;
  templateAt: Template;
  templates: Array<Template>;
  testCase: TestCase;
  testCases: Array<TestCase>;
  testResult: TestResult;
  testResults: Array<TestResult>;
  toolbox: Toolbox;
  toolboxes: Array<Toolbox>;
};


export type QueryAgentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAgentsArgs = {
  filters?: InputMaybe<AgentFilter>;
  order?: InputMaybe<AgentOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryAssignationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAssignationsArgs = {
  instanceId?: InputMaybe<Scalars['InstanceId']['input']>;
};


export type QueryClientsArgs = {
  filters?: InputMaybe<AppFilter>;
  order?: InputMaybe<AppOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryDashboardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDependencyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryHardwareRecordArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHardwareRecordsArgs = {
  filters?: InputMaybe<HardwareRecordFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMyTemplateAtArgs = {
  instanceId: Scalars['String']['input'];
  interface?: InputMaybe<Scalars['String']['input']>;
  nodeId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryMyreservationsArgs = {
  instanceId?: InputMaybe<Scalars['InstanceId']['input']>;
};


export type QueryNodeArgs = {
  agent?: InputMaybe<Scalars['ID']['input']>;
  assignation?: InputMaybe<Scalars['ID']['input']>;
  hash?: InputMaybe<Scalars['NodeHash']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  interface?: InputMaybe<Scalars['String']['input']>;
  reservation?: InputMaybe<Scalars['ID']['input']>;
  template?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryNodesArgs = {
  filters?: InputMaybe<NodeFilter>;
  order?: InputMaybe<NodeOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryPanelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProtocolsArgs = {
  filters?: InputMaybe<ProtocolFilter>;
  order?: InputMaybe<ProtocolOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryReservationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReservationsArgs = {
  instanceId?: InputMaybe<Scalars['InstanceId']['input']>;
};


export type QueryShortcutArgs = {
  id: Scalars['ID']['input'];
};


export type QueryShortcutsArgs = {
  filters?: InputMaybe<ShortcutFilter>;
  order?: InputMaybe<ShortcutOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStateForArgs = {
  agent?: InputMaybe<Scalars['ID']['input']>;
  stateHash?: InputMaybe<Scalars['String']['input']>;
  template?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryStateSchemaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTemplateAtArgs = {
  agent: Scalars['ID']['input'];
  extension?: InputMaybe<Scalars['String']['input']>;
  interface?: InputMaybe<Scalars['String']['input']>;
  nodeHash?: InputMaybe<Scalars['String']['input']>;
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


export type QueryToolboxArgs = {
  id: Scalars['ID']['input'];
};


export type QueryToolboxesArgs = {
  filters?: InputMaybe<ToolboxFilter>;
  order?: InputMaybe<ToolboxOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ReInitInput = {
  agent?: InputMaybe<Scalars['ID']['input']>;
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
  order?: InputMaybe<AgentOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type Reservation = {
  __typename?: 'Reservation';
  binds?: Maybe<Binds>;
  causingDependency?: Maybe<Dependency>;
  dependencyGraph: DependencyGraph;
  happy: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  node: Node;
  reference: Scalars['String']['output'];
  strategy: ReservationStrategy;
  template?: Maybe<Template>;
  templates: Array<Template>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  viable: Scalars['Boolean']['output'];
  waiter: Waiter;
};


export type ReservationTemplatesArgs = {
  filters?: InputMaybe<TemplateFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

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
  Happy = 'HAPPY',
  Inactive = 'INACTIVE',
  Unconnected = 'UNCONNECTED',
  Unhappy = 'UNHAPPY'
}

export enum ReservationStrategy {
  Direct = 'DIRECT',
  LeastBusy = 'LEAST_BUSY',
  LeastLoad = 'LEAST_LOAD',
  LeastTime = 'LEAST_TIME',
  Random = 'RANDOM',
  RoundRobin = 'ROUND_ROBIN'
}

export type ReserveInput = {
  assignationId?: InputMaybe<Scalars['ID']['input']>;
  binds?: InputMaybe<BindsInput>;
  hash?: InputMaybe<Scalars['NodeHash']['input']>;
  instanceId?: Scalars['InstanceId']['input'];
  node?: InputMaybe<Scalars['ID']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  template?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ResumeInput = {
  assignation: Scalars['ID']['input'];
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
  dependencies?: Maybe<Array<Scalars['String']['output']>>;
  filters?: Maybe<Array<ChildPort>>;
  followValue?: Maybe<Scalars['String']['output']>;
  kind: AssignWidgetKind;
  query: Scalars['String']['output'];
  ward: Scalars['String']['output'];
};

export type SetExtensionTemplatesInput = {
  extension: Scalars['String']['input'];
  instanceId: Scalars['InstanceId']['input'];
  runCleanup?: Scalars['Boolean']['input'];
  templates: Array<TemplateInput>;
};

export type SetStateInput = {
  instanceId: Scalars['InstanceId']['input'];
  stateSchema: Scalars['ID']['input'];
  value: Scalars['Args']['input'];
};

export type Shortcut = {
  __typename?: 'Shortcut';
  allowQuick: Scalars['Boolean']['output'];
  args: Array<Port>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  node: Node;
  returns: Array<Port>;
  savedArgs: Scalars['AnyDefault']['output'];
  template?: Maybe<Template>;
  toolboxes: Array<Toolbox>;
  useReturns: Scalars['Boolean']['output'];
};


export type ShortcutToolboxesArgs = {
  filters?: InputMaybe<ToolboxFilter>;
  order?: InputMaybe<ToolboxOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ShortcutFilter = {
  AND?: InputMaybe<ShortcutFilter>;
  OR?: InputMaybe<ShortcutFilter>;
  demands?: InputMaybe<Array<PortDemandInput>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  toolbox?: InputMaybe<Scalars['ID']['input']>;
};

export type ShortcutOrder = {
  name?: InputMaybe<Ordering>;
};

export type SliderAssignWidget = AssignWidget & {
  __typename?: 'SliderAssignWidget';
  followValue?: Maybe<Scalars['String']['output']>;
  kind: AssignWidgetKind;
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  step?: Maybe<Scalars['Float']['output']>;
};

export type State = {
  __typename?: 'State';
  agent: Agent;
  createdAt: Scalars['DateTime']['output'];
  historicalStates: Array<HistoricalState>;
  id: Scalars['ID']['output'];
  stateSchema: StateSchema;
  updatedAt: Scalars['DateTime']['output'];
  value: Scalars['Args']['output'];
};

export type StateChoiceAssignWidget = AssignWidget & {
  __typename?: 'StateChoiceAssignWidget';
  followValue?: Maybe<Scalars['String']['output']>;
  kind: AssignWidgetKind;
  stateChoices: Scalars['String']['output'];
};

export type StateSchema = {
  __typename?: 'StateSchema';
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  ports: Array<Port>;
};

export type StateSchemaInput = {
  name: Scalars['String']['input'];
  ports: Array<PortInput>;
};

export type StepInput = {
  assignation: Scalars['ID']['input'];
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
  followValue?: Maybe<Scalars['String']['output']>;
  kind: AssignWidgetKind;
  placeholder: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  agents: AgentChangeEvent;
  assignationEvents: AssignationEvent;
  assignations: AssignationChangeEvent;
  newNodes: Node;
  reservations: Reservation;
  stateUpdateEvents: State;
  templateChange: Template;
  templates: TemplateUpdate;
};


export type SubscriptionAssignationEventsArgs = {
  instanceId: Scalars['InstanceId']['input'];
};


export type SubscriptionAssignationsArgs = {
  instanceId: Scalars['InstanceId']['input'];
};


export type SubscriptionNewNodesArgs = {
  cage: Scalars['ID']['input'];
};


export type SubscriptionReservationsArgs = {
  instanceId: Scalars['InstanceId']['input'];
};


export type SubscriptionStateUpdateEventsArgs = {
  stateId: Scalars['ID']['input'];
};


export type SubscriptionTemplateChangeArgs = {
  template: Scalars['ID']['input'];
};


export type SubscriptionTemplatesArgs = {
  agent: Scalars['ID']['input'];
};

export type Template = {
  __typename?: 'Template';
  agent: Agent;
  dependencies: Array<Dependency>;
  dependencyGraph: DependencyGraph;
  extension: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  interface: Scalars['String']['output'];
  name: Scalars['String']['output'];
  node: Node;
  params: Scalars['AnyDefault']['output'];
  pinned: Scalars['Boolean']['output'];
};


export type TemplateDependenciesArgs = {
  filters?: InputMaybe<DependencyFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type TemplateAgentFilter = {
  AND?: InputMaybe<TemplateAgentFilter>;
  OR?: InputMaybe<TemplateAgentFilter>;
  clientId?: InputMaybe<Scalars['String']['input']>;
  extensions?: InputMaybe<Array<Scalars['String']['input']>>;
  hasStates?: InputMaybe<Array<Scalars['String']['input']>>;
  hasTemplates?: InputMaybe<Array<Scalars['String']['input']>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  instanceId?: InputMaybe<Scalars['String']['input']>;
};

export type TemplateFilter = {
  AND?: InputMaybe<TemplateFilter>;
  OR?: InputMaybe<TemplateFilter>;
  agent?: InputMaybe<TemplateAgentFilter>;
  extension?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  interface?: InputMaybe<StrFilterLookup>;
  node?: InputMaybe<TemplateNodeFilter>;
  nodeHash?: InputMaybe<Scalars['NodeHash']['input']>;
  parameters?: InputMaybe<Array<ParamPair>>;
};

export type TemplateInput = {
  definition: DefinitionInput;
  dependencies: Array<DependencyInput>;
  dynamic?: Scalars['Boolean']['input'];
  interface: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['String']['input']>;
  params?: InputMaybe<Scalars['AnyDefault']['input']>;
};

export type TemplateNode = {
  __typename?: 'TemplateNode';
  active: Scalars['Boolean']['output'];
  clientId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  interface: Scalars['String']['output'];
  linked: Scalars['Boolean']['output'];
  provisionId?: Maybe<Scalars['String']['output']>;
  reservationId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  templateId: Scalars['String']['output'];
};

export type TemplateNodeFilter = {
  AND?: InputMaybe<TemplateNodeFilter>;
  OR?: InputMaybe<TemplateNodeFilter>;
  demands?: InputMaybe<Array<PortDemandInput>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind?: InputMaybe<NodeKind>;
  name?: InputMaybe<Scalars['String']['input']>;
  protocols?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type TemplateUpdate = {
  __typename?: 'TemplateUpdate';
  create: Template;
  delete: Scalars['ID']['output'];
  update: Template;
};

export type TestCase = {
  __typename?: 'TestCase';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isBenchmark: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  node: Node;
  results: Array<TestResult>;
  tester: Node;
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
  tester: Template;
  updatedAt: Scalars['DateTime']['output'];
};

export type TestResultFilter = {
  AND?: InputMaybe<TestResultFilter>;
  OR?: InputMaybe<TestResultFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
};

export type Toolbox = {
  __typename?: 'Toolbox';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  shortcuts: Array<Shortcut>;
};


export type ToolboxShortcutsArgs = {
  filters?: InputMaybe<ShortcutFilter>;
  order?: InputMaybe<ShortcutOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ToolboxFilter = {
  AND?: InputMaybe<ToolboxFilter>;
  OR?: InputMaybe<ToolboxFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ToolboxOrder = {
  name?: InputMaybe<Ordering>;
};

export type UiChild = {
  kind: UiChildKind;
};

export type UiChildInput = {
  children?: InputMaybe<Array<UiChildInput>>;
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  kind: UiChildKind;
  left?: InputMaybe<UiChildInput>;
  right?: InputMaybe<UiChildInput>;
  state?: InputMaybe<Scalars['String']['input']>;
};

export enum UiChildKind {
  Grid = 'GRID',
  Reservation = 'RESERVATION',
  Split = 'SPLIT',
  State = 'STATE'
}

export type UiGrid = UiChild & {
  __typename?: 'UIGrid';
  children: Array<UiGridItem>;
  columns: Scalars['Int']['output'];
  kind: UiChildKind;
  rowHeight: Scalars['Int']['output'];
};

export type UiGridItem = {
  __typename?: 'UIGridItem';
  child: UiChild;
  h: Scalars['Int']['output'];
  maxW: Scalars['Int']['output'];
  minW: Scalars['Int']['output'];
  w: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type UiSplit = UiChild & {
  __typename?: 'UISplit';
  kind: UiChildKind;
  left: UiChild;
  right: UiChild;
};

export type UiState = UiChild & {
  __typename?: 'UIState';
  kind: UiChildKind;
  state: Scalars['String']['output'];
};

export type UiTree = {
  __typename?: 'UITree';
  child: UiChild;
};

export type UiTreeInput = {
  child: UiChildInput;
};

export type UnreserveInput = {
  reservation: Scalars['ID']['input'];
};

export type UpdateStateInput = {
  instanceId: Scalars['InstanceId']['input'];
  patches: Array<Scalars['Args']['input']>;
  stateSchema: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
};

export type Validator = {
  __typename?: 'Validator';
  dependencies?: Maybe<Array<Scalars['String']['output']>>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  function: Scalars['ValidatorFunction']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type ValidatorInput = {
  dependencies?: InputMaybe<Array<Scalars['String']['input']>>;
  errorMessage?: InputMaybe<Scalars['String']['input']>;
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

export type AgentFragment = { __typename?: 'Agent', id: string, instanceId: any, pinned: boolean, extensions: Array<string>, name: string, active: boolean, connected: boolean, lastSeen?: any | null, templates: Array<{ __typename?: 'Template', id: string, interface: string, node: { __typename?: 'Node', description?: string | null, name: string, stateful: boolean }, agent: { __typename?: 'Agent', name: string } }>, states: Array<{ __typename?: 'State', id: string, value: any, updatedAt: any, stateSchema: { __typename?: 'StateSchema', hash: string, name: string, ports: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }> } }>, registry: { __typename?: 'Registry', app: { __typename?: 'App', clientId: string }, user: { __typename?: 'User', id: string } } };

export type ListAgentFragment = { __typename?: 'Agent', id: string, instanceId: any, active: boolean, connected: boolean, name: string, lastSeen?: any | null, pinned: boolean, registry: { __typename?: 'Registry', app: { __typename?: 'App', clientId: string }, user: { __typename?: 'User', id: string } } };

export type AgentOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']>>;
}>;


export type AgentOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Agent', value: string, label: string }> };

export type AgentChangeEventFragment = { __typename?: 'AgentChangeEvent', delete?: string | null, create?: { __typename?: 'Agent', id: string, instanceId: any, active: boolean, connected: boolean, name: string, lastSeen?: any | null, pinned: boolean, registry: { __typename?: 'Registry', app: { __typename?: 'App', clientId: string }, user: { __typename?: 'User', id: string } } } | null, update?: { __typename?: 'Agent', id: string, instanceId: any, active: boolean, connected: boolean, name: string, lastSeen?: any | null, pinned: boolean, registry: { __typename?: 'Registry', app: { __typename?: 'App', clientId: string }, user: { __typename?: 'User', id: string } } } | null };

export type PostmanAssignationFragment = { __typename?: 'Assignation', id: string, latestEventKind: AssignationEventKind, args: any, reference?: string | null, isDone: boolean, ephemeral: boolean, createdAt: any, events: Array<{ __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } }>, node: { __typename?: 'Node', hash: any, id: string, name: string, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, reservation?: { __typename?: 'Reservation', id: string, title?: string | null, node: { __typename?: 'Node', name: string } } | null, template: { __typename?: 'Template', id: string, interface: string, extension: string } };

export type DetailAssignationFragment = { __typename?: 'Assignation', id: string, latestEventKind: AssignationEventKind, args: any, reference?: string | null, isDone: boolean, ephemeral: boolean, createdAt: any, events: Array<{ __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } }>, node: { __typename?: 'Node', hash: any, id: string, name: string, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, reservation?: { __typename?: 'Reservation', id: string, title?: string | null, node: { __typename?: 'Node', name: string } } | null, template: { __typename?: 'Template', id: string, interface: string, extension: string } };

export type AssignationEventFragment = { __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } };

export type AssignationChangeEventFragment = { __typename?: 'AssignationChangeEvent', create?: { __typename?: 'Assignation', id: string, latestEventKind: AssignationEventKind, args: any, reference?: string | null, isDone: boolean, ephemeral: boolean, createdAt: any, events: Array<{ __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } }>, node: { __typename?: 'Node', hash: any, id: string, name: string, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, reservation?: { __typename?: 'Reservation', id: string, title?: string | null, node: { __typename?: 'Node', name: string } } | null, template: { __typename?: 'Template', id: string, interface: string, extension: string } } | null, event?: { __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } } | null };

export type ClientFragment = { __typename?: 'App', id: string, name: string, clientId: string };

export type ListClientFragment = { __typename?: 'App', id: string, name: string, clientId: string };

export type DashboardFragment = { __typename?: 'Dashboard', id: string, name?: string | null, uiTree?: { __typename?: 'UITree', child: { __typename?: 'UIGrid', rowHeight: number, children: Array<{ __typename?: 'UIGridItem', x: number, y: number, w: number, h: number }> } | { __typename?: 'UISplit' } | { __typename?: 'UIState', state: string } } | null, panels?: Array<{ __typename?: 'Panel', id: string, kind: PanelKind, name: string, accessors?: Array<string> | null, submitOnChange: boolean, submitOnLoad: boolean, state?: { __typename?: 'State', id: string } | null, reservation?: { __typename?: 'Reservation', id: string, template?: { __typename?: 'Template', id: string } | null } | null }> | null };

export type ListDashboardFragment = { __typename?: 'Dashboard', id: string, name?: string | null };

export type NodeNodeFragment = { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null };

export type TemplateNodeFragment = { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean };

export type InvalidNodeFragment = { __typename?: 'InvalidNode', id: string, initialHash: string };

export type DependencyEdgeFragment = { __typename?: 'DependencyEdge', id: string, source: string, target: string };

export type ImplementationEdgeFragment = { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean };

export type DependencyGraphFragment = { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> };

export type DetailDependencyFragment = { __typename?: 'Dependency', id: string, reference?: string | null, initialHash: any, resolvable: boolean, node?: { __typename?: 'Node', id: string, name: string, hash: any } | null };

export type ListDependencyFragment = { __typename?: 'Dependency', id: string, initialHash: any, reference?: string | null, resolvable: boolean, node?: { __typename?: 'Node', id: string, name: string, hash: any } | null };

export type ListNodeFragment = { __typename?: 'Node', id: string, name: string, description?: string | null, hash: any, kind: NodeKind, scope: NodeScope, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, agent: { __typename?: 'Agent', id: string } }> };

export type GraphNodeNodeFragment = { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> };

export type DetailNodeFragment = { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> };

export type PrimaryNodeFragment = { __typename?: 'Node', id: string, stateful: boolean, name: string, hash: any, description?: string | null, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, args: Array<{ __typename?: 'Port', key: string, identifier?: any | null, kind: PortKind, nullable: boolean, default?: any | null }> };

export type PanelFragment = { __typename?: 'Panel', id: string, kind: PanelKind, name: string, accessors?: Array<string> | null, submitOnChange: boolean, submitOnLoad: boolean, state?: { __typename?: 'State', id: string } | null, reservation?: { __typename?: 'Reservation', id: string, template?: { __typename?: 'Template', id: string } | null } | null };

export type ListPanelFragment = { __typename?: 'Panel', id: string, kind: PanelKind, name: string, submitOnChange: boolean, submitOnLoad: boolean, state?: { __typename?: 'State', id: string } | null };

export type StringAssignWidgetFragment = { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean };

export type SliderAssignWidgetFragment = { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null };

export type StateChoiceAssignWidgetFragment = { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string };

export type FilterPortFragment = { __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null };

export type SearchAssignWidgetFragment = { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null };

export type CustomAssignWidgetFragment = { __typename: 'CustomAssignWidget', ward: string, hook: string };

export type ChoiceAssignWidgetFragment = { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null };

export type ChildPortNestedFragment = { __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null };

export type ChildPortFragment = { __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null };

export type CustomEffectFragment = { __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string };

export type MessageEffectFragment = { __typename: 'MessageEffect', kind: EffectKind, message: string };

type PortEffect_CustomEffect_Fragment = { __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string };

type PortEffect_MessageEffect_Fragment = { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string };

export type PortEffectFragment = PortEffect_CustomEffect_Fragment | PortEffect_MessageEffect_Fragment;

type AssignWidget_ChoiceAssignWidget_Fragment = { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null };

type AssignWidget_CustomAssignWidget_Fragment = { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string };

type AssignWidget_SearchAssignWidget_Fragment = { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null };

type AssignWidget_SliderAssignWidget_Fragment = { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null };

type AssignWidget_StateChoiceAssignWidget_Fragment = { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string };

type AssignWidget_StringAssignWidget_Fragment = { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean };

export type AssignWidgetFragment = AssignWidget_ChoiceAssignWidget_Fragment | AssignWidget_CustomAssignWidget_Fragment | AssignWidget_SearchAssignWidget_Fragment | AssignWidget_SliderAssignWidget_Fragment | AssignWidget_StateChoiceAssignWidget_Fragment | AssignWidget_StringAssignWidget_Fragment;

export type ValidatorFragment = { __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null };

export type PortFragment = { __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null };

export type CustomReturnWidgetFragment = { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string };

export type ChoiceReturnWidgetFragment = { __typename: 'ChoiceReturnWidget', choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null };

type ReturnWidget_ChoiceReturnWidget_Fragment = { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null };

type ReturnWidget_CustomReturnWidget_Fragment = { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string };

export type ReturnWidgetFragment = ReturnWidget_ChoiceReturnWidget_Fragment | ReturnWidget_CustomReturnWidget_Fragment;

export type PortGroupFragment = { __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null };

export type PortsFragment = { __typename?: 'Node', args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> };

export type BindsFragment = { __typename?: 'Binds', templates: Array<string> };

export type PostmanReservationFragment = { __typename?: 'Reservation', title?: string | null, id: string, reference: string, viable: boolean, happy: boolean, node: { __typename?: 'Node', name: string, description?: string | null, hash: any, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, binds?: { __typename?: 'Binds', templates: Array<string> } | null };

export type ListReservationFragment = { __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } };

export type DetailReservationFragment = { __typename?: 'Reservation', title?: string | null, id: string, reference: string, viable: boolean, happy: boolean, node: { __typename?: 'Node', name: string, description?: string | null, hash: any, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, binds?: { __typename?: 'Binds', templates: Array<string> } | null };

export type ShortcutFragment = { __typename?: 'Shortcut', id: string, name: string, description?: string | null, savedArgs: any, allowQuick: boolean, node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }> };

export type ListShortcutFragment = { __typename?: 'Shortcut', id: string, name: string, description?: string | null, allowQuick: boolean, node: { __typename?: 'Node', id: string }, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }> };

export type StateFragment = { __typename?: 'State', id: string, value: any, updatedAt: any, stateSchema: { __typename?: 'StateSchema', hash: string, name: string, ports: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }> } };

export type StateEventFragment = { __typename?: 'State', id: string, value: any, updatedAt: any };

export type DetailTemplateFragment = { __typename?: 'Template', id: string, interface: string, extension: string, params: any, dependencies: Array<{ __typename?: 'Dependency', id: string, initialHash: any, reference?: string | null, resolvable: boolean, node?: { __typename?: 'Node', id: string, name: string, hash: any } | null }>, node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, agent: { __typename?: 'Agent', name: string } };

export type ListTemplateFragment = { __typename?: 'Template', id: string, interface: string, node: { __typename?: 'Node', description?: string | null, name: string, stateful: boolean }, agent: { __typename?: 'Agent', name: string } };

export type TestCaseFragment = { __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } };

export type ListTestCaseFragment = { __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } };

export type TestResultFragment = { __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } };

export type ListTestResultFragment = { __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } };

export type ToolboxFragment = { __typename?: 'Toolbox', id: string, name: string, description: string };

export type ListToolboxFragment = { __typename?: 'Toolbox', id: string, name: string, description: string };

export type AcknowledgeMutationVariables = Exact<{
  assignation: Scalars['ID']['input'];
}>;


export type AcknowledgeMutation = { __typename?: 'Mutation', ack: { __typename?: 'Assignation', id: string, latestEventKind: AssignationEventKind, args: any, reference?: string | null, isDone: boolean, ephemeral: boolean, createdAt: any, events: Array<{ __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } }>, node: { __typename?: 'Node', hash: any, id: string, name: string, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, reservation?: { __typename?: 'Reservation', id: string, title?: string | null, node: { __typename?: 'Node', name: string } } | null, template: { __typename?: 'Template', id: string, interface: string, extension: string } } };

export type PinAgentMutationVariables = Exact<{
  input: PinInput;
}>;


export type PinAgentMutation = { __typename?: 'Mutation', pinAgent: { __typename?: 'Agent', id: string, instanceId: any, pinned: boolean, extensions: Array<string>, name: string, active: boolean, connected: boolean, lastSeen?: any | null, templates: Array<{ __typename?: 'Template', id: string, interface: string, node: { __typename?: 'Node', description?: string | null, name: string, stateful: boolean }, agent: { __typename?: 'Agent', name: string } }>, states: Array<{ __typename?: 'State', id: string, value: any, updatedAt: any, stateSchema: { __typename?: 'StateSchema', hash: string, name: string, ports: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }> } }>, registry: { __typename?: 'Registry', app: { __typename?: 'App', clientId: string }, user: { __typename?: 'User', id: string } } } };

export type DeleteAgentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAgentMutation = { __typename?: 'Mutation', deleteAgent: string };

export type AssignMutationVariables = Exact<{
  input: AssignInput;
}>;


export type AssignMutation = { __typename?: 'Mutation', assign: { __typename?: 'Assignation', id: string, latestEventKind: AssignationEventKind, args: any, reference?: string | null, isDone: boolean, ephemeral: boolean, createdAt: any, events: Array<{ __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } }>, node: { __typename?: 'Node', hash: any, id: string, name: string, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, reservation?: { __typename?: 'Reservation', id: string, title?: string | null, node: { __typename?: 'Node', name: string } } | null, template: { __typename?: 'Template', id: string, interface: string, extension: string } } };

export type CancelMutationVariables = Exact<{
  input: CancelInput;
}>;


export type CancelMutation = { __typename?: 'Mutation', cancel: { __typename?: 'Assignation', id: string, latestEventKind: AssignationEventKind, args: any, reference?: string | null, isDone: boolean, ephemeral: boolean, createdAt: any, events: Array<{ __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } }>, node: { __typename?: 'Node', hash: any, id: string, name: string, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, reservation?: { __typename?: 'Reservation', id: string, title?: string | null, node: { __typename?: 'Node', name: string } } | null, template: { __typename?: 'Template', id: string, interface: string, extension: string } } };

export type InterruptMutationVariables = Exact<{
  input: InterruptInput;
}>;


export type InterruptMutation = { __typename?: 'Mutation', interrupt: { __typename?: 'Assignation', id: string, latestEventKind: AssignationEventKind, args: any, reference?: string | null, isDone: boolean, ephemeral: boolean, createdAt: any, events: Array<{ __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } }>, node: { __typename?: 'Node', hash: any, id: string, name: string, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, reservation?: { __typename?: 'Reservation', id: string, title?: string | null, node: { __typename?: 'Node', name: string } } | null, template: { __typename?: 'Template', id: string, interface: string, extension: string } } };

export type CreateDashboardMutationVariables = Exact<{
  input: CreateDashboardInput;
}>;


export type CreateDashboardMutation = { __typename?: 'Mutation', createDashboard: { __typename?: 'Dashboard', id: string, name?: string | null } };

export type ReinitMutationVariables = Exact<{ [key: string]: never; }>;


export type ReinitMutation = { __typename?: 'Mutation', reinit: string };

export type ReserveMutationVariables = Exact<{
  instanceId: Scalars['InstanceId']['input'];
  node?: InputMaybe<Scalars['ID']['input']>;
  hash?: InputMaybe<Scalars['NodeHash']['input']>;
  template?: InputMaybe<Scalars['ID']['input']>;
  binds?: InputMaybe<BindsInput>;
  title?: InputMaybe<Scalars['String']['input']>;
}>;


export type ReserveMutation = { __typename?: 'Mutation', reserve: { __typename?: 'Reservation', title?: string | null, id: string, reference: string, viable: boolean, happy: boolean, node: { __typename?: 'Node', name: string, description?: string | null, hash: any, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, binds?: { __typename?: 'Binds', templates: Array<string> } | null } };

export type CreateShortcutMutationVariables = Exact<{
  input: CreateShortcutInput;
}>;


export type CreateShortcutMutation = { __typename?: 'Mutation', createShortcut: { __typename?: 'Shortcut', id: string, name: string, description?: string | null, savedArgs: any, allowQuick: boolean, node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }> } };

export type DeleteShortcutMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteShortcutMutation = { __typename?: 'Mutation', deleteShortcut: string };

export type CreateForeignTemplateMutationVariables = Exact<{
  input: CreateForeignTemplateInput;
}>;


export type CreateForeignTemplateMutation = { __typename?: 'Mutation', createForeignTemplate: { __typename?: 'Template', id: string } };

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate: string };

export type UnreserveMutationVariables = Exact<{
  reservation: Scalars['ID']['input'];
}>;


export type UnreserveMutation = { __typename?: 'Mutation', unreserve: string };

export type AgentsQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<AgentFilter>;
  order?: InputMaybe<AgentOrder>;
}>;


export type AgentsQuery = { __typename?: 'Query', agents: Array<{ __typename?: 'Agent', id: string, instanceId: any, active: boolean, connected: boolean, name: string, lastSeen?: any | null, pinned: boolean, registry: { __typename?: 'Registry', app: { __typename?: 'App', clientId: string }, user: { __typename?: 'User', id: string } } }> };

export type AgentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AgentQuery = { __typename?: 'Query', agent: { __typename?: 'Agent', id: string, instanceId: any, pinned: boolean, extensions: Array<string>, name: string, active: boolean, connected: boolean, lastSeen?: any | null, templates: Array<{ __typename?: 'Template', id: string, interface: string, node: { __typename?: 'Node', description?: string | null, name: string, stateful: boolean }, agent: { __typename?: 'Agent', name: string } }>, states: Array<{ __typename?: 'State', id: string, value: any, updatedAt: any, stateSchema: { __typename?: 'StateSchema', hash: string, name: string, ports: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }> } }>, registry: { __typename?: 'Registry', app: { __typename?: 'App', clientId: string }, user: { __typename?: 'User', id: string } } } };

export type AssignationsQueryVariables = Exact<{
  instanceId: Scalars['InstanceId']['input'];
}>;


export type AssignationsQuery = { __typename?: 'Query', assignations: Array<{ __typename?: 'Assignation', id: string, latestEventKind: AssignationEventKind, args: any, reference?: string | null, isDone: boolean, ephemeral: boolean, createdAt: any, events: Array<{ __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } }>, node: { __typename?: 'Node', hash: any, id: string, name: string, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, reservation?: { __typename?: 'Reservation', id: string, title?: string | null, node: { __typename?: 'Node', name: string } } | null, template: { __typename?: 'Template', id: string, interface: string, extension: string } }> };

export type DetailAssignationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailAssignationQuery = { __typename?: 'Query', assignation: { __typename?: 'Assignation', id: string, latestEventKind: AssignationEventKind, args: any, reference?: string | null, isDone: boolean, ephemeral: boolean, createdAt: any, events: Array<{ __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } }>, node: { __typename?: 'Node', hash: any, id: string, name: string, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, reservation?: { __typename?: 'Reservation', id: string, title?: string | null, node: { __typename?: 'Node', name: string } } | null, template: { __typename?: 'Template', id: string, interface: string, extension: string } } };

export type ClientsQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<AppFilter>;
  order?: InputMaybe<AppOrder>;
}>;


export type ClientsQuery = { __typename?: 'Query', clients: Array<{ __typename?: 'App', id: string, name: string, clientId: string }> };

export type GetDashboardQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDashboardQuery = { __typename?: 'Query', dashboard: { __typename?: 'Dashboard', id: string, name?: string | null, uiTree?: { __typename?: 'UITree', child: { __typename?: 'UIGrid', rowHeight: number, children: Array<{ __typename?: 'UIGridItem', x: number, y: number, w: number, h: number }> } | { __typename?: 'UISplit' } | { __typename?: 'UIState', state: string } } | null, panels?: Array<{ __typename?: 'Panel', id: string, kind: PanelKind, name: string, accessors?: Array<string> | null, submitOnChange: boolean, submitOnLoad: boolean, state?: { __typename?: 'State', id: string } | null, reservation?: { __typename?: 'Reservation', id: string, template?: { __typename?: 'Template', id: string } | null } | null }> | null } };

export type ListDashboardsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListDashboardsQuery = { __typename?: 'Query', dashboards: Array<{ __typename?: 'Dashboard', id: string, name?: string | null }> };

export type DependencyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DependencyQuery = { __typename?: 'Query', dependency: { __typename?: 'Dependency', id: string, reference?: string | null, initialHash: any, resolvable: boolean, node?: { __typename?: 'Node', id: string, name: string, hash: any } | null } };

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  noNodes: Scalars['Boolean']['input'];
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', nodes?: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, hash: any, kind: NodeKind, scope: NodeScope, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, agent: { __typename?: 'Agent', id: string } }> }> };

export type HooksSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']>>;
}>;


export type HooksSearchQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Node', value: string, label: string, description?: string | null }> };

export type ConstantNodeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ConstantNodeQuery = { __typename?: 'Query', node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> } };

export type AssignNodeQueryVariables = Exact<{
  reservation?: InputMaybe<Scalars['ID']['input']>;
  template?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  hash?: InputMaybe<Scalars['NodeHash']['input']>;
}>;


export type AssignNodeQuery = { __typename?: 'Query', node: { __typename?: 'Node', name: string, id: string, description?: string | null, hash: any, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> } };

export type ReturnNodeQueryVariables = Exact<{
  assignation: Scalars['ID']['input'];
}>;


export type ReturnNodeQuery = { __typename?: 'Query', node: { __typename?: 'Node', name: string, description?: string | null, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> } };

export type AllNodesQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<NodeFilter>;
  order?: InputMaybe<NodeOrder>;
}>;


export type AllNodesQuery = { __typename?: 'Query', nodes: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, hash: any, kind: NodeKind, scope: NodeScope, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, agent: { __typename?: 'Agent', id: string } }> }> };

export type AllPrimaryNodesQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<NodeFilter>;
  order?: InputMaybe<NodeOrder>;
}>;


export type AllPrimaryNodesQuery = { __typename?: 'Query', nodes: Array<{ __typename?: 'Node', id: string, stateful: boolean, name: string, hash: any, description?: string | null, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, args: Array<{ __typename?: 'Port', key: string, identifier?: any | null, kind: PortKind, nullable: boolean, default?: any | null }> }> };

export type NodeSearchQueryVariables = Exact<{
  filters?: InputMaybe<NodeFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type NodeSearchQuery = { __typename?: 'Query', nodes: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, hash: any, kind: NodeKind, scope: NodeScope, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, agent: { __typename?: 'Agent', id: string } }> }> };

export type DetailNodeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailNodeQuery = { __typename?: 'Query', node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> } };

export type PrimaryNodesQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<NodeOrder>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type PrimaryNodesQuery = { __typename?: 'Query', nodes: Array<{ __typename?: 'Node', id: string, stateful: boolean, name: string, hash: any, description?: string | null, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, args: Array<{ __typename?: 'Port', key: string, identifier?: any | null, kind: PortKind, nullable: boolean, default?: any | null }> }> };

export type PrimaryReturnNodesQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<NodeOrder>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type PrimaryReturnNodesQuery = { __typename?: 'Query', nodes: Array<{ __typename?: 'Node', id: string, stateful: boolean, name: string, hash: any, description?: string | null, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, args: Array<{ __typename?: 'Port', key: string, identifier?: any | null, kind: PortKind, nullable: boolean, default?: any | null }> }> };

export type GetPanelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelQuery = { __typename?: 'Query', panel: { __typename?: 'Panel', id: string, kind: PanelKind, name: string, accessors?: Array<string> | null, submitOnChange: boolean, submitOnLoad: boolean, state?: { __typename?: 'State', id: string } | null, reservation?: { __typename?: 'Reservation', id: string, template?: { __typename?: 'Template', id: string } | null } | null } };

export type ListPanelsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPanelsQuery = { __typename?: 'Query', panels: Array<{ __typename?: 'Panel', id: string, kind: PanelKind, name: string, submitOnChange: boolean, submitOnLoad: boolean, state?: { __typename?: 'State', id: string } | null }> };

export type ProtocolOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']>>;
}>;


export type ProtocolOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Protocol', value: string, label: string }> };

export type ReservationsQueryVariables = Exact<{
  instanceId: Scalars['InstanceId']['input'];
}>;


export type ReservationsQuery = { __typename?: 'Query', reservations: Array<{ __typename?: 'Reservation', title?: string | null, id: string, reference: string, viable: boolean, happy: boolean, node: { __typename?: 'Node', name: string, description?: string | null, hash: any, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, binds?: { __typename?: 'Binds', templates: Array<string> } | null }> };

export type DetailReservationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailReservationQuery = { __typename?: 'Query', reservation: { __typename?: 'Reservation', title?: string | null, id: string, reference: string, viable: boolean, happy: boolean, node: { __typename?: 'Node', name: string, description?: string | null, hash: any, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, binds?: { __typename?: 'Binds', templates: Array<string> } | null } };

export type ShortcutsQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<ShortcutFilter>;
  order?: InputMaybe<ShortcutOrder>;
}>;


export type ShortcutsQuery = { __typename?: 'Query', shortcuts: Array<{ __typename?: 'Shortcut', id: string, name: string, description?: string | null, allowQuick: boolean, node: { __typename?: 'Node', id: string }, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }> }> };

export type ShortcutQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ShortcutQuery = { __typename?: 'Query', shortcut: { __typename?: 'Shortcut', id: string, name: string, description?: string | null, savedArgs: any, allowQuick: boolean, node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }> } };

export type GetStateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStateQuery = { __typename?: 'Query', state: { __typename?: 'State', id: string, value: any, updatedAt: any, stateSchema: { __typename?: 'StateSchema', hash: string, name: string, ports: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }> } } };

export type GetStateForQueryVariables = Exact<{
  template?: InputMaybe<Scalars['ID']['input']>;
  agent?: InputMaybe<Scalars['ID']['input']>;
  stateHash: Scalars['String']['input'];
}>;


export type GetStateForQuery = { __typename?: 'Query', stateFor: { __typename?: 'State', id: string, value: any, updatedAt: any, stateSchema: { __typename?: 'StateSchema', hash: string, name: string, ports: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }> } } };

export type TemplateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TemplateQuery = { __typename?: 'Query', template: { __typename?: 'Template', id: string, interface: string, extension: string, params: any, dependencies: Array<{ __typename?: 'Dependency', id: string, initialHash: any, reference?: string | null, resolvable: boolean, node?: { __typename?: 'Node', id: string, name: string, hash: any } | null }>, node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, agent: { __typename?: 'Agent', name: string } } };

export type TemplatesQueryVariables = Exact<{
  filters?: InputMaybe<TemplateFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type TemplatesQuery = { __typename?: 'Query', templates: Array<{ __typename?: 'Template', id: string, interface: string, extension: string, params: any, dependencies: Array<{ __typename?: 'Dependency', id: string, initialHash: any, reference?: string | null, resolvable: boolean, node?: { __typename?: 'Node', id: string, name: string, hash: any } | null }>, node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, agent: { __typename?: 'Agent', name: string } }> };

export type TemplateAtQueryVariables = Exact<{
  agent: Scalars['ID']['input'];
  extension: Scalars['String']['input'];
  interface: Scalars['String']['input'];
}>;


export type TemplateAtQuery = { __typename?: 'Query', templateAt: { __typename?: 'Template', id: string, interface: string, extension: string, params: any, dependencies: Array<{ __typename?: 'Dependency', id: string, initialHash: any, reference?: string | null, resolvable: boolean, node?: { __typename?: 'Node', id: string, name: string, hash: any } | null }>, node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, agent: { __typename?: 'Agent', name: string } } };

export type MyTemplateAtQueryVariables = Exact<{
  instanceId: Scalars['String']['input'];
  interface?: InputMaybe<Scalars['String']['input']>;
  nodeId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type MyTemplateAtQuery = { __typename?: 'Query', myTemplateAt: { __typename?: 'Template', id: string, interface: string, extension: string, params: any, dependencies: Array<{ __typename?: 'Dependency', id: string, initialHash: any, reference?: string | null, resolvable: boolean, node?: { __typename?: 'Node', id: string, name: string, hash: any } | null }>, node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, agent: { __typename?: 'Agent', name: string } } };

export type NodeTemplateAtQueryVariables = Exact<{
  agent: Scalars['ID']['input'];
  nodeHash: Scalars['String']['input'];
}>;


export type NodeTemplateAtQuery = { __typename?: 'Query', templateAt: { __typename?: 'Template', id: string, interface: string, extension: string, params: any, dependencies: Array<{ __typename?: 'Dependency', id: string, initialHash: any, reference?: string | null, resolvable: boolean, node?: { __typename?: 'Node', id: string, name: string, hash: any } | null }>, node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, agent: { __typename?: 'Agent', name: string } } };

export type ToolboxesQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<ToolboxFilter>;
  order?: InputMaybe<ToolboxOrder>;
}>;


export type ToolboxesQuery = { __typename?: 'Query', toolboxes: Array<{ __typename?: 'Toolbox', id: string, name: string, description: string }> };

export type ToolboxQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ToolboxQuery = { __typename?: 'Query', toolbox: { __typename?: 'Toolbox', id: string, name: string, description: string } };

export type WatchAgentsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type WatchAgentsSubscription = { __typename?: 'Subscription', agents: { __typename?: 'AgentChangeEvent', delete?: string | null, create?: { __typename?: 'Agent', id: string, instanceId: any, active: boolean, connected: boolean, name: string, lastSeen?: any | null, pinned: boolean, registry: { __typename?: 'Registry', app: { __typename?: 'App', clientId: string }, user: { __typename?: 'User', id: string } } } | null, update?: { __typename?: 'Agent', id: string, instanceId: any, active: boolean, connected: boolean, name: string, lastSeen?: any | null, pinned: boolean, registry: { __typename?: 'Registry', app: { __typename?: 'App', clientId: string }, user: { __typename?: 'User', id: string } } } | null } };

export type WatchAssignationEventsSubscriptionVariables = Exact<{
  instanceId: Scalars['InstanceId']['input'];
}>;


export type WatchAssignationEventsSubscription = { __typename?: 'Subscription', assignationEvents: { __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } } };

export type WatchAssignationsSubscriptionVariables = Exact<{
  instanceId: Scalars['InstanceId']['input'];
}>;


export type WatchAssignationsSubscription = { __typename?: 'Subscription', assignations: { __typename?: 'AssignationChangeEvent', create?: { __typename?: 'Assignation', id: string, latestEventKind: AssignationEventKind, args: any, reference?: string | null, isDone: boolean, ephemeral: boolean, createdAt: any, events: Array<{ __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } }>, node: { __typename?: 'Node', hash: any, id: string, name: string, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, reservation?: { __typename?: 'Reservation', id: string, title?: string | null, node: { __typename?: 'Node', name: string } } | null, template: { __typename?: 'Template', id: string, interface: string, extension: string } } | null, event?: { __typename?: 'AssignationEvent', id: string, kind: AssignationEventKind, level?: LogLevel | null, returns?: any | null, progress?: number | null, reference: string, createdAt: any, message?: string | null, assignation: { __typename?: 'Assignation', id: string } } | null } };

export type WatchReservationsSubscriptionVariables = Exact<{
  instanceId: Scalars['InstanceId']['input'];
}>;


export type WatchReservationsSubscription = { __typename?: 'Subscription', reservations: { __typename?: 'Reservation', title?: string | null, id: string, reference: string, viable: boolean, happy: boolean, node: { __typename?: 'Node', name: string, description?: string | null, hash: any, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, binds?: { __typename?: 'Binds', templates: Array<string> } | null } };

export type WatchStateEventsSubscriptionVariables = Exact<{
  stateID: Scalars['ID']['input'];
}>;


export type WatchStateEventsSubscription = { __typename?: 'Subscription', stateUpdateEvents: { __typename?: 'State', id: string, value: any, updatedAt: any } };

export type WatchTemplateSubscriptionVariables = Exact<{
  template: Scalars['ID']['input'];
}>;


export type WatchTemplateSubscription = { __typename?: 'Subscription', templateChange: { __typename?: 'Template', id: string, interface: string, extension: string, params: any, dependencies: Array<{ __typename?: 'Dependency', id: string, initialHash: any, reference?: string | null, resolvable: boolean, node?: { __typename?: 'Node', id: string, name: string, hash: any } | null }>, node: { __typename?: 'Node', name: string, description?: string | null, kind: NodeKind, hash: any, id: string, stateful: boolean, templates: Array<{ __typename?: 'Template', id: string, interface: string }>, reservations?: Array<{ __typename?: 'Reservation', id: string, title?: string | null, reference: string, node: { __typename?: 'Node', name: string, description?: string | null, hash: any } }> | null, dependencyGraph: { __typename?: 'DependencyGraph', nodes: Array<{ __typename?: 'InvalidNode', id: string, initialHash: string } | { __typename?: 'NodeNode', id: string, nodeId: string, name: string, reservationId?: string | null, status?: string | null } | { __typename?: 'TemplateNode', id: string, templateId: string, interface: string, clientId: string, provisionId?: string | null, reservationId?: string | null, linked: boolean, status?: string | null, active: boolean }>, edges: Array<{ __typename?: 'DependencyEdge', id: string, source: string, target: string } | { __typename?: 'ImplementationEdge', id: string, source: string, target: string, linked: boolean }> }, testCases?: Array<{ __typename?: 'TestCase', id: string, name: string, description: string, results: Array<{ __typename?: 'TestResult', id: string, passed: boolean, template: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, tester: { __typename?: 'Template', id: string, interface: string, agent: { __typename?: 'Agent', name: string } }, case: { __typename?: 'TestCase', id: string } }>, tester: { __typename?: 'Node', hash: any } }> | null, tests: Array<{ __typename?: 'Node', id: string, name: string, description?: string | null, runs?: Array<{ __typename?: 'Assignation', latestEventKind: AssignationEventKind, template_id?: any | null }> | null }>, collections: Array<{ __typename?: 'Collection', id: string, name: string }>, protocols: Array<{ __typename?: 'Protocol', name: string }>, args: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'Port', key: string, label?: string | null, nullable: boolean, description?: string | null, scope: PortScope, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ChildPort', kind: PortKind, identifier?: any | null, scope: PortScope, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, assignWidget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ChildPort', kind: PortKind, key: string, identifier?: any | null, scope: PortScope, description?: string | null, nullable: boolean, assignWidget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, followValue?: string | null, stateChoices: string } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, returnWidget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, portGroups: Array<{ __typename?: 'PortGroup', key: string, title?: string | null, description?: string | null, ports: Array<string>, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any, hook: string, ward: string } | { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any, message: string }> | null }> }, agent: { __typename?: 'Agent', name: string } } };

export type WatchTemplatesSubscriptionVariables = Exact<{
  agent: Scalars['ID']['input'];
}>;


export type WatchTemplatesSubscription = { __typename?: 'Subscription', templates: { __typename?: 'TemplateUpdate', delete: string, create: { __typename?: 'Template', id: string, interface: string, node: { __typename?: 'Node', description?: string | null, name: string, stateful: boolean }, agent: { __typename?: 'Agent', name: string } }, update: { __typename?: 'Template', id: string, interface: string, node: { __typename?: 'Node', description?: string | null, name: string, stateful: boolean }, agent: { __typename?: 'Agent', name: string } } } };

export const ListTemplateFragmentDoc = gql`
    fragment ListTemplate on Template {
  id
  interface
  node {
    description
    name
    stateful
  }
  agent {
    name
  }
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
  dependencies
  function
  ...CustomEffect
  ...MessageEffect
}
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
export const FilterPortFragmentDoc = gql`
    fragment FilterPort on ChildPort {
  __typename
  kind
  key
  identifier
  scope
  assignWidget {
    ... on SearchAssignWidget {
      query
    }
  }
  returnWidget {
    ...ReturnWidget
  }
  description
  nullable
}
    ${ReturnWidgetFragmentDoc}`;
export const SearchAssignWidgetFragmentDoc = gql`
    fragment SearchAssignWidget on SearchAssignWidget {
  __typename
  kind
  query
  ward
  filters {
    ...FilterPort
  }
  dependencies
}
    ${FilterPortFragmentDoc}`;
export const SliderAssignWidgetFragmentDoc = gql`
    fragment SliderAssignWidget on SliderAssignWidget {
  __typename
  kind
  min
  max
  step
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
export const StateChoiceAssignWidgetFragmentDoc = gql`
    fragment StateChoiceAssignWidget on StateChoiceAssignWidget {
  __typename
  kind
  followValue
  stateChoices
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
  ...StateChoiceAssignWidget
}
    ${StringAssignWidgetFragmentDoc}
${SearchAssignWidgetFragmentDoc}
${SliderAssignWidgetFragmentDoc}
${ChoiceAssignWidgetFragmentDoc}
${CustomAssignWidgetFragmentDoc}
${StateChoiceAssignWidgetFragmentDoc}`;
export const ChildPortNestedFragmentDoc = gql`
    fragment ChildPortNested on ChildPort {
  __typename
  kind
  key
  identifier
  children {
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
  description
  nullable
}
    ${AssignWidgetFragmentDoc}
${ReturnWidgetFragmentDoc}`;
export const ChildPortFragmentDoc = gql`
    fragment ChildPort on ChildPort {
  __typename
  kind
  key
  identifier
  scope
  children {
    ...ChildPortNested
  }
  assignWidget {
    ...AssignWidget
  }
  returnWidget {
    ...ReturnWidget
  }
  nullable
  description
}
    ${ChildPortNestedFragmentDoc}
${AssignWidgetFragmentDoc}
${ReturnWidgetFragmentDoc}`;
export const ValidatorFragmentDoc = gql`
    fragment Validator on Validator {
  function
  dependencies
  label
  errorMessage
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
  children {
    ...ChildPort
  }
  default
  nullable
  validators {
    ...Validator
  }
}
    ${PortEffectFragmentDoc}
${AssignWidgetFragmentDoc}
${ReturnWidgetFragmentDoc}
${ChildPortFragmentDoc}
${ValidatorFragmentDoc}`;
export const StateFragmentDoc = gql`
    fragment State on State {
  id
  value
  stateSchema {
    hash
    name
    ports {
      ...Port
    }
  }
  updatedAt
}
    ${PortFragmentDoc}`;
export const AgentFragmentDoc = gql`
    fragment Agent on Agent {
  id
  instanceId
  templates {
    ...ListTemplate
  }
  states {
    ...State
  }
  registry {
    app {
      clientId
    }
    user {
      id
    }
  }
  pinned
  extensions
  name
  active
  connected
  lastSeen
}
    ${ListTemplateFragmentDoc}
${StateFragmentDoc}`;
export const ListAgentFragmentDoc = gql`
    fragment ListAgent on Agent {
  id
  instanceId
  active
  connected
  name
  lastSeen
  pinned
  registry {
    app {
      clientId
    }
    user {
      id
    }
  }
}
    `;
export const AgentChangeEventFragmentDoc = gql`
    fragment AgentChangeEvent on AgentChangeEvent {
  create {
    ...ListAgent
  }
  update {
    ...ListAgent
  }
  delete
}
    ${ListAgentFragmentDoc}`;
export const AssignationEventFragmentDoc = gql`
    fragment AssignationEvent on AssignationEvent {
  id
  kind
  level
  returns
  assignation {
    id
  }
  progress
  reference
  createdAt
  message
}
    `;
export const PortGroupFragmentDoc = gql`
    fragment PortGroup on PortGroup {
  key
  title
  description
  effects {
    ...PortEffect
  }
  ports
}
    ${PortEffectFragmentDoc}`;
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
export const PostmanAssignationFragmentDoc = gql`
    fragment PostmanAssignation on Assignation {
  id
  latestEventKind
  args
  reference
  isDone
  events {
    ...AssignationEvent
  }
  ephemeral
  node {
    hash
    id
    name
    ...Ports
  }
  reservation {
    id
    title
    node {
      name
    }
  }
  template {
    id
    interface
    extension
  }
  createdAt
}
    ${AssignationEventFragmentDoc}
${PortsFragmentDoc}`;
export const DetailAssignationFragmentDoc = gql`
    fragment DetailAssignation on Assignation {
  ...PostmanAssignation
}
    ${PostmanAssignationFragmentDoc}`;
export const AssignationChangeEventFragmentDoc = gql`
    fragment AssignationChangeEvent on AssignationChangeEvent {
  create {
    ...PostmanAssignation
  }
  event {
    ...AssignationEvent
  }
}
    ${PostmanAssignationFragmentDoc}
${AssignationEventFragmentDoc}`;
export const ClientFragmentDoc = gql`
    fragment Client on App {
  id
  name
  clientId
}
    `;
export const ListClientFragmentDoc = gql`
    fragment ListClient on App {
  id
  name
  clientId
}
    `;
export const PanelFragmentDoc = gql`
    fragment Panel on Panel {
  id
  kind
  name
  state {
    id
  }
  accessors
  reservation {
    id
    template {
      id
    }
  }
  submitOnChange
  submitOnLoad
}
    `;
export const DashboardFragmentDoc = gql`
    fragment Dashboard on Dashboard {
  id
  name
  uiTree {
    child {
      ... on UIGrid {
        rowHeight
        children {
          x
          y
          w
          h
        }
      }
      ... on UIState {
        state
      }
    }
  }
  panels {
    ...Panel
  }
}
    ${PanelFragmentDoc}`;
export const ListDashboardFragmentDoc = gql`
    fragment ListDashboard on Dashboard {
  id
  name
}
    `;
export const DetailDependencyFragmentDoc = gql`
    fragment DetailDependency on Dependency {
  id
  reference
  initialHash
  node {
    id
    name
    hash
  }
  reference
  resolvable
}
    `;
export const ListNodeFragmentDoc = gql`
    fragment ListNode on Node {
  id
  name
  description
  hash
  kind
  scope
  stateful
  templates {
    id
    agent {
      id
    }
  }
}
    `;
export const PrimaryNodeFragmentDoc = gql`
    fragment PrimaryNode on Node {
  id
  stateful
  name
  hash
  templates {
    id
    interface
  }
  args {
    key
    identifier
    kind
    nullable
    default
  }
  description
}
    `;
export const ListPanelFragmentDoc = gql`
    fragment ListPanel on Panel {
  id
  kind
  state {
    id
  }
  name
  submitOnChange
  submitOnLoad
}
    `;
export const BindsFragmentDoc = gql`
    fragment Binds on Binds {
  templates
}
    `;
export const PostmanReservationFragmentDoc = gql`
    fragment PostmanReservation on Reservation {
  title
  id
  reference
  node {
    ...Ports
    name
    description
    hash
  }
  binds {
    ...Binds
  }
  viable
  happy
}
    ${PortsFragmentDoc}
${BindsFragmentDoc}`;
export const NodeNodeFragmentDoc = gql`
    fragment NodeNode on NodeNode {
  id
  nodeId
  name
  reservationId
  status
}
    `;
export const TemplateNodeFragmentDoc = gql`
    fragment TemplateNode on TemplateNode {
  id
  templateId
  interface
  clientId
  provisionId
  reservationId
  linked
  status
  active
}
    `;
export const InvalidNodeFragmentDoc = gql`
    fragment InvalidNode on InvalidNode {
  id
  initialHash
}
    `;
export const DependencyEdgeFragmentDoc = gql`
    fragment DependencyEdge on DependencyEdge {
  id
  source
  target
}
    `;
export const ImplementationEdgeFragmentDoc = gql`
    fragment ImplementationEdge on ImplementationEdge {
  id
  source
  target
  linked
}
    `;
export const DependencyGraphFragmentDoc = gql`
    fragment DependencyGraph on DependencyGraph {
  nodes {
    ...NodeNode
    ...TemplateNode
    ...InvalidNode
  }
  edges {
    ...DependencyEdge
    ...ImplementationEdge
  }
}
    ${NodeNodeFragmentDoc}
${TemplateNodeFragmentDoc}
${InvalidNodeFragmentDoc}
${DependencyEdgeFragmentDoc}
${ImplementationEdgeFragmentDoc}`;
export const DetailReservationFragmentDoc = gql`
    fragment DetailReservation on Reservation {
  ...PostmanReservation
  node {
    name
    description
    ...Ports
  }
  dependencyGraph {
    ...DependencyGraph
  }
}
    ${PostmanReservationFragmentDoc}
${PortsFragmentDoc}
${DependencyGraphFragmentDoc}`;
export const GraphNodeNodeFragmentDoc = gql`
    fragment GraphNodeNode on Node {
  name
  description
  kind
  hash
  id
  stateful
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
export const ListReservationFragmentDoc = gql`
    fragment ListReservation on Reservation {
  id
  title
  reference
  node {
    name
    description
    hash
  }
}
    `;
export const TestResultFragmentDoc = gql`
    fragment TestResult on TestResult {
  id
  template {
    id
    interface
    agent {
      name
    }
  }
  tester {
    id
    interface
    agent {
      name
    }
  }
  case {
    id
  }
  passed
}
    `;
export const ListTestResultFragmentDoc = gql`
    fragment ListTestResult on TestResult {
  ...TestResult
}
    ${TestResultFragmentDoc}`;
export const TestCaseFragmentDoc = gql`
    fragment TestCase on TestCase {
  id
  name
  description
  results {
    ...ListTestResult
  }
  tester {
    hash
  }
}
    ${ListTestResultFragmentDoc}`;
export const ListTestCaseFragmentDoc = gql`
    fragment ListTestCase on TestCase {
  ...TestCase
}
    ${TestCaseFragmentDoc}`;
export const DetailNodeFragmentDoc = gql`
    fragment DetailNode on Node {
  ...GraphNodeNode
  templates {
    id
    interface
  }
  reservations {
    ...ListReservation
  }
  dependencyGraph {
    ...DependencyGraph
  }
  testCases {
    ...ListTestCase
  }
  tests {
    id
    name
    description
    runs {
      template_id: arg(key: "template")
      latestEventKind
    }
  }
}
    ${GraphNodeNodeFragmentDoc}
${ListReservationFragmentDoc}
${DependencyGraphFragmentDoc}
${ListTestCaseFragmentDoc}`;
export const ShortcutFragmentDoc = gql`
    fragment Shortcut on Shortcut {
  id
  name
  description
  node {
    ...DetailNode
  }
  savedArgs
  args {
    ...Port
  }
  returns {
    ...Port
  }
  allowQuick
}
    ${DetailNodeFragmentDoc}
${PortFragmentDoc}`;
export const ListShortcutFragmentDoc = gql`
    fragment ListShortcut on Shortcut {
  id
  name
  description
  node {
    id
  }
  args {
    ...Port
  }
  returns {
    ...Port
  }
  allowQuick
}
    ${PortFragmentDoc}`;
export const StateEventFragmentDoc = gql`
    fragment StateEvent on State {
  id
  value
  updatedAt
}
    `;
export const ListDependencyFragmentDoc = gql`
    fragment ListDependency on Dependency {
  id
  initialHash
  node {
    id
    name
    hash
  }
  reference
  resolvable
}
    `;
export const DetailTemplateFragmentDoc = gql`
    fragment DetailTemplate on Template {
  id
  interface
  dependencies {
    ...ListDependency
  }
  node {
    ...DetailNode
  }
  extension
  params
  agent {
    name
  }
}
    ${ListDependencyFragmentDoc}
${DetailNodeFragmentDoc}`;
export const ToolboxFragmentDoc = gql`
    fragment Toolbox on Toolbox {
  id
  name
  description
}
    `;
export const ListToolboxFragmentDoc = gql`
    fragment ListToolbox on Toolbox {
  id
  name
  description
}
    `;
export const AgentOptionsDocument = gql`
    query AgentOptions($search: String, $values: [ID!]) {
  options: agents(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useAgentOptionsQuery__
 *
 * To run a query within a React component, call `useAgentOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAgentOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAgentOptionsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useAgentOptionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AgentOptionsQuery, AgentOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AgentOptionsQuery, AgentOptionsQueryVariables>(AgentOptionsDocument, options);
      }
export function useAgentOptionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AgentOptionsQuery, AgentOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AgentOptionsQuery, AgentOptionsQueryVariables>(AgentOptionsDocument, options);
        }
export type AgentOptionsQueryHookResult = ReturnType<typeof useAgentOptionsQuery>;
export type AgentOptionsLazyQueryHookResult = ReturnType<typeof useAgentOptionsLazyQuery>;
export type AgentOptionsQueryResult = Apollo.QueryResult<AgentOptionsQuery, AgentOptionsQueryVariables>;
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
export function useAcknowledgeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AcknowledgeMutation, AcknowledgeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AcknowledgeMutation, AcknowledgeMutationVariables>(AcknowledgeDocument, options);
      }
export type AcknowledgeMutationHookResult = ReturnType<typeof useAcknowledgeMutation>;
export type AcknowledgeMutationResult = Apollo.MutationResult<AcknowledgeMutation>;
export type AcknowledgeMutationOptions = Apollo.BaseMutationOptions<AcknowledgeMutation, AcknowledgeMutationVariables>;
export const PinAgentDocument = gql`
    mutation PinAgent($input: PinInput!) {
  pinAgent(input: $input) {
    ...Agent
  }
}
    ${AgentFragmentDoc}`;
export type PinAgentMutationFn = Apollo.MutationFunction<PinAgentMutation, PinAgentMutationVariables>;

/**
 * __usePinAgentMutation__
 *
 * To run a mutation, you first call `usePinAgentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinAgentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinAgentMutation, { data, loading, error }] = usePinAgentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePinAgentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PinAgentMutation, PinAgentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PinAgentMutation, PinAgentMutationVariables>(PinAgentDocument, options);
      }
export type PinAgentMutationHookResult = ReturnType<typeof usePinAgentMutation>;
export type PinAgentMutationResult = Apollo.MutationResult<PinAgentMutation>;
export type PinAgentMutationOptions = Apollo.BaseMutationOptions<PinAgentMutation, PinAgentMutationVariables>;
export const DeleteAgentDocument = gql`
    mutation DeleteAgent($id: ID!) {
  deleteAgent(input: {id: $id})
}
    `;
export type DeleteAgentMutationFn = Apollo.MutationFunction<DeleteAgentMutation, DeleteAgentMutationVariables>;

/**
 * __useDeleteAgentMutation__
 *
 * To run a mutation, you first call `useDeleteAgentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAgentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAgentMutation, { data, loading, error }] = useDeleteAgentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAgentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAgentMutation, DeleteAgentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteAgentMutation, DeleteAgentMutationVariables>(DeleteAgentDocument, options);
      }
export type DeleteAgentMutationHookResult = ReturnType<typeof useDeleteAgentMutation>;
export type DeleteAgentMutationResult = Apollo.MutationResult<DeleteAgentMutation>;
export type DeleteAgentMutationOptions = Apollo.BaseMutationOptions<DeleteAgentMutation, DeleteAgentMutationVariables>;
export const AssignDocument = gql`
    mutation assign($input: AssignInput!) {
  assign(input: $input) {
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
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAssignMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AssignMutation, AssignMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AssignMutation, AssignMutationVariables>(AssignDocument, options);
      }
export type AssignMutationHookResult = ReturnType<typeof useAssignMutation>;
export type AssignMutationResult = Apollo.MutationResult<AssignMutation>;
export type AssignMutationOptions = Apollo.BaseMutationOptions<AssignMutation, AssignMutationVariables>;
export const CancelDocument = gql`
    mutation cancel($input: CancelInput!) {
  cancel(input: $input) {
    ...PostmanAssignation
  }
}
    ${PostmanAssignationFragmentDoc}`;
export type CancelMutationFn = Apollo.MutationFunction<CancelMutation, CancelMutationVariables>;

/**
 * __useCancelMutation__
 *
 * To run a mutation, you first call `useCancelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelMutation, { data, loading, error }] = useCancelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCancelMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CancelMutation, CancelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CancelMutation, CancelMutationVariables>(CancelDocument, options);
      }
export type CancelMutationHookResult = ReturnType<typeof useCancelMutation>;
export type CancelMutationResult = Apollo.MutationResult<CancelMutation>;
export type CancelMutationOptions = Apollo.BaseMutationOptions<CancelMutation, CancelMutationVariables>;
export const InterruptDocument = gql`
    mutation interrupt($input: InterruptInput!) {
  interrupt(input: $input) {
    ...PostmanAssignation
  }
}
    ${PostmanAssignationFragmentDoc}`;
export type InterruptMutationFn = Apollo.MutationFunction<InterruptMutation, InterruptMutationVariables>;

/**
 * __useInterruptMutation__
 *
 * To run a mutation, you first call `useInterruptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInterruptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [interruptMutation, { data, loading, error }] = useInterruptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInterruptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<InterruptMutation, InterruptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<InterruptMutation, InterruptMutationVariables>(InterruptDocument, options);
      }
export type InterruptMutationHookResult = ReturnType<typeof useInterruptMutation>;
export type InterruptMutationResult = Apollo.MutationResult<InterruptMutation>;
export type InterruptMutationOptions = Apollo.BaseMutationOptions<InterruptMutation, InterruptMutationVariables>;
export const CreateDashboardDocument = gql`
    mutation CreateDashboard($input: CreateDashboardInput!) {
  createDashboard(input: $input) {
    id
    name
  }
}
    `;
export type CreateDashboardMutationFn = Apollo.MutationFunction<CreateDashboardMutation, CreateDashboardMutationVariables>;

/**
 * __useCreateDashboardMutation__
 *
 * To run a mutation, you first call `useCreateDashboardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDashboardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDashboardMutation, { data, loading, error }] = useCreateDashboardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDashboardMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateDashboardMutation, CreateDashboardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateDashboardMutation, CreateDashboardMutationVariables>(CreateDashboardDocument, options);
      }
export type CreateDashboardMutationHookResult = ReturnType<typeof useCreateDashboardMutation>;
export type CreateDashboardMutationResult = Apollo.MutationResult<CreateDashboardMutation>;
export type CreateDashboardMutationOptions = Apollo.BaseMutationOptions<CreateDashboardMutation, CreateDashboardMutationVariables>;
export const ReinitDocument = gql`
    mutation Reinit {
  reinit(input: {})
}
    `;
export type ReinitMutationFn = Apollo.MutationFunction<ReinitMutation, ReinitMutationVariables>;

/**
 * __useReinitMutation__
 *
 * To run a mutation, you first call `useReinitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReinitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reinitMutation, { data, loading, error }] = useReinitMutation({
 *   variables: {
 *   },
 * });
 */
export function useReinitMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ReinitMutation, ReinitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ReinitMutation, ReinitMutationVariables>(ReinitDocument, options);
      }
export type ReinitMutationHookResult = ReturnType<typeof useReinitMutation>;
export type ReinitMutationResult = Apollo.MutationResult<ReinitMutation>;
export type ReinitMutationOptions = Apollo.BaseMutationOptions<ReinitMutation, ReinitMutationVariables>;
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
export function useReserveMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ReserveMutation, ReserveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ReserveMutation, ReserveMutationVariables>(ReserveDocument, options);
      }
export type ReserveMutationHookResult = ReturnType<typeof useReserveMutation>;
export type ReserveMutationResult = Apollo.MutationResult<ReserveMutation>;
export type ReserveMutationOptions = Apollo.BaseMutationOptions<ReserveMutation, ReserveMutationVariables>;
export const CreateShortcutDocument = gql`
    mutation CreateShortcut($input: CreateShortcutInput!) {
  createShortcut(input: $input) {
    ...Shortcut
  }
}
    ${ShortcutFragmentDoc}`;
export type CreateShortcutMutationFn = Apollo.MutationFunction<CreateShortcutMutation, CreateShortcutMutationVariables>;

/**
 * __useCreateShortcutMutation__
 *
 * To run a mutation, you first call `useCreateShortcutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShortcutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShortcutMutation, { data, loading, error }] = useCreateShortcutMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateShortcutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateShortcutMutation, CreateShortcutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateShortcutMutation, CreateShortcutMutationVariables>(CreateShortcutDocument, options);
      }
export type CreateShortcutMutationHookResult = ReturnType<typeof useCreateShortcutMutation>;
export type CreateShortcutMutationResult = Apollo.MutationResult<CreateShortcutMutation>;
export type CreateShortcutMutationOptions = Apollo.BaseMutationOptions<CreateShortcutMutation, CreateShortcutMutationVariables>;
export const DeleteShortcutDocument = gql`
    mutation DeleteShortcut($id: ID!) {
  deleteShortcut(input: {id: $id})
}
    `;
export type DeleteShortcutMutationFn = Apollo.MutationFunction<DeleteShortcutMutation, DeleteShortcutMutationVariables>;

/**
 * __useDeleteShortcutMutation__
 *
 * To run a mutation, you first call `useDeleteShortcutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteShortcutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteShortcutMutation, { data, loading, error }] = useDeleteShortcutMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteShortcutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteShortcutMutation, DeleteShortcutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteShortcutMutation, DeleteShortcutMutationVariables>(DeleteShortcutDocument, options);
      }
export type DeleteShortcutMutationHookResult = ReturnType<typeof useDeleteShortcutMutation>;
export type DeleteShortcutMutationResult = Apollo.MutationResult<DeleteShortcutMutation>;
export type DeleteShortcutMutationOptions = Apollo.BaseMutationOptions<DeleteShortcutMutation, DeleteShortcutMutationVariables>;
export const CreateForeignTemplateDocument = gql`
    mutation CreateForeignTemplate($input: CreateForeignTemplateInput!) {
  createForeignTemplate(input: $input) {
    id
  }
}
    `;
export type CreateForeignTemplateMutationFn = Apollo.MutationFunction<CreateForeignTemplateMutation, CreateForeignTemplateMutationVariables>;

/**
 * __useCreateForeignTemplateMutation__
 *
 * To run a mutation, you first call `useCreateForeignTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateForeignTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createForeignTemplateMutation, { data, loading, error }] = useCreateForeignTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateForeignTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateForeignTemplateMutation, CreateForeignTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateForeignTemplateMutation, CreateForeignTemplateMutationVariables>(CreateForeignTemplateDocument, options);
      }
export type CreateForeignTemplateMutationHookResult = ReturnType<typeof useCreateForeignTemplateMutation>;
export type CreateForeignTemplateMutationResult = Apollo.MutationResult<CreateForeignTemplateMutation>;
export type CreateForeignTemplateMutationOptions = Apollo.BaseMutationOptions<CreateForeignTemplateMutation, CreateForeignTemplateMutationVariables>;
export const DeleteTemplateDocument = gql`
    mutation DeleteTemplate($id: ID!) {
  deleteTemplate(input: {template: $id})
}
    `;
export type DeleteTemplateMutationFn = Apollo.MutationFunction<DeleteTemplateMutation, DeleteTemplateMutationVariables>;

/**
 * __useDeleteTemplateMutation__
 *
 * To run a mutation, you first call `useDeleteTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTemplateMutation, { data, loading, error }] = useDeleteTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteTemplateMutation, DeleteTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteTemplateMutation, DeleteTemplateMutationVariables>(DeleteTemplateDocument, options);
      }
export type DeleteTemplateMutationHookResult = ReturnType<typeof useDeleteTemplateMutation>;
export type DeleteTemplateMutationResult = Apollo.MutationResult<DeleteTemplateMutation>;
export type DeleteTemplateMutationOptions = Apollo.BaseMutationOptions<DeleteTemplateMutation, DeleteTemplateMutationVariables>;
export const UnreserveDocument = gql`
    mutation Unreserve($reservation: ID!) {
  unreserve(input: {reservation: $reservation})
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
export function useUnreserveMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UnreserveMutation, UnreserveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UnreserveMutation, UnreserveMutationVariables>(UnreserveDocument, options);
      }
export type UnreserveMutationHookResult = ReturnType<typeof useUnreserveMutation>;
export type UnreserveMutationResult = Apollo.MutationResult<UnreserveMutation>;
export type UnreserveMutationOptions = Apollo.BaseMutationOptions<UnreserveMutation, UnreserveMutationVariables>;
export const AgentsDocument = gql`
    query Agents($pagination: OffsetPaginationInput, $filters: AgentFilter, $order: AgentOrder) {
  agents(order: $order, pagination: $pagination, filters: $filters) {
    ...ListAgent
  }
}
    ${ListAgentFragmentDoc}`;

/**
 * __useAgentsQuery__
 *
 * To run a query within a React component, call `useAgentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAgentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAgentsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useAgentsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AgentsQuery, AgentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AgentsQuery, AgentsQueryVariables>(AgentsDocument, options);
      }
export function useAgentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AgentsQuery, AgentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AgentsQuery, AgentsQueryVariables>(AgentsDocument, options);
        }
export type AgentsQueryHookResult = ReturnType<typeof useAgentsQuery>;
export type AgentsLazyQueryHookResult = ReturnType<typeof useAgentsLazyQuery>;
export type AgentsQueryResult = Apollo.QueryResult<AgentsQuery, AgentsQueryVariables>;
export const AgentDocument = gql`
    query Agent($id: ID!) {
  agent(id: $id) {
    ...Agent
  }
}
    ${AgentFragmentDoc}`;

/**
 * __useAgentQuery__
 *
 * To run a query within a React component, call `useAgentQuery` and pass it any options that fit your needs.
 * When your component renders, `useAgentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAgentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAgentQuery(baseOptions: ApolloReactHooks.QueryHookOptions<AgentQuery, AgentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AgentQuery, AgentQueryVariables>(AgentDocument, options);
      }
export function useAgentLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AgentQuery, AgentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AgentQuery, AgentQueryVariables>(AgentDocument, options);
        }
export type AgentQueryHookResult = ReturnType<typeof useAgentQuery>;
export type AgentLazyQueryHookResult = ReturnType<typeof useAgentLazyQuery>;
export type AgentQueryResult = Apollo.QueryResult<AgentQuery, AgentQueryVariables>;
export const AssignationsDocument = gql`
    query Assignations($instanceId: InstanceId!) {
  assignations(instanceId: $instanceId) {
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
export function useAssignationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<AssignationsQuery, AssignationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AssignationsQuery, AssignationsQueryVariables>(AssignationsDocument, options);
      }
export function useAssignationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AssignationsQuery, AssignationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AssignationsQuery, AssignationsQueryVariables>(AssignationsDocument, options);
        }
export type AssignationsQueryHookResult = ReturnType<typeof useAssignationsQuery>;
export type AssignationsLazyQueryHookResult = ReturnType<typeof useAssignationsLazyQuery>;
export type AssignationsQueryResult = Apollo.QueryResult<AssignationsQuery, AssignationsQueryVariables>;
export const DetailAssignationDocument = gql`
    query DetailAssignation($id: ID!) {
  assignation(id: $id) {
    ...DetailAssignation
  }
}
    ${DetailAssignationFragmentDoc}`;

/**
 * __useDetailAssignationQuery__
 *
 * To run a query within a React component, call `useDetailAssignationQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailAssignationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailAssignationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailAssignationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailAssignationQuery, DetailAssignationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailAssignationQuery, DetailAssignationQueryVariables>(DetailAssignationDocument, options);
      }
export function useDetailAssignationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailAssignationQuery, DetailAssignationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailAssignationQuery, DetailAssignationQueryVariables>(DetailAssignationDocument, options);
        }
export type DetailAssignationQueryHookResult = ReturnType<typeof useDetailAssignationQuery>;
export type DetailAssignationLazyQueryHookResult = ReturnType<typeof useDetailAssignationLazyQuery>;
export type DetailAssignationQueryResult = Apollo.QueryResult<DetailAssignationQuery, DetailAssignationQueryVariables>;
export const ClientsDocument = gql`
    query Clients($pagination: OffsetPaginationInput, $filters: AppFilter, $order: AppOrder) {
  clients(order: $order, pagination: $pagination, filters: $filters) {
    ...ListClient
  }
}
    ${ListClientFragmentDoc}`;

/**
 * __useClientsQuery__
 *
 * To run a query within a React component, call `useClientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useClientsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ClientsQuery, ClientsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ClientsQuery, ClientsQueryVariables>(ClientsDocument, options);
      }
export function useClientsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ClientsQuery, ClientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ClientsQuery, ClientsQueryVariables>(ClientsDocument, options);
        }
export type ClientsQueryHookResult = ReturnType<typeof useClientsQuery>;
export type ClientsLazyQueryHookResult = ReturnType<typeof useClientsLazyQuery>;
export type ClientsQueryResult = Apollo.QueryResult<ClientsQuery, ClientsQueryVariables>;
export const GetDashboardDocument = gql`
    query GetDashboard($id: ID!) {
  dashboard(id: $id) {
    ...Dashboard
  }
}
    ${DashboardFragmentDoc}`;

/**
 * __useGetDashboardQuery__
 *
 * To run a query within a React component, call `useGetDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDashboardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDashboardQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetDashboardQuery, GetDashboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetDashboardQuery, GetDashboardQueryVariables>(GetDashboardDocument, options);
      }
export function useGetDashboardLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDashboardQuery, GetDashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetDashboardQuery, GetDashboardQueryVariables>(GetDashboardDocument, options);
        }
export type GetDashboardQueryHookResult = ReturnType<typeof useGetDashboardQuery>;
export type GetDashboardLazyQueryHookResult = ReturnType<typeof useGetDashboardLazyQuery>;
export type GetDashboardQueryResult = Apollo.QueryResult<GetDashboardQuery, GetDashboardQueryVariables>;
export const ListDashboardsDocument = gql`
    query ListDashboards {
  dashboards {
    ...ListDashboard
  }
}
    ${ListDashboardFragmentDoc}`;

/**
 * __useListDashboardsQuery__
 *
 * To run a query within a React component, call `useListDashboardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListDashboardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListDashboardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListDashboardsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListDashboardsQuery, ListDashboardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListDashboardsQuery, ListDashboardsQueryVariables>(ListDashboardsDocument, options);
      }
export function useListDashboardsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListDashboardsQuery, ListDashboardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListDashboardsQuery, ListDashboardsQueryVariables>(ListDashboardsDocument, options);
        }
export type ListDashboardsQueryHookResult = ReturnType<typeof useListDashboardsQuery>;
export type ListDashboardsLazyQueryHookResult = ReturnType<typeof useListDashboardsLazyQuery>;
export type ListDashboardsQueryResult = Apollo.QueryResult<ListDashboardsQuery, ListDashboardsQueryVariables>;
export const DependencyDocument = gql`
    query Dependency($id: ID!) {
  dependency(id: $id) {
    ...DetailDependency
  }
}
    ${DetailDependencyFragmentDoc}`;

/**
 * __useDependencyQuery__
 *
 * To run a query within a React component, call `useDependencyQuery` and pass it any options that fit your needs.
 * When your component renders, `useDependencyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDependencyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDependencyQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DependencyQuery, DependencyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DependencyQuery, DependencyQueryVariables>(DependencyDocument, options);
      }
export function useDependencyLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DependencyQuery, DependencyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DependencyQuery, DependencyQueryVariables>(DependencyDocument, options);
        }
export type DependencyQueryHookResult = ReturnType<typeof useDependencyQuery>;
export type DependencyLazyQueryHookResult = ReturnType<typeof useDependencyLazyQuery>;
export type DependencyQueryResult = Apollo.QueryResult<DependencyQuery, DependencyQueryVariables>;
export const GlobalSearchDocument = gql`
    query GlobalSearch($search: String, $noNodes: Boolean!, $pagination: OffsetPaginationInput) {
  nodes: nodes(filters: {search: $search}, pagination: $pagination) @skip(if: $noNodes) {
    ...ListNode
  }
}
    ${ListNodeFragmentDoc}`;

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
 *      noNodes: // value for 'noNodes'
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
export const HooksSearchDocument = gql`
    query HooksSearch($search: String, $values: [ID!]) {
  options: nodes(filters: {protocols: ["hook"], ids: $values, search: $search}) {
    value: id
    label: name
    description: description
  }
}
    `;

/**
 * __useHooksSearchQuery__
 *
 * To run a query within a React component, call `useHooksSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useHooksSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHooksSearchQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useHooksSearchQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<HooksSearchQuery, HooksSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<HooksSearchQuery, HooksSearchQueryVariables>(HooksSearchDocument, options);
      }
export function useHooksSearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<HooksSearchQuery, HooksSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<HooksSearchQuery, HooksSearchQueryVariables>(HooksSearchDocument, options);
        }
export type HooksSearchQueryHookResult = ReturnType<typeof useHooksSearchQuery>;
export type HooksSearchLazyQueryHookResult = ReturnType<typeof useHooksSearchLazyQuery>;
export type HooksSearchQueryResult = Apollo.QueryResult<HooksSearchQuery, HooksSearchQueryVariables>;
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
export function useConstantNodeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ConstantNodeQuery, ConstantNodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ConstantNodeQuery, ConstantNodeQueryVariables>(ConstantNodeDocument, options);
      }
export function useConstantNodeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ConstantNodeQuery, ConstantNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ConstantNodeQuery, ConstantNodeQueryVariables>(ConstantNodeDocument, options);
        }
export type ConstantNodeQueryHookResult = ReturnType<typeof useConstantNodeQuery>;
export type ConstantNodeLazyQueryHookResult = ReturnType<typeof useConstantNodeLazyQuery>;
export type ConstantNodeQueryResult = Apollo.QueryResult<ConstantNodeQuery, ConstantNodeQueryVariables>;
export const AssignNodeDocument = gql`
    query AssignNode($reservation: ID, $template: ID, $id: ID, $hash: NodeHash) {
  node(reservation: $reservation, template: $template, id: $id, hash: $hash) {
    name
    id
    description
    ...Ports
    templates {
      id
      interface
    }
    hash
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
 *      template: // value for 'template'
 *      id: // value for 'id'
 *      hash: // value for 'hash'
 *   },
 * });
 */
export function useAssignNodeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AssignNodeQuery, AssignNodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AssignNodeQuery, AssignNodeQueryVariables>(AssignNodeDocument, options);
      }
export function useAssignNodeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AssignNodeQuery, AssignNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AssignNodeQuery, AssignNodeQueryVariables>(AssignNodeDocument, options);
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
export function useReturnNodeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ReturnNodeQuery, ReturnNodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ReturnNodeQuery, ReturnNodeQueryVariables>(ReturnNodeDocument, options);
      }
export function useReturnNodeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ReturnNodeQuery, ReturnNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ReturnNodeQuery, ReturnNodeQueryVariables>(ReturnNodeDocument, options);
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
export function useAllNodesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AllNodesQuery, AllNodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AllNodesQuery, AllNodesQueryVariables>(AllNodesDocument, options);
      }
export function useAllNodesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AllNodesQuery, AllNodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AllNodesQuery, AllNodesQueryVariables>(AllNodesDocument, options);
        }
export type AllNodesQueryHookResult = ReturnType<typeof useAllNodesQuery>;
export type AllNodesLazyQueryHookResult = ReturnType<typeof useAllNodesLazyQuery>;
export type AllNodesQueryResult = Apollo.QueryResult<AllNodesQuery, AllNodesQueryVariables>;
export const AllPrimaryNodesDocument = gql`
    query AllPrimaryNodes($pagination: OffsetPaginationInput, $filters: NodeFilter, $order: NodeOrder) {
  nodes(order: $order, pagination: $pagination, filters: $filters) {
    ...PrimaryNode
  }
}
    ${PrimaryNodeFragmentDoc}`;

/**
 * __useAllPrimaryNodesQuery__
 *
 * To run a query within a React component, call `useAllPrimaryNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllPrimaryNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllPrimaryNodesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useAllPrimaryNodesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AllPrimaryNodesQuery, AllPrimaryNodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AllPrimaryNodesQuery, AllPrimaryNodesQueryVariables>(AllPrimaryNodesDocument, options);
      }
export function useAllPrimaryNodesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AllPrimaryNodesQuery, AllPrimaryNodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AllPrimaryNodesQuery, AllPrimaryNodesQueryVariables>(AllPrimaryNodesDocument, options);
        }
export type AllPrimaryNodesQueryHookResult = ReturnType<typeof useAllPrimaryNodesQuery>;
export type AllPrimaryNodesLazyQueryHookResult = ReturnType<typeof useAllPrimaryNodesLazyQuery>;
export type AllPrimaryNodesQueryResult = Apollo.QueryResult<AllPrimaryNodesQuery, AllPrimaryNodesQueryVariables>;
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
export function useNodeSearchQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<NodeSearchQuery, NodeSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<NodeSearchQuery, NodeSearchQueryVariables>(NodeSearchDocument, options);
      }
export function useNodeSearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<NodeSearchQuery, NodeSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<NodeSearchQuery, NodeSearchQueryVariables>(NodeSearchDocument, options);
        }
export type NodeSearchQueryHookResult = ReturnType<typeof useNodeSearchQuery>;
export type NodeSearchLazyQueryHookResult = ReturnType<typeof useNodeSearchLazyQuery>;
export type NodeSearchQueryResult = Apollo.QueryResult<NodeSearchQuery, NodeSearchQueryVariables>;
export const DetailNodeDocument = gql`
    query DetailNode($id: ID!) {
  node(id: $id) {
    ...DetailNode
  }
}
    ${DetailNodeFragmentDoc}`;

/**
 * __useDetailNodeQuery__
 *
 * To run a query within a React component, call `useDetailNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailNodeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailNodeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailNodeQuery, DetailNodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailNodeQuery, DetailNodeQueryVariables>(DetailNodeDocument, options);
      }
export function useDetailNodeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailNodeQuery, DetailNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailNodeQuery, DetailNodeQueryVariables>(DetailNodeDocument, options);
        }
export type DetailNodeQueryHookResult = ReturnType<typeof useDetailNodeQuery>;
export type DetailNodeLazyQueryHookResult = ReturnType<typeof useDetailNodeLazyQuery>;
export type DetailNodeQueryResult = Apollo.QueryResult<DetailNodeQuery, DetailNodeQueryVariables>;
export const PrimaryNodesDocument = gql`
    query PrimaryNodes($pagination: OffsetPaginationInput, $identifier: String, $order: NodeOrder, $search: String) {
  nodes(
    order: $order
    pagination: $pagination
    filters: {demands: [{kind: ARGS, matches: [{at: 0, kind: STRUCTURE, identifier: $identifier}]}], search: $search}
  ) {
    ...PrimaryNode
  }
}
    ${PrimaryNodeFragmentDoc}`;

/**
 * __usePrimaryNodesQuery__
 *
 * To run a query within a React component, call `usePrimaryNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePrimaryNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePrimaryNodesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      identifier: // value for 'identifier'
 *      order: // value for 'order'
 *      search: // value for 'search'
 *   },
 * });
 */
export function usePrimaryNodesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<PrimaryNodesQuery, PrimaryNodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PrimaryNodesQuery, PrimaryNodesQueryVariables>(PrimaryNodesDocument, options);
      }
export function usePrimaryNodesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PrimaryNodesQuery, PrimaryNodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PrimaryNodesQuery, PrimaryNodesQueryVariables>(PrimaryNodesDocument, options);
        }
export type PrimaryNodesQueryHookResult = ReturnType<typeof usePrimaryNodesQuery>;
export type PrimaryNodesLazyQueryHookResult = ReturnType<typeof usePrimaryNodesLazyQuery>;
export type PrimaryNodesQueryResult = Apollo.QueryResult<PrimaryNodesQuery, PrimaryNodesQueryVariables>;
export const PrimaryReturnNodesDocument = gql`
    query PrimaryReturnNodes($pagination: OffsetPaginationInput, $identifier: String, $order: NodeOrder, $search: String) {
  nodes(
    order: $order
    pagination: $pagination
    filters: {demands: [{kind: RETURNS, matches: [{at: 0, kind: STRUCTURE, identifier: $identifier}]}, {kind: ARGS, forceStructureLength: 0}], search: $search}
  ) {
    ...PrimaryNode
  }
}
    ${PrimaryNodeFragmentDoc}`;

/**
 * __usePrimaryReturnNodesQuery__
 *
 * To run a query within a React component, call `usePrimaryReturnNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePrimaryReturnNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePrimaryReturnNodesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      identifier: // value for 'identifier'
 *      order: // value for 'order'
 *      search: // value for 'search'
 *   },
 * });
 */
export function usePrimaryReturnNodesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<PrimaryReturnNodesQuery, PrimaryReturnNodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PrimaryReturnNodesQuery, PrimaryReturnNodesQueryVariables>(PrimaryReturnNodesDocument, options);
      }
export function usePrimaryReturnNodesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PrimaryReturnNodesQuery, PrimaryReturnNodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PrimaryReturnNodesQuery, PrimaryReturnNodesQueryVariables>(PrimaryReturnNodesDocument, options);
        }
export type PrimaryReturnNodesQueryHookResult = ReturnType<typeof usePrimaryReturnNodesQuery>;
export type PrimaryReturnNodesLazyQueryHookResult = ReturnType<typeof usePrimaryReturnNodesLazyQuery>;
export type PrimaryReturnNodesQueryResult = Apollo.QueryResult<PrimaryReturnNodesQuery, PrimaryReturnNodesQueryVariables>;
export const GetPanelDocument = gql`
    query GetPanel($id: ID!) {
  panel(id: $id) {
    ...Panel
  }
}
    ${PanelFragmentDoc}`;

/**
 * __useGetPanelQuery__
 *
 * To run a query within a React component, call `useGetPanelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPanelQuery, GetPanelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPanelQuery, GetPanelQueryVariables>(GetPanelDocument, options);
      }
export function useGetPanelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPanelQuery, GetPanelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPanelQuery, GetPanelQueryVariables>(GetPanelDocument, options);
        }
export type GetPanelQueryHookResult = ReturnType<typeof useGetPanelQuery>;
export type GetPanelLazyQueryHookResult = ReturnType<typeof useGetPanelLazyQuery>;
export type GetPanelQueryResult = Apollo.QueryResult<GetPanelQuery, GetPanelQueryVariables>;
export const ListPanelsDocument = gql`
    query ListPanels {
  panels {
    ...ListPanel
  }
}
    ${ListPanelFragmentDoc}`;

/**
 * __useListPanelsQuery__
 *
 * To run a query within a React component, call `useListPanelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPanelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPanelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListPanelsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListPanelsQuery, ListPanelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListPanelsQuery, ListPanelsQueryVariables>(ListPanelsDocument, options);
      }
export function useListPanelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListPanelsQuery, ListPanelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListPanelsQuery, ListPanelsQueryVariables>(ListPanelsDocument, options);
        }
export type ListPanelsQueryHookResult = ReturnType<typeof useListPanelsQuery>;
export type ListPanelsLazyQueryHookResult = ReturnType<typeof useListPanelsLazyQuery>;
export type ListPanelsQueryResult = Apollo.QueryResult<ListPanelsQuery, ListPanelsQueryVariables>;
export const ProtocolOptionsDocument = gql`
    query ProtocolOptions($search: String, $values: [ID!]) {
  options: protocols(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useProtocolOptionsQuery__
 *
 * To run a query within a React component, call `useProtocolOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProtocolOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProtocolOptionsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useProtocolOptionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProtocolOptionsQuery, ProtocolOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ProtocolOptionsQuery, ProtocolOptionsQueryVariables>(ProtocolOptionsDocument, options);
      }
export function useProtocolOptionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProtocolOptionsQuery, ProtocolOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ProtocolOptionsQuery, ProtocolOptionsQueryVariables>(ProtocolOptionsDocument, options);
        }
export type ProtocolOptionsQueryHookResult = ReturnType<typeof useProtocolOptionsQuery>;
export type ProtocolOptionsLazyQueryHookResult = ReturnType<typeof useProtocolOptionsLazyQuery>;
export type ProtocolOptionsQueryResult = Apollo.QueryResult<ProtocolOptionsQuery, ProtocolOptionsQueryVariables>;
export const ReservationsDocument = gql`
    query Reservations($instanceId: InstanceId!) {
  reservations(instanceId: $instanceId) {
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
export function useReservationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ReservationsQuery, ReservationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ReservationsQuery, ReservationsQueryVariables>(ReservationsDocument, options);
      }
export function useReservationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ReservationsQuery, ReservationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ReservationsQuery, ReservationsQueryVariables>(ReservationsDocument, options);
        }
export type ReservationsQueryHookResult = ReturnType<typeof useReservationsQuery>;
export type ReservationsLazyQueryHookResult = ReturnType<typeof useReservationsLazyQuery>;
export type ReservationsQueryResult = Apollo.QueryResult<ReservationsQuery, ReservationsQueryVariables>;
export const DetailReservationDocument = gql`
    query DetailReservation($id: ID!) {
  reservation(id: $id) {
    ...DetailReservation
  }
}
    ${DetailReservationFragmentDoc}`;

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
export function useDetailReservationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailReservationQuery, DetailReservationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailReservationQuery, DetailReservationQueryVariables>(DetailReservationDocument, options);
      }
export function useDetailReservationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailReservationQuery, DetailReservationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailReservationQuery, DetailReservationQueryVariables>(DetailReservationDocument, options);
        }
export type DetailReservationQueryHookResult = ReturnType<typeof useDetailReservationQuery>;
export type DetailReservationLazyQueryHookResult = ReturnType<typeof useDetailReservationLazyQuery>;
export type DetailReservationQueryResult = Apollo.QueryResult<DetailReservationQuery, DetailReservationQueryVariables>;
export const ShortcutsDocument = gql`
    query Shortcuts($pagination: OffsetPaginationInput, $filters: ShortcutFilter, $order: ShortcutOrder) {
  shortcuts(order: $order, pagination: $pagination, filters: $filters) {
    ...ListShortcut
  }
}
    ${ListShortcutFragmentDoc}`;

/**
 * __useShortcutsQuery__
 *
 * To run a query within a React component, call `useShortcutsQuery` and pass it any options that fit your needs.
 * When your component renders, `useShortcutsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShortcutsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useShortcutsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ShortcutsQuery, ShortcutsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ShortcutsQuery, ShortcutsQueryVariables>(ShortcutsDocument, options);
      }
export function useShortcutsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ShortcutsQuery, ShortcutsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ShortcutsQuery, ShortcutsQueryVariables>(ShortcutsDocument, options);
        }
export type ShortcutsQueryHookResult = ReturnType<typeof useShortcutsQuery>;
export type ShortcutsLazyQueryHookResult = ReturnType<typeof useShortcutsLazyQuery>;
export type ShortcutsQueryResult = Apollo.QueryResult<ShortcutsQuery, ShortcutsQueryVariables>;
export const ShortcutDocument = gql`
    query Shortcut($id: ID!) {
  shortcut(id: $id) {
    ...Shortcut
  }
}
    ${ShortcutFragmentDoc}`;

/**
 * __useShortcutQuery__
 *
 * To run a query within a React component, call `useShortcutQuery` and pass it any options that fit your needs.
 * When your component renders, `useShortcutQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShortcutQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useShortcutQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ShortcutQuery, ShortcutQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ShortcutQuery, ShortcutQueryVariables>(ShortcutDocument, options);
      }
export function useShortcutLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ShortcutQuery, ShortcutQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ShortcutQuery, ShortcutQueryVariables>(ShortcutDocument, options);
        }
export type ShortcutQueryHookResult = ReturnType<typeof useShortcutQuery>;
export type ShortcutLazyQueryHookResult = ReturnType<typeof useShortcutLazyQuery>;
export type ShortcutQueryResult = Apollo.QueryResult<ShortcutQuery, ShortcutQueryVariables>;
export const GetStateDocument = gql`
    query GetState($id: ID!) {
  state(id: $id) {
    ...State
  }
}
    ${StateFragmentDoc}`;

/**
 * __useGetStateQuery__
 *
 * To run a query within a React component, call `useGetStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStateQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStateQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetStateQuery, GetStateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetStateQuery, GetStateQueryVariables>(GetStateDocument, options);
      }
export function useGetStateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetStateQuery, GetStateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetStateQuery, GetStateQueryVariables>(GetStateDocument, options);
        }
export type GetStateQueryHookResult = ReturnType<typeof useGetStateQuery>;
export type GetStateLazyQueryHookResult = ReturnType<typeof useGetStateLazyQuery>;
export type GetStateQueryResult = Apollo.QueryResult<GetStateQuery, GetStateQueryVariables>;
export const GetStateForDocument = gql`
    query GetStateFor($template: ID, $agent: ID, $stateHash: String!) {
  stateFor(template: $template, agent: $agent, stateHash: $stateHash) {
    ...State
  }
}
    ${StateFragmentDoc}`;

/**
 * __useGetStateForQuery__
 *
 * To run a query within a React component, call `useGetStateForQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStateForQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStateForQuery({
 *   variables: {
 *      template: // value for 'template'
 *      agent: // value for 'agent'
 *      stateHash: // value for 'stateHash'
 *   },
 * });
 */
export function useGetStateForQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetStateForQuery, GetStateForQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetStateForQuery, GetStateForQueryVariables>(GetStateForDocument, options);
      }
export function useGetStateForLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetStateForQuery, GetStateForQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetStateForQuery, GetStateForQueryVariables>(GetStateForDocument, options);
        }
export type GetStateForQueryHookResult = ReturnType<typeof useGetStateForQuery>;
export type GetStateForLazyQueryHookResult = ReturnType<typeof useGetStateForLazyQuery>;
export type GetStateForQueryResult = Apollo.QueryResult<GetStateForQuery, GetStateForQueryVariables>;
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
export function useTemplateQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TemplateQuery, TemplateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TemplateQuery, TemplateQueryVariables>(TemplateDocument, options);
      }
export function useTemplateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TemplateQuery, TemplateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TemplateQuery, TemplateQueryVariables>(TemplateDocument, options);
        }
export type TemplateQueryHookResult = ReturnType<typeof useTemplateQuery>;
export type TemplateLazyQueryHookResult = ReturnType<typeof useTemplateLazyQuery>;
export type TemplateQueryResult = Apollo.QueryResult<TemplateQuery, TemplateQueryVariables>;
export const TemplatesDocument = gql`
    query Templates($filters: TemplateFilter, $pagination: OffsetPaginationInput) {
  templates(filters: $filters, pagination: $pagination) {
    ...DetailTemplate
  }
}
    ${DetailTemplateFragmentDoc}`;

/**
 * __useTemplatesQuery__
 *
 * To run a query within a React component, call `useTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplatesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useTemplatesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TemplatesQuery, TemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TemplatesQuery, TemplatesQueryVariables>(TemplatesDocument, options);
      }
export function useTemplatesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TemplatesQuery, TemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TemplatesQuery, TemplatesQueryVariables>(TemplatesDocument, options);
        }
export type TemplatesQueryHookResult = ReturnType<typeof useTemplatesQuery>;
export type TemplatesLazyQueryHookResult = ReturnType<typeof useTemplatesLazyQuery>;
export type TemplatesQueryResult = Apollo.QueryResult<TemplatesQuery, TemplatesQueryVariables>;
export const TemplateAtDocument = gql`
    query TemplateAt($agent: ID!, $extension: String!, $interface: String!) {
  templateAt(agent: $agent, extension: $extension, interface: $interface) {
    ...DetailTemplate
  }
}
    ${DetailTemplateFragmentDoc}`;

/**
 * __useTemplateAtQuery__
 *
 * To run a query within a React component, call `useTemplateAtQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplateAtQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplateAtQuery({
 *   variables: {
 *      agent: // value for 'agent'
 *      extension: // value for 'extension'
 *      interface: // value for 'interface'
 *   },
 * });
 */
export function useTemplateAtQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TemplateAtQuery, TemplateAtQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TemplateAtQuery, TemplateAtQueryVariables>(TemplateAtDocument, options);
      }
export function useTemplateAtLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TemplateAtQuery, TemplateAtQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TemplateAtQuery, TemplateAtQueryVariables>(TemplateAtDocument, options);
        }
export type TemplateAtQueryHookResult = ReturnType<typeof useTemplateAtQuery>;
export type TemplateAtLazyQueryHookResult = ReturnType<typeof useTemplateAtLazyQuery>;
export type TemplateAtQueryResult = Apollo.QueryResult<TemplateAtQuery, TemplateAtQueryVariables>;
export const MyTemplateAtDocument = gql`
    query MyTemplateAt($instanceId: String!, $interface: String, $nodeId: ID) {
  myTemplateAt(instanceId: $instanceId, interface: $interface, nodeId: $nodeId) {
    ...DetailTemplate
  }
}
    ${DetailTemplateFragmentDoc}`;

/**
 * __useMyTemplateAtQuery__
 *
 * To run a query within a React component, call `useMyTemplateAtQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyTemplateAtQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyTemplateAtQuery({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *      interface: // value for 'interface'
 *      nodeId: // value for 'nodeId'
 *   },
 * });
 */
export function useMyTemplateAtQuery(baseOptions: ApolloReactHooks.QueryHookOptions<MyTemplateAtQuery, MyTemplateAtQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MyTemplateAtQuery, MyTemplateAtQueryVariables>(MyTemplateAtDocument, options);
      }
export function useMyTemplateAtLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyTemplateAtQuery, MyTemplateAtQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MyTemplateAtQuery, MyTemplateAtQueryVariables>(MyTemplateAtDocument, options);
        }
export type MyTemplateAtQueryHookResult = ReturnType<typeof useMyTemplateAtQuery>;
export type MyTemplateAtLazyQueryHookResult = ReturnType<typeof useMyTemplateAtLazyQuery>;
export type MyTemplateAtQueryResult = Apollo.QueryResult<MyTemplateAtQuery, MyTemplateAtQueryVariables>;
export const NodeTemplateAtDocument = gql`
    query NodeTemplateAt($agent: ID!, $nodeHash: String!) {
  templateAt(agent: $agent, nodeHash: $nodeHash) {
    ...DetailTemplate
  }
}
    ${DetailTemplateFragmentDoc}`;

/**
 * __useNodeTemplateAtQuery__
 *
 * To run a query within a React component, call `useNodeTemplateAtQuery` and pass it any options that fit your needs.
 * When your component renders, `useNodeTemplateAtQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNodeTemplateAtQuery({
 *   variables: {
 *      agent: // value for 'agent'
 *      nodeHash: // value for 'nodeHash'
 *   },
 * });
 */
export function useNodeTemplateAtQuery(baseOptions: ApolloReactHooks.QueryHookOptions<NodeTemplateAtQuery, NodeTemplateAtQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<NodeTemplateAtQuery, NodeTemplateAtQueryVariables>(NodeTemplateAtDocument, options);
      }
export function useNodeTemplateAtLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<NodeTemplateAtQuery, NodeTemplateAtQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<NodeTemplateAtQuery, NodeTemplateAtQueryVariables>(NodeTemplateAtDocument, options);
        }
export type NodeTemplateAtQueryHookResult = ReturnType<typeof useNodeTemplateAtQuery>;
export type NodeTemplateAtLazyQueryHookResult = ReturnType<typeof useNodeTemplateAtLazyQuery>;
export type NodeTemplateAtQueryResult = Apollo.QueryResult<NodeTemplateAtQuery, NodeTemplateAtQueryVariables>;
export const ToolboxesDocument = gql`
    query Toolboxes($pagination: OffsetPaginationInput, $filters: ToolboxFilter, $order: ToolboxOrder) {
  toolboxes(order: $order, pagination: $pagination, filters: $filters) {
    ...ListToolbox
  }
}
    ${ListToolboxFragmentDoc}`;

/**
 * __useToolboxesQuery__
 *
 * To run a query within a React component, call `useToolboxesQuery` and pass it any options that fit your needs.
 * When your component renders, `useToolboxesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useToolboxesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useToolboxesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ToolboxesQuery, ToolboxesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ToolboxesQuery, ToolboxesQueryVariables>(ToolboxesDocument, options);
      }
export function useToolboxesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ToolboxesQuery, ToolboxesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ToolboxesQuery, ToolboxesQueryVariables>(ToolboxesDocument, options);
        }
export type ToolboxesQueryHookResult = ReturnType<typeof useToolboxesQuery>;
export type ToolboxesLazyQueryHookResult = ReturnType<typeof useToolboxesLazyQuery>;
export type ToolboxesQueryResult = Apollo.QueryResult<ToolboxesQuery, ToolboxesQueryVariables>;
export const ToolboxDocument = gql`
    query Toolbox($id: ID!) {
  toolbox(id: $id) {
    ...Toolbox
  }
}
    ${ToolboxFragmentDoc}`;

/**
 * __useToolboxQuery__
 *
 * To run a query within a React component, call `useToolboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useToolboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useToolboxQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useToolboxQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ToolboxQuery, ToolboxQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ToolboxQuery, ToolboxQueryVariables>(ToolboxDocument, options);
      }
export function useToolboxLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ToolboxQuery, ToolboxQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ToolboxQuery, ToolboxQueryVariables>(ToolboxDocument, options);
        }
export type ToolboxQueryHookResult = ReturnType<typeof useToolboxQuery>;
export type ToolboxLazyQueryHookResult = ReturnType<typeof useToolboxLazyQuery>;
export type ToolboxQueryResult = Apollo.QueryResult<ToolboxQuery, ToolboxQueryVariables>;
export const WatchAgentsDocument = gql`
    subscription WatchAgents {
  agents {
    ...AgentChangeEvent
  }
}
    ${AgentChangeEventFragmentDoc}`;

/**
 * __useWatchAgentsSubscription__
 *
 * To run a query within a React component, call `useWatchAgentsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWatchAgentsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWatchAgentsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useWatchAgentsSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<WatchAgentsSubscription, WatchAgentsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<WatchAgentsSubscription, WatchAgentsSubscriptionVariables>(WatchAgentsDocument, options);
      }
export type WatchAgentsSubscriptionHookResult = ReturnType<typeof useWatchAgentsSubscription>;
export type WatchAgentsSubscriptionResult = Apollo.SubscriptionResult<WatchAgentsSubscription>;
export const WatchAssignationEventsDocument = gql`
    subscription WatchAssignationEvents($instanceId: InstanceId!) {
  assignationEvents(instanceId: $instanceId) {
    ...AssignationEvent
  }
}
    ${AssignationEventFragmentDoc}`;

/**
 * __useWatchAssignationEventsSubscription__
 *
 * To run a query within a React component, call `useWatchAssignationEventsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWatchAssignationEventsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWatchAssignationEventsSubscription({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *   },
 * });
 */
export function useWatchAssignationEventsSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<WatchAssignationEventsSubscription, WatchAssignationEventsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<WatchAssignationEventsSubscription, WatchAssignationEventsSubscriptionVariables>(WatchAssignationEventsDocument, options);
      }
export type WatchAssignationEventsSubscriptionHookResult = ReturnType<typeof useWatchAssignationEventsSubscription>;
export type WatchAssignationEventsSubscriptionResult = Apollo.SubscriptionResult<WatchAssignationEventsSubscription>;
export const WatchAssignationsDocument = gql`
    subscription WatchAssignations($instanceId: InstanceId!) {
  assignations(instanceId: $instanceId) {
    ...AssignationChangeEvent
  }
}
    ${AssignationChangeEventFragmentDoc}`;

/**
 * __useWatchAssignationsSubscription__
 *
 * To run a query within a React component, call `useWatchAssignationsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWatchAssignationsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWatchAssignationsSubscription({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *   },
 * });
 */
export function useWatchAssignationsSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<WatchAssignationsSubscription, WatchAssignationsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<WatchAssignationsSubscription, WatchAssignationsSubscriptionVariables>(WatchAssignationsDocument, options);
      }
export type WatchAssignationsSubscriptionHookResult = ReturnType<typeof useWatchAssignationsSubscription>;
export type WatchAssignationsSubscriptionResult = Apollo.SubscriptionResult<WatchAssignationsSubscription>;
export const WatchReservationsDocument = gql`
    subscription WatchReservations($instanceId: InstanceId!) {
  reservations(instanceId: $instanceId) {
    ...PostmanReservation
  }
}
    ${PostmanReservationFragmentDoc}`;

/**
 * __useWatchReservationsSubscription__
 *
 * To run a query within a React component, call `useWatchReservationsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWatchReservationsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWatchReservationsSubscription({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *   },
 * });
 */
export function useWatchReservationsSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<WatchReservationsSubscription, WatchReservationsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<WatchReservationsSubscription, WatchReservationsSubscriptionVariables>(WatchReservationsDocument, options);
      }
export type WatchReservationsSubscriptionHookResult = ReturnType<typeof useWatchReservationsSubscription>;
export type WatchReservationsSubscriptionResult = Apollo.SubscriptionResult<WatchReservationsSubscription>;
export const WatchStateEventsDocument = gql`
    subscription WatchStateEvents($stateID: ID!) {
  stateUpdateEvents(stateId: $stateID) {
    ...StateEvent
  }
}
    ${StateEventFragmentDoc}`;

/**
 * __useWatchStateEventsSubscription__
 *
 * To run a query within a React component, call `useWatchStateEventsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWatchStateEventsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWatchStateEventsSubscription({
 *   variables: {
 *      stateID: // value for 'stateID'
 *   },
 * });
 */
export function useWatchStateEventsSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<WatchStateEventsSubscription, WatchStateEventsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<WatchStateEventsSubscription, WatchStateEventsSubscriptionVariables>(WatchStateEventsDocument, options);
      }
export type WatchStateEventsSubscriptionHookResult = ReturnType<typeof useWatchStateEventsSubscription>;
export type WatchStateEventsSubscriptionResult = Apollo.SubscriptionResult<WatchStateEventsSubscription>;
export const WatchTemplateDocument = gql`
    subscription WatchTemplate($template: ID!) {
  templateChange(template: $template) {
    ...DetailTemplate
  }
}
    ${DetailTemplateFragmentDoc}`;

/**
 * __useWatchTemplateSubscription__
 *
 * To run a query within a React component, call `useWatchTemplateSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWatchTemplateSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWatchTemplateSubscription({
 *   variables: {
 *      template: // value for 'template'
 *   },
 * });
 */
export function useWatchTemplateSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<WatchTemplateSubscription, WatchTemplateSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<WatchTemplateSubscription, WatchTemplateSubscriptionVariables>(WatchTemplateDocument, options);
      }
export type WatchTemplateSubscriptionHookResult = ReturnType<typeof useWatchTemplateSubscription>;
export type WatchTemplateSubscriptionResult = Apollo.SubscriptionResult<WatchTemplateSubscription>;
export const WatchTemplatesDocument = gql`
    subscription WatchTemplates($agent: ID!) {
  templates(agent: $agent) {
    create {
      ...ListTemplate
    }
    update {
      ...ListTemplate
    }
    delete
  }
}
    ${ListTemplateFragmentDoc}`;

/**
 * __useWatchTemplatesSubscription__
 *
 * To run a query within a React component, call `useWatchTemplatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWatchTemplatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWatchTemplatesSubscription({
 *   variables: {
 *      agent: // value for 'agent'
 *   },
 * });
 */
export function useWatchTemplatesSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<WatchTemplatesSubscription, WatchTemplatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<WatchTemplatesSubscription, WatchTemplatesSubscriptionVariables>(WatchTemplatesDocument, options);
      }
export type WatchTemplatesSubscriptionHookResult = ReturnType<typeof useWatchTemplatesSubscription>;
export type WatchTemplatesSubscriptionResult = Apollo.SubscriptionResult<WatchTemplatesSubscription>;