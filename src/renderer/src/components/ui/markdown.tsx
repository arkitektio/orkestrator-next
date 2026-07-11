import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  content: string;
}

export function CodeBlock({ language, content }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg border border-border/40 bg-zinc-950 dark:bg-zinc-900/60 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-border/10 bg-zinc-900 dark:bg-zinc-950/40 text-[10px] font-mono text-zinc-400 select-none">
        <span>{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-xs font-mono text-zinc-100 dark:text-zinc-200 leading-relaxed scrollbar-thin">
        <code>{content}</code>
      </pre>
    </div>
  );
}

interface MarkdownProps {
  text: string;
  isOwn?: boolean;
  className?: string;
}

interface Block {
  type: "header" | "blockquote" | "list" | "code" | "paragraph";
  level?: number;
  ordered?: boolean;
  items?: string[];
  content?: string;
  language?: string;
  text?: string;
}

export function Markdown({ text, isOwn = false, className }: MarkdownProps) {
  // Inline rendering with conditional styling
  const renderInline = (inputText: string): React.ReactNode[] => {
    if (!inputText) return [];

    const boldRegex = /\*\*([\s\S]+?)\*\*/;
    const italicRegex = /\*([\s\S]+?)\*/;
    const codeRegex = /`([\s\S]+?)`/;
    const linkRegex = /\[([\s\S]+?)\]\(([\s\S]+?)\)/;

    let match: RegExpExecArray | null = null;
    let type: "bold" | "italic" | "code" | "link" | null = null;
    let index = Infinity;

    const mBold = boldRegex.exec(inputText);
    if (mBold && mBold.index < index) {
      match = mBold;
      type = "bold";
      index = mBold.index;
    }

    const mItalic = italicRegex.exec(inputText);
    if (mItalic && mItalic.index < index) {
      match = mItalic;
      type = "italic";
      index = mItalic.index;
    }

    const mCode = codeRegex.exec(inputText);
    if (mCode && mCode.index < index) {
      match = mCode;
      type = "code";
      index = mCode.index;
    }

    const mLink = linkRegex.exec(inputText);
    if (mLink && mLink.index < index) {
      match = mLink;
      type = "link";
      index = mLink.index;
    }

    if (!match) {
      return [inputText];
    }

    const before = inputText.substring(0, index);
    const matchedText = match[0];
    const insideText = match[1];
    const url = type === "link" ? match[2] : "";
    const after = inputText.substring(index + matchedText.length);

    const elements: React.ReactNode[] = [];
    if (before) {
      elements.push(before);
    }

    const key = `${type}-${index}`;
    if (type === "bold") {
      elements.push(
        <strong key={key} className="font-semibold">
          {renderInline(insideText)}
        </strong>
      );
    } else if (type === "italic") {
      elements.push(
        <em key={key} className="italic">
          {renderInline(insideText)}
        </em>
      );
    } else if (type === "code") {
      elements.push(
        <code
          key={key}
          className={cn(
            "font-mono text-xs px-1 py-0.5 rounded border select-all",
            isOwn
              ? "bg-primary-foreground/15 border-primary-foreground/10 text-primary-foreground"
              : "bg-muted border-border/40 text-foreground"
          )}
        >
          {insideText}
        </code>
      );
    } else if (type === "link") {
      elements.push(
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "underline font-medium transition-opacity hover:opacity-80 inline-flex items-center gap-0.5",
            isOwn ? "text-primary-foreground" : "text-primary"
          )}
        >
          {renderInline(insideText)}
        </a>
      );
    }

    if (after) {
      elements.push(...renderInline(after));
    }

    return elements;
  };

  // Block parser
  const parseBlocks = (markdownText: string): Block[] => {
    const lines = markdownText.split("\n");
    const blocks: Block[] = [];

    let inCodeBlock = false;
    let codeLanguage = "";
    let codeContent: string[] = [];

    let currentList: { ordered: boolean; items: string[] } | null = null;
    let currentParagraphLines: string[] = [];

    const flushList = () => {
      if (currentList) {
        blocks.push({
          type: "list",
          ordered: currentList.ordered,
          items: currentList.items,
        });
        currentList = null;
      }
    };

    const flushParagraph = () => {
      if (currentParagraphLines.length > 0) {
        blocks.push({
          type: "paragraph",
          text: currentParagraphLines.join("\n"),
        });
        currentParagraphLines = [];
      }
    };

    const flushAll = () => {
      flushList();
      flushParagraph();
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (inCodeBlock) {
        if (line.trim().startsWith("```")) {
          blocks.push({
            type: "code",
            language: codeLanguage,
            content: codeContent.join("\n"),
          });
          inCodeBlock = false;
          codeLanguage = "";
          codeContent = [];
        } else {
          codeContent.push(line);
        }
        continue;
      }

      if (line.trim().startsWith("```")) {
        flushAll();
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim();
        continue;
      }

      const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headerMatch) {
        flushAll();
        const level = headerMatch[1].length;
        const text = headerMatch[2];
        blocks.push({
          type: "header",
          level,
          text,
        });
        continue;
      }

      if (line.startsWith("> ")) {
        flushAll();
        blocks.push({
          type: "blockquote",
          text: line.slice(2),
        });
        continue;
      }

      const uListMatch = line.match(/^[\*\-\+]\s+(.*)$/);
      if (uListMatch) {
        flushParagraph();
        const itemText = uListMatch[1];
        if (currentList && !currentList.ordered) {
          currentList.items.push(itemText);
        } else {
          flushList();
          currentList = { ordered: false, items: [itemText] };
        }
        continue;
      }

      const oListMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (oListMatch) {
        flushParagraph();
        const itemText = oListMatch[2];
        if (currentList && currentList.ordered) {
          currentList.items.push(itemText);
        } else {
          flushList();
          currentList = { ordered: true, items: [itemText] };
        }
        continue;
      }

      if (line.trim() === "") {
        flushAll();
        continue;
      }

      flushList();
      currentParagraphLines.push(line);
    }

    flushAll();
    if (inCodeBlock) {
      blocks.push({
        type: "code",
        language: codeLanguage,
        content: codeContent.join("\n"),
      });
    }

    return blocks;
  };

  const blocks = parseBlocks(text);

  return (
    <div className={cn("space-y-2 text-sm leading-relaxed", className)}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "header": {
            const H = `h${Math.min(block.level || 1, 6)}` as React.ElementType<
              React.HTMLAttributes<HTMLHeadingElement>
            >;
            const sizeClass =
              block.level === 1
                ? "text-lg font-bold mt-3 mb-1 text-foreground"
                : block.level === 2
                  ? "text-base font-semibold mt-2.5 mb-1 text-foreground"
                  : "text-sm font-semibold mt-2 mb-0.5 text-foreground";
            return (
              <H key={idx} className={sizeClass}>
                {renderInline(block.text || "")}
              </H>
            );
          }
          case "blockquote":
            return (
              <blockquote
                key={idx}
                className={cn(
                  "border-l-2 pl-3 py-0.5 my-1 italic text-xs",
                  isOwn
                    ? "border-primary-foreground/35 text-primary-foreground/80"
                    : "border-primary/40 text-muted-foreground bg-muted/20 rounded-r"
                )}
              >
                {renderInline(block.text || "")}
              </blockquote>
            );
          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            return (
              <Tag
                key={idx}
                className={cn(
                  "pl-5 my-1.5 space-y-1",
                  block.ordered ? "list-decimal" : "list-disc"
                )}
              >
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-inherit">
                    {renderInline(item)}
                  </li>
                ))}
              </Tag>
            );
          }
          case "code":
            return (
              <CodeBlock
                key={idx}
                language={block.language || ""}
                content={block.content || ""}
              />
            );
          case "paragraph":
          default:
            return (
              <p key={idx} className="whitespace-pre-wrap leading-relaxed break-words">
                {renderInline(block.text || "")}
              </p>
            );
        }
      })}
    </div>
  );
}
