/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The App identifier is a unique identifier for an app. It is used to identify the app in the database and in the code. We encourage you to use the reverse domain name notation. E.g. `com.example.myapp` */
  AppIdentifier: { input: any; output: any; }
  /** Date with time (isoformat) */
  DateTime: { input: any; output: any; }
  /** The `ArrayLike` scalasr typsse represents a reference to a store previously created by the user n a datalayer */
  ExtraData: { input: any; output: any; }
  /** The `Fakt` scalar type represents a reference to a fakt */
  Fakt: { input: any; output: any; }
  /** The `Identifier` scalasr typsse represents a reference to a store previously created by the user n a datalayer */
  Identifier: { input: any; output: any; }
  /** The Service identifier is a unique identifier for a service. It is used to identify the service in the database and in the code. We encourage you to use the reverse domain name notation. E.g. `com.example.myservice` */
  ServiceIdentifier: { input: any; output: any; }
  /** The `Identifier` scalasr typsse represents a reference to a store previously created by the user n a datalayer */
  UnsafeChild: { input: any; output: any; }
  /** The `Version` represents a semver version string */
  Version: { input: any; output: any; }
};

export type AcknowledgeMessageInput = {
  acknowledged: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};

export type AddItemToStashInput = {
  items: Array<StashItemInput>;
  stash: Scalars['ID']['input'];
};

/** Agent(id, room, name, app, user) */
export type Agent = {
  __typename?: 'Agent';
  id: Scalars['ID']['output'];
  room: Room;
};

/** An App is the Arkitekt equivalent of a Software Application. It is a collection of `Releases` that can be all part of the same application. E.g the App `Napari` could have the releases `0.1.0` and `0.2.0`. */
export type App = {
  __typename?: 'App';
  id: Scalars['ID']['output'];
  /** The identifier of the app. This should be a globally unique string that identifies the app. We encourage you to use the reverse domain name notation. E.g. `com.example.myapp` */
  identifier: Scalars['AppIdentifier']['output'];
  /** The logo of the app. This should be a url to a logo that can be used to represent the app. */
  logo?: Maybe<Scalars['String']['output']>;
  /** The name of the app */
  name: Scalars['String']['output'];
  /** The releases of the app. A release is a version of the app that can be installed by a user. */
  releases: Array<Release>;
};

export enum BackendType {
  ConfigBackend = 'ConfigBackend',
  DockerBackend = 'DockerBackend'
}

/**
 * A client is a way of authenticating users with a release.
 *  The strategy of authentication is defined by the kind of client. And allows for different authentication flow.
 *  E.g a client can be a DESKTOP app, that might be used by multiple users, or a WEBSITE that wants to connect to a user's account,
 *  but also a DEVELOPMENT client that is used by a developer to test the app. The client model thinly wraps the oauth2 client model, which is used to authenticate users.
 */
export type Client = {
  __typename?: 'Client';
  /** The composition of the client.  */
  composition: Composition;
  id: Scalars['ID']['output'];
  /** The configuration of the client. This is the configuration that will be sent to the client. It should never contain sensitive information. */
  kind: ClientKind;
  /** The real oauth2 client that is used to authenticate users with this client. */
  oauth2Client: Oauth2Client;
  /** Is this client public? If a client is public  */
  public: Scalars['Boolean']['output'];
  /** The release that this client belongs to. */
  release: Release;
  /** The user that manages this release. */
  tenant: User;
  /** A token that can be used to retrieve the configuration of the client. When providing this token during the configuration flow, the client will received its configuration (the filled in `composition`) */
  token: Scalars['String']['output'];
  /** If the client is a DEVELOPMENT client, which requires no further authentication, this is the user that is authenticated with the client. */
  user?: Maybe<User>;
};

