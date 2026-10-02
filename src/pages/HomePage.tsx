import React, { useState } from 'react';
import { ArrowRight, Star, CheckCircle2, Truck, Shield, RefreshCw } from 'lucide-react';
import { Link } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import {
  STUDIO_IMAGES,
  VOLTERRA_TECHNOLOGIES,
} from '../data/volterraData';
import { ProductCard } from '../components/ProductCard';
import { ShoeVisual } from '../components/ShoeVisual';

export const HomePage: React.FC = () => {
  const { products, reviews, applyPromoCode } = useStore();
  const [activeTechIndex, setActiveTechIndex] = useState(0);

  const newArrivals = products.filter((p) => p.newArrival).slice(0, 8);
  const bestSellers = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 4);

  const featuredCategories = [
    {
      name: 'Running',
      subtitle: 'Road · Marathon · Daily · Trail',
      image: STUDIO_IMAGES.running,
      to: '/category/running',
      metric: '178g – 268g Range',
    },
    {
      name: 'Training',
      subtitle: 'Gym · Cross Training · Fitness',
      image: STUDIO_IMAGES.training,
      to: '/category/training',
      metric: '2mm – 6mm Stable Drop',
    },
    {
      name: 'Basketball',
      subtitle: 'Hardwood · Outdoor Court',
      image: STUDIO_IMAGES.basketball,
      to: '/category/basketball',
      metric: '360° Ankle Lockdown',
    },
    {
      name: 'Football',
      subtitle: 'Firm Ground · Futsal · Turf',
      image: STUDIO_IMAGES.training,
      to: '/category/football',
      metric: '3D ControlSkin Vamp',
    },
    {
      name: 'Outdoor',
      subtitle: 'Hiking · Mountain · Trail',
      image: STUDIO_IMAGES.trail,
      to: '/category/outdoor',
      metric: '4.5mm GRIPMAX™ Lugs',
    },
  ];

  const activeTech = VOLTERRA_TECHNOLOGIES[activeTechIndex];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#111113] text-white overflow-hidden border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-6 z-10">
            <div className="flex items-center gap-2 text-xs font-mono-num text-zinc-400">
              <span className="text-[#E1381C] font-semibold">VOLTERRA LABS</span>
              <span aria-hidden="true">·</span>
              <span>2026 PERFORMANCE SERIES</span>
              <span aria-hidden="true">·</span>
              <span>MALAYSIA OFFICIAL STORE</span>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.05] text-white"
              style={{ textWrap: 'balance' }}
            >
              MOVE. PERFORM. GO BEYOND.
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-xl leading-relaxed">
              Engineered for every stride, every training session and every challenge.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                to="/shop"
                className="px-7 py-3.5 rounded-lg bg-[#E1381C] hover:bg-[#c82d13] text-white text-xs font-semibold tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/new-arrivals"
                className="px-7 py-3.5 rounded-lg bg-white/10 hover:bg-white hover:text-[#111113] text-white border border-white/20 text-xs font-semibold tracking-wider transition-colors whitespace-nowrap"
              >
                EXPLORE COLLECTION
              </Link>
            </div>

            {/* Key Quantitative Proof Metrics */}
            <div className="pt-6 border-t border-zinc-800/90 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="font-mono-num text-xl sm:text-2xl font-bold text-white">
                  178g
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Featherweight Carbon Racer
                </p>
              </div>
              <div>
                <p className="font-mono-num text-xl sm:text-2xl font-bold text-white">
                  78%
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  AEROFOAM™ Energy Rebound
                </p>
              </div>
              <div>
                <p className="font-mono-num text-xl sm:text-2xl font-bold text-white">
                  20+
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  VOLTERRA Exclusive Models
                </p>
              </div>
            </div>
          </div>

          {/* Right Hero Studio Footwear Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#18181B]">
              <ShoeVisual
                src={STUDIO_IMAGES.hero}
                alt="VOLTERRA Carbon Racer Flagship Running Shoe"
                aspectClass="aspect-[16/10]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono-num text-[#E1381C] font-semibold">
                      FLAGSHIP SPOTLIGHT · VT-RUN-CBR
                    </p>
                    <p className="font-display text-xl font-bold text-white mt-0.5">
                      VOLTERRA Carbon Racer
                    </p>
                    <p className="text-xs text-zinc-300">
                      Spooned Carbon FLEXCORE™ Plate · AEROFOAM™ Pro · RM549
                    </p>
                  </div>
                  <Link
                    to="/product/vr019"
                    className="px-4 py-2 rounded bg-white text-[#111113] hover:bg-[#E1381C] hover:text-white text-xs font-semibold transition-colors whitespace-nowrap self-start sm:self-auto"
                  >
                    VIEW FLAGSHIP
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Trust Strip */}
        <div className="bg-zinc-950/90 border-t border-zinc-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#E1381C] shrink-0" />
              <span>Free Standard Shipping Across Malaysia Over RM200</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#E1381C] shrink-0" />
              <span>30-Day Performance Trial & Free Size Exchange</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E1381C] shrink-0" />
              <span>100% Official Direct-From-VOLTERRA Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PERFORMANCE (CATEGORIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
              BY DISCIPLINE
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111113] mt-1">
              FEATURED PERFORMANCE
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#111113] hover:text-[#E1381C] flex items-center gap-1.5"
          >
            <span>VIEW ALL 6 CATEGORIES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {featuredCategories.map((cat) => (
            <div
              key={cat.name}
              className="group relative rounded-xl overflow-hidden bg-[#111113] border border-zinc-200/80 flex flex-col justify-between min-h-[290px]"
            >
              <ShoeVisual
                src={cat.image}
                alt={`VOLTERRA ${cat.name} Footwear`}
                aspectClass="aspect-[4/3]"
                className="opacity-85 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-5 flex flex-col justify-end">
                <p className="font-mono-num text-[11px] text-zinc-300">
                  {cat.metric}
                </p>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5 mb-4">
                  {cat.subtitle}
                </p>
                <Link
                  to={cat.to}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded bg-white text-[#111113] group-hover:bg-[#E1381C] group-hover:text-white text-xs font-semibold transition-colors w-full whitespace-nowrap"
                >
                  <span>EXPLORE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
              JUST LANDED
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111113] mt-1">
              NEW ARRIVALS
            </h2>
          </div>
          <Link
            to="/new-arrivals"
            className="text-xs font-semibold text-[#111113] hover:text-[#E1381C] flex items-center gap-1.5"
          >
            <span>EXPLORE ALL NEW ARRIVALS ({newArrivals.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS */}
      <section className="bg-white border-y border-zinc-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
                MOST PROVEN BY ATHLETES
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111113] mt-1">
                BEST SELLERS
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Ranked by verified VOLTERRA athlete purchases across Malaysia.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold text-[#111113] hover:text-[#E1381C] flex items-center gap-1.5"
            >
              <span>SHOP FULL CATALOG</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                rankBadge={index + 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PERFORMANCE TECHNOLOGY (ENGINEERED FOR PERFORMANCE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#111113] text-white rounded-2xl p-6 sm:p-12 border border-zinc-800">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
              PROPRIETARY FOOTWEAR ARCHITECTURE
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mt-1">
              ENGINEERED FOR PERFORMANCE
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Every VOLTERRA silhouette is built from the ground up in our biomechanics lab using five core footwear systems.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Technology Selector Buttons */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              {VOLTERRA_TECHNOLOGIES.map((tech, idx) => {
                const isSelected = idx === activeTechIndex;
                return (
                  <button
                    key={tech.name}
                    type="button"
                    onClick={() => setActiveTechIndex(idx)}
                    className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 border-[#E1381C] text-white'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-base font-bold">
                        0{idx + 1}. {tech.name}
                      </span>
                      <span className="font-mono-num text-xs text-[#E1381C]">
                        {tech.metric}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{tech.tagline}</p>
                  </button>
                );
              })}
            </div>

            {/* Active Tech Detail Card */}
            <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <ShoeVisual
                  src={
                    activeTechIndex % 2 === 0
                      ? STUDIO_IMAGES.hero
                      : STUDIO_IMAGES.running
                  }
                  alt={activeTech.name}
                  angle="detail"
                  aspectClass="aspect-[4/3]"
                  className="rounded-lg border border-zinc-700"
                />
                <div className="space-y-3">
                  <p className="font-mono-num text-xs text-[#E1381C] font-semibold">
                    SYSTEM SPECIFICATION · {activeTech.metric}
                  </p>
                  <h3 className="font-display text-2xl font-bold text-white">
                    {activeTech.name}
                  </h3>
                  <p className="text-xs font-semibold text-zinc-300">
                    {activeTech.tagline}
                  </p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {activeTech.description}
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#E1381C] transition-colors"
                    >
                      <span>Explore shoes with {activeTech.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BRAND STORY (BUILT TO MOVE) & SHOP BY SPORT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-5 bg-white p-8 sm:p-10 rounded-2xl border border-zinc-200/80">
          <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
            THE VOLTERRA MANIFESTO
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111113]">
            BUILT TO MOVE
          </h2>
          <blockquote className="text-base sm:text-lg font-medium text-zinc-800 leading-relaxed border-l-2 border-[#E1381C] pl-4">
            “VOLTERRA was created for people who refuse to stand still. From everyday training to high-performance competition, every shoe is designed around movement, comfort and confidence.”
          </blockquote>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Unlike generic multi-brand marketplaces, VOLTERRA designs, tests, and ships our own footwear directly to athletes. Every gram of foam, millimeter of heel drop, and outsole lug pattern is calibrated for real performance.
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            {[
              { label: 'Road & Marathon', to: '/category/running' },
              { label: 'Trail & Ultra', to: '/category/outdoor' },
              { label: 'Strength & HIIT', to: '/category/training' },
              { label: 'Hardwood Court', to: '/category/basketball' },
              { label: 'Pitch & Futsal', to: '/category/football' },
              { label: 'Recovery & Lifestyle', to: '/category/lifestyle' },
            ].map((sport) => (
              <Link
                key={sport.label}
                to={sport.to}
                className="px-3.5 py-2 rounded-lg bg-[#F9F9F8] hover:bg-[#111113] hover:text-white border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors"
              >
                {sport.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 7. PROMOTION / SALE SPOTLIGHT */}
        <div className="lg:col-span-6 bg-[#111113] text-white p-8 sm:p-10 rounded-2xl border border-zinc-800 flex flex-col justify-between space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
              SEASONAL PERFORMANCE EVENT · DEMO PROMO CODES
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">
              UP TO 20% OFF SELECTED VOLTERRA GEAR
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Upgrade your rotation today. Click any demo promo code below to activate instant cart savings at checkout:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { code: 'VOLT10', label: '10% OFF Storewide' },
              { code: 'WELCOME15', label: '15% OFF First Order' },
              { code: 'SPORT20', label: '20% OFF Seasonal' },
            ].map((promo) => (
              <button
                key={promo.code}
                type="button"
                onClick={() => applyPromoCode(promo.code)}
                className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left transition-colors cursor-pointer group"
              >
                <p className="font-mono-num text-sm font-bold text-[#E1381C] group-hover:underline">
                  {promo.code}
                </p>
                <p className="text-xs text-zinc-300 mt-0.5">{promo.label}</p>
                <p className="text-[10px] text-zinc-500 mt-1">Click to apply (Demo)</p>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800">
            <span className="text-xs text-zinc-400">
              Plus Free Standard Shipping on Malaysia orders above RM200.
            </span>
            <Link
              to="/sale"
              className="px-5 py-2.5 rounded-lg bg-[#E1381C] hover:bg-[#c82d13] text-white text-xs font-semibold tracking-wider transition-colors whitespace-nowrap"
            >
              SHOP SALE COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
              VERIFIED MALAYSIAN ATHLETES
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111113] mt-1">
              TESTED ON ROADS, COURTS & TRAILS
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => {
            const product = products.find((p) => p.id === rev.productId);
            return (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-xl border border-zinc-200/80 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Buyer
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#111113]">{rev.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 text-xs text-zinc-500 space-y-1">
                  <p className="font-semibold text-[#111113]">{rev.authorName}</p>
                  <p>
                    Size: {rev.sizePurchased} · Colour: {rev.colorPurchased} · Fit:{' '}
                    <span className="font-medium text-zinc-800">{rev.fit}</span>
                  </p>
                  {product && (
                    <Link
                      to={`/product/${product.id}`}
                      className="inline-block text-[#E1381C] font-semibold hover:underline pt-1"
                    >
                      {product.name} →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
