"use client";

import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const UNSPLASH_IMAGES = [
  "https://cdn.21st.dev/assets/mirror/a9/a9c2900d44fe6288b344f447cb12a05f7e64c439479a8ccb977d3b20eb371156.jpg",
  "https://cdn.21st.dev/assets/mirror/29/29cf6ad39eb198c05b8d915fca0becfd3d270d510d32eaec1b886c426c681c67.jpg",
  "https://cdn.21st.dev/assets/mirror/61/6154958e9df110914005256ff2319d43a2c2e0fc8bb54e9f8bce7b91fdce5df1.jpg",
  "https://cdn.21st.dev/assets/mirror/6d/6db92aff3c02cce69e2c672a6dd4e99cbf5c55d68fbf08c460527e6c7c5b64ba.jpg",
  "https://cdn.21st.dev/assets/mirror/42/42ad2d0680dba697d578434e5af5620c7ab1c7c55bc36cec3b55eec8b7a79cbf.jpg",
  "https://cdn.21st.dev/assets/mirror/cd/cd3dc09b1bbed97cfc879e2c5e62fdbc68dc4070b6105e476410d70e31d1e459.jpg",
  "https://cdn.21st.dev/assets/mirror/02/0232d63e3e0cb8d3599a77e29f87f8ec4b9fadfd031592296b3f19a730a5348c.jpg",
  "https://cdn.21st.dev/assets/mirror/56/562b212caa6ec06d8b0b313660dac6aa0bbfb729092cc4f16d04558a319af6b1.jpg",
  "https://cdn.21st.dev/assets/mirror/02/02cbcd62720734d469f2ea8e5ed7a212e18cb05e73457445b4d755ad0ae1fcd8.jpg",
  "https://cdn.21st.dev/assets/mirror/27/275fbf3f84c5258c7a8235a8a47022f847d0f408c950288c532aefa83d072a2c.jpg",
  "https://cdn.21st.dev/assets/mirror/7e/7e2fb073870b2f578a37a693b1e0c9402a98201149509b54da2f86a2ee6abf5e.jpg",
  "https://cdn.21st.dev/assets/mirror/3d/3d74651780292fb5a2ba23e525d9d09860bb83fbfafc7ede17b8e3662d7b1022.jpg",
];

export interface GalleryPhotoItem {
  src: string;
  alt?: string;
  title?: string;
}

export interface ImageCardProps {
  src: string;
  onLoad?: () => void;
  onClick?: () => void;
  alt?: string;
  title?: string;
}

const ImageCard = ({
  src,
  onLoad,
  onClick,
  title,
  alt = "Wedding photograph",
}: ImageCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title ? `View ${title}` : "View wedding photograph"}
      className="parallax-photo-card w-full h-[200px] sm:h-[300px] md:h-[400px] flex-shrink-0 bg-[#e3e0dc] transition-transform duration-300 hover:scale-[1.03] cursor-pointer relative will-change-transform backface-hidden preserve-3d rounded-lg overflow-hidden border-0 p-0 text-left group focus-visible:outline-2 focus-visible:outline-[#777]"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={onLoad}
        className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-300"
      />
    </button>
  );
};

export interface ParallaxGalleryProps {
  images?: string[];
  photos?: GalleryPhotoItem[];
  isStandalone?: boolean;
  className?: string;
  onPhotoClick?: (src: string, index: number) => void;
}

