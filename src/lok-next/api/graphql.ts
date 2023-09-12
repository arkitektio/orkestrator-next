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
  AppIdentifier: { input: any; output: any };
  DateTime: { input: any; output: any };
  Identifier: { input: any; output: any };
  UnsafeChild: { input: any; output: any };
  Version: { input: any; output: any };
};

export type App = {
  __typename?: "App";
  id: Scalars["ID"]["output"];
  identifier: Scalars["AppIdentifier"]["output"];
  logo: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  releases: Array<Release>;
};

export type Client = {
  __typename?: "Client";
  composition: Composition;
  id: Scalars["ID"]["output"];
  kind: ClientKind;
  oauth2Client: Oauth2Client;
  public: Scalars["Boolean"]["output"];
  release: Release;
  tenant: User;
  token: Scalars["String"]["output"];
  user: User;
};

export enum ClientKind {
  Desktop = "DESKTOP",
  Development = "DEVELOPMENT",
  Website = "WEBSITE",
}

export type Comment = {
  __typename?: "Comment";
  children: Array<Comment>;
  createdAt: Scalars["DateTime"]["output"];
  descendants: Array<Descendant>;
  id: Scalars["ID"]["output"];
  identifier: Scalars["Identifier"]["output"];
  mentions: Array<User>;
  name: Scalars["String"]["output"];
  object: Scalars["String"]["output"];
  parent?: Maybe<Comment>;
  resolved: Scalars["Boolean"]["output"];
  resolvedBy?: Maybe<User>;
  user: User;
};

