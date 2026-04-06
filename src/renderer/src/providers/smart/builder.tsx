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
  ModelLinkProps,
  OmitedNavLinkProps,
  SmartPaneLinkProps,
} from "./types";
import { Object, Identifier } from "@/types";
import { cn } from "@/lib/utils";

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

export const buildModelLink = <T extends Object>(to: string) => {
  return ({
    children,
    subroute,
    subobject,
    deeproute,
    ...props
  }: ModelLinkProps<T>) => {
    return (
      <NavLink
        {...props}
        to={`/${to}/${props.object.id}${subroute ? `/${subroute}` : ""}${subobject ? `/${subobject}` : ""}${deeproute ? `/${deeproute}` : ""}`}
        title="Open"
        className={cn("hover:text-primary transition-colors", props.className)}
      >
        {children}
      </NavLink>
    );
  };
};


export const buildPaneLink = <T extends Object>(to: string) => {
  return ({
    children,
    subroute,
    subobject,
    deeproute,
    ...props
  }: SmartPaneLinkProps<T>) => {
    return (
      <PaneLink
        {...props}
        to={`/${to}/${props.object.id}${subroute ? `/${subroute}` : ""}${subobject ? `/${subobject}` : ""}${deeproute ? `/${deeproute}` : ""}`}

      >
        {children}
      </PaneLink>
    );
  };
};

export const linkBuilder = <T extends ObjectType>(to: string) => (objectId: string | undefined) => {
  if (!objectId) {
    return `/error`;
  }

  return `/${to}/${objectId}`;
};

export const listLinkBuilder = <T extends ObjectType>(to: string) => () => {
  return `/${to}/`;
};

export const buildSmartModel = <T extends Object>(
  identifier: Identifier,
): React.FC<CreatedSmartSmartProps<T>> => {
  return ({ children, ...props }) => {
    return (
      <SmartModel identifier={identifier} {...props}>
        {children}
      </SmartModel>
    );
  };
};

export const buildDropModel = <T extends Object>(
  identifier: Identifier,
): React.FC<CreatedSmartSmartProps<T>> => {
  return ({ children, ...props }) => {
    return (
      <SmartDropZone identifier={identifier} {...props}>
        {children}
      </SmartDropZone>
    );
  };
};

export type ObjectProps<T extends Object> = {
  object: T;
};

const buildSelfActions = (_model: Identifier) => {
  return (_props: ObjectProps<any>) => {
    return <></>;
  };
};

const buildKomments = <T extends Object> (model: Identifier) => {
  return ({ ...props }: ObjectProps<T>) => {
    return getSmartBuilderAdapters().renderKomments({
      identifier: model,
      object: props.object,
    });
  };
};

const buildKnowledge = <T extends Object>(model: Identifier) => {
  return ({ ...props }: ObjectProps<T>) => {
    return getSmartBuilderAdapters().renderKnowledge({
      identifier: model,
      object: props.object,
    });
  };
};

const buildTinyKnowledge = <T extends Object>(_model: Identifier) => {
  return ({ ...props }: ObjectProps<T>) => {
    return getSmartBuilderAdapters().renderTinyKnowledge({
      identifier: _model,
      object: props.object,
    });
  };
};

const buildModelPage = <T extends Object>(model: Identifier) => {
  return ({ ...props }: SmartModelPage<T>) => {
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

const buildUseProgress = (model: Identifier, object: Object) => {
  return getSmartBuilderAdapters().useProgress(model, object);
};

const buildUseLive = (model: Identifier, object: Object) => {
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






export const buildSmart = <T extends Object>(
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
    DetailLink: buildModelLink<T>(to),
    PaneLink: buildPaneLink<T>(to),
    ListLink: buildBaseLink<T>(to),
    linkBuilder: linkBuilder<T>(to),
    listlinkBuilder: listLinkBuilder<T>(to),
    Smart: buildSmartModel<T>(model),
    Drop: buildDropModel<T>(model),
    Actions: buildSelfActions(model),
    Komments: buildKomments(model),
    Knowledge: buildKnowledge(model),
    EnhanceButton: buildEnhanceButton(model),
    TinyKnowledge: buildTinyKnowledge(model),
    identifier: model,
    ModelPage: buildModelPage<T>(model),
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
