import { useCallback, useState } from 'react'
import { MasonryPhotoAlbum, type Photo } from 'react-photo-album'
import Lightbox from 'yet-another-react-lightbox'
import { useLoadMore } from '../../hooks/useLoadMore'
import { useOnScrollToEnd } from '../../hooks/useOnScrollToEnd'
import { LazyImageRenderer } from '../LazyImage'

interface GalleryProps {
  photos: Photo[]
}

export function Gallery({ photos }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const { loading, displayedItems, hasMoreItems, loadMoreItems } = useLoadMore({
    items: photos,
    pageSize: 12,
    initialPage: 1,
  })

  useOnScrollToEnd({
    onScrollToEnd: loadMoreItems,
    threshold: 200,
  })

  const columns = (containerWidth: number) => {
    if (containerWidth <= 480) return 1
    if (containerWidth <= 768) return 2
    if (containerWidth <= 1200) return 3
    return 4
  }

  const handlePhotoClick = useCallback(({ index }: { index: number }) => {
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    if (!isTouch) {
      setLightboxIndex(index)
    }
  }, [])

  return (
    <div className="w-full box-border [&_img]:rounded-lg [&_img]:transition-transform [&_img]:duration-300">
      {/* @ts-expect-error Web Component */}
      <github-corners repo="AkaraChen/hazuki" blank />

      <MasonryPhotoAlbum
        photos={displayedItems}
        columns={columns}
        spacing={15}
        onClick={handlePhotoClick}
        render={{
          image: (image, photo) => (
            <LazyImageRenderer
              image={{
                src: image.src,
                alt: image.alt,
                width: image.width as number,
                height: image.height as number,
              }}
              photo={photo.photo}
            />
          ),
        }}
      />

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 w-full">
          <div className="w-10 h-10 border-4 border-black/10 rounded-full border-t-blue-500 animate-spin mb-2.5" />
          <p>加载中...</p>
        </div>
      )}

      {!hasMoreItems && displayedItems.length > 0 && (
        <div className="text-center py-5 text-end-message italic border-t border-border mt-5">
          <p>已加载全部</p>
        </div>
      )}

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={displayedItems.map((photo) => ({ src: photo.src }))}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        toolbar={{ buttons: [] }}
        controller={{ closeOnBackdropClick: true }}
        animation={{ fade: 0 }}
      />
    </div>
  )
}