export type CommentMentionsArgs = {
  filters?: InputMaybe<UserFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type Communication = {
  __typename?: "Communication";
  channel: Scalars["ID"]["output"];
};

export type Composition = {
  __typename?: "Composition";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  template: Scalars["String"]["output"];
};

export type CreateCommentInput = {
  descendants: Array<DescendantInput>;
  identifier: Scalars["Identifier"]["input"];
  notify?: InputMaybe<Scalars["Boolean"]["input"]>;
  object: Scalars["ID"]["input"];
  parent?: InputMaybe<Scalars["ID"]["input"]>;
};

export type CreateUserInput = {
  name: Scalars["String"]["input"];
};

export type Descendant = {
  children?: Maybe<Array<Descendant>>;
  kind: DescendantKind;
  unsafeChildren?: Maybe<Array<Scalars["UnsafeChild"]["output"]>>;
};

export type DescendantInput = {
  bold?: InputMaybe<Scalars["Boolean"]["input"]>;
  children?: InputMaybe<Array<DescendantInput>>;
  code?: InputMaybe<Scalars["Boolean"]["input"]>;
  italic?: InputMaybe<Scalars["Boolean"]["input"]>;
  kind: DescendantKind;
  text?: InputMaybe<Scalars["String"]["input"]>;
  user?: InputMaybe<Scalars["String"]["input"]>;
};

export enum DescendantKind {
  Leaf = "LEAF",
  Mention = "MENTION",
  Paragraph = "PARAGRAPH",
}

export type Group = {
  __typename?: "Group";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  users: Array<User>;
};

export type GroupUsersArgs = {
  filters?: InputMaybe<UserFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type GroupFilter = {
  AND?: InputMaybe<GroupFilter>;
  OR?: InputMaybe<GroupFilter>;
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  name?: InputMaybe<StrFilterLookup>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type LeafDescendant = Descendant & {
  __typename?: "LeafDescendant";
  bold?: Maybe<Scalars["Boolean"]["output"]>;
  children?: Maybe<Array<Descendant>>;
  code?: Maybe<Scalars["String"]["output"]>;
  italic?: Maybe<Scalars["Boolean"]["output"]>;
  kind: DescendantKind;
  text?: Maybe<Scalars["String"]["output"]>;
  underline?: Maybe<Scalars["Boolean"]["output"]>;
  unsafeChildren?: Maybe<Array<Scalars["UnsafeChild"]["output"]>>;
};

export type MentionDescendant = Descendant & {
  __typename?: "MentionDescendant";
  children?: Maybe<Array<Descendant>>;
  kind: DescendantKind;
  unsafeChildren?: Maybe<Array<Scalars["UnsafeChild"]["output"]>>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: "Mutation";
  createComment: Comment;
  createUser: User;
  replyTo: Comment;
  resolveComment: Comment;
};

export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationReplyToArgs = {
  input: ReplyToCommentInput;
};

export type MutationResolveCommentArgs = {
  input: ResolveCommentInput;
};

export type Oauth2Client = {
  __typename?: "Oauth2Client";
  algorithm: Scalars["String"]["output"];
  authorizationGrantType: Scalars["String"]["output"];
  clientType: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  redirectUris: Scalars["String"]["output"];
  user: User;
};

export type OffsetPaginationInput = {
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
};

export type ParagraphDescendant = Descendant & {
  __typename?: "ParagraphDescendant";
  children?: Maybe<Array<Descendant>>;
  kind: DescendantKind;
  size?: Maybe<Scalars["String"]["output"]>;
  unsafeChildren?: Maybe<Array<Scalars["UnsafeChild"]["output"]>>;
};

export type Query = {
  __typename?: "Query";
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
  hallo: Scalars["String"]["output"];
  me: User;
  myManagedClients: Client;
  myMentions: Comment;
  mygroups: Array<Group>;
  release: Release;
  releases: Array<Release>;
  scopes: Array<Scope>;
  user: User;
  users: Array<User>;
};

export type QueryAppArgs = {
  clientId?: InputMaybe<Scalars["ID"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  identifier?: InputMaybe<Scalars["AppIdentifier"]["input"]>;
};

export type QueryClientArgs = {
  clientId?: InputMaybe<Scalars["ID"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryCommentArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryCommentsForArgs = {
  identifier: Scalars["Identifier"]["input"];
  object: Scalars["ID"]["input"];
};

export type QueryGroupArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGroupsArgs = {
  filters?: InputMaybe<GroupFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type QueryMyManagedClientsArgs = {
  kind: ClientKind;
};

export type QueryReleaseArgs = {
  clientId?: InputMaybe<Scalars["ID"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  identifier?: InputMaybe<Scalars["AppIdentifier"]["input"]>;
  version?: InputMaybe<Scalars["Version"]["input"]>;
};

export type QueryUserArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryUsersArgs = {
  filters?: InputMaybe<UserFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type Release = {
  __typename?: "Release";
  app: App;
  clients: Array<Client>;
  id: Scalars["ID"]["output"];
  logo: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  requirements: Array<Scalars["String"]["output"]>;
  scopes: Array<Scalars["String"]["output"]>;
  version: Scalars["Version"]["output"];
};

export type ReplyToCommentInput = {
  descendants: Array<DescendantInput>;
  notify?: InputMaybe<Scalars["Boolean"]["input"]>;
  parent?: InputMaybe<Scalars["ID"]["input"]>;
};

export type ResolveCommentInput = {
  id: Scalars["ID"]["input"];
  notify?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type Scope = {
  __typename?: "Scope";
  description: Scalars["String"]["output"];
  label: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type StrFilterLookup = {
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  exact?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  iContains?: InputMaybe<Scalars["String"]["input"]>;
  iEndsWith?: InputMaybe<Scalars["String"]["input"]>;
  iExact?: InputMaybe<Scalars["String"]["input"]>;
  iRegex?: InputMaybe<Scalars["String"]["input"]>;
  iStartsWith?: InputMaybe<Scalars["String"]["input"]>;
  inList?: InputMaybe<Array<Scalars["String"]["input"]>>;
  isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  nContains?: InputMaybe<Scalars["String"]["input"]>;
  nEndsWith?: InputMaybe<Scalars["String"]["input"]>;
  nExact?: InputMaybe<Scalars["String"]["input"]>;
  nGt?: InputMaybe<Scalars["String"]["input"]>;
  nGte?: InputMaybe<Scalars["String"]["input"]>;
  nIContains?: InputMaybe<Scalars["String"]["input"]>;
  nIEndsWith?: InputMaybe<Scalars["String"]["input"]>;
  nIExact?: InputMaybe<Scalars["String"]["input"]>;
  nIRegex?: InputMaybe<Scalars["String"]["input"]>;
  nIStartsWith?: InputMaybe<Scalars["String"]["input"]>;
  nInList?: InputMaybe<Array<Scalars["String"]["input"]>>;
  nIsNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  nLt?: InputMaybe<Scalars["String"]["input"]>;
  nLte?: InputMaybe<Scalars["String"]["input"]>;
  nRange?: InputMaybe<Array<Scalars["String"]["input"]>>;
  nRegex?: InputMaybe<Scalars["String"]["input"]>;
  nStartsWith?: InputMaybe<Scalars["String"]["input"]>;
  range?: InputMaybe<Array<Scalars["String"]["input"]>>;
  regex?: InputMaybe<Scalars["String"]["input"]>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  communications: Communication;
  mentions: Comment;
};

export type SubscriptionCommunicationsArgs = {
  channels: Array<Scalars["ID"]["input"]>;
};

export type User = {
  __typename?: "User";
  avatar?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  firstName?: Maybe<Scalars["String"]["output"]>;
  groups: Array<Group>;
  id: Scalars["ID"]["output"];
  lastName?: Maybe<Scalars["String"]["output"]>;
  username: Scalars["String"]["output"];
};

export type UserGroupsArgs = {
  filters?: InputMaybe<GroupFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type UserFilter = {
  AND?: InputMaybe<UserFilter>;
  OR?: InputMaybe<UserFilter>;
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  username?: InputMaybe<StrFilterLookup>;
};

export type DetailAppFragment = {
  __typename?: "App";
  id: string;
  identifier: any;
  logo: string;
  releases: Array<{
    __typename?: "Release";
    id: string;
    version: any;
    logo: string;
    app: { __typename?: "App"; id: string; identifier: any; logo: string };
  }>;
};

export type ListAppFragment = {
  __typename?: "App";
  id: string;
  identifier: any;
  logo: string;
};

export type DetailClientFragment = {
  __typename?: "Client";
  id: string;
  token: string;
  kind: ClientKind;
  user: { __typename?: "User"; username: string };
  release: {
    __typename?: "Release";
    id: string;
    version: any;
    logo: string;
    app: { __typename?: "App"; id: string; identifier: any; logo: string };
  };
  oauth2Client: {
    __typename?: "Oauth2Client";
    authorizationGrantType: string;
    redirectUris: string;
  };
};

export type ListClientFragment = {
  __typename?: "Client";
  id: string;
  kind: ClientKind;
  user: { __typename?: "User"; username: string };
  release: {
    __typename?: "Release";
    version: any;
    logo: string;
    app: { __typename?: "App"; id: string; identifier: any; logo: string };
  };
};

export type LeafFragment = {
  __typename?: "LeafDescendant";
  bold?: boolean | null;
  italic?: boolean | null;
  code?: string | null;
  text?: string | null;
};

export type CommentUserFragment = {
  __typename?: "User";
  id: string;
  username: string;
  avatar?: string | null;
};

export type MentionFragment = {
  __typename?: "MentionDescendant";
  user?: {
    __typename?: "User";
    id: string;
    username: string;
    avatar?: string | null;
  } | null;
};

export type ParagraphFragment = {
  __typename?: "ParagraphDescendant";
  size?: string | null;
};

type Descendant_LeafDescendant_Fragment = {
  __typename?: "LeafDescendant";
  kind: DescendantKind;
  bold?: boolean | null;
  italic?: boolean | null;
  code?: string | null;
  text?: string | null;
  children?: Array<
    | {
        __typename?: "LeafDescendant";
        kind: DescendantKind;
        bold?: boolean | null;
        italic?: boolean | null;
        code?: string | null;
        text?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              size?: string | null;
            }
        > | null;
      }
    | {
        __typename?: "MentionDescendant";
        kind: DescendantKind;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              size?: string | null;
            }
        > | null;
        user?: {
          __typename?: "User";
          id: string;
          username: string;
          avatar?: string | null;
        } | null;
      }
    | {
        __typename?: "ParagraphDescendant";
        kind: DescendantKind;
        size?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              size?: string | null;
            }
        > | null;
      }
  > | null;
};

type Descendant_MentionDescendant_Fragment = {
  __typename?: "MentionDescendant";
  kind: DescendantKind;
  children?: Array<
    | {
        __typename?: "LeafDescendant";
        kind: DescendantKind;
        bold?: boolean | null;
        italic?: boolean | null;
        code?: string | null;
        text?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              size?: string | null;
            }
        > | null;
      }
    | {
        __typename?: "MentionDescendant";
        kind: DescendantKind;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              size?: string | null;
            }
        > | null;
        user?: {
          __typename?: "User";
          id: string;
          username: string;
          avatar?: string | null;
        } | null;
      }
    | {
        __typename?: "ParagraphDescendant";
        kind: DescendantKind;
        size?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              size?: string | null;
            }
        > | null;
      }
  > | null;
  user?: {
    __typename?: "User";
    id: string;
    username: string;
    avatar?: string | null;
  } | null;
};

type Descendant_ParagraphDescendant_Fragment = {
  __typename?: "ParagraphDescendant";
  kind: DescendantKind;
  size?: string | null;
  children?: Array<
    | {
        __typename?: "LeafDescendant";
        kind: DescendantKind;
        bold?: boolean | null;
        italic?: boolean | null;
        code?: string | null;
        text?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              size?: string | null;
            }
        > | null;
      }
    | {
        __typename?: "MentionDescendant";
        kind: DescendantKind;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              size?: string | null;
            }
        > | null;
        user?: {
          __typename?: "User";
          id: string;
          username: string;
          avatar?: string | null;
        } | null;
      }
    | {
        __typename?: "ParagraphDescendant";
        kind: DescendantKind;
        size?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              unsafeChildren?: Array<any> | null;
              size?: string | null;
            }
        > | null;
      }
  > | null;
};

export type DescendantFragment =
  | Descendant_LeafDescendant_Fragment
  | Descendant_MentionDescendant_Fragment
  | Descendant_ParagraphDescendant_Fragment;

export type SubthreadCommentFragment = {
  __typename?: "Comment";
  createdAt: any;
  user: {
    __typename?: "User";
    id: string;
    username: string;
    avatar?: string | null;
  };
  parent?: { __typename?: "Comment"; id: string } | null;
  descendants: Array<
    | {
        __typename?: "LeafDescendant";
        kind: DescendantKind;
        bold?: boolean | null;
        italic?: boolean | null;
        code?: string | null;
        text?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
      }
    | {
        __typename?: "MentionDescendant";
        kind: DescendantKind;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
        user?: {
          __typename?: "User";
          id: string;
          username: string;
          avatar?: string | null;
        } | null;
      }
    | {
        __typename?: "ParagraphDescendant";
        kind: DescendantKind;
        size?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
      }
  >;
};

export type ListCommentFragment = {
  __typename?: "Comment";
  resolved: boolean;
  id: string;
  createdAt: any;
  user: {
    __typename?: "User";
    id: string;
    username: string;
    avatar?: string | null;
  };
  parent?: { __typename?: "Comment"; id: string } | null;
  descendants: Array<
    | {
        __typename?: "LeafDescendant";
        kind: DescendantKind;
        bold?: boolean | null;
        italic?: boolean | null;
        code?: string | null;
        text?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
      }
    | {
        __typename?: "MentionDescendant";
        kind: DescendantKind;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
        user?: {
          __typename?: "User";
          id: string;
          username: string;
          avatar?: string | null;
        } | null;
      }
    | {
        __typename?: "ParagraphDescendant";
        kind: DescendantKind;
        size?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
      }
  >;
  resolvedBy?: {
    __typename?: "User";
    id: string;
    username: string;
    avatar?: string | null;
  } | null;
  children: Array<{
    __typename?: "Comment";
    createdAt: any;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    };
    parent?: { __typename?: "Comment"; id: string } | null;
    descendants: Array<
      | {
          __typename?: "LeafDescendant";
          kind: DescendantKind;
          bold?: boolean | null;
          italic?: boolean | null;
          code?: string | null;
          text?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
      | {
          __typename?: "MentionDescendant";
          kind: DescendantKind;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
          user?: {
            __typename?: "User";
            id: string;
            username: string;
            avatar?: string | null;
          } | null;
        }
      | {
          __typename?: "ParagraphDescendant";
          kind: DescendantKind;
          size?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
    >;
  }>;
};

export type MentionCommentFragment = {
  __typename?: "Comment";
  id: string;
  createdAt: any;
  resolved: boolean;
  object: string;
  identifier: any;
  user: {
    __typename?: "User";
    id: string;
    username: string;
    avatar?: string | null;
  };
  parent?: { __typename?: "Comment"; id: string } | null;
  descendants: Array<
    | {
        __typename?: "LeafDescendant";
        kind: DescendantKind;
        bold?: boolean | null;
        italic?: boolean | null;
        code?: string | null;
        text?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
      }
    | {
        __typename?: "MentionDescendant";
        kind: DescendantKind;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
        user?: {
          __typename?: "User";
          id: string;
          username: string;
          avatar?: string | null;
        } | null;
      }
    | {
        __typename?: "ParagraphDescendant";
        kind: DescendantKind;
        size?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
      }
  >;
  children: Array<{
    __typename?: "Comment";
    createdAt: any;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    };
    parent?: { __typename?: "Comment"; id: string } | null;
    descendants: Array<
      | {
          __typename?: "LeafDescendant";
          kind: DescendantKind;
          bold?: boolean | null;
          italic?: boolean | null;
          code?: string | null;
          text?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
      | {
          __typename?: "MentionDescendant";
          kind: DescendantKind;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
          user?: {
            __typename?: "User";
            id: string;
            username: string;
            avatar?: string | null;
          } | null;
        }
      | {
          __typename?: "ParagraphDescendant";
          kind: DescendantKind;
          size?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
    >;
  }>;
  mentions: Array<{
    __typename?: "User";
    id: string;
    username: string;
    avatar?: string | null;
  }>;
  resolvedBy?: {
    __typename?: "User";
    id: string;
    username: string;
    avatar?: string | null;
  } | null;
};

export type DetailCommentFragment = {
  __typename?: "Comment";
  id: string;
  resolved: boolean;
  createdAt: any;
  object: string;
  identifier: any;
  user: {
    __typename?: "User";
    id: string;
    username: string;
    avatar?: string | null;
  };
  parent?: { __typename?: "Comment"; id: string } | null;
  descendants: Array<
    | {
        __typename?: "LeafDescendant";
        kind: DescendantKind;
        bold?: boolean | null;
        italic?: boolean | null;
        code?: string | null;
        text?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
      }
    | {
        __typename?: "MentionDescendant";
        kind: DescendantKind;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
        user?: {
          __typename?: "User";
          id: string;
          username: string;
          avatar?: string | null;
        } | null;
      }
    | {
        __typename?: "ParagraphDescendant";
        kind: DescendantKind;
        size?: string | null;
        children?: Array<
          | {
              __typename?: "LeafDescendant";
              kind: DescendantKind;
              bold?: boolean | null;
              italic?: boolean | null;
              code?: string | null;
              text?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
          | {
              __typename?: "MentionDescendant";
              kind: DescendantKind;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
              user?: {
                __typename?: "User";
                id: string;
                username: string;
                avatar?: string | null;
              } | null;
            }
          | {
              __typename?: "ParagraphDescendant";
              kind: DescendantKind;
              size?: string | null;
              children?: Array<
                | {
                    __typename?: "LeafDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    bold?: boolean | null;
                    italic?: boolean | null;
                    code?: string | null;
                    text?: string | null;
                  }
                | {
                    __typename?: "MentionDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    user?: {
                      __typename?: "User";
                      id: string;
                      username: string;
                      avatar?: string | null;
                    } | null;
                  }
                | {
                    __typename?: "ParagraphDescendant";
                    kind: DescendantKind;
                    unsafeChildren?: Array<any> | null;
                    size?: string | null;
                  }
              > | null;
            }
        > | null;
      }
  >;
  resolvedBy?: {
    __typename?: "User";
    id: string;
    username: string;
    avatar?: string | null;
  } | null;
  children: Array<{
    __typename?: "Comment";
    createdAt: any;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    };
    parent?: { __typename?: "Comment"; id: string } | null;
    descendants: Array<
      | {
          __typename?: "LeafDescendant";
          kind: DescendantKind;
          bold?: boolean | null;
          italic?: boolean | null;
          code?: string | null;
          text?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
      | {
          __typename?: "MentionDescendant";
          kind: DescendantKind;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
          user?: {
            __typename?: "User";
            id: string;
            username: string;
            avatar?: string | null;
          } | null;
        }
      | {
          __typename?: "ParagraphDescendant";
          kind: DescendantKind;
          size?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
    >;
  }>;
  mentions: Array<{
    __typename?: "User";
    id: string;
    username: string;
    avatar?: string | null;
  }>;
};

export type DetailGroupFragment = {
  __typename?: "Group";
  id: string;
  name: string;
  users: Array<{
    __typename?: "User";
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    avatar?: string | null;
    id: string;
  }>;
};

export type ListGroupFragment = {
  __typename?: "Group";
  id: string;
  name: string;
};

export type DetailReleaseFragment = {
  __typename?: "Release";
  id: string;
  version: any;
  logo: string;
  app: { __typename?: "App"; id: string; identifier: any; logo: string };
  clients: Array<{
    __typename?: "Client";
    id: string;
    kind: ClientKind;
    user: { __typename?: "User"; username: string };
    release: {
      __typename?: "Release";
      version: any;
      logo: string;
      app: { __typename?: "App"; id: string; identifier: any; logo: string };
    };
  }>;
};

export type ListReleaseFragment = {
  __typename?: "Release";
  id: string;
  version: any;
  logo: string;
  app: { __typename?: "App"; id: string; identifier: any; logo: string };
};

export type ListUserFragment = {
  __typename?: "User";
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  avatar?: string | null;
  id: string;
};

export type DetailUserFragment = {
  __typename?: "User";
  id: string;
  username: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  groups: Array<{ __typename?: "Group"; id: string; name: string }>;
};

export type MeUserFragment = {
  __typename?: "User";
  id: string;
  username: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
};

export type CreateCommentMutationVariables = Exact<{
  object: Scalars["ID"]["input"];
  identifier: Scalars["Identifier"]["input"];
  descendants: Array<DescendantInput> | DescendantInput;
  parent?: InputMaybe<Scalars["ID"]["input"]>;
}>;

export type CreateCommentMutation = {
  __typename?: "Mutation";
  createComment: {
    __typename?: "Comment";
    resolved: boolean;
    id: string;
    createdAt: any;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    };
    parent?: { __typename?: "Comment"; id: string } | null;
    descendants: Array<
      | {
          __typename?: "LeafDescendant";
          kind: DescendantKind;
          bold?: boolean | null;
          italic?: boolean | null;
          code?: string | null;
          text?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
      | {
          __typename?: "MentionDescendant";
          kind: DescendantKind;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
          user?: {
            __typename?: "User";
            id: string;
            username: string;
            avatar?: string | null;
          } | null;
        }
      | {
          __typename?: "ParagraphDescendant";
          kind: DescendantKind;
          size?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
    >;
    resolvedBy?: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    } | null;
    children: Array<{
      __typename?: "Comment";
      createdAt: any;
      user: {
        __typename?: "User";
        id: string;
        username: string;
        avatar?: string | null;
      };
      parent?: { __typename?: "Comment"; id: string } | null;
      descendants: Array<
        | {
            __typename?: "LeafDescendant";
            kind: DescendantKind;
            bold?: boolean | null;
            italic?: boolean | null;
            code?: string | null;
            text?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
        | {
            __typename?: "MentionDescendant";
            kind: DescendantKind;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
            user?: {
              __typename?: "User";
              id: string;
              username: string;
              avatar?: string | null;
            } | null;
          }
        | {
            __typename?: "ParagraphDescendant";
            kind: DescendantKind;
            size?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
      >;
    }>;
  };
};

export type ReplyToMutationVariables = Exact<{
  descendants: Array<DescendantInput> | DescendantInput;
  parent: Scalars["ID"]["input"];
}>;

export type ReplyToMutation = {
  __typename?: "Mutation";
  replyTo: {
    __typename?: "Comment";
    resolved: boolean;
    id: string;
    createdAt: any;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    };
    parent?: { __typename?: "Comment"; id: string } | null;
    descendants: Array<
      | {
          __typename?: "LeafDescendant";
          kind: DescendantKind;
          bold?: boolean | null;
          italic?: boolean | null;
          code?: string | null;
          text?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
      | {
          __typename?: "MentionDescendant";
          kind: DescendantKind;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
          user?: {
            __typename?: "User";
            id: string;
            username: string;
            avatar?: string | null;
          } | null;
        }
      | {
          __typename?: "ParagraphDescendant";
          kind: DescendantKind;
          size?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
    >;
    resolvedBy?: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    } | null;
    children: Array<{
      __typename?: "Comment";
      createdAt: any;
      user: {
        __typename?: "User";
        id: string;
        username: string;
        avatar?: string | null;
      };
      parent?: { __typename?: "Comment"; id: string } | null;
      descendants: Array<
        | {
            __typename?: "LeafDescendant";
            kind: DescendantKind;
            bold?: boolean | null;
            italic?: boolean | null;
            code?: string | null;
            text?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
        | {
            __typename?: "MentionDescendant";
            kind: DescendantKind;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
            user?: {
              __typename?: "User";
              id: string;
              username: string;
              avatar?: string | null;
            } | null;
          }
        | {
            __typename?: "ParagraphDescendant";
            kind: DescendantKind;
            size?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
      >;
    }>;
  };
};

export type ResolveCommentMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ResolveCommentMutation = {
  __typename?: "Mutation";
  resolveComment: {
    __typename?: "Comment";
    resolved: boolean;
    id: string;
    createdAt: any;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    };
    parent?: { __typename?: "Comment"; id: string } | null;
    descendants: Array<
      | {
          __typename?: "LeafDescendant";
          kind: DescendantKind;
          bold?: boolean | null;
          italic?: boolean | null;
          code?: string | null;
          text?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
      | {
          __typename?: "MentionDescendant";
          kind: DescendantKind;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
          user?: {
            __typename?: "User";
            id: string;
            username: string;
            avatar?: string | null;
          } | null;
        }
      | {
          __typename?: "ParagraphDescendant";
          kind: DescendantKind;
          size?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
    >;
    resolvedBy?: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    } | null;
    children: Array<{
      __typename?: "Comment";
      createdAt: any;
      user: {
        __typename?: "User";
        id: string;
        username: string;
        avatar?: string | null;
      };
      parent?: { __typename?: "Comment"; id: string } | null;
      descendants: Array<
        | {
            __typename?: "LeafDescendant";
            kind: DescendantKind;
            bold?: boolean | null;
            italic?: boolean | null;
            code?: string | null;
            text?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
        | {
            __typename?: "MentionDescendant";
            kind: DescendantKind;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
            user?: {
              __typename?: "User";
              id: string;
              username: string;
              avatar?: string | null;
            } | null;
          }
        | {
            __typename?: "ParagraphDescendant";
            kind: DescendantKind;
            size?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
      >;
    }>;
  };
};

export type AppsQueryVariables = Exact<{ [key: string]: never }>;

export type AppsQuery = {
  __typename?: "Query";
  apps: Array<{
    __typename?: "App";
    id: string;
    identifier: any;
    logo: string;
  }>;
};

export type AppQueryVariables = Exact<{
  identifier?: InputMaybe<Scalars["AppIdentifier"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  clientId?: InputMaybe<Scalars["ID"]["input"]>;
}>;

export type AppQuery = {
  __typename?: "Query";
  app: {
    __typename?: "App";
    id: string;
    identifier: any;
    logo: string;
    releases: Array<{
      __typename?: "Release";
      id: string;
      version: any;
      logo: string;
      app: { __typename?: "App"; id: string; identifier: any; logo: string };
    }>;
  };
};

export type ClientsQueryVariables = Exact<{ [key: string]: never }>;

export type ClientsQuery = {
  __typename?: "Query";
  clients: Array<{
    __typename?: "Client";
    id: string;
    kind: ClientKind;
    user: { __typename?: "User"; username: string };
    release: {
      __typename?: "Release";
      version: any;
      logo: string;
      app: { __typename?: "App"; id: string; identifier: any; logo: string };
    };
  }>;
};

export type DetailClientQueryVariables = Exact<{
  clientId?: InputMaybe<Scalars["ID"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
}>;

export type DetailClientQuery = {
  __typename?: "Query";
  client: {
    __typename?: "Client";
    id: string;
    token: string;
    kind: ClientKind;
    user: { __typename?: "User"; username: string };
    release: {
      __typename?: "Release";
      id: string;
      version: any;
      logo: string;
      app: { __typename?: "App"; id: string; identifier: any; logo: string };
    };
    oauth2Client: {
      __typename?: "Oauth2Client";
      authorizationGrantType: string;
      redirectUris: string;
    };
  };
};

export type MyManagedClientsQueryVariables = Exact<{
  kind: ClientKind;
}>;

export type MyManagedClientsQuery = {
  __typename?: "Query";
  myManagedClients: {
    __typename?: "Client";
    id: string;
    kind: ClientKind;
    user: { __typename?: "User"; username: string };
    release: {
      __typename?: "Release";
      version: any;
      logo: string;
      app: { __typename?: "App"; id: string; identifier: any; logo: string };
    };
  };
};

export type CommentsForQueryVariables = Exact<{
  object: Scalars["ID"]["input"];
  identifier: Scalars["Identifier"]["input"];
}>;

export type CommentsForQuery = {
  __typename?: "Query";
  commentsFor: Array<{
    __typename?: "Comment";
    resolved: boolean;
    id: string;
    createdAt: any;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    };
    parent?: { __typename?: "Comment"; id: string } | null;
    descendants: Array<
      | {
          __typename?: "LeafDescendant";
          kind: DescendantKind;
          bold?: boolean | null;
          italic?: boolean | null;
          code?: string | null;
          text?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
      | {
          __typename?: "MentionDescendant";
          kind: DescendantKind;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
          user?: {
            __typename?: "User";
            id: string;
            username: string;
            avatar?: string | null;
          } | null;
        }
      | {
          __typename?: "ParagraphDescendant";
          kind: DescendantKind;
          size?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
    >;
    resolvedBy?: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    } | null;
    children: Array<{
      __typename?: "Comment";
      createdAt: any;
      user: {
        __typename?: "User";
        id: string;
        username: string;
        avatar?: string | null;
      };
      parent?: { __typename?: "Comment"; id: string } | null;
      descendants: Array<
        | {
            __typename?: "LeafDescendant";
            kind: DescendantKind;
            bold?: boolean | null;
            italic?: boolean | null;
            code?: string | null;
            text?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
        | {
            __typename?: "MentionDescendant";
            kind: DescendantKind;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
            user?: {
              __typename?: "User";
              id: string;
              username: string;
              avatar?: string | null;
            } | null;
          }
        | {
            __typename?: "ParagraphDescendant";
            kind: DescendantKind;
            size?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
      >;
    }>;
  }>;
};

export type MyMentionsQueryVariables = Exact<{ [key: string]: never }>;

export type MyMentionsQuery = {
  __typename?: "Query";
  myMentions: {
    __typename?: "Comment";
    id: string;
    createdAt: any;
    resolved: boolean;
    object: string;
    identifier: any;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    };
    parent?: { __typename?: "Comment"; id: string } | null;
    descendants: Array<
      | {
          __typename?: "LeafDescendant";
          kind: DescendantKind;
          bold?: boolean | null;
          italic?: boolean | null;
          code?: string | null;
          text?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
      | {
          __typename?: "MentionDescendant";
          kind: DescendantKind;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
          user?: {
            __typename?: "User";
            id: string;
            username: string;
            avatar?: string | null;
          } | null;
        }
      | {
          __typename?: "ParagraphDescendant";
          kind: DescendantKind;
          size?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
    >;
    children: Array<{
      __typename?: "Comment";
      createdAt: any;
      user: {
        __typename?: "User";
        id: string;
        username: string;
        avatar?: string | null;
      };
      parent?: { __typename?: "Comment"; id: string } | null;
      descendants: Array<
        | {
            __typename?: "LeafDescendant";
            kind: DescendantKind;
            bold?: boolean | null;
            italic?: boolean | null;
            code?: string | null;
            text?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
        | {
            __typename?: "MentionDescendant";
            kind: DescendantKind;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
            user?: {
              __typename?: "User";
              id: string;
              username: string;
              avatar?: string | null;
            } | null;
          }
        | {
            __typename?: "ParagraphDescendant";
            kind: DescendantKind;
            size?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
      >;
    }>;
    mentions: Array<{
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    }>;
    resolvedBy?: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    } | null;
  };
};

export type DetailCommentQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type DetailCommentQuery = {
  __typename?: "Query";
  comment: {
    __typename?: "Comment";
    id: string;
    resolved: boolean;
    createdAt: any;
    object: string;
    identifier: any;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    };
    parent?: { __typename?: "Comment"; id: string } | null;
    descendants: Array<
      | {
          __typename?: "LeafDescendant";
          kind: DescendantKind;
          bold?: boolean | null;
          italic?: boolean | null;
          code?: string | null;
          text?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
      | {
          __typename?: "MentionDescendant";
          kind: DescendantKind;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
          user?: {
            __typename?: "User";
            id: string;
            username: string;
            avatar?: string | null;
          } | null;
        }
      | {
          __typename?: "ParagraphDescendant";
          kind: DescendantKind;
          size?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
    >;
    resolvedBy?: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    } | null;
    children: Array<{
      __typename?: "Comment";
      createdAt: any;
      user: {
        __typename?: "User";
        id: string;
        username: string;
        avatar?: string | null;
      };
      parent?: { __typename?: "Comment"; id: string } | null;
      descendants: Array<
        | {
            __typename?: "LeafDescendant";
            kind: DescendantKind;
            bold?: boolean | null;
            italic?: boolean | null;
            code?: string | null;
            text?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
        | {
            __typename?: "MentionDescendant";
            kind: DescendantKind;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
            user?: {
              __typename?: "User";
              id: string;
              username: string;
              avatar?: string | null;
            } | null;
          }
        | {
            __typename?: "ParagraphDescendant";
            kind: DescendantKind;
            size?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
      >;
    }>;
    mentions: Array<{
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    }>;
  };
};

export type GroupOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GroupOptionsQuery = {
  __typename?: "Query";
  options: Array<{ __typename?: "Group"; value: string; label: string }>;
};

export type DetailGroupQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type DetailGroupQuery = {
  __typename?: "Query";
  group: {
    __typename?: "Group";
    id: string;
    name: string;
    users: Array<{
      __typename?: "User";
      username: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      avatar?: string | null;
      id: string;
    }>;
  };
};

export type ReleasesQueryVariables = Exact<{ [key: string]: never }>;

export type ReleasesQuery = {
  __typename?: "Query";
  releases: Array<{
    __typename?: "Release";
    id: string;
    version: any;
    logo: string;
    app: { __typename?: "App"; id: string; identifier: any; logo: string };
  }>;
};

export type ReleaseQueryVariables = Exact<{
  identifier?: InputMaybe<Scalars["AppIdentifier"]["input"]>;
  version?: InputMaybe<Scalars["Version"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  clientId?: InputMaybe<Scalars["ID"]["input"]>;
}>;

export type ReleaseQuery = {
  __typename?: "Query";
  release: {
    __typename?: "Release";
    id: string;
    version: any;
    logo: string;
    app: { __typename?: "App"; id: string; identifier: any; logo: string };
    clients: Array<{
      __typename?: "Client";
      id: string;
      kind: ClientKind;
      user: { __typename?: "User"; username: string };
      release: {
        __typename?: "Release";
        version: any;
        logo: string;
        app: { __typename?: "App"; id: string; identifier: any; logo: string };
      };
    }>;
  };
};

export type ScopesQueryVariables = Exact<{ [key: string]: never }>;

export type ScopesQuery = {
  __typename?: "Query";
  scopes: Array<{
    __typename?: "Scope";
    description: string;
    value: string;
    label: string;
  }>;
};

export type ScopesOptionsQueryVariables = Exact<{ [key: string]: never }>;

export type ScopesOptionsQuery = {
  __typename?: "Query";
  options: Array<{ __typename?: "Scope"; value: string; label: string }>;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me: {
    __typename?: "User";
    id: string;
    username: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
    groups: Array<{ __typename?: "Group"; id: string; name: string }>;
  };
};

export type UserQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type UserQuery = {
  __typename?: "Query";
  user: {
    __typename?: "User";
    id: string;
    username: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
    groups: Array<{ __typename?: "Group"; id: string; name: string }>;
  };
};

export type DetailUserQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type DetailUserQuery = {
  __typename?: "Query";
  user: {
    __typename?: "User";
    id: string;
    username: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
    groups: Array<{ __typename?: "Group"; id: string; name: string }>;
  };
};

export type UserOptionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type UserOptionsQuery = {
  __typename?: "Query";
  options: Array<{ __typename?: "User"; value: string; label: string }>;
};

export type ProfileQueryVariables = Exact<{ [key: string]: never }>;

export type ProfileQuery = {
  __typename?: "Query";
  me: {
    __typename?: "User";
    id: string;
    username: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
  };
};

export type WatchMentionsSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type WatchMentionsSubscription = {
  __typename?: "Subscription";
  mentions: {
    __typename?: "Comment";
    id: string;
    createdAt: any;
    resolved: boolean;
    object: string;
    identifier: any;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    };
    parent?: { __typename?: "Comment"; id: string } | null;
    descendants: Array<
      | {
          __typename?: "LeafDescendant";
          kind: DescendantKind;
          bold?: boolean | null;
          italic?: boolean | null;
          code?: string | null;
          text?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
      | {
          __typename?: "MentionDescendant";
          kind: DescendantKind;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
          user?: {
            __typename?: "User";
            id: string;
            username: string;
            avatar?: string | null;
          } | null;
        }
      | {
          __typename?: "ParagraphDescendant";
          kind: DescendantKind;
          size?: string | null;
          children?: Array<
            | {
                __typename?: "LeafDescendant";
                kind: DescendantKind;
                bold?: boolean | null;
                italic?: boolean | null;
                code?: string | null;
                text?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
            | {
                __typename?: "MentionDescendant";
                kind: DescendantKind;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  username: string;
                  avatar?: string | null;
                } | null;
              }
            | {
                __typename?: "ParagraphDescendant";
                kind: DescendantKind;
                size?: string | null;
                children?: Array<
                  | {
                      __typename?: "LeafDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      bold?: boolean | null;
                      italic?: boolean | null;
                      code?: string | null;
                      text?: string | null;
                    }
                  | {
                      __typename?: "MentionDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        username: string;
                        avatar?: string | null;
                      } | null;
                    }
                  | {
                      __typename?: "ParagraphDescendant";
                      kind: DescendantKind;
                      unsafeChildren?: Array<any> | null;
                      size?: string | null;
                    }
                > | null;
              }
          > | null;
        }
    >;
    children: Array<{
      __typename?: "Comment";
      createdAt: any;
      user: {
        __typename?: "User";
        id: string;
        username: string;
        avatar?: string | null;
      };
      parent?: { __typename?: "Comment"; id: string } | null;
      descendants: Array<
        | {
            __typename?: "LeafDescendant";
            kind: DescendantKind;
            bold?: boolean | null;
            italic?: boolean | null;
            code?: string | null;
            text?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
        | {
            __typename?: "MentionDescendant";
            kind: DescendantKind;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
            user?: {
              __typename?: "User";
              id: string;
              username: string;
              avatar?: string | null;
            } | null;
          }
        | {
            __typename?: "ParagraphDescendant";
            kind: DescendantKind;
            size?: string | null;
            children?: Array<
              | {
                  __typename?: "LeafDescendant";
                  kind: DescendantKind;
                  bold?: boolean | null;
                  italic?: boolean | null;
                  code?: string | null;
                  text?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
              | {
                  __typename?: "MentionDescendant";
                  kind: DescendantKind;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                  user?: {
                    __typename?: "User";
                    id: string;
                    username: string;
                    avatar?: string | null;
                  } | null;
                }
              | {
                  __typename?: "ParagraphDescendant";
                  kind: DescendantKind;
                  size?: string | null;
                  children?: Array<
                    | {
                        __typename?: "LeafDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        bold?: boolean | null;
                        italic?: boolean | null;
                        code?: string | null;
                        text?: string | null;
                      }
                    | {
                        __typename?: "MentionDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        user?: {
                          __typename?: "User";
                          id: string;
                          username: string;
                          avatar?: string | null;
                        } | null;
                      }
                    | {
                        __typename?: "ParagraphDescendant";
                        kind: DescendantKind;
                        unsafeChildren?: Array<any> | null;
                        size?: string | null;
                      }
                  > | null;
                }
            > | null;
          }
      >;
    }>;
    mentions: Array<{
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    }>;
    resolvedBy?: {
      __typename?: "User";
      id: string;
      username: string;
      avatar?: string | null;
    } | null;
  };
};

export const ListAppFragmentDoc = gql`
  fragment ListApp on App {
    id
    identifier
    logo
  }
`;
export const ListReleaseFragmentDoc = gql`
  fragment ListRelease on Release {
    id
    version
    logo
    app {
      ...ListApp
    }
  }
  ${ListAppFragmentDoc}
`;
export const DetailAppFragmentDoc = gql`
  fragment DetailApp on App {
    id
    identifier
    logo
    releases {
      ...ListRelease
    }
  }
  ${ListReleaseFragmentDoc}
`;
export const DetailClientFragmentDoc = gql`
  fragment DetailClient on Client {
    id
    token
    user {
      username
    }
    kind
    release {
      ...ListRelease
    }
    oauth2Client {
      authorizationGrantType
      redirectUris
    }
  }
  ${ListReleaseFragmentDoc}
`;
export const CommentUserFragmentDoc = gql`
  fragment CommentUser on User {
    id
    username
    avatar
  }
`;
export const LeafFragmentDoc = gql`
  fragment Leaf on LeafDescendant {
    bold
    italic
    code
    text
  }
`;
export const MentionFragmentDoc = gql`
  fragment Mention on MentionDescendant {
    user {
      ...CommentUser
    }
  }
  ${CommentUserFragmentDoc}
`;
export const ParagraphFragmentDoc = gql`
  fragment Paragraph on ParagraphDescendant {
    size
  }
`;
export const DescendantFragmentDoc = gql`
  fragment Descendant on Descendant {
    kind
    children {
      kind
      children {
        kind
        unsafeChildren
        ...Leaf
        ...Mention
        ...Paragraph
      }
      ...Leaf
      ...Mention
      ...Paragraph
    }
    ...Mention
    ...Paragraph
    ...Leaf
  }
  ${LeafFragmentDoc}
  ${MentionFragmentDoc}
  ${ParagraphFragmentDoc}
`;
export const SubthreadCommentFragmentDoc = gql`
  fragment SubthreadComment on Comment {
    user {
      ...CommentUser
    }
    parent {
      id
    }
    createdAt
    descendants {
      ...Descendant
    }
  }
  ${CommentUserFragmentDoc}
  ${DescendantFragmentDoc}
`;
export const ListCommentFragmentDoc = gql`
  fragment ListComment on Comment {
    user {
      ...CommentUser
    }
    parent {
      id
    }
    descendants {
      ...Descendant
    }
    resolved
    resolvedBy {
      ...CommentUser
    }
    id
    createdAt
    children {
      ...SubthreadComment
    }
  }
  ${CommentUserFragmentDoc}
  ${DescendantFragmentDoc}
  ${SubthreadCommentFragmentDoc}
`;
export const MentionCommentFragmentDoc = gql`
  fragment MentionComment on Comment {
    user {
      ...CommentUser
    }
    parent {
      id
    }
    descendants {
      ...Descendant
    }
    id
    createdAt
    children {
      ...SubthreadComment
    }
    mentions {
      ...CommentUser
    }
    resolved
    resolvedBy {
      ...CommentUser
    }
    object
    identifier
  }
  ${CommentUserFragmentDoc}
  ${DescendantFragmentDoc}
  ${SubthreadCommentFragmentDoc}
`;
export const DetailCommentFragmentDoc = gql`
  fragment DetailComment on Comment {
    user {
      ...CommentUser
    }
    parent {
      id
    }
    descendants {
      ...Descendant
    }
    id
    resolved
    resolvedBy {
      ...CommentUser
    }
    createdAt
    children {
      ...SubthreadComment
    }
    mentions {
      ...CommentUser
    }
    object
    identifier
  }
  ${CommentUserFragmentDoc}
  ${DescendantFragmentDoc}
  ${SubthreadCommentFragmentDoc}
`;
export const ListUserFragmentDoc = gql`
  fragment ListUser on User {
    username
    firstName
    lastName
    email
    avatar
    id
  }
`;
export const DetailGroupFragmentDoc = gql`
  fragment DetailGroup on Group {
    id
    name
    users {
      ...ListUser
    }
  }
  ${ListUserFragmentDoc}
`;
export const ListGroupFragmentDoc = gql`
  fragment ListGroup on Group {
    id
    name
  }
`;
export const ListClientFragmentDoc = gql`
  fragment ListClient on Client {
    id
    user {
      username
    }
    kind
    release {
      version
      logo
      app {
        id
        identifier
        logo
      }
    }
  }
`;
export const DetailReleaseFragmentDoc = gql`
  fragment DetailRelease on Release {
    id
    version
    logo
    app {
      ...ListApp
    }
    clients {
      ...ListClient
    }
  }
  ${ListAppFragmentDoc}
  ${ListClientFragmentDoc}
`;
export const DetailUserFragmentDoc = gql`
  fragment DetailUser on User {
    id
    username
    email
    firstName
    lastName
    avatar
    groups {
      id
      name
    }
  }
`;
export const MeUserFragmentDoc = gql`
  fragment MeUser on User {
    id
    username
    email
    firstName
    lastName
    avatar
  }
`;
export const CreateCommentDocument = gql`
  mutation CreateComment(
    $object: ID!
    $identifier: Identifier!
    $descendants: [DescendantInput!]!
    $parent: ID
  ) {
    createComment(
      input: {
        object: $object
        identifier: $identifier
        descendants: $descendants
        parent: $parent
      }
    ) {
      ...ListComment
    }
  }
  ${ListCommentFragmentDoc}
`;
export type CreateCommentMutationFn = Apollo.MutationFunction<
  CreateCommentMutation,
  CreateCommentMutationVariables
>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      object: // value for 'object'
 *      identifier: // value for 'identifier'
 *      descendants: // value for 'descendants'
 *      parent: // value for 'parent'
 *   },
 * });
 */
export function useCreateCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(CreateCommentDocument, options);
}
export type CreateCommentMutationHookResult = ReturnType<
  typeof useCreateCommentMutation
>;
export type CreateCommentMutationResult =
  Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<
  CreateCommentMutation,
  CreateCommentMutationVariables
>;
export const ReplyToDocument = gql`
  mutation ReplyTo($descendants: [DescendantInput!]!, $parent: ID!) {
    replyTo(input: { descendants: $descendants, parent: $parent }) {
      ...ListComment
    }
  }
  ${ListCommentFragmentDoc}
`;
export type ReplyToMutationFn = Apollo.MutationFunction<
  ReplyToMutation,
  ReplyToMutationVariables
>;

/**
 * __useReplyToMutation__
 *
 * To run a mutation, you first call `useReplyToMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReplyToMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [replyToMutation, { data, loading, error }] = useReplyToMutation({
 *   variables: {
 *      descendants: // value for 'descendants'
 *      parent: // value for 'parent'
 *   },
 * });
 */
export function useReplyToMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ReplyToMutation,
    ReplyToMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ReplyToMutation, ReplyToMutationVariables>(
    ReplyToDocument,
    options,
  );
}
export type ReplyToMutationHookResult = ReturnType<typeof useReplyToMutation>;
export type ReplyToMutationResult = Apollo.MutationResult<ReplyToMutation>;
export type ReplyToMutationOptions = Apollo.BaseMutationOptions<
  ReplyToMutation,
  ReplyToMutationVariables
>;
export const ResolveCommentDocument = gql`
  mutation ResolveComment($id: ID!) {
    resolveComment(input: { id: $id }) {
      ...ListComment
    }
  }
  ${ListCommentFragmentDoc}
`;
export type ResolveCommentMutationFn = Apollo.MutationFunction<
  ResolveCommentMutation,
  ResolveCommentMutationVariables
>;

/**
 * __useResolveCommentMutation__
 *
 * To run a mutation, you first call `useResolveCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResolveCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resolveCommentMutation, { data, loading, error }] = useResolveCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useResolveCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ResolveCommentMutation,
    ResolveCommentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ResolveCommentMutation,
    ResolveCommentMutationVariables
  >(ResolveCommentDocument, options);
}
export type ResolveCommentMutationHookResult = ReturnType<
  typeof useResolveCommentMutation
>;
export type ResolveCommentMutationResult =
  Apollo.MutationResult<ResolveCommentMutation>;
export type ResolveCommentMutationOptions = Apollo.BaseMutationOptions<
  ResolveCommentMutation,
  ResolveCommentMutationVariables
>;
export const AppsDocument = gql`
  query Apps {
    apps {
      ...ListApp
    }
  }
  ${ListAppFragmentDoc}
`;

/**
 * __useAppsQuery__
 *
 * To run a query within a React component, call `useAppsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAppsQuery(
  baseOptions?: Apollo.QueryHookOptions<AppsQuery, AppsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AppsQuery, AppsQueryVariables>(AppsDocument, options);
}
export function useAppsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AppsQuery, AppsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AppsQuery, AppsQueryVariables>(
    AppsDocument,
    options,
  );
}
export type AppsQueryHookResult = ReturnType<typeof useAppsQuery>;
export type AppsLazyQueryHookResult = ReturnType<typeof useAppsLazyQuery>;
export type AppsQueryResult = Apollo.QueryResult<AppsQuery, AppsQueryVariables>;
export const AppDocument = gql`
  query App($identifier: AppIdentifier, $id: ID, $clientId: ID) {
    app(identifier: $identifier, id: $id, clientId: $clientId) {
      ...DetailApp
    }
  }
  ${DetailAppFragmentDoc}
`;

/**
 * __useAppQuery__
 *
 * To run a query within a React component, call `useAppQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppQuery({
 *   variables: {
 *      identifier: // value for 'identifier'
 *      id: // value for 'id'
 *      clientId: // value for 'clientId'
 *   },
 * });
 */
export function useAppQuery(
  baseOptions?: Apollo.QueryHookOptions<AppQuery, AppQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AppQuery, AppQueryVariables>(AppDocument, options);
}
export function useAppLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AppQuery, AppQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AppQuery, AppQueryVariables>(AppDocument, options);
}
export type AppQueryHookResult = ReturnType<typeof useAppQuery>;
export type AppLazyQueryHookResult = ReturnType<typeof useAppLazyQuery>;
export type AppQueryResult = Apollo.QueryResult<AppQuery, AppQueryVariables>;
export const ClientsDocument = gql`
  query Clients {
    clients {
      ...ListClient
    }
  }
  ${ListClientFragmentDoc}
`;

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
 *   },
 * });
 */
export function useClientsQuery(
  baseOptions?: Apollo.QueryHookOptions<ClientsQuery, ClientsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClientsQuery, ClientsQueryVariables>(
    ClientsDocument,
    options,
  );
}
export function useClientsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ClientsQuery,
    ClientsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClientsQuery, ClientsQueryVariables>(
    ClientsDocument,
    options,
  );
}
export type ClientsQueryHookResult = ReturnType<typeof useClientsQuery>;
export type ClientsLazyQueryHookResult = ReturnType<typeof useClientsLazyQuery>;
export type ClientsQueryResult = Apollo.QueryResult<
  ClientsQuery,
  ClientsQueryVariables
>;
export const DetailClientDocument = gql`
  query DetailClient($clientId: ID, $id: ID) {
    client(clientId: $clientId, id: $id) {
      ...DetailClient
    }
  }
  ${DetailClientFragmentDoc}
`;

/**
 * __useDetailClientQuery__
 *
 * To run a query within a React component, call `useDetailClientQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailClientQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailClientQuery({
 *   variables: {
 *      clientId: // value for 'clientId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailClientQuery(
  baseOptions?: Apollo.QueryHookOptions<
    DetailClientQuery,
    DetailClientQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DetailClientQuery, DetailClientQueryVariables>(
    DetailClientDocument,
    options,
  );
}
export function useDetailClientLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DetailClientQuery,
    DetailClientQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DetailClientQuery, DetailClientQueryVariables>(
    DetailClientDocument,
    options,
  );
}
export type DetailClientQueryHookResult = ReturnType<
  typeof useDetailClientQuery
>;
export type DetailClientLazyQueryHookResult = ReturnType<
  typeof useDetailClientLazyQuery
>;
export type DetailClientQueryResult = Apollo.QueryResult<
  DetailClientQuery,
  DetailClientQueryVariables
>;
export const MyManagedClientsDocument = gql`
  query MyManagedClients($kind: ClientKind!) {
    myManagedClients(kind: $kind) {
      ...ListClient
    }
  }
  ${ListClientFragmentDoc}
`;

/**
 * __useMyManagedClientsQuery__
 *
 * To run a query within a React component, call `useMyManagedClientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyManagedClientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyManagedClientsQuery({
 *   variables: {
 *      kind: // value for 'kind'
 *   },
 * });
 */
export function useMyManagedClientsQuery(
  baseOptions: Apollo.QueryHookOptions<
    MyManagedClientsQuery,
    MyManagedClientsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MyManagedClientsQuery, MyManagedClientsQueryVariables>(
    MyManagedClientsDocument,
    options,
  );
}
export function useMyManagedClientsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MyManagedClientsQuery,
    MyManagedClientsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MyManagedClientsQuery,
    MyManagedClientsQueryVariables
  >(MyManagedClientsDocument, options);
}
export type MyManagedClientsQueryHookResult = ReturnType<
  typeof useMyManagedClientsQuery
>;
export type MyManagedClientsLazyQueryHookResult = ReturnType<
  typeof useMyManagedClientsLazyQuery
>;
export type MyManagedClientsQueryResult = Apollo.QueryResult<
  MyManagedClientsQuery,
  MyManagedClientsQueryVariables
>;
export const CommentsForDocument = gql`
  query CommentsFor($object: ID!, $identifier: Identifier!) {
    commentsFor(identifier: $identifier, object: $object) {
      ...ListComment
    }
  }
  ${ListCommentFragmentDoc}
`;

/**
 * __useCommentsForQuery__
 *
 * To run a query within a React component, call `useCommentsForQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentsForQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsForQuery({
 *   variables: {
 *      object: // value for 'object'
 *      identifier: // value for 'identifier'
 *   },
 * });
 */
export function useCommentsForQuery(
  baseOptions: Apollo.QueryHookOptions<
    CommentsForQuery,
    CommentsForQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CommentsForQuery, CommentsForQueryVariables>(
    CommentsForDocument,
    options,
  );
}
export function useCommentsForLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CommentsForQuery,
    CommentsForQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CommentsForQuery, CommentsForQueryVariables>(
    CommentsForDocument,
    options,
  );
}
export type CommentsForQueryHookResult = ReturnType<typeof useCommentsForQuery>;
export type CommentsForLazyQueryHookResult = ReturnType<
  typeof useCommentsForLazyQuery
>;
export type CommentsForQueryResult = Apollo.QueryResult<
  CommentsForQuery,
  CommentsForQueryVariables
>;
export const MyMentionsDocument = gql`
  query MyMentions {
    myMentions {
      ...MentionComment
    }
  }
  ${MentionCommentFragmentDoc}
`;

/**
 * __useMyMentionsQuery__
 *
 * To run a query within a React component, call `useMyMentionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyMentionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyMentionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyMentionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    MyMentionsQuery,
    MyMentionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MyMentionsQuery, MyMentionsQueryVariables>(
    MyMentionsDocument,
    options,
  );
}
export function useMyMentionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MyMentionsQuery,
    MyMentionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MyMentionsQuery, MyMentionsQueryVariables>(
    MyMentionsDocument,
    options,
  );
}
export type MyMentionsQueryHookResult = ReturnType<typeof useMyMentionsQuery>;
export type MyMentionsLazyQueryHookResult = ReturnType<
  typeof useMyMentionsLazyQuery
>;
export type MyMentionsQueryResult = Apollo.QueryResult<
  MyMentionsQuery,
  MyMentionsQueryVariables
>;
export const DetailCommentDocument = gql`
  query DetailComment($id: ID!) {
    comment(id: $id) {
      ...DetailComment
    }
  }
  ${DetailCommentFragmentDoc}
`;

/**
 * __useDetailCommentQuery__
 *
 * To run a query within a React component, call `useDetailCommentQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailCommentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailCommentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailCommentQuery(
  baseOptions: Apollo.QueryHookOptions<
    DetailCommentQuery,
    DetailCommentQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DetailCommentQuery, DetailCommentQueryVariables>(
    DetailCommentDocument,
    options,
  );
}
export function useDetailCommentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DetailCommentQuery,
    DetailCommentQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DetailCommentQuery, DetailCommentQueryVariables>(
    DetailCommentDocument,
    options,
  );
}
export type DetailCommentQueryHookResult = ReturnType<
  typeof useDetailCommentQuery
>;
export type DetailCommentLazyQueryHookResult = ReturnType<
  typeof useDetailCommentLazyQuery
>;
export type DetailCommentQueryResult = Apollo.QueryResult<
  DetailCommentQuery,
  DetailCommentQueryVariables
>;
export const GroupOptionsDocument = gql`
  query GroupOptions($search: String) {
    options: groups(filters: { search: $search }) {
      value: name
      label: name
    }
  }
`;

/**
 * __useGroupOptionsQuery__
 *
 * To run a query within a React component, call `useGroupOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupOptionsQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGroupOptionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GroupOptionsQuery,
    GroupOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GroupOptionsQuery, GroupOptionsQueryVariables>(
    GroupOptionsDocument,
    options,
  );
}
export function useGroupOptionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GroupOptionsQuery,
    GroupOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GroupOptionsQuery, GroupOptionsQueryVariables>(
    GroupOptionsDocument,
    options,
  );
}
export type GroupOptionsQueryHookResult = ReturnType<
  typeof useGroupOptionsQuery
>;
export type GroupOptionsLazyQueryHookResult = ReturnType<
  typeof useGroupOptionsLazyQuery
>;
export type GroupOptionsQueryResult = Apollo.QueryResult<
  GroupOptionsQuery,
  GroupOptionsQueryVariables
>;
export const DetailGroupDocument = gql`
  query DetailGroup($id: ID!) {
    group(id: $id) {
      ...DetailGroup
    }
  }
  ${DetailGroupFragmentDoc}
`;

/**
 * __useDetailGroupQuery__
 *
 * To run a query within a React component, call `useDetailGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailGroupQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailGroupQuery(
  baseOptions: Apollo.QueryHookOptions<
    DetailGroupQuery,
    DetailGroupQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DetailGroupQuery, DetailGroupQueryVariables>(
    DetailGroupDocument,
    options,
  );
}
export function useDetailGroupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DetailGroupQuery,
    DetailGroupQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DetailGroupQuery, DetailGroupQueryVariables>(
    DetailGroupDocument,
    options,
  );
}
export type DetailGroupQueryHookResult = ReturnType<typeof useDetailGroupQuery>;
export type DetailGroupLazyQueryHookResult = ReturnType<
  typeof useDetailGroupLazyQuery
>;
export type DetailGroupQueryResult = Apollo.QueryResult<
  DetailGroupQuery,
  DetailGroupQueryVariables
>;
export const ReleasesDocument = gql`
  query Releases {
    releases {
      ...ListRelease
    }
  }
  ${ListReleaseFragmentDoc}
`;

/**
 * __useReleasesQuery__
 *
 * To run a query within a React component, call `useReleasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useReleasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReleasesQuery({
 *   variables: {
 *   },
 * });
 */
export function useReleasesQuery(
  baseOptions?: Apollo.QueryHookOptions<ReleasesQuery, ReleasesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ReleasesQuery, ReleasesQueryVariables>(
    ReleasesDocument,
    options,
  );
}
export function useReleasesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ReleasesQuery,
    ReleasesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ReleasesQuery, ReleasesQueryVariables>(
    ReleasesDocument,
    options,
  );
}
export type ReleasesQueryHookResult = ReturnType<typeof useReleasesQuery>;
export type ReleasesLazyQueryHookResult = ReturnType<
  typeof useReleasesLazyQuery
>;
export type ReleasesQueryResult = Apollo.QueryResult<
  ReleasesQuery,
  ReleasesQueryVariables
>;
export const ReleaseDocument = gql`
  query Release(
    $identifier: AppIdentifier
    $version: Version
    $id: ID
    $clientId: ID
  ) {
    release(
      identifier: $identifier
      version: $version
      id: $id
      clientId: $clientId
    ) {
      ...DetailRelease
    }
  }
  ${DetailReleaseFragmentDoc}
`;

/**
 * __useReleaseQuery__
 *
 * To run a query within a React component, call `useReleaseQuery` and pass it any options that fit your needs.
 * When your component renders, `useReleaseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReleaseQuery({
 *   variables: {
 *      identifier: // value for 'identifier'
 *      version: // value for 'version'
 *      id: // value for 'id'
 *      clientId: // value for 'clientId'
 *   },
 * });
 */
export function useReleaseQuery(
  baseOptions?: Apollo.QueryHookOptions<ReleaseQuery, ReleaseQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ReleaseQuery, ReleaseQueryVariables>(
    ReleaseDocument,
    options,
  );
}
export function useReleaseLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ReleaseQuery,
    ReleaseQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ReleaseQuery, ReleaseQueryVariables>(
    ReleaseDocument,
    options,
  );
}
export type ReleaseQueryHookResult = ReturnType<typeof useReleaseQuery>;
export type ReleaseLazyQueryHookResult = ReturnType<typeof useReleaseLazyQuery>;
export type ReleaseQueryResult = Apollo.QueryResult<
  ReleaseQuery,
  ReleaseQueryVariables
>;
export const ScopesDocument = gql`
  query Scopes {
    scopes {
      description
      value
      label
    }
  }
`;

/**
 * __useScopesQuery__
 *
 * To run a query within a React component, call `useScopesQuery` and pass it any options that fit your needs.
 * When your component renders, `useScopesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScopesQuery({
 *   variables: {
 *   },
 * });
 */
export function useScopesQuery(
  baseOptions?: Apollo.QueryHookOptions<ScopesQuery, ScopesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ScopesQuery, ScopesQueryVariables>(
    ScopesDocument,
    options,
  );
}
export function useScopesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ScopesQuery, ScopesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ScopesQuery, ScopesQueryVariables>(
    ScopesDocument,
    options,
  );
}
export type ScopesQueryHookResult = ReturnType<typeof useScopesQuery>;
export type ScopesLazyQueryHookResult = ReturnType<typeof useScopesLazyQuery>;
export type ScopesQueryResult = Apollo.QueryResult<
  ScopesQuery,
  ScopesQueryVariables
>;
export const ScopesOptionsDocument = gql`
  query ScopesOptions {
    options: scopes {
      value
      label
    }
  }
`;

/**
 * __useScopesOptionsQuery__
 *
 * To run a query within a React component, call `useScopesOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useScopesOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScopesOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useScopesOptionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ScopesOptionsQuery,
    ScopesOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ScopesOptionsQuery, ScopesOptionsQueryVariables>(
    ScopesOptionsDocument,
    options,
  );
}
export function useScopesOptionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ScopesOptionsQuery,
    ScopesOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ScopesOptionsQuery, ScopesOptionsQueryVariables>(
    ScopesOptionsDocument,
    options,
  );
}
export type ScopesOptionsQueryHookResult = ReturnType<
  typeof useScopesOptionsQuery
>;
export type ScopesOptionsLazyQueryHookResult = ReturnType<
  typeof useScopesOptionsLazyQuery
>;
export type ScopesOptionsQueryResult = Apollo.QueryResult<
  ScopesOptionsQuery,
  ScopesOptionsQueryVariables
>;
export const MeDocument = gql`
  query Me {
    me {
      ...DetailUser
    }
  }
  ${DetailUserFragmentDoc}
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const UserDocument = gql`
  query User($id: ID!) {
    user(id: $id) {
      ...DetailUser
    }
  }
  ${DetailUserFragmentDoc}
`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(
  baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
}
export function useUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    options,
  );
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const DetailUserDocument = gql`
  query DetailUser($id: ID!) {
    user(id: $id) {
      ...DetailUser
    }
  }
  ${DetailUserFragmentDoc}
`;

/**
 * __useDetailUserQuery__
 *
 * To run a query within a React component, call `useDetailUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailUserQuery(
  baseOptions: Apollo.QueryHookOptions<
    DetailUserQuery,
    DetailUserQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DetailUserQuery, DetailUserQueryVariables>(
    DetailUserDocument,
    options,
  );
}
export function useDetailUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DetailUserQuery,
    DetailUserQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DetailUserQuery, DetailUserQueryVariables>(
    DetailUserDocument,
    options,
  );
}
export type DetailUserQueryHookResult = ReturnType<typeof useDetailUserQuery>;
export type DetailUserLazyQueryHookResult = ReturnType<
  typeof useDetailUserLazyQuery
>;
export type DetailUserQueryResult = Apollo.QueryResult<
  DetailUserQuery,
  DetailUserQueryVariables
>;
export const UserOptionsDocument = gql`
  query UserOptions($search: String) {
    options: users(filters: { search: $search }) {
      value: id
      label: username
    }
  }
`;

/**
 * __useUserOptionsQuery__
 *
 * To run a query within a React component, call `useUserOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserOptionsQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useUserOptionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UserOptionsQuery,
    UserOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserOptionsQuery, UserOptionsQueryVariables>(
    UserOptionsDocument,
    options,
  );
}
export function useUserOptionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserOptionsQuery,
    UserOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserOptionsQuery, UserOptionsQueryVariables>(
    UserOptionsDocument,
    options,
  );
}
export type UserOptionsQueryHookResult = ReturnType<typeof useUserOptionsQuery>;
export type UserOptionsLazyQueryHookResult = ReturnType<
  typeof useUserOptionsLazyQuery
>;
export type UserOptionsQueryResult = Apollo.QueryResult<
  UserOptionsQuery,
  UserOptionsQueryVariables
>;
export const ProfileDocument = gql`
  query Profile {
    me {
      ...MeUser
    }
  }
  ${MeUserFragmentDoc}
`;

/**
 * __useProfileQuery__
 *
 * To run a query within a React component, call `useProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useProfileQuery(
  baseOptions?: Apollo.QueryHookOptions<ProfileQuery, ProfileQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProfileQuery, ProfileQueryVariables>(
    ProfileDocument,
    options,
  );
}
export function useProfileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProfileQuery,
    ProfileQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProfileQuery, ProfileQueryVariables>(
    ProfileDocument,
    options,
  );
}
export type ProfileQueryHookResult = ReturnType<typeof useProfileQuery>;
export type ProfileLazyQueryHookResult = ReturnType<typeof useProfileLazyQuery>;
export type ProfileQueryResult = Apollo.QueryResult<
  ProfileQuery,
  ProfileQueryVariables
>;
export const WatchMentionsDocument = gql`
  subscription WatchMentions {
    mentions {
      ...MentionComment
    }
  }
  ${MentionCommentFragmentDoc}
`;

/**
 * __useWatchMentionsSubscription__
 *
 * To run a query within a React component, call `useWatchMentionsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWatchMentionsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWatchMentionsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useWatchMentionsSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    WatchMentionsSubscription,
    WatchMentionsSubscriptionVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    WatchMentionsSubscription,
    WatchMentionsSubscriptionVariables
  >(WatchMentionsDocument, options);
}
export type WatchMentionsSubscriptionHookResult = ReturnType<
  typeof useWatchMentionsSubscription
>;
export type WatchMentionsSubscriptionResult =
  Apollo.SubscriptionResult<WatchMentionsSubscription>;
