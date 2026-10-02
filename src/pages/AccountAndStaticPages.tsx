import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ShieldCheck,
  Plus,
  Ruler,
  Mail,
  Phone,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { Link, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { EUSize, ProductCategory } from '../types';
import { ALL_EU_SIZES, MALAYSIA_STATES } from '../data/volterraData';
import { SIZE_CHART_DATA } from '../components/Modals';
import { ProductCard } from '../components/ProductCard';

export const LoginPage: React.FC = () => {
  const { loginUser, addToast } = useStore();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('aiman.hakim@demo.my');
  const [password, setPassword] = useState('demo123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Missing credentials', 'Please enter your email and password.', 'error');
      return;
    }
    const isAdmin = email.trim().toLowerCase() === 'admin@volterra.demo';
    loginUser(email, isAdmin ? 'admin' : 'customer');
    navigate(isAdmin ? '/admin' : '/account');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <p className="font-display text-xl font-extrabold text-[#111113]">
            VOLTERRA
          </p>
          <h1 className="font-display text-2xl font-bold text-[#111113]">
            SIGN IN TO YOUR ACCOUNT
          </h1>
          <p className="text-xs text-zinc-500">
            Access your orders, saved footwear, and athlete preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#111113] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@volterra.demo"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#111113]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#111113] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#111113]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white font-semibold tracking-wider transition-colors cursor-pointer"
          >
            SIGN IN
          </button>
        </form>

        {/* Demo Accounts Helper */}
        <div className="p-4 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 space-y-2.5 text-xs">
          <p className="font-semibold text-[#111113]">
            Quick Demo Access (Demo Environment Only):
          </p>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => {
                loginUser('aiman.hakim@demo.my', 'customer');
                navigate('/account');
              }}
              className="py-2 px-3 rounded-lg bg-white border border-zinc-300 hover:border-[#111113] text-left font-medium text-zinc-800 cursor-pointer"
            >
              Customer Demo: <span className="font-mono-num">aiman.hakim@demo.my</span>
            </button>
            <button
              type="button"
              onClick={() => {
                loginUser('admin@volterra.demo', 'admin');
                navigate('/admin');
              }}
              className="py-2 px-3 rounded-lg bg-zinc-900 text-white text-left font-medium hover:bg-[#E1381C] transition-colors cursor-pointer"
            >
              Admin Demo: <span className="font-mono-num">admin@volterra.demo / demo123</span>
            </button>
          </div>
          <p className="text-[11px] text-zinc-500">
            Note: Demo credentials are for testing only. Passwords are never stored in localStorage.
          </p>
        </div>

        <p className="text-center text-xs text-zinc-600">
          New to VOLTERRA?{' '}
          <Link to="/register" className="font-semibold text-[#E1381C] hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { registerUser, addToast } = useStore();
  const { navigate } = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      addToast('Incomplete form', 'Please fill in all required fields.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'Please verify your password confirmation.', 'error');
      return;
    }
    registerUser(name, email);
    navigate('/account');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <p className="font-display text-xl font-extrabold text-[#111113]">
            VOLTERRA
          </p>
          <h1 className="font-display text-2xl font-bold text-[#111113]">
            CREATE ATHLETE ACCOUNT
          </h1>
          <p className="text-xs text-zinc-500">
            Join the VOLTERRA community for faster checkout and order tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#111113] mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nurul Izzah"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#111113] mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@domain.my"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#111113] mb-1.5">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#111113] mb-1.5">
              Confirm Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#E1381C] hover:bg-[#c82d13] text-white font-semibold tracking-wider transition-colors cursor-pointer"
          >
            REGISTER ACCOUNT
          </button>
        </form>

        <p className="text-center text-xs text-zinc-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#111113] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    orders,
    wishlist,
    products,
    updateUserProfile,
    logoutUser,
  } = useStore();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'orders' | 'wishlist' | 'addresses' | 'preferences'
  >('profile');

  // New Address state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home 2');
  const [addrLine, setAddrLine] = useState('');
  const [addrPostcode, setAddrPostcode] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('Selangor');

  if (!currentUser) {
    return <LoginPage />;
  }

  const savedWishlistProducts = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine.trim() || !addrPostcode.trim() || !addrCity.trim()) return;
    const updatedAddresses = [
      ...currentUser.addresses,
      {
        id: `addr-${Date.now()}`,
        label: addrLabel,
        fullName: currentUser.name,
        phone: currentUser.phone,
        email: currentUser.email,
        address: addrLine.trim(),
        postcode: addrPostcode.trim(),
        city: addrCity.trim(),
        state: addrState,
      },
    ];
    updateUserProfile({ addresses: updatedAddresses });
    setAddrLine('');
    setAddrPostcode('');
    setAddrCity('');
    setShowAddAddress(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <div className="pb-6 border-b border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
            VOLTERRA MEMBER PORTAL
          </p>
          <h1 className="font-display text-3xl font-extrabold text-[#111113] mt-1">
            HELLO, {currentUser.name.toUpperCase()}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {currentUser.email} · Default Size: {currentUser.defaultShoeSize}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role === 'admin' && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg bg-[#111113] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#E1381C]" />
              <span>Admin Console</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            className="px-4 py-2 rounded-lg border border-zinc-300 hover:border-red-600 hover:text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 bg-white p-4 rounded-2xl border border-zinc-200/80 space-y-1">
          {[
            { id: 'profile', label: 'Profile', Icon: User },
            { id: 'orders', label: `Orders (${orders.length})`, Icon: Package },
            {
              id: 'wishlist',
              label: `Wishlist (${savedWishlistProducts.length})`,
              Icon: Heart,
            },
            {
              id: 'addresses',
              label: `Addresses (${currentUser.addresses.length})`,
              Icon: MapPin,
            },
            { id: 'preferences', label: 'Preferences', Icon: Settings },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === id
                  ? 'bg-[#111113] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </aside>

        {/* Main Content Panel */}
        <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80">
          {activeTab === 'profile' && (
            <div className="space-y-6 text-xs">
              <h2 className="font-display text-xl font-bold text-[#111113]">
                Profile Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#111113] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={currentUser.name}
                    onChange={(e) => updateUserProfile({ name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#111113] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={currentUser.phone}
                    onChange={(e) => updateUserProfile({ phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#111113] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-[#111113]">
                Order History
              </h2>
              {orders.slice(0, 8).map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <p className="font-mono-num font-bold text-[#111113]">
                      {ord.id} · <span className="text-[#E1381C]">{ord.status}</span>
                    </p>
                    <p className="text-zinc-600 mt-0.5">
                      {ord.items.map((i) => `${i.productName} (${i.size})`).join(', ')}
                    </p>
                    <p className="text-zinc-400 font-mono-num mt-0.5">
                      Date: {ord.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-num font-bold text-[#111113]">
                      RM{ord.total.toFixed(2)}
                    </span>
                    <Link
                      to={`/orders/${ord.id}`}
                      className="px-4 py-2 rounded-lg bg-[#111113] text-white font-semibold"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-[#111113]">
                Saved Wishlist
              </h2>
              {savedWishlistProducts.length === 0 ? (
                <p className="text-xs text-zinc-500">Your wishlist is empty.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {savedWishlistProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-[#111113]">
                  Saved Malaysia Addresses
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddAddress((prev) => !prev)}
                  className="px-3.5 py-2 rounded-lg bg-[#111113] text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-4 rounded-xl bg-[#F9F9F8] border border-zinc-200 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      placeholder="Address Label (e.g. Home / Gym)"
                      className="px-3 py-2 rounded border border-zinc-300 bg-white"
                    />
                    <input
                      type="text"
                      required
                      value={addrLine}
                      onChange={(e) => setAddrLine(e.target.value)}
                      placeholder="Street Address"
                      className="px-3 py-2 rounded border border-zinc-300 bg-white"
                    />
                    <input
                      type="text"
                      required
                      value={addrPostcode}
                      onChange={(e) => setAddrPostcode(e.target.value)}
                      placeholder="Postcode (e.g. 47500)"
                      className="px-3 py-2 rounded border border-zinc-300 bg-white font-mono-num"
                    />
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="City (e.g. Subang Jaya)"
                      className="px-3 py-2 rounded border border-zinc-300 bg-white"
                    />
                    <select
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="px-3 py-2 rounded border border-zinc-300 bg-white"
                    >
                      {MALAYSIA_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#E1381C] text-white font-semibold cursor-pointer"
                  >
                    Save Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.addresses.map((addr, idx) => (
                  <div
                    key={addr.id || idx}
                    className="p-4 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 space-y-1"
                  >
                    <p className="font-bold text-[#111113]">
                      {addr.label || `Address #${idx + 1}`}
                    </p>
                    <p className="text-zinc-700">{addr.fullName}</p>
                    <p className="text-zinc-600">{addr.phone}</p>
                    <p className="text-zinc-600">
                      {addr.address}, {addr.postcode} {addr.city}, {addr.state}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 text-xs">
              <h2 className="font-display text-xl font-bold text-[#111113]">
                Footwear & Sport Preferences
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#111113] mb-1.5">
                    Default Shoe Size (EU)
                  </label>
                  <select
                    value={currentUser.defaultShoeSize}
                    onChange={(e) =>
                      updateUserProfile({
                        defaultShoeSize: e.target.value as EUSize,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 font-mono-num"
                  >
                    {ALL_EU_SIZES.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#111113] mb-1.5">
                    Primary Discipline
                  </label>
                  <select
                    value={currentUser.preferredSport}
                    onChange={(e) =>
                      updateUserProfile({
                        preferredSport: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
                  >
                    {[
                      'Running',
                      'Training',
                      'Basketball',
                      'Football',
                      'Outdoor',
                      'Lifestyle',
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SizeGuidePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
          BIOMECHANICS FIT SYSTEM
        </p>
        <h1 className="font-display text-3xl font-extrabold text-[#111113] mt-1 flex items-center gap-2.5">
          <Ruler className="w-7 h-7 text-[#E1381C]" />
          <span>VOLTERRA SIZE GUIDE</span>
        </h1>
        <p className="text-sm text-zinc-600 mt-2">
          All VOLTERRA footwear is built on anatomical European (EU) lasts. Measure your foot in centimetres (cm) at the end of the day for the most accurate fit.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#111113] text-white">
              <th className="py-3.5 px-4 font-semibold">EU Size</th>
              <th className="py-3.5 px-4 font-semibold">UK</th>
              <th className="py-3.5 px-4 font-semibold">US (Men)</th>
              <th className="py-3.5 px-4 font-semibold">US (Women)</th>
              <th className="py-3.5 px-4 font-semibold">Foot Length (CM)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 font-mono-num">
            {SIZE_CHART_DATA.map((row) => (
              <tr key={row.eu} className="hover:bg-zinc-50">
                <td className="py-3 px-4 font-bold text-[#111113]">{row.eu}</td>
                <td className="py-3 px-4 text-zinc-600">{row.uk}</td>
                <td className="py-3 px-4 text-zinc-600">{row.usMen}</td>
                <td className="py-3 px-4 text-zinc-600">{row.usWomen}</td>
                <td className="py-3 px-4 text-zinc-800 font-semibold">{row.cm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { addToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(
      'Message received',
      'Our VOLTERRA Malaysia athlete support team will respond within 24 hours.',
      'success'
    );
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
            DIRECT ATHLETE SUPPORT
          </p>
          <h1 className="font-display text-3xl font-extrabold text-[#111113] mt-1">
            CONTACT VOLTERRA MALAYSIA
          </h1>
          <p className="text-sm text-zinc-600 mt-2">
            Have a question about marathon shoe sizing, bulk team orders, or Malaysia delivery? Reach out directly to our Kuala Lumpur team.
          </p>
        </div>

        <div className="space-y-4 text-xs text-zinc-700 bg-white p-6 rounded-2xl border border-zinc-200/80">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#E1381C] shrink-0" />
            <span>
              VOLTERRA Performance Lab HQ, Level 18, Menara Integra, Jalan Tun Razak, 50400 Kuala Lumpur, Malaysia
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-[#E1381C] shrink-0" />
            <span className="font-mono-num">+60 3-2181 9000 (Mon–Sat, 9am–6pm MYT)</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-[#E1381C] shrink-0" />
            <span>support@volterra.demo</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 space-y-4 text-xs"
      >
        <h2 className="font-display text-xl font-bold text-[#111113]">
          Send Us a Message
        </h2>
        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            How can we help? *
          </label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white font-semibold cursor-pointer"
        >
          SEND MESSAGE
        </button>
      </form>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number>(0);

  const faqs = [
    {
      q: 'Does this store sell other footwear brands besides VOLTERRA?',
      a: 'No. This is the official single-brand direct-to-consumer store exclusively for VOLTERRA performance sports footwear.',
    },
    {
      q: 'How much is shipping across Malaysia?',
      a: 'Standard Delivery (3–5 working days) is RM8, or FREE on all orders above RM200. Express Delivery (1–2 working days) is RM15 across Peninsular and East Malaysia.',
    },
    {
      q: 'What promo codes are available for demo testing?',
      a: 'You can apply VOLT10 (10% OFF), WELCOME15 (15% OFF), or SPORT20 (20% OFF) in the shopping cart or checkout.',
    },
    {
      q: 'What is your return and size exchange policy?',
      a: 'Every pair of VOLTERRA shoes comes with a 30-day performance trial and free size exchange within Malaysia.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
          CUSTOMER CARE & RETURNS
        </p>
        <h1 className="font-display text-3xl font-extrabold text-[#111113] mt-1 flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-[#E1381C]" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </h1>
      </div>

      <div className="space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.q}
              className="bg-white rounded-xl border border-zinc-200/80 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-[#111113] cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
