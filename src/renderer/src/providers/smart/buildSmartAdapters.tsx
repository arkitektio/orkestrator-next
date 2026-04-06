import { Object, Identifier } from "@/types";
import React from "react";

export type SmartObjectContext<T extends Object = Object> = {
  identifier: Identifier;
  object: T;
};

export type SmartModelPage<T extends Object = Object> = {
  children?: React.ReactNode;
  object: T;
  title?: React.ReactNode;
  sidebars?: React.ReactNode;
  additionalSidebars?: { [key: string]: React.ReactNode };
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: unknown;
  callback?: (object: T) => void;
};

export type SmartListPageProps<T extends Object = Object> = {
  children?: React.ReactNode;
  title?: React.ReactNode;
  help?: React.ReactNode;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: unknown;
  callback?: (object: T) => void;
};

export type SmartObjectButtonProps<T extends Object = Object> = {
  object: T;
  children?: React.ReactNode;
  [key: string]: any;
};

export type SmartNewButtonProps = {
  children?: React.ReactNode;
  [key: string]: any;
};

export type SmartEnhanceButtonProps<T extends Object = Object> = {
  object: T;
  children?: React.ReactNode;
  [key: string]: any;
};

export interface SmartBuilderAdapters {
  renderKomments: (context: SmartObjectContext) => React.ReactNode;
  renderKnowledge: (context: SmartObjectContext) => React.ReactNode;
  renderTinyKnowledge: (context: SmartObjectContext) => React.ReactNode;
  renderModelPage: (
    props: SmartModelPage<any> & { identifier: Identifier },
  ) => React.ReactNode;
  renderListPage: (
    props: SmartListPageProps & { identifier: Identifier },
  ) => React.ReactNode;
  renderObjectButton: (
    props: SmartObjectButtonProps & { identifier: Identifier },
  ) => React.ReactNode;
  renderNewButton: (
    props: SmartNewButtonProps & { identifier: Identifier },
  ) => React.ReactNode;
  renderEnhanceButton: (
    props: SmartEnhanceButtonProps & { identifier: Identifier },
  ) => React.ReactNode;
  useNodes: (identifier: Identifier) => any;
  useProgress: (identifier: Identifier, object: Object) => any;
  useLive: (identifier: Identifier, object: Object) => any;
}

let smartBuilderAdapters: SmartBuilderAdapters = {
  renderKomments: () => null,
  renderKnowledge: () => null,
  renderTinyKnowledge: () => <>Not implemented right now</>,
  renderModelPage: ({ children }) => <>{children}</>,
  renderListPage: ({ children }) => <>{children}</>,
  renderObjectButton: () => null,
  renderNewButton: () => null,
  renderEnhanceButton: () => null,
  useNodes: () => null,
  useProgress: () => ({ latestProgress: undefined }),
  useLive: () => ({ progress: undefined }),
};

export const configureSmartBuilder = (
  adapters: Partial<SmartBuilderAdapters>,
) => {
  smartBuilderAdapters = {
    ...smartBuilderAdapters,
    ...adapters,
  };
};

export const getSmartBuilderAdapters = () => smartBuilderAdapters;
