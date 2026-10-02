import React from 'react';
import { Heart, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Link } from '../context/RouterContext';
import { ShoeVisual } from './ShoeVisual';

interface ProductCardProps {
  product: Product;
  rankBadge?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, rankBadge }) => {
  const { wishlist, toggleWishlist, setQuickViewProduct } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  // Single primary badge per card (Zero-Pill / Anti-Badge-Spam rule)
  const badgeText =
    rankBadge !== undefined
      ? `#${rankBadge} BEST SELLER`
      : product.discount > 0
      ? 'SALE'
      : product.newArrival
      ? 'NEW'
      : product.bestSeller
      ? 'BEST SELLER'
      : null;

  return (
    <article className="group relative flex flex-col bg-white border border-zinc-200/80 rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Product Image Container */}
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block focus:outline-none">
          <ShoeVisual
            src={product.images.main}
            alt={`${product.name} - ${product.category}`}
            aspectClass="aspect-[4/3]"
            sku={product.sku}
          />
        </Link>

        {/* Single Clean Badge Top-Left */}
        {badgeText && (
          <span
            className={`absolute top-3 left-3 px-2 py-0.5 text-[11px] font-semibold tracking-wider rounded-xs pointer-events-none ${
              badgeText === 'SALE'
                ? 'bg-[#E1381C] text-white'
                : 'bg-[#111113] text-white'
            }`}
          >
            {badgeText}
          </span>
        )}

        {/* Wishlist Heart Button Top-Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-[#111113] ${
            isWishlisted
              ? 'bg-[#E1381C] text-white'
              : 'bg-white/90 text-zinc-700 hover:bg-[#111113] hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Action */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          aria-label={`Quick view ${product.name}`}
          className="
            absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded bg-white/95 text-[#111113]
            text-xs font-medium flex items-center gap-1.5 shadow-xs
            opacity-95 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100
            transition-opacity duration-150 hover:bg-[#111113] hover:text-white whitespace-nowrap
          "
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Clean Unboxed Metadata */}
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-zinc-800">{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{product.category}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 font-mono-num text-zinc-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-zinc-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.id}`}
            className="block text-base font-semibold text-[#111113] group-hover:text-[#E1381C] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Subcategory & Color count */}
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
            {product.subcategory} · {product.colors.length} Colours
          </p>
        </div>

        {/* Pricing & Action */}
        <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2 font-mono-num">
              <span className="text-base font-semibold text-[#111113]">
                RM{product.price}
              </span>
              {product.discount > 0 && product.originalPrice > product.price && (
                <span className="text-xs text-zinc-400 line-through">
                  RM{product.originalPrice}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="text-xs font-mono-num font-semibold text-[#E1381C]">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="w-full py-2 px-4 text-xs font-semibold text-center rounded bg-[#111113] text-white hover:bg-[#E1381C] transition-colors whitespace-nowrap"
          >
            VIEW PRODUCT
          </Link>
        </div>
      </div>
    </article>
  );
};
