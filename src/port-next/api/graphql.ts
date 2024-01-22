import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AnyDefault: { input: any; output: any };
  DateTime: { input: any; output: any };
  Identifier: { input: any; output: any };
  NodeHash: { input: any; output: any };
};

/** A user of the bridge server. Maps to an authentikate user */
export type App = {
  __typename?: "App";
  id: Scalars["ID"]["output"];
  identifier: Scalars["String"]["output"];
};

export type AssignWidget = {
  kind: AssignWidgetKind;
};

export enum AssignWidgetKind {
  Choice = "CHOICE",
  Custom = "CUSTOM",
  Search = "SEARCH",
  Slider = "SLIDER",
  String = "STRING",
}

/**  A selector is a way to select a release */
export type CpuSelector = Selector & {
  __typename?: "CPUSelector";
  frequency?: Maybe<Scalars["Int"]["output"]>;
  min: Scalars["Int"]["output"];
  required: Scalars["Boolean"]["output"];
  type: Scalars["String"]["output"];
};

export type ChildPort = {
  __typename?: "ChildPort";
  assignWidget?: Maybe<AssignWidget>;
  child?: Maybe<ChildPort>;
  default?: Maybe<Scalars["AnyDefault"]["output"]>;
  identifier?: Maybe<Scalars["Identifier"]["output"]>;
  kind: PortKind;
  label?: Maybe<Scalars["String"]["output"]>;
  nullable: Scalars["Boolean"]["output"];
  returnWidget?: Maybe<ReturnWidget>;
  scope: PortScope;
  variants?: Maybe<Array<ChildPort>>;
};

