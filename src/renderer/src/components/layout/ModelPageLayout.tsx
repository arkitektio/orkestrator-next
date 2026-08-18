import { Guard } from "@/app/Arkitekt";
import { StructureRoomsSidebar } from "@/alpaka/sidebars/StructureRoomsSidebar";
import { CommandMenu } from "@/command/Menu";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { Identifier, Object } from "@/types";
import {
  cloneElement,
  isValidElement,
  useMemo,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { Sidebars } from "./Sidebars";
import { PageLayout, PageVariant } from "./PageLayout";
import { Komments } from "@/kraph/components/komments/Komments";
import { KnowledgeSidebar } from "@/kraph/components/sidebars/KnowledgeSidebar";

/** Label of the rail tab holding this structure's conversations. */
const CHAT_TAB_LABEL = "Chat";

/**
 * Most model pages hand in their own rail instead of using the default below,
 * and every model page should be able to talk about what it is showing — so
 * the Chat tab is folded into whatever the page passed:
 *
 * - a `<Sidebars>` rail gets the tab appended (`collectTabs` dedups by label,
 *   so a rail already spelling out its own "Chat" keeps winning);
 * - a bare component as the rail (a handful of pages pass just their
 *   `Komments`) is promoted to a two-tab rail, since a tabless rail has
 *   nowhere for the chat to go.
 */
const withChatTab = (
  rail: ReactNode,
  chatTab: ReactNode,
  sidebarKey: string,
): ReactNode => {
  if (isValidElement(rail) && rail.type === Sidebars) {
    const element = rail as ReactElement<ComponentProps<typeof Sidebars>>;
    return cloneElement(
      element,
      {},
      <>
        {element.props.children}
        {chatTab}
      </>,
    );
  }

  return (
    <Sidebars sidebarKey={sidebarKey}>
      <Sidebars.Tab label="Comments">{rail}</Sidebars.Tab>
      {chatTab}
    </Sidebars>
  );
};

export type ModelPageLayoutProps = {
  children: React.ReactNode;
  identifier: Identifier;
  object: Object;
  title?: React.ReactNode;
  sidebars?: React.ReactNode;
  /**
   * Extra `<Sidebars.Tab>` elements appended after the default tabs. A tab
   * whose label matches a default replaces that default's content in place.
   */
  additionalSidebars?: React.ReactNode;
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: PageVariant;
  /** Seamless sidebar rail — see PageLayout's `overlay` prop. */
  overlay?: boolean;
  /** The rail tab to open when nothing valid is remembered. */
  defaultSidebar?: string;
  /**
   * localStorage key for the remembered rail tab. Defaults to the key shared
   * by all model pages; pages with their own tab set (the scene pages and
   * their Layers tab) pass their own so their preference doesn't fight the
   * rest of the app's.
   */
  sidebarKey?: string;
  callback?: (object: Object) => void;
};

export const ModelPageLayout = ({
  sidebars,
  additionalSidebars,
  title,
  children,
  identifier,
  object,
  variant,
  overlay,
  defaultSidebar,
  sidebarKey,
  actions,
  pageActions,
}: ModelPageLayoutProps) => {
  const objects = useMemo(() => [{ identifier, object }], [identifier, object]);
  const kommentsSidebar = (
    <Komments identifier={identifier} object={object} />
  );
  const knowledgeSidebar = (
    <KnowledgeSidebar identifier={identifier} object={object} />
  );

  const chatTab = (
    <Sidebars.Tab label={CHAT_TAB_LABEL} key={CHAT_TAB_LABEL}>
      <Guard.Alpaka>
        <StructureRoomsSidebar identifier={identifier} object={object} />
      </Guard.Alpaka>
    </Sidebars.Tab>
  );

  return (
    <PageLayout
      title={title}
      sidebars={sidebars ? withChatTab(sidebars, chatTab, sidebarKey ?? "DetailModel") : (
        <Sidebars
          sidebarKey={sidebarKey ?? "DetailModel"}
          defaultTab={defaultSidebar}
          variant={overlay ? "overlay" : "default"}
        >
          <Sidebars.Tab label="Comments">
            <Guard.Kraph>{kommentsSidebar}</Guard.Kraph>
          </Sidebars.Tab>
          <Sidebars.Tab label="Knowledge">
            <Guard.Kraph>{knowledgeSidebar}</Guard.Kraph>
          </Sidebars.Tab>
          {additionalSidebars}
          {chatTab}
        </Sidebars>
      )}
      variant={variant}
      overlay={overlay}
      actions={actions}
      pageActions={pageActions || <ObjectButton objects={objects} />}
    >
      <CommandMenu objects={objects} />
      {children}
    </PageLayout>
  );
};