/** Client(id, composition, release, oauth2_client, kind, public, token, client_id, client_secret, tenant, user, created_at) */
export type ClientFilter = {
  AND?: InputMaybe<ClientFilter>;
  OR?: InputMaybe<ClientFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export enum ClientKind {
  Desktop = 'DESKTOP',
  Development = 'DEVELOPMENT',
  Website = 'WEBSITE'
}

/**
 * Comments represent the comments of a user on a specific data item
 * tart are identified by the unique combination of `identifier` and `object`.
 * E.g a comment for an Image on the Mikro services would be serverd as
 * `@mikro/image:imageID`.
 *
 * Comments always belong to the user that created it. Comments in threads
 * get a parent attribute set, that points to the immediate parent.
 *
 * Each comment contains multiple descendents, that make up a *rich* representation
 * of the underlying comment data including potential mentions, or links, or
 * paragraphs.
 */
export type Comment = {
  __typename?: 'Comment';
  /** The children of this comment */
  children: Array<Comment>;
  /** The time this comment got created */
  createdAt: Scalars['DateTime']['output'];
  /** The immediate descendends of the comments. Think typed Rich Representation */
  descendants: Array<Descendant>;
  id: Scalars['ID']['output'];
  /** The identifier of the object. Consult the documentation for the format */
  identifier: Scalars['Identifier']['output'];
  /** The users that got mentioned in this comment */
  mentions: Array<User>;
  /** The object id of the object, on its associated service */
  object: Scalars['String']['output'];
  /** The parent of this comment. Think Thread */
  parent?: Maybe<Comment>;
  resolved: Scalars['Boolean']['output'];
  /** The user that resolved this comment */
  resolvedBy?: Maybe<User>;
  /** The user that created this comment */
  user: User;
};


/**
 * Comments represent the comments of a user on a specific data item
 * tart are identified by the unique combination of `identifier` and `object`.
 * E.g a comment for an Image on the Mikro services would be serverd as
 * `@mikro/image:imageID`.
 *
 * Comments always belong to the user that created it. Comments in threads
 * get a parent attribute set, that points to the immediate parent.
 *
 * Each comment contains multiple descendents, that make up a *rich* representation
 * of the underlying comment data including potential mentions, or links, or
 * paragraphs.
 */
export type CommentMentionsArgs = {
  filters?: InputMaybe<UserFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** A Communication */
export type Communication = {
  __typename?: 'Communication';
  channel: Scalars['ID']['output'];
};

/** A template for a configuration */
export type Composition = {
  __typename?: 'Composition';
  id: Scalars['ID']['output'];
  /** The mappings of the composition. A mapping is a mapping of a service to a service instance. This is used to configure the composition. */
  mappings: Array<ServiceInstanceMapping>;
  /** The name of the composition */
  name: Scalars['String']['output'];
  /** The template of the composition. This is a Jinja2 YAML template that will be rendered with the LinkingContext as context. The result of the rendering will be used to send to the client as a configuration. It should never contain sensitive information. */
  template: Scalars['String']['output'];
};

export type CreateCommentInput = {
  descendants: Array<DescendantInput>;
  identifier: Scalars['Identifier']['input'];
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  object: Scalars['ID']['input'];
  parent?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateRoomInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateStashInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  name: Scalars['String']['input'];
};

export type DeleteStashInput = {
  stash: Scalars['ID']['input'];
};

export type DeleteStashItems = {
  items: Array<Scalars['ID']['input']>;
};

/** A descendant of a comment. Descendend are used to render rich text in the frontend. */
export type Descendant = {
  children?: Maybe<Array<Descendant>>;
  kind: DescendantKind;
  /** Unsafe children are not typed and fall back to json. This is a workaround if queries get too complex. */
  unsafeChildren?: Maybe<Array<Scalars['UnsafeChild']['output']>>;
};

export type DescendantInput = {
  bold?: InputMaybe<Scalars['Boolean']['input']>;
  children?: InputMaybe<Array<DescendantInput>>;
  code?: InputMaybe<Scalars['Boolean']['input']>;
  italic?: InputMaybe<Scalars['Boolean']['input']>;
  kind: DescendantKind;
  text?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

/** The Kind of a Descendant */
export enum DescendantKind {
  Leaf = 'LEAF',
  Mention = 'MENTION',
  Paragraph = 'PARAGRAPH'
}

export type DevelopmentClientInput = {
  composition?: InputMaybe<Scalars['ID']['input']>;
  manifest: ManifestInput;
  requirements?: Array<Requirement>;
};

export type DjangoModelType = {
  __typename?: 'DjangoModelType';
  pk: Scalars['ID']['output'];
};

/**
 *
 * The Generic Account is a Social Account that maps to a generic account. It provides information about the
 * user that is specific to the provider. This includes untyped extra data.
 *
 *
 */
export type GenericAccount = SocialAccount & {
  __typename?: 'GenericAccount';
  extraData: Scalars['ExtraData']['output'];
  /** The provider of the account. This can be used to determine the type of the account. */
  provider: ProviderType;
  /** The unique identifier of the account. This is unique for the provider. */
  uid: Scalars['String']['output'];
};

/**
 *
 * A Group is the base unit of Role Based Access Control. A Group can have many users and many permissions. A user can have many groups. A user with a group that has a permission can perform the action that the permission allows.
 * Groups are propagated to the respecting subservices. Permissions are not. Each subservice has to define its own permissions and mappings to groups.
 *
 */
export type Group = {
  __typename?: 'Group';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  users: Array<User>;
};


/**
 *
 * A Group is the base unit of Role Based Access Control. A Group can have many users and many permissions. A user can have many groups. A user with a group that has a permission can perform the action that the permission allows.
 * Groups are propagated to the respecting subservices. Permissions are not. Each subservice has to define its own permissions and mappings to groups.
 *
 */
export type GroupUsersArgs = {
  filters?: InputMaybe<UserFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** __doc__ */
export type GroupFilter = {
  AND?: InputMaybe<GroupFilter>;
  OR?: InputMaybe<GroupFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** A leaf of text. This is the most basic descendant and always ends a tree. */
export type LeafDescendant = Descendant & {
  __typename?: 'LeafDescendant';
  bold?: Maybe<Scalars['Boolean']['output']>;
  children?: Maybe<Array<Descendant>>;
  code?: Maybe<Scalars['String']['output']>;
  italic?: Maybe<Scalars['Boolean']['output']>;
  kind: DescendantKind;
  text?: Maybe<Scalars['String']['output']>;
  underline?: Maybe<Scalars['Boolean']['output']>;
  /** Unsafe children are not typed and fall back to json. This is a workaround if queries get too complex. */
  unsafeChildren?: Maybe<Array<Scalars['UnsafeChild']['output']>>;
};

export type LinkingRequestInput = {
  host: Scalars['String']['input'];
  isSecure?: Scalars['Boolean']['input'];
  port: Scalars['String']['input'];
};

export type ManifestInput = {
  identifier: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['String']['input']>;
  scopes?: Array<Scalars['String']['input']>;
  version: Scalars['String']['input'];
};

/** A mention of a user */
export type MentionDescendant = Descendant & {
  __typename?: 'MentionDescendant';
  children?: Maybe<Array<Descendant>>;
  kind: DescendantKind;
  /** Unsafe children are not typed and fall back to json. This is a workaround if queries get too complex. */
  unsafeChildren?: Maybe<Array<Scalars['UnsafeChild']['output']>>;
  user?: Maybe<User>;
};

/** Message represent the message of an agent on a room */
export type Message = {
  __typename?: 'Message';
  /** The user that created this comment */
  agent: Agent;
  attachedStructures: Array<Structure>;
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
  OR?: InputMaybe<MessageFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acknowledgeMessage: SystemMessage;
  /** Add items to a stash */
  addItemsToStash: Array<StashItem>;
  createComment: Comment;
  createDevelopmentalClient: Scalars['String']['output'];
  createRoom: Room;
  /** Create a new stash */
  createStash: Stash;
  createUser: User;
  deleteStash: Scalars['ID']['output'];
  /** Delete items from a stash */
  deleteStashItems: Array<Scalars['ID']['output']>;
  render: Scalars['Fakt']['output'];
  replyTo: Comment;
  resolveComment: Comment;
  scan: Scalars['String']['output'];
  send: Message;
  /** Update a stash */
  updateStash: Stash;
};


export type MutationAcknowledgeMessageArgs = {
  input: AcknowledgeMessageInput;
};


export type MutationAddItemsToStashArgs = {
  input: AddItemToStashInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateDevelopmentalClientArgs = {
  input: DevelopmentClientInput;
};


export type MutationCreateRoomArgs = {
  input: CreateRoomInput;
};


export type MutationCreateStashArgs = {
  input: CreateStashInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteStashArgs = {
  input: DeleteStashInput;
};


export type MutationDeleteStashItemsArgs = {
  input: DeleteStashItems;
};


export type MutationRenderArgs = {
  input: RenderInput;
};


export type MutationReplyToArgs = {
  input: ReplyToCommentInput;
};


export type MutationResolveCommentArgs = {
  input: ResolveCommentInput;
};


export type MutationScanArgs = {
  input: ScanBackendInput;
};


export type MutationSendArgs = {
  input: SendMessageInput;
};


export type MutationUpdateStashArgs = {
  input: UpdateStashInput;
};

/** Application(id, client_id, user, redirect_uris, post_logout_redirect_uris, client_type, authorization_grant_type, client_secret, name, skip_authorization, created, updated, algorithm) */
export type Oauth2Client = {
  __typename?: 'Oauth2Client';
  algorithm: Scalars['String']['output'];
  authorizationGrantType: Scalars['String']['output'];
  clientType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** Allowed URIs list, space separated */
  redirectUris: Scalars['String']['output'];
  user: User;
};

export type OffsetPaginationInput = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

/**
 *
 * An ORCID Account is a Social Account that maps to an ORCID Account. It provides information about the
 * user that is specific to the ORCID service. This includes the ORCID Identifier, the ORCID Preferences and
 * the ORCID Person. The ORCID Person contains information about the user that is specific to the ORCID service.
 * This includes the ORCID Activities, the ORCID Researcher URLs and the ORCID Addresses.
 *
 *
 */
export type OrcidAccount = SocialAccount & {
  __typename?: 'OrcidAccount';
  /** Extra data that is specific to the provider. This is a json field and can be used to store arbitrary data. */
  extraData: Scalars['ExtraData']['output'];
  /** The ORCID Identifier of the user. The UID of the account is the same as the path of the identifier. */
  identifier: OrcidIdentifier;
  /** Information about the person that is specific to the ORCID service. */
  person?: Maybe<OrcidPerson>;
  /** The provider of the account. This can be used to determine the type of the account. */
  provider: ProviderType;
  /** The unique identifier of the account. This is unique for the provider. */
  uid: Scalars['String']['output'];
};

/** The ORCID Identifier of a user. This is a unique identifier that is used to identify a user on the ORCID service. It is composed of a uri, a path and a host. */
export type OrcidIdentifier = {
  __typename?: 'OrcidIdentifier';
  /** The host of the identifier */
  host: Scalars['String']['output'];
  /** The path of the identifier */
  path: Scalars['String']['output'];
  /** The uri of the identifier */
  uri: Scalars['String']['output'];
};

export type OrcidPerson = {
  __typename?: 'OrcidPerson';
  addresses: Array<Scalars['String']['output']>;
  researcherUrls: Array<Scalars['String']['output']>;
};

/** A Paragraph of text */
export type ParagraphDescendant = Descendant & {
  __typename?: 'ParagraphDescendant';
  children?: Maybe<Array<Descendant>>;
  kind: DescendantKind;
  size?: Maybe<Scalars['String']['output']>;
  /** Unsafe children are not typed and fall back to json. This is a workaround if queries get too complex. */
  unsafeChildren?: Maybe<Array<Scalars['UnsafeChild']['output']>>;
};

/**
 *
 * A Profile of a User. A Profile can be used to display personalied information about a user.
 *
 *
 *
 *
 *
 */
export type Profile = {
  __typename?: 'Profile';
  /** A short bio of the user */
  bio: Scalars['String']['output'];
  /** The name of the user */
  name: Scalars['String']['output'];
};

export enum ProviderType {
  Orcid = 'ORCID'
}

export type Query = {
  __typename?: 'Query';
  app: App;
  apps: Array<App>;
  client: Client;
  clients: Array<Client>;
  comment: Comment;
  comments: Array<Comment>;
  commentsFor: Array<Comment>;
  compositions: Array<Composition>;
  group: Group;
  groups: Array<Group>;
  hallo: Scalars['String']['output'];
  me: User;
  message: SystemMessage;
  myActiveMessages: Array<SystemMessage>;
  myManagedClients: Client;
  myMentions: Comment;
  myStashes: Array<Stash>;
  mygroups: Array<Group>;
  redeemTokens: Array<RedeemToken>;
  release: Release;
  releases: Array<Release>;
  room: Room;
  rooms: Array<Room>;
  scopes: Array<Scope>;
  stash: Stash;
  stashItem: StashItem;
  stashItems: Array<StashItem>;
  stashes: Array<Stash>;
  user: User;
  users: Array<User>;
};


export type QueryAppArgs = {
  clientId?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  identifier?: InputMaybe<Scalars['AppIdentifier']['input']>;
};


export type QueryClientArgs = {
  clientId?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryClientsArgs = {
  filters?: InputMaybe<ClientFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryCommentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentsForArgs = {
  identifier: Scalars['Identifier']['input'];
  object: Scalars['ID']['input'];
};


export type QueryGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGroupsArgs = {
  filters?: InputMaybe<GroupFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMessageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMyManagedClientsArgs = {
  kind: ClientKind;
};


export type QueryRedeemTokensArgs = {
  filters?: InputMaybe<RedeemTokenFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryReleaseArgs = {
  clientId?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  identifier?: InputMaybe<Scalars['AppIdentifier']['input']>;
  version?: InputMaybe<Scalars['Version']['input']>;
};


export type QueryRoomArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoomsArgs = {
  filters?: InputMaybe<RoomFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStashArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStashItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStashItemsArgs = {
  filters?: InputMaybe<StashItemFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryStashesArgs = {
  filters?: InputMaybe<StashFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  filters?: InputMaybe<UserFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/**
 * A redeem token is a token that can be used to redeed the rights to create
 * a client. It is used to give the recipient the right to create a client.
 *
 * If the token is not redeemed within the expires_at time, it will be invalid.
 * If the token has been redeemed, but the manifest has changed, the token will be invalid.
 */
export type RedeemToken = {
  __typename?: 'RedeemToken';
  /** The client that this redeem token belongs to. */
  client?: Maybe<Client>;
  id: Scalars['ID']['output'];
  /** The token of the redeem token */
  token: Scalars['String']['output'];
  /** The user that this redeem token belongs to. */
  user: User;
};

/**
 * A redeem token is a token that can be used to redeed the rights to create
 * a client. It is used to give the recipient the right to create a client.
 *
 * If the token is not redeemed within the expires_at time, it will be invalid.
 * If the token has been redeemed, but the manifest has changed, the token will be invalid.
 */
export type RedeemTokenFilter = {
  AND?: InputMaybe<RedeemTokenFilter>;
  OR?: InputMaybe<RedeemTokenFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** A Release is a version of an app. Releases might change over time. E.g. a release might be updated to fix a bug, and the release might be updated to add a new feature. This is why they are the home for `scopes` and `requirements`, which might change over the release cycle. */
export type Release = {
  __typename?: 'Release';
  /** The app that this release belongs to. */
  app: App;
  /** The clients of the release */
  clients: Array<Client>;
  id: Scalars['ID']['output'];
  /** The logo of the release. This should be a url to a logo that can be used to represent the release. */
  logo?: Maybe<Scalars['String']['output']>;
  /** The name of the release. This should be a string that identifies the release beyond the version number. E.g. `canary`. */
  name: Scalars['String']['output'];
  /** The requirements of the release. Requirements are used to limit the access of a client to a user's data. They represent app-level permissions. */
  requirements: Array<Scalars['String']['output']>;
  /** The scopes of the release. Scopes are used to limit the access of a client to a user's data. They represent app-level permissions. */
  scopes: Array<Scalars['String']['output']>;
  /** The version of the release. This should be a string that identifies the version of the release. We enforce semantic versioning notation. E.g. `0.1.0`. The version is unique per app. */
  version: Scalars['Version']['output'];
};


/** A Release is a version of an app. Releases might change over time. E.g. a release might be updated to fix a bug, and the release might be updated to add a new feature. This is why they are the home for `scopes` and `requirements`, which might change over the release cycle. */
export type ReleaseClientsArgs = {
  filters?: InputMaybe<ClientFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type RenderInput = {
  client: Scalars['ID']['input'];
  composition?: InputMaybe<Scalars['ID']['input']>;
  manifest?: InputMaybe<ManifestInput>;
  request?: InputMaybe<LinkingRequestInput>;
};

export type ReplyToCommentInput = {
  descendants: Array<DescendantInput>;
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
};

export type Requirement = {
  description?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  optional?: Scalars['Boolean']['input'];
  service: Scalars['String']['input'];
};

export type ResolveCommentInput = {
  id: Scalars['ID']['input'];
  notify?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Room(id, title, description, creator) */
export type Room = {
  __typename?: 'Room';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  messages: Array<Message>;
  /** The Title of the Room */
  title: Scalars['String']['output'];
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
  OR?: InputMaybe<RoomFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ScanBackendInput = {
  backend?: InputMaybe<Scalars['String']['input']>;
};

/** A scope that can be assigned to a client. Scopes are used to limit the access of a client to a user's data. They represent app-level permissions. */
export type Scope = {
  __typename?: 'Scope';
  /** The description of the scope. This is a human readable description of the scope. */
  description: Scalars['String']['output'];
  /** The label of the scope. This is the human readable name of the scope. */
  label: Scalars['String']['output'];
  /** The value of the scope. This is the value that is used in the OAuth2 flow. */
  value: Scalars['String']['output'];
};

export type SendMessageInput = {
  agentId: Scalars['String']['input'];
  attachStructures?: InputMaybe<Array<StructureInput>>;
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  room: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};

/** A Service is a Webservice that a Client might want to access. It is not the configured instance of the service, but the service itself. */
export type Service = {
  __typename?: 'Service';
  /** The description of the service. This should be a human readable description of the service. */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The identifier of the service. This should be a globally unique string that identifies the service. We encourage you to use the reverse domain name notation. E.g. `com.example.myservice` */
  identifier: Scalars['ServiceIdentifier']['output'];
  /** The key of the service. This is a unique string that identifies the service. It is used to identify the service in the code and in the database. */
  key: Scalars['String']['output'];
  /** The logo of the service. This should be a url to a logo that can be used to represent the service. */
  logo: Scalars['String']['output'];
  /** The name of the service */
  name: Scalars['String']['output'];
};

/** A ServiceInstance is a configured instance of a Service. It will be configured by a configuration backend and will be used to send to the client as a configuration. It should never contain sensitive information. */
export type ServiceInstance = {
  __typename?: 'ServiceInstance';
  /** The backend that this instance belongs to. */
  backend: BackendType;
  /** The composition that this instance belongs to. */
  composition: Composition;
  id: Scalars['ID']['output'];
  /** The identifier of the instance. This is a unique string that identifies the instance. It is used to identify the instance in the code and in the database. */
  identifier: Scalars['String']['output'];
  /** The name of the instance. This is a human readable name of the instance. */
  name: Scalars['String']['output'];
  /** The service that this instance belongs to. */
  service: Service;
};

/** A ServiceInstance is a configured instance of a Service. It will be configured by a configuration backend and will be used to send to the client as a configuration. It should never contain sensitive information. */
export type ServiceInstanceMapping = {
  __typename?: 'ServiceInstanceMapping';
  /** The composition that this instance belongs to. */
  composition: Composition;
  id: Scalars['ID']['output'];
  /** The service that this instance belongs to. */
  instance: ServiceInstance;
  /** The key of the instance. This is a unique string that identifies the instance. It is used to identify the instance in the code and in the database. */
  key: Scalars['String']['output'];
};

/**
 *
 * A Social Account is an account that is associated with a user. It can be used to authenticate the user with external services. It
 * can be used to store extra data about the user that is specific to the provider. We provide typed access to the extra data for
 * some providers. For others we provide a generic json field that can be used to store arbitrary data. Generic accounts are
 * always available, but typed accounts are only available for some providers.
 *
 */
export type SocialAccount = {
  /** Extra data that is specific to the provider. This is a json field and can be used to store arbitrary data. */
  extraData: Scalars['ExtraData']['output'];
  /** The provider of the account. This can be used to determine the type of the account. */
  provider: ProviderType;
  /** The unique identifier of the account. This is unique for the provider. */
  uid: Scalars['String']['output'];
};

/** SocialAccount(id, user, provider, uid, last_login, date_joined, extra_data) */
export type SocialAccountFilter = {
  AND?: InputMaybe<SocialAccountFilter>;
  OR?: InputMaybe<SocialAccountFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  provider?: InputMaybe<ProviderType>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/**
 *
 * A Stash
 *
 */
export type Stash = {
  __typename?: 'Stash';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  items: Array<StashItem>;
  name: Scalars['String']['output'];
  /** The number of items in the stash */
  owner: User;
  updatedAt: Scalars['DateTime']['output'];
};


/**
 *
 * A Stash
 *
 */
export type StashItemsArgs = {
  filters?: InputMaybe<StashItemFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** __doc__ */
export type StashFilter = {
  AND?: InputMaybe<StashFilter>;
  OR?: InputMaybe<StashFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/**
 *
 * A stashed item
 *
 */
export type StashItem = {
  __typename?: 'StashItem';
  addedAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  object: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** StashItem(id, stash, identifier, object, added_by, added_at, updated_at) */
export type StashItemFilter = {
  AND?: InputMaybe<StashItemFilter>;
  OR?: InputMaybe<StashItemFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  stashes?: InputMaybe<Array<Scalars['ID']['input']>>;
  username?: InputMaybe<StrFilterLookup>;
};

export type StashItemInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier: Scalars['String']['input'];
  object: Scalars['String']['input'];
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
  communications: Communication;
  mentions: Comment;
  room: RoomEvent;
};


export type SubscriptionCommunicationsArgs = {
  channels: Array<Scalars['ID']['input']>;
};


export type SubscriptionRoomArgs = {
  agentId: Scalars['ID']['input'];
  filterOwn?: Scalars['Boolean']['input'];
  room: Scalars['ID']['input'];
};

/**
 *
 * A System Message is a message that is sent to a user.
 * It can be used to notify the user of important events or to request their attention.
 * System messages can use Rekuest Hooks as actions to allow the user to interact with the message.
 *
 *
 *
 */
export type SystemMessage = {
  __typename?: 'SystemMessage';
  /** The action to take (e.g. the node) */
  action: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  title: Scalars['String']['output'];
  user: User;
};

export type UpdateStashInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  stash: Scalars['ID']['input'];
};

/**
 *
 * A User is a person that can log in to the system. They are uniquely identified by their username.
 * And can have an email address associated with them (but don't have to).
 *
 * A user can be assigned to groups and has a profile that can be used to display information about them.
 * Detail information about a user can be found in the profile.
 *
 * All users can have social accounts associated with them. These are used to authenticate the user with external services,
 * such as ORCID or GitHub.
 *
 *
 */
export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  /** The groups this user belongs to. A user will get all permissions granted to each of their groups. */
  groups: Array<Group>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  managedClients: Array<DjangoModelType>;
  profile: Profile;
  socialAccounts: Array<SocialAccount>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
};


/**
 *
 * A User is a person that can log in to the system. They are uniquely identified by their username.
 * And can have an email address associated with them (but don't have to).
 *
 * A user can be assigned to groups and has a profile that can be used to display information about them.
 * Detail information about a user can be found in the profile.
 *
 * All users can have social accounts associated with them. These are used to authenticate the user with external services,
 * such as ORCID or GitHub.
 *
 *
 */
export type UserGroupsArgs = {
  filters?: InputMaybe<GroupFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/**
 * A User of the System
 *
 * Lok Users are the main users of the system. They can be assigned to groups and have profiles, that can be used to display information about them.
 * Each user is identifier by a unique username, and can have an email address associated with them.
 */
export type UserFilter = {
  AND?: InputMaybe<UserFilter>;
  OR?: InputMaybe<UserFilter>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  socialAccounts?: InputMaybe<SocialAccountFilter>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username?: InputMaybe<StrFilterLookup>;
};

export type DetailAppFragment = { __typename?: 'App', id: string, identifier: any, logo?: string | null, releases: Array<(
    { __typename?: 'Release' }
    & { ' $fragmentRefs'?: { 'ListReleaseFragment': ListReleaseFragment } }
  )> } & { ' $fragmentName'?: 'DetailAppFragment' };

export type ListAppFragment = { __typename?: 'App', id: string, identifier: any, logo?: string | null } & { ' $fragmentName'?: 'ListAppFragment' };

export type DetailClientFragment = { __typename?: 'Client', id: string, token: string, kind: ClientKind, user?: { __typename?: 'User', username: string } | null, release: (
    { __typename?: 'Release' }
    & { ' $fragmentRefs'?: { 'ListReleaseFragment': ListReleaseFragment } }
  ), oauth2Client: { __typename?: 'Oauth2Client', authorizationGrantType: string, redirectUris: string }, composition: (
    { __typename?: 'Composition' }
    & { ' $fragmentRefs'?: { 'DetailCompositionFragment': DetailCompositionFragment } }
  ) } & { ' $fragmentName'?: 'DetailClientFragment' };

export type ListClientFragment = { __typename?: 'Client', id: string, kind: ClientKind, user?: { __typename?: 'User', username: string } | null, release: { __typename?: 'Release', version: any, logo?: string | null, app: { __typename?: 'App', id: string, identifier: any, logo?: string | null } }, composition: { __typename?: 'Composition', id: string } } & { ' $fragmentName'?: 'ListClientFragment' };

export type LeafFragment = { __typename?: 'LeafDescendant', bold?: boolean | null, italic?: boolean | null, code?: string | null, text?: string | null } & { ' $fragmentName'?: 'LeafFragment' };

export type CommentUserFragment = { __typename?: 'User', id: string, username: string, avatar?: string | null } & { ' $fragmentName'?: 'CommentUserFragment' };

export type MentionFragment = { __typename?: 'MentionDescendant', user?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'CommentUserFragment': CommentUserFragment } }
  ) | null } & { ' $fragmentName'?: 'MentionFragment' };

export type ParagraphFragment = { __typename?: 'ParagraphDescendant', size?: string | null } & { ' $fragmentName'?: 'ParagraphFragment' };

type Descendant_LeafDescendant_Fragment = (
  { __typename?: 'LeafDescendant', kind: DescendantKind, children?: Array<(
    { __typename?: 'LeafDescendant', kind: DescendantKind, children?: Array<(
      { __typename?: 'LeafDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
    ) | (
      { __typename?: 'MentionDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
    ) | (
      { __typename?: 'ParagraphDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
    )> | null }
    & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
  ) | (
    { __typename?: 'MentionDescendant', kind: DescendantKind, children?: Array<(
      { __typename?: 'LeafDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
    ) | (
      { __typename?: 'MentionDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
    ) | (
      { __typename?: 'ParagraphDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
    )> | null }
    & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
  ) | (
    { __typename?: 'ParagraphDescendant', kind: DescendantKind, children?: Array<(
      { __typename?: 'LeafDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
    ) | (
      { __typename?: 'MentionDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
    ) | (
      { __typename?: 'ParagraphDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
    )> | null }
    & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
  )> | null }
  & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
) & { ' $fragmentName'?: 'Descendant_LeafDescendant_Fragment' };

type Descendant_MentionDescendant_Fragment = (
  { __typename?: 'MentionDescendant', kind: DescendantKind, children?: Array<(
    { __typename?: 'LeafDescendant', kind: DescendantKind, children?: Array<(
      { __typename?: 'LeafDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
    ) | (
      { __typename?: 'MentionDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
    ) | (
      { __typename?: 'ParagraphDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
    )> | null }
    & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
  ) | (
    { __typename?: 'MentionDescendant', kind: DescendantKind, children?: Array<(
      { __typename?: 'LeafDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
    ) | (
      { __typename?: 'MentionDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
    ) | (
      { __typename?: 'ParagraphDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
    )> | null }
    & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
  ) | (
    { __typename?: 'ParagraphDescendant', kind: DescendantKind, children?: Array<(
      { __typename?: 'LeafDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
    ) | (
      { __typename?: 'MentionDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
    ) | (
      { __typename?: 'ParagraphDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
    )> | null }
    & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
  )> | null }
  & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
) & { ' $fragmentName'?: 'Descendant_MentionDescendant_Fragment' };

type Descendant_ParagraphDescendant_Fragment = (
  { __typename?: 'ParagraphDescendant', kind: DescendantKind, children?: Array<(
    { __typename?: 'LeafDescendant', kind: DescendantKind, children?: Array<(
      { __typename?: 'LeafDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
    ) | (
      { __typename?: 'MentionDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
    ) | (
      { __typename?: 'ParagraphDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
    )> | null }
    & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
  ) | (
    { __typename?: 'MentionDescendant', kind: DescendantKind, children?: Array<(
      { __typename?: 'LeafDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
    ) | (
      { __typename?: 'MentionDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
    ) | (
      { __typename?: 'ParagraphDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
    )> | null }
    & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
  ) | (
    { __typename?: 'ParagraphDescendant', kind: DescendantKind, children?: Array<(
      { __typename?: 'LeafDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'LeafFragment': LeafFragment } }
    ) | (
      { __typename?: 'MentionDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'MentionFragment': MentionFragment } }
    ) | (
      { __typename?: 'ParagraphDescendant', kind: DescendantKind, unsafeChildren?: Array<any> | null }
      & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
    )> | null }
    & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
  )> | null }
  & { ' $fragmentRefs'?: { 'ParagraphFragment': ParagraphFragment } }
) & { ' $fragmentName'?: 'Descendant_ParagraphDescendant_Fragment' };

export type DescendantFragment = Descendant_LeafDescendant_Fragment | Descendant_MentionDescendant_Fragment | Descendant_ParagraphDescendant_Fragment;

export type SubthreadCommentFragment = { __typename?: 'Comment', createdAt: any, user: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'CommentUserFragment': CommentUserFragment } }
  ), parent?: { __typename?: 'Comment', id: string } | null, descendants: Array<(
    { __typename?: 'LeafDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_LeafDescendant_Fragment': Descendant_LeafDescendant_Fragment } }
  ) | (
    { __typename?: 'MentionDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_MentionDescendant_Fragment': Descendant_MentionDescendant_Fragment } }
  ) | (
    { __typename?: 'ParagraphDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_ParagraphDescendant_Fragment': Descendant_ParagraphDescendant_Fragment } }
  )> } & { ' $fragmentName'?: 'SubthreadCommentFragment' };

export type ListCommentFragment = { __typename?: 'Comment', resolved: boolean, id: string, createdAt: any, user: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'CommentUserFragment': CommentUserFragment } }
  ), parent?: { __typename?: 'Comment', id: string } | null, descendants: Array<(
    { __typename?: 'LeafDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_LeafDescendant_Fragment': Descendant_LeafDescendant_Fragment } }
  ) | (
    { __typename?: 'MentionDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_MentionDescendant_Fragment': Descendant_MentionDescendant_Fragment } }
  ) | (
    { __typename?: 'ParagraphDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_ParagraphDescendant_Fragment': Descendant_ParagraphDescendant_Fragment } }
  )>, resolvedBy?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'CommentUserFragment': CommentUserFragment } }
  ) | null, children: Array<(
    { __typename?: 'Comment' }
    & { ' $fragmentRefs'?: { 'SubthreadCommentFragment': SubthreadCommentFragment } }
  )> } & { ' $fragmentName'?: 'ListCommentFragment' };

export type MentionCommentFragment = { __typename?: 'Comment', id: string, createdAt: any, resolved: boolean, object: string, identifier: any, user: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'CommentUserFragment': CommentUserFragment } }
  ), parent?: { __typename?: 'Comment', id: string } | null, descendants: Array<(
    { __typename?: 'LeafDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_LeafDescendant_Fragment': Descendant_LeafDescendant_Fragment } }
  ) | (
    { __typename?: 'MentionDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_MentionDescendant_Fragment': Descendant_MentionDescendant_Fragment } }
  ) | (
    { __typename?: 'ParagraphDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_ParagraphDescendant_Fragment': Descendant_ParagraphDescendant_Fragment } }
  )>, children: Array<(
    { __typename?: 'Comment' }
    & { ' $fragmentRefs'?: { 'SubthreadCommentFragment': SubthreadCommentFragment } }
  )>, mentions: Array<(
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'CommentUserFragment': CommentUserFragment } }
  )>, resolvedBy?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'CommentUserFragment': CommentUserFragment } }
  ) | null } & { ' $fragmentName'?: 'MentionCommentFragment' };

export type DetailCommentFragment = { __typename?: 'Comment', id: string, resolved: boolean, createdAt: any, object: string, identifier: any, user: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'CommentUserFragment': CommentUserFragment } }
  ), parent?: { __typename?: 'Comment', id: string } | null, descendants: Array<(
    { __typename?: 'LeafDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_LeafDescendant_Fragment': Descendant_LeafDescendant_Fragment } }
  ) | (
    { __typename?: 'MentionDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_MentionDescendant_Fragment': Descendant_MentionDescendant_Fragment } }
  ) | (
    { __typename?: 'ParagraphDescendant' }
    & { ' $fragmentRefs'?: { 'Descendant_ParagraphDescendant_Fragment': Descendant_ParagraphDescendant_Fragment } }
  )>, resolvedBy?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'CommentUserFragment': CommentUserFragment } }
  ) | null, children: Array<(
    { __typename?: 'Comment' }
    & { ' $fragmentRefs'?: { 'SubthreadCommentFragment': SubthreadCommentFragment } }
  )>, mentions: Array<(
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'CommentUserFragment': CommentUserFragment } }
  )> } & { ' $fragmentName'?: 'DetailCommentFragment' };

export type DetailCompositionFragment = { __typename?: 'Composition', name: string, mappings: Array<(
    { __typename?: 'ServiceInstanceMapping' }
    & { ' $fragmentRefs'?: { 'ListServiceInstanceMappingFragment': ListServiceInstanceMappingFragment } }
  )> } & { ' $fragmentName'?: 'DetailCompositionFragment' };

export type DetailGroupFragment = { __typename?: 'Group', id: string, name: string, users: Array<(
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'ListUserFragment': ListUserFragment } }
  )> } & { ' $fragmentName'?: 'DetailGroupFragment' };

export type ListGroupFragment = { __typename?: 'Group', id: string, name: string } & { ' $fragmentName'?: 'ListGroupFragment' };

export type MessageFragment = { __typename?: 'Message', id: string, text: string, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> } & { ' $fragmentName'?: 'MessageFragment' };

export type ListMessageFragment = { __typename?: 'Message', id: string, text: string, agent: { __typename?: 'Agent', id: string }, attachedStructures: Array<{ __typename?: 'Structure', identifier: string, object: string }> } & { ' $fragmentName'?: 'ListMessageFragment' };

export type ListRedeemTokenFragment = { __typename?: 'RedeemToken', id: string, token: string, user: { __typename?: 'User', id: string, email?: string | null }, client?: { __typename?: 'Client', id: string, release: { __typename?: 'Release', version: any, app: { __typename?: 'App', identifier: any } } } | null } & { ' $fragmentName'?: 'ListRedeemTokenFragment' };

export type DetailReleaseFragment = { __typename?: 'Release', id: string, version: any, logo?: string | null, app: (
    { __typename?: 'App' }
    & { ' $fragmentRefs'?: { 'ListAppFragment': ListAppFragment } }
  ), clients: Array<(
    { __typename?: 'Client' }
    & { ' $fragmentRefs'?: { 'ListClientFragment': ListClientFragment } }
  )> } & { ' $fragmentName'?: 'DetailReleaseFragment' };

export type ListReleaseFragment = { __typename?: 'Release', id: string, version: any, logo?: string | null, app: (
    { __typename?: 'App' }
    & { ' $fragmentRefs'?: { 'ListAppFragment': ListAppFragment } }
  ) } & { ' $fragmentName'?: 'ListReleaseFragment' };

export type DetailRoomFragment = { __typename?: 'Room', id: string, title: string, description: string, messages: Array<(
    { __typename?: 'Message' }
    & { ' $fragmentRefs'?: { 'ListMessageFragment': ListMessageFragment } }
  )> } & { ' $fragmentName'?: 'DetailRoomFragment' };

export type ListServiceInstanceMappingFragment = { __typename?: 'ServiceInstanceMapping', id: string, key: string, instance: { __typename?: 'ServiceInstance', backend: BackendType, service: { __typename?: 'Service', identifier: any } } } & { ' $fragmentName'?: 'ListServiceInstanceMappingFragment' };

export type StashFragment = { __typename?: 'Stash', id: string, name: string, description?: string | null, createdAt: any, updatedAt: any, owner: { __typename?: 'User', id: string, username: string } } & { ' $fragmentName'?: 'StashFragment' };

export type ListStashFragment = (
  { __typename?: 'Stash', items: Array<(
    { __typename?: 'StashItem' }
    & { ' $fragmentRefs'?: { 'StashItemFragment': StashItemFragment } }
  )> }
  & { ' $fragmentRefs'?: { 'StashFragment': StashFragment } }
) & { ' $fragmentName'?: 'ListStashFragment' };

export type StashItemFragment = { __typename?: 'StashItem', id: string, identifier: string, object: string } & { ' $fragmentName'?: 'StashItemFragment' };

export type ListUserFragment = { __typename?: 'User', username: string, firstName?: string | null, lastName?: string | null, email?: string | null, avatar?: string | null, id: string } & { ' $fragmentName'?: 'ListUserFragment' };

export type DetailUserFragment = { __typename?: 'User', id: string, username: string, email?: string | null, firstName?: string | null, lastName?: string | null, avatar?: string | null, groups: Array<{ __typename?: 'Group', id: string, name: string }> } & { ' $fragmentName'?: 'DetailUserFragment' };

export type MeUserFragment = { __typename?: 'User', id: string, username: string, email?: string | null, firstName?: string | null, lastName?: string | null, avatar?: string | null } & { ' $fragmentName'?: 'MeUserFragment' };

export type CreateClientMutationVariables = Exact<{
  identifier: Scalars['String']['input'];
  version: Scalars['String']['input'];
  scopes: Array<Scalars['String']['input']> | Scalars['String']['input'];
  logo?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateClientMutation = { __typename?: 'Mutation', createDevelopmentalClient: string };

export type CreateCommentMutationVariables = Exact<{
  object: Scalars['ID']['input'];
  identifier: Scalars['Identifier']['input'];
  descendants: Array<DescendantInput> | DescendantInput;
  parent?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: (
    { __typename?: 'Comment' }
    & { ' $fragmentRefs'?: { 'ListCommentFragment': ListCommentFragment } }
  ) };

export type ReplyToMutationVariables = Exact<{
  descendants: Array<DescendantInput> | DescendantInput;
  parent: Scalars['ID']['input'];
}>;


export type ReplyToMutation = { __typename?: 'Mutation', replyTo: (
    { __typename?: 'Comment' }
    & { ' $fragmentRefs'?: { 'ListCommentFragment': ListCommentFragment } }
  ) };

export type ResolveCommentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ResolveCommentMutation = { __typename?: 'Mutation', resolveComment: (
    { __typename?: 'Comment' }
    & { ' $fragmentRefs'?: { 'ListCommentFragment': ListCommentFragment } }
  ) };

export type AcknowledgeMessageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  ack: Scalars['Boolean']['input'];
}>;


export type AcknowledgeMessageMutation = { __typename?: 'Mutation', acknowledgeMessage: { __typename?: 'SystemMessage', id: string } };

export type SendMessageMutationVariables = Exact<{
  text: Scalars['String']['input'];
  room: Scalars['ID']['input'];
  agentId: Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', send: (
    { __typename?: 'Message' }
    & { ' $fragmentRefs'?: { 'MessageFragment': MessageFragment } }
  ) };

export type CreateRoomMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'Room', id: string, title: string } };

export type CreateStashMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateStashMutation = { __typename?: 'Mutation', createStash: (
    { __typename?: 'Stash' }
    & { ' $fragmentRefs'?: { 'ListStashFragment': ListStashFragment } }
  ) };

export type AddItemsToStashMutationVariables = Exact<{
  stash: Scalars['ID']['input'];
  items: Array<StashItemInput> | StashItemInput;
}>;


export type AddItemsToStashMutation = { __typename?: 'Mutation', addItemsToStash: Array<(
    { __typename?: 'StashItem' }
    & { ' $fragmentRefs'?: { 'StashItemFragment': StashItemFragment } }
  )> };

export type DeleteStashItemsMutationVariables = Exact<{
  items: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteStashItemsMutation = { __typename?: 'Mutation', deleteStashItems: Array<string> };

export type DeleteStashMutationVariables = Exact<{
  stash: Scalars['ID']['input'];
}>;


export type DeleteStashMutation = { __typename?: 'Mutation', deleteStash: string };

export type AppsQueryVariables = Exact<{ [key: string]: never; }>;


export type AppsQuery = { __typename?: 'Query', apps: Array<(
    { __typename?: 'App' }
    & { ' $fragmentRefs'?: { 'ListAppFragment': ListAppFragment } }
  )> };

export type AppQueryVariables = Exact<{
  identifier?: InputMaybe<Scalars['AppIdentifier']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  clientId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type AppQuery = { __typename?: 'Query', app: (
    { __typename?: 'App' }
    & { ' $fragmentRefs'?: { 'DetailAppFragment': DetailAppFragment } }
  ) };

export type ClientsQueryVariables = Exact<{
  filters?: InputMaybe<ClientFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type ClientsQuery = { __typename?: 'Query', clients: Array<(
    { __typename?: 'Client' }
    & { ' $fragmentRefs'?: { 'ListClientFragment': ListClientFragment } }
  )> };

export type DetailClientQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailClientQuery = { __typename?: 'Query', client: (
    { __typename?: 'Client' }
    & { ' $fragmentRefs'?: { 'DetailClientFragment': DetailClientFragment } }
  ) };

export type MyManagedClientsQueryVariables = Exact<{
  kind: ClientKind;
}>;


export type MyManagedClientsQuery = { __typename?: 'Query', myManagedClients: (
    { __typename?: 'Client' }
    & { ' $fragmentRefs'?: { 'ListClientFragment': ListClientFragment } }
  ) };

export type ClientQueryVariables = Exact<{
  clientId: Scalars['ID']['input'];
}>;


export type ClientQuery = { __typename?: 'Query', client: (
    { __typename?: 'Client' }
    & { ' $fragmentRefs'?: { 'DetailClientFragment': DetailClientFragment } }
  ) };

export type CommentsForQueryVariables = Exact<{
  object: Scalars['ID']['input'];
  identifier: Scalars['Identifier']['input'];
}>;


export type CommentsForQuery = { __typename?: 'Query', commentsFor: Array<(
    { __typename?: 'Comment' }
    & { ' $fragmentRefs'?: { 'ListCommentFragment': ListCommentFragment } }
  )> };

export type MyMentionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyMentionsQuery = { __typename?: 'Query', myMentions: (
    { __typename?: 'Comment' }
    & { ' $fragmentRefs'?: { 'MentionCommentFragment': MentionCommentFragment } }
  ) };

export type DetailCommentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailCommentQuery = { __typename?: 'Query', comment: (
    { __typename?: 'Comment' }
    & { ' $fragmentRefs'?: { 'DetailCommentFragment': DetailCommentFragment } }
  ) };

export type GroupOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GroupOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Group', value: string, label: string }> };

export type DetailGroupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailGroupQuery = { __typename?: 'Query', group: (
    { __typename?: 'Group' }
    & { ' $fragmentRefs'?: { 'DetailGroupFragment': DetailGroupFragment } }
  ) };

export type MyActiveMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyActiveMessagesQuery = { __typename?: 'Query', myActiveMessages: Array<{ __typename?: 'SystemMessage', id: string, title: string, message: string, action: string }> };

export type RedeemTokensQueryVariables = Exact<{
  filters?: InputMaybe<RedeemTokenFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type RedeemTokensQuery = { __typename?: 'Query', redeemTokens: Array<(
    { __typename?: 'RedeemToken' }
    & { ' $fragmentRefs'?: { 'ListRedeemTokenFragment': ListRedeemTokenFragment } }
  )> };

export type ReleasesQueryVariables = Exact<{ [key: string]: never; }>;


export type ReleasesQuery = { __typename?: 'Query', releases: Array<(
    { __typename?: 'Release' }
    & { ' $fragmentRefs'?: { 'ListReleaseFragment': ListReleaseFragment } }
  )> };

export type ReleaseQueryVariables = Exact<{
  identifier?: InputMaybe<Scalars['AppIdentifier']['input']>;
  version?: InputMaybe<Scalars['Version']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  clientId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type ReleaseQuery = { __typename?: 'Query', release: (
    { __typename?: 'Release' }
    & { ' $fragmentRefs'?: { 'DetailReleaseFragment': DetailReleaseFragment } }
  ) };

export type DetailRoomQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailRoomQuery = { __typename?: 'Query', room: (
    { __typename?: 'Room' }
    & { ' $fragmentRefs'?: { 'DetailRoomFragment': DetailRoomFragment } }
  ) };

export type RoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type RoomsQuery = { __typename?: 'Query', rooms: Array<{ __typename?: 'Room', id: string, title: string, description: string, messages: Array<(
      { __typename?: 'Message' }
      & { ' $fragmentRefs'?: { 'ListMessageFragment': ListMessageFragment } }
    )> }> };

export type ScopesQueryVariables = Exact<{ [key: string]: never; }>;


export type ScopesQuery = { __typename?: 'Query', scopes: Array<{ __typename?: 'Scope', description: string, value: string, label: string }> };

export type ScopesOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ScopesOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'Scope', value: string, label: string }> };

export type GlobalSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  noUsers: Scalars['Boolean']['input'];
  noGroups: Scalars['Boolean']['input'];
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', users?: Array<(
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'ListUserFragment': ListUserFragment } }
  )>, groups?: Array<(
    { __typename?: 'Group' }
    & { ' $fragmentRefs'?: { 'ListGroupFragment': ListGroupFragment } }
  )> };

export type MyStashesQueryVariables = Exact<{
  pagination?: InputMaybe<OffsetPaginationInput>;
}>;


export type MyStashesQuery = { __typename?: 'Query', stashes: Array<(
    { __typename?: 'Stash' }
    & { ' $fragmentRefs'?: { 'ListStashFragment': ListStashFragment } }
  )> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'DetailUserFragment': DetailUserFragment } }
  ) };

