import ReactDOM from "react-dom";
import { Transforms } from "slate";
import {
  DescendendInput,
  ElementRenderProps,
  KommentEditor,
  LeafRenderProps,
} from "../types";
import { MentionEdit } from "./MentionEdit";
import { DescendantKind } from "@/lok-next/api/graphql";

export const withMentions = (editor: KommentEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.kind === DescendantKind.Mention ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.kind === DescendantKind.Mention ? true : isVoid(element);
  };

  return editor;
};

export const KommentElement = (props: ElementRenderProps) => {
  const { element, ...restprops } = props;
  switch (element.kind) {
    case DescendantKind.Mention:
      return <MentionEdit element={element} {...restprops} />;
    default:
      return <p {...restprops.attributes}>{props.children}</p>;
  }
};

export const KommentLeaf = ({
  attributes,
  children,
  leaf,
}: LeafRenderProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = (
      <code className="bg-back-900 text-xs p-1 rounded-md text-white">
        {children}
      </code>
    );
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export const insertMention = (
  editor: KommentEditor,
  q: { value: string; label: string } | undefined | null,
) => {
  console.log(q);
  if (!q) return;
  const mention: DescendendInput = {
    kind: DescendantKind.Mention,
    user: q.value,
    text: q.label,
    children: [{ text: q.label, kind: DescendantKind.Leaf }],
  };
  console.log(mention);
  Transforms.insertNodes<DescendendInput>(editor, mention);
  Transforms.move(editor);
};

export const Portal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};
