import {
  DescendantInput,
  DescendantKind,
  useUserOptionsLazyQuery,
} from "@/lok-next/api/graphql";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiBold, BiCode, BiItalic, BiUnderline } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { Editor, Element, Node, Range, Text, Transforms, createEditor } from "slate";
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, useSlate, withReact } from "slate-react";
import { CreateCommentFunc } from "../types";
import {
  KommentElement,
  KommentLeaf,
  Portal,
  insertMention,
  withMentions,
} from "./utils";

// Custom text node with formatting properties
interface CustomText extends Text {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
}

// Custom element node
interface CustomElement extends Element {
  kind?: DescendantKind;
  user?: string;
  text?: string;
}

export type ICommentEditProps<T> = {
  id: string;
  model: T;
  parent?: string;
};

const initialValue: Node[] = [
  {
    type: 'paragraph',
    children: [{ text: "" }],
  } as Node,
];

export type CommentEditProps = {
  identifier: string;
  object: string;
  parent?: string;
  createComment: CreateCommentFunc;
};

type Mark = "bold" | "italic" | "underline" | "code";

const toggleMark = (editor: Editor, format: Mark) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: Editor, format: Mark) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const MarkButton = ({
  format,
  children,
}: {
  format: Mark;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className={`${
        isMarkActive(editor, format) ? "opacity-100" : "opacity-20"
      }`}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </button>
  );
};

export const CommentEdit = ({
  createComment,
  object,
  parent,
  identifier,
}: CommentEditProps) => {
  const [editor] = useState(() => withMentions(withReact(createEditor())));

  const [searchUser, data] = useUserOptionsLazyQuery();

  const ref = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<Range | undefined>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const renderElement = useCallback(
    (props: RenderElementProps) => {
      // Create a mock element that matches what KommentElement expects
      const mockElement = {
        kind: (props.element as CustomElement).kind || DescendantKind.Paragraph,
        user: (props.element as CustomElement).user,
        text: (props.element as CustomElement).text,
        children: [],
      };
      return <KommentElement {...props} element={mockElement} />;
    },
    [],
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <KommentLeaf {...props} />,
    [],
  );

  useEffect(() => {
    searchUser({ variables: { search: search.toLowerCase() } });
  }, [search, searchUser]);

  useEffect(() => {
    if (target && data.data?.options && ref.current) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [data, editor, index, search, target]);

  const convertToDescendantInput = (nodes: Node[]): DescendantInput[] => {
    return nodes.map((node): DescendantInput => {
      if (Text.isText(node)) {
        const textNode = node as CustomText;
        return {
          kind: DescendantKind.Leaf,
          text: textNode.text,
          bold: textNode.bold || undefined,
          italic: textNode.italic || undefined,
          code: textNode.code || undefined,
        };
      } else {
        // This is an element
        const element = node as CustomElement;
        if (element.kind === DescendantKind.Mention) {
          return {
            kind: DescendantKind.Mention,
            user: element.user,
            text: element.text,
            children: element.children ? convertToDescendantInput(element.children) : [],
          };
        } else {
          return {
            kind: DescendantKind.Paragraph,
            children: element.children ? convertToDescendantInput(element.children) : [],
          };
        }
      }
    });
  };

  const saveComment = () => {
    console.log(editor.children);
    setSaving(true);
    createComment({
      variables: {
        identifier: identifier,
        object: object,
        parent: parent,
        descendants: convertToDescendantInput(editor.children),
      },
    })
      .catch(console.error)
      .then(() => {
        setSaving(false);
        Transforms.removeNodes(editor);
        Transforms.insertNodes(editor, initialValue);
        Transforms.move(editor);
      });
  };

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      console.log("Definining target", target);
      if (event.ctrlKey && event.key === "Enter") {
        saveComment();
      }
      if (event.ctrlKey && event.key === "b") {
        toggleMark(editor, "bold");
      }
      if (event.ctrlKey && event.key === "i") {
        toggleMark(editor, "italic");
      }

      if (target) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            setIndex(index + 1);
            break;
          case "ArrowUp":
            event.preventDefault();
            setIndex(index - 1);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(
              editor,
              data?.data?.options && data.data.options[index],
            );
            setTarget(undefined);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(undefined);
            break;
        }
      }
    },
    [index, search, target, data.data?.options],
  );

  return (
    <>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={() => {
          const { selection } = editor;

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: "word" });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
              beforeRange && Editor.string(editor, beforeRange);
            const beforeMatch = beforeText && beforeText.match(/^@(\w*)$/);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeMatch && afterMatch) {
              setTarget(beforeRange);
              setSearch(beforeMatch[1]);
              setIndex(0);
              return;
            }
          }

          setTarget(undefined);
        }}
      >
        {saving && <div>Saving...</div>}
        <div className="flex flex-col relative">
          <div className="flex flex-row bg-back-50 rounded-t-md p-1 gap-2 border-b-1 border-b border-back-600">
            <MarkButton format="bold">
              <BiBold />
            </MarkButton>
            <MarkButton format="italic">
              <BiItalic />
            </MarkButton>
            <MarkButton format="underline">
              <BiUnderline />
            </MarkButton>
            <MarkButton format="code">
              <BiCode />
            </MarkButton>
          </div>
          <Editable
            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={onKeyDown}
          />
          {target && (
            <Portal>
              <div
                ref={ref}
                style={{
                  top: "-9999px",
                  left: "-9999px",
                  position: "absolute",
                  zIndex: 1,
                  padding: "3px",
                  background: "white",
                  borderRadius: "4px",
                  boxShadow: "0 1px 5px rgba(0,0,0,.2)",
                }}
                data-cy="mentions-portal"
              >
                {data?.data?.options && data?.data?.options.length > 0 ? (
                  data?.data?.options.map((char, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "1px 3px",
                        borderRadius: "3px",
                        background: i === index ? "#B4D5FF" : "transparent",
                      }}
                    >
                      {char?.label}
                    </div>
                  ))
                ) : (
                  <div>No results. Has this user ever logged in to mikro?</div>
                )}
              </div>
            </Portal>
          )}

          <b className="absolute top-0 right-0 text-black">
            <button
              type="button"
              onClick={() => saveComment()}
              className=" text-foreground ml-2 rounded-md"
            >
              <TiTick />
            </button>
          </b>
        </div>
      </Slate>
    </>
  );
};
