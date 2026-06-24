import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@/lib/kabinet/hooks';
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
  /** The `ArrayLike` scalar type represents a reference to a store previously created by the user n a datalayer */
  ActionHash: { input: any; output: any; }
  /** The `ArrayLike` scalar type represents a reference to a store previously created by the user n a datalayer */
  AnyDefault: { input: any; output: any; }
  /** The `Arg` scalar type represents a an Argument in a Action assignment */
  Arg: { input: any; output: any; }
  /** Date with time (isoformat) */
  DateTime: { input: any; output: any; }
  /** The `ArrayLike` scalar type represents a reference to a store previously created by the user n a datalayer */
  Identifier: { input: any; output: any; }
  /** The `JSONSerializable` scalar type represents a JSON-serializable value. */
  JSONSerializable: { input: any; output: any; }
  /** The `ArrayLike` scalar type represents a reference to a store previously created by the user n a datalayer */
  SearchQuery: { input: any; output: any; }
  /** An untyped, free-form JSON object whose shape is not known to the schema. */
  UntypedParams: { input: any; output: any; }
  /**
   *
   *     The `Validator` scalar represents a javascript function that should execute on the client side (inside a shadow realm)
   *       to validate a value (or a set of values) before it is sent to the server.  The function has two parameters (value, otherValues) and should return a string if the value is invalid and undefined if the value is valid.
   *         The otherValues parameter is an object with the other values in the form {fieldName: value}.
   */
  ValidatorFunction: { input: any; output: any; }
};

