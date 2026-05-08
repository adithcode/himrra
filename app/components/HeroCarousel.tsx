'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface Slide {
  image: string;
  layout: 'left-dominant' | 'right-editorial' | 'centered-numerical';
  eyebrow?: string;
  headline: React.ReactNode;
  body: string;
  cta: { label: string; href: string };
  number: string;
}

const slides: Slide[] = [
  {
    image: '/images/banner_peaks.png',
    layout: 'left-dominant',
    headline: (
      <>
        High-Altitude<br />
        <em className="text-gold-light not-italic">Sourced</em>
      </>
    ),
    body: 'Harvested from the high Himalayas at 18,000 ft. Authentic, raw mineral resin.',
    cta: { label: 'Our Sourcing', href: '#story' },
    number: '01',
  },
  {
    image: '/images/banner_resin.png',
    layout: 'right-editorial',
    eyebrow: 'Third-Party Tested',
    headline: (
      <>
        Pure<br />
        <em className="text-gold-light not-italic">Resin</em>
      </>
    ),
    body: 'Cold-filtered to preserve its natural mineral composition. Lab-verified for safety and potency.',
    cta: { label: 'View Lab Results', href: '#benefits' },
    number: '02',
  },
  {
    image: '/images/banner_ritual.png',
    layout: 'centered-numerical',
    eyebrow: 'Daily Wellness',
    headline: (
      <>
        The Daily<br />
        <em className="text-gold-light not-italic">Routine</em>
      </>
    ),
    body: 'Dissolve a small amount in warm water. A simple addition to your morning.',
    cta: { label: 'How to Use', href: '#ritual' },
    number: '03',
  },
];
export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [progressKey, setProgressKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    setPrev(current);
    setCurrent(idx);
    setProgressKey((k) => k + 1);
  }, [current]);

  const nextSlide = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prevSlide = useCallback(() => {
    goTo(current === 0 ? slides.length - 1 : current - 1);
  }, [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 6500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [nextSlide, isPaused]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-[#0F1C14]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background Images ── */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDuration: '1200ms' }}
        >
          <Image
            src={s.image}
            alt={`Slide ${idx + 1}`}
            fill
            priority={idx === 0}
            className={`object-cover transition-transform ease-linear ${
              idx === current ? 'scale-[1.06]' : 'scale-100'
            }`}
            style={{ transitionDuration: '12000ms' }}
          />
          {/* Layered overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </div>
      ))}

      {/* ── Content ── */}
      <div className="relative z-20 h-full container mx-auto px-6 lg:px-16 flex flex-col justify-center lg:justify-end pb-32 md:pb-40">

        {/* Left-dominant layout */}
        {slide.layout === 'left-dominant' && (
          <div
            key={`content-${current}`}
            className="max-w-3xl space-y-6 md:space-y-8 fade-in"
          >
            <div className="w-10 h-[1px] bg-gold" />
            <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-serif font-light leading-[0.9] tracking-[-0.01em] text-white">
              {slide.headline}
            </h1>
            <p className="text-base md:text-lg text-white/80 font-light leading-relaxed max-w-lg">
              {slide.body}
            </p>
            <div className="pt-2">
              <HeroCTA href={slide.cta.href} label={slide.cta.label} />
            </div>
          </div>
        )}

        {/* Right-editorial layout */}
        {slide.layout === 'right-editorial' && (
          <div
            key={`content-${current}`}
            className="flex justify-end fade-in"
          >
            <div className="max-w-xl space-y-6 md:space-y-8 text-right">
              {slide.eyebrow && (
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-outfit font-medium">
                  {slide.eyebrow}
                </p>
              )}
              <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-serif font-light leading-[0.9] tracking-[-0.01em] text-white">
                {slide.headline}
              </h1>
              <p className="text-base md:text-lg text-white/80 font-light leading-relaxed ml-auto max-w-sm">
                {slide.body}
              </p>
              <div className="flex justify-end pt-2">
                <HeroCTA href={slide.cta.href} label={slide.cta.label} />
              </div>
            </div>
          </div>
        )}

        {/* Centered-numerical layout */}
        {slide.layout === 'centered-numerical' && (
          <div
            key={`content-${current}`}
            className="flex flex-col items-center text-center space-y-6 md:space-y-8 fade-in"
          >
            <span
              className="text-[clamp(4rem,10vw,10rem)] font-serif font-light leading-none text-white/10 absolute bottom-32 left-1/2 -translate-x-1/2 select-none pointer-events-none"
              aria-hidden="true"
            >
              {slide.number}
            </span>
            {slide.eyebrow && (
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-outfit font-medium">
                {slide.eyebrow}
              </p>
            )}
            <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-serif font-light leading-[0.9] tracking-[-0.01em] text-white relative z-10">
              {slide.headline}
            </h1>
            <p className="text-base md:text-lg text-white/80 font-light leading-relaxed max-w-md">
              {slide.body}
            </p>
            <div className="pt-2">
              <HeroCTA href={slide.cta.href} label={slide.cta.label} />
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* Progress track */}
        <div className="flex">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className="relative h-[2px] flex-1 bg-white/15 overflow-hidden group"
              aria-label={`Go to slide ${idx + 1}`}
            >
              {idx === current && (
                <span
                  key={progressKey}
                  className="absolute inset-y-0 left-0 bg-gold slide-progress"
                />
              )}
              {idx < current && (
                <span className="absolute inset-y-0 left-0 right-0 bg-white/30" />
              )}
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>

        {/* Counter + arrows */}
        <div className="flex items-center justify-between px-6 lg:px-16 py-4">
          <p className="text-[10px] font-outfit uppercase tracking-[0.5em] text-white/40">
            <span className="text-white/80">{slide.number}</span>
            <span className="mx-2 text-white/20">/</span>
            {String(slides.length).padStart(2, '0')}
          </p>

          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Rotated side label (REMOVED) ── */}
    </section>
  );
}

function HeroCTA({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-3 group"
    >
      <span className="text-[10px] md:text-[11px] font-outfit font-medium uppercase tracking-[0.25em] text-white/90 border-b border-white/30 pb-1 group-hover:border-white group-hover:text-white transition-all duration-300">
        {label}
      </span>
      <svg
        width="16" height="8" viewBox="0 0 20 10" fill="none"
        className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
        stroke="currentColor" strokeWidth="1.5"
      >
        <path d="M0 5h16M12 1l5 4-5 4" />
      </svg>
    </a>
  );
}
