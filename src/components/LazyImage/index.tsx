import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import type { Photo } from 'react-photo-album'

const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f5f5f5' width='100' height='100'/%3E%3Ccircle cx='50' cy='35' r='12' fill='%23e0e0e0'/%3E%3Cellipse cx='50' cy='75' rx='25' ry='20' fill='%23e0e0e0'/%3E%3C/svg%3E`

interface LazyImageProps {
  src: string
  alt?: string
  width: number
  height: number
}

export function LazyImage({ src, alt, width, height }: LazyImageProps) {
  return (
    <LazyLoadImage
      src={src}
      alt={alt || ''}
      width={width}
      height={height}
      placeholderSrc={placeholderSvg}
      effect="blur"
      wrapperClassName="block w-auto h-auto overflow-hidden rounded-lg"
      className="block w-auto h-auto rounded-lg transition-transform duration-300 hover:scale-[1.02]"
    />
  )
}

interface LazyImageRendererProps {
  image: {
    src: string
    alt?: string
    width: number
    height: number
  }
  photo: Photo
}

export function LazyImageRenderer({ image, photo }: LazyImageRendererProps) {
  return <LazyImage src={image.src} alt={photo.title} width={image.width} height={image.height} />
}