/** A JSON-serializable argument entry for a multi-agent action trigger. */
export type ActionArgumentInput = {
  /** Defines a nested agent call if this argument should trigger an agent interaction. */
  agentCall?: InputMaybe<AgentCallInput>;
  /** The argument property name. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Defines a nested utility call if this argument should trigger a system utility interaction. */
  utilCall?: InputMaybe<UtilCallInput>;
  /** Defines a list of key-value pairs if this argument should be a dictionary. */
  valueDict?: InputMaybe<Array<ActionArgumentInput>>;
  /** Defines a list of values if this argument should be an array. */
  valueList?: InputMaybe<Array<ActionArgumentInput>>;
  /** Static literal value if not dynamically bound. */
  valueLiteral?: InputMaybe<Scalars['JSONSerializable']['input']>;
  /** JSON Pointer referencing the shared Blok state to inject into this argument slot dynamically. */
  valuePath?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A dependency for a implementation. By defining dependencies, you can
 *     create a dependency graph for your implementations and actions
 */
export type ActionDependencyInput = {
  /** The key of the state this dependency corresponds to. (i.e frame:acquireimage) */
  actionKey?: InputMaybe<Scalars['String']['input']>;
  /** Allow inactive nodes, defaults to true */
  allowInactive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Which app this dependency corresponds to (i.e. do you want to use a stardist agent for that or imagej agents needs to be a world unique classsifier (reverse domain notation) that identifies the type of agent you want to use, and then we can have multiple agents of the same type running in the system, e.g. startdist could be the app for all agents that correpsond to a startdist instance) */
  app?: InputMaybe<Scalars['String']['input']>;
  /** The demands for the action args, this can be additionaly specified so that when we loosen the matching criteria for an action in a resolver, we can still make sure to match the right action based on the demands for the args. This is used to identify the demand in the system. */
  argMatches?: InputMaybe<Array<PortMatchInput>>;
  /** The description of the action. This can describe the action and its purpose. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Require that the action has a specific number of args. When loosing the matching criteria for an action in a resolver, we can still make sure to match the right action based on the demands for the args. This is used to identify the demand in the system. */
  forceArgLength?: InputMaybe<Scalars['Int']['input']>;
  /** Require that the action has a specific number of returns. This is used to identify the demand in the system. */
  forceReturnLength?: InputMaybe<Scalars['Int']['input']>;
  /** The key of the action. This is used to identify the dependency in the system. */
  key: Scalars['String']['input'];
  /** The name of the action. This is used to identify the action in the system. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Whether the dependency is optional or not. If the dependency is optional, the agent doesn't have to provide it to be potentially callable */
  optional?: Scalars['Boolean']['input'];
  /** The protocols that the action is implementing or relying on. This is used to identify the demand in the system, and can be used to match actions that are implementing the same protocol together. */
  protocols?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** The demands for the action returns, this can be additionaly specified so that when we loosen the matching criteria for an action in a resolver, we can still make sure to match the right action based on the demands for the returns. This is used to identify the demand in the system. */
  returnMatches?: InputMaybe<Array<PortMatchInput>>;
  /** The version of the action this dependency corresponds to. */
  version?: InputMaybe<Scalars['String']['input']>;
};

/** The kind of action. */
export enum ActionKind {
  Function = 'FUNCTION',
  Generator = 'GENERATOR'
}

/** The kind of action scope. */
export enum ActionScope {
  BridgeGlobalToLocal = 'BRIDGE_GLOBAL_TO_LOCAL',
  BridgeLocalToGlobal = 'BRIDGE_LOCAL_TO_GLOBAL',
  Global = 'GLOBAL',
  Local = 'LOCAL'
}

/** Defines a callback that routes user interactions directly to an Arkitekt Agent via Rekuest. */
export type AgentCallInput = {
  /** Key-value arguments map compiled for the target agent call. */
  arguments?: InputMaybe<Array<ActionArgumentInput>>;
  /** The abstract agent dependency key declared in the Blok manifest (e.g., 'stage_dep'). */
  dependency: Scalars['String']['input'];
  /** The target function name registered on that specific agent's worker thread loop. */
  operation: Scalars['String']['input'];
};

/**
 * A dependency for a implementation. By defining dependencies, you can
 *     create a dependency graph for your implementations and actions
 */
export type AgentDependencyInput = {
  /** The action demands of the agent. This is used to identify the demand in the system. */
  actionDemands?: InputMaybe<Array<ActionDependencyInput>>;
  /** Which app this dependency corresponds to (i.e. do you want to use a stardist agent for that or imagej agents needs to be a world unique classsifier (reverse domain notation) that identifies the type of agent you want to use, and then we can have multiple agents of the same type running in the system, e.g. startdist could be the app for all agents that correpsond to a startdist instance) */
  app?: InputMaybe<Scalars['String']['input']>;
  /** The policy used to pick which instance of the agent to assign to. */
  assignPolicy?: AssignPolicy;
  /** Whether this dependency is auto resolvable or not. If so we will try to automatically resolve it based on the demands specified in the dependency and the capabilities of the available agents in the system. This is used to identify the demand in the system. Attention if any of the dependencies of this agent dependency is not auto resolvable, this dependency will also not be auto resolvable */
  autoResolvable?: Scalars['Boolean']['input'];
  /** A description of the dependency, why it is needed and what it is used for. This can be used to provide more context to users when assigning dependencies. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The key of this dependency, when assigning you can reference this key to specify which agent_dependency you are assigning to. */
  key: Scalars['String']['input'];
  /** The maximum amount of viable instances for the agent. This is used to identify the demand in the system. */
  maxViableInstances?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum amount of viable instances for the agent. This is used to identify the demand in the system. */
  minViableInstances?: InputMaybe<Scalars['Int']['input']>;
  /** A list of keys of other agent dependencies that are mutually exclusive with this one. This means two agent dependencies with mutually exclusive keys cannot be assigned to the same implementing agent. This is used to identify the demand in the system. */
  mutuallyExclusiveKeys?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The name of the agent. This is used to identify the agent in the system. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Whether the dependency is optional or not. If the dependency is optional, users can choose to not provide it */
  optional?: Scalars['Boolean']['input'];
  /** The prefered amount of instances for the agent. This is used to identify the demand in the system. */
  preferedInstances?: InputMaybe<Scalars['Int']['input']>;
  /** The state demands of the agent. This is used to identify the demand in the system. */
  stateDemands?: InputMaybe<Array<StateDependencyInput>>;
  /** The version of the app this dependency corresponds to. */
  version?: InputMaybe<Scalars['String']['input']>;
};

/** An application, identified by a globally unique, reverse-domain identifier (e.g. live.arkitekt.app). */
export type App = {
  __typename?: 'App';
  id: Scalars['ID']['output'];
  /** The globally unique, reverse-domain identifier of the app. */
  identifier: Scalars['String']['output'];
};

/** Input describing a built app image to register (its manifest, image, selectors and inspection). */
export type AppImageInput = {
  appImageId: Scalars['String']['input'];
  flavourName?: InputMaybe<Scalars['String']['input']>;
  image: DockerImageInput;
  inspection: InspectionInput;
  manifest: ManifestInput;
  selectors: Array<SelectorInput>;
};

export type ArgPort = {
  __typename?: 'ArgPort';
  children?: Maybe<Array<ArgPort>>;
  choices?: Maybe<Array<Choice>>;
  default?: Maybe<Scalars['AnyDefault']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  effects?: Maybe<Array<Effect>>;
  identifier?: Maybe<Scalars['Identifier']['output']>;
  key: Scalars['String']['output'];
  kind: PortKind;
  label?: Maybe<Scalars['String']['output']>;
  nullable: Scalars['Boolean']['output'];
  requires?: Maybe<Array<Requires>>;
  validators?: Maybe<Array<Validator>>;
  widget?: Maybe<AssignWidget>;
};

/**
 * Port
 *
 *     A Port is a single input or output of a action. It is composed of a key and a kind
 *     which are used to uniquely identify the port.
 *
 *     If the Port is a structure, we need to define a identifier and scope,
 *     Identifiers uniquely identify a specific type of model for the scopes (e.g
 *     all the ports that have the identifier "@mikro/image" are of the same type, and
 *     are hence compatible with each other). Scopes are used to define in which context
 *     the identifier is valid (e.g. a port with the identifier "@mikro/image" and the
 *     scope "local", can only be wired to other ports that have the same identifier and
 *     are running in the same app). Global ports are ports that have the scope "global",
 *     and can be wired to any other port that has the same identifier, as there exists a
 *     mechanism to resolve and retrieve the object for each app. Please check the rekuest
 *     documentation for more information on how this works.
 *
 *
 *
 */
export type ArgPortInput = {
  /** The child ports (used for list, dict, union and model ports). */
  children?: InputMaybe<Array<ArgPortInput>>;
  /** The options for the port. This is used for dropdowns and text inputs */
  choices?: InputMaybe<Array<ChoiceInput>>;
  /** The default value for the port. */
  default?: InputMaybe<Scalars['AnyDefault']['input']>;
  /** The description of the port. This is the text that is displayed in the UI when the user hovers over the port */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The effects of the port */
  effects?: InputMaybe<Array<EffectInput>>;
  /** The identifier of a structure port. This is used to uniquely identify a specific type of structure. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The key of the port */
  key: Scalars['String']['input'];
  /** The kind of the port. This is the type of the port. Can be either int, string, structure, list, bool, dict, float, date, union or model */
  kind: PortKind;
  /** The label of the port. This is the text that is displayed in the UI */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Whether the port is nullable or not. If the port is nullable, it can be set to null. If the port is not nullable, it cannot be set to null */
  nullable?: Scalars['Boolean']['input'];
  /** The descriptors for the port. Descriptors are key-value pairs that can be used to add additional metadata to a port. When using rekuest's action search, you can filter actions based on their port descriptors */
  requires?: InputMaybe<Array<RequiresInput>>;
  /** The validators for the port */
  validators?: InputMaybe<Array<ValidatorInput>>;
  /** The assign widget to use for this port. */
  widget?: InputMaybe<AssignWidgetInput>;
};

export enum AssignPolicy {
  Automatic = 'AUTOMATIC',
  Balanced = 'BALANCED',
  FastestResponse = 'FASTEST_RESPONSE',
  LeastBusy = 'LEAST_BUSY',
  RoundRobin = 'ROUND_ROBIN'
}

export type AssignWidget = {
  followValue?: Maybe<Scalars['String']['output']>;
  kind: AssignWidgetKind;
};

export type AssignWidgetInput = {
  /** Whether to display the input as a paragraph or not. This is used for text inputs and dropdowns */
  asParagraph?: InputMaybe<Scalars['Boolean']['input']>;
  /** The choices to display in the dropdown. This is used for dropdowns and text inputs */
  choices?: InputMaybe<Array<ChoiceInput>>;
  /** The dependencies of the assign widget, which will be passed to the search or the hook widget. Use the .. syntax to traverse the tree of ports. For example, if you have a port with the key 'foo' and you want to reference a port with the key 'bar' that is a child of 'foo', you would use 'foo..bar' */
  dependencies?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The dependency that we are going to use to fullfill the state choices. If none is provided its the own state that will be queried */
  dependency?: InputMaybe<Scalars['String']['input']>;
  /** The fallback assign widget to use if the current one fails. This is used for custom assign widgets */
  fallback?: InputMaybe<AssignWidgetInput>;
  /** The filters to apply to a search widget. This is used for custom assign widgets */
  filters?: InputMaybe<Array<ArgPortInput>>;
  /** The key of another port whose value this widget should follow and mirror. */
  followValue?: InputMaybe<Scalars['String']['input']>;
  /** The hook to run when the input is changed. This is used for custom assign widgets */
  hook?: InputMaybe<Scalars['String']['input']>;
  /** The kind of the assign widget. Can be either dropdown, text, slider, checkbox, radio or custom */
  kind: AssignWidgetKind;
  /** The maximum value of the slider (if a slider). This is used for sliders and text inputs */
  max?: InputMaybe<Scalars['Float']['input']>;
  /** The minimum value of the slider (if a slider). This is used for sliders and text inputs */
  min?: InputMaybe<Scalars['Float']['input']>;
  /** The placeholder of the input. This is used for text inputs and dropdowns */
  placeholder?: InputMaybe<Scalars['String']['input']>;
  /** The query to run when searching for choices. This is used for dropdowns and text inputs */
  query?: InputMaybe<Scalars['SearchQuery']['input']>;
  /** State accessors are used to specify how to access the state values that we are going to use to fullfill the state choices. This is used when the state value that we want to use is not the same as the one of the port, e.g. when we want to use a specific key of a state object, or when we want to use a dynamic key based on the other arguments. The option_key field is used to specify which part of the state accessor we want to use as the value for the assign widget (e.g. the key, the description, the logo, etc.) */
  stateAccessors?: InputMaybe<Array<StateAccessorInput>>;
  /** The key of a state whose value provides the choices for this widget (state-driven choices). */
  stateChoices?: InputMaybe<Scalars['String']['input']>;
  /** The path to the state value that we are going to use to fullfill the state choices. Always traverse from top to bottom level. i.e state.x for state.x and state.x.y for state.x.y. You can also use an arrow function to specify a dynamic path based on the other arguments, e.g. (args) => state[args.foo] */
  statePath?: InputMaybe<Scalars['String']['input']>;
  /** The step value of the slider (if a slider). This is used for sliders and text inputs */
  step?: InputMaybe<Scalars['Float']['input']>;
  /** The action that we are going to target with a proxy widget. This is used for proxy widgets */
  targetAction?: InputMaybe<Scalars['String']['input']>;
  /** The dependency that we are going to target with a proxy widget. This is used for proxy widgets */
  targetDependency?: InputMaybe<Scalars['String']['input']>;
  /** The port that we are going to target with a proxy widget. This is used for proxy widgets */
  targetPort?: InputMaybe<Scalars['String']['input']>;
  /** The ward that is responsible for handling querying the choices */
  ward?: InputMaybe<Scalars['String']['input']>;
};

/** The kind of assign widget. */
export enum AssignWidgetKind {
  Choice = 'CHOICE',
  Custom = 'CUSTOM',
  Proxy = 'PROXY',
  Search = 'SEARCH',
  Slider = 'SLIDER',
  StateChoice = 'STATE_CHOICE',
  String = 'STRING'
}

/** A deployment target (agent) registered by a client that runs pods on behalf of an organization. */
export type Backend = {
  __typename?: 'Backend';
  /** The OAuth2 client this backend authenticates as. */
  client: Client;
  /** The OAuth2 client ID of this backend. */
  clientId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The kind of backend (its runtime type). */
  kind: Scalars['String']['output'];
  /** The human-readable name of this backend. */
  name: Scalars['String']['output'];
  /** The organization this backend belongs to. */
  organization: Organization;
  /** The pods currently running on this backend. */
  pods: Array<Pod>;
  /** The resources declared on this backend. */
  resources: Array<Resource>;
  /** The user that registered this backend. */
  user: User;
};


/** A deployment target (agent) registered by a client that runs pods on behalf of an organization. */
export type BackendPodsArgs = {
  filters?: InputMaybe<PodFilter>;
  ordering?: Array<PodOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A deployment target (agent) registered by a client that runs pods on behalf of an organization. */
export type BackendResourcesArgs = {
  filters?: InputMaybe<ResourceFilter>;
  ordering?: Array<ResourceOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Filter for backends. */
export type BackendFilter = {
  AND?: InputMaybe<BackendFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<BackendFilter>;
  OR?: InputMaybe<BackendFilter>;
  /** Keep only backends whose ID is in this list. */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Case-insensitive search on the backend name. */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type BackendOrder =
  { id: Ordering; lastHeartbeat?: never; name?: never; }
  |  { id?: never; lastHeartbeat: Ordering; name?: never; }
  |  { id?: never; lastHeartbeat?: never; name: Ordering; };

/** Which locks does the agent provide in general */
export type BlokImplementationInput = {
  /** The optional catalog name if this Blok should be registered inside a specific namespace in your Electron app's UI component registry. */
  catalog?: InputMaybe<Scalars['String']['input']>;
  /** The UI component tree blueprint for this Blok. */
  components: Array<ComponentNodeInput>;
  /** An optional JSON-serializable object providing demo state values for this Blok's internal reactive data model, useful for testing and development purposes. */
  demoState?: InputMaybe<Scalars['JSONSerializable']['input']>;
  /** The dependencies required by this Blok. */
  dependencies?: Array<AgentDependencyInput>;
  /** A human-readable description about this Blok's purpose and functionality. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The key of this Blok implementation. */
  key: Scalars['String']['input'];
};

/** Requires CPU resources on the backend. */
export type CpuSelector = Selector & {
  __typename?: 'CPUSelector';
  /** The minimum CPU frequency required, in MHz */
  frequency?: Maybe<Scalars['Float']['output']>;
  kind: Scalars['String']['output'];
  min?: Maybe<Scalars['Int']['output']>;
  required: Scalars['Boolean']['output'];
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

/**
 *
 * A choice is a value that can be selected in a dropdown.
 *
 * It is composed of a value, a label, and a description. The value is the
 * value that is returned when the choice is selected. The label is the
 * text that is displayed in the dropdown. The description is the text
 * that is displayed when the user hovers over the choice.
 *
 *
 */
export type ChoiceInput = {
  /** The description of the choice. This is the text that is displayed in the UI when the user hovers over the choice */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The image of the choice. This is the image that is displayed in the UI (must be a URL) */
  image?: InputMaybe<Scalars['String']['input']>;
  /** The label of the choice. This is the text that is displayed in the UI */
  label: Scalars['String']['input'];
  /** The value of the choice. This is the value that is returned when the choice is selected */
  value: Scalars['AnyDefault']['input'];
};

export type ChoiceReturnWidget = ReturnWidget & {
  __typename?: 'ChoiceReturnWidget';
  choices?: Maybe<Array<Choice>>;
  kind: ReturnWidgetKind;
};

/** Represents a registered OAuth2 client. */
export type Client = {
  __typename?: 'Client';
  /** OAuth2 client ID. */
  clientId: Scalars['String']['output'];
  /** Device associated with the client. */
  device?: Maybe<Device>;
  /** Unique ID of the client. */
  id: Scalars['ID']['output'];
  /** Name of the client. */
  name: Scalars['String']['output'];
  /** Release associated with the client. */
  release?: Maybe<ClientRelease>;
};

/** A client application registered with the authentication provider. */
export type ClientApp = {
  __typename?: 'ClientApp';
  /** Unique ID of the app. */
  id: Scalars['ID']['output'];
  /** The unique identifier of the app. */
  identifier: Scalars['String']['output'];
};

/** A released version of a client application. */
export type ClientRelease = {
  __typename?: 'ClientRelease';
  /** The app this release belongs to. */
  app: ClientApp;
  /** Unique ID of the release. */
  id: Scalars['ID']['output'];
  /** Version string of the release. */
  version: Scalars['String']['output'];
};

/** A named grouping of related action definitions. */
export type Collection = {
  __typename?: 'Collection';
  /** When this collection was defined. */
  definedAt: Scalars['DateTime']['output'];
  /** A description of this collection. */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The name of this collection. */
  name: Scalars['String']['output'];
};

/** Filter for collections. */
export type CollectionFilter = {
  AND?: InputMaybe<CollectionFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<CollectionFilter>;
  OR?: InputMaybe<CollectionFilter>;
  /** Keep only collections whose ID is in this list. */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Case-insensitive search on the collection name. */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type CollectionOrder =
  { definedAt: Ordering; id?: never; name?: never; }
  |  { definedAt?: never; id: Ordering; name?: never; }
  |  { definedAt?: never; id?: never; name: Ordering; };

/** An abstract structural visual element inside a Blok blueprint manifest. */
export type ComponentNodeInput = {
  /** Flat adjacency pointer list mapping out IDs nested inside this specific component layer. */
  children?: InputMaybe<Array<ComponentNodeInput>>;
  /** The type indicator token matching your Electron app's registered catalog specs (e.g. 'Slider'). */
  component: Scalars['String']['input'];
  /** Unique structural string identifying this node instance inside the flat workspace layout tree. */
  id: Scalars['String']['input'];
  /** The collection of static values, state pointers, or action endpoints assigned to this component. */
  props?: InputMaybe<Array<ComponentPropInput>>;
};

/** A single key-value prop configuration for a component layout node. */
export type ComponentPropInput = {
  /** Defines an imperative interactive network action callback loop if this prop should trigger an agent interaction. */
  agentCall?: InputMaybe<AgentCallInput>;
  /** If set, this prop declares a new 'value' in the Blok state that can be referenced by other props or actions. The value of this field should be the name of the declared value (e.g., 'selected_user'). */
  declaresValue?: InputMaybe<Scalars['String']['input']>;
  /** A reactive state data-binding rule. */
  dynamicValue?: InputMaybe<DynamicValueInput>;
  /** The prop key name matching the target UI catalog constraint. */
  key: Scalars['String']['input'];
  /** A raw scalar or JSON-stringified literal configuration parameter (e.g. '40x' or True). */
  staticValue?: InputMaybe<Scalars['JSONSerializable']['input']>;
  /** Defines an imperative interactive network action callback loop if this prop should trigger a system utility interaction. */
  utilCall?: InputMaybe<UtilCallInput>;
};

/** The container runtime used to run a pod. */
export enum ContainerType {
  Apptainer = 'APPTAINER',
  Docker = 'DOCKER'
}

export type CpuSelectorInput = {
  /** The minimum CPU frequency required, in MHz. */
  frequency?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum memory required, in MB. */
  memory?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for creating a deployment of a flavour on a backend. */
export type CreateDeploymentInput = {
  /** The ID of the flavour to deploy. */
  flavour: Scalars['ID']['input'];
  /** When the flavour's image was last pulled, if known. */
  lastPulled?: InputMaybe<Scalars['DateTime']['input']>;
  /** The identifier of the deployment as known to the backend. */
  localId: Scalars['ID']['input'];
  /** Secret parameters passed to the deployment (e.g. credentials). */
  secretParams?: InputMaybe<Scalars['UntypedParams']['input']>;
};

/** Input for tracking a new GitHub repository. */
export type CreateGithubRepoInput = {
  /** Whether to scan the repository immediately after adding it. */
  autoScan?: InputMaybe<Scalars['Boolean']['input']>;
  /** The branch to scan for app manifests. */
  branch?: InputMaybe<Scalars['String']['input']>;
  /** An optional identifier (e.g. 'user/repo') used to derive the other fields. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** An optional human-readable name for the repository. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The repository name on GitHub. */
  repo?: InputMaybe<Scalars['String']['input']>;
  /** The GitHub owner (user or organization) of the repository. */
  user?: InputMaybe<Scalars['String']['input']>;
};

/** Input for registering a running pod for a deployment. */
export type CreatePodInput = {
  /** The OAuth2 client ID this pod authenticates as, if any. */
  clientId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the deployment this pod is an instance of. */
  deployment: Scalars['ID']['input'];
  /** The identifier of the pod as known to the backend. */
  localId: Scalars['ID']['input'];
  /** The resource this pod is scheduled onto, if any. */
  resource?: InputMaybe<Scalars['ID']['input']>;
};

/** Requires a CUDA-capable (NVIDIA) GPU on the backend. */
export type CudaSelector = Selector & {
  __typename?: 'CudaSelector';
  /** The number of cuda cores */
  cudaCores?: Maybe<Scalars['Int']['output']>;
  /** The minimum cuda version */
  cudaVersion?: Maybe<Scalars['String']['output']>;
  kind: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
};

export type CudaSelectorInput = {
  cudaCores?: InputMaybe<Scalars['Int']['input']>;
  cudaVersion?: InputMaybe<Scalars['String']['input']>;
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

/** Input for declaring (registering or updating) a backend. */
export type DeclareBackendInput = {
  /** The kind of backend (its runtime type). */
  kind: Scalars['String']['input'];
  /** The human-readable name of the backend. */
  name: Scalars['String']['input'];
};

/** Input for declaring (registering or updating) a resource on a backend. */
export type DeclareResourceInput = {
  /** The ID of the backend to declare the resource on. */
  backend: Scalars['ID']['input'];
  /** The identifier of the resource as known to the backend. */
  localId: Scalars['String']['input'];
  /** An optional human-readable name for the resource. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Free-form key/value qualifiers describing the resource. */
  qualifiers?: InputMaybe<Array<QualifierInput>>;
};

/** An action definition: the abstract, hashed description of an RPC task that a flavour provides. */
export type Definition = {
  __typename?: 'Definition';
  /** The input ports (arguments) of this action. */
  args: Array<ArgPort>;
  /** The collections this action belongs to. */
  collections: Array<Collection>;
  /** When this action definition was first defined. */
  definedAt: Scalars['DateTime']['output'];
  /** A human-readable description of this action. */
  description?: Maybe<Scalars['String']['output']>;
  /** The flavours that provide this action. */
  flavours: Array<Flavour>;
  /** The unique hash identifying this action definition. */
  hash: Scalars['ActionHash']['output'];
  id: Scalars['ID']['output'];
  /** The action definitions that this definition is a test for. */
  isTestFor: Array<Definition>;
  /** The kind of action, e.g. a function or a generator. */
  kind: ActionKind;
  /** The cleartext name of this action. */
  name: Scalars['String']['output'];
  /** The protocols this action implements. */
  protocols: Array<Protocol>;
  /** The output ports (return values) of this action. */
  returns: Array<ReturnPort>;
  /** The data scope of this action (e.g. local, global or bridge). */
  scope: ActionScope;
  /** The action definitions that act as tests for this definition. */
  tests: Array<Definition>;
};


/** An action definition: the abstract, hashed description of an RPC task that a flavour provides. */
export type DefinitionCollectionsArgs = {
  filters?: InputMaybe<CollectionFilter>;
  ordering?: Array<CollectionOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** An action definition: the abstract, hashed description of an RPC task that a flavour provides. */
export type DefinitionFlavoursArgs = {
  filters?: InputMaybe<FlavourFilter>;
  ordering?: Array<FlavourOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** An action definition: the abstract, hashed description of an RPC task that a flavour provides. */
export type DefinitionIsTestForArgs = {
  filters?: InputMaybe<DefinitionFilter>;
  ordering?: Array<DefinitionOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** An action definition: the abstract, hashed description of an RPC task that a flavour provides. */
export type DefinitionProtocolsArgs = {
  filters?: InputMaybe<ProtocolFilter>;
  ordering?: Array<ProtocolOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** An action definition: the abstract, hashed description of an RPC task that a flavour provides. */
export type DefinitionTestsArgs = {
  filters?: InputMaybe<DefinitionFilter>;
  ordering?: Array<DefinitionOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Filter for action definitions. */
export type DefinitionFilter = {
  AND?: InputMaybe<DefinitionFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<DefinitionFilter>;
  OR?: InputMaybe<DefinitionFilter>;
  /** Keep only definitions whose ports satisfy all of the given demands. */
  demands?: InputMaybe<Array<PortDemandInput>>;
  /** Keep only definitions whose ID is in this list. */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Case-insensitive search on the action name. */
  search?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A definition
 *
 *     Definitions are the building implementation for Actions and provide the
 *     information needed to create a action. They are primarly composed of a name,
 *     a description, and a list of ports.
 *
 *     Definitions provide a protocol of input and output, and do not contain
 *     any information about the actual implementation of the action ( this is handled
 *     by a implementation that implements a action).
 *
 *
 */
export type DefinitionInput = {
  /** The args of the definition. This is the input ports of the definition */
  args?: Array<ArgPortInput>;
  /** The collections of the definition. This is used to group definitions together in the UI */
  collections?: Array<Scalars['String']['input']>;
  /** The description of the definition. This is the text that is displayed in the UI */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The interfaces of the definition. This is used to group definitions together in the UI */
  interfaces?: Array<Scalars['String']['input']>;
  /** Whether the definition is a dev definition or not. If the definition is a dev definition, it can be used to create a dev action. If the definition is not a dev definition, it cannot be used to create a dev action */
  isDev?: Scalars['Boolean']['input'];
  /** The tests for the definition. This is used to group definitions together in the UI */
  isTestFor?: Array<Scalars['String']['input']>;
  /** The key of the definition. This is used to uniquely identify the definition */
  key: Scalars['String']['input'];
  /** The kind of the definition. This is the type of the definition. Can be either a function or a generator */
  kind: ActionKind;
  /** The logo of the definition. This is used to display the logo in the UI */
  logo?: InputMaybe<Scalars['String']['input']>;
  /** The name of the actions. This is used to uniquely identify the definition */
  name: Scalars['String']['input'];
  /** The package of the function. Will default to the currents agent's app if not specified. This is used to group definitions together in the UI and provide a better user experience */
  package?: InputMaybe<Scalars['String']['input']>;
  /** The port groups of the definition. This is used to group ports together in the UI */
  portGroups?: Array<PortGroupInput>;
  /** The returns of the definition. This is the output ports of the definition */
  returns?: Array<ReturnPortInput>;
  /** Whether the definition is stateful or not. If the definition is stateful, it can be used to create a stateful action. If the definition is not stateful, it cannot be used to create a stateful action */
  stateful?: Scalars['Boolean']['input'];
  tests?: InputMaybe<ActionDependencyInput>;
  /** The version of the definition. This is used to differentiate if the underyling algorithm has changed, i.e we would expect different results for the same input */
  version: Scalars['String']['input'];
};

export type DefinitionOrder =
  { definedAt: Ordering; };

/** Input for deleting a pod. */
export type DeletePodInput = {
  /** The ID of the pod to delete. */
  id: Scalars['ID']['input'];
};

export enum DemandKind {
  Args = 'ARGS',
  Returns = 'RETURNS'
}

/** A flavour scheduled to run on a particular backend. */
export type Deployment = {
  __typename?: 'Deployment';
  /** The API token the deployed pod uses to authenticate. */
  apiToken: Scalars['String']['output'];
  /** The backend this deployment runs on. */
  backend: Backend;
  /** The flavour that is deployed. */
  flavour: Flavour;
  id: Scalars['ID']['output'];
  /** The identifier of this deployment as known to the backend. */
  localId: Scalars['ID']['output'];
  /** The display name of this deployment, combining backend and flavour names. */
  name: Scalars['String']['output'];
};

/** Filter for deployments. */
export type DeploymentFilter = {
  AND?: InputMaybe<DeploymentFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<DeploymentFilter>;
  OR?: InputMaybe<DeploymentFilter>;
  /** Keep only deployments whose ID is in this list. */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Case-insensitive search on the deployment name. */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type DeploymentOrder =
  { createdAt: Ordering; id?: never; localId?: never; }
  |  { createdAt?: never; id: Ordering; localId?: never; }
  |  { createdAt?: never; id?: never; localId: Ordering; };

/** Represents a device assigned to users within an organization. */
export type Device = {
  __typename?: 'Device';
  /** The device identifier. */
  deviceId: Scalars['ID']['output'];
  /** Unique ID of the device. */
  id: Scalars['ID']['output'];
};

/** A single hardware feature of a device to match against. */
export type DeviceFeature = {
  /** The number of CPUs the feature describes. */
  cpuCount: Scalars['String']['input'];
  /** The kind of feature (e.g. 'gpu', 'cpu'). */
  kind: Scalars['String']['input'];
};

/** A reference to a built Docker image. */
export type DockerImage = {
  __typename?: 'DockerImage';
  /** When this image was built. */
  buildAt: Scalars['DateTime']['output'];
  /** The fully-qualified image reference (registry/name:tag). */
  imageString: Scalars['String']['output'];
};

export type DockerImageInput = {
  buildAt: Scalars['DateTime']['input'];
  imageString: Scalars['String']['input'];
};

/** Input for attaching a log dump to a pod. */
export type DumpLogsInput = {
  /** The captured log output to store. */
  logs: Scalars['String']['input'];
  /** The ID of the pod the logs belong to. */
  pod: Scalars['ID']['input'];
};

/** A bound state pointer referencing a variable inside a Blok state instance. */
export type DynamicValueInput = {
  /** JSON Pointer to a variable inside the Blok's isolated data model (e.g., '/microscope/exposure'). */
  path?: InputMaybe<Scalars['String']['input']>;
};

export type Effect = {
  dependencies: Array<Scalars['String']['output']>;
  function: Scalars['ValidatorFunction']['output'];
  kind: EffectKind;
};

/** The effect class of an implementation — declared by the implementation, never the caller. NONE work is freely retryable/reclaimable; PHYSICAL work touches the real world (no UPSERT), so an ambiguous failure is terminal and must not be retried. */
export enum EffectClass {
  None = 'NONE',
  Physical = 'PHYSICAL'
}

/**
 *
 *                  An effect is a way to modify a port based on a condition. For example,
 *     you could have an effect that sets a port to null if another port is null.
 *
 *     Or, you could have an effect that hides the port if another port meets a condition.
 *     E.g when the user selects a certain option in a dropdown, another port is hidden.
 *
 *
 *
 */
export type EffectInput = {
  /** The dependencies of the effect. Use the .. syntax to traverse the tree of ports. For example, if you have a port with the key 'foo' and you want to reference a port with the key 'bar' that is a child of 'foo', you would use 'foo..bar' */
  dependencies?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Whether to fade out the port when the effect is applied (if it is a hide effect) */
  fade?: InputMaybe<Scalars['Boolean']['input']>;
  /** The function to run to determine if the effect should be applied */
  function: Scalars['ValidatorFunction']['input'];
  /** The hook to run when the effect is applied (if it is a custom effect) */
  hook?: InputMaybe<Scalars['String']['input']>;
  /** The kind of the effect. Can be either message, hide or custom */
  kind: EffectKind;
  /** The message to display when the effect is applied (if it is a message effect) */
  message?: InputMaybe<Scalars['String']['input']>;
  /** The ward to run when the effect is applied (if it is a custom effect) */
  ward?: InputMaybe<Scalars['String']['input']>;
};

/** The kind of effect. */
export enum EffectKind {
  Custom = 'CUSTOM',
  Hide = 'HIDE',
  Message = 'MESSAGE'
}

/** The target environment that flavours are matched against. */
export type EnvironmentInput = {
  /** The container runtime available in the environment. */
  containerType: ContainerType;
  /** The hardware features available in the environment. */
  features?: InputMaybe<Array<DeviceFeature>>;
};

/** A buildable variant of a release: a specific Docker image together with the selectors and requirements needed to run it. */
export type Flavour = {
  __typename?: 'Flavour';
  /** The action definitions this flavour provides. */
  definitions: Array<Definition>;
  /** The deployments that run this flavour. */
  deployments: Array<Deployment>;
  /** A human-readable description of this flavour. */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The Docker image this flavour deploys. */
  image: DockerImage;
  /** The stored logo of this flavour. */
  logo?: Maybe<Scalars['String']['output']>;
  /** The raw app manifest this flavour was built from. */
  manifest: Scalars['UntypedParams']['output'];
  /** The name of this flavour (e.g. 'vanilla', 'cuda'). */
  name: Scalars['String']['output'];
  /** The original (upstream) logo URL of this flavour. */
  originalLogo?: Maybe<Scalars['String']['output']>;
  /** The release this flavour belongs to. */
  release: Release;
  /** The GitHub repository this flavour was built from. */
  repo: GithubRepo;
  /** The services this flavour requires in order to run. */
  requirements: Array<Requirement>;
  /** The hardware/capability selectors a backend must satisfy to run this flavour. */
  selectors: Array<Selector>;
};


/** A buildable variant of a release: a specific Docker image together with the selectors and requirements needed to run it. */
export type FlavourDefinitionsArgs = {
  filters?: InputMaybe<DefinitionFilter>;
  ordering?: Array<DefinitionOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** A buildable variant of a release: a specific Docker image together with the selectors and requirements needed to run it. */
export type FlavourDeploymentsArgs = {
  filters?: InputMaybe<DeploymentFilter>;
  ordering?: Array<DeploymentOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Filter for flavours. */
export type FlavourFilter = {
  AND?: InputMaybe<FlavourFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<FlavourFilter>;
  OR?: InputMaybe<FlavourFilter>;
  /** Keep only flavours that provide one of the given definitions. */
  hasDefinitions?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Keep only flavours whose ID is in this list. */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Case-insensitive search on the flavour name. */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type FlavourOrder =
  { releasedAt: Ordering; };

/** A GitHub repository tracked by Kabinet and scanned for deployable Arkitekt apps. */
export type GithubRepo = {
  __typename?: 'GithubRepo';
  /** When this repository was first added to Kabinet. */
  addedAt: Scalars['DateTime']['output'];
  /** The branch that is scanned for app manifests. */
  branch: Scalars['String']['output'];
  /** The flavours discovered by scanning this repository. */
  flavours: Array<Flavour>;
  id: Scalars['ID']['output'];
  /** The URL for opening a new issue against this repository on GitHub. */
  issueUrl: Scalars['String']['output'];
  /** The human-readable name of the repository. */
  name: Scalars['String']['output'];
  /** The organization that owns this repository. */
  organization: Organization;
  /** The repository name on GitHub (the part after the owner). */
  repo: Scalars['String']['output'];
  /** When this repository was last updated. */
  updatedAt: Scalars['DateTime']['output'];
  /** The URL of this repository on GitHub. */
  url: Scalars['String']['output'];
  /** The GitHub owner (user or organization) of the repository. */
  user: Scalars['String']['output'];
};


/** A GitHub repository tracked by Kabinet and scanned for deployable Arkitekt apps. */
export type GithubRepoFlavoursArgs = {
  filters?: InputMaybe<FlavourFilter>;
  ordering?: Array<FlavourOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Numeric/aggregatable fields of GithubRepo */
export enum GithubRepoField {
  CreatedAt = 'CREATED_AT'
}

/** Filter for tracked GitHub repositories. */
export type GithubRepoFilter = {
  AND?: InputMaybe<GithubRepoFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<GithubRepoFilter>;
  OR?: InputMaybe<GithubRepoFilter>;
  /** Case-insensitive match on the branch name. */
  branch?: InputMaybe<Scalars['String']['input']>;
  /** Keep only repositories whose ID is in this list. */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Case-insensitive match on the GitHub repository name. */
  repo?: InputMaybe<Scalars['String']['input']>;
  /** Case-insensitive search on the repository name. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Case-insensitive match on the GitHub owner. */
  user?: InputMaybe<Scalars['String']['input']>;
};

export type GithubRepoOrder =
  { addedAt: Ordering; id?: never; name?: never; updatedAt?: never; }
  |  { addedAt?: never; id: Ordering; name?: never; updatedAt?: never; }
  |  { addedAt?: never; id?: never; name: Ordering; updatedAt?: never; }
  |  { addedAt?: never; id?: never; name?: never; updatedAt: Ordering; };

export type GithubRepoStats = {
  __typename?: 'GithubRepoStats';
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


export type GithubRepoStatsAvgArgs = {
  field: GithubRepoField;
};


export type GithubRepoStatsDistinctCountArgs = {
  field: GithubRepoField;
};


export type GithubRepoStatsMaxArgs = {
  field: GithubRepoField;
};


export type GithubRepoStatsMinArgs = {
  field: GithubRepoField;
};


export type GithubRepoStatsSeriesArgs = {
  by: Granularity;
  field: GithubRepoField;
  timestampField: GithubRepoTimestampField;
};


export type GithubRepoStatsSumArgs = {
  field: GithubRepoField;
};

/** Datetime fields of GithubRepo for bucketing */
export enum GithubRepoTimestampField {
  CreatedAt = 'CREATED_AT'
}

export enum Granularity {
  Day = 'DAY',
  Hour = 'HOUR',
  Month = 'MONTH',
  Quarter = 'QUARTER',
  Week = 'WEEK',
  Year = 'YEAR'
}

export type HideEffect = Effect & {
  __typename?: 'HideEffect';
  dependencies: Array<Scalars['String']['output']>;
  fade: Scalars['Boolean']['output'];
  function: Scalars['ValidatorFunction']['output'];
  kind: EffectKind;
};

/** A implementation is a blueprint for a action. It is composed of a definition, a list of dependencies, and a list of params. */
export type ImplementationInput = {
  /** The definition of the implementation. This is used to uniquely identify the implementation */
  definition: DefinitionInput;
  /** The agent dependencies required by this implementation. */
  dependencies?: Array<AgentDependencyInput>;
  /** Whether the implementation is dynamic or not. If the implementation is dynamic, it can be used to create a dynamic action. If the implementation is not dynamic, it cannot be used to create a dynamic action */
  dynamic?: Scalars['Boolean']['input'];
  /** The effect class of this implementation. NONE work is freely retryable/reclaimable; PHYSICAL work touches the real world and an ambiguous failure is terminal (never retried). Declared by the implementation here — never by the caller. */
  effect?: EffectClass;
  /** The instance id of the agent this implementation is bound to. */
  instanceId?: InputMaybe<Scalars['String']['input']>;
  /** The interface of the implementation. This is used to group implementations together in the UI */
  interface?: InputMaybe<Scalars['String']['input']>;
  /** The locks of the implementation. This is used to specify which resources the implementation needs to run */
  locks?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The logo of the implementation. This is used to display the logo in the UI either it should be 'custom:svg-paths' or a lucide icon name like 'lucide:activity' urls are not supported at the moment */
  logo?: InputMaybe<Scalars['String']['input']>;
  /** The states that the implementation manipulates. This is used to identify which states are manipulated by the implementation, and can be use to enhance state safety in the system */
  manipulates?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Whether Rekuest should mint a signed provenance token when this implementation is assigned. Default true (provenance-by-default); set false for trivial/internal tasks that never produce external provenance. */
  needsToken?: Scalars['Boolean']['input'];
  /** The optimistics of the definition. This is used to optimistically set state values when the action is assigned, to provide a better user experience. */
  optimistics?: InputMaybe<Array<OptimisticInput>>;
  /** The params of the implementation. This is used to pass parameters to the implementation */
  params?: InputMaybe<Scalars['AnyDefault']['input']>;
  /** The downstream service(s) the provenance token should be scoped to (the token's `aud`). If omitted, Rekuest derives the audience from the structures the assignment acts on. */
  provenanceAudience?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The tracks of the definition. This is used to track values over time during the runtime of an action. This is the state of a dependency */
  tracks?: InputMaybe<Array<TrackInput>>;
};

export type InspectionInput = {
  bloks?: Array<BlokImplementationInput>;
  implementations: Array<ImplementationInput>;
  locks: Array<LockImplementationInput>;
  requirements: Array<RequirementInput>;
  size?: InputMaybe<Scalars['Int']['input']>;
  states: Array<StateImplementationInput>;
};

/** Which locks does the agent provide in general */
export type LockDefinitionInput = {
  /** Describe the lock a bit */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The key of the lock. This is used to uniquely identify the lock */
  key: Scalars['String']['input'];
};

/** Which locks does the agent provide in general */
export type LockImplementationInput = {
  /** The lock definition this implementation fulfills. */
  definition: LockDefinitionInput;
  /** The key of the lock implementation. */
  key: Scalars['String']['input'];
};

/** A captured snapshot of a pod's logs at a point in time. */
export type LogDump = {
  __typename?: 'LogDump';
  /** When these logs were captured. */
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** The captured log output. */
  logs: Scalars['String']['output'];
  /** The pod these logs were captured from. */
  pod: Pod;
};

export type ManifestInput = {
  author?: Scalars['String']['input'];
  /** The entrypoint of the app, defaults to 'app' */
  entrypoint?: InputMaybe<Scalars['String']['input']>;
  identifier: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['String']['input']>;
  scopes?: Array<Scalars['String']['input']>;
  version: Scalars['String']['input'];
};

/** Input for matching the best flavour for a release in a given environment. */
export type MatchFlavoursInput = {
  /** The action hashes that the matched flavour must provide. */
  actions?: InputMaybe<Array<Scalars['ActionHash']['input']>>;
  /** The target environment to match flavours against. */
  environment?: InputMaybe<EnvironmentInput>;
  /** The release whose flavours should be matched. */
  release?: InputMaybe<Scalars['ID']['input']>;
};

export type MessageEffect = Effect & {
  __typename?: 'MessageEffect';
  dependencies: Array<Scalars['String']['output']>;
  function: Scalars['ValidatorFunction']['output'];
  kind: EffectKind;
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Register a built app image, creating its release and flavour as needed. */
  createAppImage: Release;
  /** Schedule a flavour onto a backend, creating a new deployment. */
  createDeployment: Deployment;
  /** Start tracking a new GitHub repository so it can be scanned for apps. */
  createGithubRepo: GithubRepo;
  /** Register a running pod for a deployment on a backend. */
  createPod: Pod;
  /** Declare (register or update) a backend for the current client. */
  declareBackend: Backend;
  /** Declare (register or update) a resource on one of your backends. */
  declareResource: Resource;
  /** Delete a backend and return its ID. */
  deleteBackend: Scalars['ID']['output'];
  /** Delete a pod and return its ID. */
  deletePod: Scalars['ID']['output'];
  /** Attach a captured log dump to a pod. */
  dumpLogs: LogDump;
  /** Rescan every tracked GitHub repository for new or updated app manifests. */
  rescanRepos: Array<GithubRepo>;
  /** Scan a tracked GitHub repository for app manifests and update its flavours. */
  scanRepo: GithubRepo;
  /** Update the status of an existing deployment. */
  updateDeployment: Deployment;
  /** Update the status of an existing pod. */
  updatePod: Pod;
};


export type MutationCreateAppImageArgs = {
  input: AppImageInput;
};


export type MutationCreateDeploymentArgs = {
  input: CreateDeploymentInput;
};


export type MutationCreateGithubRepoArgs = {
  input: CreateGithubRepoInput;
};


export type MutationCreatePodArgs = {
  input: CreatePodInput;
};


export type MutationDeclareBackendArgs = {
  input: DeclareBackendInput;
};


export type MutationDeclareResourceArgs = {
  input: DeclareResourceInput;
};


export type MutationDeleteBackendArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePodArgs = {
  input: DeletePodInput;
};


export type MutationDumpLogsArgs = {
  input: DumpLogsInput;
};


export type MutationScanRepoArgs = {
  input: ScanRepoInput;
};


export type MutationUpdateDeploymentArgs = {
  input: UpdateDeploymentInput;
};


export type MutationUpdatePodArgs = {
  input: UpdatePodInput;
};

export type OffsetPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: Scalars['Int']['input'];
};

export type OneApiSelectorInput = {
  oneapiVersion?: InputMaybe<Scalars['String']['input']>;
};

/**
 *  An optimistic is used to optimistically set state values when the action is assigned. This is used to provide a better user experience by optimistically setting state values when the action is assigned, instead of waiting for the action to be executed and the state to be updated. This will only ever happen on the frontend.
 *
 *
 */
export type OptimisticInput = {
  /** The accessor to get the value to optimistically set. This is used when the value to optimistically set is not the same as the value of the port */
  accessor?: InputMaybe<Scalars['String']['input']>;
  /** The path to the state.value to optimistically set the value, always traverse from top to bottom level. i.e state.x for state.x and state.x.y for state.x.y. You can also use an arrow function to specify a dynamic path based on the other arguments, e.g. (args) => state[args.foo] */
  path: Scalars['String']['input'];
  /** The state to optimistically set when the action is assigned */
  state: Scalars['String']['input'];
};

export enum OptionKey {
  Description = 'DESCRIPTION',
  Label = 'LABEL',
  Logo = 'LOGO',
  Value = 'VALUE'
}

export enum Ordering {
  Asc = 'ASC',
  AscNullsFirst = 'ASC_NULLS_FIRST',
  AscNullsLast = 'ASC_NULLS_LAST',
  Desc = 'DESC',
  DescNullsFirst = 'DESC_NULLS_FIRST',
  DescNullsLast = 'DESC_NULLS_LAST'
}

/** Represents an organization in the system. */
export type Organization = {
  __typename?: 'Organization';
  /** Slug of the organization. */
  slug: Scalars['String']['output'];
};

/** A running instance of a deployment on a backend. */
export type Pod = {
  __typename?: 'Pod';
  /** The backend this pod runs on. */
  backend: Backend;
  /** The OAuth2 client ID this pod authenticates as, if any. */
  clientId?: Maybe<Scalars['String']['output']>;
  /** The deployment this pod is an instance of. */
  deployment: Deployment;
  id: Scalars['ID']['output'];
  /** The most recent log dump captured from this pod. */
  latestLogDump?: Maybe<LogDump>;
  /** The display name of this pod, combining backend, flavour and app identifier. */
  name: Scalars['String']['output'];
  /** The identifier of this pod as known to the backend. */
  podId: Scalars['String']['output'];
  /** The resource this pod is scheduled onto, if any. */
  resource?: Maybe<Resource>;
  /** The current lifecycle status of this pod. */
  status: PodStatus;
};

/** Filter for pods. */
export type PodFilter = {
  AND?: InputMaybe<PodFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<PodFilter>;
  OR?: InputMaybe<PodFilter>;
  /** Keep only pods running on the given backend. */
  backend?: InputMaybe<Scalars['ID']['input']>;
  /** Keep only pods whose ID is in this list. */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Match pods by the name of their backend. */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type PodOrder =
  { createdAt: Ordering; id?: never; status?: never; }
  |  { createdAt?: never; id: Ordering; status?: never; }
  |  { createdAt?: never; id?: never; status: Ordering; };

/** The lifecycle status of a pod. */
export enum PodStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Running = 'RUNNING',
  Stopped = 'STOPPED',
  Stopping = 'STOPPING',
  Unkown = 'UNKOWN'
}

/** A status update for a pod, pushed over a subscription. */
export type PodUpdateMessage = {
  __typename?: 'PodUpdateMessage';
  /** Whether this update corresponds to the pod's creation. */
  created: Scalars['Boolean']['output'];
  /** The ID of the pod this update is about. */
  id: Scalars['String']['output'];
  /** Optional progress indicator for the update, as a percentage. */
  progress?: Maybe<Scalars['Int']['output']>;
  /** The new status of the pod. */
  status: Scalars['String']['output'];
};

/** A demand on the ports (args or returns) of an action. */
export type PortDemandInput = {
  /** Require that the action has a specific number of ports. This is used to identify the demand in the system. */
  forceLength?: InputMaybe<Scalars['Int']['input']>;
  /** Require that the action has a specific number of non-nullable ports. This is used to identify the demand in the system. */
  forceNonNullableLength?: InputMaybe<Scalars['Int']['input']>;
  /** Require that the action has a specific number of structure ports. This is used to identify the demand in the system. */
  forceStructureLength?: InputMaybe<Scalars['Int']['input']>;
  /** The kind of the demand. You can ask for args or returns */
  kind: DemandKind;
  /** The matches of the demand.  */
  matches?: InputMaybe<Array<PortMatchInput>>;
};

/** A Port Group is a group of ports that are related to each other. It is used to group ports together in the UI and provide a better user experience. */
export type PortGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  effects?: InputMaybe<Array<EffectInput>>;
  /** The key of the port group. This is used to uniquely identify the port group */
  key: Scalars['String']['input'];
  ports?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** The kind of port. */
export enum PortKind {
  Bool = 'BOOL',
  Date = 'DATE',
  Dict = 'DICT',
  Enum = 'ENUM',
  Float = 'FLOAT',
  Int = 'INT',
  Interface = 'INTERFACE',
  List = 'LIST',
  MemoryStructure = 'MEMORY_STRUCTURE',
  Model = 'MODEL',
  String = 'STRING',
  Structure = 'STRUCTURE',
  Union = 'UNION'
}

/**
 * A dependency for a implementation. By defining dependencies, you can
 *     create a dependency graph for your implementations and actions
 */
export type PortMatchInput = {
  /** The index of the port to match. */
  at?: InputMaybe<Scalars['Int']['input']>;
  /** The matches for the children of the port to match. */
  children?: InputMaybe<Array<PortMatchInput>>;
  /** The identifier of the port to match. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The key of the port to match. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The kind of the port to match. */
  kind?: InputMaybe<PortKind>;
  /** Whether the port is nullable. */
  nullable?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An interface that an action definition can implement (e.g. Predicate). */
export type Protocol = {
  __typename?: 'Protocol';
  /** A description of this protocol. */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The name of this protocol. */
  name: Scalars['String']['output'];
};

/** Filter for protocols. */
export type ProtocolFilter = {
  AND?: InputMaybe<ProtocolFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ProtocolFilter>;
  OR?: InputMaybe<ProtocolFilter>;
  /** Keep only protocols whose ID is in this list. */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Case-insensitive search on the protocol name. */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ProtocolOrder =
  { id: Ordering; name?: never; }
  |  { id?: never; name: Ordering; };

export type Provides = {
  __typename?: 'Provides';
  key: Scalars['String']['output'];
  operator: ProvidesOperator;
  value: Scalars['Arg']['output'];
};

export type ProvidesInput = {
  /** The key of the provision. This is used to uniquely identify the provision */
  key: Scalars['String']['input'];
  /** The operator for the provision */
  operator: ProvidesOperator;
  /** The value of the provision. This can be any JSON serializable value */
  value: Scalars['Arg']['input'];
};

/** The operator for matching descriptors. */
export enum ProvidesOperator {
  Contains = 'CONTAINS',
  Equals = 'EQUALS',
  Exists = 'EXISTS',
  Gte = 'GTE',
  In = 'IN',
  Lte = 'LTE',
  Matches = 'MATCHES',
  NotEquals = 'NOT_EQUALS',
  NotIn = 'NOT_IN'
}

export type ProxyWidget = AssignWidget & {
  __typename?: 'ProxyWidget';
  followValue?: Maybe<Scalars['String']['output']>;
  kind: AssignWidgetKind;
  targetAction: Scalars['String']['output'];
  targetDependency?: Maybe<Scalars['String']['output']>;
  targetPort: Scalars['String']['output'];
};

/** A qualifier that describes some property of the action */
export type QualifierInput = {
  /** The key of the qualifier. */
  key: Scalars['String']['input'];
  /** The value of the qualifier. */
  value: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  /** Return a single backend by its ID. */
  backend: Backend;
  /** List all backends visible to the current organization. */
  backends: Array<Backend>;
  /** Return a single action definition by its ID. */
  definition: Definition;
  /** List all action definitions visible to the current organization. */
  definitions: Array<Definition>;
  /** Return a single deployment by its ID. */
  deployment: Deployment;
  /** List all deployments visible to the current organization. */
  deployments: Array<Deployment>;
  /** Return a single flavour (a buildable variant of a release) by its ID. */
  flavour: Flavour;
  /** List all flavours visible to the current organization. */
  flavours: Array<Flavour>;
  /** Return a single tracked GitHub repository by its ID. */
  githubRepo: GithubRepo;
  /** Stats about github repos */
  githubRepoStats: GithubRepoStats;
  /** List all tracked GitHub repositories visible to the current organization. */
  githubRepos: Array<GithubRepo>;
  /** Return the flavour that best matches the requested release, actions and target environment. */
  matchFlavour: Flavour;
  /** Return the currently authenticated user. */
  me: User;
  /** Let a backend discover one of its own pods by local identifier. */
  myPodAt: Pod;
  /** Return a single pod by its ID. */
  pod: Pod;
  /** Return the pod that a given agent (client) is running for a deployment. */
  podForAgent?: Maybe<Pod>;
  /** List all pods visible to the current organization. */
  pods: Array<Pod>;
  /** Return a single app release by its ID. */
  release: Release;
  /** List all app releases visible to the current organization. */
  releases: Array<Release>;
  /** Return a single backend resource by its ID. */
  resource: Resource;
  /** List all backend resources visible to the current organization. */
  resources: Array<Resource>;
};


export type QueryBackendArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBackendsArgs = {
  filters?: InputMaybe<BackendFilter>;
  ordering?: Array<BackendOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryDefinitionArgs = {
  hash?: InputMaybe<Scalars['ActionHash']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryDefinitionsArgs = {
  filters?: InputMaybe<DefinitionFilter>;
  ordering?: Array<DefinitionOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryDeploymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDeploymentsArgs = {
  filters?: InputMaybe<DeploymentFilter>;
  ordering?: Array<DeploymentOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryFlavourArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFlavoursArgs = {
  filters?: InputMaybe<FlavourFilter>;
  ordering?: Array<FlavourOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryGithubRepoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGithubRepoStatsArgs = {
  filters?: InputMaybe<GithubRepoFilter>;
};


export type QueryGithubReposArgs = {
  filters?: InputMaybe<GithubRepoFilter>;
  ordering?: Array<GithubRepoOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMatchFlavourArgs = {
  input: MatchFlavoursInput;
};


export type QueryMyPodAtArgs = {
  localId: Scalars['ID']['input'];
};


export type QueryPodArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPodForAgentArgs = {
  clientId: Scalars['ID']['input'];
};


export type QueryPodsArgs = {
  filters?: InputMaybe<PodFilter>;
  ordering?: Array<PodOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryReleaseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReleasesArgs = {
  filters?: InputMaybe<ReleaseFilter>;
  ordering?: Array<ReleaseOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryResourceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryResourcesArgs = {
  filters?: InputMaybe<ResourceFilter>;
  ordering?: Array<ResourceOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** A specific version of an app, bundling the flavours that can be deployed for it. */
export type Release = {
  __typename?: 'Release';
  /** The app this release belongs to. */
  app: App;
  /** A display colour for this release, as a hex string. */
  colour: Scalars['String']['output'];
  /** The deployments that run a flavour of this release. */
  deployments: Array<Deployment>;
  /** A human-readable description of this release. */
  description: Scalars['String']['output'];
  /** The entrypoint used to start the app. */
  entrypoint: Scalars['String']['output'];
  /** The flavours (buildable variants) available for this release. */
  flavours: Array<Flavour>;
  id: Scalars['ID']['output'];
  /** Whether this release is currently deployed somewhere. */
  installed: Scalars['Boolean']['output'];
  /** The stored logo of this release. */
  logo?: Maybe<Scalars['String']['output']>;
  /** The display name of this release, in the form 'identifier:version'. */
  name: Scalars['String']['output'];
  /** The original (upstream) logo URL of this release. */
  originalLogo?: Maybe<Scalars['String']['output']>;
  /** The OAuth2 scopes this release requires. */
  scopes: Array<Scalars['String']['output']>;
  /** The semantic version of this release. */
  version: Scalars['String']['output'];
};


/** A specific version of an app, bundling the flavours that can be deployed for it. */
export type ReleaseFlavoursArgs = {
  filters?: InputMaybe<FlavourFilter>;
  ordering?: Array<FlavourOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Filter for app releases. */
export type ReleaseFilter = {
  AND?: InputMaybe<ReleaseFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ReleaseFilter>;
  OR?: InputMaybe<ReleaseFilter>;
  /** Keep only releases whose ID is in this list. */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Case-insensitive search on the release version. */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ReleaseOrder =
  { createdAt: Ordering; id?: never; releasedAt?: never; version?: never; }
  |  { createdAt?: never; id: Ordering; releasedAt?: never; version?: never; }
  |  { createdAt?: never; id?: never; releasedAt: Ordering; version?: never; }
  |  { createdAt?: never; id?: never; releasedAt?: never; version: Ordering; };

/** A service that a flavour requires in order to run (e.g. mikro, rekuest). */
export type Requirement = {
  __typename?: 'Requirement';
  /** An optional human-readable description of the requirement. */
  description?: Maybe<Scalars['String']['output']>;
  /** The key identifying this requirement within the flavour. */
  key: Scalars['String']['output'];
  /** Whether the flavour can still run if this service is unavailable. */
  optional: Scalars['Boolean']['output'];
  /** The name of the required service. */
  service: Scalars['String']['output'];
};

export type RequirementInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  optional?: Scalars['Boolean']['input'];
  service: Scalars['String']['input'];
};

export type Requires = {
  __typename?: 'Requires';
  key: Scalars['String']['output'];
  operator: RequiresOperator;
  value: Scalars['Arg']['output'];
};

export type RequiresInput = {
  /** The key of the requirement. This is used to uniquely identify the requirement */
  key: Scalars['String']['input'];
  /** The operator for the requirement */
  operator: RequiresOperator;
  /** The value of the requirement. This can be any JSON serializable value */
  value: Scalars['Arg']['input'];
};

/** The operator for matching descriptors. */
export enum RequiresOperator {
  Contains = 'CONTAINS',
  Equals = 'EQUALS',
  Exists = 'EXISTS',
  Gte = 'GTE',
  In = 'IN',
  Lte = 'LTE',
  Matches = 'MATCHES',
  NotEquals = 'NOT_EQUALS',
  NotIn = 'NOT_IN'
}

/** An allocatable resource on a backend (e.g. a compute slot) that pods can be scheduled onto. */
export type Resource = {
  __typename?: 'Resource';
  /** The backend this resource belongs to. */
  backend: Backend;
  id: Scalars['ID']['output'];
  /** The human-readable name of this resource. */
  name: Scalars['String']['output'];
  /** The pods scheduled onto this resource. */
  pods: Array<Pod>;
  /** Free-form key/value qualifiers describing this resource. */
  qualifiers?: Maybe<Scalars['UntypedParams']['output']>;
  /** The identifier of this resource as known to the backend. */
  resourceId: Scalars['String']['output'];
};


/** An allocatable resource on a backend (e.g. a compute slot) that pods can be scheduled onto. */
export type ResourcePodsArgs = {
  filters?: InputMaybe<PodFilter>;
  ordering?: Array<PodOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Filter for resources. */
export type ResourceFilter = {
  AND?: InputMaybe<ResourceFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ResourceFilter>;
  OR?: InputMaybe<ResourceFilter>;
  /** Keep only resources whose ID is in this list. */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Case-insensitive search on the resource name. */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ResourceOrder =
  { createdAt: Ordering; id?: never; name?: never; }
  |  { createdAt?: never; id: Ordering; name?: never; }
  |  { createdAt?: never; id?: never; name: Ordering; };

export type ReturnPort = {
  __typename?: 'ReturnPort';
  children?: Maybe<Array<ReturnPort>>;
  choices?: Maybe<Array<Choice>>;
  default?: Maybe<Scalars['AnyDefault']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  effects?: Maybe<Array<Effect>>;
  identifier?: Maybe<Scalars['Identifier']['output']>;
  key: Scalars['String']['output'];
  kind: PortKind;
  label?: Maybe<Scalars['String']['output']>;
  nullable: Scalars['Boolean']['output'];
  provides?: Maybe<Array<Provides>>;
  widget?: Maybe<ReturnWidget>;
};

/**
 * Port
 *
 *     A Port is a single input or output of a action. It is composed of a key and a kind
 *     which are used to uniquely identify the port.
 *
 *     If the Port is a structure, we need to define a identifier and scope,
 *     Identifiers uniquely identify a specific type of model for the scopes (e.g
 *     all the ports that have the identifier "@mikro/image" are of the same type, and
 *     are hence compatible with each other). Scopes are used to define in which context
 *     the identifier is valid (e.g. a port with the identifier "@mikro/image" and the
 *     scope "local", can only be wired to other ports that have the same identifier and
 *     are running in the same app). Global ports are ports that have the scope "global",
 *     and can be wired to any other port that has the same identifier, as there exists a
 *     mechanism to resolve and retrieve the object for each app. Please check the rekuest
 *     documentation for more information on how this works.
 *
 *
 *
 */
export type ReturnPortInput = {
  /** The child ports (used for list, dict, union and model ports). */
  children?: InputMaybe<Array<ReturnPortInput>>;
  /** The options for the port. This is used for dropdowns and text inputs */
  choices?: InputMaybe<Array<ChoiceInput>>;
  /** The default value for the port. */
  default?: InputMaybe<Scalars['AnyDefault']['input']>;
  /** The description of the port. This is the text that is displayed in the UI when the user hovers over the port */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The effects of the port */
  effects?: InputMaybe<Array<EffectInput>>;
  /** The identifier of a structure port. This is used to uniquely identify a specific type of structure. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The key of the port */
  key: Scalars['String']['input'];
  /** The kind of the port. This is the type of the port. Can be either int, string, structure, list, bool, dict, float, date, union or model */
  kind: PortKind;
  /** The label of the port. This is the text that is displayed in the UI */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Whether the port is nullable or not. If the port is nullable, it can be set to null. If the port is not nullable, it cannot be set to null */
  nullable?: Scalars['Boolean']['input'];
  /** The provisions for the port. Provisions are key-value pairs that can be used to add additional metadata to a port. When using rekuest's action search, you can filter actions based on their port provisions */
  provides?: InputMaybe<Array<ProvidesInput>>;
  /** The validators for the port */
  validators?: InputMaybe<Array<ValidatorInput>>;
  /** The return widget to use for this port. */
  widget?: InputMaybe<ReturnWidgetInput>;
};

export type ReturnWidget = {
  kind: ReturnWidgetKind;
};

/**
 * A Return Widget is a UI element that is used to display the value of a port.
 *
 *     Return Widgets get displayed both if we show the return values of an assignment,
 *     but also when we inspect the given arguments of a previous run task. Their primary
 *     usecase is to adequately display the value of a port, in a user readable way.
 *
 *     Return Widgets are often overwriten by the underlying UI framework (e.g. Orkestrator)
 *     to provide a better user experience. For example, a return widget that displays a
 *     date could be overwriten to display a calendar widget.
 *
 *     Return Widgets provide more a way to customize this overwriten behavior.
 *
 *
 */
export type ReturnWidgetInput = {
  /** The choices to display in the dropdown. This is used for dropdowns and text inputs */
  choices?: InputMaybe<Array<ChoiceInput>>;
  /** The hook to run (if it is a custom return widget). */
  hook?: InputMaybe<Scalars['String']['input']>;
  /** The kind of the return widget. Can be either dropdown, text, slider, checkbox, radio or custom */
  kind: ReturnWidgetKind;
  /** The maximum value to display (if a slider). */
  max?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum value to display (if a slider). */
  min?: InputMaybe<Scalars['Int']['input']>;
  /** The placeholder text of the return widget. */
  placeholder?: InputMaybe<Scalars['String']['input']>;
  /** The query to run when searching for choices. This is used for dropdowns and text inputs */
  query?: InputMaybe<Scalars['SearchQuery']['input']>;
  /** The step value to display (if a slider). */
  step?: InputMaybe<Scalars['Int']['input']>;
  /** The ward responsible for handling the return widget. */
  ward?: InputMaybe<Scalars['String']['input']>;
};

/** The kind of return widget. */
export enum ReturnWidgetKind {
  Choice = 'CHOICE',
  Custom = 'CUSTOM',
  Proxy = 'PROXY'
}

/** Requires a ROCm-capable (AMD) GPU on the backend. */
export type RocmSelector = Selector & {
  __typename?: 'RocmSelector';
  /** An additional ROCm capability qualifier */
  apiThing?: Maybe<Scalars['String']['output']>;
  /** The minimum ROCm API version required */
  apiVersion?: Maybe<Scalars['String']['output']>;
  kind: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
};

export type RocmSelectorInput = {
  apiThing?: InputMaybe<Scalars['String']['input']>;
  apiVersion?: InputMaybe<Scalars['String']['input']>;
};

/** Input for scanning a tracked GitHub repository for app manifests. */
export type ScanRepoInput = {
  /** The ID of the GitHub repository to scan. */
  id: Scalars['String']['input'];
};

export type SearchAssignWidget = AssignWidget & {
  __typename?: 'SearchAssignWidget';
  dependencies?: Maybe<Array<Scalars['String']['output']>>;
  filters?: Maybe<Array<ArgPort>>;
  followValue?: Maybe<Scalars['String']['output']>;
  kind: AssignWidgetKind;
  query: Scalars['String']['output'];
  ward: Scalars['String']['output'];
};

/** A selector expresses a hardware (or capability) requirement that a backend must satisfy to run a flavour. */
export type Selector = {
  kind: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
};

export type SelectorInput = {
  /** An additional ROCm capability qualifier (rocm selectors). */
  apiThing?: InputMaybe<Scalars['String']['input']>;
  /** The minimum ROCm API version required (rocm selectors). */
  apiVersion?: InputMaybe<Scalars['String']['input']>;
  /** The minimum number of CUDA cores required (cuda selectors). */
  cudaCores?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum CPU frequency required, in MHz (cpu selectors). */
  frequency?: InputMaybe<Scalars['Int']['input']>;
  /** The discriminator identifying which kind of selector this is (e.g. 'cuda', 'rocm', 'cpu', 'oneapi'). */
  kind: Scalars['String']['input'];
  /** The minimum memory required, in MB (cpu selectors). */
  memory?: InputMaybe<Scalars['Int']['input']>;
  /** The minimum oneAPI version required (oneapi selectors). */
  oneapiVersion?: InputMaybe<Scalars['String']['input']>;
};

export type SliderAssignWidget = AssignWidget & {
  __typename?: 'SliderAssignWidget';
  followValue?: Maybe<Scalars['String']['output']>;
  kind: AssignWidgetKind;
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  step?: Maybe<Scalars['Float']['output']>;
};

export type StateAccessor = {
  __typename?: 'StateAccessor';
  optionKey: OptionKey;
  subPath?: Maybe<Scalars['String']['output']>;
};

export type StateAccessorInput = {
  /** The part of the state accessor to use as the value for the assign widget (e.g. the key, the description, the logo, etc.) */
  optionKey: OptionKey;
  /** The sub path to access a specific part of the state value. Always traverse from top to bottom level. i.e state.x for state.x and state.x.y for state.x.y. You can also use an arrow function to specify a dynamic path based on the other arguments, e.g. (args) => state[args.foo] */
  subPath?: InputMaybe<Scalars['String']['input']>;
};

export type StateChoiceAssignWidget = AssignWidget & {
  __typename?: 'StateChoiceAssignWidget';
  dependency?: Maybe<Scalars['String']['output']>;
  followValue?: Maybe<Scalars['String']['output']>;
  kind: AssignWidgetKind;
  stateAccessors?: Maybe<Array<StateAccessor>>;
  statePath: Scalars['String']['output'];
};

/** A state schema is a blueprint for a state. It is composed of a definition, a list of dependencies, and a list of params. */
export type StateDefinitionInput = {
  /** The name of the state schema. This is used to uniquely identify the state schema */
  name: Scalars['String']['input'];
  /** The ports of the state schema. This is used to define the structure of the state */
  ports: Array<ReturnPortInput>;
};

/**
 * A dependency for a implementation. By defining dependencies, you can
 *     create a dependency graph for your implementations and actions
 */
export type StateDependencyInput = {
  /** Allow inactive nodes, defaults to true */
  allowInactive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Which app this dependency corresponds to (i.e. do you want to use a stardist agent for that or imagej agents needs to be a world unique classsifier (reverse domain notation) that identifies the type of agent you want to use, and then we can have multiple agents of the same type running in the system, e.g. startdist could be the app for all agents that correpsond to a startdist instance) */
  app?: InputMaybe<Scalars['String']['input']>;
  /** The description of the state. This can describe the state and its purpose. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The key of the state. This is used to identify the dependency in the system. */
  key: Scalars['String']['input'];
  /** The name of the state. This is used to identify the state in the system. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Whether the dependency is optional or not. If the dependency is optional, the agent doesn't have to provide it to be potentially callable */
  optional?: Scalars['Boolean']['input'];
  /** The demands for the state ports, this can be additionaly specified so that when we loosen the matching criteria for a state in a resolver, we can still make sure to match the right state based on the demands for the ports. This is used to identify the demand in the system. */
  portMatches?: InputMaybe<Array<PortMatchInput>>;
  /** The protocols that the state is implementing or relying on. This is used to identify the demand in the system, and can be used to match states that are implementing the same protocol together. */
  protocols?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** The key of the state this dependency corresponds to. (i.e frame:count) */
  stateKey?: InputMaybe<Scalars['String']['input']>;
  /** The version of the state this dependency corresponds to. */
  version?: InputMaybe<Scalars['String']['input']>;
};

/** A state implementation is a blueprint for a state. It is composed of a definition, a list of dependencies, and a list of params. */
export type StateImplementationInput = {
  /** The schema of the state implementation. This is used to define the structure of the state */
  definition: StateDefinitionInput;
  /** The key of the state implementation. This is used to uniquely identify the state implementation */
  interface: Scalars['String']['input'];
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
  /** Subscribe to status updates for a single pod. */
  pod: PodUpdateMessage;
  /** Subscribe to status updates for all pods visible to the current organization. */
  pods: PodUpdateMessage;
};


export type SubscriptionPodArgs = {
  podId: Scalars['ID']['input'];
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

/** A value that is being tracked over time during the runtime of an action. This is the state of a dependency */
export type TrackInput = {
  /** The key of the dependency whose state is being tracked. */
  dependencyKey?: InputMaybe<Scalars['String']['input']>;
  /** An optional description for the track. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** An optional human-readable label for the track. */
  label?: InputMaybe<Scalars['String']['input']>;
  /** The key of the state to track. */
  stateKey: Scalars['String']['input'];
  /** The key of the value within the state to track. */
  valueKey: Scalars['String']['input'];
  /** The windows (aggregations) computed over the tracked value. */
  windows?: InputMaybe<Array<WindowInput>>;
};

/** Input for updating a deployment's status. */
export type UpdateDeploymentInput = {
  /** The ID of the deployment to update. */
  deployment: Scalars['ID']['input'];
  /** The new status of the deployment. */
  status: PodStatus;
};

/** Input for updating a pod's status. */
export type UpdatePodInput = {
  /** The backend-local identifier of the pod to update. */
  localId?: InputMaybe<Scalars['ID']['input']>;
  /** The ID of the pod to update; required unless 'local_id' is given. */
  pod?: InputMaybe<Scalars['ID']['input']>;
  /** The new status of the pod. */
  status: PodStatus;
};

/** Represents an authenticated user. */
export type User = {
  __typename?: 'User';
  /** The subject identifier of the user. */
  sub: Scalars['ID']['output'];
};

/** Defines a utility call that can be invoked within the system. */
export type UtilCallInput = {
  /** Key-value arguments map compiled for the target utility call. */
  arguments?: InputMaybe<Array<ActionArgumentInput>>;
  /** The utility function name to invoke. */
  operation: Scalars['String']['input'];
};

export type Validator = {
  __typename?: 'Validator';
  dependencies?: Maybe<Array<Scalars['String']['output']>>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  function: Scalars['ValidatorFunction']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

/**
 *
 * A validating function for a port. Can specify a function that will run when validating values of the port.
 * If outside dependencies are needed they need to be specified in the dependencies field. With the .. syntax
 * when transversing the tree of ports.
 *
 *
 */
export type ValidatorInput = {
  /** The dependencies of the function. Use the .. syntax to traverse the tree of ports. For example, if you have a port with the key 'foo' and you want to reference a port with the key 'bar' that is a child of 'foo', you would use 'foo..bar' */
  dependencies?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The error message to display when the validation fails */
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  /** The function to run when validating the port */
  function: Scalars['ValidatorFunction']['input'];
  /** An optional human-readable label for the validator. */
  label?: InputMaybe<Scalars['String']['input']>;
};

/** A window that is calculated */
export type WindowInput = {
  /** An optional human-readable label for the window. */
  label?: InputMaybe<Scalars['String']['input']>;
  /** The window function to apply over the tracked value. */
  windowFunction: Scalars['String']['input'];
};

export type ListBackendFragment = { __typename?: 'Backend', id: string, name: string, kind: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string } };

export type BackendFragment = { __typename?: 'Backend', id: string, clientId: string, name: string, kind: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string }, pods: Array<{ __typename?: 'Pod', id: string, podId: string, clientId?: string | null, status: PodStatus, backend: { __typename?: 'Backend', name: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string } }, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } }, resource?: { __typename?: 'Resource', id: string, name: string } | null }>, resources: Array<{ __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string } }> };

export type DefinitionFragment = { __typename?: 'Definition', id: string, name: string, hash: any, description?: string | null, args: Array<{ __typename: 'ArgPort', key: string, label?: string | null, nullable: boolean, description?: string | null, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<string>, function: any } | { __typename: 'HideEffect', fade: boolean, kind: EffectKind, dependencies: Array<string>, function: any } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<string>, function: any }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, children?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ArgPort', kind: PortKind, identifier?: any | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'ReturnPort', key: string, label?: string | null, nullable: boolean, description?: string | null, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<string>, function: any } | { __typename: 'HideEffect', fade: boolean, kind: EffectKind, dependencies: Array<string>, function: any } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<string>, function: any }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ReturnPort', kind: PortKind, key: string, identifier?: any | null, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ReturnPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ReturnPort', kind: PortKind, identifier?: any | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, provides?: Array<{ __typename?: 'Provides', key: string, operator: ProvidesOperator, value: any }> | null }>, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename?: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> }> };

export type ListDefinitionFragment = { __typename?: 'Definition', id: string, name: string, hash: any, description?: string | null, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } }> };

export type ListFlavourFragment = { __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename?: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> };

export type FlavourFragment = { __typename?: 'Flavour', description: string, id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename?: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> };

export type ListPodFragment = { __typename?: 'Pod', id: string, podId: string, clientId?: string | null, status: PodStatus, backend: { __typename?: 'Backend', name: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string } }, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } }, resource?: { __typename?: 'Resource', id: string, name: string } | null };

export type PodFragment = { __typename?: 'Pod', id: string, podId: string, status: PodStatus, clientId?: string | null, backend: { __typename?: 'Backend', id: string, clientId: string, name: string, kind: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string }, pods: Array<{ __typename?: 'Pod', id: string, podId: string, clientId?: string | null, status: PodStatus, backend: { __typename?: 'Backend', name: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string } }, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } }, resource?: { __typename?: 'Resource', id: string, name: string } | null }>, resources: Array<{ __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string } }> }, latestLogDump?: { __typename?: 'LogDump', logs: string, createdAt: any } | null, resource?: { __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string } } | null, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } } };

export type StringAssignWidgetFragment = { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean };

export type SliderAssignWidgetFragment = { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null };

export type StateChoiceAssignWidgetFragment = { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null };

export type FilterPortFragment = { __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null };

export type SearchAssignWidgetFragment = { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null };

export type CustomAssignWidgetFragment = { __typename: 'CustomAssignWidget', ward: string, hook: string };

export type ChoiceAssignWidgetFragment = { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null };

export type ArgChildPortNestedFragment = { __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ArgPort', kind: PortKind, identifier?: any | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null };

export type ArgChildPortFragment = { __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ArgPort', kind: PortKind, identifier?: any | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null };

export type ReturnChildPortNestedFragment = { __typename: 'ReturnPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ReturnPort', kind: PortKind, identifier?: any | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null };

export type ReturnChildPortFragment = { __typename: 'ReturnPort', kind: PortKind, key: string, identifier?: any | null, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ReturnPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ReturnPort', kind: PortKind, identifier?: any | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null };

type BaseEffect_CustomEffect_Fragment = { __typename: 'CustomEffect', kind: EffectKind, dependencies: Array<string>, function: any };

type BaseEffect_HideEffect_Fragment = { __typename: 'HideEffect', kind: EffectKind, dependencies: Array<string>, function: any };

type BaseEffect_MessageEffect_Fragment = { __typename: 'MessageEffect', kind: EffectKind, dependencies: Array<string>, function: any };

export type BaseEffectFragment = BaseEffect_CustomEffect_Fragment | BaseEffect_HideEffect_Fragment | BaseEffect_MessageEffect_Fragment;

export type CustomEffectFragment = { __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<string>, function: any };

export type MessageEffectFragment = { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<string>, function: any };

export type HideEffectFragment = { __typename: 'HideEffect', fade: boolean, kind: EffectKind, dependencies: Array<string>, function: any };

type PortEffect_CustomEffect_Fragment = { __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<string>, function: any };

type PortEffect_HideEffect_Fragment = { __typename: 'HideEffect', fade: boolean, kind: EffectKind, dependencies: Array<string>, function: any };

type PortEffect_MessageEffect_Fragment = { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<string>, function: any };

export type PortEffectFragment = PortEffect_CustomEffect_Fragment | PortEffect_HideEffect_Fragment | PortEffect_MessageEffect_Fragment;

type AssignWidget_ChoiceAssignWidget_Fragment = { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null };

type AssignWidget_CustomAssignWidget_Fragment = { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string };

type AssignWidget_ProxyWidget_Fragment = { __typename: 'ProxyWidget', kind: AssignWidgetKind };

type AssignWidget_SearchAssignWidget_Fragment = { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null };

type AssignWidget_SliderAssignWidget_Fragment = { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null };

type AssignWidget_StateChoiceAssignWidget_Fragment = { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null };

type AssignWidget_StringAssignWidget_Fragment = { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean };

export type AssignWidgetFragment = AssignWidget_ChoiceAssignWidget_Fragment | AssignWidget_CustomAssignWidget_Fragment | AssignWidget_ProxyWidget_Fragment | AssignWidget_SearchAssignWidget_Fragment | AssignWidget_SliderAssignWidget_Fragment | AssignWidget_StateChoiceAssignWidget_Fragment | AssignWidget_StringAssignWidget_Fragment;

export type ValidatorFragment = { __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null };

export type ArgPortFragment = { __typename: 'ArgPort', key: string, label?: string | null, nullable: boolean, description?: string | null, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<string>, function: any } | { __typename: 'HideEffect', fade: boolean, kind: EffectKind, dependencies: Array<string>, function: any } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<string>, function: any }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, children?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ArgPort', kind: PortKind, identifier?: any | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null };

export type ReturnPortFragment = { __typename: 'ReturnPort', key: string, label?: string | null, nullable: boolean, description?: string | null, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<string>, function: any } | { __typename: 'HideEffect', fade: boolean, kind: EffectKind, dependencies: Array<string>, function: any } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<string>, function: any }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ReturnPort', kind: PortKind, key: string, identifier?: any | null, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ReturnPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ReturnPort', kind: PortKind, identifier?: any | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, provides?: Array<{ __typename?: 'Provides', key: string, operator: ProvidesOperator, value: any }> | null };

export type CustomReturnWidgetFragment = { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string };

export type ChoiceReturnWidgetFragment = { __typename: 'ChoiceReturnWidget', choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null };

type ReturnWidget_ChoiceReturnWidget_Fragment = { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null };

type ReturnWidget_CustomReturnWidget_Fragment = { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string };

export type ReturnWidgetFragment = ReturnWidget_ChoiceReturnWidget_Fragment | ReturnWidget_CustomReturnWidget_Fragment;

export type ReleaseFragment = { __typename?: 'Release', id: string, version: string, scopes: Array<string>, colour: string, description: string, app: { __typename?: 'App', identifier: string }, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename?: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> }> };

export type ListReleaseFragment = { __typename?: 'Release', id: string, version: string, installed: boolean, scopes: Array<string>, colour: string, description: string, app: { __typename?: 'App', identifier: string }, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename?: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> }> };

export type ListRepoFragment = { __typename?: 'GithubRepo', id: string, name: string, branch: string, user: string, repo: string };

export type RepoFragment = { __typename?: 'GithubRepo', id: string, name: string, branch: string, user: string, repo: string, url: string, issueUrl: string, addedAt: any, updatedAt: any, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> }> };

export type ResourceFragment = { __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string }, pods: Array<{ __typename?: 'Pod', id: string, podId: string, clientId?: string | null, status: PodStatus, backend: { __typename?: 'Backend', name: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string } }, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } }, resource?: { __typename?: 'Resource', id: string, name: string } | null }> };

export type ListResourceFragment = { __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string } };

export type CudaSelectorFragment = { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null };

export type RocmSelectorFragment = { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null };

export type DeleteBackendMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteBackendMutation = { __typename?: 'Mutation', deleteBackend: string };

export type DeletePodMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePodMutation = { __typename?: 'Mutation', deletePod: string };

export type CreateGithubRepoMutationVariables = Exact<{
  identifier: Scalars['String']['input'];
}>;


export type CreateGithubRepoMutation = { __typename?: 'Mutation', createGithubRepo: { __typename?: 'GithubRepo', id: string } };

export type RescanReposMutationVariables = Exact<{ [key: string]: never; }>;


export type RescanReposMutation = { __typename?: 'Mutation', rescanRepos: Array<{ __typename?: 'GithubRepo', id: string }> };

export type ListBackendsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListBackendsQuery = { __typename?: 'Query', backends: Array<{ __typename?: 'Backend', id: string, name: string, kind: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string } }> };

export type GetBackendQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetBackendQuery = { __typename?: 'Query', backend: { __typename?: 'Backend', id: string, clientId: string, name: string, kind: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string }, pods: Array<{ __typename?: 'Pod', id: string, podId: string, clientId?: string | null, status: PodStatus, backend: { __typename?: 'Backend', name: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string } }, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } }, resource?: { __typename?: 'Resource', id: string, name: string } | null }>, resources: Array<{ __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string } }> } };

export type GetDefinitionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDefinitionQuery = { __typename?: 'Query', definition: { __typename?: 'Definition', id: string, name: string, hash: any, description?: string | null, args: Array<{ __typename: 'ArgPort', key: string, label?: string | null, nullable: boolean, description?: string | null, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<string>, function: any } | { __typename: 'HideEffect', fade: boolean, kind: EffectKind, dependencies: Array<string>, function: any } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<string>, function: any }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, children?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ArgPort', kind: PortKind, identifier?: any | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null }> | null, widget?: { __typename: 'ChoiceAssignWidget', kind: AssignWidgetKind, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null } | { __typename: 'CustomAssignWidget', kind: AssignWidgetKind, ward: string, hook: string } | { __typename: 'ProxyWidget', kind: AssignWidgetKind } | { __typename: 'SearchAssignWidget', kind: AssignWidgetKind, query: string, ward: string, dependencies?: Array<string> | null, filters?: Array<{ __typename: 'ArgPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, widget?: { __typename?: 'ChoiceAssignWidget' } | { __typename?: 'CustomAssignWidget' } | { __typename?: 'ProxyWidget' } | { __typename?: 'SearchAssignWidget', query: string } | { __typename?: 'SliderAssignWidget' } | { __typename?: 'StateChoiceAssignWidget' } | { __typename?: 'StringAssignWidget' } | null }> | null } | { __typename: 'SliderAssignWidget', kind: AssignWidgetKind, min?: number | null, max?: number | null, step?: number | null } | { __typename: 'StateChoiceAssignWidget', kind: AssignWidgetKind, statePath: string, dependency?: string | null, stateAccessors?: Array<{ __typename?: 'StateAccessor', optionKey: OptionKey, subPath?: string | null }> | null } | { __typename: 'StringAssignWidget', kind: AssignWidgetKind, placeholder: string, asParagraph: boolean } | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, validators?: Array<{ __typename?: 'Validator', function: any, dependencies?: Array<string> | null, label?: string | null, errorMessage?: string | null }> | null }>, returns: Array<{ __typename: 'ReturnPort', key: string, label?: string | null, nullable: boolean, description?: string | null, kind: PortKind, identifier?: any | null, default?: any | null, effects?: Array<{ __typename: 'CustomEffect', kind: EffectKind, hook: string, ward: string, dependencies: Array<string>, function: any } | { __typename: 'HideEffect', fade: boolean, kind: EffectKind, dependencies: Array<string>, function: any } | { __typename: 'MessageEffect', kind: EffectKind, message: string, dependencies: Array<string>, function: any }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, children?: Array<{ __typename: 'ReturnPort', kind: PortKind, key: string, identifier?: any | null, nullable: boolean, description?: string | null, children?: Array<{ __typename: 'ReturnPort', kind: PortKind, key: string, identifier?: any | null, description?: string | null, nullable: boolean, children?: Array<{ __typename?: 'ReturnPort', kind: PortKind, identifier?: any | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null }> | null, widget?: { __typename: 'ChoiceReturnWidget', kind: ReturnWidgetKind, choices?: Array<{ __typename?: 'Choice', label: string, value: string, description?: string | null }> | null } | { __typename: 'CustomReturnWidget', kind: ReturnWidgetKind, hook: string, ward: string } | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null }> | null, choices?: Array<{ __typename?: 'Choice', value: string, label: string, description?: string | null }> | null, provides?: Array<{ __typename?: 'Provides', key: string, operator: ProvidesOperator, value: any }> | null }>, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename?: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> }> } };

