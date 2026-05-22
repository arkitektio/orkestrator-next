import { cn } from "@/lib/utils";
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bold,
  Code,
  FileImage,
  Italic,
  Mic,
  Paperclip,
  PlusCircle,
  Send,
  SmilePlus,
  ThumbsUp,
  Underline,
} from "lucide-react";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import React, { useState } from "react";
import { EmojiPicker } from "../emoji-picker";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ChatBottombarProps {
  sendMessage: (text: string) => void;
  isMobile: boolean;
}

type ComposerTextNode = {
  text?: string;
  children?: ComposerTextNode[];
};

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({
  sendMessage,
  isMobile,
}: ChatBottombarProps) {
  const [hasContent, setHasContent] = useState(false);

  const editor = usePlateEditor({
    plugins: [BoldPlugin, UnderlinePlugin, CodePlugin, ItalicPlugin],
    value: [
      {
        type: "p",
        children: [{ text: "" }],
      },
    ],
  });

  const serialize = (nodes: ComposerTextNode[]) => {
    return nodes.map(node => {
      if (node.children) {
        return node.children.map((child) => child.text || (child.children ? serialize([child]) : '')).join('')
      }
      return node.text || ''
    }).join('\n')
  }

  const handleSend = () => {
    const message = serialize(editor.children);
    if (message.trim()) {
      sendMessage(message.trim());
      editor.tf.setValue([{ type: "p", children: [{ text: "" }] }]);
      setHasContent(false);
    }
  };

  const checkContent = () => {
    const text = serialize(editor.children)
    setHasContent(!!text.trim())
  }


  const handleThumbsUp = () => {
    sendMessage("👍");
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t ">
      <div className="flex w-full items-end gap-3">
      <div className="flex pb-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9",
                "rounded-xl border bg-muted/40 hover:bg-muted/70"
              )}
            >
              <PlusCircle size={20} className="text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-auto p-2">
            {hasContent || isMobile ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    "rounded-xl hover:bg-muted"
                  )}
                >
                  <Mic size={20} className="text-muted-foreground" />
                </Button>
                {BottombarIcons.map((icon, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-9 w-9",
                      "rounded-xl hover:bg-muted"
                    )}
                  >
                    <icon.icon size={20} className="text-muted-foreground" />
                  </Button>
                ))}
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9",
                  "rounded-xl hover:bg-muted"
                )}
              >
                <Mic size={20} className="text-muted-foreground" />
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <Plate editor={editor} onChange={checkContent}>
            <div className="w-full overflow-hidden rounded-2xl border bg-background shadow-sm">
              <PlateContent
                className="min-h-[72px] w-full resize-none px-4 py-3 text-sm leading-6 focus-visible:outline-none max-h-[220px] overflow-y-auto"
                placeholder="Write a message..."
                onKeyDown={handleKeyPress}
              />
              <div className="flex items-center gap-1 border-t bg-muted/20 px-2 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => editor.tf.toggle.mark({ key: "bold" })}
                  className="h-8 w-8 p-0"
                >
                  <Bold className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => editor.tf.toggle.mark({ key: "italic" })}
                  className="h-8 w-8 p-0"
                >
                  <Italic className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => editor.tf.toggle.mark({ key: "underline" })}
                  className="h-8 w-8 p-0"
                >
                  <Underline className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => editor.tf.toggle.mark({ key: "code" })}
                  className="h-8 w-8 p-0"
                >
                  <Code className="h-3 w-3" />
                </Button>
                <div className="flex-1" />
                <EmojiPicker
                  onChange={(value) => {
                    editor.insertText(value);
                    editor.tf.focus();
                  }}
                >
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <SmilePlus className="h-4 w-4" />
                  </Button>
                </EmojiPicker>
                <Button
                  size="sm"
                  type="button"
                  variant={hasContent ? "default" : "ghost"}
                  onClick={hasContent ? handleSend : handleThumbsUp}
                  className="min-w-[88px] rounded-xl"
                >
                  {hasContent ? (
                    <>
                      <Send className="mr-1.5 h-4 w-4" />
                      Send
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="mr-1.5 h-4 w-4" />
                      React
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Plate>
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}