export type Choice = {
  __typename?: "Choice";
  description?: Maybe<Scalars["String"]["output"]>;
  label: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type ChoiceAssignWidget = AssignWidget & {
  __typename?: "ChoiceAssignWidget";
  choices?: Maybe<Array<Choice>>;
  kind: AssignWidgetKind;
};

export type ChoiceReturnWidget = ReturnWidget & {
  __typename?: "ChoiceReturnWidget";
  choices?: Maybe<Array<Choice>>;
  kind: ReturnWidgetKind;
};

/** A user of the bridge server. Maps to an authentikate user */
export type Collection = {
  __typename?: "Collection";
  definedAt: Scalars["DateTime"]["output"];
  /** A description for the Collection */
  description: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  /** The name of this Collection */
  name: Scalars["String"]["output"];
};

/** Create a new Github repository input */
export type CreateGithupRepoInput = {
  autoScan?: InputMaybe<Scalars["Boolean"]["input"]>;
  branch: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  repo: Scalars["String"]["input"];
  user: Scalars["String"]["input"];
};

/** Create a new Github repository input */
export type CreateSetupInput = {
  autoPull?: InputMaybe<Scalars["Boolean"]["input"]>;
  command?: InputMaybe<Scalars["String"]["input"]>;
  faktsToken?: InputMaybe<Scalars["String"]["input"]>;
  faktsUrl?: InputMaybe<Scalars["String"]["input"]>;
  flavour?: InputMaybe<Scalars["ID"]["input"]>;
  release: Scalars["ID"]["input"];
};

/**  A selector is a way to select a release */
export type CudaSelector = Selector & {
  __typename?: "CudaSelector";
  /** The minimum compute capability */
  computeCapability: Scalars["String"]["output"];
  required: Scalars["Boolean"]["output"];
  type: Scalars["String"]["output"];
};

export type CustomAssignWidget = AssignWidget & {
  __typename?: "CustomAssignWidget";
  hook: Scalars["String"]["output"];
  kind: AssignWidgetKind;
  ward: Scalars["String"]["output"];
};

export type CustomEffect = Effect & {
  __typename?: "CustomEffect";
  dependencies: Array<EffectDependency>;
  hook: Scalars["String"]["output"];
  kind: Scalars["String"]["output"];
  ward: Scalars["String"]["output"];
};

export type CustomReturnWidget = ReturnWidget & {
  __typename?: "CustomReturnWidget";
  hook: Scalars["String"]["output"];
  kind: ReturnWidgetKind;
  ward: Scalars["String"]["output"];
};

/**
 * Nodes are abstraction of RPC Tasks. They provide a common API to deal with creating tasks.
 *
 * See online Documentation
 */
export type Definition = {
  __typename?: "Definition";
  /** Inputs for this Node */
  args: Array<Port>;
  /** The collections this Node belongs to */
  collections: Array<Collection>;
  definedAt: Scalars["DateTime"]["output"];
  /** A description for the Node */
  description?: Maybe<Scalars["String"]["output"]>;
  /** The flavours this Definition belongs to */
  flavours: Array<Flavour>;
  /** The hash of the Node (completely unique) */
  hash: Scalars["NodeHash"]["output"];
  id: Scalars["ID"]["output"];
  /** The users that have pinned the position */
  isTestFor: Array<Definition>;
  /** The kind of this Node. e.g. is it a function or a generator? */
  kind: NodeKind;
  /** The cleartext name of this Node */
  name: Scalars["String"]["output"];
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
export type DefinitionIsTestForArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/**
 * Nodes are abstraction of RPC Tasks. They provide a common API to deal with creating tasks.
 *
 * See online Documentation
 */
export type DefinitionTestsArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Create a new Github repository input */
export type DeploySetupInput = {
  setup: Scalars["ID"]["input"];
};

export type Effect = {
  dependencies: Array<EffectDependency>;
  kind: Scalars["String"]["output"];
};

export type EffectDependency = {
  __typename?: "EffectDependency";
  condition: LogicalCondition;
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

/** A user of the bridge server. Maps to an authentikate user */
export type Flavour = {
  __typename?: "Flavour";
  description: Scalars["String"]["output"];
  entrypoint: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  image: Scalars["String"]["output"];
  latestUpdate: FlavourUpdate;
  logo?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  originalLogo?: Maybe<Scalars["String"]["output"]>;
  pulled: Scalars["Boolean"]["output"];
  release: Release;
  selectors: Array<Selector>;
  setups: Array<Setup>;
};

/**  A selector is a way to select a release */
export type FlavourUpdate = {
  __typename?: "FlavourUpdate";
  id: Scalars["ID"]["output"];
  progress: Scalars["Float"]["output"];
  status: Scalars["String"]["output"];
};

/** A user of the bridge server. Maps to an authentikate user */
export type GithubRepo = {
  __typename?: "GithubRepo";
  branch: Scalars["String"]["output"];
  flavours: Array<Flavour>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
  user: Scalars["String"]["output"];
};

export enum LogicalCondition {
  In = "IN",
  Is = "IS",
  IsNot = "IS_NOT",
}

export type MessageEffect = Effect & {
  __typename?: "MessageEffect";
  dependencies: Array<EffectDependency>;
  kind: Scalars["String"]["output"];
  message: Scalars["String"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  /** Create a new Github repository on a bridge server */
  createGithubRepo: GithubRepo;
  /** Create a new dask cluster on a bridge server */
  createSetup: Setup;
  /** Create a new dask cluster on a bridge server */
  deploySetup: Pod;
  /** Create a new dask cluster on a bridge server */
  pullFlavour: Flavour;
  /** Create a new dask cluster on a bridge server */
  rescanRepos: Array<GithubRepo>;
  /** Create a new dask cluster on a bridge server */
  scanRepo: GithubRepo;
};

export type MutationCreateGithubRepoArgs = {
  input: CreateGithupRepoInput;
};

export type MutationCreateSetupArgs = {
  input: CreateSetupInput;
};

export type MutationDeploySetupArgs = {
  input: DeploySetupInput;
};

export type MutationPullFlavourArgs = {
  input: PullFlavourInput;
};

export type MutationScanRepoArgs = {
  input: ScanRepoInput;
};

export enum NodeKind {
  Function = "FUNCTION",
  Generator = "GENERATOR",
}

export enum NodeScope {
  BridgeGlobalToLocal = "BRIDGE_GLOBAL_TO_LOCAL",
  BridgeLocalToGlobal = "BRIDGE_LOCAL_TO_GLOBAL",
  Global = "GLOBAL",
  Local = "LOCAL",
}

export type OffsetPaginationInput = {
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
};

/** A user of the bridge server. Maps to an authentikate user */
export type Pod = {
  __typename?: "Pod";
  backend: Scalars["String"]["output"];
  flavour: Flavour;
  id: Scalars["ID"]["output"];
  /** The Lifecycle of the pod */
  logs: Scalars["String"]["output"];
  podId: Scalars["String"]["output"];
  setup: Setup;
  /** The Lifecycle of the pod */
  status: Scalars["String"]["output"];
};

export type Port = {
  __typename?: "Port";
  assignWidget?: Maybe<AssignWidget>;
  child?: Maybe<ChildPort>;
  default?: Maybe<Scalars["AnyDefault"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  effects?: Maybe<Array<Effect>>;
  groups?: Maybe<Array<Scalars["String"]["output"]>>;
  identifier?: Maybe<Scalars["Identifier"]["output"]>;
  key: Scalars["String"]["output"];
  kind: PortKind;
  label?: Maybe<Scalars["String"]["output"]>;
  nullable: Scalars["Boolean"]["output"];
  returnWidget?: Maybe<ReturnWidget>;
  scope: PortScope;
  variants?: Maybe<Array<ChildPort>>;
};

export enum PortKind {
  Bool = "BOOL",
  Date = "DATE",
  Dict = "DICT",
  Float = "FLOAT",
  Int = "INT",
  List = "LIST",
  String = "STRING",
  Structure = "STRUCTURE",
  Union = "UNION",
}

export enum PortScope {
  Global = "GLOBAL",
  Local = "LOCAL",
}

/** A user of the bridge server. Maps to an authentikate user */
export type Protocol = {
  __typename?: "Protocol";
  /** A description for the Protocol */
  description: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  /** The name of this Protocol */
  name: Scalars["String"]["output"];
};

/** Create a new Github repository input */
export type PullFlavourInput = {
  id: Scalars["ID"]["input"];
};

export type Query = {
  __typename?: "Query";
  definitions: Array<Definition>;
  flavours: Array<Flavour>;
  /** Return all dask clusters */
  githubRepo: GithubRepo;
  /** Return the currently logged in user */
  me: User;
  pods: Array<Pod>;
  releases: Array<Release>;
};

export type QueryDefinitionsArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type QueryGithubRepoArgs = {
  id: Scalars["ID"]["input"];
};

/** A user of the bridge server. Maps to an authentikate user */
export type Release = {
  __typename?: "Release";
  app: App;
  /** Is this release deployed */
  colour: Scalars["String"]["output"];
  /** Is this release deployed */
  description: Scalars["String"]["output"];
  entrypoint: Scalars["String"]["output"];
  flavours: Array<Flavour>;
  id: Scalars["ID"]["output"];
  /** Is this release deployed */
  installed: Scalars["Boolean"]["output"];
  logo?: Maybe<Scalars["String"]["output"]>;
  /** The original logo url */
  originalLogo?: Maybe<Scalars["String"]["output"]>;
  scopes: Array<Scalars["String"]["output"]>;
  /** Is this release deployed */
  setups: Array<Setup>;
  version: Scalars["String"]["output"];
};

export type ReturnWidget = {
  kind: ReturnWidgetKind;
};

export enum ReturnWidgetKind {
  Choice = "CHOICE",
  Custom = "CUSTOM",
}

/** Create a dask cluster input */
export type ScanRepoInput = {
  id: Scalars["String"]["input"];
};

export type SearchAssignWidget = AssignWidget & {
  __typename?: "SearchAssignWidget";
  kind: AssignWidgetKind;
  query: Scalars["String"]["output"];
  ward: Scalars["String"]["output"];
};

/**  A selector is a way to select a release */
export type Selector = {
  required: Scalars["Boolean"]["output"];
  type: Scalars["String"]["output"];
};

/** A user of the bridge server. Maps to an authentikate user */
export type Setup = {
  __typename?: "Setup";
  apiToken: Scalars["String"]["output"];
  flavour: Flavour;
  id: Scalars["ID"]["output"];
  installer: User;
};

export type SliderAssignWidget = AssignWidget & {
  __typename?: "SliderAssignWidget";
  kind: AssignWidgetKind;
  max?: Maybe<Scalars["Int"]["output"]>;
  min?: Maybe<Scalars["Int"]["output"]>;
};

export type StringAssignWidget = AssignWidget & {
  __typename?: "StringAssignWidget";
  asParagraph: Scalars["Boolean"]["output"];
  kind: AssignWidgetKind;
  placeholder: Scalars["String"]["output"];
};

export type Subscription = {
  __typename?: "Subscription";
  /** Create a new dask cluster on a bridge server */
  flavour: FlavourUpdate;
  /** Create a new dask cluster on a bridge server */
  flavours: FlavourUpdate;
};

export type SubscriptionFlavourArgs = {
  flavourId: Scalars["ID"]["input"];
};

/** A user of the bridge server. Maps to an authentikate user */
export type User = {
  __typename?: "User";
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  password: Scalars["String"]["output"];
  sub: Scalars["String"]["output"];
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars["String"]["output"];
};

export type DefinitionFragment = {
  __typename?: "Definition";
  id: string;
  name: string;
  hash: any;
  description?: string | null;
  args: Array<{ __typename?: "Port"; kind: PortKind }>;
};

export type ListDefinitionFragment = {
  __typename?: "Definition";
  id: string;
  name: string;
  hash: any;
  description?: string | null;
};

export type ListFlavourFragment = {
  __typename?: "Flavour";
  id: string;
  name: string;
  pulled: boolean;
  latestUpdate: {
    __typename?: "FlavourUpdate";
    id: string;
    status: string;
    progress: number;
  };
  setups: Array<{ __typename?: "Setup"; id: string }>;
};

export type ListPodFragment = { __typename?: "Pod"; id: string; podId: string };

export type PodFragment = { __typename?: "Pod"; id: string; podId: string };

export type ReleaseFragment = {
  __typename?: "Release";
  id: string;
  version: string;
  scopes: Array<string>;
  colour: string;
  description: string;
  app: { __typename?: "App"; identifier: string };
  setups: Array<{
    __typename?: "Setup";
    id: string;
    flavour: {
      __typename?: "Flavour";
      id: string;
      name: string;
      pulled: boolean;
      latestUpdate: {
        __typename?: "FlavourUpdate";
        id: string;
        status: string;
        progress: number;
      };
      setups: Array<{ __typename?: "Setup"; id: string }>;
    };
  }>;
};

export type ListReleaseFragment = {
  __typename?: "Release";
  id: string;
  version: string;
  installed: boolean;
  scopes: Array<string>;
  colour: string;
  description: string;
  app: { __typename?: "App"; identifier: string };
  flavours: Array<{
    __typename?: "Flavour";
    id: string;
    name: string;
    pulled: boolean;
    latestUpdate: {
      __typename?: "FlavourUpdate";
      id: string;
      status: string;
      progress: number;
    };
    setups: Array<{ __typename?: "Setup"; id: string }>;
  }>;
};

export type FlavourUpdateFragment = {
  __typename?: "FlavourUpdate";
  id: string;
  status: string;
  progress: number;
};

export type PullFlavourMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type PullFlavourMutation = {
  __typename?: "Mutation";
  pullFlavour: { __typename?: "Flavour"; id: string };
};

export type CreateSetupMutationVariables = Exact<{
  release: Scalars["ID"]["input"];
  faktsToken: Scalars["String"]["input"];
}>;

export type CreateSetupMutation = {
  __typename?: "Mutation";
  createSetup: { __typename?: "Setup"; id: string };
};

export type CreateGithubRepoMutationVariables = Exact<{
  user: Scalars["String"]["input"];
  repo: Scalars["String"]["input"];
  branch: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
}>;

export type CreateGithubRepoMutation = {
  __typename?: "Mutation";
  createGithubRepo: { __typename?: "GithubRepo"; id: string };
};

export type RescanReposMutationVariables = Exact<{ [key: string]: never }>;

export type RescanReposMutation = {
  __typename?: "Mutation";
  rescanRepos: Array<{ __typename?: "GithubRepo"; id: string }>;
};

export type ListDefinitionsQueryVariables = Exact<{ [key: string]: never }>;

export type ListDefinitionsQuery = {
  __typename?: "Query";
  definitions: Array<{
    __typename?: "Definition";
    id: string;
    name: string;
    hash: any;
    description?: string | null;
  }>;
};

export type ListPodQueryVariables = Exact<{ [key: string]: never }>;

export type ListPodQuery = {
  __typename?: "Query";
  pods: Array<{ __typename?: "Pod"; id: string; podId: string }>;
};

export type ListReleasesQueryVariables = Exact<{ [key: string]: never }>;

export type ListReleasesQuery = {
  __typename?: "Query";
  releases: Array<{
    __typename?: "Release";
    id: string;
    version: string;
    installed: boolean;
    scopes: Array<string>;
    colour: string;
    description: string;
    app: { __typename?: "App"; identifier: string };
    flavours: Array<{
      __typename?: "Flavour";
      id: string;
      name: string;
      pulled: boolean;
      latestUpdate: {
        __typename?: "FlavourUpdate";
        id: string;
        status: string;
        progress: number;
      };
      setups: Array<{ __typename?: "Setup"; id: string }>;
    }>;
  }>;
};

export type FlavoursUpdatesSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type FlavoursUpdatesSubscription = {
  __typename?: "Subscription";
  flavours: {
    __typename?: "FlavourUpdate";
    id: string;
    status: string;
    progress: number;
  };
};

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
export const FlavourUpdateFragmentDoc = gql`
  fragment FlavourUpdate on FlavourUpdate {
    id
    status
    progress
  }
`;
export const ListFlavourFragmentDoc = gql`
  fragment ListFlavour on Flavour {
    id
    latestUpdate {
      ...FlavourUpdate
    }
    name
    setups {
      id
    }
    pulled
  }
  ${FlavourUpdateFragmentDoc}
`;
export const ReleaseFragmentDoc = gql`
  fragment Release on Release {
    id
    version
    app {
      identifier
    }
    scopes
    setups {
      id
      flavour {
        ...ListFlavour
      }
    }
    colour
    description
  }
  ${ListFlavourFragmentDoc}
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
  ${ListFlavourFragmentDoc}
`;
export const PullFlavourDocument = gql`
  mutation PullFlavour($id: ID!) {
    pullFlavour(input: { id: $id }) {
      id
    }
  }
`;
export type PullFlavourMutationFn = Apollo.MutationFunction<
  PullFlavourMutation,
  PullFlavourMutationVariables
>;

/**
 * __usePullFlavourMutation__
 *
 * To run a mutation, you first call `usePullFlavourMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePullFlavourMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pullFlavourMutation, { data, loading, error }] = usePullFlavourMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePullFlavourMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PullFlavourMutation,
    PullFlavourMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PullFlavourMutation, PullFlavourMutationVariables>(
    PullFlavourDocument,
    options,
  );
}
export type PullFlavourMutationHookResult = ReturnType<
  typeof usePullFlavourMutation
>;
export type PullFlavourMutationResult =
  Apollo.MutationResult<PullFlavourMutation>;
export type PullFlavourMutationOptions = Apollo.BaseMutationOptions<
  PullFlavourMutation,
  PullFlavourMutationVariables
>;
export const CreateSetupDocument = gql`
  mutation CreateSetup($release: ID!, $faktsToken: String!) {
    createSetup(input: { release: $release, faktsToken: $faktsToken }) {
      id
    }
  }
`;
export type CreateSetupMutationFn = Apollo.MutationFunction<
  CreateSetupMutation,
  CreateSetupMutationVariables
>;

/**
 * __useCreateSetupMutation__
 *
 * To run a mutation, you first call `useCreateSetupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSetupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSetupMutation, { data, loading, error }] = useCreateSetupMutation({
 *   variables: {
 *      release: // value for 'release'
 *      faktsToken: // value for 'faktsToken'
 *   },
 * });
 */
export function useCreateSetupMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateSetupMutation,
    CreateSetupMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateSetupMutation, CreateSetupMutationVariables>(
    CreateSetupDocument,
    options,
  );
}
export type CreateSetupMutationHookResult = ReturnType<
  typeof useCreateSetupMutation
>;
export type CreateSetupMutationResult =
  Apollo.MutationResult<CreateSetupMutation>;
export type CreateSetupMutationOptions = Apollo.BaseMutationOptions<
  CreateSetupMutation,
  CreateSetupMutationVariables
>;
export const CreateGithubRepoDocument = gql`
  mutation CreateGithubRepo(
    $user: String!
    $repo: String!
    $branch: String!
    $name: String!
  ) {
    createGithubRepo(
      input: { user: $user, repo: $repo, branch: $branch, name: $name }
    ) {
      id
    }
  }
`;
export type CreateGithubRepoMutationFn = Apollo.MutationFunction<
  CreateGithubRepoMutation,
  CreateGithubRepoMutationVariables
>;

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
export function useCreateGithubRepoMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateGithubRepoMutation,
    CreateGithubRepoMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateGithubRepoMutation,
    CreateGithubRepoMutationVariables
  >(CreateGithubRepoDocument, options);
}
export type CreateGithubRepoMutationHookResult = ReturnType<
  typeof useCreateGithubRepoMutation
>;
export type CreateGithubRepoMutationResult =
  Apollo.MutationResult<CreateGithubRepoMutation>;
export type CreateGithubRepoMutationOptions = Apollo.BaseMutationOptions<
  CreateGithubRepoMutation,
  CreateGithubRepoMutationVariables
>;
export const RescanReposDocument = gql`
  mutation RescanRepos {
    rescanRepos {
      id
    }
  }
`;
export type RescanReposMutationFn = Apollo.MutationFunction<
  RescanReposMutation,
  RescanReposMutationVariables
>;

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
export function useRescanReposMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RescanReposMutation,
    RescanReposMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RescanReposMutation, RescanReposMutationVariables>(
    RescanReposDocument,
    options,
  );
}
export type RescanReposMutationHookResult = ReturnType<
  typeof useRescanReposMutation
>;
export type RescanReposMutationResult =
  Apollo.MutationResult<RescanReposMutation>;
export type RescanReposMutationOptions = Apollo.BaseMutationOptions<
  RescanReposMutation,
  RescanReposMutationVariables
>;
export const ListDefinitionsDocument = gql`
  query ListDefinitions {
    definitions {
      ...ListDefinition
    }
  }
  ${ListDefinitionFragmentDoc}
`;

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
export function useListDefinitionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ListDefinitionsQuery,
    ListDefinitionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ListDefinitionsQuery, ListDefinitionsQueryVariables>(
    ListDefinitionsDocument,
    options,
  );
}
export function useListDefinitionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ListDefinitionsQuery,
    ListDefinitionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ListDefinitionsQuery,
    ListDefinitionsQueryVariables
  >(ListDefinitionsDocument, options);
}
export type ListDefinitionsQueryHookResult = ReturnType<
  typeof useListDefinitionsQuery
