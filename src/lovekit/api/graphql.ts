import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@/lib/lok/hooks';
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

export type Agent = {
  __typename?: 'Agent';
  id: Scalars['ID']['output'];
};

export type CreateStreamInput = {
  instanceId?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a stream */
  createVideoStream: Stream;
};


export type MutationCreateVideoStreamArgs = {
  input: CreateStreamInput;
};

export type OffsetPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  /** Get a stream by ID */
  stream: Stream;
  /** Get a stream */
  streams: Array<Stream>;
};


export type QueryStreamArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStreamsArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type Stream = {
  __typename?: 'Stream';
  agent: Agent;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type StreamEvent = {
  __typename?: 'StreamEvent';
  create?: Maybe<Stream>;
  delete?: Maybe<Scalars['ID']['output']>;
  moved?: Maybe<Stream>;
  update?: Maybe<Stream>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Subscribe to stream events */
  streams: StreamEvent;
};


export type SubscriptionStreamsArgs = {
  dataset?: InputMaybe<Scalars['ID']['input']>;
};

export type StreamFragment = { __typename?: 'Stream', id: string, title: string };

export type EnsuredStreamFragment = { __typename?: 'Stream', id: string, title: string, token: string, agent: { __typename?: 'Agent', id: string } };

export type DetailStreamFragment = { __typename?: 'Stream', id: string, title: string, token: string, agent: { __typename?: 'Agent', id: string } };

export type CreateVideoStreamMutationVariables = Exact<{
  input: CreateStreamInput;
}>;


export type CreateVideoStreamMutation = { __typename?: 'Mutation', createVideoStream: { __typename?: 'Stream', id: string, title: string, token: string, agent: { __typename?: 'Agent', id: string } } };

export type GetStreamQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStreamQuery = { __typename?: 'Query', stream: { __typename?: 'Stream', id: string, title: string, token: string, agent: { __typename?: 'Agent', id: string } } };

export const StreamFragmentDoc = gql`
    fragment Stream on Stream {
  id
  title
}
    `;
export const EnsuredStreamFragmentDoc = gql`
    fragment EnsuredStream on Stream {
  id
  title
  token
  agent {
    id
  }
}
    `;
export const DetailStreamFragmentDoc = gql`
    fragment DetailStream on Stream {
  id
  title
  token
  agent {
    id
  }
}
    `;
export const CreateVideoStreamDocument = gql`
    mutation CreateVideoStream($input: CreateStreamInput!) {
  createVideoStream(input: $input) {
    ...EnsuredStream
  }
}
    ${EnsuredStreamFragmentDoc}`;
export type CreateVideoStreamMutationFn = Apollo.MutationFunction<CreateVideoStreamMutation, CreateVideoStreamMutationVariables>;

/**
 * __useCreateVideoStreamMutation__
 *
 * To run a mutation, you first call `useCreateVideoStreamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVideoStreamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVideoStreamMutation, { data, loading, error }] = useCreateVideoStreamMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateVideoStreamMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateVideoStreamMutation, CreateVideoStreamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateVideoStreamMutation, CreateVideoStreamMutationVariables>(CreateVideoStreamDocument, options);
      }
export type CreateVideoStreamMutationHookResult = ReturnType<typeof useCreateVideoStreamMutation>;
export type CreateVideoStreamMutationResult = Apollo.MutationResult<CreateVideoStreamMutation>;
export type CreateVideoStreamMutationOptions = Apollo.BaseMutationOptions<CreateVideoStreamMutation, CreateVideoStreamMutationVariables>;
export const GetStreamDocument = gql`
    query GetStream($id: ID!) {
  stream(id: $id) {
    ...DetailStream
  }
}
    ${DetailStreamFragmentDoc}`;

/**
 * __useGetStreamQuery__
 *
 * To run a query within a React component, call `useGetStreamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStreamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStreamQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStreamQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetStreamQuery, GetStreamQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetStreamQuery, GetStreamQueryVariables>(GetStreamDocument, options);
      }
export function useGetStreamLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetStreamQuery, GetStreamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetStreamQuery, GetStreamQueryVariables>(GetStreamDocument, options);
        }
export type GetStreamQueryHookResult = ReturnType<typeof useGetStreamQuery>;
export type GetStreamLazyQueryHookResult = ReturnType<typeof useGetStreamLazyQuery>;
export type GetStreamQueryResult = Apollo.QueryResult<GetStreamQuery, GetStreamQueryVariables>;