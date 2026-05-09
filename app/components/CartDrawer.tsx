'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { createCartAction, updateCartBuyerIdentityAction } from '@/lib/actions';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  variantId: string;
  formattedPrice: string;
  priceAmount: number;
  initialQty?: number;
}

export default function CartDrawer({
  isOpen,
  onClose,
  variantId,
  formattedPrice,
  priceAmount,
  initialQty = 1,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'address' | 'submitting'>('cart');
  const [qty, setQty] = useState(initialQty);
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'IN',
    phone: '',
  });

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('cart');
      setQty(initialQty);
      setErrorMsg('');
    }
  }, [isOpen, initialQty]);

  // Handle outside click or escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCheckoutClick = () => {
    setStep('address');
  };

  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('submitting');
    setErrorMsg('');

    try {
      // 1. Create Cart with Quantity
      const cart = await createCartAction(variantId, qty);
      
      if (!cart || !cart.id) {
        throw new Error('Failed to create cart. Please try again.');
      }

      // Format phone number to include country code if missing
      const countryPhoneCodes: Record<string, string> = {
        IN: '+91',
        US: '+1',
        GB: '+44',
        CA: '+1',
        AU: '+61',
      };
      
      let formattedPhone = formData.phone.trim();
      if (formattedPhone && !formattedPhone.startsWith('+')) {
        const prefix = countryPhoneCodes[formData.country] || '';
        // Remove leading zero if user typed it (common in some countries)
        formattedPhone = `${prefix}${formattedPhone.replace(/^0+/, '')}`;
      }

      // 2. Prepare Buyer Identity payload
      const buyerIdentity = {
        email: formData.email,
        phone: formattedPhone,
        deliveryAddressPreferences: [
          {
            deliveryAddress: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address1: formData.address1,
              address2: formData.address2,
              city: formData.city,
              province: formData.province,
              zip: formData.zip,
              country: formData.country,
              phone: formattedPhone,
            }
          }
        ]
      };

      // 3. Attach Address to Cart
      const updatedCart = await updateCartBuyerIdentityAction(cart.id, buyerIdentity);

      if (updatedCart?.checkoutUrl) {
        // 4. Redirect to Shopify Checkout
        window.location.href = updatedCart.checkoutUrl;
      } else {
        throw new Error('Failed to apply address to checkout.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during checkout.');
      setStep('address');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Format the subtotal
  const subtotalFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(priceAmount * qty);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#F9F7F2] z-[101] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1B3022]/10 bg-white">
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-[#1B3022] font-outfit font-medium">
            {step === 'cart' ? 'Curated Selection' : 'Shipping Details'}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#1B3022]/50 hover:text-[#1B3022] hover:bg-[#1B3022]/5 rounded-full transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          
          {/* --- STEP 1: CART SUMMARY --- */}
          {step === 'cart' && (
            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Product Card */}
              <div className="flex gap-6">
                <div className="relative w-24 h-32 bg-[#0F1C14] flex-shrink-0">
                  <Image 
                    src="/images/product_resin_v2.png" 
                    alt="HIMRRA Pure Resin" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-xl font-serif text-[#1B3022] leading-tight">Himalayan<br/>Pure Resin</h3>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#1B3022]/50 font-outfit mt-2">15g (30-day supply)</p>
                  </div>
                  <p className="text-lg font-serif text-[#1B3022]">{formattedPrice}</p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between border-t border-b border-[#1B3022]/10 py-5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#1B3022]/50 font-outfit">Quantity</span>
                <div className="flex items-center border border-[#1B3022]/20">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#1B3022]/60 hover:bg-[#1B3022]/5"
                  >−</button>
                  <span className="w-10 text-center text-sm font-outfit font-medium text-[#1B3022]">{qty}</span>
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#1B3022]/60 hover:bg-[#1B3022]/5"
                  >+</button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#1B3022]/80 font-outfit font-medium">Subtotal</span>
                <span className="text-2xl font-serif text-[#1B3022]">{subtotalFormatted}</span>
              </div>
              <p className="text-xs text-[#1B3022]/50 font-light text-right">Shipping calculated at next step.</p>
            </div>
          )}

          {/* --- STEP 2: ADDRESS FORM --- */}
          {(step === 'address' || step === 'submitting') && (
            <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-500">
              
              {/* Back to Cart */}
              {step !== 'submitting' && (
                <button 
                  onClick={() => setStep('cart')}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#1B3022]/50 hover:text-[#1B3022] font-outfit mb-8 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Cart
                </button>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-light">
                  {errorMsg}
                </div>
              )}

              <form id="address-form" onSubmit={handleSubmitAddress} className="space-y-5">
                
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#1B3022]/80 font-outfit font-medium border-b border-[#1B3022]/10 pb-2">Contact</h4>
                  <input required type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full bg-white border border-[#1B3022]/20 px-4 py-3 text-sm font-light text-[#1B3022] placeholder-[#1B3022]/40 focus:outline-none focus:border-[#1B3022]" />
                  <input required type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full bg-white border border-[#1B3022]/20 px-4 py-3 text-sm font-light text-[#1B3022] placeholder-[#1B3022]/40 focus:outline-none focus:border-[#1B3022]" />
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#1B3022]/80 font-outfit font-medium border-b border-[#1B3022]/10 pb-2">Shipping Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="w-full bg-white border border-[#1B3022]/20 px-4 py-3 text-sm font-light text-[#1B3022] placeholder-[#1B3022]/40 focus:outline-none focus:border-[#1B3022]" />
                    <input required type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full bg-white border border-[#1B3022]/20 px-4 py-3 text-sm font-light text-[#1B3022] placeholder-[#1B3022]/40 focus:outline-none focus:border-[#1B3022]" />
                  </div>
                  
                  <input required type="text" name="address1" placeholder="Street Address" value={formData.address1} onChange={handleInputChange} className="w-full bg-white border border-[#1B3022]/20 px-4 py-3 text-sm font-light text-[#1B3022] placeholder-[#1B3022]/40 focus:outline-none focus:border-[#1B3022]" />
                  <input type="text" name="address2" placeholder="Apartment, suite, etc. (optional)" value={formData.address2} onChange={handleInputChange} className="w-full bg-white border border-[#1B3022]/20 px-4 py-3 text-sm font-light text-[#1B3022] placeholder-[#1B3022]/40 focus:outline-none focus:border-[#1B3022]" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="w-full bg-white border border-[#1B3022]/20 px-4 py-3 text-sm font-light text-[#1B3022] placeholder-[#1B3022]/40 focus:outline-none focus:border-[#1B3022]" />
                    <input required type="text" name="province" placeholder="State / Province" value={formData.province} onChange={handleInputChange} className="w-full bg-white border border-[#1B3022]/20 px-4 py-3 text-sm font-light text-[#1B3022] placeholder-[#1B3022]/40 focus:outline-none focus:border-[#1B3022]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" name="zip" placeholder="ZIP / Postal Code" value={formData.zip} onChange={handleInputChange} className="w-full bg-white border border-[#1B3022]/20 px-4 py-3 text-sm font-light text-[#1B3022] placeholder-[#1B3022]/40 focus:outline-none focus:border-[#1B3022]" />
                    <select required name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-white border border-[#1B3022]/20 px-4 py-3 text-sm font-light text-[#1B3022] focus:outline-none focus:border-[#1B3022] appearance-none rounded-none">
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>

              </form>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-white border-t border-[#1B3022]/10 mt-auto">
          {step === 'cart' && (
            <button 
              onClick={handleCheckoutClick}
              className="w-full bg-[#1B3022] py-4 text-[10px] font-outfit font-medium uppercase tracking-[0.25em] text-[#F9F7F2] hover:bg-[#25422f] transition-colors"
            >
              Finalize Details — {subtotalFormatted}
            </button>
          )}

          {(step === 'address' || step === 'submitting') && (
            <button 
              type="submit"
              form="address-form"
              disabled={step === 'submitting'}
              className={`w-full bg-[#1B3022] py-4 text-[10px] font-outfit font-medium uppercase tracking-[0.25em] text-[#F9F7F2] transition-colors flex items-center justify-center gap-3 ${
                step === 'submitting' ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#25422f]'
              }`}
            >
              {step === 'submitting' ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          )}

          <div className="flex items-center justify-center gap-6 pt-5">
            {[
              { icon: '🔒', text: 'Secure' },
              { icon: '✈️', text: 'Fast Delivery' },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-1.5 text-[9px] font-outfit uppercase tracking-[0.2em] text-[#1B3022]/40">
                <span className="text-[11px]">{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>

      </div>
    </>,
    document.body
  );
}
