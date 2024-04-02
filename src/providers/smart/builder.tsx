import { NavLink } from "react-router-dom";
import { SmartModel } from "./SmartModel";
import {
  BaseLinkProps,
  CreatedSmartSmartProps,
  Identifier,
  ModelLinkProps,
  OmitedNavLinkProps,
} from "./types";

const buildBaseLink = (to: string) => {
  return ({ children, ...props }: BaseLinkProps) => {
    return (
      <NavLink {...props} to={`/user/${to}`}>
        {children}
      </NavLink>
    );
  };
};

const buildModelLink = (to: string) => {
  return ({ children, ...props }: ModelLinkProps) => {
    return (
      <NavLink {...props} to={`/${to}/${props.object}`} title="Open">
        {children}
      </NavLink>
    );
  };
};

const linkBuilder = (to: string) => (object: string) => {
  return `/${to}/${object}`;
};

export const buildSmartModel = (
  identifier: Identifier,
): React.FC<CreatedSmartSmartProps> => {
  return ({ children, ...props }) => {
    return (
      <SmartModel identifier={identifier} {...props}>
        {children}
      </SmartModel>
    );
  };
};

export type IDProps = {
  id: string;
};

const buildSelfActions = (model: Identifier) => {
  return ({ ...props }: IDProps) => {
    return <></>;
  };
};

const buildKomments = (model: Identifier) => {
  return ({ ...props }: IDProps) => {
    return (
      <>
        {" "}
        Not implemeneted yet {model} {props.id}
      </>
    );
  };
};

export const buildSmart = (model: Identifier, to: string) => {
  return {
    DetailLink: buildModelLink(to),
    ListLink: buildBaseLink(to),
    linkBuilder: linkBuilder(to),
    Smart: buildSmartModel(model),
    Actions: buildSelfActions(model),
    Komments: buildKomments(model),
    identifier: model
  };
};

export type Smart = ReturnType<typeof buildSmart>;

export const buildModuleLink = (module: string) => {
  return ({ children, ...props }: OmitedNavLinkProps) => {
    return (
      <NavLink {...props} to={`/${module}`}>
        {children}
      </NavLink>
    );
  };
};
