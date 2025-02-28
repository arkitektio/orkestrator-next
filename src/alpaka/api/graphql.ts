import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@/lib/alpaka/funcs';
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
};

/** Agent(id, room, name, app, user) */
export type Agent = {
  __typename?: 'Agent';
  id: Scalars['ID']['output'];
  room: Room;
};

export type CreateRoomInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteRoomInput = {
  id: Scalars['ID']['input'];
};

/** Message represent the message of an agent on a room */
export type Message = {
  __typename?: 'Message';
  /** The user that created this comment */
  agent: Agent;
  attachedStructures: Array<Structure>;
  /** The time this comment got created */
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** A clear text representation of the rich comment */
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
};


/** Message represent the message of an agent on a room */
export type MessageAttachedStructuresArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Message represent the message of an agent on a room */
export type MessageFilter = {
  AND?: InputMaybe<MessageFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<MessageFilter>;
  OR?: InputMaybe<MessageFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createRoom: Room;
  deleteRoom: Scalars['ID']['output'];
  send: Message;
};


export type MutationCreateRoomArgs = {
  input: CreateRoomInput;
};


export type MutationDeleteRoomArgs = {
  input: DeleteRoomInput;
};


export type MutationSendArgs = {
  input: SendMessageInput;
};

export type OffsetPaginationInput = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  room: Room;
  rooms: Array<Room>;
};


export type QueryRoomArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoomsArgs = {
  filters?: InputMaybe<RoomFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Room(id, title, description, creator) */
export type Room = {
  __typename?: 'Room';
  agents: Array<Agent>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  messages: Array<Message>;
  /** The Title of the Room */
  title: Scalars['String']['output'];
};


/** Room(id, title, description, creator) */
export type RoomAgentsArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** Room(id, title, description, creator) */
export type RoomMessagesArgs = {
  filters?: InputMaybe<MessageFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type RoomEvent = {
  __typename?: 'RoomEvent';
  join?: Maybe<Agent>;
  leave?: Maybe<Agent>;
  message?: Maybe<Message>;
};

/** Room(id, title, description, creator) */
export type RoomFilter = {
  AND?: InputMaybe<RoomFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<RoomFilter>;
  OR?: InputMaybe<RoomFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SendMessageInput = {
  agentId: Scalars['String']['input'];
  attachStructures?: InputMaybe<Array<StructureInput>>;
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  room: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};

/** Structure(id, identifier, object) */
export type Structure = {
  __typename?: 'Structure';
  id: Scalars['ID']['output'];
  /** The identifier of the object. Consult the documentation for the format */
  identifier: Scalars['String']['output'];
  /** The object id of the object, on its associated service */
  object: Scalars['ID']['output'];
};

export type StructureInput = {
  identifier: Scalars['String']['input'];
  object: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  room: RoomEvent;
};


export type SubscriptionRoomArgs = {
  agentId: Scalars['ID']['input'];
  filterOwn?: Scalars['Boolean']['input'];
  room: Scalars['ID']['input'];
};

export type MessageFragment = { __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> };

export type ListMessageFragment = { __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> };

export type DetailRoomFragment = { __typename?: 'Room', id: string, title: string, description: string, messages: Array<{ __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> }> };

export type ListRoomFragment = { __typename?: 'Room', id: string, title: string, description: string };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', send: { __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> } };

export type CreateRoomMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'Room', id: string, title: string } };

export type DeleteRoomMutationVariables = Exact<{
  input: DeleteRoomInput;
}>;


export type DeleteRoomMutation = { __typename?: 'Mutation', deleteRoom: string };

export type DetailRoomQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailRoomQuery = { __typename?: 'Query', room: { __typename?: 'Room', id: string, title: string, description: string, messages: Array<{ __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> }> } };

export type RoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type RoomsQuery = { __typename?: 'Query', rooms: Array<{ __typename?: 'Room', id: string, title: string, description: string, messages: Array<{ __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> }> }> };

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  noRooms: Scalars['Boolean']['input'];
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', rooms?: Array<{ __typename?: 'Room', id: string, title: string, description: string }> };

export type WatchMessagesSubscriptionVariables = Exact<{
  room: Scalars['ID']['input'];
  agentId: Scalars['ID']['input'];
}>;


export type WatchMessagesSubscription = { __typename?: 'Subscription', room: { __typename?: 'RoomEvent', message?: { __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> } | null } };

export const MessageFragmentDoc = gql`
    fragment Message on Message {
  id
  text
  agent {
    id
  }
  attachedStructures {
    identifier
    object
  }
  createdAt
}
    `;
export const ListMessageFragmentDoc = gql`
    fragment ListMessage on Message {
  id
  text
  agent {
    id
  }
  attachedStructures {
    identifier
    object
  }
  createdAt
}
    `;
export const DetailRoomFragmentDoc = gql`
    fragment DetailRoom on Room {
  id
  title
  description
  messages {
    ...ListMessage
  }
}
    ${ListMessageFragmentDoc}`;
export const ListRoomFragmentDoc = gql`
    fragment ListRoom on Room {
  id
  title
  description
}
    `;
export const SendMessageDocument = gql`
    mutation SendMessage($input: SendMessageInput!) {
  send(input: $input) {
    ...Message
  }
}
    ${MessageFragmentDoc}`;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const CreateRoomDocument = gql`
    mutation CreateRoom {
  createRoom(input: {title: "Room 1"}) {
    id
    title
  }
}
    `;
export type CreateRoomMutationFn = Apollo.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateRoomMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRoomMutation, CreateRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, options);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = Apollo.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>;
export const DeleteRoomDocument = gql`
    mutation DeleteRoom($input: DeleteRoomInput!) {
  deleteRoom(input: $input)
}
    `;
