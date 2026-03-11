import { PaneLink } from "@/components/ui/sidepane";
import { NavLink } from "react-router-dom";
import {
  getSmartBuilderAdapters,
  SmartEnhanceButtonProps,
  SmartListPageProps,
  SmartModelPage,
  SmartNewButtonProps,
  SmartObjectButtonProps,
} from "./buildSmartAdapters";
import { SmartDropZone } from "./Drop";
import { SearchFunction, smartRegistry } from "./registry";
import { SmartModel } from "./SmartModel";
import {
  BaseLinkProps,
  CreatedSmartSmartProps,
  Identifier,
  ModelLinkProps,
  OmitedNavLinkProps,
  SmartPaneLinkProps,
} from "./types";

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

const buildSelfActions = (_model: Identifier) => {
  return (_props: ObjectProps) => {
    return <></>;
  };
};

const buildKomments = (model: Identifier) => {
  return ({ ...props }: ObjectProps) => {
    return getSmartBuilderAdapters().renderKomments({
      identifier: model,
      object: props.object,
    });
  };
};

const buildKnowledge = (model: Identifier) => {
  return ({ ...props }: ObjectProps) => {
    return getSmartBuilderAdapters().renderKnowledge({
      identifier: model,
      object: props.object,
    });
  };
};

const buildTinyKnowledge = (_model: Identifier) => {
  return ({ ...props }: ObjectProps) => {
    return getSmartBuilderAdapters().renderTinyKnowledge({
      identifier: _model,
      object: props.object,
    });
  };
};

const buildModelPage = (model: Identifier) => {
  return ({ ...props }: SmartModelPage) => {
    return getSmartBuilderAdapters().renderModelPage({
      identifier: model,
      ...props,
    });
  };
};

const buildListPage = (model: Identifier) => {
  return ({ ...props }: SmartListPageProps) => {
    return getSmartBuilderAdapters().renderListPage({
      identifier: model,
      ...props,
    });
  };
};

const buildUseNodesQuery = (model: Identifier) => {
  return getSmartBuilderAdapters().useNodes(model);
};

const buildUseProgress = (model: Identifier, object: string) => {
  return getSmartBuilderAdapters().useProgress(model, object);
};

const buildUseLive = (model: Identifier, object: string) => {
  return getSmartBuilderAdapters().useLive(model, object);
};

const buildObjectButton = (model: Identifier) => {
  return ({ object, ...props }: SmartObjectButtonProps) => {
    return getSmartBuilderAdapters().renderObjectButton({
      identifier: model,
      object,
      ...props,
    });
  };
};

const buildEnhanceButton = (model: Identifier) => {
  return ({ ...props }: SmartEnhanceButtonProps) => {
    return getSmartBuilderAdapters().renderEnhanceButton({
      identifier: model,
      ...props,
    });
  };
}

const buildNewButton = (model: Identifier) => {
  return ({ ...props }: SmartNewButtonProps) => {
    return getSmartBuilderAdapters().renderNewButton({
      identifier: model,
      ...props,
    });
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
