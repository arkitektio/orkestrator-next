import { Structure } from "@/types";

export type ActionEvent = {
  self: Structure;
  partners: Structure[];
  progress: (x: number) => Promise<void>;
};

export type MateOptions = {
  partners?: Structure[];
  self: Structure;
  partnersIncludeSelf: boolean;
  justSelf: boolean;
};

export type Mate = {
  action: (event: ActionEvent) => Promise<any>;
  label: React.ReactNode;
  className?: (options: { isOver: boolean }) => string | string;
  description?:
    | ((options: { self: Structure; drops: Structure[] }) => React.ReactNode)
    | React.ReactNode;
};

export type MateFinder = (options: MateOptions) => Promise<Mate[] | undefined>;
