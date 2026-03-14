import { AssignationEventFragment } from "@/rekuest/api/graphql";
import { Structure } from "@/types";
import React from "react";

export type OnDone = (args: {
  event?: AssignationEventFragment;
  kind: "local" | "action" | "shortcut" | "relation" | "measurement";
}) => void;

export type OnError = (args: {
  event?: AssignationEventFragment;
  kind: "local" | "action" | "shortcut" | "relation" | "measurement";
}) => void;

export type SmartContextProps = {
  children?: React.ReactNode;
  className?: string;
  objects: Structure[];
  partners?: Structure[];
  returns?: string[];
  expect?: string[];
  collection?: string;
  onDone?: OnDone;
  onError?: (error: string) => void;
  ephemeral?: boolean;
  disableShortcuts?: boolean;
  disableKraph?: boolean;
  disableKabinet?: boolean;
  disableActions?: boolean;
  disableBatchActions?: boolean;
};

export type ObjectButtonProps = SmartContextProps & {
  children?: React.ReactNode;
  className?: string;
  variant?: "outline" | "default";
  size?: "sm" | "lg" | "icon";
};

export type PassDownProps = SmartContextProps & {
  filter?: string;
};