export type ListDefinitionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListDefinitionsQuery = { __typename?: 'Query', definitions: Array<{ __typename?: 'Definition', id: string, name: string, hash: any, description?: string | null, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } }> }> };

export type PrimaryDefinitionsQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Array<DefinitionOrder> | DefinitionOrder>;
}>;


export type PrimaryDefinitionsQuery = { __typename?: 'Query', definitions: Array<{ __typename?: 'Definition', id: string, name: string, hash: any, description?: string | null, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } }> }> };

export type AllPrimaryDefinitionsQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
  filters?: InputMaybe<DefinitionFilter>;
  ordering?: InputMaybe<Array<DefinitionOrder> | DefinitionOrder>;
}>;


export type AllPrimaryDefinitionsQuery = { __typename?: 'Query', definitions: Array<{ __typename?: 'Definition', id: string, name: string, hash: any, description?: string | null, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } }> }> };

export type ListFlavoursQueryVariables = Exact<{ [key: string]: never; }>;


export type ListFlavoursQuery = { __typename?: 'Query', flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename?: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> }> };

export type GetFlavourQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFlavourQuery = { __typename?: 'Query', flavour: { __typename?: 'Flavour', description: string, id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename?: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> } };

export type HomePageQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageQuery = { __typename?: 'Query', repos: Array<{ __typename?: 'GithubRepo', id: string, name: string, branch: string, user: string, repo: string }> };

