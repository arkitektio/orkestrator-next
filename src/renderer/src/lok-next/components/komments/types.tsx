import {
  CreateCommentMutationFn,
  DescendantFragment,
  DescendantInput,
  DescendantKind,
  DetailCommentFragment,
  LeafFragment,
  ListCommentFragment,
  MentionFragment,
  ReplyToMutationFn,
} from "@/lok-next/api/graphql";
import { Identifier, Object } from "@/types";
import { BaseEditor, BaseElement, BaseText } from "slate";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";

export type ListCommentType = ListCommentFragment;
export type DetailCommentType = DetailCommentFragment;
export type LeafType = LeafFragment;
export type DescendantType = DescendantFragment;
export type MentionType = MentionFragment;

export type KommentProps = {
  identifier: Identifier;
  object: Object;
};

export type DescendendInput = DescendantInput;

export type CreateCommentFunc = CreateCommentMutationFn;

export type ReplyToFunc = ReplyToMutationFn;

// The shape of a Slate element node for the komment editor. This mirrors
// `DescendantInput` but is kept separate since it describes an editor
// document node (used by Slate itself) rather than a GraphQL mutation input.
export type KommentElementNode = {
  kind: DescendantKind;
  user?: string | null;
  text?: string | null;
  children: KommentDescendantNode[];
};

// The shape of a Slate text (leaf) node for the komment editor.
export type KommentTextNode = {
  text: string;
  bold?: boolean | null;
  italic?: boolean | null;
  underline?: boolean | null;
  code?: boolean | null;
};

export type KommentDescendantNode = KommentElementNode | KommentTextNode;

// Tell Slate's TypeScript augmentation about the editor's custom
// element/text shapes, so `RenderElementProps.element`,
// `RenderLeafProps.leaf`, and editor methods like `isInline`/`isVoid` are
// typed with the real fields this editor uses (`kind`, `bold`, `code`,
// `italic`, `underline`, …) instead of the generic Slate defaults.
declare module "slate" {
  interface CustomTypes {
    Element: KommentElementNode;
    Text: KommentTextNode;
  }
}

export type ElementProps = RenderElementProps;

export type KommentEditor = ReactEditor & BaseEditor;

export type KommentNode = KommentEditor | BaseElement | BaseText;

export type ElementRenderProps = ElementProps;

export type LeafRenderProps = RenderLeafProps;
