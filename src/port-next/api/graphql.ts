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
};

/**  A selector is a way to select a release */
export type CpuSelector = Selector & {
  __typename?: 'CPUSelector';
  frequency?: Maybe<Scalars['Int']['output']>;
  min: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};

/** Create a new Github repository input */
export type CreateGithupRepoInput = {
  branch: Scalars['String']['input'];
  name: Scalars['String']['input'];
  repo: Scalars['String']['input'];
  user: Scalars['String']['input'];
};

/** Create a new Github repository input */
export type CreateSetupInput = {
  command?: InputMaybe<Scalars['String']['input']>;
  faktsToken?: InputMaybe<Scalars['String']['input']>;
  faktsUrl?: InputMaybe<Scalars['String']['input']>;
  release: Scalars['String']['input'];
};

/**  A selector is a way to select a release */
export type CudaSelector = Selector & {
  __typename?: 'CudaSelector';
  /** The minimum compute capability */
  computeCapability: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};

/** Create a new Github repository input */
export type DeploySetupInput = {
  setup: Scalars['String']['input'];
};

/** A user of the bridge server. Maps to an authentikate user */
export type Flavour = {
  __typename?: 'Flavour';
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

/**  A selector is a way to select a release */
export type FlavourUpdate = {
  __typename?: 'FlavourUpdate';
  progress: Scalars['Float']['output'];
  status: Scalars['String']['output'];
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

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new Github repository on a bridge server */
  createGithubRepo: GithubRepo;
  /** Create a new dask cluster on a bridge server */
  createSetup: Setup;
  /** Create a new dask cluster on a bridge server */
  deploySetup: Pod;
  /** Create a new dask cluster on a bridge server */
  pullFlavour: Flavour;
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

/** A user of the bridge server. Maps to an authentikate user */
export type Pod = {
  __typename?: 'Pod';
  backend: Scalars['String']['output'];
  flavour: Flavour;
  id: Scalars['ID']['output'];
  /** The Lifecycle of the pod */
  logs: Scalars['String']['output'];
  podId: Scalars['String']['output'];
  setup: Setup;
  /** The Lifecycle of the pod */
  status: Scalars['String']['output'];
};

/** Create a new Github repository input */
export type PullFlavourInput = {
  id: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  flavours: Array<Flavour>;
  /** Return all dask clusters */
  githubRepo: GithubRepo;
  /** Return the currently logged in user */
  me: User;
  pods: Array<Pod>;
};


export type QueryGithubRepoArgs = {
  id: Scalars['ID']['input'];
};

/** A user of the bridge server. Maps to an authentikate user */
export type Release = {
  __typename?: 'Release';
  entrypoint: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  /** The original logo url */
  originalLogo?: Maybe<Scalars['String']['output']>;
  scopes: Array<Scalars['String']['output']>;
  setups: Array<Setup>;
  version: Scalars['String']['output'];
};

/** Create a dask cluster input */
export type ScanRepoInput = {
  id: Scalars['String']['input'];
};

/**  A selector is a way to select a release */
export type Selector = {
  required: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};

/** A user of the bridge server. Maps to an authentikate user */
export type Setup = {
  __typename?: 'Setup';
  apiToken: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  installer: User;
  release: Release;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Create a new dask cluster on a bridge server */
  flavour: FlavourUpdate;
};


export type SubscriptionFlavourArgs = {
  flavourId: Scalars['ID']['input'];
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

export type ListPodFragment = { __typename?: 'Pod', id: string, podId: string };

export type PodFragment = { __typename?: 'Pod', id: string, podId: string };

export type ListPodQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPodQuery = { __typename?: 'Query', pods: Array<{ __typename?: 'Pod', id: string, podId: string }> };

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