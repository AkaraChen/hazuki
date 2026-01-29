import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import type { Photo } from "react-photo-album";

const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Cpath d='M30 35h40v30H30z' fill='%23ddd'/%3E%3Ccircle cx='40' cy='70' r='5' fill='%23ddd'/%3E%3Ccircle cx='60' cy='70' r='5' fill='%23ddd'/%3E%3C/svg%3E`;

interface LazyImageProps {
  src: string;
  alt?: string;
  width: number;
  height: number;
}

export function LazyImage({ src, alt, width, height }: LazyImageProps) {
  return (
    <LazyLoadImage
      src={src}
      alt={alt || ""}
      width={width}
      height={height}
      placeholderSrc={placeholderSvg}
      effect="blur"
      wrapperClassName="lazy-image-wrapper"
    />
  );
}

interface LazyImageRendererProps {
  image: {
    src: string;
    alt?: string;
    width: number;
    height: number;
  };
  photo: Photo;
}

export function LazyImageRenderer({ image, photo }: LazyImageRendererProps) {
  return <LazyImage src={image.src} alt={photo.title} width={image.width} height={image.height} />;
}
