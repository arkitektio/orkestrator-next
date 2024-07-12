/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment DetailApp on App {\n  id\n  identifier\n  logo\n  releases {\n    ...ListRelease\n  }\n}\n\nfragment ListApp on App {\n  id\n  identifier\n  logo\n}": types.DetailAppFragmentDoc,
    "fragment DetailClient on Client {\n  id\n  token\n  user {\n    username\n  }\n  kind\n  release {\n    ...ListRelease\n  }\n  oauth2Client {\n    authorizationGrantType\n    redirectUris\n  }\n  composition {\n    ...DetailComposition\n  }\n}\n\nfragment ListClient on Client {\n  id\n  user {\n    username\n  }\n  kind\n  release {\n    version\n    logo\n    app {\n      id\n      identifier\n      logo\n    }\n  }\n  composition {\n    id\n  }\n}": types.DetailClientFragmentDoc,
    "fragment Leaf on LeafDescendant {\n  bold\n  italic\n  code\n  text\n}\n\nfragment CommentUser on User {\n  id\n  username\n  avatar\n}\n\nfragment Mention on MentionDescendant {\n  user {\n    ...CommentUser\n  }\n}\n\nfragment Paragraph on ParagraphDescendant {\n  size\n}\n\nfragment Descendant on Descendant {\n  kind\n  children {\n    kind\n    children {\n      kind\n      unsafeChildren\n      ...Leaf\n      ...Mention\n      ...Paragraph\n    }\n    ...Leaf\n    ...Mention\n    ...Paragraph\n  }\n  ...Mention\n  ...Paragraph\n  ...Leaf\n}\n\nfragment SubthreadComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  createdAt\n  descendants {\n    ...Descendant\n  }\n}\n\nfragment ListComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  descendants {\n    ...Descendant\n  }\n  resolved\n  resolvedBy {\n    ...CommentUser\n  }\n  id\n  createdAt\n  children {\n    ...SubthreadComment\n  }\n}\n\nfragment MentionComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  descendants {\n    ...Descendant\n  }\n  id\n  createdAt\n  children {\n    ...SubthreadComment\n  }\n  mentions {\n    ...CommentUser\n  }\n  resolved\n  resolvedBy {\n    ...CommentUser\n  }\n  object\n  identifier\n}\n\nfragment DetailComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  descendants {\n    ...Descendant\n  }\n  id\n  resolved\n  resolvedBy {\n    ...CommentUser\n  }\n  createdAt\n  children {\n    ...SubthreadComment\n  }\n  mentions {\n    ...CommentUser\n  }\n  object\n  identifier\n}": types.LeafFragmentDoc,
    "fragment DetailComposition on Composition {\n  name\n  mappings {\n    ...ListServiceInstanceMapping\n  }\n}": types.DetailCompositionFragmentDoc,
    "fragment DetailGroup on Group {\n  id\n  name\n  users {\n    ...ListUser\n  }\n}\n\nfragment ListGroup on Group {\n  id\n  name\n}": types.DetailGroupFragmentDoc,
    "fragment Message on Message {\n  id\n  text\n  agent {\n    id\n  }\n  attachedStructures {\n    identifier\n    object\n  }\n}\n\nfragment ListMessage on Message {\n  id\n  text\n  agent {\n    id\n  }\n  attachedStructures {\n    identifier\n    object\n  }\n}": types.MessageFragmentDoc,
    "fragment ListRedeemToken on RedeemToken {\n  id\n  token\n  user {\n    id\n    email\n  }\n  client {\n    id\n    release {\n      version\n      app {\n        identifier\n      }\n    }\n  }\n}": types.ListRedeemTokenFragmentDoc,
    "fragment DetailRelease on Release {\n  id\n  version\n  logo\n  app {\n    ...ListApp\n  }\n  clients {\n    ...ListClient\n  }\n}\n\nfragment ListRelease on Release {\n  id\n  version\n  logo\n  app {\n    ...ListApp\n  }\n}": types.DetailReleaseFragmentDoc,
    "fragment DetailRoom on Room {\n  id\n  title\n  description\n  messages {\n    ...ListMessage\n  }\n}": types.DetailRoomFragmentDoc,
    "fragment ListServiceInstanceMapping on ServiceInstanceMapping {\n  id\n  key\n  instance {\n    service {\n      identifier\n    }\n    backend\n  }\n}": types.ListServiceInstanceMappingFragmentDoc,
    "fragment Stash on Stash {\n  id\n  name\n  description\n  createdAt\n  updatedAt\n  owner {\n    id\n    username\n  }\n}\n\nfragment ListStash on Stash {\n  ...Stash\n  items {\n    ...StashItem\n  }\n}\n\nfragment StashItem on StashItem {\n  id\n  identifier\n  object\n}": types.StashFragmentDoc,
    "fragment ListUser on User {\n  username\n  firstName\n  lastName\n  email\n  avatar\n  id\n}\n\nfragment DetailUser on User {\n  id\n  username\n  email\n  firstName\n  lastName\n  avatar\n  groups {\n    id\n    name\n  }\n}\n\nfragment MeUser on User {\n  id\n  username\n  email\n  firstName\n  lastName\n  avatar\n}": types.ListUserFragmentDoc,
    "mutation CreateClient($identifier: String!, $version: String!, $scopes: [String!]!, $logo: String) {\n  createDevelopmentalClient(\n    input: {manifest: {identifier: $identifier, version: $version, scopes: $scopes, logo: $logo}}\n  )\n}": types.CreateClientDocument,
    "mutation CreateComment($object: ID!, $identifier: Identifier!, $descendants: [DescendantInput!]!, $parent: ID) {\n  createComment(\n    input: {object: $object, identifier: $identifier, descendants: $descendants, parent: $parent}\n  ) {\n    ...ListComment\n  }\n}\n\nmutation ReplyTo($descendants: [DescendantInput!]!, $parent: ID!) {\n  replyTo(input: {descendants: $descendants, parent: $parent}) {\n    ...ListComment\n  }\n}\n\nmutation ResolveComment($id: ID!) {\n  resolveComment(input: {id: $id}) {\n    ...ListComment\n  }\n}": types.CreateCommentDocument,
    "mutation AcknowledgeMessage($id: ID!, $ack: Boolean!) {\n  acknowledgeMessage(input: {id: $id, acknowledged: $ack}) {\n    id\n    id\n  }\n}\n\nmutation SendMessage($text: String!, $room: ID!, $agentId: String!) {\n  send(input: {text: $text, room: $room, agentId: $agentId}) {\n    ...Message\n  }\n}": types.AcknowledgeMessageDocument,
    "mutation CreateRoom {\n  createRoom(input: {title: \"Room 1\"}) {\n    id\n    title\n  }\n}": types.CreateRoomDocument,
    "mutation CreateStash($name: String, $description: String = \"\") {\n  createStash(input: {name: $name, description: $description}) {\n    ...ListStash\n  }\n}\n\nmutation AddItemsToStash($stash: ID!, $items: [StashItemInput!]!) {\n  addItemsToStash(input: {stash: $stash, items: $items}) {\n    ...StashItem\n  }\n}\n\nmutation DeleteStashItems($items: [ID!]!) {\n  deleteStashItems(input: {items: $items})\n}\n\nmutation DeleteStash($stash: ID!) {\n  deleteStash(input: {stash: $stash})\n}": types.CreateStashDocument,
    "query Apps {\n  apps {\n    ...ListApp\n  }\n}\n\nquery App($identifier: AppIdentifier, $id: ID, $clientId: ID) {\n  app(identifier: $identifier, id: $id, clientId: $clientId) {\n    ...DetailApp\n  }\n}": types.AppsDocument,
    "query Clients($filters: ClientFilter, $pagination: OffsetPaginationInput) {\n  clients(filters: $filters, pagination: $pagination) {\n    ...ListClient\n  }\n}\n\nquery DetailClient($id: ID!) {\n  client(id: $id) {\n    ...DetailClient\n  }\n}\n\nquery MyManagedClients($kind: ClientKind!) {\n  myManagedClients(kind: $kind) {\n    ...ListClient\n  }\n}\n\nquery Client($clientId: ID!) {\n  client(clientId: $clientId) {\n    ...DetailClient\n  }\n}": types.ClientsDocument,
    "query CommentsFor($object: ID!, $identifier: Identifier!) {\n  commentsFor(identifier: $identifier, object: $object) {\n    ...ListComment\n  }\n}\n\nquery MyMentions {\n  myMentions {\n    ...MentionComment\n  }\n}\n\nquery DetailComment($id: ID!) {\n  comment(id: $id) {\n    ...DetailComment\n  }\n}": types.CommentsForDocument,
    "query GroupOptions($search: String) {\n  options: groups(filters: {search: $search}) {\n    value: name\n    label: name\n  }\n}\n\nquery DetailGroup($id: ID!) {\n  group(id: $id) {\n    ...DetailGroup\n  }\n}": types.GroupOptionsDocument,
    "query MyActiveMessages {\n  myActiveMessages {\n    id\n    title\n    message\n    action\n  }\n}": types.MyActiveMessagesDocument,
    "query RedeemTokens($filters: RedeemTokenFilter, $pagination: OffsetPaginationInput) {\n  redeemTokens(filters: $filters, pagination: $pagination) {\n    ...ListRedeemToken\n  }\n}": types.RedeemTokensDocument,
    "query Releases {\n  releases {\n    ...ListRelease\n  }\n}\n\nquery Release($identifier: AppIdentifier, $version: Version, $id: ID, $clientId: ID) {\n  release(\n    identifier: $identifier\n    version: $version\n    id: $id\n    clientId: $clientId\n  ) {\n    ...DetailRelease\n  }\n}": types.ReleasesDocument,
    "query DetailRoom($id: ID!) {\n  room(id: $id) {\n    ...DetailRoom\n  }\n}\n\nquery Rooms {\n  rooms(pagination: {limit: 10}) {\n    id\n    title\n    description\n    messages(pagination: {limit: 4}) {\n      ...ListMessage\n    }\n  }\n}": types.DetailRoomDocument,
    "query Scopes {\n  scopes {\n    description\n    value\n    label\n  }\n}\n\nquery ScopesOptions {\n  options: scopes {\n    value\n    label\n  }\n}": types.ScopesDocument,
    "query GlobalSearch($search: String, $noUsers: Boolean!, $noGroups: Boolean!, $pagination: OffsetPaginationInput) {\n  users: users(filters: {search: $search}, pagination: $pagination) @skip(if: $noUsers) {\n    ...ListUser\n  }\n  groups: groups(filters: {search: $search}, pagination: $pagination) @skip(if: $noGroups) {\n    ...ListGroup\n  }\n}": types.GlobalSearchDocument,
    "query MyStashes($pagination: OffsetPaginationInput) {\n  stashes(pagination: $pagination) {\n    ...ListStash\n  }\n}": types.MyStashesDocument,
    "query Me {\n  me {\n    ...DetailUser\n  }\n}\n\nquery User($id: ID!) {\n  user(id: $id) {\n    ...DetailUser\n  }\n}\n\nquery DetailUser($id: ID!) {\n  user(id: $id) {\n    ...DetailUser\n  }\n}\n\nquery UserOptions($search: String) {\n  options: users(filters: {search: $search}) {\n    value: id\n    label: username\n  }\n}\n\nquery Profile {\n  me {\n    ...MeUser\n  }\n}": types.MeDocument,
    "subscription WatchMentions {\n  mentions {\n    ...MentionComment\n  }\n}": types.WatchMentionsDocument,
    "subscription WatchMessages($room: ID!, $agentId: ID!) {\n  room(room: $room, agentId: $agentId, filterOwn: false) {\n    message {\n      ...ListMessage\n    }\n  }\n}": types.WatchMessagesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment DetailApp on App {\n  id\n  identifier\n  logo\n  releases {\n    ...ListRelease\n  }\n}\n\nfragment ListApp on App {\n  id\n  identifier\n  logo\n}"): (typeof documents)["fragment DetailApp on App {\n  id\n  identifier\n  logo\n  releases {\n    ...ListRelease\n  }\n}\n\nfragment ListApp on App {\n  id\n  identifier\n  logo\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment DetailClient on Client {\n  id\n  token\n  user {\n    username\n  }\n  kind\n  release {\n    ...ListRelease\n  }\n  oauth2Client {\n    authorizationGrantType\n    redirectUris\n  }\n  composition {\n    ...DetailComposition\n  }\n}\n\nfragment ListClient on Client {\n  id\n  user {\n    username\n  }\n  kind\n  release {\n    version\n    logo\n    app {\n      id\n      identifier\n      logo\n    }\n  }\n  composition {\n    id\n  }\n}"): (typeof documents)["fragment DetailClient on Client {\n  id\n  token\n  user {\n    username\n  }\n  kind\n  release {\n    ...ListRelease\n  }\n  oauth2Client {\n    authorizationGrantType\n    redirectUris\n  }\n  composition {\n    ...DetailComposition\n  }\n}\n\nfragment ListClient on Client {\n  id\n  user {\n    username\n  }\n  kind\n  release {\n    version\n    logo\n    app {\n      id\n      identifier\n      logo\n    }\n  }\n  composition {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment Leaf on LeafDescendant {\n  bold\n  italic\n  code\n  text\n}\n\nfragment CommentUser on User {\n  id\n  username\n  avatar\n}\n\nfragment Mention on MentionDescendant {\n  user {\n    ...CommentUser\n  }\n}\n\nfragment Paragraph on ParagraphDescendant {\n  size\n}\n\nfragment Descendant on Descendant {\n  kind\n  children {\n    kind\n    children {\n      kind\n      unsafeChildren\n      ...Leaf\n      ...Mention\n      ...Paragraph\n    }\n    ...Leaf\n    ...Mention\n    ...Paragraph\n  }\n  ...Mention\n  ...Paragraph\n  ...Leaf\n}\n\nfragment SubthreadComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  createdAt\n  descendants {\n    ...Descendant\n  }\n}\n\nfragment ListComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  descendants {\n    ...Descendant\n  }\n  resolved\n  resolvedBy {\n    ...CommentUser\n  }\n  id\n  createdAt\n  children {\n    ...SubthreadComment\n  }\n}\n\nfragment MentionComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  descendants {\n    ...Descendant\n  }\n  id\n  createdAt\n  children {\n    ...SubthreadComment\n  }\n  mentions {\n    ...CommentUser\n  }\n  resolved\n  resolvedBy {\n    ...CommentUser\n  }\n  object\n  identifier\n}\n\nfragment DetailComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  descendants {\n    ...Descendant\n  }\n  id\n  resolved\n  resolvedBy {\n    ...CommentUser\n  }\n  createdAt\n  children {\n    ...SubthreadComment\n  }\n  mentions {\n    ...CommentUser\n  }\n  object\n  identifier\n}"): (typeof documents)["fragment Leaf on LeafDescendant {\n  bold\n  italic\n  code\n  text\n}\n\nfragment CommentUser on User {\n  id\n  username\n  avatar\n}\n\nfragment Mention on MentionDescendant {\n  user {\n    ...CommentUser\n  }\n}\n\nfragment Paragraph on ParagraphDescendant {\n  size\n}\n\nfragment Descendant on Descendant {\n  kind\n  children {\n    kind\n    children {\n      kind\n      unsafeChildren\n      ...Leaf\n      ...Mention\n      ...Paragraph\n    }\n    ...Leaf\n    ...Mention\n    ...Paragraph\n  }\n  ...Mention\n  ...Paragraph\n  ...Leaf\n}\n\nfragment SubthreadComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  createdAt\n  descendants {\n    ...Descendant\n  }\n}\n\nfragment ListComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  descendants {\n    ...Descendant\n  }\n  resolved\n  resolvedBy {\n    ...CommentUser\n  }\n  id\n  createdAt\n  children {\n    ...SubthreadComment\n  }\n}\n\nfragment MentionComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  descendants {\n    ...Descendant\n  }\n  id\n  createdAt\n  children {\n    ...SubthreadComment\n  }\n  mentions {\n    ...CommentUser\n  }\n  resolved\n  resolvedBy {\n    ...CommentUser\n  }\n  object\n  identifier\n}\n\nfragment DetailComment on Comment {\n  user {\n    ...CommentUser\n  }\n  parent {\n    id\n  }\n  descendants {\n    ...Descendant\n  }\n  id\n  resolved\n  resolvedBy {\n    ...CommentUser\n  }\n  createdAt\n  children {\n    ...SubthreadComment\n  }\n  mentions {\n    ...CommentUser\n  }\n  object\n  identifier\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment DetailComposition on Composition {\n  name\n  mappings {\n    ...ListServiceInstanceMapping\n  }\n}"): (typeof documents)["fragment DetailComposition on Composition {\n  name\n  mappings {\n    ...ListServiceInstanceMapping\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment DetailGroup on Group {\n  id\n  name\n  users {\n    ...ListUser\n  }\n}\n\nfragment ListGroup on Group {\n  id\n  name\n}"): (typeof documents)["fragment DetailGroup on Group {\n  id\n  name\n  users {\n    ...ListUser\n  }\n}\n\nfragment ListGroup on Group {\n  id\n  name\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment Message on Message {\n  id\n  text\n  agent {\n    id\n  }\n  attachedStructures {\n    identifier\n    object\n  }\n}\n\nfragment ListMessage on Message {\n  id\n  text\n  agent {\n    id\n  }\n  attachedStructures {\n    identifier\n    object\n  }\n}"): (typeof documents)["fragment Message on Message {\n  id\n  text\n  agent {\n    id\n  }\n  attachedStructures {\n    identifier\n    object\n  }\n}\n\nfragment ListMessage on Message {\n  id\n  text\n  agent {\n    id\n  }\n  attachedStructures {\n    identifier\n    object\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ListRedeemToken on RedeemToken {\n  id\n  token\n  user {\n    id\n    email\n  }\n  client {\n    id\n    release {\n      version\n      app {\n        identifier\n      }\n    }\n  }\n}"): (typeof documents)["fragment ListRedeemToken on RedeemToken {\n  id\n  token\n  user {\n    id\n    email\n  }\n  client {\n    id\n    release {\n      version\n      app {\n        identifier\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment DetailRelease on Release {\n  id\n  version\n  logo\n  app {\n    ...ListApp\n  }\n  clients {\n    ...ListClient\n  }\n}\n\nfragment ListRelease on Release {\n  id\n  version\n  logo\n  app {\n    ...ListApp\n  }\n}"): (typeof documents)["fragment DetailRelease on Release {\n  id\n  version\n  logo\n  app {\n    ...ListApp\n  }\n  clients {\n    ...ListClient\n  }\n}\n\nfragment ListRelease on Release {\n  id\n  version\n  logo\n  app {\n    ...ListApp\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment DetailRoom on Room {\n  id\n  title\n  description\n  messages {\n    ...ListMessage\n  }\n}"): (typeof documents)["fragment DetailRoom on Room {\n  id\n  title\n  description\n  messages {\n    ...ListMessage\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ListServiceInstanceMapping on ServiceInstanceMapping {\n  id\n  key\n  instance {\n    service {\n      identifier\n    }\n    backend\n  }\n}"): (typeof documents)["fragment ListServiceInstanceMapping on ServiceInstanceMapping {\n  id\n  key\n  instance {\n    service {\n      identifier\n    }\n    backend\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment Stash on Stash {\n  id\n  name\n  description\n  createdAt\n  updatedAt\n  owner {\n    id\n    username\n  }\n}\n\nfragment ListStash on Stash {\n  ...Stash\n  items {\n    ...StashItem\n  }\n}\n\nfragment StashItem on StashItem {\n  id\n  identifier\n  object\n}"): (typeof documents)["fragment Stash on Stash {\n  id\n  name\n  description\n  createdAt\n  updatedAt\n  owner {\n    id\n    username\n  }\n}\n\nfragment ListStash on Stash {\n  ...Stash\n  items {\n    ...StashItem\n  }\n}\n\nfragment StashItem on StashItem {\n  id\n  identifier\n  object\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ListUser on User {\n  username\n  firstName\n  lastName\n  email\n  avatar\n  id\n}\n\nfragment DetailUser on User {\n  id\n  username\n  email\n  firstName\n  lastName\n  avatar\n  groups {\n    id\n    name\n  }\n}\n\nfragment MeUser on User {\n  id\n  username\n  email\n  firstName\n  lastName\n  avatar\n}"): (typeof documents)["fragment ListUser on User {\n  username\n  firstName\n  lastName\n  email\n  avatar\n  id\n}\n\nfragment DetailUser on User {\n  id\n  username\n  email\n  firstName\n  lastName\n  avatar\n  groups {\n    id\n    name\n  }\n}\n\nfragment MeUser on User {\n  id\n  username\n  email\n  firstName\n  lastName\n  avatar\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateClient($identifier: String!, $version: String!, $scopes: [String!]!, $logo: String) {\n  createDevelopmentalClient(\n    input: {manifest: {identifier: $identifier, version: $version, scopes: $scopes, logo: $logo}}\n  )\n}"): (typeof documents)["mutation CreateClient($identifier: String!, $version: String!, $scopes: [String!]!, $logo: String) {\n  createDevelopmentalClient(\n    input: {manifest: {identifier: $identifier, version: $version, scopes: $scopes, logo: $logo}}\n  )\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateComment($object: ID!, $identifier: Identifier!, $descendants: [DescendantInput!]!, $parent: ID) {\n  createComment(\n    input: {object: $object, identifier: $identifier, descendants: $descendants, parent: $parent}\n  ) {\n    ...ListComment\n  }\n}\n\nmutation ReplyTo($descendants: [DescendantInput!]!, $parent: ID!) {\n  replyTo(input: {descendants: $descendants, parent: $parent}) {\n    ...ListComment\n  }\n}\n\nmutation ResolveComment($id: ID!) {\n  resolveComment(input: {id: $id}) {\n    ...ListComment\n  }\n}"): (typeof documents)["mutation CreateComment($object: ID!, $identifier: Identifier!, $descendants: [DescendantInput!]!, $parent: ID) {\n  createComment(\n    input: {object: $object, identifier: $identifier, descendants: $descendants, parent: $parent}\n  ) {\n    ...ListComment\n  }\n}\n\nmutation ReplyTo($descendants: [DescendantInput!]!, $parent: ID!) {\n  replyTo(input: {descendants: $descendants, parent: $parent}) {\n    ...ListComment\n  }\n}\n\nmutation ResolveComment($id: ID!) {\n  resolveComment(input: {id: $id}) {\n    ...ListComment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AcknowledgeMessage($id: ID!, $ack: Boolean!) {\n  acknowledgeMessage(input: {id: $id, acknowledged: $ack}) {\n    id\n    id\n  }\n}\n\nmutation SendMessage($text: String!, $room: ID!, $agentId: String!) {\n  send(input: {text: $text, room: $room, agentId: $agentId}) {\n    ...Message\n  }\n}"): (typeof documents)["mutation AcknowledgeMessage($id: ID!, $ack: Boolean!) {\n  acknowledgeMessage(input: {id: $id, acknowledged: $ack}) {\n    id\n    id\n  }\n}\n\nmutation SendMessage($text: String!, $room: ID!, $agentId: String!) {\n  send(input: {text: $text, room: $room, agentId: $agentId}) {\n    ...Message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateRoom {\n  createRoom(input: {title: \"Room 1\"}) {\n    id\n    title\n  }\n}"): (typeof documents)["mutation CreateRoom {\n  createRoom(input: {title: \"Room 1\"}) {\n    id\n    title\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateStash($name: String, $description: String = \"\") {\n  createStash(input: {name: $name, description: $description}) {\n    ...ListStash\n  }\n}\n\nmutation AddItemsToStash($stash: ID!, $items: [StashItemInput!]!) {\n  addItemsToStash(input: {stash: $stash, items: $items}) {\n    ...StashItem\n  }\n}\n\nmutation DeleteStashItems($items: [ID!]!) {\n  deleteStashItems(input: {items: $items})\n}\n\nmutation DeleteStash($stash: ID!) {\n  deleteStash(input: {stash: $stash})\n}"): (typeof documents)["mutation CreateStash($name: String, $description: String = \"\") {\n  createStash(input: {name: $name, description: $description}) {\n    ...ListStash\n  }\n}\n\nmutation AddItemsToStash($stash: ID!, $items: [StashItemInput!]!) {\n  addItemsToStash(input: {stash: $stash, items: $items}) {\n    ...StashItem\n  }\n}\n\nmutation DeleteStashItems($items: [ID!]!) {\n  deleteStashItems(input: {items: $items})\n}\n\nmutation DeleteStash($stash: ID!) {\n  deleteStash(input: {stash: $stash})\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Apps {\n  apps {\n    ...ListApp\n  }\n}\n\nquery App($identifier: AppIdentifier, $id: ID, $clientId: ID) {\n  app(identifier: $identifier, id: $id, clientId: $clientId) {\n    ...DetailApp\n  }\n}"): (typeof documents)["query Apps {\n  apps {\n    ...ListApp\n  }\n}\n\nquery App($identifier: AppIdentifier, $id: ID, $clientId: ID) {\n  app(identifier: $identifier, id: $id, clientId: $clientId) {\n    ...DetailApp\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Clients($filters: ClientFilter, $pagination: OffsetPaginationInput) {\n  clients(filters: $filters, pagination: $pagination) {\n    ...ListClient\n  }\n}\n\nquery DetailClient($id: ID!) {\n  client(id: $id) {\n    ...DetailClient\n  }\n}\n\nquery MyManagedClients($kind: ClientKind!) {\n  myManagedClients(kind: $kind) {\n    ...ListClient\n  }\n}\n\nquery Client($clientId: ID!) {\n  client(clientId: $clientId) {\n    ...DetailClient\n  }\n}"): (typeof documents)["query Clients($filters: ClientFilter, $pagination: OffsetPaginationInput) {\n  clients(filters: $filters, pagination: $pagination) {\n    ...ListClient\n  }\n}\n\nquery DetailClient($id: ID!) {\n  client(id: $id) {\n    ...DetailClient\n  }\n}\n\nquery MyManagedClients($kind: ClientKind!) {\n  myManagedClients(kind: $kind) {\n    ...ListClient\n  }\n}\n\nquery Client($clientId: ID!) {\n  client(clientId: $clientId) {\n    ...DetailClient\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CommentsFor($object: ID!, $identifier: Identifier!) {\n  commentsFor(identifier: $identifier, object: $object) {\n    ...ListComment\n  }\n}\n\nquery MyMentions {\n  myMentions {\n    ...MentionComment\n  }\n}\n\nquery DetailComment($id: ID!) {\n  comment(id: $id) {\n    ...DetailComment\n  }\n}"): (typeof documents)["query CommentsFor($object: ID!, $identifier: Identifier!) {\n  commentsFor(identifier: $identifier, object: $object) {\n    ...ListComment\n  }\n}\n\nquery MyMentions {\n  myMentions {\n    ...MentionComment\n  }\n}\n\nquery DetailComment($id: ID!) {\n  comment(id: $id) {\n    ...DetailComment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GroupOptions($search: String) {\n  options: groups(filters: {search: $search}) {\n    value: name\n    label: name\n  }\n}\n\nquery DetailGroup($id: ID!) {\n  group(id: $id) {\n    ...DetailGroup\n  }\n}"): (typeof documents)["query GroupOptions($search: String) {\n  options: groups(filters: {search: $search}) {\n    value: name\n    label: name\n  }\n}\n\nquery DetailGroup($id: ID!) {\n  group(id: $id) {\n    ...DetailGroup\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyActiveMessages {\n  myActiveMessages {\n    id\n    title\n    message\n    action\n  }\n}"): (typeof documents)["query MyActiveMessages {\n  myActiveMessages {\n    id\n    title\n    message\n    action\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query RedeemTokens($filters: RedeemTokenFilter, $pagination: OffsetPaginationInput) {\n  redeemTokens(filters: $filters, pagination: $pagination) {\n    ...ListRedeemToken\n  }\n}"): (typeof documents)["query RedeemTokens($filters: RedeemTokenFilter, $pagination: OffsetPaginationInput) {\n  redeemTokens(filters: $filters, pagination: $pagination) {\n    ...ListRedeemToken\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Releases {\n  releases {\n    ...ListRelease\n  }\n}\n\nquery Release($identifier: AppIdentifier, $version: Version, $id: ID, $clientId: ID) {\n  release(\n    identifier: $identifier\n    version: $version\n    id: $id\n    clientId: $clientId\n  ) {\n    ...DetailRelease\n  }\n}"): (typeof documents)["query Releases {\n  releases {\n    ...ListRelease\n  }\n}\n\nquery Release($identifier: AppIdentifier, $version: Version, $id: ID, $clientId: ID) {\n  release(\n    identifier: $identifier\n    version: $version\n    id: $id\n    clientId: $clientId\n  ) {\n    ...DetailRelease\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query DetailRoom($id: ID!) {\n  room(id: $id) {\n    ...DetailRoom\n  }\n}\n\nquery Rooms {\n  rooms(pagination: {limit: 10}) {\n    id\n    title\n    description\n    messages(pagination: {limit: 4}) {\n      ...ListMessage\n    }\n  }\n}"): (typeof documents)["query DetailRoom($id: ID!) {\n  room(id: $id) {\n    ...DetailRoom\n  }\n}\n\nquery Rooms {\n  rooms(pagination: {limit: 10}) {\n    id\n    title\n    description\n    messages(pagination: {limit: 4}) {\n      ...ListMessage\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Scopes {\n  scopes {\n    description\n    value\n    label\n  }\n}\n\nquery ScopesOptions {\n  options: scopes {\n    value\n    label\n  }\n}"): (typeof documents)["query Scopes {\n  scopes {\n    description\n    value\n    label\n  }\n}\n\nquery ScopesOptions {\n  options: scopes {\n    value\n    label\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GlobalSearch($search: String, $noUsers: Boolean!, $noGroups: Boolean!, $pagination: OffsetPaginationInput) {\n  users: users(filters: {search: $search}, pagination: $pagination) @skip(if: $noUsers) {\n    ...ListUser\n  }\n  groups: groups(filters: {search: $search}, pagination: $pagination) @skip(if: $noGroups) {\n    ...ListGroup\n  }\n}"): (typeof documents)["query GlobalSearch($search: String, $noUsers: Boolean!, $noGroups: Boolean!, $pagination: OffsetPaginationInput) {\n  users: users(filters: {search: $search}, pagination: $pagination) @skip(if: $noUsers) {\n    ...ListUser\n  }\n  groups: groups(filters: {search: $search}, pagination: $pagination) @skip(if: $noGroups) {\n    ...ListGroup\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyStashes($pagination: OffsetPaginationInput) {\n  stashes(pagination: $pagination) {\n    ...ListStash\n  }\n}"): (typeof documents)["query MyStashes($pagination: OffsetPaginationInput) {\n  stashes(pagination: $pagination) {\n    ...ListStash\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    ...DetailUser\n  }\n}\n\nquery User($id: ID!) {\n  user(id: $id) {\n    ...DetailUser\n  }\n}\n\nquery DetailUser($id: ID!) {\n  user(id: $id) {\n    ...DetailUser\n  }\n}\n\nquery UserOptions($search: String) {\n  options: users(filters: {search: $search}) {\n    value: id\n    label: username\n  }\n}\n\nquery Profile {\n  me {\n    ...MeUser\n  }\n}"): (typeof documents)["query Me {\n  me {\n    ...DetailUser\n  }\n}\n\nquery User($id: ID!) {\n  user(id: $id) {\n    ...DetailUser\n  }\n}\n\nquery DetailUser($id: ID!) {\n  user(id: $id) {\n    ...DetailUser\n  }\n}\n\nquery UserOptions($search: String) {\n  options: users(filters: {search: $search}) {\n    value: id\n    label: username\n  }\n}\n\nquery Profile {\n  me {\n    ...MeUser\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription WatchMentions {\n  mentions {\n    ...MentionComment\n  }\n}"): (typeof documents)["subscription WatchMentions {\n  mentions {\n    ...MentionComment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription WatchMessages($room: ID!, $agentId: ID!) {\n  room(room: $room, agentId: $agentId, filterOwn: false) {\n    message {\n      ...ListMessage\n    }\n  }\n}"): (typeof documents)["subscription WatchMessages($room: ID!, $agentId: ID!) {\n  room(room: $room, agentId: $agentId, filterOwn: false) {\n    message {\n      ...ListMessage\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;