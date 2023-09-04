import { useEffect, useState } from "react";
import { MateRender } from "./MateRender";
import { Structure } from "@/types";
import { Mate, MateFinder } from "@/mates/types";

export interface SelfMatesProps {
  overItems: Structure[];
  self: Structure;
  withSelf: boolean;
  onProgress: (x: number | undefined) => Promise<void>;
  mateFinder?: MateFinder;
  onDone?: () => Promise<void>;
  onError?: (error: Error) => Promise<void>;
}

export const Mates = ({
  overItems,
  self,
  withSelf,
  onProgress,
  onDone,
  onError,
  mateFinder,
}: SelfMatesProps) => {
  const [moreMates, setMoreMates] = useState<Mate[] | undefined>();
  const [focusIndex, setFocusIndex] = useState<number>();

  useEffect(() => {
    if (mateFinder) {
      mateFinder({
        partners: overItems,
        self: self,
        partnersIncludeSelf: withSelf,
        justSelf: overItems.every(
          (item) => item.id === self.id && item.identifier == self.identifier,
        ),
      })
        .then((mates) => {
          console.log("got mates", mates);
          setMoreMates(mates);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, []);

  useEffect(() => {
    const listener = {
      handleEvent: (e: KeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          setFocusIndex((i) =>
            i === undefined || i >= (moreMates?.length || 0) - 1 ? 0 : i + 1,
          );
        }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          setFocusIndex((i) => (i === undefined || i <= 0 ? 0 : i - 1));
        }
      },
    };
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [moreMates]);

  return (
    <>
      {moreMates?.map((mate: any, index: any) => (
        <MateRender
          key={index}
          mate={mate}
          self={self}
          progress={onProgress}
          focus={focusIndex ? focusIndex === index : undefined}
          clickable={true}
          onDone={onDone}
          onError={onError}
        />
      ))}
    </>
  );
};
