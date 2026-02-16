import {
  ModelPageLayout,
  ModelPageLayoutProps,
} from "@/components/layout/ModelPageLayout";
import { KnowledgeSidebar } from "@/kraph/components/sidebars/KnowledgeSidebar";
import { Komments } from "@/lok-next/components/komments/Komments";
import { usePrimaryActionsQuery } from "@/rekuest/api/graphql";
import {
  ObjectButton,
  ObjectButtonProps,
} from "@/rekuest/buttons/ObjectButton";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import { useAssignProgress } from "@/rekuest/hooks/useAssignProgress";
import { ObjectID } from "@/types";
import { NavLink } from "react-router-dom";
import { SmartDropZone } from "./Drop";
import { SearchFunction, smartRegistry } from "./registry";
import { ShareDialog } from "./ShareDialog";
import { SmartModel } from "./SmartModel";
import {
  BaseLinkProps,
  CreatedSmartSmartProps,
  Identifier,
  ModelLinkProps,
  OmitedNavLinkProps,
  SmartPaneLinkProps,
} from "./types";
import {
  ListPageLayout,
  ListPageLayoutProps,
} from "@/components/layout/ListPageLayout";
import { EnhanceButton, EnhanceButtonProps } from "@/alpaka/components/EnhanceButton";
import { PaneLink } from "@/components/ui/sidepane";

const buildBaseLink = (to: string) => {
  return ({ children, ...props }: BaseLinkProps) => {
    return (
      <NavLink {...props} to={`/${to}`}>
        {children}
      </NavLink>
    );
  };
};

export const SmartLink = ({
  identifier,
  object,
  subroute,
  subobject,
  deeproute,
  children,
  ...props
}: {
  identifier: string;
  object: string;
  subroute?: string;
  subobject?: string;
  deeproute?: string;
} & OmitedNavLinkProps) => {
  const model = smartRegistry.findModel(identifier);
  if (!model) {
    return null;
  }

  return (
    <NavLink
      {...props}
      to={`/${model.path}/${object}${subroute ? `/${subroute}` : ""}${subobject ? `/${subobject}` : ""}${deeproute ? `/${deeproute}` : ""}`}
      title="Open"
      className={props.className}
    >
      {children}
    </NavLink>
  );
};

export const buildModelLink = (to: string) => {
  return ({
    children,
    subroute,
    subobject,
    deeproute,
    ...props
  }: ModelLinkProps) => {
    return (
      <NavLink
        {...props}
        to={`/${to}/${props.object}${subroute ? `/${subroute}` : ""}${subobject ? `/${subobject}` : ""}${deeproute ? `/${deeproute}` : ""}`}
        title="Open"
        className={props.className}
      >
        {children}
      </NavLink>
    );
  };
};


export const buildPaneLink = (to: string) => {
  return ({
    children,
    subroute,
    subobject,
    deeproute,
    ...props
  }: SmartPaneLinkProps) => {
    return (
      <PaneLink
        {...props}
        to={`/${to}/${props.object}${subroute ? `/${subroute}` : ""}${subobject ? `/${subobject}` : ""}${deeproute ? `/${deeproute}` : ""}`}

      >
        {children}
      </PaneLink>
    );
  };
};

export const linkBuilder = (to: string) => (object: string | undefined) => {
  if (!object) {
    return `/error`;
  }

  return `/${to}/${object}`;
};

export const listLinkBuilder = (to: string) => () => {
  return `/${to}/`;
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

const buildTinyKnowledge = (model: Identifier) => {
  return ({ ...props }: ObjectProps) => {
    return <> Not implemented right now</>
  };
};

export type SmartModelPage = Omit<ModelPageLayoutProps, "identifier">;
export type SmartListPageProps = Omit<ListPageLayoutProps, "identifier">;

const buildModelPage = (model: Identifier) => {
  return ({ ...props }: SmartModelPage) => {
    return (
      <ModelPageLayout identifier={model} {...props}>
        {props.children}
      </ModelPageLayout>
    );
  };
};

const buildListPage = (model: Identifier) => {
  return ({ ...props }: SmartListPageProps) => {
    return (
      <ListPageLayout identifier={model} {...props}>
        {props.children}
      </ListPageLayout>
    );
  };
};

const buildUseNodesQuery = (model: Identifier) => {
  return usePrimaryActionsQuery({
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

export type SmartObjectButtonProps = Omit<ObjectButtonProps, "objects"> & {
  object: ObjectID;
};
export type SmartNewButtonProps = Omit<ObjectButtonProps, "objects">;

export type SmartEnhanceButtonProps = Omit<EnhanceButtonProps, "identifier">

const buildObjectButton = (model: Identifier) => {
  return ({ object, ...props }: SmartObjectButtonProps) => {
    return (
      <ObjectButton objects={[{ identifier: model, object }]} {...props} />
    );
  };
};

const buildEnhanceButton = (model: Identifier) => {
  return ({ ...props }: SmartEnhanceButtonProps) => {
    return (
      <EnhanceButton identifier={model} object={props.object} />
    );
  };
}

const buildNewButton = (model: Identifier) => {
  return ({ ...props }: SmartNewButtonProps) => {
    return <ObjectButton returns={[model]} objects={[]} {...props} />;
  };
};

export const buildSmart = (
  model: Identifier,
  to: string,
  options?: {
    searchFunction?: SearchFunction;
    describeQuery?: string;
  },
) => {
  smartRegistry.register({
    identifier: model,
    path: to,
    search: options?.searchFunction,
    description: "A smart model",
  });

  return {
    DetailLink: buildModelLink(to),
    PaneLink: buildPaneLink(to),
    ListLink: buildBaseLink(to),
    linkBuilder: linkBuilder(to),
    listlinkBuilder: listLinkBuilder(to),
    Smart: buildSmartModel(model),
    Drop: buildDropModel(model),
    Actions: buildSelfActions(model),
    Komments: buildKomments(model),
    Knowledge: buildKnowledge(model),
    EnhanceButton: buildEnhanceButton(model),
    TinyKnowledge: buildTinyKnowledge(model),
    identifier: model,
    ModelPage: buildModelPage(model),
    ListPage: buildListPage(model),
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
