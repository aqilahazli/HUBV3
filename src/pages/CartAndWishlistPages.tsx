import React, { useState } from 'react';
import {
  Trash2,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  X,
} from 'lucide-react';
import { Link, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { ShoeVisual } from '../components/ShoeVisual';
import { ProductCard } from '../components/ProductCard';

export const CartPage: React.FC = () => {
  const {
    cart,
    products,
    wishlist,
    appliedPromo,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    applyPromoCode,
    removePromoCode,
  } = useStore();
  const { navigate } = useRouter();

  const [promoInput, setPromoInput] = useState('');

  const enrichedCart = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const subtotal = enrichedCart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = appliedPromo
    ? Number(((subtotal * appliedPromo.discountPercent) / 100).toFixed(2))
    : 0;

  const shippingFee = subtotal === 0 ? 0 : subtotal > 200 ? 0 : 8;
  const total = Number((subtotal - discountAmount + shippingFee).toFixed(2));
  const amountToFreeShipping = Math.max(0, 200 - subtotal);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    if (applyPromoCode(promoInput)) {
      setPromoInput('');
    }
  };

  if (enrichedCart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-500">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#111113]">
          Your shopping cart is empty
        </h1>
        <p className="text-sm text-zinc-600 max-w-md mx-auto">
          You haven&apos;t added any VOLTERRA footwear to your bag yet. Explore our road, trail, court, and training collections.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white text-xs font-semibold tracking-wider transition-colors"
          >
            <span>EXPLORE VOLTERRA SHOES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <div className="pb-6 border-b border-zinc-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
            VOLTERRA DIRECT BAG
          </p>
          <h1 className="font-display text-3xl font-extrabold text-[#111113] mt-1">
            SHOPPING CART
          </h1>
        </div>
        <Link
          to="/shop"
          className="text-xs font-semibold text-zinc-600 hover:text-[#111113]"
        >
          ← Continue Shopping
        </Link>
      </div>

      {/* Free Shipping Progress Notice */}
      <div className="mt-6 p-4 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#E1381C] shrink-0" />
          {subtotal > 200 ? (
            <span className="font-semibold text-emerald-700">
              FREE STANDARD SHIPPING UNLOCKED! Your order exceeds RM200.
            </span>
          ) : (
            <span className="text-zinc-700">
              Add <strong className="font-mono-num text-[#111113]">RM{amountToFreeShipping.toFixed(2)}</strong> more to unlock{' '}
              <strong className="text-[#111113]">FREE STANDARD SHIPPING</strong> across Malaysia.
            </span>
          )}
        </div>
        <span className="font-mono-num text-zinc-500 hidden sm:inline">
          Threshold: RM200.00
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {enrichedCart.map((item) => {
            const itemSubtotal = item.product.price * item.quantity;
            const isSaved = wishlist.includes(item.product.id);

            return (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="bg-white p-4 sm:p-5 rounded-xl border border-zinc-200/80 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className="w-full sm:w-32 shrink-0 rounded-lg overflow-hidden border border-zinc-200/60"
                >
                  <ShoeVisual
                    src={item.product.images.main}
                    alt={item.product.name}
                    color={item.color}
                    aspectClass="aspect-[4/3]"
                  />
                </Link>

                <div className="flex-1 min-w-0 space-y-1.5 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold">
                        {item.product.brand} · {item.product.category}
                      </p>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="font-display text-base sm:text-lg font-bold text-[#111113] hover:text-[#E1381C] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                    </div>
                    <p className="font-mono-num text-base font-bold text-[#111113]">
                      RM{itemSubtotal.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
                    <span>
                      Colour: <strong className="text-[#111113]">{item.color}</strong>
                    </span>
                    <span>·</span>
                    <span className="font-mono-num">
                      Size: <strong className="text-[#111113]">{item.size}</strong>
                    </span>
                    <span>·</span>
                    <span className="font-mono-num">
                      Unit Price: RM{item.product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Controls & Actions */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100">
                    <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            item.productId,
                            item.color,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        aria-label="Decrease quantity"
                        className="w-8 h-8 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-mono-num text-xs font-semibold text-[#111113]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            item.productId,
                            item.color,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        aria-label="Increase quantity"
                        className="w-8 h-8 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <button
                        type="button"
                        onClick={() => toggleWishlist(item.product.id)}
                        className={`inline-flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                          isSaved
                            ? 'text-[#E1381C]'
                            : 'text-zinc-500 hover:text-[#111113]'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`}
                        />
                        <span>{isSaved ? 'Saved' : 'Wishlist'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.productId, item.color, item.size)
                        }
                        className="inline-flex items-center gap-1 text-zinc-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Promo Code & Order Summary */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-6 lg:sticky lg:top-20">
          <h2 className="font-display text-lg font-bold text-[#111113] pb-3 border-b border-zinc-200">
            ORDER SUMMARY
          </h2>

          {/* Promo Code Input */}
          <div className="space-y-2.5">
            <label
              htmlFor="cart-promo-input"
              className="block text-xs font-semibold text-[#111113]"
            >
              Promo Code (Demo Data)
            </label>
            <form onSubmit={handlePromoSubmit} className="flex gap-2">
              <input
                id="cart-promo-input"
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter VOLT10, WELCOME15, SPORT20"
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 text-xs font-mono-num uppercase focus:outline-none focus:border-[#111113]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                APPLY
              </button>
            </form>

            {/* Quick-Click Demo Promo Codes */}
            <div className="pt-1">
              <p className="text-[11px] text-zinc-500 mb-1.5">
                Available Demo Promo Codes (click to apply):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { code: 'VOLT10', pct: '10%' },
                  { code: 'WELCOME15', pct: '15%' },
                  { code: 'SPORT20', pct: '20%' },
                ].map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => applyPromoCode(c.code)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono-num border transition-colors cursor-pointer ${
                      appliedPromo?.code === c.code
                        ? 'bg-[#E1381C] text-white border-[#E1381C] font-semibold'
                        : 'bg-[#F9F9F8] text-zinc-700 border-zinc-200 hover:border-zinc-900'
                    }`}
                  >
                    {c.code} ({c.pct})
                  </button>
                ))}
              </div>
            </div>

            {appliedPromo && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <span className="flex items-center gap-1.5 font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  {appliedPromo.code} ({appliedPromo.discountPercent}% OFF)
                </span>
                <button
                  type="button"
                  onClick={removePromoCode}
                  aria-label="Remove promo code"
                  className="text-emerald-700 hover:text-emerald-950"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Summary Breakdown */}
          <div className="space-y-3 pt-4 border-t border-zinc-200 text-xs">
            <div className="flex items-center justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-mono-num font-semibold text-[#111113]">
                RM{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-zinc-600">
              <span>Discount {appliedPromo ? `(${appliedPromo.code})` : ''}</span>
              <span className="font-mono-num font-semibold text-emerald-700">
                -RM{discountAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-zinc-600">
              <span>Standard Shipping (Malaysia)</span>
              <span className="font-mono-num font-semibold text-[#111113]">
                {shippingFee === 0 ? 'FREE' : `RM${shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="pt-3 border-t border-zinc-200 flex items-baseline justify-between">
              <span className="text-sm font-bold text-[#111113]">Total</span>
              <span className="font-mono-num text-xl font-bold text-[#111113]">
                RM{total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-6 rounded-lg bg-[#E1381C] hover:bg-[#c82d13] text-white text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const WishlistPage: React.FC = () => {
  const { wishlist, products } = useStore();

  const savedProducts = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (savedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-500">
          <Heart className="w-7 h-7" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#111113]">
          Your wishlist is empty
        </h1>
        <p className="text-sm text-zinc-600 max-w-md mx-auto">
          Save your favourite VOLTERRA road, trail, court, and training models here to compare specs and track availability.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white text-xs font-semibold tracking-wider transition-colors"
          >
            <span>EXPLORE SHOES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-zinc-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
            SAVED PERFORMANCE GEAR
          </p>
          <h1 className="font-display text-3xl font-extrabold text-[#111113] mt-1">
            MY WISHLIST ({savedProducts.length})
          </h1>
        </div>
        <Link
          to="/shop"
          className="text-xs font-semibold text-zinc-600 hover:text-[#111113]"
        >
          Explore More VOLTERRA Shoes →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {savedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
