import { shopifyFetch } from '@/lib/shopify';
import Image from 'next/image';
import ProductGallery from './components/ProductGallery';
import HeroCarousel from './components/HeroCarousel';
import BuyButton from './components/BuyButton';
import NavBar from './components/NavBar';

export default async function HomePage() {
  const data = await shopifyFetch({
    query: `{
      products(first: 1) {
        edges {
          node {
            id
            title
            description
            handle
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                  quantityAvailable
                }
              }
            }
          }
        }
      }
    }`
  });

  const product = data?.products?.edges[0]?.node;
  const variant = product?.variants?.edges[0]?.node;
  const variantId = variant?.id;
  const availableForSale = product?.availableForSale && variant?.availableForSale;

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F1C14] text-white">
        <p className="text-base font-serif italic tracking-widest opacity-60">HIMRRA</p>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
    maximumFractionDigits: 0
  }).format(product.priceRange.minVariantPrice.amount);

  const galleryImages = [
    '/images/product_resin_v2.png',
    '/images/product_angle_v2.png',
    '/images/product_texture_v2.png',
    '/images/himalayan_origin.jpg'
  ];

  const certifications = [
    'Lab Tested · Purity Verified',
    '85+ Ionic Trace Minerals',
    'Cold-Filtered · 60 Days',
    'Sustainably Harvested',
    'Heavy Metal Screened',
    'No Heat · No Chemicals',
    'High-Altitude Origin · 18,000 FT',
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1B3022] antialiased overflow-hidden">

      {/* ── Navigation ── */}
      <NavBar />

      {/* ── Hero ── */}
      <HeroCarousel />

      {/* ── Certification / Trust Bar ── */}
      <div className="bg-[#0F1C14] border-b border-white/5 py-5 md:py-6 relative z-10">
        <div className="container mx-auto px-6 md:px-12 flex flex-wrap justify-center gap-6 md:gap-12 lg:gap-16">
          {[
            'Lab Tested',
            'Sustainably Harvested',
            'No Heat Extraction',
            '18,000 FT Origin',
          ].map((cert, i) => (
            <span
              key={i}
              className="flex items-center gap-3 text-[10px] md:text-[11px] font-outfit uppercase tracking-[0.2em] text-white/60"
            >
              <span className="w-1 h-1 rounded-full bg-gold/50 flex-shrink-0" />
              {cert}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats Section — Editorial Layout ── */}
      <section id="benefits" className="py-24 md:py-32 lg:py-40 bg-[#0F1C14] text-[#F9F7F2] relative">
        <div className="mx-auto max-w-[90rem] px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24 items-start">
            
            {/* Header Column */}
            <div className="sticky top-32">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold/80 font-outfit font-medium mb-6">
                Uncompromising Quality
              </p>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif font-light leading-[1] tracking-[-0.01em] mb-8">
                Sourced from the<br />
                <em className="text-white/60 not-italic">High Himalayas</em>
              </h2>
              <p className="text-base text-white/70 font-light leading-relaxed max-w-sm">
                Authentic Shilajit requires specific geological conditions to form. We source ours exclusively from pristine, high-altitude environments where mineral density is highest.
              </p>
            </div>

            {/* Stats Column */}
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16 border-t border-white/10 pt-12 lg:border-t-0 lg:pt-0">
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold/60 font-outfit font-medium">Altitude</p>
                <p className="text-[clamp(3rem,6vw,5rem)] font-serif font-light leading-none tracking-[-0.02em]">
                  18,000<span className="text-2xl ml-2 text-white/40">FT</span>
                </p>
                <p className="text-sm text-white/60 font-light leading-relaxed max-w-[240px]">
                  Harvested at elevations where atmospheric purity preserves the resin's integrity.
                </p>
              </div>

              <div className="space-y-4 pt-0 sm:pt-16">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold/60 font-outfit font-medium">Filtration</p>
                <p className="text-[clamp(3rem,6vw,5rem)] font-serif font-light leading-none tracking-[-0.02em]">
                  60<span className="text-2xl ml-2 text-white/40">Days</span>
                </p>
                <p className="text-sm text-white/60 font-light leading-relaxed max-w-[240px]">
                  A slow, cold-water purification process that uses no heat or chemical solvents.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold/60 font-outfit font-medium">Bio-Activity</p>
                <p className="text-[clamp(3rem,6vw,5rem)] font-serif font-light leading-none tracking-[-0.02em]">
                  75%<span className="text-2xl ml-2 text-white/40">+</span>
                </p>
                <p className="text-sm text-white/60 font-light leading-relaxed max-w-[240px]">
                  High fulvic acid content, the essential carrier molecule for nutrient absorption.
                </p>
              </div>

              <div className="space-y-4 pt-0 sm:pt-16">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold/60 font-outfit font-medium">Composition</p>
                <p className="text-[clamp(3rem,6vw,5rem)] font-serif font-light leading-none tracking-[-0.02em]">
                  85<span className="text-2xl ml-2 text-white/40">+</span>
                </p>
                <p className="text-sm text-white/60 font-light leading-relaxed max-w-[240px]">
                  Naturally occurring ionic trace minerals in their most bioavailable state.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── Product Section ── */}
      <section id="collection" className="py-24 md:py-32 lg:py-40 bg-[#F9F7F2]">
        <div className="container mx-auto px-6 lg:px-16 max-w-[90rem]">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 md:gap-20">
            
            {/* Gallery — Left Side (More traditional e-commerce flow) */}
            <div className="w-full lg:w-1/2 reveal-up">
              <ProductGallery images={galleryImages} />
            </div>

            {/* Product info — Right Side */}
            <div className="w-full lg:w-5/12 space-y-10 reveal-up" style={{ animationDelay: '0.15s' }}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#1B3022]/60 font-outfit font-medium mb-4">
                  Signature Selection
                </p>
                <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-serif font-light leading-[1] tracking-[-0.01em] text-[#1B3022]">
                  Pure Himalayan<br />
                  <em className="not-italic text-[#1B3022]/60">Shilajit Resin</em>
                </h2>
              </div>

              <p className="text-base text-[#1B3022]/70 font-light leading-relaxed">
                Our flagship product. 100% pure Himalayan Shilajit resin, sustainably sourced and meticulously cold-filtered to preserve its complex mineral profile.
              </p>

              {/* Spec row */}
              <div className="grid grid-cols-2 gap-8 py-6 border-y border-[#1B3022]/10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#1B3022]/40 font-outfit font-medium mb-1.5">
                    Source
                  </p>
                  <p className="text-sm text-[#1B3022]/80 font-medium">Himalayas, 18,000ft</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#1B3022]/40 font-outfit font-medium mb-1.5">
                    Purity
                  </p>
                  <p className="text-sm text-[#1B3022]/80 font-medium">Lab Verified</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#1B3022]/40 font-outfit font-medium mb-1.5">
                    Size
                  </p>
                  <p className="text-sm text-[#1B3022]/80 font-medium">15g (30-day supply)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#1B3022]/40 font-outfit font-medium mb-1.5">
                    Ingredients
                  </p>
                  <p className="text-sm text-[#1B3022]/80 font-medium">100% Pure Resin</p>
                </div>
              </div>

              <BuyButton variantId={variantId} formattedPrice={formattedPrice} priceAmount={product.priceRange.minVariantPrice.amount} availableForSale={availableForSale} />
            </div>

          </div>
        </div>
      </section>

      {/* ── Origin Story ── */}
      <section id="story" className="py-24 md:py-32 lg:py-40 bg-white relative">
        <div className="mx-auto max-w-[90rem] px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-center">
            
            {/* Text — Left */}
            <div className="space-y-8 md:space-y-10 order-2 lg:order-1 reveal-up">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#1B3022]/50 font-outfit font-medium">
                Our Heritage
              </p>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif font-light leading-[1] tracking-[-0.01em] text-[#1B3022]">
                Sourced from the<br />
                <em className="text-[#1B3022]/60 not-italic">Summit</em>
              </h2>
              <div className="space-y-6 text-base text-[#1B3022]/70 font-light leading-relaxed max-w-lg">
                <p>
                  Shilajit is a natural exudate formed over centuries by the slow decomposition of botanical material. Our resin is sourced directly from the highest points of the Himalayas, where the environment is untainted by modern pollutants.
                </p>
                <p>
                  We partner directly with local high-altitude harvesting communities to ensure ethical sourcing practices and to maintain the absolute highest standard of purity from mountain to jar.
                </p>
              </div>
            </div>

            {/* Image — Right */}
            <div className="relative order-1 lg:order-2 reveal-up lg:-ml-12" style={{ animationDelay: '0.1s' }}>
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none lg:w-[90%] lg:ml-auto">
                <Image
                  src="/images/himalayan_origin.jpg"
                  alt="Himalayan origin of HIMRRA"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Ritual Section ── */}
      <section id="ritual" className="py-24 md:py-32 lg:py-40 bg-[#F9F7F2] border-t border-[#1B3022]/5">
        <div className="mx-auto max-w-[90rem] px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
            
            {/* Header */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#1B3022]/50 font-outfit font-medium mb-6">
                Usage Instructions
              </p>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif font-light leading-[1] tracking-[-0.01em] text-[#1B3022]">
                How to use<br />
                <em className="not-italic text-[#1B3022]/60">HIMRRA</em>
              </h2>
            </div>

            {/* Steps */}
            <div className="grid sm:grid-cols-3 gap-12 lg:gap-16 pt-2">
              {[
                {
                  title: 'Measure',
                  desc: 'Take a pea-sized amount of resin using the provided measuring spoon.',
                },
                {
                  title: 'Dissolve',
                  desc: 'Stir the resin into warm water, milk, or your favorite morning tea until fully dissolved.',
                },
                {
                  title: 'Consume',
                  desc: 'Drink daily, ideally on an empty stomach in the morning for optimal absorption.',
                },
              ].map((step, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="w-8 h-8 rounded-full border border-[#1B3022]/20 flex items-center justify-center text-[11px] font-outfit font-medium text-[#1B3022]/60 mb-6">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-light tracking-tight text-[#1B3022]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#1B3022]/70 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0F1C14] text-[#F9F7F2] pt-20 md:pt-24 pb-12">
        <div className="mx-auto max-w-[90rem] px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16 mb-20">
            <div className="col-span-2 md:col-span-1">
              <Image src="/images/logo.png" alt="HIMRRA" width={140} height={40} className="brightness-0 invert mb-6" />
              <p className="text-sm text-white/50 font-light leading-relaxed max-w-xs">
                Premium Himalayan Shilajit, sustainably sourced and verified for purity.
              </p>
            </div>
            
            <div>
              <h5 className="text-[10px] uppercase tracking-[0.25em] text-white/90 font-outfit font-medium mb-6">Shop</h5>
              <ul className="space-y-4">
                <li><a href="#collection" className="text-sm text-white/50 hover:text-white transition-colors">Pure Resin</a></li>
                <li><a href="#story" className="text-sm text-white/50 hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#benefits" className="text-sm text-white/50 hover:text-white transition-colors">Quality Standards</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] uppercase tracking-[0.25em] text-white/90 font-outfit font-medium mb-6">Support</h5>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-white/50 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="mailto:hello@himrra.com" className="text-sm text-white/50 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] uppercase tracking-[0.25em] text-white/90 font-outfit font-medium mb-6">Legal</h5>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40 font-light">
              © {new Date().getFullYear()} HIMRRA. All rights reserved.
            </p>
            <p className="text-xs text-white/30 font-light">
              *These statements have not been evaluated by the FSSAI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
