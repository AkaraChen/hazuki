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
    if (containerWidth <= 480) return 2
    if (containerWidth <= 768) return 3
    if (containerWidth <= 1200) return 4
    return 4
  }

  const handlePhotoClick = useCallback(({ index }: { index: number }) => {
    setLightboxIndex(index)
  }, [])

  return (
    <div className="relative">
      <MasonryPhotoAlbum
        photos={displayedItems}
        columns={columns}
        spacing={16}
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
        <div className="flex flex-col items-center justify-center py-12 w-full">
          <div className="w-8 h-8 border-2 border-text-secondary/20 border-t-text-secondary rounded-full animate-spin mb-3" />
          <p className="text-sm text-text-secondary">加载中...</p>
        </div>
      )}

      {!hasMoreItems && displayedItems.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-text-secondary">— 已加载全部 —</p>
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
