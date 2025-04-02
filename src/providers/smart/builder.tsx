import {
  ModelPageLayout,
  ModelPageLayoutProps,
} from "@/components/layout/ModelPageLayout";
import { Komments } from "@/lok-next/components/komments/Komments";
import { usePrimaryNodesQuery } from "@/rekuest/api/graphql";
import { NewButton, NewButtonProps } from "@/rekuest/buttons/NewButton";
import {
  ObjectButton,
  ObjectButtonProps,
} from "@/rekuest/buttons/ObjectButton";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import { useAssignProgress } from "@/rekuest/hooks/useAssignProgress";
import { NavLink } from "react-router-dom";
import { SmartModel } from "./SmartModel";
import {
  BaseLinkProps,
  CreatedSmartSmartProps,
  Identifier,
  ModelLinkProps,
  OmitedNavLinkProps,
} from "./types";
import { SearchFunction, smartRegistry } from "./registry";
import { KnowledgeSidebar } from "@/kraph/components/sidebars/KnowledgeSidebar";
import { SmartDropZone } from "./Drop";

const buildBaseLink = (to: string) => {
  return ({ children, ...props }: BaseLinkProps) => {
    return (
      <NavLink {...props} to={`/${to}`}>
        {children}
      </NavLink>
    );
  };
};

const buildModelLink = (to: string) => {
  return ({ children, subroute, ...props }: ModelLinkProps) => {
    return (
      <NavLink
        {...props}
        to={`/${to}/${props.object}/${subroute || ""}`}
        title="Open"
        className={props.className}
      >
        {children}
      </NavLink>
    );
  };
};

const linkBuilder = (to: string) => (object: string | undefined) => {
  if (!object) {
    return `/error`;
  }

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

export const buildDropModel = (
  identifier: Identifier,
): React.FC<CreatedSmartSmartProps> => {
  return ({ children, ...props }) => {
    return (
      <SmartDropZone identifier={identifier} {...props}>
        {children}
      </SmartDropZone>
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

const buildKnowledge = (model: Identifier) => {
  return ({ ...props }: ObjectProps) => {
    return <KnowledgeSidebar identifier={model} object={props.object} />;
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
  return usePrimaryNodesQuery({
    variables: {
      identifier: model,
    },
  });
};

const buildUseProgress = (model: Identifier, object: string) => {
  return useAssignProgress({
    identifier: model,
    object: object,
  });
};

const buildUseLive = (model: Identifier, object: string) => {
  return useLiveAssignation({
    identifier: model,
    object: object,
  });
};

export type SmartObjectButtonProps = Omit<ObjectButtonProps, "identifier">;
export type SmartNewButtonProps = Omit<NewButtonProps, "identifier">;

const buildObjectButton = (model: Identifier) => {
  return ({ ...props }: SmartObjectButtonProps) => {
    return <ObjectButton identifier={model} {...props} />;
  };
};

const buildNewButton = (model: Identifier) => {
  return ({ ...props }: SmartNewButtonProps) => {
    return <NewButton identifier={model} {...props} />;
  };
};

export const buildSmart = (
  model: Identifier,
  to: string,
  searchFunction?: SearchFunction,
) => {
  smartRegistry.register({
    identifier: model,
    path: to,
    search: searchFunction,
    description: "A smart model",
  });

  return {
    DetailLink: buildModelLink(to),
    ListLink: buildBaseLink(to),
    linkBuilder: linkBuilder(to),
    Smart: buildSmartModel(model),
    Drop: buildDropModel(model),
    Actions: buildSelfActions(model),
    Komments: buildKomments(model),
    Knowledge: buildKnowledge(model),
    identifier: model,
    ModelPage: buildModelPage(model),
    useNodes: () => buildUseNodesQuery(model),
    ObjectButton: buildObjectButton(model),
    NewButton: buildNewButton(model),
    useProgress: ({ object }: { object: string }) =>
      buildUseProgress(model, object),
    useLive: ({ object }: { object: string }) => buildUseLive(model, object),
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
