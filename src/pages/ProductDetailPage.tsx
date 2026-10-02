import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Ruler,
  CheckCircle2,
  Truck,
  RefreshCw,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { Link, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { ShoeColorName, EUSize, FitFeedback } from '../types';
import { ALL_EU_SIZES, VOLTERRA_TECHNOLOGIES } from '../data/volterraData';
import { ShoeVisual } from '../components/ShoeVisual';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  productId: string;
  onBuyNow: (item: {
    productId: string;
    color: ShoeColorName;
    size: EUSize;
    quantity: number;
  }) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBuyNow,
}) => {
  const {
    products,
    reviews,
    wishlist,
    recentlyViewed,
    toggleWishlist,
    addToCart,
    addRecentlyViewed,
    addReview,
    setIsSizeGuideOpen,
  } = useStore();
  const { navigate } = useRouter();

  const product = products.find((p) => p.id === productId);

  const [activeAngle, setActiveAngle] = useState<'main' | 'side' | 'top' | 'detail'>('main');
  const [selectedColor, setSelectedColor] = useState<ShoeColorName>('White');
  const [selectedSize, setSelectedSize] = useState<EUSize>('EU 42');
  const [quantity, setQuantity] = useState<number>(1);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revAuthor, setRevAuthor] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revSize, setRevSize] = useState<EUSize>('EU 42');
  const [revFit, setRevFit] = useState<FitFeedback>('True to Size');

  useEffect(() => {
    if (product) {
      setActiveAngle('main');
      setSelectedColor(product.colors[0]?.name || 'White');
      const firstInStockSize =
        product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0]?.size || 'EU 42';
      setSelectedSize(firstInStockSize);
      setQuantity(1);
      addRecentlyViewed(product.id);
    }
  }, [product?.id, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-[#111113]">
          Something went wrong. Please try again.
        </h1>
        <p className="text-sm text-zinc-600">
          The requested VOLTERRA footwear model ({productId}) could not be found.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="px-6 py-2.5 rounded-lg bg-[#111113] text-white text-xs font-semibold hover:bg-[#E1381C] transition-colors"
          >
            TRY AGAIN · BACK TO SHOP
          </button>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const activeColorVariant =
    product.colors.find((c) => c.name === selectedColor) || product.colors[0];
  const activeSizeObj = product.sizes.find((s) => s.size === selectedSize);
  const sizeStock = activeSizeObj ? activeSizeObj.stock : 0;
  // Combine colour variant stock and size stock for realistic dynamic stock feedback
  const effectiveStock =
    sizeStock === 0
      ? 0
      : Math.min(sizeStock, activeColorVariant?.stock || sizeStock);

  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Recommendations ("YOU MAY ALSO LIKE") - Strictly VOLTERRA only
  const recommendedProducts = useMemo(() => {
    return products
      .filter((p) => p.id !== product.id)
      .sort((a, b) => {
        const aScore =
          (a.category === product.category ? 3 : 0) +
          (a.gender === product.gender ? 1 : 0) +
          (Math.abs(a.price - product.price) <= 80 ? 1 : 0);
        const bScore =
          (b.category === product.category ? 3 : 0) +
          (b.gender === product.gender ? 1 : 0) +
          (Math.abs(b.price - product.price) <= 80 ? 1 : 0);
        return bScore - aScore;
      })
      .slice(0, 4);
  }, [products, product]);

  // Recently Viewed products (excluding current)
  const recentProducts = useMemo(() => {
    return recentlyViewed
      .filter((id) => id !== product.id)
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .slice(0, 4);
  }, [recentlyViewed, products, product.id]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthor.trim() || !revTitle.trim() || !revComment.trim()) return;
    addReview({
      productId: product.id,
      authorName: revAuthor.trim(),
      rating: revRating,
      title: revTitle.trim(),
      comment: revComment.trim(),
      sizePurchased: revSize,
      colorPurchased: selectedColor,
      fit: revFit,
    });
    setRevAuthor('');
    setRevTitle('');
    setRevComment('');
    setShowReviewForm(false);
  };

  const angleThumbnails: { key: 'main' | 'side' | 'top' | 'detail'; label: string; src: string }[] = [
    { key: 'main', label: 'Main View', src: product.images.main },
    { key: 'side', label: 'Side Profile', src: product.images.side },
    { key: 'top', label: 'Top View', src: product.images.top },
    { key: 'detail', label: 'Outsole & Foam', src: product.images.detail },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-[#111113]">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#111113]">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/category/${product.category.toLowerCase()}`}
            className="hover:text-[#111113]"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#111113] font-semibold">{product.name}</span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-1.5 font-semibold text-zinc-700 hover:text-[#111113]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>
      </nav>

      {/* Main Product Section: Sticky Gallery Left + Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: 4-Angle Studio Gallery */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-20">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-200/80 bg-white">
            <ShoeVisual
              src={product.images[activeAngle]}
              alt={`${product.name} - ${selectedColor} (${activeAngle} view)`}
              color={selectedColor}
              angle={activeAngle}
              aspectClass="aspect-[4/3]"
              showAngleTag
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-[#E1381C] text-white font-mono-num text-xs font-semibold">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* 4-Angle Selector Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {angleThumbnails.map((thumb) => {
              const isCurrent = activeAngle === thumb.key;
              return (
                <button
                  key={thumb.key}
                  type="button"
                  onClick={() => setActiveAngle(thumb.key)}
                  className={`group rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-[#E1381C] ring-2 ring-[#E1381C]/20'
                      : 'border-zinc-200/80 hover:border-zinc-400'
                  }`}
                >
                  <ShoeVisual
                    src={thumb.src}
                    alt={`${product.name} ${thumb.label}`}
                    color={selectedColor}
                    angle={thumb.key}
                    aspectClass="aspect-[4/3]"
                  />
                  <div className="px-2.5 py-1.5 bg-white text-[11px] font-medium text-zinc-700 truncate">
                    {thumb.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 space-y-6">
          {/* Header Metadata */}
          <div className="space-y-2 border-b border-zinc-100 pb-5">
            <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#111113] tracking-wider">
                  {product.brand}
                </span>
                <span>·</span>
                <span>{product.category}</span>
                <span>·</span>
                <span>{product.subcategory}</span>
                <span>·</span>
                <span>{product.gender}</span>
              </div>
              <span className="font-mono-num text-zinc-400">{product.sku}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111113]">
              {product.name}
            </h1>

            {/* Rating & Sales Proof */}
            <div className="flex items-center gap-3 text-xs pt-1">
              <div className="flex items-center gap-1 font-mono-num font-semibold text-[#111113]">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <a
                href="#reviews-section"
                className="text-zinc-500 hover:text-[#111113] underline"
              >
                {product.reviewCount} Reviews
              </a>
              <span className="text-zinc-300">·</span>
              <span className="font-mono-num text-zinc-500">
                {product.salesCount} Athlete Pairs Sold
              </span>
            </div>

            {/* Pricing */}
            <div className="pt-3 flex items-baseline gap-3 font-mono-num">
              <span className="text-2xl sm:text-3xl font-bold text-[#111113]">
                RM{product.price}
              </span>
              {product.discount > 0 && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-zinc-400 line-through">
                    RM{product.originalPrice}
                  </span>
                  <span className="text-xs font-semibold text-[#E1381C]">
                    SAVE RM{product.originalPrice - product.price} ({product.discount}% OFF)
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 1. COLOUR SELECTOR */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#111113]">
                Selected Colour:{' '}
                <span className="font-normal text-zinc-600">
                  {activeColorVariant?.name} ({activeColorVariant?.label})
                </span>
              </span>
              <span className="font-mono-num text-zinc-500">
                {activeColorVariant?.stock} colourway units
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {product.colors.map((col) => {
                const isSelected = selectedColor === col.name;
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    aria-label={`Select colour ${col.name}`}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#111113] bg-zinc-900 text-white font-semibold shadow-xs'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-zinc-300 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SIZE SELECTOR */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#111113]">
                Select Size:{' '}
                <span className="font-mono-num font-normal text-zinc-600">
                  {selectedSize}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="inline-flex items-center gap-1 font-semibold text-[#E1381C] hover:underline cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>SIZE GUIDE</span>
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 font-mono-num">
              {product.sizes.map((sz) => {
                const isOut = sz.stock === 0;
                const isSelected = selectedSize === sz.size;
                return (
                  <button
                    key={sz.size}
                    type="button"
                    disabled={isOut}
                    onClick={() => setSelectedSize(sz.size)}
                    className={`py-2.5 px-2 rounded-lg border text-xs flex flex-col items-center justify-center transition-colors ${
                      isOut
                        ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed opacity-70'
                        : isSelected
                        ? 'bg-[#111113] border-[#111113] text-white font-semibold cursor-pointer'
                        : 'bg-white border-zinc-200 text-[#111113] hover:border-[#111113] cursor-pointer'
                    }`}
                  >
                    <span className={isOut ? 'line-through' : ''}>{sz.size}</span>
                    {isOut ? (
                      <span className="text-[9px] text-zinc-400 font-sans">
                        Out of Stock
                      </span>
                    ) : sz.stock <= 5 ? (
                      <span
                        className={`text-[9px] font-sans ${
                          isSelected ? 'text-amber-300' : 'text-amber-600'
                        }`}
                      >
                        {sz.stock} left
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. STOCK STATUS & QUANTITY */}
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#F9F9F8] border border-zinc-200/80 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  effectiveStock === 0
                    ? 'bg-red-500'
                    : effectiveStock <= 5
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <span className="font-semibold text-[#111113]">
                {effectiveStock === 0
                  ? 'Out of Stock for this size'
                  : effectiveStock <= 5
                  ? `Low Stock — Only ${effectiveStock} pairs remaining`
                  : `In Stock (${effectiveStock} pairs ready to ship)`}
              </span>
            </div>

            {effectiveStock > 0 && (
              <div className="flex items-center gap-2 font-mono-num">
                <label htmlFor="pdp-qty" className="text-zinc-500 font-sans">
                  Qty:
                </label>
                <select
                  id="pdp-qty"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="px-2 py-1 rounded border border-zinc-300 bg-white text-xs font-semibold"
                >
                  {Array.from({ length: Math.min(5, effectiveStock) }).map(
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}
          </div>

          {/* 4. PRIMARY ACTIONS: ADD TO CART, BUY NOW, WISHLIST */}
          <div className="space-y-2.5 pt-1">
            <div className="flex gap-2.5">
              <button
                type="button"
                disabled={effectiveStock === 0}
                onClick={() =>
                  addToCart(product.id, selectedColor, selectedSize, quantity)
                }
                className="flex-1 py-3.5 px-6 rounded-lg bg-[#111113] hover:bg-zinc-800 disabled:bg-zinc-300 text-white text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {effectiveStock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={
                  isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'
                }
                className={`px-4 py-3.5 rounded-lg border transition-colors flex items-center justify-center cursor-pointer ${
                  isWishlisted
                    ? 'bg-red-50 border-[#E1381C] text-[#E1381C]'
                    : 'border-zinc-300 text-zinc-700 hover:border-[#111113]'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
                />
              </button>
            </div>

            <button
              type="button"
              disabled={effectiveStock === 0}
              onClick={() => {
                onBuyNow({
                  productId: product.id,
                  color: selectedColor,
                  size: selectedSize,
                  quantity,
                });
                navigate('/checkout');
              }}
              className="w-full py-3.5 px-6 rounded-lg bg-[#E1381C] hover:bg-[#c82d13] disabled:bg-zinc-200 text-white text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>BUY NOW · EXPRESS CHECKOUT</span>
            </button>
          </div>

          {/* 5. DESCRIPTION & TECHNICAL SPECIFICATIONS */}
          <div className="pt-5 border-t border-zinc-200 space-y-4 text-xs">
            <div>
              <h2 className="font-semibold text-[#111113] mb-1.5">
                Performance Overview
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-[#F9F9F8] border border-zinc-200/70">
                <p className="text-zinc-500">Weight</p>
                <p className="font-mono-num font-semibold text-[#111113] mt-0.5">
                  {product.weight}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#F9F9F8] border border-zinc-200/70">
                <p className="text-zinc-500">Heel-to-Toe Drop</p>
                <p className="font-mono-num font-semibold text-[#111113] mt-0.5">
                  {product.drop}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#F9F9F8] border border-zinc-200/70">
                <p className="text-zinc-500">Primary Sport</p>
                <p className="font-semibold text-[#111113] mt-0.5">
                  {product.sport}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#F9F9F8] border border-zinc-200/70">
                <p className="text-zinc-500">Technology Stack</p>
                <p className="font-semibold text-[#E1381C] mt-0.5">
                  {product.technology.join(' · ')}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#111113] mb-1.5">
                Materials & Construction
              </h3>
              <ul className="list-disc list-inside text-zinc-600 space-y-1">
                {product.materials.map((mat) => (
                  <li key={mat}>{mat}</li>
                ))}
              </ul>
            </div>

            {/* Malaysia Shipping Guarantees */}
            <div className="pt-3 border-t border-zinc-100 space-y-2 text-zinc-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#E1381C] shrink-0" />
                <span>
                  {product.price > 200
                    ? 'Eligible for FREE Standard Shipping across Malaysia'
                    : 'RM8 Standard Delivery (Free on orders over RM200)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#E1381C] shrink-0" />
                <span>30-Day Fit Guarantee & Free Size Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#E1381C] shrink-0" />
                <span>100% Authentic VOLTERRA Direct Manufacturing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Breakdown for this Product */}
      <section className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-10">
        <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
          INSIDE THE {product.name.toUpperCase()}
        </p>
        <h2 className="font-display text-2xl font-bold text-[#111113] mt-1 mb-6">
          INTEGRATED VOLTERRA TECHNOLOGIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.technology.map((techName) => {
            const detail =
              VOLTERRA_TECHNOLOGIES.find((t) => t.name === techName) ||
              VOLTERRA_TECHNOLOGIES[0];
            return (
              <div
                key={techName}
                className="p-5 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-[#111113]">
                    {detail.name}
                  </h3>
                  <span className="font-mono-num text-xs font-semibold text-[#E1381C]">
                    {detail.metric}
                  </span>
                </div>
                <p className="text-xs font-semibold text-zinc-700">
                  {detail.tagline}
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {detail.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section
        id="reviews-section"
        className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-10 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
              ATHLETE FEEDBACK
            </p>
            <h2 className="font-display text-2xl font-bold text-[#111113] mt-1">
              CUSTOMER REVIEWS ({product.reviewCount})
            </h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-600">
              <span className="font-mono-num text-lg font-bold text-[#111113] flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)} / 5.0
              </span>
              <span>·</span>
              <span>Consensus Fit: True to Size</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewForm((prev) => !prev)}
            className="px-5 py-2.5 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
          >
            {showReviewForm ? 'CANCEL REVIEW' : 'WRITE A REVIEW'}
          </button>
        </div>

        {/* Write a Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-[#F9F9F8] p-6 rounded-xl border border-zinc-200 space-y-4 text-xs"
          >
            <h3 className="font-display text-base font-bold text-[#111113]">
              Submit Your Review for {product.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#111113] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={revAuthor}
                  onChange={(e) => setRevAuthor(e.target.value)}
                  placeholder="e.g. Hafiz Razak"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111113] mb-1">
                  Rating (1–5) *
                </label>
                <select
                  value={revRating}
                  onChange={(e) => setRevRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 font-mono-num"
                >
                  <option value={5}>5 Stars — Exceptional</option>
                  <option value={4}>4 Stars — Very Good</option>
                  <option value={3}>3 Stars — Solid</option>
                  <option value={2}>2 Stars — Subpar</option>
                  <option value={1}>1 Star — Poor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#111113] mb-1">
                  Size Purchased *
                </label>
                <select
                  value={revSize}
                  onChange={(e) => setRevSize(e.target.value as EUSize)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 font-mono-num"
                >
                  {ALL_EU_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#111113] mb-1">
                  Review Title *
                </label>
                <input
                  type="text"
                  required
                  value={revTitle}
                  onChange={(e) => setRevTitle(e.target.value)}
                  placeholder="Summarize your performance experience"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111113] mb-1">
                  How Did It Fit? *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Small', 'True to Size', 'Large'] as FitFeedback[]).map(
                    (f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setRevFit(f)}
                        className={`py-2 px-3 rounded-lg border font-semibold transition-colors cursor-pointer ${
                          revFit === f
                            ? 'bg-[#111113] text-white border-[#111113]'
                            : 'bg-white text-zinc-700 border-zinc-300'
                        }`}
                      >
                        {f}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#111113] mb-1">
                Review Text *
              </label>
              <textarea
                rows={3}
                required
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                placeholder="Share how the cushioning, grip, and fit performed during your workouts..."
                className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#E1381C] hover:bg-[#c82d13] text-white font-semibold cursor-pointer"
              >
                SUBMIT REVIEW
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {productReviews.length > 0 ? (
            productReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-mono-num text-zinc-400">{rev.date}</span>
                </div>
                <h3 className="text-sm font-bold text-[#111113]">{rev.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{rev.comment}</p>
                <div className="pt-2 border-t border-zinc-200/60 flex flex-wrap items-center justify-between gap-2 text-zinc-500">
                  <span className="font-semibold text-[#111113] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {rev.authorName}
                  </span>
                  <span>
                    Size: {rev.sizePurchased} · Fit:{' '}
                    <strong className="text-zinc-800">{rev.fit}</strong>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 p-6 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 text-center space-y-2">
              <p className="text-sm font-semibold text-[#111113]">
                Verified Athlete Rating: {product.rating.toFixed(1)} / 5.0 ({product.reviewCount} ratings)
              </p>
              <p className="text-xs text-zinc-500">
                Be the first to write a detailed field test review for the {product.name}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* YOU MAY ALSO LIKE (Recommendations - Strictly VOLTERRA) */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
            MATCHING PERFORMANCE ROTATION
          </p>
          <h2 className="font-display text-2xl font-bold text-[#111113] mt-1">
            YOU MAY ALSO LIKE
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {recommendedProducts.map((rec) => (
            <ProductCard key={rec.id} product={rec} />
          ))}
        </div>
      </section>

      {/* RECENTLY VIEWED */}
      {recentProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-zinc-200/80">
          <div>
            <p className="text-xs font-semibold tracking-widest text-zinc-500">
              YOUR BROWSING HISTORY
            </p>
            <h2 className="font-display text-2xl font-bold text-[#111113] mt-1">
              RECENTLY VIEWED
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {recentProducts.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
