import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { Structure } from "@/types";
import { createSelector } from "reselect";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import { useSelectionStoreApi } from "../selection/SelectionContext";
import { SelectionState } from "../selection/store";
import { SmartModelProps } from "./types";

type SmartModelSelectionSnapshot = {
  selection: Structure[];
  bselection: Structure[];
  selectedIndex: number;
  bselectedIndex: number;
};

const createSelectionSnapshotSelector = (self: Structure) =>
  createSelector(
    [
      (state: SelectionState) => state.selection,
      (state: SelectionState) => state.bselection,
    ],
    (selection, bselection): SmartModelSelectionSnapshot => ({
      selection,
      bselection,
      selectedIndex:
        selection.findIndex(
          (item) =>
            item.identifier === self.identifier && item.object === self.object,
        ) + 1,
      bselectedIndex:
        bselection.findIndex(
          (item) =>
            item.identifier === self.identifier && item.object === self.object,
        ) + 1,
    }),
  );

const syncAttribute = (
  node: HTMLElement | null,
  name: string,
  value: string | null,
) => {
  if (!node) {
    return;
  }

  if (value === null) {
    if (node.hasAttribute(name)) {
      node.removeAttribute(name);
    }
    return;
  }

  if (node.getAttribute(name) !== value) {
    node.setAttribute(name, value);
  }
};

export type UseSmartModelResult = {
  ref: (node: HTMLDivElement | null) => void;
  portalRef: React.RefObject<HTMLDivElement | null>;
  self: Structure;
  isOver: boolean;
  isDragging: boolean;
  canDrop: boolean;
  partners: Structure[];
  clearPartners: () => void;
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  getCurrentSelection: () => Structure[];
  getCurrentBSelection: () => Structure[];
};