export type HomePageStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageStatsQuery = { __typename?: 'Query', githubRepoStats: { __typename?: 'GithubRepoStats', count: number } };

export type ListPodQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPodQuery = { __typename?: 'Query', pods: Array<{ __typename?: 'Pod', id: string, podId: string, clientId?: string | null, status: PodStatus, backend: { __typename?: 'Backend', name: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string } }, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } }, resource?: { __typename?: 'Resource', id: string, name: string } | null }> };

export type GetPodQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPodQuery = { __typename?: 'Query', pod: { __typename?: 'Pod', id: string, podId: string, status: PodStatus, clientId?: string | null, backend: { __typename?: 'Backend', id: string, clientId: string, name: string, kind: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string }, pods: Array<{ __typename?: 'Pod', id: string, podId: string, clientId?: string | null, status: PodStatus, backend: { __typename?: 'Backend', name: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string } }, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } }, resource?: { __typename?: 'Resource', id: string, name: string } | null }>, resources: Array<{ __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string } }> }, latestLogDump?: { __typename?: 'LogDump', logs: string, createdAt: any } | null, resource?: { __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string } } | null, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } } } };

export type GetPodForAgentQueryVariables = Exact<{
  clientId: Scalars['ID']['input'];
}>;


export type GetPodForAgentQuery = { __typename?: 'Query', podForAgent?: { __typename?: 'Pod', id: string, podId: string, status: PodStatus, clientId?: string | null, backend: { __typename?: 'Backend', id: string, clientId: string, name: string, kind: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string }, pods: Array<{ __typename?: 'Pod', id: string, podId: string, clientId?: string | null, status: PodStatus, backend: { __typename?: 'Backend', name: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string } }, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } }, resource?: { __typename?: 'Resource', id: string, name: string } | null }>, resources: Array<{ __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string } }> }, latestLogDump?: { __typename?: 'LogDump', logs: string, createdAt: any } | null, resource?: { __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string } } | null, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } } } | null };

