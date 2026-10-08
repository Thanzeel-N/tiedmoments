'use client';

import { forwardRef, useEffect, useRef, useState, type Ref, type ReactNode } from 'react';
import Image, { type ImageProps } from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface GalleryPhoto {
  src: string;
  alt: string;
  title?: string;
  blurDataURL?: string;
}

const defaultPhotos: GalleryPhoto[] = [
  { src: '/images/bride.webp', alt: 'Bride in a pink and gold sari' },
  { src: '/images/monochrome.webp', alt: 'Wedding portrait beside a sunlit window' },
  { src: '/images/forever.webp', alt: 'Bride and groom beneath a red veil' },
  { src: '/images/friends.webp', alt: 'Bride celebrating with her bridesmaids' },
  { src: '/images/haldi.webp', alt: 'Bride celebrating in yellow' },
];

export function PhotoGallery({
  animationDelay = 0.5,
  photos = defaultPhotos,
  children,
  onPhotoSelect,
  className,
}: {
  animationDelay?: number;
  photos?: GalleryPhoto[];
  children?: ReactNode;
  onPhotoSelect?: (photo: GalleryPhoto) => void;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [width, setWidth] = useState(320);
  const [active, setActive] = useState<number | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const selectedPhotos = photos.slice(0, 5);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) { setIsVisible(true); setIsLoaded(true); return; }
    const visibilityTimer = setTimeout(() => setIsVisible(true), animationDelay * 1000);
    const animationTimer = setTimeout(() => setIsLoaded(true), (animationDelay + 0.4) * 1000);
    return () => { clearTimeout(visibilityTimer); clearTimeout(animationTimer); };
  }, [animationDelay, reducedMotion]);

  const size = Math.min(220, Math.max(92, width * 0.31));
  const spacing = Math.min(160, Math.max(0, (width - size - 38) / Math.max(1, selectedPhotos.length - 1)));
  const offsets = [15, 32, 8, 22, 44];
  const photoVariants: Variants = {
    hidden: { x: 0, y: 0, rotate: 0, scale: 1 },
    visible: (custom: { x: number; y: number; order: number }) => ({
      x: custom.x, y: custom.y, rotate: 0, scale: 1,
      transition: reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 70, damping: 12, mass: 1, delay: custom.order * 0.15 },
    }),
  };

  return <div className={cn('photo-gallery relative w-full', className)} ref={container}>
    {children}
    <div className="photo-fan-grid" aria-hidden="true" />
    <motion.div className="photo-fan-stage relative mx-auto flex w-full justify-center" style={{ height: size + 135 }} initial={false} animate={{ opacity: isVisible ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.4 }}>
      <motion.div className="relative" style={{ width: size, height: size }} initial="hidden" animate={isLoaded ? 'visible' : 'hidden'}>
        {selectedPhotos.map((photo, order) => <motion.div key={photo.src} className="absolute left-0 top-0" style={{ zIndex: active === order ? 100 : 50 - order }} variants={photoVariants} custom={{ x: (order - (selectedPhotos.length - 1) / 2) * spacing, y: offsets[order] * Math.min(1, width / 700), order }}
          onHoverStart={() => setActive(order)} onHoverEnd={() => setActive(null)} onFocus={() => setActive(order)} onBlur={() => setActive(null)}>
          <Photo src={photo.src} alt={photo.alt} title={photo.title} blurDataURL={photo.blurDataURL} width={size} height={size} direction={order < 2 ? 'left' : 'right'} rotation={[ -3, -2, 2, 3, -2 ][order]} eager={order === 2} onSelect={onPhotoSelect ? () => onPhotoSelect(photo) : undefined} />
        </motion.div>)}
      </motion.div>
    </motion.div>
    <div className="photo-gallery-action flex w-full justify-center"><Button asChild size="lg" className="rounded-none px-7"><a href="#work">View our work</a></Button></div>
  </div>;
}

const MotionImage = motion.create(forwardRef(function MotionImage(props: ImageProps, ref: Ref<HTMLImageElement>) {
  return <Image ref={ref} {...props} />;
}));

type Direction = 'left' | 'right';
export function Photo({ src, alt, title, className, direction = 'right', width, height, rotation = 2, eager = false, blurDataURL, onSelect }: GalleryPhoto & {
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  rotation?: number;
  eager?: boolean;
  onSelect?: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const [canDrag, setCanDrag] = useState(false);
  const dragged = useRef(false);
  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)');
    const update = () => setCanDrag(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return <motion.button type="button" aria-label={`Open ${title || alt}`} drag={canDrag && !reducedMotion} dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.22} dragMomentum={false}
    whileTap={reducedMotion ? undefined : { scale: 1.04 }}
    whileHover={reducedMotion ? undefined : { scale: 1.07, rotateZ: direction === 'left' ? -4 : 4 }}
    whileDrag={reducedMotion ? undefined : { scale: 1.08 }}
    initial={false} animate={{ rotate: reducedMotion ? 0 : rotation }}
    style={{ width, height, perspective: 400, WebkitTouchCallout: 'none', userSelect: 'none', touchAction: canDrag && !reducedMotion ? 'none' : 'pan-y' }}
    className={cn('photo-fan-card relative mx-auto block shrink-0 cursor-grab rounded-3xl active:cursor-grabbing', className)}
    onPointerDown={() => { dragged.current = false; }} onDragStart={() => { dragged.current = true; }}
    onClick={event => { if (!dragged.current || event.detail === 0) onSelect?.(); }}>
    <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-sm">
      <MotionImage fill className="rounded-3xl object-cover" src={src} alt={alt} sizes="(max-width: 700px) 31vw, 220px" draggable={false} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} placeholder={blurDataURL ? 'blur' : 'empty'} blurDataURL={blurDataURL} />
    </div>
  </motion.button>;
}
