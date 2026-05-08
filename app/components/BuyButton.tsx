'use client';

import { useState } from 'react';
import { createCartAction } from '@/lib/actions';

import CartDrawer from './CartDrawer';

interface BuyButtonProps {
  variantId: string;
  formattedPrice: string;
  priceAmount: number;
  availableForSale?: boolean;
}

type ToastState = { type: 'error' | 'success'; message: string } | null;

export default function BuyButton({ variantId, formattedPrice, priceAmount, availableForSale = true }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (type: 'error' | 'success', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  const handleBuyNow = () => {
    if (!availableForSale) return;
    if (!variantId) {
      showToast('error', 'Product unavailable. Please refresh.');
      return;
    }
    // Open Cart Drawer with current selected quantity
    setIsCartOpen(true);
  };

  return (
    <div className="space-y-6 w-full">
      {/* ── Quantity + Price row ── */}
      <div className="flex items-center justify-between border-t border-b border-[#1B3022]/8 py-5">
        <div className="flex items-center gap-5">
          <span className="text-[9px] font-outfit uppercase tracking-[0.5em] text-[#1B3022]/40">
            Quantity
          </span>
          <div className={`flex items-center border border-[#1B3022]/12 ${!availableForSale ? 'opacity-40' : ''}`}>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={!availableForSale}
              className="w-9 h-9 flex items-center justify-center text-[#1B3022]/50 hover:text-[#1B3022] hover:bg-[#1B3022]/4 transition-all duration-200 text-lg leading-none disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-[13px] font-outfit text-[#1B3022]">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              disabled={!availableForSale}
              className="w-9 h-9 flex items-center justify-center text-[#1B3022]/50 hover:text-[#1B3022] hover:bg-[#1B3022]/4 transition-all duration-200 text-lg leading-none disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        <p className="text-2xl font-serif font-light text-[#1B3022] tracking-tight">
          {formattedPrice}
        </p>
      </div>

      {/* ── Out of Stock Banner ── */}
      {!availableForSale && (
        <div className="flex items-center gap-3 px-5 py-4 border border-[#1B3022]/10 bg-[#1B3022]/3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1B3022]/30 flex-shrink-0" />
          <p className="text-[10px] font-outfit uppercase tracking-[0.4em] text-[#1B3022]/50">
            Currently Out of Stock — Join the waitlist below
          </p>
        </div>
      )}

      {/* ── Buy / Waitlist button ── */}
      {availableForSale ? (
        <button
          onClick={handleBuyNow}
          disabled={loading}
          className={`group relative w-full overflow-hidden bg-[#1B3022] py-4 md:py-5 text-[10px] font-outfit font-medium uppercase tracking-[0.25em] text-[#F9F7F2] transition-colors duration-300 ${
            loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#25422f]'
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting to Checkout
              </>
            ) : (
              <>
                <span>Add to Cart</span>
                <svg
                  width="14" height="8" viewBox="0 0 20 10" fill="none"
                  stroke="currentColor" strokeWidth="1.5"
                  className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                >
                  <path d="M0 5h16M12 1l5 4-5 4" />
                </svg>
              </>
            )}
          </span>
        </button>
      ) : (
        /* Waitlist button when out of stock */
        <a
          href="mailto:hello@himrra.com?subject=Waitlist%20Request&body=I'd%20like%20to%20be%20notified%20when%20HIMRRA%20Pure%20Himalayan%20Shilajit%20is%20back%20in%20stock."
          className="group relative w-full overflow-hidden border border-[#1B3022]/20 py-5 text-[10px] font-outfit font-semibold uppercase tracking-[0.45em] text-[#1B3022]/50 hover:text-[#1B3022] hover:border-[#1B3022]/40 transition-all duration-500 flex items-center justify-center gap-3"
        >
          Notify Me When Available
          <svg width="14" height="8" viewBox="0 0 20 10" fill="none" stroke="currentColor" strokeWidth="1.5"
            className="group-hover:translate-x-1 transition-transform duration-400">
            <path d="M0 5h16M12 1l5 4-5 4" />
          </svg>
        </a>
      )}

      {/* ── Trust signals ── */}
      <div className="flex items-center justify-center gap-6 pt-1">
        {[
          { icon: '🔒', text: 'Secure Checkout' },
          { icon: '✈️', text: 'Free Shipping' },
          { icon: '↩', text: '30-Day Returns' },
        ].map((item) => (
          <span
            key={item.text}
            className="flex items-center gap-1.5 text-[9px] font-outfit uppercase tracking-[0.3em] text-[#1B3022]/30"
          >
            <span className="text-[11px]">{item.icon}</span>
            {item.text}
          </span>
        ))}
      </div>

      {/* ── Toast notification ── */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 z-[9999] flex items-center gap-3 px-5 py-4 shadow-2xl toast-enter ${
            toast.type === 'error'
              ? 'bg-[#1B3022] text-white'
              : 'bg-gold text-white'
          }`}
        >
          <span className="text-lg">{toast.type === 'error' ? '⚠' : '✓'}</span>
          <p className="text-[11px] font-outfit tracking-[0.2em]">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="ml-4 text-white/50 hover:text-white text-base leading-none transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* ── Cart Drawer ── */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        variantId={variantId}
        formattedPrice={formattedPrice}
        priceAmount={priceAmount}
        initialQty={qty}
      />
    </div>
  );
}
