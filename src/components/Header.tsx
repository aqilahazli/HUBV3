import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { Link, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { ShoeVisual } from './ShoeVisual';

export const Header: React.FC = () => {
  const { path, navigate, searchQuery, setGlobalSearch } = useRouter();
  const { cart, wishlist, products, currentUser } = useStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  }, [path]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setMoreMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dynamic live search results across name, category, sport, color, SKU
  const liveResults = localQuery.trim()
    ? products.filter((p) => {
        const q = localQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.sport.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.colors.some((c) => c.name.toLowerCase().includes(q))
        );
      })
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalSearch(localQuery.trim());
    setSearchOpen(false);
    navigate('/shop');
  };

  const primaryLinks = [
    { label: 'HOME', to: '/' },
    { label: 'SHOP', to: '/shop' },
    { label: 'RUNNING', to: '/category/running' },
    { label: 'TRAINING', to: '/category/training' },
    { label: 'NEW ARRIVALS', to: '/new-arrivals' },
    { label: 'SALE', to: '/sale' },
  ];

  const moreSportLinks = [
    { label: 'BASKETBALL', to: '/category/basketball' },
    { label: 'FOOTBALL', to: '/category/football' },
    { label: 'OUTDOOR', to: '/category/outdoor' },
    { label: 'LIFESTYLE', to: '/category/lifestyle' },
    { label: 'ADMIN CONSOLE', to: '/admin' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 flex items-center justify-between">
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <Link
          to="/"
          className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#111113] whitespace-nowrap shrink-0"
        >
          VOLTERRA
        </Link>

        {/* Zone 2: Primary Text Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wider text-zinc-600"
        >
          {primaryLinks.map((item) => {
            const isActive =
              item.to === '/' ? path === '/' : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                  isActive
                    ? 'text-[#111113] border-[#E1381C]'
                    : item.label === 'SALE'
                    ? 'text-[#E1381C] border-transparent hover:border-[#E1381C]'
                    : 'border-transparent hover:text-[#111113] hover:border-zinc-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Overflow Sports Dropdown (Basketball, Football, Outdoor, Lifestyle, Admin) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 py-1 text-xs font-semibold tracking-wider text-zinc-600 hover:text-[#111113] whitespace-nowrap shrink-0"
            >
              <span>SPORTS & MORE</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {moreMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg py-2 z-50">
                {moreSportLinks.map((sub) => (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    onClick={() => setMoreMenuOpen(false)}
                    className={`block px-4 py-2 text-xs font-semibold transition-colors ${
                      sub.to === '/admin'
                        ? 'text-[#E1381C] border-t border-zinc-100 mt-1 pt-2.5 hover:bg-zinc-50'
                        : 'text-zinc-700 hover:bg-zinc-50 hover:text-[#111113]'
                    }`}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Interactive Actions (Search, Wishlist, Cart, Account) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Search VOLTERRA products"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-zinc-700 hover:bg-zinc-100 hover:text-[#111113] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          <Link
            to="/wishlist"
            aria-label={`Wishlist (${wishlist.length} items)`}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-700 hover:bg-zinc-100 hover:text-[#111113] transition-colors"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-zinc-900 text-white font-mono-num text-[10px] font-semibold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label={`Shopping Cart (${totalCartItems} items)`}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center text-zinc-700 hover:bg-zinc-100 hover:text-[#111113] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartItems > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#E1381C] text-white font-mono-num text-[10px] font-semibold flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>

          <Link
            to={currentUser ? '/account' : '/login'}
            aria-label="User Account"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors whitespace-nowrap"
          >
            <User className="w-4 h-4" />
            <span>{currentUser ? currentUser.name.split(' ')[0] : 'Account'}</span>
          </Link>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-zinc-800 hover:bg-zinc-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Global Dynamic Search Drawer */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col items-center pt-16 px-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-200"
            >
              <Search className="w-5 h-5 text-zinc-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={localQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  setGlobalSearch(e.target.value);
                }}
                placeholder="Search VOLTERRA shoes by name, sport, category, colour, or code (e.g. AeroRun, Trail, Orange, vr001)..."
                className="w-full text-sm text-[#111113] placeholder:text-zinc-400 focus:outline-none"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalQuery('');
                    setGlobalSearch('');
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-900 whitespace-nowrap"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </form>

            <div className="max-h-[65vh] overflow-y-auto p-5">
              {!localQuery.trim() ? (
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-zinc-500">
                    Popular VOLTERRA Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'AeroRun',
                      'Carbon Racer',
                      'TrailForce',
                      'CourtRise',
                      'PowerTrain',
                      'Football Strike',
                      'Orange',
                      'Road Running',
                    ].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setLocalQuery(term);
                          setGlobalSearch(term);
                        }}
                        className="px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-900 hover:text-white text-xs font-medium text-zinc-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : liveResults.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-base font-semibold text-[#111113]">
                    No products found
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                    We couldn&apos;t find any VOLTERRA footwear matching &ldquo;{localQuery}&rdquo;. Try searching by category (Running, Training, Basketball, Football, Outdoor) or colour (Black, White, Orange, Green).
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLocalQuery('');
                        setGlobalSearch('');
                        setSearchOpen(false);
                        navigate('/shop');
                      }}
                      className="px-4 py-2 rounded bg-[#111113] text-white text-xs font-semibold hover:bg-[#E1381C] transition-colors"
                    >
                      BROWSE ALL VOLTERRA SHOES
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>
                      Showing {Math.min(6, liveResults.length)} of {liveResults.length} matching VOLTERRA models
                    </span>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="font-semibold text-[#E1381C] hover:underline flex items-center gap-1"
                    >
                      <span>View all results in Shop</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {liveResults.slice(0, 6).map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/product/${prod.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-200/80 hover:border-zinc-900 transition-colors"
                      >
                        <ShoeVisual
                          src={prod.images.main}
                          alt={prod.name}
                          aspectClass="aspect-square"
                          className="w-16 h-16 rounded shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-zinc-500">
                            {prod.brand} · {prod.category} · {prod.sku}
                          </p>
                          <p className="text-sm font-semibold text-[#111113] truncate">
                            {prod.name}
                          </p>
                          <p className="text-xs font-mono-num font-semibold text-[#E1381C] mt-0.5">
                            RM{prod.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <span className="font-display text-xl font-extrabold text-[#111113]">
                  VOLTERRA
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                  className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-5 flex flex-col space-y-1">
                {[
                  { label: 'HOME', to: '/' },
                  { label: 'SHOP ALL', to: '/shop' },
                  { label: 'RUNNING', to: '/category/running' },
                  { label: 'TRAINING', to: '/category/training' },
                  { label: 'BASKETBALL', to: '/category/basketball' },
                  { label: 'FOOTBALL', to: '/category/football' },
                  { label: 'OUTDOOR', to: '/category/outdoor' },
                  { label: 'LIFESTYLE', to: '/category/lifestyle' },
                  { label: 'NEW ARRIVALS', to: '/new-arrivals' },
                  { label: 'SALE', to: '/sale' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      link.label === 'SALE'
                        ? 'text-[#E1381C] hover:bg-red-50'
                        : 'text-zinc-800 hover:bg-zinc-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-zinc-200 space-y-2.5">
              <Link
                to={currentUser ? '/account' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-lg bg-[#111113] text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>{currentUser ? `Account (${currentUser.name.split(' ')[0]})` : 'Sign In / Register'}</span>
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-lg border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center"
              >
                Track Orders
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#E1381C]" />
                <span>Admin Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