export type ListReleasesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListReleasesQuery = { __typename?: 'Query', releases: Array<{ __typename?: 'Release', id: string, version: string, installed: boolean, scopes: Array<string>, colour: string, description: string, app: { __typename?: 'App', identifier: string }, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename?: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> }> }> };

export type GetReleaseQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetReleaseQuery = { __typename?: 'Query', release: { __typename?: 'Release', id: string, version: string, scopes: Array<string>, colour: string, description: string, app: { __typename?: 'App', identifier: string }, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename?: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> }> } };

export type GetRepoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRepoQuery = { __typename?: 'Query', repo: { __typename?: 'GithubRepo', id: string, name: string, branch: string, user: string, repo: string, url: string, issueUrl: string, addedAt: any, updatedAt: any, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> }> } };

export type ListReposQueryVariables = Exact<{
  filters?: InputMaybe<GithubRepoFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListReposQuery = { __typename?: 'Query', repos: Array<{ __typename?: 'GithubRepo', id: string, name: string, branch: string, user: string, repo: string }> };

export type ListResourcesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListResourcesQuery = { __typename?: 'Query', resources: Array<{ __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string } }> };

export type GetResourceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetResourceQuery = { __typename?: 'Query', resource: { __typename?: 'Resource', id: string, name: string, qualifiers?: any | null, backend: { __typename?: 'Backend', id: string, name: string }, pods: Array<{ __typename?: 'Pod', id: string, podId: string, clientId?: string | null, status: PodStatus, backend: { __typename?: 'Backend', name: string, user: { __typename?: 'User', sub: string }, client: { __typename?: 'Client', clientId: string } }, deployment: { __typename?: 'Deployment', id: string, flavour: { __typename?: 'Flavour', release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } } }, resource?: { __typename?: 'Resource', id: string, name: string } | null }> } };

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', definitions: Array<{ __typename?: 'Definition', id: string, name: string, hash: any, description?: string | null, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } }> }>, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } }, selectors: Array<{ __typename?: 'CPUSelector' } | { __typename?: 'CudaSelector', cudaVersion?: string | null, cudaCores?: number | null } | { __typename?: 'RocmSelector', apiVersion?: string | null, apiThing?: string | null }> }> };

