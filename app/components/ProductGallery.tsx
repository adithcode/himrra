'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex gap-4 w-full max-w-2xl mx-auto lg:mx-0 h-[520px] md:h-[640px]">
      {/* ── Vertical thumbnail strip (left side on desktop, bottom on mobile) ── */}
      <div className="hidden lg:flex flex-col gap-3 w-20 flex-shrink-0">
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

      {/* ── Main image ── */}
      <div className="relative flex-1 overflow-hidden bg-[#F2EFE8]">
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

        {/* Decorative gold glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/3 bg-gold/10 blur-[60px] pointer-events-none" />

        {/* Image counter badge */}
        <div className="absolute top-4 right-4 text-[9px] font-outfit uppercase tracking-[0.4em] text-[#1B3022]/30">
          {String(activeIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(images.length).padStart(2, '0')}
        </div>
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