>;
export type ListDefinitionsLazyQueryHookResult = ReturnType<
  typeof useListDefinitionsLazyQuery
>;
export type ListDefinitionsQueryResult = Apollo.QueryResult<
  ListDefinitionsQuery,
  ListDefinitionsQueryVariables
>;
export const ListPodDocument = gql`
  query ListPod {
    pods {
      ...ListPod
    }
  }
  ${ListPodFragmentDoc}
`;

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
export function useListPodQuery(
  baseOptions?: Apollo.QueryHookOptions<ListPodQuery, ListPodQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ListPodQuery, ListPodQueryVariables>(
    ListPodDocument,
    options,
  );
}
export function useListPodLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ListPodQuery,
    ListPodQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ListPodQuery, ListPodQueryVariables>(
    ListPodDocument,
    options,
  );
}
export type ListPodQueryHookResult = ReturnType<typeof useListPodQuery>;
export type ListPodLazyQueryHookResult = ReturnType<typeof useListPodLazyQuery>;
export type ListPodQueryResult = Apollo.QueryResult<
  ListPodQuery,
  ListPodQueryVariables
>;
export const ListReleasesDocument = gql`
  query ListReleases {
    releases {
      ...ListRelease
    }
  }
  ${ListReleaseFragmentDoc}
`;

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
export function useListReleasesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ListReleasesQuery,
    ListReleasesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ListReleasesQuery, ListReleasesQueryVariables>(
    ListReleasesDocument,
    options,
  );
}
export function useListReleasesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ListReleasesQuery,
    ListReleasesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ListReleasesQuery, ListReleasesQueryVariables>(
    ListReleasesDocument,
    options,
  );
}
export type ListReleasesQueryHookResult = ReturnType<
  typeof useListReleasesQuery
>;
export type ListReleasesLazyQueryHookResult = ReturnType<
  typeof useListReleasesLazyQuery
>;
export type ListReleasesQueryResult = Apollo.QueryResult<
  ListReleasesQuery,
  ListReleasesQueryVariables
>;
export const FlavoursUpdatesDocument = gql`
  subscription FlavoursUpdates {
    flavours {
      ...FlavourUpdate
    }
  }
  ${FlavourUpdateFragmentDoc}
`;

/**
 * __useFlavoursUpdatesSubscription__
 *
 * To run a query within a React component, call `useFlavoursUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useFlavoursUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFlavoursUpdatesSubscription({
 *   variables: {
 *   },
 * });
 */
export function useFlavoursUpdatesSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    FlavoursUpdatesSubscription,
    FlavoursUpdatesSubscriptionVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    FlavoursUpdatesSubscription,
    FlavoursUpdatesSubscriptionVariables
  >(FlavoursUpdatesDocument, options);
}
export type FlavoursUpdatesSubscriptionHookResult = ReturnType<
  typeof useFlavoursUpdatesSubscription
>;
export type FlavoursUpdatesSubscriptionResult =
  Apollo.SubscriptionResult<FlavoursUpdatesSubscription>;
