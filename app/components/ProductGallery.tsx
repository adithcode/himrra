'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextImage = useCallback(() => {
    setActiveIndex((current) => (current + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }, [images.length]);

  // Very slow auto-slide (8 seconds)
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextImage, 8000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [nextImage, isPaused]);

  return (
    <div 
      className="flex gap-4 w-full max-w-2xl mx-auto lg:mx-0 h-[520px] md:h-[640px] relative group/gallery"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Main image ── */}
      <div className="relative flex-1 overflow-hidden bg-[#F2EFE8] order-1 lg:order-1">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={img}
              alt={`Product view ${idx + 1}`}
              fill
              priority={idx === 0}
              className="object-contain p-8 transition-transform duration-[1.5s] ease-out scale-100 hover:scale-[1.04]"
            />
          </div>
        ))}

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-2 md:px-4 pointer-events-none">
          <button 
            onClick={prevImage}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-[#1B3022]/10 bg-[#F9F7F2]/80 backdrop-blur-sm flex items-center justify-center text-[#1B3022]/60 hover:text-[#1B3022] hover:bg-white transition-all pointer-events-auto opacity-100 lg:opacity-0 lg:group-hover/gallery:opacity-100"
            aria-label="Previous image"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button 
            onClick={nextImage}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-[#1B3022]/10 bg-[#F9F7F2]/80 backdrop-blur-sm flex items-center justify-center text-[#1B3022]/60 hover:text-[#1B3022] hover:bg-white transition-all pointer-events-auto opacity-100 lg:opacity-0 lg:group-hover/gallery:opacity-100"
            aria-label="Next image"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Decorative gold glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/3 bg-gold/10 blur-[60px] pointer-events-none" />

        {/* Image counter badge */}
        <div className="absolute top-4 right-4 text-[9px] font-outfit uppercase tracking-[0.4em] text-[#1B3022]/30">
          {String(activeIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(images.length).padStart(2, '0')}
        </div>
      </div>

      {/* ── Vertical thumbnail strip (right side on desktop) ── */}
      <div className="hidden lg:flex flex-col gap-3 w-20 flex-shrink-0 order-2 lg:order-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative w-full aspect-square overflow-hidden transition-all duration-500 ${
              activeIndex === idx
                ? 'opacity-100 ring-1 ring-gold ring-offset-2 ring-offset-[#F9F7F2]'
                : 'opacity-35 hover:opacity-65'
            }`}
            aria-label={`View product image ${idx + 1}`}
          >
            <Image
              src={img}
              alt={`Product view ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* ── Mobile thumbnail strip (bottom) ── */}
      <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-[2px] transition-all duration-500 ${
              activeIndex === idx ? 'w-8 bg-gold' : 'w-4 bg-[#1B3022]/20'
            }`}
            aria-label={`View image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
