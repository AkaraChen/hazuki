import { useState, useMemo, useCallback } from "react";
import { MasonryPhotoAlbum, type Photo } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import images from "./images.json";
import { shuffleArray } from "./utils";
import { useOnScrollToEnd } from "./hooks/useOnScrollToEnd";
import { useLoadMore } from "./hooks/useLoadMore";
import xIcon from "./assets/x.svg";

interface ImageData {
  src: string;
  width: number;
  height: number;
}

// Inline SVG placeholder for lazy loading
const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Cpath d='M30 35h40v30H30z' fill='%23ddd'/%3E%3Ccircle cx='40' cy='70' r='5' fill='%23ddd'/%3E%3Ccircle cx='60' cy='70' r='5' fill='%23ddd'/%3E%3C/svg%3E`;

function App() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Shuffle images on initial load
  const shuffledImages = useMemo(() => shuffleArray(images as ImageData[]), []);

  // Convert to Photo format for react-photo-album
  const allPhotos: Photo[] = useMemo(
    () =>
      shuffledImages.map((img) => ({
        src: img.src,
        width: img.width,
        height: img.height,
      })),
    [shuffledImages],
  );

  const { loading, displayedItems, hasMoreItems, loadMoreItems } = useLoadMore({
    items: allPhotos,
    pageSize: 12,
    initialPage: 1,
  });

  // Infinite scroll trigger
  useOnScrollToEnd({
    onScrollToEnd: loadMoreItems,
    threshold: 200,
  });

  // Check if device supports hover (desktop) - disable lightbox on touch devices
  const isTouchDevice = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  }, []);

  const handlePhotoClick = useCallback(
    ({ index }: { index: number }) => {
      if (!isTouchDevice) {
        setLightboxIndex(index);
      }
    },
    [isTouchDevice],
  );

  // Responsive columns matching original breakpoints
  const getColumns = (containerWidth: number) => {
    if (containerWidth <= 480) return 1;
    if (containerWidth <= 768) return 2;
    if (containerWidth <= 1200) return 3;
    return 4;
  };

  return (
    <div className="container">
      {/* @ts-expect-error Web Component */}
      <github-corners repo="AkaraChen/hazuki" blank />

      <header className="site-header">
        <h1>反田叶月 collection！</h1>
        <a
          href="https://x.com/tanda_hazuki"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <img src={xIcon} alt="X (Twitter)" className="x-icon" />
        </a>
      </header>

      <div className="waterfall-container">
        <MasonryPhotoAlbum
          photos={displayedItems}
          columns={getColumns}
          spacing={15}
          onClick={handlePhotoClick}
          render={{
            image: ({ src, alt, width, height }, { photo }) => (
              <LazyLoadImage
                src={src}
                alt={alt || ""}
                width={width}
                height={height}
                placeholderSrc={placeholderSvg}
                effect="blur"
                wrapperClassName="lazy-image-wrapper"
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
      </div>

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

export default App;