export const ListBackendFragmentDoc = gql`
    fragment ListBackend on Backend {
  id
  user {
    sub
  }
  client {
    clientId
  }
  name
  kind
}
    `;
export const BaseEffectFragmentDoc = gql`
    fragment BaseEffect on Effect {
  __typename
  kind
  dependencies
  function
}
    `;
export const CustomEffectFragmentDoc = gql`
    fragment CustomEffect on CustomEffect {
  ...BaseEffect
  __typename
  kind
  hook
  ward
}
    ${BaseEffectFragmentDoc}`;
export const MessageEffectFragmentDoc = gql`
    fragment MessageEffect on MessageEffect {
  ...BaseEffect
  __typename
  kind
  message
}
    ${BaseEffectFragmentDoc}`;
export const HideEffectFragmentDoc = gql`
    fragment HideEffect on HideEffect {
  ...BaseEffect
  __typename
  fade
}
    ${BaseEffectFragmentDoc}`;
export const PortEffectFragmentDoc = gql`
    fragment PortEffect on Effect {
  ...CustomEffect
  ...MessageEffect
  ...HideEffect
}
    ${CustomEffectFragmentDoc}
${MessageEffectFragmentDoc}
${HideEffectFragmentDoc}`;
export const StringAssignWidgetFragmentDoc = gql`
    fragment StringAssignWidget on StringAssignWidget {
  __typename
  kind
  placeholder
  asParagraph
}
    `;
