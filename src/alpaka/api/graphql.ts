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
  JSON: { input: any; output: any; }
};

export type AddDocumentsToCollectionInput = {
  collection: Scalars['ID']['input'];
  documents: Array<DocumentInput>;
};

/** Agent(id, room, name, client, user) */
export type Agent = {
  __typename?: 'Agent';
  id: Scalars['ID']['output'];
  room: Room;
};

/** A chat message input */
export type ChatInput = {
  messages: Array<ChatMessageInput>;
  model: Scalars['ID']['input'];
  temperature?: InputMaybe<Scalars['Float']['input']>;
  tools?: InputMaybe<Array<ToolInput>>;
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  content?: Maybe<Scalars['String']['output']>;
  functionCall?: Maybe<FunctionCall>;
  name?: Maybe<Scalars['String']['output']>;
  role: Role;
  toolCallId?: Maybe<Scalars['String']['output']>;
  toolCalls?: Maybe<Array<ToolCall>>;
};

/** A chat message input */
export type ChatMessageInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  functionCall?: InputMaybe<FunctionCallInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  role: Role;
  toolCallId?: InputMaybe<Scalars['String']['input']>;
  toolCalls?: InputMaybe<Array<ToolCallInput>>;
};

export type ChatResponse = {
  __typename?: 'ChatResponse';
  choices: Array<Choice>;
  created: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  model: Scalars['String']['output'];
  object: Scalars['String']['output'];
  systemFingerprint?: Maybe<Scalars['String']['output']>;
  usage?: Maybe<Usage>;
};

export type Choice = {
  __typename?: 'Choice';
  finishReason?: Maybe<Scalars['String']['output']>;
  index: Scalars['Int']['output'];
  message: ChatMessage;
  reasoningContent?: Maybe<Scalars['String']['output']>;
  thinkingBlocks?: Maybe<Array<ThinkingBlock>>;
};

/** A collection of documents searchable by string */
export type ChromaCollection = {
  __typename?: 'ChromaCollection';
  count: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner: User;
};

