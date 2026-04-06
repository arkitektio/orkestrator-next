import { PaneLinkProps } from "@/components/ui/sidepane";
import { NavLinkProps } from "react-router-dom";
import { Object, Identifier } from "@/types";



export type OmitedNavLinkProps = Omit<NavLinkProps, "to">;
export type OmittedPaneLinkProps = Omit<PaneLinkProps, "to">;
export type BaseLinkProps = OmitedNavLinkProps;
export type ModelLinkProps<T extends Object> = OmitedNavLinkProps & {
  object: T;
  subroute?: string;
  subobject?: string;
  deeproute?: string;
};


export type SmartPaneLinkProps<T extends Object> = OmittedPaneLinkProps & {
  object: T;
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
  identifier: Identifier;
  object: Object;
  as?: HTMLElement;
  children: React.ReactNode;
  containerClassName?: string;
  dragStyle?: (props: ClassNameOptions) => React.CSSProperties;
  dropStyle?: (props: ClassNameOptions) => React.CSSProperties;
  hover?: boolean;
  showSelfMates?: boolean;
  className?: string;

}

export interface CreatedSmartSmartProps<T extends Object>
  extends Omit<SmartModelProps, "accepts" | "identifier"> {
  object: T;
  dragStyle?: (props: ClassNameOptions) => React.CSSProperties;
  dropStyle?: (props: ClassNameOptions) => React.CSSProperties;
  children: React.ReactNode;
}