export const FilterPortFragmentDoc = gql`
    fragment FilterPort on ArgPort {
  __typename
  kind
  key
  identifier
  widget {
    ... on SearchAssignWidget {
      query
    }
  }
  description
  nullable
}
    `;
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
  statePath
  stateAccessors {
    optionKey
    subPath
  }
  dependency
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
export const ArgChildPortNestedFragmentDoc = gql`
    fragment ArgChildPortNested on ArgPort {
  __typename
  kind
  key
  identifier
  children {
    kind
    identifier
    widget {
      ...AssignWidget
    }
  }
  choices {
    value
    label
    description
  }
  widget {
    ...AssignWidget
  }
  description
  nullable
}
    ${AssignWidgetFragmentDoc}`;
export const ArgChildPortFragmentDoc = gql`
    fragment ArgChildPort on ArgPort {
  __typename
  kind
  key
  identifier
  children {
    ...ArgChildPortNested
  }
  widget {
    ...AssignWidget
  }
  choices {
    value
    label
    description
  }
  nullable
  description
}
    ${ArgChildPortNestedFragmentDoc}
${AssignWidgetFragmentDoc}`;
export const ValidatorFragmentDoc = gql`
    fragment Validator on Validator {
  function
  dependencies
  label
  errorMessage
}
    `;
export const ArgPortFragmentDoc = gql`
    fragment ArgPort on ArgPort {
  __typename
  key
  label
  nullable
  description
  effects {
    ...PortEffect
  }
  widget {
    ...AssignWidget
  }
  kind
  identifier
  children {
    ...ArgChildPort
  }
  choices {
    value
    label
    description
  }
  default
  nullable
  validators {
    ...Validator
  }
}
    ${PortEffectFragmentDoc}
${AssignWidgetFragmentDoc}
${ArgChildPortFragmentDoc}
${ValidatorFragmentDoc}`;
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
export const ReturnChildPortNestedFragmentDoc = gql`
    fragment ReturnChildPortNested on ReturnPort {
  __typename
  kind
  key
  identifier
  children {
    kind
    identifier
    widget {
      ...ReturnWidget
    }
  }
  choices {
    value
    label
    description
  }
  widget {
    ...ReturnWidget
  }
  description
  nullable
}
    ${ReturnWidgetFragmentDoc}`;
export const ReturnChildPortFragmentDoc = gql`
    fragment ReturnChildPort on ReturnPort {
  __typename
  kind
  key
  identifier
  children {
    ...ReturnChildPortNested
  }
  widget {
    ...ReturnWidget
  }
  choices {
    value
    label
    description
  }
  nullable
  description
}
    ${ReturnChildPortNestedFragmentDoc}
${ReturnWidgetFragmentDoc}`;
export const ReturnPortFragmentDoc = gql`
    fragment ReturnPort on ReturnPort {
  __typename
  key
  label
  nullable
  description
  effects {
    ...PortEffect
  }
  widget {
    ...ReturnWidget
  }
  kind
  identifier
  children {
    ...ReturnChildPort
  }
  choices {
    value
    label
    description
  }
  default
  nullable
  provides {
    key
    operator
    value
  }
}
    ${PortEffectFragmentDoc}
${ReturnWidgetFragmentDoc}
${ReturnChildPortFragmentDoc}`;
export const CudaSelectorFragmentDoc = gql`
    fragment CudaSelector on CudaSelector {
  cudaVersion
  cudaCores
}
    `;
export const RocmSelectorFragmentDoc = gql`
    fragment RocmSelector on RocmSelector {
  apiVersion
  apiThing
}
    `;
export const ListFlavourFragmentDoc = gql`
    fragment ListFlavour on Flavour {
  id
  name
  release {
    id
    version
    app {
      identifier
    }
  }
  selectors {
    ...CudaSelector
    ...RocmSelector
  }
}
    ${CudaSelectorFragmentDoc}
${RocmSelectorFragmentDoc}`;
export const DefinitionFragmentDoc = gql`
    fragment Definition on Definition {
  id
  name
  hash
  description
  args {
    ...ArgPort
  }
  returns {
    ...ReturnPort
  }
  flavours {
    ...ListFlavour
  }
}
    ${ArgPortFragmentDoc}
${ReturnPortFragmentDoc}
${ListFlavourFragmentDoc}`;
export const ListDefinitionFragmentDoc = gql`
    fragment ListDefinition on Definition {
  id
  name
  hash
  description
  flavours {
    id
    name
    release {
      id
      version
      app {
        identifier
      }
    }
  }
}
    `;
export const FlavourFragmentDoc = gql`
    fragment Flavour on Flavour {
  ...ListFlavour
  description
}
    ${ListFlavourFragmentDoc}`;
export const ListPodFragmentDoc = gql`
    fragment ListPod on Pod {
  id
  podId
  backend {
    user {
      sub
    }
    client {
      clientId
    }
    name
  }
  deployment {
    id
    flavour {
      release {
        id
        version
        app {
          identifier
        }
      }
    }
  }
  clientId
  resource {
    id
    name
  }
  status
}
    `;
export const ListResourceFragmentDoc = gql`
    fragment ListResource on Resource {
  id
  name
  qualifiers
  backend {
    id
    name
  }
}
    `;
export const BackendFragmentDoc = gql`
    fragment Backend on Backend {
  id
  user {
    sub
  }
  client {
    clientId
  }
  clientId
  name
  kind
  pods {
    ...ListPod
  }
  resources {
    ...ListResource
  }
}
    ${ListPodFragmentDoc}
${ListResourceFragmentDoc}`;
export const PodFragmentDoc = gql`
    fragment Pod on Pod {
  id
  podId
  backend {
    ...Backend
  }
  status
  latestLogDump {
    logs
    createdAt
  }
  clientId
  resource {
    ...ListResource
  }
  deployment {
    id
    flavour {
      release {
        id
        version
        app {
          identifier
        }
      }
    }
  }
}
    ${BackendFragmentDoc}
${ListResourceFragmentDoc}`;
export const ReleaseFragmentDoc = gql`
    fragment Release on Release {
  id
  version
  app {
    identifier
  }
  flavours {
    ...ListFlavour
  }
  scopes
  colour
  description
}
    ${ListFlavourFragmentDoc}`;
export const ListReleaseFragmentDoc = gql`
    fragment ListRelease on Release {
  id
  version
  app {
    identifier
  }
  installed
  scopes
  flavours {
    ...ListFlavour
  }
  colour
  description
}
    ${ListFlavourFragmentDoc}`;
export const ListRepoFragmentDoc = gql`
    fragment ListRepo on GithubRepo {
  id
  name
  branch
  user
  repo
}
    `;
export const RepoFragmentDoc = gql`
    fragment Repo on GithubRepo {
  id
  name
  branch
  user
  repo
  url
  issueUrl
  addedAt
  updatedAt
  flavours {
    id
    name
    release {
      id
      version
      app {
        identifier
      }
    }
    selectors {
      ... on CPUSelector {
        __typename
      }
      ... on CudaSelector {
        cudaVersion
        cudaCores
      }
      ... on RocmSelector {
        apiVersion
        apiThing
      }
    }
  }
}
    `;
export const ResourceFragmentDoc = gql`
    fragment Resource on Resource {
  id
  name
  qualifiers
  backend {
    id
    name
  }
  pods {
    ...ListPod
  }
}
    ${ListPodFragmentDoc}`;
export const DeleteBackendDocument = gql`
    mutation DeleteBackend($id: ID!) {
  deleteBackend(id: $id)
}
    `;
export type DeleteBackendMutationFn = Apollo.MutationFunction<DeleteBackendMutation, DeleteBackendMutationVariables>;

/**
 * __useDeleteBackendMutation__
 *
 * To run a mutation, you first call `useDeleteBackendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBackendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBackendMutation, { data, loading, error }] = useDeleteBackendMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBackendMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteBackendMutation, DeleteBackendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteBackendMutation, DeleteBackendMutationVariables>(DeleteBackendDocument, options);
      }
export type DeleteBackendMutationHookResult = ReturnType<typeof useDeleteBackendMutation>;
export type DeleteBackendMutationResult = Apollo.MutationResult<DeleteBackendMutation>;
export type DeleteBackendMutationOptions = Apollo.BaseMutationOptions<DeleteBackendMutation, DeleteBackendMutationVariables>;
export const DeletePodDocument = gql`
    mutation DeletePod($id: ID!) {
  deletePod(input: {id: $id})
}
    `;
export type DeletePodMutationFn = Apollo.MutationFunction<DeletePodMutation, DeletePodMutationVariables>;

/**
 * __useDeletePodMutation__
 *
 * To run a mutation, you first call `useDeletePodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePodMutation, { data, loading, error }] = useDeletePodMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePodMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeletePodMutation, DeletePodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeletePodMutation, DeletePodMutationVariables>(DeletePodDocument, options);
      }
export type DeletePodMutationHookResult = ReturnType<typeof useDeletePodMutation>;
export type DeletePodMutationResult = Apollo.MutationResult<DeletePodMutation>;
export type DeletePodMutationOptions = Apollo.BaseMutationOptions<DeletePodMutation, DeletePodMutationVariables>;
export const CreateGithubRepoDocument = gql`
    mutation CreateGithubRepo($identifier: String!) {
  createGithubRepo(input: {identifier: $identifier}) {
    id
  }
}
    `;
export type CreateGithubRepoMutationFn = Apollo.MutationFunction<CreateGithubRepoMutation, CreateGithubRepoMutationVariables>;

/**
 * __useCreateGithubRepoMutation__
 *
 * To run a mutation, you first call `useCreateGithubRepoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGithubRepoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGithubRepoMutation, { data, loading, error }] = useCreateGithubRepoMutation({
 *   variables: {
 *      identifier: // value for 'identifier'
 *   },
 * });
 */
export function useCreateGithubRepoMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateGithubRepoMutation, CreateGithubRepoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateGithubRepoMutation, CreateGithubRepoMutationVariables>(CreateGithubRepoDocument, options);
      }
export type CreateGithubRepoMutationHookResult = ReturnType<typeof useCreateGithubRepoMutation>;
export type CreateGithubRepoMutationResult = Apollo.MutationResult<CreateGithubRepoMutation>;
export type CreateGithubRepoMutationOptions = Apollo.BaseMutationOptions<CreateGithubRepoMutation, CreateGithubRepoMutationVariables>;
export const RescanReposDocument = gql`
    mutation RescanRepos {
  rescanRepos {
    id
  }
}
    `;
export type RescanReposMutationFn = Apollo.MutationFunction<RescanReposMutation, RescanReposMutationVariables>;

/**
 * __useRescanReposMutation__
 *
 * To run a mutation, you first call `useRescanReposMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRescanReposMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rescanReposMutation, { data, loading, error }] = useRescanReposMutation({
 *   variables: {
 *   },
 * });
 */
export function useRescanReposMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RescanReposMutation, RescanReposMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RescanReposMutation, RescanReposMutationVariables>(RescanReposDocument, options);
      }
export type RescanReposMutationHookResult = ReturnType<typeof useRescanReposMutation>;
export type RescanReposMutationResult = Apollo.MutationResult<RescanReposMutation>;
export type RescanReposMutationOptions = Apollo.BaseMutationOptions<RescanReposMutation, RescanReposMutationVariables>;
export const ListBackendsDocument = gql`
    query ListBackends {
  backends {
    ...ListBackend
  }
}
    ${ListBackendFragmentDoc}`;

/**
 * __useListBackendsQuery__
 *
 * To run a query within a React component, call `useListBackendsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListBackendsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListBackendsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListBackendsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListBackendsQuery, ListBackendsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListBackendsQuery, ListBackendsQueryVariables>(ListBackendsDocument, options);
      }
export function useListBackendsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListBackendsQuery, ListBackendsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListBackendsQuery, ListBackendsQueryVariables>(ListBackendsDocument, options);
        }
export type ListBackendsQueryHookResult = ReturnType<typeof useListBackendsQuery>;
export type ListBackendsLazyQueryHookResult = ReturnType<typeof useListBackendsLazyQuery>;
export type ListBackendsQueryResult = Apollo.QueryResult<ListBackendsQuery, ListBackendsQueryVariables>;
export const GetBackendDocument = gql`
    query GetBackend($id: ID!) {
  backend(id: $id) {
    ...Backend
  }
}
    ${BackendFragmentDoc}`;

/**
 * __useGetBackendQuery__
 *
 * To run a query within a React component, call `useGetBackendQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBackendQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBackendQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBackendQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetBackendQuery, GetBackendQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetBackendQuery, GetBackendQueryVariables>(GetBackendDocument, options);
      }
export function useGetBackendLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetBackendQuery, GetBackendQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetBackendQuery, GetBackendQueryVariables>(GetBackendDocument, options);
        }
export type GetBackendQueryHookResult = ReturnType<typeof useGetBackendQuery>;
export type GetBackendLazyQueryHookResult = ReturnType<typeof useGetBackendLazyQuery>;
export type GetBackendQueryResult = Apollo.QueryResult<GetBackendQuery, GetBackendQueryVariables>;
export const GetDefinitionDocument = gql`
    query GetDefinition($id: ID!) {
  definition(id: $id) {
    ...Definition
  }
}
    ${DefinitionFragmentDoc}`;

/**
 * __useGetDefinitionQuery__
 *
 * To run a query within a React component, call `useGetDefinitionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDefinitionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDefinitionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDefinitionQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetDefinitionQuery, GetDefinitionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetDefinitionQuery, GetDefinitionQueryVariables>(GetDefinitionDocument, options);
      }
export function useGetDefinitionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDefinitionQuery, GetDefinitionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetDefinitionQuery, GetDefinitionQueryVariables>(GetDefinitionDocument, options);
        }
export type GetDefinitionQueryHookResult = ReturnType<typeof useGetDefinitionQuery>;
export type GetDefinitionLazyQueryHookResult = ReturnType<typeof useGetDefinitionLazyQuery>;
export type GetDefinitionQueryResult = Apollo.QueryResult<GetDefinitionQuery, GetDefinitionQueryVariables>;
export const ListDefinitionsDocument = gql`
    query ListDefinitions {
  definitions {
    ...ListDefinition
  }
}
    ${ListDefinitionFragmentDoc}`;

/**
 * __useListDefinitionsQuery__
 *
 * To run a query within a React component, call `useListDefinitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListDefinitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListDefinitionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListDefinitionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListDefinitionsQuery, ListDefinitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListDefinitionsQuery, ListDefinitionsQueryVariables>(ListDefinitionsDocument, options);
      }
export function useListDefinitionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListDefinitionsQuery, ListDefinitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListDefinitionsQuery, ListDefinitionsQueryVariables>(ListDefinitionsDocument, options);
        }
export type ListDefinitionsQueryHookResult = ReturnType<typeof useListDefinitionsQuery>;
export type ListDefinitionsLazyQueryHookResult = ReturnType<typeof useListDefinitionsLazyQuery>;
export type ListDefinitionsQueryResult = Apollo.QueryResult<ListDefinitionsQuery, ListDefinitionsQueryVariables>;
export const PrimaryDefinitionsDocument = gql`
    query PrimaryDefinitions($pagination: OffsetPaginationInput, $identifier: String, $search: String, $ordering: [DefinitionOrder!]) {
  definitions(
    ordering: $ordering
    pagination: $pagination
    filters: {demands: [{kind: ARGS, matches: [{at: 0, kind: STRUCTURE, identifier: $identifier}]}], search: $search}
  ) {
    ...ListDefinition
  }
}
    ${ListDefinitionFragmentDoc}`;

/**
 * __usePrimaryDefinitionsQuery__
 *
 * To run a query within a React component, call `usePrimaryDefinitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePrimaryDefinitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePrimaryDefinitionsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      identifier: // value for 'identifier'
 *      search: // value for 'search'
 *      ordering: // value for 'ordering'
 *   },
 * });
 */