/** Filter for ChromaCollection */
export type ChromaCollectionFilter = {
  AND?: InputMaybe<ChromaCollectionFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ChromaCollectionFilter>;
  OR?: InputMaybe<ChromaCollectionFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ChromaCollectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  embedder: Scalars['ID']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type CreateRoomInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteProviderInput = {
  id: Scalars['ID']['input'];
};

export type DeleteRoomInput = {
  id: Scalars['ID']['input'];
};

export type Document = {
  __typename?: 'Document';
  content: Scalars['String']['output'];
  distance?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** A function definition for a large language model */
  structure?: Maybe<Structure>;
};

/** A document to put into the vector database */
export type DocumentInput = {
  content: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  structure?: InputMaybe<StructureInput>;
};

/** The type of the thinking block */
export enum FeatureType {
  Chat = 'CHAT',
  Chatting = 'CHATTING',
  Embedding = 'EMBEDDING'
}

/** The type of the tool */
export type FunctionCall = {
  __typename?: 'FunctionCall';
  arguments: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/** A function call input */
export type FunctionCallInput = {
  arguments: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

/** A large language model function defintion */
export type FunctionDefinitionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parameters?: InputMaybe<Scalars['JSON']['input']>;
};

export enum Granularity {
  Day = 'DAY',
  Hour = 'HOUR',
  Month = 'MONTH',
  Quarter = 'QUARTER',
  Week = 'WEEK',
  Year = 'YEAR'
}

/** A LLM model to chage with */
export type LlmModel = {
  __typename?: 'LLMModel';
  /** The collections that can be embedded with this model */
  embedderFor: Array<ChromaCollection>;
  /** The features supported by the model */
  features: Array<FeatureType>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  /** The string to use for the LLM model */
  llmString: Scalars['String']['output'];
  modelId: Scalars['String']['output'];
  provider: Provider;
};


/** A LLM model to chage with */
export type LlmModelEmbedderForArgs = {
  filters?: InputMaybe<ChromaCollectionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Filter for LLMModel */
export type LlmModelFilter = {
  AND?: InputMaybe<LlmModelFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<LlmModelFilter>;
  OR?: InputMaybe<LlmModelFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Message represent the message of an agent on a room */
export type Message = {
  __typename?: 'Message';
  /** The user that created this comment */
  agent: Agent;
  /** The collections that can be embedded with this model */
  attachedStructures: Array<Structure>;
  /** The time this comment got created */
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** A clear text representation of the rich comment */
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
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
  addDocumentsToCollection: Array<Document>;
  chat: ChatResponse;
  createCollection: ChromaCollection;
  createProvider: Provider;
  createRoom: Room;
  deleteCollection: Scalars['ID']['output'];
  deleteProvider: Scalars['ID']['output'];
  deleteRoom: Scalars['ID']['output'];
  ensureCollection: ChromaCollection;
  pull: OllamaPullResult;
  send: Message;
};


export type MutationAddDocumentsToCollectionArgs = {
  input: AddDocumentsToCollectionInput;
};


export type MutationChatArgs = {
  input: ChatInput;
};


export type MutationCreateCollectionArgs = {
  input: ChromaCollectionInput;
};


export type MutationCreateProviderArgs = {
  input: ProviderInput;
};


export type MutationCreateRoomArgs = {
  input: CreateRoomInput;
};


export type MutationDeleteCollectionArgs = {
  input: AddDocumentsToCollectionInput;
};


export type MutationDeleteProviderArgs = {
  input: DeleteProviderInput;
};


export type MutationDeleteRoomArgs = {
  input: DeleteRoomInput;
};


export type MutationEnsureCollectionArgs = {
  input: ChromaCollectionInput;
};


export type MutationPullArgs = {
  input: PullInput;
};


export type MutationSendArgs = {
  input: SendMessageInput;
};

export type OffsetPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: Scalars['Int']['input'];
};

export type OllamaPullResult = {
  __typename?: 'OllamaPullResult';
  detail?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

/** An Organization model to represent an organization in the system */
export type Organization = {
  __typename?: 'Organization';
  id: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

/** A provider of LLMs */
export type Provider = {
  __typename?: 'Provider';
  additionalConfig: Scalars['JSON']['output'];
  apiBase: Scalars['String']['output'];
  apiKey: Scalars['String']['output'];
  id: Scalars['String']['output'];
  /** The kind of the provider */
  kind: ProviderKind;
  models: Array<LlmModel>;
  name: Scalars['String']['output'];
};


/** A provider of LLMs */
export type ProviderModelsArgs = {
  filters?: InputMaybe<LlmModelFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** Filter for Provider */
export type ProviderFilter = {
  AND?: InputMaybe<ProviderFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<ProviderFilter>;
  OR?: InputMaybe<ProviderFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** A large language model to change with */
export type ProviderInput = {
  additionalConfig?: InputMaybe<Scalars['JSON']['input']>;
  apiBase?: InputMaybe<Scalars['String']['input']>;
  apiKey?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  kind: ProviderKind;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** The kind of LLM provider */
export enum ProviderKind {
  Anthropic = 'ANTHROPIC',
  Anyscale = 'ANYSCALE',
  Aws = 'AWS',
  Azure = 'AZURE',
  Cohere = 'COHERE',
  Custom = 'CUSTOM',
  Deepinfra = 'DEEPINFRA',
  FireworksAi = 'FIREWORKS_AI',
  Google = 'GOOGLE',
  Groq = 'GROQ',
  Huggingface = 'HUGGINGFACE',
  Mistral = 'MISTRAL',
  Ollama = 'OLLAMA',
  Openai = 'OPENAI',
  Openrouter = 'OPENROUTER',
  Palm = 'PALM',
  Perplexity = 'PERPLEXITY',
  Replicate = 'REPLICATE',
  TogetherAi = 'TOGETHER_AI',
  Unknown = 'UNKNOWN',
  VertexAi = 'VERTEX_AI'
}

export type PullInput = {
  modelName: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  chromaCollection: ChromaCollection;
  chromaCollections: Array<ChromaCollection>;
  documents: Array<Document>;
  llmModel: LlmModel;
  llmModels: Array<LlmModel>;
  provider: Provider;
  providers: Array<Provider>;
  room: Room;
  roomStats: RoomStats;
  rooms: Array<Room>;
};


export type QueryChromaCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChromaCollectionsArgs = {
  filters?: InputMaybe<ChromaCollectionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryDocumentsArgs = {
  collection: Scalars['ID']['input'];
  nResults?: InputMaybe<Scalars['Int']['input']>;
  queryTexts?: InputMaybe<Array<Scalars['String']['input']>>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryLlmModelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLlmModelsArgs = {
  filters?: InputMaybe<LlmModelFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryProviderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProvidersArgs = {
  filters?: InputMaybe<ProviderFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryRoomArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoomStatsArgs = {
  filters?: InputMaybe<RoomFilter>;
};


export type QueryRoomsArgs = {
  filters?: InputMaybe<RoomFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** The type of the message sender */
export enum Role {
  Assistant = 'ASSISTANT',
  Function = 'FUNCTION',
  System = 'SYSTEM',
  Tool = 'TOOL',
  User = 'USER'
}

/** Room(id, title, description, creator, organization, created_at) */
export type Room = {
  __typename?: 'Room';
  agents: Array<Agent>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  messages: Array<Message>;
  /** The organization this room belongs to */
  organization: Organization;
  /** The Title of the Room */
  title: Scalars['String']['output'];
};


/** Room(id, title, description, creator, organization, created_at) */
export type RoomAgentsArgs = {
  pagination?: InputMaybe<OffsetPaginationInput>;
};


/** Room(id, title, description, creator, organization, created_at) */
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

/** Numeric/aggregatable fields of Room */
export enum RoomField {
  CreatedAt = 'CREATED_AT'
}

/** Room(id, title, description, creator, organization, created_at) */
export type RoomFilter = {
  AND?: InputMaybe<RoomFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<RoomFilter>;
  OR?: InputMaybe<RoomFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type RoomStats = {
  __typename?: 'RoomStats';
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


export type RoomStatsAvgArgs = {
  field: RoomField;
};


export type RoomStatsDistinctCountArgs = {
  field: RoomField;
};


export type RoomStatsMaxArgs = {
  field: RoomField;
};


export type RoomStatsMinArgs = {
  field: RoomField;
};


export type RoomStatsSeriesArgs = {
  by: Granularity;
  field: RoomField;
  timestampField: RoomTimestampField;
};


export type RoomStatsSumArgs = {
  field: RoomField;
};

/** Datetime fields of Room for bucketing */
export enum RoomTimestampField {
  CreatedAt = 'CREATED_AT'
}

export type SendMessageInput = {
  agentId: Scalars['String']['input'];
  attachStructures?: InputMaybe<Array<StructureInput>>;
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  room: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};

/** The type of the tool */
export type Structure = {
  __typename?: 'Structure';
  identifier: Scalars['String']['output'];
  object: Scalars['String']['output'];
};

/** A function definition for a large language model */
export type StructureInput = {
  identifier: Scalars['String']['input'];
  object: Scalars['String']['input'];
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

export type ThinkingBlock = {
  __typename?: 'ThinkingBlock';
  signature?: Maybe<Scalars['String']['output']>;
  thinking: Scalars['String']['output'];
  type: ThinkingBlockType;
};

/** The type of the thinking block */
export enum ThinkingBlockType {
  Thinking = 'THINKING'
}

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

/** A function definition for a large language model */
export type ToolCall = {
  __typename?: 'ToolCall';
  function: FunctionCall;
  id: Scalars['String']['output'];
  type: ToolType;
};

/** A tool call input */
export type ToolCallInput = {
  function: FunctionCallInput;
  id: Scalars['String']['input'];
  type: ToolType;
};

/** A large language model function call */
export type ToolInput = {
  function: FunctionDefinitionInput;
  type?: ToolType;
};

/** The type of the tool */
export enum ToolType {
  Function = 'FUNCTION'
}

export type Usage = {
  __typename?: 'Usage';
  completionTokenDetails?: Maybe<Scalars['JSON']['output']>;
  completionTokens: Scalars['Int']['output'];
  promptTokenDetails?: Maybe<Scalars['JSON']['output']>;
  promptTokens: Scalars['Int']['output'];
  totalTokens: Scalars['Int']['output'];
};

/** A reflection on the real User */
export type User = {
  __typename?: 'User';
  activeOrganization?: Maybe<Organization>;
  preferredUsername: Scalars['String']['output'];
  sub: Scalars['String']['output'];
};

export type ChromaCollectionFragment = { __typename?: 'ChromaCollection', id: string, name: string, description: string, createdAt: any };

export type ListChromaCollectionFragment = { __typename?: 'ChromaCollection', id: string, name: string, description: string };

export type DocumentFragment = { __typename?: 'Document', id: string, content: string, metadata?: any | null, distance?: number | null, structure?: { __typename?: 'Structure', identifier: string, object: string } | null };

export type LlmModelFragment = { __typename?: 'LLMModel', id: string, modelId: string, llmString: string, features: Array<FeatureType>, provider: { __typename?: 'Provider', id: string, name: string, kind: ProviderKind, models: Array<{ __typename?: 'LLMModel', id: string, modelId: string }> }, embedderFor: Array<{ __typename?: 'ChromaCollection', id: string, name: string }> };

export type ListLlmModelFragment = { __typename?: 'LLMModel', id: string, modelId: string };

export type MessageFragment = { __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> };

export type ListMessageFragment = { __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> };

export type ProviderFragment = { __typename?: 'Provider', id: string, name: string, kind: ProviderKind, models: Array<{ __typename?: 'LLMModel', id: string, modelId: string }> };

export type ListProviderFragment = { __typename?: 'Provider', id: string, name: string, kind: ProviderKind };

export type ChatResponseFragment = { __typename?: 'ChatResponse', id: string, object: string, created: number, model: string, usage?: { __typename?: 'Usage', promptTokens: number, completionTokens: number, totalTokens: number } | null, choices: Array<{ __typename?: 'Choice', index: number, finishReason?: string | null, message: { __typename?: 'ChatMessage', role: Role, content?: string | null, name?: string | null, toolCallId?: string | null, functionCall?: { __typename?: 'FunctionCall', name: string, arguments: string } | null, toolCalls?: Array<{ __typename?: 'ToolCall', id: string, type: ToolType, function: { __typename?: 'FunctionCall', name: string, arguments: string } }> | null } }> };

export type RoomFragment = { __typename?: 'Room', id: string, title: string, description: string, messages: Array<{ __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> }> };

export type ListRoomFragment = { __typename?: 'Room', id: string, title: string, description: string };

export type ChatMutationVariables = Exact<{
  input: ChatInput;
}>;


export type ChatMutation = { __typename?: 'Mutation', chat: { __typename?: 'ChatResponse', id: string, object: string, created: number, model: string, usage?: { __typename?: 'Usage', promptTokens: number, completionTokens: number, totalTokens: number } | null, choices: Array<{ __typename?: 'Choice', index: number, finishReason?: string | null, message: { __typename?: 'ChatMessage', role: Role, content?: string | null, name?: string | null, toolCallId?: string | null, functionCall?: { __typename?: 'FunctionCall', name: string, arguments: string } | null, toolCalls?: Array<{ __typename?: 'ToolCall', id: string, type: ToolType, function: { __typename?: 'FunctionCall', name: string, arguments: string } }> | null } }> } };

export type CreateCollectionMutationVariables = Exact<{
  input: ChromaCollectionInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection: { __typename?: 'ChromaCollection', id: string, name: string, description: string, createdAt: any } };

export type EnsureCollectionMutationVariables = Exact<{
  input: ChromaCollectionInput;
}>;


export type EnsureCollectionMutation = { __typename?: 'Mutation', ensureCollection: { __typename?: 'ChromaCollection', id: string, name: string, description: string, createdAt: any } };

export type AddDocumentsToCollectionMutationVariables = Exact<{
  input: AddDocumentsToCollectionInput;
}>;


export type AddDocumentsToCollectionMutation = { __typename?: 'Mutation', addDocumentsToCollection: Array<{ __typename?: 'Document', id: string, content: string, metadata?: any | null, distance?: number | null, structure?: { __typename?: 'Structure', identifier: string, object: string } | null }> };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', send: { __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> } };

export type CreateProviderMutationVariables = Exact<{
  input: ProviderInput;
}>;


export type CreateProviderMutation = { __typename?: 'Mutation', createProvider: { __typename?: 'Provider', id: string, name: string, kind: ProviderKind, models: Array<{ __typename?: 'LLMModel', id: string, modelId: string }> } };

export type DeleteProviderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProviderMutation = { __typename?: 'Mutation', deleteProvider: string };

export type PullMutationVariables = Exact<{
  input: PullInput;
}>;


export type PullMutation = { __typename?: 'Mutation', pull: { __typename?: 'OllamaPullResult', status: string, detail?: string | null } };

export type CreateRoomMutationVariables = Exact<{
  input: CreateRoomInput;
}>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'Room', id: string, title: string, description: string, messages: Array<{ __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> }> } };

export type DeleteRoomMutationVariables = Exact<{
  input: DeleteRoomInput;
}>;


export type DeleteRoomMutation = { __typename?: 'Mutation', deleteRoom: string };

export type GetChromaCollectionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetChromaCollectionQuery = { __typename?: 'Query', chromaCollection: { __typename?: 'ChromaCollection', id: string, name: string, description: string, createdAt: any } };

export type SearchChromaCollectionQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchChromaCollectionQuery = { __typename?: 'Query', options: Array<{ __typename?: 'ChromaCollection', value: string, label: string }> };

export type ListChromaCollectionsQueryVariables = Exact<{
  filter?: InputMaybe<ChromaCollectionFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListChromaCollectionsQuery = { __typename?: 'Query', chromaCollections: Array<{ __typename?: 'ChromaCollection', id: string, name: string, description: string }> };

export type QueryDocumentsQueryVariables = Exact<{
  collection: Scalars['ID']['input'];
  queryTexts: Array<Scalars['String']['input']> | Scalars['String']['input'];
  nResults?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
}>;


export type QueryDocumentsQuery = { __typename?: 'Query', documents: Array<{ __typename?: 'Document', id: string, content: string, metadata?: any | null, distance?: number | null, structure?: { __typename?: 'Structure', identifier: string, object: string } | null }> };

export type HomePageStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageStatsQuery = { __typename?: 'Query', roomStats: { __typename?: 'RoomStats', count: number } };

export type GetLlmModelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLlmModelQuery = { __typename?: 'Query', llmModel: { __typename?: 'LLMModel', id: string, modelId: string, llmString: string, features: Array<FeatureType>, provider: { __typename?: 'Provider', id: string, name: string, kind: ProviderKind, models: Array<{ __typename?: 'LLMModel', id: string, modelId: string }> }, embedderFor: Array<{ __typename?: 'ChromaCollection', id: string, name: string }> } };

export type SearchLlmModelsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchLlmModelsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'LLMModel', value: string, label: string }> };

export type ListLlModelsQueryVariables = Exact<{
  filter?: InputMaybe<LlmModelFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListLlModelsQuery = { __typename?: 'Query', llmModels: Array<{ __typename?: 'LLMModel', id: string, modelId: string }> };

export type GetProviderQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProviderQuery = { __typename?: 'Query', provider: { __typename?: 'Provider', id: string, name: string, kind: ProviderKind, models: Array<{ __typename?: 'LLMModel', id: string, modelId: string }> } };

export type SearchProvidersQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchProvidersQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Provider', value: string, label: string }> };

export type ListProvidersQueryVariables = Exact<{
  filter?: InputMaybe<ProviderFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListProvidersQuery = { __typename?: 'Query', providers: Array<{ __typename?: 'Provider', id: string, name: string, kind: ProviderKind }> };

export type GetRoomQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRoomQuery = { __typename?: 'Query', room: { __typename?: 'Room', id: string, title: string, description: string, messages: Array<{ __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> }> } };

export type SearchRoomsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SearchRoomsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Room', value: string, label: string, description: string }> };

export type ListRoomsQueryVariables = Exact<{
  filter?: InputMaybe<RoomFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ListRoomsQuery = { __typename?: 'Query', rooms: Array<{ __typename?: 'Room', id: string, title: string, description: string, messages: Array<{ __typename?: 'Message', id: string, text: string, createdAt: any, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> }> }> };

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

export const ChromaCollectionFragmentDoc = gql`
    fragment ChromaCollection on ChromaCollection {
  id
  name
  description
  createdAt
}
    `;
export const ListChromaCollectionFragmentDoc = gql`
    fragment ListChromaCollection on ChromaCollection {
  id
  name
  description
}
    `;
export const DocumentFragmentDoc = gql`
    fragment Document on Document {
  id
  content
  metadata
  distance
  structure {
    identifier
    object
  }
}
    `;
export const ProviderFragmentDoc = gql`
    fragment Provider on Provider {
  id
  name
  models {
    id
    modelId
  }
  kind
}
    `;
export const LlmModelFragmentDoc = gql`
    fragment LLMModel on LLMModel {
  id
  modelId
  llmString
  provider {
    ...Provider
  }
  features
  embedderFor {
    id
    name
  }
}
    ${ProviderFragmentDoc}`;
export const ListLlmModelFragmentDoc = gql`
    fragment ListLLMModel on LLMModel {
  id
  modelId
}
    `;
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
export const ListProviderFragmentDoc = gql`
    fragment ListProvider on Provider {
  id
  name
  kind
}
    `;
export const ChatResponseFragmentDoc = gql`
    fragment ChatResponse on ChatResponse {
  id
  object
  created
  model
  usage {
    promptTokens
    completionTokens
    totalTokens
  }
  choices {
    index
    finishReason
    message {
      role
      content
      name
      toolCallId
      functionCall {
        name
        arguments
      }
      toolCalls {
        id
        type
        function {
          name
          arguments
        }
      }
    }
  }
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
export const RoomFragmentDoc = gql`
    fragment Room on Room {
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
export const ChatDocument = gql`
    mutation Chat($input: ChatInput!) {
  chat(input: $input) {
    ...ChatResponse
  }
}
    ${ChatResponseFragmentDoc}`;
export type ChatMutationFn = Apollo.MutationFunction<ChatMutation, ChatMutationVariables>;

/**
 * __useChatMutation__
 *
 * To run a mutation, you first call `useChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chatMutation, { data, loading, error }] = useChatMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChatMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChatMutation, ChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ChatMutation, ChatMutationVariables>(ChatDocument, options);
      }
export type ChatMutationHookResult = ReturnType<typeof useChatMutation>;
export type ChatMutationResult = Apollo.MutationResult<ChatMutation>;
export type ChatMutationOptions = Apollo.BaseMutationOptions<ChatMutation, ChatMutationVariables>;
export const CreateCollectionDocument = gql`
    mutation CreateCollection($input: ChromaCollectionInput!) {
  createCollection(input: $input) {
    ...ChromaCollection
  }
}
    ${ChromaCollectionFragmentDoc}`;
export type CreateCollectionMutationFn = Apollo.MutationFunction<CreateCollectionMutation, CreateCollectionMutationVariables>;

/**
 * __useCreateCollectionMutation__
 *
 * To run a mutation, you first call `useCreateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionMutation, { data, loading, error }] = useCreateCollectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCollectionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCollectionMutation, CreateCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateCollectionMutation, CreateCollectionMutationVariables>(CreateCollectionDocument, options);
      }
export type CreateCollectionMutationHookResult = ReturnType<typeof useCreateCollectionMutation>;
export type CreateCollectionMutationResult = Apollo.MutationResult<CreateCollectionMutation>;
export type CreateCollectionMutationOptions = Apollo.BaseMutationOptions<CreateCollectionMutation, CreateCollectionMutationVariables>;
export const EnsureCollectionDocument = gql`
    mutation EnsureCollection($input: ChromaCollectionInput!) {
  ensureCollection(input: $input) {
    ...ChromaCollection
  }
}
    ${ChromaCollectionFragmentDoc}`;
export type EnsureCollectionMutationFn = Apollo.MutationFunction<EnsureCollectionMutation, EnsureCollectionMutationVariables>;

/**
 * __useEnsureCollectionMutation__
 *
 * To run a mutation, you first call `useEnsureCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnsureCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ensureCollectionMutation, { data, loading, error }] = useEnsureCollectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEnsureCollectionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EnsureCollectionMutation, EnsureCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<EnsureCollectionMutation, EnsureCollectionMutationVariables>(EnsureCollectionDocument, options);
      }
export type EnsureCollectionMutationHookResult = ReturnType<typeof useEnsureCollectionMutation>;
export type EnsureCollectionMutationResult = Apollo.MutationResult<EnsureCollectionMutation>;
export type EnsureCollectionMutationOptions = Apollo.BaseMutationOptions<EnsureCollectionMutation, EnsureCollectionMutationVariables>;
export const AddDocumentsToCollectionDocument = gql`
    mutation AddDocumentsToCollection($input: AddDocumentsToCollectionInput!) {
  addDocumentsToCollection(input: $input) {
    ...Document
  }
}
    ${DocumentFragmentDoc}`;
export type AddDocumentsToCollectionMutationFn = Apollo.MutationFunction<AddDocumentsToCollectionMutation, AddDocumentsToCollectionMutationVariables>;

/**
 * __useAddDocumentsToCollectionMutation__
 *
 * To run a mutation, you first call `useAddDocumentsToCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddDocumentsToCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addDocumentsToCollectionMutation, { data, loading, error }] = useAddDocumentsToCollectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddDocumentsToCollectionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddDocumentsToCollectionMutation, AddDocumentsToCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AddDocumentsToCollectionMutation, AddDocumentsToCollectionMutationVariables>(AddDocumentsToCollectionDocument, options);
      }
export type AddDocumentsToCollectionMutationHookResult = ReturnType<typeof useAddDocumentsToCollectionMutation>;
export type AddDocumentsToCollectionMutationResult = Apollo.MutationResult<AddDocumentsToCollectionMutation>;
export type AddDocumentsToCollectionMutationOptions = Apollo.BaseMutationOptions<AddDocumentsToCollectionMutation, AddDocumentsToCollectionMutationVariables>;
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
export const CreateProviderDocument = gql`
    mutation CreateProvider($input: ProviderInput!) {
  createProvider(input: $input) {
    ...Provider
  }
}
    ${ProviderFragmentDoc}`;
export type CreateProviderMutationFn = Apollo.MutationFunction<CreateProviderMutation, CreateProviderMutationVariables>;

/**
 * __useCreateProviderMutation__
 *
 * To run a mutation, you first call `useCreateProviderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProviderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProviderMutation, { data, loading, error }] = useCreateProviderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProviderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProviderMutation, CreateProviderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateProviderMutation, CreateProviderMutationVariables>(CreateProviderDocument, options);
      }
export type CreateProviderMutationHookResult = ReturnType<typeof useCreateProviderMutation>;
export type CreateProviderMutationResult = Apollo.MutationResult<CreateProviderMutation>;
export type CreateProviderMutationOptions = Apollo.BaseMutationOptions<CreateProviderMutation, CreateProviderMutationVariables>;
export const DeleteProviderDocument = gql`
    mutation DeleteProvider($id: ID!) {
  deleteProvider(input: {id: $id})
}
    `;
export type DeleteProviderMutationFn = Apollo.MutationFunction<DeleteProviderMutation, DeleteProviderMutationVariables>;

/**
 * __useDeleteProviderMutation__
 *
 * To run a mutation, you first call `useDeleteProviderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProviderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProviderMutation, { data, loading, error }] = useDeleteProviderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProviderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteProviderMutation, DeleteProviderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteProviderMutation, DeleteProviderMutationVariables>(DeleteProviderDocument, options);
      }
export type DeleteProviderMutationHookResult = ReturnType<typeof useDeleteProviderMutation>;
export type DeleteProviderMutationResult = Apollo.MutationResult<DeleteProviderMutation>;
export type DeleteProviderMutationOptions = Apollo.BaseMutationOptions<DeleteProviderMutation, DeleteProviderMutationVariables>;
export const PullDocument = gql`
    mutation Pull($input: PullInput!) {
  pull(input: $input) {
    status
    detail
  }
}
    `;
export type PullMutationFn = Apollo.MutationFunction<PullMutation, PullMutationVariables>;

/**
 * __usePullMutation__
 *
 * To run a mutation, you first call `usePullMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePullMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pullMutation, { data, loading, error }] = usePullMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePullMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PullMutation, PullMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PullMutation, PullMutationVariables>(PullDocument, options);
      }
export type PullMutationHookResult = ReturnType<typeof usePullMutation>;
export type PullMutationResult = Apollo.MutationResult<PullMutation>;
export type PullMutationOptions = Apollo.BaseMutationOptions<PullMutation, PullMutationVariables>;
export const CreateRoomDocument = gql`
    mutation CreateRoom($input: CreateRoomInput!) {
  createRoom(input: $input) {
    ...Room
  }
}
    ${RoomFragmentDoc}`;
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
 *      input: // value for 'input'
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
export const GetChromaCollectionDocument = gql`
    query GetChromaCollection($id: ID!) {
  chromaCollection(id: $id) {
    ...ChromaCollection
  }
}
    ${ChromaCollectionFragmentDoc}`;

/**
 * __useGetChromaCollectionQuery__
 *
 * To run a query within a React component, call `useGetChromaCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChromaCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChromaCollectionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetChromaCollectionQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetChromaCollectionQuery, GetChromaCollectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetChromaCollectionQuery, GetChromaCollectionQueryVariables>(GetChromaCollectionDocument, options);
      }
export function useGetChromaCollectionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetChromaCollectionQuery, GetChromaCollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetChromaCollectionQuery, GetChromaCollectionQueryVariables>(GetChromaCollectionDocument, options);
        }
export type GetChromaCollectionQueryHookResult = ReturnType<typeof useGetChromaCollectionQuery>;
export type GetChromaCollectionLazyQueryHookResult = ReturnType<typeof useGetChromaCollectionLazyQuery>;
export type GetChromaCollectionQueryResult = Apollo.QueryResult<GetChromaCollectionQuery, GetChromaCollectionQueryVariables>;
export const SearchChromaCollectionDocument = gql`
    query SearchChromaCollection($search: String, $values: [ID!]) {
  options: chromaCollections(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchChromaCollectionQuery__
 *
 * To run a query within a React component, call `useSearchChromaCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchChromaCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchChromaCollectionQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchChromaCollectionQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchChromaCollectionQuery, SearchChromaCollectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchChromaCollectionQuery, SearchChromaCollectionQueryVariables>(SearchChromaCollectionDocument, options);
      }
export function useSearchChromaCollectionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchChromaCollectionQuery, SearchChromaCollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchChromaCollectionQuery, SearchChromaCollectionQueryVariables>(SearchChromaCollectionDocument, options);
        }
export type SearchChromaCollectionQueryHookResult = ReturnType<typeof useSearchChromaCollectionQuery>;
export type SearchChromaCollectionLazyQueryHookResult = ReturnType<typeof useSearchChromaCollectionLazyQuery>;
export type SearchChromaCollectionQueryResult = Apollo.QueryResult<SearchChromaCollectionQuery, SearchChromaCollectionQueryVariables>;
export const ListChromaCollectionsDocument = gql`
    query ListChromaCollections($filter: ChromaCollectionFilter, $pagination: OffsetPaginationInput) {
  chromaCollections(filters: $filter, pagination: $pagination) {
    ...ListChromaCollection
  }
}
    ${ListChromaCollectionFragmentDoc}`;

/**
 * __useListChromaCollectionsQuery__
 *
 * To run a query within a React component, call `useListChromaCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListChromaCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListChromaCollectionsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListChromaCollectionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListChromaCollectionsQuery, ListChromaCollectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListChromaCollectionsQuery, ListChromaCollectionsQueryVariables>(ListChromaCollectionsDocument, options);
      }
export function useListChromaCollectionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListChromaCollectionsQuery, ListChromaCollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListChromaCollectionsQuery, ListChromaCollectionsQueryVariables>(ListChromaCollectionsDocument, options);
        }
export type ListChromaCollectionsQueryHookResult = ReturnType<typeof useListChromaCollectionsQuery>;
export type ListChromaCollectionsLazyQueryHookResult = ReturnType<typeof useListChromaCollectionsLazyQuery>;
export type ListChromaCollectionsQueryResult = Apollo.QueryResult<ListChromaCollectionsQuery, ListChromaCollectionsQueryVariables>;
export const QueryDocumentsDocument = gql`
    query QueryDocuments($collection: ID!, $queryTexts: [String!]!, $nResults: Int, $where: JSON) {
  documents(
    collection: $collection
    queryTexts: $queryTexts
    nResults: $nResults
    where: $where
  ) {
    ...Document
  }
}
    ${DocumentFragmentDoc}`;

/**
 * __useQueryDocumentsQuery__
 *
 * To run a query within a React component, call `useQueryDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryDocumentsQuery({
 *   variables: {
 *      collection: // value for 'collection'
 *      queryTexts: // value for 'queryTexts'
 *      nResults: // value for 'nResults'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useQueryDocumentsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<QueryDocumentsQuery, QueryDocumentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<QueryDocumentsQuery, QueryDocumentsQueryVariables>(QueryDocumentsDocument, options);
      }
export function useQueryDocumentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<QueryDocumentsQuery, QueryDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<QueryDocumentsQuery, QueryDocumentsQueryVariables>(QueryDocumentsDocument, options);
        }
export type QueryDocumentsQueryHookResult = ReturnType<typeof useQueryDocumentsQuery>;
export type QueryDocumentsLazyQueryHookResult = ReturnType<typeof useQueryDocumentsLazyQuery>;
export type QueryDocumentsQueryResult = Apollo.QueryResult<QueryDocumentsQuery, QueryDocumentsQueryVariables>;
export const HomePageStatsDocument = gql`
    query HomePageStats {
  roomStats {
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
export const GetLlmModelDocument = gql`
    query GetLLMModel($id: ID!) {
  llmModel(id: $id) {
    ...LLMModel
  }
}
    ${LlmModelFragmentDoc}`;

/**
 * __useGetLlmModelQuery__
 *
 * To run a query within a React component, call `useGetLlmModelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLlmModelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLlmModelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLlmModelQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetLlmModelQuery, GetLlmModelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetLlmModelQuery, GetLlmModelQueryVariables>(GetLlmModelDocument, options);
      }
export function useGetLlmModelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLlmModelQuery, GetLlmModelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetLlmModelQuery, GetLlmModelQueryVariables>(GetLlmModelDocument, options);
        }
export type GetLlmModelQueryHookResult = ReturnType<typeof useGetLlmModelQuery>;
export type GetLlmModelLazyQueryHookResult = ReturnType<typeof useGetLlmModelLazyQuery>;
export type GetLlmModelQueryResult = Apollo.QueryResult<GetLlmModelQuery, GetLlmModelQueryVariables>;
export const SearchLlmModelsDocument = gql`
    query SearchLLMModels($search: String, $values: [ID!]) {
  options: llmModels(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: id
  }
}
    `;

/**
 * __useSearchLlmModelsQuery__
 *
 * To run a query within a React component, call `useSearchLlmModelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchLlmModelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchLlmModelsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchLlmModelsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchLlmModelsQuery, SearchLlmModelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchLlmModelsQuery, SearchLlmModelsQueryVariables>(SearchLlmModelsDocument, options);
      }
export function useSearchLlmModelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchLlmModelsQuery, SearchLlmModelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchLlmModelsQuery, SearchLlmModelsQueryVariables>(SearchLlmModelsDocument, options);
        }
export type SearchLlmModelsQueryHookResult = ReturnType<typeof useSearchLlmModelsQuery>;
export type SearchLlmModelsLazyQueryHookResult = ReturnType<typeof useSearchLlmModelsLazyQuery>;
export type SearchLlmModelsQueryResult = Apollo.QueryResult<SearchLlmModelsQuery, SearchLlmModelsQueryVariables>;
export const ListLlModelsDocument = gql`
    query ListLLModels($filter: LLMModelFilter, $pagination: OffsetPaginationInput) {
  llmModels(filters: $filter, pagination: $pagination) {
    ...ListLLMModel
  }
}
    ${ListLlmModelFragmentDoc}`;

/**
 * __useListLlModelsQuery__
 *
 * To run a query within a React component, call `useListLlModelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListLlModelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListLlModelsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListLlModelsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListLlModelsQuery, ListLlModelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListLlModelsQuery, ListLlModelsQueryVariables>(ListLlModelsDocument, options);
      }
export function useListLlModelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListLlModelsQuery, ListLlModelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListLlModelsQuery, ListLlModelsQueryVariables>(ListLlModelsDocument, options);
        }
export type ListLlModelsQueryHookResult = ReturnType<typeof useListLlModelsQuery>;
export type ListLlModelsLazyQueryHookResult = ReturnType<typeof useListLlModelsLazyQuery>;
export type ListLlModelsQueryResult = Apollo.QueryResult<ListLlModelsQuery, ListLlModelsQueryVariables>;
export const GetProviderDocument = gql`
    query GetProvider($id: ID!) {
  provider(id: $id) {
    ...Provider
  }
}
    ${ProviderFragmentDoc}`;

/**
 * __useGetProviderQuery__
 *
 * To run a query within a React component, call `useGetProviderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProviderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProviderQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProviderQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetProviderQuery, GetProviderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetProviderQuery, GetProviderQueryVariables>(GetProviderDocument, options);
      }
export function useGetProviderLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProviderQuery, GetProviderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetProviderQuery, GetProviderQueryVariables>(GetProviderDocument, options);
        }
export type GetProviderQueryHookResult = ReturnType<typeof useGetProviderQuery>;
export type GetProviderLazyQueryHookResult = ReturnType<typeof useGetProviderLazyQuery>;
export type GetProviderQueryResult = Apollo.QueryResult<GetProviderQuery, GetProviderQueryVariables>;
export const SearchProvidersDocument = gql`
    query SearchProviders($search: String, $values: [ID!]) {
  options: providers(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: name
  }
}
    `;

/**
 * __useSearchProvidersQuery__
 *
 * To run a query within a React component, call `useSearchProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProvidersQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchProvidersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchProvidersQuery, SearchProvidersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchProvidersQuery, SearchProvidersQueryVariables>(SearchProvidersDocument, options);
      }
export function useSearchProvidersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchProvidersQuery, SearchProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchProvidersQuery, SearchProvidersQueryVariables>(SearchProvidersDocument, options);
        }
export type SearchProvidersQueryHookResult = ReturnType<typeof useSearchProvidersQuery>;
export type SearchProvidersLazyQueryHookResult = ReturnType<typeof useSearchProvidersLazyQuery>;
export type SearchProvidersQueryResult = Apollo.QueryResult<SearchProvidersQuery, SearchProvidersQueryVariables>;
export const ListProvidersDocument = gql`
    query ListProviders($filter: ProviderFilter, $pagination: OffsetPaginationInput) {
  providers(filters: $filter, pagination: $pagination) {
    ...ListProvider
  }
}
    ${ListProviderFragmentDoc}`;

/**
 * __useListProvidersQuery__
 *
 * To run a query within a React component, call `useListProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListProvidersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListProvidersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListProvidersQuery, ListProvidersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListProvidersQuery, ListProvidersQueryVariables>(ListProvidersDocument, options);
      }
export function useListProvidersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListProvidersQuery, ListProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListProvidersQuery, ListProvidersQueryVariables>(ListProvidersDocument, options);
        }
export type ListProvidersQueryHookResult = ReturnType<typeof useListProvidersQuery>;
export type ListProvidersLazyQueryHookResult = ReturnType<typeof useListProvidersLazyQuery>;
export type ListProvidersQueryResult = Apollo.QueryResult<ListProvidersQuery, ListProvidersQueryVariables>;
export const GetRoomDocument = gql`
    query GetRoom($id: ID!) {
  room(id: $id) {
    ...Room
  }
}
    ${RoomFragmentDoc}`;

/**
 * __useGetRoomQuery__
 *
 * To run a query within a React component, call `useGetRoomQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRoomQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRoomQuery, GetRoomQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRoomQuery, GetRoomQueryVariables>(GetRoomDocument, options);
      }
export function useGetRoomLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRoomQuery, GetRoomQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRoomQuery, GetRoomQueryVariables>(GetRoomDocument, options);
        }
export type GetRoomQueryHookResult = ReturnType<typeof useGetRoomQuery>;
export type GetRoomLazyQueryHookResult = ReturnType<typeof useGetRoomLazyQuery>;
export type GetRoomQueryResult = Apollo.QueryResult<GetRoomQuery, GetRoomQueryVariables>;
export const SearchRoomsDocument = gql`
    query SearchRooms($search: String, $values: [ID!]) {
  options: rooms(
    filters: {search: $search, ids: $values}
    pagination: {limit: 10}
  ) {
    value: id
    label: title
    description: description
  }
}
    `;

/**
 * __useSearchRoomsQuery__
 *
 * To run a query within a React component, call `useSearchRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchRoomsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useSearchRoomsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchRoomsQuery, SearchRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchRoomsQuery, SearchRoomsQueryVariables>(SearchRoomsDocument, options);
      }
export function useSearchRoomsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchRoomsQuery, SearchRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchRoomsQuery, SearchRoomsQueryVariables>(SearchRoomsDocument, options);
        }
export type SearchRoomsQueryHookResult = ReturnType<typeof useSearchRoomsQuery>;
export type SearchRoomsLazyQueryHookResult = ReturnType<typeof useSearchRoomsLazyQuery>;
export type SearchRoomsQueryResult = Apollo.QueryResult<SearchRoomsQuery, SearchRoomsQueryVariables>;
export const ListRoomsDocument = gql`
    query ListRooms($filter: RoomFilter, $pagination: OffsetPaginationInput) {
  rooms(filters: $filter, pagination: $pagination) {
    ...Room
  }
}
    ${RoomFragmentDoc}`;

/**
 * __useListRoomsQuery__
 *
 * To run a query within a React component, call `useListRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListRoomsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useListRoomsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListRoomsQuery, ListRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListRoomsQuery, ListRoomsQueryVariables>(ListRoomsDocument, options);
      }
export function useListRoomsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListRoomsQuery, ListRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListRoomsQuery, ListRoomsQueryVariables>(ListRoomsDocument, options);
        }
export type ListRoomsQueryHookResult = ReturnType<typeof useListRoomsQuery>;
export type ListRoomsLazyQueryHookResult = ReturnType<typeof useListRoomsLazyQuery>;
export type ListRoomsQueryResult = Apollo.QueryResult<ListRoomsQuery, ListRoomsQueryVariables>;
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