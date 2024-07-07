import {
  ModelPageLayout,
  ModelPageLayoutProps,
} from "@/components/layout/ModelPageLayout";
import { Komments } from "@/lok-next/components/komments/Komments";
import { usePrimaryNodesQuery } from "@/rekuest/api/graphql";
import { ObjectButton, ObjectButtonProps } from "@/rekuest/buttons/ObjectButton";
import { withRekuest } from "@jhnnsrs/rekuest-next";
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

export type ObjectProps = {
  object: string;
};

const buildSelfActions = (model: Identifier) => {
  return ({ ...props }: ObjectProps) => {
    return <></>;
  };
};

const buildKomments = (model: Identifier) => {
  return ({ ...props }: ObjectProps) => {
    return <Komments identifier={model} object={props.object} />;
  };
};

export type SmartModelPage = Omit<ModelPageLayoutProps, "identifier">;

const buildModelPage = (model: Identifier) => {
  return ({ ...props }: SmartModelPage) => {
    return (
      <ModelPageLayout identifier={model} {...props}>
        {props.children}
      </ModelPageLayout>
    );
  };
};

const buildUseNodesQuery = (model: Identifier) => {
  return withRekuest(usePrimaryNodesQuery)({
    variables: {
      identifier: model,
    },
  });
  
};

export type SmartObjectButtonProps = Omit<ObjectButtonProps, "identifier">;

const buildObjectButton = (model: Identifier) => {
  return ({ ...props }: SmartObjectButtonProps) => {
    return <ObjectButton identifier={model} object={props.object} />;
  };
}

export const buildSmart = (model: Identifier, to: string) => {
  return {
    DetailLink: buildModelLink(to),
    ListLink: buildBaseLink(to),
    linkBuilder: linkBuilder(to),
    Smart: buildSmartModel(model),
    Actions: buildSelfActions(model),
    Komments: buildKomments(model),
    identifier: model,
    ModelPage: buildModelPage(model),
    useNodes: () => buildUseNodesQuery(model),
    ObjectButton: buildObjectButton(model)
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
