import { RoomFragment } from "@/alpaka/api/graphql";
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
  SendHorizontal,
  ThumbsUp,
  Underline,
} from "lucide-react";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { EmojiPicker } from "../emoji-picker";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ChatBottombarProps {
  sendMessage: (text: string) => void;
  isMobile: boolean;
  room: RoomFragment;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({
  sendMessage,
  isMobile,
  room,
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

  const serialize = (nodes: any[]) => {
    return nodes.map(node => {
        if (node.children) {
            return node.children.map((child: any) => child.text || (child.children ? serialize([child]) : '')).join('')
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
    <div className="p-2 flex justify-between w-full items-end gap-2">
      <div className="flex pb-1">
        <Popover>
          <PopoverTrigger asChild>
            <Link
              to="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <PlusCircle size={20} className="text-muted-foreground" />
            </Link>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-full p-2">
            {hasContent || isMobile ? (
              <div className="flex gap-2">
                <Link
                  to="#"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-9 w-9",
                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <Mic size={20} className="text-muted-foreground" />
                </Link>
                {BottombarIcons.map((icon, index) => (
                  <Link
                    key={index}
                    to="#"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "h-9 w-9",
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <icon.icon size={20} className="text-muted-foreground" />
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                to="#"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                  "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                )}
              >
                <Mic size={20} className="text-muted-foreground" />
              </Link>
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
            <div className="relative rounded-lg border bg-background/20 w-full flex flex-col">
              <div className="flex items-center gap-1 border-b px-2 py-1 bg-muted/20">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => editor.tf.toggle.mark({ key: "bold" })}
                  className="p-0 h-6 w-6"
                >
                  <Bold className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => editor.tf.toggle.mark({ key: "italic" })}
                  className="p-0 h-6 w-6"
                >
                  <Italic className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => editor.tf.toggle.mark({ key: "underline" })}
                  className="p-0 h-6 w-6"
                >
                  <Underline className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => editor.tf.toggle.mark({ key: "code" })}
                  className="p-0 h-6 w-6"
                >
                  <Code className="h-3 w-3" />
                </Button>
              </div>
              <PlateContent
                className="w-full px-3 py-2 text-sm focus-visible:outline-none min-h-[40px] max-h-[200px] overflow-y-auto"
                placeholder="Aa"
                onKeyDown={handleKeyPress}
              />
              <div className="absolute right-2 bottom-2">
                <EmojiPicker
                  onChange={(value) => {
                    editor.insertText(value);
                    editor.tf.focus();
                  }}
                />
              </div>
            </div>
          </Plate>
        </motion.div>

        <div className="pb-1">
            {hasContent ? (
            <Link
                to="#"
                className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
                )}
                onClick={handleSend}
            >
                <SendHorizontal size={20} className="text-muted-foreground" />
            </Link>
            ) : (
            <Link
                to="#"
                className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
                )}
                onClick={handleThumbsUp}
            >
                <ThumbsUp size={20} className="text-muted-foreground" />
            </Link>
            )}
        </div>
      </AnimatePresence>
    </div>
  );
}
