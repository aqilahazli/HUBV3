import React, { useState, useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  Search,
  X,
  RotateCcw,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import {
  ProductCategory,
  GenderType,
  EUSize,
  ShoeColorName,
} from '../types';
import {
  ALL_EU_SIZES,
  ALL_COLORS,
  CATEGORY_SUBCATEGORIES,
} from '../data/volterraData';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  presetCategory?: ProductCategory;
  presetMode?: 'all' | 'new-arrivals' | 'sale';
}

type PriceBracket =
  | 'all'
  | 'below-200'
  | '200-299'
  | '300-399'
  | '400-499'
  | '500-plus';

type AvailabilityFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

type SortOption =
  | 'featured'
  | 'newest'
  | 'best-selling'
  | 'price-asc'
  | 'price-desc'
  | 'highest-rated'
  | 'biggest-discount';

export const ShopPage: React.FC<ShopPageProps> = ({
  presetCategory,
  presetMode = 'all',
}) => {
  const { products } = useStore();
  const { searchQuery, setGlobalSearch } = useRouter();

  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(
    presetCategory ? [presetCategory] : []
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedGenders, setSelectedGenders] = useState<GenderType[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<EUSize[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<PriceBracket>('all');
  const [selectedColors, setSelectedColors] = useState<ShoeColorName[]>([]);
  const [selectedAvailability, setSelectedAvailability] =
    useState<AvailabilityFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>(
    presetMode === 'sale'
      ? 'biggest-discount'
      : presetMode === 'new-arrivals'
      ? 'newest'
      : 'featured'
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);

  // Sync presetCategory or presetMode when route changes
  useEffect(() => {
    setIsLoadingSkeleton(true);
    const timer = setTimeout(() => setIsLoadingSkeleton(false), 180);
    if (presetCategory) {
      setSelectedCategories([presetCategory]);
    } else {
      setSelectedCategories([]);
    }
    setSelectedSubcategory('all');
    if (presetMode === 'sale') {
      setSortBy('biggest-discount');
    } else if (presetMode === 'new-arrivals') {
      setSortBy('newest');
    } else {
      setSortBy('featured');
    }
    return () => clearTimeout(timer);
  }, [presetCategory, presetMode]);

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setSelectedSubcategory('all');
  };

  const toggleGender = (g: GenderType) => {
    setSelectedGenders((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const toggleSize = (sz: EUSize) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((x) => x !== sz) : [...prev, sz]
    );
  };

  const toggleColor = (col: ShoeColorName) => {
    setSelectedColors((prev) =>
      prev.includes(col) ? prev.filter((x) => x !== col) : [...prev, col]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories(presetCategory ? [presetCategory] : []);
    setSelectedSubcategory('all');
    setSelectedGenders([]);
    setSelectedSizes([]);
    setSelectedPrice('all');
    setSelectedColors([]);
    setSelectedAvailability('all');
    setGlobalSearch('');
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Preset mode filter
        if (presetMode === 'new-arrivals' && !product.newArrival) return false;
        if (presetMode === 'sale' && product.discount <= 0) return false;

        // Search query filter (name, category, subcategory, sport, color, code/SKU)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchCat = product.category.toLowerCase().includes(q);
          const matchSub = product.subcategory.toLowerCase().includes(q);
          const matchSport = product.sport.toLowerCase().includes(q);
          const matchSku = product.sku.toLowerCase().includes(q);
          const matchId = product.id.toLowerCase().includes(q);
          const matchColor = product.colors.some((c) =>
            c.name.toLowerCase().includes(q)
          );
          if (
            !matchName &&
            !matchCat &&
            !matchSub &&
            !matchSport &&
            !matchSku &&
            !matchId &&
            !matchColor
          ) {
            return false;
          }
        }

        // Category filter
        if (
          selectedCategories.length > 0 &&
          !selectedCategories.includes(product.category)
        ) {
          return false;
        }

        // Subcategory filter
        if (
          selectedSubcategory !== 'all' &&
          product.subcategory !== selectedSubcategory
        ) {
          return false;
        }

        // Gender filter
        if (
          selectedGenders.length > 0 &&
          !selectedGenders.includes(product.gender)
        ) {
          return false;
        }

        // Size filter (must have size with stock > 0, or if checking out of stock)
        if (selectedSizes.length > 0) {
          const hasMatchingSize = product.sizes.some(
            (s) => selectedSizes.includes(s.size) && s.stock > 0
          );
          if (!hasMatchingSize) return false;
        }

        // Price filter
        if (selectedPrice !== 'all') {
          const p = product.price;
          if (selectedPrice === 'below-200' && p >= 200) return false;
          if (selectedPrice === '200-299' && (p < 200 || p > 299)) return false;
          if (selectedPrice === '300-399' && (p < 300 || p > 399)) return false;
          if (selectedPrice === '400-499' && (p < 400 || p > 499)) return false;
          if (selectedPrice === '500-plus' && p < 500) return false;
        }

        // Colour filter
        if (selectedColors.length > 0) {
          const hasColor = product.colors.some((c) =>
            selectedColors.includes(c.name)
          );
          if (!hasColor) return false;
        }

        // Availability filter
        if (selectedAvailability !== 'all') {
          const hasLowStockSize = product.sizes.some(
            (s) => s.stock > 0 && s.stock <= 5
          );
          const hasOutOfStockSize = product.sizes.some((s) => s.stock === 0);
          if (selectedAvailability === 'in-stock' && product.stock <= 5) {
            return false;
          }
          if (
            selectedAvailability === 'low-stock' &&
            product.stock > 25 &&
            !hasLowStockSize
          ) {
            return false;
          }
          if (
            selectedAvailability === 'out-of-stock' &&
            product.stock > 0 &&
            !hasOutOfStockSize
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'featured':
            return Number(b.featured) - Number(a.featured) || b.salesCount - a.salesCount;
          case 'newest':
            return Number(b.newArrival) - Number(a.newArrival) || b.id.localeCompare(a.id);
          case 'best-selling':
            return b.salesCount - a.salesCount;
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'highest-rated':
            return b.rating - a.rating || b.reviewCount - a.reviewCount;
          case 'biggest-discount':
            return b.discount - a.discount || a.price - b.price;
          default:
            return 0;
        }
      });
  }, [
    products,
    presetMode,
    searchQuery,
    selectedCategories,
    selectedSubcategory,
    selectedGenders,
    selectedSizes,
    selectedPrice,
    selectedColors,
    selectedAvailability,
    sortBy,
  ]);

  const activeFilterCount =
    (presetCategory ? 0 : selectedCategories.length) +
    (selectedSubcategory !== 'all' ? 1 : 0) +
    selectedGenders.length +
    selectedSizes.length +
    (selectedPrice !== 'all' ? 1 : 0) +
    selectedColors.length +
    (selectedAvailability !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const pageTitle = presetCategory
    ? `VOLTERRA ${presetCategory.toUpperCase()}`
    : presetMode === 'new-arrivals'
    ? 'NEW ARRIVALS'
    : presetMode === 'sale'
    ? 'VOLTERRA PERFORMANCE SALE'
    : 'ALL VOLTERRA FOOTWEAR';

  const pageDescription = presetCategory
    ? `Official VOLTERRA ${presetCategory} shoes engineered for grip, energy return, and lockdown.`
    : presetMode === 'new-arrivals'
    ? 'Latest biomechanics releases from the VOLTERRA performance footwear lab.'
    : presetMode === 'sale'
    ? 'Exclusive direct-to-consumer markdowns on selected VOLTERRA performance footwear.'
    : 'Explore the complete 100% single-brand VOLTERRA athletic footwear collection.';

  // Available subcategories if a single category is selected
  const activeSingleCategory =
    selectedCategories.length === 1 ? selectedCategories[0] : undefined;
  const availableSubcategories = activeSingleCategory
    ? CATEGORY_SUBCATEGORIES[activeSingleCategory]
    : [];

  const FilterPanelContent = () => (
    <div className="space-y-6 text-xs">
      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full py-2 px-3 rounded-lg bg-zinc-100 hover:bg-[#111113] hover:text-white text-zinc-800 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters ({activeFilterCount})</span>
        </button>
      )}

      {/* 1. Category Filter */}
      <div>
        <h3 className="font-semibold text-[#111113] mb-2.5">Category</h3>
        <div className="space-y-1.5">
          {(
            [
              'Running',
              'Training',
              'Basketball',
              'Football',
              'Outdoor',
              'Lifestyle',
            ] as ProductCategory[]
          ).map((cat) => {
            const checked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center justify-between py-1 cursor-pointer text-zinc-700 hover:text-[#111113]"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(cat)}
                    className="rounded border-zinc-300 text-[#111113] focus:ring-[#E1381C]"
                  />
                  <span className={checked ? 'font-semibold text-[#111113]' : ''}>
                    {cat}
                  </span>
                </span>
                <span className="font-mono-num text-zinc-400">
                  {products.filter((p) => p.category === cat).length}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Subcategory Quick Filter when 1 Category is active */}
      {availableSubcategories.length > 0 && (
        <div className="pt-4 border-t border-zinc-200/80">
          <h3 className="font-semibold text-[#111113] mb-2.5">
            {activeSingleCategory} Discipline
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedSubcategory('all')}
              className={`px-2.5 py-1 rounded border text-xs transition-colors ${
                selectedSubcategory === 'all'
                  ? 'bg-[#111113] text-white border-[#111113]'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900'
              }`}
            >
              All
            </button>
            {availableSubcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-2.5 py-1 rounded border text-xs transition-colors ${
                  selectedSubcategory === sub
                    ? 'bg-[#111113] text-white border-[#111113]'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Gender Filter */}
      <div className="pt-4 border-t border-zinc-200/80">
        <h3 className="font-semibold text-[#111113] mb-2.5">Gender</h3>
        <div className="space-y-1.5">
          {(['Men', 'Women', 'Unisex'] as GenderType[]).map((g) => {
            const checked = selectedGenders.includes(g);
            return (
              <label
                key={g}
                className="flex items-center gap-2 py-1 cursor-pointer text-zinc-700 hover:text-[#111113]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleGender(g)}
                  className="rounded border-zinc-300 text-[#111113]"
                />
                <span className={checked ? 'font-semibold text-[#111113]' : ''}>
                  {g}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Size Filter (EU 36 - EU 46) */}
      <div className="pt-4 border-t border-zinc-200/80">
        <h3 className="font-semibold text-[#111113] mb-2.5">Size (EU)</h3>
        <div className="grid grid-cols-3 gap-1.5 font-mono-num">
          {ALL_EU_SIZES.map((sz) => {
            const active = selectedSizes.includes(sz);
            return (
              <button
                key={sz}
                type="button"
                onClick={() => toggleSize(sz)}
                className={`py-1.5 px-2 rounded border text-center transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#111113] text-white border-[#111113] font-semibold'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Filter (MYR / RM) */}
      <div className="pt-4 border-t border-zinc-200/80">
        <h3 className="font-semibold text-[#111113] mb-2.5">Price (RM)</h3>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Prices' },
            { id: 'below-200', label: 'Below RM200' },
            { id: '200-299', label: 'RM200–RM299' },
            { id: '300-399', label: 'RM300–RM399' },
            { id: '400-499', label: 'RM400–RM499' },
            { id: '500-plus', label: 'RM500+' },
          ].map((bracket) => (
            <label
              key={bracket.id}
              className="flex items-center gap-2 py-1 cursor-pointer text-zinc-700 hover:text-[#111113]"
            >
              <input
                type="radio"
                name="price-bracket"
                checked={selectedPrice === bracket.id}
                onChange={() => setSelectedPrice(bracket.id as PriceBracket)}
                className="text-[#111113]"
              />
              <span
                className={
                  selectedPrice === bracket.id
                    ? 'font-semibold text-[#111113]'
                    : ''
                }
              >
                {bracket.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Colour Filter */}
      <div className="pt-4 border-t border-zinc-200/80">
        <h3 className="font-semibold text-[#111113] mb-2.5">Colour</h3>
        <div className="grid grid-cols-2 gap-2">
          {ALL_COLORS.map((col) => {
            const active = selectedColors.includes(col.name);
            return (
              <button
                key={col.name}
                type="button"
                onClick={() => toggleColor(col.name)}
                className={`flex items-center gap-2 p-1.5 rounded border text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-[#111113] bg-zinc-100 font-semibold text-[#111113]'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-zinc-300 shrink-0"
                  style={{ backgroundColor: col.hex }}
                />
                <span className="truncate">{col.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Availability Filter */}
      <div className="pt-4 border-t border-zinc-200/80">
        <h3 className="font-semibold text-[#111113] mb-2.5">Availability</h3>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Stock Status' },
            { id: 'in-stock', label: 'In Stock' },
            { id: 'low-stock', label: 'Low Stock' },
            { id: 'out-of-stock', label: 'Out of Stock (Sizes)' },
          ].map((av) => (
            <label
              key={av.id}
              className="flex items-center gap-2 py-1 cursor-pointer text-zinc-700 hover:text-[#111113]"
            >
              <input
                type="radio"
                name="availability-filter"
                checked={selectedAvailability === av.id}
                onChange={() =>
                  setSelectedAvailability(av.id as AvailabilityFilter)
                }
                className="text-[#111113]"
              />
              <span
                className={
                  selectedAvailability === av.id
                    ? 'font-semibold text-[#111113]'
                    : ''
                }
              >
                {av.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      {/* Page Header Banner */}
      <div className="pb-8 border-b border-zinc-200/80 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
            VOLTERRA OFFICIAL CATALOG
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#111113] mt-1">
            {pageTitle}
          </h1>
          <p className="text-sm text-zinc-600 mt-1 max-w-2xl">
            {pageDescription}
          </p>
        </div>

        {/* Inline Dynamic Search Input + Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search name, sport, colour, SKU..."
              aria-label="Search VOLTERRA products"
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-[#111113] focus:outline-none focus:border-[#111113]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setGlobalSearch('')}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-lg bg-white border border-zinc-300 text-xs font-semibold text-[#111113] flex items-center gap-1.5 whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>

            <label htmlFor="shop-sort-select" className="sr-only">
              Sort products
            </label>
            <select
              id="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3.5 py-2 rounded-lg bg-white border border-zinc-300 text-xs font-semibold text-[#111113] focus:outline-none focus:border-[#111113]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="newest">Sort: Newest</option>
              <option value="best-selling">Sort: Best Selling (Popular)</option>
              <option value="price-asc">Sort: Price Low to High</option>
              <option value="price-desc">Sort: Price High to Low</option>
              <option value="highest-rated">Sort: Highest Rated</option>
              <option value="biggest-discount">Sort: Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Desktop Sidebar + Product Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-xl border border-zinc-200/80 self-start sticky top-20">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
            <span className="font-display text-sm font-bold text-[#111113]">
              FILTER BY
            </span>
            <span className="font-mono-num text-xs text-zinc-500">
              {filteredProducts.length} Shoes
            </span>
          </div>
          <FilterPanelContent />
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9">
          {/* Active Filter Summary Bar */}
          {activeFilterCount > 0 && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-3 rounded-lg border border-zinc-200/80 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-zinc-600">
                <span className="font-semibold text-[#111113]">
                  Showing {filteredProducts.length} of {products.length} VOLTERRA models
                </span>
                {searchQuery && (
                  <span>· Search: &ldquo;{searchQuery}&rdquo;</span>
                )}
                {selectedCategories.length > 0 && (
                  <span>· Category: {selectedCategories.join(', ')}</span>
                )}
                {selectedSizes.length > 0 && (
                  <span>· Size: {selectedSizes.join(', ')}</span>
                )}
                {selectedColors.length > 0 && (
                  <span>· Colour: {selectedColors.join(', ')}</span>
                )}
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[#E1381C] font-semibold hover:underline whitespace-nowrap"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Skeleton Loading State vs Empty State vs Product Grid (Desktop 4 cols, Tablet 3 cols, Mobile 2 cols) */}
          {isLoadingSkeleton ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-zinc-200/80 rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-zinc-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-zinc-200 rounded w-1/2" />
                    <div className="h-4 bg-zinc-200 rounded w-3/4" />
                    <div className="h-3 bg-zinc-200 rounded w-1/3" />
                    <div className="h-8 bg-zinc-200 rounded w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-zinc-200/80 p-12 text-center space-y-4">
              <h2 className="font-display text-2xl font-bold text-[#111113]">
                No products found
              </h2>
              <p className="text-sm text-zinc-600 max-w-md mx-auto">
                No VOLTERRA footwear matched your active search or filter combination. Try broadening your price range, clearing selected sizes, or searching for another sport category.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200">
                <span className="font-display text-base font-bold text-[#111113]">
                  FILTER SHOES ({filteredProducts.length})
                </span>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="Close filters"
                  className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanelContent />
            </div>

            <div className="pt-6 border-t border-zinc-200 mt-6">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-lg bg-[#111113] text-white text-xs font-semibold"
              >
                SHOW {filteredProducts.length} RESULTS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
