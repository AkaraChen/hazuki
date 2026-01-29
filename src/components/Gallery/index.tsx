import { useState, useCallback } from "react";
import { MasonryPhotoAlbum, type Photo } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import { useOnScrollToEnd } from "../../hooks/useOnScrollToEnd";
import { useLoadMore } from "../../hooks/useLoadMore";
import { getColumns, isTouchDevice } from "../../utils/responsive";
import { LazyImageRenderer } from "../LazyImage";

interface GalleryProps {
  photos: Photo[];
}

export function Gallery({ photos }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const { loading, displayedItems, hasMoreItems, loadMoreItems } = useLoadMore({
    items: photos,
    pageSize: 12,
    initialPage: 1,
  });

  useOnScrollToEnd({
    onScrollToEnd: loadMoreItems,
    threshold: 200,
  });

  const handlePhotoClick = useCallback(({ index }: { index: number }) => {
    if (!isTouchDevice()) {
      setLightboxIndex(index);
    }
  }, []);

  return (
    <div className="waterfall-container">
      {/* @ts-expect-error Web Component */}
      <github-corners repo="AkaraChen/hazuki" blank />

      <MasonryPhotoAlbum
        photos={displayedItems}
        columns={getColumns}
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
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>加载中...</p>
        </div>
      )}

      {!hasMoreItems && displayedItems.length > 0 && (
        <div className="end-message">
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
  );
}