export default function Component({
  images,
  photos,
  isStandalone = true,
  className = "",
  onPhotoClick,
}: ParallaxGalleryProps = {}) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const loadedCountRef = useRef(0);

  const handleItemLoad = useCallback(() => {
    loadedCountRef.current += 1;
    if (!isReady && loadedCountRef.current >= 1) setIsReady(true);
  }, [isReady]);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const itemsList = useMemo<GalleryPhotoItem[]>(() => {
    if (photos && photos.length > 0) return photos;
    if (images && images.length > 0) {
      return images.map(src => ({ src, alt: "Wedding photograph" }));
    }
    return UNSPLASH_IMAGES.map(src => ({ src, alt: "Gallery Asset" }));
  }, [photos, images]);

  const colMedia = useMemo(() => {
    const col1Base = itemsList.filter((_, i) => i % 4 === 0);
    const col2Base = itemsList.filter((_, i) => i % 4 === 1);
    const col3Base = itemsList.filter((_, i) => i % 4 === 2);
    const col4Base = itemsList.filter((_, i) => i % 4 === 3);

    return {
      col1: [...col1Base, ...col1Base],
      col2: [...col2Base, ...col2Base],
      col3: [...col3Base, ...col3Base],
      col4: [...col4Base, ...col4Base],
    };
  }, [itemsList]);

  // LINKED SCROLL: Container for standalone, or window scroll for embedded
  const { scrollYProgress } = useScroll({
    target: containerRef,
    ...(isStandalone ? { container: scrollWrapperRef } : {}),
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  // Banner animations (No borders)
  const bannerWidth = useTransform(smoothProgress, [0, 0.15], ["90vw", "100vw"]);
  const bannerHeight = useTransform(smoothProgress, [0, 0.15], ["80vh", "100vh"]);
  const bannerRadius = useTransform(smoothProgress, [0, 0.15], ["40px", "0px"]);

  // 3D Matrix animations
  const rotateY = useTransform(smoothProgress, [0.15, 1], [-45, -8]);
  const rotateX = useTransform(smoothProgress, [0.15, 1], [25, 4]);
  const rotateZ = useTransform(smoothProgress, [0.15, 1], [15, 2]);
  const translateZ = useTransform(smoothProgress, [0.15, 1], [-800, 0]);

  // Track columns parallax animations
  const yCol1 = useTransform(smoothProgress, [0.15, 1], ["0%", "-40%"]);
  const yCol2 = useTransform(smoothProgress, [0.15, 1], ["-40%", "10%"]);
  const yCol3 = useTransform(smoothProgress, [0.15, 1], ["0%", "-40%"]);
  const yCol4 = useTransform(smoothProgress, [0.15, 1], ["-30%", "20%"]);

  const content = (
    <section
      ref={containerRef}
      className={`relative w-full ${isStandalone ? "h-[600vh]" : "h-[320vh]"} bg-[#fafaf8] text-[#242424] font-sans border-0 ${className}`}
    >
      <div className="sticky top-0 h-screen w-full flex justify-center items-center overflow-hidden">
        <motion.div
          style={{
            width: bannerWidth,
            height: bannerHeight,
            borderRadius: bannerRadius,
          }}
          className="relative bg-[#fafaf8] overflow-hidden flex items-center justify-center max-w-[1920px] mx-auto will-change-transform backface-hidden preserve-3d border-0 shadow-none"
        >
          <div
            className="absolute inset-0 flex justify-center items-center pointer-events-none"
            style={{ perspective: "1000px" }}
          >
            {/* Ambient Shadow Box Masking matching the website background (#fafaf8) with no borders */}
            <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_100px_140px_-40px_rgba(250,250,248,0.95),inset_0_-100px_140px_-40px_rgba(250,250,248,0.95)]" />
            <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_120px_0_140px_-40px_rgba(250,250,248,0.95),inset_-120px_0_140px_-40px_rgba(250,250,248,0.95)]" />

            {/* Parallax Image Grid Matrix */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                rotateZ,
                z: translateZ,
                transformStyle: "preserve-3d",
              }}
              className="flex gap-4 md:gap-6 justify-center items-center w-[120vw] h-[150vh] origin-center opacity-100 will-change-transform backface-hidden"
            >
              <motion.div style={{ y: yCol1 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                {colMedia.col1.map((item, index) => (
                  <ImageCard
                    key={`col1-${index}`}
                    src={item.src}
                    alt={item.alt}
                    title={item.title}
                    onLoad={handleItemLoad}
                    onClick={() => onPhotoClick?.(item.src, index)}
                  />
                ))}
              </motion.div>

              <motion.div style={{ y: yCol2 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                {colMedia.col2.map((item, index) => (
                  <ImageCard
                    key={`col2-${index}`}
                    src={item.src}
                    alt={item.alt}
                    title={item.title}
                    onLoad={handleItemLoad}
                    onClick={() => onPhotoClick?.(item.src, index)}
                  />
                ))}
              </motion.div>

              <motion.div style={{ y: yCol3 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                {colMedia.col3.map((item, index) => (
                  <ImageCard
                    key={`col3-${index}`}
                    src={item.src}
                    alt={item.alt}
                    title={item.title}
                    onLoad={handleItemLoad}
                    onClick={() => onPhotoClick?.(item.src, index)}
                  />
                ))}
              </motion.div>

              <motion.div style={{ y: yCol4 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                {colMedia.col4.map((item, index) => (
                  <ImageCard
                    key={`col4-${index}`}
                    src={item.src}
                    alt={item.alt}
                    title={item.title}
                    onLoad={handleItemLoad}
                    onClick={() => onPhotoClick?.(item.src, index)}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  if (isStandalone) {
    return (
      <div 
        ref={scrollWrapperRef}
        className="w-full h-screen overflow-y-auto overflow-x-hidden bg-[#fafaf8]"
      >
        {content}
      </div>
    );
  }

  return content;
}
