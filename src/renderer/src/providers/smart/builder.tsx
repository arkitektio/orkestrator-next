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
      to={`/${model.path}/${encodeURIComponent(object)}${subroute ? `/${subroute}` : ""}${subobject ? `/${subobject}` : ""}${deeproute ? `/${deeproute}` : ""}`}
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
        to={`/${to}/${encodeURIComponent(props.object.id)}${subroute ? `/${subroute}` : ""}${subobject ? `/${subobject}` : ""}${deeproute ? `/${deeproute}` : ""}`}
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
        to={`/${to}/${encodeURIComponent(props.object.id)}${subroute ? `/${subroute}` : ""}${subobject ? `/${subobject}` : ""}${deeproute ? `/${deeproute}` : ""}`}

      >
        {children}
      </PaneLink>
    );
  };
};

export const linkBuilder = (to: string) => (objectId: string | undefined) => {
  if (!objectId) {
    return `/error`;
  }

  return `/${to}/${encodeURIComponent(objectId)}`;
};

export const listLinkBuilder = (to: string) => () => {
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

/**
 * The claims made about this object and the discussion about it are one
 * surface (`KnowledgeSidebar`), so there is one builder for them. The old
 * `Komments` half is gone — pages ask for `Knowledge` and get both.
 */
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
    /** Descriptive name used in labels and validation messages. */
    name?: string;
    description?: string;
    searchFunction?: SearchFunction;
    describeQuery?: string;
  },
) => {
  smartRegistry.register({
    identifier: model,
    path: to,
    name: options?.name,
    search: options?.searchFunction,
    description: options?.description || "A smart model",
  });

  return {
    DetailLink: buildModelLink<T>(to),
    PaneLink: buildPaneLink<T>(to),
    ListLink: buildBaseLink(to),
    linkBuilder: linkBuilder(to),
    listlinkBuilder: listLinkBuilder(to),
    Smart: buildSmartModel<T>(model),
    Drop: buildDropModel<T>(model),
    Actions: buildSelfActions(model),
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
      buildUseProgress(model, { id: object }),
    useLive: ({ object }: { object: string }) =>
      buildUseLive(model, { id: object }),
  };
};

/**
 * A model whose detail page lives *inside* something else — for kraph, inside the
 * graph that draws it.
 *
 * Two grains, one identity. A claim (`Instance`, `Link`) is organization-grain
 * and addressed by a bare uuid; a *drawing* of it exists only inside one graph
 * and carries everything a rich detail page shows. Identity stays claim-grain —
 * `Smart`, `Drop`, `ObjectButton` and every local-action `condition` keep taking
 * `{ identifier, id }` with that bare uuid, which is the only thing a
 * drag-and-drop payload can honestly carry. Only the *destination* varies.
 *
 * So `scope` is optional, and the fallback is the point: a call site that knows
 * its graph gets the view page; one that does not — the command palette, a drop
 * from another module, a rekuest return port — gets `claimTo`, the claim page,
 * which lists `drawnIn` and links onward. No caller is ever forced to invent a
 * graph, and nothing re-encodes `graph:id` back into one string, which is
 * precisely the `GraphID` scalar the backend deleted.
 */
export const buildScopedSmart = <T extends Object>(
  model: Identifier,
  scopedTo: (scope: string) => string,
  claimTo: string,
  options?: {
    name?: string;
    description?: string;
    searchFunction?: SearchFunction;
  },
) => {
  const pathFor = (scope?: string) => (scope ? scopedTo(scope) : claimTo);

  // Registers under `claimTo`: the registry answers "where does a bare id of
  // this kind go", and that is the claim page. Generic navigate/popout actions
  // resolve through it.
  const base = buildSmart<T>(model, claimTo, options);

  return {
    ...base,
    DetailLink: ({ scope, ...props }: ModelLinkProps<T> & { scope?: string }) =>
      buildModelLink<T>(pathFor(scope))(props),
    PaneLink: ({ scope, ...props }: SmartPaneLinkProps<T> & { scope?: string }) =>
      buildPaneLink<T>(pathFor(scope))(props),
    linkBuilder: (objectId: string | undefined, scope?: string) =>
      linkBuilder(pathFor(scope))(objectId),
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
