import React from "react";

import type {
  EmojiCategoryList,
  IEmojiFloatingLibrary,
  UseEmojiPickerType,
} from "@udecode/plate-emoji";

import { cn } from "@udecode/cn";

export type EmojiPickerNavigationProps = {
  onClick: (id: EmojiCategoryList) => void;
} & Pick<
  UseEmojiPickerType,
  "emojiLibrary" | "focusedCategory" | "i18n" | "icons"
>;

const getBarProperty = (
  emojiLibrary: IEmojiFloatingLibrary,
  focusedCategory?: EmojiCategoryList,
) => {
  let width = 0;
  let position = 0;

  if (focusedCategory) {
    width = 100 / emojiLibrary.getGrid().size;
    position = focusedCategory
      ? emojiLibrary.indexOf(focusedCategory) * 100
      : 0;
  }

  return { position, width };
};

export function EmojiPickerNavigation({
  emojiLibrary,
  focusedCategory,
  i18n,
  icons,
  onClick,
}: EmojiPickerNavigationProps) {
  const { position, width } = getBarProperty(emojiLibrary, focusedCategory);

  return (
    <nav
      className="mb-2.5 border-0 border-b border-solid border-b-gray-100 p-3"
      id="emoji-nav"
    >
      <div className="relative flex">
        {emojiLibrary
          .getGrid()
          .sections()
          .map(({ id }) => (
            <button
              aria-label={i18n.categories[id]}
              className={cn(
                "flex grow cursor-pointer items-center justify-center border-none bg-transparent fill-current text-sm text-gray-500 hover:text-gray-800",
                id === focusedCategory &&
                  "pointer-events-none fill-current text-blue-600",
              )}
              key={id}
              onClick={() => onClick(id)}
              title={i18n.categories[id]}
              type="button"
            >
              <span style={{ height: "20px", width: "20px" }}>
                {icons.categories[id].outline}
              </span>
            </button>
          ))}
        <div
          className="absolute -bottom-3 left-0 h-[3px] w-full rounded-t bg-blue-600 opacity-100 transition-transform duration-200"
          style={{
            transform: `translateX(${position}%)`,
            visibility: `${focusedCategory ? "visible" : "hidden"}`,
            width: `${width}%`,
          }}
        />
      </div>
    </nav>
  );
}
