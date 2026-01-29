import { cn } from "@/lib/utils";
import { decode } from "blurhash";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

export type ImageProps = {
  src: string;
  blurhash?: string | null;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
};

export const Image = ({ src, blurhash, style, className, alt }: ImageProps) => {
  const [bgImage, setBgImage] = useState<string | undefined>();

  useEffect(() => {
    if (blurhash) {
      const decoded = decode(blurhash, 32, 32);

      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const imageData = ctx.createImageData(32, 32);
        imageData.data.set(decoded);
        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL();
        setBgImage(dataUrl);
      }
    }
  }, [blurhash]);

  return (
    <LazyLoadImage
      key={src}
      src={src}
      style={{
        ...style,
        backgroundImage: bgImage ? `url(${bgImage}) ` : undefined,
        backgroundSize: "cover",
      }}
      alt={alt || "Image"}
      className={cn(className)}
      threshold={100}
    />
  );
};
