import { useState, useEffect } from "react";

export default function Img({
  src,
  alt,
  width,
  style,
}: {
  src: any;
  alt?: string;
  width?: HTMLImageElement["width"];
  style?: React.CSSProperties;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoading(false);
    // img.onload = () => setTimeout(() => setIsLoading(false), 1000);

    return () => {
      img.onload = null;
    };
  }, [src]);

  if (isLoading) return <div data-loading></div>;

  return <img key={src} src={src} alt={alt} style={style} width={width} />;
}
