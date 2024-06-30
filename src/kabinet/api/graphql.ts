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
  DateTime: { input: any; output: any; }
  Identifier: { input: any; output: any; }
  NodeHash: { input: any; output: any; }
  UntypedParams: { input: any; output: any; }
  ValidatorFunction: { input: any; output: any; }
};

/** A user of the bridge server. Maps to an authentikate user */
export type App = {
  __typename?: 'App';
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
};

export type AssignWidget = {
  kind: AssignWidgetKind;
};

export enum AssignWidgetKind {
  Choice = 'CHOICE',
  Custom = 'CUSTOM',
  Search = 'SEARCH',
  Slider = 'SLIDER',
  String = 'STRING'
}

/** A user of the bridge server. Maps to an authentikate user */
export type Backend = {
  __typename?: 'Backend';
  client: Client;
  id: Scalars['ID']['output'];
  user: User;
};

/**  A selector is a way to select a release */
export type CpuSelector = Selector & {
  __typename?: 'CPUSelector';
  frequency?: Maybe<Scalars['Int']['output']>;
  min: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
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

export type ChoiceReturnWidget = ReturnWidget & {
  __typename?: 'ChoiceReturnWidget';
  choices?: Maybe<Array<Choice>>;
  kind: ReturnWidgetKind;
};

/** A user of the bridge server. Maps to an authentikate user */
export type Client = {
  __typename?: 'Client';
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
};

/** A user of the bridge server. Maps to an authentikate user */
export type Collection = {
  __typename?: 'Collection';
  definedAt: Scalars['DateTime']['output'];
  /** A description for the Collection */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The name of this Collection */
  name: Scalars['String']['output'];
};

/** The state of a dask cluster */
export enum ContainerType {
  Apptainer = 'APPTAINER',
  Docker = 'DOCKER'
}

/** Create a new Github repository input */
export type CreateDeploymentInput = {
  flavour: Scalars['ID']['input'];
  instanceId: Scalars['String']['input'];
  lastPulled?: InputMaybe<Scalars['DateTime']['input']>;
  localId: Scalars['ID']['input'];
  secretParams?: InputMaybe<Scalars['UntypedParams']['input']>;
};

/** Create a new Github repository input */
export type CreateGithupRepoInput = {
  autoScan?: InputMaybe<Scalars['Boolean']['input']>;
  branch: Scalars['String']['input'];
  name: Scalars['String']['input'];
  repo: Scalars['String']['input'];
  user: Scalars['String']['input'];
};

/** Create a new Github repository input */
export type CreatePodInput = {
  deployment: Scalars['ID']['input'];
  instanceId: Scalars['String']['input'];
  localId: Scalars['ID']['input'];
};

/**  A selector is a way to select a release */
export type CudaSelector = Selector & {
  __typename?: 'CudaSelector';
  /** The minimum compute capability */
  computeCapability: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
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

/**
 * Nodes are abstraction of RPC Tasks. They provide a common API to deal with creating tasks.
 *
 * See online Documentation
 */
export type Definition = {
  __typename?: 'Definition';
  /** Inputs for this Node */
  args: Array<Port>;
  /** The collections this Node belongs to */
  collections: Array<Collection>;
  definedAt: Scalars['DateTime']['output'];
  /** A description for the Node */
  description?: Maybe<Scalars['String']['output']>;
  /** The flavours this Definition belongs to */
  flavours: Array<Flavour>;
  /** The hash of the Node (completely unique) */
  hash: Scalars['NodeHash']['output'];
  id: Scalars['ID']['output'];
  /** The users that have pinned the position */
  isTestFor: Array<Definition>;
  /** The kind of this Node. e.g. is it a function or a generator? */
  kind: NodeKind;
  /** The cleartext name of this Node */
  name: Scalars['String']['output'];
  /** The protocols this Node implements (e.g. Predicate) */
  protocols: Array<Protocol>;
  /** Outputs for this Node */
  returns: Array<Port>;
  /** The scope of this Node. e.g. does the data it needs or produce live only in the scope of this Node or is it global or does it bridge data? */
  scope: NodeScope;
  /** The users that have pinned the position */
  tests: Array<Definition>;
};


/**
 * Nodes are abstraction of RPC Tasks. They provide a common API to deal with creating tasks.
 *
 * See online Documentation
 */
export type DefinitionFlavoursArgs = {
  filters?: InputMaybe<FlavourFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/**
 * Nodes are abstraction of RPC Tasks. They provide a common API to deal with creating tasks.
 *
 * See online Documentation
 */
export type DefinitionIsTestForArgs = {
  filters?: InputMaybe<GithubRepoFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/**
 * Nodes are abstraction of RPC Tasks. They provide a common API to deal with creating tasks.
 *
 * See online Documentation
 */
export type DefinitionTestsArgs = {
  filters?: InputMaybe<GithubRepoFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** A user of the bridge server. Maps to an authentikate user */
export type Deployment = {
  __typename?: 'Deployment';
  apiToken: Scalars['String']['output'];
  backend: Backend;
  flavour: Flavour;
  id: Scalars['ID']['output'];
  localId: Scalars['ID']['output'];
};

/** The Feature you are trying to match */
export type DeviceFeature = {
  cpuCount: Scalars['String']['input'];
  kind: Scalars['String']['input'];
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

export enum EffectKind {
  Custom = 'CUSTOM',
  Message = 'MESSAGE'
}

/** Which environment do you want to match against? */
export type EnvironmentInput = {
  containerType: ContainerType;
  features?: InputMaybe<Array<DeviceFeature>>;
};

/** A user of the bridge server. Maps to an authentikate user */
export type Flavour = {
  __typename?: 'Flavour';
  /** The flavours this Definition belongs to */
  definitions: Array<Definition>;
  deployments: Array<Deployment>;
  description: Scalars['String']['output'];
  entrypoint: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  originalLogo?: Maybe<Scalars['String']['output']>;
  release: Release;
  selectors: Array<Selector>;
};


/** A user of the bridge server. Maps to an authentikate user */
export type FlavourDefinitionsArgs = {
  filters?: InputMaybe<GithubRepoFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Filter for Dask Clusters */
export type FlavourFilter = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** A user of the bridge server. Maps to an authentikate user */
export type GithubRepo = {
  __typename?: 'GithubRepo';
  branch: Scalars['String']['output'];
  flavours: Array<Flavour>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  repo: Scalars['String']['output'];
  user: Scalars['String']['output'];
};


/** A user of the bridge server. Maps to an authentikate user */
export type GithubRepoFlavoursArgs = {
  filters?: InputMaybe<FlavourFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Filter for Dask Clusters */
export type GithubRepoFilter = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** The logs of a pod */
export type LogDump = {
  __typename?: 'LogDump';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  logs: Scalars['String']['output'];
  pod: Pod;
};

export enum LogicalCondition {
  In = 'IN',
  Is = 'IS',
  IsNot = 'IS_NOT'
}

/** Create a new Github repository input */
export type MatchFlavoursInput = {
  environment?: InputMaybe<EnvironmentInput>;
  nodes?: InputMaybe<Array<Scalars['NodeHash']['input']>>;
  release?: InputMaybe<Scalars['ID']['input']>;
};

export type MessageEffect = Effect & {
  __typename?: 'MessageEffect';
  dependencies: Array<EffectDependency>;
  kind: EffectKind;
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new dask cluster on a bridge server */
  createDeployment: Deployment;
  /** Create a new Github repository on a bridge server */
  createGithubRepo: GithubRepo;
  /** Create a new dask cluster on a bridge server */
  createPod: Pod;
  /** Create a new dask cluster on a bridge server */
  scanRepo: GithubRepo;
  /** Create a new dask cluster on a bridge server */
  updateDeployment: Deployment;
  /** Create a new dask cluster on a bridge server */
  updatePod: Pod;
};


export type MutationCreateDeploymentArgs = {
  input: CreateDeploymentInput;
};


export type MutationCreateGithubRepoArgs = {
  input: CreateGithupRepoInput;
};


export type MutationCreatePodArgs = {
  input: CreatePodInput;
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

export enum NodeKind {
  Function = 'FUNCTION',
  Generator = 'GENERATOR'
}

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

/** A user of the bridge server. Maps to an authentikate user */
export type Pod = {
  __typename?: 'Pod';
  backend: Backend;
  deployment: Deployment;
  id: Scalars['ID']['output'];
  latestLogDump: LogDump;
  podId: Scalars['String']['output'];
  status: PodStatus;
};

/** The state of a dask cluster */
export enum PodStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Running = 'RUNNING',
  Stopped = 'STOPPED',
  Stopping = 'STOPPING',
  Unkown = 'UNKOWN'
}

/** An update on a pod */
export type PodUpdateMessage = {
  __typename?: 'PodUpdateMessage';
  created: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  progress?: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
};

export type Port = {
  __typename?: 'Port';
  assignWidget?: Maybe<AssignWidget>;
  children?: Maybe<Array<ChildPort>>;
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

export enum PortScope {
  Global = 'GLOBAL',
  Local = 'LOCAL'
}

/** A user of the bridge server. Maps to an authentikate user */
export type Protocol = {
  __typename?: 'Protocol';
  /** A description for the Protocol */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The name of this Protocol */
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Return all dask clusters */
  definition: Definition;
  definitions: Array<Definition>;
  /** Return all dask clusters */
  deployment: Deployment;
  deployments: Array<Deployment>;
  /** Return all dask clusters */
  flavour: Flavour;
  flavours: Array<Flavour>;
  /** Return all dask clusters */
  githubRepo: GithubRepo;
  githubRepos: Array<GithubRepo>;
  /** Return the currently logged in user */
  matchFlavour: Flavour;
  /** Return the currently logged in user */
  me: User;
  /** Return all dask clusters */
  pod: Pod;
  pods: Array<Pod>;
  /** Return all dask clusters */
  release: Release;
  releases: Array<Release>;
};


export type QueryDefinitionArgs = {
  hash?: InputMaybe<Scalars['NodeHash']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryDefinitionsArgs = {
  filters?: InputMaybe<GithubRepoFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryDeploymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFlavourArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFlavoursArgs = {
  filters?: InputMaybe<FlavourFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryGithubRepoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGithubReposArgs = {
  filters?: InputMaybe<GithubRepoFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMatchFlavourArgs = {
  input: MatchFlavoursInput;
};


export type QueryPodArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReleaseArgs = {
  id: Scalars['ID']['input'];
};

/** A user of the bridge server. Maps to an authentikate user */
export type Release = {
  __typename?: 'Release';
  app: App;
  /** Is this release deployed */
  colour: Scalars['String']['output'];
  /** Is this release deployed */
  deployments: Array<Deployment>;
  /** Is this release deployed */
  description: Scalars['String']['output'];
  entrypoint: Scalars['String']['output'];
  flavours: Array<Flavour>;
  id: Scalars['ID']['output'];
  /** Is this release deployed */
  installed: Scalars['Boolean']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  /** The original logo url */
  originalLogo?: Maybe<Scalars['String']['output']>;
  scopes: Array<Scalars['String']['output']>;
  version: Scalars['String']['output'];
};


/** A user of the bridge server. Maps to an authentikate user */
export type ReleaseFlavoursArgs = {
  filters?: InputMaybe<FlavourFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type ReturnWidget = {
  kind: ReturnWidgetKind;
};

export enum ReturnWidgetKind {
  Choice = 'CHOICE',
  Custom = 'CUSTOM'
}

/** Create a dask cluster input */
export type ScanRepoInput = {
  id: Scalars['String']['input'];
};

export type SearchAssignWidget = AssignWidget & {
  __typename?: 'SearchAssignWidget';
  kind: AssignWidgetKind;
  query: Scalars['String']['output'];
  ward: Scalars['String']['output'];
};

/**  A selector is a way to select a release */
export type Selector = {
  required: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};

export type SliderAssignWidget = AssignWidget & {
  __typename?: 'SliderAssignWidget';
  kind: AssignWidgetKind;
  max?: Maybe<Scalars['Int']['output']>;
  min?: Maybe<Scalars['Int']['output']>;
};

export type StringAssignWidget = AssignWidget & {
  __typename?: 'StringAssignWidget';
  asParagraph: Scalars['Boolean']['output'];
  kind: AssignWidgetKind;
  placeholder: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Create a new dask cluster on a bridge server */
  pod: PodUpdateMessage;
  /** Create a new dask cluster on a bridge server */
  pods: PodUpdateMessage;
};


export type SubscriptionPodArgs = {
  podId: Scalars['ID']['input'];
};

/** Create a new Github repository input */
export type UpdateDeploymentInput = {
  deployment: Scalars['ID']['input'];
  status: PodStatus;
};

/** Create a new Github repository input */
export type UpdatePodInput = {
  instanceId: Scalars['String']['input'];
  localId?: InputMaybe<Scalars['ID']['input']>;
  pod?: InputMaybe<Scalars['ID']['input']>;
  status: PodStatus;
};

/** A user of the bridge server. Maps to an authentikate user */
export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  password: Scalars['String']['output'];
  sub: Scalars['String']['output'];
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
};

export type Validator = {
  __typename?: 'Validator';
  dependencies?: Maybe<Array<Scalars['String']['output']>>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  function: Scalars['ValidatorFunction']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type DefinitionFragment = { __typename?: 'Definition', id: string, name: string, hash: any, description?: string | null, args: Array<{ __typename?: 'Port', kind: PortKind }> };

export type ListDefinitionFragment = { __typename?: 'Definition', id: string, name: string, hash: any, description?: string | null, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } }> };

export type ListFlavourFragment = { __typename?: 'Flavour', id: string, name: string };

export type ListPodFragment = { __typename?: 'Pod', id: string, podId: string };

export type PodFragment = { __typename?: 'Pod', id: string, podId: string };

export type ReleaseFragment = { __typename?: 'Release', id: string, version: string, scopes: Array<string>, colour: string, description: string, app: { __typename?: 'App', identifier: string } };

export type ListReleaseFragment = { __typename?: 'Release', id: string, version: string, installed: boolean, scopes: Array<string>, colour: string, description: string, app: { __typename?: 'App', identifier: string }, flavours: Array<{ __typename?: 'Flavour', id: string, name: string }> };

export type CreateGithubRepoMutationVariables = Exact<{
  user: Scalars['String']['input'];
  repo: Scalars['String']['input'];
  branch: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateGithubRepoMutation = { __typename?: 'Mutation', createGithubRepo: { __typename?: 'GithubRepo', id: string } };

export type ListDefinitionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListDefinitionsQuery = { __typename?: 'Query', definitions: Array<{ __typename?: 'Definition', id: string, name: string, hash: any, description?: string | null, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } }> }> };

export type ListPodQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPodQuery = { __typename?: 'Query', pods: Array<{ __typename?: 'Pod', id: string, podId: string }> };

export type ListReleasesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListReleasesQuery = { __typename?: 'Query', releases: Array<{ __typename?: 'Release', id: string, version: string, installed: boolean, scopes: Array<string>, colour: string, description: string, app: { __typename?: 'App', identifier: string }, flavours: Array<{ __typename?: 'Flavour', id: string, name: string }> }> };

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', definitions: Array<{ __typename?: 'Definition', id: string, name: string, hash: any, description?: string | null, flavours: Array<{ __typename?: 'Flavour', id: string, name: string, release: { __typename?: 'Release', id: string, version: string, app: { __typename?: 'App', identifier: string } } }> }>, flavours: Array<{ __typename?: 'Flavour', id: string, name: string }> };

export const DefinitionFragmentDoc = gql`
    fragment Definition on Definition {
  id
  name
  hash
  description
  args {
    kind
  }
}
    `;
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
export const ListPodFragmentDoc = gql`
    fragment ListPod on Pod {
  id
  podId
}
    `;
export const PodFragmentDoc = gql`
    fragment Pod on Pod {
  id
  podId
}
    `;
export const ReleaseFragmentDoc = gql`
    fragment Release on Release {
  id
  version
  app {
    identifier
  }
  scopes
  colour
  description
}
    `;
export const ListFlavourFragmentDoc = gql`
    fragment ListFlavour on Flavour {
  id
  name
}
    `;
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
export const CreateGithubRepoDocument = gql`
    mutation CreateGithubRepo($user: String!, $repo: String!, $branch: String!, $name: String!) {
  createGithubRepo(
    input: {user: $user, repo: $repo, branch: $branch, name: $name}
  ) {
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
 *      user: // value for 'user'
 *      repo: // value for 'repo'
 *      branch: // value for 'branch'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateGithubRepoMutation(baseOptions?: Apollo.MutationHookOptions<CreateGithubRepoMutation, CreateGithubRepoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGithubRepoMutation, CreateGithubRepoMutationVariables>(CreateGithubRepoDocument, options);
      }
export type CreateGithubRepoMutationHookResult = ReturnType<typeof useCreateGithubRepoMutation>;
export type CreateGithubRepoMutationResult = Apollo.MutationResult<CreateGithubRepoMutation>;
export type CreateGithubRepoMutationOptions = Apollo.BaseMutationOptions<CreateGithubRepoMutation, CreateGithubRepoMutationVariables>;
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
export function useListDefinitionsQuery(baseOptions?: Apollo.QueryHookOptions<ListDefinitionsQuery, ListDefinitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListDefinitionsQuery, ListDefinitionsQueryVariables>(ListDefinitionsDocument, options);
      }
export function useListDefinitionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListDefinitionsQuery, ListDefinitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListDefinitionsQuery, ListDefinitionsQueryVariables>(ListDefinitionsDocument, options);
        }
export type ListDefinitionsQueryHookResult = ReturnType<typeof useListDefinitionsQuery>;
export type ListDefinitionsLazyQueryHookResult = ReturnType<typeof useListDefinitionsLazyQuery>;
export type ListDefinitionsQueryResult = Apollo.QueryResult<ListDefinitionsQuery, ListDefinitionsQueryVariables>;
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
export function useListPodQuery(baseOptions?: Apollo.QueryHookOptions<ListPodQuery, ListPodQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListPodQuery, ListPodQueryVariables>(ListPodDocument, options);
      }
export function useListPodLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListPodQuery, ListPodQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListPodQuery, ListPodQueryVariables>(ListPodDocument, options);
        }
export type ListPodQueryHookResult = ReturnType<typeof useListPodQuery>;
export type ListPodLazyQueryHookResult = ReturnType<typeof useListPodLazyQuery>;
export type ListPodQueryResult = Apollo.QueryResult<ListPodQuery, ListPodQueryVariables>;
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
export function useListReleasesQuery(baseOptions?: Apollo.QueryHookOptions<ListReleasesQuery, ListReleasesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListReleasesQuery, ListReleasesQueryVariables>(ListReleasesDocument, options);
      }
export function useListReleasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListReleasesQuery, ListReleasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListReleasesQuery, ListReleasesQueryVariables>(ListReleasesDocument, options);
        }
export type ListReleasesQueryHookResult = ReturnType<typeof useListReleasesQuery>;
export type ListReleasesLazyQueryHookResult = ReturnType<typeof useListReleasesLazyQuery>;
export type ListReleasesQueryResult = Apollo.QueryResult<ListReleasesQuery, ListReleasesQueryVariables>;
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
export function useGlobalSearchQuery(baseOptions?: Apollo.QueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, options);
      }
export function useGlobalSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, options);
        }
export type GlobalSearchQueryHookResult = ReturnType<typeof useGlobalSearchQuery>;
export type GlobalSearchLazyQueryHookResult = ReturnType<typeof useGlobalSearchLazyQuery>;
export type GlobalSearchQueryResult = Apollo.QueryResult<GlobalSearchQuery, GlobalSearchQueryVariables>;