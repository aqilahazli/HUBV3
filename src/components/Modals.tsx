import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Ruler,
  ShoppingBag,
  ArrowRight,
  Star,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { ShoeColorName, EUSize } from '../types';
import { ShoeVisual } from './ShoeVisual';

export const SIZE_CHART_DATA = [
  { eu: 'EU 36', uk: '3.5', usMen: '4.5', usWomen: '6.0', cm: '22.5 cm' },
  { eu: 'EU 37', uk: '4.5', usMen: '5.5', usWomen: '7.0', cm: '23.5 cm' },
  { eu: 'EU 38', uk: '5.0', usMen: '6.0', usWomen: '7.5', cm: '24.0 cm' },
  { eu: 'EU 39', uk: '6.0', usMen: '7.0', usWomen: '8.5', cm: '25.0 cm' },
  { eu: 'EU 40', uk: '6.5', usMen: '7.5', usWomen: '9.0', cm: '25.5 cm' },
  { eu: 'EU 41', uk: '7.5', usMen: '8.5', usWomen: '10.0', cm: '26.5 cm' },
  { eu: 'EU 42', uk: '8.0', usMen: '9.0', usWomen: '10.5', cm: '27.0 cm' },
  { eu: 'EU 43', uk: '9.0', usMen: '10.0', usWomen: '11.5', cm: '28.0 cm' },
  { eu: 'EU 44', uk: '9.5', usMen: '10.5', usWomen: '12.0', cm: '28.5 cm' },
  { eu: 'EU 45', uk: '10.5', usMen: '11.5', usWomen: '13.0', cm: '29.5 cm' },
  { eu: 'EU 46', uk: '11.0', usMen: '12.0', usWomen: '13.5', cm: '30.0 cm' },
];

export const GlobalModalsAndToasts: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    isSizeGuideOpen,
    setIsSizeGuideOpen,
    addToCart,
    toasts,
    removeToast,
  } = useStore();
  const { navigate } = useRouter();

  const [selectedColor, setSelectedColor] = useState<ShoeColorName>('White');
  const [selectedSize, setSelectedSize] = useState<EUSize>('EU 42');

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors[0]?.name || 'White');
      const firstAvailable =
        quickViewProduct.sizes.find((s) => s.stock > 0)?.size || 'EU 42';
      setSelectedSize(firstAvailable);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
        setIsSizeGuideOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setQuickViewProduct, setIsSizeGuideOpen]);

  return (
    <>
      {/* Toast Notifications Stack */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-lg bg-[#111113] text-white shadow-xl border border-zinc-800"
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-[#E1381C] shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold tracking-wide">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              className="text-zinc-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-modal-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-zinc-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-2.5">
                <Ruler className="w-5 h-5 text-[#E1381C]" />
                <h2
                  id="size-guide-modal-title"
                  className="font-display text-xl font-bold text-[#111113]"
                >
                  VOLTERRA Official Size Guide
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                aria-label="Close Size Guide"
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-[#111113]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-6">
              <div className="bg-[#F9F9F8] p-4 rounded-lg border border-zinc-200/80 text-xs text-zinc-600 space-y-2">
                <p className="font-semibold text-[#111113]">
                  How to Measure Your Foot for VOLTERRA Footwear:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Place a sheet of paper flush against a wall on a hard flat floor.
                  </li>
                  <li>
                    Stand with your heel lightly touching the wall while wearing your normal sports socks.
                  </li>
                  <li>
                    Mark the tip of your longest toe and measure the distance in centimetres (cm).
                  </li>
                  <li>
                    For marathon racing or trail shoes, add 0.5 cm for natural foot expansion during long efforts.
                  </li>
                </ol>
              </div>

              <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#111113] text-white">
                      <th className="py-3 px-4 font-semibold">EU Size</th>
                      <th className="py-3 px-4 font-semibold">UK</th>
                      <th className="py-3 px-4 font-semibold">US (Men)</th>
                      <th className="py-3 px-4 font-semibold">US (Women)</th>
                      <th className="py-3 px-4 font-semibold">Foot Length (CM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 font-mono-num">
                    {SIZE_CHART_DATA.map((row) => (
                      <tr key={row.eu} className="hover:bg-zinc-50">
                        <td className="py-2.5 px-4 font-semibold text-[#111113]">
                          {row.eu}
                        </td>
                        <td className="py-2.5 px-4 text-zinc-600">{row.uk}</td>
                        <td className="py-2.5 px-4 text-zinc-600">{row.usMen}</td>
                        <td className="py-2.5 px-4 text-zinc-600">{row.usWomen}</td>
                        <td className="py-2.5 px-4 text-zinc-800 font-medium">
                          {row.cm}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-[#111113] text-white text-xs font-semibold hover:bg-[#E1381C] transition-colors"
                >
                  GOT IT, CLOSE GUIDE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-view-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close Quick View"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-[#111113]"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <ShoeVisual
                src={quickViewProduct.images.main}
                alt={quickViewProduct.name}
                color={selectedColor}
                aspectClass="aspect-[4/3]"
                showAngleTag
                className="rounded-lg border border-zinc-200/80"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                <span>Weight: {quickViewProduct.weight}</span>
                <span>Drop: {quickViewProduct.drop}</span>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-800">
                    {quickViewProduct.brand}
                  </span>
                  <span>·</span>
                  <span>{quickViewProduct.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-mono-num text-zinc-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {quickViewProduct.rating.toFixed(1)} ({quickViewProduct.reviewCount})
                  </span>
                </div>

                <h2
                  id="quick-view-title"
                  className="font-display text-xl font-bold text-[#111113] mt-1"
                >
                  {quickViewProduct.name}
                </h2>

                <div className="flex items-baseline gap-2.5 font-mono-num mt-2">
                  <span className="text-xl font-bold text-[#111113]">
                    RM{quickViewProduct.price}
                  </span>
                  {quickViewProduct.discount > 0 && (
                    <>
                      <span className="text-sm text-zinc-400 line-through">
                        RM{quickViewProduct.originalPrice}
                      </span>
                      <span className="text-xs font-semibold text-[#E1381C]">
                        {quickViewProduct.discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  {quickViewProduct.shortDescription}
                </p>

                {/* Colour Swatches */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-[#111113] mb-2">
                    Colour: <span className="text-zinc-600 font-normal">{selectedColor}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        aria-label={`Select colour ${c.name}`}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          selectedColor === c.name
                            ? 'border-[#E1381C] scale-110'
                            : 'border-zinc-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#111113]">
                      Select Size (EU)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs font-semibold text-[#E1381C] hover:underline"
                    >
                      SIZE GUIDE
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {quickViewProduct.sizes.map((sz) => {
                      const out = sz.stock === 0;
                      const isSel = selectedSize === sz.size;
                      return (
                        <button
                          key={sz.size}
                          type="button"
                          disabled={out}
                          onClick={() => setSelectedSize(sz.size)}
                          className={`py-1.5 px-2 text-xs font-mono-num rounded border transition-colors ${
                            out
                              ? 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through cursor-not-allowed'
                              : isSel
                              ? 'bg-[#111113] text-white border-[#111113] font-semibold'
                              : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-900'
                          }`}
                        >
                          {sz.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(quickViewProduct.id, selectedColor, selectedSize, 1);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#E1381C] hover:bg-[#c82d13] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = quickViewProduct.id;
                    setQuickViewProduct(null);
                    navigate(`/product/${id}`);
                  }}
                  className="py-2.5 px-4 rounded-lg border border-zinc-300 hover:border-[#111113] text-xs font-semibold text-[#111113] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>FULL SPECS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
