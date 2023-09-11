import { CreateCommentMutationFn, DescendantFragment, DescendantInput, DetailCommentFragment, LeafFragment, ListCommentFragment, MentionFragment, ReplyToMutationFn } from "@/lok-next/api/graphql";
import { BaseEditor, BaseElement, BaseText } from "slate";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";


export type ListCommentType = ListCommentFragment;
export type DetailCommentType = DetailCommentFragment;
export type LeafType = LeafFragment;
export type DescendantType = DescendantFragment;
export type MentionType = MentionFragment;

export type KommentProps = {
  identifier: string;
  object: string;
};

export type DescendendInput = DescendantInput;

export type CreateCommentFunc = CreateCommentMutationFn;

export type ReplyToFunc = ReplyToMutationFn;

export type ElementProps = RenderElementProps & {
  element: DescendendInput;
  children: DescendendInput[];
};

export type KommentEditor = ReactEditor & BaseEditor;

export type KommentNode = KommentEditor | BaseElement | BaseText;

export type ElementRenderProps = ElementProps;

export type LeafRenderProps = RenderLeafProps;