export function usePrimaryDefinitionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<PrimaryDefinitionsQuery, PrimaryDefinitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PrimaryDefinitionsQuery, PrimaryDefinitionsQueryVariables>(PrimaryDefinitionsDocument, options);
      }
export function usePrimaryDefinitionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PrimaryDefinitionsQuery, PrimaryDefinitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PrimaryDefinitionsQuery, PrimaryDefinitionsQueryVariables>(PrimaryDefinitionsDocument, options);
        }
export type PrimaryDefinitionsQueryHookResult = ReturnType<typeof usePrimaryDefinitionsQuery>;
export type PrimaryDefinitionsLazyQueryHookResult = ReturnType<typeof usePrimaryDefinitionsLazyQuery>;
export type PrimaryDefinitionsQueryResult = Apollo.QueryResult<PrimaryDefinitionsQuery, PrimaryDefinitionsQueryVariables>;
export const AllPrimaryDefinitionsDocument = gql`
    query AllPrimaryDefinitions($pagination: OffsetPaginationInput, $filters: DefinitionFilter, $ordering: [DefinitionOrder!]) {
  definitions(ordering: $ordering, pagination: $pagination, filters: $filters) {
    ...ListDefinition
  }
}
    ${ListDefinitionFragmentDoc}`;

/**
 * __useAllPrimaryDefinitionsQuery__
 *
 * To run a query within a React component, call `useAllPrimaryDefinitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllPrimaryDefinitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllPrimaryDefinitionsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filters: // value for 'filters'
 *      ordering: // value for 'ordering'
 *   },
 * });
 */
export function useAllPrimaryDefinitionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AllPrimaryDefinitionsQuery, AllPrimaryDefinitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AllPrimaryDefinitionsQuery, AllPrimaryDefinitionsQueryVariables>(AllPrimaryDefinitionsDocument, options);
      }
export function useAllPrimaryDefinitionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AllPrimaryDefinitionsQuery, AllPrimaryDefinitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AllPrimaryDefinitionsQuery, AllPrimaryDefinitionsQueryVariables>(AllPrimaryDefinitionsDocument, options);
        }
export type AllPrimaryDefinitionsQueryHookResult = ReturnType<typeof useAllPrimaryDefinitionsQuery>;
export type AllPrimaryDefinitionsLazyQueryHookResult = ReturnType<typeof useAllPrimaryDefinitionsLazyQuery>;
export type AllPrimaryDefinitionsQueryResult = Apollo.QueryResult<AllPrimaryDefinitionsQuery, AllPrimaryDefinitionsQueryVariables>;
export const ListFlavoursDocument = gql`
    query ListFlavours {
  flavours {
    ...ListFlavour
  }
}
    ${ListFlavourFragmentDoc}`;

/**
 * __useListFlavoursQuery__
 *
 * To run a query within a React component, call `useListFlavoursQuery` and pass it any options that fit your needs.
 * When your component renders, `useListFlavoursQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListFlavoursQuery({
 *   variables: {
 *   },
 * });
 */
export function useListFlavoursQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListFlavoursQuery, ListFlavoursQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListFlavoursQuery, ListFlavoursQueryVariables>(ListFlavoursDocument, options);
      }
export function useListFlavoursLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListFlavoursQuery, ListFlavoursQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListFlavoursQuery, ListFlavoursQueryVariables>(ListFlavoursDocument, options);
        }
export type ListFlavoursQueryHookResult = ReturnType<typeof useListFlavoursQuery>;
export type ListFlavoursLazyQueryHookResult = ReturnType<typeof useListFlavoursLazyQuery>;
export type ListFlavoursQueryResult = Apollo.QueryResult<ListFlavoursQuery, ListFlavoursQueryVariables>;
export const GetFlavourDocument = gql`
    query GetFlavour($id: ID!) {
  flavour(id: $id) {
    ...Flavour
  }
}
    ${FlavourFragmentDoc}`;

/**
 * __useGetFlavourQuery__
 *
 * To run a query within a React component, call `useGetFlavourQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFlavourQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFlavourQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFlavourQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetFlavourQuery, GetFlavourQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetFlavourQuery, GetFlavourQueryVariables>(GetFlavourDocument, options);
      }
export function useGetFlavourLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFlavourQuery, GetFlavourQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetFlavourQuery, GetFlavourQueryVariables>(GetFlavourDocument, options);
        }
export type GetFlavourQueryHookResult = ReturnType<typeof useGetFlavourQuery>;
export type GetFlavourLazyQueryHookResult = ReturnType<typeof useGetFlavourLazyQuery>;
export type GetFlavourQueryResult = Apollo.QueryResult<GetFlavourQuery, GetFlavourQueryVariables>;
export const HomePageDocument = gql`
    query HomePage {
  repos: githubRepos {
    ...ListRepo
  }
}
    ${ListRepoFragmentDoc}`;

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
  githubRepoStats {
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
export const ListPodDocument = gql`
    query ListPod {
  pods {
    ...ListPod
  }
}
    ${ListPodFragmentDoc}`;

/**
 * __useListPodQuery__
 *
 * To run a query within a React component, call `useListPodQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPodQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPodQuery({
 *   variables: {
 *   },
 * });
 */
export function useListPodQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListPodQuery, ListPodQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListPodQuery, ListPodQueryVariables>(ListPodDocument, options);
      }
export function useListPodLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListPodQuery, ListPodQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListPodQuery, ListPodQueryVariables>(ListPodDocument, options);
        }
export type ListPodQueryHookResult = ReturnType<typeof useListPodQuery>;
export type ListPodLazyQueryHookResult = ReturnType<typeof useListPodLazyQuery>;
export type ListPodQueryResult = Apollo.QueryResult<ListPodQuery, ListPodQueryVariables>;
export const GetPodDocument = gql`
    query GetPod($id: ID!) {
  pod(id: $id) {
    ...Pod
  }
}
    ${PodFragmentDoc}`;

/**
 * __useGetPodQuery__
 *
 * To run a query within a React component, call `useGetPodQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPodQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPodQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPodQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPodQuery, GetPodQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPodQuery, GetPodQueryVariables>(GetPodDocument, options);
      }
export function useGetPodLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPodQuery, GetPodQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPodQuery, GetPodQueryVariables>(GetPodDocument, options);
        }
export type GetPodQueryHookResult = ReturnType<typeof useGetPodQuery>;
export type GetPodLazyQueryHookResult = ReturnType<typeof useGetPodLazyQuery>;
export type GetPodQueryResult = Apollo.QueryResult<GetPodQuery, GetPodQueryVariables>;
export const GetPodForAgentDocument = gql`
    query GetPodForAgent($clientId: ID!) {
  podForAgent(clientId: $clientId) {
    ...Pod
  }
}
    ${PodFragmentDoc}`;

/**
 * __useGetPodForAgentQuery__
 *
 * To run a query within a React component, call `useGetPodForAgentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPodForAgentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPodForAgentQuery({
 *   variables: {
 *      clientId: // value for 'clientId'
 *   },
 * });
 */
export function useGetPodForAgentQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPodForAgentQuery, GetPodForAgentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPodForAgentQuery, GetPodForAgentQueryVariables>(GetPodForAgentDocument, options);
      }
export function useGetPodForAgentLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPodForAgentQuery, GetPodForAgentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPodForAgentQuery, GetPodForAgentQueryVariables>(GetPodForAgentDocument, options);
        }
export type GetPodForAgentQueryHookResult = ReturnType<typeof useGetPodForAgentQuery>;
export type GetPodForAgentLazyQueryHookResult = ReturnType<typeof useGetPodForAgentLazyQuery>;
export type GetPodForAgentQueryResult = Apollo.QueryResult<GetPodForAgentQuery, GetPodForAgentQueryVariables>;
export const ListReleasesDocument = gql`
    query ListReleases {
  releases {
    ...ListRelease
  }
}
    ${ListReleaseFragmentDoc}`;

/**
 * __useListReleasesQuery__
 *
 * To run a query within a React component, call `useListReleasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListReleasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListReleasesQuery({
 *   variables: {
 *   },
 * });
 */
export function useListReleasesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListReleasesQuery, ListReleasesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListReleasesQuery, ListReleasesQueryVariables>(ListReleasesDocument, options);
      }
export function useListReleasesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListReleasesQuery, ListReleasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListReleasesQuery, ListReleasesQueryVariables>(ListReleasesDocument, options);
        }
export type ListReleasesQueryHookResult = ReturnType<typeof useListReleasesQuery>;
export type ListReleasesLazyQueryHookResult = ReturnType<typeof useListReleasesLazyQuery>;
export type ListReleasesQueryResult = Apollo.QueryResult<ListReleasesQuery, ListReleasesQueryVariables>;
export const GetReleaseDocument = gql`
    query GetRelease($id: ID!) {
  release(id: $id) {
    ...Release
  }
}
    ${ReleaseFragmentDoc}`;

/**
 * __useGetReleaseQuery__
 *
 * To run a query within a React component, call `useGetReleaseQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReleaseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReleaseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetReleaseQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetReleaseQuery, GetReleaseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetReleaseQuery, GetReleaseQueryVariables>(GetReleaseDocument, options);
      }
export function useGetReleaseLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetReleaseQuery, GetReleaseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetReleaseQuery, GetReleaseQueryVariables>(GetReleaseDocument, options);
        }
export type GetReleaseQueryHookResult = ReturnType<typeof useGetReleaseQuery>;
export type GetReleaseLazyQueryHookResult = ReturnType<typeof useGetReleaseLazyQuery>;
export type GetReleaseQueryResult = Apollo.QueryResult<GetReleaseQuery, GetReleaseQueryVariables>;
export const GetRepoDocument = gql`
    query GetRepo($id: ID!) {
  repo: githubRepo(id: $id) {
    ...Repo
  }
}
    ${RepoFragmentDoc}`;

/**
 * __useGetRepoQuery__
 *
 * To run a query within a React component, call `useGetRepoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRepoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRepoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRepoQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRepoQuery, GetRepoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRepoQuery, GetRepoQueryVariables>(GetRepoDocument, options);
      }
export function useGetRepoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRepoQuery, GetRepoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRepoQuery, GetRepoQueryVariables>(GetRepoDocument, options);
        }
export type GetRepoQueryHookResult = ReturnType<typeof useGetRepoQuery>;
export type GetRepoLazyQueryHookResult = ReturnType<typeof useGetRepoLazyQuery>;
export type GetRepoQueryResult = Apollo.QueryResult<GetRepoQuery, GetRepoQueryVariables>;
export const ListReposDocument = gql`
    query ListRepos($filters: GithubRepoFilter, $pagination: OffsetPaginationInput) {
  repos: githubRepos(filters: $filters, pagination: $pagination) {
    ...ListRepo
  }
}
    ${ListRepoFragmentDoc}`;

/**
 * __useListReposQuery__
 *
 * To run a query within a React component, call `useListReposQuery` and pass it any options that fit your needs.
 * When your component renders, `useListReposQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListReposQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListReposQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListReposQuery, ListReposQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListReposQuery, ListReposQueryVariables>(ListReposDocument, options);
      }
export function useListReposLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListReposQuery, ListReposQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListReposQuery, ListReposQueryVariables>(ListReposDocument, options);
        }
export type ListReposQueryHookResult = ReturnType<typeof useListReposQuery>;
export type ListReposLazyQueryHookResult = ReturnType<typeof useListReposLazyQuery>;
export type ListReposQueryResult = Apollo.QueryResult<ListReposQuery, ListReposQueryVariables>;
export const ListResourcesDocument = gql`
    query ListResources {
  resources {
    ...ListResource
  }
}
    ${ListResourceFragmentDoc}`;

/**
 * __useListResourcesQuery__
 *
 * To run a query within a React component, call `useListResourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListResourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListResourcesQuery({
 *   variables: {
 *   },
 * });
 */
export function useListResourcesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListResourcesQuery, ListResourcesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListResourcesQuery, ListResourcesQueryVariables>(ListResourcesDocument, options);
      }
export function useListResourcesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListResourcesQuery, ListResourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListResourcesQuery, ListResourcesQueryVariables>(ListResourcesDocument, options);
        }
export type ListResourcesQueryHookResult = ReturnType<typeof useListResourcesQuery>;
export type ListResourcesLazyQueryHookResult = ReturnType<typeof useListResourcesLazyQuery>;
export type ListResourcesQueryResult = Apollo.QueryResult<ListResourcesQuery, ListResourcesQueryVariables>;
export const GetResourceDocument = gql`
    query GetResource($id: ID!) {
  resource(id: $id) {
    ...Resource
  }
}
    ${ResourceFragmentDoc}`;

/**
 * __useGetResourceQuery__
 *
 * To run a query within a React component, call `useGetResourceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetResourceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetResourceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetResourceQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetResourceQuery, GetResourceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetResourceQuery, GetResourceQueryVariables>(GetResourceDocument, options);
      }
export function useGetResourceLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetResourceQuery, GetResourceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetResourceQuery, GetResourceQueryVariables>(GetResourceDocument, options);
        }
export type GetResourceQueryHookResult = ReturnType<typeof useGetResourceQuery>;
export type GetResourceLazyQueryHookResult = ReturnType<typeof useGetResourceLazyQuery>;
export type GetResourceQueryResult = Apollo.QueryResult<GetResourceQuery, GetResourceQueryVariables>;
export const GlobalSearchDocument = gql`
    query GlobalSearch($search: String, $pagination: OffsetPaginationInput) {
  definitions: definitions(filters: {search: $search}, pagination: $pagination) {
    ...ListDefinition
  }
  flavours: flavours(filters: {search: $search}, pagination: $pagination) {
    ...ListFlavour
  }
}
    ${ListDefinitionFragmentDoc}
${ListFlavourFragmentDoc}`;

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