export const useSmartModel = ({
  identifier,
  object,
}: Pick<SmartModelProps, "identifier" | "object">): UseSmartModelResult => {
  const selectionStore = useSelectionStoreApi();
  const self = useMemo(
    () => ({ identifier, object }),
    [identifier, object],
  );

  const portalRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const registeredNodeRef = useRef<HTMLDivElement | null>(null);
  const latestSelectionRef = useRef<Structure[]>(selectionStore.getState().selection);
  const latestBSelectionRef = useRef<Structure[]>(selectionStore.getState().bselection);
  const latestSnapshotRef = useRef({ selectedIndex: 0, bselectedIndex: 0 });
  const [partners, setPartners] = useState<Structure[]>([]);

  const dropHandler = React.useCallback((item: any, monitor: any) => {
    if (monitor.getItemType() === SMART_MODEL_DROP_TYPE) {
      setPartners(item);
      return {};
    }

    if (monitor.getItemType() === NativeTypes.URL) {
      const urls = item.urls;
      const nextPartners: Structure[] = [];

      for (let index = 0; index < urls.length; index++) {
        const match = urls[index].match(/arkitekt:\/\/([^:]+):([^\/]+)/);
        if (match) {
          const [, nextIdentifier, nextObject] = match;
          nextPartners.push({ identifier: nextIdentifier, object: nextObject });
        }
      }

      if (nextPartners.length > 0) {
        setPartners(nextPartners);
        return {};
      }
    }

    if (item.text) {
      try {
        const structure: Structure = JSON.parse(item.text);
        setPartners([structure]);
        return {};
      } catch (error) {
        console.error(error);
      }
    }

    alert(`Drop unknown ${item}`);
    return {};
  }, []);

  const collectDrop = React.useCallback(
    (monitor: any) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    [],
  );

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: [SMART_MODEL_DROP_TYPE, NativeTypes.TEXT, NativeTypes.URL],
      drop: dropHandler,
      collect: collectDrop,
    }),
    [dropHandler, collectDrop],
  );

  const collectDrag = React.useCallback(
    (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    [],
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: SMART_MODEL_DROP_TYPE,
      item: [self],
      collect: collectDrag,
    }),
    [self, collectDrag],
  );

  const syncSelectionState = React.useCallback(
    (node: HTMLDivElement | null, snapshot: SmartModelSelectionSnapshot) => {
      syncAttribute(
        node,
        "data-selected",
        snapshot.selectedIndex > 0 ? "true" : "false",
      );
      syncAttribute(
        node,
        "data-bselected",
        snapshot.bselectedIndex > 0 ? "true" : "false",
      );
      syncAttribute(
        node,
        "data-selected-index",
        snapshot.selectedIndex > 0 ? String(snapshot.selectedIndex) : null,
      );
      syncAttribute(
        node,
        "data-bselected-index",
        snapshot.bselectedIndex > 0 ? String(snapshot.bselectedIndex) : null,
      );
    },
    [],
  );

  useEffect(() => {
    const selector = createSelectionSnapshotSelector(self);

    const syncFromState = (state: SelectionState) => {
      const nextSnapshot = selector(state);

      latestSelectionRef.current = nextSnapshot.selection;
      latestBSelectionRef.current = nextSnapshot.bselection;

      if (
        latestSnapshotRef.current.selectedIndex === nextSnapshot.selectedIndex &&
        latestSnapshotRef.current.bselectedIndex === nextSnapshot.bselectedIndex
      ) {
        return;
      }

      latestSnapshotRef.current = {
        selectedIndex: nextSnapshot.selectedIndex,
        bselectedIndex: nextSnapshot.bselectedIndex,
      };

      syncSelectionState(nodeRef.current, nextSnapshot);
    };

    const initialSnapshot = selector(selectionStore.getState());
    latestSelectionRef.current = initialSnapshot.selection;
    latestBSelectionRef.current = initialSnapshot.bselection;
    latestSnapshotRef.current = {
      selectedIndex: initialSnapshot.selectedIndex,
      bselectedIndex: initialSnapshot.bselectedIndex,
    };
    syncSelectionState(nodeRef.current, initialSnapshot);

    return selectionStore.subscribe((state) => {
      syncFromState(state);
    });
  }, [selectionStore, self, syncSelectionState]);

  useEffect(() => {
    syncAttribute(nodeRef.current, "data-over", isOver ? "true" : "false");
    syncAttribute(
      nodeRef.current,
      "data-dragging",
      isDragging ? "true" : "false",
    );
    syncAttribute(nodeRef.current, "data-can-drop", canDrop ? "true" : "false");
  }, [isOver, isDragging, canDrop]);

  const registerNode = React.useCallback(
    (node: HTMLDivElement | null) => {
      const previousNode = registeredNodeRef.current;

      if (previousNode && previousNode !== node) {
        selectionStore.getState().unregisterSelectables([
          {
            structure: self,
            item: previousNode,
          },
        ]);
      }

      registeredNodeRef.current = node;
      nodeRef.current = node;

      if (!node) {
        drag(null);
        drop(null);
        return;
      }

      drag(node);
      drop(node);

      syncAttribute(node, "data-identifier", identifier);
      syncAttribute(node, "data-object", object);
      syncAttribute(node, "data-selectable", "true");

      selectionStore.getState().registerSelectables([
        {
          structure: self,
          item: node,
        },
      ]);

      syncSelectionState(node, {
        selection: latestSelectionRef.current,
        bselection: latestBSelectionRef.current,
        selectedIndex: latestSnapshotRef.current.selectedIndex,
        bselectedIndex: latestSnapshotRef.current.bselectedIndex,
      });
      syncAttribute(node, "data-over", isOver ? "true" : "false");
      syncAttribute(node, "data-dragging", isDragging ? "true" : "false");
      syncAttribute(node, "data-can-drop", canDrop ? "true" : "false");
    },
    [
      canDrop,
      drag,
      drop,
      identifier,
      isDragging,
      isOver,
      object,
      selectionStore,
      self,
      syncSelectionState,
    ],
  );

  useEffect(() => {
    return () => {
      const node = registeredNodeRef.current;
      if (!node) {
        return;
      }

      selectionStore.getState().unregisterSelectables([
        {
          structure: self,
          item: node,
        },
      ]);
    };
  }, [selectionStore, self]);

  const clearPartners = React.useCallback(() => {
    setPartners([]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        portalRef.current &&
        !portalRef.current.contains(event.target as Node)
      ) {
        clearPartners();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearPartners();
      }
    };

    if (partners.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [partners.length, clearPartners]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const { toggleSelection, toggleBSelection } = selectionStore.getState();

      if (event.shiftKey && !event.ctrlKey) {
        toggleSelection(self);
      }

      if (event.shiftKey && event.ctrlKey) {
        toggleBSelection(self);
      }
    },
    [selectionStore, self],
  );

  const handleDragStart = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const data = JSON.stringify(self);
      event.dataTransfer.setData("text/plain", data);
      event.dataTransfer.setData(
        "text/uri-list",
        `arkitekt://${identifier}:${object}`,
      );
    },
    [identifier, object, self],
  );

  return {
    ref: registerNode,
    portalRef,
    self,
    isOver,
    isDragging,
    canDrop,
    partners,
    clearPartners,
    handleClick,
    handleDragStart,
    getCurrentSelection: () => latestSelectionRef.current,
    getCurrentBSelection: () => latestBSelectionRef.current,
  };
};