export type UserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserQuery = { __typename?: 'Query', user: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'DetailUserFragment': DetailUserFragment } }
  ) };

export type DetailUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailUserQuery = { __typename?: 'Query', user: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'DetailUserFragment': DetailUserFragment } }
  ) };

export type UserOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type UserOptionsQuery = { __typename?: 'Query', options: Array<{ __typename?: 'User', value: string, label: string }> };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { __typename?: 'Query', me: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'MeUserFragment': MeUserFragment } }
  ) };

export type WatchMentionsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type WatchMentionsSubscription = { __typename?: 'Subscription', mentions: (
    { __typename?: 'Comment' }
    & { ' $fragmentRefs'?: { 'MentionCommentFragment': MentionCommentFragment } }
  ) };

export type WatchMessagesSubscriptionVariables = Exact<{
  room: Scalars['ID']['input'];
  agentId: Scalars['ID']['input'];
}>;


export type WatchMessagesSubscription = { __typename?: 'Subscription', room: { __typename?: 'RoomEvent', message?: (
      { __typename?: 'Message' }
      & { ' $fragmentRefs'?: { 'ListMessageFragment': ListMessageFragment } }
    ) | null } };

export const ListAppFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}}]} as unknown as DocumentNode<ListAppFragment, unknown>;
export const ListReleaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListRelease"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Release"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListApp"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}}]} as unknown as DocumentNode<ListReleaseFragment, unknown>;
export const DetailAppFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"releases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListRelease"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListRelease"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Release"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListApp"}}]}}]}}]} as unknown as DocumentNode<DetailAppFragment, unknown>;
export const ListServiceInstanceMappingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListServiceInstanceMapping"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceInstanceMapping"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backend"}}]}}]}}]} as unknown as DocumentNode<ListServiceInstanceMappingFragment, unknown>;
export const DetailCompositionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailComposition"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mappings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListServiceInstanceMapping"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListServiceInstanceMapping"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceInstanceMapping"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backend"}}]}}]}}]} as unknown as DocumentNode<DetailCompositionFragment, unknown>;
export const DetailClientFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Client"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListRelease"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oauth2Client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authorizationGrantType"}},{"kind":"Field","name":{"kind":"Name","value":"redirectUris"}}]}},{"kind":"Field","name":{"kind":"Name","value":"composition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailComposition"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListServiceInstanceMapping"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceInstanceMapping"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backend"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListRelease"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Release"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListApp"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailComposition"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mappings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListServiceInstanceMapping"}}]}}]}}]} as unknown as DocumentNode<DetailClientFragment, unknown>;
export const CommentUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<CommentUserFragment, unknown>;
export const LeafFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]} as unknown as DocumentNode<LeafFragment, unknown>;
export const MentionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<MentionFragment, unknown>;
export const ParagraphFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]} as unknown as DocumentNode<ParagraphFragment, unknown>;
export const DescendantFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]} as unknown as DocumentNode<DescendantFragment, unknown>;
export const SubthreadCommentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubthreadComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}}]} as unknown as DocumentNode<SubthreadCommentFragment, unknown>;
export const ListCommentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubthreadComment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubthreadComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}}]}}]} as unknown as DocumentNode<ListCommentFragment, unknown>;
export const MentionCommentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubthreadComment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubthreadComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}}]}}]} as unknown as DocumentNode<MentionCommentFragment, unknown>;
export const DetailCommentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubthreadComment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubthreadComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}}]}}]} as unknown as DocumentNode<DetailCommentFragment, unknown>;
export const ListUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]} as unknown as DocumentNode<ListUserFragment, unknown>;
export const DetailGroupFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]} as unknown as DocumentNode<DetailGroupFragment, unknown>;
export const ListGroupFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<ListGroupFragment, unknown>;
export const MessageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Message"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"agent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachedStructures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}}]}}]} as unknown as DocumentNode<MessageFragment, unknown>;
export const ListRedeemTokenFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListRedeemToken"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RedeemToken"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListRedeemTokenFragment, unknown>;
export const ListClientFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Client"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"composition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ListClientFragment, unknown>;
export const DetailReleaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailRelease"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Release"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListApp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"clients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListClient"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Client"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"composition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DetailReleaseFragment, unknown>;
export const ListMessageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"agent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachedStructures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}}]}}]} as unknown as DocumentNode<ListMessageFragment, unknown>;
export const DetailRoomFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailRoom"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListMessage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"agent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachedStructures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}}]}}]} as unknown as DocumentNode<DetailRoomFragment, unknown>;
export const StashFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Stash"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stash"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<StashFragment, unknown>;
export const StashItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StashItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StashItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}}]} as unknown as DocumentNode<StashItemFragment, unknown>;
export const ListStashFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListStash"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stash"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Stash"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StashItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Stash"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stash"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StashItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StashItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}}]} as unknown as DocumentNode<ListStashFragment, unknown>;
export const DetailUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DetailUserFragment, unknown>;
export const MeUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<MeUserFragment, unknown>;
export const CreateClientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateClient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"version"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scopes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"logo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDevelopmentalClient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"manifest"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"version"},"value":{"kind":"Variable","name":{"kind":"Name","value":"version"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"scopes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scopes"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"logo"}}}]}}]}}]}]}}]} as unknown as DocumentNode<CreateClientMutation, CreateClientMutationVariables>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Identifier"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"descendants"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DescendantInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"descendants"},"value":{"kind":"Variable","name":{"kind":"Name","value":"descendants"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"parent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parent"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListComment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubthreadComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubthreadComment"}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const ReplyToDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReplyTo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"descendants"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DescendantInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parent"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"replyTo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"descendants"},"value":{"kind":"Variable","name":{"kind":"Name","value":"descendants"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"parent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parent"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListComment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubthreadComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubthreadComment"}}]}}]}}]} as unknown as DocumentNode<ReplyToMutation, ReplyToMutationVariables>;
export const ResolveCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResolveComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resolveComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListComment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubthreadComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubthreadComment"}}]}}]}}]} as unknown as DocumentNode<ResolveCommentMutation, ResolveCommentMutationVariables>;
export const AcknowledgeMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcknowledgeMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ack"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acknowledgeMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"acknowledged"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ack"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AcknowledgeMessageMutation, AcknowledgeMessageMutationVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"room"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"send"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"room"},"value":{"kind":"Variable","name":{"kind":"Name","value":"room"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"agentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Message"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Message"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"agent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachedStructures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const CreateRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRoom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRoom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"StringValue","value":"Room 1","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<CreateRoomMutation, CreateRoomMutationVariables>;
export const CreateStashDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStash"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStash"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListStash"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Stash"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stash"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StashItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StashItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListStash"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stash"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Stash"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StashItem"}}]}}]}}]} as unknown as DocumentNode<CreateStashMutation, CreateStashMutationVariables>;
export const AddItemsToStashDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddItemsToStash"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"items"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StashItemInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addItemsToStash"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"stash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stash"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"items"},"value":{"kind":"Variable","name":{"kind":"Name","value":"items"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StashItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StashItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StashItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}}]} as unknown as DocumentNode<AddItemsToStashMutation, AddItemsToStashMutationVariables>;
export const DeleteStashItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteStashItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"items"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStashItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"items"},"value":{"kind":"Variable","name":{"kind":"Name","value":"items"}}}]}}]}]}}]} as unknown as DocumentNode<DeleteStashItemsMutation, DeleteStashItemsMutationVariables>;
export const DeleteStashDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteStash"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStash"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"stash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stash"}}}]}}]}]}}]} as unknown as DocumentNode<DeleteStashMutation, DeleteStashMutationVariables>;
export const AppsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Apps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListApp"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}}]} as unknown as DocumentNode<AppsQuery, AppsQueryVariables>;
export const AppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"App"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AppIdentifier"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailApp"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListRelease"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Release"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListApp"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"releases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListRelease"}}]}}]}}]} as unknown as DocumentNode<AppQuery, AppQueryVariables>;
export const ClientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Clients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ClientFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListClient"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Client"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"composition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ClientsQuery, ClientsQueryVariables>;
export const DetailClientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DetailClient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"client"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailClient"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListRelease"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Release"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListApp"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListServiceInstanceMapping"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceInstanceMapping"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backend"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailComposition"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mappings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListServiceInstanceMapping"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Client"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListRelease"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oauth2Client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authorizationGrantType"}},{"kind":"Field","name":{"kind":"Name","value":"redirectUris"}}]}},{"kind":"Field","name":{"kind":"Name","value":"composition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailComposition"}}]}}]}}]} as unknown as DocumentNode<DetailClientQuery, DetailClientQueryVariables>;
export const MyManagedClientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyManagedClients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"kind"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ClientKind"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myManagedClients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"kind"},"value":{"kind":"Variable","name":{"kind":"Name","value":"kind"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListClient"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Client"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"composition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MyManagedClientsQuery, MyManagedClientsQueryVariables>;
export const ClientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Client"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"client"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"clientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailClient"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListRelease"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Release"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListApp"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListServiceInstanceMapping"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceInstanceMapping"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backend"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailComposition"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mappings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListServiceInstanceMapping"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Client"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListRelease"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oauth2Client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authorizationGrantType"}},{"kind":"Field","name":{"kind":"Name","value":"redirectUris"}}]}},{"kind":"Field","name":{"kind":"Name","value":"composition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailComposition"}}]}}]}}]} as unknown as DocumentNode<ClientQuery, ClientQueryVariables>;
export const CommentsForDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommentsFor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Identifier"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commentsFor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListComment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubthreadComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubthreadComment"}}]}}]}}]} as unknown as DocumentNode<CommentsForQuery, CommentsForQueryVariables>;
export const MyMentionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyMentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myMentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionComment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubthreadComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubthreadComment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]} as unknown as DocumentNode<MyMentionsQuery, MyMentionsQueryVariables>;
export const DetailCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DetailComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailComment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubthreadComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubthreadComment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]} as unknown as DocumentNode<DetailCommentQuery, DetailCommentQueryVariables>;
export const GroupOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GroupOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"options"},"name":{"kind":"Name","value":"groups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"label"},"name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GroupOptionsQuery, GroupOptionsQueryVariables>;
export const DetailGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DetailGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailGroup"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListUser"}}]}}]}}]} as unknown as DocumentNode<DetailGroupQuery, DetailGroupQueryVariables>;
export const MyActiveMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyActiveMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myActiveMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"action"}}]}}]}}]} as unknown as DocumentNode<MyActiveMessagesQuery, MyActiveMessagesQueryVariables>;
export const RedeemTokensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RedeemTokens"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RedeemTokenFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"redeemTokens"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListRedeemToken"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListRedeemToken"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RedeemToken"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RedeemTokensQuery, RedeemTokensQueryVariables>;
export const ReleasesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Releases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"releases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListRelease"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListRelease"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Release"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListApp"}}]}}]}}]} as unknown as DocumentNode<ReleasesQuery, ReleasesQueryVariables>;
export const ReleaseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Release"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AppIdentifier"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"version"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Version"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"release"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"version"},"value":{"kind":"Variable","name":{"kind":"Name","value":"version"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailRelease"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Client"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"composition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailRelease"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Release"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListApp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"clients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListClient"}}]}}]}}]} as unknown as DocumentNode<ReleaseQuery, ReleaseQueryVariables>;
export const DetailRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DetailRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailRoom"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"agent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachedStructures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailRoom"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListMessage"}}]}}]}}]} as unknown as DocumentNode<DetailRoomQuery, DetailRoomQueryVariables>;
export const RoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rooms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"4"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListMessage"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"agent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachedStructures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}}]}}]} as unknown as DocumentNode<RoomsQuery, RoomsQueryVariables>;
export const ScopesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Scopes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scopes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}}]} as unknown as DocumentNode<ScopesQuery, ScopesQueryVariables>;
export const ScopesOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ScopesOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"options"},"name":{"kind":"Name","value":"scopes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}}]} as unknown as DocumentNode<ScopesOptionsQuery, ScopesOptionsQueryVariables>;
export const GlobalSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GlobalSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noUsers"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noGroups"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"users"},"name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"skip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noUsers"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListUser"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"groups"},"name":{"kind":"Name","value":"groups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"skip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noGroups"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListGroup"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GlobalSearchQuery, GlobalSearchQueryVariables>;
export const MyStashesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyStashes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stashes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListStash"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Stash"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stash"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StashItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StashItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListStash"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stash"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Stash"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StashItem"}}]}}]}}]} as unknown as DocumentNode<MyStashesQuery, MyStashesQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const DetailUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DetailUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DetailUserQuery, DetailUserQueryVariables>;
export const UserOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"options"},"name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"label"},"name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<UserOptionsQuery, UserOptionsQueryVariables>;
export const ProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<ProfileQuery, ProfileQueryVariables>;
export const WatchMentionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"WatchMentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionComment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leaf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LeafDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Mention"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MentionDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Paragraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParagraphDescendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Descendant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Descendant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"unsafeChildren"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Mention"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Paragraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leaf"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubthreadComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionComment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descendants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Descendant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubthreadComment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]} as unknown as DocumentNode<WatchMentionsSubscription, WatchMentionsSubscriptionVariables>;
export const WatchMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"WatchMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"room"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"room"},"value":{"kind":"Variable","name":{"kind":"Name","value":"room"}}},{"kind":"Argument","name":{"kind":"Name","value":"agentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOwn"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListMessage"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"agent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachedStructures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"object"}}]}}]}}]} as unknown as DocumentNode<WatchMessagesSubscription, WatchMessagesSubscriptionVariables>;