export type DeleteRoomMutationFn = Apollo.MutationFunction<DeleteRoomMutation, DeleteRoomMutationVariables>;

/**
 * __useDeleteRoomMutation__
 *
 * To run a mutation, you first call `useDeleteRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRoomMutation, { data, loading, error }] = useDeleteRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteRoomMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRoomMutation, DeleteRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteRoomMutation, DeleteRoomMutationVariables>(DeleteRoomDocument, options);
      }
export type DeleteRoomMutationHookResult = ReturnType<typeof useDeleteRoomMutation>;
export type DeleteRoomMutationResult = Apollo.MutationResult<DeleteRoomMutation>;
export type DeleteRoomMutationOptions = Apollo.BaseMutationOptions<DeleteRoomMutation, DeleteRoomMutationVariables>;
export const DetailRoomDocument = gql`
    query DetailRoom($id: ID!) {
  room(id: $id) {
    ...DetailRoom
  }
}
    ${DetailRoomFragmentDoc}`;

/**
 * __useDetailRoomQuery__
 *
 * To run a query within a React component, call `useDetailRoomQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailRoomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailRoomQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailRoomQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DetailRoomQuery, DetailRoomQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DetailRoomQuery, DetailRoomQueryVariables>(DetailRoomDocument, options);
      }
export function useDetailRoomLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DetailRoomQuery, DetailRoomQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DetailRoomQuery, DetailRoomQueryVariables>(DetailRoomDocument, options);
        }
export type DetailRoomQueryHookResult = ReturnType<typeof useDetailRoomQuery>;
export type DetailRoomLazyQueryHookResult = ReturnType<typeof useDetailRoomLazyQuery>;
export type DetailRoomQueryResult = Apollo.QueryResult<DetailRoomQuery, DetailRoomQueryVariables>;
export const RoomsDocument = gql`
    query Rooms {
  rooms(pagination: {limit: 10}) {
    id
    title
    description
    messages(pagination: {limit: 4}) {
      ...ListMessage
    }
  }
}
    ${ListMessageFragmentDoc}`;

/**
 * __useRoomsQuery__
 *
 * To run a query within a React component, call `useRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRoomsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<RoomsQuery, RoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<RoomsQuery, RoomsQueryVariables>(RoomsDocument, options);
      }
export function useRoomsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RoomsQuery, RoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<RoomsQuery, RoomsQueryVariables>(RoomsDocument, options);
        }
export type RoomsQueryHookResult = ReturnType<typeof useRoomsQuery>;
export type RoomsLazyQueryHookResult = ReturnType<typeof useRoomsLazyQuery>;
export type RoomsQueryResult = Apollo.QueryResult<RoomsQuery, RoomsQueryVariables>;
export const GlobalSearchDocument = gql`
    query GlobalSearch($search: String, $noRooms: Boolean!, $pagination: OffsetPaginationInput) {
  rooms: rooms(filters: {search: $search}, pagination: $pagination) @skip(if: $noRooms) {
    ...ListRoom
  }
}
    ${ListRoomFragmentDoc}`;

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
 *      noRooms: // value for 'noRooms'
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
export const WatchMessagesDocument = gql`
    subscription WatchMessages($room: ID!, $agentId: ID!) {
  room(room: $room, agentId: $agentId, filterOwn: false) {
    message {
      ...ListMessage
    }
  }
}
    ${ListMessageFragmentDoc}`;

/**
 * __useWatchMessagesSubscription__
 *
 * To run a query within a React component, call `useWatchMessagesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWatchMessagesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWatchMessagesSubscription({
 *   variables: {
 *      room: // value for 'room'
 *      agentId: // value for 'agentId'
 *   },
 * });
 */
export function useWatchMessagesSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<WatchMessagesSubscription, WatchMessagesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<WatchMessagesSubscription, WatchMessagesSubscriptionVariables>(WatchMessagesDocument, options);
      }
export type WatchMessagesSubscriptionHookResult = ReturnType<typeof useWatchMessagesSubscription>;
export type WatchMessagesSubscriptionResult = Apollo.SubscriptionResult<WatchMessagesSubscription>;