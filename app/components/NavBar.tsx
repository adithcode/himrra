'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-700 ${
        scrolled
          ? 'nav-scrolled py-3'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-[90rem] items-center justify-between px-6 md:px-12 lg:px-16 overflow-visible">
        {/* Logo */}
        <a
          href="/"
          className={`nav-logo-wrap relative transition-all duration-700 flex-shrink-0 ${
            scrolled ? 'h-8 w-32 md:h-10 md:w-40' : 'h-12 w-40 md:h-14 md:w-48'
          }`}
          aria-label="HIMRRA home"
        >
          <Image
            src="/images/logo.png"
            alt="HIMRRA"
            fill
            sizes="(max-width: 768px) 160px, 192px"
            className={`object-contain object-left transition-all duration-700 ${
              scrolled ? 'brightness-100' : 'brightness-[2.5]'
            }`}
            priority
          />
        </a>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'Origins', href: '#story' },
            { label: 'Molecular', href: '#benefits' },
            { label: 'Ritual', href: '#ritual' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative text-[10px] font-outfit font-medium uppercase tracking-[0.25em] transition-colors duration-400 group ${
                scrolled ? 'text-[#1B3022]/60 hover:text-[#1B3022]' : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-500 ease-out" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#collection"
          className={`text-[10px] font-outfit font-medium uppercase tracking-[0.25em] px-8 py-3.5 transition-all duration-500 ${
            scrolled
              ? 'bg-[#1B3022] text-[#F9F7F2] hover:bg-[#25422f]'
              : 'bg-white/10 text-white border border-white/20 hover:bg-white hover:text-[#1B3022] backdrop-blur-md'
          }`}
        >
          Procure
        </a>
      </div>
    </nav>
  );
}
