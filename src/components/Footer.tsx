import React, { useState } from 'react';
import { Instagram, Youtube, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { Link } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { addToast, setIsSizeGuideOpen } = useStore();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Invalid email', 'Please enter a valid email address.', 'error');
      return;
    }
    addToast(
      'Subscribed to VOLTERRA',
      `You're on the list (${email.trim()}). Stay Ahead. Stay Moving.`,
      'success'
    );
    setEmail('');
  };

  return (
    <footer className="bg-[#111113] text-zinc-300 border-t border-zinc-800">
      {/* Newsletter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 border-b border-zinc-800/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#E1381C] mb-1">
              VOLTERRA PERFORMANCE CLUB
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Stay Ahead. Stay Moving.
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Receive early access to new VOLTERRA engineering drops, marathon training notes, and exclusive athlete releases in Malaysia.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto lg:min-w-[420px]"
          >
            <label htmlFor="footer-newsletter-email" className="sr-only">
              Enter your email
            </label>
            <input
              id="footer-newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E1381C]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#E1381C] hover:bg-[#c82d13] text-white text-xs font-semibold tracking-wider transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>SUBSCRIBE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link
            to="/"
            className="font-display text-2xl font-extrabold tracking-tight text-white inline-block"
          >
            VOLTERRA
          </Link>
          <p className="text-xs font-semibold tracking-widest text-zinc-400">
            MOVE. PERFORM. GO BEYOND.
          </p>
          <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
            Official single-brand direct-to-consumer store for VOLTERRA performance sports footwear. Engineered around biomechanics, propulsion, and all-climate durability.
          </p>

          {/* Social Links */}
          <div className="pt-2 flex items-center gap-3">
            {[
              { label: 'Instagram', Icon: Instagram },
              { label: 'YouTube', Icon: Youtube },
              { label: 'Twitter', Icon: Twitter },
              { label: 'Facebook', Icon: Facebook },
            ].map(({ label, Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() =>
                  addToast(`VOLTERRA ${label}`, `Following @VOLTERRASPORT official channel.`, 'info')
                }
                aria-label={`VOLTERRA on ${label}`}
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* SHOP Column */}
        <div>
          <h3 className="text-xs font-semibold tracking-wider text-white mb-4">
            SHOP
          </h3>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li>
              <Link to="/category/running" className="hover:text-white transition-colors">
                Running
              </Link>
            </li>
            <li>
              <Link to="/category/training" className="hover:text-white transition-colors">
                Training
              </Link>
            </li>
            <li>
              <Link to="/category/basketball" className="hover:text-white transition-colors">
                Basketball
              </Link>
            </li>
            <li>
              <Link to="/category/football" className="hover:text-white transition-colors">
                Football
              </Link>
            </li>
            <li>
              <Link to="/category/outdoor" className="hover:text-white transition-colors">
                Outdoor
              </Link>
            </li>
            <li>
              <Link to="/category/lifestyle" className="hover:text-white transition-colors">
                Lifestyle
              </Link>
            </li>
            <li>
              <Link to="/new-arrivals" className="hover:text-white transition-colors">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/sale" className="text-[#E1381C] hover:underline">
                Sale
              </Link>
            </li>
          </ul>
        </div>

        {/* CUSTOMER SERVICE Column */}
        <div>
          <h3 className="text-xs font-semibold tracking-wider text-white mb-4">
            CUSTOMER SERVICE
          </h3>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="hover:text-white transition-colors text-left"
              >
                Size Guide (Modal)
              </button>
            </li>
            <li>
              <Link to="/size-guide" className="hover:text-white transition-colors">
                Size & Fit Reference
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-white transition-colors">
                Shipping & Order Tracking
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white transition-colors">
                Returns & Exchanges
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* ABOUT VOLTERRA Column */}
        <div>
          <h3 className="text-xs font-semibold tracking-wider text-white mb-4">
            ABOUT VOLTERRA
          </h3>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-white transition-colors">
                Our Technology
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white transition-colors">
                Sustainability
              </Link>
            </li>
            <li className="pt-2 border-t border-zinc-800/80">
              <Link to="/admin" className="text-xs font-semibold text-zinc-300 hover:text-[#E1381C] transition-colors">
                Admin Dashboard →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© 2026 VOLTERRA Performance Footwear Malaysia. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Currency: MYR (RM)</span>
          <span aria-hidden="true">·</span>
          <span>Free Standard Shipping in Malaysia over RM200</span>
        </div>
      </div>
    </footer>
  );
};
