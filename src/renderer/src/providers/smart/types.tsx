import { MateFinder } from "@/mates/types";
import { NavLinkProps } from "react-router-dom";

export type Identifier = string;

export type OmitedNavLinkProps = Omit<NavLinkProps, "to">;
export type BaseLinkProps = OmitedNavLinkProps;
export type ModelLinkProps = OmitedNavLinkProps & {
  object: string;
  subroute?: string;
  subobject?: string;
  deeproute?: string;
};

export type ClassNameOptions = {
  isOver: boolean;
  isDragging: boolean;
  canDrop: boolean;
  progress: number | undefined;
};

export interface SmartModelProps {
  identifier: string;
  object: string;
  as?: HTMLElement;
  children: React.ReactNode;
  showSelectingIndex?: boolean;
  containerClassName?: string;
  dragClassName?: (props: ClassNameOptions) => string;
  dropClassName?: (props: ClassNameOptions) => string;
  dragStyle?: (props: ClassNameOptions) => React.CSSProperties;
  dropStyle?: (props: ClassNameOptions) => React.CSSProperties;
  hover?: boolean;
  showSelfMates?: boolean;
  className?: string;
  mates?: MateFinder[];
}

export interface CreatedSmartSmartProps
  extends Omit<SmartModelProps, "accepts" | "identifier"> {
  object: string;
  dropClassName?: (props: ClassNameOptions) => string;
  dragClassName?: (props: ClassNameOptions) => string;
  dragStyle?: (props: ClassNameOptions) => React.CSSProperties;
  dropStyle?: (props: ClassNameOptions) => React.CSSProperties;
  children: React.ReactNode;
}
